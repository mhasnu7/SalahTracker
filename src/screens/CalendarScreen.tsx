import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, Directions } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../theme/ThemeContext';
import { loadSalahTrackerData, SalahTrackerData, PrayerName, getTodayDate, saveSalahTrackerData } from '../storage/trackerStorage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// --- Constants for Extreme Compact Layout ---
const STATUS_BAR_HEIGHT = 20; // Estimated status bar height
const BOTTOM_NAV_HEIGHT = 60; // Estimated bottom navigation height (assuming a bottom tab navigator)
const HEADER_HEIGHT = 30; // Further reduced header height
const PRAYER_NAME_HEIGHT = 16; // Further reduced prayer name height
const CARD_HORIZONTAL_PADDING = 4; // Further reduced horizontal padding
const CARD_INNER_PADDING = 2; // Further reduced inner padding
const CARD_MARGIN_VERTICAL = 3; // Increased margin between cards for clear space
const CARD_BORDER_RADIUS = 9; // Smaller border radius

// Calculate vertical dimensions for day cells to fit 5 cards
const AVAILABLE_HEIGHT_FOR_CARDS_AREA = screenHeight - STATUS_BAR_HEIGHT - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT;
const TOTAL_VERTICAL_SPACE_PER_CARD_EXCEPT_GRID = PRAYER_NAME_HEIGHT + (CARD_INNER_PADDING * 2) + CARD_MARGIN_VERTICAL;
const HEIGHT_PER_CARD_FOR_GRID = (AVAILABLE_HEIGHT_FOR_CARDS_AREA / PRAYER_NAMES.length) - TOTAL_VERTICAL_SPACE_PER_CARD_EXCEPT_GRID;

const NUM_DAY_ROWS_PER_MONTH = 6; // Max 6 weeks in a month
const DAY_CELL_VERTICAL_MARGIN = 0.15; // Very small vertical margin for day cells

const DAY_CELL_HEIGHT = Math.floor(HEIGHT_PER_CARD_FOR_GRID / NUM_DAY_ROWS_PER_MONTH) - (DAY_CELL_VERTICAL_MARGIN * 2);

// Calculate horizontal dimensions for day cells
const WEEKDAY_COLUMN_WIDTH = 20; // Fixed width for the vertical weekday column
const TOTAL_MONTHS_DISPLAYED = 3;
const AVAILABLE_WIDTH_FOR_MONTHS = screenWidth - (CARD_HORIZONTAL_PADDING * 2) - (CARD_INNER_PADDING * 2) - WEEKDAY_COLUMN_WIDTH - (TOTAL_MONTHS_DISPLAYED * 2); // Account for margins between months
const MONTH_BLOCK_WIDTH = AVAILABLE_WIDTH_FOR_MONTHS / TOTAL_MONTHS_DISPLAYED;
const DAY_CELL_WIDTH = Math.floor(MONTH_BLOCK_WIDTH / 7) - 2; // Account for very small horizontal margins

const DAY_CELL_SIZE = Math.min(DAY_CELL_HEIGHT, DAY_CELL_WIDTH); // Use the smaller of the two to ensure fit

// --- Component Definitions ---

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

interface DayCellProps {
  date: string;
  isCompleted: boolean;
  onToggle: (prayer: PrayerName, date: string) => void;
  prayerName: PrayerName;
}

const DayCell: React.FC<DayCellProps> = ({ date, isCompleted, onToggle, prayerName }) => {
  const { colors } = useContext(ThemeContext);
  const todayStr = getTodayDate();
  const isFutureDate = new Date(date) > new Date(todayStr);
  const isCurrentDay = date === todayStr;

  const bgColor = isCompleted ? colors.primaryAccent : colors.cardBackground;
  const textColor = isFutureDate ? colors.grey : (isCompleted ? colors.background : colors.secondaryText);

  return (
    <TouchableOpacity
      style={[
        styles(colors).dayCircle,
        {
          backgroundColor: isCompleted ? colors.primaryAccent : colors.cardBackground,
          borderColor: isCurrentDay ? colors.primaryAccent : colors.cardBackground,
          borderWidth: isCurrentDay ? 1 : 0,
        },
      ]}
      onPress={() => !isFutureDate && onToggle(prayerName, date)}
      disabled={isFutureDate}
    >
      <Text style={[styles(colors).dayText, { color: textColor, fontWeight: isCurrentDay ? 'bold' : 'normal' }]}>
        {date.split('-')[2]}
      </Text>
    </TouchableOpacity>
  );
};

interface MonthGridProps {
  monthData: { date: string; isCompleted: boolean; monthName: string; year: number }[];
  onToggle: (prayer: PrayerName, date: string) => void;
  prayerName: PrayerName;
}

