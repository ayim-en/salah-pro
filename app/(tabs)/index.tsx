import { getPrayerDict, PrayerDict } from "@/prayer-api/prayerTimesAPI";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const carouselMargin = 32;
const pageWidth = width - carouselMargin;
const pageHeight = pageWidth * 1.1; // Slightly reduced height ratio to accommodate bottom margin

const Prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type FardPrayers = (typeof Prayers)[number];

type PrayerRow = { id: string; prayer: FardPrayers; time: string };

const cleanTimeString = (timeString: string): string => {
  return timeString.split(" ")[0]; // Removes the "(PDT)" suffix
};

// const PrayerItem = ({ item }: { item: { prayer: string; time: string } }) => (
//   <View className="flex-1 flex-row justify-between items-center bg-white px-8 py-6">
//     <Text className="text-lg font-semibold">{item.prayer}</Text>
//     <Text className="text-lg">{cleanTimeString(item.time)}</Text>
//   </View>
// );

const prayerTimeToMinutes = (prayerTime: string): number => {
  const cleanedPrayerTime = prayerTime.split(" ")[0];
  const [hours, minutes] = cleanedPrayerTime.split(":").map(Number);
  return hours * 60 + minutes;
};

const getNextPrayer = (
  prayerDict: PrayerDict
): { prayer: string; time: string } | null => {
  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayPrayers = prayerDict[todayISO];
  if (!todayPrayers) return null;

  for (const prayer of Prayers) {
    const prayerTime = todayPrayers.timings[prayer];
    const prayerMinutes = prayerTimeToMinutes(prayerTime);

    if (prayerMinutes > currentMinutes) {
      return { prayer, time: cleanTimeString(prayerTime) };
    }
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowISO = tomorrow.toISOString().slice(0, 10);
  const tomorrowPrayers = prayerDict[tomorrowISO];

  if (tomorrowPrayers) {
    return {
      prayer: "Fajr",
      time: cleanTimeString(tomorrowPrayers.timings.Fajr),
    };
  }

  return null;
};

export default function Index() {
  const [prayerDict, setPrayerDict] = useState<PrayerDict>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<string> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const baseUrl = "https://api.aladhan.com/v1/";
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const data = await getPrayerDict(baseUrl, year, month, {
          latitude: 47.6062,
          longitude: -122.3321,
          method: 2,
          school: 0,
        });
        setPrayerDict(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to fetch prayer times");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedDates = useMemo(
    () => Object.keys(prayerDict).sort(),
    [prayerDict]
  );
  const todayISO = new Date().toISOString().slice(0, 10);
  const todayIndex = useMemo(
    () =>
      Math.max(
        0,
        sortedDates.findIndex((d) => d === todayISO)
      ),
    [sortedDates, todayISO]
  );
  const nextPrayer = useMemo(() => getNextPrayer(prayerDict), [prayerDict]);

  // const convertToPrayerRows = (isoDate: string): PrayerRow[] => {
  //   const day = prayerDict[isoDate];
  //   if (!day) return [];
  //   return Prayers.map((prayerName) => ({
  //     id: `${isoDate}-${prayerName}`,
  //     prayer: prayerName,
  //     time: day.timings[prayerName as keyof Timings],
  //   }));
  // };

  if (loading) return <ActivityIndicator className="mt-12" />;
  if (error) return <Text className="color-red-600 m-4">{error}</Text>;

  return (
    <View className="flex-1 bg-blue-500">
      <Image
        source={require("../../assets/images/prayer-pro-bg/prayer-pro-bg-fajr.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      {/* //TODO: background will change depending on upcoming prayer*/}

      <View className="absolute left-0 right-0 justify-center items-center pt-24 mb-14">
        <Text className=" font-bold text-sm text-white">
          {nextPrayer
            ? `Upcoming Prayer: ${nextPrayer.prayer}`
            : "Loading prayer times..."}
        </Text>
        <Text className="font-extrabold text-white text-[80px]">
          {nextPrayer ? nextPrayer.time : "--:--"}
        </Text>
        <Text className="text-sm font-bold text-white">Tokyo, Japan</Text>
      </View>
      {/* //Todo: Replace With Current Location and Add compass icon*/}

      <View className="pt-64 items-center mt-32" style={{ marginBottom: 48 }}>
        <View
          className="relative"
          style={{ width: pageWidth, height: pageHeight }}
        ></View>
      </View>
    </View>
  );
}
