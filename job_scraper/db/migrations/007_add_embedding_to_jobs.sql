-- Add an embedding column to the jobs table to store vector embeddings
-- The size 1536 corresponds to the output dimensions of OpenAI's text-embedding-ada-002 model.
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS embedding vector(1536);
