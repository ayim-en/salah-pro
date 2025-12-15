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
  // Arrow stays fixed; compass and Kaaba marker handle rotation.
  const { colors } = useThemeColors();

  return (
    <View className="w-96 h-96 items-center justify-center">
      {/* Compass Circle */}
      <View
        // TODO: Change border color based on upcoming prayer
        className="w-full h-full rounded-full border-8 border-gray-300 items-center justify-center bg-gray-50"
        style={{
          transform: [{ rotate: `${-magnetometer}deg` }],
        }}
      >
        {/* // TODO: Change North Marker based on upcoming prayer */}
        <View className="absolute top-2">
          <Text className="text-3xl font-bold text-red-500">N</Text>
        </View>

        {/* Cardinal Directions */}
        <View className="absolute right-2">
          <Text className="text-3xl font-bold text-gray-700">E</Text>
        </View>
        <View className="absolute bottom-2">
          <Text className="text-3xl font-bold text-gray-700">S</Text>
        </View>
        <View className="absolute left-2">
          <Text className="text-3xl font-bold text-gray-700">W</Text>
        </View>

        {/* Qibla marker relative to North (rotates with the compass) */}
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ transform: [{ rotate: `${qiblaDirection}deg` }] }}
        >
          <Image
            source={require("../assets/images/prayer-pro-icons/qibla-tab/qibla-kaaba.png")}
            className="w-10 h-10"
            style={{
              tintColor: colors.active,
              transform: [{ translateY: -140 }],
            }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Fixed Qibla Arrow (does not rotate; always points up) */}
      <View className="absolute inset-0 items-center justify-center">
        <Image
          // Qibla compass arrow icon; centered with tip facing upward
          source={require("../assets/images/prayer-pro-icons/qibla-tab/qibla-arrow.png")}
          className="w-14 h-14"
          style={{
            tintColor: colors.active,
            transform: [{ rotate: "180deg" }],
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
