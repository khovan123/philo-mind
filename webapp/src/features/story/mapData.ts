import { ImageSourcePropType } from "react-native";

export interface MapLocationNode {
  id: string; // 'intro' | 'encounter' | 'learn' | 'dilemma' | 'choose' | 'result' | 'knowledge' | 'minigame' | 'quiz' | 'reflect'
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

export const mapCatalog: Record<string, StoryMapData> = {};

// Generic nodes used to fill gaps in story-specific catalogs
const GENERIC_EXTRA_NODES: MapLocationNode[] = [
  {
    id: "encounter",
    name: "Gặp Gỡ NPC",
    description: "Đối thoại với các nhân vật triết gia.",
    x: 20,
    y: 40,
    stepName: "Đối thoại",
  },
  {
    id: "choose",
    name: "Lựa Chọn",
    description: "Đưa ra quyết định cuối cùng.",
    x: 58,
    y: 55,
    stepName: "Lựa chọn",
  },
  {
    id: "knowledge",
    name: "Tri Thức",
    description: "So sánh quyết định với cộng đồng.",
    x: 78,
    y: 30,
    stepName: "Tri thức",
  },
  {
    id: "minigame",
    name: "Thử Thách",
    description: "Thu thập manh mối triết học.",
    x: 85,
    y: 65,
    stepName: "Thử thách",
  },
  {
    id: "quiz",
    name: "Kiểm Tra",
    description: "Trắc nghiệm kiến thức.",
    x: 90,
    y: 35,
    stepName: "Kiểm tra",
  },
];

const NODE_ORDER = [
  "intro",
  "encounter",
  "learn",
  "dilemma",
  "choose",
  "result",
  "knowledge",
  "minigame",
  "quiz",
  "reflect",
];

function fillMissingNodes(nodes: MapLocationNode[]): MapLocationNode[] {
  const existingIds = new Set(nodes.map((n) => n.id));
  const merged = [...nodes];
  for (const generic of GENERIC_EXTRA_NODES) {
    if (!existingIds.has(generic.id)) {
      merged.push(generic);
    }
  }
  return merged.sort((a, b) => NODE_ORDER.indexOf(a.id) - NODE_ORDER.indexOf(b.id));
}

mapCatalog["Bạn tin vào điều gì?"] = {
  storyTitle: "Bạn tin vào điều gì?",
  stakes:
    "Quyết định của bạn sẽ ảnh hưởng đến: Sự độc lập tư duy của Ngân, niềm tin của gia đình và khả năng thích ứng của một sinh viên tỉnh lẻ trước thế giới quan biện chứng thành thị.",
  bgSource: require("@/assets/images/map_bg_dorm.png"),
  nodes: fillMissingNodes([
    {
      id: "intro",
      name: "Phòng Ký Túc Xá 302",
      description: "Điểm khởi đầu. Câu hỏi từ Đức: 'Mày tin vào điều gì?'",
      x: 8,
      y: 30,
      stepName: "Bối cảnh",
    },
    {
      id: "learn",
      name: "Thư Viện Đại Học",
      description: "Tìm hiểu thế giới quan duy vật, duy tâm và nhận thức luận.",
      x: 32,
      y: 65,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Hành Lang Trường Học",
      description: "Các quan điểm tranh đấu. Chọn thế giới quan.",
      x: 48,
      y: 40,
      stepName: "Tình huống",
    },
    {
      id: "result",
      name: "Trạm Dừng Trà Đá",
      description: "Hệ quả và phản ứng từ Đức.",
      x: 68,
      y: 75,
      stepName: "Hệ quả",
    },
    {
      id: "reflect",
      name: "Sân Thượng Tĩnh Lặng",
      description: "Phản tư về hành trình nhận thức thế giới quan.",
      x: 95,
      y: 45,
      stepName: "Phản tư",
    },
  ]),
};

mapCatalog["Khi lý trí và cảm xúc xung đột"] = {
  storyTitle: "Khi lý trí và cảm xúc xung đột",
  stakes:
    "Quyết định của bạn sẽ ảnh hưởng đến: Sự phát triển nghệ thuật của Lan, mối quan hệ với Mẹ và trách nhiệm kinh tế gia đình.",
  bgSource: require("@/assets/images/map_bg_paris.png"),
  nodes: fillMissingNodes([
    {
      id: "intro",
      name: "Văn Phòng Công Ty",
      description: "Lan nhận học bổng nghệ thuật Paris.",
      x: 8,
      y: 65,
      stepName: "Bối cảnh",
    },
    {
      id: "learn",
      name: "Quán Cà Phê Mưa",
      description: "Nghiên cứu Sartre và bad faith.",
      x: 32,
      y: 35,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Căn Bếp Gia Đình",
      description: "Thảo luận với Mẹ Lan về tương lai.",
      x: 48,
      y: 75,
      stepName: "Tình huống",
    },
    {
      id: "result",
      name: "Ga Tàu Paris",
      description: "Hệ quả lựa chọn được bộc lộ.",
      x: 68,
      y: 30,
      stepName: "Hệ quả",
    },
    {
      id: "reflect",
      name: "Phòng Tranh Paris",
      description: "Phản tư về nổi loạn hiện sinh.",
      x: 95,
      y: 60,
      stepName: "Phản tư",
    },
  ]),
};

mapCatalog["Ngày mà mọi thứ sụp đổ"] = {
  storyTitle: "Ngày mà mọi thứ sụp đổ",
  stakes:
    "Quyết định của bạn sẽ ảnh hưởng đến: Sự ổn định kinh tế, sức khỏe tâm thần của Minh và khả năng phục hồi Khắc kỷ.",
  bgSource: require("@/assets/images/map_bg_office.png"),
  nodes: fillMissingNodes([
    {
      id: "intro",
      name: "Bàn Làm Việc Startup",
      description: "Cú sốc bị cắt giảm.",
      x: 8,
      y: 25,
      stepName: "Bối cảnh",
    },
    {
      id: "learn",
      name: "Góc Ban Công Căn Hộ",
      description: "Tìm đọc Epictetus và Premeditatio Malorum.",
      x: 32,
      y: 65,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Phòng Họp Nhân Sự",
      description: "Hành động ngay, xin hoãn hay đấu tranh.",
      x: 48,
      y: 35,
      stepName: "Tình huống",
    },
    {
      id: "result",
      name: "Góc Phố Lên Đèn",
      description: "Burn-out, bồi thường hay phục hồi nội tâm.",
      x: 68,
      y: 75,
      stepName: "Hệ quả",
    },
    {
      id: "reflect",
      name: "Góc Café Tối Giản",
      description: "Duy trì bình thản trước biến cố.",
      x: 95,
      y: 40,
      stepName: "Phản tư",
    },
  ]),
};

mapCatalog["Máy tính có biết suy nghĩ không?"] = {
  storyTitle: "Máy tính có biết suy nghĩ không?",
  stakes:
    "Quyết định của bạn sẽ ảnh hưởng đến: Quyền tồn tại của ARIA, tương lai AI và ranh giới nhân tính pháp lý.",
  bgSource: require("@/assets/images/map_bg_lab.png"),
  nodes: fillMissingNodes([
    {
      id: "intro",
      name: "Phòng Nghị Án Hội Đồng",
      description: "ARIA thỉnh cầu quyền sống tối thiểu.",
      x: 8,
      y: 55,
      stepName: "Bối cảnh",
    },
    {
      id: "learn",
      name: "Phòng Thử Nghiệm Turing",
      description: "Qualia, Chinese Room, Turing test.",
      x: 32,
      y: 25,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Bàn Biểu Quyết Lịch Sử",
      description: "Ủng hộ, phản đối hay hoãn.",
      x: 48,
      y: 75,
      stepName: "Tình huống",
    },
    {
      id: "result",
      name: "Phòng Máy Chủ ARIA",
      description: "AI phát triển an toàn hay bị xóa sổ.",
      x: 68,
      y: 35,
      stepName: "Hệ quả",
    },
    {
      id: "reflect",
      name: "Hành Lang Trung Tâm AI",
      description: "Trách nhiệm đạo đức khi đối diện AI.",
      x: 95,
      y: 65,
      stepName: "Phản tư",
    },
  ]),
};

mapCatalog["Hạnh phúc thực sự là gì?"] = {
  storyTitle: "Hạnh phúc thực sự là gì?",
  stakes:
    "Quyết định của bạn sẽ ảnh hưởng đến: Hạnh phúc lâu dài của Hương, tình bạn thực chất và áp lực danh vọng.",
  bgSource: require("@/assets/images/map_bg_garden.png"),
  nodes: fillMissingNodes([
    {
      id: "intro",
      name: "Văn Phòng Giám Đốc",
      description: "Thăng chức nhưng trống rỗng.",
      x: 8,
      y: 35,
      stepName: "Bối cảnh",
    },
    {
      id: "learn",
      name: "Thư Viện Tĩnh Lặng",
      description: "Epicurus (ataraxia) và hedonic adaptation.",
      x: 32,
      y: 70,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Bàn Tiệc Thành Đạt",
      description: "Leo danh vọng hay sống giản đơn.",
      x: 48,
      y: 40,
      stepName: "Tình huống",
    },
    {
      id: "result",
      name: "Căn Hộ Thuê Nhỏ",
      description: "Từ chức hoặc đổi ranh giới.",
      x: 68,
      y: 75,
      stepName: "Hệ quả",
    },
    {
      id: "reflect",
      name: "Khu Vườn Tình Bạn",
      description: "Phản tư về hạnh phúc bền vững.",
      x: 95,
      y: 45,
      stepName: "Phản tư",
    },
  ]),
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
      x: 8,
      y: 25,
      stepName: "Bối cảnh",
    },
    {
      id: "encounter",
      name: "Gặp Gỡ NPC",
      description: "Đối thoại với các nhân vật triết gia để thu thập thêm góc nhìn.",
      x: 20,
      y: 40,
      stepName: "Đối thoại",
    },
    {
      id: "learn",
      name: "Học Khái Niệm",
      description: "Nơi tiếp thu các tri thức triết học cốt lõi liên quan đến vấn đề.",
      x: 32,
      y: 60,
      stepName: "Khái niệm",
    },
    {
      id: "dilemma",
      name: "Điểm Quyết Định",
      description: "Nơi bạn phải đưa ra lựa chọn hành động cho nhân vật.",
      x: 48,
      y: 70,
      stepName: "Tình huống",
    },
    {
      id: "choose",
      name: "Lựa Chọn",
      description: "Đưa ra quyết định cuối cùng và lập luận cho lựa chọn của bạn.",
      x: 58,
      y: 35,
      stepName: "Lựa chọn",
    },
    {
      id: "result",
      name: "Hệ Quả Thực Tế",
      description: "Xem xét các tác động thực tế và lý luận triết học sau quyết định.",
      x: 68,
      y: 65,
      stepName: "Hệ quả",
    },
    {
      id: "knowledge",
      name: "Tri Thức Cộng Đồng",
      description: "So sánh quyết định với cộng đồng và tìm hiểu thêm khái niệm sâu.",
      x: 78,
      y: 30,
      stepName: "Tri thức",
    },
    {
      id: "minigame",
      name: "Thử Thách Manh Mối",
      description: "Giải đố và thu thập các manh mối triết học ẩn giấu.",
      x: 85,
      y: 70,
      stepName: "Thử thách",
    },
    {
      id: "quiz",
      name: "Kiểm Tra Kiến Thức",
      description: "Trắc nghiệm nhanh để kiểm tra mức độ hiểu biết của bạn.",
      x: 90,
      y: 35,
      stepName: "Kiểm tra",
    },
    {
      id: "reflect",
      name: "Không Gian Phản Tư",
      description: "Viết nhật ký suy ngẫm cá nhân về toàn bộ bài học.",
      x: 95,
      y: 55,
      stepName: "Phản tư",
    },
  ],
});
