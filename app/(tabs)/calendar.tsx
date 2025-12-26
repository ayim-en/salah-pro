import { CalendarCard, CalendarCardRef } from "@/components/CalendarCard";
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
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import Reanimated from "react-native-reanimated";
import { AnimatedTintIcon } from "@/components/AnimatedTintIcon";
import {
  useAnimatedBackgroundColor,
  useAnimatedTextColor,
} from "@/hooks/useAnimatedColor";

// Animation constants
const ANIMATION_DURATION_IN = 250;
const ANIMATION_DURATION_OUT = 300;

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [nextHoliday, setNextHoliday] = useState<NextHijriHolidayData | null>(
    null
  );
  const [isHolidaySheetOpen, setIsHolidaySheetOpen] = useState(false);
  const [sheetHolidays, setSheetHolidays] = useState<string[]>([]);
  const { colors, themePrayer, isDarkMode } = useThemeColors();
  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;
  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);
  const animatedActiveTextStyle = useAnimatedTextColor(colors.active);
  const { location, locationName } = useLocation();
  const { currentPrayer } = usePrayerTimes(location);
  const [holidayMarks, setHolidayMarks] = useState<Record<string, any>>({});

  // Animation state for holiday badge
  const holidayBadgeAnim = useRef(new Animated.Value(0)).current; // Start at bottom edge of calendar
  const [displayedHolidays, setDisplayedHolidays] = useState<string[]>([]);
  const prevHolidaysRef = useRef<string[]>([]);

  // Ref and navigation for scrolling to today on tab press
  const calendarRef = useRef<CalendarCardRef>(null);
  const navigation = useNavigation<any>();

  const scrollToToday = useCallback(() => {
    setSelectedDate(getTodayISO());
    calendarRef.current?.scrollToToday();
  }, []);

  // Jump back to today when the Calendar tab is pressed
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      scrollToToday();
    });

    return unsubscribe;
  }, [navigation, scrollToToday]);

  // Use theme prayer if set, otherwise use actual current prayer for background
  const displayPrayer = themePrayer || currentPrayer?.prayer;
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

  // Get holiday names for the selected date (if any)
  const selectedHolidays = useMemo(() => {
    const mark = holidayMarks[selectedDate];
    return mark?.holidays || [];
  }, [holidayMarks, selectedDate]);

  // Animate holiday badge in/out when selectedHolidays changes
  useEffect(() => {
    const prev = prevHolidaysRef.current;
    const isSame =
      selectedHolidays.length === prev.length &&
      selectedHolidays.every((h: string, i: number) => h === prev[i]);

    if (selectedHolidays.length > 0) {
      if (isSame) return; // Skip animation if same holiday
      // Update displayed holidays and animate down from calendar
      setDisplayedHolidays(selectedHolidays);
      prevHolidaysRef.current = selectedHolidays;
      holidayBadgeAnim.setValue(0);
      Animated.timing(holidayBadgeAnim, {
        toValue: 70,
        duration: ANIMATION_DURATION_IN,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      prevHolidaysRef.current = [];
      // Animate back up behind calendar
      Animated.timing(holidayBadgeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION_OUT,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [selectedHolidays, holidayBadgeAnim]);

  return (
    <View className="flex-1">
      <CalendarHeader
        locationName={locationName}
        backgroundImage={backgroundImage}
        currentPrayer={currentPrayer}
        nextHoliday={nextHoliday}
      />
      <View className="flex-1 items-center justify-center p-4 pt-24">
        <View style={{ position: "relative" }}>
          <Animated.View
            className="absolute left-0 right-0 items-center"
            style={{
              bottom: 0,
              transform: [{ translateY: holidayBadgeAnim }],
            }}
          >
            <Pressable
              onPress={() => {
                setSheetHolidays(displayedHolidays);
                setIsHolidaySheetOpen(true);
              }}
            >
              <Reanimated.View
                className="rounded-2xl p-4 flex-row gap-2 items-center"
                style={animatedBgStyle}
              >
                {displayedHolidays.map((holiday: string, index: number) => (
                  <Reanimated.Text
                    key={index}
                    className="text-center text-xl font-semibold"
                    style={animatedActiveTextStyle}
                  >
                    {holiday}
                  </Reanimated.Text>
                ))}
                <AnimatedTintIcon
                  source={require("../../assets/images/prayer-pro-icons/calendar-tab/calendar-info.png")}
                  tintColor={colors.active}
                  size={24}
                />
              </Reanimated.View>
            </Pressable>
          </Animated.View>
          <CalendarCard
            ref={calendarRef}
            selectedDate={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            holidayMarks={holidayMarks}
            colors={colors}
            isDarkMode={isDarkMode}
          />
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <HolidayBottomSheet
        visible={isHolidaySheetOpen}
        holidays={sheetHolidays}
        isDarkMode={isDarkMode}
        colors={colors}
        onClose={() => setIsHolidaySheetOpen(false)}
      />
      <Reanimated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={[{ height: 10 }, animatedBgStyle]}
      />
    </View>
  );
}
