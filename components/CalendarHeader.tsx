import { NextHijriHolidayData } from "@/prayer-api/islamicCalendarAPI";
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
  const holidayName = nextHoliday?.hijri?.holidays?.[0];

  return (
    <>
      <Image
        key={nextPrayer?.prayer}
        source={backgroundImage}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />

      <View className="absolute left-0 right-0 justify-center items-center pt-20 -mt-4">
        <Text className="font-extrabold text-white text-[90px]">
          {nextPrayer ? nextPrayer.time : "--:--"}
        </Text>
        <Text className="font-bold text-lg text-white">
          {nextHoliday ? "Upcoming Holiday:" : "Loading upcoming holiday..."}
        </Text>
        {nextHoliday && (
          <Text className="font-bold text-lg text-white">
            {holidayName ?? "TBD"}
          </Text>
        )}
      </View>
    </>
  );
};
