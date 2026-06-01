import { prisma } from "../config/prisma.js";
import type {
  CreateStoryLearnCardInput,
  UpdateStoryLearnCardInput,
} from "../validators/story-learn-card.validator.js";

// ── T-D01: StoryLearnCard Service ────────────────────────────

export class StoryLearnCardError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "StoryLearnCardError";
  }
}

export class StoryLearnCardService {
  async listByStory(storyId: string) {
    await this.ensureStoryExists(storyId);
    return prisma.storyLearnCard.findMany({
      where: { storyId },
      include: { tags: { include: { tag: true } } },
      orderBy: { order: "asc" },
    });
  }

  async create(storyId: string, input: CreateStoryLearnCardInput) {
    await this.ensureStoryExists(storyId);

    const { tagIds, ...cardData } = input;

    // Validate tag ids exist if provided
    if (tagIds && tagIds.length > 0) {
      await this.ensureTagsExist(tagIds);
    }

    return prisma.storyLearnCard.create({
      data: {
        storyId,
        ...cardData,
        ...(tagIds && tagIds.length > 0
          ? {
              tags: {
                create: tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async update(storyId: string, cardId: string, input: UpdateStoryLearnCardInput) {
    await this.ensureCardBelongsToStory(cardId, storyId);

    const { tagIds, ...cardData } = input;

    // If tagIds provided, replace all existing tags
    if (tagIds !== undefined) {
      await this.ensureTagsExist(tagIds);
      await prisma.storyLearnCardTag.deleteMany({ where: { cardId } });
    }

    return prisma.storyLearnCard.update({
      where: { id: cardId },
      data: {
        ...cardData,
        ...(tagIds !== undefined
          ? {
              tags: {
                create: tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async delete(storyId: string, cardId: string) {
    await this.ensureCardBelongsToStory(cardId, storyId);
    await prisma.storyLearnCard.delete({ where: { id: cardId } });
  }

  // ── Private helpers ─────────────────────────────────────────

  private async ensureStoryExists(storyId: string) {
    const story = await prisma.storyScenario.findUnique({
      where: { id: storyId },
      select: { id: true },
    });
    if (!story) {
      throw new StoryLearnCardError("STORY_NOT_FOUND", "Không tìm thấy story scenario", 404);
    }
  }

  private async ensureCardBelongsToStory(cardId: string, storyId: string) {
    const card = await prisma.storyLearnCard.findUnique({
      where: { id: cardId },
      select: { id: true, storyId: true },
    });
    if (!card) {
      throw new StoryLearnCardError("CARD_NOT_FOUND", "Không tìm thấy learn card", 404);
    }
    if (card.storyId !== storyId) {
      throw new StoryLearnCardError("CARD_STORY_MISMATCH", "Learn card không thuộc story này", 403);
    }
  }

  private async ensureTagsExist(tagIds: string[]) {
    const tags = await prisma.philosophyTag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });
    if (tags.length !== tagIds.length) {
      throw new StoryLearnCardError(
        "TAG_NOT_FOUND",
        "Một hoặc nhiều philosophy tag không tồn tại",
        404,
      );
    }
  }
}

export const storyLearnCardService = new StoryLearnCardService();
