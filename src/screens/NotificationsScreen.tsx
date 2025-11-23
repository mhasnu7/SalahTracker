import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

// ⭐ NEW: Notifee-based notification manager
import {
  cancelAll,
  scheduleFard,
  scheduleCustom
} from '../utils/notificationManager';

const NotificationsScreen = () => {
  const { colors } = useTheme();

  const [enabled, setEnabled] = useState(false);
  const [useFardTimes, setUseFardTimes] = useState(true);

  const [times, setTimes] = useState({
    fajr: new Date(),
    dhuhr: new Date(),
    asr: new Date(),
    maghrib: new Date(),
    isha: new Date(),
  });

  const [showPicker, setShowPicker] = useState({
    key: null as null | string,
    visible: false,
  });

  // ----------- Android 13+ permission -------------
  async function requestNotificationPermission() {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version < 33) return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  // ----------- Load saved settings ----------
  async function loadSettings() {
    const savedEnabled = await AsyncStorage.getItem('notif_enabled');
    const savedMode = await AsyncStorage.getItem('notif_mode');
    const savedTimes = await AsyncStorage.getItem('notif_custom_times');

    if (savedEnabled !== null) setEnabled(savedEnabled === 'true');
    if (savedMode !== null) setUseFardTimes(savedMode === 'fard');

    if (savedTimes) {
      const parsed = JSON.parse(savedTimes);
      setTimes({
        fajr: new Date(parsed.fajr),
        dhuhr: new Date(parsed.dhuhr),
        asr: new Date(parsed.asr),
        maghrib: new Date(parsed.maghrib),
        isha: new Date(parsed.isha),
      });
    }
  }

  async function saveSettings() {
    await AsyncStorage.setItem('notif_enabled', enabled.toString());
    await AsyncStorage.setItem('notif_mode', useFardTimes ? 'fard' : 'custom');

    await AsyncStorage.setItem(
      'notif_custom_times',
      JSON.stringify({
        fajr: times.fajr,
        dhuhr: times.dhuhr,
        asr: times.asr,
        maghrib: times.maghrib,
        isha: times.isha,
      }),
    );
  }

  useEffect(() => {
    loadSettings();
  }, []);

  // Apply notification settings
  async function applySettings() {
    if (enabled) {
      const permission = await requestNotificationPermission();
      if (!permission) {
        alert('Notification permission denied.');
        return;
      }
    }

    await saveSettings();

    // Cancel all existing notifications
    await cancelAll();

    if (!enabled) {
      alert('Notifications disabled.');
      return;
    }

    // Auto Fard Salah Times
    if (useFardTimes) {
      // TODO: Replace mock with actual timings from API
      const mockTimings = {
        Fajr: '05:10',
        Dhuhr: '12:30',
        Asr: '15:45',
        Maghrib: '18:10',
        Isha: '19:30',
      };

      await scheduleFard(mockTimings);
      alert('Fard Salah notifications scheduled.');
    } else {
      // Custom selected times
      const formatted = {
        fajr: formatTime(times.fajr),
        dhuhr: formatTime(times.dhuhr),
        asr: formatTime(times.asr),
        maghrib: formatTime(times.maghrib),
        isha: formatTime(times.isha),
      };

      await scheduleCustom(formatted);
      alert('Custom Salah notifications scheduled.');
    }
  }

  function formatTime(date: Date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  function openPicker(key: string) {
    setShowPicker({ key, visible: true });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.title, { color: colors.headerTitle }]}>
          Salah Notifications
        </Text>

        {/* ON/OFF Toggle */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            Enable Notifications
          </Text>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>

        {enabled && (
          <>
            {/* Mode Selection */}
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setUseFardTimes(true)}
                style={styles.optionContainer}>
                <Text
                  style={[
                    styles.optionText,
                    { color: useFardTimes ? colors.primaryAccent : colors.text },
                  ]}>
                  • Use Fard Salah Times (Auto)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setUseFardTimes(false)}
                style={styles.optionContainer}>
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: !useFardTimes
                        ? colors.primaryAccent
                        : colors.text,
                    },
                  ]}>
                  • Choose My Own Times
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Time Pickers */}
            {!useFardTimes && (
              <View style={{ marginTop: 10 }}>
                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(key => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => openPicker(key)}
                    style={styles.timeButton}>
                    <Text style={{ color: colors.secondaryText }}>
                      {key.toUpperCase()} —{' '}
                      {times[key].getHours().toString().padStart(2, '0')}:
                      {times[key].getMinutes().toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.applyButton,
                { backgroundColor: colors.primaryAccent },
              ]}
              onPress={applySettings}>
              <Text style={styles.applyText}>Save & Apply</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Time Picker Popup */}
        {showPicker.visible && (
          <DateTimePicker
            value={times[showPicker.key as keyof typeof times]}
            mode="time"
            is24Hour
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setTimes(prev => ({
                  ...prev,
                  [showPicker.key as string]: selectedDate,
                }));
              }
              setShowPicker({ key: null, visible: false });
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  optionContainer: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
  },
  timeButton: {
    paddingVertical: 12,
  },
  applyButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
  },
  applyText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
