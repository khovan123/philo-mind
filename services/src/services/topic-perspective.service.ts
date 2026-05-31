import { prisma } from "../config/prisma.js";
import type {
  CreateTopicPerspectiveInput,
  UpdateTopicPerspectiveInput,
} from "../validators/topic-perspective.validator.js";

// ── T-H01: TopicPerspective Service ───────────────────────────

export class TopicPerspectiveError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "TopicPerspectiveError";
  }
}

export class TopicPerspectiveService {
  async listByTopic(topicId: string) {
    await this.ensureTopicExists(topicId);
    return prisma.topicPerspective.findMany({
      where: { topicId },
      orderBy: { perspectiveType: "asc" },
    });
  }

  async create(topicId: string, input: CreateTopicPerspectiveInput) {
    await this.ensureTopicExists(topicId);

    // Check unique constraint: one perspective type per topic
    const existing = await prisma.topicPerspective.findUnique({
      where: {
        topicId_perspectiveType: {
          topicId,
          perspectiveType: input.perspectiveType,
        },
      },
    });

    if (existing) {
      throw new TopicPerspectiveError(
        "PERSPECTIVE_ALREADY_EXISTS",
        "Góc nhìn của chủ đề này đã tồn tại",
        409,
      );
    }

    return prisma.topicPerspective.create({
      data: {
        topicId,
        perspectiveType: input.perspectiveType,
        content: input.content,
      },
    });
  }

  async update(topicId: string, id: string, input: UpdateTopicPerspectiveInput) {
    await this.ensurePerspectiveBelongsToTopic(id, topicId);

    return prisma.topicPerspective.update({
      where: { id },
      data: {
        content: input.content,
      },
    });
  }

  async delete(topicId: string, id: string) {
    await this.ensurePerspectiveBelongsToTopic(id, topicId);
    await prisma.topicPerspective.delete({ where: { id } });
  }

  // ── Private helpers ─────────────────────────────────────────

  private async ensureTopicExists(topicId: string) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });
    if (!topic) {
      throw new TopicPerspectiveError("TOPIC_NOT_FOUND", "Không tìm thấy chủ đề (topic)", 404);
    }
  }

  private async ensurePerspectiveBelongsToTopic(id: string, topicId: string) {
    const perspective = await prisma.topicPerspective.findUnique({
      where: { id },
      select: { id: true, topicId: true },
    });
    if (!perspective) {
      throw new TopicPerspectiveError(
        "PERSPECTIVE_NOT_FOUND",
        "Không tìm thấy góc nhìn (perspective)",
        404,
      );
    }
    if (perspective.topicId !== topicId) {
      throw new TopicPerspectiveError(
        "PERSPECTIVE_TOPIC_MISMATCH",
        "Góc nhìn không thuộc chủ đề này",
        403,
      );
    }
  }
}

export const topicPerspectiveService = new TopicPerspectiveService();
