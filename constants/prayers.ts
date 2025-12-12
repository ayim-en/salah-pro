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
