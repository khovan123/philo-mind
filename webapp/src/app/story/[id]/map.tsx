import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, Info, Lock, MapPin } from "lucide-react-native";
import { useState, useMemo } from "react";
import { ActivityIndicator, ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import { mapCatalog, defaultMapData } from "@/features/story/mapData";

// Sequential step order for map nodes
const STEP_ORDER = [
  "intro",
  "encounter",
  "learn",
  "dilemma",
  "choose",
  "result",
  "knowledge",
  "minigame",
  "quiz",
  "reflect",
];

export default function ExplorationMapScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { data: story, isLoading, error } = useGetStoryDetailQuery(storyId);
  const { activeSession: _activeSession, currentStep } = useStoryStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string>("encounter");

  // Get map config
  const mapData = useMemo(() => {
    if (!story) return null;
    return mapCatalog[story.title] || defaultMapData(story.title);
  }, [story]);

  const nodesWithStatus = useMemo(() => {
    if (!mapData) return [];

    const currentStepIndex = STEP_ORDER.indexOf(currentStep);

    return mapData.nodes.map((node) => {
      const nodeIndex = STEP_ORDER.indexOf(node.id);
      let status: "completed" | "current" | "locked" = "locked";

      if (nodeIndex < 0) {
        // Not in the step order — default to locked
        status = "locked";
      } else if (nodeIndex < currentStepIndex) {
        status = "completed";
      } else if (nodeIndex === currentStepIndex) {
        status = "current";
      } else {
        status = "locked";
      }

      // Override: intro is always completed once you reach the map
      if (node.id === "intro") {
        status = "completed";
      }

      return { ...node, status };
    });
  }, [mapData, currentStep]);

  const selectedNode = useMemo(() => {
    return nodesWithStatus.find((n) => n.id === selectedNodeId) || nodesWithStatus[1];
  }, [nodesWithStatus, selectedNodeId]);

  const handleCTA = () => {
    if (!selectedNode) return;

    const routeMap: Record<string, string> = {
      intro: "cinematic",
      learn: "learn",
      encounter: "encounter",
      dilemma: "dilemma",
      choose: "choose",
      result: "consequence",
      knowledge: "knowledge",
      minigame: "minigame",
      quiz: "quiz",
      // The reflect screen was removed along with the backend reflection API;
      // route straight to the completion screen instead.
      reflect: "complete",
    };

    const route = routeMap[selectedNode.id];
    if (route) {
      router.push(`/story/${storyId}/${route}` as never);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
            Đang tải bản đồ khám phá...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !story || !mapData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ThemedText type="subtitle" style={{ color: theme.danger }}>
            Không thể tải bản đồ
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", marginVertical: Spacing.three }}
          >
            Đã có lỗi xảy ra khi tải bản đồ kịch bản này.
          </ThemedText>
          <Button
            title="Quay lại"
            onPress={() => router.replace("/(tabs)/story" as never)}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ImageBackground source={mapData.bgSource} resizeMode="cover" style={styles.backgroundImage}>
        {/* Dark overlay for readability */}
        <View style={styles.overlay} />

        {/* Content Wrapper */}
        <View style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace(`/story/${storyId}/role-intro` as never)}
              style={[styles.backButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            >
              <ArrowLeft color={theme.text} size={20} />
            </Pressable>
            <View style={styles.headerCopy}>
              <ThemedText type="smallBold" style={{ textShadowColor: "#000", textShadowRadius: 4 }}>
                Bản đồ khám phá
              </ThemedText>
              <ThemedText
                type="label"
                themeColor="textSecondary"
                style={{ textShadowColor: "#000", textShadowRadius: 4 }}
              >
                {story.title}
              </ThemedText>
            </View>
          </View>

          {/* Stakes description card */}
          <Card
            style={[
              styles.stakesCard,
              { backgroundColor: "rgba(12, 12, 14, 0.8)", borderColor: theme.border },
            ]}
          >
            <View style={styles.stakesHeader}>
              <Info size={16} color={theme.primary} />
              <ThemedText type="label" style={{ color: theme.primaryLight, fontWeight: "800" }}>
                RỦI RO / LỢI ÍCH CỐT LÕI (STAKES)
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.stakesText}>
              {mapData.stakes}
            </ThemedText>
          </Card>

          {/* Interactive Map Grid Area */}
          <View style={styles.mapGridContainer}>
            {/* SVG Connecting Dotted Paths */}
            <Svg style={StyleSheet.absoluteFill}>
              {nodesWithStatus.map((node, index) => {
                if (index === 0) return null;
                const prevNode = nodesWithStatus[index - 1];
                return (
                  <Line
                    key={index}
                    x1={`${prevNode.x}%`}
                    y1={`${prevNode.y}%`}
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke={
                      prevNode.status === "completed" && node.status !== "locked"
                        ? theme.primary
                        : "rgba(255,255,255,0.15)"
                    }
                    strokeWidth="2.5"
                    strokeDasharray="6,6"
                  />
                );
              })}
            </Svg>

            {/* Render Nodes as Interactive Points */}
            {nodesWithStatus.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isLocked = node.status === "locked";
              const isCompleted = node.status === "completed";
              const isCurrent = node.status === "current";

              // Color determination
              let nodeBgColor = "rgba(0,0,0,0.6)";
              let iconColor: string = theme.textMuted;
              if (isCompleted) {
                nodeBgColor = "rgba(16, 185, 129, 0.2)";
                iconColor = theme.success;
              } else if (isCurrent) {
                nodeBgColor = "rgba(217, 119, 6, 0.2)";
                iconColor = theme.primary;
              }

              return (
                <Pressable
                  key={node.id}
                  accessibilityRole="button"
                  onPress={() => setSelectedNodeId(node.id)}
                  style={[
                    styles.nodePoint,
                    {
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: [{ translateX: -20 }, { translateY: -20 }],
                      backgroundColor: nodeBgColor,
                      borderColor: isSelected
                        ? theme.primary
                        : isCurrent
                          ? theme.primaryLight
                          : isCompleted
                            ? theme.success
                            : "rgba(255,255,255,0.2)",
                      shadowOpacity: isSelected || isCurrent ? 0.3 : 0,
                      shadowColor: theme.primary,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Check color={iconColor} size={18} />
                  ) : isLocked ? (
                    <Lock color={iconColor} size={16} />
                  ) : (
                    <MapPin color={iconColor} size={18} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Location details card */}
          {selectedNode && (
            <Card
              style={[
                styles.detailsDrawer,
                { backgroundColor: "rgba(12, 12, 14, 0.9)", borderColor: theme.border },
              ]}
            >
              <View style={styles.drawerHeader}>
                <View>
                  <ThemedText type="smallBold">{selectedNode.name}</ThemedText>
                  <ThemedText type="label" themeColor="textSecondary">
                    Tiến trình: {selectedNode.stepName}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor:
                        selectedNode.status === "completed"
                          ? "rgba(16, 185, 129, 0.1)"
                          : selectedNode.status === "current"
                            ? "rgba(217, 119, 6, 0.1)"
                            : "rgba(255,255,255,0.05)",
                    },
                  ]}
                >
                  <ThemedText
                    type="label"
                    style={{
                      color:
                        selectedNode.status === "completed"
                          ? theme.success
                          : selectedNode.status === "current"
                            ? theme.primary
                            : theme.textMuted,
                      fontWeight: "700",
                    }}
                  >
                    {selectedNode.status === "completed"
                      ? "Hoàn thành"
                      : selectedNode.status === "current"
                        ? "Hiện tại"
                        : "Đang khóa"}
                  </ThemedText>
                </View>
              </View>

              <ThemedText type="small" themeColor="textSecondary" style={styles.drawerDesc}>
                {selectedNode.description}
              </ThemedText>

              <Button
                title={
                  selectedNode.status === "locked"
                    ? "Chưa mở khóa bước này"
                    : selectedNode.status === "completed"
                      ? "Xem lại bước này"
                      : `Vào ${selectedNode.stepName.toLowerCase()}`
                }
                onPress={handleCTA}
                disabled={selectedNode.status === "locked"}
                style={{ marginTop: Spacing.two }}
              />
            </Card>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  mainContainer: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  stakesCard: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.one,
  },
  stakesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.half,
  },
  stakesText: {
    lineHeight: 18,
  },
  mapGridContainer: {
    flex: 1,
    marginVertical: Spacing.four,
    position: "relative",
    minHeight: 280,
  },
  nodePoint: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  detailsDrawer: {
    padding: Spacing.four,
    borderWidth: 1,
    borderRadius: Radius.lg,
    gap: Spacing.two,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statusTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  drawerDesc: {
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
});
