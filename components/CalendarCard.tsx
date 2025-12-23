import { CURRENT_MONTH_INDEX } from "@/constants/calendar";
import { darkModeColors, lightModeColors } from "@/constants/prayers";
import { generateCarouselMonths } from "@/utils/calendarHelpers";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Dimensions, View } from "react-native";
import { Carousel } from "react-native-ui-lib";
import { MonthCalendar } from "./MonthCalendar";

const { width } = Dimensions.get("window");

interface CalendarCardProps {
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
  holidayMarks: Record<string, any>;
  colors: { active: string; inactive: string };
  isDarkMode?: boolean;
}

export interface CalendarCardRef {
  scrollToToday: () => void;
}

export const CalendarCard = forwardRef<CalendarCardRef, CalendarCardProps>(
  (
    { selectedDate, onDayPress, holidayMarks, colors, isDarkMode = false },
    ref
  ) => {
    type CarouselHandle = React.ComponentRef<typeof Carousel>;
    const carouselRef = useRef<CarouselHandle | null>(null);

    const months = useMemo(() => generateCarouselMonths(), []);

    useImperativeHandle(ref, () => ({
      scrollToToday: () => {
        carouselRef.current?.goToPage?.(CURRENT_MONTH_INDEX, true);
      },
    }));

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
        className="rounded-3xl overflow-hidden pt-4"
        style={{ width: width, height: width, backgroundColor: bgColor }}
      >
        <Carousel
          ref={carouselRef}
          containerStyle={{ width: width, height: width - 40, marginLeft: 0 }}
          pageWidth={width}
          initialPage={CURRENT_MONTH_INDEX}
          containerMarginHorizontal={0}
          itemSpacings={0}
        >
          {months.map((monthDate) => (
            <MonthCalendar
              key={monthDate}
              monthDate={monthDate}
              holidayMarks={holidayMarks}
              selectedDate={selectedDate}
              onDayPress={onDayPress}
              activeColor={colors.active}
              dayTextColor={dayTextColor}
              disabledTextColor={disabledTextColor}
              sectionTitleColor={sectionTitleColor}
            />
          ))}
        </Carousel>
      </View>
    );
  }
);

CalendarCard.displayName = "CalendarCard";
