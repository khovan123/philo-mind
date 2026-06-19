import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen, LocateFixed, Minus, Plus, RefreshCw } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { BookmarkButton } from "@/components/bookmark-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useMindmapStore } from "@/stores/mindmap.store";
import type { LayoutMindmapNode, MindmapEdge, MindmapNode } from "@/types/mindmap";

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 620;
const MIN_SCALE = 0.65;
const MAX_SCALE = 2.4;

const nodeTypeColors: Record<string, string> = {
  chủ_đề_gốc: "#F59E0B",
  khái_niệm: "#38BDF8",
  phương_pháp: "#A78BFA",
  ví_dụ: "#34D399",
  hệ_quả: "#FB7185",
};

export default function MindmapScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const viewportWidth = Math.min(width - Spacing.three * 2, CANVAS_WIDTH);
  const viewportHeight = Math.min(520, Math.max(380, viewportWidth * 0.72));

  const {
    topics,
    selectedTopicId,
    graph,
    selectedNode,
    loadingTopics,
    loadingGraph,
    error,
    successMessage,
    loadTopics,
    selectTopic,
    selectNode,
    retry,
  } = useMindmapStore();

  const [scale, setScale] = useState(0.9);
  const [offset, setOffset] = useState({ x: -80, y: -40 });
  const [gesture, setGesture] = useState({
    offsetX: -80,
    offsetY: -40,
    distance: 0,
    scale: 0.9,
  });

  const { topicId: paramTopicId } = useLocalSearchParams<{ topicId?: string }>();

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  // Deep-link: preselect topic khi mở từ Learn (vd "Sơ đồ tư duy Chương 1").
  useEffect(() => {
    if (paramTopicId && topics.length > 0 && !selectedTopicId) {
      selectTopic(paramTopicId);
    }
  }, [paramTopicId, topics.length, selectedTopicId, selectTopic]);

  const layoutNodes = useMemo(
    () => computeForceLayout(graph?.nodes ?? [], graph?.edges ?? []),
    [graph?.edges, graph?.nodes],
  );
  const nodeById = useMemo(
    () => new Map(layoutNodes.map((node) => [node.id, node])),
    [layoutNodes],
  );
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);
  const isLoading = loadingTopics || loadingGraph;
  const hasGraph = Boolean(graph && graph.nodes.length > 0);
  const canInteract = hasGraph && !isLoading;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => canInteract,
        onStartShouldSetPanResponder: () => canInteract,
        onPanResponderGrant: (event) => {
          setGesture({
            offsetX: offset.x,
            offsetY: offset.y,
            distance: getTouchDistance(event.nativeEvent.touches),
            scale,
          });
        },
        onPanResponderMove: (event, state) => {
          if (event.nativeEvent.touches.length >= 2) {
            const nextDistance = getTouchDistance(event.nativeEvent.touches);
            if (gesture.distance > 0 && nextDistance > 0) {
              const nextScale = clamp(
                gesture.scale * (nextDistance / gesture.distance),
                MIN_SCALE,
                MAX_SCALE,
              );
              setScale(nextScale);
            }
            return;
          }

          setOffset({
            x: gesture.offsetX + state.dx,
            y: gesture.offsetY + state.dy,
          });
        },
      }),
    [canInteract, gesture, offset.x, offset.y, scale],
  );

  function resetView() {
    setScale(0.9);
    setOffset({ x: -80, y: -40 });
  }

  function zoomBy(delta: number) {
    setScale((current) => clamp(current + delta, MIN_SCALE, MAX_SCALE));
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={theme.text} size={20} />
          </Pressable>
          <View style={styles.topTitle}>
            <ThemedText type="smallBold">Bản đồ tư duy</ThemedText>
            <ThemedText type="label" themeColor="textMuted">
              phóng to • kéo thả
            </ThemedText>
          </View>
          <Pressable
            disabled={isLoading}
            onPress={retry}
            style={[styles.iconButton, isLoading && styles.disabled]}
          >
            <RefreshCw color={theme.text} size={18} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          scrollEnabled={!canInteract}
        >
          <View style={styles.hero}>
            <ThemedText style={styles.title}>Bản đồ khái niệm</ThemedText>
            <ThemedText style={styles.subtitle}>
              Chạm vào node để xem chi tiết, kéo để pan, dùng pinch hoặc nút điều khiển để zoom.
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicRail}
          >
            {loadingTopics ? (
              <TopicChip label="Đang tải chủ đề..." active disabled />
            ) : (
              topics.map((topic) => (
                <TopicChip
                  key={topic.id}
                  label={topic.title}
                  active={topic.id === selectedTopicId}
                  disabled={loadingGraph}
                  onPress={() => selectTopic(topic.id)}
                />
              ))
            )}
          </ScrollView>

          <View style={[styles.statusStrip, { borderColor: theme.border }]}>
            <View>
              <ThemedText type="smallBold">{selectedTopic?.title ?? "Chưa chọn chủ đề"}</ThemedText>
              <ThemedText type="label" themeColor={error ? "danger" : "textMuted"}>
                {error ?? successMessage ?? "Sẵn sàng hiển thị mindmap"}
              </ThemedText>
            </View>
            <View style={styles.statusActions}>
              {selectedTopicId ? (
                <BookmarkButton
                  compact
                  targetId={selectedTopicId}
                  targetType="TOPIC"
                  disabled={isLoading}
                />
              ) : null}
              <ThemedText type="code" themeColor="textMuted">
                {Math.round(scale * 100)}%
              </ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.canvasFrame,
              {
                width: viewportWidth,
                height: viewportHeight,
                borderColor: theme.border,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <Svg width="100%" height="100%" viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}>
              <Defs>
                <LinearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#111827" />
                  <Stop offset="1" stopColor="#171717" />
                </LinearGradient>
              </Defs>
              <Rect width={viewportWidth} height={viewportHeight} rx={16} fill="url(#mapBg)" />

              {hasGraph ? (
                <G transform={`translate(${offset.x} ${offset.y}) scale(${scale})`}>
                  {graph!.edges.map((edge) => {
                    const source = nodeById.get(edge.sourceNodeId);
                    const target = nodeById.get(edge.targetNodeId);
                    if (!source || !target) return null;

                    return (
                      <G key={edge.id}>
                        <Line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke="#52525B"
                          strokeWidth={2}
                          strokeOpacity={0.72}
                        />
                        <SvgText
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2 - 6}
                          fill="#A1A1AA"
                          fontSize={10}
                          textAnchor="middle"
                        >
                          {edge.relationType}
                        </SvgText>
                      </G>
                    );
                  })}

                  {layoutNodes.map((node) => (
                    <G key={node.id} onPress={() => selectNode(node)}>
                      <Circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill={node.color}
                        opacity={selectedNode?.id === node.id ? 1 : 0.92}
                        stroke={selectedNode?.id === node.id ? "#FFFFFF" : "#0C0C0E"}
                        strokeWidth={selectedNode?.id === node.id ? 4 : 2}
                      />
                      <SvgText
                        x={node.x}
                        y={node.y + 4}
                        fill="#0C0C0E"
                        fontSize={node.nodeType === "chủ_đề_gốc" ? 13 : 11}
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {compactLabel(node.title)}
                      </SvgText>
                    </G>
                  ))}
                </G>
              ) : null}
            </Svg>

            {isLoading ? (
              <View style={styles.overlay}>
                <ActivityIndicator color={theme.primaryLight} />
                <ThemedText type="smallBold" style={styles.overlayText}>
                  Đang dựng mindmap...
                </ThemedText>
              </View>
            ) : null}

            {!isLoading && error ? (
              <View style={styles.overlay}>
                <ThemedText type="smallBold" style={styles.overlayText}>
                  Không tải được mindmap
                </ThemedText>
                <Button title="Thử lại" size="sm" onPress={retry} />
              </View>
            ) : null}

            {!isLoading && !error && !hasGraph ? (
              <View style={styles.overlay}>
                <ThemedText type="smallBold" style={styles.overlayText}>
                  Chủ đề này chưa có node mindmap
                </ThemedText>
                <Button title="Tải lại" size="sm" variant="outline" onPress={retry} />
              </View>
            ) : null}
          </View>

          <View style={styles.controls}>
            <IconControl disabled={!canInteract} onPress={() => zoomBy(0.15)}>
              <Plus color={theme.text} size={18} />
            </IconControl>
            <IconControl disabled={!canInteract} onPress={() => zoomBy(-0.15)}>
              <Minus color={theme.text} size={18} />
            </IconControl>
            <IconControl disabled={!canInteract} onPress={resetView}>
              <LocateFixed color={theme.text} size={18} />
            </IconControl>
          </View>

          <Legend />

          <NodeDetail
            node={selectedNode}
            onOpenLearn={() => router.push("/(tabs)/learn" as never)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function TopicChip({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.topicChip,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: active ? theme.primary : theme.border,
        },
        disabled && styles.disabled,
      ]}
    >
      <ThemedText type="label" style={{ color: active ? theme.buttonText : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function IconControl({
  children,
  disabled,
  onPress,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.controlButton,
        { backgroundColor: theme.surface, borderColor: theme.border },
        disabled && styles.disabled,
      ]}
    >
      {children}
    </Pressable>
  );
}

