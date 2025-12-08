import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const VRPlayerScreen = ({ route, navigation }: any) => {
  const { videoUrl } = route.params;

  useEffect(() => {
    if (videoUrl) {
      Linking.openURL(videoUrl);
    }
  }, [videoUrl]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Opening YouTube...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 18, color: '#999' },
});

export default VRPlayerScreen;
