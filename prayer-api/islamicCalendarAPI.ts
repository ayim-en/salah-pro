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
        return json.data;
    } catch (error) {
        console.error("Error fetching Hijri holidays:", error);
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
        return json.data;
    } catch (error) {
        console.error("Error fetching next Hijri holiday:", error);
        throw error;
    }
};