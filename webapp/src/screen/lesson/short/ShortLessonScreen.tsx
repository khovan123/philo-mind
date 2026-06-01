import { useRouter } from "expo-router";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  RotateCcw,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import { ThemedText } from "@/components/themed-text";

import {
  lessonCards,
  lessonTitle,
  voteOptions,
  type ScreenState,
} from "@/features/lesson/short/data";
import { FinishedActions } from "@/features/lesson/short/FinishedActions";
import { LessonSwipeCard } from "@/features/lesson/short/LessonSwipeCard";
import { ShortLessonHeader } from "@/features/lesson/short/ShortLessonHeader";
import { StateScaffold } from "@/features/lesson/short/StateScaffold";
import { Colors, styles } from "@/features/lesson/short/ui";
import { VoteCard } from "@/features/lesson/short/VoteCard";
import { FinishedResult, VoteResult } from "@/features/lesson/short/VoteResult";

export default function ShortLessonScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [submittedVoteId, setSubmittedVoteId] = useState<string | null>(null);
  const [translateX] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));

  const hasCards = lessonCards.length > 0;
  const currentCard = lessonCards[cardIndex];
  const progress = hasCards ? (cardIndex + 1) / lessonCards.length : 0;
  const isVoteCard = currentCard?.type === "vote";
  const submittedOption = useMemo(
    () => voteOptions.find((option) => option.id === submittedVoteId) ?? null,
    [submittedVoteId],
  );
  const fallbackOption = submittedOption ?? voteOptions[2];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setScreenState(hasCards ? "ready" : "empty");
    }, 420);

    return () => clearTimeout(timeout);
  }, [hasCards]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderMove: Animated.event([null, { dx: translateX }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -60) {
            goNext();
            return;
          }

          if (gesture.dx > 60) {
            goPrevious();
            return;
          }

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardIndex, screenState, submittedVoteId, translateX],
  );

  function animateCardChange(nextIndex: number) {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0.4,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: nextIndex > cardIndex ? -24 : 24,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCardIndex(nextIndex);
      translateX.setValue(nextIndex > cardIndex ? 24 : -24);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function goNext() {
    if (screenState !== "ready") {
      return;
    }

    if (isVoteCard && submittedVoteId) {
      setScreenState("finished");
      return;
    }

    if (cardIndex < lessonCards.length - 1) {
      animateCardChange(cardIndex + 1);
    }
  }

  function goPrevious() {
    if (screenState !== "ready") {
      return;
    }

    if (cardIndex === 0) {
      router.back();
      return;
    }

    animateCardChange(cardIndex - 1);
  }

  function submitVote() {
    if (selectedVoteId) {
      setSubmittedVoteId(selectedVoteId);
    }
  }

  function retry() {
    setScreenState("loading");
    setTimeout(() => setScreenState(hasCards ? "ready" : "empty"), 320);
  }

  function restartLesson() {
    setCardIndex(0);
    setSelectedVoteId(null);
    setSubmittedVoteId(null);
    setScreenState("ready");
  }

  if (screenState === "loading") {
    return (
      <StateScaffold title={lessonTitle}>
        <ActivityIndicator color={Colors.primaryLight} size="large" />
        <ThemedText style={styles.stateTitle}>Loading short lesson</ThemedText>
        <ThemedText style={styles.stateText}>
          Preparing cards, vote options, and progress.
        </ThemedText>
      </StateScaffold>
    );
  }

  if (screenState === "empty") {
    return (
      <StateScaffold title={lessonTitle}>
        <BookOpen color={Colors.mutedText} size={34} />
        <ThemedText style={styles.stateTitle}>No short lesson available</ThemedText>
        <ThemedText style={styles.stateText}>This topic does not have review cards yet.</ThemedText>
        <Button title="Back to Explore" onPress={() => router.push("/explore")} />
      </StateScaffold>
    );
  }

  if (screenState === "error") {
    return (
      <StateScaffold title={lessonTitle}>
        <RefreshCcw color={Colors.danger} size={34} />
        <ThemedText style={styles.stateTitle}>Could not load lesson</ThemedText>
        <ThemedText style={styles.stateText}>Retry the request or return to Explore.</ThemedText>
        <Button title="Retry" onPress={retry} />
      </StateScaffold>
    );
  }

  if (screenState === "finished") {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.screen}>
          <ShortLessonHeader
            countLabel="4/4 (Done)"
            progress={1}
            title={lessonTitle}
            onBack={() => setScreenState("ready")}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <FinishedResult option={fallbackOption} />
            <FinishedActions />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <ShortLessonHeader
          countLabel={`${cardIndex + 1}/${lessonCards.length}`}
          progress={progress}
          title={lessonTitle}
          onBack={goPrevious}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.animatedCardWrap,
              {
                opacity: fade,
                transform: [{ translateX }],
              },
            ]}
          >
            {isVoteCard ? (
              <VoteCard
                selectedVoteId={selectedVoteId}
                submittedVoteId={submittedVoteId}
                onSelect={setSelectedVoteId}
              />
            ) : (
              <LessonSwipeCard card={currentCard} />
            )}
          </Animated.View>

          {submittedVoteId ? <VoteResult option={fallbackOption} /> : null}

          <View style={styles.navigationRow}>
            <Pressable
              accessibilityRole="button"
              onPress={goPrevious}
              style={({ pressed }) => [styles.outlineAction, pressed && styles.pressed]}
            >
              <ChevronLeft color={Colors.secondaryText} size={16} />
              <ThemedText style={styles.outlineActionText}>Previous</ThemedText>
            </Pressable>

            {isVoteCard ? (
              <Pressable
                accessibilityRole="button"
                disabled={!selectedVoteId || !!submittedVoteId}
                onPress={submitVote}
                style={({ pressed }) => [
                  styles.primaryAction,
                  (!selectedVoteId || !!submittedVoteId) && styles.disabledAction,
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.primaryActionText}>
                  {submittedVoteId ? "Vote Submitted" : "Submit Vote"}
                </ThemedText>
                <BarChart3 color={Colors.buttonText} size={16} />
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={goNext}
                style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
              >
                <ThemedText style={styles.primaryActionText}>Next</ThemedText>
                <ChevronRight color={Colors.buttonText} size={16} />
              </Pressable>
            )}
          </View>

          {submittedVoteId ? (
            <View style={styles.navigationRow}>
              <Pressable
                accessibilityRole="button"
                onPress={restartLesson}
                style={({ pressed }) => [styles.outlineAction, pressed && styles.pressed]}
              >
                <RotateCcw color={Colors.secondaryText} size={16} />
                <ThemedText style={styles.outlineActionText}>Review Again</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setScreenState("finished")}
                style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
              >
                <ThemedText style={styles.primaryActionText}>Next Actions</ThemedText>
                <ChevronRight color={Colors.buttonText} size={16} />
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
