import { CheckCircle2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { LessonDecision } from "../data";
import { Colors, lessonMarkdown } from "../data";
import { InfoCard, MarkdownBlock, PrimaryButton, SecondaryButton, styles } from "../ui";

type LessonExplanationProps = {
  decision: LessonDecision;
  quizChoice: string | null;
  reflectionDone: boolean;
  onQuiz: (choice: string) => void;
  onReflection: () => void;
  onRetry: () => void;
  onFinish: () => void;
};

export function LessonExplanation({
  decision,
  quizChoice,
  reflectionDone,
  onQuiz,
  onReflection,
  onRetry,
  onFinish,
}: LessonExplanationProps) {
  return (
    <View style={styles.stack}>
      <Text style={styles.lessonLabel}>Synthesis</Text>
      <Text style={styles.heroTitle}>What This Teaches</Text>
      <InfoCard
        icon={<CheckCircle2 color={Colors.primaryLight} size={18} />}
        title="Your decision revealed"
        body={`You chose ${decision.title}. This revealed a value for ${decision.principle.toLowerCase()}.`}
      />

      <MarkdownBlock lines={lessonMarkdown} />

      <View style={styles.conceptPanel}>
        <Text style={styles.cardTitle}>Mastered concepts</Text>
        <View style={styles.conceptRow}>
          {["Moral Integrity", "Justice", "Truth", "Civic Duty"].map((concept) => (
            <View key={concept} style={styles.conceptChip}>
              <Text style={styles.conceptText}>{concept}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionGrid}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: reflectionDone }}
          onPress={onReflection}
          style={[styles.actionCard, reflectionDone && styles.actionCardActive]}
        >
          <Text style={styles.actionTitle}>Write reflection</Text>
          <Text style={styles.actionMeta}>{reflectionDone ? "Opened" : "Open journal"}</Text>
        </Pressable>

        {["Integrity", "Safety"].map((choice) => {
          const active = quizChoice === choice;

          return (
            <Pressable
              key={choice}
              accessibilityRole="button"
              onPress={() => onQuiz(choice)}
              style={[styles.actionCard, active && styles.actionCardActive]}
            >
              <Text style={styles.actionTitle}>Quiz: {choice}</Text>
              <Text style={styles.actionMeta}>
                {active ? (choice === "Integrity" ? "Correct" : "Try again") : "Choose"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SecondaryButton label="Try another character" onPress={onRetry} />
      <PrimaryButton label="Finish lesson" onPress={onFinish} />
    </View>
  );
}
