import { Router } from 'express';
import { getSupabaseAdmin } from '../supabase';
import { spawn } from 'child_process';
import path from 'path';

const router = Router();

router.post('/', async (req, res) => {
  const { candidateId, jobId } = req.body;

  if (!candidateId || !jobId) {
    return res.status(400).json({ error: 'candidateId and jobId are required.' });
  }

  const supabase = getSupabaseAdmin();

  try {
    // 1. Fetch candidate and job data from Supabase
    const { data: candidate, error: candidateError } = await supabase
      .from('scraped_candidates')
      .select('bio')
      .eq('id', candidateId)
      .single();

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('description')
      .eq('id', jobId)
      .single();

    if (candidateError || jobError) {
      console.error('Error fetching data from Supabase:', candidateError || jobError);
      return res.status(404).json({ error: 'Candidate or Job not found.' });
    }

    if (!candidate?.bio || !job?.description) {
      return res.status(400).json({ error: 'Candidate bio or job description is missing.' });
    }

    // 2. Execute the Python matching script
    const pythonScriptPath = path.join(__dirname, '../../job_scraper/analysis/matching_service.py');
    const pythonProcess = spawn('python3', [pythonScriptPath, candidate.bio, job.description]);

    let matchScore = '';
    pythonProcess.stdout.on('data', (data) => {
      matchScore += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr from Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ error: 'Failed to calculate match score.' });
      }

      // 3. Return the score
      res.json({ match_score: parseInt(matchScore.trim(), 10) });
    });

  } catch (error: any) {
    console.error('Error in /api/match:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
