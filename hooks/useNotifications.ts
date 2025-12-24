import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { PrayerDict } from "@/prayer-api/prayerTimesAPI";
import {
  requestNotificationPermissions,
  scheduleAllPrayerNotifications,
  cancelPrayerNotifications,
  schedulePrayerNotification,
} from "@/utils/notificationService";
import { getLocalISODate } from "@/utils/calendarHelpers";
import { parsePrayerTime } from "@/utils/prayerHelpers";

export const useNotifications = (prayerDict: PrayerDict = {}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    Record<string, boolean>
  >({});
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Load notification states from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem(
          "prayerNotifications"
        );
        if (savedNotifications) {
          setNotificationsEnabled(JSON.parse(savedNotifications));
        }
      } catch (err: any) {
        console.error(
          "Failed to load notification settings:",
          err?.message ?? err
        );
      }
    })();
  }, []);

  // Request permissions on first interaction
  const ensurePermissions = useCallback(async (): Promise<boolean> => {
    if (permissionGranted) return true;

    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
    return granted;
  }, [permissionGranted]);

  // Schedule notifications when prayer times or enabled prayers change
  useEffect(() => {
    if (
      Object.keys(prayerDict).length > 0 &&
      Object.values(notificationsEnabled).some((enabled) => enabled)
    ) {
      scheduleAllPrayerNotifications(prayerDict, notificationsEnabled);
    }
  }, [prayerDict, notificationsEnabled]);

  // Toggles notification states for each prayer
  const toggleNotification = async (prayer: string) => {
    // Request permission if enabling a notification
    const willBeEnabled = !notificationsEnabled[prayer];

    if (willBeEnabled) {
      const hasPermission = await ensurePermissions();
      if (!hasPermission) {
        console.log("Notification permission denied");
        return;
      }
    }

    // Update state
    const updated = { ...notificationsEnabled, [prayer]: willBeEnabled };
    setNotificationsEnabled(updated);

    // Store notification states in AsyncStorage
    try {
      await AsyncStorage.setItem("prayerNotifications", JSON.stringify(updated));
    } catch (err: any) {
      console.error("AsyncStorage save error:", err?.message ?? err);
    }

    // Schedule or cancel notifications for this specific prayer
    if (willBeEnabled && Object.keys(prayerDict).length > 0) {
      // Schedule notifications for this prayer
      const now = new Date();
      const todayISO = getLocalISODate(now);
      const sortedDates = Object.keys(prayerDict)
        .filter((date) => date >= todayISO)
        .sort()
        .slice(0, 7);

      for (const isoDate of sortedDates) {
        const dayPrayers = prayerDict[isoDate];
        const timings = dayPrayers?.timings as Record<string, string> | undefined;
        if (timings?.[prayer]) {
          const prayerTime = parsePrayerTime(isoDate, timings[prayer]);
          await schedulePrayerNotification(prayer, prayerTime, isoDate);
        }
      }
    } else {
      // Cancel notifications for this prayer
      await cancelPrayerNotifications(prayer);
    }
  };

  return { notificationsEnabled, toggleNotification, permissionGranted };
};
