import { PrayerCarousel } from "@/components/PrayerCarousel";
import { UpcomingPrayerHeader } from "@/components/UpcomingPrayerHeader";
import { useLocation } from "@/hooks/useLocation";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);

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

  if (loading) return <ActivityIndicator className="mt-12" />;
  if (error) return <Text className="color-red-600 m-4">{error}</Text>;

  return (
    <View className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      <UpcomingPrayerHeader
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
      />
    </View>
  );
}
