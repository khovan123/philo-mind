import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, ChevronLeft, ChevronRight, Lock } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import type { ViewStyle } from "react-native";
import Svg, { Line } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { TreeColors } from "@/constants/chapterLesson";
import { useChapterProgress } from "@/features/chapter/progress";
import {
  type ChapterMeta,
  type ChapterNodeSummary,
  useGetChapterNodesQuery,
  useGetChaptersQuery,
  useGetAllChapterProgressQuery,
} from "@/services/rtk-api/chapter.api";
import type { ChapterProgressItem } from "@/types/chapterLesson";
import { Pressable, SafeAreaView, ScrollView, View } from "@/tw";

const PAGE_SIZE = 6;

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function sectionLabel(muc: string) {
  if (muc.startsWith("II.")) return "PHẦN II";
  return "PHẦN I";
}

function hookLabel(type: ChapterNodeSummary["hookType"]) {
  return type === "drag" ? "Kéo thả" : "Tình huống";
}

function progressWidthStyle(done: number, total: number): ViewStyle {
  const percent = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;
  return { width: `${percent}%` as `${number}%` };
}

function actionLabel(done: boolean, hasDraft: boolean, absoluteIndex: number) {
  if (done) return "Xem lại";
  if (hasDraft) return "Tiếp tục";
  return absoluteIndex === 0 ? "Bắt đầu" : "Tiếp tục";
}

type ChapterOverviewItem = ChapterMeta & {
  completedCount: number;
  locked: boolean;
};

function countCompleted(progress: Record<string, { status?: string }> | undefined, order: string[]) {
  return order.filter((muc) => progress?.[muc]?.status === "done").length;
}

function getPageCount(totalItems: number) {
  return Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
}