function Legend() {
  const theme = useTheme();
  const entries = [
    ["chủ_đề_gốc", "Chủ đề gốc"],
    ["khái_niệm", "Khái niệm"],
    ["phương_pháp", "Phương pháp"],
    ["ví_dụ", "Ví dụ"],
  ] as const;

  return (
    <View style={[styles.legend, { borderColor: theme.border }]}>
      {entries.map(([type, label]) => (
        <View key={type} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: getNodeColor(type) }]} />
          <ThemedText type="label" themeColor="textMuted">
            {label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function NodeDetail({ node, onOpenLearn }: { node: MindmapNode | null; onOpenLearn: () => void }) {
  const theme = useTheme();

  if (!node) {
    return (
      <View style={[styles.detailPanel, { borderColor: theme.border }]}>
        <ThemedText type="smallBold">Chọn một node</ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          Tap vào bất kỳ node nào trên SVG để xem loại node, mô tả và CTA tiếp theo.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.detailPanel, { borderColor: getNodeColor(node.nodeType) }]}>
      <View style={styles.detailHeader}>
        <View style={[styles.detailIcon, { backgroundColor: getNodeColor(node.nodeType) }]}>
          <BookOpen color="#0C0C0E" size={18} />
        </View>
        <View style={styles.detailTitle}>
          <ThemedText type="smallBold">{node.title}</ThemedText>
          <ThemedText type="label" themeColor="textMuted">
            {node.nodeType}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {node.description ?? "Node này chưa có mô tả chi tiết."}
      </ThemedText>
      <Button title="Mở bài học liên quan" variant="outline" onPress={onOpenLearn} />
    </View>
  );
}

function computeForceLayout(nodes: MindmapNode[], edges: MindmapEdge[]): LayoutMindmapNode[] {
  if (nodes.length === 0) return [];

  const points = nodes.map((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2;
    const ring = node.nodeType === "chủ_đề_gốc" ? 0 : 220 + (index % 3) * 32;

    return {
      ...node,
      x: CANVAS_WIDTH / 2 + Math.cos(angle) * ring,
      y: CANVAS_HEIGHT / 2 + Math.sin(angle) * ring * 0.72,
      vx: 0,
      vy: 0,
      radius: node.nodeType === "chủ_đề_gốc" ? 58 : 44,
      color: getNodeColor(node.nodeType),
    };
  });

  const indexById = new Map(points.map((node, index) => [node.id, index]));

  for (let iteration = 0; iteration < 120; iteration++) {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dx = b.x - a.x || 1;
        const dy = b.y - a.y || 1;
        const distanceSq = dx * dx + dy * dy;
        const force = Math.min(3.2, 5200 / distanceSq);
        const distance = Math.sqrt(distanceSq);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    for (const edge of edges) {
      const source = points[indexById.get(edge.sourceNodeId) ?? -1];
      const target = points[indexById.get(edge.targetNodeId) ?? -1];
      if (!source || !target) continue;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const force = (distance - 170) * 0.012;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    for (const point of points) {
      point.vx += (CANVAS_WIDTH / 2 - point.x) * 0.004;
      point.vy += (CANVAS_HEIGHT / 2 - point.y) * 0.004;
      point.x = clamp(point.x + point.vx, 80, CANVAS_WIDTH - 80);
      point.y = clamp(point.y + point.vy, 80, CANVAS_HEIGHT - 80);
      point.vx *= 0.72;
      point.vy *= 0.72;
    }
  }

  return points.map(({ vx: _vx, vy: _vy, ...point }) => point);
}

function getNodeColor(nodeType: string) {
  return nodeTypeColors[nodeType] ?? "#FDE68A";
}

function compactLabel(label: string) {
  const words = label.split(/\s+/).filter(Boolean);
  if (words.length <= 3) return label;
  return `${words.slice(0, 3).join(" ")}...`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getTouchDistance(touches: readonly { pageX: number; pageY: number }[]) {
  if (touches.length < 2) return 0;
  const [a, b] = touches;
  const dx = b.pageX - a.pageX;
  const dy = b.pageY - a.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  topBar: {
    minHeight: 64,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topTitle: {
    alignItems: "center",
    gap: 2,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
    alignItems: "center",
  },
  hero: {
    width: "100%",
    maxWidth: CANVAS_WIDTH,
    gap: Spacing.one,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: "#A1A1AA",
  },
  topicRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  topicChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  statusStrip: {
    width: "100%",
    maxWidth: CANVAS_WIDTH,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
  statusActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  canvasFrame: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: Radius.lg,
    backgroundColor: "#111827",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(12, 12, 14, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    padding: Spacing.three,
  },
  overlayText: {
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    width: "100%",
    maxWidth: CANVAS_WIDTH,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  detailPanel: {
    width: "100%",
    maxWidth: CANVAS_WIDTH,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  detailHeader: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "center",
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    flex: 1,
    gap: 2,
  },
  disabled: {
    opacity: 0.55,
  },
});
