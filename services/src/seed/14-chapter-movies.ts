import type { PrismaClient } from "../prisma/generated/client.js";
import { ChapterCsvParser } from "./utils/chapter-csv-parser.js";
import { seedLog } from "./utils/index.js";
import xlsx from "xlsx";
import * as path from "path";
import * as fs from "fs";

function parseMovieExcel(filePath: string): any[] {
  const workbook = xlsx.readFile(filePath);
  const nodesSheet = workbook.Sheets["02_KICH_BAN_NODES"];
  const choicesSheet = workbook.Sheets["03_LUA_CHON"];

  if (!nodesSheet || !choicesSheet) {
    console.warn(`Missing required sheets in ${filePath}`);
    return [];
  }

  const nodesData: any[][] = xlsx.utils.sheet_to_json(nodesSheet, { header: 1 });
  const choicesData: any[][] = xlsx.utils.sheet_to_json(choicesSheet, { header: 1 });

  const nodesRows = nodesData.slice(2).filter((row) => row.length > 0 && row[1]);
  const choicesRows = choicesData.slice(2).filter((row) => row.length > 0 && row[0]);

  const choicesByNodeId: Record<string, any[]> = {};
  for (const row of choicesRows) {
    const nodeId = row[0]?.toString().trim();
    const optionText = row[2];
    const isCorrect = row[3] === "Có" || row[3] === true || row[3] === "Có*";
    const dc = row[4];
    const replySpeaker = row[5];
    const replyMood = row[6];
    const replyText = row[7];

    if (!choicesByNodeId[nodeId]) choicesByNodeId[nodeId] = [];

    const opt: any = {
      text: optionText,
      reply: {
        t: "say",
        who: replySpeaker,
        text: replyText,
      },
    };
    if (isCorrect) opt.correct = true;
    if (dc != null && dc !== "") opt.dc = Number(dc);
    if (replyMood && replyMood !== "") opt.reply.mood = replyMood;

    choicesByNodeId[nodeId].push(opt);
  }

  const script: any[] = [];
  for (const row of nodesRows) {
    const nodeId = row[1]?.toString().trim();
    const actNo = row[2];
    const nodeType = row[3]?.toString().trim();
    const background = row[5];
    const sceneName = row[6];
    const speakerKey = row[7];
    const mood = row[8];
    const textQuestion = row[9];
    const actRoman = row[10];

    if (nodeType === "scene") {
      script.push({
        t: "scene",
        bg: background,
        act: actNo ? Number(actNo) : undefined,
        name: sceneName,
      });
    } else if (nodeType === "say") {
      const node: any = { t: "say", who: speakerKey, text: textQuestion };
      if (mood) node.mood = mood;
      script.push(node);
    } else if (nodeType === "choice") {
      const node: any = { t: "choice", who: speakerKey, q: textQuestion };
      if (mood) node.mood = mood;
      node.opts = choicesByNodeId[nodeId] || [];
      script.push(node);
    } else if (nodeType === "act") {
      script.push({ t: "act", n: actRoman });
    } else if (nodeType === "end") {
      script.push({ t: "end" });
    }
  }

  return script;
}

const THEORY_CARD_TITLES_BY_MUC: Record<string, string[]> = {
  "1.1": [
    "Dòng chảy tư tưởng kinh tế",
    "Thuật ngữ kinh tế chính trị",
    "Các trường phái trước Mác",
    "Mác - Ăngghen phát triển lý luận",
    "Lênin bổ sung trong điều kiện mới",
    "Tóm tắt cần nhớ",
  ],
  "1.2.1": [
    "Câu hỏi về đối tượng nghiên cứu",
    "Các cách tiếp cận trước Mác",
    "Đối tượng nghiên cứu cốt lõi",
    "Hai nghĩa của kinh tế chính trị",
    "Lưu ý: không nghiên cứu kỹ thuật",
    "Các quan hệ xã hội cần phân tích",
  ],
  "1.2.2": [
    "Học để hiểu quy luật",
    "Mục đích nghiên cứu cao nhất",
    "Quy luật kinh tế là gì",
    "Phân biệt quy luật và chính sách",
    "Ý nghĩa phát triển xã hội",
    "Tóm tắt cần nhớ",
  ],
  "1.2.3": [
    "Vì sao cần phương pháp",
    "Phương pháp biện chứng duy vật",
    "Trừu tượng hóa khoa học",
    "Logic và lịch sử",
    "Gắn lý luận với thực tiễn",
    "Tóm tắt cần nhớ",
  ],
  "1.3.1": [
    "Nhận thức để thấy bản chất",
    "Cung cấp tri thức khoa học",
    "Phát hiện quy luật kinh tế",
    "Hiểu lợi ích và quan hệ xã hội",
    "Tránh nhìn hiện tượng bề ngoài",
    "Tóm tắt cần nhớ",
  ],
  "1.3.2": [
    "Biến hiểu biết thành hành động",
    "Vận dụng quy luật vào đời sống",
    "Cải tạo thực tiễn xã hội",
    "Giải quyết hài hòa lợi ích",
    "Vai trò với sinh viên",
    "Tóm tắt cần nhớ",
  ],
  "1.3.3": [
    "Từ tri thức đến niềm tin",
    "Xây dựng thế giới quan khoa học",
    "Bồi dưỡng lý tưởng tiến bộ",
    "Định hướng thái độ xã hội",
    "Lưu ý tránh học thuộc máy móc",
    "Tóm tắt cần nhớ",
  ],
  "1.3.4": [
    "Cần nền tảng lý luận chung",
    "Hiểu bản chất sau hiện tượng",
    "Cơ sở cho khoa học chuyên ngành",
    "Nhìn kinh tế trong quan hệ xã hội",
    "Định hướng cách phân tích",
    "Tóm tắt cần nhớ",
  ],
};

