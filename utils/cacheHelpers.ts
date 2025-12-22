import { CalendarDay } from "@/prayer-api/islamicCalendarAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CALENDAR_CACHE_KEY = 'calendar_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
    data: CalendarDay[];
    timestamp: number;
}

export const getCachedCalendar = async (): Promise<CalendarDay[] | null> => {
    try {
        const cached = await AsyncStorage.getItem(CALENDAR_CACHE_KEY);
        if (!cached || cached === 'undefined' || cached === 'null') {
            return null;
        }

        const cacheData: CacheData = JSON.parse(cached);
        if (!cacheData || !cacheData.data || !Array.isArray(cacheData.data)) {
            // Invalid cache structure, clear it
            await AsyncStorage.removeItem(CALENDAR_CACHE_KEY);
            return null;
        }
        
        const now = Date.now();
        const isExpired = now - cacheData.timestamp > CACHE_EXPIRY_MS;

        if (isExpired) {
            // Cache is stale, remove it
            await AsyncStorage.removeItem(CALENDAR_CACHE_KEY);
            return null;
        }

        return cacheData.data;
    } catch (error) {
        console.error("Error reading calendar cache:", error);
        // Clear potentially corrupted cache
        try {
            await AsyncStorage.removeItem(CALENDAR_CACHE_KEY);
        } catch {}
        return null;
    }
};

export const cacheCalendar = async (data: CalendarDay[]): Promise<void> => {
    try {
        const cacheData: CacheData = {
            data,
            timestamp: Date.now()
        };
        await AsyncStorage.setItem(CALENDAR_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error("Error caching calendar data:", error);
    }
};

export const clearCalendarCache = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CALENDAR_CACHE_KEY);
    } catch (error) {
        console.error("Error clearing calendar cache:", error);
    }
};
