import { AttributeState } from './attributestate';
import { TextMeasure } from './textmeasure';
/**
 *
 * @package
 * @param values
 * @constructor
 * @property pdf
 * @property attributeState  Keeps track of parent attributes that are inherited automatically
 * @property refsHandler  The handler that will render references on demand
 * @property styleSheets
 * @property textMeasure
 * @property transform The current transformation matrix
 * @property withinClipPath
 */
var Context = /** @class */ (function () {
    function Context(pdf, values) {
        var _a, _b, _c, _d, _e, _f;
        this.pdf = pdf;
        this.svg2pdfParameters = values.svg2pdfParameters;
        this.attributeState = values.attributeState
            ? values.attributeState.clone()
            : AttributeState.default();
        this.viewport = values.viewport;
        this.refsHandler = (_a = values.refsHandler) !== null && _a !== void 0 ? _a : null;
        this.styleSheets = (_b = values.styleSheets) !== null && _b !== void 0 ? _b : null;
        this.textMeasure = (_c = values.textMeasure) !== null && _c !== void 0 ? _c : new TextMeasure();
        this.transform = (_d = values.transform) !== null && _d !== void 0 ? _d : this.pdf.unitMatrix;
        this.withinClipPath = (_e = values.withinClipPath) !== null && _e !== void 0 ? _e : false;
        this.withinUse = (_f = values.withinUse) !== null && _f !== void 0 ? _f : false;
    }
    Context.prototype.clone = function (values) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (values === void 0) { values = {}; }
        return new Context(this.pdf, {
            svg2pdfParameters: (_a = values.svg2pdfParameters) !== null && _a !== void 0 ? _a : this.svg2pdfParameters,
            attributeState: values.attributeState
                ? values.attributeState.clone()
                : this.attributeState.clone(),
            viewport: (_b = values.viewport) !== null && _b !== void 0 ? _b : this.viewport,
            refsHandler: (_c = values.refsHandler) !== null && _c !== void 0 ? _c : this.refsHandler,
            styleSheets: (_d = values.styleSheets) !== null && _d !== void 0 ? _d : this.styleSheets,
            textMeasure: (_e = values.textMeasure) !== null && _e !== void 0 ? _e : this.textMeasure,
            transform: (_f = values.transform) !== null && _f !== void 0 ? _f : this.transform,
            withinClipPath: (_g = values.withinClipPath) !== null && _g !== void 0 ? _g : this.withinClipPath,
            withinUse: (_h = values.withinUse) !== null && _h !== void 0 ? _h : this.withinUse
        });
    };
    return Context;
}());
export { Context };
//# sourceMappingURL=context.js.map