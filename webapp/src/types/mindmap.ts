export type TopicDifficulty = "EASY" | "MEDIUM" | "HARD";

export type TopicSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: TopicDifficulty;
  createdAt?: string;
  _count?: {
    lessons?: number;
    shortLessons?: number;
    storyScenarios?: number;
  };
};

export type MindmapNode = {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  nodeType: string;
};

export type MindmapEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: string;
};

export type MindmapGraph = {
  topicId: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};

export type LayoutMindmapNode = MindmapNode & {
  x: number;
  y: number;
  radius: number;
  color: string;
};
