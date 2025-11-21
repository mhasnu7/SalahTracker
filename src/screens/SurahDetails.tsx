import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';
import { useTheme } from '../theme/ThemeContext';
import { darkColors, lightColors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

type SurahDetailsRouteProp = RouteProp<RootStackParamList, 'SurahDetails'>;
type SurahDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SurahDetails'>;

interface Ayah {
  number: number;
  text: string;
  sajda: boolean;
}

interface TranslationAyah {
  number: number;
  text: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface TranslationData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: TranslationAyah[];
}

const SurahDetailsScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation<SurahDetailsNavigationProp>();
  const route = useRoute<SurahDetailsRouteProp>();
  const { surahNumber, surahName } = route.params;

  const [arabicData, setArabicData] = useState<SurahData | null>(null);
  const [urduData, setUrduData] = useState<TranslationData | null>(null);
  const [englishData, setEnglishData] = useState<TranslationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    return () => {
      if (currentSound) {
        currentSound.release();
        setCurrentSound(null);
      }
    };
  }, [currentSound]);

  const fetchSurahDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [arabicRes, urduRes, englishRes] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.junagarhi`),
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
      ]);

      setArabicData(arabicRes.data.data);
      setUrduData(urduRes.data.data);
      setEnglishData(englishRes.data.data);
    } catch (err) {
      console.error("Error fetching surah details:", err);
      setError('Failed to load surah details. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    fetchSurahDetails();
  }, [fetchSurahDetails]);

  const playSound = (ayahNumber: number) => {
    if (currentSound) {
      currentSound.stop(() => {
        currentSound.release();
        setCurrentSound(null);
        setIsPlaying(false);
        setCurrentPlayingAyah(null);
      });
    }

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
    const newSound = new Sound(audioUrl, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        Alert.alert('Error', 'Failed to load recitation. Please try again.');
        setIsPlaying(false);
        setCurrentPlayingAyah(null);
        return;
      }
      setCurrentSound(newSound);
      setIsPlaying(true);
      setCurrentPlayingAyah(ayahNumber);
      newSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
        setIsPlaying(false);
        setCurrentPlayingAyah(null);
        newSound.release();
        setCurrentSound(null);
      });
    });
  };

  const pauseSound = () => {
    if (currentSound) {
      currentSound.pause(() => {
        setIsPlaying(false);
      });
    }
  };

  const togglePlayback = (ayahNumber: number) => {
    if (currentPlayingAyah === ayahNumber && isPlaying) {
      pauseSound();
    } else {
      playSound(ayahNumber);
    }
  };

  const renderAyah = ({ item, index }: { item: Ayah; index: number }) => {
    const urdu = urduData?.ayahs[index]?.text || 'Loading Urdu...';
    const english = englishData?.ayahs[index]?.text || 'Loading English...';
    const isCurrentAyahPlaying = isPlaying && currentPlayingAyah === item.number;

    return (
      <View style={styles.ayahContainer}>
        <Text style={styles.ayahNumber}>Ayah {item.number}</Text>
        <Text style={styles.ayahArabic}>{item.text}</Text>
        <Text style={styles.ayahTranslationUrdu}>{urdu}</Text>
        <Text style={styles.ayahTranslationEnglish}>{english}</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => togglePlayback(item.number)}
        >
          <MaterialCommunityIcons
            name={isCurrentAyahPlaying ? "pause" : "play"}
            size={24}
            color={colors.buttonText}
          />
          <Text style={styles.playButtonText}>
            {isCurrentAyahPlaying ? "Pause Recitation" : "Play Recitation"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={styles.loadingText}>Loading Surah Details...</Text>
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
      <Text style={styles.title}>{arabicData?.englishName} ({arabicData?.name})</Text>
      <Text style={styles.subtitle}>{arabicData?.englishNameTranslation} | Ayahs: {arabicData?.numberOfAyahs}</Text>
      <FlatList
        data={arabicData?.ayahs}
        renderItem={renderAyah}
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
    padding: 16,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  ayahContainer: {
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
  ayahNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  ayahArabic: {
    fontSize: 22,
    color: colors.text,
    textAlign: 'right',
    marginBottom: 10,
  },
  ayahTranslationUrdu: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 5,
    textAlign: 'left',
  },
  ayahTranslationEnglish: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.buttonBackground,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  playButtonText: {
    color: colors.buttonText,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SurahDetailsScreen;