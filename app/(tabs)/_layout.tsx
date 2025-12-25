import { AnimatedTintIcon } from "@/components/AnimatedTintIcon";
import { darkModeColors, lightModeColors, prayerThemeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useAnimatedBackgroundColor } from "@/hooks/useAnimatedColor";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import Animated from "react-native-reanimated";

function TabBarBackground() {
  const { isDarkMode } = useThemeColors();
  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;
  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);

  return (
    <Animated.View
      style={[
        { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
        animatedBgStyle,
      ]}
    />
  );
}

export default function TabLayout() {
  const { colors, isDarkMode, setColors, debugPrayer, setCurrentPrayer } =
    useThemeColors();
  const { location } = useLocation();
  const { nextPrayer } = usePrayerTimes(location);

  // Update theme colors based on upcoming prayer (only if not in debug mode)
  useEffect(() => {
    if (!debugPrayer && nextPrayer?.prayer) {
      const prayerName = nextPrayer.prayer as keyof typeof prayerThemeColors;
      const themeColors = prayerThemeColors[prayerName];
      if (themeColors) {
        setColors({
          active: themeColors.active,
          inactive: themeColors.inactive,
        });
      }
      setCurrentPrayer(nextPrayer.prayer as any);
    }
  }, [nextPrayer, setColors, debugPrayer, setCurrentPrayer]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 6,
          paddingBottom: 12,
          backgroundColor: "transparent",
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AnimatedTintIcon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-home.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AnimatedTintIcon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-compass.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AnimatedTintIcon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-calendar.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings-tabs"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AnimatedTintIcon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-settings.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
