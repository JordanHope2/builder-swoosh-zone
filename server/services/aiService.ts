import "dotenv/config";
import OpenAI from "openai";

let openai: OpenAI | null = null;

import { getSecrets } from './secretManager';

function getOpenAIClient(): OpenAI {
  if (openai) return openai;

  const secrets = getSecrets();
  const apiKey = secrets.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key not found in cache. Ensure fetchAndCacheSecrets() is called at startup.");
  }
  openai = new OpenAI({
    apiKey: apiKey,
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
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding.");
  }
}
