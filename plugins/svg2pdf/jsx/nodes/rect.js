import { Path } from '../utils/path.js';
import { getAttribute, svgNodeIsVisible } from '../utils/node.js';
import { GeometryNode } from './geometrynode.js';
export class Rect extends GeometryNode {
    constructor(element, children) {
        super(false, element, children);
    }
    getPath(context) {
        const w = parseFloat(getAttribute(this.element, context.styleSheets, 'width') || '0');
        const h = parseFloat(getAttribute(this.element, context.styleSheets, 'height') || '0');
        if (!isFinite(w) || w <= 0 || !isFinite(h) || h <= 0) {
            return null;
        }
        const rxAttr = getAttribute(this.element, context.styleSheets, 'rx');
        const ryAttr = getAttribute(this.element, context.styleSheets, 'ry');
        const rx = Math.min(parseFloat(rxAttr || ryAttr || '0'), w * 0.5);
        const ry = Math.min(parseFloat(ryAttr || rxAttr || '0'), h * 0.5);
        let x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0');
        let y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
        const arc = (4 / 3) * (Math.SQRT2 - 1);
        if (rx === 0 && ry === 0) {
            return new Path()
                .moveTo(x, y)
                .lineTo(x + w, y)
                .lineTo(x + w, y + h)
                .lineTo(x, y + h)
                .close();
        }
        else {
            return new Path()
                .moveTo((x += rx), y)
                .lineTo((x += w - 2 * rx), y)
                .curveTo(x + rx * arc, y, x + rx, y + (ry - ry * arc), (x += rx), (y += ry))
                .lineTo(x, (y += h - 2 * ry))
                .curveTo(x, y + ry * arc, x - rx * arc, y + ry, (x -= rx), (y += ry))
                .lineTo((x += -w + 2 * rx), y)
                .curveTo(x - rx * arc, y, x - rx, y - ry * arc, (x -= rx), (y -= ry))
                .lineTo(x, (y += -h + 2 * ry))
                .curveTo(x, y - ry * arc, x + rx * arc, y - ry, (x += rx), (y -= ry))
                .close();
        }
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    isVisible(parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    }
}
