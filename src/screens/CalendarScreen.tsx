// ====================================================================
// SALAH TRACKER – QUARTERLY CALENDAR (FINAL CLEAN VERSION)
// ANCHOR HABITS STRUCTURE • PERFECT MONTH SPACING • VERTICAL WEEKDAYS
// ====================================================================

import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeContext } from "../theme/ThemeContext";
import {
  loadSalahTrackerData,
  saveSalahTrackerData,
  SalahTrackerData,
  PrayerName,
  getTodayDate,
} from "../storage/trackerStorage";

// -------------------- WIDTH LOGIC --------------------

const SCREEN_WIDTH = Dimensions.get("window").width;

const WEEKDAY_COL_WIDTH = 32; // aligned nicely
const H_PADDING = 20; // total horizontal padding of card

const MONTH_WIDTH = (SCREEN_WIDTH - WEEKDAY_COL_WIDTH - H_PADDING) / 3;

const CELL = 15;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// -------------------- MONTH MATRIX --------------------

const buildMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const matrix: (string | null)[][] = [];
  let day = 1;

  const firstRow = Array(7).fill(null);
  for (let i = firstDay; i < 7; i++) {
    firstRow[i] = String(day).padStart(2, "0");
    day++;
  }
  matrix.push(firstRow);

  while (day <= lastDay) {
    const row: (string | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (day <= lastDay) row.push(String(day).padStart(2, "0"));
      else row.push(null);
      day++;
    }
    matrix.push(row);
  }

  return matrix;
};

// -------------------- ROTATE TO WEEKDAY GRID --------------------

const buildWeekdayGrid = (year: number, month: number) => {
  const matrix = buildMonthMatrix(year, month);
  const numWeeks = matrix.length;

  const grid: (string | null)[][] = Array(7)
    .fill(null)
    .map(() => Array(numWeeks).fill(null));

  for (let w = 0; w < numWeeks; w++) {
    for (let d = 0; d < 7; d++) {
      grid[d][w] = matrix[w][d];
    }
  }

  return { grid, numWeeks };
};

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

// -------------------- MAIN SCREEN --------------------

