import { Context } from '../context/context';
import { parseTransform } from '../utils/transform';
import { getAttribute } from '../utils/node';
export class GradientFill {
    constructor(key, gradient) {
        this.key = key;
        this.gradient = gradient;
    }
    async getFillData(forNode, context) {
        await context.refsHandler.getRendered(this.key, node => node.apply(new Context(context.pdf, {
            refsHandler: context.refsHandler,
            textMeasure: context.textMeasure,
            styleSheets: context.styleSheets,
            viewport: context.viewport,
            svg2pdfParameters: context.svg2pdfParameters
        })));
        // matrix to convert between gradient space and user space
        // for "userSpaceOnUse" this is the current transformation: tfMatrix
        // for "objectBoundingBox" or default, the gradient gets scaled and transformed to the bounding box
        let gradientUnitsMatrix;
        if (!this.gradient.element.hasAttribute('gradientUnits') ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            this.gradient.element.getAttribute('gradientUnits').toLowerCase() === 'objectboundingbox') {
            const bBox = forNode.getBoundingBox(context);
            gradientUnitsMatrix = context.pdf.Matrix(bBox[2], 0, 0, bBox[3], bBox[0], bBox[1]);
        }
        else {
            gradientUnitsMatrix = context.pdf.unitMatrix;
        }
        // matrix that is applied to the gradient before any other transformations
        const gradientTransform = parseTransform(getAttribute(this.gradient.element, context.styleSheets, 'gradientTransform', 'transform'), context);
        return {
            key: this.key,
            matrix: context.pdf.matrixMult(gradientTransform, gradientUnitsMatrix)
        };
    }
}
//# sourceMappingURL=GradientFill.js.map