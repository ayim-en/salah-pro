import type { PrayerCarouselRef } from "@/components/PrayerCarousel";
import { PrayerCarousel } from "@/components/PrayerCarousel";
import { PrayerHeader } from "@/components/PrayerHeader";
import { Prayers, prayerThemeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useLocation } from "@/hooks/useLocation";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { sendTestNotification } from "@/utils/notificationService";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasSetInitialPage, setHasSetInitialPage] = useState(false);
  const [showDebugPicker, setShowDebugPicker] = useState(false);
  const carouselRef = useRef<PrayerCarouselRef>(null);
  const navigation = useNavigation<any>();
  const {
    setColors,
    debugPrayer,
    setDebugPrayer,
    isDarkMode,
    setCurrentPrayer,
  } = useThemeColors();

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
  const { notificationsEnabled, toggleNotification } = useNotifications(prayerDict);

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

  // Update theme colors based on upcoming prayer (only if not in debug mode)
  useEffect(() => {
    if (!debugPrayer && nextPrayer?.prayer) {
      const prayerName = nextPrayer.prayer as keyof typeof prayerThemeColors;
      const colors = prayerThemeColors[prayerName];
      if (colors) {
        setColors({
          active: colors.active,
          inactive: colors.inactive,
        });
      }
      // Update current prayer for dark mode calculation
      setCurrentPrayer(nextPrayer.prayer as any);
    }
  }, [nextPrayer, setColors, debugPrayer, setCurrentPrayer]);

  // Determine which prayer to display (debug override or actual next prayer)
  const displayPrayer = debugPrayer || nextPrayer?.prayer;
  const displayPrayerObj = debugPrayer
    ? { prayer: debugPrayer, time: nextPrayer?.time || "--:--" }
    : nextPrayer;

  if (loading) return <ActivityIndicator className="mt-12" />;
  if (error) return <Text className="color-red-600 m-4">{error}</Text>;

  return (
    <View className="flex-1 bg-blue-500">
      <StatusBar style="light" />

      {/* DEBUG: Floating button to toggle prayer theme picker */}
      <TouchableOpacity
        onPress={() => setShowDebugPicker(!showDebugPicker)}
        style={{
          position: "absolute",
          top: 60,
          right: 16,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.7)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
          🎨 {debugPrayer || "Auto"}
        </Text>
      </TouchableOpacity>

      {/* DEBUG: Prayer theme picker */}
      {showDebugPicker && (
        <View
          style={{
            position: "absolute",
            top: 100,
            right: 16,
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setDebugPrayer(null);
              setShowDebugPicker(false);
            }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: !debugPrayer ? "#eee" : "transparent",
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            <Text style={{ fontWeight: !debugPrayer ? "bold" : "normal" }}>
              🔄 Auto (Real Time)
            </Text>
          </TouchableOpacity>
          {Prayers.map((prayer) => (
            <TouchableOpacity
              key={prayer}
              onPress={() => {
                setDebugPrayer(prayer);
                setShowDebugPicker(false);
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor:
                  debugPrayer === prayer
                    ? prayerThemeColors[prayer].active
                    : "transparent",
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color:
                    debugPrayer === prayer
                      ? "white"
                      : prayerThemeColors[prayer].active,
                  fontWeight: debugPrayer === prayer ? "bold" : "normal",
                }}
              >
                {prayer}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              sendTestNotification();
              setShowDebugPicker(false);
            }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: "#4CAF50",
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              🔔 Test Notification
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <PrayerHeader
        key={displayPrayer}
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
