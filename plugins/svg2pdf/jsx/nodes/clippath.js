import { Context } from '../context/context.js';
import { NonRenderedNode } from './nonrenderednode.js';
import { getBoundingBoxByChildren } from '../utils/bbox.js';
import { svgNodeAndChildrenVisible } from '../utils/node.js';
export class ClipPath extends NonRenderedNode {
    async apply(context) {
        if (!this.isVisible(true, context)) {
            return;
        }
        // here, browsers show different results for a "transform" attribute on the clipPath element itself:
        // IE/Edge considers it, Chrome and Firefox ignore it. However, the specification lists "transform" as a valid
        // attribute for clipPath elements, although not explicitly explaining its behavior. This implementation follows
        // IE/Edge and considers the "transform" attribute as additional transformation within the coordinate system
        // established by the "clipPathUnits" attribute.
        const clipPathMatrix = context.pdf.matrixMult(this.computeNodeTransform(context), context.transform);
        context.pdf.setCurrentTransformationMatrix(clipPathMatrix);
        for (const child of this.children) {
            await child.render(new Context(context.pdf, {
                refsHandler: context.refsHandler,
                styleSheets: context.styleSheets,
                viewport: context.viewport,
                withinClipPath: true,
                svg2pdfParameters: context.svg2pdfParameters
            }));
        }
        context.pdf.clip().discardPath();
        // as we cannot use restoreGraphicsState() to reset the transform (this would reset the clipping path, as well),
        // we must append the inverse instead
        context.pdf.setCurrentTransformationMatrix(clipPathMatrix.inversed());
    }
    getBoundingBoxCore(context) {
        return getBoundingBoxByChildren(context, this);
    }
    isVisible(parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    }
}
