import React from "react";
import { View } from "react-native";
import { MovieEngine } from "../movie/MovieEngine";
import { chapter1IntroScript } from "../movie/MovieIntroData";

type MovieStepProps = {
  chapterId?: string;
  onDone: () => void;
};

export function MovieStep({ chapterId, onDone }: MovieStepProps) {
  // Currently we only have intro for chapter 1.
  // If the chapter is not 1, we immediately trigger onDone so it skips this step.
  // If chapterId is undefined, we assume it's for testing and just play the script.
  const shouldSkip = chapterId && chapterId !== "1" && chapterId !== "chuong-1";
  
  React.useEffect(() => {
    if (shouldSkip) {
      onDone();
    }
  }, [shouldSkip, onDone]);

  if (shouldSkip) {
    return null;
  }

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <MovieEngine script={chapter1IntroScript} onEnd={onDone} />
    </View>
  );
}
