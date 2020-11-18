import { SvgNode } from './svgnode';
import { svgNodeIsVisible } from '../utils/node';
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
//# sourceMappingURL=void.js.map