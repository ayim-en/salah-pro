import {
  darkModeColors,
  lightModeColors,
  Prayer,
  Prayers,
  prayerThemeColors,
} from "@/constants/prayers";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface ThemesSettingsProps {
  themePrayer: Prayer | null;
  setThemePrayer: (prayer: Prayer | null) => void;
  colors: { active: string; inactive: string };
  isDarkMode: boolean;
}

export const ThemesSettings = ({
  themePrayer,
  setThemePrayer,
  colors,
  isDarkMode,
}: ThemesSettingsProps) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {/* Auto option */}
      <TouchableOpacity
        onPress={() => setThemePrayer(null)}
        className="rounded-xl px-4 py-3"
        style={{
          backgroundColor: !themePrayer
            ? colors.active
            : isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        }}
      >
        <Animated.Text
          className="font-semibold"
          style={{
            color: !themePrayer
              ? "#fff"
              : isDarkMode
              ? darkModeColors.textSecondary
              : lightModeColors.textSecondary,
          }}
        >
          Auto
        </Animated.Text>
      </TouchableOpacity>
      {/* Prayer theme options */}
      {Prayers.map((prayer) => {
        const isSelected = themePrayer === prayer;
        const themeColor = prayerThemeColors[prayer].active;
        return (
          <TouchableOpacity
            key={prayer}
            onPress={() => setThemePrayer(prayer)}
            className="rounded-xl px-4 py-3"
            style={{
              backgroundColor: isSelected
                ? themeColor
                : isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Animated.Text
              className="font-semibold"
              style={{
                color: isSelected
                  ? "#fff"
                  : themeColor,
              }}
            >
              {prayer}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
