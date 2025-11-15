import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useNavigation
import { View, Text, StyleSheet, ScrollView, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootTabScreenProps } from '../navigation/types'; // Import RootTabScreenProps
import { PrayerCard } from '../components/PrayerCard';
import {
  loadSalahTrackerData,
  saveSalahTrackerData,
  SalahTrackerData,
  PrayerName,
  getTodayDate,
} from '../storage/trackerStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../theme/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// --- Constants for Layout ---
const STATUS_BAR_HEIGHT = 20;
const BOTTOM_NAV_HEIGHT = 60;
const HEADER_HEIGHT = 40;
const PRAYER_NAME_HEIGHT = 16;
const CARD_HORIZONTAL_PADDING = 4;
const CARD_INNER_PADDING = 2;
const CARD_MARGIN_VERTICAL = 3;
const CARD_BORDER_RADIUS = 9;

const AVAILABLE_HEIGHT_FOR_CARDS_AREA = screenHeight - STATUS_BAR_HEIGHT - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT;
const CARD_HEIGHT = (AVAILABLE_HEIGHT_FOR_CARDS_AREA / PRAYER_NAMES.length) - (CARD_MARGIN_VERTICAL * 2);


export const TrackerScreen: React.FC = () => {
  const { colors, isDark } = useContext(ThemeContext);
  const navigation = useNavigation<RootTabScreenProps<'Tracker'>['navigation']>(); // Initialize navigation
  const [salahData, setSalahData] = useState<SalahTrackerData | null>(null);

  const fetchSalahData = useCallback(async () => {
    const data = await loadSalahTrackerData();
    setSalahData(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSalahData();
    }, [fetchSalahData])
  );

  const togglePrayerCompletionToday = useCallback(
    async (prayerName: PrayerName) => {
      if (!salahData) return;

      const today = getTodayDate();
      const updatedData = {
        ...salahData,
        [prayerName]: {
          ...salahData[prayerName],
          [today]: !salahData[prayerName]?.[today],
        },
      };
      setSalahData(updatedData);
      await saveSalahTrackerData(updatedData);
    },
    [salahData]
  );

  const togglePrayerCompletionHistorical = useCallback(
    async (prayerName: PrayerName, date: string) => {
      if (!salahData) return;

      const updatedData = {
        ...salahData,
        [prayerName]: {
          ...salahData[prayerName],
          [date]: !salahData[prayerName]?.[date],
        },
      };
      setSalahData(updatedData);
      await saveSalahTrackerData(updatedData);
    },
    [salahData]
  );

  const getHistoricalCompletionData = (prayer: PrayerName, numberOfDays: number = 90) => {
    if (!salahData || !salahData[prayer]) {
      return Array(numberOfDays).fill({ date: '', completed: false });
    }

    const today = new Date();
    const historicalData: { date: string; completed: boolean }[] = [];

    for (let i = numberOfDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      historicalData.push({
        date: formattedDate,
        completed: salahData[prayer][formattedDate] || false,
      });
    }
    return historicalData;
  };

  return (
    <SafeAreaView style={styles(colors).safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={styles(colors).header}>
        <TouchableOpacity style={styles(colors).iconButton} onPress={() => navigation.getParent()?.navigate('Menu')}>
          <Icon name="menu-outline" size={24} color={colors.headerTitle} />
        </TouchableOpacity>
        <Text style={[styles(colors).headerTitle, { flex: 1, textAlign: 'center' }]}>SalahTracker</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={[styles(colors).iconButton, { marginRight: 5 }]} onPress={() => navigation.getParent()?.navigate('QazaTracker')}>
            <Text style={{ color: colors.headerTitle, fontSize: 20, fontWeight: 'bold' }}>Q</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(colors).iconButton} onPress={() => navigation.getParent()?.navigate('Analytics')}>
            <Icon name="analytics-outline" size={24} color={colors.headerTitle} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles(colors).container} contentContainerStyle={styles(colors).contentContainer}>
        {salahData ? (
          PRAYER_NAMES.map((prayerName) => (
            <View key={prayerName} style={{ height: CARD_HEIGHT, marginBottom: CARD_MARGIN_VERTICAL }}>
              <PrayerCard
                prayerName={prayerName}
                isCompletedToday={salahData[prayerName]?.[getTodayDate()] || false}
                onToggleToday={togglePrayerCompletionToday}
                onToggleHistorical={togglePrayerCompletionHistorical}
                historicalCompletionData={getHistoricalCompletionData(prayerName, 162)}
              />
            </View>
          ))
        ) : (
          <Text style={styles(colors).loadingText}>Loading Salah data...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute items with space between them
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.headerTitle,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingBottom: 20,
  },
  loadingText: {
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
  },
});