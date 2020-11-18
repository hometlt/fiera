import { Context } from '../context/context.js';
import { defaultBoundingBox } from '../utils/bbox.js';
import { getAttribute, nodeIs, svgNodeIsVisible } from '../utils/node.js';
import { GraphicsNode } from './graphicsnode.js';
import { computeViewBoxTransform } from '../utils/transform.js';
import { parseFloats } from '../utils/parsing.js';
import { Symbol } from './symbol.js';
import { Viewport } from '../context/viewport.js';
/**
 * Draws the element referenced by a use node, makes use of pdf's XObjects/FormObjects so nodes are only written once
 * to the pdf document. This highly reduces the file size and computation time.
 */
export class Use extends GraphicsNode {
    async renderCore(context) {
        const pf = parseFloat;
        const url = this.element.getAttribute('href') || this.element.getAttribute('xlink:href');
        // just in case someone has the idea to use empty use-tags, wtf???
        if (!url)
            return;
        // get the size of the referenced form object (to apply the correct scaling)
        const id = url.substring(1);
        const refNode = context.refsHandler.get(id);
        const refNodeOpensViewport = nodeIs(refNode.element, 'symbol,svg') && refNode.element.hasAttribute('viewBox');
        // scale and position it right
        let x = pf(getAttribute(this.element, context.styleSheets, 'x') || '0');
        let y = pf(getAttribute(this.element, context.styleSheets, 'y') || '0');
        //  calculate the transformation matrix
        let width = undefined;
        let height = undefined;
        let t;
        if (refNodeOpensViewport) {
            //  <use> inherits width/height only to svg/symbol
            // if there is no viewBox attribute, width/height don't have an effect
            // in theory, the default value for width/height is 100%, but we currently don't support this
            width = pf(getAttribute(this.element, context.styleSheets, 'width') ||
                getAttribute(refNode.element, context.styleSheets, 'width') ||
                '0');
            height = pf(getAttribute(this.element, context.styleSheets, 'height') ||
                getAttribute(refNode.element, context.styleSheets, 'height') ||
                '0');
            //  accumulate x/y to calculate the viewBox transform
            x += pf(getAttribute(refNode.element, context.styleSheets, 'x') || '0');
            y += pf(getAttribute(refNode.element, context.styleSheets, 'y') || '0');
            const viewBox = parseFloats(refNode.element.getAttribute('viewBox'));
            t = computeViewBoxTransform(refNode.element, viewBox, x, y, width, height, context);
        }
        else {
            t = context.pdf.Matrix(1, 0, 0, 1, x, y);
        }
        const refContext = new Context(context.pdf, {
            refsHandler: context.refsHandler,
            styleSheets: context.styleSheets,
            withinUse: true,
            viewport: refNodeOpensViewport ? new Viewport(width, height) : context.viewport,
            svg2pdfParameters: context.svg2pdfParameters
        });
        await context.refsHandler.getRendered(id, node => Use.renderReferencedNode(node, refContext));
        context.pdf.saveGraphicsState();
        context.pdf.setCurrentTransformationMatrix(context.transform);
        //  apply the bbox (i.e. clip) if needed
        if (refNodeOpensViewport &&
            getAttribute(refNode.element, context.styleSheets, 'overflow') !== 'visible') {
            context.pdf.rect(x, y, width, height);
            context.pdf.clip().discardPath();
        }
        context.pdf.doFormObject(id, t);
        context.pdf.restoreGraphicsState();
    }
    static async renderReferencedNode(node, refContext) {
        let bBox = node.getBoundingBox(refContext);
        // The content of a PDF form object is implicitly clipped at its /BBox property.
        // SVG, however, applies its clip rect at the <use> attribute, which may modify it.
        // So, make the bBox a lot larger than it needs to be and hope any thick strokes are
        // still within.
        bBox = [bBox[0] - 0.5 * bBox[2], bBox[1] - 0.5 * bBox[3], bBox[2] * 2, bBox[3] * 2];
        refContext.pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], refContext.pdf.unitMatrix);
        if (node instanceof Symbol) {
            await node.apply(refContext);
        }
        else {
            await node.render(refContext);
        }
        refContext.pdf.endFormObject(node.element.getAttribute('id'));
    }
    getBoundingBoxCore(context) {
        return defaultBoundingBox(this.element, context);
    }
    isVisible(parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
}
