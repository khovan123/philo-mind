import React from "react";
import Svg, { Path, Circle, Ellipse, G, Rect } from "react-native-svg";
import { CharacterId, CharacterConfig, Mood } from "./MovieTypes";

export const CHARACTERS: Record<string, CharacterConfig> = {
  narr: { name: "", role: "", skin: "", hair: "", hairS: "short", coat: "", glasses: false },
  you: { name: "Bạn", role: "Trợ lý nghiên cứu", skin: "#eebf95", hair: "#241f1c", hairS: "short", coat: "#2f4a40", glasses: false },
  lam: { name: "GS. Lâm", role: "Người hướng dẫn", skin: "#e7b78c", hair: "#c7c2b6", hairS: "swept", coat: "#34503f", glasses: true },
  an: { name: "Thủ thư An", role: "Thủ thư lưu trữ", skin: "#f0c6a2", hair: "#2c2723", hairS: "bun", coat: "#5a51c0", glasses: false },
  khoa: { name: "TS. Khoa", role: "Phản biện viên", skin: "#d7a079", hair: "#1d1b19", hairS: "short", coat: "#46382f", glasses: true },
  minh: { name: "SV. Minh", role: "Sinh viên", skin: "#f1c59f", hair: "#27221e", hairS: "short", coat: "#a8421f", glasses: false },
};

interface FaceProps {
  characterId: CharacterId;
  mood?: Mood;
  width?: number | string;
  height?: number | string;
}

export function Face({ characterId, mood = "neutral", width = "100%", height = "100%" }: FaceProps) {
  const c = CHARACTERS[characterId];
  if (!c || !c.skin) return null;

  let browL = "M62 96 q14 -6 28 0";
  let browR = "M130 96 q14 -6 28 0";
  let mouth = "M92 150 q28 14 56 0";

  if (mood === "happy") {
    mouth = "M88 146 q32 24 64 0";
  }
  if (mood === "concern") {
    browL = "M62 92 q14 8 28 2";
    browR = "M130 94 q14 -8 28 -2";
    mouth = "M96 154 q24 -8 48 0";
  }
  if (mood === "stern") {
    browL = "M62 98 q14 -2 28 4";
    browR = "M130 102 q14 -6 28 -4";
    mouth = "M96 152 h48";
  }

  return (
    <Svg viewBox="0 0 240 240" width={width} height={height}>
      {/* Coat */}
      <Path d="M30 240 q0 -64 90 -64 q90 0 90 64Z" fill={c.coat} />
      
      {/* Neck & Head */}
      <Path d="M96 168 h48 v24 q-24 14 -48 0Z" fill={c.skin} />
      <Ellipse cx="120" cy="118" rx="62" ry="68" fill={c.skin} />
      
      {/* Hair */}
      {c.hairS === "swept" && (
        <Path d="M44 96 q4 -64 76 -64 q72 0 76 64 q-20 -34 -76 -34 q-50 0 -76 34Z" fill={c.hair} />
      )}
      {c.hairS === "short" && (
        <Path d="M48 100 q2 -66 72 -66 q70 0 72 66 q-18 -40 -72 -40 q-54 0 -72 40Z" fill={c.hair} />
      )}
      {c.hairS === "bun" && (
        <React.Fragment>
          <Circle cx="120" cy="30" r="16" fill={c.hair} />
          <Path d="M50 102 q0 -64 70 -64 q70 0 70 64 q-16 -42 -70 -42 q-54 0 -70 42Z" fill={c.hair} />
        </React.Fragment>
      )}

      {/* Eyes */}
      <G fill="#2a211c">
        <Circle cx="83" cy="120" r="6" />
        <Circle cx="157" cy="120" r="6" />
      </G>

      {/* Eyebrows */}
      <G fill="none" stroke="#3a2f28" strokeWidth="5" strokeLinecap="round">
        <Path d={browL} />
        <Path d={browR} />
      </G>

      {/* Glasses */}
      {c.glasses && (
        <G fill="none" stroke="#2a2a2a" strokeWidth="3">
          <Circle cx="83" cy="118" r="18" />
          <Circle cx="157" cy="118" r="18" />
          <Path d="M101 116 h38" />
          <Path d="M65 116 l-12 4" />
          <Path d="M175 116 l12 4" />
        </G>
      )}

      {/* Mouth */}
      <Path d={mouth} fill="none" stroke="#9a4b3c" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}
