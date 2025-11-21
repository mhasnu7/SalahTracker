import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../theme/ThemeContext';
import { QuranStackParamList } from '../navigation/types';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable playback in background
Sound.setCategory('Playback');

type SurahDetailScreenRouteProp = RouteProp<QuranStackParamList, 'SurahDetail'>;

interface Verse {
  number: number;
  text: string;
  sajda: boolean;
}

interface TranslationVerse {
  number: number;
  text: string;
}

interface SurahData {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Verse[];
}

interface TranslationData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: TranslationVerse[];
}

export const SurahDetailScreen = () => {
  const route = useRoute<SurahDetailScreenRouteProp>();
  const { surahNumber, surahName } = route.params;
  const { colors } = useContext(ThemeContext);

  const [arabicData, setArabicData] = useState<SurahData | null>(null);
  const [urduData, setUrduData] = useState<TranslationData | null>(null);
  const [englishData, setEnglishData] = useState<TranslationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSurahDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [arabicRes, urduRes, englishRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
        ]);

        if (!arabicRes.ok || !urduRes.ok || !englishRes.ok) {
          throw new Error('Failed to fetch surah data');
        }

        const arabicJson = await arabicRes.json();
        const urduJson = await urduRes.json();
        const englishJson = await englishRes.json();

        setArabicData(arabicJson.data);
        setUrduData(urduJson.data);
        setEnglishData(englishJson.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahDetails();

    // Cleanup audio on unmount
    return () => {
      if (sound) {
        sound.release();
        if (intervalRef.current) {
          clearInterval(intervalRef.current as any); // Cast to any to resolve NodeJS.Timeout type error
        }
      }
    };
  }, [surahNumber, sound]); // Added sound to dependency array to ensure cleanup for new sound objects

  const loadAudio = (url: string) => {
    // Release any existing sound object before loading a new one
    if (sound) {
      sound.release();
    }
    const newSound = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        setError('Failed to load audio. Please check your internet connection.');
        setSound(null);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + newSound.getDuration() + 'number of channels: ' + newSound.getNumberOfChannels());
      setDuration(newSound.getDuration());
      setSound(newSound);
    });
  };

  const playPauseAudio = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current as any); // Cast to any to resolve NodeJS.Timeout type error
        }
      } else {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            setCurrentPlayingVerse(0); // Reset after playing entire surah
            if (intervalRef.current) {
              clearInterval(intervalRef.current as any); // Cast to any to resolve NodeJS.Timeout type error
            }
            setCurrentTime(0);
          } else {
            console.log('playback failed due to audio decoding errors');
            sound.reset();
          }
          setIsPlaying(false);
        });

        // Start interval to update current time
        intervalRef.current = setInterval(() => {
          sound.getCurrentTime((seconds) => {
            setCurrentTime(seconds);
          });
        }, 1000);
      }
      setIsPlaying(!isPlaying);
    } else {
      // Load audio if not already loaded and then play
      const audioUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`;
      loadAudio(audioUrl);
      // After loading, the play will be triggered by the sound.onLoad callback
    }
  };

  // When sound object is set/updated, if not playing, try to play
  useEffect(() => {
    if (sound && !isPlaying && arabicData) {
      // We only want to auto-play if the sound object was just loaded and we are not already playing
      // This is to prevent auto-playing if the component re-renders for other reasons
      // A more robust solution might involve checking a ref or a state variable indicating a user-initiated play
      // For now, let's just ensure it loads and is ready to be played manually.
    }
  }, [sound, isPlaying, arabicData]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading Surah {surahName}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
        <Text style={{ color: colors.text, marginTop: 5 }}>Please try again later.</Text>
      </View>
    );
  }

  // Find the currently playing verse based on audio progress
  // This is a simplified logic. A more accurate implementation would map audio timestamps to verses.
  // For Alafasy, each ayah is typically a separate audio file, or there are markers.
  // Given the API provides a single audio URL for the surah, we'll just show the verse number incrementing.
  // This part needs a more complex mapping with actual audio timing data.
  // For now, we'll just highlight the entire surah content and show a generic "Playing..." message.

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.surahTitle, { color: colors.headerTitle }]}>{arabicData?.name} ({surahName})</Text>
      <Text style={[styles.surahRevelation, { color: colors.secondaryText }]}>
        {arabicData?.englishNameTranslation} - {arabicData?.numberOfAyahs} Ayahs
      </Text>

      {/* Audio Controls */}
      <View style={[styles.audioControls, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
          <Icon name={isPlaying ? "pause-circle" : "play-circle"} size={40} color={colors.primaryAccent} />
        </TouchableOpacity>
        <View style={styles.audioInfo}>
          {isPlaying ? (
            <Text style={{ color: colors.text }}>Playing Surah {surahName}...</Text>
          ) : (
            <Text style={{ color: colors.secondaryText }}>Ready to play</Text>
          )}
          {sound && duration > 0 && (
            <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
              {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} /{' '}
              {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
            </Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.contentScrollView}>
        {arabicData?.ayahs.map((ayah, index) => (
          <View key={ayah.number} style={[styles.ayahContainer, { borderBottomColor: colors.border }]}>
            <Text style={[styles.ayahNumber, { color: colors.primaryAccent }]}>{ayah.number}.</Text>
            <Text style={[styles.arabicText, { color: colors.text }]}>{ayah.text}</Text>
            {urduData?.ayahs[index] && (
              <Text style={[styles.urduText, { color: colors.text }]}>
                {urduData.ayahs[index].text}
              </Text>
            )}
            {englishData?.ayahs[index] && (
              <Text style={[styles.englishText, { color: colors.grey }]}>
                {englishData.ayahs[index].text}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  surahTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  surahRevelation: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  playButton: {
    marginRight: 15,
  },
  audioInfo: {
    flex: 1,
  },
  contentScrollView: {
    width: '100%',
  },
  ayahContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    marginBottom: 10,
  },
  ayahNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  arabicText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right', // Arabic text is right-to-left
    marginBottom: 5,
  },
  urduText: {
    fontSize: 16,
    textAlign: 'right', // Urdu text is right-to-left
    marginBottom: 3,
  },
  englishText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});