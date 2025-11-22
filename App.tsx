import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

import { BottomTabs } from './src/navigation/BottomTabs';
import { ThemeContext, ThemeProvider } from './src/theme/ThemeContext';

import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemesScreen } from './src/screens/ThemesScreen';
import ResetSalahScreen from './src/screens/ResetSalahScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import QazaIntroScreen from './src/screens/QazaIntroScreen';
import QazaTrackerScreen from './src/screens/QazaTrackerScreen';
import PrayerTimingsScreen from './src/screens/PrayerTimingsScreen';
import QuranSurahListScreen from './src/screens/QuranSurahList';
import SurahDetailsScreen from './src/screens/SurahDetails';
import AboutAppScreen from './src/screens/AboutAppScreen';

import AnimatedSplash from './src/screens/AnimatedSplash';  // ⭐ NEW SPLASH SCREEN

import { RootStackParamList, QuranStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const QuranStack = createNativeStackNavigator<QuranStackParamList>();

// Quran nested navigator
const QuranNavigator = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <QuranStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.headerTitle,
      }}
    >
      <QuranStack.Screen
        name="QuranSurahList"
        component={QuranSurahListScreen}
        options={{ title: 'Quran Surahs' }}
      />
      <QuranStack.Screen
        name="SurahDetails"
        component={SurahDetailsScreen}
        options={({ route }) => ({ title: route.params.surahName })}
      />
    </QuranStack.Navigator>
  );
};

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
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
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
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {/* ⭐ SPLASH SCREEN COMES FIRST */}
          <Stack.Screen
            name="AnimatedSplash"
            component={AnimatedSplash}
          />

          {/* MAIN APP SCREENS */}
          <Stack.Screen name="BottomTabs" component={BottomTabs} />

          <Stack.Screen name="Menu" component={MenuScreen} />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerTitleAlign: 'center',
              headerStyle: { backgroundColor: colors.background },
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
              headerStyle: { backgroundColor: colors.background },
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
              headerStyle: { backgroundColor: colors.background },
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
              headerStyle: { backgroundColor: colors.background },
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
              headerStyle: { backgroundColor: colors.background },
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
              headerStyle: { backgroundColor: colors.background },
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
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.headerTitle,
            }}
          />

          <Stack.Screen
            name="Quran"
            component={QuranNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SurahDetails"
            component={SurahDetailsScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTitle: route.params.surahName,
              headerTitleAlign: 'center',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.headerTitle,
            })}
          />

          <Stack.Screen
            name="AboutApp"
            component={AboutAppScreen}
            options={{
              headerShown: true,
              headerTitle: 'About App',
              headerTitleAlign: 'center',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.headerTitle,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
  },
});

export default App;