function paginate<T>(items: T[], page: number) {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

export default function ChapterSkillTreeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<any>(null);
  const params = useLocalSearchParams<{ chapter?: string }>();
  const routeChapter = Array.isArray(params.chapter) ? params.chapter[0] : params.chapter;

  const {
    data: chapters,
    isLoading: isLoadingChapters,
    isError: isChaptersError,
  } = useGetChaptersQuery();

  const [selectedChapterState, setSelectedChapter] = useState<string | null>(routeChapter ?? null);
  const [nodePage, setNodePage] = useState(1);
  const { data: chapterProgressData, isLoading: isLoadingProgress } = useGetAllChapterProgressQuery();
  const chapterProgress = useMemo(() => chapterProgressData ?? {}, [chapterProgressData]);

  const storedChapterOverview = useMemo<ChapterOverviewItem[]>(
    () =>
      (chapters ?? []).reduce<{ items: ChapterOverviewItem[]; previousComplete: boolean }>(
        (acc, chapter, index) => {
          const completedCount = countCompleted(chapterProgress[chapter.id], chapter.order);
          const locked = index > 0 && !acc.previousComplete;

          return {
            previousComplete: completedCount >= chapter.nodeCount,
            items: [
              ...acc.items,
              {
                ...chapter,
                completedCount,
                locked,
              },
            ],
          };
        },
        { items: [], previousComplete: true },
      ).items,
    [chapterProgress, chapters],
  );

  const selectedOverview = storedChapterOverview.find(
    (chapter) => chapter.id === selectedChapterState,
  );

  const selectedChapter =
    selectedChapterState && selectedOverview && !selectedOverview.locked
      ? selectedChapterState
      : null;

  const { data, isLoading, isError, refetch } = useGetChapterNodesQuery(selectedChapter ?? "", {
    skip: !selectedChapter,
  });

  const order = data?.order ?? [];
  const { progress, completedCount } = useChapterProgress(selectedChapter ?? undefined, order);

  const currentChapter = chapters?.find((item) => item.id === selectedChapter);
  const progressPercent = order.length ? Math.round((completedCount / order.length) * 100) : 0;
  const progressStyle = progressWidthStyle(completedCount, order.length);
  const chapterNodes = data?.nodes ?? [];
  const nodePageCount = getPageCount(chapterNodes.length);
  const paginatedChapterNodes = useMemo(
    () => paginate(chapterNodes, nodePage),
    [chapterNodes, nodePage],
  );

  const visibleChapterProgress = useMemo(
    () =>
      selectedChapter
        ? {
            ...chapterProgress,
            [selectedChapter]: progress,
          }
        : chapterProgress,
    [chapterProgress, progress, selectedChapter],
  );

  const chapterOverview = useMemo<ChapterOverviewItem[]>(
    () =>
      (chapters ?? []).reduce<{ items: ChapterOverviewItem[]; previousComplete: boolean }>(
        (acc, chapter, index) => {
          const completedCount = countCompleted(visibleChapterProgress[chapter.id], chapter.order);
          const locked = index > 0 && !acc.previousComplete;

          return {
            previousComplete: completedCount >= chapter.nodeCount,
            items: [
              ...acc.items,
              {
                ...chapter,
                completedCount,
                locked,
              },
            ],
          };
        },
        { items: [], previousComplete: true },
      ).items,
    [chapters, visibleChapterProgress],
  );

  const sections = useMemo(() => {
    const grouped: { label: string; nodes: ChapterNodeSummary[] }[] = [];

    for (const node of paginatedChapterNodes) {
      const label = sectionLabel(node.muc);
      const last = grouped[grouped.length - 1];

      if (last?.label === label) {
        last.nodes.push(node);
      } else {
        grouped.push({ label, nodes: [node] });
      }
    }

    return grouped;
  }, [paginatedChapterNodes]);

  useEffect(() => {
    setNodePage(1);
  }, [selectedChapter]);

  useEffect(() => {
    setNodePage((page) => Math.min(page, nodePageCount));
  }, [nodePageCount]);

  function scrollToTop() {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
  }

  function changeNodePage(page: number) {
    setNodePage(page);
    scrollToTop();
  }

  if (isLoadingChapters || isLoadingProgress) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1"
        style={{ backgroundColor: TreeColors.background }}
      >
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <ActivityIndicator color={TreeColors.primaryLight} />
          <ThemedText
            className="text-center text-[13px] font-semibold leading-[18px]"
            style={{ color: TreeColors.muted }}
          >
            Đang tải chương học...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!isChaptersError && chapters?.length && !selectedChapter) {
    return (
      <ChapterOverview
        chapters={chapterOverview}
        onSelectChapter={(chapter) => setSelectedChapter(chapter)}
      />
    );
  }

  if (isChaptersError || !chapters?.length || !selectedChapter) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1"
        style={{ backgroundColor: TreeColors.background }}
      >
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <ThemedText
            className="text-center text-[18px] font-extrabold leading-6"
            style={{ color: TreeColors.text }}
          >
            Chưa có chương học
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: TreeColors.background }}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="w-full max-w-[820px] self-center gap-6 p-3 pb-[220px]"
      >
        <View
          className="rounded-md border p-3"
          style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
        >
          <Pressable
            className="mb-3 flex-row items-center gap-1 self-start"
            onPress={() => setSelectedChapter(null)}
          >
            <ChevronLeft color={TreeColors.primaryLight} size={16} />
            <ThemedText
              className="text-[12px] font-extrabold leading-4"
              style={{ color: TreeColors.primaryLight }}
            >
              Tất cả chương
            </ThemedText>
          </Pressable>

          <View className="flex-row items-start gap-3">
            <View
              className="mt-1.5 h-[12px] w-[12px] border"
              style={{ borderColor: TreeColors.primary }}
            />

            <View className="flex-1">
              <ThemedText
                className="font-sans text-[22px] font-extrabold leading-[28px]"
                style={{ color: TreeColors.text }}
              >
                {currentChapter?.title ?? "Chương học"}
              </ThemedText>

              <View className="mt-1 flex-row items-center justify-between">
                <ThemedText
                  className="text-[13px] font-bold leading-[18px]"
                  style={{ color: TreeColors.muted }}
                >
                  {completedCount}/{order.length} hoàn thành
                </ThemedText>
                <ThemedText
                  className="text-[13px] font-bold leading-[18px]"
                  style={{ color: TreeColors.muted }}
                >
                  {progressPercent}%
                </ThemedText>
              </View>

              <View
                className="mt-3 h-1 overflow-hidden rounded-full"
                style={{ backgroundColor: TreeColors.chip }}
              >
                <View
                  className="h-full rounded-full"
                  style={[{ backgroundColor: TreeColors.primary }, progressStyle]}
                />
              </View>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View
            className="items-center justify-center gap-3 rounded-md border p-6"
            style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
          >
            <ActivityIndicator color={TreeColors.primaryLight} />
            <ThemedText
              className="text-center text-[13px] font-semibold leading-[18px]"
              style={{ color: TreeColors.muted }}
            >
              Đang đọc nội dung từ CSV...
            </ThemedText>
          </View>
        ) : null}

        {isError ? (
          <Pressable
            className="items-center justify-center gap-2 rounded-md border p-6"
            style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
            onPress={() => refetch()}
          >
            <ThemedText
              className="text-center text-[15px] font-extrabold leading-5"
              style={{ color: TreeColors.text }}
            >
              Không tải được skill tree
            </ThemedText>
            <ThemedText
              className="text-center text-[13px] leading-[18px]"
              style={{ color: TreeColors.muted }}
            >
              Chạm để thử lại.
            </ThemedText>
          </Pressable>
        ) : null}

        {!isLoading && !isError ? (
          <ChapterNodeMap
            nodes={paginatedChapterNodes}
            order={order}
            progress={progress}
            onOpenNode={(node, done) =>
              router.push({
                pathname: "/chapter/[chapter]/[muc]" as never,
                params: {
                  chapter: selectedChapter,
                  muc: node.muc,
                  replay: done ? "1" : "0",
                },
              })
            }
          />
        ) : null}

        {!isLoading && !isError ? (
          <View className="gap-6">
            {sections.map((section) => (
              <View key={section.label} className="gap-2">
                <ThemedText
                  className="text-[12px] font-extrabold uppercase leading-4 tracking-[1px]"
                  style={{ color: TreeColors.muted }}
                >
                  {section.label}
                </ThemedText>

                <View className="gap-2">
                  {section.nodes.map((node) => {
                    const absoluteIndex = order.indexOf(node.muc);
                    const fallbackItem: ChapterProgressItem = {
                      status: absoluteIndex === 0 ? "available" : "locked",
                      score: null,
                    };
                    const item = progress[node.muc] ?? fallbackItem;
                    const done = item.status === "done";
                    const available = item.status === "available";
                    const locked = item.status === "locked";
                    const draftStep = item.draft?.step ?? 0;
                    const hasDraft = Boolean(item.draft);

                    return (
                      <Pressable
                        key={node.muc}
                        disabled={locked}
                        className={cn(
                          "min-h-[124px] rounded-md border p-3",
                          locked && "opacity-65",
                        )}
                        style={{
                          backgroundColor: available
                            ? TreeColors.surfaceActive
                            : TreeColors.surface,
                          borderColor: available ? TreeColors.primary : TreeColors.border,
                        }}
                        onPress={() =>
                          router.push({
                            pathname: "/chapter/[chapter]/[muc]" as never,
                            params: {
                              chapter: selectedChapter,
                              muc: node.muc,
                              replay: done ? "1" : "0",
                            },
                          })
                        }
                      >
                        <View className="flex-row items-start justify-between gap-2">
                          <View className="min-w-0 flex-1 flex-row gap-3">
                            <ThemedText
                              className="pt-0.5 text-[14px] font-bold leading-[19px]"
                              style={{
                                color: available
                                  ? TreeColors.primary
                                  : done
                                    ? TreeColors.text
                                    : TreeColors.muted,
                              }}
                            >
                              {node.muc}
                            </ThemedText>

                            <ThemedText
                              className="min-w-0 flex-1 text-[17px] font-extrabold leading-[22px]"
                              style={{
                                color: available || done ? TreeColors.text : TreeColors.muted,
                              }}
                            >
                              {node.title}
                            </ThemedText>
                          </View>

                          <View
                            className="mt-1 h-[14px] w-[14px] items-center justify-center border"
                            style={{
                              backgroundColor: done ? TreeColors.text : "transparent",
                              borderColor: done
                                ? TreeColors.text
                                : available
                                  ? TreeColors.primary
                                  : TreeColors.locked,
                            }}
                          >
                            {done ? <Check color={TreeColors.background} size={10} /> : null}
                            {locked ? <Lock color={TreeColors.locked} size={9} /> : null}
                          </View>
                        </View>

                        <View className="mt-4 flex-row flex-wrap gap-2">
                          {node.hasMovie && (
                            <StepPill
                              active={available && draftStep === -1}
                              label="Phim tương tác"
                            />
                          )}
                          <StepPill
                            active={available && draftStep === 0}
                            label={hookLabel(node.hookType)}
                          />
                          <StepPill active={available && draftStep === 1} label="Lý thuyết" />
                          <StepPill active={available && draftStep === 2} label="Luyện tập" />
                        </View>

                        {!locked ? (
                          <View className="mt-3 flex-row items-center gap-1 self-end">
                            <ThemedText
                              className="text-[12px] font-extrabold leading-4"
                              style={{ color: TreeColors.primaryLight }}
                            >
                              {actionLabel(done, hasDraft, absoluteIndex)}
                            </ThemedText>
                            <ChevronRight color={TreeColors.primaryLight} size={16} />
                          </View>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            <TreePaginationControls
              page={nodePage}
              totalItems={chapterNodes.length}
              onPageChange={changeNodePage}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const NODE_LAYOUT = [
  { x: 16, y: 58 },
  { x: 34, y: 31 },
  { x: 56, y: 42 },
  { x: 74, y: 65 },
  { x: 86, y: 30 },
  { x: 62, y: 78 },
  { x: 24, y: 78 },
  { x: 42, y: 66 },
];

function getNodePosition(index: number) {
  const row = Math.floor(index / NODE_LAYOUT.length);
  const base = NODE_LAYOUT[index % NODE_LAYOUT.length];

  return {
    x: base.x,
    y: Math.min(base.y + row * 8, 88),
  };
}

function ChapterNodeMap({
  nodes,
  order,
  progress,
  onOpenNode,
}: {
  nodes: ChapterNodeSummary[];
  order: string[];
  progress: Record<string, ChapterProgressItem>;
  onOpenNode: (node: ChapterNodeSummary, done: boolean) => void;
}) {
  const positions = nodes.map((_, index) => getNodePosition(index));

  return (
    <View
      className="relative h-[520px] overflow-hidden rounded-md border"
      style={{ backgroundColor: "#111116", borderColor: TreeColors.border }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {positions.slice(0, -1).map((point, index) => {
          const next = positions[index + 1];
          const targetNode = nodes[index + 1];
          const targetItem = progress[targetNode?.muc];
          const active = targetItem?.status === "available" || targetItem?.status === "done";

          return (
            <Line
              key={`${point.x}-${point.y}-${index}`}
              x1={point.x}
              y1={point.y}
              x2={next.x}
              y2={next.y}
              stroke={active ? TreeColors.primary : "#34343D"}
              strokeWidth={active ? 1.45 : 1.05}
              strokeLinecap="round"
              opacity={active ? 0.95 : 0.7}
            />
          );
        })}
      </Svg>

      {nodes.map((node, index) => {
        const position = positions[index];
        const absoluteIndex = order.indexOf(node.muc);
        const fallbackItem: ChapterProgressItem = {
          status: absoluteIndex === 0 ? "available" : "locked",
          score: null,
        };
        const item = progress[node.muc] ?? fallbackItem;
        const done = item.status === "done";
        const available = item.status === "available";
        const locked = item.status === "locked";
        const nodeColor = locked ? "#50505B" : TreeColors.primary;
        const nodeSize = available ? 58 : 44;

        return (
          <Pressable
            key={node.muc}
            disabled={locked}
            className="absolute items-center justify-center"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: 96,
              minHeight: 92,
              marginLeft: -48,
              marginTop: -46,
              opacity: locked ? 0.86 : 1,
            }}
            onPress={() => onOpenNode(node, done)}
          >
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: nodeSize,
                height: nodeSize,
                backgroundColor: nodeColor,
                shadowColor: nodeColor,
                shadowOpacity: locked ? 0 : 0.42,
                shadowRadius: available ? 24 : 15,
              }}
            >
              {done ? <Check color={TreeColors.background} size={22} /> : null}
              {locked ? <Lock color="#B8B8C2" size={18} /> : null}
            </View>

            <View
              className="mt-2 rounded-sm border px-3 py-1.5"
              style={{
                backgroundColor: "#15151B",
                borderColor: locked ? "#30303A" : TreeColors.primary,
              }}
            >
              <ThemedText
                className="text-center text-[13px] font-extrabold leading-4"
                style={{ color: locked ? TreeColors.locked : TreeColors.text }}
              >
                {node.muc}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function TreePaginationControls({
  page,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = getPageCount(totalItems);
  if (pageCount <= 1) return null;

  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, totalItems);
  const canGoBack = page > 1;
  const canGoNext = page < pageCount;

  return (
    <View
      className="flex-row items-center justify-between gap-3 rounded-md border p-2"
      style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
    >
      <Pressable
        accessibilityRole="button"
        disabled={!canGoBack}
        className={cn(
          "h-10 w-10 items-center justify-center rounded-sm border active:scale-[0.98]",
          !canGoBack && "opacity-40",
        )}
        style={{ borderColor: TreeColors.chip }}
        onPress={() => onPageChange(page - 1)}
      >
        <ChevronLeft color={TreeColors.primaryLight} size={18} />
      </Pressable>

      <View className="min-w-0 flex-1 items-center">
        <ThemedText
          className="text-[13px] font-extrabold leading-[18px]"
          style={{ color: TreeColors.text }}
        >
          Trang {page}/{pageCount}
        </ThemedText>
        <ThemedText
          className="text-[11px] font-bold leading-[15px]"
          style={{ color: TreeColors.muted }}
        >
          {startItem}-{endItem} trong {totalItems}
        </ThemedText>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!canGoNext}
        className={cn(
          "h-10 w-10 items-center justify-center rounded-sm border active:scale-[0.98]",
          !canGoNext && "opacity-40",
        )}
        style={{ borderColor: TreeColors.chip }}
        onPress={() => onPageChange(page + 1)}
      >
        <ChevronRight color={TreeColors.primaryLight} size={18} />
      </Pressable>
    </View>
  );
}

function ChapterOverview({
  chapters,
  onSelectChapter,
}: {
  chapters: ChapterOverviewItem[];
  onSelectChapter: (chapter: string) => void;
}) {
  const scrollViewRef = useRef<any>(null);
  const [page, setPage] = useState(1);
  const pageCount = getPageCount(chapters.length);
  const visibleChapters = useMemo(() => paginate(chapters, page), [chapters, page]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  function scrollToTop() {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    scrollToTop();
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: TreeColors.background }}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="w-full max-w-[820px] self-center gap-4 p-3 pb-[220px]"
      >
        <View
          className="rounded-md border p-3"
          style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
        >
          <ThemedText
            className="font-sans text-[22px] font-extrabold leading-[28px]"
            style={{ color: TreeColors.text }}
          >
            KINH TẾ CHÍNH TRỊ
          </ThemedText>
          <ThemedText
            className="mt-1 text-[13px] font-semibold leading-[18px]"
            style={{ color: TreeColors.muted }}
          >
            Chọn một chương để bắt đầu hành trình học.
          </ThemedText>
        </View>

        <ChapterOverviewMap chapters={visibleChapters} onSelectChapter={onSelectChapter} />

        <View className="gap-2">
          {visibleChapters.map((chapter) => {
            const progressPercent = chapter.nodeCount
              ? Math.round((chapter.completedCount / chapter.nodeCount) * 100)
              : 0;
            const complete = chapter.nodeCount > 0 && chapter.completedCount >= chapter.nodeCount;

            return (
              <Pressable
                key={chapter.id}
                disabled={chapter.locked}
                className={cn(
                  "min-h-[118px] rounded-md border p-3",
                  chapter.locked && "opacity-65",
                )}
                style={{
                  backgroundColor: chapter.locked ? TreeColors.surface : TreeColors.surfaceActive,
                  borderColor: chapter.locked ? TreeColors.border : TreeColors.primary,
                }}
                onPress={() => onSelectChapter(chapter.id)}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="min-w-0 flex-1">
                    <ThemedText
                      className="text-[12px] font-extrabold uppercase leading-4 tracking-[1px]"
                      style={{ color: chapter.locked ? TreeColors.locked : TreeColors.primary }}
                    >
                      Chương {chapter.id}
                    </ThemedText>

                    <ThemedText
                      className="mt-1 text-[18px] font-extrabold leading-[24px]"
                      style={{ color: chapter.locked ? TreeColors.muted : TreeColors.text }}
                    >
                      {chapter.title}
                    </ThemedText>
                  </View>

                  <View
                    className="mt-1 h-[22px] w-[22px] items-center justify-center border"
                    style={{
                      backgroundColor: complete ? TreeColors.text : "transparent",
                      borderColor: chapter.locked ? TreeColors.locked : TreeColors.primary,
                    }}
                  >
                    {chapter.locked ? <Lock color={TreeColors.locked} size={13} /> : null}
                    {!chapter.locked && complete ? (
                      <Check color={TreeColors.background} size={14} />
                    ) : null}
                  </View>
                </View>

                <View className="mt-4 flex-row items-center justify-between">
                  <ThemedText
                    className="text-[13px] font-bold leading-[18px]"
                    style={{ color: TreeColors.muted }}
                  >
                    {chapter.completedCount}/{chapter.nodeCount} hoàn thành
                  </ThemedText>
                  <ThemedText
                    className="text-[13px] font-bold leading-[18px]"
                    style={{ color: TreeColors.muted }}
                  >
                    {progressPercent}%
                  </ThemedText>
                </View>

                <View
                  className="mt-2 h-1 overflow-hidden rounded-full"
                  style={{ backgroundColor: TreeColors.chip }}
                >
                  <View
                    className="h-full rounded-full"
                    style={[
                      { backgroundColor: TreeColors.primary },
                      progressWidthStyle(chapter.completedCount, chapter.nodeCount),
                    ]}
                  />
                </View>

                {!chapter.locked ? (
                  <View className="mt-3 flex-row items-center gap-1 self-end">
                    <ThemedText
                      className="text-[12px] font-extrabold leading-4"
                      style={{ color: TreeColors.primaryLight }}
                    >
                      Mở chương
                    </ThemedText>
                    <ChevronRight color={TreeColors.primaryLight} size={16} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
          <TreePaginationControls
            page={page}
            totalItems={chapters.length}
            onPageChange={changePage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChapterOverviewMap({
  chapters,
  onSelectChapter,
}: {
  chapters: ChapterOverviewItem[];
  onSelectChapter: (chapter: string) => void;
}) {
  const positions = chapters.map((_, index) => getNodePosition(index));

  return (
    <View
      className="relative h-[520px] overflow-hidden rounded-md border"
      style={{ backgroundColor: "#111116", borderColor: TreeColors.border }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {positions.slice(0, -1).map((point, index) => {
          const next = positions[index + 1];
          const nextChapter = chapters[index + 1];
          const active = Boolean(nextChapter && !nextChapter.locked);

          return (
            <Line
              key={`${point.x}-${point.y}-${index}`}
              x1={point.x}
              y1={point.y}
              x2={next.x}
              y2={next.y}
              stroke={active ? TreeColors.primary : "#34343D"}
              strokeWidth={active ? 1.45 : 1.05}
              strokeLinecap="round"
              opacity={active ? 0.95 : 0.7}
            />
          );
        })}
      </Svg>

      {chapters.map((chapter, index) => {
        const position = positions[index];
        const complete = chapter.nodeCount > 0 && chapter.completedCount >= chapter.nodeCount;
        const progressPercent = chapter.nodeCount
          ? Math.round((chapter.completedCount / chapter.nodeCount) * 100)
          : 0;
        const nodeColor = chapter.locked ? "#50505B" : TreeColors.primary;
        const nodeSize = chapter.locked ? 48 : 62;

        return (
          <Pressable
            key={chapter.id}
            disabled={chapter.locked}
            className="absolute items-center justify-center"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: 118,
              minHeight: 112,
              marginLeft: -59,
              marginTop: -56,
              opacity: chapter.locked ? 0.86 : 1,
            }}
            onPress={() => onSelectChapter(chapter.id)}
          >
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: nodeSize,
                height: nodeSize,
                backgroundColor: nodeColor,
                shadowColor: nodeColor,
                shadowOpacity: chapter.locked ? 0 : 0.42,
                shadowRadius: complete ? 24 : 16,
              }}
            >
              {complete ? <Check color={TreeColors.background} size={23} /> : null}
              {chapter.locked ? <Lock color="#B8B8C2" size={18} /> : null}
              {!complete && !chapter.locked ? (
                <ThemedText
                  className="text-[18px] font-black leading-6"
                  style={{ color: TreeColors.background }}
                >
                  {chapter.id}
                </ThemedText>
              ) : null}
            </View>

            <View
              className="mt-2 rounded-sm border px-3 py-1.5"
              style={{
                backgroundColor: "#15151B",
                borderColor: chapter.locked ? "#30303A" : TreeColors.primary,
              }}
            >
              <ThemedText
                className="text-center text-[12px] font-extrabold leading-4"
                style={{ color: chapter.locked ? TreeColors.locked : TreeColors.text }}
              >
                C{chapter.id} - {progressPercent}%
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function StepPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View
      className="min-h-[30px] justify-center rounded-sm border px-3"
      style={{
        backgroundColor: active ? TreeColors.primary : "transparent",
        borderColor: active ? TreeColors.primary : TreeColors.chip,
      }}
    >
      <ThemedText
        className="text-[12px] font-bold leading-4"
        style={{ color: active ? TreeColors.primaryText : TreeColors.muted }}
      >
        {label}
      </ThemedText>
    </View>
  );
}
