import { CalendarCard } from "@/components/CalendarCard";
import { CalendarHeader } from "@/components/CalendarHeader";
import { prayerBackgrounds } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import {
  NextHijriHolidayData,
  fetchNextIncludedHijriHoliday,
} from "@/prayer-api/islamicCalendarAPI";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nextHoliday, setNextHoliday] = useState<NextHijriHolidayData | null>(
    null
  );
  const { colors } = useThemeColors();
  const { location, locationName } = useLocation();
  const { nextPrayer } = usePrayerTimes(location);

  const backgroundImage = nextPrayer?.prayer
    ? prayerBackgrounds[nextPrayer.prayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;

  useEffect(() => {
    let isActive = true;

    const loadHoliday = async () => {
      try {
        const data = await fetchNextIncludedHijriHoliday();
        if (isActive) {
          setNextHoliday(data);
        }
      } catch (error) {
        console.error("Failed to load next Hijri holiday", error);
      }
    };

    loadHoliday();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View className="flex-1">
      <CalendarHeader
        locationName={locationName}
        backgroundImage={backgroundImage}
        nextPrayer={nextPrayer}
        nextHoliday={nextHoliday}
      />
      <View className="flex-1 items-center justify-center p-4 pt-28">
        <CalendarCard
          selectedDate={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: colors.active,
              selectedTextColor: "#ffffff",
            },
          }}
          colors={colors}
        />
      </View>
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ height: 10 }}
      />
    </View>
  );
}
