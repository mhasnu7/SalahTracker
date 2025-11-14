import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import createNativeStackNavigator
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View } from 'react-native';
import { BottomTabs } from './src/navigation/BottomTabs';
import { ThemeContext, ThemeProvider } from './src/theme/ThemeContext';
import SettingsScreen from './src/screens/SettingsScreen'; // Import SettingsScreen
import { ThemesScreen } from './src/screens/ThemesScreen'; // Import ThemesScreen
import ResetSalahScreen from './src/screens/ResetSalahScreen'; // Import ResetSalahScreen
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import QazaIntroScreen from './src/screens/QazaIntroScreen'; // Import QazaIntroScreen
import QazaTrackerScreen from './src/screens/QazaTrackerScreen'; // Import QazaTrackerScreen
import PrayerTimingsScreen from './src/screens/PrayerTimingsScreen'; // Import PrayerTimingsScreen
import { RootStackParamList } from './src/navigation/types'; // Import RootStackParamList

const Stack = createNativeStackNavigator<RootStackParamList>(); // Create a stack navigator

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDark, colors } = useContext(ThemeContext);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ... (isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primaryAccent,
      background: colors.background,
      card: colors.cardBackground,
      text: colors.secondaryText,
      border: colors.cardBackground,
      notification: colors.primaryAccent,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
          <Stack.Screen
            name="Themes"
            component={ThemesScreen}
            options={{
              headerShown: true,
              headerTitle: 'Select Theme',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
          <Stack.Screen
            name="ResetSalah"
            component={ResetSalahScreen}
            options={{
              headerShown: true,
              headerTitle: 'Reset Salah Data',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
          <Stack.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Salah Analytics',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
          <Stack.Screen
            name="QazaIntro"
            component={QazaIntroScreen}
            options={{
              headerShown: true,
              headerTitle: 'Qaza Introduction',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
          <Stack.Screen
            name="QazaTracker"
            component={QazaTrackerScreen}
            options={{
              headerShown: true,
              headerTitle: 'Qaza Tracker',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
          <Stack.Screen
            name="PrayerTimings"
            component={PrayerTimingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Prayer Timings',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.headerTitle,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
