import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { PreferencesProvider } from './src/contexts/preferences/PreferencesContext';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { ProductsProvider } from './src/contexts/products/ProductsContext';
import { FootprintProvider } from './src/contexts/footprint/FootprintContext';
import { DietProvider } from './src/contexts/diet/DietContext';
import { GamificationProvider } from './src/contexts/gamification/GamificationContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProductsProvider>
              <FootprintProvider>
                <DietProvider>
                  <GamificationProvider>
                    <RootNavigator />
                    <StatusBar style="auto" />
                  </GamificationProvider>
                </DietProvider>
              </FootprintProvider>
            </ProductsProvider>
          </AuthProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
