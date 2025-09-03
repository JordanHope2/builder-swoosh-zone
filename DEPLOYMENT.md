# Deployment Guide: JobEqual Platform

This guide provides step-by-step instructions for deploying the JobEqual platform to Google Cloud Platform (GCP). The platform consists of two main services:
1.  **The Main Application:** A Node.js application serving a React frontend and an Express backend.
2.  **The Job Scraper:** A Python script that runs on a schedule to collect job postings.

Both services will be deployed as Docker containers using Google Cloud Run.

---

### **Prerequisites**

1.  **Google Cloud Account & Project:** You need a Google Cloud account with a project created and billing enabled.
2.  **Google Cloud SDK (`gcloud`):** You must have the `gcloud` command-line tool installed and initialized on your local machine. [Official Installation Guide](https://cloud.google.com/sdk/docs/install).
3.  **Docker:** You need Docker Desktop installed and running on your local machine.
4.  **Your Secrets:** Have your backend environment variables ready (Supabase keys, Stripe keys, Adzuna keys, etc.).
5.  **GitHub Repository Variables:** For the CI/CD workflow to run, you must set the following variables in your GitHub repository's settings under `Settings > Secrets and variables > Actions`:
    *   `GCP_PROJECT_ID`: Your Google Cloud project ID.
    *   `GCP_WIF_PROVIDER`: Your Workload Identity Provider path (e.g., `projects/123456/locations/global/workloadIdentityPools/my-pool/providers/my-provider`).
    *   `GCP_REGION`: The GCP region you are deploying to (e.g., `europe-west6`).

---

## **Part 1: Deploying the Main Application (`jobequal-service`)**

### **A. Initial Manual Deployment**

These steps describe how to do the first deployment from your local machine. Subsequent deployments will be handled automatically by the CI/CD workflow.

**1. Configure Google Cloud & Docker**
```bash
# Log in to gcloud
gcloud auth login

# Set your project
gcloud config set project [YOUR_PROJECT_ID]

# Configure Docker authentication
gcloud auth configure-docker
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
# Deploy the service, setting all required environment variables
gcloud run deploy jobequal-service \
  --image=[YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal:latest \
  --platform=managed \
  --region=[YOUR_GCP_REGION] \
  --port=8080 \
  --allow-unauthenticated \
  --set-env-vars="SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,OPENAI_API_KEY=...,STRIPE_SECRET_KEY=...,STRIPE_WEBHOOK_SECRET=...,R2_ACCOUNT_ID=...,R2_ACCESS_KEY_ID=...,R2_SECRET_ACCESS_KEY=...,R2_BUCKET_NAME=...,VITE_APP_URL=..."
```
*Note:* After deployment, Cloud Run will provide a service URL. You should update the `VITE_APP_URL` variable with this URL. For higher security, manage secrets using Google Secret Manager.

### **B. Automated CI/CD Deployments**
The `.github/workflows/deploy-main-app.yml` file is configured to automatically handle deployments. When you push changes to the `main` branch, it will rebuild and redeploy the main application for you.

---

## **Part 2: Deploying the Python Job Scraper (`jobequal-scraper-job`)**

**1. Build and Push the Scraper Image**
```bash
# Build the scraper image
docker build -t [YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal-scraper:latest -f job_scraper/Dockerfile .

# Push the scraper image
docker push [YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal-scraper:latest
```

**2. Deploy the Scheduled Job**
```bash
# Enable the Cloud Scheduler API
gcloud services enable cloudscheduler.googleapis.com

# Deploy the job with a schedule (e.g., "0 2 * * *" for 2 AM daily)
gcloud run jobs deploy jobequal-scraper-job \
  --image=[YOUR_GCP_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/jobequal-repo/jobequal-scraper:latest \
  --region=[YOUR_GCP_REGION] \
  --schedule="0 2 * * *" \
  --set-env-vars="SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,ADZUNA_APP_ID=...,ADZUNA_API_KEY=..."
```

---

## **Part 3: DNS & Domain Configuration**

To make your service available at `jobequal.ch`, you must map your custom domain.

1.  **Add Domain Mapping in GCP:**
    *   Go to the **Google Cloud Run custom domains page** in the GCP Console.
    *   Click **"Add Mapping"** and select your `jobequal-service`.
    *   Enter `jobequal.ch` as the domain.
    *   Google will provide you with a set of DNS records to add at your registrar.

2.  **Add DNS Records at Your Registrar:**
    *   Log in to your domain registrar (e.g., Swizzonic, Cloudflare).
    *   Go to the DNS management page for `jobequal.ch`.
    *   Add the `A`, `AAAA`, or `CNAME` records exactly as specified by Google.

DNS changes may take several hours to propagate. Once complete, Google will automatically provision an SSL certificate for your domain.
