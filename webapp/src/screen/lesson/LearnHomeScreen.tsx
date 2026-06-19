import { useRouter } from "expo-router";
import { BookOpen, ChevronRight, GraduationCap, Library, Network } from "lucide-react-native";
import { useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useListTopicsQuery } from "@/services/rtk-api/topic.api";
import type { TopicDTO } from "@/types/learning";
import { Pressable, ScrollView, Text, View } from "@/tw";

const CHAPTER_1_CATEGORY = "Chương 1";

const Colors = {
  primaryLight: "#FFB77D",
  muted: "#A1A1AA",
};

// Thứ tự sư phạm của 6 mục Chương 1 (API không trả về thứ tự cố định).
// Khớp theo từ khoá đặc trưng trong tiêu đề mục → mã mục + thứ tự.
const SECTION_ORDER: { match: string; code: string }[] = [
  { match: "khái lược", code: "I.1" },
  { match: "vấn đề cơ bản", code: "I.2" },
  { match: "biện chứng", code: "I.3" },
  { match: "sự ra đời", code: "II.1" },
  { match: "đối tượng", code: "II.2a" },
  { match: "vai trò", code: "II.2b" },
];

function sectionMeta(title: string): { code: string; order: number } {
  const lower = title.toLowerCase();
  const index = SECTION_ORDER.findIndex((s) => lower.includes(s.match));
  return {
    code: index >= 0 ? SECTION_ORDER[index].code : "",
    order: index >= 0 ? index : SECTION_ORDER.length,
  };
}

export default function LearnHomeScreen() {
  const router = useRouter();
  const {
    data: topics = [],
    isLoading,
    isError,
    refetch,
  } = useListTopicsQuery({ category: CHAPTER_1_CATEGORY, limit: 20 });

  const orderedTopics = useMemo(
    () => [...topics].sort((a, b) => sectionMeta(a.title).order - sectionMeta(b.title).order),
    [topics],
  );

  const openTopic = (topic: TopicDTO) =>
    router.push({
      pathname: "/topic-lessons" as never,
      params: { topicId: topic.id, topicTitle: topic.title },
    });

  // Sơ đồ tư duy Chương 1 gắn vào mục I.1 (Khái lược về Triết học).
  const mindmapTopicId = orderedTopics.find((t) => sectionMeta(t.title).code === "I.1")?.id;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
      <View className="flex-1 bg-[#0C0C0E]">
        <View className="flex-row items-center gap-2 border-b border-[#353437] px-3 py-3">
          <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-[#27272A]">
            <GraduationCap color={Colors.primaryLight} size={22} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-[11px] font-black uppercase leading-[15px] text-[#FFB77D]">
              Học tập
            </Text>
            <Text className="font-sans text-[22px] font-black leading-[29px] text-[#E4E4E7]">
              Triết học Mác – Lênin
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="w-full max-w-[820px] self-center gap-2 p-3 pb-[180px]"
        >
          <View className="gap-1 rounded-md border border-[#353437] bg-[#161618] p-4">
            <View className="flex-row items-center gap-2">
              <Library color={Colors.primaryLight} size={18} />
              <Text className="text-[16px] font-black leading-[22px] text-[#E4E4E7]">Chương 1</Text>
            </View>
            <Text className="text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
              Khái lược về triết học và sự ra đời của chủ nghĩa Mác – Lênin. Chọn một mục bên dưới
              để bắt đầu đọc bài, làm quiz và luyện tư duy.
            </Text>
          </View>

          {mindmapTopicId ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/mindmap" as never,
                  params: { topicId: mindmapTopicId },
                })
              }
              className="flex-row items-center gap-3 rounded-md border border-[#353437] bg-[#1E1E21] p-3"
              style={({ pressed }) =>
                pressed ? { opacity: 0.78, transform: [{ scale: 0.98 }] } : undefined
              }
            >
              <View className="h-[42px] w-[42px] items-center justify-center rounded-sm bg-[#27272A]">
                <Network color={Colors.primaryLight} size={18} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                  Sơ đồ tư duy Chương 1
                </Text>
                <Text className="text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
                  Bản đồ khái niệm: duy vật/duy tâm, biện chứng/siêu hình…
                </Text>
              </View>
              <ChevronRight color={Colors.muted} size={20} />
            </Pressable>
          ) : null}

          {isLoading ? (
            <View className="min-h-[180px] items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] p-4">
              <ActivityIndicator color={Colors.primaryLight} />
              <Text className="text-center text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
                Đang tải nội dung Chương 1...
              </Text>
            </View>
          ) : null}

          {isError ? (
            <View className="min-h-[180px] items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] p-4">
              <Text className="text-center text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                Không tải được nội dung
              </Text>
              <Pressable
                onPress={() => refetch()}
                className="min-h-[42px] items-center justify-center rounded-sm bg-[#FFB77D] px-4"
              >
                <Text className="text-[13px] font-black leading-[18px] text-[#0C0C0E]">
                  Thử lại
                </Text>
              </Pressable>
            </View>
          ) : null}

          {!isLoading && !isError && orderedTopics.length === 0 ? (
            <View className="min-h-[180px] items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] p-4">
              <BookOpen color={Colors.muted} size={34} />
              <Text className="text-center text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                Chưa có nội dung Chương 1
              </Text>
              <Text className="text-center text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
                Kiểm tra lại seed (category &quot;Chương 1&quot;).
              </Text>
            </View>
          ) : null}

          {orderedTopics.map((topic) => {
            const { code } = sectionMeta(topic.title);
            return (
              <Pressable
                key={topic.id}
                onPress={() => openTopic(topic)}
                className="min-h-[96px] flex-row items-center gap-3 rounded-md border border-[#353437] bg-[#1E1E21] p-3"
                style={({ pressed }) =>
                  pressed ? { opacity: 0.78, transform: [{ scale: 0.98 }] } : undefined
                }
              >
                <View className="h-[42px] min-w-[42px] items-center justify-center rounded-sm bg-[#27272A] px-2">
                  <Text className="text-[13px] font-black leading-[18px] text-[#FFB77D]">
                    {code || "•"}
                  </Text>
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                    {topic.title}
                  </Text>
                  {topic.description ? (
                    <Text
                      numberOfLines={2}
                      className="text-[13px] font-semibold leading-[19px] text-[#A1A1AA]"
                    >
                      {topic.description}
                    </Text>
                  ) : null}
                </View>
                <ChevronRight color={Colors.muted} size={20} />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
