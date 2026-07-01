import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown } from "react-native-reanimated";
import { Scenery } from "./Scenery";
import { Face } from "./Faces";
import { CharacterId, Mood, SceneId } from "./MovieTypes";

interface MovieStageProps {
  sceneBg: SceneId;
  characterId: CharacterId | null;
  mood?: Mood;
}

export function MovieStage({ sceneBg, characterId, mood }: MovieStageProps) {
  return (
    <View style={StyleSheet.absoluteFillObject} className="bg-black overflow-hidden">
      {/* Background Scenery */}
      <Animated.View
        key={sceneBg}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={StyleSheet.absoluteFillObject}
      >
        <Scenery sceneId={sceneBg} width="100%" height="100%" />
      </Animated.View>

      {/* Character Overlay */}
      {characterId && characterId !== "narr" && characterId !== "you" && (
        <View
          style={{ position: "absolute", bottom: 100, left: 0, right: 0, alignItems: "center" }}
        >
          <Animated.View
            key={characterId + (mood || "neutral")}
            entering={SlideInDown.duration(400).springify()}
            style={{ width: 288, height: 320, opacity: 0.95 }}
          >
            <Face characterId={characterId} mood={mood} width="100%" height="100%" />
          </Animated.View>
        </View>
      )}

      {/* Gradient Overlay to blend with the dialogue section below */}
      <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#171720] to-transparent pointer-events-none" />
    </View>
  );
}
