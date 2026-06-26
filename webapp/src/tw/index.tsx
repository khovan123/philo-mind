import { useCssElement, useNativeVariable as useFunctionalVariable } from "react-native-css";

import { Link as RouterLink } from "expo-router";
import React from "react";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

// ── CSS-enabled Link ───────────────────────────────────────

export const Link = (props: React.ComponentProps<typeof RouterLink> & { className?: string }) => {
  return useCssElement(RouterLink, props, { className: "style" });
};

// ── CSS Variable hook ──────────────────────────────────────

export const useCSSVariable =
  process.env.EXPO_OS !== "web" ? useFunctionalVariable : (variable: string) => `var(${variable})`;

// ── View ───────────────────────────────────────────────────

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export const View = (props: ViewProps) => {
  return useCssElement(RNView, props, { className: "style" });
};
View.displayName = "CSS(View)";

// ── Text ───────────────────────────────────────────────────

function normalizeTextChild(child: React.ReactNode): React.ReactNode {
  if (child === null || child === undefined || typeof child === "boolean") {
    return null;
  }

  if (typeof child === "string" || typeof child === "number") {
    return child;
  }

  if (Array.isArray(child)) {
    return child
      .map((item) => normalizeTextChild(item))
      .filter(Boolean)
      .join("");
  }

  if (React.isValidElement(child)) {
    return child;
  }

  return String(child);
}

export const Text = (props: React.ComponentProps<typeof RNText> & { className?: string }) => {
  return useCssElement(
    RNText,
    {
      ...props,
      children: normalizeTextChild(props.children),
    },
    { className: "style" },
  );
};
Text.displayName = "CSS(Text)";

// ── ScrollView ─────────────────────────────────────────────

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  },
) => {
  return useCssElement(
    RNScrollView as any,
    props as any,
    {
      className: "style",
      contentContainerClassName: "contentContainerStyle",
    } as any,
  ) as React.ReactElement;
};
ScrollView.displayName = "CSS(ScrollView)";

// ── Pressable ──────────────────────────────────────────────

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & { className?: string },
) => {
  return useCssElement(RNPressable, props, { className: "style" });
};
Pressable.displayName = "CSS(Pressable)";

// ── TextInput ──────────────────────────────────────────────

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & { className?: string },
) => {
  return useCssElement(RNTextInput, props, { className: "style" });
};
TextInput.displayName = "CSS(TextInput)";

export const SafeAreaView = (
  props: React.ComponentProps<typeof RNSafeAreaView> & { className?: string },
) => {
  return useCssElement(RNSafeAreaView, props, { className: "style" });
};
SafeAreaView.displayName = "CSS(SafeAreaView)";
