import { RenderedNode } from './renderednode';
import { getBoundingBoxByChildren } from '../utils/bbox';
export class ContainerNode extends RenderedNode {
    async renderCore(context) {
        for (const child of this.children) {
            await child.render(context);
        }
    }
    getBoundingBoxCore(context) {
        return getBoundingBoxByChildren(context, this);
    }
}
//# sourceMappingURL=containernode.js.map