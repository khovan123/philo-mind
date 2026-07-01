import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CsvContentReaderService } from "./csv-content-reader.service.js";
import { existsSync, readdirSync } from "node:fs";
import { prisma } from "../config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_DATA_DIR = resolve(__dirname, "../../../data");

type HookType = "choice" | "drag";

type ChapterCsvRow = {
  chuong: string;
  muc: string;
  tieu_de_muc: string;
  hook_type: string;
  drag_items?: string;
  drag_groups?: string;
  drag_answers?: string;
  drag_bridge?: string;
  phan3_boi_canh_ngan?: string;
  phan3_cau_hoi_chon?: string;
  phan3_phan_hoi_A?: string;
  phan3_phan_hoi_B?: string;
  phan1_bai_doc?: string;
  card_icons?: string;
  phan2_cau1_noi_dung?: string;
  phan2_cau1_lua_chon?: string;
  phan2_cau1_dap_an?: string;
  phan2_cau1_loai?: string;
  phan2_cau1_giai_thich?: string;
  phan2_cau2_noi_dung?: string;
  phan2_cau2_lua_chon?: string;
  phan2_cau2_dap_an?: string;
  phan2_cau2_loai?: string;
  phan2_cau2_giai_thich?: string;
  phan2_cau3_noi_dung?: string;
  phan2_cau3_lua_chon?: string;
  phan2_cau3_dap_an?: string;
  phan2_cau3_loai?: string;
  phan2_cau3_giai_thich?: string;
  phan4_quan_diem_A?: string;
  phan4_quan_diem_B?: string;
  phan4_cau_hoi_mo?: string;
  phan4_giai_thich_A?: string;
  phan4_giai_thich_B?: string;
  boi_canh?: string;
  cau_hoi_chon?: string;
  phan_hoi_A?: string;
  phan_hoi_B?: string;
  card_1_icon?: string;
  card_1?: string;
  card_2_icon?: string;
  card_2?: string;
  card_3_icon?: string;
  card_3?: string;
  card_4_icon?: string;
  card_4?: string;
  card_5_icon?: string;
  card_5?: string;
  card_6_icon?: string;
  card_6?: string;
  cau1_hoi?: string;
  cau1_A?: string;
  cau1_B?: string;
  cau1_C?: string;
  cau1_D?: string;
  cau1_dap_an?: string;
  cau1_loai?: string;
  cau1_giai_thich?: string;
  cau2_hoi?: string;
  cau2_A?: string;
  cau2_B?: string;
  cau2_C?: string;
  cau2_D?: string;
  cau2_dap_an?: string;
  cau2_loai?: string;
  cau2_giai_thich?: string;
  cau3_hoi?: string;
  cau3_A?: string;
  cau3_B?: string;
  cau3_C?: string;
  cau3_D?: string;
  cau3_dap_an?: string;
  cau3_loai?: string;
  cau3_giai_thich?: string;
  debate_A?: string;
  debate_B?: string;
  debate_A_explanation?: string;
  debate_B_explanation?: string;
  open_q?: string;
};

export type ChapterMeta = {
  id: string;
  title: string;
  nodeCount: number;
  order: string[];
};

export type ChapterHook =
  | {
      type: "choice";
      situation: string;
      question: string;
      feedbackA: string;
      feedbackB: string;
    }
  | {
      type: "drag";
      items: string[];
      groups: string[];
      answers: { cardIndex: number; groupIndex: number }[];
      bridge: string;
    };

export type ChapterTheoryCard = {
  id: string;
  icon: string;
  body: string;
};

