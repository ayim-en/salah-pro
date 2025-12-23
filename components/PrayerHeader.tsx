import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { Icon } from "react-native-ui-lib";
import { prayerBackgrounds } from "../constants/prayers";

const { height } = Dimensions.get("window");

interface UpcomingPrayerHeaderProps {
  nextPrayer: { prayer: string; time: string } | null;
  locationName: string;
}

export const PrayerHeader = ({
  nextPrayer,
  locationName,
}: UpcomingPrayerHeaderProps) => {
  // Get the background image based on the upcoming prayer
  const backgroundImage = nextPrayer?.prayer
    ? prayerBackgrounds[nextPrayer.prayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;

  return (
    <>
      <Image
        key={nextPrayer?.prayer}
        source={backgroundImage}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />

      <View className="absolute left-0 right-0 justify-center items-center pt-24 mb-14">
        <Text
          className=" font-bold text-lg text-white"
          style={{
            textShadowColor: "rgba(0,0,0,0.3)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {nextPrayer
            ? `Upcoming Prayer: ${nextPrayer.prayer}`
            : "Loading prayer times..."}
        </Text>
        <Text
          className="font-extrabold text-white text-[90px]"
          style={{
            textShadowColor: "rgba(0,0,0,0.4)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}
        >
          {nextPrayer ? nextPrayer.time : "--:--"}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text
            className="text-lg font-bold text-white"
            style={{
              textShadowColor: "rgba(0,0,0,0.3)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {locationName}
          </Text>
          <Icon
            source={require("../assets/images/prayer-pro-icons/home-page/icon-location.png")}
            size={12}
            tintColor="white"
          />
        </View>
      </View>
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ height: height * 0.5 }}
      ></View>
    </>
  );
};
