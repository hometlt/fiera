import { SvgNode } from './svgnode';
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
//# sourceMappingURL=nonrenderednode.js.map