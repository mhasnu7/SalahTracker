import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootTabScreenProps } from '../navigation/types';
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
const HEADER_HEIGHT = 40;
const CARD_HORIZONTAL_PADDING = 4;
const GRID_DOTS_COUNT = 189; // 7 rows * 27 columns


export const TrackerScreen: React.FC = () => {
  const { colors, isDark } = useContext(ThemeContext);
  const navigation = useNavigation<RootTabScreenProps<'Tracker'>['navigation']>();
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

  const getHistoricalCompletionData = (prayer: PrayerName, numberOfDays: number = GRID_DOTS_COUNT) => {
    if (!salahData || !salahData[prayer]) {
      return Array(numberOfDays).fill({ date: '', completed: false });
    }

    const historicalData: { date: string; completed: boolean }[] = [];
    const today = new Date();

    for (let i = numberOfDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      historicalData.push({
        date: formattedDate,
        completed: salahData[prayer][formattedDate] || false,
      });
    }

    // Data is sorted [Oldest day -> Today]
    return historicalData;
  };

  return (
    <SafeAreaView style={styles(colors).safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={styles(colors).header}>

        {/* === UPDATED MENU BUTTON LOGIC (Assumes Drawer Navigator) === */}
        <TouchableOpacity
          style={styles(colors).iconButton}
          onPress={() => {
            // Check if toggleDrawer function exists (common for Drawer Navigators)
            if (navigation.getParent() && 'toggleDrawer' in navigation.getParent()) {
              (navigation.getParent() as any).toggleDrawer();
            } else {
              // Fallback to navigate if it's a stack screen in the parent
              navigation.getParent()?.navigate('Menu');
            }
          }}
        >
          <Icon name="menu-outline" size={24} color={colors.headingBlue} />
        </TouchableOpacity>
        {/* === END MENU BUTTON LOGIC === */}

        <Text style={[styles(colors).headerTitle, { flex: 1, textAlign: 'center' }]}>SalahTracker</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          {/* Qaza Tracker Navigation */}
          <TouchableOpacity style={[styles(colors).iconButton, { marginRight: 5 }]} onPress={() => navigation.getParent()?.navigate('QazaTracker')}>
            <Text style={{ color: colors.headingBlue, fontSize: 20, fontWeight: 'bold' }}>Q</Text>
          </TouchableOpacity>

          {/* Analytics Navigation */}
          <TouchableOpacity style={styles(colors).iconButton} onPress={() => navigation.getParent()?.navigate('Analytics')}>
            <Icon name="analytics-outline" size={24} color={colors.headingBlue} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles(colors).container} contentContainerStyle={styles(colors).contentContainer}>
        {salahData ? (
          PRAYER_NAMES.map((prayerName) => {
            const history = getHistoricalCompletionData(prayerName, GRID_DOTS_COUNT);
            const isCompletedToday = history[history.length - 1]?.completed || false;

            return (
              <View
                key={prayerName}
              >
                <PrayerCard
                  prayerName={prayerName}
                  isCompletedToday={isCompletedToday}
                  onToggle={togglePrayerCompletionToday}
                  historicalCompletionData={history}
                />
              </View>
            )
          })
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
    justifyContent: 'space-between',
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