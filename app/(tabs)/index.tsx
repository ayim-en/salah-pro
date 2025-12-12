import { getPrayerDict, PrayerDict } from "@/prayer-api/prayerTimesAPI";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { Carousel, Icon } from "react-native-ui-lib";

const { width, height } = Dimensions.get("window");
const pageHeight = height * 0.45;
const pageWidth = width * 0.85;

const Prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

// Prayer icon mapping
const prayerIcons: Record<(typeof Prayers)[number], any> = {
  Fajr: require("../../assets/images/prayer-pro-icons/home-page/prayer-times/icon-fajr.png"),
  Sunrise: require("../../assets/images/prayer-pro-icons/home-page/prayer-times/icon-sunrise.png"),
  Dhuhr: require("../../assets/images/prayer-pro-icons/home-page/prayer-times/icon-dhuhr.png"),
  Asr: require("../../assets/images/prayer-pro-icons/home-page/prayer-times/icon-asr.png"),
  Maghrib: require("../../assets/images/prayer-pro-icons/home-page/prayer-times/icon-maghrib.png"),
  Isha: require("../../assets/images/prayer-pro-icons/home-page/prayer-times/icon-isha.png"),
};

// Prayer Time Helpers
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const cleanTimeString = (timeString: string): string => {
  return timeString.split(" ")[0]; // Removes the "(PDT)" suffix
};

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

export default function Index() {
  const [prayerDict, setPrayerDict] = useState<PrayerDict>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    Record<string, boolean>
  >({});
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationName, setLocationName] = useState<string>(
    "Loading location..."
  );

  // Load notification states from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem("prayerNotifications");
        if (savedNotifications) {
          setNotificationsEnabled(JSON.parse(savedNotifications));
        }
      } catch (error) {
        console.error("Failed to load notification settings:", error);
      }
    })();
  }, []);

  // Fetches current location on mount
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      } catch (err: any) {
        setError("Failed to get location");
        setLoading(false);
      }
    })();
  }, []);

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
        setError(err?.message ?? "Failed to fetch prayer times");
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  // Uses location data to get city and country name
  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const { city, country } = reverseGeocode[0];
          setLocationName(`${city || "Unknown"}, ${country || "Unknown"}`);
        }
      } catch (err) {
        setLocationName("Location unavailable");
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

  // Sets current page to today when initially loaded
  useEffect(() => {
    if (todayIndex > 0 && currentPage === 0) {
      setCurrentPage(todayIndex);
    }
  }, [todayIndex, currentPage]);

  // Prayer Notification Toggler
  const toggleNotification = async (prayer: string) => {
    setNotificationsEnabled((prev) => {
      const updated = { ...prev };
      updated[prayer] = !updated[prayer];
      
      // Save to AsyncStorage
      AsyncStorage.setItem("prayerNotifications", JSON.stringify(updated)).catch(
        (error: any) => console.error("Failed to save notification settings:", error)
      );
      
      return updated;
    });
  };

  if (loading) return <ActivityIndicator className="mt-12" />;
  if (error) return <Text className="color-red-600 m-4">{error}</Text>;

  return (
    <View className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      {/*// TODO: will change depending on upcoming prayer */}
      <Image
        source={require("../../assets/images/prayer-pro-bg/prayer-pro-bg-fajr.png")}
        className="absolute -top-[200]  left-0 w-full h-full"
      />
      {/* //TODO: background will change depending on upcoming prayer */}

      <View className="absolute left-0 right-0 justify-center items-center pt-24 mb-14">
        <Text className=" font-bold text-sm text-white">
          {nextPrayer
            ? `Upcoming Prayer: ${nextPrayer.prayer}`
            : "Loading prayer times..."}
        </Text>
        <Text className="font-extrabold text-white text-[80px]">
          {nextPrayer ? nextPrayer.time : "--:--"}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-bold text-white">{locationName}</Text>
          <Icon
            source={require("../../assets/images/prayer-pro-icons/home-page/icon-location.png")}
            size={12}
            tintColor="white"
          />
        </View>
      </View>
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ height: height * 0.5 }}
      ></View>
      <View className="pt-64 items-center mt-40 mb-12">
        <View
          className="relative"
          style={{ width: pageWidth, height: pageHeight }}
        >
          <Carousel
            containerStyle={{ height: pageHeight }}
            pageWidth={pageWidth + 10}
            onChangePage={(pageIndex) => setCurrentPage(pageIndex)}
            itemSpacings={10}
            initialPage={todayIndex}
          >
            {sortedDates.map((isoDate) => {
              const dayPrayers = prayerDict[isoDate];
              const isToday = isoDate === todayISO;

              return (
                <View
                  key={isoDate}
                  className="w-full h-full rounded-xl justify-start"
                >
                  <View className="mb-4">
                    <Text className="text-xl font-bold text-black">
                      {formatDate(isoDate)}
                    </Text>
                    {isToday && (
                      <Text className="text-xs font-semibold text-[#568FAF] mt-1">
                        TODAY
                      </Text>
                    )}
                  </View>

                  <View className="flex-1 justify-around">
                    {Prayers.map((prayer) => (
                      <View
                        key={prayer}
                        className="flex-row justify-between items-center py-2"
                      >
                        <View className="flex-row items-center gap-4">
                          <Icon
                            source={prayerIcons[prayer]}
                            size={24}
                            tintColor="#568FAF"
                          />
                          <Text className="text-base font-semibold text-gray-800">
                            {prayer}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-4">
                          <Text className="text-base text-gray-700">
                            {cleanTimeString(dayPrayers.timings[prayer])}
                          </Text>
                          <Pressable onPress={() => toggleNotification(prayer)}>
                            <Icon
                              source={
                                notificationsEnabled[prayer]
                                  ? require("../../assets/images/prayer-pro-icons/home-page/icon-notify-on.png")
                                  : require("../../assets/images/prayer-pro-icons/home-page/icon-notify-off.png")
                              }
                              size={24}
                              tintColor="#568FAF"
                            />
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </Carousel>
        </View>
      </View>
    </View>
  );
}
