import 'react-native-gesture-handler';
import React, { useContext, useEffect } from 'react';
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

// Screens
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
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SupportUsScreen from './src/screens/SupportUsScreen';

import AnimatedSplash from './src/screens/AnimatedSplash';

// ⭐ VR Screens
import VRVideosScreen from './src/screens/VRVideosScreen';
import VRPlayerScreen from './src/screens/VRPlayerScreen';

import { RootStackParamList, QuranStackParamList } from './src/navigation/types';

// Notifications
import { createChannel } from './src/utils/notificationManager';

const Stack = createNativeStackNavigator<RootStackParamList>();
const QuranStack = createNativeStackNavigator<QuranStackParamList>();

// ⭐ Quran nested navigator
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
        options={({ route }) => ({
          title: route.params.surahName,
        })}
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

  useEffect(() => {
    createChannel();
  }, []);

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

          {/* Splash Screen */}
          <Stack.Screen name="AnimatedSplash" component={AnimatedSplash} />

          {/* Main App */}
          <Stack.Screen name="BottomTabs" component={BottomTabs} />

          {/* Menu */}
          <Stack.Screen name="Menu" component={MenuScreen} />

          {/* Standard Routes */}
          <Stack.Screen name="Settings" component={SettingsScreen} options={header(colors, 'Settings')} />
          <Stack.Screen name="Themes" component={ThemesScreen} options={header(colors, 'Select Theme')} />
          <Stack.Screen name="ResetSalah" component={ResetSalahScreen} options={header(colors, 'Reset Salah Data')} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} options={header(colors, 'Salah Analytics')} />
          <Stack.Screen name="QazaIntro" component={QazaIntroScreen} options={header(colors, 'Qaza Introduction')} />
          <Stack.Screen name="QazaTracker" component={QazaTrackerScreen} options={header(colors, 'Qaza Tracker')} />
          <Stack.Screen name="PrayerTimings" component={PrayerTimingsScreen} options={header(colors, 'Prayer Timings')} />

          {/* Quran */}
          <Stack.Screen
            name="Quran"
            component={QuranNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SurahDetails"
            component={SurahDetailsScreen}
            options={({ route }) => header(colors, route.params.surahName)}
          />

          <Stack.Screen name="AboutApp" component={AboutAppScreen} options={header(colors, 'About App')} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={header(colors, 'Privacy Policy')} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={header(colors, 'Notifications')} />
          <Stack.Screen name="SupportUs" component={SupportUsScreen} options={header(colors, 'Support Us')} />

          {/* ⭐ VR Screens */}
          <Stack.Screen name="VRVideos" component={VRVideosScreen} options={header(colors, 'VR Videos')} />
          <Stack.Screen name="VRPlayer" component={VRPlayerScreen} options={header(colors, 'VR Player')} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Reusable Header
const header = (colors: any, title: string) => ({
  headerShown: true,
  headerTitle: title,
  headerTitleAlign: 'center',
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.headerTitle,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
  },
});

export default App;
