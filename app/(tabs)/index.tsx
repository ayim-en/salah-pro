import { PrayerCarousel } from "@/components/PrayerCarousel";
import { UpcomingPrayerHeader } from "@/components/UpcomingPrayerHeader";
import { prayerThemeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useLocation } from "@/hooks/useLocation";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);
  const { setColors } = useThemeColors();

  // Custom hooks to get states
  const { location, locationName, error: locationError } = useLocation();
  const { notificationsEnabled, toggleNotification } = useNotifications();
  const {
    prayerDict,
    loading,
    error: prayerError,
    sortedDates,
    todayISO,
    todayIndex,
    nextPrayer,
  } = usePrayerTimes(location);

  const error = locationError || prayerError;

  // Sets current page to today when initially loaded
  useEffect(() => {
    if (todayIndex > 0 && currentPage === 0) {
      setCurrentPage(todayIndex);
    }
  }, [todayIndex, currentPage]);

  // Update theme colors based on upcoming prayer
  useEffect(() => {
    if (nextPrayer?.prayer) {
      const prayerName = nextPrayer.prayer as keyof typeof prayerThemeColors;
      const colors = prayerThemeColors[prayerName];
      if (colors) {
        setColors({
          active: colors.active,
          inactive: colors.inactive,
        });
      }
    }
  }, [nextPrayer, setColors]);

  if (loading) return <ActivityIndicator className="mt-12" />;
  if (error) return <Text className="color-red-600 m-4">{error}</Text>;

  return (
    <View className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      <UpcomingPrayerHeader
        key={nextPrayer?.prayer}
        nextPrayer={nextPrayer}
        locationName={locationName}
      />
      <PrayerCarousel
        prayerDict={prayerDict}
        sortedDates={sortedDates}
        todayISO={todayISO}
        todayIndex={todayIndex}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        notificationsEnabled={notificationsEnabled}
        onToggleNotification={toggleNotification}
        activeColor={
          nextPrayer?.prayer
            ? prayerThemeColors[
                nextPrayer.prayer as keyof typeof prayerThemeColors
              ]?.active || "#568FAF"
            : "#568FAF"
        }
      />
    </View>
  );
}
