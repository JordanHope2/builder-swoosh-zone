import re
import unicodedata

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
