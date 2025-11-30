import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SupportUsScreen = () => {
  const { colors } = useTheme();

  const openUPI = () => {
    const upiUrl =
      'upi://pay?pa=8660753558@ybl&pn=Salah%20Tracker&cu=INR';
    Linking.openURL(upiUrl).catch(() =>
      alert('No UPI app found. Please install GPay/PhonePe/Paytm.')
    );
  };

  const openBMC = () => {
    Linking.openURL('https://buymeacoffee.com/mohammedhasnuddin');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.headerTitle }]}>
        Support the Developer
      </Text>

      <Text style={[styles.info, { color: colors.secondaryText }]}>
        I keep Salah Tracker completely free — no ads, no premium version.
        If the app benefits you, you may support its development using the
        options below. JazakAllah Khair ❤️
      </Text>

      {/* UPI Donation */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primaryAccent }]}
        onPress={openUPI}
      >
        <Text style={styles.buttonText}>🇮🇳 Support via UPI</Text>
      </TouchableOpacity>

      {/* Buy Me a Coffee */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FFDD00' }]}
        onPress={openBMC}
      >
        <Text style={[styles.buttonText, { color: '#333' }]}>☕ Buy Me a Coffee</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  info: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 25,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
});

export default SupportUsScreen;