const MonthGrid: React.FC<MonthGridProps> = ({ monthData, onToggle, prayerName }) => {
  const { colors } = useContext(ThemeContext);
  const firstMonthInfo = monthData.find(d => !d.date.startsWith('empty'));
  const monthTitle = firstMonthInfo ? `${firstMonthInfo.monthName.substring(0, 3)} ${firstMonthInfo.year % 100}` : '';

  return (
    <View style={styles(colors).monthGridContainer}>
      <Text style={styles(colors).monthGridTitle}>{monthTitle}</Text>
      <View style={styles(colors).calendarGrid}>
        {Array.from({ length: 7 }).map((_, dayOfWeekIndex) => { // 7 rows for days of the week
          const firstMonthInfo = monthData.find(d => !d.date.startsWith('empty'));
          const monthTitle = firstMonthInfo ? `${firstMonthInfo.monthName.substring(0, 3)} ${firstMonthInfo.year % 100}` : '';
          return (
            <View key={`${prayerName}-${monthTitle}-${dayOfWeekIndex}`} style={styles(colors).calendarRow}>
              {Array.from({ length: 5 }).map((_, weekIndex) => { // 5 columns for weeks
                const firstDayOfMonth = new Date(monthData[0].year, new Date(monthData[0].date).getMonth(), 1).getDay();
                const dayOfMonth = (weekIndex * 7) + dayOfWeekIndex - firstDayOfMonth + 1;

                let item = null;
                if (dayOfMonth > 0 && dayOfMonth <= new Date(monthData[0].year, new Date(monthData[0].date).getMonth() + 1, 0).getDate()) {
                  const date = new Date(monthData[0].year, new Date(monthData[0].date).getMonth(), dayOfMonth);
                  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                  item = monthData.find(d => d.date === formattedDate);
                }

                if (!item) {
                  return <View key={`empty-${dayOfWeekIndex}-${weekIndex}`} style={styles(colors).miniDayCellPlaceholder} />;
                }
                return (
                  <DayCell
                    key={item.date}
                    date={item.date}
                    isCompleted={item.isCompleted}
                    onToggle={onToggle}
                    prayerName={prayerName}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// --- Main Screen Component ---

export const CalendarScreen: React.FC = () => {
  const { colors, isDark } = useContext(ThemeContext);
  const [salahData, setSalahData] = useState<SalahTrackerData | null>(null);
  const [prayerQuarters, setPrayerQuarters] = useState<{ prayerName: PrayerName, monthsData: { date: string; isCompleted: boolean; monthName: string; year: number }[][] }[]>([]);
  const [currentQuarterStartMonth, setCurrentQuarterStartMonth] = useState(() => {
    const currentMonth = new Date().getMonth();
    return Math.floor(currentMonth / 3) * 3;
  });

  const fetchSalahData = useCallback(async () => {
    const data = await loadSalahTrackerData();
    setSalahData(data);
  }, []);

  const generatePrayerQuarters = useCallback((data: SalahTrackerData) => {
    const allPrayerQuarters = PRAYER_NAMES.map((prayerName) => {
      const allMonthsDataForPrayer: { date: string; isCompleted: boolean; monthName: string; year: number }[][] = [];
      const today = new Date();
      const currentYear = today.getFullYear();

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const currentMonthDate = new Date(currentYear, monthIndex, 1);
        const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });
        const year = currentMonthDate.getFullYear();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const monthDays: { date: string; isCompleted: boolean; monthName: string; year: number }[] = [];

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, monthIndex, day);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          monthDays.push({ date: formattedDate, isCompleted: data[prayerName]?.[formattedDate] || false, monthName, year });
        }

        allMonthsDataForPrayer.push(monthDays);
      }
      
      return { prayerName, monthsData: allMonthsDataForPrayer };
    });
    setPrayerQuarters(allPrayerQuarters);
  }, []);

  const handlePreviousQuarter = () => {
    setCurrentQuarterStartMonth((prev) => Math.max(0, prev - 3));
  };

  const handleNextQuarter = () => {
    setCurrentQuarterStartMonth((prev) => Math.min(9, prev + 3));
  };

  const togglePrayerCompletion = useCallback(
    async (prayerName: PrayerName, date: string) => {
      const todayStr = getTodayDate();
      const isFutureDate = new Date(date) > new Date(todayStr);
      if (!salahData || isFutureDate) return; // Prevent toggling for future dates

      const updatedData = {
        ...salahData,
        [prayerName]: {
          ...salahData[prayerName],
          [date]: !salahData[prayerName]?.[date],
        },
      };
      setSalahData(updatedData);
      await saveSalahTrackerData(updatedData);
      generatePrayerQuarters(updatedData);
    },
    [salahData, generatePrayerQuarters]
  );

  const handleMarkAllComplete = useCallback( // This function will now toggle today's prayer
    async (prayerName: PrayerName) => {
      if (!salahData) return;
      const updatedData = { ...salahData };
      const todayStr = getTodayDate();

      if (!updatedData[prayerName]) {
        updatedData[prayerName] = {};
      }
      updatedData[prayerName][todayStr] = !updatedData[prayerName]?.[todayStr];
      const changed = true;


      if (changed) {
        setSalahData(updatedData);
        await saveSalahTrackerData(updatedData);
        generatePrayerQuarters(updatedData);
      }
    },
    [salahData, generatePrayerQuarters]
  );

  useFocusEffect(
    useCallback(() => {
      fetchSalahData();
    }, [fetchSalahData])
  );

  useEffect(() => {
    if (salahData) {
      generatePrayerQuarters(salahData);
    }
  }, [salahData, generatePrayerQuarters]);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <SafeAreaView style={styles(colors).safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={styles(colors).header}>
        <Text style={styles(colors).headerTitle}>Calendar View</Text>
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={styles(colors).container} contentContainerStyle={styles(colors).contentContainer}>
          {prayerQuarters.length > 0 ? (
            prayerQuarters.map((prayerQuarter) => {
              const currentQuarterMonths = prayerQuarter.monthsData.slice(
                currentQuarterStartMonth,
                currentQuarterStartMonth + 3
              );

              const fling = Gesture.Fling()
                .direction(Directions.LEFT)
                .onEnd(() => {
                  handleNextQuarter();
                });

              const flingRight = Gesture.Fling()
                .direction(Directions.RIGHT)
                .onEnd(() => {
                  handlePreviousQuarter();
                });

              return (
                <GestureDetector key={prayerQuarter.prayerName} gesture={Gesture.Race(fling, flingRight)}>
                  <View style={styles(colors).prayerCardContainer}>
                    <View style={styles(colors).prayerCardHeader}>
                      <Text style={styles(colors).prayerNameText}>{prayerQuarter.prayerName}</Text>
                      <TouchableOpacity
                        style={styles(colors).markAllCompleteButton}
                        onPress={() => handleMarkAllComplete(prayerQuarter.prayerName)}
                      >
                        <Icon name="checkmark-circle" size={20} color={colors.primaryAccent} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles(colors).quarterViewWrapper}>
                      <View style={styles(colors).weekdaysColumn}>
                        {weekDays.map((day) => (
                          <Text key={day} style={styles(colors).weekdayTextVertical}>
                            {day}
                          </Text>
                        ))}
                      </View>
                      <View style={styles(colors).threeMonthsGridContainer}>
                        {currentQuarterMonths.map((monthData) => (
                          <View key={`${prayerQuarter.prayerName}-${monthData[0].monthName}-${monthData[0].year}`} style={styles(colors).monthContainer}>
                            <MonthGrid
                              prayerName={prayerQuarter.prayerName}
                              monthData={monthData}
                              onToggle={togglePrayerCompletion}
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </GestureDetector>
              );
            })
          ) : (
            <Text style={styles(colors).loadingText}>Loading calendar data...</Text>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

// --- Styles ---
interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    height: HEADER_HEIGHT,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.headerTitle,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingBottom: 20,
  },
  loadingText: {
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  prayerCardContainer: {
    marginBottom: CARD_MARGIN_VERTICAL,
    backgroundColor: colors.cardBackground,
    borderRadius: CARD_BORDER_RADIUS,
    paddingVertical: CARD_INNER_PADDING,
    paddingHorizontal: CARD_INNER_PADDING * 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  prayerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prayerNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryAccent,
  },
  markAllCompleteButton: {
    padding: 5,
  },
  quarterViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekdaysColumn: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginRight: 4,
    paddingTop: 18, // Adjust to align with the first row of dates
  },
  weekdayTextVertical: {
    fontSize: 9,
    color: colors.secondaryText,
    fontWeight: 'bold',
    height: DAY_CELL_SIZE + (DAY_CELL_VERTICAL_MARGIN * 2),
    textAlignVertical: 'center',
  },
  threeMonthsGridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthGridContainer: {
    alignItems: 'center',
  },
  monthGridTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.secondaryText,
    marginBottom: 0,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'column', // Main container is column for 7 rows
    width: '100%',
  },
  calendarRow: {
    flexDirection: 'row', // Each row contains 5 day cells
    justifyContent: 'space-around',
    width: '100%',
  },
  miniDayCellPlaceholder: {
    width: DAY_CELL_SIZE + (DAY_CELL_VERTICAL_MARGIN * 2),
    height: DAY_CELL_SIZE + (DAY_CELL_VERTICAL_MARGIN * 2),
    margin: DAY_CELL_VERTICAL_MARGIN,
  },
  // --- Day Cell Styling (Adjusted for compactness) ---
  dayCellWrapper: { // This style is no longer directly used by DayCell, but kept for potential future use or if other components rely on it.
    width: DAY_CELL_SIZE + (DAY_CELL_VERTICAL_MARGIN * 2),
    height: DAY_CELL_SIZE + (DAY_CELL_VERTICAL_MARGIN * 2),
    margin: DAY_CELL_VERTICAL_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircle: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    borderRadius: DAY_CELL_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: DAY_CELL_VERTICAL_MARGIN,
  },
  dayText: {
    fontSize: 8, // Slightly increased font size for better readability within the circle
    color: colors.secondaryText,
  },
});