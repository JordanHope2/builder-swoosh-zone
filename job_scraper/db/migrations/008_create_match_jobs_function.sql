-- Create a function to search for jobs based on vector similarity
CREATE OR REPLACE FUNCTION match_jobs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  company_name text,
  location text,
  description text,
  url text,
  similarity float
)
LANGUAGE sql STABLE AS $$
  SELECT
    jobs.id,
    jobs.title,
    jobs.company_name,
    jobs.location,
    jobs.description,
    jobs.url,
    1 - (jobs.embedding <=> query_embedding) as similarity
  FROM jobs
  WHERE 1 - (jobs.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
