-- Add a hash column to the jobs table to uniquely identify jobs
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS hash TEXT;

-- Create a unique index on the hash column
CREATE UNIQUE INDEX IF NOT EXISTS jobs_hash_uidx ON public.jobs(hash);
