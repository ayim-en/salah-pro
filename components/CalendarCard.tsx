import React from "react";
import { Dimensions, View } from "react-native";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

interface CalendarCardProps {
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
  markedDates: Record<
    string,
    { selected: boolean; selectedColor: string; selectedTextColor: string }
  >;
  colors: { active: string; inactive: string };
}

export const CalendarCard = ({
  selectedDate,
  onDayPress,
  markedDates,
  colors,
}: CalendarCardProps) => {
  return (
    <View
      className="bg-white rounded-3xl p-6"
      style={{ width: width, height: width }}
    >
      <Calendar
        key={`${colors.active}-${colors.inactive}`}
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: colors.active,
          selectedDayTextColor: "#ffffff",
          todayTextColor: colors.active,
          dayTextColor: colors.active,
          textDisabledColor: "#d9e1e8",
          dotColor: colors.active,
          selectedDotColor: "#ffffff",
          arrowColor: colors.inactive,
          monthTextColor: colors.active,
          indicatorColor: colors.active,
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textMonthFontWeight: "bold",
          textDayHeaderFontFamily: "System",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 13,
        }}
      />
    </View>
  );
};
