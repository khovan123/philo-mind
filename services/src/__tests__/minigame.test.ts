import { jest } from "@jest/globals";
import {
  createMiniGameSchema,
  listMiniGamesSchema,
  playMiniGameSchema,
  updateMiniGameSchema,
} from "../validators/minigame.validator.js";

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {},
}));

const { MiniGameService } = await import("../services/minigame.service.js");
const { MINI_GAMES } = await import("../seed/data/minigames.js");

// ── T-H03: MiniGame Validator Tests ──────────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("createMiniGameSchema", () => {
  it("accepts matching, guess-who, and logic-puzzle game types", () => {
    for (const gameType of ["matching", "guess-who", "logic-puzzle"] as const) {
      const result = createMiniGameSchema.safeParse({
        body: {
          topicId: VALID_UUID,
          title: `Game ${gameType}`,
          gameType,
          description: "Mini game description",
          config: { rules: ["answer carefully"] },
        },
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an unsupported game type", () => {
    const result = createMiniGameSchema.safeParse({
      body: {
        title: "Unsupported game",
        gameType: "memory",
        config: {},
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("updateMiniGameSchema", () => {
  it("accepts a partial config update", () => {
    const result = updateMiniGameSchema.safeParse({
      params: { id: VALID_UUID },
      body: { config: { solution: "Socrates" } },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty update body", () => {
    const result = updateMiniGameSchema.safeParse({
      params: { id: VALID_UUID },
      body: {},
    });
    expect(result.success).toBe(false);
  });
});

describe("listMiniGamesSchema", () => {
  it("accepts topic and type filters", () => {
    const result = listMiniGamesSchema.safeParse({
      query: {
        topicId: VALID_UUID,
        type: "matching",
        page: "1",
        limit: "10",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("playMiniGameSchema", () => {
  it("accepts answers and time spent", () => {
    const result = playMiniGameSchema.safeParse({
      params: { id: VALID_UUID },
      body: {
        answers: {
          matches: [{ left: "virtue", right: "arete" }],
        },
        timeSpentSeconds: 42,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative time spent", () => {
    const result = playMiniGameSchema.safeParse({
      params: { id: VALID_UUID },
      body: {
        answers: {},
        timeSpentSeconds: -1,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("MiniGameService scoreGame", () => {
  const service = new MiniGameService();

  it("scores matching games from configured pairs", () => {
    const result = service.scoreGame(
      "matching",
      {
        pairs: [
          { left: "virtue", right: "arete" },
          { left: "wisdom", right: "sophia" },
        ],
      },
      {
        matches: [
          { left: "virtue", right: "arete" },
          { left: "wisdom", right: "wrong" },
        ],
      },
    );

    expect(result.score).toBe(50);
    expect(result.result.gameType).toBe("matching");
    expect(result.result.correctCount).toBe(1);
  });

  it("scores matching games from markdown table pairs", () => {
    const result = service.scoreGame(
      "matching",
      {
        pairs: [
          { "Quan điểm": "Vạn vật biến đổi", "Trường phái": "Biện chứng" },
          { "Quan điểm": "Tồn tại khách quan", "Trường phái": "Duy vật" },
        ],
      },
      {
        matches: [
          { left: "Vạn vật biến đổi", right: "Biện chứng" },
          { left: "Tồn tại khách quan", right: "Duy tâm" },
        ],
      },
    );

    expect(result.score).toBe(50);
    expect(result.result.correctCount).toBe(1);
  });

  it("scores guess-who games using accepted answers", () => {
    const result = service.scoreGame(
      "guess-who",
      {
        answer: "Socrates",
        acceptedAnswers: ["Sokrates"],
      },
      { answer: " sokrates " },
    );

    expect(result.score).toBe(100);
    expect(result.result.gameType).toBe("guess-who");
    expect(result.result.isCorrect).toBe(true);
  });

  it("scores guess-who games from character answers", () => {
    const result = service.scoreGame(
      "guess-who",
      {
        characters: [
          { name: "Nhân vật 1", hints: ["Duy tâm khách quan"], answer: "Hegel" },
          { name: "Nhân vật 2", hints: ["Duy vật Đức"], answer: "Feuerbach" },
        ],
      },
      {
        characterAnswers: [
          { name: "Nhân vật 1", answer: " hegel " },
          { name: "Nhân vật 2", answer: "Marx" },
        ],
      },
    );

    expect(result.score).toBe(50);
    expect(result.result.correctCount).toBe(1);
  });

  it("scores logic-puzzle games from the configured solution", () => {
    const result = service.scoreGame(
      "logic-puzzle",
      { solution: "modus ponens" },
      { solution: "Modus Ponens" },
    );

    expect(result.score).toBe(100);
    expect(result.result.gameType).toBe("logic-puzzle");
    expect(result.result.isCorrect).toBe(true);
  });
});

describe("MINI_GAMES seed configs (T-C11)", () => {
  const service = new MiniGameService();

  it("includes 5 games with all supported types", () => {
    expect(MINI_GAMES).toHaveLength(5);
    expect(MINI_GAMES.filter((game) => game.gameType === "matching")).toHaveLength(2);
    expect(MINI_GAMES.filter((game) => game.gameType === "guess-who")).toHaveLength(2);
    expect(MINI_GAMES.filter((game) => game.gameType === "logic-puzzle")).toHaveLength(1);
  });

  it.each(MINI_GAMES.map((game) => [game.title, game] as const))(
    "scores seeded game %s at 100 when answers are perfect",
    (_title, game) => {
      const result = service.scoreGame(game.gameType, game.config, buildPerfectAnswers(game));
      expect(result.score).toBe(100);
      expect(result.result.isCorrect).toBe(true);
    },
  );
});

function buildPerfectAnswers(game: (typeof MINI_GAMES)[number]) {
  if (game.gameType === "matching") {
    const pairs = (game.config.pairs ?? []) as { left: string; right: string }[];
    return { matches: pairs.map((pair) => ({ left: pair.left, right: pair.right })) };
  }

  if (game.gameType === "guess-who") {
    const characters = (game.config.characters ?? []) as {
      name: string;
      answer: string;
    }[];
    return {
      characterAnswers: characters.map((character) => ({
        name: character.name,
        answer: character.answer,
      })),
    };
  }

  return { solution: String(game.config.solution ?? "") };
}
