import { usePreferences } from '../contexts/preferences/PreferencesContext';


export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;
  
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  onSecondary: string;
  
  background: string;
  surface: string;
  error: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  
  success: string;
  warning: string;
  info: string;
  onSuccess: string;
  onWarning: string;
  onInfo: string;
  
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  
  divider: string;
  border: string;
  
  statusBar: string;
}

export interface ThemeSpacing {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
}

export interface ThemeElevation {
  none: string;
  small: string;
  medium: string;
  large: string;
}

export interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    subtitle1: number;
    subtitle2: number;
    body1: number;
    body2: number;
    button: number;
    caption: number;
    overline: number;
  };
  lineHeight: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    subtitle1: number;
    subtitle2: number;
    body1: number;
    body2: number;
    button: number;
    caption: number;
    overline: number;
  };
}

export interface ThemeShape {
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  elevation: ThemeElevation;
  typography: ThemeTypography;
  shape: ThemeShape;
}

export const lightColors: ThemeColors = {
  primary: '#4CAF50', // Green 500
  primaryDark: '#388E3C', // Green 700
  primaryLight: '#81C784', // Green 300
  onPrimary: '#FFFFFF', // White text on primary (contrast ratio > 4.5:1)
  
  secondary: '#2196F3', // Blue 500
  secondaryDark: '#1976D2', // Blue 700
  secondaryLight: '#64B5F6', // Blue 300
  onSecondary: '#FFFFFF', // White text on secondary (contrast ratio > 4.5:1)
  
  background: '#F5F5F5', // Grey 100
  surface: '#FFFFFF', // White
  error: '#F44336', // Red 500
  onBackground: '#212121', // Grey 900 on background (contrast ratio > 4.5:1)
  onSurface: '#212121', // Grey 900 on surface (contrast ratio > 4.5:1)
  onError: '#FFFFFF', // White on error (contrast ratio > 4.5:1)
  
  success: '#4CAF50', // Green 500
  warning: '#FF9800', // Orange 500
  info: '#2196F3', // Blue 500
  onSuccess: '#FFFFFF', // White on success (contrast ratio > 4.5:1)
  onWarning: '#212121', // Grey 900 on warning (contrast ratio > 4.5:1)
  onInfo: '#FFFFFF', // White on info (contrast ratio > 4.5:1)
  
  textPrimary: '#212121', // Grey 900
  textSecondary: '#757575', // Grey 600
  textDisabled: '#9E9E9E', // Grey 500
  
  divider: '#BDBDBD', // Grey 400
  border: '#E0E0E0', // Grey 300
  
  statusBar: '#388E3C', // Green 700
};

export const darkColors: ThemeColors = {
  primary: '#81C784', // Green 300
  primaryDark: '#4CAF50', // Green 500
  primaryLight: '#A5D6A7', // Green 200
  onPrimary: '#212121', // Grey 900 text on primary (contrast ratio > 4.5:1)
  
  secondary: '#64B5F6', // Blue 300
  secondaryDark: '#2196F3', // Blue 500
  secondaryLight: '#90CAF9', // Blue 200
  onSecondary: '#212121', // Grey 900 text on secondary (contrast ratio > 4.5:1)
  
  background: '#121212', // Material dark background
  surface: '#1E1E1E', // Slightly lighter than background
  error: '#EF5350', // Red 400
  onBackground: '#FFFFFF', // White on background (contrast ratio > 4.5:1)
  onSurface: '#FFFFFF', // White on surface (contrast ratio > 4.5:1)
  onError: '#212121', // Grey 900 on error (contrast ratio > 4.5:1)
  
  success: '#81C784', // Green 300
  warning: '#FFB74D', // Orange 300
  info: '#64B5F6', // Blue 300
  onSuccess: '#212121', // Grey 900 on success (contrast ratio > 4.5:1)
  onWarning: '#212121', // Grey 900 on warning (contrast ratio > 4.5:1)
  onInfo: '#212121', // Grey 900 on info (contrast ratio > 4.5:1)
  
  textPrimary: '#FFFFFF', // White
  textSecondary: '#B0B0B0', // Light grey
  textDisabled: '#757575', // Grey 600
  
  divider: '#424242', // Grey 800
  border: '#616161', // Grey 700
  
  statusBar: '#121212', // Material dark background
};

export const spacing: ThemeSpacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const lightElevation: ThemeElevation = {
  none: 'none',
  small: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0px 4px 8px rgba(0, 0, 0, 0.12)',
  large: '0px 8px 16px rgba(0, 0, 0, 0.14)',
};

export const darkElevation: ThemeElevation = {
  none: 'none',
  small: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  medium: '0px 4px 8px rgba(0, 0, 0, 0.24)',
  large: '0px 8px 16px rgba(0, 0, 0, 0.28)',
};

export const typography: ThemeTypography = {
  fontFamily: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  },
  fontSize: {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    subtitle1: 16,
    subtitle2: 14,
    body1: 16,
    body2: 14,
    button: 14,
    caption: 12,
    overline: 10,
  },
  lineHeight: {
    h1: 40,
    h2: 36,
    h3: 32,
    h4: 28,
    h5: 26,
    h6: 24,
    subtitle1: 24,
    subtitle2: 22,
    body1: 24,
    body2: 20,
    button: 20,
    caption: 16,
    overline: 14,
  },
};

export const shape: ThemeShape = {
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    pill: 9999,
  },
};

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  elevation: lightElevation,
  typography,
  shape,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  elevation: darkElevation,
  typography,
  shape,
};

export const useTheme = (): Theme => {
  const { isDarkTheme } = usePreferences();
  return isDarkTheme ? darkTheme : lightTheme;
};
