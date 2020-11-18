import { getAttribute } from '../utils/node';
import { parseTransform } from '../utils/transform';
export class SvgNode {
    constructor(element, children) {
        this.element = element;
        this.children = children;
    }
    getBoundingBox(context) {
        if (getAttribute(this.element, context.styleSheets, 'display') === 'none') {
            return [0, 0, 0, 0];
        }
        return this.getBoundingBoxCore(context);
    }
    computeNodeTransform(context) {
        const nodeTransform = this.computeNodeTransformCore(context);
        const transformString = getAttribute(this.element, context.styleSheets, 'transform');
        if (!transformString)
            return nodeTransform;
        else
            return context.pdf.matrixMult(nodeTransform, parseTransform(transformString, context));
    }
}
//# sourceMappingURL=svgnode.js.map