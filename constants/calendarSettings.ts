// Calendar calculation settings constants

export type CalendarMethodId = "HJCoSA" | "UAQ" | "DIYANET" | "MATHEMATICAL";

export type CalendarMethodOption = {
  id: CalendarMethodId;
  name: string;
  description: string;
};

// All 4 calendar calculation methods from aladhan.com API
export const CALENDAR_METHODS: CalendarMethodOption[] = [
  {
    id: "HJCoSA",
    name: "Saudi Arabia (HJCoSA)",
    description: "High Judiciary Council of Saudi Arabia",
  },
  {
    id: "UAQ",
    name: "Umm Al Qura",
    description: "Astronomical calculation",
  },
  {
    id: "DIYANET",
    name: "Turkey (Diyanet)",
    description: "Turkish Diyanet calculation",
  },
  {
    id: "MATHEMATICAL",
    name: "Mathematical",
    description: "Supports day adjustment",
  },
];

export type CarouselDateFormat = "gregorian" | "hijri";

// Default settings
export const DEFAULT_CALENDAR_SETTINGS = {
  calendarMethod: "HJCoSA" as CalendarMethodId,
  adjustment: 0,
  carouselDateFormat: "gregorian" as CarouselDateFormat,
};

export type CalendarSettings = typeof DEFAULT_CALENDAR_SETTINGS;
