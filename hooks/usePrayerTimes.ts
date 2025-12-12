import { getPrayerDict, PrayerDict } from "@/prayer-api/prayerTimesAPI";
import { getNextPrayer } from "@/utils/prayerHelpers";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";

export const usePrayerTimes = (location: Location.LocationObject | null) => {
  const [prayerDict, setPrayerDict] = useState<PrayerDict>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetches prayer times when location changes
  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        // based off Prayer times for a Gregorian month API
        const baseUrl = "https://api.aladhan.com/v1/";
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const data = await getPrayerDict(baseUrl, year, month, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          method: 2,
          school: 0,
        });
        setPrayerDict(data);
      } catch (err: any) {
        const errorMessage = err?.message ?? "Failed to fetch prayer times";
        console.error("Prayer times fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  // Sorts prayerDict dates in numerical order which is chronological for ISO strings
  const sortedDates = useMemo(
    () => Object.keys(prayerDict).sort(),
    [prayerDict]
  );

  // Finds index of today's date using ISO string
  const todayISO = new Date().toISOString().slice(0, 10);
  const todayIndex = useMemo(
    () =>
      Math.max(
        0,
        sortedDates.findIndex((d) => d === todayISO)
      ),
    [sortedDates, todayISO]
  );

  // State that holds the next upcoming prayer and its time
  const [nextPrayer, setNextPrayer] = useState<{
    prayer: string;
    time: string;
  } | null>(null);

  // Updates nextPrayer when prayerDict changes
  useEffect(() => {
    if (Object.keys(prayerDict).length > 0) {
      setNextPrayer(getNextPrayer(prayerDict));
    }
  }, [prayerDict]);

  // Updates nextPrayer when prayer screen is focused
  useFocusEffect(
    useCallback(() => {
      if (Object.keys(prayerDict).length > 0) {
        setNextPrayer(getNextPrayer(prayerDict));
      }
    }, [prayerDict])
  );

  return {
    prayerDict,
    loading,
    error,
    sortedDates,
    todayISO,
    todayIndex,
    nextPrayer,
  };
};
