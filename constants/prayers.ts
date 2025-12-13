// adjust Sunrise inclusion here
export const Prayers = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
] as const;

export type Prayer = (typeof Prayers)[number];

// Mapping of prayers to their icons
export const prayerIcons: Record<Prayer, any> = {
  Fajr: require("../assets/images/prayer-pro-icons/home-page/prayer-times/icon-fajr.png"),
  Sunrise: require("../assets/images/prayer-pro-icons/home-page/prayer-times/icon-sunrise.png"),
  Dhuhr: require("../assets/images/prayer-pro-icons/home-page/prayer-times/icon-dhuhr.png"),
  Asr: require("../assets/images/prayer-pro-icons/home-page/prayer-times/icon-asr.png"),
  Maghrib: require("../assets/images/prayer-pro-icons/home-page/prayer-times/icon-maghrib.png"),
  Isha: require("../assets/images/prayer-pro-icons/home-page/prayer-times/icon-isha.png"),
};

// Mapping of prayers to their background images
export const prayerBackgrounds: Record<string, any> = {
  Fajr: require("../assets/images/prayer-pro-bg/prayer-pro-bg-fajr.png"),
  Sunrise: require("../assets/images/prayer-pro-bg/prayer-pro-bg-sunrise.png"),
  Dhuhr: require("../assets/images/prayer-pro-bg/prayer-pro-bg-dhur.png"),
  Asr: require("../assets/images/prayer-pro-bg/prayer-pro-bg-asr.png"),
  Maghrib: require("../assets/images/prayer-pro-bg/prayer-pro-bg-maghrib.png"),
  Isha: require("../assets/images/prayer-pro-bg/prayer-pro-bg-isha.png"),
};
