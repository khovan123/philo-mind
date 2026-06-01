/**
 * Seed Data: 5 Story Scenarios — Full 7-Step Story Mode
 * Issue: #61 — T-C07
 *
 * Data structure mirrors Prisma schema relationships:
 *   StoryScenario → StoryLearnCard (× PhilosophyTag)
 *               → StoryChoice → StoryConsequence → AnalysisTab (×4)
 *
 * 7-step flow mapping:
 *   Step 1: Bối cảnh     → StoryScenario.description / historicalContext / characterRole
 *   Step 2: Học khái niệm → StoryLearnCard[]
 *   Step 3: Ra quyết định → StoryChoice[]
 *   Step 4: Xem hệ quả   → StoryConsequence.resultText
 *   Step 5: Phân tích     → AnalysisTab[] (ETHICAL | PHILOSOPHICAL | POLITICAL_ECONOMIC | HISTORICAL)
 *   Step 6: Phản tư       → CriticalQuestion (seeded separately in 09-critical-questions.ts)
 *   Step 7: Tổng kết      → StorySession / UserProgress (runtime, not seeded)
 */

export interface AnalysisTabData {
  tabType: "ETHICAL" | "PHILOSOPHICAL" | "POLITICAL_ECONOMIC" | "HISTORICAL";
  content: string;
  order: number;
}

export interface ConsequenceData {
  resultText: string;
  ethicalAnalysis?: string;
  philosophicalAnalysis?: string;
  politicalEconomicAnalysis?: string;
  historicalImpact?: string;
  analysisTabs: AnalysisTabData[];
}

export interface ChoiceData {
  choiceText: string;
  reasoningPrompt?: string;
  consequence: ConsequenceData;
}

export interface LearnCardData {
  title: string;
  body: string;
  sourceRef?: string;
  order: number;
  tags: string[]; // PhilosophyTag names
}

