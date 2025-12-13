import { Prayers, prayerIcons } from "@/constants/prayers";
import { PrayerDict } from "@/prayer-api/prayerTimesAPI";
import { cleanTimeString, formatDate } from "@/utils/prayerHelpers";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Carousel, Colors, Icon } from "react-native-ui-lib";

const { width, height } = Dimensions.get("window");
const pageHeight = height * 0.45;
const pageWidth = width * 0.85;

interface PrayerCarouselProps {
  prayerDict: PrayerDict;
  sortedDates: string[];
  todayISO: string;
  todayIndex: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  notificationsEnabled: Record<string, boolean>;
  onToggleNotification: (prayer: string) => void;
}

export const PrayerCarousel = ({
  prayerDict,
  sortedDates,
  todayISO,
  todayIndex,
  currentPage,
  onPageChange,
  notificationsEnabled,
  onToggleNotification,
}: PrayerCarouselProps) => {
  return (
    <View className="pt-64 items-center mt-40 mb-12">
      <View
        className="relative"
        style={{ width: pageWidth, height: pageHeight }}
      >
        <Carousel
          containerStyle={{ height: pageHeight }}
          pageWidth={pageWidth + 10}
          onChangePage={onPageChange}
          itemSpacings={10}
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
                <View className="mb-4">
                  <Text className="text-xl font-bold text-black">
                    {formatDate(isoDate)}
                  </Text>
                  {isToday && (
                    <Text
                      className="text-xs font-semibold mt-1"
                      style={{ color: Colors.tabActive }}
                    >
                      TODAY
                    </Text>
                  )}
                </View>

                <View className="flex-1 justify-around">
                  {Prayers.map((prayer) => (
                    <View
                      key={prayer}
                      className="flex-row justify-between items-center py-2"
                    >
                      <View className="flex-row items-center gap-4">
                        <Icon
                          source={prayerIcons[prayer]}
                          size={24}
                          tintColor={Colors.tabActive}
                        />
                        <Text className="text-base font-semibold text-gray-800">
                          {prayer}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-4">
                        <Text className="text-base text-gray-700">
                          {cleanTimeString(dayPrayers.timings[prayer])}
                        </Text>
                        <Pressable onPress={() => onToggleNotification(prayer)}>
                          <Icon
                            source={
                              notificationsEnabled[prayer]
                                ? require("../assets/images/prayer-pro-icons/home-page/icon-notify-on.png")
                                : require("../assets/images/prayer-pro-icons/home-page/icon-notify-off.png")
                            }
                            size={24}
                            tintColor={Colors.tabActive}
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
};
