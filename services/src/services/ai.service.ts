import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

export class AiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export class AiService {
  private client: GoogleGenerativeAI;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs = 30000): Promise<T> {
    let timeout: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        reject(new AiError("AI_TIMEOUT", "Gemini request timeout after 30 seconds", 504));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeout));
  }

  async getEmbedding(text: string): Promise<number[]> {
    if (!text?.trim()) {
      throw new AiError("EMPTY_TEXT", "Text is required", 400);
    }

    try {
      const model = this.client.getGenerativeModel({ model: "gemini-embedding-001" });
      const result = await this.withTimeout(model.embedContent(text));
      const embedding = result.embedding?.values;

      if (!embedding) {
        throw new AiError("EMPTY_EMBEDDING", "Gemini returned empty embedding", 502);
      }

      return embedding;
    } catch (error: unknown) {
      if (error instanceof AiError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : "Gemini embedding request failed";
      throw new AiError("EMBEDDING_ERROR", message, 502);
    }
  }
}

export const aiService = new AiService();
