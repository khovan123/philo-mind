import React from "react";
import { View, Text } from "react-native";
import { ThemedText } from "@/components/themed-text";

interface MovieHUDProps {
  actName?: string;
  thienCam?: number;
  uyTin?: number;
}

export function MovieHUD({ actName = "", thienCam = 0, uyTin = 0 }: MovieHUDProps) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        zIndex: 10,
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
        marginTop: 40, // safe area for notch
      }}
    >
      {/* HUD Trái - Tên hồi/cảnh */}
      {actName ? (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          <ThemedText style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
            {actName}
          </ThemedText>
        </View>
      ) : (
        <View />
      )}

      {/* HUD Phải - Thanh chỉ số */}
      <View style={{ flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ThemedText
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "600",
              width: 64,
              textShadowColor: "rgba(0,0,0,0.75)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Thiện cảm
          </ThemedText>
          <View
            style={{
              width: 96,
              height: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 9999,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: "#f43f5e",
                borderRadius: 9999,
                width: `${Math.max(0, Math.min(100, thienCam))}%`,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ThemedText
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "600",
              width: 64,
              textShadowColor: "rgba(0,0,0,0.75)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Uy tín
          </ThemedText>
          <View
            style={{
              width: 96,
              height: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 9999,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: "#fbbf24",
                borderRadius: 9999,
                width: `${Math.max(0, Math.min(100, uyTin))}%`,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
