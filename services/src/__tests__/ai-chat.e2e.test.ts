/**
 * T-E09 + T-E10: AI Chat E2E integration tests
 * Closes #91, #92
 *
 * Tests the full AI Chat flow:
 * 1. Character listing
 * 2. Session creation
 * 3. Message sending (non-streaming fallback)
 * 4. Session retrieval with messages
 * 5. Rate limiting
 */
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import type { Express } from "express";
import request from "supertest";
import type { PrismaClient } from "../prisma/generated/client.js";

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: async () => ({
          response: {
            text: () => "Mock philosophical response",
          },
        }),
        generateContentStream: async () => ({
          stream: [
            {
              text: () => "Mock streamed philosophical response",
            },
          ],
        }),
      };
    }
  },
  HarmBlockThreshold: {
    BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
  },
  HarmCategory: {
    HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
    HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
    HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  },
}));

const { prisma } = (await import("../config/prisma.js")) as { prisma: PrismaClient };
const { default: app } = (await import("../index.js")) as { default: Express };

const API_BASE = app;
const TEST_PASSWORD = "TestPass123!";
const TEST_RUN_ID = Date.now();
const TEST_CHARACTER_NAME = `Test Philosopher ${TEST_RUN_ID}`;

describe("AI Chat E2E Flow", () => {
  let authToken: string;
  let characterId: string;
  let sessionId: string;

  beforeAll(async () => {
    const email = `ai-chat-e2e-${TEST_RUN_ID}@example.com`;
    const registerRes = await request(API_BASE)
      .post("/api/v1/auth/register")
      .send({
        email,
        password: TEST_PASSWORD,
        fullName: "AI Chat E2E Admin",
      })
      .expect(201);

    await prisma.user.update({
      where: { id: registerRes.body.data.user.id },
      data: { role: "ADMIN" },
    });

    authToken = registerRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("T-E02: Character Management", () => {
    it("should list all characters", async () => {
      const res = await request(API_BASE)
        .get("/api/v1/ai/characters")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      if (res.body.data.length > 0) {
        characterId = res.body.data[0].id;
        expect(res.body.data[0]).toHaveProperty("name");
        expect(res.body.data[0]).toHaveProperty("type");
        expect(res.body.data[0]).toHaveProperty("promptInstruction");
      }
    });

    it("should create a new character", async () => {
      const res = await request(API_BASE)
        .post("/api/v1/ai/characters")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: TEST_CHARACTER_NAME,
          type: "Test Type",
          bio: "A test philosopher for E2E testing",
          promptInstruction: "You are a test philosopher. Respond thoughtfully to all questions.",
        })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(TEST_CHARACTER_NAME);
      characterId = res.body.data.id;
    });

    it("should get character by ID", async () => {
      if (!characterId) return;

      const res = await request(API_BASE).get(`/api/v1/ai/characters/${characterId}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(characterId);
      expect(res.body.data.name).toBe(TEST_CHARACTER_NAME);
    });
  });

  describe("T-E03: Chat Session Management", () => {
    it("should create a chat session", async () => {
      if (!characterId) return;

      const res = await request(API_BASE)
        .post("/api/v1/ai/chat/sessions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          characterId,
          title: "E2E Test Session",
        })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.characterId).toBe(characterId);
      sessionId = res.body.data.id;
    });

    it("should list chat sessions", async () => {
      const res = await request(API_BASE)
        .get("/api/v1/ai/chat/sessions")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty("total");
    });

    it("should get a specific session", async () => {
      if (!sessionId) return;

      const res = await request(API_BASE)
        .get(`/api/v1/ai/chat/sessions/${sessionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(sessionId);
    });
  });

  describe("T-E04: Message Sending", () => {
    it("should send a message and get AI response", async () => {
      if (!sessionId) return;

      const res = await request(API_BASE)
        .post(`/api/v1/ai/chat/sessions/${sessionId}/messages`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ message: "What is the meaning of life?" })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("userMessage");
      expect(res.body.data).toHaveProperty("assistantMessage");
      expect(res.body.data.userMessage.senderType).toBe("USER");
      expect(res.body.data.assistantMessage.senderType).toBe("AI");
      expect(res.body.data.assistantMessage.message).toBeTruthy();
    });

    it("should reject empty messages", async () => {
      if (!sessionId) return;

      await request(API_BASE)
        .post(`/api/v1/ai/chat/sessions/${sessionId}/messages`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ message: "" })
        .expect(400);
    });
  });

  describe("T-E08: Streaming Endpoint", () => {
    it("should accept POST to stream endpoint", async () => {
      if (!sessionId) return;

      const res = await request(API_BASE)
        .post(`/api/v1/ai/chat/sessions/${sessionId}/stream`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ message: "Tell me about ethics" });

      // Should return 200 with event-stream content type
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/text\/event-stream/);
    });
  });

  describe("T-E01: Rate Limiting", () => {
    it("should eventually rate limit excessive requests", async () => {
      if (!sessionId) return;

      // Send more requests than the rate limit allows
      const results = await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
          request(API_BASE)
            .post(`/api/v1/ai/chat/sessions/${sessionId}/messages`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({ message: `Rate limit test ${i}` }),
        ),
      );
      const rateLimited = results.some((r) => r.status === 429);

      // At least some should be rate limited
      expect(rateLimited).toBe(true);
    });
  });

  describe("Validation", () => {
    it("should reject invalid session ID format", async () => {
      await request(API_BASE)
        .get("/api/v1/ai/chat/sessions/not-a-uuid")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 404 for non-existent session", async () => {
      await request(API_BASE)
        .get("/api/v1/ai/chat/sessions/550e8400-e29b-41d4-a716-446655440000")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });

    it("should reject character creation without required fields", async () => {
      await request(API_BASE)
        .post("/api/v1/ai/characters")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "X" })
        .expect(400);
    });
  });
});
