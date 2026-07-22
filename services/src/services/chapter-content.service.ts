import { prisma } from "../config/prisma.js";
import { ActivityLogService, ActivityType } from "./activity-log.service.js";
import { TargetType } from "../prisma/generated/client.js";

export class ChapterContentService {
  static async getChaptersFromDb() {
    const chapters = await prisma.chapter.findMany({
      orderBy: { code: "asc" },
    });
    return chapters.map((ch) => ({
      id: ch.code,
      title: ch.title,
      order: ch.order,
      nodeCount: ch.order ? ch.order.length : 0,
    }));
  }

  static async getNodesFromDb(chapterCode: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { code: chapterCode },
      include: {
        nodes: { orderBy: { muc: "asc" } },
        movies: true,
      },
    });

    if (!chapter) {
      throw new Error("Không tìm thấy chương");
    }

    return {
      order: chapter.order,
      nodes: chapter.nodes.map((n) => {
        const data = n.data as any;
        const hasMovie = chapter.movies.some((m) => m.muc === n.muc);
        return {
          chuong: data.chuong,
          muc: data.muc,
          title: data.title,
          order: data.order,
          hookType: data.hookType,
          steps: ["hook", "theory", "quiz"],
          theoryCards: data.theoryCards,
          hasMovie,
        };
      }),
    };
  }

  static async getNodeByMucFromDb(chapterCode: string, muc: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { code: chapterCode },
    });

    if (!chapter) {
      throw new Error("Không tìm thấy chương");
    }

    const node = await prisma.chapterNode.findUnique({
      where: {
        chapterId_muc: {
          chapterId: chapter.id,
          muc: muc,
        },
      },
    });

    if (!node) {
      throw new Error("Không tìm thấy node bài học");
    }

    const movie = await prisma.movie.findFirst({
      where: {
        chapterId: chapter.id,
        muc: muc,
      },
    });

    const data = node.data as any;
    data.hasMovie = !!movie;
    return data;
  }

  static async getChapterProgress(userId: string, chapterCode: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { code: chapterCode },
    });
    if (!chapter) throw new Error("Không tìm thấy chương");

    const progressRecords = await prisma.userChapterProgress.findMany({
      where: {
        userId,
        chapterId: chapter.id,
      },
    });

    const progressObj: Record<string, any> = {};
    for (const rec of progressRecords) {
      progressObj[rec.muc] = {
        status: rec.status,
        score: rec.score,
        review: rec.review,
        draft: rec.draft,
      };
    }
    return progressObj;
  }

  static async getAllChapterProgress(userId: string) {
    const progressRecords = await prisma.userChapterProgress.findMany({
      where: { userId },
      include: {
        chapter: true,
      },
    });

    const progressObj: Record<string, Record<string, any>> = {};
    for (const rec of progressRecords) {
      if (!progressObj[rec.chapter.code]) {
        progressObj[rec.chapter.code] = {};
      }
      progressObj[rec.chapter.code][rec.muc] = {
        status: rec.status,
        score: rec.score,
        review: rec.review,
        draft: rec.draft,
      };
    }
    return progressObj;
  }

  static async upsertChapterProgress(
    userId: string,
    chapterCode: string,
    muc: string,
    payload: { status: string; score?: number | null; review?: any; draft?: any },
  ) {
    const chapter = await prisma.chapter.findUnique({
      where: { code: chapterCode },
    });
    if (!chapter) throw new Error("Không tìm thấy chương");

    const node = await prisma.chapterNode.findUnique({
      where: {
        chapterId_muc: { chapterId: chapter.id, muc },
      },
    });
    if (!node) throw new Error("Không tìm thấy node");

    const existing = await prisma.userChapterProgress.findUnique({
      where: {
        userId_chapterNodeId: {
          userId,
          chapterNodeId: node.id,
        },
      },
    });

    const isNowDone = payload.status === "done";
    const wasDone = existing?.status === "done";

    let result;
    if (existing) {
      result = await prisma.userChapterProgress.update({
        where: { id: existing.id },
        data: {
          status: payload.status ?? existing.status,
          score: payload.score !== undefined ? payload.score : existing.score,
          review: payload.review !== undefined ? payload.review : existing.review,
          draft: payload.draft !== undefined ? payload.draft : existing.draft,
        },
      });
    } else {
      result = await prisma.userChapterProgress.create({
        data: {
          userId,
          chapterId: chapter.id,
          chapterNodeId: node.id,
          muc,
          status: payload.status,
          score: payload.score,
          review: payload.review ?? null,
          draft: payload.draft ?? null,
        },
      });
    }

    if (isNowDone && !wasDone) {
      try {
        await ActivityLogService.logActivity(
          userId,
          ActivityType.LEARN_LESSON,
          TargetType.LESSON,
          node.id,
          { chapterCode, muc },
        );
      } catch (err) {
        console.error("Error logging activity during upsertChapterProgress:", err);
      }
    }

    return result;
  }
}
