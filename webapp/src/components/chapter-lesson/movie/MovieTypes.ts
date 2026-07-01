export type CharacterId = "narr" | "you" | "lam" | "an" | "khoa" | "minh";
export type Mood = "neutral" | "happy" | "concern" | "stern";

export interface CharacterConfig {
  name: string;
  role: string;
  skin: string;
  hair: string;
  hairS: "short" | "swept" | "bun";
  coat: string;
  glasses: boolean;
}

export type SceneId = "thukho" | "hoithao" | "buctham";

export interface VNOpt {
  text: string;
  correct?: boolean;
  dc?: number; // delta Thiện Cảm
  reply?: VNSayNode;
}

export interface VNSceneNode {
  t: "scene";
  bg: SceneId;
  act: number;
  name: string;
}

export interface VNSayNode {
  t: "say";
  who: CharacterId;
  mood?: Mood;
  text: string;
}

export interface VNChoiceNode {
  t: "choice";
  who: CharacterId;
  mood?: Mood;
  q: string;
  opts: VNOpt[];
}

export interface VNActNode {
  t: "act";
  n: string;
}

export interface VNEndNode {
  t: "end";
}

export type VNScriptNode = VNSceneNode | VNSayNode | VNChoiceNode | VNActNode | VNEndNode;
