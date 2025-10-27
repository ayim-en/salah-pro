// Georgorian month prayer api types
export type Timings = {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    };

type HijriDesignation = { abbreviated: string; expanded: string; };

type DayItem = {
    timings: Record<string, string>;
    date: {
        gregorian: {
            date: string;
            weekday: { en: string};
            };
        hijri: {
            date: string;
            designation: HijriDesignation;
        };
    };
};

export type PrayerDay = {
    timings: Timings;
    gregorianDate: string; // DD-MM-YYYY
    hijriDate: string;
    weekday: string;
    designation: HijriDesignation;
}

export type PrayerTimesResponse = {
    code: number;
    status: string;
    data: DayItem[];
};

export type PrayerDict = Record<string, PrayerDay>; // key is ISO date string (YYYY-MM-DD)

// Convert Gregorian date string to ISO format (YYYY-MM-DD)
// ISO date works better as a key for the dictionary
const gregorianDateToISO = (gregorianDate: string) => {
    const [day, month, year] = gregorianDate.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Transform API response to dictionary
export const transformPrayerDict = (dataArray: DayItem[]): PrayerDict => 
    dataArray.reduce<PrayerDict>((acc, item) => {
        const key = gregorianDateToISO(item.date.gregorian.date);
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = item.timings; // Could add Sunrise here

        acc[key] = {
            timings: { Fajr, Dhuhr, Asr, Maghrib, Isha },
            gregorianDate: item.date.gregorian.date,
            hijriDate: item.date.hijri.date,
            weekday: item.date.gregorian.weekday.en,
            designation: item.date.hijri.designation,
        };
        return acc;
}, {});

export type PrayerTimesParams = {
    latitude: number;
    longitude: number;

    method?: number; 
    tune?: string;
    school?: 0 | 1; // 0 for Shafi, 1 for Hanafi
};

export const getPrayerDict = async (
    baseUrl: string,
    year: number,
    month: number,
    params: PrayerTimesParams
    
    ): Promise<PrayerDict> => {
        const url = new URL(`${baseUrl}/calendar/${year}/${month}`);
        const queryParams = new URLSearchParams();

        queryParams.append('latitude', params.latitude.toString());
        queryParams.append('longitude', params.longitude.toString());

        // Optional parameters
        if (params.method !== undefined) {
            queryParams.append('method', params.method.toString());
        }
        if (params.tune) {
            queryParams.append('tune', params.tune);
        }
        if (params.school !== undefined) {
            queryParams.append('school', params.school.toString());
        }

        url.search = queryParams.toString();
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Error fetching prayer times: ${response.statusText}`);
        }
        
        const data: PrayerTimesResponse = await response.json();
        if (data.code !== 200) {
            throw new Error(`API error: ${data.status}`);
        }
        return transformPrayerDict(data.data);
};