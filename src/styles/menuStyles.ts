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
      alignItems: 'center', // Center items horizontally
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.headingBlue, // App title color blue for headings
      textAlign: 'center', // Center text horizontally
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondaryText,
        marginTop: 4,
        textAlign: 'center', // Center text horizontally
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 5,
    },
    // Note: Individual card styling (shadow/border/animation) is handled in MenuCard.tsx
  });
};