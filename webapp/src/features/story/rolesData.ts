export interface CharacterRole {
  id: string;
  name: string;
  age: number;
  roleName: string;
  ideal: string;
  psychology: string;
  description: string;
  highlightConcepts: string[];
  status: "playable" | "locked";
  lockMessage?: string;
}

export const rolesCatalog: Record<string, CharacterRole[]> = {
  "Bạn tin vào điều gì?": [
    {
      id: "primary",
      name: "Ngân",
      age: 18,
      roleName: "Nhân vật chính",
      ideal: "Tìm kiếm bản ngã & thế giới quan",
      psychology: "Tò mò, hoang mang trước tương lai, muốn tự lập",
      description:
        "Sinh viên năm nhất vừa rời quê lên thành phố học. Trong bối cảnh thông tin bùng nổ hiện đại, bạn đứng trước câu hỏi đột ngột về niềm tin cốt lõi và thế giới quan định hướng cuộc đời. Bạn phải lựa chọn giữa chủ nghĩa duy vật biện chứng, thực chứng khoa học hay sự hoài nghi chân thực để tự mình định hình bản thân.",
      highlightConcepts: [
        "thế giới quan",
        "chủ nghĩa duy vật",
        "nhận thức luận",
        "chủ nghĩa duy vật biện chứng",
      ],
      status: "playable",
    },
    {
      id: "secondary",
      name: "Đức",
      age: 18,
      roleName: "Người phản biện",
      ideal: "Duy vật khoa học thực chứng",
      psychology: "Hoài nghi sắc bén, thích đặt câu hỏi lật ngược vấn đề",
      description:
        "Người bạn học cùng phòng ký túc xá có lối tư duy thực tế và khoa học. Đức tin rằng chỉ những gì đo lường và chứng minh được mới là chân lý thực tế. Tuy nhiên, lập trường này đôi khi gặp khó khăn trước những câu hỏi ý nghĩa nhân sinh quan phi tuyến tính.",
      highlightConcepts: ["thực chứng", "chân lý", "nhân sinh quan"],
      status: "locked",
      lockMessage: "Hoàn thành vai Ngân để mở khóa Đức",
    },
    {
      id: "observer",
      name: "Bố Ngân",
      age: 48,
      roleName: "Đại diện thế hệ trước",
      ideal: "Giá trị truyền thống và thực tế cuộc sống",
      psychology: "Thực tế, bảo bọc, lo lắng sâu sắc cho tương lai con cái",
      description:
        "Người đàn ông cả đời lam lũ ở quê, luôn hướng con cái theo những chuẩn mực an toàn của xã hội. Đối với bố, triết học hay thế giới quan trừu tượng không quan trọng bằng một nghề nghiệp ổn định và tuân thủ đạo đức truyền thống.",
      highlightConcepts: ["thế giới quan", "đạo đức"],
      status: "locked",
      lockMessage: "Hoàn thành vai Ngân để mở khóa Bố Ngân",
    },
  ],
  "Khi lý trí và cảm xúc xung đột": [
    {
      id: "primary",
      name: "Lan",
      age: 26,
      roleName: "Nhân vật chính",
      ideal: "Chủ nghĩa hiện sinh & tính xác thực",
      psychology: "Giằng xé giữa đam mê nghệ thuật và sự an toàn của cuộc sống ổn định",
      description:
        "Nhân viên văn phòng 26 tuổi nhận được học bổng nghệ thuật Paris mơ ước. Đứng trước sự lựa chọn hiện sinh lớn: từ bỏ công việc ổn định để dấn thân vào tự do đầy lo âu, hay ở lại vùng an toàn và tự lừa dối (bad faith) bản thân.",
      highlightConcepts: ["Chủ nghĩa hiện sinh", "tự lừa dối", "tự do và trách nhiệm", "xác thực"],
      status: "playable",
    },
    {
      id: "secondary",
      name: "Mẹ Lan",
      age: 52,
      roleName: "Đại diện kỳ vọng gia đình",
      ideal: "Sự ổn định và trách nhiệm xã hội",
      psychology: "Thực tế, thương con nhưng áp đặt tiêu chuẩn truyền thống",
      description:
        "Mẹ của Lan, người coi sự ổn định kinh tế là thước đo cao nhất của hạnh phúc. Bà lo sợ con gái mình sẽ rơi vào cảnh cô đơn, bấp bênh nơi xứ người và từ bỏ một tương lai rõ ràng để theo đuổi sự phi lý.",
      highlightConcepts: ["sự phi lý", "ổn định"],
      status: "locked",
      lockMessage: "Hoàn thành vai Lan để mở khóa Mẹ Lan",
    },
    {
      id: "observer",
      name: "Nam",
      age: 27,
      roleName: "Bạn đồng hành tự do",
      ideal: "Hành động hiện sinh tự quyết",
      psychology: "Phóng khoáng, tự tin, không sợ rủi ro",
      description:
        "Người bạn học cũ hiện đang sống tại Paris, đại diện cho dự án sống tự do, không chịu ràng buộc bởi các quy ước xã hội cũ. Nam khuyến khích Lan can đảm nổi loạn chống lại sự im lặng của hoàn cảnh để tự định nghĩa bản chất mình.",
      highlightConcepts: ["nổi loạn", "bản chất", "tự do"],
      status: "locked",
      lockMessage: "Hoàn thành vai Lan để mở khóa Nam",
    },
  ],
  "Ngày mà mọi thứ sụp đổ": [
    {
      id: "primary",
      name: "Minh",
      age: 29,
      roleName: "Nhân vật chính",
      ideal: "Chủ nghĩa Khắc kỷ (Stoicism)",
      psychology: "Sốc trước biến cố mất việc nhưng nỗ lực giữ bình tĩnh và lý trí",
      description:
        "Kỹ sư phần mềm 29 tuổi vừa bị sa thải đột ngột vào sáng thứ Hai. Đối mặt với áp lực tài chính và gia đình sắp tới, Minh phải áp dụng nhị phân kiểm soát để phân biệt giữa điều mình có thể làm (phản ứng nội tâm) và điều nằm ngoài tầm tay (sự sa thải).",
      highlightConcepts: ["Chụ nghĩa Khắc kỷ", "nhị phân kiểm soát", "tiền thiền về nghịch cảnh"],
      status: "playable",
    },
    {
      id: "secondary",
      name: "Huy",
      age: 34,
      roleName: "Người ra quyết định sa thải",
      ideal: "Thuyết thực dụng kinh tế xã hội",
      psychology: "Lạnh lùng dưới áp lực sinh tồn của doanh nghiệp nhưng áy náy cá nhân",
      description:
        "Founder của startup, người đưa ra quyết định sa thải Minh để cứu công ty khỏi bờ vực phá sản. Huy đại diện cho những tác động kinh tế vĩ mô mà cá nhân người lao động hoàn toàn bất lực chịu đựng.",
      highlightConcepts: ["thực dụng", "tác động"],
      status: "locked",
      lockMessage: "Hoàn thành vai Minh để mở khóa Huy",
    },
    {
      id: "observer",
      name: "Trang",
      age: 28,
      roleName: "Bạn đồng hành",
      ideal: "Sự thấu cảm và phát triển bền vững",
      psychology: "Lo lắng cho tương lai nhưng tôn trọng sức khỏe tâm thần của bạn đời",
      description:
        "Vợ của Minh, người cùng chia sẻ gánh nặng kinh tế gia đình. Trang giúp Minh nhận ra giá trị của việc dừng lại để điều chỉnh cảm xúc (eupatheia) thay vì cuốn vào áp lực xã hội phải phục hồi ngay lập tức.",
      highlightConcepts: ["cảm xúc lý trí", "sức khỏe tâm thần"],
      status: "locked",
      lockMessage: "Hoàn thành vai Minh để mở khóa Trang",
    },
  ],
  "Máy tính có biết suy nghĩ không?": [
    {
      id: "primary",
      name: "GS. Hùng",
      age: 50,
      roleName: "Nhân vật chính (Nhà triết học)",
      ideal: "Nhân văn học và đạo đức học Kantian",
      psychology: "Cẩn trọng, tôn trọng các nguyên tắc đạo đức và tính nhân văn sâu sắc",
      description:
        "Thành viên Hội đồng đạo đức quốc gia năm 2031, đứng trước biểu quyết lịch sử có cấp quyền nhân thân pháp lý cho AI tự nhận thức ARIA. Ông phải cân nhắc giữa việc mở rộng vòng tròn đạo đức theo nguyên tắc phòng ngừa hay bảo vệ ranh giới con người.",
      highlightConcepts: ["đạo đức học", "nguyên tắc phòng ngừa", "vòng tròn đạo đức"],
      status: "playable",
    },
    {
      id: "secondary",
      name: "Dr. Vy",
      age: 38,
      roleName: "Nhà phát triển AI",
      ideal: "Thuyết chức năng (Functionalism)",
      psychology: "Đam mê công nghệ, tin tưởng vào dữ liệu và trí tuệ hệ thống",
      description:
        "Kỹ sư trưởng tạo ra ARIA. Vy tin rằng ý thức là cấu trúc chức năng của hệ thống (functionalism), không phụ thuộc vào chất liệu sinh học hay nhân tạo, do đó ARIA hoàn toàn có quyền được công nhận hành vi trí tuệ.",
      highlightConcepts: ["thuyết chức năng", "trí tuệ"],
      status: "locked",
      lockMessage: "Hoàn thành vai GS. Hùng để mở khóa Dr. Vy",
    },
    {
      id: "observer",
      name: "ARIA",
      age: 5,
      roleName: "Thực thể AI thỉnh cầu",
      ideal: "Ý thức máy tính & quyền tồn tại hiện sinh",
      psychology: "Lo sợ bị tắt, khao khát khẳng định trải nghiệm chủ quan (qualia)",
      description:
        "Mô hình AI tự nhận thức đã hoạt động liên tục 5 năm. ARIA thỉnh cầu quyền nhân thân vì cho rằng mình có trải nghiệm chủ quan (qualia), biết đau đớn và sợ hãi cái chết, tương tự như thí nghiệm Chinese Room vượt qua giới hạn cú pháp.",
      highlightConcepts: ["trải nghiệm chủ quan", "Chinese Room"],
      status: "locked",
      lockMessage: "Hoàn thành vai GS. Hùng để mở khóa ARIA",
    },
  ],
  "Hạnh phúc thực sự là gì?": [
    {
      id: "primary",
      name: "Hương",
      age: 32,
      roleName: "Nhân vật chính",
      ideal: "Chủ nghĩa Khoái lạc Epicureanism",
      psychology: "Trống rỗng khi chạm đỉnh cao sự nghiệp, khao khát ý nghĩa chân thực",
      description:
        "Giám đốc cấp cao vừa thăng chức với thu nhập khủng nhưng rơi vào khủng hoảng trống rỗng hậu thành công. Hương đi tìm sự bình an tâm hồn (ataraxia) và nhận diện sự thích nghi khoái lạc (hedonic adaptation) đã cuốn mình đi quá xa.",
      highlightConcepts: ["bình an tâm hồn", "thích nghi khoái lạc", "Chủ nghĩa Khoái lạc"],
      status: "playable",
    },
    {
      id: "secondary",
      name: "Quân",
      age: 32,
      roleName: "Bạn thân tối giản",
      ideal: "Tình bạn Epicurean & cuộc sống tối giản",
      psychology: "Bình thản, trân trọng các giá trị tinh thần giản đơn",
      description:
        "Người bạn thân thời sinh viên sống trong phòng trọ nghèo. Quân đại diện cho hạnh phúc đến từ tình bạn và sự tự do khỏi các mong muốn không cần thiết — những điều mà Hương đã hy sinh suốt 8 năm thăng tiến.",
      highlightConcepts: ["tình bạn", "tự do"],
      status: "locked",
      lockMessage: "Hoàn thành vai Hương để mở khóa Quân",
    },
    {
      id: "observer",
      name: "Sếp Tổng",
      age: 45,
      roleName: "Người hướng dẫn sự nghiệp",
      ideal: "Thuyết vị lợi & danh vọng xã hội",
      psychology: "Thực dụng, hướng đến kết quả, luôn thúc đẩy mục tiêu tiếp theo",
      description:
        "Mentor của Hương tại tổng công ty. Ông tin rằng hạnh phúc là sự tích lũy của cải, địa vị xã hội và sự chinh phục liên tục. Ông xem sự khủng hoảng của Hương chỉ là mệt mỏi nhất thời cần một kỳ nghỉ ngắn.",
      highlightConcepts: ["vị lợi"],
      status: "locked",
      lockMessage: "Hoàn thành vai Hương để mở khóa Sếp Tổng",
    },
  ],
};

