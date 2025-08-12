import re
import unicodedata
from urllib.parse import urlparse, urlunparse

# --- Predefined Lists for Normalization ---

# A non-exhaustive list of common tech skills.
# This list can be expanded and moved to a separate config file later.
COMMON_TECH_SKILLS = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c#", "c++", "go", "rust", "php", "ruby", "swift", "kotlin", "scala",
    # Frontend Frameworks
    "react", "angular", "vue", "next.js", "svelte", "ember",
    # Backend Frameworks
    "node.js", "django", "flask", "spring", "ruby on rails", ".net", "laravel",
    # Mobile
    "ios", "android", "react native", "flutter",
    # Databases
    "sql", "postgresql", "mysql", "mongodb", "redis", "cassandra", "sqlite",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd",
    # Data Science & ML
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "machine learning", "data analysis",
    # Other
    "api", "rest", "graphql", "html", "css", "tailwind", "agile", "scrum"
}


def normalize_string(s: str) -> str:
    """
    Lowercase, trim, and remove punctuation from a string, replacing it with a space.
    Also handles accent removal.
    """
    if not s:
        return ""
    s = s.lower().strip()
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    # Replace any non-alphanumeric characters with a space
    s = re.sub(r'[^\w\s]', ' ', s)
    # Collapse multiple spaces into one
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def normalize_title(title: str) -> str:
    """
    Normalizes a job title.
    """
    return normalize_string(title)

def normalize_company(company: str) -> str:
    """
    Normalizes a company name.
    """
    # Simple normalization for now, can be expanded with company name canonicalization
    return normalize_string(company)


import hashlib

def create_job_hash(job: dict) -> str:
    """
    Creates a SHA256 hash for a job based on its key properties.
    """
    # Ensure all parts of the hash are strings and handle None values
    norm_title = normalize_title(job.get("title", ""))
    norm_company = normalize_company(job.get("company", ""))
    canton = (job.get("canton") or "").lower().strip()
    date_posted = str(job.get("date_posted", ""))

    hash_string = f"{norm_title}|{norm_company}|{canton}|{date_posted}"
    return hashlib.sha256(hash_string.encode()).hexdigest()


# --- Candidate Data Normalization ---

def normalize_location(location: str) -> str:
    """
    Normalizes a location string, with a focus on Swiss locations.
    """
    if not location:
        return ""
    norm_loc = normalize_string(location)
    # This is a very simple start. Can be expanded with a proper location library.
    if "switzerland" in norm_loc or "suisse" in norm_loc or "schweiz" in norm_loc:
        return "Switzerland"
    # Could add major cities mapping here, e.g., "zurich" -> "Zurich, Switzerland"
    return location # Return original if no simple rule matches

def extract_skills_from_text(text: str) -> set[str]:
    """
    Extracts a set of predefined skills from a text blob (e.g., a bio).
    """
    if not text:
        return set()

    # Use a less aggressive normalization for skill extraction.
    # We lowercase the text but keep special characters needed for skill names.
    text_lower = text.lower()
    found_skills = set()

    for skill in COMMON_TECH_SKILLS:
        # This regex is designed to find whole words, including those with special characters.
        # 1. (^|\W): Asserts the position is at the start of the string or a non-word character.
        # 2. re.escape(skill): The literal skill.
        # 3. (?!-): A negative lookahead to ensure the skill is not followed by a hyphen
        #    (to prevent matching 'go' in 'go-getter').
        # 4. (\W|$): Asserts the position is followed by a non-word character or the end of the string.
        pattern = r'(^|\W)' + re.escape(skill) + r'(?!-)(\W|$)'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    return found_skills

def normalize_url(url: str) -> str:
    """
    Cleans and normalizes a URL. Ensures it has a scheme.
    Returns empty string if URL is invalid or empty.
    """
    if not url:
        return ""

    # Add a default scheme if one is missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        parsed = urlparse(url)
        # Reconstruct the URL to ensure it's well-formed
        # This can help clean up minor formatting issues.
        return urlunparse(parsed)
    except ValueError:
        return ""
