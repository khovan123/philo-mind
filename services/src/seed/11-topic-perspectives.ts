/**
 * Seed: TopicPerspectives
 * Dependencies: seedTopics
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";

const PERSPECTIVES_MAP: Record<string, Record<string, string>> = {
  "Chủ nghĩa Khắc kỷ": {
    TECH: "Ứng dụng các nguyên lý Khắc kỷ vào việc thiết kế giao diện người dùng tối giản, các hệ thống tự động hóa chịu lỗi cao và phát triển phần mềm bền bỉ.",
    ETHICAL:
      "Đạo đức Khắc kỷ tập trung vào đức hạnh cá nhân, phân biệt giữa những điều ta kiểm soát được và không kiểm soát được để hành xử đúng mực.",
    ECONOMIC:
      "Trong kinh tế, Khắc kỷ khuyến khích sự tự chủ tài chính, tiêu dùng bền vững, tránh bẫy ham muốn vật chất vô hạn.",
    SOCIAL:
      "Khắc kỷ xây dựng tinh thần công dân toàn cầu, tôn trọng sự bình đẳng và đóng góp cho cộng đồng bằng hành động lý tính.",
    PHILOSOPHICAL:
      "Góc nhìn triết học cốt lõi của Khắc kỷ là sống thuận theo tự nhiên và phát triển lý tính để đạt tới trạng thái bình thản (ataraxia).",
  },
  "Siêu hình học": {
    TECH: "Siêu hình học thảo luận về bản chất của thông tin, thực tại ảo (VR), trí tuệ nhân tạo thế hệ mới và mô phỏng thực tại bằng máy tính.",
    ETHICAL:
      "Góc nhìn đạo đức trong siêu hình học đặt câu hỏi về trách nhiệm đạo đức của các thực thể tự ý thức phi sinh học hoặc nhân tạo.",
    ECONOMIC:
      "Kinh tế học siêu hình đặt câu hỏi về giá trị nội tại của tiền tệ kỹ thuật số, tài sản vô hình và bản chất của giá trị thặng dư phi vật chất.",
    SOCIAL:
      "Siêu hình học xã hội nghiên cứu cách cấu trúc xã hội số, mạng lưới quan hệ ảo ảnh hưởng đến nhận thức của con người về bản thân và xã hội.",
    PHILOSOPHICAL:
      "Siêu hình học là ngành triết học nghiên cứu bản chất tối hậu của thực tại, sự tồn tại, thời gian, không gian và tự do ý chí.",
  },
};

export async function seedTopicPerspectives(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.topicPerspective.count();
  if (existing > 0) {
    seedSkip("TopicPerspective", `already has ${existing} records`);
    return;
  }

  const topics = await prisma.topic.findMany();
  let count = 0;

  for (const topic of topics) {
    const perspectivesData = PERSPECTIVES_MAP[topic.title] || {
      TECH: `Ứng dụng công nghệ vào chủ đề ${topic.title} nhằm tối ưu hóa và giải quyết các bài toán kỹ thuật hiện đại.`,
      ETHICAL: `Khía cạnh đạo đức của chủ đề ${topic.title} đòi hỏi sự cân nhắc kỹ lưỡng về trách nhiệm và tác động nhân văn.`,
      ECONOMIC: `Góc nhìn kinh tế của chủ đề ${topic.title} phân tích phân phối nguồn lực, chi phí và lợi ích xã hội.`,
      SOCIAL: `Tác động xã hội của chủ đề ${topic.title} liên quan đến bình đẳng xã hội, sự kết nối cộng đồng và truyền thông.`,
      PHILOSOPHICAL: `Bản chất triết học của chủ đề ${topic.title} gợi mở các câu hỏi sâu sắc về nhận thức, sự tồn tại và giá trị con người.`,
    };

    for (const [type, content] of Object.entries(perspectivesData)) {
      await prisma.topicPerspective.create({
        data: {
          topicId: topic.id,
          perspectiveType: type as any,
          content,
        },
      });
      count++;
    }
  }

  seedLog("TopicPerspective", count);
}
