-- This migration adds a UNIQUE constraint to the 'name' column of the 'companies' table.
-- This allows us to use `upsert(..., on_conflict='name')` as a simple way to
-- avoid creating duplicate companies from enrichment sources like Adzuna.

-- Note: This is a simplification. A more robust solution would involve a
-- separate staging table and a fuzzy matching process to merge companies
-- with slightly different names.

ALTER TABLE public.companies
ADD CONSTRAINT companies_name_key UNIQUE (name);

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
