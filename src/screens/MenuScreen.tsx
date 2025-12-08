import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MenuCard from '../components/MenuCard';
import { useTheme } from '../theme/ThemeContext';
import { menuStyles } from '../styles/menuStyles';

import {
  MenuScreenNavigationProp,
  QuranSurahListScreenNavigationProp,
} from '../navigation/types';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MenuScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<MenuScreenNavigationProp | QuranSurahListScreenNavigationProp>();
  const styles = menuStyles(isDark);

  // Trigger layout animation on mount
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  // ⭐ Regular menu items
  const menuItems = [
    { title: 'Prayer Tracker', iconName: 'clock-check-outline', destination: 'Tracker' },
    { title: 'Calendar View', iconName: 'calendar-month-outline', destination: 'Calendar' },
    { title: 'Qaza Tracker', iconName: 'alert-decagram-outline', destination: 'QazaTracker' },
    { title: 'Prayer Timings', iconName: 'weather-sunset-up', destination: 'PrayerTimings' },
    { title: 'Quran', iconName: 'book-open-variant', destination: 'Quran' },
    { title: 'Analytics & Insights', iconName: 'chart-line', destination: 'Analytics' },

    // ⭐ NEW VR VIDEOS BUTTON
    { title: 'VR Videos', iconName: 'virtual-reality', destination: 'VRVideos' },

    { title: 'Settings', iconName: 'cog-outline', destination: 'Settings' },
    { title: 'About App', iconName: 'information-outline', destination: 'AboutApp' },
    { title: 'Privacy Policy', iconName: 'shield-lock-outline', destination: 'PrivacyPolicy' },
  ];

  const donationTile = {
    title: 'Buy Me a Coffee ❤️',
    iconName: 'heart-circle-outline',
    destination: 'SupportUs',
  };

  const handlePress = (destination: string) => {
    if (destination === 'Tracker' || destination === 'Calendar') {
      navigation.navigate('BottomTabs', { screen: destination });
      return;
    }

    if (destination === 'Quran') {
      navigation.navigate('Quran', { screen: 'QuranSurahList' });
      return;
    }

    navigation.navigate(destination as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Explore powerful features</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.cardGrid, { flexGrow: 1 }]}
        bounces={false}
      >
        {/* ⭐ Main Menu Items */}
        {menuItems.map((item) => (
          <View
            key={item.title}
            style={{ flexBasis: '50%' }}
            onLayout={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }}
          >
            <MenuCard
              title={item.title}
              iconName={item.iconName}
              onPress={() => handlePress(item.destination)}
            />
          </View>
        ))}

        {/* ⭐ Special Donation Card */}
        <View
          key="donation"
          style={{ flexBasis: '50%', marginTop: 10 }}
          onLayout={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }}
        >
          <View
            style={{
              borderWidth: 2,
              borderColor: '#D4AF37',
              borderRadius: 16,
              overflow: 'hidden',
              elevation: 6,
            }}
          >
            <MenuCard
              title={donationTile.title}
              iconName={donationTile.iconName}
              onPress={() => handlePress(donationTile.destination)}
              customBackground="gold"
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
