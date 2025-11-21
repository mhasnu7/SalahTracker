import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define a type for a single Surah item
interface Surah {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

type QuranScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quran'>;

export const QuranScreen = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation<QuranScreenNavigationProp>();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Surahs Data:", data.data); // Log the fetched data
        setSurahs(data.data);
      } catch (e: any) {
        console.error("Error fetching surahs:", e); // Log any errors
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const handleSurahPress = (surahNumber: number, surahName: string) => {
    navigation.navigate('Quran', { screen: 'SurahDetails', params: { surahNumber, surahName } });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
        <Text style={{ color: colors.text }}>Loading Surahs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
        <Text style={{ color: colors.text }}>Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.surahItem, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}
            onPress={() => handleSurahPress(item.number, item.englishName)}
          >
            <Text style={[styles.surahNumber, { color: colors.primaryAccent }]}>{item.number}.</Text>
            <View style={styles.surahNames}>
              <Text style={[styles.surahArabicName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.surahEnglishName, { color: colors.secondaryText }]}>{item.englishName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    width: '100%',
  },
  surahNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    width: 30, // Fixed width for alignment
    textAlign: 'center',
  },
  surahNames: {
    flex: 1,
  },
  surahArabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  surahEnglishName: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
  },
});