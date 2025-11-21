import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Tracker: undefined;
  Calendar: undefined;
  QuranScreen: undefined; // Added QuranScreen to BottomTabNavigator
  Menu: undefined;
};

export type QuranStackParamList = {
  QuranSurahList: undefined;
  SurahDetails: { surahNumber: number; surahName: string };
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<RootTabParamList>;
  Menu: undefined;
  Quran: NavigatorScreenParams<QuranStackParamList>;
  SurahDetails: { surahNumber: number; surahName: string };
  Settings: undefined;
  Themes: undefined;
  ResetSalah: undefined;
  Analytics: undefined;
  QazaIntro: undefined;
  QazaTracker: undefined;
  PrayerTimings: undefined;
  QuranScreen: undefined; // Adding the new QuranScreen to RootStackParamList
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  Screen
>;

// --- UPDATED Navigation Props ---
// Navigation prop for the primary Menu screen
export type MenuScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Menu'>['navigation'];

export type QuranSurahListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Quran'>['navigation'];
export type SurahDetailsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SurahDetails'>['navigation'];

export type TrackerScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'BottomTabs'>['navigation'];

export type ThemesScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Themes'>['navigation'];

export type ResetSalahScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ResetSalah'>['navigation'];
export type QazaIntroScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'QazaIntro'>['navigation'];
export type QazaTrackerScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'QazaTracker'>['navigation'];

// Keeping Settings navigation prop just in case you use it within the Menu page
export type SettingsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Settings'>['navigation'];
