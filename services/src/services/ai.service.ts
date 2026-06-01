import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
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
  private model = "gemini-2.5-flash";

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs = 30000): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new AiError("AI_TIMEOUT", "Gemini request timeout after 30 seconds", 504));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  private getModel() {
    return this.client.getGenerativeModel({
      model: this.model,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  async generate(prompt: string): Promise<{ text: string }> {
    if (!prompt?.trim()) {
      throw new AiError("EMPTY_PROMPT", "Prompt is required", 400);
    }

    try {
      const model = this.getModel();

      const result = await this.withTimeout(model.generateContent(prompt));

      const text = result.response.text();

      if (!text) {
        throw new AiError("EMPTY_RESPONSE", "Gemini returned empty response", 502);
      }

      return { text };
    } catch (error: unknown) {
      if (error instanceof AiError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : "Gemini request failed";
      throw new AiError("GEMINI_ERROR", message, 502);
    }
  }

  async *stream(prompt: string): AsyncGenerator<string> {
    if (!prompt?.trim()) {
      throw new AiError("EMPTY_PROMPT", "Prompt is required", 400);
    }

    const model = this.getModel();

    const result = await this.withTimeout(model.generateContentStream(prompt));

    for await (const chunk of result.stream) {
      const text = chunk.text();

      if (text) {
        yield text;
      }
    }
  }
}

export const aiService = new AiService();