import { getAttribute } from './node';
// capture type...
var tol;
export function getTextRenderingMode(attributeState) {
    var renderingMode = 'invisible';
    if (attributeState.fill && attributeState.stroke) {
        renderingMode = 'fillThenStroke';
    }
    else if (attributeState.fill) {
        renderingMode = 'fill';
    }
    else if (attributeState.stroke) {
        renderingMode = 'stroke';
    }
    return renderingMode;
}
export function transformXmlSpace(trimmedText, attributeState) {
    trimmedText = removeNewlines(trimmedText);
    trimmedText = replaceTabsBySpace(trimmedText);
    if (attributeState.xmlSpace === 'default') {
        trimmedText = trimmedText.trim();
        trimmedText = consolidateSpaces(trimmedText);
    }
    return trimmedText;
}
export function removeNewlines(str) {
    return str.replace(/[\n\r]/g, '');
}
export function replaceTabsBySpace(str) {
    return str.replace(/[\t]/g, ' ');
}
export function consolidateSpaces(str) {
    return str.replace(/ +/g, ' ');
}
// applies text transformations to a text node
export function transformText(node, text, context) {
    var textTransform = getAttribute(node, context.styleSheets, 'text-transform');
    switch (textTransform) {
        case 'uppercase':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        default:
            return text;
        // TODO: capitalize, full-width
    }
}
export function trimLeft(str) {
    return str.replace(/^\s+/, '');
}
export function trimRight(str) {
    return str.replace(/\s+$/, '');
}
//# sourceMappingURL=text.js.map