export type ChapterQuizQuestion = {
  id: string;
  type: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type ChapterNode = {
  chuong: number;
  muc: string;
  title: string;
  order: number;
  hookType: HookType;
  hook: ChapterHook;
  theoryCards: ChapterTheoryCard[];
  quiz: ChapterQuizQuestion[];
  debate: {
    perspectiveA: string;
    perspectiveB: string;
    explanationA: string;
    explanationB: string;
    openQuestion: string;
  };
};

export type ChapterNodeSummary = Pick<
  ChapterNode,
  "chuong" | "muc" | "title" | "order" | "hookType"
> & {
  steps: ["hook", "theory", "quiz"];
};

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTheoryCards(value: string | undefined): string[] {
  return (value ?? "")
    .split("||")
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstText(...values: Array<string | undefined>): string {
  return values.find((value) => value?.trim())?.trim() ?? "";
}

function getTheoryCards(row: ChapterCsvRow): ChapterTheoryCard[] {
  const cards = splitTheoryCards(row.phan1_bai_doc);
  const icons = splitList(row.card_icons);

  if (cards.length > 0) {
    return cards.map((body, index) => ({
      id: `card${index + 1}`,
      icon: icons[index] ?? (index === 0 ? "📖" : index === cards.length - 1 ? "✅" : "•"),
      body,
    }));
  }

  return [1, 2, 3, 4, 5, 6]
    .map((index) => ({
      id: `card${index}`,
      icon: firstText(row[`card_${index}_icon` as keyof ChapterCsvRow]),
      body: firstText(row[`card_${index}` as keyof ChapterCsvRow]),
    }))
    .filter((card) => card.body);
}

function parseAnswerIndex(value: string | undefined): number {
  const answer = String(value ?? "")
    .trim()
    .toUpperCase();

  if (/^[A-D]$/.test(answer)) {
    return answer.charCodeAt(0) - "A".charCodeAt(0);
  }

  const parsed = Number.parseInt(answer, 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed > 0 ? parsed - 1 : parsed;
}

function parseLegacyDragAnswers(value: string | undefined) {
  return splitList(value).map((pair) => {
    const [cardPart, groupPart] = pair.split(":");

    return {
      cardIndex: Number.parseInt(cardPart?.replace("c", "") ?? "0", 10),
      groupIndex: Number.parseInt(groupPart?.replace("g", "") ?? "0", 10),
    };
  });
}

function parseDragAnswers(row: ChapterCsvRow) {
  const value = row.drag_answers ?? "";

  if (/\bc\d+\s*:\s*g\d+\b/i.test(value)) {
    return parseLegacyDragAnswers(value).filter(
      (answer) => Number.isFinite(answer.cardIndex) && Number.isFinite(answer.groupIndex),
    );
  }

  const items = splitList(row.drag_items);
  const groups = splitList(row.drag_groups);
  const normalizedAnswers = value.toLocaleLowerCase("vi");

  return items
    .map((item, cardIndex) => {
      const normalizedItem = item.toLocaleLowerCase("vi");
      const itemPosition = normalizedAnswers.indexOf(normalizedItem);

      if (itemPosition < 0) {
        return null;
      }

      const groupIndex = groups.reduce(
        (best, group, index) => {
          const groupPosition = normalizedAnswers.indexOf(group.toLocaleLowerCase("vi"));

          if (
            groupPosition >= 0 &&
            groupPosition <= itemPosition &&
            groupPosition > best.position
          ) {
            return { index, position: groupPosition };
          }

          return best;
        },
        { index: -1, position: -1 },
      ).index;

      return groupIndex >= 0 ? { cardIndex, groupIndex } : null;
    })
    .filter((answer): answer is { cardIndex: number; groupIndex: number } => answer !== null);
}

function buildHook(row: ChapterCsvRow, hookType: HookType): ChapterHook {
  if (hookType === "drag") {
    return {
      type: "drag",
      items: splitList(row.drag_items),
      groups: splitList(row.drag_groups),
      answers: parseDragAnswers(row),
      bridge: row.drag_bridge ?? "",
    };
  }

  return {
    type: "choice",
    situation: firstText(row.phan3_boi_canh_ngan, row.boi_canh),
    question: firstText(row.phan3_cau_hoi_chon, row.cau_hoi_chon),
    feedbackA: firstText(row.phan3_phan_hoi_A, row.phan_hoi_A),
    feedbackB: firstText(row.phan3_phan_hoi_B, row.phan_hoi_B),
  };
}

function buildQuizQuestion(row: ChapterCsvRow, index: 1 | 2 | 3): ChapterQuizQuestion {
  const prefix = `phan2_cau${index}` as const;
  const v2Prefix = `cau${index}` as const;
  const legacyOptions = splitList(row[`${prefix}_lua_chon`]);
  const v2Options = ["A", "B", "C", "D"]
    .map((letter) => row[`${v2Prefix}_${letter}` as keyof ChapterCsvRow])
    .filter((option): option is string => Boolean(option?.trim()));

  return {
    id: `q${index}`,
    question: firstText(row[`${prefix}_noi_dung`], row[`${v2Prefix}_hoi`]),
    options: legacyOptions.length > 0 ? legacyOptions : v2Options,
    answerIndex: parseAnswerIndex(firstText(row[`${prefix}_dap_an`], row[`${v2Prefix}_dap_an`])),
    type: firstText(row[`${prefix}_loai`], row[`${v2Prefix}_loai`]),
    explanation: firstText(row[`${prefix}_giai_thich`], row[`${v2Prefix}_giai_thich`]),
  };
}

function _mapRow(row: ChapterCsvRow, rowIndex: number, chapterNumber: number): ChapterNode {
  const hookType = row.hook_type === "drag" ? "drag" : "choice";
  const cards = splitTheoryCards(row.phan1_bai_doc);
  const icons = splitList(row.card_icons);

  return {
    chuong: Number.parseInt(row.chuong, 10) || chapterNumber,
    muc: row.muc,
    title: row.tieu_de_muc,
    order: rowIndex,
    hookType,
    hook: buildHook(row, hookType),
    theoryCards: cards.map((body, index) => ({
      id: `card${index + 1}`,
      icon: icons[index] ?? (index === 0 ? "📖" : index === cards.length - 1 ? "✅" : "•"),
      body,
    })),
    quiz: [buildQuizQuestion(row, 1), buildQuizQuestion(row, 2), buildQuizQuestion(row, 3)],
    debate: {
      perspectiveA: row.phan4_quan_diem_A ?? "",
      perspectiveB: row.phan4_quan_diem_B ?? "",
      explanationA: row.phan4_giai_thich_A ?? "",
      explanationB: row.phan4_giai_thich_B ?? "",
      openQuestion: row.phan4_cau_hoi_mo ?? "",
    },
  };
}

function mapChapterRow(row: ChapterCsvRow, rowIndex: number, chapterNumber: number): ChapterNode {
  const hookType = row.hook_type === "drag" ? "drag" : "choice";

  return {
    chuong: Number.parseInt(row.chuong, 10) || chapterNumber,
    muc: row.muc,
    title: row.tieu_de_muc,
    order: rowIndex,
    hookType,
    hook: buildHook(row, hookType),
    theoryCards: getTheoryCards(row),
    quiz: [buildQuizQuestion(row, 1), buildQuizQuestion(row, 2), buildQuizQuestion(row, 3)],
    debate: {
      perspectiveA: firstText(row.phan4_quan_diem_A, row.debate_A, row.phan_hoi_A, row.cau1_A),
      perspectiveB: firstText(row.phan4_quan_diem_B, row.debate_B, row.phan_hoi_B, row.cau1_B),
      explanationA: firstText(row.phan4_giai_thich_A, row.debate_A_explanation, row.phan_hoi_A),
      explanationB: firstText(row.phan4_giai_thich_B, row.debate_B_explanation, row.phan_hoi_B),
      openQuestion: firstText(row.phan4_cau_hoi_mo, row.open_q, row.cau_hoi_chon, row.cau3_hoi),
    },
  };
}

function normalizeChapter(chapter: string | number): string {
  const value = String(chapter).trim();

  if (!/^\d+$/.test(value)) {
    throw new Error("Chapter không hợp lệ");
  }

  return value;
}

function getCsvPath(chapter: string | number) {
  const normalizedChapter = normalizeChapter(chapter);

  const envKey = `CHAPTER${normalizedChapter}_CSV_PATH`;
  const envPath = process.env[envKey];

  return envPath || resolve(DEFAULT_DATA_DIR, `content_chuong${normalizedChapter}.csv`);
}

export class ChapterContentService {
  static listNodes(chapter: string | number): ChapterNode[] {
    const normalizedChapter = normalizeChapter(chapter);
    const chapterNumber = Number.parseInt(normalizedChapter, 10);

    return CsvContentReaderService.read<ChapterCsvRow, ChapterNode>({
      csvPath: getCsvPath(normalizedChapter),
      filterRow: (row) => Boolean(row.muc && row.tieu_de_muc),
      mapRow: (row, index) => mapChapterRow(row, index, chapterNumber),
    });
  }

  static getOrder(chapter: string | number): string[] {
    return this.listNodes(chapter).map((node) => node.muc);
  }

  static listChapters(): ChapterMeta[] {
    if (!existsSync(DEFAULT_DATA_DIR)) {
      return [];
    }

    return readdirSync(DEFAULT_DATA_DIR)
      .map((fileName) => {
        const match = fileName.match(/^content_chuong(\d+)\.csv$/);

        if (!match) {
          return null;
        }

        const id = match[1];
        const nodes = this.listNodes(id);

        return {
          id,
          title: `Chương ${id}`,
          nodeCount: nodes.length,
          order: nodes.map((node) => node.muc),
        };
      })
      .filter((chapter): chapter is ChapterMeta => chapter !== null)
      .sort((a, b) => Number(a.id) - Number(b.id));
  }

  static listSummaries(chapter: string | number): ChapterNodeSummary[] {
    return this.listNodes(chapter).map(({ chuong, muc, title, order, hookType }) => ({
      chuong,
      muc,
      title,
      order,
      hookType,
      steps: ["hook", "theory", "quiz"],
    }));
  }

  static getNode(chapter: string | number, muc: string): ChapterNode | null {
    return this.listNodes(chapter).find((node) => node.muc === muc) ?? null;
  }

  // thấy mấy function trên nớ k đọc từ db mà đọc từ cvs nên viết mấy function khác đọc từ db,
  // ai đọc được mấy dòng ni thì xem nên sửa luôn đưa hết data vô db luôn chưa chớ thấy nửa đọc từ cvs nửa đọc từ db sao sao á

  static async getChaptersFromDb() {
    const chapters = await prisma.chapter.findMany({
      orderBy: { code: "asc" },
    });
    return chapters.map((ch) => ({
      id: ch.code,
      title: ch.title,
      order: ch.order,
    }));
  }

  static async getNodesFromDb(chapterCode: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { code: chapterCode },
      include: { nodes: { orderBy: { muc: "asc" } } },
    });

    if (!chapter) {
      throw new Error("Không tìm thấy chương");
    }

    return {
      order: chapter.order,
      nodes: chapter.nodes.map((n) => {
        const data = n.data as any;
        return {
          chuong: data.chuong,
          muc: data.muc,
          title: data.title,
          order: data.order,
          hookType: data.hookType,
          steps: ["hook", "theory", "quiz"],
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

    return node.data;
  }
}
