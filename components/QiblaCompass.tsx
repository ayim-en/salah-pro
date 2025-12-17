import { useThemeColors } from "@/context/ThemeContext";
import React from "react";
import { Image, Text, View } from "react-native";

interface QiblaCompassProps {
  magnetometer: number;
  qiblaDirection: number;
}

export const QiblaCompass = ({
  magnetometer,
  qiblaDirection,
}: QiblaCompassProps) => {
  const { colors } = useThemeColors();

  // Calculate Kaaba icon position based on qiblaDirection
  const radius = 140;
  const radians = (qiblaDirection * Math.PI) / 180;
  const translateX = Math.sin(radians) * radius;
  const translateY = -Math.cos(radians) * radius; // negative because Y increases downward

  return (
    <View className="w-96 h-96 items-center justify-center">
      <View
        className="w-full h-full rounded-full border-8 items-center justify-center bg-gray-50"
        style={{
          transform: [{ rotate: `${-magnetometer}deg` }],
          borderColor: colors.inactive,
        }}
      >
        <View className="absolute top-2">
          <Text className="text-3xl font-bold" style={{ color: colors.active }}>
            N
          </Text>
        </View>

        <View className="absolute right-2">
          <Text className="text-3xl font-bold text-gray-700">E</Text>
        </View>
        <View className="absolute bottom-2">
          <Text className="text-3xl font-bold text-gray-700">S</Text>
        </View>
        <View className="absolute left-2">
          <Text className="text-3xl font-bold text-gray-700">W</Text>
        </View>

        <View
          className="absolute inset-0 items-center justify-center"
          style={{
            transform: [{ translateX }, { translateY }],
          }}
        >
          <Image
            source={require("../assets/images/prayer-pro-icons/qibla-tab/qibla-kaaba.png")}
            className="w-10 h-10"
            style={{
              tintColor: colors.inactive,
            }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View className="absolute inset-0 items-center justify-center">
        <Image
          source={require("../assets/images/prayer-pro-icons/qibla-tab/qibla-arrow.png")}
          className="w-14 h-14"
          style={{
            tintColor: colors.active,
            transform: [{ rotate: "180deg" }], // Arrow icon points down
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
