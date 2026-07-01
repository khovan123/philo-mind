import { PrismaClient } from "../prisma/generated/client.js";
import { ChapterContentService } from "../services/chapter-content.service.js";
import { seedLog } from "./utils/index.js";

const chapter1IntroScript = [
  { t: "scene", bg: "thukho", act: 1, name: "Màn I · Nguồn gốc" },
  {
    t: "say",
    who: "narr",
    text: "Tầng hầm lưu trữ của viện. Mùi giấy cũ phảng phất. GS. Lâm đặt lên bàn một cuốn sách bìa da đã sờn.",
  },
  {
    t: "say",
    who: "lam",
    mood: "neutral",
    text: "Chào trợ lý mới. Muốn được đứng tên trong hội thảo “Nhập môn Kinh tế chính trị Mác - Lênin”, cậu phải qua ba cửa. Cửa đầu tiên ở ngay đây.",
  },
  {
    t: "choice",
    who: "lam",
    mood: "neutral",
    q: "Cậu thấy sẵn sàng chứ?",
    opts: [
      {
        text: "Em sẵn sàng ạ. Bắt đầu thôi.",
        dc: 8,
        reply: { t: "say", who: "lam", mood: "happy", text: "Tinh thần tốt. Tôi thích thế." },
      },
      {
        text: "Em hơi lo, nhưng em sẽ cố.",
        dc: 2,
        reply: {
          t: "say",
          who: "lam",
          mood: "neutral",
          text: "Lo một chút cũng được — miễn là chắc kiến thức.",
        },
      },
    ],
  },
  {
    t: "say",
    who: "an",
    mood: "neutral",
    text: "Cuốn này in năm 1615. Theo cậu, ai là người đầu tiên dùng thuật ngữ “kinh tế chính trị”?",
  },
  {
    t: "choice",
    who: "an",
    mood: "neutral",
    q: "Chọn câu trả lời:",
    opts: [
      {
        text: "Antoine de Montchrétien (A. Môngcrêtiên)",
        correct: true,
        reply: {
          t: "say",
          who: "an",
          mood: "happy",
          text: "Chuẩn xác. Năm 1615 ông nêu thuật ngữ ấy; từ đó kinh tế chính trị dần thành một khoa học độc lập.",
        },
      },
      {
        text: "Adam Smith",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Chưa phải. Smith đến sau đó hơn một thế kỷ. Người nêu thuật ngữ năm 1615 là A. Montchrétien.",
        },
      },
      {
        text: "C. Mác",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Chưa đúng. Mác ở thế kỷ XIX. Thuật ngữ “kinh tế chính trị” có từ 1615, do A. Montchrétien.",
        },
      },
    ],
  },
  {
    t: "say",
    who: "an",
    mood: "neutral",
    text: "Tốt. Giờ đi nhanh dòng phát triển: trọng thương → trọng nông Pháp → kinh tế chính trị tư sản cổ điển Anh.",
  },
  {
    t: "choice",
    who: "an",
    mood: "neutral",
    q: "C. Mác kế thừa trực tiếp ai để xây dựng lý luận của mình?",
    opts: [
      {
        text: "D. Ricardo — kinh tế chính trị tư sản cổ điển Anh",
        correct: true,
        reply: {
          t: "say",
          who: "an",
          mood: "happy",
          text: "Đúng. Mác kế thừa có phê phán Smith và Ricardo, trực tiếp là Ricardo; cùng Ph. Ăngghen công bố trong bộ “Tư bản”.",
        },
      },
      {
        text: "Chủ nghĩa trọng thương",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Trọng thương là giai đoạn sớm hơn. Mác kế thừa trực tiếp cổ điển Anh — đặc biệt D. Ricardo.",
        },
      },
      {
        text: "Trường phái cận biên hiện đại",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Cận biên ra đời độc lập, sau Mác. Nguồn kế thừa trực tiếp là D. Ricardo.",
        },
      },
    ],
  },
  {
    t: "choice",
    who: "lam",
    mood: "neutral",
    q: "Câu chốt: ai kế thừa, bổ sung và phát triển trong điều kiện mới, gắn tên vào môn học?",
    opts: [
      {
        text: "V.I. Lênin",
        correct: true,
        reply: {
          t: "say",
          who: "lam",
          mood: "happy",
          text: "Chính xác. Vì thế môn học mang tên Kinh tế chính trị Mác - Lênin.",
        },
      },
      {
        text: "Ph. Ăngghen",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Ăngghen là người cùng thời, đồng hành với Mác. Người phát triển trong điều kiện mới là V.I. Lênin.",
        },
      },
      {
        text: "A. Smith",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Smith thuộc cổ điển Anh, trước Mác. Người phát triển sau là V.I. Lênin.",
        },
      },
    ],
  },
  { t: "act", n: "I" },

  { t: "scene", bg: "hoithao", act: 2, name: "Màn II · Đối tượng – Mục đích – Phương pháp" },
  {
    t: "say",
    who: "narr",
    text: "Hội trường sáng đèn. TS. Khoa — phản biện nổi tiếng khó tính — chậm rãi đứng dậy.",
  },
  {
    t: "say",
    who: "khoa",
    mood: "stern",
    text: "Trợ lý trẻ. Nói tôi nghe, ngắn gọn: Kinh tế chính trị Mác - Lênin nghiên cứu CÁI GÌ?",
  },
  {
    t: "choice",
    who: "khoa",
    mood: "stern",
    q: "Đối tượng nghiên cứu là:",
    opts: [
      {
        text: "Các quan hệ xã hội của sản xuất và trao đổi, gắn với lực lượng sản xuất và kiến trúc thượng tầng",
        correct: true,
        reply: {
          t: "say",
          who: "khoa",
          mood: "neutral",
          text: "…Được. Trả lời đúng trọng tâm. Quan hệ sản xuất và trao đổi, trong mối liên hệ biện chứng đó.",
        },
      },
      {
        text: "Của cải vật chất của một quốc gia",
        reply: {
          t: "say",
          who: "khoa",
          mood: "stern",
          text: "Sai trọng tâm. Đó là cách hiểu cũ. Đối tượng là các quan hệ xã hội của sản xuất và trao đổi.",
        },
      },
      {
        text: "Hành vi mua sắm của người tiêu dùng",
        reply: {
          t: "say",
          who: "khoa",
          mood: "stern",
          text: "Đó là kinh tế học vi mô hiện đại. Ở đây, đối tượng là quan hệ sản xuất và trao đổi.",
        },
      },
    ],
  },
  {
    t: "choice",
    who: "khoa",
    mood: "stern",
    q: "Vậy nghiên cứu ĐỂ LÀM GÌ?",
    opts: [
      {
        text: "Tìm ra các quy luật kinh tế chi phối sự vận động, phát triển của phương thức sản xuất",
        correct: true,
        reply: {
          t: "say",
          who: "khoa",
          mood: "neutral",
          text: "Đúng. Phát hiện quy luật, rồi vận dụng vì lợi ích con người và xã hội.",
        },
      },
      {
        text: "Tối đa hóa lợi nhuận cho một doanh nghiệp",
        reply: {
          t: "say",
          who: "khoa",
          mood: "stern",
          text: "Hẹp quá. Mục đích là tìm ra quy luật kinh tế, không phải lợi nhuận của một hãng.",
        },
      },
      {
        text: "Dự báo tỷ giá hối đoái ngắn hạn",
        reply: {
          t: "say",
          who: "khoa",
          mood: "stern",
          text: "Đó là kỹ thuật tài chính. Mục đích của môn này là tìm ra quy luật kinh tế.",
        },
      },
    ],
  },
  {
    t: "say",
    who: "khoa",
    mood: "stern",
    text: "Câu cuối của tôi. Cậu định mang quan hệ sản xuất vào phòng thí nghiệm chắc?",
  },
  {
    t: "choice",
    who: "khoa",
    mood: "stern",
    q: "Phương pháp nghiên cứu chủ yếu, đặc thù là:",
    opts: [
      {
        text: "Trừu tượng hóa khoa học",
        correct: true,
        reply: {
          t: "say",
          who: "khoa",
          mood: "neutral",
          text: "Khá lắm. Gạt cái ngẫu nhiên để nắm bản chất — kết hợp logic với lịch sử, phân tích với tổng hợp. Tôi không hỏi nữa.",
        },
      },
      {
        text: "Thí nghiệm trong phòng lab",
        reply: {
          t: "say",
          who: "khoa",
          mood: "stern",
          text: "Không thể. Phương pháp đặc thù ở đây là trừu tượng hóa khoa học.",
        },
      },
      {
        text: "Phỏng vấn ngẫu nhiên ngoài phố",
        reply: {
          t: "say",
          who: "khoa",
          mood: "stern",
          text: "Đó là khảo sát xã hội học. Đặc thù của môn này là trừu tượng hóa khoa học.",
        },
      },
    ],
  },
  {
    t: "say",
    who: "lam",
    mood: "happy",
    text: "Cậu trụ được trước Khoa. Hiếm đấy. Còn một cửa cuối.",
  },
  { t: "act", n: "II" },

  { t: "scene", bg: "buctham", act: 3, name: "Màn III · Chức năng" },
  {
    t: "say",
    who: "narr",
    text: "Phần hỏi đáp với khán giả. Một sinh viên tên Minh hào hứng giơ tay.",
  },
  {
    t: "say",
    who: "minh",
    mood: "neutral",
    text: "Anh/chị ơi, em đọc thấy môn này có nhiều “chức năng”. Khi lý luận giúp ta HIỂU bản chất và quy luật của hiện tượng kinh tế — đó là chức năng nào ạ?",
  },
  {
    t: "choice",
    who: "minh",
    mood: "neutral",
    q: "Đó là chức năng:",
    opts: [
      {
        text: "Chức năng nhận thức",
        correct: true,
        reply: {
          t: "say",
          who: "minh",
          mood: "happy",
          text: "Dạ em hiểu rồi — giúp nhận thức bản chất, quy luật!",
        },
      },
      {
        text: "Chức năng thực tiễn",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Gần đúng nhưng lệch. “Hiểu bản chất, quy luật” là chức năng nhận thức.",
        },
      },
      {
        text: "Chức năng tư tưởng",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Chưa phải. Việc giúp hiểu bản chất, quy luật là chức năng nhận thức.",
        },
      },
    ],
  },
  {
    t: "say",
    who: "minh",
    mood: "neutral",
    text: "Thế còn khi ta VẬN DỤNG tri thức để tham gia và cải tạo hoạt động kinh tế - xã hội thì sao ạ?",
  },
  {
    t: "choice",
    who: "minh",
    mood: "neutral",
    q: "Đó là chức năng:",
    opts: [
      {
        text: "Chức năng thực tiễn",
        correct: true,
        reply: {
          t: "say",
          who: "minh",
          mood: "happy",
          text: "Rõ rồi ạ! Nhận thức để rồi thực tiễn.",
        },
      },
      {
        text: "Chức năng nhận thức",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Nhận thức là hiểu. Còn vận dụng, cải tạo thực tiễn là chức năng thực tiễn.",
        },
      },
      {
        text: "Chức năng phương pháp luận",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Chưa đúng. Vận dụng để cải tạo thực tiễn là chức năng thực tiễn.",
        },
      },
    ],
  },
  {
    t: "choice",
    who: "lam",
    mood: "neutral",
    q: "Để Minh nắm trọn: hai chức năng còn lại của môn học là gì?",
    opts: [
      {
        text: "Chức năng tư tưởng và chức năng phương pháp luận",
        correct: true,
        reply: {
          t: "say",
          who: "lam",
          mood: "happy",
          text: "Chuẩn. Bốn chức năng: nhận thức, thực tiễn, tư tưởng, phương pháp luận. Cậu khép lại Chương 1 trọn vẹn.",
        },
      },
      {
        text: "Chức năng phân phối và chức năng điều tiết",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Đó là chức năng của một số phạm trù khác. Hai chức năng còn lại là tư tưởng và phương pháp luận.",
        },
      },
      {
        text: "Chức năng lưu thông và chức năng thanh toán",
        reply: {
          t: "say",
          who: "lam",
          mood: "concern",
          text: "Đó là chức năng của tiền tệ (Chương 2). Ở đây là tư tưởng và phương pháp luận.",
        },
      },
    ],
  },
  { t: "act", n: "III" },
  { t: "end" },
];

