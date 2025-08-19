import os
import logging
from openai import OpenAI

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class EmbeddingService:
    """
    A service to generate text embeddings using OpenAI's API.
    """
    def __init__(self):
        # The OpenAI client will automatically use the OPENAI_API_KEY environment variable.
        try:
            self.client = OpenAI()
            self.model = "text-embedding-ada-002"
            logging.info("OpenAI client initialized successfully.")
        except Exception as e:
            logging.error(f"Failed to initialize OpenAI client: {e}", exc_info=True)
            self.client = None

    def get_embedding(self, text: str):
        """
        Generates an embedding for the given text.

        Args:
            text: The text to embed.

        Returns:
            A list of floats representing the embedding, or None if an error occurs.
        """
        if not self.client:
            logging.error("OpenAI client is not available. Cannot generate embedding.")
            return None

        if not text or not isinstance(text, str):
            logging.warning("Invalid input text provided for embedding.")
            return None

        try:
            # Replace newlines, which can negatively affect performance.
            text = text.replace("\n", " ")
            response = self.client.embeddings.create(input=[text], model=self.model)
            embedding = response.data[0].embedding
            logging.info(f"Successfully generated embedding for text snippet: '{text[:50]}...'")
            return embedding
        except Exception as e:
            logging.error(f"An error occurred while generating embedding: {e}", exc_info=True)
            return None

# Example usage:
if __name__ == '__main__':
    # This requires the OPENAI_API_KEY to be set as an environment variable.
    # You can set it in your .env file at the project root.
    from dotenv import load_dotenv
    dotenv_path = os.path.join(os.path.dirname(__file__), '../../.env')
    load_dotenv(dotenv_path=dotenv_path)

    if not os.getenv("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY environment variable not set.")
    else:
        service = EmbeddingService()
        sample_text = "This is a test of the embedding service."
        embedding = service.get_embedding(sample_text)
        if embedding:
            print(f"Successfully generated embedding with {len(embedding)} dimensions.")
            # print(embedding)
        else:
            print("Failed to generate embedding.")
