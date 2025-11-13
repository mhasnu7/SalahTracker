import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../theme/ThemeContext';
import { PrayerName } from '../storage/trackerStorage';

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

interface PrayerCardProps {
  prayerName: PrayerName;
  isCompletedToday: boolean;
  onToggle: (prayer: PrayerName) => void;
  last196Days: boolean[];
}

export const PrayerCard: React.FC<PrayerCardProps> = ({
  prayerName,
  isCompletedToday,
  onToggle,
  last196Days,
}) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={styles(colors).card}>
      <View style={styles(colors).cardHeader}>
        <Text style={styles(colors).prayerName}>{prayerName}</Text>
        <TouchableOpacity
          style={styles(colors).checkmarkButton}
          onPress={() => onToggle(prayerName)}
          activeOpacity={0.7}
        >
          <Icon name="checkmark-circle" size={20} color={isCompletedToday ? colors.primaryAccent : colors.grey} />
        </TouchableOpacity>
      </View>
      <View style={styles(colors).dotGrid}>
        {last196Days.map((completed, index) => (
          <View
            key={index}
            style={[
              styles(colors).dot,
              { backgroundColor: completed ? colors.primaryAccent : colors.cardBackground },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryAccent,
  },
  checkmarkButton: {
    padding: 5,
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    margin: 2,
  },
});