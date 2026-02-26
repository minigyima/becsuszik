import { Platform } from 'react-native';
import { Color } from 'expo-router';
import { MD3LightTheme } from 'react-native-paper';

const baseColors = MD3LightTheme.colors;

// kurvára rühellem az expo router material supportját. Na vajon miért? Miért van erre szükség? MIÉRT NINCS NATÍV FALLBACK???? A KURVA ANYÁTOKAT
// - gyimi
function resolveColor(value: unknown, fallback: string) {
    if (value == null) return fallback;

    const resolved = String(value);
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(resolved)) {
        return fallback;
    }
    if (resolved === 'null' || resolved === 'undefined') return fallback;

    return resolved;
}

const androidColors = {
    ...baseColors,
    primary: resolveColor(Color.android.dynamic.primary, baseColors.primary),
    primaryContainer: resolveColor(Color.android.dynamic.primaryContainer, baseColors.primaryContainer),
    secondary: resolveColor(Color.android.dynamic.secondary, baseColors.secondary),
    secondaryContainer: resolveColor(Color.android.dynamic.secondaryContainer, baseColors.secondaryContainer),
    tertiary: resolveColor(Color.android.dynamic.tertiary, baseColors.tertiary),
    tertiaryContainer: resolveColor(Color.android.dynamic.tertiaryContainer, baseColors.tertiaryContainer),

    surface: resolveColor(Color.android.dynamic.surface, baseColors.surface),
    surfaceVariant: resolveColor(Color.android.dynamic.surfaceVariant, baseColors.surfaceVariant),
    background: resolveColor(Color.android.dynamic.background, baseColors.background),

    error: resolveColor(Color.android.dynamic.error, baseColors.error),
    errorContainer: resolveColor(Color.android.dynamic.errorContainer, baseColors.errorContainer),

    onPrimary: resolveColor(Color.android.dynamic.onPrimary, baseColors.onPrimary),
    onPrimaryContainer: resolveColor(Color.android.dynamic.onPrimaryContainer, baseColors.onPrimaryContainer),
    onSecondary: resolveColor(Color.android.dynamic.onSecondary, baseColors.onSecondary),
    onSecondaryContainer: resolveColor(Color.android.dynamic.onSecondaryContainer, baseColors.onSecondaryContainer),
    onTertiary: resolveColor(Color.android.dynamic.onTertiary, baseColors.onTertiary),
    onTertiaryContainer: resolveColor(Color.android.dynamic.onTertiaryContainer, baseColors.onTertiaryContainer),

    onSurface: resolveColor(Color.android.dynamic.onSurface, baseColors.onSurface),
    onSurfaceVariant: resolveColor(Color.android.dynamic.onSurfaceVariant, baseColors.onSurfaceVariant),

    onError: resolveColor(Color.android.dynamic.onError, baseColors.onError),
    onErrorContainer: resolveColor(Color.android.dynamic.onErrorContainer, baseColors.onErrorContainer),
    onBackground: resolveColor(Color.android.dynamic.onBackground, baseColors.onBackground),

    outline: resolveColor(Color.android.dynamic.outline, baseColors.outline),

    inverseOnSurface: resolveColor(Color.android.dynamic.inverseOnSurface, baseColors.inverseOnSurface),
    inverseSurface: resolveColor(Color.android.dynamic.inverseSurface, baseColors.inverseSurface),
    inversePrimary: resolveColor(Color.android.dynamic.inversePrimary, baseColors.inversePrimary),

    surfaceDisabled: baseColors.surfaceDisabled,
    onSurfaceDisabled: baseColors.onSurfaceDisabled,
    shadow: baseColors.shadow,
    backdrop: baseColors.backdrop,
    elevation: baseColors.elevation,
};

const iosColors = {
    ...baseColors,
    primary: resolveColor(Color.ios.systemBlue, baseColors.primary),
    primaryContainer: resolveColor(Color.ios.secondarySystemFill, baseColors.primaryContainer),
    secondary: resolveColor(Color.ios.systemTeal, baseColors.secondary),
    secondaryContainer: resolveColor(Color.ios.tertiarySystemFill, baseColors.secondaryContainer),
    tertiary: resolveColor(Color.ios.systemIndigo, baseColors.tertiary),
    tertiaryContainer: resolveColor(Color.ios.quaternarySystemFill, baseColors.tertiaryContainer),

    surface: resolveColor(Color.ios.secondarySystemBackground, baseColors.surface),
    surfaceVariant: resolveColor(Color.ios.tertiarySystemBackground, baseColors.surfaceVariant),
    background: resolveColor(Color.ios.systemBackground, baseColors.background),

    error: resolveColor(Color.ios.systemRed, baseColors.error),
    errorContainer: resolveColor(Color.ios.systemGroupedBackground, baseColors.errorContainer),

    onPrimary: resolveColor(Color.ios.systemBackground, baseColors.onPrimary),
    onPrimaryContainer: resolveColor(Color.ios.label, baseColors.onPrimaryContainer),
    onSecondary: resolveColor(Color.ios.systemBackground, baseColors.onSecondary),
    onSecondaryContainer: resolveColor(Color.ios.secondaryLabel, baseColors.onSecondaryContainer),
    onTertiary: resolveColor(Color.ios.systemBackground, baseColors.onTertiary),
    onTertiaryContainer: resolveColor(Color.ios.secondaryLabel, baseColors.onTertiaryContainer),

    onSurface: resolveColor(Color.ios.label, baseColors.onSurface),
    onSurfaceVariant: resolveColor(Color.ios.secondaryLabel, baseColors.onSurfaceVariant),

    onError: resolveColor(Color.ios.systemBackground, baseColors.onError),
    onErrorContainer: resolveColor(Color.ios.label, baseColors.onErrorContainer),
    onBackground: resolveColor(Color.ios.label, baseColors.onBackground),

    outline: resolveColor(Color.ios.separator, baseColors.outline),

    inverseOnSurface: resolveColor(Color.ios.systemBackground, baseColors.inverseOnSurface),
    inverseSurface: resolveColor(Color.ios.label, baseColors.inverseSurface),
    inversePrimary: resolveColor(Color.ios.systemTeal, baseColors.inversePrimary),

    surfaceDisabled: baseColors.surfaceDisabled,
    onSurfaceDisabled: baseColors.onSurfaceDisabled,
    shadow: baseColors.shadow,
    backdrop: baseColors.backdrop,
    elevation: baseColors.elevation,
};

export const AppTheme = {
    ...MD3LightTheme,
    colors:
        Platform.select({
            android: androidColors,
            ios: iosColors,
            default: baseColors, // Web fallback
        }) ?? baseColors,
};
