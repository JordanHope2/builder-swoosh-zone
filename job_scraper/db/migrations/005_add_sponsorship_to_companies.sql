-- This migration script enriches the 'companies' table with a boolean flag
-- to indicate whether the company appears to offer visa sponsorship,
-- based on analysis of their job postings.

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS offers_visa_sponsorship boolean DEFAULT false;

COMMENT ON COLUMN public.companies.offers_visa_sponsorship IS 'Indicates if a company is likely to offer visa sponsorship, based on keyword analysis of their job descriptions.';

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
