import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, parse, startOfDay, isWithinInterval } from 'date-fns';

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
export const getPeriodData = async (startDate: Date, endDate: Date) => {
  console.log('--- getPeriodData Debugging ---');
  console.log('Normalized Start Date:', startDate);
  console.log('Normalized End Date:', endDate);

  const allKeys = await AsyncStorage.getAllKeys();
  console.log('All AsyncStorage Keys:', allKeys);

  const salahTrackerDataKey = 'salahTrackerData';
  if (!allKeys.includes(salahTrackerDataKey)) {
    console.log(`Key '${salahTrackerDataKey}' not found in AsyncStorage.`);
    return [];
  }

  const jsonValue = await AsyncStorage.getItem(salahTrackerDataKey);
  if (!jsonValue) {
    console.log(`No data found for key '${salahTrackerDataKey}'.`);
    return [];
  }

  let parsedData: any = {};
  try {
    parsedData = JSON.parse(jsonValue);
  } catch (e) {
    console.error('Failed to parse Salah tracker data from AsyncStorage.', e);
    return [];
  }

  const periodData: [string, string][] = [];
  const normalizedStartDate = startOfDay(startDate);
  const normalizedEndDate = startOfDay(endDate);

  for (const prayerName in parsedData) {
    if (parsedData.hasOwnProperty(prayerName)) {
      const prayerDates = parsedData[prayerName];
      for (const dateStr in prayerDates) {
        if (prayerDates.hasOwnProperty(dateStr)) {
          const key = `${prayerName.toLowerCase()}_${dateStr.replace(/-/g, '_')}`; // Reconstruct key for consistency
          const value = prayerDates[dateStr];

          console.log('Processing Key:', key);
          console.log('Extracted dateStr:', dateStr);

          const keyDate = parse(dateStr, 'yyyy-MM-dd', new Date());
          console.log('Parsed keyDate:', keyDate);
          console.log('isWithinInterval start:', normalizedStartDate, 'end:', normalizedEndDate);
          const isWithin = isWithinInterval(startOfDay(keyDate), { start: normalizedStartDate, end: normalizedEndDate });
          console.log('isWithinInterval result:', isWithin);

          if (isWithin) {
            periodData.push([key, String(value)]);
          }
        }
      }
    }
  }
  console.log('--- End getPeriodData Debugging ---');
  return periodData;
};

// Calculate analytics from the fetched data
export const calculateAnalytics = (data: [string, string][], startDate: Date, endDate: Date) => {
  const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
  const totalPrayersInPeriod = PRAYER_NAMES.length * daysInPeriod.length;

  const offeredPrayers = data.filter(([, value]) => value === 'true').length;
  const missedPrayers = totalPrayersInPeriod - offeredPrayers;
  const completionRate = totalPrayersInPeriod > 0 ? (offeredPrayers / totalPrayersInPeriod) * 100 : 0;

  // Per-Salah performance
  const salahPerformance = PRAYER_NAMES.map(name => {
    const salahData = data.filter(([key]) => key.startsWith(name.toLowerCase()));
    const offered = salahData.filter(([, value]) => value === 'true').length;
    const total = daysInPeriod.length;
    return total > 0 ? (offered / total) * 100 : 0;
  });

  // Daily trend
  const dailyCounts = daysInPeriod.map((day: Date) => {
    const dayStr = format(day, 'yyyy_MM_dd');
    return data.filter(([key, value]) => key.includes(`_${dayStr}`) && value === 'true').length;
  });

  // Perfect days and streak
  let perfectDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  
  daysInPeriod.forEach((day: Date) => {
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
      labels: daysInPeriod.map((d: Date) => format(d, 'd')),
      datasets: [{ data: dailyCounts }],
    },
    perfectDays,
    longestStreak,
    currentStreak,
  };
};