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
import { Context } from '../context/context.js';
import { parseFloats } from '../utils/parsing.js';
import { computeViewBoxTransform } from '../utils/transform.js';
import { NonRenderedNode } from './nonrenderednode.js';
import { svgNodeAndChildrenVisible } from '../utils/node.js';
var MarkerNode = /** @class */ (function (_super) {
    __extends(MarkerNode, _super);
    function MarkerNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarkerNode.prototype.apply = function (parentContext) {
        return __awaiter(this, void 0, void 0, function () {
            var tfMatrix, bBox, _i, _a, child;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tfMatrix = this.computeNodeTransform(parentContext);
                        bBox = this.getBoundingBox(parentContext);
                        parentContext.pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], tfMatrix);
                        _i = 0, _a = this.children;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        child = _a[_i];
                        return [4 /*yield*/, child.render(new Context(parentContext.pdf, {
                                refsHandler: parentContext.refsHandler,
                                styleSheets: parentContext.styleSheets,
                                viewport: parentContext.viewport,
                                svg2pdfParameters: parentContext.svg2pdfParameters
                            }))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        parentContext.pdf.endFormObject(this.element.getAttribute('id'));
                        return [2 /*return*/];
                }
            });
        });
    };
    MarkerNode.prototype.getBoundingBoxCore = function (context) {
        var viewBox = this.element.getAttribute('viewBox');
        var vb;
        if (viewBox) {
            vb = parseFloats(viewBox);
        }
        return [
            (vb && vb[0]) || 0,
            (vb && vb[1]) || 0,
            (vb && vb[2]) || parseFloat(this.element.getAttribute('marker-width') || '0'),
            (vb && vb[3]) || parseFloat(this.element.getAttribute('marker-height') || '0')
        ];
    };
    MarkerNode.prototype.computeNodeTransformCore = function (context) {
        var refX = parseFloat(this.element.getAttribute('refX') || '0');
        var refY = parseFloat(this.element.getAttribute('refY') || '0');
        var viewBox = this.element.getAttribute('viewBox');
        var nodeTransform;
        if (viewBox) {
            var bounds = parseFloats(viewBox);
            // "Markers are drawn such that their reference point (i.e., attributes ‘refX’ and ‘refY’)
            // is positioned at the given vertex." - The "translate" part of the viewBox transform is
            // ignored.
            nodeTransform = computeViewBoxTransform(this.element, bounds, 0, 0, parseFloat(this.element.getAttribute('markerWidth') || '3'), parseFloat(this.element.getAttribute('markerHeight') || '3'), context, true);
            nodeTransform = context.pdf.matrixMult(context.pdf.Matrix(1, 0, 0, 1, -refX, -refY), nodeTransform);
        }
        else {
            nodeTransform = context.pdf.Matrix(1, 0, 0, 1, -refX, -refY);
        }
        return nodeTransform;
    };
    MarkerNode.prototype.isVisible = function (parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    };
    return MarkerNode;
}(NonRenderedNode));
export { MarkerNode };
//# sourceMappingURL=marker.js.map