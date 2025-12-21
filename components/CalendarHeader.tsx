import { NextHijriHolidayData } from "@/prayer-api/islamicCalendarAPI";
import { formatHijriDate } from "@/utils/prayerHelpers";
import React from "react";
import { Image, Text, View } from "react-native";

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
      <Image
        key={nextPrayer?.prayer}
        source={backgroundImage}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />

      <View className="absolute left-0 right-0 justify-center items-center pt-24">
        <Text className="font-bold text-2xl text-white text-center">
          {nextHoliday
            ? hasHoliday
              ? "Upcoming Holiday:"
              : "No Upcoming Holiday"
            : "Loading upcoming holiday..."}
        </Text>
        {nextHoliday && hasHoliday && (
          <>
            <Text className="font-bold text-3xl text-white text-center">
              {holidayName}
            </Text>
            <Text className="font-bold text-2xl text-white text-center">
              {formatHijriDate(nextHoliday.gregorian.date)}
            </Text>
          </>
        )}
      </View>
    </>
  );
};
