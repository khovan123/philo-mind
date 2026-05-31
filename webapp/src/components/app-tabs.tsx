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
          tabBarLabel: "Trang chủ",
          tabBarIcon: renderTabIcon("home"),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",

          tabBarLabel: "Khám phá",
          tabBarIcon: renderTabIcon("explore"),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarLabel: "Học tập",
          tabBarIcon: renderTabIcon("learn"),
        }}
      />

      <Tabs.Screen
        name="debate"
        options={{
          title: "Debate",
          tabBarLabel: "Tranh luận",
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
