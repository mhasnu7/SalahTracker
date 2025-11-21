import React, { FC } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface MenuCardProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

const MenuCard: FC<MenuCardProps> = ({ title, iconName, onPress }) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale?.value ?? 1 }],
    };
  });

  const titleColor = colors.headingBlue;
  const backgroundColor = isDark ? colors.cardBackground : colors.white;
  const iconColor = isDark ? colors.white : colors.headerTitle;

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const staticShadowStyle = isDark ? styles.darkShadow : styles.lightShadow;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.cardContainer,
        {
          backgroundColor,
          ...staticShadowStyle,
        },
      ]}
    >
      <Animated.View style={[animatedStyle, styles.contentContainer]}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={iconName}
            size={40}
            color={iconColor}
          />
        </View>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
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
  },
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  darkShadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
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
