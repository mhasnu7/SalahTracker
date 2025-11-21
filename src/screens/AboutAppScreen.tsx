import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutAppScreen = () => {
  const { colors } = useTheme();

  const appVersion = '1.0.0'; // Placeholder for app version
  const developerName = 'Mohammed Hasnuddin';
  const contactEmail = 'mdhasnu21@gmail.com';
  const appDescription = `SalahTracker is a comprehensive mobile application designed to help Muslim users track and manage their daily prayers, Qaza (missed) prayers, and provide valuable features like prayer timings, calendar view, and Quran access. Our goal is to empower users with tools to enhance their spiritual journey and maintain consistency in their worship.`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.headingBlue }]}>About SalahTracker</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{appDescription}</Text>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Version</Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{appVersion}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Developer</Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{developerName}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Contact</Text>
          <Text
            style={[styles.link, { color: colors.primaryAccent }]}
            onPress={() => Linking.openURL(`mailto:${contactEmail}`)}
          >
            {contactEmail}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>App Features</Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.primaryAccent} /> Prayer Tracking
          </Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.primaryAccent} /> Calendar View
          </Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.primaryAccent} /> Qaza Prayer Management
          </Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.primaryAccent} /> Accurate Prayer Timings
          </Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.primaryAccent} /> Quran Reading
          </Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.primaryAccent} /> Analytics & Insights
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20, // Add some padding to the bottom for scrolling
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AboutAppScreen;