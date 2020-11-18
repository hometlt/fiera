import { RGBColor } from './utils/rgbcolor';
import { getTextRenderingMode } from './utils/text';
import { getAttribute } from './utils/node';
import { mapAlignmentBaseline, toPixels } from './utils/misc';
import { applyAttributes, parseAttributes } from './applyparseattributes';
import { ColorFill } from './fill/ColorFill';
/**
 * @param {string} textAnchor
 * @param {number} originX
 * @param {number} originY
 * @constructor
 */
var TextChunk = /** @class */ (function () {
    function TextChunk(parent, textAnchor, originX, originY) {
        this.textNode = parent;
        this.texts = [];
        this.textNodes = [];
        this.textAnchor = textAnchor;
        this.originX = originX;
        this.originY = originY;
    }
    TextChunk.prototype.add = function (tSpan, text) {
        this.texts.push(text);
        this.textNodes.push(tSpan);
    };
    TextChunk.prototype.put = function (context) {
        var i, textNode;
        var strokeRGB;
        var xs = [], ys = [], textNodeContexts = [];
        var currentTextX = this.originX, currentTextY = this.originY;
        var minX = currentTextX, maxX = currentTextX;
        for (i = 0; i < this.textNodes.length; i++) {
            textNode = this.textNodes[i];
            var x = currentTextX;
            var y = currentTextY;
            var textNodeContext = void 0;
            if (textNode.nodeName === '#text') {
                textNodeContext = context;
            }
            else {
                textNodeContext = context.clone();
                parseAttributes(textNodeContext, this.textNode, textNode);
                var tSpanStrokeColor = getAttribute(textNode, context.styleSheets, 'stroke');
                if (tSpanStrokeColor) {
                    strokeRGB = new RGBColor(tSpanStrokeColor);
                    if (strokeRGB.ok) {
                        textNodeContext.attributeState.stroke = new ColorFill(strokeRGB);
                    }
                }
                var strokeWidth = getAttribute(textNode, context.styleSheets, 'stroke-width');
                if (strokeWidth !== void 0) {
                    textNodeContext.attributeState.strokeWidth = parseFloat(strokeWidth);
                }
                var tSpanDx = textNode.getAttribute('dx');
                if (tSpanDx !== null) {
                    x += toPixels(tSpanDx, textNodeContext.attributeState.fontSize);
                }
                var tSpanDy = textNode.getAttribute('dy');
                if (tSpanDy !== null) {
                    y += toPixels(tSpanDy, textNodeContext.attributeState.fontSize);
                }
            }
            textNodeContexts[i] = textNodeContext;
            xs[i] = x;
            ys[i] = y;
            currentTextX =
                x + context.textMeasure.measureTextWidth(this.texts[i], textNodeContext.attributeState);
            currentTextY = y;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, currentTextX);
        }
        var textOffset = 0;
        switch (this.textAnchor) {
            case 'start':
                textOffset = 0;
                break;
            case 'middle':
                textOffset = (maxX - minX) / 2;
                break;
            case 'end':
                textOffset = maxX - minX;
                break;
        }
        for (i = 0; i < this.textNodes.length; i++) {
            textNode = this.textNodes[i];
            if (textNode.nodeName !== '#text') {
                var tSpanVisibility = getAttribute(textNode, context.styleSheets, 'visibility') ||
                    context.attributeState.visibility;
                if (tSpanVisibility === 'hidden') {
                    continue;
                }
            }
            context.pdf.saveGraphicsState();
            applyAttributes(textNodeContexts[i], context, textNode);
            var alignmentBaseline = textNodeContexts[i].attributeState.alignmentBaseline;
            var textRenderingMode = getTextRenderingMode(textNodeContexts[i].attributeState);
            context.pdf.text(this.texts[i], xs[i] - textOffset, ys[i], {
                baseline: mapAlignmentBaseline(alignmentBaseline),
                angle: context.transform,
                renderingMode: textRenderingMode === 'fill' ? void 0 : textRenderingMode
            });
            context.pdf.restoreGraphicsState();
        }
        return [currentTextX, currentTextY];
    };
    return TextChunk;
}());
export { TextChunk };
//# sourceMappingURL=textchunk.js.map