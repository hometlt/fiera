import { ContainerNode } from './containernode.js';
import { svgNodeAndChildrenVisible } from '../utils/node.js';
export class Group extends ContainerNode {
    isVisible(parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
}
