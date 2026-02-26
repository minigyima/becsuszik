/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Color } from 'expo-router';
import { Platform } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
    const scheme = useColorScheme();
    const theme = scheme === 'unspecified' ? 'light' : scheme;

    if (Platform.OS === 'android') {
        return {
            text: Color.android.dynamic.onSurface,
            background: Color.android.dynamic.background,
            backgroundElement: Color.android.dynamic.surfaceContainer,
            backgroundSelected: Color.android.dynamic.secondaryContainer,
            textSecondary: Color.android.dynamic.onSurfaceVariant,
        };
    }

    if (Platform.OS === 'ios') {
        return {
            text: Color.ios.label,
            background: Color.ios.systemBackground,
            backgroundElement: Color.ios.secondarySystemBackground,
            backgroundSelected: Color.ios.tertiarySystemFill,
            textSecondary: Color.ios.secondaryLabel,
        };
    }

    return Colors[theme];
}
