import { Context } from '../context/context.js';
import { parseTransform } from '../utils/transform.js';
import { getAttribute } from '../utils/node.js';
export class PatternFill {
    constructor(key, pattern) {
        this.key = key;
        this.pattern = pattern;
    }
    async getFillData(forNode, context) {
        await context.refsHandler.getRendered(this.key, node => node.apply(new Context(context.pdf, {
            refsHandler: context.refsHandler,
            textMeasure: context.textMeasure,
            styleSheets: context.styleSheets,
            viewport: context.viewport,
            svg2pdfParameters: context.svg2pdfParameters
        })));
        const patternData = {
            key: this.key,
            boundingBox: undefined,
            xStep: 0,
            yStep: 0,
            matrix: undefined
        };
        let bBox;
        let patternUnitsMatrix = context.pdf.unitMatrix;
        if (!this.pattern.element.hasAttribute('patternUnits') ||
            this.pattern.element.getAttribute('patternUnits').toLowerCase() === 'objectboundingbox') {
            bBox = forNode.getBoundingBox(context);
            patternUnitsMatrix = context.pdf.Matrix(1, 0, 0, 1, bBox[0], bBox[1]);
            const fillBBox = this.pattern.getBoundingBox(context);
            const x = fillBBox[0] * bBox[0] || 0;
            const y = fillBBox[1] * bBox[1] || 0;
            const width = fillBBox[2] * bBox[2] || 0;
            const height = fillBBox[3] * bBox[3] || 0;
            patternData.boundingBox = [x, y, x + width, y + height];
            patternData.xStep = width;
            patternData.yStep = height;
        }
        let patternContentUnitsMatrix = context.pdf.unitMatrix;
        if (this.pattern.element.hasAttribute('patternContentUnits') &&
            this.pattern.element.getAttribute('patternContentUnits').toLowerCase() ===
                'objectboundingbox') {
            bBox || (bBox = forNode.getBoundingBox(context));
            patternContentUnitsMatrix = context.pdf.Matrix(bBox[2], 0, 0, bBox[3], 0, 0);
            const fillBBox = patternData.boundingBox || this.pattern.getBoundingBox(context);
            const x = fillBBox[0] / bBox[0] || 0;
            const y = fillBBox[1] / bBox[1] || 0;
            const width = fillBBox[2] / bBox[2] || 0;
            const height = fillBBox[3] / bBox[3] || 0;
            patternData.boundingBox = [x, y, x + width, y + height];
            patternData.xStep = width;
            patternData.yStep = height;
        }
        let patternTransformMatrix = context.pdf.unitMatrix;
        const patternTransform = getAttribute(this.pattern.element, context.styleSheets, 'patternTransform', 'transform');
        if (patternTransform) {
            patternTransformMatrix = parseTransform(patternTransform, context);
        }
        let matrix = patternContentUnitsMatrix;
        matrix = context.pdf.matrixMult(matrix, patternUnitsMatrix); // translate by
        matrix = context.pdf.matrixMult(matrix, patternTransformMatrix);
        matrix = context.pdf.matrixMult(matrix, context.transform);
        patternData.matrix = matrix;
        return patternData;
    }
}
