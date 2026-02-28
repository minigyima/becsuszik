import { createMaterial3Theme } from '@pchmn/expo-material3-theme';
import hexToArgb from './hexToArgb';

const BLUE_HEX = '#007AFF';
// kinda loptam, iOS system blue, viszont sajnos a UIKit platformColor nem add vissza hex formátumban lófaszt sem ://
const md3theme = createMaterial3Theme(BLUE_HEX);

export const iosLightColors = {
    ...md3theme.light,
    primary: hexToArgb(md3theme.light.primary),
    card: md3theme.light.elevation.level2,
    imageBackdrop: '#ffffff',
};

export const iosDarkColors = {
    ...md3theme.dark,
    primary: hexToArgb(md3theme.dark.primary),
    card: md3theme.dark.elevation.level2,
    imageBackdrop: '#000000',
};
