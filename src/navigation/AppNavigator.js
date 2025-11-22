import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// import your screens correctly
import AnimatedSplash from '../screens/AnimatedSplash';
import HomeScreen from '../screens/HomeScreen';  // adjust this path if different

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="AnimatedSplash">
      
      <Stack.Screen
        name="AnimatedSplash"
        component={AnimatedSplash}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}
