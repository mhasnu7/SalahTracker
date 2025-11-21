import { StyleSheet } from 'react-native';
import { lightColors, darkColors } from '../theme/colors'; // Assuming colors is imported relative to src/styles

// Define styles that will be used by MenuScreen.tsx
export const menuStyles = (isDark: boolean) => {
  const colors = isDark ? darkColors : lightColors;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.headingBlue, // App title color blue for headings
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondaryText,
        marginTop: 4,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 5,
    },
    // Note: Individual card styling (shadow/border/animation) is handled in MenuCard.tsx
  });
};