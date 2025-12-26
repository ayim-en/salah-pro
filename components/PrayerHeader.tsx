import {
  darkModeColors,
  lightModeColors,
  prayerBackgrounds,
} from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useAnimatedBackgroundColor } from "@/hooks/useAnimatedColor";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Icon } from "react-native-ui-lib";
import { AnimatedCrossfadeImage } from "./AnimatedCrossfadeImage";

const { height } = Dimensions.get("window");

interface CurrentPrayerHeaderProps {
  currentPrayer: { prayer: string; time: string } | null;
  locationName: string;
}

export const PrayerHeader = ({
  currentPrayer,
  locationName,
}: CurrentPrayerHeaderProps) => {
  const { isDarkMode, themePrayer } = useThemeColors();
  // Get the background image based on theme prayer (if set) or current prayer
  const displayPrayer = themePrayer || currentPrayer?.prayer;
  const backgroundImage = displayPrayer
    ? prayerBackgrounds[displayPrayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;

  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;
  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);

  return (
    <>
      <AnimatedCrossfadeImage source={backgroundImage} resizeMode="cover" />

      <View className="absolute left-0 right-0 justify-center items-center pt-24 mb-14">
        <Text
          className=" font-bold text-lg text-white"
          style={{
            textShadowColor: "rgba(0,0,0,0.3)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {currentPrayer
            ? currentPrayer.prayer === "Sunrise"
              ? "Current: Sunrise"
              : `Current Prayer: ${currentPrayer.prayer}`
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
          {currentPrayer ? currentPrayer.time : "--:--"}
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
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={[{ height: height * 0.5 }, animatedBgStyle]}
      />
    </>
  );
};
