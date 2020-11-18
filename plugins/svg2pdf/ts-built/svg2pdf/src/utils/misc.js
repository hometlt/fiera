import { alignmentBaselineMap } from './constants';
/**
 * Convert em, px and bare number attributes to pixel values
 * @param {string} value
 * @param {number} pdfFontSize
 */
export function toPixels(value, pdfFontSize) {
    let match;
    // em
    match = value && value.toString().match(/^([\-0-9.]+)em$/);
    if (match) {
        return parseFloat(match[1]) * pdfFontSize;
    }
    // pixels
    match = value && value.toString().match(/^([\-0-9.]+)(px|)$/);
    if (match) {
        return parseFloat(match[1]);
    }
    return 0;
}
// capture type...
let tol;
export function mapAlignmentBaseline(value) {
    return alignmentBaselineMap[value] || 'alphabetic';
}
//# sourceMappingURL=misc.js.map