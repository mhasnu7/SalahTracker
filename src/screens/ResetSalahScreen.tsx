import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { resetSalahData, resetAllSalahData, PrayerName } from '../storage/trackerStorage'; // Assuming these functions exist or will be created
import { ResetSalahScreenNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

const ResetSalahScreen = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation<ResetSalahScreenNavigationProp>();

  const handleResetIndividualSalah = (salahName: string) => {
    Alert.alert(
      "Reset Salah",
      `Are you sure you want to reset ${salahName} markings?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: async () => {
            await resetSalahData(salahName as PrayerName); // Cast to PrayerName
            Alert.alert("Success", `${salahName} markings have been reset.`);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleResetAllSalah = () => {
    Alert.alert(
      "Reset All Salahs",
      "Are you sure you want to reset all Salah markings?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset All",
          onPress: async () => {
            await resetAllSalahData(); // Implement this function in trackerStorage.ts
            Alert.alert("Success", "All Salah markings have been reset.");
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles(colors).container}>
      <Text style={styles(colors).headerText}>Reset Salah Data</Text>

      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => handleResetIndividualSalah('Fajr')}
      >
        <Text style={styles(colors).buttonText}>Reset Fajr</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => handleResetIndividualSalah('Dhuhr')}
      >
        <Text style={styles(colors).buttonText}>Reset Dhuhr</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => handleResetIndividualSalah('Asr')}
      >
        <Text style={styles(colors).buttonText}>Reset Asr</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => handleResetIndividualSalah('Maghrib')}
      >
        <Text style={styles(colors).buttonText}>Reset Maghrib</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(colors).button}
        onPress={() => handleResetIndividualSalah('Isha')}
      >
        <Text style={styles(colors).buttonText}>Reset Isha</Text>
      </TouchableOpacity>

      <View style={styles(colors).separator} />

      <TouchableOpacity
        style={[styles(colors).button, styles(colors).resetAllButton]}
        onPress={handleResetAllSalah}
      >
        <Text style={styles(colors).buttonText}>Reset All Salahs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.headerTitle,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primaryAccent,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  separator: {
    height: 20,
  },
  resetAllButton: {
    backgroundColor: 'red', // A distinct color for the "Reset All" button
  },
});

export default ResetSalahScreen;