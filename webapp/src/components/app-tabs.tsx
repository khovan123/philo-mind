import { Tabs } from "expo-router";
import { Platform, StyleSheet, type ColorValue } from "react-native";

import { TabIcon, type TabIconName } from "@/components/ui/TabIcon";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

function renderTabIcon(name: TabIconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean; size: number }) => (
    <TabIcon name={name} color={color} focused={focused} />
  );
}

const TAB_BAR_HEIGHT =
  Platform.select({
    ios: 78,
    android: 78,
    web: 72,
    default: 72,
  }) ?? 72;

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
          fontSize: 11,
          lineHeight: 14,
          fontWeight: "700",
          marginTop: 0,
        },

        tabBarItemStyle: {
          paddingTop: Spacing.one,
          paddingBottom: Spacing.one,
          borderRadius: Radius.lg,
        },

        tabBarIconStyle: {
          marginTop: Spacing.half,
        },

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: renderTabIcon("home"),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarLabel: "Explore",
          tabBarIcon: renderTabIcon("explore"),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarLabel: "Learn",
          tabBarIcon: renderTabIcon("learn"),
        }}
      />

      <Tabs.Screen
        name="debate"
        options={{
          title: "Debate",
          tabBarLabel: "Debate",
          tabBarIcon: renderTabIcon("debate"),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: renderTabIcon("profile"),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    paddingTop: Spacing.one,
    paddingBottom:
      Platform.select({
        ios: Spacing.two,
        android: Spacing.two,
        web: Spacing.two,
        default: Spacing.two,
      }) ?? Spacing.two,
    paddingHorizontal: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    shadowOpacity: 0,
  },
});
