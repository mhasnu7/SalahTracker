import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrayerTimingsScreen = () => {
  const { colors } = useContext(ThemeContext);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLastSearch();
  }, []);

  const loadLastSearch = async () => {
    try {
      const lastCountry = await AsyncStorage.getItem('lastCountry');
      const lastCity = await AsyncStorage.getItem('lastCity');
      if (lastCountry) setCountry(lastCountry);
      if (lastCity) setCity(lastCity);
      if (lastCountry && lastCity) {
        fetchPrayerTimings(lastCity, lastCountry);
      }
    } catch (e) {
      console.error('Failed to load last search:', e);
    }
  };

  const saveLastSearch = async (city, country) => {
    try {
      await AsyncStorage.setItem('lastCountry', country);
      await AsyncStorage.setItem('lastCity', city);
    } catch (e) {
      console.error('Failed to save last search:', e);
    }
  };

  const fetchPrayerTimings = async (currentCity, currentCountry) => {
    if (!currentCity || !currentCountry) {
      Alert.alert('Error', 'Please enter both city and country.');
      return;
    }

    setLoading(true);
    setError('');
    setTimings(null);

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${currentCity}&country=${currentCountry}&method=2`
      );
      const data = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        const extractedTimings = data.data.timings;
        const computedTimings = computeEndTimes(extractedTimings);
        setTimings(computedTimings);
        saveLastSearch(currentCity, currentCountry);
      } else {
        setError(data.data ? data.data.message : 'Could not fetch prayer timings. Please check city and country.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to connect to the prayer times API. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const computeEndTimes = (t) => {
    return {
      Fajr: { start: t.Fajr, end: t.Sunrise },
      Sunrise: t.Sunrise,
      Dhuhr: { start: t.Dhuhr, end: t.Asr },
      Asr: { start: t.Asr, end: t.Maghrib },
      Maghrib: { start: t.Maghrib, end: t.Isha },
      Isha: { start: t.Isha, end: t.Midnight },
      Sunset: t.Sunset,
      Midnight: t.Midnight,
    };
  };

  const renderPrayerCard = (prayerName, startTime, endTime) => (
    <View style={styles(colors).card}>
      <Text style={styles(colors).prayerName}>{prayerName}:</Text>
      <Text style={styles(colors).prayerTiming}>  Start: {startTime}</Text>
      <Text style={styles(colors).prayerTiming}>  End: {endTime}</Text>
    </View>
  );

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Text style={styles(colors).headerTitle}>Prayer Timings</Text>
        <Text style={styles(colors).headerSubtext}>Daily Fard Salah Timings</Text>
      </View>

      <ScrollView contentContainerStyle={styles(colors).scrollViewContent}>
        <View style={styles(colors).inputSection}>
          <TextInput
            style={styles(colors).input}
            placeholder="Country"
            placeholderTextColor={colors.secondaryText}
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={styles(colors).input}
            placeholder="City"
            placeholderTextColor={colors.secondaryText}
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity
            style={styles(colors).getTimingsButton}
            onPress={() => fetchPrayerTimings(city, country)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles(colors).getTimingsButtonText}>Get Timings</Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles(colors).errorCard}>
            <Text style={styles(colors).errorText}>{error}</Text>
          </View>
        ) : null}

        {timings && (
          <View style={styles(colors).resultsSection}>
            {renderPrayerCard('Fajr', timings.Fajr.start, `${timings.Fajr.end} (Sunrise)`)}
            {renderPrayerCard('Dhuhr', timings.Dhuhr.start, `${timings.Dhuhr.end} (Asr)`)}
            {renderPrayerCard('Asr', timings.Asr.start, `${timings.Asr.end} (Maghrib)`)}
            {renderPrayerCard('Maghrib', timings.Maghrib.start, `${timings.Maghrib.end} (Isha)`)}
            {renderPrayerCard('Isha', timings.Isha.start, `${timings.Isha.end} (Midnight)`)}

            <View style={styles(colors).standaloneTimings}>
              <Text style={styles(colors).standaloneText}>Sunrise: {timings.Sunrise}</Text>
              <Text style={styles(colors).standaloneText}>Sunset: {timings.Sunset}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: '#0B0B0B',
      padding: 15,
      paddingTop: 40,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2196F3',
      marginBottom: 5,
    },
    headerSubtext: {
      fontSize: 16,
      color: '#9EFF70',
    },
    scrollViewContent: {
      flexGrow: 1,
      padding: 20,
    },
    inputSection: {
      marginBottom: 20,
    },
    input: {
      height: 50,
      borderColor: '#9EFF70',
      borderWidth: 1,
      borderRadius: 10,
      color: colors.white,
      paddingHorizontal: 15,
      marginBottom: 10,
      fontSize: 16,
    },
    getTimingsButton: {
      backgroundColor: '#2196F3',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    getTimingsButtonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    resultsSection: {
      marginTop: 20,
    },
    card: {
      backgroundColor: '#121212',
      borderColor: '#9EFF70',
      borderWidth: 1,
      borderRadius: 12,
      marginVertical: 10,
      padding: 12,
    },
    prayerName: {
      fontStyle: 'italic',
      color: '#9EFF70',
      fontSize: 18,
      marginBottom: 5,
    },
    prayerTiming: {
      color: colors.white,
      fontSize: 16,
      marginLeft: 10,
    },
    standaloneTimings: {
      marginTop: 20,
      padding: 12,
      backgroundColor: '#121212',
      borderColor: '#9EFF70',
      borderWidth: 1,
      borderRadius: 12,
    },
    standaloneText: {
      color: colors.white,
      fontSize: 16,
      marginBottom: 5,
    },
    errorCard: {
      backgroundColor: '#121212',
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 12,
      marginVertical: 10,
      padding: 12,
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default PrayerTimingsScreen;