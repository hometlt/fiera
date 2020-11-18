import { AttributeState } from './attributestate.js';
import { TextMeasure } from './textmeasure.js';
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
export class Context {
    constructor(pdf, values) {
        this.pdf = pdf;
        this.svg2pdfParameters = values.svg2pdfParameters;
        this.attributeState = values.attributeState
            ? values.attributeState.clone()
            : AttributeState.default();
        this.viewport = values.viewport;
        this.refsHandler = values.refsHandler ?? null;
        this.styleSheets = values.styleSheets ?? null;
        this.textMeasure = values.textMeasure ?? new TextMeasure();
        this.transform = values.transform ?? this.pdf.unitMatrix;
        this.withinClipPath = values.withinClipPath ?? false;
        this.withinUse = values.withinUse ?? false;
    }
    clone(values = {}) {
        return new Context(this.pdf, {
            svg2pdfParameters: values.svg2pdfParameters ?? this.svg2pdfParameters,
            attributeState: values.attributeState
                ? values.attributeState.clone()
                : this.attributeState.clone(),
            viewport: values.viewport ?? this.viewport,
            refsHandler: values.refsHandler ?? this.refsHandler,
            styleSheets: values.styleSheets ?? this.styleSheets,
            textMeasure: values.textMeasure ?? this.textMeasure,
            transform: values.transform ?? this.transform,
            withinClipPath: values.withinClipPath ?? this.withinClipPath,
            withinUse: values.withinUse ?? this.withinUse
        });
    }
}
