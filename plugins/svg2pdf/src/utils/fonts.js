export var fontAliases = {
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
    var fontType = '';
    if (attributeState.fontWeight === 'bold') {
        fontType = 'bold';
    }
    if (attributeState.fontStyle === 'italic') {
        fontType += 'italic';
    }
    if (fontType === '') {
        fontType = 'normal';
    }
    var availableFonts = context.pdf.getFontList();
    var firstAvailable = '';
    var fontIsAvailable = fontFamilies.some(function (font) {
        var availableStyles = availableFonts[font];
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