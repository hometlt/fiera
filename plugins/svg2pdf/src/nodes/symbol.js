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
import { getAttribute, svgNodeAndChildrenVisible } from '../utils/node';
import { getBoundingBoxByChildren } from '../utils/bbox';
import { parseFloats } from '../utils/parsing';
import { computeViewBoxTransform } from '../utils/transform';
import { NonRenderedNode } from './nonrenderednode';
import { applyAttributes, parseAttributes } from '../applyparseattributes';
import { applyClipPath, getClipPathNode } from '../utils/applyclippath';
var Symbol = /** @class */ (function (_super) {
    __extends(Symbol, _super);
    function Symbol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Symbol.prototype.apply = function (parentContext) {
        return __awaiter(this, void 0, void 0, function () {
            var context, hasClipPath, clipNode, _i, _a, child;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.isVisible(parentContext.attributeState.visibility !== 'hidden', parentContext)) {
                            return [2 /*return*/];
                        }
                        context = parentContext.clone();
                        context.transform = context.pdf.unitMatrix;
                        parseAttributes(context, this);
                        hasClipPath = this.element.hasAttribute('clip-path') &&
                            getAttribute(this.element, context.styleSheets, 'clip-path') !== 'none';
                        if (!hasClipPath) return [3 /*break*/, 3];
                        clipNode = getClipPathNode(this, context);
                        if (!(clipNode && clipNode.isVisible(true, context))) return [3 /*break*/, 2];
                        return [4 /*yield*/, applyClipPath(this, clipNode, context)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/];
                    case 3:
                        applyAttributes(context, parentContext, this.element);
                        _i = 0, _a = this.children;
                        _b.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        child = _a[_i];
                        return [4 /*yield*/, child.render(context)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Symbol.prototype.getBoundingBoxCore = function (context) {
        return getBoundingBoxByChildren(context, this);
    };
    Symbol.prototype.isVisible = function (parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    };
    Symbol.prototype.computeNodeTransformCore = function (context) {
        var x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0');
        var y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
        // TODO: implement refX/refY - this is still to do because common browsers don't seem to support the feature yet
        // x += parseFloat(this.element.getAttribute("refX")) || 0; ???
        // y += parseFloat(this.element.getAttribute("refY")) || 0; ???
        var viewBox = this.element.getAttribute('viewBox');
        if (viewBox) {
            var box = parseFloats(viewBox);
            var width = parseFloat(getAttribute(this.element, context.styleSheets, 'width') ||
                getAttribute(this.element.ownerSVGElement, context.styleSheets, 'width') ||
                viewBox[2]);
            var height = parseFloat(getAttribute(this.element, context.styleSheets, 'height') ||
                getAttribute(this.element.ownerSVGElement, context.styleSheets, 'height') ||
                viewBox[3]);
            return computeViewBoxTransform(this.element, box, x, y, width, height, context);
        }
        else {
            return context.pdf.Matrix(1, 0, 0, 1, x, y);
        }
    };
    return Symbol;
}(NonRenderedNode));
export { Symbol };
//# sourceMappingURL=symbol.js.map