# Deployment Guide: JobEqual Platform

This guide provides step-by-step instructions for deploying the JobEqual platform to Google Cloud Platform (GCP).

The application is deployed as a single, standalone Next.js application in a Docker container.

---

### **Prerequisites**

1.  **Google Cloud Account & Project:** You need a Google Cloud account with a project created and billing enabled.
2.  **Google Cloud SDK (`gcloud`):** You must have the `gcloud` command-line tool installed and initialized on your local machine. [Official Installation Guide](https://cloud.google.com/sdk/docs/install).
3.  **Docker:** You need Docker Desktop installed and running on your local machine.
4.  **Google Secret Manager Setup:** You must create all the necessary secrets (e.g., `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`) in **Google Cloud Secret Manager**. The application is configured to fetch these secrets by name at startup.
5.  **IAM Permissions:** The service account used by your Cloud Run service must have the **"Secret Manager Secret Accessor"** IAM role to be able to read the secrets.
6.  **GitHub Repository Variables:** For the CI/CD workflow to run, you must set the following variables in your GitHub repository's settings under `Settings > Secrets and variables > Actions`:
    *   `GCP_PROJECT_ID`: Your Google Cloud project ID.
    *   `GCP_WIF_PROVIDER`: Your Workload Identity Provider path (e.g., `projects/123456/locations/global/workloadIdentityPools/my-pool/providers/my-provider`).
    *   `GCP_REGION`: The GCP region you are deploying to (e.g., `europe-west6`).

---

## **Deployment Process**

### **A. Initial Manual Deployment**

These steps describe how to do the first deployment from your local machine. Subsequent deployments will be handled automatically by the CI/CD workflow.

**1. Configure Google Cloud & Docker**
```bash
# Log in to gcloud
gcloud auth login

# Set your project
gcloud config set project [YOUR_PROJECT_ID]

# Configure Docker authentication
gcloud auth configure-docker [YOUR_GCP_REGION]-docker.pkg.dev
```

**2. Set up Artifact Registry**
```bash
# Enable the Artifact Registry API
gcloud services enable artifactregistry.googleapis.com

# Create a Docker repository
gcloud artifacts repositories create jobequal-repo \
  --repository-format=docker \
  --location=[YOUR_GCP_REGION] \
  --description="Docker repository for JobEqual"
```

**3. Build and Push the Docker Image**
```bash
# Build the image from the root of the project
docker build -t [YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal:latest .

# Push the image
docker push [YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal:latest
```

**4. Deploy to Cloud Run**
```bash
# Deploy the service.
# Note: We no longer pass secrets directly via --set-env-vars.
# The application will fetch them from Secret Manager automatically.
# We only need to provide the GCP_PROJECT_ID so the app knows where to look.
gcloud run deploy jobequal-service \
  --image=[YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal:latest \
  --platform=managed \
  --region=[YOUR_GCP_REGION] \
  --port=3000 \
  --allow-unauthenticated \
  --set-env-vars="GCP_PROJECT_ID=[YOUR_PROJECT_ID]"
```

### **B. Automated CI/CD Deployments**
The `.github/workflows/deploy-main-app.yml` file is configured to automatically handle deployments. When you push changes to the `main` branch, it will rebuild and redeploy the main application for you.
