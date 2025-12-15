import { getCardinalDirection } from "@/utils/prayerHelpers";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { Icon } from "react-native-ui-lib";

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
      {/* //TODO: Change style to match prayer screen */}
      <View className="absolute left-0 right-0 items-center pt-24">
        <Text className="font-extrabold text-white text-[80px]">
          {qiblaDirection !== null
            ? `${getCardinalDirection(qiblaDirection)} ${Math.round(
                qiblaDirection
              )}°`
            : "--"}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-bold text-white">{locationName}</Text>
          <Icon
            source={require("../assets/images/prayer-pro-icons/home-page/icon-location.png")}
            size={12}
            tintColor="white"
          />
        </View>
      </View>
    </>
  );
};
