/**
 * Seed Data: 20 Critical Questions
 * Issue: #64 — T-C10
 *
 * Stable key: `question` (upserted in 09-critical-questions.ts)
 * Question types align with Prisma QuestionType enum and critical-question API.
 */
import type { QuestionType } from "../../prisma/generated/client.js";

export interface CriticalQuestionSeed {
  topicTitle: string;
  question: string;
  questionType: QuestionType;
}

export const CRITICAL_QUESTIONS: CriticalQuestionSeed[] = [
  // ── Triết học và thế giới quan (2) ──
  {
    topicTitle: "Triết học và thế giới quan",
    question:
      "Thuật toán mạng xã hội đang định hình 'thực tại' bạn thấy mỗi ngày. Điều này bác bỏ hay củng cố quan điểm ý thức là sản phẩm của điều kiện vật chất-xã hội?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Triết học và thế giới quan",
    question:
      "Nếu không thể phân biệt video thật và deepfake, bạn còn tin vào điều gì — và trên cơ sở nào?",
    questionType: "MORAL_DILEMMA",
  },
  // ── Vấn đề cơ bản (2) ──
  {
    topicTitle: "Vấn đề cơ bản của triết học",
    question:
      "Nếu vật chất quyết định ý thức, tại sao người xuất thân nghèo đôi khi bảo vệ hệ thống bất công hơn người giàu? Điều này chứng minh hay bác bỏ duy vật?",
    questionType: "MORAL_DILEMMA",
  },
  {
    topicTitle: "Vấn đề cơ bản của triết học",
    question:
      "Premise 1: Mọi hiện tượng đều có nguyên nhân vật chất. Premise 2: Ý thức là hiện tượng. Kết luận: Ý thức có nguyên nhân vật chất. Lập luận này hợp lệ về mặt logic không?",
    questionType: "LOGIC",
  },
  // ── Duy vật / duy tâm (2) ──
  {
    topicTitle: "Chủ nghĩa duy vật và chủ nghĩa duy tâm",
    question:
      "ChatGPT trả lời như hiểu triết học. Bạn có coi đó là 'ý thức' không — và tiêu chí của bạn là gì?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Chủ nghĩa duy vật và chủ nghĩa duy tâm",
    question:
      "Một nhà khoa học tin vào Chúa vì trải nghiệm cá nhân. Duy vật biện chứng giải thích thế nào mà không rơi vào duy tâm chủ quan?",
    questionType: "MORAL_DILEMMA",
  },
  // ── Điều kiện ra đời Mác (2) ──
  {
    topicTitle: "Điều kiện ra đời triết học Mác",
    question:
      "Triết học Mác ra đời từ bối cảnh công nghiệp thế kỷ XIX. Với AI và lao động nền tảng, phạm trù 'giai cấp' và 'giá trị thặng dư' còn phù hợp không?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Điều kiện ra đời triết học Mác",
    question:
      "Nếu một học thuyết chỉ đúng trong hoàn cảnh lịch sử cụ thể, nó có còn là 'chân lý khoa học' theo nghĩa phổ quát không?",
    questionType: "LOGIC",
  },
  // ── Phép biện chứng (3) ──
  {
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    question:
      "Mâu thuẫn nào trong cuộc sống bạn đang cố dập tắt thay vì để nó thúc đẩy phát triển?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    question:
      "Phép biện chứng nói mâu thuẫn thúc đẩy phát triển. Chiến tranh cũng là mâu thuẫn. Vậy chiến tranh có phải 'phát triển' không?",
    questionType: "LOGIC",
  },
  {
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    question:
      "Bạn bè kêu gọi 'hủy' một người trên mạng vì phát ngôn sai. Dùng phép biện chứng: đây là đấu tranh ý thức hay bạo lực tượng trưng?",
    questionType: "MORAL_DILEMMA",
  },
  // ── Cách mạng triết học (2) ──
  {
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    question:
      "Triết học phải cải tạo thế giới — ai có quyền quyết định thế giới 'nên' thế nào, và nếu sai ai chịu trách nhiệm?",
    questionType: "MORAL_DILEMMA",
  },
  {
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    question:
      "Liên Xô sụp đổ có phủ nhận triết học Mác không? Trình bày lập luận có cấu trúc (tiền đề → kết luận).",
    questionType: "LOGIC",
  },
  // ── Chức năng triết học ML (2) ──
  {
    topicTitle: "Chức năng của triết học Mác-Lênin",
    question:
      "Bạn học môn triết học chủ yếu vì điểm số hay vì phương pháp tư duy? Nếu trung thực là 'điểm số', điều đó có mâu thuẫn với thông điệp giáo trình không?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Chức năng của triết học Mác-Lênin",
    question:
      "Một kỹ năng chuyên ngành giúp bạn có việc làm ngay; triết học không. Trong 10 giờ học thêm mỗi tuần, bạn phân bổ thế nào — và vì sao?",
    questionType: "MORAL_DILEMMA",
  },
  // ── Đổi mới VN (3) ──
  {
    topicTitle: "Triết học Mác-Lênin với đổi mới Việt Nam",
    question:
      "Đổi mới 1986 là điều chỉnh hay phủ định biện chứng mô hình cũ? Câu trả lời của bạn phụ thuộc góc độ nào?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Triết học Mác-Lênin với đổi mới Việt Nam",
    question:
      "Tăng trưởng GDP cao nhưng bất bình đẳng tăng: theo phép biện chứng, đây có phải mâu thuẫn cần giải quyết — không phải 'giá phải trả' bắt buộc?",
    questionType: "MORAL_DILEMMA",
  },
  {
    topicTitle: "Triết học Mác-Lênin với đổi mới Việt Nam",
    question:
      "Premise: Đổi mới mở thị trường. Premise: Thị trường tạo bất bình đẳng. Kết luận: Đổi mới gây bất bình đẳng nên nên quay lại kế hoạch hóa. Lập luận này thiếu bước nào?",
    questionType: "LOGIC",
  },
  // ── Bổ sung đa dạng loại câu hỏi (2) ──
  {
    topicTitle: "Vấn đề cơ bản của triết học",
    question:
      "Khi bạn chọn giữ im lặng với quan điểm gia đình để tránh xung đột, bạn đang ưu tiên vật chất (hòa khí) hay ý thức (lập trường)?",
    questionType: "OPEN_TEXT",
  },
  {
    topicTitle: "Chức năng của triết học Mác-Lênin",
    question:
      "Nếu phương pháp biện chứng đúng, tại sao hai người cùng áp dụng vẫn đưa ra kết luận chính trị trái ngược?",
    questionType: "LOGIC",
  },
];
