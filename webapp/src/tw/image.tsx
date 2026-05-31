import { useCssElement } from "react-native-css";
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Image as RNImage } from "expo-image";

const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage) as React.ComponentType<
  React.ComponentProps<typeof RNImage>
>;

export type ImageProps = React.ComponentProps<typeof CSSImage> & {
  className?: string;
};

function CSSImage(props: React.ComponentProps<typeof AnimatedExpoImage>) {
  const { objectFit, objectPosition, ...style } =
    (StyleSheet.flatten(props.style) as {
      objectFit?: React.ComponentProps<typeof RNImage>["contentFit"];
      objectPosition?: React.ComponentProps<typeof RNImage>["contentPosition"];
    }) || {};

  return (
    <AnimatedExpoImage
      contentFit={objectFit}
      contentPosition={objectPosition}
      {...props}
      source={typeof props.source === "string" ? { uri: props.source } : props.source}
      style={style}
    />
  );
}

export const Image = (props: React.ComponentProps<typeof CSSImage> & { className?: string }) => {
  return useCssElement(CSSImage, props, { className: "style" });
};

Image.displayName = "CSS(Image)";
