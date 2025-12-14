import React from "react";
import { Text, View } from "react-native";

interface QiblaCompassProps {
  magnetometer: number;
  qiblaDirection: number;
}

export const QiblaCompass = ({
  magnetometer,
  qiblaDirection,
}: QiblaCompassProps) => {
  // Calculate the rotation needed to point to Qibla
  const getQiblaRotation = () => {
    return qiblaDirection - magnetometer;
  };

  return (
    <View className="w-80 h-80 items-center justify-center">
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
          <Text className="text-2xl font-bold text-red-500">N</Text>
        </View>

        {/* Cardinal Directions */}
        <View className="absolute right-2">
          <Text className="text-lg font-bold text-gray-700">E</Text>
        </View>
        <View className="absolute bottom-2">
          <Text className="text-lg font-bold text-gray-700">S</Text>
        </View>
        <View className="absolute left-2">
          <Text className="text-lg font-bold text-gray-700">W</Text>
        </View>
      </View>

      {/* Qibla Arrow */}
      <View
        className="absolute items-center"
        style={{
          transform: [{ rotate: `${getQiblaRotation()}deg` }],
        }}
      >
        <View className="w-1 h-32 bg-green-600" />
        <View
          // TODO: Change arrow color based on upcoming prayer
          className="w-0 h-0 border-l-8 border-r-8 border-t-16"
          style={{
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: "#16a34a",
            borderTopWidth: 20,
          }}
        />
      </View>
    </View>
  );
};
