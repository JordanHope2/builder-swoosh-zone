-- This migration script adds a foreign key relationship between the 'jobs' table
-- and the new 'companies' table.

-- Add the 'company_id' column to the 'jobs' table.
-- It is nullable because a job might be scraped before its company profile is created.
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS company_id uuid;

-- Add a foreign key constraint to link jobs to companies.
-- We use a constraint name to make it easy to manage in the future.
ALTER TABLE public.jobs
ADD CONSTRAINT jobs_company_id_fkey
FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- Optional: Add an index to the new foreign key column for faster lookups.
CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON public.jobs (company_id);

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
