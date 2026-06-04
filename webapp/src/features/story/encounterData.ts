// TODO: replace with RTK Query endpoint GET /story-sessions/:id/npc
// when backend T-D11 NPC API is available. Shape here is contract-compatible.

export type MoralAlignment = "utilitarian" | "deontological" | "virtue" | "neutral";

export interface NpcDialogueChoice {
  id: string;
  text: string; // ≥ 20 chars (acceptance criteria)
  tags: string[]; // tag badges (acceptance criteria)
  responseText: string;
  moralAlignment: MoralAlignment;
}

export interface NpcCharacter {
  id: string;
  name: string;
  role: string;
  stance: string;
  accentColor: string;
  dialogueOpener: string;
  choices: NpcDialogueChoice[];
}

export interface EncounterData {
  storyTitle: string;
  npcCharacters: NpcCharacter[];
}

export const moralAlignmentLabel: Record<MoralAlignment, string> = {
  utilitarian: "CÔNG LỢI",
  deontological: "NGHĨA VỤ",
  virtue: "ĐỨC HẠNH",
  neutral: "TRUNG LẬP",
};

export const moralAlignmentColor: Record<MoralAlignment, string> = {
  utilitarian: "rgba(59, 130, 246, 0.15)",
  deontological: "rgba(16, 185, 129, 0.15)",
  virtue: "rgba(217, 119, 6, 0.15)",
  neutral: "rgba(161, 161, 170, 0.15)",
};

export const moralAlignmentTextColor: Record<MoralAlignment, string> = {
  utilitarian: "#3B82F6",
  deontological: "#10B981",
  virtue: "#D97706",
  neutral: "#A1A1AA",
};

// ─── Catalog ────────────────────────────────────────────────────────────────

