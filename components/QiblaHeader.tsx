import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

const { height } = Dimensions.get("window");

interface QiblaHeaderProps {
  qiblaDirection: number | null;
  locationName: string;
  backgroundImage: any;
  nextPrayer?: { prayer: string } | null;
}

export const QiblaHeader = ({
  qiblaDirection,
  locationName,
  backgroundImage,
  nextPrayer,
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
      {/* Location display */}
      <View className="absolute left-0 right-0 items-center pt-24">
        <View className="items-center w-[90%]">
          <Text
            className="font-extrabold text-white text-[48px] text-center"
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              textShadowColor: "rgba(0,0,0,0.4)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            {locationName}
          </Text>
          <Text
            className=" font-bold text-2xl text-white pt-3"
            style={{
              textShadowColor: "rgba(0,0,0,0.3)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {nextPrayer
              ? `Upcoming Prayer: ${nextPrayer.prayer}`
              : "Loading upcoming prayer..."}
          </Text>
        </View>
      </View>
    </>
  );
};
