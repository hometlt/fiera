import { ContainerNode } from './containernode';
import { svgNodeAndChildrenVisible } from '../utils/node';
export class Group extends ContainerNode {
    isVisible(parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
}
//# sourceMappingURL=group.js.map