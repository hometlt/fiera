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
import { Context } from '../context/context';
import { parseTransform } from '../utils/transform';
import { getAttribute } from '../utils/node';
var PatternFill = /** @class */ (function () {
    function PatternFill(key, pattern) {
        this.key = key;
        this.pattern = pattern;
    }
    PatternFill.prototype.getFillData = function (forNode, context) {
        return __awaiter(this, void 0, void 0, function () {
            var patternData, bBox, patternUnitsMatrix, fillBBox, x, y, width, height, patternContentUnitsMatrix, fillBBox, x, y, width, height, patternTransformMatrix, patternTransform, matrix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.refsHandler.getRendered(this.key, function (node) {
                            return node.apply(new Context(context.pdf, {
                                refsHandler: context.refsHandler,
                                textMeasure: context.textMeasure,
                                styleSheets: context.styleSheets,
                                viewport: context.viewport,
                                svg2pdfParameters: context.svg2pdfParameters
                            }));
                        })];
                    case 1:
                        _a.sent();
                        patternData = {
                            key: this.key,
                            boundingBox: undefined,
                            xStep: 0,
                            yStep: 0,
                            matrix: undefined
                        };
                        patternUnitsMatrix = context.pdf.unitMatrix;
                        if (!this.pattern.element.hasAttribute('patternUnits') ||
                            this.pattern.element.getAttribute('patternUnits').toLowerCase() === 'objectboundingbox') {
                            bBox = forNode.getBoundingBox(context);
                            patternUnitsMatrix = context.pdf.Matrix(1, 0, 0, 1, bBox[0], bBox[1]);
                            fillBBox = this.pattern.getBoundingBox(context);
                            x = fillBBox[0] * bBox[0] || 0;
                            y = fillBBox[1] * bBox[1] || 0;
                            width = fillBBox[2] * bBox[2] || 0;
                            height = fillBBox[3] * bBox[3] || 0;
                            patternData.boundingBox = [x, y, x + width, y + height];
                            patternData.xStep = width;
                            patternData.yStep = height;
                        }
                        patternContentUnitsMatrix = context.pdf.unitMatrix;
                        if (this.pattern.element.hasAttribute('patternContentUnits') &&
                            this.pattern.element.getAttribute('patternContentUnits').toLowerCase() ===
                                'objectboundingbox') {
                            bBox || (bBox = forNode.getBoundingBox(context));
                            patternContentUnitsMatrix = context.pdf.Matrix(bBox[2], 0, 0, bBox[3], 0, 0);
                            fillBBox = patternData.boundingBox || this.pattern.getBoundingBox(context);
                            x = fillBBox[0] / bBox[0] || 0;
                            y = fillBBox[1] / bBox[1] || 0;
                            width = fillBBox[2] / bBox[2] || 0;
                            height = fillBBox[3] / bBox[3] || 0;
                            patternData.boundingBox = [x, y, x + width, y + height];
                            patternData.xStep = width;
                            patternData.yStep = height;
                        }
                        patternTransformMatrix = context.pdf.unitMatrix;
                        patternTransform = getAttribute(this.pattern.element, context.styleSheets, 'patternTransform', 'transform');
                        if (patternTransform) {
                            patternTransformMatrix = parseTransform(patternTransform, context);
                        }
                        matrix = patternContentUnitsMatrix;
                        matrix = context.pdf.matrixMult(matrix, patternUnitsMatrix); // translate by
                        matrix = context.pdf.matrixMult(matrix, patternTransformMatrix);
                        matrix = context.pdf.matrixMult(matrix, context.transform);
                        patternData.matrix = matrix;
                        return [2 /*return*/, patternData];
                }
            });
        });
    };
    return PatternFill;
}());
export { PatternFill };
//# sourceMappingURL=PatternFill.js.map