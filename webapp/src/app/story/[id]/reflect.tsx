import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  FileText,
  List,
  PenLine,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { storyService } from "@/services/story.service";
import { useReflectionStore } from "@/stores/reflection.store";
import { useStoryStore } from "@/stores/story.store";
import type { CriticalQuestion, ReflectionEntry } from "@/types/reflection";
import type { StorySummary } from "@/types/story";

const markdownActions = [
  { label: "H1", prefix: "# ", suffix: "" },
  { label: "B", prefix: "**", suffix: "**" },
  { label: "-", prefix: "- ", suffix: "" },
  { label: ">", prefix: "> ", suffix: "" },
] as const;

const trialStory: StorySummary = {
  id: "trial-of-socrates",
  title: "Trial of Socrates",
  description: "Reflect on truth, civic duty, and the cost of integrity.",
  difficulty: "MEDIUM",
  estimatedMinutes: 12,
  coverImageUrl: null,
  createdAt: new Date(0).toISOString(),
  topic: {
    id: "trial-of-socrates-topic",
    title: "Moral Integrity",
    category: "Ethics",
  },
  choices: [],
  stats: {
    totalPlayCount: 0,
    completedPlayCount: 0,
    completionRate: 0,
    choicesDistribution: [],
  },
};

export default function StoryReflectScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const {
    reflections,
    questions,
    selectedReflection,
    loading,
    questionsLoading,
    submitting,
    error,
    successMessage,
    loadReflections,
    loadQuestions,
    selectReflection,
    clearSelection,
    createReflection,
  } = useReflectionStore();

  const { activeSession, completingSession, completeActiveSession } = useStoryStore();

  const [story, setStory] = useState<StorySummary | null>(null);

  async function handleCompleteStory() {
    try {
      await completeActiveSession();
      router.replace("/(tabs)/story" as never);
    } catch {
      // Handled in store
    }
  }
  const [storyLoading, setStoryLoading] = useState(true);
  const [storyError, setStoryError] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const topicId = story?.id === trialStory.id ? undefined : story?.topic?.id;
  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId),
    [questions, selectedQuestionId],
  );
  const canSubmit = content.trim().length > 0 && !submitting && !storyLoading;

  useEffect(() => {
    let isMounted = true;

    async function loadStory() {
      if (!storyId) return;

      setStoryLoading(true);
      setStoryError(undefined);
      try {
        if (storyId === trialStory.id) {
          if (!isMounted) return;
          setStory(trialStory);
          await Promise.all([loadReflections({ limit: 20 }), loadQuestions()]);
          return;
        }

        const detail = await storyService.getStoryDetail(storyId);
        if (!isMounted) return;
        setStory(detail);
        await Promise.all([
          loadReflections({ topicId: detail.topic.id, limit: 20 }),
          loadQuestions(detail.topic.id),
        ]);
      } catch (err) {
        if (!isMounted) return;
        setStoryError(err instanceof Error ? err.message : "Could not load story context");
      } finally {
        if (isMounted) setStoryLoading(false);
      }
    }

    loadStory();
    return () => {
      isMounted = false;
    };
  }, [loadQuestions, loadReflections, storyId]);

  function insertMarkdown(prefix: string, suffix = "") {
    setContent((current) => {
      const base = current.length === 0 || current.endsWith("\n") ? current : `${current}\n`;
      return `${base}${prefix}${suffix}`;
    });
  }

  async function submitReflection() {
    if (!canSubmit) return;

    try {
      const reflection = await createReflection({
        content: content.trim(),
        topicId: topicId ?? null,
        questionId: selectedQuestionId,
      });

      setContent("");
      setSelectedQuestionId(null);
      await selectReflection(reflection.id);
    } catch {
      // Store state already exposes the API error to the screen.
    }
  }

  function retry() {
    if (!storyId) return;
    setStory(null);
    setStoryLoading(true);
    storyService
      .getStoryDetail(storyId)
      .then((detail) => {
        setStory(detail);
        return Promise.all([
          loadReflections({ topicId: detail.topic.id, limit: 20 }),
          loadQuestions(detail.topic.id),
        ]);
      })
      .catch((err) =>
        setStoryError(err instanceof Error ? err.message : "Could not load story context"),
      )
      .finally(() => setStoryLoading(false));
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <ArrowLeft color={theme.text} size={22} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText type="smallBold">Reflection Journal</ThemedText>
            <ThemedText type="label" themeColor="textSecondary" numberOfLines={1}>
              {story?.title ?? "Story reflection"}
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={clearSelection}
            style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          >
            <PenLine color={theme.primaryLight} size={20} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {storyLoading ? (
            <LoadingState />
          ) : storyError ? (
            <ErrorState message={storyError} onRetry={retry} />
          ) : (
            <>
              <View style={styles.hero}>
                <View style={[styles.heroIcon, { backgroundColor: theme.backgroundElement }]}>
                  <BookOpenText color={theme.primaryLight} size={24} />
                </View>
                <View style={styles.heroCopy}>
                  <ThemedText style={styles.title}>Reflect after the story</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Capture the reasoning behind your choice, then compare it with your earlier
                    journal entries.
                  </ThemedText>
                </View>
              </View>

              {error ? <InlineMessage tone="error" message={error} /> : null}
              {successMessage ? <InlineMessage tone="success" message={successMessage} /> : null}

              <View style={styles.grid}>
                <ReflectionList
                  reflections={reflections}
                  selectedId={selectedReflection?.id}
                  loading={loading}
                  onSelect={selectReflection}
                  onNew={clearSelection}
                />

                <ReflectionComposer
                  content={content}
                  questions={questions}
                  selectedQuestionId={selectedQuestionId}
                  selectedQuestion={selectedQuestion}
                  questionsLoading={questionsLoading}
                  submitting={submitting}
                  canSubmit={canSubmit}
                  onChangeContent={setContent}
                  onSelectQuestion={setSelectedQuestionId}
                  onInsertMarkdown={insertMarkdown}
                  onSubmit={submitReflection}
                />

                <ReflectionDetail reflection={selectedReflection} />
              </View>
            </>
          )}
        </ScrollView>
        {activeSession && (
          <View style={[styles.completeFooter, { borderTopColor: theme.border }]}>
            <Button
              title="Hoàn thành kịch bản"
              loading={completingSession}
              onPress={handleCompleteStory}
              style={{ flex: 1, backgroundColor: theme.primary }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LoadingState() {
  return (
    <Card style={styles.stateCard}>
      <ActivityIndicator />
      <ThemedText type="smallBold">Loading reflection space</ThemedText>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const theme = useTheme();

  return (
    <Card style={styles.stateCard}>
      <AlertCircle color={theme.danger} size={24} />
      <ThemedText type="smallBold">Reflection could not load</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
        {message}
      </ThemedText>
      <Button title="Retry" onPress={onRetry} variant="outline" />
    </Card>
  );
}

function InlineMessage({ tone, message }: { tone: "error" | "success"; message: string }) {
  const theme = useTheme();
  const color = tone === "error" ? theme.danger : theme.success;
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;

  return (
    <View style={[styles.inlineMessage, { borderColor: color }]}>
      <Icon color={color} size={18} />
      <ThemedText type="smallBold" style={{ color }}>
        {message}
      </ThemedText>
    </View>
  );
}

function ReflectionList({
  reflections,
  selectedId,
  loading,
  onSelect,
  onNew,
}: {
  reflections: ReflectionEntry[];
  selectedId?: string;
  loading: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const theme = useTheme();

  return (
    <Card style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.rowTitle}>
          <List color={theme.primaryLight} size={18} />
          <ThemedText type="smallBold">Entries</ThemedText>
        </View>
        <Button title="New" size="sm" variant="outline" onPress={onNew} />
      </View>

      {loading ? (
        <View style={styles.mutedState}>
          <ActivityIndicator />
        </View>
      ) : reflections.length === 0 ? (
        <View style={styles.mutedState}>
          <FileText color={theme.textMuted} size={22} />
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            No reflections yet.
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {reflections.map((reflection) => (
            <Pressable
              key={reflection.id}
              accessibilityRole="button"
              onPress={() => onSelect(reflection.id)}
              style={[
                styles.entryCard,
                {
                  borderColor: selectedId === reflection.id ? theme.primary : theme.border,
                  backgroundColor:
                    selectedId === reflection.id ? theme.backgroundSelected : theme.surfaceElevated,
                },
              ]}
            >
              <ThemedText type="smallBold" numberOfLines={2}>
                {firstMarkdownText(reflection.content)}
              </ThemedText>
              <ThemedText type="label" themeColor="textSecondary">
                {formatDate(reflection.createdAt)}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );
}

function ReflectionComposer({
  content,
  questions,
  selectedQuestionId,
  selectedQuestion,
  questionsLoading,
  submitting,
  canSubmit,
  onChangeContent,
  onSelectQuestion,
  onInsertMarkdown,
  onSubmit,
}: {
  content: string;
  questions: CriticalQuestion[];
  selectedQuestionId: string | null;
  selectedQuestion?: CriticalQuestion;
  questionsLoading: boolean;
  submitting: boolean;
  canSubmit: boolean;
  onChangeContent: (value: string) => void;
  onSelectQuestion: (id: string | null) => void;
  onInsertMarkdown: (prefix: string, suffix?: string) => void;
  onSubmit: () => void;
}) {
  const theme = useTheme();

  return (
    <Card style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.rowTitle}>
          <PenLine color={theme.primaryLight} size={18} />
          <ThemedText type="smallBold">New reflection</ThemedText>
        </View>
        <ThemedText type="label" themeColor="textSecondary">
          {content.trim().length}/10000
        </ThemedText>
      </View>

      <View style={styles.questionBlock}>
        <ThemedText type="label" themeColor="textSecondary">
          Guided critical question
        </ThemedText>
        {questionsLoading ? (
          <ActivityIndicator />
        ) : questions.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            No critical questions available.
          </ThemedText>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {questions.map((question) => {
              const selected = selectedQuestionId === question.id;
              return (
                <Pressable
                  key={question.id}
                  accessibilityRole="button"
                  onPress={() => onSelectQuestion(selected ? null : question.id)}
                  style={[
                    styles.questionChip,
                    {
                      borderColor: selected ? theme.primary : theme.border,
                      backgroundColor: selected ? theme.backgroundSelected : theme.surfaceElevated,
                    },
                  ]}
                >
                  <ThemedText type="label" numberOfLines={2}>
                    {question.question}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {selectedQuestion ? (
        <View style={[styles.promptBox, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Question</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {selectedQuestion.question}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.toolbar}>
        {markdownActions.map((action) => (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            onPress={() => onInsertMarkdown(action.prefix, action.suffix)}
            style={[styles.toolButton, { borderColor: theme.border }]}
          >
            <ThemedText type="smallBold">{action.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      <TextInput
        multiline
        value={content}
        onChangeText={onChangeContent}
        placeholder="Write your reflection in markdown..."
        placeholderTextColor={theme.textMuted}
        textAlignVertical="top"
        style={[
          styles.editor,
          {
            color: theme.text,
            backgroundColor: theme.surfaceElevated,
            borderColor: theme.border,
          },
        ]}
      />

      <MarkdownPreview content={content} />

      <Button
        title="Save reflection"
        onPress={onSubmit}
        disabled={!canSubmit}
        loading={submitting}
      />
    </Card>
  );
}

function ReflectionDetail({ reflection }: { reflection?: ReflectionEntry }) {
  const theme = useTheme();

  return (
    <Card style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.rowTitle}>
          <FileText color={theme.primaryLight} size={18} />
          <ThemedText type="smallBold">Detail</ThemedText>
        </View>
      </View>

      {!reflection ? (
        <View style={styles.mutedState}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            Select an entry to open its detail.
          </ThemedText>
        </View>
      ) : (
        <View style={styles.detailContent}>
          <ThemedText type="label" themeColor="textSecondary">
            {formatDate(reflection.createdAt)}
          </ThemedText>
          {reflection.question ? (
            <View style={[styles.promptBox, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="smallBold">Guided by</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {reflection.question.question}
              </ThemedText>
            </View>
          ) : null}
          <MarkdownPreview content={reflection.content} />
        </View>
      )}
    </Card>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  const theme = useTheme();
  const lines = content.trim().length > 0 ? content.trim().split("\n") : ["Preview appears here."];

  return (
    <View style={[styles.preview, { borderColor: theme.border }]}>
      {lines.map((line, index) => {
        const text = line
          .replace(/^#+\s*/, "")
          .replace(/^[->]\s*/, "")
          .replace(/\*\*/g, "");
        const isHeading = line.startsWith("#");
        const isList = line.startsWith("- ");
        const isQuote = line.startsWith("> ");

        return (
          <ThemedText
            key={`${line}-${index}`}
            type={isHeading ? "smallBold" : "small"}
            themeColor={content.trim().length > 0 ? undefined : "textMuted"}
            style={[isQuote && styles.quoteText, isList && styles.listText]}
          >
            {isList ? `• ${text}` : text}
          </ThemedText>
        );
      })}
    </View>
  );
}

function firstMarkdownText(content: string) {
  return content
    .split("\n")
    .find((line) => line.trim().length > 0)
    ?.replace(/^#+\s*/, "")
    .replace(/^[->]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  hero: {
    flexDirection: "row",
    gap: Spacing.three,
    alignItems: "flex-start",
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  grid: {
    gap: Spacing.three,
  },
  panel: {
    gap: Spacing.three,
    borderRadius: Radius.md,
  },
  panelHeader: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 1,
  },
  list: {
    gap: Spacing.two,
  },
  entryCard: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  questionBlock: {
    gap: Spacing.two,
  },
  chips: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  questionChip: {
    width: 220,
    minHeight: 68,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.two,
    justifyContent: "center",
  },
  promptBox: {
    borderRadius: Radius.sm,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  toolbar: {
    flexDirection: "row",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  toolButton: {
    width: 44,
    height: 36,
    borderWidth: 1,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  editor: {
    minHeight: 180,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  preview: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  quoteText: {
    fontStyle: "italic",
  },
  listText: {
    paddingLeft: Spacing.two,
  },
  detailContent: {
    gap: Spacing.three,
  },
  mutedState: {
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  stateCard: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  inlineMessage: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  centerText: {
    textAlign: "center",
  },
  completeFooter: {
    borderTopWidth: 1,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
  },
});
