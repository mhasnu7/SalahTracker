import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { lightColors, darkColors } from '../theme/colors';
import { RootTabScreenProps } from '../navigation/types'; // Import RootTabScreenProps

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
}

export const ThemesScreen = ({ navigation }: RootTabScreenProps<'Themes'>) => {
  const { isDark, colors, setIsDark } = useContext(ThemeContext);

  const selectTheme = (dark: boolean) => {
    setIsDark(dark);
    navigation.goBack(); // Navigate back to settings after selecting theme
  };

  return (
    <View style={styles(colors).container}>
      <TouchableOpacity
        style={[
          styles(colors).themeOption,
          !isDark && { borderColor: colors.primaryAccent, borderWidth: 2 },
        ]}
        onPress={() => selectTheme(false)}
      >
        <Text style={styles(colors).themeOptionText}>Light Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles(colors).themeOption,
          isDark && { borderColor: colors.primaryAccent, borderWidth: 2 },
        ]}
        onPress={() => selectTheme(true)}
      >
        <Text style={styles(colors).themeOptionText}>Dark Theme</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  themeOption: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 20,
    color: colors.secondaryText,
  },
});