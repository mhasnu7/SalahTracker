// src/screens/ArabicCalendarScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { fetchHijriCalendarMonth, getCurrentHijriMonthYear } from '../services/hijriCalendarService';
import { ArabicCalendarScreenNavigationProp } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W } = Dimensions.get('window');

const arabicMonths = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر",
  "جمادى الأولى", "جمادى الآخرة", "رجب",
  "شعبان", "رمضان", "شوال",
  "ذو القعدة", "ذو الحجة"
];

interface Day {
  hijriDay: string;
  hijriMonthAr: string;
  hijriMonthNumber: number | null;
  hijriYear: string;
  hijriWeekdayAr: string;
  gregorianDate: string;
  gregorianDay: string;
  gregorianWeekdayEn: string;
}

interface Props {
  navigation: ArabicCalendarScreenNavigationProp;
}

export default function ArabicCalendarScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<Day[]>([]); // mapped days
  const [hijriMonth, setHijriMonth] = useState<number | null>(null); // 1..12
  const [hijriYear, setHijriYear] = useState<number | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const country = await AsyncStorage.getItem('userCountry');
      const city = await AsyncStorage.getItem('userCity');
      setUserCountry(country);
      setUserCity(city);
    };
    getLocation();
  }, []);

  // get current hijri month/year once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const cur = await getCurrentHijriMonthYear();
        if (!mounted) return;
        setHijriMonth(cur.month);
        setHijriYear(cur.year);
      } catch (err: any) {
        // fallback: if conversion fails, try approximate using Date -> use month 1 of current gregorian year
        console.warn('Failed to get current hijri from API:', err.message);
        const fallbackMonth = 1;
        const fallbackYear = 1446;
        if (mounted) {
          setHijriMonth(fallbackMonth);
          setHijriYear(fallbackYear);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const loadMonth = useCallback(async (month: number, year: number) => {
    if (!userCity || !userCountry) {
      setError('Location not set. Please go to settings to set your location.');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const mapped = await fetchHijriCalendarMonth(month, year, userCity, userCountry);
      setDays(mapped);
    } catch (err: any) {
      console.error('Error fetching Hijri calendar:', err);
      setError(err.message || 'Failed to fetch calendar data. Please try again.');
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [userCity, userCountry]);

  // When hijriMonth/year set, load data
  useEffect(() => {
    if (hijriMonth && hijriYear) {
      loadMonth(hijriMonth, hijriYear);
    }
  }, [hijriMonth, hijriYear, loadMonth]);

  function prevMonth() {
    if (!hijriMonth || !hijriYear) return;
    let m = hijriMonth - 1;
    let y = hijriYear;
    if (m < 1) {
      m = 12;
      y = y - 1;
    }
    setHijriMonth(m);
    setHijriYear(y);
  }

  function nextMonth() {
    if (!hijriMonth || !hijriYear) return;
    let m = hijriMonth + 1;
    let y = hijriYear;
    if (m > 12) {
      m = 1;
      y = y + 1;
    }
    setHijriMonth(m);
    setHijriYear(y);
  }

  // Render one calendar week-row style by putting days into rows of 7.
  const renderDayCard = ({ item }: { item: Day }) => {
    return (
      <View style={styles.dayCard}>
        <Text style={styles.hijriDay}>{item.hijriDay}</Text>
        <Text style={styles.hijriWeekday}>{item.hijriWeekdayAr}</Text>
        <Text style={styles.gregorianDay}>{item.gregorianDate}</Text>
      </View>
    );
  };

  // prepare rows: we will show as FlatList with numColumns=7, but keep cells small
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.navBtnText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Arabic Calendar</Text>
        <View style={{width: 40}} />
      </View>

      <View style={styles.monthRow}>
        <TouchableOpacity style={styles.smallBtn} onPress={prevMonth}>
          <Text style={styles.smallBtnText}>{'<'}</Text>
        </TouchableOpacity>

        <View style={styles.monthTitleWrap}>
          <Text style={styles.monthTitle}>
            { (hijriMonth && arabicMonths[hijriMonth - 1]) || '—' } {hijriYear || ''}
          </Text>
        </View>

        <TouchableOpacity style={styles.smallBtn} onPress={nextMonth}>
          <Text style={styles.smallBtnText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading && <ActivityIndicator size="large" color="#2196F3" style={{marginTop: 30}} />}

        {!loading && error && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>Failed to fetch calendar data. Please try again.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => loadMonth(hijriMonth!, hijriYear!)}>
              <Text style={styles.retryBtnText}>RETRY</Text>
            </TouchableOpacity>
            <Text style={styles.debugText}>{error}</Text>
          </View>
        )}

        {!loading && !error && days && days.length > 0 && (
          <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom: 80}}>
            {/* week header */}
            <View style={styles.weekHeader}>
              <Text style={styles.weekHeaderText}>Su</Text>
              <Text style={styles.weekHeaderText}>Mo</Text>
              <Text style={styles.weekHeaderText}>Tu</Text>
              <Text style={styles.weekHeaderText}>We</Text>
              <Text style={styles.weekHeaderText}>Th</Text>
              <Text style={styles.weekHeaderText}>Fr</Text>
              <Text style={styles.weekHeaderText}>Sa</Text>
            </View>

            <FlatList
              data={days}
              renderItem={renderDayCard}
              keyExtractor={(it, idx) => `${it.hijriDay}_${idx}`}
              numColumns={7}
              scrollEnabled={false} // disable inner scroll; parent scrollview handles it
              contentContainerStyle={styles.grid}
            />
          </ScrollView>
        )}

        {!loading && !error && (!days || days.length === 0) && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No data for this month.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => loadMonth(hijriMonth!, hijriYear!)}>
              <Text style={styles.retryBtnText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2', paddingTop: 50 },
  header: {
    height: 56,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  navBtn: {
    width: 40, justifyContent: 'center', alignItems: 'center'
  },
  navBtnText: {
    color: '#fff', fontSize: 20
  },
  title: {
    flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '600'
  },
  monthRow: {
    marginTop: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smallBtn: {
    width: 40, height: 36, borderRadius: 8, backgroundColor: '#e6e6e6', justifyContent:'center', alignItems:'center'
  },
  smallBtnText: { fontSize: 18, color: '#333' },
  monthTitleWrap: { flex: 1, alignItems: 'center' },
  monthTitle: { fontSize: 20, fontWeight: '700', color: '#222' },

  content: { flex: 1, padding: 12 },

  weekHeader: {
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingHorizontal: 6,
    marginBottom: 8
  },
  weekHeaderText: { width: (SCREEN_W - 24) / 7, textAlign: 'center', color: '#333', fontWeight: '600' },

  grid: { paddingHorizontal: 6 },
  dayCard: {
    width: (SCREEN_W - 24) / 7 - 4,
    height: 86,
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 6,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hijriDay: { fontSize: 16, color: '#000', fontWeight: '700' },
  hijriWeekday: { fontSize: 10, color: '#555' },
  gregorianDay: { fontSize: 10, color: '#777' },

  errorWrap: { alignItems: 'center', marginTop: 40 },
  errorText: { color: 'red', marginBottom: 12 },
  retryBtn: { backgroundColor: '#2196F3', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  retryBtnText: { color: '#fff', fontWeight: '700' },
  debugText: { color: '#666', marginTop: 8 },

  emptyWrap: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#444' }
});