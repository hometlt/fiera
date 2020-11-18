/**
 * parses a comma, sign and/or whitespace separated string of floats and returns
 * the single floats in an array
 */
import { RGBColor } from './rgbcolor.js';
export function parseFloats(str) {
    var floats = [];
    var regex = /[+-]?(?:(?:\d+\.?\d*)|(?:\d*\.?\d+))(?:[eE][+-]?\d+)?/g;
    var match;
    while ((match = regex.exec(str))) {
        floats.push(parseFloat(match[0]));
    }
    return floats;
}
// extends RGBColor by rgba colors as RGBColor is not capable of it
export function parseColor(colorString) {
    if (colorString === 'transparent') {
        var transparent = new RGBColor('rgb(0,0,0)');
        transparent.a = 0;
        return transparent;
    }
    var match = /\s*rgba\(((?:[^,\)]*,){3}[^,\)]*)\)\s*/.exec(colorString);
    if (match) {
        var floats = parseFloats(match[1]);
        var color = new RGBColor('rgb(' + floats.slice(0, 3).join(',') + ')');
        color.a = floats[3];
        return color;
    }
    else {
        return new RGBColor(colorString);
    }
}
//# sourceMappingURL=parsing.js.map