import "dotenv/config";
import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openai) return openai;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI env: set OPENAI_API_KEY.");
  }
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai;
}

/**
 * Generates an embedding for the given text using OpenAI's API.
 * @param text The text to embed.
 * @returns A promise that resolves to the embedding vector.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();
    const cleanText = text.replace(/\n/g, " ");

    const response = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: cleanText,
    });

    return response.data[0].embedding;
  } catch (error: unknown) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding.");
  }
}
