import sys
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python matching_service.py <candidate_text> <job_text>")
        sys.exit(1)

    candidate_text_arg = sys.argv[1]
    job_text_arg = sys.argv[2]

    match_score = calculate_match_score(candidate_text_arg, job_text_arg)
    print(match_score)
