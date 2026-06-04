/**
 * T-E02: AI Character validator tests
 * Closes #84
 */
import {
  createCharacterSchema,
  updateCharacterSchema,
  characterIdSchema,
} from "../validators/ai-character.validator.js";

describe("AI Character Validator", () => {
  describe("createCharacterSchema", () => {
    it("validates valid creation payload", () => {
      const payload = {
        body: {
          name: "Socrates",
          type: "Triết gia cổ đại",
          bio: "Father of Western philosophy",
          worldview: "The examined life",
          promptInstruction: "Always ask probing questions to guide the student.",
        },
      };

      expect(createCharacterSchema.parse(payload)).toEqual(payload);
    });

    it("accepts minimal required fields", () => {
      const payload = {
        body: {
          name: "Kant",
          type: "Philosopher",
          promptInstruction: "Use systematic reasoning in all responses.",
        },
      };

      expect(createCharacterSchema.parse(payload)).toEqual(payload);
    });

    it("rejects name too short", () => {
      const result = createCharacterSchema.safeParse({
        body: {
          name: "K",
          type: "Philosopher",
          promptInstruction: "Use systematic reasoning.",
        },
      });

      expect(result.success).toBe(false);
    });

    it("rejects missing promptInstruction", () => {
      const result = createCharacterSchema.safeParse({
        body: {
          name: "Socrates",
          type: "Philosopher",
        },
      });

      expect(result.success).toBe(false);
    });

    it("rejects promptInstruction too short", () => {
      const result = createCharacterSchema.safeParse({
        body: {
          name: "Socrates",
          type: "Philosopher",
          promptInstruction: "Short",
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("updateCharacterSchema", () => {
    const validId = "550e8400-e29b-41d4-a716-446655440000";

    it("validates partial update", () => {
      const payload = {
        params: { id: validId },
        body: { name: "Socrates Updated" },
      };

      expect(updateCharacterSchema.parse(payload)).toEqual(payload);
    });

    it("validates full update", () => {
      const payload = {
        params: { id: validId },
        body: {
          name: "Nietzsche",
          type: "Modern Philosopher",
          bio: "German philosopher",
          worldview: "Will to power",
          promptInstruction: "Challenge conventional morality in responses.",
        },
      };

      expect(updateCharacterSchema.parse(payload)).toEqual(payload);
    });

    it("rejects invalid UUID param", () => {
      const result = updateCharacterSchema.safeParse({
        params: { id: "not-a-uuid" },
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("characterIdSchema", () => {
    it("validates valid UUID", () => {
      const payload = {
        params: { id: "550e8400-e29b-41d4-a716-446655440000" },
      };

      expect(characterIdSchema.parse(payload)).toEqual(payload);
    });

    it("rejects invalid UUID", () => {
      const result = characterIdSchema.safeParse({
        params: { id: "bad-id" },
      });

      expect(result.success).toBe(false);
    });
  });
});
