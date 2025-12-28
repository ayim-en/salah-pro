import {
  Prayers,
  darkModeColors,
  lightModeColors,
  prayerIcons,
} from "@/constants/prayers";
import { PrayerDict } from "@/prayer-api/prayerTimesAPI";
import { cleanTimeString, formatDate } from "@/utils/prayerHelpers";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Dimensions, Pressable, Text, Vibration, View } from "react-native";
import { Carousel } from "react-native-ui-lib";
import { AnimatedTintIcon } from "./AnimatedTintIcon";

const { width, height } = Dimensions.get("window");
const pageHeight = height * 0.50;
const pageWidth = width * 0.85;
const itemSpacing = 10;

interface PrayerCarouselProps {
  prayerDict: PrayerDict;
  sortedDates: string[];
  todayISO: string;
  todayIndex: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  notificationsEnabled: Record<string, boolean>;
  onToggleNotification: (prayer: string) => void;
  activeColor: string;
  inactiveColor: string;
  currentPrayer: string | null;
  isDarkMode?: boolean;
}

export type PrayerCarouselRef = {
  goToPage: (page: number, animated?: boolean) => void;
};

export const PrayerCarousel = forwardRef<
  PrayerCarouselRef,
  PrayerCarouselProps
>(
  (
    {
      prayerDict,
      sortedDates,
      todayISO,
      todayIndex,
      currentPage,
      onPageChange,
      notificationsEnabled,
      onToggleNotification,
      activeColor,
      inactiveColor,
      currentPrayer,
      isDarkMode = false,
    },
    ref
  ) => {
    type CarouselHandle = React.ComponentRef<typeof Carousel>;
    const carouselRef = useRef<CarouselHandle | null>(null);

    useImperativeHandle(ref, () => ({
      goToPage: (page, animated = true) =>
        carouselRef.current?.goToPage?.(page, animated),
    }));

    // Colors based on dark mode
    const bgColor = isDarkMode
      ? darkModeColors.background
      : lightModeColors.background;
    const textColor = isDarkMode ? darkModeColors.text : lightModeColors.text;
    const secondaryTextColor = isDarkMode
      ? darkModeColors.textSecondary
      : lightModeColors.textSecondary;
    const tertiaryTextColor = isDarkMode
      ? darkModeColors.textTertiary
      : lightModeColors.textTertiary;

    return (
      <View
        className="flex-1 pt-8 pb-2 items-center mt-[22rem] rounded-t-3xl"
        style={{ backgroundColor: bgColor }}
      >
        <View
          className="relative"
          style={{
            width: pageWidth + itemSpacing,
            height: pageHeight,
            backgroundColor: bgColor,
          }}
        >
          <Carousel
            ref={carouselRef}
            containerStyle={{
              height: pageHeight,
              width: pageWidth + itemSpacing,
              backgroundColor: bgColor,
            }}
            pageWidth={pageWidth}
            onChangePage={onPageChange}
            itemSpacings={itemSpacing}
            initialPage={todayIndex}
          >
            {sortedDates.map((isoDate) => {
              const dayPrayers = prayerDict[isoDate];
              const isToday = isoDate === todayISO;

              return (
                <View
                  key={isoDate}
                  className="w-full h-full rounded-xl justify-start"
                >
                  <View className="mb-2">
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: textColor,
                      }}
                    >
                      {formatDate(isoDate)}
                    </Text>
                    {isToday && (
                      <Text
                        className="text-sm font-semibold mt-1"
                        style={{ color: activeColor }}
                      >
                        TODAY
                      </Text>
                    )}
                  </View>

                  <View className="flex-1 justify-around">
                    {Prayers.map((prayer) => (
                      <View
                        key={prayer}
                        className="flex-row justify-between items-center py-5"
                      >
                        <View className="flex-row items-center gap-4">
                          <AnimatedTintIcon
                            source={prayerIcons[prayer]}
                            size={24}
                            tintColor={
                              prayer === currentPrayer
                                ? activeColor
                                : inactiveColor
                            }
                          />
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "600",
                              color: secondaryTextColor,
                            }}
                          >
                            {prayer}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-4">
                          <Text
                            style={{ fontSize: 18, color: tertiaryTextColor }}
                          >
                            {cleanTimeString(dayPrayers.timings[prayer])}
                          </Text>
                          <Pressable
                            onPress={() => {
                              onToggleNotification(prayer);
                              setTimeout(() => Vibration.vibrate(50), 100);
                            }}
                          >
                            <AnimatedTintIcon
                              source={
                                notificationsEnabled[prayer]
                                  ? require("../assets/images/prayer-pro-icons/home-page/icon-notify-on.png")
                                  : require("../assets/images/prayer-pro-icons/home-page/icon-notify-off.png")
                              }
                              size={24}
                              tintColor={
                                prayer === currentPrayer
                                  ? activeColor
                                  : inactiveColor
                              }
                            />
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </Carousel>
        </View>
      </View>
    );
  }
);

PrayerCarousel.displayName = "PrayerCarousel";
