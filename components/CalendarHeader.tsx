import React from "react";
import { Image, Text, View } from "react-native";

interface CalendarHeaderProps {
  nextPrayer: { prayer: string; time: string } | null;
  locationName: string;
  backgroundImage: any;
}

export const CalendarHeader = ({
  nextPrayer,
  locationName,
  backgroundImage,
}: CalendarHeaderProps) => {
  return (
    <>
      <Image
        key={nextPrayer?.prayer}
        source={backgroundImage}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />

      <View className="absolute left-0 right-0 justify-center items-center pt-24 mb-14">
        <Text className="font-bold text-rg text-white">
          {nextPrayer
            ? `Upcoming Prayer: ${nextPrayer.prayer}`
            : "Loading prayer times..."}
        </Text>
        <Text className="font-extrabold text-white text-[90px]">
          {nextPrayer ? nextPrayer.time : "--:--"}
        </Text>
      </View>
    </>
  );
};
