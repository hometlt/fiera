var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { TextChunk } from '../textchunk.js';
import { defaultBoundingBox } from '../utils/bbox.js';
import { mapAlignmentBaseline, toPixels } from '../utils/misc.js';
import { getAttribute, nodeIs, svgNodeAndChildrenVisible } from '../utils/node.js';
import { consolidateSpaces, getTextRenderingMode, removeNewlines, replaceTabsBySpace, transformText, transformXmlSpace, trimLeft, trimRight } from '../utils/text.js';
import { GraphicsNode } from './graphicsnode.js';
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextNode.prototype.renderCore = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var xOffset, pdfFontSize, textX, textY, dx, dy, visibility, tSpanCount, trimmedText, transformedText, alignmentBaseline, textRenderingMode, currentTextSegment, i, textNode, xmlSpace, textContent, tSpan, j, lastPositions, tSpanAbsX, x, tSpanAbsY, y, tSpanXmlSpace, trimmedText, transformedText;
            return __generator(this, function (_a) {
                context.pdf.saveGraphicsState();
                xOffset = 0;
                pdfFontSize = context.pdf.getFontSize();
                textX = toPixels(this.element.getAttribute('x'), pdfFontSize);
                textY = toPixels(this.element.getAttribute('y'), pdfFontSize);
                dx = toPixels(this.element.getAttribute('dx'), pdfFontSize);
                dy = toPixels(this.element.getAttribute('dy'), pdfFontSize);
                visibility = context.attributeState.visibility;
                tSpanCount = this.element.childElementCount;
                if (tSpanCount === 0) {
                    trimmedText = transformXmlSpace(this.element.textContent || '', context.attributeState);
                    transformedText = transformText(this.element, trimmedText, context);
                    xOffset = context.textMeasure.getTextOffset(transformedText, context.attributeState);
                    if (visibility === 'visible') {
                        alignmentBaseline = context.attributeState.alignmentBaseline;
                        textRenderingMode = getTextRenderingMode(context.attributeState);
                        context.pdf.text(transformedText, textX + dx - xOffset, textY + dy, {
                            baseline: mapAlignmentBaseline(alignmentBaseline),
                            angle: context.transform,
                            renderingMode: textRenderingMode === 'fill' ? void 0 : textRenderingMode
                        });
                    }
                }
                else {
                    currentTextSegment = new TextChunk(this, context.attributeState.textAnchor, textX + dx, textY + dy);
                    for (i = 0; i < this.element.childNodes.length; i++) {
                        textNode = this.element.childNodes[i];
                        if (!textNode.textContent) {
                            continue;
                        }
                        xmlSpace = context.attributeState.xmlSpace;
                        textContent = textNode.textContent;
                        if (textNode.nodeName === '#text') {
                        }
                        else if (nodeIs(textNode, 'title')) {
                            continue;
                        }
                        else if (nodeIs(textNode, 'tspan')) {
                            tSpan = textNode;
                            if (tSpan.childElementCount > 0) {
                                // filter <title> elements...
                                textContent = '';
                                for (j = 0; j < tSpan.childNodes.length; j++) {
                                    if (tSpan.childNodes[j].nodeName === '#text') {
                                        textContent += tSpan.childNodes[j].textContent;
                                    }
                                }
                            }
                            lastPositions = void 0;
                            tSpanAbsX = tSpan.getAttribute('x');
                            if (tSpanAbsX !== null) {
                                x = toPixels(tSpanAbsX, pdfFontSize);
                                lastPositions = currentTextSegment.put(context);
                                currentTextSegment = new TextChunk(this, getAttribute(tSpan, context.styleSheets, 'text-anchor') ||
                                    context.attributeState.textAnchor, x, lastPositions[1]);
                            }
                            tSpanAbsY = tSpan.getAttribute('y');
                            if (tSpanAbsY !== null) {
                                y = toPixels(tSpanAbsY, pdfFontSize);
                                lastPositions = currentTextSegment.put(context);
                                currentTextSegment = new TextChunk(this, getAttribute(tSpan, context.styleSheets, 'text-anchor') ||
                                    context.attributeState.textAnchor, lastPositions[0], y);
                            }
                            tSpanXmlSpace = tSpan.getAttribute('xml:space');
                            if (tSpanXmlSpace) {
                                xmlSpace = tSpanXmlSpace;
                            }
                        }
                        trimmedText = removeNewlines(textContent);
                        trimmedText = replaceTabsBySpace(trimmedText);
                        if (xmlSpace === 'default') {
                            if (i === 0) {
                                trimmedText = trimLeft(trimmedText);
                            }
                            if (i === tSpanCount - 1) {
                                trimmedText = trimRight(trimmedText);
                            }
                            trimmedText = consolidateSpaces(trimmedText);
                        }
                        transformedText = transformText(this.element, trimmedText, context);
                        currentTextSegment.add(textNode, transformedText);
                    }
                    currentTextSegment.put(context);
                }
                context.pdf.restoreGraphicsState();
                return [2 /*return*/];
            });
        });
    };
    TextNode.prototype.isVisible = function (parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    };
    TextNode.prototype.getBoundingBoxCore = function (context) {
        return defaultBoundingBox(this.element, context);
    };
    TextNode.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    return TextNode;
}(GraphicsNode));
export { TextNode };
//# sourceMappingURL=text.js.map