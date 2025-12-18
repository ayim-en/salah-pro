import { prayerBackgrounds } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import React, { useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { colors } = useThemeColors();
  const { location } = useLocation();
  const { nextPrayer } = usePrayerTimes(location);

  const backgroundImage = nextPrayer?.prayer
    ? prayerBackgrounds[nextPrayer.prayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;

  return (
    <View className="flex-1">
      <Image
        source={backgroundImage}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />
      <View className="flex-1 items-center justify-center p-4">
        <View
          className="bg-white rounded-3xl p-6"
          style={{ width: width * 0.95, height: width * 0.95 }}
        >
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.active,
                selectedTextColor: "#ffffff",
              },
            }}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: colors.active,
              selectedDayTextColor: "#ffffff",
              todayTextColor: colors.active,
              dayTextColor: "#2d3436",
              textDisabledColor: "#d9e1e8",
              dotColor: colors.active,
              selectedDotColor: "#ffffff",
              arrowColor: colors.active,
              monthTextColor: colors.active,
              indicatorColor: colors.active,
              textDayFontFamily: "System",
              textMonthFontFamily: "System",
              textMonthFontWeight: "bold",
              textDayHeaderFontFamily: "System",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>
      </View>
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ height: 10 }}
      />
    </View>
  );
}
