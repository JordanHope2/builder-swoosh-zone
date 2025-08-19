import sys
import json
import logging
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_nltk_data():
    """
    Downloads the necessary NLTK data if not already present.
    """
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        print("Downloading NLTK 'punkt' data...")
        nltk.download('punkt', quiet=True)
    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        print("Downloading NLTK 'wordnet' data...")
        nltk.download('wordnet', quiet=True)
    try:
        nltk.data.find('tokenizers/punkt_tab')
    except LookupError:
        print("Downloading NLTK 'punkt_tab' data...")
        nltk.download('punkt_tab', quiet=True)

# Call this once when the module is loaded
download_nltk_data()

lemmatizer = WordNetLemmatizer()

def lemmatize_text(text: str) -> str:
    """
    Tokenizes and lemmatizes the text.
    """
    tokens = word_tokenize(text)
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in tokens]
    return ' '.join(lemmatized_tokens)

def calculate_match_score(candidate_text: str, job_text: str) -> int:
    """
    Calculates a match score between a candidate and a job based on text similarity.
    """
    if not candidate_text or not job_text:
        return 0

    # Lemmatize the texts to improve similarity matching
    processed_candidate_text = lemmatize_text(candidate_text)
    processed_job_text = lemmatize_text(job_text)

    documents = [processed_candidate_text, processed_job_text]

    vectorizer = TfidfVectorizer(stop_words='english')

    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
    except ValueError:
        return 0

    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    score = int(cosine_sim[0][0] * 100)

    return score

def get_gpt4_match_score(candidate_text: str, job_text: str):
    """
    Uses GPT-4 to calculate a detailed match score and provide an explanation.
    """
    if not candidate_text or not job_text:
        return {"score": 0, "explanation": "Missing candidate or job information."}

    try:
        client = OpenAI() # Assumes OPENAI_API_KEY is set in environment
        prompt = f"""
        Analyze the following job description and candidate profile. Provide a match score from 0 to 100
        and a brief, one-sentence explanation for your score.

        Job Description:
        ---
        {job_text}
        ---

        Candidate Profile:
        ---
        {candidate_text}
        ---

        Return your response as a JSON object with two keys: "score" (integer) and "explanation" (string).
        """

        logging.info("Calling GPT-4 for match score analysis...")
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2,
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("Received empty content from OpenAI.")

        result = json.loads(content)
        logging.info(f"Received match score from GPT-4: {result.get('score')}")
        return result

    except Exception as e:
        logging.error(f"Error getting GPT-4 match score: {e}", exc_info=True)
        # Fallback to TF-IDF score in case of GPT-4 failure
        fallback_score = calculate_match_score(candidate_text, job_text)
        return {
            "score": fallback_score,
            "explanation": f"AI analysis failed. Using basic keyword match. (Error: {e})"
        }


if __name__ == "__main__":
    # This allows testing either the TF-IDF or GPT-4 scorer from the command line.
    if len(sys.argv) < 3:
        print("Usage: python matching_service.py <candidate_text> <job_text> [--gpt4]")
        sys.exit(1)

    candidate_text_arg = sys.argv[1]
    job_text_arg = sys.argv[2]
    use_gpt4 = "--gpt4" in sys.argv

    if use_gpt4:
        print("--- Using GPT-4 Matcher ---")
        # Note: Requires OPENAI_API_KEY to be set as an environment variable.
        from dotenv import load_dotenv
        import os
        dotenv_path = os.path.join(os.path.dirname(__file__), '../../.env')
        load_dotenv(dotenv_path=dotenv_path)
        if not os.getenv("OPENAI_API_KEY"):
             print("Error: OPENAI_API_KEY environment variable not set.")
             sys.exit(1)
        match_result = get_gpt4_match_score(candidate_text_arg, job_text_arg)
        print(json.dumps(match_result, indent=2))
    else:
        print("--- Using TF-IDF Matcher ---")
        match_score = calculate_match_score(candidate_text_arg, job_text_arg)
        print(f"TF-IDF Score: {match_score}")
