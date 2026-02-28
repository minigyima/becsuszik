import { Platform } from 'react-native';
import { Color } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { androidColors } from './androidColors';
import { iosDarkColors, iosLightColors } from './iosColors';

const baseColors = MD3LightTheme.colors;

export const PaperLightTheme = {
    ...MD3LightTheme,
    colors:
        Platform.select({
            android: androidColors,
            ios: iosLightColors,
            default: baseColors, // Web fallback
        }) ?? baseColors,
};

export const PaperDarkTheme = {
    ...MD3DarkTheme,
    colors:
        Platform.select({
            android: androidColors,
            ios: iosDarkColors,
            default: baseColors, // Web fallback
        }) ?? baseColors,
};
