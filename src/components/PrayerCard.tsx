import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../theme/ThemeContext';
import { PrayerName } from '../storage/trackerStorage';

// --- RESPONSIVE GRID CONFIGURATION ---
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_COLS = 27;
const GRID_ROWS = 7;
const TOTAL_DOTS = GRID_COLS * GRID_ROWS; // 189 dots
const CARD_PADDING_H = 12;
const SAFETY_MARGIN = 2;

// Card width calculation: screenWidth - (2 * marginHorizontal from parent) - (2 * cardPaddingH) - safety margin
const OUTER_MARGIN_H = 12; // Matches marginHorizontal in card style below
const AVAILABLE_WIDTH = SCREEN_WIDTH - (OUTER_MARGIN_H * 2) - (CARD_PADDING_H * 2) - SAFETY_MARGIN;
const DOT_MARGIN = 2;
const DOT_SIZE = Math.floor((AVAILABLE_WIDTH / GRID_COLS) - (DOT_MARGIN * 2));

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
  historicalCompletionData: { date: string; completed: boolean }[];
}

export const PrayerCard: React.FC<PrayerCardProps> = ({
  prayerName,
  isCompletedToday,
  onToggle,
  historicalCompletionData,
}) => {
  const { colors } = useContext(ThemeContext);

  // --- DATA MAPPING ---
  const emptyGrid = Array(TOTAL_DOTS).fill(false);

  const displayData = emptyGrid.map((_, index) => {
    if (index < historicalCompletionData.length) {
      return historicalCompletionData[index].completed;
    }
    return false;
  });

  return (
    <View style={styles(colors).card}>
      <View style={styles(colors).cardHeader}>
        <Text style={styles(colors).prayerName}>{prayerName}</Text>
        <TouchableOpacity
          style={styles(colors).checkmarkButton}
          onPress={() => onToggle(prayerName)}
          activeOpacity={0.7}
        >
          <Icon
            name="checkmark-circle"
            size={28}
            color={isCompletedToday ? colors.primaryAccent : colors.grey}
          />
        </TouchableOpacity>
      </View>

      <View style={styles(colors).gridContainer}>
        {displayData.map((isFilled, index) => (
          <View
            key={index}
            style={[
              styles(colors).dot,
              {
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                margin: DOT_MARGIN,
                backgroundColor: isFilled ? colors.primaryAccent : 'transparent',
                borderColor: isFilled ? colors.primaryAccent : colors.grey,
                opacity: isFilled ? 1 : 0.3,
              },
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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: CARD_PADDING_H,
    marginHorizontal: 12,
    // Reduced spacing for tighter look
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  checkmarkButton: {
    padding: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: (DOT_SIZE + (DOT_MARGIN * 2)) * GRID_COLS,
  },
  dot: {
    borderWidth: 1,
  },
});