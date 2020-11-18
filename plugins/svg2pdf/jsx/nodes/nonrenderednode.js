import { SvgNode } from './svgnode.js';
export class NonRenderedNode extends SvgNode {
    render(parentContext) {
        return Promise.resolve();
    }
    getBoundingBoxCore(context) {
        return [];
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
}
