// Using Qibla direction
// get /qibla/{latitude}/{longitude}

export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number; // Qibla direction in degrees from North
}

export interface QiblaResponse {
  code: number;
  status: string;
  data: QiblaData;
}

export const fetchQiblaDirection = async (
  latitude: number,
  longitude: number
): Promise<QiblaData> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: QiblaResponse = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching qibla direction:", error);
    throw error;
  }
};