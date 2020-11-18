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
import { parseFloats } from '../utils/parsing';
import { getAttribute, svgNodeAndChildrenVisible } from '../utils/node';
import { ContainerNode } from './containernode';
import { computeViewBoxTransform, parseTransform } from '../utils/transform';
import { Viewport } from '../context/viewport';
var Svg = /** @class */ (function (_super) {
    __extends(Svg, _super);
    function Svg() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Svg.prototype.isVisible = function (parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    };
    Svg.prototype.render = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var x, y, width, height, transform;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isVisible(context.attributeState.visibility !== 'hidden', context)) {
                            return [2 /*return*/];
                        }
                        x = this.getX(context);
                        y = this.getY(context);
                        width = this.getWidth(context);
                        height = this.getHeight(context);
                        context.pdf.saveGraphicsState();
                        transform = context.transform;
                        if (this.element.hasAttribute('transform')) {
                            // SVG 2 allows transforms on SVG elements
                            // "The transform should be applied as if the ‘svg’ had a parent element with that transform set."
                            transform = context.pdf.matrixMult(
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            parseTransform(this.element.getAttribute('transform'), context), transform);
                        }
                        context.pdf.setCurrentTransformationMatrix(transform);
                        if (!context.withinUse &&
                            getAttribute(this.element, context.styleSheets, 'overflow') !== 'visible') {
                            // establish a new viewport
                            context.pdf
                                .rect(x, y, width, height)
                                .clip()
                                .discardPath();
                        }
                        return [4 /*yield*/, _super.prototype.render.call(this, context.clone({
                                transform: context.pdf.unitMatrix,
                                viewport: context.withinUse ? context.viewport : new Viewport(width, height)
                            }))];
                    case 1:
                        _a.sent();
                        context.pdf.restoreGraphicsState();
                        return [2 /*return*/];
                }
            });
        });
    };
    Svg.prototype.computeNodeTransform = function (context) {
        return this.computeNodeTransformCore(context);
    };
    Svg.prototype.computeNodeTransformCore = function (context) {
        if (context.withinUse) {
            return context.pdf.unitMatrix;
        }
        var x = this.getX(context);
        var y = this.getY(context);
        var viewBox = this.getViewBox();
        var nodeTransform;
        if (viewBox) {
            var width = this.getWidth(context);
            var height = this.getHeight(context);
            nodeTransform = computeViewBoxTransform(this.element, viewBox, x, y, width, height, context);
        }
        else {
            nodeTransform = context.pdf.Matrix(1, 0, 0, 1, x, y);
        }
        return nodeTransform;
    };
    Svg.prototype.getWidth = function (context) {
        if (this.width !== undefined) {
            return this.width;
        }
        var width;
        var parameters = context.svg2pdfParameters;
        if (this.isOutermostSvg(context)) {
            // special treatment for the outermost SVG element
            if (parameters.width != null) {
                // if there is a user defined width, use it
                width = parameters.width;
            }
            else {
                // otherwise check if the SVG element defines the width itself
                var widthAttr = getAttribute(this.element, context.styleSheets, 'width');
                if (widthAttr) {
                    width = parseFloat(widthAttr);
                }
                else {
                    // if not, check if we can figure out the aspect ratio from the viewBox attribute
                    var viewBox = this.getViewBox();
                    if (viewBox &&
                        (parameters.height != null || getAttribute(this.element, context.styleSheets, 'height'))) {
                        // if there is a viewBox and the height is defined, use the width that matches the height together with the aspect ratio
                        var aspectRatio = viewBox[2] / viewBox[3];
                        width = this.getHeight(context) * aspectRatio;
                    }
                    else {
                        // if there is no viewBox use a default of 300 or the largest size that fits into the outer viewport
                        // at an aspect ratio of 2:1
                        width = Math.min(300, context.viewport.width, context.viewport.height * 2);
                    }
                }
            }
        }
        else {
            var widthAttr = getAttribute(this.element, context.styleSheets, 'width');
            width = widthAttr ? parseFloat(widthAttr) : context.viewport.width;
        }
        return (this.width = width);
    };
    Svg.prototype.getHeight = function (context) {
        if (this.height !== undefined) {
            return this.height;
        }
        var height;
        var parameters = context.svg2pdfParameters;
        if (this.isOutermostSvg(context)) {
            // special treatment for the outermost SVG element
            if (parameters.height != null) {
                // if there is a user defined height, use it
                height = parameters.height;
            }
            else {
                // otherwise check if the SVG element defines the height itself
                var heightAttr = getAttribute(this.element, context.styleSheets, 'height');
                if (heightAttr) {
                    height = parseFloat(heightAttr);
                }
                else {
                    // if not, check if we can figure out the aspect ratio from the viewBox attribute
                    var viewBox = this.getViewBox();
                    if (viewBox) {
                        // if there is a viewBox, use the height that matches the width together with the aspect ratio
                        var aspectRatio = viewBox[2] / viewBox[3];
                        height = this.getWidth(context) / aspectRatio;
                    }
                    else {
                        // if there is no viewBox use a default of 150 or the largest size that fits into the outer viewport
                        // at an aspect ratio of 2:1
                        height = Math.min(150, context.viewport.width / 2, context.viewport.height);
                    }
                }
            }
        }
        else {
            var heightAttr = getAttribute(this.element, context.styleSheets, 'height');
            height = heightAttr ? parseFloat(heightAttr) : context.viewport.height;
        }
        return (this.height = height);
    };
    Svg.prototype.getX = function (context) {
        if (this.x !== undefined) {
            return this.x;
        }
        if (this.isOutermostSvg(context)) {
            return (this.x = 0);
        }
        var xAttr = getAttribute(this.element, context.styleSheets, 'x');
        return (this.x = xAttr ? parseFloat(xAttr) : 0);
    };
    Svg.prototype.getY = function (context) {
        if (this.y !== undefined) {
            return this.y;
        }
        if (this.isOutermostSvg(context)) {
            return (this.y = 0);
        }
        var yAttr = getAttribute(this.element, context.styleSheets, 'y');
        return (this.y = yAttr ? parseFloat(yAttr) : 0);
    };
    Svg.prototype.getViewBox = function () {
        if (this.viewBox !== undefined) {
            return this.viewBox;
        }
        var viewBox = this.element.getAttribute('viewBox');
        return (this.viewBox = viewBox ? parseFloats(viewBox) : undefined);
    };
    Svg.prototype.isOutermostSvg = function (context) {
        return context.svg2pdfParameters.element === this.element;
    };
    return Svg;
}(ContainerNode));
export { Svg };
//# sourceMappingURL=svg.js.map