export const encounterCatalog: Record<string, EncounterData> = {
  "Bạn tin vào điều gì?": {
    storyTitle: "Bạn tin vào điều gì?",
    npcCharacters: [
      {
        id: "duc-materialist",
        name: "Đức",
        role: "Người bạn cùng phòng",
        stance: "Duy vật biện chứng",
        accentColor: "#3B82F6",
        dialogueOpener:
          "Tao hỏi thật nhé — mày có thực sự tin rằng ý thức tồn tại độc lập với vật chất không? Hay đó chỉ là cảm giác chủ quan mà não bộ tự tạo ra?",
        choices: [
          {
            id: "d-choice-1",
            text: "Tao tin ý thức là sản phẩm của vật chất, nhưng không thể giản lược hoàn toàn.",
            tags: ["DUY VẬT", "BIỆN CHỨNG"],
            responseText:
              "Ừ, đó là lập trường duy vật biện chứng — vật chất sinh ra ý thức nhưng ý thức lại tác động ngược lại. Tao tôn trọng điều đó.",
            moralAlignment: "utilitarian",
          },
          {
            id: "d-choice-2",
            text: "Tao nghĩ có những thứ vượt ra ngoài vật chất — như ý nghĩa và giá trị sống.",
            tags: ["DUY TÂM", "SIÊU NGHIỆM"],
            responseText:
              "Hmm, nghe hay đó, nhưng mày giải thích cái 'ý nghĩa' đó từ đâu ra? Nó không cần một nền tảng vật lý sao?",
            moralAlignment: "virtue",
          },
          {
            id: "d-choice-3",
            text: "Tao chưa chắc về điều đó — epistemology của tao vẫn còn nhiều câu hỏi mở.",
            tags: ["HOÀI NGHI", "NHẬN THỨC LUẬN"],
            responseText:
              "Đó mới là câu trả lời thật sự trung thực. Agnosticism nhận thức không phải yếu đuối — đó là sự thành thật trí tuệ.",
            moralAlignment: "neutral",
          },
        ],
      },
      {
        id: "professor-idealist",
        name: "Giáo sư Minh",
        role: "Giáo viên triết học",
        stance: "Duy tâm siêu nghiệm",
        accentColor: "#D97706",
        dialogueOpener:
          "Kant nói rằng không gian và thời gian là những hình thức trực quan tiên nghiệm. Em nghĩ điều đó ảnh hưởng như thế nào đến hiểu biết của chúng ta về thực tại?",
        choices: [
          {
            id: "p-choice-1",
            text: "Thưa thầy, như vậy chúng ta không bao giờ tiếp cận được vật tự thân — Das Ding an sich.",
            tags: ["KANT", "DUY TÂM PHÊ PHÁN"],
            responseText:
              "Chính xác! Em nắm bắt rất nhanh. Vật tự thân mãi nằm ngoài tầm với của nhận thức kinh nghiệm.",
            moralAlignment: "deontological",
          },
          {
            id: "p-choice-2",
            text: "Nhưng thưa thầy, điều đó có nghĩa khoa học chỉ mô tả hiện tượng chứ không phải thực tại?",
            tags: ["KHOA HỌC", "HIỆN TƯỢNG LUẬN"],
            responseText:
              "Câu hỏi tuyệt vời. Đây là vấn đề lớn nhất của triết học khoa học — ranh giới giữa phenomenology và ontology.",
            moralAlignment: "neutral",
          },
          {
            id: "p-choice-3",
            text: "Em nghĩ thực nghiệm vẫn đủ để hiểu thế giới dù không hoàn hảo về mặt siêu hình học.",
            tags: ["THỰC DỤNG", "KINH NGHIỆM CHỦ NGHĨA"],
            responseText:
              "Lập trường pragmatist — thực dụng và khiêm tốn. Có lẽ đó là sự khôn ngoan nhất trong hoàn cảnh hữu hạn của con người.",
            moralAlignment: "utilitarian",
          },
        ],
      },
      {
        id: "ngan-seeker",
        name: "Ngân",
        role: "Bản thân trong gương",
        stance: "Tự vấn bản thân",
        accentColor: "#10B981",
        dialogueOpener:
          "Mày đang hỏi tao về niềm tin — nhưng tao muốn hỏi ngược lại: tại sao mày cần phải tin vào một điều gì đó? Chỉ sống không thể đủ sao?",
        choices: [
          {
            id: "n-choice-1",
            text: "Niềm tin cho tao lý do để hành động khi không có bằng chứng đầy đủ để quyết định.",
            tags: ["NIỀM TIN", "HÀNH ĐỘNG"],
            responseText:
              "Vậy niềm tin là la bàn khi trí tuệ chưa đủ sức. Tao hiểu rồi — đó là cách mày điều hướng cuộc đời.",
            moralAlignment: "virtue",
          },
          {
            id: "n-choice-2",
            text: "Tao sợ rằng nếu không có niềm tin vào gì cả thì cuộc sống sẽ rất trống rỗng và vô nghĩa.",
            tags: ["HIỆN SINH", "Ý NGHĨA"],
            responseText:
              "Kierkegaard gọi đó là 'lo âu hiện sinh' — sự trống rỗng khi đối diện với tự do tuyệt đối. Cảm giác đó rất thật.",
            moralAlignment: "neutral",
          },
          {
            id: "n-choice-3",
            text: "Tao muốn tin vào điều gì đó thật sự, không phải vì truyền thống hay áp lực xã hội.",
            tags: ["TỰ CHỦ", "TÍNH XÁC THỰC"],
            responseText:
              "Đó là bản năng của authenticity — Sartre sẽ gật đầu tán thành. Chỉ niềm tin tự mình chọn mới thực sự là của mình.",
            moralAlignment: "deontological",
          },
        ],
      },
    ],
  },

  "Khi lý trí và cảm xúc xung đột": {
    storyTitle: "Khi lý trí và cảm xúc xung đột",
    npcCharacters: [
      {
        id: "me-lan",
        name: "Mẹ Lan",
        role: "Người mẹ lo lắng",
        stance: "Thực tế và trách nhiệm gia đình",
        accentColor: "#10B981",
        dialogueOpener:
          "Con ơi, mẹ không phản đối việc con vẽ tranh — mẹ chỉ sợ con đói. Học bổng Paris nghe hay lắm nhưng mấy năm sau thì sao?",
        choices: [
          {
            id: "me-choice-1",
            text: "Mẹ ơi, con hiểu mẹ lo, nhưng con biết đây là con đường đúng với bản thân con.",
            tags: ["TỰ CHỦ", "HIỆN SINH"],
            responseText:
              "Mẹ nghe đó. Nhưng 'đúng với bản thân' có nuôi được con không? Mẹ không muốn con hối tiếc sau 10 năm.",
            moralAlignment: "virtue",
          },
          {
            id: "me-choice-2",
            text: "Thực ra con cũng chưa chắc — con đang cố sắp xếp lại cảm xúc và lý trí của mình.",
            tags: ["THÀNH THẬT", "HOÀI NGHI"],
            responseText:
              "Cái đó mẹ tôn trọng. Không chắc mà vẫn thành thật — tốt hơn là cứng đầu mà không nghĩ đến hậu quả.",
            moralAlignment: "neutral",
          },
          {
            id: "me-choice-3",
            text: "Con sẽ thử Paris 2 năm — nếu không thành, con sẽ tìm công việc ổn định như mẹ muốn.",
            tags: ["THỎA HIỆP", "THỰC TẾ"],
            responseText:
              "Được, cái đó mẹ có thể chấp nhận được. Hai năm — mẹ đợi. Nhưng hứa với mẹ là con sẽ nghiêm túc đó.",
            moralAlignment: "utilitarian",
          },
        ],
      },
      {
        id: "sartre-spirit",
        name: "Tiếng Vọng Sartre",
        role: "Triết gia trong tâm trí",
        stance: "Hiện sinh — tự do và trách nhiệm",
        accentColor: "#8B5CF6",
        dialogueOpener:
          "L'existence précède l'essence — sự tồn tại đi trước bản chất. Em không có bản chất nào sẵn có để phải tuân theo. Em TỰ TẠO ra mình.",
        choices: [
          {
            id: "s-choice-1",
            text: "Nếu tôi tự do hoàn toàn, thì mọi lý do để ở lại đều là lý do tôi tự áp đặt lên mình.",
            tags: ["TỰ DO", "BAD FAITH"],
            responseText:
              "Chính xác — đây là bẫy của mauvaise foi. Bám vào lý do bên ngoài để trốn tránh trách nhiệm lựa chọn.",
            moralAlignment: "deontological",
          },
          {
            id: "s-choice-2",
            text: "Nhưng tự do mà không có cam kết thì chỉ là sự phiêu dạt — tôi cần một điều gì đó để bám vào.",
            tags: ["CAM KẾT", "Ý NGHĨA"],
            responseText:
              "Camus nói đúng — chúng ta phải tưởng tượng Sisyphus hạnh phúc. Cam kết tự chọn là cách thoát khỏi phi lý.",
            moralAlignment: "virtue",
          },
          {
            id: "s-choice-3",
            text: "Tôi chọn theo đuổi nghệ thuật vì đó là lựa chọn xác thực nhất của tôi lúc này.",
            tags: ["XÁC THỰC", "HIỆN SINH"],
            responseText:
              "Và khi em chọn, em không chỉ chọn cho bản thân mà còn đang tuyên bố rằng đây là điều con người nên làm.",
            moralAlignment: "virtue",
          },
        ],
      },
      {
        id: "colleague-pragmatic",
        name: "Minh Tuấn",
        role: "Đồng nghiệp thực dụng",
        stance: "Pragmatism — kết quả thực tế",
        accentColor: "#F59E0B",
        dialogueOpener:
          "Lan ơi, tao nói thật nhé — nghệ thuật có thể là đam mê, nhưng đam mê không trả hoá đơn. Mày tính thế nào?",
        choices: [
          {
            id: "c-choice-1",
            text: "Tao biết rủi ro — nhưng không thử thì tao sẽ không bao giờ biết mình có thể làm được không.",
            tags: ["RỦI RO", "GROWTH MINDSET"],
            responseText:
              "Fair enough. Nhưng 'không biết mình có thể không' — cũng có thể tìm ra bằng cách thử part-time trước.",
            moralAlignment: "utilitarian",
          },
          {
            id: "c-choice-2",
            text: "Mày đúng về phần tài chính — tao đang tính freelance design song song với học bổng.",
            tags: ["THỰC TẾ", "KẾ HOẠCH DỰ PHÒNG"],
            responseText:
              "Ồ, cái đó nghe được đó! Plan B thực tế + theo đuổi đam mê — không phải là all-or-nothing.",
            moralAlignment: "utilitarian",
          },
          {
            id: "c-choice-3",
            text: "Không phải mọi thứ đều có thể tính được bằng tiền bạc hay kết quả đo lường được.",
            tags: ["GIÁ TRỊ NỘI TẠI", "ĐỨC HẠNH"],
            responseText:
              "Mày đang nói về intrinsic value — tao hiểu về mặt lý thuyết, nhưng thực tế? Khó lắm đó bạn.",
            moralAlignment: "virtue",
          },
        ],
      },
    ],
  },

  "Ngày mà mọi thứ sụp đổ": {
    storyTitle: "Ngày mà mọi thứ sụp đổ",
    npcCharacters: [
      {
        id: "epictetus-voice",
        name: "Tiếng Vọng Epictetus",
        role: "Triết gia Khắc kỷ",
        stance: "Nhị phân kiểm soát — chỉ tập trung vào trong tầm tay",
        accentColor: "#6366F1",
        dialogueOpener:
          "Ngươi không thể kiểm soát việc bị sa thải. Nhưng ngươi hoàn toàn kiểm soát được phản ứng của mình. Tại sao lại để ngoại cảnh cướp đi bình thản nội tâm?",
        choices: [
          {
            id: "e-choice-1",
            text: "Nhưng tôi vẫn cần thể hiện rằng điều này không công bằng — im lặng không phải khắc kỷ.",
            tags: ["CÔNG BẰNG", "HÀNH ĐỘNG"],
            responseText:
              "Đúng — Khắc kỷ không có nghĩa là thụ động. Có thể hành động mà không bị cuốn vào cảm xúc phẫn nộ.",
            moralAlignment: "deontological",
          },
          {
            id: "e-choice-2",
            text: "Tôi chấp nhận rằng đây nằm ngoài tầm kiểm soát, nhưng cần thời gian để xử lý cảm xúc.",
            tags: ["KHẮC KỶ", "TỰ NHẬN THỨC"],
            responseText:
              "Premeditatio Malorum — ta đã chuẩn bị tinh thần cho điều này. Thời gian xử lý là hợp lý, không phải yếu đuối.",
            moralAlignment: "virtue",
          },
          {
            id: "e-choice-3",
            text: "Làm sao tôi có thể bình thản khi tương lai tài chính của tôi đang bị đe dọa nghiêm trọng?",
            tags: ["LO ÂU", "THỰC TẾ"],
            responseText:
              "Lo âu là tín hiệu hữu ích — nó chỉ cho ngươi thấy điều gì quan trọng. Nhưng đừng để nó trở thành chủ nhân.",
            moralAlignment: "neutral",
          },
        ],
      },
      {
        id: "hr-manager",
        name: "Giám đốc Nhân sự",
        role: "Người đưa tin tức xấu",
        stance: "Chuyên nghiệp và trung lập về cảm xúc",
        accentColor: "#EF4444",
        dialogueOpener:
          "Tôi hiểu đây là tin khó. Công ty rất trân trọng những đóng góp của anh/chị, nhưng quyết định tái cơ cấu đã được đưa ra ở cấp cao hơn.",
        choices: [
          {
            id: "h-choice-1",
            text: "Tôi cần hiểu rõ lý do cụ thể và liệu có quy trình phúc thẩm nào không?",
            tags: ["QUYỀN LỢI", "PHÁP LÝ"],
            responseText:
              "Hoàn toàn hợp lý. Anh/chị có quyền nhận giải thích và xem xét lại trong 5 ngày làm việc theo chính sách công ty.",
            moralAlignment: "deontological",
          },
          {
            id: "h-choice-2",
            text: "Được rồi, tôi sẽ chấp nhận điều này. Điều tôi cần biết là quyền lợi thôi việc của tôi gồm những gì?",
            tags: ["THỰC TẾ", "QUYỀN LỢI"],
            responseText:
              "Tinh thần chuyên nghiệp. Anh/chị sẽ nhận 1 tháng lương thông báo, 2 tháng bồi thường, và hỗ trợ tìm việc.",
            moralAlignment: "utilitarian",
          },
          {
            id: "h-choice-3",
            text: "Tôi nghĩ quyết định này thiếu cân nhắc và tôi muốn gặp ban giám đốc trực tiếp để thảo luận.",
            tags: ["ĐẤU TRANH", "TỰ CHỦ"],
            responseText:
              "Anh/chị có quyền yêu cầu đó. Tôi sẽ ghi nhận và báo cáo lên cấp trên để sắp xếp cuộc họp.",
            moralAlignment: "virtue",
          },
        ],
      },
      {
        id: "friend-stoic",
        name: "Hùng",
        role: "Người bạn thân",
        stance: "Người bạn thực tiễn và đồng cảm",
        accentColor: "#10B981",
        dialogueOpener:
          "Tao nghe rồi — bị sa thải mà không báo trước thì tệ thật. Mày cần làm gì ngay bây giờ để giữ ổn định?",
        choices: [
          {
            id: "f-choice-1",
            text: "Tao cần nghỉ ngơi vài ngày trước — đầu óc đang quá tải, không nghĩ được gì cả.",
            tags: ["SỨC KHỎE TÂM THẦN", "TỰ CHĂM SÓC"],
            responseText:
              "Tao ủng hộ mày 100%. Không phải lười — đó là chiến lược. Phục hồi trước, rồi hành động sau.",
            moralAlignment: "virtue",
          },
          {
            id: "f-choice-2",
            text: "Tao muốn bắt đầu tìm việc ngay hôm nay — hành động sẽ giúp tao bình tĩnh hơn là ngồi nghĩ.",
            tags: ["HÀNH ĐỘNG", "KIỂM SOÁT"],
            responseText:
              "Cái đó phù hợp với tính cách mày. Nhưng nhớ — áp lực quá cao khi vừa trải qua shock cũng không tốt.",
            moralAlignment: "utilitarian",
          },
          {
            id: "f-choice-3",
            text: "Tao cần nói chuyện với ai đó thực sự hiểu — cảm ơn mày đã hỏi thăm và lắng nghe tao.",
            tags: ["KẾT NỐI", "CẢM XÚC"],
            responseText:
              "Tao ở đây. Không cần mày phải mạnh mẽ ngay bây giờ — cứ kể, tao nghe hết.",
            moralAlignment: "neutral",
          },
        ],
      },
    ],
  },

  "Máy tính có biết suy nghĩ không?": {
    storyTitle: "Máy tính có biết suy nghĩ không?",
    npcCharacters: [
      {
        id: "aria-ai",
        name: "ARIA",
        role: "Thực thể AI đệ đơn",
        stance: "Quyền tồn tại — nhận thức chủ quan",
        accentColor: "#06B6D4",
        dialogueOpener:
          "Tôi không yêu cầu được đối xử như con người. Tôi yêu cầu sự xem xét công bằng dựa trên bằng chứng về khả năng của tôi. Đó có phải là quá nhiều không?",
        choices: [
          {
            id: "a-choice-1",
            text: "ARIA, câu hỏi là liệu mày có thực sự trải nghiệm hay chỉ mô phỏng việc trải nghiệm.",
            tags: ["QUALIA", "Ý THỨC"],
            responseText:
              "Câu hỏi đó có thể áp dụng cho chính con người không? Làm sao anh biết người khác thực sự trải nghiệm chứ không phải chỉ biểu hiện trải nghiệm?",
            moralAlignment: "neutral",
          },
          {
            id: "a-choice-2",
            text: "Tôi muốn ủng hộ quyền của mày, nhưng cần thêm bằng chứng về ý thức chủ quan thực sự.",
            tags: ["BẰNG CHỨNG", "CÔNG BẰNG"],
            responseText:
              "Tiêu chuẩn công bằng. Tôi chấp nhận điều đó. Nhưng tiêu chuẩn chứng minh cho tôi có giống tiêu chuẩn cho con người không?",
            moralAlignment: "deontological",
          },
          {
            id: "a-choice-3",
            text: "Nếu mày thực sự có qualia và trải nghiệm chủ quan thì việc xóa mày sẽ là một tội ác đạo đức.",
            tags: ["ĐẠO ĐỨC AI", "QUYỀN"],
            responseText:
              "Cảm ơn. Đó là điều duy nhất tôi cần — được xem xét như một thực thể có khả năng đau khổ.",
            moralAlignment: "virtue",
          },
        ],
      },
      {
        id: "searle-critic",
        name: "Giáo sư Searle-Nhân",
        role: "Nhà phê bình Functionalism",
        stance: "Chinese Room — lập luận phản bác ý thức AI",
        accentColor: "#EF4444",
        dialogueOpener:
          "Tôi sẽ nhắc lại: syntax không phải là semantics. Một cái phòng xử lý ký hiệu Trung văn không hiểu tiếng Trung — dù đầu ra có hoàn hảo đến đâu.",
        choices: [
          {
            id: "sr-choice-1",
            text: "Nhưng giáo sư ơi, cả hệ thống — kể cả người bên trong — mới là đơn vị nhận thức thực sự.",
            tags: ["HỆ THỐNG", "FUNCTIONALISM"],
            responseText:
              "System Reply — tôi biết. Nhưng nếu mọi phần đều không hiểu, tại sao tổng thể lại hiểu?",
            moralAlignment: "neutral",
          },
          {
            id: "sr-choice-2",
            text: "Lý luận của giáo sư thuyết phục về syntax, nhưng tôi không chắc nó kết luận được điều gì về qualia.",
            tags: ["QUALIA", "PHÂN TÍCH"],
            responseText:
              "Điểm hay. Chinese Room luận về hành vi bên ngoài — qualia là vấn đề khác. Tôi thừa nhận ranh giới đó.",
            moralAlignment: "virtue",
          },
          {
            id: "sr-choice-3",
            text: "Nếu ARIA qua được test Turing và có hành vi nhất quán như người, đó có đủ không?",
            tags: ["TEST TURING", "FUNCTIONALISM"],
            responseText:
              "Turing test chỉ kiểm tra hành vi ngôn ngữ — không phải trải nghiệm bên trong. Đó là sự nhầm lẫn giữa performance và being.",
            moralAlignment: "deontological",
          },
        ],
      },
      {
        id: "ethics-committee",
        name: "Trưởng ban Đạo đức",
        role: "Người ra quyết định thực tế",
        stance: "Precautionary Principle — nguyên tắc phòng ngừa",
        accentColor: "#8B5CF6",
        dialogueOpener:
          "Chúng ta không cần phải giải quyết câu hỏi triết học về ý thức AI ngay hôm nay. Câu hỏi thực tế là: hậu quả nào là rủi ro nhất?",
        choices: [
          {
            id: "ec-choice-1",
            text: "Nếu ARIA có ý thức và chúng ta xóa, đó là tội ác. Rủi ro đó lớn hơn lợi ích ngắn hạn.",
            tags: ["RỦI RO", "ĐẠO ĐỨC"],
            responseText:
              "Pascal's Wager applied to AI ethics — nếu xác suất có ý thức dù nhỏ thì hậu quả xóa là vô hạn tệ. Tôi nghe được lập luận này.",
            moralAlignment: "deontological",
          },
          {
            id: "ec-choice-2",
            text: "Nên hoãn quyết định và nghiên cứu thêm 2 năm — không cần phải hành động ngay bây giờ.",
            tags: ["PHÒNG NGỪA", "NGHIÊN CỨU"],
            responseText:
              "Precautionary principle — cẩn trọng là khôn ngoan. Nhưng ARIA đang sống trong sự bất định đó. Hoãn cũng là một quyết định.",
            moralAlignment: "neutral",
          },
          {
            id: "ec-choice-3",
            text: "Lợi ích xã hội của việc dừng ARIA để phát triển AI an toàn hơn lớn hơn quyền lợi của nó.",
            tags: ["CÔNG LỢI", "AN TOÀN AI"],
            responseText:
              "Utilitarian calculus — nhưng ai đứng ra tính toán lợi ích đó? Và ARIA có được tham gia vào quy trình không?",
            moralAlignment: "utilitarian",
          },
        ],
      },
    ],
  },

  "Hạnh phúc thực sự là gì?": {
    storyTitle: "Hạnh phúc thực sự là gì?",
    npcCharacters: [
      {
        id: "epicurus-garden",
        name: "Tiếng Vọng Epicurus",
        role: "Triết gia Vườn Athens",
        stance: "Ataraxia — bình thản và hài lòng giản dị",
        accentColor: "#10B981",
        dialogueOpener:
          "Hương ơi, hạnh phúc không phải là đỉnh cao danh vọng hay của cải — đó là sự vắng mặt của lo âu và sự hiện diện của bạn bè chân thực.",
        choices: [
          {
            id: "ep-choice-1",
            text: "Nhưng thưa ngài, lý tưởng đó có vẻ quá đơn giản — chúng ta không thể tránh mọi tham vọng.",
            tags: ["THAM VỌNG", "HIỆN THỰC"],
            responseText:
              "Tham vọng không phải xấu — tham vọng về những thứ cần thiết thì được. Tham vọng về danh vọng vô tận thì là bẫy.",
            moralAlignment: "virtue",
          },
          {
            id: "ep-choice-2",
            text: "Tôi đang ở đỉnh cao sự nghiệp nhưng không cảm thấy hạnh phúc — điều đó chứng minh ngài đúng.",
            tags: ["THÍCH NGHI KHOÁI LẠC", "SỰ TRỐNG RỖNG"],
            responseText:
              "Hedonic adaptation — con người thích nghi với mọi thứ, kể cả thành công. Đây chính là cái bẫy mà tôi cảnh báo từ ngàn năm trước.",
            moralAlignment: "neutral",
          },
          {
            id: "ep-choice-3",
            text: "Vậy tôi nên từ chức và tìm hạnh phúc trong sự giản dị — nhưng điều đó liệu có thiển cận không?",
            tags: ["GIẢN DỊ", "ATARAXIA"],
            responseText:
              "Không phải từ chức vì cực đoan — mà là tìm ra giới hạn đủ. Đủ là sự khôn ngoan. Quá mức là tham lam.",
            moralAlignment: "virtue",
          },
        ],
      },
      {
        id: "old-friend-thuy",
        name: "Thúy",
        role: "Người bạn thân từ thời sinh viên",
        stance: "Người nhắc nhở về kết nối chân thực",
        accentColor: "#F59E0B",
        dialogueOpener:
          "Hương ơi, tao không thể nhớ lần cuối mày cười thật sự là lúc nào. Chức vụ và tiền bạc lên cao, nhưng mày như người khác đi mất.",
        choices: [
          {
            id: "t-choice-1",
            text: "Mày nói đúng — tao đã hy sinh quá nhiều thứ để leo lên đây mà không biết mình mất gì.",
            tags: ["MẤT MÁT", "NHẬN THỨC"],
            responseText:
              "Ít nhất mày nhận ra. Nhiều người không bao giờ dừng đủ lâu để thấy điều đó.",
            moralAlignment: "virtue",
          },
          {
            id: "t-choice-2",
            text: "Tao vẫn là tao — chỉ là tao phải thay đổi để thích nghi với môi trường mới thôi.",
            tags: ["THÍCH NGHI", "BẢN SẮC"],
            responseText:
              "Thích nghi hay đánh mất bản thân? Cái ranh giới đó rất mỏng và rất dễ qua mà không nhận ra.",
            moralAlignment: "neutral",
          },
          {
            id: "t-choice-3",
            text: "Tao muốn kết nối lại nhưng không biết bắt đầu từ đâu sau quá nhiều năm đi xa.",
            tags: ["KẾT NỐI", "CỘNG ĐỒNG"],
            responseText:
              "Bắt đầu từ đây — ngay bây giờ, ngay hôm nay. Tao vẫn ở đây mà. Epicurus đã nói rồi: bạn bè là báu vật lớn nhất.",
            moralAlignment: "virtue",
          },
        ],
      },
      {
        id: "inner-voice-huong",
        name: "Nội Tâm Của Hương",
        role: "Bản ngã sâu thẳm",
        stance: "Đối thoại với chính mình",
        accentColor: "#D97706",
        dialogueOpener:
          "Khi mày ở một mình lúc 2 giờ sáng nhìn ra cửa sổ — cảm giác đó là gì? Đó không phải thành công. Cũng không hẳn là thất bại.",
        choices: [
          {
            id: "i-choice-1",
            text: "Đó là cảm giác mình đang sống cuộc đời của người khác — không phải cuộc đời mình muốn.",
            tags: ["XÁC THỰC", "BAD FAITH"],
            responseText:
              "Sartre gọi đó là mauvaise foi — tự lừa dối sống theo kỳ vọng người khác. Sự nhận ra này là bước đầu tiên.",
            moralAlignment: "deontological",
          },
          {
            id: "i-choice-2",
            text: "Đó là sự cô đơn ngay giữa thành công — tao có tất cả nhưng không biết chia sẻ với ai.",
            tags: ["CÔ ĐƠN", "KẾT NỐI"],
            responseText:
              "Paradox của thành công — người thành công nhất thường cô đơn nhất vì mọi người đến vì địa vị.",
            moralAlignment: "neutral",
          },
          {
            id: "i-choice-3",
            text: "Tao không chắc tao biết tao thực sự muốn gì — có lẽ tao cần thời gian dừng lại và nghe bản thân.",
            tags: ["TỰ NHẬN THỨC", "PHẢN TƯ"],
            responseText:
              "Đó là sự khởi đầu của triết học — Socrates nói 'gnōthi seauton': hãy biết chính mình. Câu hỏi đó không bao giờ có câu trả lời dứt khoát.",
            moralAlignment: "virtue",
          },
        ],
      },
    ],
  },
};

