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

// ── CSS-enabled Link ───────────────────────────────────────

export const Link = (props: React.ComponentProps<typeof RouterLink> & { className?: string }) => {
  // @ts-expect-error: useCssElement return type is too complex for TS to represent
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

export const Text = (props: React.ComponentProps<typeof RNText> & { className?: string }) => {
  return useCssElement(RNText, props, { className: "style" });
};
Text.displayName = "CSS(Text)";

// ── ScrollView ─────────────────────────────────────────────

const ScrollViewWeb = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  },
) => {
  const { className, contentContainerClassName, style, contentContainerStyle, ...rest } = props;
  const resolvedStyle = className ? [style, { $$css: true, className }] : style;
  const resolvedContentContainerStyle = contentContainerClassName
    ? [contentContainerStyle, { $$css: true, className: contentContainerClassName }]
    : contentContainerStyle;
  return (
    <RNScrollView
      {...rest}
      style={resolvedStyle as any}
      contentContainerStyle={resolvedContentContainerStyle as any}
    />
  );
};

const ScrollViewNative = (
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

export const ScrollView =
  process.env.EXPO_OS === "web" ? ScrollViewWeb : ScrollViewNative;
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
