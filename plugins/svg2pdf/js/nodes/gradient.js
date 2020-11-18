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
import { defaultBoundingBox } from '../utils/bbox.js';
import { NonRenderedNode } from './nonrenderednode.js';
import { getAttribute, svgNodeAndChildrenVisible } from '../utils/node.js';
import { RGBColor } from '../utils/rgbcolor.js';
import { GState, ShadingPattern } from '../../../jspdf/src/jspdf.js';
var Gradient = /** @class */ (function (_super) {
    __extends(Gradient, _super);
    function Gradient(pdfGradientType, element, children) {
        var _this = _super.call(this, element, children) || this;
        _this.pdfGradientType = pdfGradientType;
        return _this;
    }
    Gradient.prototype.apply = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var id, colors, opacitySum, hasOpacity, gState, pattern;
            return __generator(this, function (_a) {
                id = this.element.getAttribute('id');
                if (!id) {
                    return [2 /*return*/];
                }
                colors = [];
                opacitySum = 0;
                hasOpacity = false;
                this.children.forEach(function (stop) {
                    if (stop.element.tagName.toLowerCase() === 'stop') {
                        var color = new RGBColor(getAttribute(stop.element, context.styleSheets, 'stop-color'));
                        colors.push({
                            offset: Gradient.parseGradientOffset(stop.element.getAttribute('offset') || '0'),
                            color: [color.r, color.g, color.b]
                        });
                        var opacity = getAttribute(stop.element, context.styleSheets, 'stop-opacity');
                        if (opacity && opacity !== '1') {
                            opacitySum += parseFloat(opacity);
                            hasOpacity = true;
                        }
                    }
                });
                if (hasOpacity) {
                    gState = new GState({ opacity: opacitySum / colors.length });
                }
                pattern = new ShadingPattern(this.pdfGradientType, this.getCoordinates(), colors, gState);
                context.pdf.addShadingPattern(id, pattern);
                return [2 /*return*/];
            });
        });
    };
    Gradient.prototype.getBoundingBoxCore = function (context) {
        return defaultBoundingBox(this.element, context);
    };
    Gradient.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    Gradient.prototype.isVisible = function (parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    };
    /**
     * Convert percentage to decimal
     */
    Gradient.parseGradientOffset = function (value) {
        var parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && value.indexOf('%') >= 0) {
            return parsedValue / 100;
        }
        return parsedValue;
    };
    return Gradient;
}(NonRenderedNode));
export { Gradient };
//# sourceMappingURL=gradient.js.map