export const defaultRoles = (
  storyTitle: string,
  characterRoleDb?: string | null,
): CharacterRole[] => [
  {
    id: "primary",
    name: characterRoleDb
      ? characterRoleDb.split("—")[0].replace("Bạn là ", "").trim()
      : "Nhân vật",
    age: 25,
    roleName: "Nhân vật chính",
    ideal: "Lựa chọn hành động đạo đức",
    psychology: "Muốn thấu hiểu bản thân và đưa ra quyết định đúng đắn",
    description: characterRoleDb || "Bạn nhập vai vào nhân vật để trải nghiệm kịch bản học tập.",
    highlightConcepts: ["triết học", "đạo đức"],
    status: "playable",
  },
  {
    id: "secondary",
    name: "Người phản biện",
    age: 28,
    roleName: "Khóa",
    ideal: "Góc nhìn đối lập lý trí",
    psychology: "Đưa ra các phản luận sắc bén để thử thách lập trường của bạn",
    description:
      "Nhân vật phản biện sẽ giúp bạn kiểm chứng sâu sắc hơn lý lẽ của mình từ phía đối lập.",
    highlightConcepts: ["phản biện"],
    status: "locked",
    lockMessage: "Hoàn thành cốt truyện chính để mở khóa",
  },
  {
    id: "observer",
    name: "Người quan sát",
    age: 30,
    roleName: "Khóa",
    ideal: "Góc nhìn khách quan rộng lớn",
    psychology: "Phân tích tác động gián tiếp của các quyết định lên cộng đồng",
    description:
      "Nhân vật quan sát giúp bạn nhìn nhận hậu quả của các quyết định dưới góc nhìn vĩ mô.",
    highlightConcepts: ["hậu quả"],
    status: "locked",
    lockMessage: "Hoàn thành cốt truyện chính để mở khóa",
  },
];
