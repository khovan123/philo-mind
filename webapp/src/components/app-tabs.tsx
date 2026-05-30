import { Tabs } from "expo-router";
import { Platform, StyleSheet, type ColorValue } from "react-native";

import { TabIcon, type TabIconName } from "@/components/ui/TabIcon";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type TabBarIconProps = {
  color: ColorValue;
  focused: boolean;
  size: number;
};

function renderTabIcon(name: TabIconName) {
  function TabBarIcon({ color, focused }: TabBarIconProps) {
    return <TabIcon name={name} color={color} focused={focused} />;
  }

  TabBarIcon.displayName = `TabBarIcon.${name}`;

  return TabBarIcon;
}

const TAB_BAR_HEIGHT =
  Platform.select({
    ios: 86,
    android: 86,
    web: 82,
    default: 82,
  }) ?? 82;

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: theme.primaryLight,
        tabBarInactiveTintColor: theme.textMuted,

        tabBarLabelPosition: "below-icon",

        tabBarLabelStyle: {
          fontFamily: Fonts.body,
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "600",
          marginTop: 2,
        },

        tabBarItemStyle: {
          paddingTop: Spacing.two,
          paddingBottom: Spacing.two,
          borderRadius: Radius.md,
        },

        tabBarIconStyle: {
          marginTop: Spacing.half,
        },

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: "#111113",
            borderTopColor: theme.border,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Trang chủ",
          tabBarIcon: renderTabIcon("home"),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Khám phá",
          tabBarLabel: "Khám phá",
          tabBarIcon: renderTabIcon("explore"),
        }}
      />

      <Tabs.Screen
        name="story"
        options={{
          title: "Stories",
          tabBarLabel: "Câu chuyện",
          tabBarIcon: renderTabIcon("story"),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="debate"
        options={{
          title: "Lưu trữ",
          tabBarLabel: "Lưu trữ",
          tabBarIcon: renderTabIcon("debate"),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Hồ sơ",
          tabBarIcon: renderTabIcon("profile"),
        }}
      />

      <Tabs.Screen
        name="legal/terms"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="legal/privacy"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    paddingTop: Spacing.two,
    paddingBottom:
      Platform.select({
        ios: Spacing.three,
        android: Spacing.three,
        web: Spacing.three,
        default: Spacing.three,
      }) ?? Spacing.three,
    paddingHorizontal: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    shadowOpacity: 0,
  },
});
