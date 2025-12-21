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
import { getCachedCalendar } from "@/utils/cacheHelpers";
import {
  convertDDMMYYYYToISO,
  getTodayISO,
  hasIncludedHoliday,
} from "@/utils/calendarHelpers";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [nextHoliday, setNextHoliday] = useState<NextHijriHolidayData | null>(
    null
  );
  const { colors } = useThemeColors();
  const { location, locationName } = useLocation();
  const { nextPrayer } = usePrayerTimes(location);
  const [holidayMarks, setHolidayMarks] = useState<Record<string, any>>({});

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
        // After fetching next holiday, cached calendar should be available.
        const allDays = await getCachedCalendar();
        if (isActive && allDays) {
          const marks: Record<string, any> = {};
          for (const day of allDays) {
            if (hasIncludedHoliday(day)) {
              const iso = convertDDMMYYYYToISO(day.gregorian.date);
              // A single dot per holiday date
              marks[iso] = { ...(marks[iso] || {}), marked: true };
            }
          }
          setHolidayMarks(marks);
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

  // Merge selected date styling with holiday dots
  const mergedMarkedDates = useMemo(() => {
    const selectedEntry = {
      selected: true,
      selectedColor: colors.active,
      selectedTextColor: "#ffffff",
    };
    return {
      ...holidayMarks,
      [selectedDate]: {
        ...(holidayMarks[selectedDate] || {}),
        ...selectedEntry,
      },
    };
  }, [holidayMarks, selectedDate, colors.active]);

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
          markedDates={mergedMarkedDates}
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
