import { getCardinalDirection } from "@/utils/prayerHelpers";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

const { height } = Dimensions.get("window");

interface QiblaHeaderProps {
  qiblaDirection: number | null;
  locationName: string;
  backgroundImage: any;
}

export const QiblaHeader = ({
  qiblaDirection,
  locationName,
  backgroundImage,
}: QiblaHeaderProps) => {
  return (
    <>
      <Image
        source={backgroundImage}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />

      {/* White rounded section */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ height: height * 0.455 }}
      />

      <View className="absolute left-0 right-0 items-center pt-24">
        <Text className="text-6xl font-bold mb-2 text-white">
          {qiblaDirection !== null
            ? `${getCardinalDirection(qiblaDirection)} ${Math.round(
                qiblaDirection
              )}°`
            : "--"}
        </Text>
        <Text className="text-lg text-white">{locationName}</Text>
      </View>
    </>
  );
};