export async function seedChapterMovies(prisma: PrismaClient): Promise<void> {
  const chapters = ChapterContentService.listChapters();
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
      const nodes = ChapterContentService.listNodes(ch.id);
      for (const node of nodes) {
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
              title: node.title,
              data: node as any,
            },
          });
        } else {
          await prisma.chapterNode.create({
            data: {
              chapterId: chapter.id,
              muc: node.muc,
              title: node.title,
              data: node as any,
            },
          });
        }
        nodesSeeded++;
      }
    } catch (e) {
      console.warn(`    ⚠ Skipping nodes for ${ch.id} due to error: ${e}`);
    }

    // 3. Seed Movie Script (Only for muc "1.1" right now)
    if (ch.id === "1") {
      const existingMovie = await prisma.movie.findFirst({
        where: { muc: "1.1" },
      });

      if (existingMovie) {
        await prisma.movie.update({
          where: { id: existingMovie.id },
          data: {
            chapterId: chapter.id,
            title: `Phim tương tác: ${ch.title}`,
            script: chapter1IntroScript as any,
          },
        });
      } else {
        await prisma.movie.create({
          data: {
            chapterId: chapter.id,
            muc: "1.1",
            title: `Phim tương tác: ${ch.title}`,
            script: chapter1IntroScript as any,
          },
        });
      }
      moviesSeeded++;
    }
  }

  seedLog("Chapters", chaptersSeeded);
  seedLog("Chapter Nodes", nodesSeeded);
  seedLog("Interactive Movies", moviesSeeded);
}
