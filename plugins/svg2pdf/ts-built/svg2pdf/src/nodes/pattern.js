import { Context } from '../context/context';
import { defaultBoundingBox } from '../utils/bbox';
import { NonRenderedNode } from './nonrenderednode';
import { svgNodeAndChildrenVisible } from '../utils/node';
import { TilingPattern } from 'jspdf';
export class Pattern extends NonRenderedNode {
    async apply(context) {
        const id = this.element.getAttribute('id');
        if (!id) {
            return;
        }
        // the transformations directly at the node are written to the pattern transformation matrix
        const bBox = this.getBoundingBox(context);
        const pattern = new TilingPattern([bBox[0], bBox[1], bBox[0] + bBox[2], bBox[1] + bBox[3]], bBox[2], bBox[3]);
        context.pdf.beginTilingPattern(pattern);
        // continue without transformation
        for (const child of this.children) {
            await child.render(new Context(context.pdf, {
                attributeState: context.attributeState,
                refsHandler: context.refsHandler,
                styleSheets: context.styleSheets,
                viewport: context.viewport,
                svg2pdfParameters: context.svg2pdfParameters
            }));
        }
        context.pdf.endTilingPattern(id, pattern);
    }
    getBoundingBoxCore(context) {
        return defaultBoundingBox(this.element, context);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    isVisible(parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    }
}
//# sourceMappingURL=pattern.js.map