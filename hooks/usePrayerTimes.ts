import { getPrayerDict, PrayerDict } from "@/prayer-api/prayerTimesAPI";
import { getLocalISODate } from "@/utils/calendarHelpers";
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
  const now = new Date();
  const todayISO = getLocalISODate(now);
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

  // Updates nextPrayer when prayerDict changes and schedules update for next prayer time
  useEffect(() => {
    if (Object.keys(prayerDict).length === 0) return;

    const updateNextPrayer = () => {
      setNextPrayer(getNextPrayer(prayerDict));
    };

    // Initial update
    updateNextPrayer();

    // Schedule timeout for when the current next prayer time arrives
    const scheduleNextUpdate = () => {
      const current = getNextPrayer(prayerDict);
      if (!current?.time) return null;

      // Parse the prayer time (HH:MM format)
      const [hours, minutes] = current.time.split(":").map(Number);
      const now = new Date();
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      // If prayer time already passed today, it's for tomorrow
      if (prayerTime <= now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const msUntilPrayer = prayerTime.getTime() - now.getTime();

      // Add 1 second buffer to ensure we're past the prayer time
      return setTimeout(() => {
        updateNextPrayer();
        // Schedule the next one
        const nextTimeout = scheduleNextUpdate();
        if (nextTimeout) timeoutRef = nextTimeout;
      }, msUntilPrayer + 1000);
    };

    let timeoutRef = scheduleNextUpdate();

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
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
