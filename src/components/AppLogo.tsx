import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
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

const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const HEADER_HEIGHT = 50;
const CARD_HORIZONTAL_PADDING = 4;
const GRID_DOTS_COUNT = 189;

export const TrackerScreen: React.FC = () => {
  const navigation = useNavigation<RootTabScreenProps<'Tracker'>['navigation']>();
  const { colors, isDark } = useContext(ThemeContext);

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

  const getHistoricalCompletionData = (prayer: PrayerName, numberOfDays: number) => {
    if (!salahData || !salahData[prayer]) {
      return Array(numberOfDays).fill({ date: '', completed: false });
    }

    const results: { date: string; completed: boolean }[] = [];
    const today = new Date();

    for (let i = numberOfDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const yyyy = d.getFullYear();
      const mm = (d.getMonth() + 1).toString().padStart(2, '0');
      const dd = d.getDate().toString().padStart(2, '0');

      const key = `${yyyy}-${mm}-${dd}`;

      results.push({
        date: key,
        completed: salahData[prayer][key] || false,
      });
    }

    return results;
  };

  return (
    <SafeAreaView style={styles(colors).safeArea}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ---------------- HEADER ---------------- */}
      <View style={styles(colors).header}>

        {/* LEFT MENU BUTTON */}
        <TouchableOpacity
          style={styles(colors).iconButton}
          onPress={() => {
            if (navigation.getParent() && 'toggleDrawer' in navigation.getParent()) {
              (navigation.getParent() as any).toggleDrawer();
            } else {
              navigation.getParent()?.navigate('Menu');
            }
          }}>
          <Icon name="menu-outline" size={28} color={colors.headingBlue} />
        </TouchableOpacity>

        {/* ⭐ CENTER TITLE: Salah ✓ */}
        <View style={styles(colors).headerCenter}>
          <Text style={styles(colors).headerTitle}>Salah</Text>
          <Icon
            name="checkmark-circle"
            size={30}
            color={colors.primaryAccent}
            style={{ marginLeft: 6, marginTop: 3 }}
          />
        </View>

        {/* RIGHT BUTTONS */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Qaza */}
          <TouchableOpacity
            style={[styles(colors).iconButton, { marginRight: 5 }]}
            onPress={() => navigation.getParent()?.navigate('QazaTracker')}>
            <Text style={{ color: colors.headingBlue, fontSize: 22, fontWeight: 'bold' }}>Q</Text>
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity
            style={styles(colors).iconButton}
            onPress={() => navigation.getParent()?.navigate('Analytics')}>
            <Icon name="analytics-outline" size={26} color={colors.headingBlue} />
          </TouchableOpacity>
        </View>

      </View>
      {/* ---------------- END HEADER ---------------- */}

      <ScrollView
        style={styles(colors).container}
        contentContainerStyle={styles(colors).contentContainer}>

        {salahData ? (
          PRAYER_NAMES.map(prayer => {
            const history = getHistoricalCompletionData(prayer, GRID_DOTS_COUNT);
            const todayCompleted = history[history.length - 1]?.completed || false;

            return (
              <View key={prayer}>
                <PrayerCard
                  prayerName={prayer}
                  isCompletedToday={todayCompleted}
                  onToggle={togglePrayerCompletionToday}
                  historicalCompletionData={history}
                />
              </View>
            );
          })
        ) : (
          <Text style={styles(colors).loadingText}>Loading Salah data...</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      height: HEADER_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      backgroundColor: colors.background,
    },

    headerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.headerTitle,
    },

    iconButton: {
      padding: 5,
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
      textAlign: 'center',
      marginTop: 40,
      color: colors.secondaryText,
    },
  });

export default TrackerScreen;
