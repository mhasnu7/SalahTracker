import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Tracker: undefined;
  Calendar: undefined;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<RootTabParamList>;
  Settings: undefined;
  Themes: undefined;
  ResetSalah: undefined;
  Analytics: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  Screen
>;

export type SettingsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Settings'>['navigation'];

export type TrackerScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'BottomTabs'>['navigation'];

export type ThemesScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Themes'>['navigation'];

export type ResetSalahScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ResetSalah'>['navigation'];