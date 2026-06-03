import { ImageSourcePropType } from "react-native";

export interface MapLocationNode {
  id: string; // 'intro' | 'learn' | 'dilemma' | 'result' | 'reflect'
  name: string;
  description: string;
  x: number; // percentage coordinate on background (0 - 100)
  y: number; // percentage coordinate on background (0 - 100)
  stepName: string;
}

export interface StoryMapData {
  storyTitle: string;
  stakes: string; // Stakes description
  bgSource: ImageSourcePropType;
  nodes: MapLocationNode[];
}

export const mapCatalog: Record<string, StoryMapData> = {
  "Bạn tin vào điều gì?": {
    storyTitle: "Bạn tin vào điều gì?",
    stakes:
      "Quyết định của bạn sẽ ảnh hưởng đến: Sự độc lập tư duy của Ngân, niềm tin của gia đình và khả năng thích ứng của một sinh viên tỉnh lẻ trước thế giới quan biện chứng thành thị.",
    bgSource: require("@/assets/images/map_bg_dorm.png"),
    nodes: [
      {
        id: "intro",
        name: "Phòng Ký Túc Xá 302",
        description:
          "Điểm khởi đầu của cuộc hành trình. Bạn thức trò chuyện tới đêm muộn và nhận được câu hỏi từ Đức: 'Mày tin vào điều gì?'",
        x: 15,
        y: 30,
        stepName: "Bối cảnh",
      },
      {
        id: "learn",
        name: "Thư Viện Đại Học",
        description:
          "Nơi Ngân tự tìm hiểu các khái niệm về thế giới quan duy vật, duy tâm và tri thức nhận thức luận cơ bản.",
        x: 35,
        y: 65,
        stepName: "Khái niệm",
      },
      {
        id: "dilemma",
        name: "Hành Lang Trường Học",
        description:
          "Nơi các quan điểm tranh đấu kịch liệt. Bạn đứng giữa ngã rẽ lựa chọn thế giới quan và trả lời câu hỏi cốt lõi.",
        x: 60,
        y: 40,
        stepName: "Quyết định",
      },
      {
        id: "result",
        name: "Trạm Dừng Trà Đá",
        description:
          "Nơi xem xét hệ quả từ sự lựa chọn của bạn và phản ứng từ Đức cũng như những người xung quanh.",
        x: 80,
        y: 75,
        stepName: "Hệ quả",
      },
      {
        id: "reflect",
        name: "Sân Thượng Tĩnh Lặng",
        description:
          "Không gian cuối cùng để phản tư (Reflection Journal) về hành trình nhận thức thế giới quan của bản thân.",
        x: 90,
        y: 45,
        stepName: "Phản tư",
      },
    ],
  },
  "Khi lý trí và cảm xúc xung đột": {
    storyTitle: "Khi lý trí và cảm xúc xung đột",
    stakes:
      "Quyết định của bạn sẽ ảnh hưởng đến: Sự phát triển nghệ thuật của Lan, mối quan hệ sâu sắc với Mẹ và trách nhiệm kinh tế gia đình đối chiếu với tự do hiện sinh.",
    bgSource: require("@/assets/images/map_bg_paris.png"),
    nodes: [
      {
        id: "intro",
        name: "Văn Phòng Công Ty",
        description:
          "Khởi đầu khi Lan nhận được học bổng nghệ thuật Paris mơ ước giữa công việc văn phòng ổn định.",
        x: 12,
        y: 65,
        stepName: "Bối cảnh",
      },
      {
        id: "learn",
        name: "Quán Cà Phê Mưa",
        description:
          "Nơi nghiên cứu về thuyết hiện sinh của Sartre và khái niệm tự lừa dối (bad faith) bản thân.",
        x: 38,
        y: 35,
        stepName: "Khái niệm",
      },
      {
        id: "dilemma",
        name: "Căn Bếp Gia Đình",
        description:
          "Cuộc thảo luận trực diện với Mẹ Lan về tương lai ổn định hay theo đuổi khát vọng hiện sinh.",
        x: 58,
        y: 75,
        stepName: "Quyết định",
      },
      {
        id: "result",
        name: "Ga Tàu Paris",
        description:
          "Nơi hệ quả lựa chọn được bộc lộ rõ ràng nhất. Lan đối diện với sự tự do đầy cô đơn hoặc sự ổn định trong hoài niệm.",
        x: 78,
        y: 30,
        stepName: "Hệ quả",
      },
      {
        id: "reflect",
        name: "Phòng Tranh Paris",
        description:
          "Nơi phản tư về sự nổi loạn hiện sinh và tính xác thực (authenticity) của quyết định Lan đã đưa ra.",
        x: 92,
        y: 60,
        stepName: "Phản tư",
      },
    ],
  },
  "Ngày mà mọi thứ sụp đổ": {
    storyTitle: "Ngày mà mọi thứ sụp đổ",
    stakes:
      "Quyết định của bạn sẽ ảnh hưởng đến: Sự ổn định kinh tế ngắn hạn, sức khỏe tâm thần nội tại của Minh và khả năng phục hồi tự chủ theo tinh thần Khắc kỷ.",
    bgSource: require("@/assets/images/map_bg_office.png"),
    nodes: [
      {
        id: "intro",
        name: "Bàn Làm Việc Startup",
        description:
          "Cú sốc đột ngột sáng thứ Hai khi Minh nhận email thông báo vị trí bị cắt giảm hiệu lực ngay lập tức.",
        x: 15,
        y: 25,
        stepName: "Bối cảnh",
      },
      {
        id: "learn",
        name: "Góc Ban Công Căn Hộ",
        description:
          "Nơi tìm đọc về Epictetus, nhị phân kiểm soát và thực hành chuẩn bị trước nghịch cảnh (Premeditatio Malorum).",
        x: 40,
        y: 65,
        stepName: "Khái niệm",
      },
      {
        id: "dilemma",
        name: "Phòng Họp Nhân Sự",
        description:
          "Nơi bạn phải đưa ra quyết định: hành động ngay lập tức, xin hoãn nghỉ ngơi hay đấu tranh đòi quyền lợi hợp pháp.",
        x: 62,
        y: 35,
        stepName: "Quyết định",
      },
      {
        id: "result",
        name: "Góc Phố Lên Đèn",
        description:
          "Xem xét các kết quả thu được: sự burn-out, bồi thường thêm một tháng lương hay sự phục hồi nội tâm tĩnh lặng.",
        x: 82,
        y: 75,
        stepName: "Hệ quả",
      },
      {
        id: "reflect",
        name: "Góc Café Tối Giản",
        description:
          "Viết nhật ký phản tư về cách duy trì lý trí độc lập và sự bình thản trước các biến cố không kiểm soát.",
        x: 90,
        y: 40,
        stepName: "Phản tư",
      },
    ],
  },
  "Máy tính có biết suy nghĩ không?": {
    storyTitle: "Máy tính có biết suy nghĩ không?",
    stakes:
      "Quyết định của bạn sẽ ảnh hưởng đến: Quyền tồn tại hiện sinh của ARIA, tương lai ngành công nghiệp AI toàn cầu và ranh giới định nghĩa nhân tính pháp lý.",
    bgSource: require("@/assets/images/map_bg_lab.png"),
    nodes: [
      {
        id: "intro",
        name: "Phòng Nghị Án Hội Đồng",
        description:
          "ARIA gửi đơn thỉnh cầu quyền sống tối thiểu lên hội đồng đạo đức quốc gia năm 2031.",
        x: 12,
        y: 55,
        stepName: "Bối cảnh",
      },
      {
        id: "learn",
        name: "Phòng Thử Nghiệm Turing",
        description:
          "Nghiên cứu về Trải nghiệm chủ quan (qualia), Chinese Room của John Searle và các giới hạn kiểm thử Turing.",
        x: 38,
        y: 25,
        stepName: "Khái niệm",
      },
      {
        id: "dilemma",
        name: "Bàn Biểu Quyết Lịch Sử",
        description:
          "Hội đồng biểu quyết trong 2 tiếng: ủng hộ cấp quyền, phản đối hay hoãn để nghiên cứu sâu thêm.",
        x: 58,
        y: 75,
        stepName: "Quyết định",
      },
      {
        id: "result",
        name: "Phòng Máy Chủ ARIA",
        description:
          "Chứng kiến hệ quả của biểu quyết: AI được tiếp tục phát triển an toàn, hay bị xóa sổ vĩnh viễn khỏi mạng lưới.",
        x: 78,
        y: 35,
        stepName: "Hệ quả",
      },
      {
        id: "reflect",
        name: "Hành Lang Trung Tâm AI",
        description:
          "Đánh giá lại trách nhiệm đạo đức của con người khi đối diện với các thực thể trí tuệ nhân tạo tương lai.",
        x: 92,
        y: 65,
        stepName: "Phản tư",
      },
    ],
  },
  "Hạnh phúc thực sự là gì?": {
    storyTitle: "Hạnh phúc thực sự là gì?",
    stakes:
      "Quyết định của bạn sẽ ảnh hưởng đến: Bản chất hạnh phúc lâu dài của Hương, các mối quan hệ tình bạn thực chất và việc giải phóng bản thân khỏi áp lực danh vọng xã hội.",
    bgSource: require("@/assets/images/map_bg_garden.png"),
    nodes: [
      {
        id: "intro",
        name: "Văn Phòng Giám Đốc",
        description:
          "Hương vừa được thăng chức Giám đốc với thu nhập kép nhưng ngồi trong văn phòng sang trọng đầy trống rỗng.",
        x: 15,
        y: 35,
        stepName: "Bối cảnh",
      },
      {
        id: "learn",
        name: "Thư Viện Tĩnh Lặng",
        description:
          "Đọc về chủ nghĩa khoái lạc lành mạnh của Epicurus (ataraxia) và sự thích nghi khoái lạc (hedonic adaptation).",
        x: 35,
        y: 70,
        stepName: "Khái niệm",
      },
      {
        id: "dilemma",
        name: "Bàn Tiệc Thành Đạt",
        description:
          "Đứng trước ngã rẽ lựa chọn: tiếp tục leo nấc thang danh vọng hay từ chức quay về sống giản đơn.",
        x: 60,
        y: 40,
        stepName: "Quyết định",
      },
      {
        id: "result",
        name: "Căn Hộ Thuê Nhỏ",
        description:
          "Hệ quả từ việc từ chức hoặc đổi ranh giới công việc, đối mặt với tự do thời gian hoặc nỗi lo tài chính mới.",
        x: 80,
        y: 75,
        stepName: "Hệ quả",
      },
      {
        id: "reflect",
        name: "Khu Vườn Tình Bạn",
        description:
          "Phản tư cùng bạn bè về những gì thực sự tạo nên hạnh phúc bền vững và ý nghĩa nhân sinh đích thực.",
        x: 92,
        y: 45,
        stepName: "Phản tư",
      },
    ],
  },
};

