-- This migration script enriches the 'companies' table with columns for
-- storing descriptions and an extracted technology stack.

-- Add a 'description' column to store the company mission or profile text.
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS description text;

COMMENT ON COLUMN public.companies.description IS 'A description of the company, often scraped from a job posting or a company profile page.';


-- Add a 'tech_stack' column to store an array of identified technologies.
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS tech_stack text[];

COMMENT ON COLUMN public.companies.tech_stack IS 'An array of technologies and skills identified from company descriptions or job postings.';


-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
