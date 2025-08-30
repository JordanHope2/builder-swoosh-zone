-- This migration script adds a 'company_name' column to the 'jobs' table
-- to store the raw company name string from the scraping source.

ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS company_name text;

COMMENT ON COLUMN public.jobs.company_name IS 'The raw company name as scraped from the source (e.g., ''Google'', ''UBS AG''). Used for linking to the canonical companies table.';

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