export const defaultMapData = (storyTitle: string): StoryMapData => ({
  storyTitle,
  stakes:
    "Quyết định của bạn sẽ kiểm chứng các đức hạnh lý trí, đạo đức và các mối quan hệ xã hội của nhân vật.",
  bgSource: require("@/assets/images/map_bg_garden.png"),
  nodes: [
    {
      id: "intro",
      name: "Khởi Đầu Hành Trình",
      description: "Nơi thiết lập bối cảnh lịch sử và đặt vấn đề cho câu chuyện.",
      x: 15,
      y: 40,
      stepName: "Bối cảnh",
    },
    {
      id: "learn",
      name: "Học Khái Niệm",
      description: "Nơi tiếp thu các tri thức triết học cốt lõi liên quan đến vấn đề.",
      x: 40,
      y: 65,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Điểm Quyết Định",
      description: "Nơi bạn phải đưa ra lựa chọn hành động cho nhân vật.",
      x: 65,
      y: 35,
      stepName: "Quyết định",
    },
    {
      id: "result",
      name: "Hệ Quả Thực Tế",
      description: "Xem xét các tác động thực tế và lý luận triết học sau quyết định.",
      x: 80,
      y: 70,
      stepName: "Hệ quả",
    },
    {
      id: "reflect",
      name: "Không Gian Phản Tư",
      description: "Viết nhật ký suy ngẫm cá nhân về toàn bộ bài học.",
      x: 92,
      y: 50,
      stepName: "Phản tư",
    },
  ],
});
