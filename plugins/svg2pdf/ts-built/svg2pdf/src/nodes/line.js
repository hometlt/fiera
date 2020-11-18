import { Path } from '../utils/path';
import { svgNodeIsVisible } from '../utils/node';
import { GeometryNode } from './geometrynode';
export class Line extends GeometryNode {
    constructor(node, children) {
        super(true, node, children);
    }
    getPath(context) {
        if (context.withinClipPath || context.attributeState.stroke === null) {
            return null;
        }
        const x1 = parseFloat(this.element.getAttribute('x1') || '0'), y1 = parseFloat(this.element.getAttribute('y1') || '0');
        const x2 = parseFloat(this.element.getAttribute('x2') || '0'), y2 = parseFloat(this.element.getAttribute('y2') || '0');
        if (!(x1 || x2 || y1 || y2)) {
            return null;
        }
        return new Path().moveTo(x1, y1).lineTo(x2, y2);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    isVisible(parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    }
    async fillOrStroke(context) {
        context.attributeState.fill = null;
        await super.fillOrStroke(context);
    }
}
//# sourceMappingURL=line.js.map