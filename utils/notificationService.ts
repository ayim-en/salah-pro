import { Prayers } from "@/constants/prayers";
import { PrayerDict } from "@/prayer-api/prayerTimesAPI";
import { getLocalISODate } from "@/utils/calendarHelpers";
import { parsePrayerTime } from "@/utils/prayerHelpers";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permissions not granted");
    return false;
  }

  // Required for Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("prayer-notifications", {
      name: "Prayer Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
};

// Schedule a notification for a specific prayer
export const schedulePrayerNotification = async (
  prayer: string,
  prayerTime: Date,
  isoDate: string
): Promise<string | null> => {
  try {
    // Don't schedule if the time has already passed
    if (prayerTime <= new Date()) {
      return null;
    }

    // Sunrise is not a prayer, so use different wording
    const isSunrise = prayer === "Sunrise";
    const title = isSunrise ? "Sunrise" : `${prayer} Prayer Time`;
    const body = isSunrise
      ? "The sun is rising — Fajr prayer time has ended"
      : `It's time for ${prayer} prayer`;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        data: { prayer, date: isoDate },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: prayerTime,
        channelId: Platform.OS === "android" ? "prayer-notifications" : undefined,
      },
    });

    return identifier;
  } catch (error) {
    console.error(`Failed to schedule notification for ${prayer}:`, error);
    return null;
  }
};

// Cancel all notifications for a specific prayer
export const cancelPrayerNotifications = async (prayer: string): Promise<void> => {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.data?.prayer === prayer) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    }
  } catch (error) {
    console.error(`Failed to cancel notifications for ${prayer}:`, error);
  }
};

// Schedule notifications for all enabled prayers based on prayer times
export const scheduleAllPrayerNotifications = async (
  prayerDict: PrayerDict,
  enabledPrayers: Record<string, boolean>
): Promise<void> => {
  // Cancel all existing prayer notifications first
  await cancelAllPrayerNotifications();

  const now = new Date();
  const todayISO = getLocalISODate(now);

  // Get sorted dates from today onwards
  const sortedDates = Object.keys(prayerDict)
    .filter((date) => date >= todayISO)
    .sort();

  // Schedule for 10 days (6 prayers × 10 days = 60 notifications, under iOS 64 limit)
  const datesToSchedule = sortedDates.slice(0, 10);

  for (const isoDate of datesToSchedule) {
    const dayPrayers = prayerDict[isoDate];
    if (!dayPrayers) continue;

    for (const prayer of Prayers) {
      // Skip if notification is not enabled for this prayer
      if (!enabledPrayers[prayer]) continue;

      const timeString = dayPrayers.timings[prayer];
      if (!timeString) continue;

      const prayerTime = parsePrayerTime(isoDate, timeString);
      await schedulePrayerNotification(prayer, prayerTime, isoDate);
    }
  }

  // Schedule a reminder notification on day 9 to prompt user to open the app
  await scheduleReminderNotification(sortedDates[8]);
};

// Schedule a reminder notification to open the app
const scheduleReminderNotification = async (isoDate: string): Promise<void> => {
  if (!isoDate) return;

  try {
    // Schedule for 12:00 PM on the reminder day
    const reminderTime = new Date(`${isoDate}T12:00:00`);

    // Don't schedule if the time has already passed
    if (reminderTime <= new Date()) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Open Fardh: Islamic Prayer App",
        body: "Open the app to continue receiving prayer notifications",
        sound: "default",
        data: { type: "reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
        channelId: Platform.OS === "android" ? "prayer-notifications" : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to schedule reminder notification:", error);
  }
};

// Cancel all prayer notifications
export const cancelAllPrayerNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Failed to cancel all notifications:", error);
  }
};

// Get all currently scheduled notifications (useful for debugging)
export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

// Send a test notification in 5 seconds
export const sendTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Prayer Time",
      body: "It's time for test prayer",
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
  console.log("Test notification scheduled for 5 seconds from now");
};
