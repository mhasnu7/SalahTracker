export interface ColorScheme {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  headingBlue: string;
  parrotGreen: string;
  headerTitle: string;
  secondaryText: string;
  white: string;
  grey: string;
  text: string;
  error: string;
  border: string;
  buttonBackground: string;
  buttonText: string;
  shadow: string;
  primary: string;
  textSecondary: string; // Add textSecondary here
}

export const lightColors: ColorScheme = {
  background: '#FFFFFF',
  cardBackground: '#F5F5F5',
  primaryAccent: '#007BFF',
  headingBlue: '#1565C0',
  parrotGreen: '#00C853',
  headerTitle: '#000000',
  secondaryText: '#666666',
  white: '#FFFFFF',
  grey: '#808080',
  text: '#000000',
  error: '#FF3B30',
  border: '#E0E0E0',
  buttonBackground: '#00C853',
  buttonText: '#FFFFFF',
  shadow: '#000000',
  primary: '#1565C0',
  textSecondary: '#666666', // Added missing property
};

export const darkColors: ColorScheme = {
  background: '#0B0B0B',
  cardBackground: '#1E1E1E',
  primaryAccent: '#3CB371',
  headingBlue: '#4FC3F7',
  parrotGreen: '#00C853',
  headerTitle: '#FFFFFF',
  secondaryText: '#D0D0D0',
  white: '#FFFFFF',
  grey: '#808080',
  text: '#FFFFFF',
  error: '#FF453A',
  border: '#3A3A3C',
  buttonBackground: '#00C853',
  buttonText: '#FFFFFF',
  shadow: '#FFFFFF',
  primary: '#4FC3F7',
  textSecondary: '#D0D0D0', // Added missing property
};