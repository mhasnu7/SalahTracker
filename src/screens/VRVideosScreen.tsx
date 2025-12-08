import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const videos = [
  { id: 'E31oZ8ZDZEA', title: 'Kaaba 360° Virtual Tour (HD)' },
  { id: 'Yi4SRRiw5Sw', title: 'Medina – Masjid an-Nabawi 360° VR Tour' },
  { id: 'Q0yzeIgxdSQ', title: 'Masjid al-Haram 360° Experience (Mecca)' },
  { id: '49xdCEsDDx4', title: 'Hajj 360° Experience (Full VR Film)' },
  { id: 'jbZ2frSATPc', title: 'Inside the Kaaba 360° (Rare VR)' },
  { id: 'b8S5WPjL11E', title: 'Mecca Masjid al-Haram Walking VR Tour' },
  { id: 'IrBh3UM6J9M', title: 'Madina Al-Masjid an-Nabawi VR Walkthrough' },

  // ⭐ NEW LAST 3 VIDEOS (as requested)
  {
    id: 'FHljMyQUPoE',
    title: 'Sheikh Zayed Grand Mosque, UAE Abu Dhabi VR',
  },
  {
    id: 'Ol2LGO7Nl6c',
    title: 'Al-Aqsa Mosque 360° VR Tour',
  },
  {
    id: '8oRzYdI9W1c',
    title: 'Istanbul | Sultan Ahmed Mosque (Blue Mosque) VR',
  },
];

const VRVideosScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerTitle }]}>
        VR Videos
      </Text>

      {videos.map(video => {
        const thumbnail = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
        const url = `https://www.youtube.com/watch?v=${video.id}`;

        return (
          <TouchableOpacity
            key={video.id}
            style={[styles.card, { backgroundColor: colors.cardBackground }]}
            onPress={() => navigation.navigate('VRPlayer', { videoUrl: url })}
          >
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />

            <Text style={[styles.title, { color: colors.primaryAccent }]}>
              {video.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  card: { marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  thumbnail: { width: '100%', height: 180, borderRadius: 12 },
  title: { padding: 10, fontSize: 16, fontWeight: '600' },
});

export default VRVideosScreen;
