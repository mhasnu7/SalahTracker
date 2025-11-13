import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'salahTrackerData';

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type SalahTrackerData = {
  [key in PrayerName]: {
    [date: string]: boolean; // 'YYYY-MM-DD': true/false
  };
};

export const getTodayDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const loadSalahTrackerData = async (): Promise<SalahTrackerData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    const data: SalahTrackerData = jsonValue != null ? JSON.parse(jsonValue) : {};

    // Initialize data for all prayers if not present
    const defaultData: SalahTrackerData = {
      Fajr: {},
      Dhuhr: {},
      Asr: {},
      Maghrib: {},
      Isha: {},
    };

    for (const prayer of Object.keys(defaultData) as PrayerName[]) {
      if (!data[prayer]) {
        data[prayer] = {};
      }
    }

    // Auto-reset daily at midnight (new day -> unchecked)
    const today = getTodayDate();
    for (const prayer of Object.keys(data) as PrayerName[]) {
      if (data[prayer][today] === undefined) {
        data[prayer][today] = false; // Set today's prayer to unchecked if not already set
      }
    }

    return data;
  } catch (e) {
    console.error("Failed to load Salah tracker data", e);
    return {
      Fajr: {},
      Dhuhr: {},
      Asr: {},
      Maghrib: {},
      Isha: {},
    };
  }
};

export const saveSalahTrackerData = async (data: SalahTrackerData) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save Salah tracker data", e);
  }
};

export const resetSalahData = async (prayerName: PrayerName) => {
  try {
    const data = await loadSalahTrackerData();
    data[prayerName] = {}; // Clear all markings for the specific prayer
    await saveSalahTrackerData(data);
  } catch (e) {
    console.error(`Failed to reset ${prayerName} data`, e);
  }
};

export const resetAllSalahData = async () => {
  try {
    const data: SalahTrackerData = {
      Fajr: {},
      Dhuhr: {},
      Asr: {},
      Maghrib: {},
      Isha: {},
    };
    await saveSalahTrackerData(data);
  } catch (e) {
    console.error("Failed to reset all Salah data", e);
  }
};