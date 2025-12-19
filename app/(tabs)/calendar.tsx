import { CalendarCard } from "@/components/CalendarCard";
import { CalendarHeader } from "@/components/CalendarHeader";
import { prayerBackgrounds } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View } from "react-native";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { colors } = useThemeColors();
  const { location, locationName } = useLocation();
  const { nextPrayer } = usePrayerTimes(location);

  const backgroundImage = nextPrayer?.prayer
    ? prayerBackgrounds[nextPrayer.prayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;

  return (
    <View className="flex-1">
      <StatusBar hidden />
      <CalendarHeader
        locationName={locationName}
        backgroundImage={backgroundImage}
        nextPrayer={nextPrayer}
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
