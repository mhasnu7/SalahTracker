import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function AnimatedSplash({ navigation }) {

  useEffect(() => {
    // Native splash is gone automatically in RN 0.75+
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/splash.json')}
        autoPlay
        loop={false}
        onAnimationFinish={() => navigation.replace("BottomTabs")}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
