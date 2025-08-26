# Google Cloud Platform (GCP) Setup for JobEqual Backend

This document provides the necessary `gcloud` commands to set up the Google Cloud environment for deploying the JobEqual backend service. These commands should be run by a project owner or someone with sufficient permissions.

## 0. Configuration

Before you begin, please fill in these values and export them as environment variables in your shell:

```bash
export PROJECT_ID=jobequal
export REGION=europe-west6
export REPO=containers              # Artifact Registry repo name
export IMAGE=je-api                 # The API image name
export GH_OWNER=JordanHope2
export GH_REPO=builder-swoosh-zone
export SA_NAME=github-actions
export GITHUB_SA=${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
```

## 1. Enable Required APIs

Run the following command once to enable all the necessary APIs for the project:

```bash
gcloud config set project ${PROJECT_ID}
gcloud services enable \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  serviceusage.googleapis.com
```

## 2. Create Artifact Registry Repository

Create a Docker repository in Artifact Registry to store your container images. The `|| true` is added to prevent an error if the repository already exists.

```bash
gcloud artifacts repositories create ${REPO} \
  --repository-format=docker \
  --location=${REGION} \
  --description="JobEqual containers" || true
```

## 3. Create and Configure Service Accounts

### 3.1 Create the GitHub Actions Service Account

This service account will be used by the GitHub Actions workflow to interact with Google Cloud.

```bash
gcloud iam service-accounts create ${SA_NAME} \
  --display-name="GitHub Actions"
```

### 3.2 Grant Roles to the GitHub Actions SA

Grant the service account the necessary permissions to submit builds to Cloud Build and push images to Artifact Registry.

```bash
# Allow the SA to edit Cloud Build builds
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${GITHUB_SA}" \
  --role="roles/cloudbuild.builds.editor"

# Allow the SA to write to Artifact Registry
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${GITHUB_SA}" \
  --role="roles/artifactregistry.writer"

# Allow the SA to use services (fixes potential bucket access issues)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${GITHUB_SA}" \
  --role="roles/serviceusage.serviceUsageConsumer"

# Allow the SA to deploy to Cloud Run
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${GITHUB_SA}" \
  --role="roles/run.admin"
```

### 3.3 Grant Cloud Build Worker SA Push Rights

The default Cloud Build service account also needs permission to push to Artifact Registry.

```bash
PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format='value(projectNumber)')
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/artifactregistry.writer"
```

## 4. (Optional) Create a Custom Staging Bucket

If your organization's policies block the default Cloud Build staging bucket, you can create one explicitly.

```bash
export STAGING_BUCKET=jobequal-cloudbuild-staging
gcloud storage buckets create gs://${STAGING_BUCKET} --location=${REGION} || true

# Allow both the GitHub SA and the Cloud Build SA to use the staging bucket
for SA in ${GITHUB_SA} ${CB_SA}; do
  gcloud storage buckets add-iam-policy-binding gs://${STAGING_BUCKET} \
    --member="serviceAccount:${SA}" \
    --role="roles/storage.objectAdmin"
done
```
If you create a custom staging bucket, you will need to add the `--gcs-source-staging-dir` and `--gcs-log-dir` flags to your `gcloud builds submit` command in the workflow.

## 5. Configure Workload Identity Federation

This setup allows GitHub Actions to authenticate to Google Cloud without using long-lived service account keys.

### 5.1 Create Workload Identity Pool and Provider

```bash
gcloud iam workload-identity-pools create gh-pool \
  --location=global \
  --display-name="GitHub OIDC"

gcloud iam workload-identity-pools providers create-oidc gh-provider \
  --location=global \
  --workload-identity-pool=gh-pool \
  --display-name="GitHub" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref"
```

### 5.2 Allow the GitHub Repo to Impersonate the Service Account

This command creates the trust relationship between your GitHub repository and the service account.

```bash
POOL_ID=$(gcloud iam workload-identity-pools describe gh-pool --location=global --format='value(name)')

gcloud iam service-accounts add-iam-policy-binding ${GITHUB_SA} \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GH_OWNER}/${GH_REPO}"
```

## 6. Create GitHub Secret

In your GitHub repository settings under **Settings > Secrets and variables > Actions**, add the following secret:

-   **Name:** `GCP_WIF_PROVIDER`
-   **Value:** The full resource name of the Workload Identity Provider you created in step 5.1. It will look like this:
    `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/gh-pool/providers/gh-provider`
    (Replace `PROJECT_NUMBER` with your actual GCP project number).

After completing these steps, the Google Cloud environment will be ready for the CI/CD workflow.
