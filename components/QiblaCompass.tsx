import { AnimatedTintIcon } from "@/components/AnimatedTintIcon";
import { darkModeColors, lightModeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import {
  useAnimatedBackgroundColor,
  useAnimatedBorderColor,
  useAnimatedTextColor,
} from "@/hooks/useAnimatedColor";
import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

interface QiblaCompassProps {
  magnetometer: number;
  qiblaDirection: number;
}

export const QiblaCompass = ({
  magnetometer,
  qiblaDirection,
}: QiblaCompassProps) => {
  const { colors, isDarkMode } = useThemeColors();

  // Calculate Kaaba icon position based on qiblaDirection
  const radius = 140;
  const radians = (qiblaDirection * Math.PI) / 180;
  const translateX = Math.sin(radians) * radius;
  const translateY = -Math.cos(radians) * radius; // negative because Y increases downward

  // Colors based on dark mode
  const compassBgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.backgroundSecondary;
  const directionTextColor = isDarkMode
    ? darkModeColors.textTertiary
    : lightModeColors.textSecondary;

  // Animated styles
  const animatedBgStyle = useAnimatedBackgroundColor(compassBgColor);
  const animatedBorderStyle = useAnimatedBorderColor(colors.inactive);
  const animatedNorthTextStyle = useAnimatedTextColor(colors.active);
  const animatedDirectionTextStyle = useAnimatedTextColor(directionTextColor);

  return (
    <View className="w-96 h-96 items-center justify-center">
      <Animated.View
        className="w-full h-full rounded-full border-8 items-center justify-center"
        style={[
          { transform: [{ rotate: `${-magnetometer}deg` }] },
          animatedBorderStyle,
          animatedBgStyle,
        ]}
      >
        <View className="absolute top-2">
          <Animated.Text
            className="text-3xl font-bold"
            style={animatedNorthTextStyle}
          >
            N
          </Animated.Text>
        </View>

        <View className="absolute right-2">
          <Animated.Text
            className="text-3xl font-bold"
            style={animatedDirectionTextStyle}
          >
            E
          </Animated.Text>
        </View>
        <View className="absolute bottom-2">
          <Animated.Text
            className="text-3xl font-bold"
            style={animatedDirectionTextStyle}
          >
            S
          </Animated.Text>
        </View>
        <View className="absolute left-2">
          <Animated.Text
            className="text-3xl font-bold"
            style={animatedDirectionTextStyle}
          >
            W
          </Animated.Text>
        </View>

        <View
          className="absolute inset-0 items-center justify-center"
          style={{
            transform: [{ translateX }, { translateY }],
          }}
        >
          <AnimatedTintIcon
            source={require("../assets/images/prayer-pro-icons/qibla-tab/qibla-kaaba.png")}
            size={40}
            tintColor={colors.inactive}
          />
        </View>
      </Animated.View>

      <View className="absolute inset-0 items-center justify-center">
        <View style={{ transform: [{ rotate: "180deg" }] }}>
          <AnimatedTintIcon
            source={require("../assets/images/prayer-pro-icons/qibla-tab/qibla-arrow.png")}
            size={56}
            tintColor={colors.active}
          />
        </View>
      </View>
    </View>
  );
};
