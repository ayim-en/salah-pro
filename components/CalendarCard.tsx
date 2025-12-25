import { CURRENT_MONTH_INDEX } from "@/constants/calendar";
import { darkModeColors, lightModeColors } from "@/constants/prayers";
import { useAnimatedBackgroundColor } from "@/hooks/useAnimatedColor";
import { generateCarouselMonths } from "@/utils/calendarHelpers";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";
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
    const animatedBgStyle = useAnimatedBackgroundColor(bgColor);
    const dayTextColor = isDarkMode ? darkModeColors.text : colors.active;
    const disabledTextColor = isDarkMode
      ? darkModeColors.disabledText
      : lightModeColors.disabledText;
    const sectionTitleColor = isDarkMode
      ? darkModeColors.sectionTitle
      : lightModeColors.sectionTitle;

    return (
      <Animated.View
        className="rounded-3xl overflow-hidden pt-4"
        style={[{ width: width, height: width }, animatedBgStyle]}
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
      </Animated.View>
    );
  }
);

CalendarCard.displayName = "CalendarCard";
