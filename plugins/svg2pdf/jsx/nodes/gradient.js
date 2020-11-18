import { defaultBoundingBox } from '../utils/bbox.js';
import { NonRenderedNode } from './nonrenderednode.js';
import { getAttribute, svgNodeAndChildrenVisible } from '../utils/node.js';
import { RGBColor } from '../utils/rgbcolor.js';
import { GState, ShadingPattern } from './../../../jspdf/src/jspdf.js';
export class Gradient extends NonRenderedNode {
    constructor(pdfGradientType, element, children) {
        super(element, children);
        this.pdfGradientType = pdfGradientType;
    }
    async apply(context) {
        const id = this.element.getAttribute('id');
        if (!id) {
            return;
        }
        const colors = [];
        let opacitySum = 0;
        let hasOpacity = false;
        let gState;
        this.children.forEach(stop => {
            if (stop.element.tagName.toLowerCase() === 'stop') {
                const color = new RGBColor(getAttribute(stop.element, context.styleSheets, 'stop-color'));
                colors.push({
                    offset: Gradient.parseGradientOffset(stop.element.getAttribute('offset') || '0'),
                    color: [color.r, color.g, color.b]
                });
                const opacity = getAttribute(stop.element, context.styleSheets, 'stop-opacity');
                if (opacity && opacity !== '1') {
                    opacitySum += parseFloat(opacity);
                    hasOpacity = true;
                }
            }
        });
        if (hasOpacity) {
            gState = new GState({ opacity: opacitySum / colors.length });
        }
        const pattern = new ShadingPattern(this.pdfGradientType, this.getCoordinates(), colors, gState);
        context.pdf.addShadingPattern(id, pattern);
    }
    getBoundingBoxCore(context) {
        return defaultBoundingBox(this.element, context);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    isVisible(parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    }
    /**
     * Convert percentage to decimal
     */
    static parseGradientOffset(value) {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && value.indexOf('%') >= 0) {
            return parsedValue / 100;
        }
        return parsedValue;
    }
}
