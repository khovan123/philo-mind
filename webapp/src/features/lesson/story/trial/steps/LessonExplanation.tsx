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
      <Text style={styles.lessonLabel}>Tổng hợp</Text>
      <Text style={styles.heroTitle}>Bài học rút ra</Text>
      <InfoCard
        icon={<CheckCircle2 color={Colors.primaryLight} size={18} />}
        title="Lựa chọn của bạn cho thấy"
        body={`Bạn đã chọn ${decision.title}. Điều này thể hiện giá trị về ${decision.principle.toLowerCase()}.`}
      />

      <MarkdownBlock lines={lessonMarkdown} />

      <View style={styles.conceptPanel}>
        <Text style={styles.cardTitle}>Khái niệm đã nắm vững</Text>
        <View style={styles.conceptRow}>
          {["Chính trực đạo đức", "Công lý", "Sự thật", "Bổn phận công dân"].map((concept) => (
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
          <Text style={styles.actionTitle}>Viết suy ngẫm</Text>
          <Text style={styles.actionMeta}>{reflectionDone ? "Đã mở" : "Mở nhật ký"}</Text>
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
                {active ? (choice === "Integrity" ? "Đúng" : "Thử lại") : "Chọn"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SecondaryButton label="Thử nhân vật khác" onPress={onRetry} />
      <PrimaryButton label="Hoàn thành bài học" onPress={onFinish} />
    </View>
  );
}
