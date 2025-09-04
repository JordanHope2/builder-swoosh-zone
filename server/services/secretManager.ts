import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// This is a simple in-memory cache for the secrets.
// In a more complex application, you might use a more robust caching solution.
let cachedSecrets: Record<string, string> | null = null;

/**
 * A list of all secrets the application needs to fetch from Google Secret Manager.
 * The format is: [GCP_SECRET_ID, DESIRED_ENV_VAR_NAME]
 * The GCP_SECRET_ID is the name you give the secret in Google Cloud.
 * The DESIRED_ENV_VAR_NAME is the key that the application code will use to access the secret.
 */
const secretsToFetch: [string, string][] = [
  ['SUPABASE_URL', 'SUPABASE_URL'],
  ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  ['OPENAI_API_KEY', 'OPENAI_API_KEY'],
  ['STRIPE_SECRET_KEY', 'STRIPE_SECRET_KEY'],
  ['STRIPE_WEBHOOK_SECRET', 'STRIPE_WEBHOOK_SECRET'],
  ['ADZUNA_APP_ID', 'ADZUNA_APP_ID'],
  ['ADZUNA_API_KEY', 'ADZUNA_API_KEY'],
  ['R2_ACCOUNT_ID', 'R2_ACCOUNT_ID'],
  ['R2_ACCESS_KEY_ID', 'R2_ACCESS_KEY_ID'],
  ['R2_SECRET_ACCESS_KEY', 'R2_SECRET_ACCESS_KEY'],
  ['R2_BUCKET_NAME', 'R2_BUCKET_NAME'],
  ['SENTRY_DSN', 'SENTRY_DSN'],
];

/**
 * Fetches all necessary application secrets from Google Secret Manager.
 * It fetches them once and caches them in memory for subsequent calls.
 * This function should be called at application startup.
 * @returns A record object containing all the application secrets.
 */
export async function fetchAndCacheSecrets(): Promise<Record<string, string>> {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  // This will be automatically authenticated when running on Google Cloud (e.g., Cloud Run)
  // if the service account has the "Secret Manager Secret Accessor" role.
  // For local development, you would need to be authenticated via `gcloud auth application-default login`.
  const client = new SecretManagerServiceClient();
  const projectId = process.env.GCP_PROJECT_ID;

  if (!projectId) {
    console.error("GCP_PROJECT_ID environment variable is not set. Cannot fetch secrets.");
    // In a real app, you might want to throw an error here to prevent startup.
    return {};
  }

  console.log('Fetching secrets from Google Secret Manager...');

  const secrets: Record<string, string> = {};

  for (const [secretId, envVarName] of secretsToFetch) {
    try {
      const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretId}/versions/latest`,
      });

      const payload = version.payload?.data?.toString();
      if (payload) {
        secrets[envVarName] = payload;
      } else {
        console.warn(`Secret ${secretId} has no payload.`);
      }
    } catch (error) {
      console.error(`Failed to fetch secret: ${secretId}`, error);
      // Decide how to handle missing secrets. For now, we'll just log and continue.
    }
  }

  cachedSecrets = secrets;
  console.log('Successfully fetched and cached secrets.');
  return cachedSecrets;
}

/**
 * Retrieves the cached secrets.
 * Throws an error if the secrets have not been fetched yet.
 * @returns The record object of cached secrets.
 */
export function getSecrets(): Record<string, string> {
  if (!cachedSecrets) {
    throw new Error('Secrets have not been fetched yet. Call fetchAndCacheSecrets() at application startup.');
  }
  return cachedSecrets;
}
