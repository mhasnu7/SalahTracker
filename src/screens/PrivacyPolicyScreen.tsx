import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext'; // Assuming useTheme is in ../theme/ThemeContext

const PrivacyPolicyScreen = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.headerTitle,
      marginBottom: 20,
      textAlign: 'center',
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.headerTitle,
      marginTop: 15,
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      color: colors.secondaryText,
      marginBottom: 10,
      lineHeight: 24,
    },
    contactInfo: {
      marginTop: 20,
      fontStyle: 'italic',
      color: colors.secondaryText,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.heading}>1. Data Collection</Text>
        <Text style={styles.paragraph}>
          The Salah Tracker application ("App") does not collect any personal user data. We are committed to protecting your privacy, and as such, we do not gather, store, or transmit any information about you or your device when you use our App.
        </Text>

        <Text style={styles.heading}>2. Information Sharing</Text>
        <Text style={styles.paragraph}>
          Since no personal data is collected, there is no information to share with third parties. Your use of the App is entirely private and anonymous.
        </Text>

        <Text style={styles.heading}>3. Permissions</Text>
        <Text style={styles.paragraph}>
          The App may request certain permissions necessary for its core functionality, such as access to local storage for saving your prayer tracking data. These permissions are solely used for the operation of the App on your device and are not linked to any data collection or sharing.
        </Text>

        <Text style={styles.heading}>4. Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </Text>

        <Text style={styles.heading}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or suggestions about our Privacy Policy, please do not hesitate to contact us.
        </Text>
        <Text style={styles.contactInfo}>
          Developer: Mohammed Hasnuddin{'\n'}
          Contact Email: mdhasnu21@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;