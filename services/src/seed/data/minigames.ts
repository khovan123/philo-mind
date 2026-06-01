/**
 * Seed Data: 5 MiniGames (matching, guess-who, logic-puzzle)
 * Issue: #65 — T-C11
 *
 * Stable key: `title` (upserted in 11-minigames.ts)
 * gameType values must match minigame.validator.ts and MiniGameService.scoreGame.
 */
import type { MiniGameType } from "../../validators/minigame.validator.js";

export interface MiniGameSeed {
  title: string;
  gameType: MiniGameType;
  description: string;
  topicTitle?: string;
  config: Record<string, unknown>;
}

export const MINI_GAMES: MiniGameSeed[] = [
  {
    title: "Đấu trường Tư tưởng",
    gameType: "matching",
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    description:
      "Ghép các quan điểm kinh điển với trường phái hoặc phương pháp triết học tương ứng.",
    config: {
      type: "matching",
      timeLimit: 60,
      pairs: [
        {
          left: "Không có gì tồn tại độc lập; vạn vật đều nằm trong mối liên hệ và luôn biến đổi.",
          right: "Phương pháp biện chứng",
        },
        {
          left: "Thế giới là bức ảnh tĩnh: các sự vật tách rời, cô lập và bất biến.",
          right: "Phương pháp siêu hình",
        },
        {
          left: "Cái cây chỉ tồn tại khi có ai nhìn thấy; cảm giác sinh ra thế giới.",
          right: "Chủ nghĩa duy tâm",
        },
        {
          left: "Dù con người có nghĩ về nó hay không, Trái Đất vẫn quay và vật chất vẫn tồn tại.",
          right: "Chủ nghĩa duy vật",
        },
        {
          left: "Trí tuệ có hạn; ta chỉ thấy hiện tượng, không thể biết bản chất tuyệt đối.",
          right: "Thuyết bất khả tri",
        },
      ],
    },
  },
  {
    title: "Ghép khái niệm Mác-Lênin",
    gameType: "matching",
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    description: "Nối khái niệm với định nghĩa hoặc ví dụ đúng trong giáo trình Mác-Lênin.",
    config: {
      type: "matching",
      timeLimit: 90,
      pairs: [
        { left: "Tư liệu sản xuất", right: "Tổng thể điều kiện vật chất của đời sống xã hội" },
        {
          left: "Lực lượng sản xuất",
          right: "Trình độ phát triển của tư liệu sản xuất và kỹ thuật",
        },
        { left: "Quan hệ sản xuất", right: "Quan hệ kinh tế giữa người trong quá trình sản xuất" },
        { left: "Kiến trúc thượng tầng", right: "Ý thức hệ, pháp luật, đạo đức, văn hóa" },
        { left: "Giá trị thặng dư", right: "Phần lao động bị chiếm đoạt ngoài tiền công" },
      ],
    },
  },
  {
    title: "Triết gia bí ẩn",
    gameType: "guess-who",
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    description: "Đoán vĩ nhân đứng sau các gợi ý lịch sử. Càng dùng ít gợi ý, điểm càng cao!",
    config: {
      type: "guess-who",
      characters: [
        {
          name: "Nhân vật 1",
          hints: [
            "Đỉnh cao triết học cổ điển Đức, duy tâm khách quan.",
            "Tin vũ trụ là quá trình tự vận động của 'Ý niệm tuyệt đối'.",
            "Cha đẻ phương pháp nhìn vạn vật trong vận động và mâu thuẫn.",
            "Marx nói ông 'đứng lộn ngược' và cần lật phương pháp lên nền duy vật.",
          ],
          answer: "Georg Wilhelm Friedrich Hegel",
          acceptedAnswers: ["Hegel", "G.W.F. Hegel"],
        },
        {
          name: "Nhân vật 2",
          hints: [
            "Triết gia duy vật người Đức thế kỷ XIX.",
            "Phê phán duy tâm thần bí của Hegel, khôi phục vị thế duy vật.",
            "Nhìn thế giới tĩnh tại, máy móc — thiếu vận động biện chứng.",
            "Marx-Engels tiếp thu duy vật của ông rồi xây dựng duy vật biện chứng.",
          ],
          answer: "Ludwig Feuerbach",
          acceptedAnswers: ["Feuerbach"],
        },
      ],
    },
  },
  {
    title: "Ai là nhà tư tưởng?",
    gameType: "guess-who",
    topicTitle: "Điều kiện ra đời triết học Mác",
    description: "Nhận diện các nhà tư tưởng qua gợi ý về tác phẩm, bối cảnh và đóng góp.",
    config: {
      type: "guess-who",
      characters: [
        {
          name: "Nhân vật 1",
          hints: [
            "Cùng Engels viết Tuyên ngôn Cộng sản năm 1848.",
            "Phân tích hàng hóa và giá trị thặng dư trong Tư bản.",
            "Nói triết gia chỉ giải thích thế giới — vấn đề là cải tạo nó.",
            "Ra đời trong bối cảnh cách mạng công nghiệp và đấu tranh giai cấp.",
          ],
          answer: "Karl Marx",
          acceptedAnswers: ["Marx", "Các Mác"],
        },
        {
          name: "Nhân vật 2",
          hints: [
            "Đồng tác giả nhiều tác phẩm kinh điển với Marx.",
            "Cùng nghiên cứu chủ nghĩa xã hội không tưởng Pháp và kinh tế chính trị Anh.",
            "Đóng góp phân tích khoa học tự nhiên vào nền tảng triết học Mác.",
            "Tên gắn với học thuyết cùng Marx trong giáo trình Mác-Lênin.",
          ],
          answer: "Friedrich Engels",
          acceptedAnswers: ["Engels", "Ăngghen", "Angghen"],
        },
      ],
    },
  },
  {
    title: "Sắp xếp tam đoạn luận",
    gameType: "logic-puzzle",
    topicTitle: "Vấn đề cơ bản của triết học",
    description:
      "Sắp xếp các mệnh đề theo trình tự: tiền đề lớn → tiền đề nhỏ → kết luận (modus ponens).",
    config: {
      type: "logic-puzzle",
      prompt: "Sắp xếp các mệnh đề thành lập luận tam đoạn hợp lệ.",
      items: [
        { id: "minor", text: "Socrates là người." },
        { id: "major", text: "Mọi người đều phải chết." },
        { id: "conclusion", text: "Vậy Socrates phải chết." },
      ],
      solution: "Mọi người đều phải chết. > Socrates là người. > Vậy Socrates phải chết.",
    },
  },
];
