import { DebugPrayerPicker } from "@/components/DebugPrayerPicker";
import type { PrayerCarouselRef } from "@/components/PrayerCarousel";
import { PrayerCarousel } from "@/components/PrayerCarousel";
import { PrayerHeader } from "@/components/PrayerHeader";
import { prayerThemeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useLocation } from "@/hooks/useLocation";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasSetInitialPage, setHasSetInitialPage] = useState(false);
  const carouselRef = useRef<PrayerCarouselRef>(null);
  const navigation = useNavigation<any>();
  const { debugPrayer, isDarkMode } = useThemeColors();

  // Custom hooks to get states
  const { location, locationName, error: locationError } = useLocation();
  const {
    prayerDict,
    loading,
    error: prayerError,
    sortedDates,
    todayISO,
    todayIndex,
    nextPrayer,
  } = usePrayerTimes(location);
  const { notificationsEnabled, toggleNotification } =
    useNotifications(prayerDict);

  const error = locationError || prayerError;

  const scrollToToday = useCallback(() => {
    if (todayIndex >= 0 && currentPage !== todayIndex) {
      carouselRef.current?.goToPage(todayIndex, true);
      setCurrentPage(todayIndex);
    }
  }, [currentPage, todayIndex]);

  // Sets current page to today when initially loaded
  useEffect(() => {
    if (!hasSetInitialPage && todayIndex >= 0) {
      scrollToToday();
      setHasSetInitialPage(true);
    }
  }, [hasSetInitialPage, scrollToToday, todayIndex]);

  // Jump back to today when the Home tab is pressed
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      scrollToToday();
    });

    return unsubscribe;
  }, [navigation, scrollToToday]);

  // Determine which prayer to display (debug override or actual next prayer)
  const displayPrayer = debugPrayer || nextPrayer?.prayer;
  const displayPrayerObj = debugPrayer
    ? { prayer: debugPrayer, time: nextPrayer?.time || "--:--" }
    : nextPrayer;

  if (loading) return <ActivityIndicator className="mt-12" />;
  if (error) return <Text className="color-red-600 m-4">{error}</Text>;

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <DebugPrayerPicker />
      <PrayerHeader
        nextPrayer={displayPrayerObj}
        locationName={locationName}
      />
      <PrayerCarousel
        ref={carouselRef}
        prayerDict={prayerDict}
        sortedDates={sortedDates}
        todayISO={todayISO}
        todayIndex={todayIndex}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        notificationsEnabled={notificationsEnabled}
        onToggleNotification={toggleNotification}
        activeColor={
          displayPrayer
            ? prayerThemeColors[displayPrayer as keyof typeof prayerThemeColors]
                ?.active || "#568FAF"
            : "#568FAF"
        }
        isDarkMode={isDarkMode}
      />
    </View>
  );
}
