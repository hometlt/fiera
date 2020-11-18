export const fontAliases = {
    'sans-serif': 'helvetica',
    verdana: 'helvetica',
    arial: 'helvetica',
    fixed: 'courier',
    monospace: 'courier',
    terminal: 'courier',
    serif: 'times',
    cursive: 'times',
    fantasy: 'times'
};
export function findFirstAvailableFontFamily(attributeState, fontFamilies, context) {
    let fontType = '';
    if (attributeState.fontWeight === 'bold') {
        fontType = 'bold';
    }
    if (attributeState.fontStyle === 'italic') {
        fontType += 'italic';
    }
    if (fontType === '') {
        fontType = 'normal';
    }
    const availableFonts = context.pdf.getFontList();
    let firstAvailable = '';
    const fontIsAvailable = fontFamilies.some(font => {
        const availableStyles = availableFonts[font];
        if (availableStyles && availableStyles.indexOf(fontType) >= 0) {
            firstAvailable = font;
            return true;
        }
        font = font.toLowerCase();
        if (fontAliases.hasOwnProperty(font)) {
            firstAvailable = font;
            return true;
        }
        return false;
    });
    if (!fontIsAvailable) {
        firstAvailable = 'times';
    }
    return firstAvailable;
}
//# sourceMappingURL=fonts.js.map