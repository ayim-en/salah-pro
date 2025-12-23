import { FUTURE_MONTHS, PAST_MONTHS } from "@/constants/calendar";
import { INCLUDED_HOLIDAYS } from "@/constants/holidays";
import { CalendarDay } from "@/prayer-api/islamicCalendarAPI";

// Label used for the voluntary first six days of Shawwal
const SHAWWAL_SIX_DAYS = "Six Days of Shawwal";

// Convert DD-MM-YYYY format to YYYY-MM-DD format
export const convertDDMMYYYYToISO = (ddmmyyyyDate: string): string => {
  const [day, month, year] = ddmmyyyyDate.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Get ISO date (YYYY-MM-DD) for a given Date in local time
export const getLocalISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Get the current local date as ISO string (YYYY-MM-DD)
export const getTodayISO = (): string => {
  return getLocalISODate(new Date());
};

// Generate array of months to fetch for the current calendar year and next year
export const getMonthsForCurrentYear = (): { month: number; year: number }[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const monthsToFetch = [];

  // Fetch all months for current year
  for (let month = 1; month <= 12; month++) {
    monthsToFetch.push({
      month,
      year: currentYear
    });
  }

  // Also fetch all months for next year so a holiday will be displayed at the end of the year
  for (let month = 1; month <= 12; month++) {
    monthsToFetch.push({
      month,
      year: currentYear + 1
    });
  }

  return monthsToFetch;
};

// Check if a calendar day has any included holidays
export const hasIncludedHoliday = (day: CalendarDay): boolean => {
  const allHolidays = [...day.hijri.holidays, ...day.hijri.adjustedHolidays];
  if (allHolidays.some((holiday) => INCLUDED_HOLIDAYS.includes(holiday))) {
    return true;
  }

  // Manually mark the first six days of Shawwal as holidays (not provided by API)
  const [dayNumStr, monthStr] = day.hijri.date.split("-");
  const dayNum = parseInt(dayNumStr, 10);
  return monthStr === "10" && dayNum >= 1 && dayNum <= 6;
};

// Filter included holidays from a calendar day
export const getIncludedHolidaysFromDay = (day: CalendarDay): string[] => {
  const allHolidays = [...day.hijri.holidays, ...day.hijri.adjustedHolidays];
  const included = allHolidays.filter((h) => INCLUDED_HOLIDAYS.includes(h));

  // Add manual Shawwal entries when applicable
  const [dayNumStr, monthStr] = day.hijri.date.split("-");
  const dayNum = parseInt(dayNumStr, 10);
  if (monthStr === "10" && dayNum >= 2 && dayNum <= 6) {
    included.push(SHAWWAL_SIX_DAYS);
  }

  return included;
};

// Find the next upcoming holiday from a list of calendar days
export const findNextUpcomingHoliday = (days: CalendarDay[]): CalendarDay | null => {
  const todayISO = getTodayISO();

  const upcomingHolidays = days.filter(day => {
    const dayDate = convertDDMMYYYYToISO(day.gregorian.date);
    if (dayDate < todayISO) return false;
    return hasIncludedHoliday(day);
  });

  return upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;
};

// Generate array of month strings (YYYY-MM-DD format for first day of each month)
// Used for calendar carousel
export const generateCarouselMonths = (): string[] => {
  const months: string[] = [];
  const today = new Date();

  for (let i = -PAST_MONTHS; i <= FUTURE_MONTHS; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}-01`);
  }

  return months;
};
