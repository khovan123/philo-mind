import React from "react";
import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";

import { VNOpt } from "./MovieTypes";

interface MovieChoicesProps {
  options: VNOpt[];
  onSelect: (index: number) => void;
}

export function MovieChoices({ options, onSelect }: MovieChoicesProps) {
  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 50, paddingHorizontal: 24, justifyContent: 'center' }} pointerEvents="box-none">
      {options.map((opt, i) => (
        <Pressable
          key={i}
          onPress={() => onSelect(i)}
          style={{ 
            marginBottom: 16,
            backgroundColor: 'rgba(0,0,0,0.9)', 
            borderColor: 'rgba(217, 119, 6, 0.5)', 
            borderWidth: 2, 
            borderRadius: 12, 
            padding: 16, 
            elevation: 5, 
            shadowColor: "#000", 
            shadowOpacity: 0.5, 
            shadowRadius: 10 
          }}
        >
          <ThemedText style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
            {opt.text}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
