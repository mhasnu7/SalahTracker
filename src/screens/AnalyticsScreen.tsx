import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { subMonths, subYears, startOfMonth, endOfMonth } from 'date-fns';
import SummaryCard from '../components/SummaryCard';
import { getPeriodData, calculateAnalytics } from '../utils/dataHelpers';
import { salahDataEventEmitter } from '../storage/trackerStorage';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1_month' | '3_months' | '6_months' | '1_year'>('3_months');

  const fetchData = useCallback(async () => {
    const today = new Date();
    let startDate: Date;
    const endDate = today;

    switch (selectedPeriod) {
      case '1_month':
        startDate = subMonths(today, 1);
        break;
      case '3_months':
        startDate = subMonths(today, 3);
        break;
      case '6_months':
        startDate = subMonths(today, 6);
        break;
      case '1_year':
        startDate = subYears(today, 1);
        break;
      default:
        startDate = subMonths(today, 3); // Default to 3 months
    }

    const data = await getPeriodData(startDate, endDate);
    const calculated = calculateAnalytics(data, startDate, endDate);
    setAnalytics(calculated);
  }, [selectedPeriod]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    const subscription = salahDataEventEmitter.addListener('salahDataUpdated', fetchData);
    return () => {
      subscription.remove();
    };
  }, []);

  if (!analytics) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  const barChartData = {
    labels: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
    datasets: [
      {
        data: analytics.salahPerformance,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salah Analytics</Text>
        <Picker
          selectedValue={selectedPeriod}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
        >
          <Picker.Item label="Last 1 Month" value="1_month" />
          <Picker.Item label="Last 3 Months" value="3_months" />
          <Picker.Item label="Last 6 Months" value="6_months" />
          <Picker.Item label="Last 1 Year" value="1_year" />
        </Picker>
        <TouchableOpacity onPress={fetchData}>
          <Icon name="refresh-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.summarySection}>
        <SummaryCard title="Total Offered" value={analytics.offeredPrayers} iconName="checkmark-circle-outline" color="#5FFF6F" />
        <SummaryCard title="Missed" value={analytics.missedPrayers} iconName="close-circle-outline" color="#FF6B6B" />
      </View>
      <View style={styles.summarySection}>
        <SummaryCard title="Completion" value={`${analytics.completionRate}%`} iconName="trending-up-outline" color="#5FFF6F" />
        <SummaryCard title="Perfect Days" value={analytics.perfectDays} iconName="star-outline" color="#FFD700" />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Salah-wise Performance</Text>
        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="%"
          yAxisSuffix="%"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Trend</Text>
        <LineChart
          data={analytics.dailyData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
        />
      </View>

      <View style={styles.insightsSection}>
        <Text style={styles.chartTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            🌙 You completed all 5 prayers on {analytics.perfectDays} days this month.
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            🔥 Your longest streak of perfect days is {analytics.longestStreak}.
          </Text>
        </View>
      </View>
      
      <View style={styles.streakSection}>
        <Text style={styles.chartTitle}>Streak Tracker</Text>
        <View style={styles.streakCard}>
          <Text style={styles.streakText}>Current Streak: {analytics.currentStreak} days</Text>
          <Text style={styles.streakText}>Longest Streak: {analytics.longestStreak} days</Text>
          <Text style={styles.motivationalText}>Keep it up 🌙</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#1C1C1C',
  backgroundGradientFrom: '#1C1C1C',
  backgroundGradientTo: '#1C1C1C',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(95, 255, 111, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#5FFF6F',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0B0B',
  },
  loadingText: {
    color: '#EAEAEA',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  picker: {
    height: 50,
    width: 150,
    color: '#EAEAEA',
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#1C1C1C',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EAEAEA',
    marginBottom: 10,
  },
  insightsSection: {
    marginTop: 20,
  },
  insightCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  insightText: {
    color: '#5FFF6F',
    fontSize: 16,
  },
  streakSection: {
    marginTop: 20,
  },
  streakCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  streakText: {
    color: '#EAEAEA',
    fontSize: 18,
    marginBottom: 5,
  },
  motivationalText: {
    color: '#5FFF6F',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default AnalyticsScreen;