import { DebugPrayerPicker } from "@/components/DebugPrayerPicker";
import { darkModeColors, lightModeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useAnimatedBackgroundColor } from "@/hooks/useAnimatedColor";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export default function SettingsHome() {
  const router = useRouter();
  const { isDarkMode } = useThemeColors();
  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;
  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);

  return (
    <Animated.View className="flex-1 items-center p-6" style={animatedBgStyle}>
      <DebugPrayerPicker />
      <View className="flex-1 justify-center max-w-[960px] mx-auto">
        <Text
          className="text-6xl font-bold"
          style={{
            color: isDarkMode ? darkModeColors.text : lightModeColors.text,
          }}
        >
          Settings
        </Text>
      </View>
      <Button
        title="Notifications Settings"
        onPress={() => router.navigate("/settings-tabs/settings-notifications")}
      />
      <Button
        title="Prayer Times Settings"
        onPress={() => router.navigate("/settings-tabs/settings-prayer-times")}
      />
      <Button
        title="Carousel Settings"
        onPress={() => router.navigate("/settings-tabs/settings-carousel")}
      />
      <Button
        title="Calendar Settings"
        onPress={() => router.navigate("/settings-tabs/settings-calendar")}
      />
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={[{ height: 10 }, animatedBgStyle]}
      />
    </Animated.View>
  );
}
