import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { darkColors, lightColors } from '../theme/colors';
import { QuranSurahListScreenNavigationProp } from '../navigation/types';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const QuranSurahListScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<QuranSurahListScreenNavigationProp>();

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.alquran.cloud/v1/surah');
      setSurahs(response.data.data);
    } catch (err) {
      console.error("Error fetching surah list:", err);
      setError('Failed to load surah list. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => navigation.navigate('SurahDetails', { surahNumber: item.number, surahName: item.englishName })}
    >
      <View>
        <Text style={styles.surahNumber}>{item.number}.</Text>
        <Text style={styles.surahNameArabic}>{item.name}</Text>
      </View>
      <View style={styles.surahDetails}>
        <Text style={styles.surahNameEnglish}>{item.englishName}</Text>
        <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
        <Text style={styles.surahAyahs}>Ayahs: {item.numberOfAyahs}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={styles.loadingText}>Loading Surahs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={surahs}
        renderItem={renderSurahItem}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const getStyles = (colors: typeof darkColors | typeof lightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.text,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surahNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 15,
  },
  surahDetails: {
    flex: 1,
  },
  surahNameArabic: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'right',
  },
  surahNameEnglish: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  surahTranslation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  surahAyahs: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default QuranSurahListScreen;