import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BookmarkButton } from "@/components/bookmark-button";
import { ProgressBadge } from "@/components/progress";
import { ThemedText } from "@/components/themed-text";
import { cn } from "@/lib/utils";

import { useGetLessonByIdQuery } from "@/services/rtk-api/lesson.api";
import { Pressable, ScrollView, View } from "@/tw";
import { Image } from "@/tw/image";

const Colors = {
  background: "#0C0C0E",
  card: "#1E1E21",
  border: "#3E332B",
  borderSoft: "#554336",
  body: "#DBC2B0",
  primaryLight: "#FFB77D",
  buttonText: "#0C0C0E",
};

const lessonImage =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80";

export default function FullLessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const {
    data: lesson,
    isLoading,
    isError,
    refetch,
  } = useGetLessonByIdQuery(lessonId ?? "", { skip: !lessonId });
  const [progress, setProgress] = useState(0.08);
  const [completed, setCompleted] = useState(false);

  const progressLabel = useMemo(
    () => Math.min(100, Math.max(0, Math.round(progress * 100))),
    [progress],
  );

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollable = Math.max(1, contentSize.height - layoutMeasurement.height);
    setProgress(Math.min(1, Math.max(0.08, contentOffset.y / scrollable)));
  }

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
        <View className={cn(tw.screen, "items-center justify-center gap-3")}>
          <ActivityIndicator color={Colors.primaryLight} size="large" />
          <ThemedText className={tw.bodyText}>
            Đang tải bài học đầy đủ từ cơ sở dữ liệu...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !lesson) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
        <View className={cn(tw.screen, "items-center justify-center gap-3 p-6")}>
          <ThemedText className={tw.sectionTitle}>Không tải được bài học</ThemedText>
          <ThemedText className={cn(tw.bodyText, "text-center")}>
            Bài học này chưa có trong cơ sở dữ liệu hoặc API đang lỗi.
          </ThemedText>
          <Pressable onPress={() => refetch()} className={tw.primaryButton}>
            <ThemedText className={tw.primaryButtonText}>Thử lại</ThemedText>
          </Pressable>
          <Pressable onPress={() => router.back()} className={tw.secondaryButton}>
            <ThemedText className={tw.secondaryButtonText}>Quay lại</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
      <View className={tw.screen}>
        <View className={tw.header}>
          <View className={tw.headerTop}>
            <Pressable
              accessibilityLabel="Quay lại"
              accessibilityRole="button"
              onPress={() => router.back()}
              className={tw.iconButton}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ArrowLeft color={Colors.primaryLight} size={22} />
            </Pressable>
            <ThemedText numberOfLines={1} className={tw.headerTitle}>
              {lesson.title}
            </ThemedText>
            <BookmarkButton targetType="LESSON" targetId={lesson.id} compact />
          </View>

          <ProgressBadge
            compact
            detail="Tiến độ đọc"
            label="Tiến độ bài học"
            value={progressLabel}
            style={{
              minHeight: 58,
              borderColor: "rgba(255, 183, 125, 0.22)",
              backgroundColor: Colors.card,
            }}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={tw.content}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className={tw.metaWrap}>
            <View className={tw.chipRow}>
              <View className={tw.chip}>
                <ThemedText className={tw.chipText}>
                  {lesson.topic.category ?? lesson.topic.title}
                </ThemedText>
              </View>
              <View className={cn(tw.chip, "border-transparent")}>
                <ThemedText className={cn(tw.chipText, "text-[#DBC2B0]")}>
                  {lesson.estimatedMinutes ?? 8} phút
                </ThemedText>
              </View>
              <View className={cn(tw.chip, "border-[#FFB4AB40] bg-[#93000A38]")}>
                <ThemedText className={cn(tw.chipText, "text-[#FFB4AB]")}>
                  Bài học đầy đủ
                </ThemedText>
              </View>
              <View className={tw.chip}>
                <ThemedText className={tw.chipText}>
                  {completed ? "Đã hoàn thành" : translateStatus(lesson.status)}
                </ThemedText>
              </View>
            </View>

            <ThemedText className={tw.title}>{lesson.title}</ThemedText>
            <View className={tw.titleRule} />
          </View>

          <Image
            source={lessonImage}
            contentFit="cover"
            transition={220}
            className={tw.heroImage}
          />

          <DbLessonContent
            conflict={lesson.conflict}
            content={lesson.content}
            questions={lesson.questions}
            realLifeExample={lesson.realLifeExample}
          />

          <View className={tw.lessonActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/quiz/${lesson.id}` as never)}
              className={tw.primaryButton}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ThemedText className={tw.primaryButtonText}>Làm bài kiểm tra</ThemedText>
              <ChevronRight color={Colors.buttonText} size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCompleted(true)}
              className={tw.secondaryButton}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ThemedText className={tw.secondaryButtonText}>
                {completed ? "Đã đánh dấu hoàn thành" : "Đánh dấu đã hoàn thành"}
              </ThemedText>
              {completed ? <CheckCircle2 color={Colors.primaryLight} size={16} /> : null}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function translateStatus(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "Đã xuất bản";
    case "DRAFT":
      return "Bản nháp";
    case "ARCHIVED":
      return "Đã lưu trữ";
    default:
      return status;
  }
}

type DbLessonContentProps = {
  content: string;
  realLifeExample: string | null;
  conflict: string | null;
  questions: { id: string; question: string; questionType: string }[];
};

function DbLessonContent({ content, conflict, questions, realLifeExample }: DbLessonContentProps) {
  return (
    <>
      <MarkdownSection title="Nội dung chính" markdown={content} />
      {realLifeExample ? (
        <MarkdownSection title="Ví dụ thực tế" markdown={realLifeExample} />
      ) : null}
      {conflict ? <MarkdownSection title="Câu hỏi tranh luận" markdown={conflict} /> : null}
      {questions.length > 0 ? (
        <View className={tw.section}>
          <ThemedText className={tw.sectionTitle}>Câu hỏi ôn tập</ThemedText>
          {questions.map((question, index) => (
            <View key={question.id} className={tw.quote}>
              <ThemedText className={tw.quoteText}>
                {index + 1}. {question.question}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
}

function MarkdownSection({ markdown, title }: { markdown: string; title: string }) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <View className={tw.section}>
      <ThemedText className={tw.sectionTitle}>{title}</ThemedText>
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return (
            <ThemedText key={`${title}-${index}`} className={tw.panelLabel}>
              {stripMarkdown(block.replace(/^###\s*/, ""))}
            </ThemedText>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <ThemedText key={`${title}-${index}`} className={tw.sectionTitle}>
              {stripMarkdown(block.replace(/^##\s*/, ""))}
            </ThemedText>
          );
        }

        return (
          <View key={`${title}-${index}`} className={tw.paragraph}>
            <ThemedText className={tw.bodyText}>{stripMarkdown(block)}</ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const pressedStyle = { opacity: 0.78, transform: [{ scale: 0.98 }] };

const tw = {
  safeArea: "flex-1 bg-[#0C0C0E]",
  screen: "flex-1 bg-[#0C0C0E]",
  header: "gap-2 border-b border-[#55433673] bg-[#0C0C0E] px-3 pb-3 pt-2",
  headerTop: "min-h-[44px] flex-row items-center justify-between",
  iconButton: "h-10 w-10 items-center justify-center rounded-full",
  headerTitle: "flex-1 text-center text-[14px] font-black leading-[19px] text-[#FFB77D]",
  content: "w-full max-w-[780px] self-center gap-4 p-3 pb-[150px]",
  metaWrap: "gap-3",
  chipRow: "flex-row flex-wrap gap-2",
  chip: "min-h-[30px] items-center justify-center rounded-sm border border-[#FFB77D38] bg-[#271E16] px-3",
  chipText: "text-[11px] font-black leading-[15px] text-[#FFB77D]",
  title: "font-serif text-[31px] font-black leading-[39px] text-[#F2DFD3]",
  titleRule: "h-0.5 w-[52px] rounded-full bg-[#FFB77D]",
  heroImage: "h-[210px] w-full overflow-hidden rounded-lg border border-[#3E332B] bg-[#1E1E21]",
  lessonActions: "w-full max-w-[520px] self-center gap-2 pt-2",
  section: "gap-2",
  sectionTitle: "font-serif text-[25px] font-black leading-[32px] text-[#FFB77D]",
  paragraph: "flex-row flex-wrap",
  bodyText: "text-[16px] font-medium leading-[25px] text-[#DBC2B0]",
  quote: "my-2 border-l-[3px] border-[#FFB77D] pl-3",
  quoteText: "text-[17px] font-bold italic leading-[26px] text-[#F2DFD3]",
  panelLabel: "text-[11px] font-black uppercase leading-[15px] text-[#FFB77D]",
  primaryButton: "min-h-[50px] flex-row items-center justify-center gap-2 rounded-md bg-[#FFB77D]",
  primaryButtonText: "text-[14px] font-black leading-[19px] text-[#0C0C0E]",
  secondaryButton:
    "min-h-[50px] flex-row items-center justify-center gap-2 rounded-md border border-[#554336] bg-[#271E16]",
  secondaryButtonText: "text-[14px] font-black leading-[19px] text-[#DBC2B0]",
};

function stripMarkdown(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^\d+\.\s*/gm, "")
    .replace(/^[-*]\s*/gm, "")
    .trim();
}