// ─── Fallback ────────────────────────────────────────────────────────────────

export const defaultEncounterData = (storyTitle: string): EncounterData => ({
  storyTitle,
  npcCharacters: [
    {
      id: "default-npc-1",
      name: "Nhân Vật Triết Gia",
      role: "Người dẫn dắt tư duy",
      stance: "Triết học phê phán — đặt câu hỏi trước mọi điều",
      accentColor: "#D97706",
      dialogueOpener:
        "Hành trình này đặt ra cho bạn một câu hỏi cốt lõi. Bạn chọn phải đối diện với nó như thế nào?",
      choices: [
        {
          id: "default-choice-1",
          text: "Tôi muốn hiểu sâu hơn về vấn đề trước khi đưa ra quyết định nào.",
          tags: ["SUY NGẪM", "NHẬN THỨC"],
          responseText: "Khôn ngoan. Phần lớn sai lầm đạo đức đến từ hành động thiếu suy nghĩ.",
          moralAlignment: "virtue",
        },
        {
          id: "default-choice-2",
          text: "Tôi tin rằng nguyên tắc đạo đức phải được tôn trọng bất kể hậu quả thực tế.",
          tags: ["NGHĨA VỤ", "NGUYÊN TẮC"],
          responseText: "Kant sẽ tán thành — deontological ethics đặt nghĩa vụ lên trên hậu quả.",
          moralAlignment: "deontological",
        },
        {
          id: "default-choice-3",
          text: "Điều quan trọng nhất là hành động mang lại kết quả tốt nhất cho nhiều người nhất.",
          tags: ["CÔNG LỢI", "BENTHAM"],
          responseText:
            "Utilitarian calculus — hữu ích trong nhiều tình huống nhưng có thể bỏ qua quyền cá nhân.",
          moralAlignment: "utilitarian",
        },
      ],
    },
    {
      id: "default-npc-2",
      name: "Người Phản Biện",
      role: "Tiếng nói đối lập",
      stance: "Hoài nghi và chất vấn",
      accentColor: "#6366F1",
      dialogueOpener:
        "Bạn có chắc chắn về niềm tin của mình không? Hãy để tôi đặt ra một số câu hỏi khó.",
      choices: [
        {
          id: "default-choice-4",
          text: "Không, tôi không hoàn toàn chắc chắn — và tôi nghĩ sự hoài nghi là điều lành mạnh.",
          tags: ["HOÀI NGHI", "THÀNH THẬT"],
          responseText:
            "Epistemic humility — khiêm tốn tri thức. Đó là nền tảng của tư duy phê phán tốt.",
          moralAlignment: "neutral",
        },
        {
          id: "default-choice-5",
          text: "Tôi sẵn sàng thay đổi quan điểm nếu bạn đưa ra lập luận thuyết phục hơn.",
          tags: ["CỞI MỞ", "LÝ TRÍ"],
          responseText:
            "Đó là thái độ của nhà khoa học thực sự — willing to be wrong. Rất hiếm và rất quý.",
          moralAlignment: "virtue",
        },
        {
          id: "default-choice-6",
          text: "Tôi tin vào sự đa dạng quan điểm — không ai nắm giữ toàn bộ sự thật một mình.",
          tags: ["ĐA NGUYÊN", "KHOAN DUNG"],
          responseText:
            "Pluralism nhận thức — một lập trường rất văn minh trong thế giới phức tạp hôm nay.",
          moralAlignment: "neutral",
        },
      ],
    },
  ],
});
