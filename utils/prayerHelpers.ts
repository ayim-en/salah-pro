import { Prayers } from "@/constants/prayers";
import { PrayerDict } from "@/prayer-api/prayerTimesAPI";

// Formats ISO date string for display
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

// Removes timezone suffix from time string
export const cleanTimeString = (timeString: string): string => {
  return timeString.split(" ")[0]; // e.g., "05:30 (GMT)" -> "05:30"
};

// Converts prayer time to minutes for comparison
export const prayerTimeToMinutes = (prayerTime: string): number => {
  const cleanedPrayerTime = prayerTime.split(" ")[0];
  const [hours, minutes] = cleanedPrayerTime.split(":").map(Number);
  return hours * 60 + minutes;
};

// Determines the next upcoming prayer based on current time
export const getNextPrayer = (
  prayerDict: PrayerDict
): { prayer: string; time: string } | null => {
  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayPrayers = prayerDict[todayISO];
  if (!todayPrayers) return null;

  // Removes Sunrise from the upcoming prayers logic
  const fardPrayers = Prayers.filter((p) => p !== "Sunrise");

  for (const prayer of fardPrayers) {
    const prayerTime = todayPrayers.timings[prayer];
    const prayerMinutes = prayerTimeToMinutes(prayerTime);

    if (prayerMinutes > currentMinutes) {
      return { prayer, time: cleanTimeString(prayerTime) };
    }
  }

  // If no more prayers today, return Fajr of tomorrow
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
