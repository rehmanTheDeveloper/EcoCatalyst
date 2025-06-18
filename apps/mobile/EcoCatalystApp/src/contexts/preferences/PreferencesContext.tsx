import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type NotificationPreference = 'all' | 'important' | 'none';
export type MeasurementUnit = 'metric' | 'imperial';

export interface Preferences {
  themeMode: ThemeMode;
  notificationPreference: NotificationPreference;
  measurementUnit: MeasurementUnit;
  isFirstLaunch: boolean;
  useLocationServices: boolean;
  dataCollectionConsent: boolean;
}

const defaultPreferences: Preferences = {
  themeMode: 'system',
  notificationPreference: 'all',
  measurementUnit: 'metric',
  isFirstLaunch: true,
  useLocationServices: false,
  dataCollectionConsent: false,
};

const PREFERENCES_STORAGE_KEY = 'ecocatalyst_preferences';

interface PreferencesContextType {
  preferences: Preferences;
  isLoading: boolean;
  isDarkTheme: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setNotificationPreference: (pref: NotificationPreference) => Promise<void>;
  setMeasurementUnit: (unit: MeasurementUnit) => Promise<void>;
  setUseLocationServices: (use: boolean) => Promise<void>;
  setDataCollectionConsent: (consent: boolean) => Promise<void>;
  completeFirstLaunch: () => Promise<void>;
  resetPreferences: () => Promise<void>;
}

export const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  isLoading: true,
  isDarkTheme: false,
  setThemeMode: async () => {},
  setNotificationPreference: async () => {},
  setMeasurementUnit: async () => {},
  setUseLocationServices: async () => {},
  setDataCollectionConsent: async () => {},
  completeFirstLaunch: async () => {},
  resetPreferences: async () => {},
});

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();
  
  const isDarkTheme = 
    preferences.themeMode === 'dark' || 
    (preferences.themeMode === 'system' && systemColorScheme === 'dark');
  
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        
        if (storedPreferences) {
          setPreferences({
            ...defaultPreferences,
            ...JSON.parse(storedPreferences),
          });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    };
    
    if (!isLoading) {
      savePreferences();
    }
  }, [preferences, isLoading]);
  
  const updatePreferences = async (updates: Partial<Preferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };
  
  const setThemeMode = async (mode: ThemeMode) => {
    await updatePreferences({ themeMode: mode });
  };
  
  const setNotificationPreference = async (pref: NotificationPreference) => {
    await updatePreferences({ notificationPreference: pref });
  };
  
  const setMeasurementUnit = async (unit: MeasurementUnit) => {
    await updatePreferences({ measurementUnit: unit });
  };
  
  const setUseLocationServices = async (use: boolean) => {
    await updatePreferences({ useLocationServices: use });
  };
  
  const setDataCollectionConsent = async (consent: boolean) => {
    await updatePreferences({ dataCollectionConsent: consent });
  };
  
  const completeFirstLaunch = async () => {
    await updatePreferences({ isFirstLaunch: false });
  };
  
  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
  };
  
  const value = {
    preferences,
    isLoading,
    isDarkTheme,
    setThemeMode,
    setNotificationPreference,
    setMeasurementUnit,
    setUseLocationServices,
    setDataCollectionConsent,
    completeFirstLaunch,
    resetPreferences,
  };
  
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
