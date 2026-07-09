import { useLocalSearchParams } from "expo-router";
import QuizGameplayScreen from "../../../screen/quiz/QuizGameplayScreen";

export default function QuizRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  return <QuizGameplayScreen key={lessonId} />;
}
