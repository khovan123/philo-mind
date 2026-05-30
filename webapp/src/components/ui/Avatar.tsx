import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "../themed-text";

type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
};

export function Avatar({ uri, name = "User", size = 40 }: AvatarProps) {
  const theme = useTheme();
  const initial = getInitial(name);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{
          fontSize: size * 0.4,
          color: theme.text,
        }}
      >
        {initial}
      </ThemedText>
    </View>
  );
}

function getInitial(name: string) {
  const trimmed = name.trim();

  if (!trimmed) return "U";

  const words = trimmed.split(" ");

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const styles = StyleSheet.create({
  avatar: {
    resizeMode: "cover",
  },

  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
