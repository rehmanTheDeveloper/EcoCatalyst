import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme } from './theme';
import { usePreferences } from '../contexts/preferences/PreferencesContext';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, isDarkTheme } = usePreferences();
  const systemColorScheme = useColorScheme();
  
  const isDark = 
    preferences.themeMode === 'dark' || 
    (preferences.themeMode === 'system' && systemColorScheme === 'dark');
  
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