const CalendarScreen: React.FC = () => {
  const { colors } = useContext(ThemeContext);

  const [salahData, setSalahData] = useState<SalahTrackerData | null>(null);
  const todayStr = getTodayDate();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [quarterStart, setQuarterStart] = useState(
    Math.floor(today.getMonth() / 3) * 3
  );

  useEffect(() => {
    (async () => {
      const d = await loadSalahTrackerData();
      setSalahData(d);
    })();
  }, []);

  const toggleDay = useCallback(
    async (prayer: PrayerName, date: string) => {
      if (!salahData) return;

      const updated = {
        ...salahData,
        [prayer]: {
          ...salahData[prayer],
          [date]: !salahData[prayer]?.[date],
        },
      };

      setSalahData(updated);
      await saveSalahTrackerData(updated);
    },
    [salahData]
  );

  const quarterMonths = [quarterStart, quarterStart + 1, quarterStart + 2];

  const goPrevQuarter = () => {
    if (quarterStart === 0) {
      setYear((y) => y - 1);
      setQuarterStart(9);
    } else setQuarterStart((q) => q - 3);
  };

  const goNextQuarter = () => {
    if (quarterStart === 9) {
      setYear((y) => y + 1);
      setQuarterStart(0);
    } else setQuarterStart((q) => q + 3);
  };

  return (
    <SafeAreaView style={styles.container(colors)}>
      <Text style={styles.title(colors)}>Calendar View</Text>

      <View style={styles.quarterRow}>
        <TouchableOpacity onPress={goPrevQuarter}>
          <Icon name="chevron-back" size={22} color={colors.primaryAccent} />
        </TouchableOpacity>

        <Text style={styles.quarterText(colors)}>
          Quarter {quarterStart / 3 + 1} · {year}
        </Text>

        <TouchableOpacity onPress={goNextQuarter}>
          <Icon name="chevron-forward" size={22} color={colors.primaryAccent} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {PRAYERS.map((prayer) => (
          <View key={prayer} style={styles.card(colors)}>
            <View style={styles.cardHeader}>
              <Text style={styles.prayerName(colors)}>{prayer}</Text>
              <TouchableOpacity onPress={() => toggleDay(prayer, todayStr)}>
                <Icon name="checkmark-circle" size={18} color={colors.primaryAccent} />
              </TouchableOpacity>
            </View>

            {/* ---- CONSTANT WEEKDAY COLUMN ---- */}
            <View style={styles.fullRow}>
              <View style={styles.weekdayColumn}>
                {WEEKDAYS.map((w) => (
                  <Text key={w} style={styles.weekday(colors)}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* ---- THREE MONTHS ---- */}
              {quarterMonths.map((monthIndex) => {
                const { grid, numWeeks } = buildWeekdayGrid(year, monthIndex);

                return (
                  <View key={monthIndex} style={styles.monthColumn}>
                    <Text style={styles.monthLabel(colors)}>
                      {new Date(year, monthIndex).toLocaleString("default", {
                        month: "short",
                      })}{" "}
                      {String(year).slice(2)}
                    </Text>

                    {WEEKDAYS.map((wd, weekdayIndex) => (
                      <View key={wd} style={styles.row}>
                        {Array.from({ length: numWeeks }).map((_, weekIndex) => {
                          const day = grid[weekdayIndex][weekIndex];

                          if (!day)
                            return <View key={weekIndex} style={styles.emptyCell} />;

                          const dateString = `${year}-${String(
                            monthIndex + 1
                          ).padStart(2, "0")}-${day}`;

                          const done = salahData?.[prayer]?.[dateString];
                          const isToday = dateString === todayStr;

                          return (
                            <TouchableOpacity
                              key={weekIndex}
                              onPress={() => toggleDay(prayer, dateString)}
                              style={[
                                styles.dateCell(colors),
                                done && { backgroundColor: colors.primaryAccent },
                                isToday && {
                                  borderWidth: 1,
                                  borderColor: colors.primaryAccent,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dateText(colors),
                                  done && { color: colors.background },
                                ]}
                              >
                                {day}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;

// ====================================================================
// STYLES — CLEAN, EVEN SPACING, PERFECT ALIGNMENT
// ====================================================================

const styles = {
  container: (colors: any) => ({
    flex: 1,
    backgroundColor: colors.background,
  }),

  title: (colors: any) => ({
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.headingBlue,
    marginTop: 6,
    marginBottom: 4,
  }),

  quarterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 2,
  },

  quarterText: (colors: any) => ({
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryAccent,
  }),

  card: (colors: any) => ({
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
    marginBottom: 10,
  }),

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  prayerName: (colors: any) => ({
    fontSize: 16,
    fontWeight: "bold",
    color: colors.parrotGreen,
  }),

  fullRow: {
    flexDirection: "row",
    width: SCREEN_WIDTH - 20,
    alignSelf: "center",
    marginTop: 6,
  },

  weekdayColumn: {
    width: WEEKDAY_COL_WIDTH,
  },

  weekday: (colors: any) => ({
    fontSize: 10,
    height: CELL,
    textAlign: "right",
    paddingRight: 3,
    color: colors.secondaryText,
  }),

  monthColumn: {
    width: MONTH_WIDTH,
    alignItems: "center",
    marginTop: -14,
  },

  monthLabel: (colors: any) => ({
    fontSize: 11,
    color: colors.headingBlue,
    marginBottom: 2,
  }),

  row: {
    flexDirection: "row",
  },

  emptyCell: {
    width: CELL,
    height: CELL,
    marginHorizontal: 1,
  },

  dateCell: (colors: any) => ({
    width: CELL,
    height: CELL,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1,
    borderRadius: 2,
    backgroundColor: colors.cardBackground,
  }),

  dateText: (colors: any) => ({
    fontSize: 9,
    color: colors.secondaryText,
  }),
};
