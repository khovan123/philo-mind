import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BookmarkButton } from "@/components/bookmark-button";
import { ThemedText } from "@/components/themed-text";
import { ProgressBadge } from "@/components/progress";

import { ConceptModal } from "@/features/lesson/full/ConceptModal";
import type { ConceptName } from "@/features/lesson/full/data";
import { fullLesson } from "@/features/lesson/full/data";
import { FullLessonContent } from "@/features/lesson/full/FullLessonContent";
import { Colors, styles } from "@/features/lesson/full/ui";

export default function FullLessonScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0.08);
  const [activeConcept, setActiveConcept] = useState<ConceptName | null>(null);
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

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              accessibilityLabel="Back"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <ArrowLeft color={Colors.primaryLight} size={22} />
            </Pressable>
            <ThemedText numberOfLines={1} style={styles.headerTitle}>
              {fullLesson.title}
            </ThemedText>
            <BookmarkButton targetType="LESSON" targetId="trial-socrates-full" compact />
          </View>

          <ProgressBadge
            compact
            detail="Reading progress"
            label="Lesson progress"
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
                <ThemedText style={styles.chipText}>{fullLesson.category}</ThemedText>
              </View>
              <View style={[styles.chip, styles.chipMuted]}>
                <ThemedText style={[styles.chipText, styles.chipTextMuted]}>
                  {fullLesson.duration}
                </ThemedText>
              </View>
              <View style={[styles.chip, styles.chipDanger]}>
                <ThemedText style={[styles.chipText, styles.chipTextDanger]}>
                  {fullLesson.difficulty}
                </ThemedText>
              </View>
              <View style={styles.chip}>
                <ThemedText style={styles.chipText}>
                  {completed ? "Completed" : fullLesson.status}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.title}>{fullLesson.title}</ThemedText>
            <View style={styles.titleRule} />
          </View>

          <Image
            source={fullLesson.image}
            contentFit="cover"
            transition={220}
            style={styles.heroImage}
          />

          <FullLessonContent onConceptPress={setActiveConcept} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.bottomInner}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/quiz/trial-socrates" as never)}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <ThemedText style={styles.primaryButtonText}>Continue Quiz</ThemedText>
              <ChevronRight color={Colors.buttonText} size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCompleted(true)}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <ThemedText style={styles.secondaryButtonText}>
                {completed ? "Marked as Completed" : "Mark as Completed"}
              </ThemedText>
              {completed ? <CheckCircle2 color={Colors.primaryLight} size={16} /> : null}
            </Pressable>
          </View>
        </View>

        <ConceptModal concept={activeConcept} onClose={() => setActiveConcept(null)} />
      </View>
    </SafeAreaView>
  );
}
