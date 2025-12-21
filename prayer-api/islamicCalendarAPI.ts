import { INCLUDED_HOLIDAYS } from "@/constants/holidays";
import {
  getMonthsForCurrentYear,
  findNextUpcomingHoliday,
  getIncludedHolidaysFromDay,
} from "@/utils/calendarHelpers";

// Hijri Holidays by year
// get /islamicHolidaysByHijriYear/{year}

export interface HolidayData {
    year: number;
    holidays: string[];
}

export interface HolidayResponse {
    code: number;
    status: string;
    data: HolidayData;
}

// Calendar day interface
export interface CalendarDay {
    hijri: {
        date: string;
        holidays: string[];
        adjustedHolidays: string[];
    };
    gregorian: {
        date: string;
        day: string;
        month: {
            number: number;
            en: string;
        };
        year: string;
    };
}

export interface CalendarResponse {
    code: number;
    status: string;
    data: CalendarDay[];
}

export interface NextHijriHolidayResponse {
    code: number;
    status: string;
    data: {
        gregorian: {
            date: string;
            holidays?: string[];
            adjustedHolidays?: string[];
        };
        hijri?: {
            holidays?: string[];
            adjustedHolidays?: string[];
        };
    };
}
export type NextHijriHolidayData = NextHijriHolidayResponse["data"];

export const fetchHijriHolidaysByYear = async (year: number): Promise<HolidayData> => {
    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/islamicHolidaysByHijriYear/${year}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: HolidayResponse = await response.json();
        
        // Filter holidays to only include those in INCLUDED_HOLIDAYS
        const filteredHolidays = json.data.holidays.filter(holiday => 
            INCLUDED_HOLIDAYS.includes(holiday)
        );
        
        return {
            ...json.data,
            holidays: filteredHolidays
        };
    } catch (error) {
        console.error("Error fetching Hijri holidays:", error);
        throw error;
    }
};

// Fetch Hijri calendar by Gregorian month and year
export const fetchHijriCalendar = async (
    month: number,
    year: number,
    options?: {
        calendarMethod?: "HJCoSA" | "UAQ" | "DIYANET" | "MATHEMATICAL";
    }
): Promise<CalendarDay[]> => {
    const params = new URLSearchParams();
    if (options?.calendarMethod) {
        params.append("method", options.calendarMethod);
    }

    const queryString = params.toString();
    const url = `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}${queryString ? `?${queryString}` : ""}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: CalendarResponse = await response.json();
        return json.data;
    } catch (error) {
        console.error("Error fetching Hijri calendar:", error);
        throw error;
    }
};

// Get the next included holiday from the calendar
export const fetchNextIncludedHijriHoliday = async (options?: {
    calendarMethod?: "HJCoSA" | "UAQ" | "DIYANET" | "MATHEMATICAL";
}): Promise<NextHijriHolidayData | null> => {
    try {
        // Get months to fetch for current calendar year
        const monthsToFetch = getMonthsForCurrentYear();

        // Fetch each month's calendar
        const calendars = await Promise.all(
            monthsToFetch.map(({ month, year }) => 
                fetchHijriCalendar(month, year, options)
            )
        );
        const allDays = calendars.flat();

        // Find the next upcoming holiday
        const nextDay = findNextUpcomingHoliday(allDays);
        
        if (nextDay) {
            const includedHolidays = getIncludedHolidaysFromDay(nextDay);

            return {
                gregorian: {
                    date: nextDay.gregorian.date, // Keep DD-MM-YYYY format for formatHijriDate
                    holidays: includedHolidays
                },
                hijri: {
                    holidays: includedHolidays
                }
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching next included Hijri holiday:", error);
        throw error;
    }
};

// Next upcoming Hijri holiday - GET /nextHijriHoliday
export const fetchNextHijriHoliday = async (options?: {
    calendarMethod?: "HJCoSA" | "UAQ" | "DIYANET" | "MATHEMATICAL";
}): Promise<NextHijriHolidayData> => {
    const params = new URLSearchParams();

    if (options?.calendarMethod) {
        params.append("calendarMethod", options.calendarMethod);
    }

    const queryString = params.toString();
    const url = `https://api.aladhan.com/v1/nextHijriHoliday${queryString ? `?${queryString}` : ""}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: NextHijriHolidayResponse = await response.json();
        
        // Filter holidays to only include those in INCLUDED_HOLIDAYS
        const filteredData = { ...json.data };
        
        if (filteredData.gregorian.holidays) {
            filteredData.gregorian.holidays = filteredData.gregorian.holidays.filter(
                holiday => INCLUDED_HOLIDAYS.includes(holiday)
            );
        }
        
        if (filteredData.gregorian.adjustedHolidays) {
            filteredData.gregorian.adjustedHolidays = filteredData.gregorian.adjustedHolidays.filter(
                holiday => INCLUDED_HOLIDAYS.includes(holiday)
            );
        }
        
        if (filteredData.hijri?.holidays) {
            filteredData.hijri.holidays = filteredData.hijri.holidays.filter(
                holiday => INCLUDED_HOLIDAYS.includes(holiday)
            );
        }
        
        if (filteredData.hijri?.adjustedHolidays) {
            filteredData.hijri.adjustedHolidays = filteredData.hijri.adjustedHolidays.filter(
                holiday => INCLUDED_HOLIDAYS.includes(holiday)
            );
        }
        
        return filteredData;
    } catch (error) {
        console.error("Error fetching next Hijri holiday:", error);
        throw error;
    }
};
