import { applyAttributes, parseAttributes } from '../applyparseattributes.js';
import { getAttribute } from '../utils/node.js';
import { SvgNode } from './svgnode.js';
import { applyClipPath, getClipPathNode } from '../utils/applyclippath.js';
export class RenderedNode extends SvgNode {
    async render(parentContext) {
        if (!this.isVisible(parentContext.attributeState.visibility !== 'hidden', parentContext)) {
            return;
        }
        const context = parentContext.clone();
        context.transform = context.pdf.matrixMult(this.computeNodeTransform(context), parentContext.transform);
        parseAttributes(context, this);
        const hasClipPath = this.element.hasAttribute('clip-path') &&
            getAttribute(this.element, context.styleSheets, 'clip-path') !== 'none';
        if (hasClipPath) {
            const clipNode = getClipPathNode(this, context);
            if (clipNode && clipNode.isVisible(true, context)) {
                context.pdf.saveGraphicsState();
                await applyClipPath(this, clipNode, context);
            }
            else {
                return;
            }
        }
        if (!context.withinClipPath) {
            context.pdf.saveGraphicsState();
        }
        applyAttributes(context, parentContext, this.element);
        await this.renderCore(context);
        if (!context.withinClipPath) {
            context.pdf.restoreGraphicsState();
        }
        if (hasClipPath) {
            context.pdf.restoreGraphicsState();
        }
    }
}
