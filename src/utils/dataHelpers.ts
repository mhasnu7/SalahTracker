import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Function to get all keys from AsyncStorage
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error('Failed to fetch keys from storage.', e);
    return [];
  }
};

// Function to get data for a specific month
export const getMonthlyData = async (date: Date) => {
  const month = format(date, 'yyyy_MM');
  const allKeys = await getAllKeys();
  const monthKeys = allKeys.filter(key => key.includes(`_${month}_`));
  
  const multiGet = async (keys: string[]) => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (e) {
      console.error('Failed to fetch multi-key data.', e);
      return [];
    }
  };

  const data = await multiGet(monthKeys);
  return data.filter(([, value]) => value !== null) as [string, string][];
};

// Calculate analytics from the fetched data
export const calculateAnalytics = (data: [string, string][]) => {
  const totalPrayersInMonth = PRAYER_NAMES.length * eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }).length;

  const offeredPrayers = data.filter(([, value]) => value === 'true').length;
  const missedPrayers = totalPrayersInMonth - offeredPrayers;
  const completionRate = totalPrayersInMonth > 0 ? (offeredPrayers / totalPrayersInMonth) * 100 : 0;

  // Per-Salah performance
  const salahPerformance = PRAYER_NAMES.map(name => {
    const salahData = data.filter(([key]) => key.startsWith(name.toLowerCase()));
    const offered = salahData.filter(([, value]) => value === 'true').length;
    const total = eachDayOfInterval({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }).length;
    return total > 0 ? (offered / total) * 100 : 0;
  });

  // Daily trend
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const dailyCounts = daysInMonth.map((day: Date) => {
    const dayStr = format(day, 'yyyy_MM_dd');
    return data.filter(([key, value]) => key.includes(`_${dayStr}`) && value === 'true').length;
  });

  // Perfect days and streak
  let perfectDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  
  daysInMonth.forEach((day: Date) => {
    const dayStr = format(day, 'yyyy_MM_dd');
    const prayersOnDay = data.filter(([key, value]) => key.includes(`_${dayStr}`) && value === 'true').length;
    if (prayersOnDay === PRAYER_NAMES.length) {
      perfectDays++;
      currentStreak++;
    } else {
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      currentStreak = 0;
    }
  });

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    offeredPrayers,
    missedPrayers,
    completionRate: completionRate.toFixed(1),
    salahPerformance,
    dailyData: {
      labels: daysInMonth.map((d: Date) => format(d, 'd')),
      datasets: [{ data: dailyCounts }],
    },
    perfectDays,
    longestStreak,
    currentStreak,
  };
};