import { darkModeColors, lightModeColors } from "@/constants/prayers";
import React from "react";
import { Dimensions, View } from "react-native";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

interface CalendarCardProps {
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
  // Allow selection and dot markings (react-native-calendars MarkedDates shape)
  markedDates: Record<string, any>;
  colors: { active: string; inactive: string };
  isDarkMode?: boolean;
}

export const CalendarCard = ({
  selectedDate,
  onDayPress,
  markedDates,
  colors,
  isDarkMode = false,
}: CalendarCardProps) => {
  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;
  const dayTextColor = isDarkMode ? darkModeColors.text : colors.active;
  const disabledTextColor = isDarkMode
    ? darkModeColors.disabledText
    : lightModeColors.disabledText;
  const sectionTitleColor = isDarkMode
    ? darkModeColors.sectionTitle
    : lightModeColors.sectionTitle;

  return (
    <View
      className="rounded-3xl p-6"
      style={{ width: width, height: width, backgroundColor: bgColor }}
    >
      <Calendar
        key={`${colors.active}-${colors.inactive}-${isDarkMode}`}
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: sectionTitleColor,
          selectedDayBackgroundColor: colors.active,
          selectedDayTextColor: "#ffffff",
          todayTextColor: colors.active,
          dayTextColor: dayTextColor,
          textDisabledColor: disabledTextColor,
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
