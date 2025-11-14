import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QAZA_STORAGE_KEY = 'qazaTrackerData';

const QazaTrackerScreen = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  const [currentAge, setCurrentAge] = useState('');
  const [averageDailyFard, setAverageDailyFard] = useState('5');
  const [jumuahMissed, setJumuahMissed] = useState('');
  const [ramadanMissed, setRamadanMissed] = useState('');
  const [rememberedSalahs, setRememberedSalahs] = useState('');
  const [dailyExtraSalahs, setDailyExtraSalahs] = useState('');
  const [result, setResult] = useState(null);

  // Function to load data from AsyncStorage
  const loadQazaData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(QAZA_STORAGE_KEY);
      if (jsonValue != null) {
        const savedData = JSON.parse(jsonValue);
        setCurrentAge(savedData.currentAge || '');
        setAverageDailyFard(savedData.averageDailyFard || '5');
        setJumuahMissed(savedData.jumuahMissed || '');
        setRamadanMissed(savedData.ramadanMissed || '');
        setRememberedSalahs(savedData.rememberedSalahs || '');
        setDailyExtraSalahs(savedData.dailyExtraSalahs || '');
        setResult(savedData.result || null);
      }
    } catch (e) {
      console.error("Failed to load Qaza tracker data", e);
    }
  };

  // Function to save data to AsyncStorage
  const saveQazaData = async () => {
    try {
      const dataToSave = {
        currentAge,
        averageDailyFard,
        jumuahMissed,
        ramadanMissed,
        rememberedSalahs,
        dailyExtraSalahs,
        result,
      };
      const jsonValue = JSON.stringify(dataToSave);
      await AsyncStorage.setItem(QAZA_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save Qaza tracker data", e);
    }
  };

  const resetFields = async () => {
    setCurrentAge('');
    setAverageDailyFard('5');
    setJumuahMissed('');
    setRamadanMissed('');
    setRememberedSalahs('');
    setDailyExtraSalahs('');
    setResult(null);
    try {
      await AsyncStorage.removeItem(QAZA_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear Qaza tracker data from storage", e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={resetFields} style={{ marginRight: 15 }}>
          <Ionicons name="refresh-circle-outline" size={30} color={colors.headerTitle} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  // Load data on component mount
  useEffect(() => {
    loadQazaData();
  }, []);

  // Save data whenever relevant state changes
  useEffect(() => {
    saveQazaData();
  }, [currentAge, averageDailyFard, jumuahMissed, ramadanMissed, rememberedSalahs, dailyExtraSalahs, result]);

  const calculateQaza = () => {
    const age = parseInt(currentAge || '0', 10);
    const avgFard = parseInt(averageDailyFard || '5', 10);
    const jumuah = parseInt(jumuahMissed || '0', 10);
    const ramadan = parseInt(ramadanMissed || '0', 10);
    const remembered = parseInt(rememberedSalahs || '0', 10);
    const extraDaily = parseInt(dailyExtraSalahs || '0', 10);

    if (age < 14) {
      setResult({
        total: 0,
        fajr: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
        daysRequired: 0,
        yearsToComplete: 0,
        message: 'Age must be 14 or older to calculate Qazā Salahs.',
      });
      return;
    }

    const missedYears = age - 14;
    const totalDays = missedYears * 365;
    const totalSalah = totalDays * avgFard;

    const fridays = missedYears * 52;
    const ramadanDays = missedYears * 30;

    let qaza =
      totalSalah -
      fridays -
      ramadanDays * avgFard -
      remembered -
      jumuah * 1 -
      ramadan * avgFard;

    if (qaza < 0) qaza = 0;

    const perPrayer = Math.floor(qaza / 5);
    const daysRequired = extraDaily > 0 ? Math.ceil(qaza / extraDaily) : 0;
    const yearsToComplete = daysRequired > 0 ? (daysRequired / 365).toFixed(1) : 0;

    setResult({
      total: qaza,
      fajr: perPrayer,
      dhuhr: perPrayer,
      asr: perPrayer,
      maghrib: perPrayer,
      isha: perPrayer,
      daysRequired: daysRequired,
      yearsToComplete: yearsToComplete,
      message: '',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Qazā Tracker</Text>
          <Text style={styles.subtitle}>
            Estimate and plan to complete missed Salahs
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Age (required)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={currentAge}
            onChangeText={setCurrentAge}
            placeholder="e.g., 25"
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Average Daily Fard Salah Actually Prayed</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={averageDailyFard}
            onChangeText={setAverageDailyFard}
            placeholder="Default: 5"
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Approx. Jumu‘ah Salahs Missed (optional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={jumuahMissed}
            onChangeText={setJumuahMissed}
            placeholder="e.g., 10"
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Approx. Ramadan Salahs Missed (optional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={ramadanMissed}
            onChangeText={setRamadanMissed}
            placeholder="e.g., 20"
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Remembered Salahs Prayed (optional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rememberedSalahs}
            onChangeText={setRememberedSalahs}
            placeholder="e.g., 50"
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Extra Qazā Salahs You Plan to Pray Daily</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={dailyExtraSalahs}
            onChangeText={setDailyExtraSalahs}
            placeholder="e.g., 5"
            placeholderTextColor="#555"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateQaza}>
          <Text style={styles.buttonText}>Calculate Qazā</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultCard}>
            {result.message ? (
              <Text style={styles.errorText}>{result.message}</Text>
            ) : (
              <>
                <Text style={styles.resultTitle}>
                  Total Estimated Missed Salahs: {result.total}
                </Text>
                <View style={styles.breakdownContainer}>
                  <Text style={styles.breakdownTitle}>Breakdown:</Text>
                  <Text style={styles.prayerText}>
                    <Text style={styles.prayerName}>Fajr:</Text> {result.fajr}
                  </Text>
                  <Text style={styles.prayerText}>
                    <Text style={styles.prayerName}>Dhuhr:</Text> {result.dhuhr}
                  </Text>
                  <Text style={styles.prayerText}>
                    <Text style={styles.prayerName}>Asr:</Text> {result.asr}
                  </Text>
                  <Text style={styles.prayerText}>
                    <Text style={styles.prayerName}>Maghrib:</Text> {result.maghrib}
                  </Text>
                  <Text style={styles.prayerText}>
                    <Text style={styles.prayerName}>Isha:</Text> {result.isha}
                  </Text>
                </View>
                <Text style={styles.resultInfo}>
                  Estimated Days to Complete Qazā: {result.daysRequired}
                </Text>
                <Text style={styles.motivationalNote}>
                  “If you pray one full day of missed Salah daily along with your Fard,
                  you’ll complete your Qazā in about {result.yearsToComplete} years. Stay steadfast, Allah values every effort 🤍”
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#0B0B0B',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: 'sans-serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#9EFF70',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'sans-serif',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#9EFF70',
    marginBottom: 8,
    fontFamily: 'sans-serif',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  resultCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9EFF70',
    marginBottom: 10,
    textAlign: 'center',
  },
  breakdownContainer: {
    marginVertical: 10,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  prayerText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  prayerName: {
    fontStyle: 'italic',
    color: '#9EFF70',
  },
  resultInfo: {
    fontSize: 16,
    color: '#9EFF70',
    marginTop: 10,
    textAlign: 'center',
  },
  motivationalNote: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QazaTrackerScreen;