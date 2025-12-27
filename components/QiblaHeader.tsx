import { darkModeColors, lightModeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useAnimatedBackgroundColor } from "@/hooks/useAnimatedColor";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { AnimatedCrossfadeImage } from "./AnimatedCrossfadeImage";

const { height } = Dimensions.get("window");

interface QiblaHeaderProps {
  qiblaDirection: number | null;
  locationName: string;
  backgroundImage: any;
  currentPrayer?: { prayer: string } | null;
}

export const QiblaHeader = ({
  qiblaDirection,
  locationName,
  backgroundImage,
  currentPrayer,
}: QiblaHeaderProps) => {
  const { isDarkMode } = useThemeColors();
  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;
  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);

  return (
    <>
      <AnimatedCrossfadeImage source={backgroundImage} resizeMode="cover" />

      {/* White/Dark rounded section */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={[{ height: height * 0.455 }, animatedBgStyle]}
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
            className="font-extrabold text-3xl text-white pt-3"
            style={{
              textShadowColor: "rgba(0,0,0,0.4)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            {currentPrayer
              ? currentPrayer.prayer === "Sunrise"
                ? "Current: Sunrise"
                : `Current Prayer: ${currentPrayer.prayer}`
              : "Loading current prayer..."}
          </Text>
        </View>
      </View>
    </>
  );
};
