import { Heart } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { bookmarkService } from "@/services/bookmark.service";
import type { BookmarkTarget } from "@/types/bookmark";

type BookmarkButtonProps = BookmarkTarget & {
  label?: string;
  disabled?: boolean;
  compact?: boolean;
};

export function BookmarkButton({
  targetType,
  targetId,
  label = "Lưu lại",
  disabled = false,
  compact = false,
}: BookmarkButtonProps) {
  const theme = useTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      setLoading(true);
      setMessage(null);

      try {
        const result = await bookmarkService.status({ targetType, targetId });
        if (!mounted) return;
        setBookmarked(result.bookmarked);
      } catch (err) {
        if (!mounted) return;
        setMessage(err instanceof Error ? err.message : "Không thể kiểm tra bookmark");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadStatus();

    return () => {
      mounted = false;
    };
  }, [targetId, targetType]);

  function animateHeart() {
    scale.setValue(0.82);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.22, friction: 4, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }

  async function toggle() {
    if (disabled || loading || submitting) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const result = await bookmarkService.toggle({ targetType, targetId });
      setBookmarked(result.bookmarked);
      setMessage(result.bookmarked ? "Đã thêm bookmark" : "Đã bỏ bookmark");
      animateHeart();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Không thể cập nhật bookmark");
    } finally {
      setSubmitting(false);
    }
  }

  const active = bookmarked && !message?.startsWith("Không");
  const heartColor = active ? "#FB7185" : theme.textMuted;
  const isDisabled = disabled || loading || submitting;

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected: bookmarked }}
        disabled={isDisabled}
        onPress={toggle}
        style={({ pressed }) => [
          styles.button,
          compact && styles.compact,
          { backgroundColor: theme.surface, borderColor: active ? "#FB7185" : theme.border },
          isDisabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        {loading || submitting ? (
          <ActivityIndicator color={theme.primaryLight} size="small" />
        ) : (
          <Animated.View style={{ transform: [{ scale }] }}>
            <Heart color={heartColor} fill={active ? heartColor : "transparent"} size={18} />
          </Animated.View>
        )}
        {!compact ? (
          <ThemedText type="smallBold" style={{ color: active ? "#FB7185" : theme.text }}>
            {active ? "Đã bookmark" : label}
          </ThemedText>
        ) : null}
      </Pressable>
      {message && !compact ? (
        <ThemedText type="label" themeColor={message.startsWith("Không") ? "danger" : "textMuted"}>
          {message}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.one,
  },
  button: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  compact: {
    width: 44,
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.82,
  },
});
