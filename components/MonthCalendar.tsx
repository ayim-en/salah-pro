import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { DayComponent } from "./DayComponent";

const { width } = Dimensions.get("window");

export interface MonthCalendarProps {
  monthDate: string;
  holidayMarks: Record<string, any>;
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
  activeColor: string;
  dayTextColor: string;
  disabledTextColor: string;
  sectionTitleColor: string;
}

export const MonthCalendar = memo(
  function MonthCalendar({
    monthDate,
    holidayMarks,
    selectedDate,
    onDayPress,
    activeColor,
    dayTextColor,
    disabledTextColor,
    sectionTitleColor,
  }: MonthCalendarProps) {
    // Only compute markedDates for this specific month
    const monthPrefix = monthDate.slice(0, 7); // "YYYY-MM"
    const isSelectedInThisMonth = selectedDate.startsWith(monthPrefix);

    const markedDates = useMemo(() => {
      const marks: Record<string, any> = {};

      // Only include holiday marks for this month
      Object.keys(holidayMarks).forEach((date) => {
        if (date.startsWith(monthPrefix)) {
          marks[date] = holidayMarks[date];
        }
      });

      // Add selection mark if selected date is in this month
      if (isSelectedInThisMonth) {
        marks[selectedDate] = {
          ...(marks[selectedDate] || {}),
          selected: true,
          selectedColor: activeColor,
          selectedTextColor: "#ffffff",
        };
      }

      return marks;
    }, [holidayMarks, monthPrefix, isSelectedInThisMonth, selectedDate, activeColor]);

    const renderDayComponent = useCallback(
      ({
        date,
        state,
        marking,
      }: {
        date?: DateData;
        state?: string;
        marking?: any;
      }) => (
        <DayComponent
          date={date}
          state={state}
          marking={marking}
          onPress={() => date && onDayPress({ dateString: date.dateString })}
          activeColor={activeColor}
          dayTextColor={dayTextColor}
          disabledTextColor={disabledTextColor}
        />
      ),
      [activeColor, dayTextColor, disabledTextColor, onDayPress]
    );

    return (
      <View style={{ width: width }}>
        <Calendar
          key={`${monthDate}-${activeColor}-${sectionTitleColor}`}
          current={monthDate}
          onDayPress={onDayPress}
          markedDates={markedDates}
          hideArrows={true}
          dayComponent={renderDayComponent}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: sectionTitleColor,
            selectedDayBackgroundColor: activeColor,
            selectedDayTextColor: "#ffffff",
            todayTextColor: activeColor,
            dayTextColor: dayTextColor,
            textDisabledColor: disabledTextColor,
            dotColor: activeColor,
            selectedDotColor: "#ffffff",
            monthTextColor: activeColor,
            indicatorColor: activeColor,
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
  },
  // Custom comparison: only re-render if this month's data actually changed
  (prevProps, nextProps) => {
    const prevMonth = prevProps.monthDate.slice(0, 7);
    const nextMonth = nextProps.monthDate.slice(0, 7);

    // Check if selection moved in or out of this month
    const prevSelectedInMonth = prevProps.selectedDate.startsWith(prevMonth);
    const nextSelectedInMonth = nextProps.selectedDate.startsWith(nextMonth);

    if (prevSelectedInMonth !== nextSelectedInMonth) return false;
    if (prevSelectedInMonth && prevProps.selectedDate !== nextProps.selectedDate)
      return false;

    // Check if colors changed
    if (prevProps.activeColor !== nextProps.activeColor) return false;
    if (prevProps.dayTextColor !== nextProps.dayTextColor) return false;
    if (prevProps.disabledTextColor !== nextProps.disabledTextColor) return false;
    if (prevProps.sectionTitleColor !== nextProps.sectionTitleColor) return false;

    // Check if holiday marks for this month changed
    if (prevProps.holidayMarks !== nextProps.holidayMarks) {
      const prevKeys = Object.keys(prevProps.holidayMarks).filter((k) =>
        k.startsWith(prevMonth)
      );
      const nextKeys = Object.keys(nextProps.holidayMarks).filter((k) =>
        k.startsWith(nextMonth)
      );
      if (prevKeys.length !== nextKeys.length) return false;
      for (const key of prevKeys) {
        if (prevProps.holidayMarks[key] !== nextProps.holidayMarks[key])
          return false;
      }
    }

    return true;
  }
);
