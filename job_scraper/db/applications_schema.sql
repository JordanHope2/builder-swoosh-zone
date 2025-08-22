-- Create a custom type for application status
CREATE TYPE public.application_status AS ENUM ('applied', 'reviewed', 'interviewed', 'offered', 'hired', 'rejected');

-- Create the applications table
CREATE TABLE public.applications (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'applied',
  cover_letter text,
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.applications IS 'Stores job applications from candidates.';

-- Create indexes for faster queries
CREATE INDEX ON public.applications (job_id);
CREATE INDEX ON public.applications (user_id);

-- Add RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy: Candidates can view their own applications
CREATE POLICY "Candidates can view their own applications"
ON public.applications FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Candidates can create applications for themselves
CREATE POLICY "Candidates can create their own applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Recruiters can view applications for jobs they own
CREATE POLICY "Recruiters can view applications for their jobs"
ON public.applications FOR SELECT
USING (
  (SELECT owner_id FROM public.jobs WHERE id = applications.job_id) = auth.uid()
);

-- Policy: Recruiters can update the status of applications for their jobs
CREATE POLICY "Recruiters can update applications for their jobs"
ON public.applications FOR UPDATE
USING (
  (SELECT owner_id FROM public.jobs WHERE id = applications.job_id) = auth.uid()
);

-- Trigger to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_update_set_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE PROCEDURE public.handle_application_updated_at();
