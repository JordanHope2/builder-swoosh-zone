-- Enable Row-Level Security for all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'profiles' table
-- Users can see all profiles (for public profile pages)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
-- Users can only insert a profile for themselves
CREATE POLICY "Allow users to insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Users can only update their own profile
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Users can only delete their own profile
CREATE POLICY "Allow users to delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create policies for the 'jobs' table
-- All users can view all jobs
CREATE POLICY "Allow public read access to jobs" ON public.jobs FOR SELECT USING (true);
-- Users can only insert jobs if they are authenticated (the owner_id will be set by the backend)
CREATE POLICY "Allow authenticated users to insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Users can only update jobs they own
CREATE POLICY "Allow owners to update their jobs" ON public.jobs FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
-- Users can only delete jobs they own
CREATE POLICY "Allow owners to delete their jobs" ON public.jobs FOR DELETE USING (auth.uid() = owner_id);

-- Create policies for the 'applications' table
-- A user can see their own applications
CREATE POLICY "Allow users to see their own applications" ON public.applications FOR SELECT USING (auth.uid() = candidate_id);
-- A recruiter can see applications for jobs they own
CREATE POLICY "Allow recruiters to see applications for their jobs" ON public.applications FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM jobs
    WHERE jobs.id = applications.job_id AND jobs.owner_id = auth.uid()
  )
);
-- A user can only insert an application for themselves
CREATE POLICY "Allow users to insert their own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

-- Create policies for the 'subscriptions' table
-- A user can only see and manage their own subscription
CREATE POLICY "Allow users to manage their own subscription" ON public.subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create policies for the 'companies' table
-- For now, allow public read access. More granular policies can be added later if companies have owners.
CREATE POLICY "Allow public read access to companies" ON public.companies FOR SELECT USING (true);
-- Allow authenticated users to insert new companies
CREATE POLICY "Allow authenticated users to create companies" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- In a more complex scenario, you would add an owner_id to companies and restrict updates/deletes.
CREATE POLICY "Allow all updates for now" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes for now" ON public.companies FOR DELETE USING (true);
