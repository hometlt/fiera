import { svgNamespaceURI } from '../utils/constants.js';
var TextMeasure = /** @class */ (function () {
    function TextMeasure() {
        this.measureMethods = {};
    }
    TextMeasure.prototype.getTextOffset = function (text, attributeState) {
        var textAnchor = attributeState.textAnchor;
        if (textAnchor === 'start') {
            return 0;
        }
        var width = this.measureTextWidth(text, attributeState);
        var xOffset = 0;
        switch (textAnchor) {
            case 'end':
                xOffset = width;
                break;
            case 'middle':
                xOffset = width / 2;
                break;
        }
        return xOffset;
    };
    TextMeasure.prototype.measureTextWidth = function (text, attributeState) {
        if (text.length === 0) {
            return 0;
        }
        var fontFamily = attributeState.fontFamily;
        var measure = this.getMeasureFunction(fontFamily);
        return measure.call(this, text, attributeState.fontFamily, attributeState.fontSize + 'px', attributeState.fontStyle, attributeState.fontWeight);
    };
    TextMeasure.prototype.getMeasurementTextNode = function () {
        if (!this.textMeasuringTextElement) {
            this.textMeasuringTextElement = document.createElementNS(svgNamespaceURI, 'text');
            var svg = document.createElementNS(svgNamespaceURI, 'svg');
            svg.appendChild(this.textMeasuringTextElement);
            svg.style.setProperty('position', 'absolute');
            svg.style.setProperty('visibility', 'hidden');
            document.body.appendChild(svg);
        }
        return this.textMeasuringTextElement;
    };
    TextMeasure.prototype.canvasTextMeasure = function (text, fontFamily, fontSize, fontStyle, fontWeight) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        if (context != null) {
            context.font = [fontStyle, fontWeight, fontSize, fontFamily].join(' ');
            return context.measureText(text).width;
        }
        return 0;
    };
    TextMeasure.prototype.svgTextMeasure = function (text, fontFamily, fontSize, fontStyle, fontWeight, measurementTextNode) {
        if (measurementTextNode === void 0) { measurementTextNode = this.getMeasurementTextNode(); }
        var textNode = measurementTextNode;
        textNode.setAttribute('font-family', fontFamily);
        textNode.setAttribute('font-size', fontSize);
        textNode.setAttribute('font-style', fontStyle);
        textNode.setAttribute('font-weight', fontWeight);
        textNode.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        textNode.textContent = text;
        return textNode.getBBox().width;
    };
    /**
     * Canvas text measuring is a lot faster than svg measuring. However, it is inaccurate for some fonts. So test each
     * font once and decide if canvas is accurate enough.
     */
    TextMeasure.prototype.getMeasureFunction = function (fontFamily) {
        var method = this.measureMethods[fontFamily];
        if (!method) {
            var fontSize = '16px';
            var fontStyle = 'normal';
            var fontWeight = 'normal';
            var canvasWidth = this.canvasTextMeasure(TextMeasure.testString, fontFamily, fontSize, fontStyle, fontWeight);
            var svgWidth = this.svgTextMeasure(TextMeasure.testString, fontFamily, fontSize, fontStyle, fontWeight);
            method =
                Math.abs(canvasWidth - svgWidth) < TextMeasure.epsilon
                    ? this.canvasTextMeasure
                    : this.svgTextMeasure;
            this.measureMethods[fontFamily] = method;
        }
        return method;
    };
    TextMeasure.prototype.cleanupTextMeasuring = function () {
        if (this.textMeasuringTextElement) {
            var parentNode = this.textMeasuringTextElement.parentNode;
            if (parentNode) {
                document.body.removeChild(parentNode);
            }
            this.textMeasuringTextElement = undefined;
        }
    };
    TextMeasure.testString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!"$%&/()=?\'\\+*-_.:,;^}][{#~|<>';
    TextMeasure.epsilon = 0.1;
    return TextMeasure;
}());
export { TextMeasure };
//# sourceMappingURL=textmeasure.js.map