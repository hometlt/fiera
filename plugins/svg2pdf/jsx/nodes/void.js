import { SvgNode } from './svgnode.js';
import { svgNodeIsVisible } from '../utils/node.js';
export class VoidNode extends SvgNode {
    render(parentContext) {
        return Promise.resolve();
    }
    getBoundingBoxCore(context) {
        return [0, 0, 0, 0];
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    isVisible(parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    }
}
