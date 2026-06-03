import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BookmarkButton } from "@/components/bookmark-button";
import { ThemedText } from "@/components/themed-text";
import { ProgressBadge } from "@/components/progress";

import { Colors, styles } from "@/features/lesson/full/ui";
import { useGetLessonByIdQuery } from "@/services/rtk-api/lesson.api";

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
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={[styles.screen, { alignItems: "center", justifyContent: "center", gap: 12 }]}>
          <ActivityIndicator color={Colors.primaryLight} size="large" />
          <ThemedText style={styles.bodyText}>Đang tải bài học đầy đủ từ cơ sở dữ liệu...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !lesson) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={[styles.screen, { alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }]}>
          <ThemedText style={styles.sectionTitle}>Không tải được bài học</ThemedText>
          <ThemedText style={[styles.bodyText, { textAlign: "center" }]}>
            Bài học này chưa có trong cơ sở dữ liệu hoặc API đang lỗi.
          </ThemedText>
          <Pressable onPress={() => refetch()} style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>Thử lại</ThemedText>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>Quay lại</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              accessibilityLabel="Quay lại"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <ArrowLeft color={Colors.primaryLight} size={22} />
            </Pressable>
            <ThemedText numberOfLines={1} style={styles.headerTitle}>
              {lesson.title}
            </ThemedText>
            <BookmarkButton targetType="LESSON" targetId={lesson.id} compact />
          </View>

          <ProgressBadge
            compact
            detail="Tiến độ đọc"
            label="Tiến độ bài học"
            value={progressLabel}
            style={styles.readingProgress}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.metaWrap}>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <ThemedText style={styles.chipText}>
                  {lesson.topic.category ?? lesson.topic.title}
                </ThemedText>
              </View>
              <View style={[styles.chip, styles.chipMuted]}>
                <ThemedText style={[styles.chipText, styles.chipTextMuted]}>
                  {lesson.estimatedMinutes ?? 8} phút
                </ThemedText>
              </View>
              <View style={[styles.chip, styles.chipDanger]}>
                <ThemedText style={[styles.chipText, styles.chipTextDanger]}>
                  Bài học đầy đủ
                </ThemedText>
              </View>
              <View style={styles.chip}>
                <ThemedText style={styles.chipText}>
                  {completed ? "Đã hoàn thành" : translateStatus(lesson.status)}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.title}>{lesson.title}</ThemedText>
            <View style={styles.titleRule} />
          </View>

          <Image
            source={lessonImage}
            contentFit="cover"
            transition={220}
            style={styles.heroImage}
          />

          <DbLessonContent
            conflict={lesson.conflict}
            content={lesson.content}
            questions={lesson.questions}
            realLifeExample={lesson.realLifeExample}
          />

          <View style={styles.lessonActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/quiz/${lesson.id}` as never)}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <ThemedText style={styles.primaryButtonText}>Làm bài kiểm tra</ThemedText>
              <ChevronRight color={Colors.buttonText} size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCompleted(true)}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <ThemedText style={styles.secondaryButtonText}>
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

function DbLessonContent({
  content,
  conflict,
  questions,
  realLifeExample,
}: DbLessonContentProps) {
  return (
    <>
      <MarkdownSection title="Nội dung chính" markdown={content} />
      {realLifeExample ? <MarkdownSection title="Ví dụ thực tế" markdown={realLifeExample} /> : null}
      {conflict ? <MarkdownSection title="Câu hỏi tranh luận" markdown={conflict} /> : null}
      {questions.length > 0 ? (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Câu hỏi ôn tập</ThemedText>
          {questions.map((question, index) => (
            <View key={question.id} style={styles.quote}>
              <ThemedText style={styles.quoteText}>
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
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return (
            <ThemedText key={`${title}-${index}`} style={styles.panelLabel}>
              {stripMarkdown(block.replace(/^###\s*/, ""))}
            </ThemedText>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <ThemedText key={`${title}-${index}`} style={styles.sectionTitle}>
              {stripMarkdown(block.replace(/^##\s*/, ""))}
            </ThemedText>
          );
        }

        return (
          <View key={`${title}-${index}`} style={styles.paragraph}>
            <ThemedText style={styles.bodyText}>{stripMarkdown(block)}</ThemedText>
          </View>
        );
      })}
    </View>
  );
}

function stripMarkdown(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^\d+\.\s*/gm, "")
    .replace(/^[-*]\s*/gm, "")
    .trim();
}
