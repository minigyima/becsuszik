import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { PaperDarkTheme, PaperLightTheme } from '@/constants/paperTheme';
import { MotionCalibrationProvider } from '@/contexts/motion-calibration-context';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <PaperProvider theme={colorScheme === 'dark' ? PaperDarkTheme : PaperLightTheme}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <MotionCalibrationProvider>
                    <AnimatedSplashOverlay />
                    <AppTabs />
                </MotionCalibrationProvider>
            </ThemeProvider>
        </PaperProvider>
    );
}
