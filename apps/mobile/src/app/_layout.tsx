import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Color } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppTheme } from '@/constants/paperTheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <PaperProvider theme={AppTheme}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <AnimatedSplashOverlay />
                <AppTabs />
            </ThemeProvider>
        </PaperProvider>
    );
}
