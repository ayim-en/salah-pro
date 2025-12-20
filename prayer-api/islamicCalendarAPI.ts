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