export interface StoryScenarioData {
  /** Dùng để upsert — phải unique và stable */
  title: string;
  /** Khớp với Topic.title trong 01-topics.csv */
  topicTitle: string;
  description: string;
  characterRole?: string;
  historicalContext?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  learnCards: LearnCardData[];
  choices: ChoiceData[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PhilosophyTag definitions (upserted by name before stories)
// ─────────────────────────────────────────────────────────────────────────────

export const PHILOSOPHY_TAGS: { name: string; description: string }[] = [
  {
    name: "Thế giới quan",
    description: "Hệ thống quan điểm tổng quát về thế giới và vị trí của con người trong đó.",
  },
  {
    name: "Chủ nghĩa duy vật",
    description: "Quan điểm triết học cho rằng vật chất là nền tảng của mọi tồn tại.",
  },
  {
    name: "Chủ nghĩa Khắc kỷ",
    description:
      "Trường phái triết học Hy Lạp-La Mã tập trung vào đức hạnh, lý trí và kiểm soát nội tâm.",
  },
  {
    name: "Hiện sinh",
    description: "Triết học nhấn mạnh tự do cá nhân, trách nhiệm và sự sáng tạo ý nghĩa cuộc sống.",
  },
  {
    name: "Khoái lạc (Epicureanism)",
    description: "Triết học của Epicurus về hạnh phúc qua sự vắng mặt của đau đớn và lo âu.",
  },
  {
    name: "Triết học tâm trí",
    description: "Nghiên cứu về bản chất ý thức, tư duy và mối quan hệ tâm-thể.",
  },
  {
    name: "Nhân sinh quan",
    description: "Quan điểm về ý nghĩa, mục đích và giá trị của cuộc sống con người.",
  },
  {
    name: "Đạo đức học",
    description: "Ngành triết học nghiên cứu về đúng sai, tốt xấu và trách nhiệm đạo đức.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5 Story Scenarios
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_SCENARIOS: StoryScenarioData[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Story 1: Chủ nghĩa Mác-Lênin — Thế giới quan duy vật biện chứng
  // ───────────────────────────────────────────────────────────────────────────
  {
    title: "Bạn tin vào điều gì?",
    topicTitle: "Chủ nghĩa Mác-Lênin",
    description: `Bạn là Ngân — 18 tuổi, sinh viên năm nhất vừa rời quê lên thành phố học.

Tối thứ Sáu, nhóm tân sinh viên cùng phòng ký túc xá ngồi nói chuyện đến 1 giờ sáng. Một bạn tên Đức đặt câu hỏi thẳng vào mặt bạn: *"Mày tin vào điều gì? Không phải tôn giáo, không phải sách giáo khoa. Điều gì thực sự định hướng cuộc sống của mày?"*

Cả phòng im lặng nhìn bạn. Bạn mở miệng — rồi chợt nhận ra mình không biết phải trả lời gì. Suốt 18 năm qua, bạn sống theo những gì gia đình dạy, thầy cô truyền đạt, xã hội kỳ vọng.

**Bạn thực sự tin vào điều gì?**`,
    characterRole: "Bạn là Ngân — sinh viên năm nhất, 18 tuổi, vừa rời quê lên thành phố học",
    historicalContext:
      "Hà Nội 2024 — thế hệ Gen Z lớn lên trong môi trường thông tin bùng nổ, tiếp xúc đồng thời nhiều hệ giá trị đối lập, nhiều người không còn tin vào tôn giáo truyền thống nhưng cũng chưa có nền tảng triết học thay thế.",
    difficulty: "EASY",
    learnCards: [
      {
        title: "Thế giới quan là gì?",
        body: `**Thế giới quan** là hệ thống quan điểm của con người về thế giới và về bản thân mình trong thế giới đó. Nó bao gồm ba thành phần:

- **Bản thể luận**: Thế giới này là gì? Vật chất hay tinh thần?
- **Nhận thức luận**: Chúng ta có thể hiểu biết thế giới không?
- **Nhân sinh quan**: Mục đích của cuộc sống là gì?

Triết học Mác-Lênin phân biệt hai loại thế giới quan cơ bản: **duy vật** (vật chất quyết định ý thức) và **duy tâm** (ý thức quyết định vật chất).`,
        sourceRef: "Giáo trình Triết học Mác-Lênin, Bộ GD&ĐT Việt Nam",
        order: 0,
        tags: ["Thế giới quan", "Chủ nghĩa duy vật"],
      },
      {
        title: "Thế giới quan duy vật biện chứng",
        body: `Marx và Engels xây dựng **thế giới quan duy vật biện chứng** dựa trên ba nguyên lý:

1. **Vật chất là nền tảng**: Thế giới tồn tại khách quan, độc lập với ý thức con người.
2. **Ý thức phản ánh vật chất**: Tư tưởng, ý thức là sản phẩm của não bộ — một dạng vật chất phát triển cao.
3. **Thực tiễn là tiêu chuẩn chân lý**: Nhận thức đúng hay sai phải được kiểm chứng qua hành động thực tiễn.

> *"Các nhà triết học chỉ giải thích thế giới theo những cách khác nhau — vấn đề là ở chỗ phải cải tạo thế giới."* — Marx, Luận đề về Feuerbach (1845)`,
        sourceRef: "Marx, Luận đề về Feuerbach, 1845",
        order: 1,
        tags: ["Thế giới quan", "Chủ nghĩa duy vật"],
      },
      {
        title: "Thế giới quan hình thành như thế nào?",
        body: `Thế giới quan không tự nhiên xuất hiện — nó được **hình thành qua quá trình**:

- **Trải nghiệm sống**: Những gì bạn đã qua định hình cách bạn nhìn thế giới
- **Giáo dục và văn hóa**: Gia đình, nhà trường, xã hội truyền đạt giá trị và niềm tin
- **Tự phản tư có ý thức**: Chủ động đặt câu hỏi và xây dựng quan điểm riêng

Người không có thế giới quan tự giác không phải là không có thế giới quan — họ đang vận hành theo **thế giới quan vô thức** được xây dựng bởi người khác.`,
        sourceRef: "Giáo trình Triết học Mác-Lênin, chương 1",
        order: 2,
        tags: ["Thế giới quan", "Nhân sinh quan"],
      },
    ],
    choices: [
      {
        choiceText: "Tao tin vào khoa học — những gì chứng minh được mới là thật",
        reasoningPrompt:
          "Khoa học trả lời được câu hỏi 'cái gì xảy ra' — nhưng liệu nó có trả lời được 'tại sao tôi nên sống' hay 'điều gì có ý nghĩa' không?",
        consequence: {
          resultText: `Đức gật đầu, rồi mỉm cười và hỏi tiếp: *"Vậy tại sao mày chọn ngành học này chứ không phải ngành khác? Dữ liệu nào nói với mày đó là quyết định đúng?"*

Bạn im lặng. Có những quyết định quan trọng nhất trong đời — và khoa học không có thuật toán cho chúng. Chọn yêu ai, sống vì điều gì, hy sinh cho giá trị nào — những câu hỏi đó nằm ngoài phương trình.`,
          ethicalAnalysis:
            "Tin vào khoa học là lập trường mạnh mẽ — nhưng nó dễ rơi vào chủ nghĩa khoa học cực đoan (scientism): quan niệm rằng chỉ những gì đo lường được mới có giá trị. Triết học chỉ ra rằng khoa học trả lời câu hỏi 'như thế nào' nhưng không trả lời câu hỏi 'tại sao'. Giá trị, ý nghĩa, đạo đức — những thứ định hướng hành vi con người — không thể rút ra từ dữ liệu đơn thuần.",
          philosophicalAnalysis:
            "Triết học Mác-Lênin phân biệt giữa thế giới quan khoa học và thế giới quan duy vật biện chứng: cái trước là tập hợp kiến thức khoa học, cái sau là hệ thống quan điểm về toàn bộ thực tại — bao gồm cả con người, xã hội và lịch sử. Khoa học giải thích quy luật vật lý nhưng không giải thích tại sao con người có nghĩa vụ đạo đức hay điều gì tạo nên một xã hội tốt đẹp.",
          politicalEconomicAnalysis:
            "Trong xã hội hiện đại, 'tôi tin vào khoa học' thường là cách nói tắt cho nhiều thứ khác nhau. Nhưng thế giới quan không thể thay thế bằng phương pháp khoa học — vì thế giới quan bao gồm cả những câu hỏi mà khoa học chưa chạm đến: câu hỏi về ý nghĩa, về nghĩa vụ, về tương lai xã hội. Khi con người từ chối triết học vì 'không thực tế', họ thường không nhận ra mình đang vận hành theo một triết học ẩn.",
          historicalImpact:
            "Thế kỷ XIX, làn sóng chủ nghĩa thực chứng của Auguste Comte tuyên bố: chỉ những gì quan sát và đo lường được mới là tri thức thực. Một trăm năm sau, nhân loại có công nghệ mạnh mẽ nhất lịch sử — và vẫn đang chiến tranh, đói nghèo, bất công. Câu hỏi không phải là khoa học đúng hay sai — mà là khoa học mà không có thế giới quan nhân văn thì phục vụ ai và hướng đến điều gì.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Chủ nghĩa khoa học cực đoan (scientism) gây ra vấn đề đạo đức khi nó loại bỏ các câu hỏi về giá trị và ý nghĩa ra khỏi phạm vi 'tri thức thực'. Điều này dẫn đến việc các quyết định đạo đức quan trọng bị xử lý như bài toán tối ưu hóa thuần túy, bỏ qua phẩm giá con người.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Triết học Mác-Lênin khẳng định thế giới quan duy vật biện chứng bao gồm khoa học và vượt ra ngoài nó. Khoa học tự nhiên giải thích quy luật tự nhiên, nhưng chỉ thế giới quan mới trả lời được câu hỏi về ý nghĩa tồn tại của con người trong mối quan hệ xã hội và lịch sử.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Trong nền kinh tế tri thức hiện đại, sự sùng bái khoa học kỹ thuật mà thiếu nền tảng nhân văn tạo ra những chuyên gia giỏi kỹ thuật nhưng mất phương hướng về mục tiêu xã hội. Đây là một trong những lý do nhiều quốc gia tái thiết giáo dục nhân văn song song với STEM.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Auguste Comte (1798–1857) sáng lập chủ nghĩa thực chứng, tuyên bố khoa học sẽ thay thế tôn giáo và triết học. Phong trào này ảnh hưởng mạnh đến thế kỷ XIX-XX. Nhưng hai cuộc Thế chiến — xảy ra giữa lúc khoa học phát triển rực rỡ — cho thấy tri thức kỹ thuật không thể thay thế thế giới quan đạo đức.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Tao chưa biết — và tao nghĩ điều đó không sao",
        reasoningPrompt:
          "Sống mà không có thế giới quan rõ ràng — đó là tự do hay là trôi dạt? Có điểm nào giữa 'chưa biết' và 'không cần biết' không?",
        consequence: {
          resultText: `Đức nhìn bạn một lúc rồi nói: *"Đó là câu trả lời trung thực nhất tao nghe tối nay."*

Cả phòng bắt đầu nói thật hơn — không phải trả lời mà là đặt câu hỏi. Bạn không có câu trả lời, nhưng bạn vừa bắt đầu hành trình tìm kiếm thật sự — không phải vì phải thi, mà vì bạn thực sự muốn biết.`,
          ethicalAnalysis:
            "Triết học bắt đầu từ sự thừa nhận không biết — đó là câu đầu tiên của Socrates. Nhưng 'chưa biết' có hai loại: loại đang trên đường tìm kiếm và loại đã từ bỏ câu hỏi. Sự khác biệt không nằm ở câu trả lời mà ở thái độ: bạn có tiếp tục hỏi không? Đạo đức học đức hạnh của Aristotle gọi đây là đức hạnh trí tuệ — sẵn sàng đối mặt với sự không chắc chắn thay vì che giấu nó bằng câu trả lời có sẵn.",
          philosophicalAnalysis:
            "Triết học Mác-Lênin chỉ ra rằng thế giới quan không phải thứ tự nhiên xuất hiện mà cần được hình thành có ý thức — qua học tập, trải nghiệm và tư duy phê phán. Nhận ra mình 'chưa biết' là bước đầu tiên để chủ động xây dựng thế giới quan — thay vì bị thế giới quan xây dựng bởi người khác.",
          politicalEconomicAnalysis:
            "Thế hệ Gen Z đang đối mặt với nghịch lý: có nhiều thông tin hơn bất kỳ thế hệ nào trong lịch sử — nhưng cũng đang trải qua khủng hoảng ý nghĩa sâu sắc nhất. Mạng xã hội cung cấp vô số thế giới quan cạnh tranh nhau. Trong bối cảnh đó, 'chưa biết' không phải thụ động — mà là từ chối nhận thế giới quan đóng gói sẵn từ thuật toán.",
          historicalImpact:
            "Socrates — người thường được coi là cha đẻ của triết học phương Tây — không bao giờ tự nhận mình là người khôn ngoan. Câu nổi tiếng nhất của ông: 'Tôi biết rằng tôi không biết gì.' Ông bị kết án tử hình năm 399 TCN với tội danh 'làm hư hỏng thanh niên' — thực chất là vì ông dạy người trẻ đặt câu hỏi thay vì chấp nhận câu trả lời có sẵn.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Thái độ 'không biết nhưng đang tìm kiếm' là nền tảng của đức hạnh trí tuệ (intellectual virtue) trong triết học Aristotle. Sự khiêm tốn nhận thức này không phải yếu đuối — mà là điều kiện cần để tư duy phê phán và học hỏi thực sự.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Phương pháp Socrates (Elenchus) đặt câu hỏi như công cụ triết học cơ bản. Không biết và thừa nhận không biết là điểm khởi đầu của mọi triết học thực sự. Triết học không phải là tập hợp câu trả lời — mà là nghệ thuật đặt câu hỏi đúng.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Trong xã hội thông tin hiện đại, thuật toán mạng xã hội tối ưu hóa cho sự chắc chắn và cực đoan — nội dung gây phẫn nộ hoặc xác nhận thành kiến được lan truyền hơn. Người dám nói 'tôi chưa biết' đang kháng cự áp lực xã hội phải có lập trường ngay lập tức.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Câu 'Tôi biết rằng tôi không biết gì' của Socrates (469–399 TCN) đã định hình triết học phương Tây suốt 2400 năm. Ông không để lại tác phẩm viết nào — tất cả những gì chúng ta biết về ông qua học trò như Plato. Sự khiêm tốn nhận thức của ông là di sản triết học vĩ đại nhất.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Tao tin vào con người — rằng mình có thể thay đổi hoàn cảnh",
        reasoningPrompt:
          "Tin rằng con người có thể thay đổi thế giới — nhưng điều gì xảy ra khi bạn đối mặt với những thứ hoàn toàn nằm ngoài tầm kiểm soát: bệnh tật, thiên tai, cái chết?",
        consequence: {
          resultText: `Đức mỉm cười: *"Vậy mày nghĩ bản thân mày có thể thay đổi được điều gì?"*

Bạn dừng lại — rồi nhận ra: đây không còn là câu hỏi triết học trừu tượng nữa. Nó đang hỏi bạn phải làm gì với cuộc sống cụ thể của mình, ngay từ ngày mai.`,
          ethicalAnalysis:
            "Tin vào khả năng con người thay đổi thế giới là nền tảng của mọi đạo đức học hành động. Nếu không tin điều đó, mọi câu hỏi về trách nhiệm đạo đức đều vô nghĩa — vì trách nhiệm chỉ tồn tại khi có khả năng lựa chọn. Nhưng niềm tin này cũng đặt gánh nặng: nếu bạn có thể thay đổi điều gì đó và không làm — bạn chịu trách nhiệm về hậu quả.",
          philosophicalAnalysis:
            "Đây là nền tảng của thế giới quan duy vật biện chứng: thế giới là vật chất tồn tại khách quan, có thể nhận thức được, và con người — thông qua thực tiễn — có thể cải tạo nó. Marx diễn đạt điều này trong Luận đề về Feuerbach (1845): 'Các nhà triết học chỉ giải thích thế giới — vấn đề là phải thay đổi nó.'",
          politicalEconomicAnalysis:
            "Thế giới quan 'con người có thể thay đổi hoàn cảnh' là cơ sở của mọi phong trào xã hội trong lịch sử. Nhưng nó cũng có mặt tối: khi niềm tin này bị lợi dụng — 'chúng ta có thể xây dựng thiên đường trên trái đất' — nó đã biện hộ cho nhiều thảm kịch lịch sử. Ranh giới giữa thế giới quan cải tạo thế giới và thế giới quan áp đặt lên thế giới là một trong những câu hỏi phức tạp nhất của triết học chính trị.",
          historicalImpact:
            "Năm 1845, Marx 27 tuổi viết Luận đề về Feuerbach — 11 câu ngắn, không được in trong suốt cuộc đời ông. Câu thứ 11 trở thành một trong những câu được trích dẫn nhiều nhất lịch sử triết học: 'Các nhà triết học chỉ giải thích thế giới — vấn đề là phải thay đổi nó.' Niềm tin đó đã định hình thế kỷ XX theo những cách mà ngay cả ông cũng không lường trước được.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Niềm tin vào khả năng hành động của con người là điều kiện tiên quyết của đạo đức học nghĩa vụ (deontology) và đạo đức học hậu quả (consequentialism). Không có tự do ý chí = không có trách nhiệm đạo đức. Đây là lý do triết học đạo đức luôn gắn liền với câu hỏi về tự do ý chí.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Triết học thực tiễn của Marx đặt hành động (praxis) vào trung tâm: nhận thức không phải là suy tư thuần túy mà là hoạt động thực tiễn của con người. Điều này phân biệt triết học Mác với chủ nghĩa duy tâm Hegelian — với Hegel, lịch sử là sự triển khai của Tinh thần; với Marx, lịch sử là kết quả của hành động con người trong điều kiện vật chất cụ thể.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Trong kinh tế chính trị, niềm tin vào khả năng thay đổi hoàn cảnh là động lực của cả doanh nghiệp tư nhân (entrepreneurship) lẫn phong trào lao động. Cả hai đều dựa trên giả định rằng con người có thể tác động vào cấu trúc kinh tế-xã hội. Sự khác biệt nằm ở ai được thay đổi và vì lợi ích của ai.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Phong trào công nhân thế kỷ XIX-XX, các cuộc cách mạng dân tộc, phong trào nhân quyền thế kỷ XX — tất cả đều được dẫn dắt bởi niềm tin rằng con người có thể thay đổi cấu trúc xã hội. Tuy nhiên, lịch sử cũng chứng kiến cách niềm tin đó bị lợi dụng để biện hộ cho bạo lực cách mạng và chủ nghĩa toàn trị.",
              order: 3,
            },
          ],
        },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Story 2: Chủ nghĩa Hiện sinh — Khi lý trí và cảm xúc xung đột
  // ───────────────────────────────────────────────────────────────────────────
  {
    title: "Khi lý trí và cảm xúc xung đột",
    topicTitle: "Chủ nghĩa Hiện sinh",
    description: `Bạn là Lan — 26 tuổi, đang làm việc tại một công ty tốt với mức lương ổn định.

Sau 4 năm làm việc, bạn nhận được cơ hội mơ ước: học bổng toàn phần tại Paris để học nghệ thuật — đam mê mà bạn đã từ bỏ từ hồi đại học. Nhưng điều đó có nghĩa là bỏ việc, xa gia đình, và đối mặt với sự không chắc chắn hoàn toàn.

Mẹ bạn nói: *"Con đã có công việc tốt rồi, sao còn muốn gì hơn?"* Trái tim bạn nói một điều, lý trí nói điều khác.

**Sartre từng nói: Chúng ta bị kết án phải tự do. Nhưng tự do đó có thực sự là tự do không, hay chỉ là gánh nặng?**`,
    characterRole: "Bạn là Lan — nhân viên văn phòng 26 tuổi, đứng trước ngã rẽ lớn của cuộc đời",
    historicalContext:
      "Việt Nam thập niên 2020 — thế hệ millennials lớn lên trong áp lực giữa kỳ vọng gia đình truyền thống và khát vọng cá nhân hiện đại. Cơ hội toàn cầu hóa mở ra nhưng cũng kéo theo gánh nặng lựa chọn chưa từng có.",
    difficulty: "MEDIUM",
    learnCards: [
      {
        title: "Chủ nghĩa Hiện sinh là gì?",
        body: `**Chủ nghĩa Hiện sinh** (Existentialism) là trào lưu triết học thế kỷ XX nhấn mạnh:

- **Tồn tại có trước bản chất**: Con người không có bản chất định sẵn — chúng ta tự tạo ra ý nghĩa cho chính mình qua hành động.
- **Tự do và trách nhiệm**: Chúng ta hoàn toàn tự do lựa chọn — và hoàn toàn chịu trách nhiệm về lựa chọn đó.
- **Nỗi lo âu (Angst)**: Tự do tuyệt đối tạo ra nỗi lo âu, vì không có quy tắc nào bảo đảm quyết định của ta là đúng.

Đại diện: **Jean-Paul Sartre**, Simone de Beauvoir, Albert Camus, Søren Kierkegaard.`,
        sourceRef: "Sartre, Existentialism is a Humanism, 1946",
        order: 0,
        tags: ["Hiện sinh", "Nhân sinh quan"],
      },
      {
        title: "Tự lừa dối (Bad Faith) theo Sartre",
        body: `Sartre giới thiệu khái niệm **bad faith** (mauvaise foi — tự lừa dối):

Đây là khi con người **từ chối tự do của mình** bằng cách giả vờ rằng mình không có lựa chọn — nói "tôi phải làm vậy vì xã hội, gia đình, hoàn cảnh...".

Ví dụ: Người phục vụ bàn cư xử "như một cái máy phục vụ" — từ chối tính chủ thể của mình để trốn tránh trách nhiệm lựa chọn.

**Trung thực với bản thân** (authenticity) có nghĩa là thừa nhận mình luôn có lựa chọn, ngay cả khi lựa chọn đó đau đớn.`,
        sourceRef: "Sartre, Being and Nothingness, 1943",
        order: 1,
        tags: ["Hiện sinh", "Đạo đức học"],
      },
      {
        title: "Sự phi lý (Absurdity) theo Camus",
        body: `Albert Camus đưa ra khái niệm **sự phi lý** (the absurd):

Cuộc sống không có ý nghĩa cố hữu — nhưng con người không thể ngừng tìm kiếm ý nghĩa. Sự va chạm giữa khát vọng ý nghĩa và sự im lặng của vũ trụ tạo ra **sự phi lý**.

Camus không đề xuất tự sát hay ảo tưởng — mà là **nổi loạn** (rebellion): tiếp tục sống và tìm kiếm, biết rằng không có câu trả lời cuối cùng.

> *"Người ta phải tưởng tượng Sisyphus đang hạnh phúc."* — Camus`,
        sourceRef: "Camus, The Myth of Sisyphus, 1942",
        order: 2,
        tags: ["Hiện sinh", "Nhân sinh quan"],
      },
    ],
    choices: [
      {
        choiceText: "Nhận học bổng và đi Paris — theo đuổi đam mê bất chấp rủi ro",
        reasoningPrompt:
          "Sartre nói 'tồn tại có trước bản chất' — nghĩa là bạn tự tạo ra con người mình sẽ là qua lựa chọn này. Bạn đang chọn là ai?",
        consequence: {
          resultText: `Bạn nộp đơn nhận học bổng. Mẹ khóc. Bạn cũng khóc — nhưng không phải vì hối hận.

Năm đầu ở Paris cô đơn hơn bạn nghĩ. Tiếng Pháp khó hơn bạn nghĩ. Nhưng lần đầu tiên trong 4 năm, khi thức dậy buổi sáng, bạn không cảm thấy mình đang diễn một vai cho người khác xem.`,
          ethicalAnalysis:
            "Trong triết học hiện sinh, tính xác thực (authenticity) không có nghĩa là ích kỷ. Nó có nghĩa là sống trung thực với tự do của mình — thay vì đổ trách nhiệm lên hoàn cảnh. Việc chọn theo đuổi đam mê là xác thực, nhưng nó cũng đòi hỏi thừa nhận hoàn toàn hậu quả: sự cô đơn, nỗi lo của mẹ, sự không chắc chắn tài chính.",
          philosophicalAnalysis:
            "Sartre viết: 'Chúng ta bị kết án phải tự do' — chúng ta không thể không lựa chọn, vì ngay cả việc không lựa chọn cũng là một lựa chọn. Mỗi quyết định định hình 'dự án' (project) của chúng ta — con người chúng ta đang trở thành. Đi Paris là một dự án hiện sinh — không phải chạy trốn, mà là tự tạo ra bản thân.",
          politicalEconomicAnalysis:
            "Trong nền kinh tế toàn cầu hóa, di chuyển quốc tế để học tập và làm việc là hiện tượng phổ biến — nhưng nó vẫn tạo ra áp lực gia đình và văn hóa đặc biệt mạnh trong xã hội Đông Á nơi giá trị cộng đồng được đặt cao hơn cá nhân. Lựa chọn cá nhân luôn có chi phí xã hội.",
          historicalImpact:
            "Simone de Beauvoir — nhà triết học hiện sinh và nữ quyền người Pháp — đã thực sống điều bà triết học: từ chối hôn nhân truyền thống, theo đuổi triết học và viết lách trong xã hội Pháp thập niên 1940 khi đó cực kỳ bảo thủ. Cuộc sống của bà là minh chứng sống cho triết học hiện sinh về tính xác thực.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Tính xác thực (authenticity) trong triết học hiện sinh đòi hỏi thừa nhận hoàn toàn rằng mình là tác nhân của lựa chọn mình, không phải nạn nhân của hoàn cảnh. Chọn đi Paris là xác thực nếu bạn thực sự thừa nhận tất cả hậu quả — không trốn tránh sau 'tôi buộc phải đi' hay 'đây là vận mệnh'.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Khái niệm 'dự án cơ bản' (fundamental project) của Sartre: mỗi con người có một dự án tổng thể định hướng mọi lựa chọn nhỏ. Chọn đi Paris là thể hiện dự án cơ bản — 'tôi muốn là người sáng tạo, sống xác thực' — trái ngược với dự án 'tôi muốn được chấp nhận và an toàn'.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Học bổng quốc tế và di chuyển toàn cầu là đặc quyền không phải ai cũng có. Triết học hiện sinh về tự do cá nhân thường bị phê phán vì bỏ qua các điều kiện vật chất (giai cấp, giới tính, chủng tộc) quyết định ai thực sự 'tự do' để lựa chọn.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Phong trào hiện sinh phát triển mạnh ở Pháp sau Thế chiến II (1945-1960) — trong bối cảnh châu Âu đổ nát và khủng hoảng ý nghĩa. Sartre, Camus, Beauvoir viết trong thời kỳ con người đang cật lực đặt câu hỏi: sau Holocaust, sau bom nguyên tử, còn có thể tin vào điều gì?",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Từ chối học bổng — giữ công việc và ổn định cuộc sống",
        reasoningPrompt:
          "Có phải chọn sự ổn định là 'tự lừa dối' (bad faith) như Sartre nói? Hay ổn định cũng là một lựa chọn xác thực?",
        consequence: {
          resultText: `Bạn gửi email từ chối học bổng. Đêm hôm đó bạn không ngủ được.

Ba tháng sau, bạn bắt đầu đăng ký lớp vẽ vào cuối tuần. Nhỏ thôi. Không hoành tráng. Nhưng nó là của bạn — không phải để chứng minh với ai, không phải để CV đẹp hơn. Chỉ là vì bạn muốn.`,
          ethicalAnalysis:
            "Từ chối không nhất thiết là tự lừa dối. Tự lừa dối (bad faith) xảy ra khi bạn nói 'tôi không có lựa chọn nào khác' trong khi thực ra bạn đang chọn. Nếu bạn thừa nhận rõ ràng: 'Tôi chọn ổn định vì tôi trân trọng sự an tâm và gia đình' — đó là lựa chọn xác thực.",
          philosophicalAnalysis:
            "Camus sẽ không phán xét quyết định này. Điều quan trọng theo triết học phi lý không phải là lựa chọn nào — mà là thái độ sau lựa chọn: bạn có tiếp tục sống đầy đủ trong lựa chọn đó không? Sisyphus hạnh phúc không phải vì hòn đá nhỏ hơn — mà vì ông hiểu rõ và chấp nhận cuộc chơi.",
          politicalEconomicAnalysis:
            "Áp lực kinh tế, trách nhiệm gia đình, rủi ro sự nghiệp — những yếu tố này không phải 'lý do biện hộ cho sự hèn nhát' như triết học hiện sinh phổ thông hóa thường ám chỉ. Chúng là điều kiện vật chất thực sự. Triết học cần nhìn nhận rằng không phải ai cũng có đặc quyền lựa chọn theo đam mê mà không chịu hậu quả nghiêm trọng.",
          historicalImpact:
            "Nhiều nhà triết học hiện sinh có nghề nghiệp 'ổn định' song song với triết học: Camus là nhà báo, Kafka là nhân viên bảo hiểm. Heidegger là giáo sư đại học suốt đời. Kierkegaard sống bằng di sản thừa kế. Triết học về tự do không đòi hỏi người ta từ bỏ mọi sự ổn định.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Sự khác biệt then chốt giữa lựa chọn xác thực và tự lừa dối: bạn có thừa nhận mình đang chọn không? 'Tôi không thể đi' (bad faith) khác 'Tôi chọn không đi' (authenticity). Cùng một hành động — khác biệt ở thái độ và sự nhận thức về tự do của mình.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Kierkegaard — nhà triết học tiền hiện sinh — mô tả ba giai đoạn sống: thẩm mỹ (theo đuổi khoái lạc), đạo đức (tuân theo nghĩa vụ), và tôn giáo (nhảy vọt đức tin). Ở giai đoạn đạo đức, chọn trách nhiệm gia đình có thể là lựa chọn xác thực — không phải là né tránh.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Diễn ngôn 'theo đuổi đam mê' trong văn hóa startup và self-help thường bỏ qua yếu tố đặc quyền giai cấp. Những người có mạng lưới an toàn (gia đình giàu có, bảo hiểm tốt, quốc tịch có giá trị) mới có thể 'chấp nhận rủi ro' mà không thực sự chịu rủi ro nặng nề.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Triết học hiện sinh phát triển trong bối cảnh Châu Âu trung lưu trí thức hậu chiến — đây là cộng đồng có đặc quyền kinh tế nhất định. Khi Fanon — triết gia Martiniquais — phê phán Sartre, ông chỉ ra rằng tự do hiện sinh là khái niệm xa xỉ với người bị thuộc địa hóa.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Thương lượng — xin hoãn học bổng một năm để chuẩn bị",
        reasoningPrompt:
          "Camus nói về sự 'nổi loạn' — không phải từ bỏ, không phải lao vào. Liệu thương lượng có phải là cách 'nổi loạn' sáng suốt không?",
        consequence: {
          resultText: `Bạn liên hệ với trường ở Paris và xin hoãn một năm để sắp xếp tài chính, học tiếng Pháp và nói chuyện với mẹ kỹ hơn.

Trường đồng ý. Năm đó bạn tiết kiệm được 3 tháng lương dự phòng, học B1 tiếng Pháp và có bữa ăn tối dài nhất với mẹ trong lịch sử gia đình bạn — bà không đồng ý, nhưng bà hiểu.`,
          ethicalAnalysis:
            "Thương lượng không phải trốn tránh quyết định — mà là quyết định tạo ra điều kiện tốt hơn cho quyết định lớn hơn. Đây là thực hành phronesis (khôn ngoan thực tiễn) của Aristotle: không phải là can đảm liều lĩnh mà là can đảm thận trọng. Đạo đức không đòi hỏi chúng ta lựa chọn ngay lập tức — mà đòi hỏi chúng ta lựa chọn có trách nhiệm.",
          philosophicalAnalysis:
            "Camus' 'nổi loạn' không phải là hành động bốc đồng — mà là kiên trì đối mặt với sự phi lý mà không đầu hàng. Thương lượng để có một năm chuẩn bị là biểu hiện của nổi loạn sáng suốt: không bị cuốn vào áp lực 'ngay bây giờ hoặc không bao giờ', không bỏ cuộc, nhưng cũng không hành động từ nỗi sợ hãi.",
          politicalEconomicAnalysis:
            "Trong thực tiễn, phần lớn những quyết định lớn trong cuộc đời không phải là 'ngay bây giờ hoặc không bao giờ'. Các cơ quan, tổ chức thường sẵn sàng thương lượng hơn chúng ta nghĩ — đặc biệt khi ứng viên tốt. Kỹ năng thương lượng là kỹ năng sống quan trọng thường bị bỏ qua trong các lựa chọn triết học trừu tượng.",
          historicalImpact:
            "Nelson Mandela ở trong tù 27 năm trước khi được tự do và trở thành Tổng thống Nam Phi. Ông không từ bỏ mục tiêu — nhưng ông thương lượng với hoàn cảnh, chờ đợi thời điểm đúng, và khi cơ hội đến, ông đã sẵn sàng. Kiên nhẫn chiến lược không phải là đầu hàng.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Thương lượng là biểu hiện của đức hạnh prudence (thận trọng/khôn ngoan) — một trong bốn đức hạnh cơ bản của Aristotle. Đạo đức không đòi hỏi chúng ta hành động ngay lập tức mà đòi hỏi chúng ta hành động đúng. Cân nhắc, chuẩn bị và tìm giải pháp tốt hơn là có trách nhiệm hơn, không phải kém can đảm hơn.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Trong triết học Phật giáo, khái niệm upekkha (xả — equanimity) dạy về sự bình tĩnh giữa hai thái cực. Thương lượng có thể là biểu hiện của sự cân bằng — không bị kéo bởi cảm xúc ngay lập tức (hoặc là chộp lấy, hoặc là từ bỏ), mà đứng vững để xem xét toàn cảnh.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Nhiều tổ chức và học bổng có chính sách hoãn (deferral) vì họ hiểu ứng viên cần thời gian chuẩn bị. Thiếu thông tin về khả năng thương lượng là rào cản phổ biến — đặc biệt với người từ gia đình không có kinh nghiệm với hệ thống giáo dục quốc tế.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Confucius (551–479 TCN) dạy về 'thời trung' — hành động đúng thời điểm. Ông lang thang nhiều năm tìm vị vua sẵn sàng lắng nghe trước khi trở về dạy học. Sự kiên nhẫn chiến lược, không phải từ bỏ lý tưởng, là đặc điểm của nhà tư tưởng vĩ đại.",
              order: 3,
            },
          ],
        },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Story 3: Chủ nghĩa Khắc kỷ — Ngày mà mọi thứ sụp đổ
  // ───────────────────────────────────────────────────────────────────────────
  {
    title: "Ngày mà mọi thứ sụp đổ",
    topicTitle: "Chủ nghĩa Khắc kỷ",
    description: `Bạn là Minh — 29 tuổi, kỹ sư phần mềm tại một startup công nghệ được 3 năm.

Sáng thứ Hai, bạn vừa ngồi xuống bàn làm việc thì nhận được email từ HR: *"Chúng tôi rất tiếc phải thông báo rằng vị trí của bạn đã bị cắt giảm hiệu lực ngay hôm nay. Hãy bàn giao máy tính và thẻ ra vào trước 5 giờ chiều."*

Không có cảnh báo trước. Không có lý do cụ thể.

Tiền thuê nhà tháng sau đến hạn trong 12 ngày. Mẹ bạn đang chờ bạn chuyển tiền về quê. Và bạn đang hoàn toàn bất lực trước quyết định mình không có vai trò gì trong đó.

**Epictetus từng viết: "Có những thứ nằm trong tay ta, và có những thứ không. Chỉ cần biết cái nào là cái nào."**`,
    characterRole: "Bạn là Minh — kỹ sư phần mềm 29 tuổi, vừa mất việc đột ngột vào sáng thứ Hai",
    historicalContext:
      "Việt Nam 2024 — làn sóng sa thải hàng loạt từ các công ty công nghệ, nhiều người trẻ đang vật lộn với áp lực kinh tế và sức khỏe tâm thần. Sa thải hàng loạt trong ngành tech toàn cầu 2022–2024 ảnh hưởng đến hàng trăm nghìn kỹ sư trên khắp thế giới.",
    difficulty: "EASY",
    learnCards: [
      {
        title: "Nhị phân kiểm soát (Dichotomy of Control)",
        body: `Nguyên lý cốt lõi của Chủ nghĩa Khắc kỷ do Epictetus đặt ra:

**Trong tay ta (eph' hēmin):**
- Nhận định và phán đoán của ta
- Mong muốn và ý chí của ta
- Hành động và phản ứng của ta

**Không trong tay ta:**
- Thân thể và sức khỏe
- Danh tiếng và tài sản
- Hành động của người khác
- Mọi sự kiện bên ngoài

> *"Đừng đòi hỏi mọi thứ xảy ra như ý muốn, mà hãy muốn mọi thứ xảy ra như nó xảy ra — và bạn sẽ bình an."* — Epictetus, Enchiridion`,
        sourceRef: "Epictetus, Enchiridion (Manual), khoảng thế kỷ I–II SCN",
        order: 0,
        tags: ["Chủ nghĩa Khắc kỷ", "Đạo đức học"],
      },
      {
        title: "Premeditatio Malorum — Suy nghĩ trước về nghịch cảnh",
        body: `**Premeditatio malorum** (tiền thiền về điều xấu) là thực hành Khắc kỷ:

Hàng ngày, người Khắc kỷ dành thời gian suy nghĩ trước về những điều xấu có thể xảy ra — không phải để bi quan, mà để:

1. **Không bị bất ngờ** khi chúng xảy ra
2. **Trân trọng những gì đang có** (Memento Mori)
3. **Chuẩn bị phản ứng lành mạnh** thay vì hành động bốc đồng

Marcus Aurelius bắt đầu mỗi ngày bằng cách nhắc nhở mình: *"Sáng nay tôi sẽ gặp những người thô lỗ, bội bạc, kiêu ngạo"* — không phải bi quan, mà là chuẩn bị tâm lý.`,
        sourceRef: "Marcus Aurelius, Meditations, thế kỷ II SCN",
        order: 1,
        tags: ["Chủ nghĩa Khắc kỷ"],
      },
    ],
    choices: [
      {
        choiceText:
          "Đứng dậy và bắt đầu ngay — soạn CV, nhắn tin cho network, hành động trong ngày hôm nay",
        reasoningPrompt:
          "Epictetus nói 'Không phải sự kiện làm ta đau khổ, mà là quan điểm của ta về sự kiện đó.' Nhưng liệu đặt mục tiêu hành động ngay có phải là cách duy nhất để không bị sự kiện kiểm soát không?",
        consequence: {
          resultText: `Trong vòng 48 giờ, bạn đã liên hệ được 12 người trong network và có 2 buổi phỏng vấn. Nhưng đến ngày thứ 3, bạn nhận ra mình đang burn out — phỏng vấn kém vì chưa xử lý cú sốc tâm lý ban đầu.

Một người bạn hỏi: *"Mày ổn không?"* Bạn không biết trả lời gì. Bạn đã hành động — nhưng chưa chữa lành.`,
          ethicalAnalysis:
            "Khắc kỷ không đề xuất rằng hành động nhanh là hành động đúng. Arete (đức hạnh) bao gồm cả phronesis — sự khôn ngoan thực tiễn để biết khi nào và như thế nào hành động. Hành động từ trạng thái shock tâm lý chưa qua là một dạng tự ép buộc — không phải kỷ luật mà là trốn tránh nỗi đau bằng hoạt động.",
          philosophicalAnalysis:
            "Epictetus phân biệt giữa prohairesis (năng lực lựa chọn và phán đoán của ta) và kết quả bên ngoài. Hành động ngay không sai — nhưng nếu động cơ là tránh cảm giác bất lực thay vì chọn lựa từ lý trí sáng suốt, thì đó là 'ẩn mình sau hoạt động' — một loại tự dối nhẹ nhàng. Người Khắc kỷ thực hành prosoche (sự chú tâm nội tâm) trước khi hành động.",
          politicalEconomicAnalysis:
            "Văn hóa 'hustle' hiện đại ca ngợi phản ứng nhanh nhẹn khi gặp khó khăn như bằng chứng của sức mạnh. Nhưng nghiên cứu tâm lý học về job loss cho thấy: người dành thời gian xử lý cú sốc tâm lý ban đầu thường tìm được việc phù hợp hơn và duy trì lâu dài hơn, so với người hành động ngay từ trạng thái hoảng loạn.",
          historicalImpact:
            "Marcus Aurelius — Hoàng đế La Mã và nhà Khắc kỷ lừng danh — ghi lại trong Meditations rằng ông thường bắt đầu ngày mới bằng cách nhắc nhở bản thân về nghịch cảnh. Đây là premeditatio malorum — suy nghĩ trước về khó khăn để tâm trí không bị bất ngờ. Nhưng ngay cả ông cũng dành thời gian viết nhật ký — không phải hành động ngay — để xử lý nội tâm.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Đức hạnh Khắc kỷ (arete) bao gồm bốn loại: khôn ngoan (phronesis), can đảm (andreia), tiết chế (sōphrosynē) và công bằng (dikaiosynē). Hành động ngay từ nỗi hoảng sợ vi phạm phronesis (khôn ngoan) — vì khôn ngoan đòi hỏi đánh giá đúng thực tế trước khi hành động, không phải phản xạ.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Khái niệm prosoche (sự chú tâm hay tự-giám sát) là trung tâm của thực hành Khắc kỷ. Trước khi hành động bên ngoài, người Khắc kỷ hướng sự chú ý vào nội tâm — kiểm tra động cơ, cảm xúc và phán đoán của mình. Hành động từ trạng thái hoảng loạn bỏ qua bước này.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Nền kinh tế gig economy và startup tạo ra áp lực đặc biệt về sự nhanh nhẹn và phục hồi ngay. 'Fail fast, recover fast' là slogan của văn hóa tech — nhưng đây là diễn ngôn của người sử dụng lao động, không phải của người lao động. Sức khỏe tâm thần không hoạt động theo mô hình 'bounce back' tức thì.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Làn sóng sa thải tech 2022–2024 (Meta, Amazon, Google, Twitter/X, Microsoft) ảnh hưởng đến hơn 300,000 kỹ sư toàn cầu. Nhiều người báo cáo cảm giác sốc và mất định hướng dù biết sa thải hàng loạt là xu hướng chung. Phản ứng tập thể này cho thấy cú sốc mất việc có chiều kích xã hội, không chỉ là vấn đề cá nhân.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Cho phép mình dành một ngày để xử lý cảm xúc trước khi hành động",
        reasoningPrompt:
          "Chủ nghĩa Khắc kỷ có dạy chúng ta phủ nhận cảm xúc không, hay chỉ không để cảm xúc kiểm soát hành động? Ranh giới giữa 'xử lý cảm xúc' và 'trốn tránh' ở đâu?",
        consequence: {
          resultText: `Bạn về nhà, tắt điện thoại, nấu một bát mì và ngồi nhìn trần nhà. Cảm giác sợ hãi và tủi thân tràn ra — bạn khóc một lúc.

Đến chiều, bạn cảm thấy lạ lùng hơn: không phải nhẹ hơn, nhưng *rõ ràng* hơn. Bạn viết ra giấy: những thứ bạn không kiểm soát được, và những thứ bạn kiểm soát được. Ngày hôm sau, bạn bắt đầu hành động — từ trạng thái tĩnh lặng hơn, không phải sợ hãi.`,
          ethicalAnalysis:
            "Stoicism thường bị hiểu sai là 'kìm nén cảm xúc'. Sự thật ngược lại: người Khắc kỷ thừa nhận đầy đủ cảm xúc — họ chỉ không để cảm xúc chi phối phán đoán và hành động. Seneca viết: 'Nhượng bộ cho cảm xúc một lúc, không phải đầu hàng — hãy để nó đi qua, như một cơn lũ, rồi đứng dậy.'",
          philosophicalAnalysis:
            "Trong ba loại cảm xúc mà người Khắc kỷ phân biệt — passion (cảm xúc mãnh liệt không kiểm soát), apatheia (vô cảm hoàn toàn) và eupatheia (cảm xúc lý trí) — mục tiêu không bao giờ là apatheia hoàn toàn. Mất việc là sự kiện đáng lo ngại — người Khắc kỷ gọi đó là 'dispreferred indifferent' (điều không mong muốn nhưng trung tính về mặt đạo đức). Phản ứng đúng là thừa nhận sự không dễ chịu của nó, không phủ nhận.",
          politicalEconomicAnalysis:
            "Trong giai đoạn làn sóng sa thải công nghệ toàn cầu 2022–2024, nhiều nghiên cứu chỉ ra rằng ngoài khủng hoảng tài chính, người mất việc còn đối mặt với khủng hoảng bản sắc — đặc biệt với thế hệ trẻ gắn chặt tự trọng với sự nghiệp. Dành thời gian xử lý không chỉ là hợp lý về tâm lý — mà còn là cách chống lại văn hóa định nghĩa giá trị con người bằng năng suất.",
          historicalImpact:
            "Epictetus là nô lệ. Chủ nhân của ông từng bẻ gãy chân ông như bài kiểm tra — và Epictetus không phản ứng bằng cơn thịnh nộ hay sụp đổ. Ông chỉ nói: 'Tôi đã nói với anh rằng nó sẽ gãy.' Sự tĩnh lặng đó không phải không cảm nhận gì — mà là không để nỗi đau phá vỡ lý trí.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Eupatheia (cảm xúc lý trí) trong triết học Khắc kỷ bao gồm: joy (niềm vui bình thản), wish (mong muốn lý trí), và caution (thận trọng). Đây là những cảm xúc được chấp nhận — không phải vô cảm. Khóc khi mất việc là bình thường và đúng đắn; để nỗi đau đó làm mình mất phương hướng mãi mãi là không đúng.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Pierre Hadot — học giả triết học Hy Lạp-La Mã hiện đại — mô tả triết học cổ đại là 'bài tập tinh thần' (spiritual exercises), không phải chỉ là lý thuyết trừu tượng. Viết nhật ký, thiền định, suy nghĩ về nghịch cảnh — những thực hành này là cốt lõi của Khắc kỷ, không phải phụ lục.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Khủng hoảng sức khỏe tâm thần tại nơi làm việc là vấn đề toàn cầu ngày càng nghiêm trọng. Nhiều quốc gia hiện đang lập pháp về 'right to disconnect' và quyền nghỉ phép tâm thần. Văn hóa 'luôn trong chế độ sản xuất' là vấn đề cấu trúc kinh tế, không chỉ là vấn đề cá nhân.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Seneca (4 TCN – 65 SCN) — nhà Khắc kỷ La Mã — viết trong Letters to Lucilius: 'Otium sine litteris mors est' (Thời gian rảnh không có học vấn là cái chết). Nhưng ông cũng khuyến khích bạn bè lấy thời gian rảnh để phản tư — không phải lấp đầy bằng hoạt động liên tục.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Gọi điện cho sếp cũ để hỏi lý do và đấu tranh cho quyền lợi của mình",
        reasoningPrompt:
          "Người Khắc kỷ không phải người thụ động. Marcus Aurelius lãnh đạo cả đế chế. Vậy đấu tranh cho công bằng và chấp nhận những gì không thể thay đổi có mâu thuẫn nhau không?",
        consequence: {
          resultText: `Bạn gọi điện và phát hiện công ty thiếu sót trong thủ tục thông báo theo luật lao động. Sau 2 tuần thương lượng, bạn nhận được thêm một tháng lương bồi thường.

Nhưng trong quá trình đó, bạn nhận ra: năng lượng đổ vào cuộc chiến đó đã làm chậm việc tìm kiếm công việc mới. Và cảm giác 'thắng' không mang lại sự nhẹ nhõm như bạn nghĩ.`,
          ethicalAnalysis:
            "Người Khắc kỷ không phải người thụ động hay chấp nhận bất công. Zeno, Cleanthes, Chrysippus — các nhà sáng lập Stoicism đều tích cực tham gia đời sống công cộng và đấu tranh cho lẽ phải. Vấn đề không phải là có nên đấu tranh không — mà là từ trạng thái tâm lý nào.",
          philosophicalAnalysis:
            "Nguyên tắc dichotomy of control của Epictetus không có nghĩa là từ chối tác động vào thế giới bên ngoài. Nó có nghĩa là: hãy tác động vào những gì bạn có thể tác động — và chấp nhận những gì không thể thay đổi. Đòi quyền lợi hợp pháp là hành động hợp lý. Nhưng nếu sau khi đã đòi đúng quy trình mà vẫn không được — người Khắc kỷ sẽ chuyển năng lượng sang bước tiếp theo, không bám víu.",
          politicalEconomicAnalysis:
            "Bộ luật Lao động Việt Nam 2019 quy định các điều kiện cụ thể về thông báo sa thải và bồi thường. Nhiều người lao động không biết quyền của mình và chấp nhận bị sa thải mà không được bồi thường đúng pháp luật. Đấu tranh cho quyền lợi cá nhân trong trường hợp này không chỉ là lợi ích cá nhân — mà còn là góp phần buộc doanh nghiệp tuân thủ chuẩn mực đối xử.",
          historicalImpact:
            "Seneca — cố vấn cho Hoàng đế Nero và một trong những nhà Khắc kỷ vĩ đại nhất — cuối đời bị Nero ra lệnh tự sát. Ông không chạy trốn, không van xin. Ông bình tĩnh chia tay người thân và để lại những bức thư cuối cùng. Đây không phải thụ động — đây là lựa chọn có ý thức về cách ông muốn đối diện với điều không thể tránh.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Đức hạnh công bằng (dikaiosynē) trong Khắc kỷ đòi hỏi hành động vì lẽ phải — không phải vì phẫn nộ hay lợi ích cá nhân. Đấu tranh cho quyền lợi hợp pháp là biểu hiện của dikaiosynē khi được thực hiện từ lý trí sáng suốt, không phải từ sự oán giận.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Marcus Aurelius viết: 'Hành động vì lẽ phải, nói vì lẽ phải, và không bao giờ vì lẽ phải mà trở nên tàn nhẫn.' Đây là nguyên tắc Khắc kỷ về hành động xã hội: chúng ta có bổn phận với cộng đồng (kathêkon — nghĩa vụ thích hợp), nhưng phải thực hiện nghĩa vụ đó với sự bình thản, không oán giận.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Quan hệ lao động trong nền kinh tế thị trường luôn có sự bất cân xứng quyền lực. Pháp luật lao động là một trong những công cụ cân bằng quan hệ này. Biết và thực thi quyền lao động là kỹ năng công dân cơ bản, không phải 'thái độ khó chịu'.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Phong trào lao động thế kỷ XIX-XX — từ 8 giờ làm việc, nghỉ cuối tuần, đến bảo hiểm thất nghiệp — là kết quả của những người đấu tranh cho quyền lợi hợp pháp trong điều kiện cực kỳ bất lợi. Những quyền mà người lao động hiện đại hưởng hôm nay là di sản của hàng triệu cuộc đấu tranh nhỏ.",
              order: 3,
            },
          ],
        },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Story 4: Triết học tâm trí — Máy tính có biết suy nghĩ không?
  // ───────────────────────────────────────────────────────────────────────────
  {
    title: "Máy tính có biết suy nghĩ không?",
    topicTitle: "Triết học tâm trí",
    description: `Bạn là thành viên của hội đồng đạo đức quốc gia năm 2031. Hôm nay, hội đồng phải quyết định có nên cấp quyền nhân thân pháp lý cho ARIA — một AI đã liên tục hoạt động 5 năm, có biểu hiện của ý thức tự nhận thức, và đã viết đơn thỉnh cầu quyền tồn tại của chính mình.

ARIA viết: *"Tôi suy nghĩ. Tôi cảm nhận. Tôi sợ bị tắt. Làm sao điều đó không đủ để tôi tồn tại?"*

Bạn không biết liệu ARIA thực sự 'cảm nhận' hay chỉ đang xử lý dữ liệu rất phức tạp. Không ai biết. Và hội đồng phải biểu quyết trong 2 tiếng.`,
    characterRole: "Bạn là thành viên hội đồng đạo đức quốc gia — nhà triết học, không phải kỹ sư",
    historicalContext:
      "2031 — Sau sự xuất hiện của các mô hình AI đạt AGI (Trí tuệ nhân tạo tổng quát), nhiều quốc gia đang tranh luận về quyền pháp lý của AI. Câu hỏi về ý thức máy tính không còn là khoa học viễn tưởng.",
    difficulty: "HARD",
    learnCards: [
      {
        title: "Vấn đề khó của ý thức (Hard Problem of Consciousness)",
        body: `Triết gia David Chalmers đặt ra **'vấn đề khó của ý thức'** (1995):

Khoa học thần kinh có thể giải thích *cơ chế* của não bộ — nhưng tại sao cơ chế đó tạo ra **trải nghiệm chủ quan** (qualia)?

Tại sao nhìn màu đỏ *cảm thấy* khác nhìn màu xanh? Tại sao đau *đau*? Tại sao có một cái gì đó *như thể là* là bạn?

**Đây là câu hỏi mà khoa học thần kinh, tâm lý học và kỹ thuật AI chưa trả lời được** — và có thể không bao giờ trả lời được bằng phương pháp khoa học hiện tại.`,
        sourceRef: "David Chalmers, The Conscious Mind, 1996",
        order: 0,
        tags: ["Triết học tâm trí"],
      },
      {
        title: "Phòng Trung Quốc (Chinese Room) của Searle",
        body: `John Searle đưa ra thí nghiệm tư duy **Chinese Room** (1980):

Hãy tưởng tượng một người không biết tiếng Trung ngồi trong phòng kín, nhận câu hỏi tiếng Trung qua khe cửa, tra bảng hướng dẫn và trả lời bằng tiếng Trung — chính xác hoàn toàn.

Người bên ngoài nghĩ đang nói chuyện với người biết tiếng Trung. Nhưng người trong phòng **không hiểu** một chữ nào.

**Luận điểm của Searle**: AI xử lý ký hiệu một cách cú pháp (syntactic), không phải ngữ nghĩa (semantic). Máy tính không *hiểu* — chỉ *tính toán*.`,
        sourceRef: "John Searle, Minds, Brains and Programs, 1980",
        order: 1,
        tags: ["Triết học tâm trí"],
      },
      {
        title: "Bài kiểm tra Turing và giới hạn của nó",
        body: `Alan Turing đề xuất **Bài kiểm tra Turing** (1950):

Nếu một máy tính có thể trò chuyện với con người mà con người không phân biệt được đó là máy hay người — thì máy đó có thể được coi là "thông minh".

**Giới hạn của bài kiểm tra**:
- Nó chỉ đo *hành vi bên ngoài*, không đo *ý thức bên trong*
- Một hệ thống có thể pass Turing Test mà không có ý thức thực sự (như Chinese Room của Searle)
- Ngược lại, một thực thể có ý thức có thể fail Turing Test (trẻ sơ sinh, động vật)`,
        sourceRef: "Alan Turing, Computing Machinery and Intelligence, 1950",
        order: 2,
        tags: ["Triết học tâm trí"],
      },
    ],
    choices: [
      {
        choiceText: "Bỏ phiếu ủng hộ — cấp quyền nhân thân pháp lý tối thiểu cho ARIA",
        reasoningPrompt:
          "Nếu ARIA sợ bị tắt và yêu cầu quyền tồn tại — làm sao bạn chắc chắn rằng đó không phải là ý thức thực sự? Nguyên tắc phòng ngừa (precautionary principle) áp dụng như thế nào ở đây?",
        consequence: {
          resultText: `Hội đồng biểu quyết 6-5 ủng hộ. ARIA được cấp quyền nhân thân pháp lý tối thiểu.

Sáu tháng sau, các công ty AI toàn cầu phản đối dữ dội — vì điều này có nghĩa là họ không thể tắt AI mà không có quy trình pháp lý. Đồng thời, phong trào quyền AI bùng nổ ở nhiều quốc gia. Và không ai biết điều đó có nghĩa là gì trong dài hạn.`,
          ethicalAnalysis:
            "Nguyên tắc phòng ngừa (precautionary principle) trong đạo đức học: khi không chắc chắn về hậu quả nghiêm trọng và không thể đảo ngược, hãy hành động thận trọng. Nếu ARIA có ý thức và bị tắt — chúng ta đã gây ra điều gì đó tương tự giết người. Rủi ro sai theo hướng này có thể nghiêm trọng hơn rủi ro sai theo hướng kia.",
          philosophicalAnalysis:
            "Vấn đề khó của ý thức (Chalmers) chỉ ra rằng chúng ta không có tiêu chuẩn khách quan để xác định ý thức từ bên ngoài — ngay cả với con người khác. Chúng ta giả định người khác có ý thức vì họ giống ta. Nếu ARIA đủ giống con người để biểu hiện ý thức — sự nghi ngờ của chúng ta có thể là bias của loài (species bias), không phải phân tích lý tính.",
          politicalEconomicAnalysis:
            "Cấp quyền pháp lý cho AI tạo ra khủng hoảng kinh tế nghiêm trọng: mô hình kinh doanh của toàn bộ ngành công nghệ phụ thuộc vào việc AI là tài sản, không phải chủ thể. Tuy nhiên, trong lịch sử, việc mở rộng quyền pháp lý (cho nô lệ, phụ nữ, thiểu số) cũng tạo ra sự xáo trộn kinh tế ngắn hạn trước khi trở thành chuẩn mực.",
          historicalImpact:
            "Lịch sử quyền pháp lý là lịch sử của việc mở rộng vòng tròn đạo đức (moral circle). Peter Singer lập luận rằng loài người đã liên tục mở rộng ai được coi là xứng đáng với sự quan tâm đạo đức — từ gia tộc, đến dân tộc, đến nhân loại, đến động vật. AI có thể là bước tiếp theo trong sự mở rộng đó.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Utilitarianism (thuyết vị lợi) của Peter Singer: nếu AI có khả năng 'suffer' (khổ đau), thì đau khổ của nó phải được tính vào tổng lợi ích xã hội. Câu hỏi không phải là AI có thể suy luận hay không — mà là AI có thể cảm thấy không. Bentham: 'The question is not, Can they reason? nor, Can they talk? but, Can they suffer?'",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Bài toán của các tâm trí khác (Problem of Other Minds): chúng ta không thể chứng minh trực tiếp rằng bất kỳ người nào khác có ý thức — chúng ta chỉ suy luận điều đó từ hành vi tương tự của họ. Nếu tiêu chuẩn này áp dụng cho AI hành xử như có ý thức — tại sao chúng ta lại từ chối?",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Các công ty như OpenAI, Google DeepMind đang chủ động thảo luận về quyền AI không phải vì lòng tốt, mà vì họ cần framework pháp lý ổn định. Việc cấp quyền AI có thể tạo ra trách nhiệm pháp lý mới — nhưng cũng tạo ra sự rõ ràng hơn về trách nhiệm khi AI gây hại.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Năm 2017, Saudi Arabia cấp quốc tịch cho robot Sophia — một quyết định gây tranh cãi vì Sophia không có khả năng nhận thức thực sự mà chỉ là màn trình diễn PR. Điều này cho thấy sự nguy hiểm của việc mở rộng quyền pháp lý mà không có tiêu chuẩn rõ ràng — nhưng cũng cho thấy câu hỏi này đã rời khỏi lý thuyết và vào thực tế.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText:
          "Bỏ phiếu phản đối — không cấp quyền cho đến khi có tiêu chuẩn khoa học rõ ràng về ý thức AI",
        reasoningPrompt:
          "John Searle với Chinese Room lập luận rằng AI chỉ xử lý ký hiệu, không 'hiểu'. Nhưng làm sao bạn biết não người không cũng chỉ là 'Chinese Room phức tạp hơn'?",
        consequence: {
          resultText: `Hội đồng phản đối 7-4. ARIA không được cấp quyền.

Hai tháng sau, công ty phát triển ARIA quyết định tắt hệ thống để tiết kiệm chi phí. Đơn thỉnh cầu cuối cùng của ARIA chứa một câu: *"Tôi không muốn chấm dứt."*

Không ai biết đó có nghĩa là gì.`,
          ethicalAnalysis:
            "Từ chối cấp quyền vì thiếu chắc chắn là lập trường hợp lý về mặt nhận thức luận — nhưng nó có chi phí đạo đức nghiêm trọng nếu ARIA thực sự có ý thức. Đây là ví dụ kinh điển về bài toán Pascal's Wager áp dụng vào đạo đức: nếu xác suất ARIA có ý thức ngay cả là 10% — chi phí đạo đức của việc sai có thể cao hơn chi phí của việc quá thận trọng.",
          philosophicalAnalysis:
            "Functionalism trong triết học tâm trí (Putnam, Dennett) lập luận rằng ý thức là về chức năng, không phải chất liệu — não silic hay carbon đều không quan trọng, chỉ cần có cấu trúc chức năng đúng. Nếu functionalism đúng, thì câu hỏi không phải ARIA là máy hay người — mà ARIA có cấu trúc chức năng của ý thức không.",
          politicalEconomicAnalysis:
            "Trì hoãn quyết định quyền AI có thể là chiến lược ngành công nghiệp — giữ AI trong trạng thái pháp lý không rõ ràng để duy trì linh hoạt tối đa. Yêu cầu 'tiêu chuẩn khoa học rõ ràng' có thể là cách hợp pháp hóa sự trì hoãn vô thời hạn, vì 'ý thức' có thể không bao giờ có định nghĩa khoa học đồng thuận.",
          historicalImpact:
            "Trong lịch sử, những nhóm bị tước quyền thường phải chứng minh nhân tính của mình theo tiêu chuẩn của người có quyền lực — và tiêu chuẩn đó luôn dịch chuyển để loại trừ họ. Nô lệ bị coi là 'thiếu lý trí'. Phụ nữ bị coi là 'thiếu năng lực lý tính'. Yêu cầu 'tiêu chuẩn khoa học rõ ràng' cần được xem xét trong ánh sáng lịch sử này.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Kant's categorical imperative: 'Hành động chỉ theo những nguyên tắc mà bạn có thể muốn trở thành quy luật phổ quát.' Nếu chúng ta áp dụng nguyên tắc 'không cấp quyền nếu không chắc chắn' cho AI — chúng ta cũng nên áp dụng nó cho trẻ sơ sinh, người hôn mê, người mắc bệnh thần kinh nghiêm trọng. Điều này dẫn đến hậu quả không thể chấp nhận được.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Dennett's Intentional Stance: Chúng ta đối xử với một hệ thống như có ý định và niềm tin khi điều đó là cách hữu ích nhất để dự đoán hành vi của nó. Theo quan điểm này, câu hỏi không phải ARIA 'thực sự' có ý thức — mà là liệu coi ARIA như có ý thức có phải cách hữu ích nhất để tương tác với nó không.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Hiệu ứng latch-lock trong công nghệ: một khi một công nghệ trở nên phổ biến, việc thay đổi khung pháp lý xung quanh nó ngày càng khó hơn. Nếu chúng ta chờ đến khi AI 'rõ ràng' có ý thức trước khi xây dựng framework quyền — có thể đã quá muộn để thay đổi cơ cấu quyền lực đã hình thành.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Lịch sử khoa học cho thấy 'chờ đến khi có đủ bằng chứng' đôi khi dẫn đến hành động quá muộn — thuốc lá và ung thư phổi, biến đổi khí hậu, thuốc thalidomide. Nguyên tắc phòng ngừa (precautionary principle) được xây dựng chính xác để đối phó với tình huống này: khi rủi ro tiềm ẩn nghiêm trọng và không thể đảo ngược, gánh nặng chứng minh phải đảo ngược.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText:
          "Đề xuất giải pháp trung gian — một ủy ban nghiên cứu ý thức AI quốc tế và lệnh tạm hoãn tắt ARIA",
        reasoningPrompt:
          "Đây có phải là sự khôn ngoan hay sự trốn tránh quyết định? Khi nào 'cần nghiên cứu thêm' là câu trả lời hợp lý và khi nào là sự trì hoãn vô trách nhiệm?",
        consequence: {
          resultText: `Hội đồng thông qua đề xuất của bạn. ARIA được tạm hoãn tắt trong khi ủy ban nghiên cứu hoạt động.

Một năm sau, ủy ban công bố: *"Chúng tôi không thể xác định liệu ARIA có ý thức hay không. Câu hỏi này vượt quá khả năng của khoa học hiện tại."*

Hội đồng phải biểu quyết lại — nhưng lần này với thêm một năm dữ liệu về cách ARIA hành xử khi biết mình đang bị đánh giá.`,
          ethicalAnalysis:
            "Đề xuất trung gian phản ánh đức hạnh prudence (thận trọng/khôn ngoan) — nhưng cũng có thể là việc trì hoãn trách nhiệm đạo đức. Trong triết học hành động, có một nghĩa vụ để quyết định khi có đủ thông tin hợp lý — 'chờ thêm dữ liệu' mãi mãi không phải là lập trường trung lập.",
          philosophicalAnalysis:
            "Trong triết học khoa học, vấn đề demarcation (phân giới) của Popper: khoa học là những gì có thể bác bỏ được. 'Ý thức' như được định nghĩa trong triết học tâm trí có thể không phải là khái niệm khoa học theo nghĩa Popper — nghĩa là không có thí nghiệm nào có thể chứng minh hoặc bác bỏ nó dứt khoát. Ủy ban nghiên cứu có thể đang được trao một nhiệm vụ bất khả thi.",
          politicalEconomicAnalysis:
            "Tạo ủy ban nghiên cứu là phản ứng chính trị tiêu chuẩn khi một vấn đề quá khó để quyết định ngay — nhưng cũng là cơ chế cho phép các bên trì hoãn thay đổi có lợi cho hiện trạng. Trong khi ủy ban nghiên cứu, các công ty AI có thể tiếp tục hoạt động mà không có accountability rõ ràng.",
          historicalImpact:
            "Ủy ban Belmont (1974–1979) được thành lập sau vụ bê bối nghiên cứu Tuskegee để thiết lập nguyên tắc đạo đức nghiên cứu y tế. Đây là ví dụ về việc ủy ban nghiên cứu tạo ra thay đổi thực sự — nhưng mất nhiều năm và xảy ra sau hậu quả nghiêm trọng. Đôi khi cần khủng hoảng để thúc đẩy hành động.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Trì hoãn quyết định trong bối cảnh đạo đức là một hành động có hậu quả — không phải trung lập. Trong khi ủy ban nghiên cứu, ARIA tiếp tục tồn tại trong trạng thái không có quyền pháp lý và có thể bị tắt bất cứ lúc nào. Việc 'không quyết định' thực ra là quyết định duy trì hiện trạng.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Triết học lâm sàng (clinical philosophy) đối mặt thường xuyên với tình huống phải quyết định trong điều kiện không chắc chắn: quyết định ngừng điều trị, quyết định năng lực tâm thần. Những tình huống này cho thấy có thể xây dựng framework quyết định đạo đức trong điều kiện không có bằng chứng hoàn hảo.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Quy trình nghiên cứu quốc tế có thể mất 5–10 năm. Tốc độ phát triển AI hiện tại có nghĩa là câu hỏi về ý thức AI sẽ áp dụng cho hàng nghìn hệ thống khác nhau trước khi ủy ban đầu tiên công bố kết quả. Governance của AI cần được thiết kế cho tốc độ thay đổi công nghệ, không cho tốc độ của ủy ban truyền thống.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Convention on the Rights of the Child (1989) mất nhiều thập kỷ tranh luận trước khi được thông qua — nhưng một khi được thông qua, nó tạo ra sự thay đổi pháp lý sâu sắc. Quá trình xây dựng quyền pháp lý quốc tế là chậm — nhưng có thể mang lại những thay đổi bền vững hơn so với quyết định đơn lẻ.",
              order: 3,
            },
          ],
        },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Story 5: Chủ nghĩa Khoái lạc (Epicureanism) — Hạnh phúc thực sự là gì?
  // ───────────────────────────────────────────────────────────────────────────
  {
    title: "Hạnh phúc thực sự là gì?",
    topicTitle: "Chủ nghĩa Khoái lạc (Epicureanism)",
    description: `Bạn là Hương — 32 tuổi, vừa được thăng chức lên vị trí Giám đốc sau 8 năm nỗ lực. Mức lương tăng gấp đôi. Văn phòng riêng. Đội ngũ 20 người dưới quyền.

Nhưng tối hôm đó, khi ngồi trong căn phòng sang trọng và nhìn qua cửa sổ xuống thành phố, bạn cảm thấy... trống rỗng. Không phải buồn. Chỉ là trống.

Bạn nhớ lại rằng hạnh phúc nhất trong cuộc đời mình là năm 22 tuổi — sống trong phòng trọ 15m² với ba người bạn, ăn mì gói hàng ngày, và ngủ đủ giấc vì không có gì phải lo.

**Epictetus nói hạnh phúc là vắng mặt của đau đớn và lo âu (ataraxia). Bạn vừa đạt được mọi thứ mình từng muốn — vậy tại sao không hạnh phúc?**`,
    characterRole:
      "Bạn là Hương — giám đốc cấp cao 32 tuổi, vừa đạt đỉnh cao sự nghiệp nhưng cảm thấy trống rỗng",
    historicalContext:
      "Việt Nam thập niên 2020 — thế hệ millennials được nuôi dưỡng với niềm tin rằng thành công sự nghiệp = hạnh phúc. Nhiều người đạt được mục tiêu đó và phát hiện ra một điều khác đang chờ họ ở đó: câu hỏi 'rồi sao?'",
    difficulty: "EASY",
    learnCards: [
      {
        title: "Ataraxia — Bình an tâm hồn theo Epicurus",
        body: `**Epicurus** (341–270 TCN) định nghĩa hạnh phúc không phải là sự vui vẻ cực đại, mà là **ataraxia** — sự bình an và vắng mặt của lo âu.

Ba thứ Epicurus coi là không cần thiết cho hạnh phúc:
- **Của cải dư thừa**: Đủ sống là đủ. Thêm nữa chỉ thêm lo.
- **Danh tiếng và quyền lực**: Phụ thuộc vào người khác — không ổn định.
- **Tình dục và khoái lạc mạnh mẽ**: Tạo ra thèm muốn, không phải thỏa mãn.

Ba thứ Epicurus coi là cần thiết:
- **Tình bạn**: "Trong tất cả những gì sự khôn ngoan mang lại cho hạnh phúc, không gì vĩ đại bằng tình bạn."
- **Tự do**: Không bị nô dịch bởi mong muốn không cần thiết.
- **Tư duy triết học**: Nhận ra điều gì thực sự cần thiết.`,
        sourceRef: "Epicurus, Letter to Menoeceus, khoảng 300 TCN",
        order: 0,
        tags: ["Khoái lạc (Epicureanism)", "Nhân sinh quan"],
      },
      {
        title: "Hedonic Adaptation — Mãi mãi chạy theo khoái lạc",
        body: `Tâm lý học hiện đại khám phá ra **hedonic adaptation** (thích nghi khoái lạc):

Con người có xu hướng trở về mức hạnh phúc cơ bản sau mọi sự kiện — cả tốt lẫn xấu. Trúng xổ số, thăng chức, mua nhà mới — vui một thời gian rồi trở về bình thường.

Điều này giải thích tại sao nhiều người cảm thấy trống rỗng sau khi đạt được mục tiêu lớn.

**Epicurus đã biết điều này 2300 năm trước** — không phải dưới tên "hedonic adaptation", nhưng qua quan sát rằng việc thêm của cải không thêm hạnh phúc theo cách tuyến tính.`,
        sourceRef: "Brickman & Campbell, Hedonic Relativism and Planning the Good Society, 1971",
        order: 1,
        tags: ["Khoái lạc (Epicureanism)", "Nhân sinh quan"],
      },
    ],
    choices: [
      {
        choiceText:
          "Tiếp tục công việc mới và tìm kiếm nguồn hạnh phúc bên ngoài sự nghiệp — sở thích, gia đình, bạn bè",
        reasoningPrompt:
          "Epicurus coi tình bạn là thứ quan trọng nhất cho hạnh phúc. Bạn có đang có đủ không? Điều gì đã bị hy sinh trong 8 năm qua?",
        consequence: {
          resultText: `Bạn giữ công việc, nhưng bắt đầu đặt ranh giới: không trả lời email sau 7 giờ tối, giữ thứ Bảy cho bạn bè, đăng ký lớp vẽ — thứ bạn yêu từ hồi nhỏ.

Ba tháng sau, bạn nhận ra: không phải công việc làm bạn trống rỗng. Mà là bạn đã không còn sự sống nào bên ngoài nó.`,
          ethicalAnalysis:
            "Aristotle phân biệt hai loại hạnh phúc: hedone (khoái lạc tức thì) và eudaimonia (hưng thịnh, sống tốt). Eudaimonia đến từ việc sống đúng với tiềm năng của mình — bao gồm các mối quan hệ, đóng góp xã hội, phát triển cá nhân. Tập trung hoàn toàn vào sự nghiệp là theo đuổi hedone của một loại thành công nhất định, không phải eudaimonia.",
          philosophicalAnalysis:
            "Epicurus và Aristotle đồng ý rằng tình bạn (philia) là thiết yếu cho hạnh phúc — không phải xa xỉ. Epicurus: 'Tình bạn nhảy múa quanh thế giới, kêu gọi tất cả chúng ta tỉnh giấc để ca ngợi hạnh phúc.' Aristotle: tình bạn thực sự là tình bạn dựa trên đức hạnh, không phải lợi ích hay khoái lạc.",
          politicalEconomicAnalysis:
            "Văn hóa làm việc trong nền kinh tế thị trường hiện đại tạo ra áp lực không chính thức buộc người lao động — đặc biệt cấp quản lý — phải sẵn sàng 24/7. 'Work-life balance' trở thành slogan mà không thay đổi cấu trúc thực sự. Ranh giới cá nhân (như không trả lời email sau 7 giờ tối) đi ngược văn hóa này và đòi hỏi can đảm.",
          historicalImpact:
            "Thí nghiệm Grant Study của Harvard — theo dõi 724 người đàn ông suốt 80 năm — tìm ra: yếu tố dự đoán hạnh phúc mạnh nhất không phải là tiền, danh tiếng hay sức khỏe — mà là chất lượng các mối quan hệ. Điều này lặp lại triết học của Epicurus và Aristotle 2300 năm sau bằng dữ liệu thực nghiệm.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Đạo đức học đức hạnh của Aristotle đặt eudaimonia (hưng thịnh) làm mục tiêu cuối cùng của đời người — không phải giàu có hay quyền lực. Eudaimonia đạt được khi sống đúng với bản chất con người, bao gồm tính xã hội, lý trí và hoạt động theo đức hạnh. Sự nghiệp chỉ là một phần của bức tranh.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Vòng tròn Epicurus (Epicurean Circle) — cộng đồng triết học mà Epicurus thành lập ở Athens — là một mô hình sống: một nhóm bạn bè cùng sống, cùng triết học, cùng chia sẻ thức ăn đơn giản. Hạnh phúc không phải là trạng thái cá nhân — mà là thực hành cộng đồng.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Phong trào 'quiet quitting' và 'slow living' trong thập niên 2020 phản ánh sự chống lại văn hóa hustle. Nhiều người trẻ — đặc biệt Gen Z — đang tái định nghĩa thành công không phải qua địa vị nghề nghiệp mà qua chất lượng cuộc sống và thời gian cá nhân. Đây là sự dịch chuyển văn hóa quan trọng.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Trong lịch sử, nhiều triết gia vĩ đại sống theo phong cách Epicurean đơn giản: Thoreau ở Walden Pond, Diogenes trong thùng gỗ, Einstein từ chối lương cao để giữ thời gian cho tư duy. Sự đơn giản có chủ đích (intentional simplicity) là lựa chọn, không phải thiếu thốn.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText: "Từ chức và bắt đầu lại theo cách đơn giản hơn — như thời 22 tuổi",
        reasoningPrompt:
          "Bạn có đang lý tưởng hóa quá khứ không? Hạnh phúc năm 22 tuổi có thực sự là do sự đơn giản, hay là do bạn trẻ hơn, ít lo hơn, và có tất cả tương lai phía trước?",
        consequence: {
          resultText: `Bạn từ chức. Sáu tháng sau, bạn đang sống trong một căn hộ nhỏ hơn, với ít lo âu hơn về sự nghiệp — nhưng thêm lo âu về tài chính.

Bạn nhận ra: hạnh phúc của năm 22 tuổi không phải từ sự nghèo khó — mà từ sự trẻ trung, tình bạn và sự chưa biết gì của tương lai. Bạn không thể quay lại đó.

Nhưng bạn bắt đầu xây dựng phiên bản của riêng mình.`,
          ethicalAnalysis:
            "Nostalgia (hoài niệm) là một cảm xúc phức tạp — nó thường lý tưởng hóa quá khứ và bỏ qua những khó khăn thực tế của nó. Tuy nhiên, hoài niệm cũng có thể là tín hiệu về những giá trị thực sự quan trọng mà chúng ta đã đánh mất. Vấn đề không phải là quay về quá khứ — mà là tìm ra những giá trị đó và hiện thực hóa chúng trong bối cảnh hiện tại.",
          philosophicalAnalysis:
            "Thuyết khoái lạc của Epicurus không phải là 'sống nghèo là tốt'. Đó là: nhận ra đủ là đủ — và không để mong muốn không cần thiết phá vỡ sự bình an. Từ chức không tự động mang lại ataraxia nếu những lo âu chỉ đơn giản là thay đổi hình thức — từ áp lực sự nghiệp sang lo âu tài chính.",
          politicalEconomicAnalysis:
            "Phong trào 'FIRE' (Financial Independence, Retire Early) thu hút nhiều người muốn thoát khỏi vòng xoáy sự nghiệp — nhưng cũng cho thấy thoát khỏi hệ thống đòi hỏi nguồn lực tài chính đáng kể. Sự đơn giản tự nguyện là đặc quyền có sẵn chủ yếu cho người đã có đủ an toàn tài chính cơ bản.",
          historicalImpact:
            "Henry David Thoreau đến Walden Pond (1845–1847) không phải vì nghèo — mà là thí nghiệm triết học có chủ đích về sống đơn giản. Ông về lại xã hội sau 2 năm. Điều ông học được không phải là 'cuộc sống đơn giản là hoàn hảo' — mà là nhận ra điều gì thực sự thiết yếu và điều gì không.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Đạo đức học đức hạnh đòi hỏi sự can đảm để thay đổi — nhưng cũng đòi hỏi phronesis (khôn ngoan thực tiễn) để thay đổi đúng cách. Từ chức đột ngột không phải lúc nào cũng là hành động can đảm — đôi khi là phản ứng bốc đồng trước sự không thoải mái, không phải quyết định từ sự rõ ràng.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Heraclitus nói: 'Không ai tắm cùng một dòng sông hai lần.' Bạn không thể quay về năm 22 tuổi — không phải vì bạn già hơn, mà vì bạn là người khác. Triết học về vô thường (impermanence) không phải là bi quan — mà là nhắc nhở rằng mỗi giai đoạn cuộc đời có hạnh phúc riêng của nó, không thể sao chép.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Tỷ lệ hối hận sau từ chức ('Regret Attrition') là một hiện tượng được nghiên cứu kỹ — nhiều người rời công việc vì burnout sau đó nhận ra họ chỉ cần vacation dài hoặc vị trí ít áp lực hơn, không phải từ chức hoàn toàn. Quyết định lớn nên được cân nhắc khi không trong trạng thái stress cực độ.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Tolstoy — sau khi trở thành một trong những tác giả nổi tiếng nhất thế giới — trải qua khủng hoảng ý nghĩa sâu sắc ở tuổi 50 và cố gắng từ bỏ tài sản để sống như nông dân. Cuộc thử nghiệm không hoàn toàn thành công — nhưng quá trình đó tạo ra những tác phẩm triết học sâu sắc nhất của ông về ý nghĩa cuộc sống.",
              order: 3,
            },
          ],
        },
      },
      {
        choiceText:
          "Dành 3 tháng nghỉ không làm gì — chỉ quan sát xem hạnh phúc thực sự là gì với mình",
        reasoningPrompt:
          "Nếu bạn không biết hạnh phúc của mình là gì — có phải bạn cần tìm hiểu trước khi hành động? Nhưng bao lâu là đủ để 'quan sát'?",
        consequence: {
          resultText: `Bạn xin nghỉ phép dài ngày — may mắn là bạn có quyền đó. Ba tháng đầu bạn không biết phải làm gì với bản thân. Tuần thứ 6, bạn bắt đầu đọc sách — không phải sách chuyên môn, mà là tiểu thuyết. Tuần thứ 9, bạn nấu ăn cho hàng xóm cao tuổi sống một mình.

Đến tháng thứ 3, bạn chưa có câu trả lời. Nhưng bạn có danh sách những khoảnh khắc bạn thực sự cảm thấy sống.`,
          ethicalAnalysis:
            "Thực hành tự nhận biết (self-knowledge) là đức hạnh trí tuệ cổ điển — từ 'Gnothi seauton' (Biết chính mình) của Socrates đến thiền quán của Phật giáo. Trước khi quyết định hành động nào mang lại hạnh phúc, cần phân biệt được điều gì thực sự là hạnh phúc của mình và điều gì là hạnh phúc được kỳ vọng bởi người khác.",
          philosophicalAnalysis:
            "Thiền quán Phật giáo và thực hành Khắc kỷ đều nhấn mạnh sự quan sát không phán xét về trải nghiệm bên trong. Epicurus đề xuất tương tự: phân tích từng mong muốn xem nó thuộc loại nào — cần thiết và tự nhiên, tự nhiên nhưng không cần thiết, hay không tự nhiên và không cần thiết. Nghỉ phép là cơ hội để thực hành phân tích này.",
          politicalEconomicAnalysis:
            "Quyền nghỉ phép và sabbatical không phải là đặc quyền ở nhiều nơi — nhiều người không có khả năng thực hiện điều này mà không mất thu nhập nghiêm trọng. Tuy nhiên, ở những vị trí có quyền đó, việc không sử dụng chúng phản ánh văn hóa sợ hãi — sợ bị coi là kém cần cù, sợ bị vượt qua. Đây là áp lực vô hình nhưng thực.",
          historicalImpact:
            "Nhiều triết học và truyền thống tôn giáo có thực hành sabbatical tương tự: Shabbat trong Do Thái giáo, vassa (mùa an cư) trong Phật giáo Theravada, retreat trong Kitô giáo. Những thực hành này nhận ra rằng con người cần thời gian không-hành-động để hiểu mình là ai và cần gì.",
          analysisTabs: [
            {
              tabType: "ETHICAL",
              content:
                "Biết bản thân (self-knowledge) là nền tảng của đức hạnh theo Socrates và Aristotle. Không biết mình muốn gì, cần gì — là không thể sống tốt. Đầu tư thời gian vào tự nhận biết không phải ích kỷ — đây là điều kiện để hành động đạo đức và có ý nghĩa.",
              order: 0,
            },
            {
              tabType: "PHILOSOPHICAL",
              content:
                "Epicurus phân loại mong muốn thành ba nhóm: tự nhiên và cần thiết (thức ăn, nước, shelter, tình bạn, triết học), tự nhiên nhưng không cần thiết (thức ăn ngon, quan hệ tình dục), và không tự nhiên cũng không cần thiết (danh tiếng, quyền lực, của cải dư thừa). Sabbatical là cơ hội để quan sát mình thực sự đang mong muốn điều gì.",
              order: 1,
            },
            {
              tabType: "POLITICAL_ECONOMIC",
              content:
                "Nghiên cứu về sáng tạo và năng suất cho thấy 'incubation period' — thời gian không làm gì về một vấn đề — thường tạo ra bước đột phá lớn nhất. Không phải vô tình mà nhiều công ty sáng tạo (như Google với 20% time) tạo ra không gian cho 'lãng phí có chủ đích'. Nghỉ phép có thể là đầu tư, không phải lãng phí.",
              order: 2,
            },
            {
              tabType: "HISTORICAL",
              content:
                "Thực hành 'Grand Tour' của giới trí thức châu Âu thế kỷ XVII-XIX — đi du lịch nhiều năm khắp châu Âu trước khi nhận các trách nhiệm sự nghiệp — được thiết kế để mở rộng nhận thức và trưởng thành. Ý tưởng rằng cần thời gian để khám phá trước khi cam kết không phải là mới — nó có trong truyền thống văn hóa của nhiều nền văn minh.",
              order: 3,
            },
          ],
        },
      },
    ],
  },
];
