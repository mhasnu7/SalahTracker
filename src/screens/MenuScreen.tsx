import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { SlideInUp, ZoomIn } from 'react-native-reanimated';

import MenuCard from '../components/MenuCard';
import { useTheme } from '../theme/ThemeContext';
import { menuStyles } from '../styles/menuStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  MenuScreenNavigationProp,
  QuranSurahListScreenNavigationProp,
} from '../navigation/types';

const MenuScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<MenuScreenNavigationProp | QuranSurahListScreenNavigationProp>();
  const styles = menuStyles(isDark);

  // ⭐ Regular menu items
  const menuItems = [
    {
      title: 'Prayer Tracker',
      iconName: 'clock-check-outline',
      destination: 'Tracker',
    },
    {
      title: 'Calendar View',
      iconName: 'calendar-month-outline',
      destination: 'Calendar',
    },
    {
      title: 'Qaza Tracker',
      iconName: 'alert-decagram-outline',
      destination: 'QazaTracker',
    },
    {
      title: 'Prayer Timings',
      iconName: 'weather-sunset-up',
      destination: 'PrayerTimings',
    },
    {
      title: 'Quran',
      iconName: 'book-open-variant',
      destination: 'Quran',
    },
    {
      title: 'Analytics & Insights',
      iconName: 'chart-line',
      destination: 'Analytics',
    },
    {
      title: 'Settings',
      iconName: 'cog-outline',
      destination: 'Settings',
    },
    {
      title: 'About App',
      iconName: 'information-outline',
      destination: 'AboutApp',
    },
    {
      title: 'Privacy Policy',
      iconName: 'shield-lock-outline',
      destination: 'PrivacyPolicy',
    },
  ];

  // ⭐ Special Donation Tile (separate so we style it differently)
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
        {/* Render all regular menu cards */}
        {menuItems.map((item, index) => (
          <View key={item.title} style={{ flexBasis: '50%' }}>
            <Animated.View
              entering={SlideInUp.delay(index * 100 + 100).duration(400)}
            >
              <MenuCard
                title={item.title}
                iconName={item.iconName}
                onPress={() => handlePress(item.destination)}
              />
            </Animated.View>
          </View>
        ))}

        {/* ⭐ Special Donation Card — visually enhanced */}
        <View key="donation" style={{ flexBasis: '50%' }}>
          <Animated.View
            entering={ZoomIn.duration(500)} // Slight zoom animation for emphasis
            style={{
              borderWidth: 2,
              borderColor: '#D4AF37', // Gold outline
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: '#D4AF37',
              shadowOpacity: 0.5,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <MenuCard
              title={donationTile.title}
              iconName={donationTile.iconName}
              onPress={() => handlePress(donationTile.destination)}
              customBackground="gold" // Custom prop if your MenuCard supports it
            />
          </Animated.View>
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
