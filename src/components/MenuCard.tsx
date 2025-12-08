import React, { FC, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/ThemeContext';

interface MenuCardProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

const MenuCard: FC<MenuCardProps> = ({ title, iconName, onPress }) => {
  const { colors, isDark } = useTheme();

  // 🔹 Simple Animated.Value for scale (no Reanimated needed)
  const scale = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale }],
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={{ color: colors.primaryAccent + '33' }}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? colors.cardBackground : colors.white,
          shadowColor: isDark ? '#FFF' : '#000',
        },
      ]}
    >
      <Animated.View style={[styles.contentContainer, animatedStyle]}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={iconName}
            size={40}
            color={isDark ? colors.white : colors.headerTitle}
          />
        </View>

        <Text style={[styles.title, { color: colors.headingBlue }]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    minHeight: 120,
    borderRadius: 20,
    margin: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',

    // Shadows
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },

  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MenuCard;