function withTheoryCardTitles<
  T extends { muc: string; theoryCards: Array<Record<string, unknown>> },
>(node: T): T {
  const titles = THEORY_CARD_TITLES_BY_MUC[node.muc] ?? [];

  return {
    ...node,
    theoryCards: node.theoryCards.map((card, index) => ({
      ...card,
      title: titles[index] ?? card.title ?? `Ý chính ${index + 1}`,
    })),
  };
}

export async function seedChapterMovies(prisma: PrismaClient): Promise<void> {
  const chapters = ChapterCsvParser.listChapters();
  let chaptersSeeded = 0;
  let nodesSeeded = 0;
  let moviesSeeded = 0;

  for (const ch of chapters) {
    // 1. Seed Chapter
    const existingChapter = await prisma.chapter.findUnique({
      where: { code: ch.id },
    });

    const chapter = existingChapter
      ? await prisma.chapter.update({
          where: { id: existingChapter.id },
          data: {
            title: ch.title,
            order: ch.order,
          },
        })
      : await prisma.chapter.create({
          data: {
            code: ch.id,
            title: ch.title,
            order: ch.order,
          },
        });

    chaptersSeeded++;

    // 2. Seed Chapter Nodes
    try {
      const nodes = ChapterCsvParser.listNodes(ch.id);
      for (const node of nodes) {
        const nodeData = withTheoryCardTitles(node);
        const existingNode = await prisma.chapterNode.findUnique({
          where: {
            chapterId_muc: {
              chapterId: chapter.id,
              muc: node.muc,
            },
          },
        });

        if (existingNode) {
          await prisma.chapterNode.update({
            where: { id: existingNode.id },
            data: {
              title: nodeData.title,
              data: nodeData as any,
            },
          });
        } else {
          await prisma.chapterNode.create({
            data: {
              chapterId: chapter.id,
              muc: nodeData.muc,
              title: nodeData.title,
              data: nodeData as any,
            },
          });
        }
        nodesSeeded++;
      }
    } catch (e) {
      console.warn(`    ⚠ Skipping nodes for ${ch.id} due to error: ${e}`);
    }
  }

  // 3. Seed Movie Scripts from Excel
  // Navigate back from services/src/seed to data/14-chapter-movies
  // Assuming the process runs from 'services' directory via npm run seed
  // but just to be safe using path.resolve
  const dataDir = path.resolve(__dirname, "../../../../data/14-chapter-movies");
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".xlsx") && !f.startsWith("~"));
    for (const file of files) {
      // Expected format: Kich_Ban_Game_Chuong1_Muc_1_3.xlsx or Kich_Ban_Game_Chuong1_Muc_1_3_1.xlsx
      const match = file.match(/Muc_(\d+)_(\d+)(?:_(\d+))?(?:_(\d+))?/i);
      if (match) {
        const parts = [match[1], match[2], match[3], match[4]].filter(Boolean);
        const muc = parts.join(".");
        const chapterId = match[1]; // assuming chapter id matches the first number

        const existingChapter = await prisma.chapter.findUnique({ where: { code: chapterId } });
        if (!existingChapter) continue; // skip if chapter doesn't exist

        let finalMuc = muc;
        // Hardcode specific mappings for Chapter 2 where filenames don't align with exact Node muc
        if (finalMuc === "2.2") finalMuc = "2.2.1.1";
        if (finalMuc === "2.3") finalMuc = "2.2.3";

        const existingNode = await prisma.chapterNode.findUnique({
          where: { chapterId_muc: { chapterId: existingChapter.id, muc: finalMuc } },
        });

        if (!existingNode) {
          const subMuc = `${finalMuc}.1`;
          const subNode = await prisma.chapterNode.findUnique({
            where: { chapterId_muc: { chapterId: existingChapter.id, muc: subMuc } },
          });
          if (subNode) {
            finalMuc = subMuc;
          }
        }

        const filePath = path.join(dataDir, file);
        try {
          const script = parseMovieExcel(filePath);

          if (script.length > 0) {
            // Find the chapter node id for this muc
            const chapterNode = await prisma.chapterNode.findFirst({
              where: { chapterId: existingChapter.id, muc: finalMuc },
            });

            const existingMovie = await prisma.movie.findFirst({
              where: { muc: finalMuc },
            });

            if (existingMovie) {
              await prisma.movie.update({
                where: { id: existingMovie.id },
                data: {
                  chapterId: existingChapter.id,
                  chapterNodeId: chapterNode ? chapterNode.id : null,
                  title: `Phim tương tác: ${existingChapter.title} - Mục ${finalMuc}`,
                  script: script as any,
                },
              });
            } else {
              await prisma.movie.create({
                data: {
                  chapterId: existingChapter.id,
                  chapterNodeId: chapterNode ? chapterNode.id : null,
                  muc: finalMuc,
                  title: `Phim tương tác: ${existingChapter.title} - Mục ${finalMuc}`,
                  script: script as any,
                },
              });
            }
            moviesSeeded++;
          }
        } catch (e) {
          console.warn(`    ⚠ Error parsing ${file}: ${e}`);
        }
      }
    }
  } else {
    console.warn(`    ⚠ Directory not found: ${dataDir}`);
  }

  seedLog("Chapters", chaptersSeeded);
  seedLog("Chapter Nodes", nodesSeeded);
  seedLog("Interactive Movies", moviesSeeded);
}
