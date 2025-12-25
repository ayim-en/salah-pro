import { NextHijriHolidayData } from "@/prayer-api/islamicCalendarAPI";
import { formatHijriDate } from "@/utils/prayerHelpers";
import React from "react";
import { Text, View } from "react-native";
import { AnimatedCrossfadeImage } from "./AnimatedCrossfadeImage";

interface CalendarHeaderProps {
  nextPrayer: { prayer: string; time: string } | null;
  locationName: string;
  backgroundImage: any;
  nextHoliday: NextHijriHolidayData | null;
}

export const CalendarHeader = ({
  nextPrayer,
  locationName,
  backgroundImage,
  nextHoliday,
}: CalendarHeaderProps) => {
  const holidayName =
    nextHoliday?.hijri?.holidays?.[0] || nextHoliday?.gregorian?.holidays?.[0];
  const hasHoliday = holidayName !== undefined;

  return (
    <>
      <AnimatedCrossfadeImage source={backgroundImage} resizeMode="cover" />

      <View className="absolute left-0 right-0 justify-center items-center pt-20 gap-2">
        <Text
          className="font-bold text-3xl text-white text-center"
          style={{
            textShadowColor: "rgba(0,0,0,0.3)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {nextHoliday
            ? hasHoliday
              ? "Upcoming Holiday:"
              : "No Upcoming Holiday"
            : "Loading upcoming holiday..."}
        </Text>
        {nextHoliday && hasHoliday && (
          <>
            <Text
              className="font-bold text-5xl text-white text-center"
              style={{
                textShadowColor: "rgba(0,0,0,0.4)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {holidayName}
            </Text>
            <Text
              className="font-bold text-3xl text-white text-center"
              style={{
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {formatHijriDate(nextHoliday.gregorian.date)}
            </Text>
          </>
        )}
      </View>
    </>
  );
};
