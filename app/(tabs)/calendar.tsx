import { CalendarCard } from "@/components/CalendarCard";
import { CalendarHeader } from "@/components/CalendarHeader";
import { HolidayBottomSheet } from "@/components/HolidayBottomSheet";
import {
  darkModeColors,
  lightModeColors,
  prayerBackgrounds,
} from "@/constants/prayers";
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
  getIncludedHolidaysFromDay,
  getTodayISO,
  hasIncludedHoliday,
} from "@/utils/calendarHelpers";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "react-native-ui-lib";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [nextHoliday, setNextHoliday] = useState<NextHijriHolidayData | null>(
    null
  );
  const [isHolidaySheetOpen, setIsHolidaySheetOpen] = useState(false);
  const [sheetHolidays, setSheetHolidays] = useState<string[]>([]);
  const { colors, debugPrayer, isDarkMode } = useThemeColors();
  const { location, locationName } = useLocation();
  const { nextPrayer } = usePrayerTimes(location);
  const [holidayMarks, setHolidayMarks] = useState<Record<string, any>>({});

  // Use debug prayer if set, otherwise use actual next prayer
  const displayPrayer = debugPrayer || nextPrayer?.prayer;
  const backgroundImage = displayPrayer
    ? prayerBackgrounds[displayPrayer] || prayerBackgrounds.Fajr
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
              const holidays = getIncludedHolidaysFromDay(day);
              // Store both marked status and holiday names
              marks[iso] = { ...(marks[iso] || {}), marked: true, holidays };
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

  // Get holiday names for the selected date (if any)
  const selectedHolidays = useMemo(() => {
    const mark = holidayMarks[selectedDate];
    return mark?.holidays || [];
  }, [holidayMarks, selectedDate]);

  return (
    <View className="flex-1">
      <CalendarHeader
        locationName={locationName}
        backgroundImage={backgroundImage}
        nextPrayer={nextPrayer}
        nextHoliday={nextHoliday}
      />
      <View className="flex-1 items-center justify-center p-4 pt-24">
        <CalendarCard
          selectedDate={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={mergedMarkedDates}
          colors={colors}
          isDarkMode={isDarkMode}
        />
      </View>
      {selectedHolidays.length > 0 && (
        <View className="absolute bottom-20 left-4 right-4 items-center">
          <Pressable
            onPress={() => {
              setSheetHolidays(selectedHolidays);
              setIsHolidaySheetOpen(true);
            }}
            className="rounded-2xl p-4 flex-row gap-2 items-center"
            style={{
              backgroundColor: isDarkMode
                ? darkModeColors.background
                : lightModeColors.background,
            }}
          >
            {selectedHolidays.map((holiday: string, index: number) => (
              <Text
                key={index}
                className="text-center text-xl font-semibold"
                style={{ color: colors.active }}
              >
                {holiday}
              </Text>
            ))}
            <Icon
              source={require("../../assets/images/prayer-pro-icons/calendar-tab/calendar-info.png")}
              tintColor={colors.active}
              size={24}
            />
          </Pressable>
        </View>
      )}

      {/* Bottom Sheet Modal */}
      <HolidayBottomSheet
        visible={isHolidaySheetOpen}
        holidays={sheetHolidays}
        isDarkMode={isDarkMode}
        colors={colors}
        onClose={() => setIsHolidaySheetOpen(false)}
      />
      <View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={{
          height: 10,
          backgroundColor: isDarkMode
            ? darkModeColors.background
            : lightModeColors.background,
        }}
      />
    </View>
  );
}
