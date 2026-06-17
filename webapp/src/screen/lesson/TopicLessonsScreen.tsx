import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useListLessonsQuery } from "@/services/rtk-api/lesson.api";
import { Pressable, ScrollView, Text, View } from "@/tw";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  card: "#1E1E21",
  chip: "#27272A",
  border: "#353437",
  text: "#E4E4E7",
  muted: "#A1A1AA",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  buttonText: "#0C0C0E",
};

export default function TopicLessonsScreen() {
  const router = useRouter();
  const { topicId, topicTitle } = useLocalSearchParams<{
    topicId: string;
    topicTitle?: string;
  }>();
  const {
    data: lessons = [],
    isLoading,
    isError,
    refetch,
  } = useListLessonsQuery({ topicId, limit: 50 }, { skip: !topicId });

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
      <View className="flex-1 bg-[#0C0C0E]">
        <View className="flex-row items-center gap-2 border-b border-[#353437] px-3 py-3">
          <Pressable
            onPress={() => router.back()}
            className="h-[42px] w-[42px] items-center justify-center rounded-full"
          >
            <ArrowLeft color={Colors.primaryLight} size={22} />
          </Pressable>
          <View className="flex-1 gap-0.5">
            <Text className="text-[11px] font-black uppercase leading-[15px] text-[#FFB77D]">
              Chủ đề
            </Text>
            <Text
              numberOfLines={2}
              className="font-sans text-[22px] font-black leading-[29px] text-[#E4E4E7]"
            >
              {topicTitle ?? "Bài học"}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="w-full max-w-[820px] self-center gap-2 p-3 pb-[180px]"
        >
          {isLoading ? (
            <View className="min-h-[180px] items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] p-4">
              <ActivityIndicator color={Colors.primaryLight} />
              <Text className="text-center text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
                Đang tải bài học từ database...
              </Text>
            </View>
          ) : null}

          {isError ? (
            <View className="min-h-[180px] items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] p-4">
              <Text className="text-center text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                Không tải được bài học
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

          {!isLoading && !isError && lessons.length === 0 ? (
            <View className="min-h-[180px] items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] p-4">
              <BookOpen color={Colors.muted} size={34} />
              <Text className="text-center text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                Chưa có bài học trong chủ đề này
              </Text>
              <Text className="text-center text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
                Kiểm tra lại seed full lessons hoặc chọn chủ đề khác.
              </Text>
            </View>
          ) : null}

          {lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() =>
                router.push({
                  pathname: "/full-lesson" as never,
                  params: { lessonId: lesson.id },
                })
              }
              className="min-h-[116px] flex-row items-center gap-3 rounded-md border border-[#353437] bg-[#1E1E21] p-3"
              style={({ pressed }) =>
                pressed ? { opacity: 0.78, transform: [{ scale: 0.98 }] } : undefined
              }
            >
              <View className="h-[42px] w-[42px] items-center justify-center rounded-sm bg-[#27272A]">
                <BookOpen color={Colors.primaryLight} size={18} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[16px] font-black leading-[22px] text-[#E4E4E7]">
                  {lesson.title}
                </Text>
                <Text
                  numberOfLines={2}
                  className="text-[13px] font-semibold leading-[19px] text-[#A1A1AA]"
                >
                  {lesson.conflict || lesson.realLifeExample || "Đọc full lesson từ database."}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <Text className="text-[11px] font-extrabold leading-[15px] text-[#FFB77D]">
                    {lesson.estimatedMinutes ?? 8} phút đọc
                  </Text>
                  <Text className="text-[11px] font-extrabold leading-[15px] text-[#FFB77D]">
                    {lesson.status}
                  </Text>
                </View>
              </View>
              <ChevronRight color={Colors.muted} size={20} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
