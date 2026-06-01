import type { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type {
  CreateMiniGameInput,
  ListMiniGamesQuery,
  MiniGameType,
  PlayMiniGameInput,
  UpdateMiniGameInput,
} from "../validators/minigame.validator.js";

// ── T-H03: MiniGame Service ──────────────────────────────────

const miniGameInclude = {
  topic: {
    select: {
      id: true,
      title: true,
      category: true,
    },
  },
} satisfies Prisma.MiniGameInclude;

const leaderboardInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.MiniGameAttemptInclude;

export type ScoreResult = {
  score: number;
  result: {
    isCorrect: boolean;
    correctCount: number;
    total: number;
    accuracy: number;
    gameType: MiniGameType;
    feedback: string;
  };
};

export class MiniGameService {
  async list(query: ListMiniGamesQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = this.buildWhere(query);

    const [games, total] = await Promise.all([
      prisma.miniGame.findMany({
        where,
        include: miniGameInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.miniGame.count({ where }),
    ]);

    return {
      games,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getById(miniGameId: string) {
    const game = await prisma.miniGame.findUnique({
      where: { id: miniGameId },
      include: miniGameInclude,
    });

    if (!game) {
      throw new MiniGameError("MINIGAME_NOT_FOUND", "Không tìm thấy mini game", 404);
    }

    return game;
  }

  async create(input: CreateMiniGameInput) {
    if (input.topicId) {
      await this.ensureTopicExists(input.topicId);
    }

    return prisma.miniGame.create({
      data: this.toCreateData(input),
      include: miniGameInclude,
    });
  }

  async update(miniGameId: string, input: UpdateMiniGameInput) {
    await this.ensureMiniGameExists(miniGameId);

    if (input.topicId) {
      await this.ensureTopicExists(input.topicId);
    }

    return prisma.miniGame.update({
      where: { id: miniGameId },
      data: this.toUpdateData(input),
      include: miniGameInclude,
    });
  }

  async delete(miniGameId: string) {
    const result = await prisma.miniGame.deleteMany({
      where: { id: miniGameId },
    });

    if (result.count === 0) {
      throw new MiniGameError("MINIGAME_NOT_FOUND", "Không tìm thấy mini game", 404);
    }
  }

  async play(miniGameId: string, userId: string, input: PlayMiniGameInput) {
    const game = await prisma.miniGame.findUnique({
      where: { id: miniGameId },
      select: {
        id: true,
        title: true,
        gameType: true,
        config: true,
      },
    });

    if (!game) {
      throw new MiniGameError("MINIGAME_NOT_FOUND", "Không tìm thấy mini game", 404);
    }

    const scored = this.scoreGame(game.gameType, game.config, input.answers);

    const attempt = await prisma.miniGameAttempt.create({
      data: {
        miniGameId,
        userId,
        score: scored.score,
        resultData: {
          ...scored.result,
          answers: input.answers,
          timeSpentSeconds: input.timeSpentSeconds,
        } as Prisma.InputJsonValue,
        completedAt: new Date(),
      },
    });

    const leaderboardRank = await this.getRank(miniGameId, attempt.score, attempt.createdAt);

    return {
      attemptId: attempt.id,
      miniGameId,
      userId,
      score: attempt.score,
      result: scored.result,
      leaderboardRank,
      timeSpentSeconds: input.timeSpentSeconds,
      completedAt: attempt.completedAt,
    };
  }

  async getLeaderboard(miniGameId: string) {
    await this.ensureMiniGameExists(miniGameId);

    const attempts = await prisma.miniGameAttempt.findMany({
      where: { miniGameId },
      include: leaderboardInclude,
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: 10,
    });

    return attempts.map((attempt, index) => ({
      rank: index + 1,
      attemptId: attempt.id,
      userId: attempt.userId,
      user: attempt.user,
      score: attempt.score,
      resultData: attempt.resultData,
      completedAt: attempt.completedAt,
      createdAt: attempt.createdAt,
    }));
  }

  private buildWhere(query: ListMiniGamesQuery): Prisma.MiniGameWhereInput {
    return {
      ...(query.topicId ? { topicId: query.topicId } : {}),
      ...(query.type ? { gameType: query.type } : {}),
    };
  }

  private toCreateData(input: CreateMiniGameInput): Prisma.MiniGameUncheckedCreateInput {
    return {
      topicId: input.topicId ?? null,
      title: input.title,
      gameType: input.gameType,
      description: input.description ?? null,
      ...(input.config !== undefined ? { config: input.config as Prisma.InputJsonValue } : {}),
    };
  }

  private toUpdateData(input: UpdateMiniGameInput): Prisma.MiniGameUncheckedUpdateInput {
    return {
      ...(input.topicId !== undefined ? { topicId: input.topicId } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.gameType !== undefined ? { gameType: input.gameType } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.config !== undefined ? { config: input.config as Prisma.InputJsonValue } : {}),
    };
  }

  private async ensureTopicExists(topicId: string) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });

    if (!topic) {
      throw new MiniGameError("TOPIC_NOT_FOUND", "Không tìm thấy topic", 404);
    }
  }

  private async ensureMiniGameExists(miniGameId: string) {
    const game = await prisma.miniGame.findUnique({
      where: { id: miniGameId },
      select: { id: true },
    });

    if (!game) {
      throw new MiniGameError("MINIGAME_NOT_FOUND", "Không tìm thấy mini game", 404);
    }
  }

  private async getRank(miniGameId: string, score: number, createdAt: Date) {
    const betterAttempts = await prisma.miniGameAttempt.count({
      where: {
        miniGameId,
        OR: [{ score: { gt: score } }, { score, createdAt: { lt: createdAt } }],
      },
    });

    return betterAttempts + 1;
  }

  scoreGame(gameType: string, config: Prisma.JsonValue | null, answers: unknown): ScoreResult {
    switch (gameType) {
      case "matching":
        return this.scoreMatching(config, answers);
      case "guess-who":
        return this.scoreGuessWho(config, answers);
      case "logic-puzzle":
        return this.scoreLogicPuzzle(config, answers);
      default:
        throw new MiniGameError(
          "UNSUPPORTED_MINIGAME_TYPE",
          "Loại mini game không được hỗ trợ",
          400,
        );
    }
  }

  private scoreMatching(config: Prisma.JsonValue | null, answers: unknown): ScoreResult {
    const pairs = this.readArray(config, "pairs");
    const matches = this.readAnswerArray(answers, "matches");
    const total = pairs.length;
    const correctCount = pairs.filter((pair) =>
      matches.some(
        (match) =>
          this.normalize(match.left) === this.normalize(this.getPairSide(pair, "left")) &&
          this.normalize(match.right) === this.normalize(this.getPairSide(pair, "right")),
      ),
    ).length;

    return this.buildResult("matching", correctCount, total);
  }

  private scoreGuessWho(config: Prisma.JsonValue | null, answers: unknown): ScoreResult {
    const configObject = this.asRecord(config);
    const characters = this.readArray(config, "characters");
    if (characters.length > 0) {
      const answerObject = this.asRecord(answers);
      const characterAnswers = this.readAnswerArray(answers, "characterAnswers");
      const total = characters.length;
      const correctCount = characters.filter((character) => {
        const name = this.normalize(character.name);
        const acceptedAnswers = [
          character.answer,
          ...this.readScalarArray(character, "acceptedAnswers"),
        ]
          .map((answer) => this.normalize(answer))
          .filter(Boolean);
        const submitted =
          characterAnswers.find((answer) => this.normalize(answer.name) === name)?.answer ??
          this.asRecord(answerObject.answers)[String(character.name ?? "")] ??
          answerObject[String(character.name ?? "")];

        return acceptedAnswers.includes(this.normalize(submitted));
      }).length;

      return this.buildResult("guess-who", correctCount, total);
    }

    const userAnswer = this.normalize(this.asRecord(answers).answer);
    const acceptedAnswers = [
      configObject.answer,
      ...this.readScalarArray(config, "acceptedAnswers"),
    ]
      .map((answer) => this.normalize(answer))
      .filter(Boolean);
    const correctCount = acceptedAnswers.includes(userAnswer) ? 1 : 0;

    return this.buildResult("guess-who", correctCount, acceptedAnswers.length > 0 ? 1 : 0);
  }

  private scoreLogicPuzzle(config: Prisma.JsonValue | null, answers: unknown): ScoreResult {
    const solution = this.normalize(this.asRecord(config).solution);
    const userSolution = this.normalize(this.asRecord(answers).solution);
    const correctCount = solution && userSolution === solution ? 1 : 0;

    return this.buildResult("logic-puzzle", correctCount, solution ? 1 : 0);
  }

  private buildResult(gameType: MiniGameType, correctCount: number, total: number): ScoreResult {
    if (total === 0) {
      throw new MiniGameError(
        "INVALID_MINIGAME_CONFIG",
        "Mini game chưa có đáp án để chấm điểm",
        400,
      );
    }

    const accuracy = correctCount / total;
    const score = Math.round(accuracy * 100);

    return {
      score,
      result: {
        isCorrect: correctCount === total,
        correctCount,
        total,
        accuracy,
        gameType,
        feedback: correctCount === total ? "correct" : "try_again",
      },
    };
  }

  private readArray(value: unknown, key: string): Record<string, unknown>[] {
    const candidate = this.asRecord(value)[key];
    return Array.isArray(candidate) ? candidate.filter(this.isRecord) : [];
  }

  private readAnswerArray(value: unknown, key: string): Record<string, unknown>[] {
    const candidate = this.asRecord(value)[key];
    return Array.isArray(candidate) ? candidate.filter(this.isRecord) : [];
  }

  private readScalarArray(value: unknown, key: string): unknown[] {
    const candidate = this.asRecord(value)[key];
    return Array.isArray(candidate) ? candidate : [];
  }

  private getPairSide(pair: Record<string, unknown>, side: "left" | "right") {
    if (pair[side] !== undefined) return pair[side];
    const values = Object.values(pair);
    return side === "left" ? values[0] : values[1];
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return this.isRecord(value) ? value : {};
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private normalize(value: unknown): string {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  }
}

export class MiniGameError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "MiniGameError";
  }
}

export const miniGameService = new MiniGameService();
