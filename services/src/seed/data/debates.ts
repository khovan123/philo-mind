/**
 * Seed Data: 10 Debates
 * Issue: #64 — T-C10
 *
 * Stable key: `title` (upserted in 08-debates.ts)
 */

export interface DebateSeed {
  title: string;
  topicTitle: string;
  description: string;
  status?: "OPEN" | "CLOSED" | "ARCHIVED";
}

export const DEBATES: DebateSeed[] = [
  {
    title: "Khoa học có nên là thước đo duy nhất của chân lý?",
    topicTitle: "Triết học và thế giới quan",
    description:
      "Trong kỷ nguyên tin giả và thuật toán, nhiều người tin rằng chỉ khoa học mới đáng tin. Phe ủng hộ: thế giới quan khoa học giúp phân biệt niềm tin và bằng chứng, tránh thảm họa do mê tín. Phe phản biện: khoa học không trả lời câu hỏi giá trị, ý nghĩa và công lý; coi khoa học là tuyệt đối có thể trở thành chủ nghĩa khoa học hẹp — loại trừ trải nghiệm và truyền thống văn hóa. Tranh luận này mở ra cách hiểu 'triết học' như hình thái ý thức xã hội bổ sung cho khoa học.",
  },
  {
    title: "Vật chất hay ý thức — cái nào thực sự quyết định cái kia?",
    topicTitle: "Vấn đề cơ bản của triết học",
    description:
      "Câu hỏi trung tâm hơn 2.500 năm. Duy vật biện chứng: vật chất có trước, ý thức phản ánh vật chất — điều kiện sống quyết định tư tưởng. Khoa học thần kinh cho thấy não tạo ý thức, nhưng ý thức cũng tái cấu trúc não. Phe duy tâm: ý tưởng vĩ đại đã thay đổi lịch sử — Marx là bằng chứng ý thức tác động ngược lại vật chất. Bạn đứng về phía nào khi giải thích một hành vi xã hội cụ thể?",
  },
  {
    title: "AI có thể có ý thức và quyền như con người không?",
    topicTitle: "Chủ nghĩa duy vật và chủ nghĩa duy tâm",
    description:
      "Mô hình ngôn ngữ lớn mô phỏng suy nghĩ đáng kinh ngạc. Phe duy vật: ý thức cần cơ sở vật chất cụ thể — chưa có bằng chứng AI có qualia hay trải nghiệm chủ quan. Phe mở: nếu hành vi và cấu trúc chức năng giống ý thức, từ chối quyền là định kiến loài (speciesism). Tranh luận chạm vấn đề cơ bản: ý thức là sản phẩm vật chất hay bản chất riêng? Hệ quả pháp lý và đạo đức công nghệ phụ thuộc câu trả lời.",
  },
  {
    title: "Triết học Mác còn phù hợp với kinh tế nền tảng số?",
    topicTitle: "Điều kiện ra đời triết học Mác",
    description:
      "Triết học Mác ra đời từ công nghiệp hóa thế kỷ XIX. Hôm nay: lao động nền tảng, dữ liệu như tư liệu sản xuất, gig economy. Phe ủng hộ: phạm trù 'giá trị thặng dư', 'giai cấp', 'lực lượng sản xuất' vẫn giải thích bóc lột — chỉ cần cập nhật hình thái. Phe phản biện: cần khung phân tích mới (network effects, attention economy) mà không gượng ép vào từ điển thế kỷ XIX. Tranh luận kiểm tra tính thời đại của điều kiện lịch sử cụ thể.",
  },
  {
    title: "Mâu thuẫn là động lực phát triển hay nguồn gốc của hủy diệt?",
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    description:
      "Phép biện chứng: mâu thuẫn nội tại thúc đẩy vận động và phát triển. Phe ủng hộ: cạnh tranh, tranh luận khoa học và xung đột quan điểm có thể dẫn tới tiến bộ. Phe phản biện: không phải mâu thuẫn nào cũng 'tốt' — chiến tranh, phân biệt chủng tộc cũng là mâu thuẫn nhưng hủy diệt. Câu hỏi thực hành: trong đời sống và chính trị, khi nào nên đối thoại biện chứng và khi nào cần ngăn xung đột leo thang?",
  },
  {
    title: "Triết học có nên là 'vũ khí' của một giai cấp không?",
    topicTitle: "Cuộc cách mạng triết học của Mác và Ăngghen",
    description:
      "Mác: 'Các triết gia chỉ giải thích thế giới — vấn đề là cải tạo nó.' Triết học Mác-Lênin tự xác định công cụ lý luận của giai cấp vô sản. Phe ủng hộ: triết học không phục vụ thực tiễn là triết học chết. Phe phản biện: triết học gắn lợi ích giai cấp khó đồng thời là chân lý khách quan. Tranh luận về tính chính trị và tính khoa học của triết học trong đại học và đời sống công dân.",
  },
  {
    title: "Học triết học Mác-Lênin để thi qua môn hay để hiểu thế giới?",
    topicTitle: "Chức năng của triết học Mác-Lênin",
    description:
      "Giáo trình nhấn mạnh chức năng thế giới quan và phương pháp luận. Thực tế đại học: môn 'bắt buộc lấy tín chỉ'. Phe học thật: phép biện chứng giúp phân tích xã hội có hệ thống. Phe thực dụng: cấu trúc thi cử thưởng học thuộc hơn hiểu sâu. Tranh luận không chỉ về sinh viên — về cách thiết kế chương trình để triết học sống trong hành động.",
  },
  {
    title: "Đổi mới Việt Nam: thị trường tự do hay bảo vệ người lao động trước?",
    topicTitle: "Triết học Mác-Lênin với đổi mới Việt Nam",
    description:
      "Đổi mới 1986 mở cửa thị trường, tạo tăng trưởng nhưng cũng bất bình đẳng mới. Phe thị trường: cạnh tranh và FDI mang việc làm, đổi mới là phủ định biện chứng của mô hình cũ theo hướng tiến. Phe bảo vệ: nhà nước phải điều tiết để không hy sinh người lao động trên bàn thờ tăng trưởng. Tranh luận vận dụng phép biện chứng vào thực tiễn Việt Nam hôm nay.",
  },
  {
    title: "Deepfake có làm sụp đổ khái niệm 'sự thật' không?",
    topicTitle: "Triết học và thế giới quan",
    description:
      "Công nghệ tạo video giả không thể phân biệt bằng mắt thường. Phe bi quan: post-truth era — không còn nền tảng chung cho dân chủ và giáo dục. Phe xây dựng: khủng hoảng thúc đẩy literacy số, quy chuẩn xác minh và trách nhiệm nền tảng. Tranh luận liên hệ nhận thức luận: ý thức phản ánh thực tại — nhưng thực tại được truyền tải qua công nghệ có thể bị bóp méo.",
  },
  {
    title: "Văn hóa hủy (cancel) có phải dạng 'đấu tranh giai cấp' trên mạng?",
    topicTitle: "Phép biện chứng và phương pháp siêu hình",
    description:
      "Call-out công khai nhắm cá nhân vi phạm chuẩn mực đạo đức. Phe ủng hộ: đấu tranh về ý thức, buộc quyền lực truyền thông chịu trách nhiệm. Phe phản biện: thiếu quy trình công lý, đôi khi trở thành bạo lực số và siêu hình hóa 'tốt/xấu'. Tranh luận dùng phép biện chứng phân tích mâu thuẫn trong không gian số — không phán xét đơn giản phe nào đúng tuyệt đối.",
  },
];
