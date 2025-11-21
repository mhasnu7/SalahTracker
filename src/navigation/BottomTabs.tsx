import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TrackerScreen } from '../screens/TrackerScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import MenuScreen from '../screens/MenuScreen';
import { ThemeContext } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootTabParamList } from './types';
import QuranScreen from '../screens/QuranSurahList'; // Import the new QuranSurahListScreen

const Tab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabs = () => {
  const { colors } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryAccent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          elevation: 10,
          shadowColor: colors.primaryAccent,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          justifyContent: 'space-around',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 2,
        },
        tabBarItemStyle: {
          flex: 1,
        },
      }}
    >
      <Tab.Screen
        name="Tracker"
        component={TrackerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-outline" color={color} size={size + 2} />
          ),
          tabBarLabel: 'Tracker',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" color={color} size={size + 2} />
          ),
          tabBarLabel: 'Calendar',
        }}
      />
      <Tab.Screen
        name="QuranScreen" // New tab for Quran
        component={QuranScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" color={color} size={size + 2} />
          ),
          tabBarLabel: 'Quran',
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu-outline" color={color} size={size + 2} />
          ),
          tabBarLabel: 'Menu',
        }}
      />
    </Tab.Navigator>
  );
};