import { iriReference } from '../utils/constants.js';
import { LinearGradient } from '../nodes/lineargradient.js';
import { RadialGradient } from '../nodes/radialgradient.js';
import { GradientFill } from './GradientFill.js';
import { Pattern } from '../nodes/pattern.js';
import { PatternFill } from './PatternFill.js';
import { ColorFill } from './ColorFill.js';
import { RGBColor } from '../utils/rgbcolor.js';
import { parseColor } from '../utils/parsing.js';
export function parseFill(fill, context) {
    const url = iriReference.exec(fill);
    if (url) {
        const fillUrl = url[1];
        const fillNode = context.refsHandler.get(fillUrl);
        if (fillNode && (fillNode instanceof LinearGradient || fillNode instanceof RadialGradient)) {
            return new GradientFill(fillUrl, fillNode);
        }
        else if (fillNode && fillNode instanceof Pattern) {
            return new PatternFill(fillUrl, fillNode);
        }
        else {
            // unsupported fill argument -> fill black
            return new ColorFill(new RGBColor('rgb(0, 0, 0)'));
        }
    }
    else {
        // plain color
        const fillColor = parseColor(fill);
        if (fillColor.ok) {
            return new ColorFill(fillColor);
        }
        else if (fill === 'none') {
            return null;
        }
        else {
            return null;
        }
    }
}
