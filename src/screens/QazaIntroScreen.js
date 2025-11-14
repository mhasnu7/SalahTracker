import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const QazaIntroScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000, // Fade in over 1 second
        useNativeDriver: true,
      }
    ).start();

    const timer = setTimeout(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 1000, // Fade out over 1 second
          useNativeDriver: true,
        }
      ).start(() => {
        navigation.replace('QazaTracker'); // Navigate after fade out
      });
    }, 15000); // Start fade out after 15 seconds (1s fade in + 14s display)

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        This Qazā Salah tracker provides an approximate estimate,
        assuming you performed all Jumu‘ah prayers and prayed all 5 daily Salahs during Ramadan.
        You can adjust missed Salahs and average Fard prayed manually next.
        May Allah accept your sincere efforts 🌙
      </Animated.Text>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace('QazaTracker')}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#9EFF70',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QazaIntroScreen;