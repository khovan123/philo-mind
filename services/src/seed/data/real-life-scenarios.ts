/**
 * Seed Data: 10 Real-life Scenarios (4 perspectives + frameworks each)
 * Issue: #63 — T-C09
 *
 * Stable key: `title` (upserted in 07-scenarios.ts)
 * Perspective types: thực_dụng | nghĩa_vụ | đức_hạnh | quan_tâm
 */

export type ScenarioPerspectiveType = "thực_dụng" | "nghĩa_vụ" | "đức_hạnh" | "quan_tâm";

export interface ScenarioPerspectiveSeed {
  perspectiveType: ScenarioPerspectiveType;
  content: string;
}

export interface ScenarioFrameworkSeed {
  /** Stable within scenario — upserted with scenario */
  name: string;
  description?: string;
  content: string;
}

export interface RealLifeScenarioSeed {
  title: string;
  topicTitle: string;
  situation: string;
  context: string;
  perspectives: ScenarioPerspectiveSeed[];
  frameworks: ScenarioFrameworkSeed[];
}

export const REAL_LIFE_SCENARIOS: RealLifeScenarioSeed[] = [
  {
    title: "Bạn chia sẻ tin giả vì muốn cảnh báo mọi người",
    topicTitle: "Triết học và thế giới quan",
    situation:
      "Bạn thấy một bài đăng cảnh báo 'thuốc X gây ung thư' kèm ảnh chụp màn hình không rõ nguồn. Bạn chưa kiểm chứng nhưng nghĩ 'chia sẻ trước để mọi người cẩn thận' là an toàn. Một người bạn phản ứng: 'Đừng lan truyền nếu chưa chắc.' Bạn có nên đăng lại không?",
    context:
      "Nhóm chat lớp học 200 thành viên. Tuần trước đã có một tin đồn gây hoảng loạn phải xin lỗi công khai. Bạn thường được xem là người quan tâm cộng đồng.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Xét hậu quả: chia sẻ tin chưa kiểm chứng có thể cứu vài người cảnh giác, nhưng cũng có thể gây hoảng loạn, bôi nhọ doanh nghiệp vô tội, và làm giảm uy tín của chính bạn khi tin bị bác bỏ. Kết quả tốt hơn thường là: kiểm tra nguồn chính thống (Bộ Y tế, báo đã fact-check), rồi mới chia sẻ kèm bối cảnh — hoặc báo cho admin nhóm thay vì đăng công khai.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Thế giới quan khoa học đòi hỏi phân biệt niềm tin và bằng chứng. Nghĩa vụ trí thức trong cộng đồng học tập: không đưa thông tin y tế như sự thật khi chưa xác minh. Nguyên tắc tương tự 'không làm hại': lan truyền có thể gây hại gián tiếp. Cảnh báo đạo đức không miễn trừ trách nhiệm về độ chính xác — bạn vẫn phải nỗ lực kiểm chứng trước khi kêu gọi hành động.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh trí tuệ (phronesis) là biết khi nào im lặng, khi nào nói, và nói thế nào. Người có đức hạnh không dùng lòng tốt để biện minh cho sự bất cẩn. Thói quen fact-check trước khi chia sẻ là phẩm chất của công dân số — không phải thờ ơ. Chia sẻ đúng một lần có giá trị hơn mười lần 'cảnh báo' mơ hồ.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Bạn quan tâm sức khỏe cộng đồng — điều đáng trân trọng. Bạn bè lo bạn trở thành 'ổ lan truyền' cũng vì quan tâm uy tín và an toàn chung của nhóm. Quan tâm thật là gửi tin nhắn riêng cho người có chuyên môn, hoặc hỏi: 'Mình tìm thấy nguồn này, bạn xem giúp có đáng tin không?' — vừa giữ mối quan hệ vừa không đẩy trách nhiệm lên đám đông.",
      },
    ],
    frameworks: [
      {
        name: "Thế giới quan khoa học",
        description: "Phân biệt niềm tin, giả thuyết và bằng chứng",
        content:
          "Hỏi: (1) Nguồn gốc thông tin là gì? (2) Có kiểm chứng độc lập không? (3) Lợi ích ai được phục vụ nếu tin này lan rộng? Triết học như thế giới quan giúp bạn không nhầm 'cảm thấy đúng' với 'biết là đúng'.",
      },
      {
        name: "Phân tích hậu quả mạng xã hội",
        description: "Modern dilemma — lan truyền thông tin",
        content:
          "Mô hình: người đăng → thuật toán khuếch đại → hành vi đám đông. Tính cả chi phí sửa sai (retraction), tổn thương tâm lý, và mất niềm tin vào các cảnh báo sau này. Một bài đăng 'vì tốt' vẫn có thể là vector rủi ro hệ thống.",
      },
    ],
  },
  {
    title: "Bạn tranh luận về duy vật vs duy tâm với người thân",
    topicTitle: "Vấn đề cơ bản của triết học",
    situation:
      "Giờ cơm tối, bố bạn — người sùng đạo — nói: 'Con người có linh hồn bất tử, không chỉ là vật chất.' Bạn vừa học xong chương về chủ nghĩa duy vật biện chứng và muốn giải thích rằng ý thức là sản phẩm của vật chất, não bộ. Bố bạn nghe và buồn. Bạn có nên tiếp tục tranh luận không?",
    context:
      "Gia đình có truyền thống tôn giáo lâu đời. Bạn là con đầu trong nhà. Đây là bữa cơm sum họp hiếm hoi.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Xét kết quả thực tế: thắng tranh luận triết học nhưng làm tổn thương mối quan hệ gia đình là kết quả âm. Chủ nghĩa duy vật biện chứng không yêu cầu áp đặt thế giới quan lên người khác — nó là công cụ nhận thức. Câu hỏi thực dụng: mục tiêu là chứng minh mình đúng, hay duy trì quan hệ trong khi vẫn trung thực với suy nghĩ?",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Thế giới quan khoa học giúp nhận thức đúng — nhưng chức năng là định hướng hành động, không cưỡng ép người khác. Nghĩa vụ tôn trọng người thân và nghĩa vụ trung thực có thể song hành: chia sẻ suy nghĩ mà không phán xét. Tôn giáo đáp ứng nhu cầu tâm linh thật — duy vật biện chứng không phủ nhận sự tồn tại của nhu cầu đó.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Người học triết học có đức hạnh không dùng tri thức để thể hiện ưu thế. Mác hiểu tại sao tôn giáo tồn tại: 'tiếng thở dài của chúng sinh bị áp bức.' Đức hạnh trí tuệ là biết khi nào nên nói và khi nào lắng nghe. Buổi cơm gia đình không phải hội thảo triết học.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Bố không chỉ bảo vệ luận điểm — ông chia sẻ ý nghĩa sống. Quan tâm là nghe để hiểu, không chỉ để phản bác. Bạn cũng cần được là chính mình. Điểm chung: cả hai đều đặt câu hỏi về ý nghĩa — chỉ khác cách trả lời.",
      },
    ],
    frameworks: [
      {
        name: "Vấn đề cơ bản: vật chất và ý thức",
        description: "Khung phân tích quan hệ căn bản",
        content:
          "Tách ba lớp: (1) Bản thể học — cái gì có trước? (2) Nhận thức luận — ta biết thế nào? (3) Giá trị — điều gì quan trọng với từng người? Tranh luận gia đình thường lẫn cả ba — làm rõ từng lớp giúp giảm xung đột.",
      },
      {
        name: "Phép biện chứng trong đối thoại",
        description: "Thống nhất mâu thuẫn thay vì loại trừ",
        content:
          "Thay vì 'đúng/sai' tuyệt đối, tìm mâu thuẫn biện chứng: niềm tin tôn giáo ↔ nhu cầu giải thích khoa học. Mục tiêu có thể là 'thống nhất ở mức cao hơn' (cùng tìm hiểu) chứ không phải thuyết phục một chiều trong một bữa tối.",
      },
    ],
  },
  {
    title: "Bạn dùng ChatGPT viết bài luận và giáo viên không biết",
    topicTitle: "Chủ nghĩa duy vật và chủ nghĩa duy tâm",
    situation:
      "Deadline bài luận triết học còn 6 tiếng. Bạn nhờ ChatGPT tạo khung lập luận và chỉnh sửa nhẹ. Bài đạt điểm cao; bạn cảm thấy mình 'hiểu thêm' sau khi đọc lại — nhưng không chắc nếu thi vấn đáp miệng bạn trả lời được. Bạn có nên tiếp tục cách này không?",
    context:
      "Sinh viên năm 2, môn Triết học Mác-Lênin. Trường chưa có quy định rõ về AI. Bạn bè nói 'ai cũng dùng'.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Lợi ích ngắn hạn: đúng deadline, điểm số. Chi phí dài hạn: kỹ năng tư duy không phát triển, rủi ro bị phát hiện, mất cơ hội luyện phản biện — đúng mục tiêu môn học. Cách thực dụng bền vững: dùng AI như gia sư (giải thích khái niệm, gợi ý câu hỏi), không thay thế luận điểm của bạn; nộp bài bạn tự viết và ghi rõ phần nào có hỗ trợ AI nếu quy định yêu cầu.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Nghĩa vụ học thuật: trung thực về nguồn gốc tác phẩm. Ý thức (bài viết) phản ánh trí tuệ người học — nếu nó chủ yếu do máy, quan hệ nhân quả giữa học tập và kết quả bị phá vỡ. Duy vật biện chứng: công cụ (AI) thay đổi quan hệ sản xuất tri thức — bạn vẫn chịu trách nhiệm về sản phẩm cuối cùng mang tên mình.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh của người học là trung thực với quá trình khó khăn. Dùng AI che giấu sự yếu kém tạo thói quen phụ thuộc — ngược với đức hạnh trí tuệ. Người có đức hạnh chấp nhận điểm thấp hơn một lần để xây năng lực thật, hoặc xin gia hạn thay vì nộp tác phẩm không phải của mình.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Giáo viên muốn bạn học được, không chỉ có điểm. Bạn bè dùng AI vì áp lực — phán xét họ không giúp ích. Quan tâm bản thân: hỏi 'Sau khi tốt nghiệp, mình còn giữ được khả năng tư duy triết học không?' — nếu không, hãy điều chỉnh cách dùng công cụ ngay bây giờ.",
      },
    ],
    frameworks: [
      {
        name: "Duy vật biện chứng về công nghệ",
        description: "Công cụ và quan hệ sản xuất tri thức",
        content:
          "AI là lực lượng sản xuất mới trong giáo dục. Phân tích: ai sở hữu công cụ, ai chịu rủi ro, phần nào của bài là lao động trí óc của bạn. Khung này tránh hai cực: 'cấm tuyệt đối' hoặc 'dùng tùy tiện'.",
      },
      {
        name: "Modern dilemma: Academic integrity",
        description: "Khung đạo đức học thuật thời AI",
        content:
          "Bốn câu hỏi: (1) Nguồn? (2) Hiểu nội dung? (3) Có thể bảo vệ miệng? (4) Minh bạch với giảng viên? Nếu bất kỳ câu nào là 'không', hành động hiện tại cần điều chỉnh.",
      },
    ],
  },
  {
    title: "Startup sao chép ý tưởng nhưng tạo việc làm",
    topicTitle: "Điều kiện ra đời triết học Mác",
    situation:
      "Nhóm bạn khởi nghiệp 'bản địa hóa' mô hình app nước ngoài, gọi vốn nhờ tạo hàng trăm việc làm cho sinh viên. Một mentor nói: 'Đây là sáng tạo trong hoàn cảnh Việt Nam.' Bạn được mời làm content nhưng thấy ý tưởng gốc chưa được ghi nhận. Bạn có nhận việc không?",
    context:
      "Hệ sinh thái startup đại học. Bài giảng vừa nhấn mạnh triết học Mác ra đời từ điều kiện kinh tế-xã hội và phê phán tư bản. Bạn cần thu nhập part-time.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Việc làm và kinh nghiệm có giá trị thật. Nhưng rủi ro uy tín cá nhân, tranh chấp sở hữu trí tuệ, và môi trường 'copy nhanh' có thể kìm hãm sáng tạo dài hạn. Thực dụng: đàm phán minh bạch về nguồn gốc ý tưởng, hoặc chọn dự án có lộ trình đổi mới thật — không chỉ marketing.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Triết học Mác phân tích quan hệ sản xuất và bóc lột — kể cả bóc lột tri thức. Nghĩa vụ trung thực với lao động sáng tạo (kể cả xa): không tham gia che giấu nguồn gốc. Nghĩa vụ với bản thân: không đổi lấy lương ngắn hạn nguyên tắc bạn sẽ hối tiếc khi đi làm chính thức.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh trung thực và courage trong nghề nghiệp. Người có đức hạnh đặt câu hỏi khó với sếp trẻ thay vì im lặng. Có thể từ chối và đề xuất hướng hợp tác pháp lý với bên gốc — đó là phẩm chất của người xây dựng hệ sinh thái lành mạnh.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Đồng đội startup đang kẹt tài chính — từ chối có thể bị hiểu là phản bội. Quan tâm là nói thẳng lo ngại, đề xuất giải pháp (ghi credit, license, pivot sản phẩm riêng). Quan tâm người lao động nền tảng gốc: im lặng cũng là một hình thức bất công.",
      },
    ],
    frameworks: [
      {
        name: "Phương pháp lịch sử-cụ thể",
        description: "Từ điều kiện ra đời triết học Mác",
        content:
          "Đặt startup trong bối cảnh: phụ thuộc công nghệ nước ngoài, áp lực tạo việc làm, thiếu vốn R&D. Không biện minh tự động cho sao chép — nhưng hiểu cấu trúc giúp tìm giải pháp cải tạo (đầu tư nội dung gốc, hợp tác license) thay vì chỉ phán xét đạo đức.",
      },
      {
        name: "Phân tích quan hệ sản xuất tri thức",
        description: "Modern dilemma — platform economy",
        content:
          "Ai sở hữu ý tưởng? Ai bán sức lao động content? Ai hưởng lợi nhuận? Ba câu hỏi Marxist-lite áp dụng cho gig và startup — làm rõ trước khi ký hợp đồng.",
      },
    ],
  },
  {
    title: "Bạn 'hủy' đồng nghiệp trên mạng hay nói chuyện trực tiếp?",
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    situation:
      "Đồng nghiệp đăng status thiên vị chính trị, công kích cá nhân người khác. Bạn muốn bình luận phản bác công khai để 'giáo dục cộng đồng', hoặc báo HR. Một người bạn khuyên: 'Nói riêng trước, đừng hủy.'",
    context:
      "Công ty trẻ, văn hóa mạng xã hội mở. Sự kiện gây tranh cãi trong nhóm chat nội bộ đã leak ra ngoài.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Bình luận công khai có thể lan rộng xung đột, ảnh hưởng hình ảnh công ty và sự nghiệp của cả hai. HR có thể xử lý theo quy trình nhưng cũng tạo drama. Thực dụng: hội thoại riêng tư trước, ghi nhận sự việc, nếu không đổi mới thì báo cáo có căn cứ — thường hiệu quả hơn 'đấu tweet'.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Nghĩa vụ phản biện sai trái — nhưng phương pháp siêu hình (xem đối tượng tĩnh, đối lập tuyệt đối) dễ dẫn tới 'ta đúng — họ ác'. Phép biện chứng đòi hỏi phân tích mâu thuẫn trong hoàn cảnh: họ có thể đang phản ứng với thông tin sai. Nghĩa vụ: phản biện nội dung, tôn trọng nhân phẩm.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh can đảm đi kèm đức hạnh tiết chế. Công khai 'hạ' người khác thể hiện đạo đức hiện sinh yếu — cần khán giả để cảm thấy đúng. Đức hạnh thật: kiên nhẫn, rõ ràng, sẵn sàng sửa mình nếu hiểu nhầm.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Đồng nghiệp có thể đang trong tình trạng căng thẳng tâm lý. Quan tâm không có nghĩa bỏ qua — mà chọn không làm tổn thương thêm. Đồng thời quan tâm nạn nhân bị công kích: hỏi họ cần hỗ trợ gì (báo cáo, làm chứng, im lặng).",
      },
    ],
    frameworks: [
      {
        name: "Siêu hình vs biện chứng",
        description: "Hai phương pháp tư duy đối lập",
        content:
          "Siêu hình: 'họ là người xấu' → hủy. Biện chứng: hành vi ↔ hoàn cảnh ↔ hệ thống (thuật toán, áp lực sống) → can thiệp thay đổi hành vi. Chọn phương pháp biện chứng khi mục tiêu là giải quyết, không phải chiến thắng danh dự.",
      },
      {
        name: "Modern dilemma: Call-out culture",
        description: "Khung phân tích hủy bỏ công khai",
        content:
          "Trục: mục tiêu (sửa sai / trừng phát / biểu diễn) × kênh (công khai / riêng tư) × hậu quả (giáo dục / sợ hãi / im lặng). Điền ô của bạn trước khi hành động.",
      },
    ],
  },
  {
    title: "Bạn đọc một bài báo phê phán Mác và không biết nên tin ai",
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    situation:
      "Bạn đọc bài báo nước ngoài: 'Triết học Mác đã bị bác bỏ — Liên Xô sụp đổ là bằng chứng.' Hôm sau thầy nói triết học Mác-Lênin là học thuyết khoa học dẫn đường đổi mới. Bạn không biết tin ai và nói gì nếu thầy hỏi.",
    context:
      "Lớp Triết học Mác-Lênin, sinh viên năm nhất. Bài báo từ nguồn uy tín. Không khí học thuật nghiêm túc nhưng không thoải mái phản biện.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Cả hai nguồn có lý một phần. Sụp đổ Liên Xô là sự kiện thật — nguyên nhân phức tạp hơn 'Mác sai'. Triết học Mác có giá trị phân tích kinh tế-xã hội và cũng có ứng dụng lịch sử thất bại. Câu hỏi thực dụng: 'Điều nào còn giúp hiểu thế giới hôm nay?' thay vì toàn đúng/toàn sai.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Nghĩa vụ trí thức: đặt câu hỏi trung thực, đa nguồn — đúng tinh thần phê phán Mác. Không phải không tôn trọng thầy khi có câu hỏi. Câu hỏi về Liên Xô hợp lệ trong khuôn khổ học thuật nếu đặt với thái độ học hỏi.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh trí tuệ: không tin theo nguồn vì an toàn hay tiện. Ghi chú câu hỏi, tìm thêm tài liệu, hỏi thầy lịch sự: 'Thầy nghĩ gì về lập luận sụp đổ Liên Xô phủ nhận Mác?'",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Thầy không phải kẻ thù — đang làm việc trong bối cảnh của mình. Quan tâm là không tạo đối đầu không cần thiết. Quan tâm bản thân: không dập tắt câu hỏi thật — đặt bằng giọng muốn học hỏi.",
      },
    ],
    frameworks: [
      {
        name: "Cách mạng triết học: thống nhất lý luận và thực tiễn",
        description: "Đọc Mác như công cụ phê phán",
        content:
          "Tách 'học thuyết' khỏi 'chế độ ứng dụng lịch sử'. Phê phán Stalin ≠ phủ nhận toàn bộ phân tích mâu thuẫn giai cấp. Khung giúp tránh ngã ba: sùng bái / bác bỏ toàn bộ / im lặng giả tạo.",
      },
      {
        name: "Modern dilemma: Epistemic authority",
        description: "Ai được quyền định nghĩa 'khoa học'?",
        content:
          "Bài báo Tây, giáo trình, trải nghiệm đời sống — mỗi nguồn có bias. Ghi rõ tiêu chí đánh giá (bằng chứng, logic, khả năng dự đoán thực tiễn) trước khi chọn tin.",
      },
    ],
  },
  {
    title: "Triết học hay kỹ năng nghề — bạn đầu tư thời gian vào đâu?",
    topicTitle: "Chức năng của triết học Mác-Lênin",
    situation:
      "Bạn có 10 tiếng học thêm mỗi tuần. Lựa chọn A: kỹ năng chuyên ngành (lập trình, thiết kế, ngoại ngữ) — đo được, thị trường cần. Lựa chọn B: đọc sâu triết học Mác-Lênin, phương pháp luận biện chứng — khó đo, thầy nói là nền tảng tư duy. Bạn chọn gì?",
    context: "Sinh viên năm 2. Áp lực việc làm thật. GPA trung bình.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Không phải một trong hai — xác định tỷ lệ. Kỹ năng tạo giá trị trực tiếp trên thị trường; phương pháp luận tạo năng lực phân tích lâu dài. Sinh viên giỏi thường kết hợp: dùng triết học để phân tích vấn đề trong chuyên ngành.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Giáo trình: phương pháp luận là công cụ cho mọi khoa học. Học triết học thật không thay kỹ năng — bổ trợ. Nghĩa vụ với tương lai: đầu tư cân bằng, không hy sinh một vì dễ hơn.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Không học triết học để lấy điểm rồi quên, cũng không học kỹ năng chỉ để có việc mà không hiểu mình đang làm gì. Lượng đổi thì chất đổi — kiên nhẫn với học dài hạn.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Bạn cùng lớp chọn kỹ năng vì áp lực thật — không phán xét. Nếu bạn thấy cách triết học bổ trợ chuyên ngành, chia sẻ cụ thể (ví dụ case study) là quan tâm thật.",
      },
    ],
    frameworks: [
      {
        name: "Chức năng thế giới quan và phương pháp luận",
        description: "Triết học Mác-Lênin trong học tập",
        content:
          "Thế giới quan: định hướng nhìn nhận (mâu thuẫn, phát triển). Phương pháp luận: cách phân tích vấn đề chuyên ngành. Áp dụng: mỗi tuần 2h triết học + 8h kỹ năng, ghi journal liên hệ hai mảng.",
      },
      {
        name: "Modern dilemma: Human capital",
        description: "Đầu tư thời gian dưới áp lực thị trường",
        content:
          "Phân biệt 'kỹ năng thị trường ngắn hạn' và 'năng lực meta-learning'. Bảng 2×2: gấp / không gấp × quan trọng cho nghề / quan trọng cho tư duy — ưu tiên ô quan trọng-không-gấp (triết học) trước khi ô gấp lấn át.",
      },
    ],
  },
  {
    title: "App gọi xe giá rẻ nhưng tài xế không có bảo hiểm",
    topicTitle: "Triết học Mác-Lênin với đổi mới Việt Nam",
    situation:
      "Bạn dùng app gọi xe giá rẻ hàng ngày. Báo chí điều tra: tài xế làm 14 tiếng, không bảo hiểm, thu nhập sau hoa hồng thấp. Bạn tuyên bố ủng hộ quyền người lao động trong lớp học nhưng vẫn book xe vì tiết kiệm. Bạn có nhất quán không?",
    context:
      "Đô thị lớn, sinh viên ngân sách hạn chế. Môn học vừa bàn đổi mới, thị trường và bảo vệ người yếu thế.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Tẩy chay cá nhân ít tác động hệ thống; vẫn book xe không làm tài xế đó đỡ khổ nếu họ phải nhận cuốc. Thực dụng: kết hợp hành vi cá nhân (tip, giờ cao điểm hợp lý, phản hồi app) với ủng hộ chính sách (công đoàn platform, quy định bảo hiểm). Một người không thể gánh hết mâu thuẫn cấu trúc.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Đổi mới không có nghĩa bỏ trách nhiệm xã hội. Nghĩa vụ công dân: không duy trì thói quen vô hình trợ giúp bóc lột vì tiện. Nghĩa vụ trí thức: không dùng khẩu hiệu lớp học trá hành động — hoặc điều chỉnh hành động, hoặc thừa nhận mâu thuẫn và tìm cách giảm.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh trung thực với bản thân (integrity): nhận mâu thuẫn thay vì biện minh. Đức hạnh công bằng: sẵn sàng trả thêm khi có thể. Không hoàn hảo — nhưng có chủ đích tốt hơn vô tình.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Tài xế cần khách để sống — tẩy chay đột ngột có thể hại họ trước hại app. Quan tâm là ủng hộ giải pháp tập thể (quy định, hiệp hội) đồng thời hành vi lịch sự từng chuyến: không đánh giá sao oan, tip, báo cáo vi phạm nền tảng.",
      },
    ],
    frameworks: [
      {
        name: "Đổi mới và mâu thuẫn giai cấp mới",
        description: "Kinh tế thị trường trong CNXH",
        content:
          "Phân tích lớp mới: lao động platform, không thuộc nhà máy truyền thống nhưng vẫn bị bóc lột tri thức-thời gian. Đổi mới cần điều chỉnh pháp lý theo thực tế — không đứng yên vì 'tiện cho người tiêu dùng'.",
      },
      {
        name: "Modern dilemma: Ethical consumerism",
        description: "Trách nhiệm cá nhân dưới cấu trúc",
        content:
          "Mô hình iceberg: hành vi mua (đỉnh) / mô hình kinh doanh / chính sách (đáy). Hành động hiệu quả nhất thường ở tầng bạn có sức ảnh hưởng — sinh viên: giọng nói, khảo sát, không phải sở hữu app.",
      },
    ],
  },
  {
    title: "Deepfake của giảng viên — bạn có chia sẻ để cảnh báo?",
    topicTitle: "Triết học và thế giới quan",
    situation:
      "Video deepfake giảng viên nói điều cực đoan lan truyền trong nhóm sinh viên. Bạn nhận ra là giả nhưng lo nếu không chia sẻ kịp thời, người khác sẽ tin. Nếu chia sẻ kèm video, bạn cũng lan truyền nội dung có hại.",
    context: "Kỳ thi sắp tới, căng thẳng với giảng viên. Một số bạn đã screenshot gửi người thân.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Chia sẻ video kèm cảnh báo vẫn khuếch tán deepfake. Hiệu quả hơn: báo khoa/IT, đăng text-only cảnh báo không nhúng clip, hướng dẫn checklist nhận diệt (khớp môi, metadata). Mục tiêu: giảm tin giả, không tạo thêm lượt xem cho nội dung độc hại.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Nghĩa vụ bảo vệ danh dư người khác — kể cả khi không thích họ. Nghĩa vụ trung thực: không lan truyền tài liệu bạn biết là giả mạo dù có chú thích. Đúng nguyên tắc tương tự y đức: 'primum non nocere'.",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh trí tuệ trong kỷ nguyên số: hiểu cách thông tin viral. Can đảm đứng lên không bằng chuyền tay clip — bằng liên hệ cơ quan có thẩm quyền. Trung thực quan trọng hơn được xem là người 'biết tin nóng' trước.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Giảng viên là nạn nhân — quan tâm là không gửi link cho người khác 'xem cho biết'. Sinh viên hoang mang cần thông điệp làm dịu từ nguồn đáng tin, không kích thích tò mò.",
      },
    ],
    frameworks: [
      {
        name: "Niềm tin vào thực tại (epistemology)",
        description: "Thế giới quan trong kỷ nguyên deepfake",
        content:
          "Câu hỏi: 'Làm sao biết điều mình thấy là thật?' — trở lại cấp độ triết học nhận thức. Xây thói quen đa nguồn, xác minh, ưu tiên kênh chính thức. Deepfake là thách thức vật chất–ý thức qua công nghệ: hình ảnh không còn bằng chứng đơn giản.",
      },
      {
        name: "Modern dilemma: Viral harm mitigation",
        description: "Khung giảm thiểu tổn hại lan truyền",
        content:
          "Trước khi share: STOP (Stop, Trace source, Omit harmful media, Post corrective text). Giảm tổn hại quan trọng hơn tốc độ cảnh báo.",
      },
    ],
  },
  {
    title: "Burnout: nghỉ học một học kỳ hay cố gắng thêm?",
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    situation:
      "Bạn kiệt sức: ngủ kém, mất hứng thú, điểm giảm. Cố vấn học tập gợi ý nghỉ 1 học kỳ. Gia đình nói 'cố thêm chút, đừng tụt hậu'. Bạn sợ mất học bổng và khoảng cách với bạn bè.",
    context:
      "Sinh viên năm 3, vừa làm thêm 20h/tuần. Môn triết học yêu cầu phản tư sâu nhưng bạn không còn năng lượng đọc.",
    perspectives: [
      {
        perspectiveType: "thực_dụng",
        content:
          "Nghỉ một kỳ có chi phí thời gian và tài chính — nhưng tiếp tục kiệt sức có thể dẫn đến bỏ học hoàn toàn, chi phí lớn hơn. Thực dụng: giảm tải (bớt làm thêm, xin hoãn deadline, dùng dịch vụ tư vấn tâm lý) trước khi quyết định nghỉ. Đo lường sức khỏe như đo GPA.",
      },
      {
        perspectiveType: "nghĩa_vụ",
        content:
          "Nghĩa vụ với bản thân: bảo vệ năng lực học tập lâu dài. Siêu hình coi con người như máy không mệt — sai với sinh học. Biện chứng: trong mâu thuẫn lao động–nghỉ ngơi, đôi khi cần 'phủ định' nhịp độ hiện tại để phát triển ở mức cao hơn (hồi phục rồi quay lại mạnh hơn).",
      },
      {
        perspectiveType: "đức_hạnh",
        content:
          "Đức hạnh moderation (sophrosyne): biết giới hạn. Kiên trì không có nghĩa tự hủy. Người có đức hạnh xin giúp đỡ sớm — không chờ đến khi sụp đổ mới được phép yếu đuối.",
      },
      {
        perspectiveType: "quan_tâm",
        content:
          "Gia đình lo tương lai — lắng nghe nỗi sợ của họ, giải thích bằng số liệu sức khỏe (không phải lười). Quan tâm bản thân: nghỉ không phải thất bại — có thể là điều kiện để học triết học (và mọi thứ khác) có ý nghĩa trở lại.",
      },
    ],
    frameworks: [
      {
        name: "Phủ định biện chứng",
        description: "Nghỉ học như bước phát triển",
        content:
          "Thesis: nhịp độ hiện tại. Antithesis: nghỉ / giảm tải. Synthesis: lịch trình bền vững mới. Tránh nhìn nghỉ như thất bại tuyệt đối (siêu hình) — xem như chuyển hóa có chủ đích.",
      },
      {
        name: "Modern dilemma: Productivity culture",
        description: "Áp lực tối ưu hóa trên sinh viên",
        content:
          "Phân biệt 'nghỉ để phục hồi' và 'nghỉ vì trốn tránh'. Checklist: triệu chứng thân thể, mất hứng thú >2 tuần, chuyên gia khuyên — nếu có, ưu tiên sức khỏe không thương lượng với stigma.",
      },
    ],
  },
];
