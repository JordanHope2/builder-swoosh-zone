import 'dotenv/config';
import { resolve } from 'path';
import { config } from 'dotenv';
import { getSupabaseAdmin } from '../server/supabase.ts';
import crypto from 'crypto';

config({ path: resolve(process.cwd(), '.env.test') });

// This is mock data based on the Greenhouse Job Board API documentation.
// In a real implementation, you would fetch this from the Greenhouse API.
const mockGreenhouseJobs = {
  jobs: [
    {
      id: 127817,
      internal_job_id: 144381,
      title: 'Vault Designer',
      updated_at: '2025-08-30T10:55:28-05:00',
      location: {
        name: 'New York City'
      },
      absolute_url: 'https://boards.greenhouse.io/vaulttec/jobs/127817',
      content: '<p>Design and build the next generation of vaults.</p>',
      departments: [{ id: 1, name: 'Engineering' }],
      offices: [{ id: 1, name: 'NYC Office' }],
    },
    {
      id: 127818,
      internal_job_id: 144382,
      title: 'Pip-Boy Programmer',
      updated_at: '2025-08-30T11:00:00-05:00',
      location: {
        name: 'Boston'
      },
      absolute_url: 'https://boards.greenhouse.io/vaulttec/jobs/127818',
      content: '<h2>Join the Pip-Boy team!</h2><p>Develop software for the wrist-mounted personal computer.</p>',
      departments: [{ id: 1, name: 'Engineering' }],
      offices: [{ id: 2, name: 'Boston Office' }],
    }
  ]
};

async function ingestJobs() {
  console.log('Starting Greenhouse job ingestion...');

  const supabase = getSupabaseAdmin();

  for (const job of mockGreenhouseJobs.jobs) {
    const jobData = {
      greenhouse_id: job.id,
      title: job.title,
      description: job.content,
      location: job.location.name,
      apply_url: job.absolute_url,
      updated_at: job.updated_at,
      department: job.departments?.[0]?.name,
      office: job.offices?.[0]?.name,
    };

    // Create a hash for deduplication
    const hash = crypto.createHash('sha256').update(JSON.stringify(jobData)).digest('hex');

    const jobToUpsert = {
      ...jobData,
      hash,
    };

    console.log(`Upserting job: ${jobToUpsert.title}`);

    // This assumes a 'jobs' table with a unique constraint on 'greenhouse_id'.
    const { data, error } = await supabase
      .from('jobs')
      .upsert(jobToUpsert, { onConflict: 'greenhouse_id' });

    if (error) {
      console.error(`Error upserting job ${job.id}:`, error);
    } else {
      console.log(`Successfully upserted job ${job.id}`);
    }
  }

  console.log('Greenhouse job ingestion complete.');
}

ingestJobs().catch(console.error);
