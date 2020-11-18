import { Context } from '../context/context.js';
import { parseFloats } from '../utils/parsing.js';
import { computeViewBoxTransform } from '../utils/transform.js';
import { NonRenderedNode } from './nonrenderednode.js';
import { svgNodeAndChildrenVisible } from '../utils/node.js';
export class MarkerNode extends NonRenderedNode {
    async apply(parentContext) {
        // the transformations directly at the node are written to the pdf form object transformation matrix
        const tfMatrix = this.computeNodeTransform(parentContext);
        const bBox = this.getBoundingBox(parentContext);
        parentContext.pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], tfMatrix);
        for (const child of this.children) {
            await child.render(new Context(parentContext.pdf, {
                refsHandler: parentContext.refsHandler,
                styleSheets: parentContext.styleSheets,
                viewport: parentContext.viewport,
                svg2pdfParameters: parentContext.svg2pdfParameters
            }));
        }
        parentContext.pdf.endFormObject(this.element.getAttribute('id'));
    }
    getBoundingBoxCore(context) {
        const viewBox = this.element.getAttribute('viewBox');
        let vb;
        if (viewBox) {
            vb = parseFloats(viewBox);
        }
        return [
            (vb && vb[0]) || 0,
            (vb && vb[1]) || 0,
            (vb && vb[2]) || parseFloat(this.element.getAttribute('marker-width') || '0'),
            (vb && vb[3]) || parseFloat(this.element.getAttribute('marker-height') || '0')
        ];
    }
    computeNodeTransformCore(context) {
        const refX = parseFloat(this.element.getAttribute('refX') || '0');
        const refY = parseFloat(this.element.getAttribute('refY') || '0');
        const viewBox = this.element.getAttribute('viewBox');
        let nodeTransform;
        if (viewBox) {
            const bounds = parseFloats(viewBox);
            // "Markers are drawn such that their reference point (i.e., attributes ‘refX’ and ‘refY’)
            // is positioned at the given vertex." - The "translate" part of the viewBox transform is
            // ignored.
            nodeTransform = computeViewBoxTransform(this.element, bounds, 0, 0, parseFloat(this.element.getAttribute('markerWidth') || '3'), parseFloat(this.element.getAttribute('markerHeight') || '3'), context, true);
            nodeTransform = context.pdf.matrixMult(context.pdf.Matrix(1, 0, 0, 1, -refX, -refY), nodeTransform);
        }
        else {
            nodeTransform = context.pdf.Matrix(1, 0, 0, 1, -refX, -refY);
        }
        return nodeTransform;
    }
    isVisible(parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    }
}
