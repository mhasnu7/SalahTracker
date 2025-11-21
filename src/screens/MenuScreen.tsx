import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { SlideInUp } from 'react-native-reanimated';

import MenuCard from '../components/MenuCard';
import { useTheme } from '../theme/ThemeContext';
import { menuStyles } from '../styles/menuStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Assuming navigation prop to be used for Stack navigation actions
import { MenuScreenNavigationProp, QuranSurahListScreenNavigationProp } from '../navigation/types';

const MenuScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<MenuScreenNavigationProp | QuranSurahListScreenNavigationProp>(); // Updated to allow navigation to Quran stack
  const styles = menuStyles(isDark);

  // Define Menu Items structure using routes defined in RootStackParamList where applicable
const menuItems = [
    {
      title: "Prayer Tracker",
      iconName: "clock-check-outline",
      destination: "Tracker" // Existing Tab Route
    },
    {
      title: "Calendar View",
      iconName: "calendar-month-outline",
      destination: "Calendar" // Existing Tab Route
    },
    {
      title: "Qaza Tracker",
      iconName: "alert-decagram-outline",
      destination: "QazaTracker" // Stack Route
    },
    {
      title: "Prayer Timings",
      iconName: "weather-sunset-up",
      destination: "PrayerTimings" // Stack Route
    },
    {
      title: "Quran",
      iconName: "book-open-variant", // Using a relevant icon from MaterialCommunityIcons
      destination: "Quran" // New Stack Navigator Route
    },
    {
      title: "Analytics & Insights",
      iconName: "chart-line",
      destination: "Analytics" // Stack Route
    },
    {
      title: "Settings",
      iconName: "cog-outline",
      destination: "Settings" // Stack Route defined in types.ts
    },
    {
      title: "About App",
      iconName: "information-outline",
      destination: "AboutApp" // Stack Route for AboutAppScreen
    },
  ];

  const handlePress = (destination: string) => {
    // NOTE: Actual navigation requires all destination routes to be registered in the main navigators (Stack/Tabs).
    // For this UI redesign, we mock console log, but in production, this would navigate.
    console.log(`Navigating to: ${destination}`);
    if (destination === "Tracker" || destination === "Calendar") {
      navigation.navigate("BottomTabs", { screen: destination });
    } else {
      // For other stack navigators like 'Quran', 'Settings', etc.
      // Need to handle navigation to a new stack if it's a nested navigator
      if (destination === "Quran") {
        navigation.navigate("Quran", { screen: "QuranSurahList" });
      } else {
        navigation.navigate(destination as never);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Explore powerful features</Text>
      </View>
      
      <ScrollView contentContainerStyle={[styles.cardGrid, { flexGrow: 1 }]} bounces={false}>
        {menuItems.map((item, index) => (
          <View key={item.title} style={{ flexBasis: '50%' }}>
            <Animated.View
              // Stagger fade-in and upward motion
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
        {/* Spacer to push content up if needed and allow scroll */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Home Button at the bottom, centrally placed */}
      <Animated.View
        entering={SlideInUp.delay(menuItems.length * 100 + 100).duration(400)}
        style={styles.bottomHomeButtonContainer}
      >
        <MenuCard
          title="Home"
          iconName="home-outline"
          onPress={() => handlePress("Tracker")}
        />
      </Animated.View>
    </View>
  );
};

export default MenuScreen;