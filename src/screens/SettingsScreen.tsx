import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { SettingsScreenNavigationProp } from '../navigation/types';
import { ResetSalahScreenNavigationProp } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

const SettingsScreen = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  return (
    <View style={styles(colors).container}>
      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => navigation.navigate('Themes')} // Navigate to ThemesScreen
      >
        <Text style={styles(colors).buttonText}>Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => navigation.navigate('Analytics')}
      >
        <Text style={styles(colors).buttonText}>Salah Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => navigation.navigate('QazaIntro')}
      >
        <Text style={styles(colors).buttonText}>Qaza Namaz Tracker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => navigation.navigate('ResetSalah')}
      >
        <Text style={styles(colors).buttonText}>Reset Salah Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles(colors).prayerTimingsButton}
        onPress={() => navigation.navigate('PrayerTimings')}
      >
        <Ionicons name="time-outline" size={20} color="white" />
        <Text style={styles(colors).prayerTimingsButtonText}>Prayer Timings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40, // Increased padding from the top
    backgroundColor: colors.background,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
  },
  settingText: {
    fontSize: 18,
    color: colors.secondaryText,
  },
  button: {
    backgroundColor: colors.primaryAccent,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  prayerTimingsButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  prayerTimingsButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SettingsScreen;