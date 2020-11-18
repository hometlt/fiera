import { svgNamespaceURI } from '../utils/constants';
export class TextMeasure {
    constructor() {
        this.measureMethods = {};
    }
    getTextOffset(text, attributeState) {
        const textAnchor = attributeState.textAnchor;
        if (textAnchor === 'start') {
            return 0;
        }
        const width = this.measureTextWidth(text, attributeState);
        let xOffset = 0;
        switch (textAnchor) {
            case 'end':
                xOffset = width;
                break;
            case 'middle':
                xOffset = width / 2;
                break;
        }
        return xOffset;
    }
    measureTextWidth(text, attributeState) {
        if (text.length === 0) {
            return 0;
        }
        const fontFamily = attributeState.fontFamily;
        const measure = this.getMeasureFunction(fontFamily);
        return measure.call(this, text, attributeState.fontFamily, attributeState.fontSize + 'px', attributeState.fontStyle, attributeState.fontWeight);
    }
    getMeasurementTextNode() {
        if (!this.textMeasuringTextElement) {
            this.textMeasuringTextElement = document.createElementNS(svgNamespaceURI, 'text');
            const svg = document.createElementNS(svgNamespaceURI, 'svg');
            svg.appendChild(this.textMeasuringTextElement);
            svg.style.setProperty('position', 'absolute');
            svg.style.setProperty('visibility', 'hidden');
            document.body.appendChild(svg);
        }
        return this.textMeasuringTextElement;
    }
    canvasTextMeasure(text, fontFamily, fontSize, fontStyle, fontWeight) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context != null) {
            context.font = [fontStyle, fontWeight, fontSize, fontFamily].join(' ');
            return context.measureText(text).width;
        }
        return 0;
    }
    svgTextMeasure(text, fontFamily, fontSize, fontStyle, fontWeight, measurementTextNode = this.getMeasurementTextNode()) {
        const textNode = measurementTextNode;
        textNode.setAttribute('font-family', fontFamily);
        textNode.setAttribute('font-size', fontSize);
        textNode.setAttribute('font-style', fontStyle);
        textNode.setAttribute('font-weight', fontWeight);
        textNode.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        textNode.textContent = text;
        return textNode.getBBox().width;
    }
    /**
     * Canvas text measuring is a lot faster than svg measuring. However, it is inaccurate for some fonts. So test each
     * font once and decide if canvas is accurate enough.
     */
    getMeasureFunction(fontFamily) {
        let method = this.measureMethods[fontFamily];
        if (!method) {
            const fontSize = '16px';
            const fontStyle = 'normal';
            const fontWeight = 'normal';
            const canvasWidth = this.canvasTextMeasure(TextMeasure.testString, fontFamily, fontSize, fontStyle, fontWeight);
            const svgWidth = this.svgTextMeasure(TextMeasure.testString, fontFamily, fontSize, fontStyle, fontWeight);
            method =
                Math.abs(canvasWidth - svgWidth) < TextMeasure.epsilon
                    ? this.canvasTextMeasure
                    : this.svgTextMeasure;
            this.measureMethods[fontFamily] = method;
        }
        return method;
    }
    cleanupTextMeasuring() {
        if (this.textMeasuringTextElement) {
            const parentNode = this.textMeasuringTextElement.parentNode;
            if (parentNode) {
                document.body.removeChild(parentNode);
            }
            this.textMeasuringTextElement = undefined;
        }
    }
}
TextMeasure.testString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!"$%&/()=?\'\\+*-_.:,;^}][{#~|<>';
TextMeasure.epsilon = 0.1;
//# sourceMappingURL=textmeasure.js.map