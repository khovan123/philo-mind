import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { CharacterId } from "./MovieTypes";
import { CHARACTERS } from "./Faces";

interface MovieDialogueProps {
  who: CharacterId;
  text: string;
  onNext: () => void;
}

export interface MovieDialogueRef {
  advanceOrSkip: () => void;
}

export const MovieDialogue = forwardRef<MovieDialogueRef, MovieDialogueProps>(
  ({ who, text, onNext }, ref) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
      setDisplayedText("");
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 20); // 20ms per char

      return () => clearInterval(interval);
    }, [text]);

    const handlePress = () => {
      if (isTyping) {
        // Skip typing
        setDisplayedText(text);
        setIsTyping(false);
      } else {
        // Go to next
        onNext();
      }
    };

    useImperativeHandle(ref, () => ({
      advanceOrSkip: handlePress,
    }));

    const characterName = CHARACTERS[who]?.name || "";
    const role = CHARACTERS[who]?.role || "";

    return (
      <Pressable
        onPress={handlePress}
        style={{ flex: 1, width: "100%", padding: 24, paddingTop: 20 }}
      >
        {/* Nameplate */}
        {characterName ? (
          <View className="flex-row items-center gap-2 mb-3">
            <View className="px-3 py-1 bg-[#2B1B14] rounded-lg border border-[#FF8517]">
              <ThemedText className="text-[#FF8517] font-bold text-[13px] tracking-widest">
                {characterName.toUpperCase()}
              </ThemedText>
            </View>
            {role ? (
              <ThemedText className="text-[#A3A3AF] text-[13px] italic">{role}</ThemedText>
            ) : null}
          </View>
        ) : null}

        {/* Dialogue Text */}
        <ThemedText className="text-white text-[17px] leading-7 flex-1">{displayedText}</ThemedText>

        {/* Click indicator */}
        {!isTyping && (
          <View className="absolute bottom-5 right-5">
            <ThemedText className="text-[#FF8517] text-lg font-bold animate-pulse">▼</ThemedText>
          </View>
        )}
      </Pressable>
    );
  },
);

MovieDialogue.displayName = "MovieDialogue";
