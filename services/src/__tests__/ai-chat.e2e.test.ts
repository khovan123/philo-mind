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
import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";

// These tests require a running server
const API_BASE = process.env.TEST_API_URL ?? "http://localhost:3000";

describe("AI Chat E2E Flow", () => {
  let characterId: string;
  let sessionId: string;

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
        .send({
          name: "Test Philosopher",
          type: "Test Type",
          bio: "A test philosopher for E2E testing",
          promptInstruction: "You are a test philosopher. Respond thoughtfully to all questions.",
        })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe("Test Philosopher");
      characterId = res.body.data.id;
    });

    it("should get character by ID", async () => {
      if (!characterId) return;

      const res = await request(API_BASE).get(`/api/v1/ai/characters/${characterId}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(characterId);
      expect(res.body.data.name).toBe("Test Philosopher");
    });
  });

  describe("T-E03: Chat Session Management", () => {
    it("should create a chat session", async () => {
      if (!characterId) return;

      const res = await request(API_BASE)
        .post("/api/v1/ai/chat/sessions")
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
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty("total");
    });

    it("should get a specific session", async () => {
      if (!sessionId) return;

      const res = await request(API_BASE).get(`/api/v1/ai/chat/sessions/${sessionId}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(sessionId);
    });
  });

  describe("T-E04: Message Sending", () => {
    it("should send a message and get AI response", async () => {
      if (!sessionId) return;

      const res = await request(API_BASE)
        .post(`/api/v1/ai/chat/sessions/${sessionId}/messages`)
        .send({ message: "What is the meaning of life?" })
        .expect(200);

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
        .send({ message: "" })
        .expect(400);
    });
  });

  describe("T-E01: Rate Limiting", () => {
    it("should eventually rate limit excessive requests", async () => {
      if (!sessionId) return;

      const promises = [];
      // Send more requests than the rate limit allows
      for (let i = 0; i < 20; i++) {
        promises.push(
          request(API_BASE)
            .post(`/api/v1/ai/chat/sessions/${sessionId}/messages`)
            .send({ message: `Rate limit test ${i}` }),
        );
      }

      const results = await Promise.all(promises);
      const rateLimited = results.some((r) => r.status === 429);

      // At least some should be rate limited
      expect(rateLimited).toBe(true);
    });
  });

  describe("T-E08: Streaming Endpoint", () => {
    it("should accept POST to stream endpoint", async () => {
      if (!sessionId) return;

      const res = await request(API_BASE)
        .post(`/api/v1/ai/chat/sessions/${sessionId}/stream`)
        .send({ message: "Tell me about ethics" });

      // Should return 200 with event-stream content type
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/text\/event-stream/);
    });
  });

  describe("Validation", () => {
    it("should reject invalid session ID format", async () => {
      await request(API_BASE).get("/api/v1/ai/chat/sessions/not-a-uuid").expect(400);
    });

    it("should return 404 for non-existent session", async () => {
      await request(API_BASE)
        .get("/api/v1/ai/chat/sessions/550e8400-e29b-41d4-a716-446655440000")
        .expect(404);
    });

    it("should reject character creation without required fields", async () => {
      await request(API_BASE).post("/api/v1/ai/characters").send({ name: "X" }).expect(400);
    });
  });
});
