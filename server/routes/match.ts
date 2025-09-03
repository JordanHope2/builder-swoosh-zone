import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { authMiddleware } from "../middleware/auth";
import natural from "natural";

const router = Router();

const { TfIdf, PorterStemmer } = natural;

router.post("/", authMiddleware, async (req, res) => {
  const { candidateText, jobText } = req.body;

  if (!candidateText || !jobText) {
    return res
      .status(400)
      .json({ error: "candidateText and jobText are required." });
  }

  try {
    // 1. Preprocess the text (stemming)
    const processText = (text: string) => {
      return text.split(' ').map(PorterStemmer.stem).join(' ');
    };

    const processedCandidateText = processText(candidateText);
    const processedJobText = processText(jobText);

    // 2. Calculate TF-IDF and cosine similarity
    const tfidf = new TfIdf();
    tfidf.addDocument(processedCandidateText);
    tfidf.addDocument(processedJobText);

    // Get the vectors for the documents
    const candidateVector = tfidf.getVector(0);
    const jobVector = tfidf.getVector(1);

    // Calculate cosine similarity
    const dotProduct = candidateVector.dot(jobVector);
    const candidateMagnitude = candidateVector.magnitude();
    const jobMagnitude = jobVector.magnitude();

    let cosineSimilarity = 0;
    if (candidateMagnitude !== 0 && jobMagnitude !== 0) {
      cosineSimilarity = dotProduct / (candidateMagnitude * jobMagnitude);
    }

    const matchScore = Math.round(cosineSimilarity * 100);

    // 3. Return the score
    res.json({ match_score: matchScore });

  } catch (error: any) {
    console.error("Error in /api/match:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
