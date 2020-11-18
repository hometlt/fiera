import { GeometryNode } from './geometrynode.js';
import { getAttribute, svgNodeIsVisible } from '../utils/node.js';
import { Path } from '../utils/path.js';
export class EllipseBase extends GeometryNode {
    constructor(element, children) {
        super(false, element, children);
    }
    getPath(context) {
        const rx = this.getRx(context);
        const ry = this.getRy(context);
        if (!isFinite(rx) || ry <= 0 || !isFinite(ry) || ry <= 0) {
            return null;
        }
        const x = parseFloat(getAttribute(this.element, context.styleSheets, 'cx') || '0'), y = parseFloat(getAttribute(this.element, context.styleSheets, 'cy') || '0');
        const lx = (4 / 3) * (Math.SQRT2 - 1) * rx, ly = (4 / 3) * (Math.SQRT2 - 1) * ry;
        return new Path()
            .moveTo(x + rx, y)
            .curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry)
            .curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y)
            .curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry)
            .curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    isVisible(parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    }
}
