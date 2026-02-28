import {
    alphaFromArgb,
    argbFromHex,
    blueFromArgb,
    greenFromArgb,
    redFromArgb,
} from '@material/material-color-utilities';

export default function hexToArgb(color_hex: string): string {
    const color = argbFromHex(color_hex);
    const red = redFromArgb(color);
    const green = greenFromArgb(color);
    const blue = blueFromArgb(color);
    const alpha = alphaFromArgb(color);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
