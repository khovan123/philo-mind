import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { characters, decisions, steps } from "./full_lesson/trial/data";
import { LessonTopBar } from "./full_lesson/trial/LessonTopBar";
import { CharacterSelection } from "./full_lesson/trial/steps/CharacterSelection";
import { ConsequenceResult } from "./full_lesson/trial/steps/ConsequenceResult";
import { DecisionSelection } from "./full_lesson/trial/steps/DecisionSelection";
import { LessonExplanation } from "./full_lesson/trial/steps/LessonExplanation";
import { RoleplaySituation } from "./full_lesson/trial/steps/RoleplaySituation";
import { ScenarioContext } from "./full_lesson/trial/steps/ScenarioContext";
import { styles } from "./full_lesson/trial/ui";

export default function TrialOfSocratesScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [characterId, setCharacterId] = useState<string>(characters[0].id);
  const [decisionId, setDecisionId] = useState<string>(decisions[0].id);
  const [reflectionDone, setReflectionDone] = useState(false);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  const character = useMemo(
    () => characters.find((item) => item.id === characterId) ?? characters[0],
    [characterId],
  );
  const decision = useMemo(
    () => decisions.find((item) => item.id === decisionId) ?? decisions[0],
    [decisionId],
  );

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) {
      router.back();
      return;
    }

    setStepIndex((current) => current - 1);
  }

  function retryDecision() {
    setStepIndex(3);
  }

  function finishLesson() {
    router.push("/explore");
  }

  function openReflectionJournal() {
    setReflectionDone(true);
    router.push("/story/trial-of-socrates/reflect" as never);
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <LessonTopBar stepIndex={stepIndex} onBack={goBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {stepIndex === 0 && <ScenarioContext onNext={goNext} />}
          {stepIndex === 1 && (
            <CharacterSelection
              characterId={characterId}
              onChange={setCharacterId}
              onNext={goNext}
            />
          )}
          {stepIndex === 2 && <RoleplaySituation character={character} onNext={goNext} />}
          {stepIndex === 3 && (
            <DecisionSelection decisionId={decisionId} onChange={setDecisionId} onNext={goNext} />
          )}
          {stepIndex === 4 && (
            <ConsequenceResult decision={decision} onRetry={retryDecision} onNext={goNext} />
          )}
          {stepIndex === 5 && (
            <LessonExplanation
              decision={decision}
              quizChoice={quizChoice}
              reflectionDone={reflectionDone}
              onQuiz={setQuizChoice}
              onReflection={openReflectionJournal}
              onRetry={retryDecision}
              onFinish={finishLesson}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
