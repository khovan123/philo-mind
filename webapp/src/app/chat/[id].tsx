/**
 * T-E07 + T-E08: Chat Conversation Screen with SSE streaming support
 * Closes #89, #90
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Loader2, Send, User } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useGetChatSessionQuery,
  useSendMessageMutation,
  type ChatMessage,
} from "@/services/rtk-api/chatApi";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { startStreaming, appendStreamingText, finishStreaming } from "@/stores/slices/chat.slice";

/** SSE streaming helper */
async function streamMessage(
  sessionId: string,
  message: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
) {
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/v1/ai/chat/sessions/${sessionId}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal,
    });

    if (!response.ok || !response.body) {
      onError("Không thể kết nối với AI");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch {
            if (data) onChunk(data);
          }
        }
      }
    }

    onDone();
  } catch (err) {
    if (signal?.aborted) return;
    onError(err instanceof Error ? err.message : "Lỗi kết nối");
  }
}

export default function ChatConversationScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const {
    data: session,
    isLoading,
    refetch,
  } = useGetChatSessionQuery(sessionId ?? "", {
    skip: !sessionId,
  });

  const [sendMessage] = useSendMessageMutation();
  const isStreaming = useAppSelector((s) => s.chat.isStreaming);
  const streamingText = useAppSelector(
    (s) => (sessionId ? s.chat.streamingText[sessionId] : undefined) ?? "",
  );

  const [inputText, setInputText] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Derive messages from API data + optimistic additions
  const localMessages = useMemo(() => {
    const apiMessages = session?.messages ?? [];
    if (optimisticMessages.length === 0) return apiMessages;
    // Once API has caught up (has non-temp messages), drop optimistic
    const lastApi = apiMessages[apiMessages.length - 1];
    if (lastApi && !lastApi.id.startsWith("temp-")) return apiMessages;
    return [...apiMessages, ...optimisticMessages];
  }, [session?.messages, optimisticMessages]);

  // Auto-scroll
  useEffect(() => {
    if (flatListRef.current && localMessages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [localMessages.length, streamingText]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !sessionId || isStreaming) return;

    const userMsg = inputText.trim();
    setInputText("");
    setError(null);

    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      sessionId,
      senderType: "USER",
      message: userMsg,
      createdAt: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, tempUserMsg]);

    dispatch(startStreaming(sessionId));

    const abortController = new AbortController();
    abortRef.current = abortController;

    streamMessage(
      sessionId,
      userMsg,
      (chunk) => dispatch(appendStreamingText({ sessionId, text: chunk })),
      () => {
        dispatch(finishStreaming(sessionId));
        setOptimisticMessages([]);
        refetch();
      },
      (errMsg) => {
        dispatch(finishStreaming(sessionId));
        setError(errMsg);
        sendMessage({ sessionId, message: userMsg })
          .unwrap()
          .then(() => {
            setOptimisticMessages([]);
            refetch();
          })
          .catch(() => {
            /* already errored */
          });
      },
      abortController.signal,
    );
  }, [inputText, sessionId, isStreaming, dispatch, refetch, sendMessage]);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Build display messages (real + streaming temp)
  const displayMessages = [...localMessages];
  if (isStreaming && streamingText) {
    displayMessages.push({
      id: "streaming-temp",
      sessionId: sessionId ?? "",
      senderType: "AI",
      message: streamingText,
      createdAt: new Date().toISOString(),
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
            Đang tải cuộc trò chuyện...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerInfo}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {session?.character?.name ?? "AI"}
          </ThemedText>
          <ThemedText type="label" themeColor="textSecondary" numberOfLines={1}>
            {session?.title ?? "Trò chuyện"}
          </ThemedText>
        </View>
        {isStreaming && (
          <View style={styles.streamingIndicator}>
            <Loader2 color={theme.primary} size={16} />
            <ThemedText type="label" style={{ color: theme.primary }}>
              Đang suy nghĩ...
            </ThemedText>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={displayMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <View style={[styles.emptyAvatar, { backgroundColor: theme.primary + "15" }]}>
                <User color={theme.primary} size={32} />
              </View>
              <ThemedText type="smallBold" style={{ marginTop: Spacing.three }}>
                {session?.character?.name ?? "AI Philosopher"}
              </ThemedText>
              <ThemedText type="label" themeColor="textSecondary" style={styles.centerText}>
                Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => {
            const isUser = item.senderType === "USER";
            const isStreamingMsg = item.id === "streaming-temp";
            return (
              <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAi]}>
                {!isUser && (
                  <View style={[styles.msgAvatar, { backgroundColor: theme.primary + "20" }]}>
                    <User color={theme.primary} size={14} />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isUser
                      ? [styles.bubbleUser, { backgroundColor: theme.primary }]
                      : [styles.bubbleAi, { backgroundColor: theme.surfaceElevated }],
                    isStreamingMsg && styles.bubbleStreaming,
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{ color: isUser ? "#0C0C0E" : theme.text, lineHeight: 20 }}
                  >
                    {item.message}
                    {isStreamingMsg && "▊"}
                  </ThemedText>
                </View>
              </View>
            );
          }}
        />

        {/* Error Banner */}
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: theme.danger + "15" }]}>
            <ThemedText type="label" style={{ color: theme.danger }}>
              {error}
            </ThemedText>
          </View>
        )}

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            { backgroundColor: theme.surface, borderTopColor: theme.border },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Gửi tin nhắn..."
            placeholderTextColor={theme.textMuted}
            style={[
              styles.textInput,
              { color: theme.text, backgroundColor: theme.backgroundElement },
            ]}
            multiline
            maxLength={2000}
            editable={!isStreaming}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || isStreaming}
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor:
                  inputText.trim() && !isStreaming ? theme.primary : theme.backgroundElement,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Send
              color={inputText.trim() && !isStreaming ? "#0C0C0E" : theme.textMuted}
              size={18}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1 },
  streamingIndicator: { flexDirection: "row", alignItems: "center", gap: 4 },
  loadingState: { flex: 1, alignItems: "center", justifyContent: "center" },
  messagesContent: { padding: Spacing.three, paddingBottom: Spacing.four, flexGrow: 1 },
  emptyChat: {
    flex: 1,
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  emptyAvatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: { textAlign: "center", marginTop: Spacing.one },
  bubbleRow: {
    flexDirection: "row",
    marginBottom: Spacing.two,
    alignItems: "flex-end",
    gap: Spacing.two,
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAi: { justifyContent: "flex-start" },
  msgAvatar: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: { maxWidth: "78%", padding: Spacing.three, borderRadius: Radius.lg },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAi: { borderBottomLeftRadius: 4 },
  bubbleStreaming: { opacity: 0.9 },
  errorBanner: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Spacing.two,
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
