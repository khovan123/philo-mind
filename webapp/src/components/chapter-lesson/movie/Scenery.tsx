import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { SceneId } from "./MovieTypes";

interface SceneryProps {
  sceneId: SceneId;
  width?: number | string;
  height?: number | string;
}

export function Scenery({ sceneId, width = "100%", height = "100%" }: SceneryProps) {
  if (sceneId === "hoithao") {
    return (
      <Svg viewBox="0 0 320 180" width={width} height={height} preserveAspectRatio="xMidYMid slice">
        <Rect width="320" height="180" fill="#2c2a29" />
        <Path d="M0 100 L320 100" stroke="#4a443b" strokeWidth="2" />
        <Rect x="40" y="40" width="80" height="60" fill="#3a342b" />
        <Rect x="50" y="50" width="60" height="40" fill="#c7c2b6" />
        <Rect x="200" y="40" width="80" height="60" fill="#3a342b" />
        <Rect x="210" y="50" width="60" height="40" fill="#c7c2b6" />
        <Path d="M40 180 L80 120 L240 120 L280 180" fill="#1d1b19" />
        <Rect x="60" y="110" width="200" height="10" fill="#5a4e40" />
      </Svg>
    );
  }

  if (sceneId === "thukho") {
    return (
      <Svg viewBox="0 0 320 180" width={width} height={height} preserveAspectRatio="xMidYMid slice">
        <Rect width="320" height="180" fill="#1a1817" />
        <Rect x="20" y="20" width="60" height="160" fill="#2a2520" />
        <Path d="M20 60 L80 60 M20 100 L80 100 M20 140 L80 140" stroke="#100e0c" strokeWidth="4" />
        <Rect x="240" y="20" width="60" height="160" fill="#2a2520" />
        <Path d="M240 60 L300 60 M240 100 L300 100 M240 140 L300 140" stroke="#100e0c" strokeWidth="4" />
        <Rect x="120" y="80" width="80" height="40" fill="#c7c2b6" />
        <Path d="M120 120 L160 180 L200 120" fill="#3a342b" />
      </Svg>
    );
  }

  // buctham
  return (
    <Svg viewBox="0 0 320 180" width={width} height={height} preserveAspectRatio="xMidYMid slice">
      <Rect width="320" height="180" fill="#8c2e2e" />
      <Path d="M0 140 Q160 100 320 140 L320 180 L0 180 Z" fill="#5c1a1a" />
      <Circle cx="160" cy="90" r="40" fill="#d4af37" />
      <Path d="M140 110 L160 50 L180 110 Z" fill="#b08d2c" />
    </Svg>
  );
}

// Minimal Circle component for buctham scene fallback since it wasn't imported from svg
import { Circle } from "react-native-svg";
