/**
 * Seed Data: Topic Perspectives (5 types × topics)
 * Issue: #66 — T-C12
 *
 * Stable key: topicId + perspectiveType (upserted in 11-topic-perspectives.ts)
 * Types: TECH | ETHICAL | ECONOMIC | SOCIAL | PHILOSOPHICAL
 */
export type PerspectiveType = "TECH" | "ETHICAL" | "ECONOMIC" | "SOCIAL" | "PHILOSOPHICAL";

export const PERSPECTIVE_TYPES: PerspectiveType[] = [
  "TECH",
  "ETHICAL",
  "ECONOMIC",
  "SOCIAL",
  "PHILOSOPHICAL",
];

export interface TopicPerspectiveEntrySeed {
  perspectiveType: PerspectiveType;
  content: string;
}

export interface TopicPerspectivesSeed {
  topicTitle: string;
  perspectives: TopicPerspectiveEntrySeed[];
}

export const TOPIC_PERSPECTIVES: TopicPerspectivesSeed[] = [
  {
    topicTitle: "Triết học và thế giới quan",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Thuật toán và nền tảng số đang định hình thông tin mà người học tiếp nhận mỗi ngày — một dạng thế giới quan được cấu trúc bởi công nghệ. Phân tích TECH giúp hỏi: ai thiết kế feed, dữ liệu nào bị ẩn, và làm sao dùng công cụ số mà không đánh mất tư duy phê phán. Triết học ở đây là literacy số gắn với trách nhiệm nhận thức.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Thế giới quan không trung lập về đạo đức: nó định hướng ta coi điều gì là đúng, đáng làm, đáng tin. Góc ETHICAL nhấn mạnh trách nhiệm khi chia sẻ thông tin, tôn trọng niềm tin người khác và tránh biến tri thức thành vũ khí công kích cá nhân — đặc biệt trong môi trường học thuật và mạng xã hội.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Thế giới quan chịu tác động của điều kiện kinh tế-xã hội: ai có thời gian đọc sâu, ai chỉ tiếp nhận headline, ai kiểm soát nền tảng truyền thông. Góc ECONOMIC liên hệ triết học Mác-Lênin: ý thức là hình thái đặc biệt của ý thức xã hội, không tách rời cơ sở vật chất và quan hệ sản xuất tri thức.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Gia đình, trường học, cộng đồng mạng và văn hóa đại chúng cùng 'dạy' thế giới quan — đôi khi âm thầm hơn giáo trình. Góc SOCIAL khuyến khích đối thoại giữa các thế hệ và nền tảng giá trị, tìm điểm chung thay vì hủy bỏ lẫn nhau khi khác niềm tin.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Ở lõi, triết học là hệ thống quan điểm lý luận chung nhất về thế giới và vị trí con người. Góc PHILOSOPHICAL đặt câu hỏi: thế giới quan khoa học khác gì thế giới quan mê tín? Làm sao xây dựng thế giới quan có căn cứ, mở và có thể sửa đổi khi có bằng chứng mới?",
      },
    ],
  },
  {
    topicTitle: "Vấn đề cơ bản của triết học",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Khoa học thần kinh và AI đặt lại câu hỏi vật chất–ý thức: não là phần cứng, ý thức là phần mềm? Góc TECH không thay triết học bằng khoa học, mà dùng phát hiện kỹ thuật để làm rõ giới hạn và khả năng của từng lời giải — tránh cả chủ nghĩa khoa học hẹp lẫn bác bỏ khoa học.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Trả lời 'vật chất hay ý thức quyết định' không chỉ là bài tập lý thuyết — nó ảnh hưởng cách ta gán trách nhiệm (tội lỗi cá nhân hay hoàn cảnh), cách đối xử người nghiện, người nghèo, người khác niềm tin. ETHICAL đòi hỏi khiêm tốn và nhất quán khi áp lập trường triết học vào đời sống.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Marx nhấn mạnh điều kiện sống quyết định ý thức: ai kiểm soát tư liệu sản xuất thường có ảnh hưởng lớn hơn trong việc định nghĩa 'điều bình thường'. Góc ECONOMIC giúp giải thích vì sao cùng một luận điểm triết học có thể được chấp nhận hoặc bác bỏ tùy lớp lợi ích và cấu trúc xã hội.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Tranh luận duy vật–duy tâm trong gia đình, lớp học hay mạng xã hội thường là tranh luận về ý nghĩa sống, không chỉ về khái niệm. SOCIAL gợi ý kỹ năng đối thoại: phân biệt bản thể học, nhận thức luận và giá trị; lắng nghe trước khi 'thắng' lập luận.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Vấn đề cơ bản — quan hệ vật chất và ý thức — là nền móng phân chia các trường phái. PHILOSOPHICAL khắc họa ba hình thức duy vật lịch sử và hai phái duy tâm, giúp người học không nhầm 'phủ nhận tôn giáo' với 'phủ nhận nhu cầu tâm linh' hay nhầm khoa học với duy vật biện chứng.",
      },
    ],
  },
  {
    topicTitle: "Chủ nghĩa duy vật và chủ nghĩa duy tâm",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Mô phỏng não, large language model và metaverse là thử nghiệm kỹ thuật về ranh giới ý thức–vật chất. TECH đặt câu hỏi: công cụ mô phỏng ý thức có làm lộ giả định duy tâm trong thiết kế phần mềm không? Làm sao thiết kế AI phục vụ nhận thức chứ không thay thế phán đoán đạo đức của con người?",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Duy tâm chủ quan dễ dẫn tới relativism đạo đức ('tôi cảm thấy đúng là đủ'); duy vật máy móc dễ dẫn tới coi thường trải nghiệm nội tâm. ETHICAL tìm cân bằng: tôn trọng ý thức và trách nhiệm cá nhân trong khi vẫn phân tích cấu trúc xã hội tạo ra hành vi.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Phân chia giai cấp, sở hữu tư liệu sản xuất và phân phối thu nhập là minh chứng kinh tế cho duy vật lịch sử: ý thức chính trị thường bám theo vị trí kinh tế. ECONOMIC phân tích vì sao cùng một sự kiện (khủng hoảng, đổi mới) được các nhóm kể chuyện khác nhau.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Tôn giáo, truyền thống dân tộc và văn hóa số cùng tồn tại — không thể 'giải thích' chúng chỉ bằng một câu duy vật đơn giản. SOCIAL khuyến khích nghiên cứu điều kiện lịch sử cụ thể của niềm tin và tránh hạ thấp người khác chỉ vì họ không chia sẻ thế giới quan khoa học.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Duy vật biện chứng không đồng nhất duy vật chất phác hay siêu hình. PHILOSOPHICAL làm rõ sự phát triển của hình thức duy vật và phân biệt duy tâm khách quan (Hegel) với duy tâm chủ quan — nền tảng để đọc Mác và phê phán cả hai cực đơn giản hóa.",
      },
    ],
  },
  {
    topicTitle: "Điều kiện ra đời triết học Mác",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Cách mạng công nghiệp thế kỷ XIX là điều kiện kỹ thuật-xã hội: máy móc, nhà máy, mạng lưới giao thông và sau này là điện báo. TECH hôm nay hỏi: AI và nền kinh tế số có phải 'điều kiện ra đời' của triết học mới — hay chỉ là bối cảnh để tái đọc Mác?",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Triết học Mác gắn với lợi ích giai cấp vô sản — điều này đặt câu hỏi đạo đức: liệu tri thức có thể vừa trung thành với sự thật vừa phục vụ giải phóng? ETHICAL thảo luận trách nhiệm của trí thức khi chọn phe và khi phê phán bạo lực lịch sử.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Ba nguồn điều kiện (kinh tế-xã hội, khoa học tự nhiên, tiền đề lý luận) là khung ECONOMIC cốt lõi của chủ đề. Phân tích này giúp hiểu vì sao Marx không rơi từ trời xuống mà là tổng hợp Smith, Ricardo, Hegel, Feuerbach và phong trào công nhân.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Phong trào công nhân và đấu tranh dân chủ tạo 'nhu cầu xã hội' về một triết học giải thích bóc lột — không chỉ mô tả nó. SOCIAL liên hệ Việt Nam: tiếp thu Mác-Lênin trong bối cảnh giải phóng dân tộc và xây dựng đất nước, không sao chép máy móc châu Âu.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Ra đời triết học Mác là bước ngoặt lý luận: thống nhất duy vật với biện chứng và hướng vào thực tiễn. PHILOSOPHICAL nhấn mạnh tính lịch sử-cụ thể: không có triết học vĩnh viễn ngoài thời đại, nhưng có thể có giá trị phương pháp luận vượt thời.",
      },
    ],
  },
  {
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Thiết kế hệ thống phức tạp (phần mềm, hạ tầng, AI) đòi hỏi tư duy quan hệ — gần với biện chứng — thay vì chia nhỏ tĩnh. TECH cảnh báo: tối ưu cục bộ (micro) mà bỏ qua phản tác dụng hệ thống là dạng phương pháp siêu hình trong kỹ thuật.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Coi mâu thuẫn là 'tốt' mọi lúc có thể biện minh cho bạo lực. ETHICAL phân biệt mâu thuẫn xây dựng và đấu tranh giai cấp áp bức; đòi hỏi phương pháp biện chứng phải gắn mục tiêu nhân văn, không chỉ mô tả xung đột.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Kinh tế thị trường được một số người bảo vệ bằng lập luận 'cạnh tranh tự nhiên tốt' — siêu hình hóa thị trường. ECONOMIC dùng biện chứng: thị trường vừa tạo đổi mới vừa khuếch đại bất bình đẳng; cần nhà nước và chính sách như mặt đối lập có thể thống nhất trong điều kiện cụ thể.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Tranh luận mạng xã hội thường siêu hình hóa đối thủ ('họ là người xấu'). SOCIAL gợi ý đọc xung đột trong bối cảnh lịch sử, lớp, giới — biện chứng hóa tranh luận thành tìm giải pháp thay vì hủy diệt lẫn nhau.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Ba quy luật và các cặp phạm trù biện chứng là xương sống PHILOSOPHICAL của chủ đề. Người học cần phân biệt phép biện chứng như phương pháp tư duy (luận) với biện chứng như mô tả cấu trúc thực tại khách quan.",
      },
    ],
  },
  {
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Triết học 'cải tạo thế giới' hôm nay gặp công nghệ can thiệp sâu vào tự nhiên và con người (gene editing, AI). TECH đặt câu hỏi quyền lực: ai sở hữu công cụ thay đổi xã hội — và liệu đổi mới kỹ thuật có tự động mang tính giải phóng?",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Gắn triết học với giai cấp đặt ra nguy cơ relativism đạo đức nếu 'đúng' chỉ là đúng theo phe. ETHICAL nhấn mạnh: phê phán Mác đòi hỏi trung thực với lịch sử (Liên Xô, cam kết nhân dân) và không biện minh bạo lực nhân danh lý tưởng.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Cách mạng triết học song hành cách mạng công nghiệp: phân tích bóc lột lao động, giá trị thặng dư, khủng hoảng chu kỳ. ECONOMIC là lõi kinh tế chính trị Mác — nền để hiểu đấu tranh giai cấp không phải ý tưởng trừu tượng.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Triết học Mác vào Việt Nam qua con đường giải phóng dân tộc và xây dựng đất nước — bối cảnh SOCIAL khác châu Âu. Cần tránh giáo điều hóa hoặc hình thức hóa: triết học phải gần thanh niên, nghề nghiệp, đời sống thực.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Mác lật Hegel 'đứng thẳng trên đất': phương pháp biện chứng từ duy tâm sang cơ sở vật chất xã hội. PHILOSOPHICAL tóm lược: triết học không chỉ giải thích mà hướng tới thực tiễn — nhưng thực tiễn nào, bởi ai, với chi phí gì, vẫn là câu hỏi mở.",
      },
    ],
  },
  {
    topicTitle: "Chức năng của triết học Mác-Lênin",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Phương pháp luận biện chứng áp dụng cho quản lý dự án, phát triển sản phẩm, đánh giá rủi ro công nghệ: coi hệ thống là tổng thể, theo dõi mâu thuẫn và điểm chuyển hóa. TECH biến triết học thành kỹ năng phân tích có cấu trúc, không chỉ học thuộc định nghĩa.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Chức năng thế giới quan định hướng đạo đức: công bằng, trách nhiệm xã hội, phản biện quyền lực. ETHICAL chống lại việc học triết học chỉ để điểm số — đòi hỏi liên hệ với lựa chọn nghề nghiệp, trung thực học thuật và tôn trọng người khác.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Phương pháp luận giúp đọc chính sách kinh tế, ngân sách, thị trường lao động: ai hưởng lợi, mâu thuẫn nào bị che giấu. ECONOMIC nhấn mạnh chức năng phân tích cấu trúc — không thay thế chuyên môn kinh tế nhưng bổ trợ tư duy hệ thống.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Triết học Mác-Lênin trong trường học, Đoàn, cộng đồng thanh niên có vai trò SOCIAL: định hình ngôn ngữ chung về công lý, phát triển, đoàn kết. Cần không gian tranh luận thật thay vì học vẹt — phê phán là một phần của chức năng phương pháp luận.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "Hai chức năng — thế giới quan và phương pháp luận — là trục PHILOSOPHICAL. Thế giới quan trả lời 'nhìn thế giới thế nào'; phương pháp luận trả lời 'suy nghĩ và hành động ra sao cho khoa học'. Cả hai thống nhất trong thực tiễn có kiểm chứng.",
      },
    ],
  },
  {
    topicTitle: "Triết học Mác-Lênin với đổi mới Việt Nam",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Đổi mới gắn FDI, chuyển đổi số, startup và chuyển đổi xanh. TECH phân tích: công nghệ có thể tăng năng suất nhưng cũng tạo khoảng cách số — biện chứng trong hiện đại hóa đòi hỏi chính sách đào tạo và hạ tầng công bằng.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Đổi mới làm giàu một bộ phận trước khi 'trickle down' — ETHICAL đặt câu hỏi công bằng, quyền người lao động platform, minh bạch. Triết học ủng hộ phát triển nhưng phản đối coi con người chỉ là vốn rẻ.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Kinh tế thị trường định hướng XHCN là thực nghiệm ECONOMIC độc đáo: kế thừa–phủ định–phát triển mô hình tập trung bao cấp. Phân tích mâu thuẫn giữa tăng trưởng và bất bình đẳng, giữa mở cửa và an ninh kinh tế.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Đổi mới thay đổi gia đình, làng xã, đô thị, di cư và văn hóa tiêu dùng. SOCIAL khuyến khích người học liên hệ triết học với chính sách xã hội, giáo dục, y tế — không chỉ GDP.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "PHILOSOPHICAL tóm 'đổi mới' như phủ định biện chứng có chủ đích: không quay lại quá khứ, không sao chép mô hình ngoài nước máy móc. Câu hỏi triết học: tiêu chí 'tiến bộ' là gì — và ai được định nghĩa tiến bộ?",
      },
    ],
  },
  {
    topicTitle: "Triết học về lịch sử và quy luật phát triển",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Big data, AI phân tích lịch sử và mô hình dự báo đặt câu hỏi: liệu quy luật có thể 'tính toán' hóa? TECH nhấn mạnh công cụ không thay thế phương pháp lịch sử cụ thể — dữ liệu cần diễn giải trong khung lý thuyết, tránh chủ nghĩa số hóa tất định.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "Kể chuyện lịch sử mang tính đạo đức: ai được nhớ, ai bị lãng quên? ETHICAL phản đối biện minh bạo lực nhân danh 'tiến bộ lịch sử' và đòi hỏi trách nhiệm với nạn nhân, không chỉ ngưỡng mộ thắng lợi.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Quy luật phát triển kinh tế-xã hội (lực lượng sản xuất và quan hệ sản xuất) là trục ECONOMIC. Khủng hoảng, chuyển đổi mô hình, đổi mới Việt Nam là case study — không phải chu kỳ lặp máy móc mà mâu thuẫn được giải quyết ở tầng mới.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Ký ức tập thể, giáo dục lịch sử, lễ hội và truyền thông tạo 'lịch sử sống' trong xã hội. SOCIAL khuyến khích đối thoại thế hệ về quá khứ — tránh đơn cực hoặc hình thức hóa kỷ niệm.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "PHILOSOPHICAL phân biệt quy luật, ngẫu nhiên và tất yếu trong lịch sử. Mác mở rộng phép biện chứng sang xã hội — không phủ nhận vai trò ý thức và đấu tranh chính trị trong tiến trình lịch sử.",
      },
    ],
  },
  {
    topicTitle: "Triết học về giá trị đạo đức và văn hóa",
    perspectives: [
      {
        perspectiveType: "TECH",
        content:
          "Văn hóa số, meme, influencer và game hóa giá trị đang tái định nghĩa 'điều tốt'. TECH phân tích thiết kế nền tảng (like, share) như cơ chế tạo chuẩn mực — người học cần nhận thức công nghệ không trung lập về đạo đức.",
      },
      {
        perspectiveType: "ETHICAL",
        content:
          "ETHICAL là trọng tâm chủ đề: chuẩn mực đạo đức giai cấp, phẩm chất con người mới, trung thực, công bằng, trách nhiệm. Phê phán chủ nghĩa thực dụng thu hẹp và tiêu dùng hóa đạo đức.",
      },
      {
        perspectiveType: "ECONOMIC",
        content:
          "Giá trị hàng hóa hóa mọi thứ — kể cả tri thức và quan hệ — là phân tích ECONOMIC. Thị trường văn hóa, quảng cáo và lao động sáng tạo bị chi phối bởi logic sinh lời; đạo đức cần nhìn cấu trúc sở hữu và phân phối.",
      },
      {
        perspectiveType: "SOCIAL",
        content:
          "Văn hóa dân tộc, tôn giáo, phong tục và subculture cùng tồn tại. SOCIAL tôn trọng đa dạng văn hóa trong khung pháp lý và đạo đức công dân — tránh đồng hóa hoặc loại trừ.",
      },
      {
        perspectiveType: "PHILOSOPHICAL",
        content:
          "PHILOSOPHICAL đặt câu hỏi: giá trị có tính khách quan lịch sử không? Làm sao xây dựng hệ giá trị xã hội chủ nghĩa vừa kế thừa truyền thống tốt vừa phê phán giá trị lạc hậu — theo phương pháp phủ định biện chứng?",
      },
    ],
  },
];
