import { Path } from '../utils/path.js';
import { svgNodeIsVisible } from '../utils/node.js';
import { GeometryNode } from './geometrynode.js';
import { parseFloats } from '../utils/parsing.js';
export class Traverse extends GeometryNode {
    constructor(closed, node, children) {
        super(true, node, children);
        this.closed = closed;
    }
    getPath(context) {
        if (!this.element.hasAttribute('points') || this.element.getAttribute('points') === '') {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const points = Traverse.parsePointsString(this.element.getAttribute('points'));
        const path = new Path();
        if (points.length < 1) {
            return path;
        }
        path.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            path.lineTo(points[i][0], points[i][1]);
        }
        if (this.closed) {
            path.close();
        }
        return path;
    }
    isVisible(parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    }
    computeNodeTransformCore(context) {
        return context.pdf.unitMatrix;
    }
    static parsePointsString(string) {
        const floats = parseFloats(string);
        const result = [];
        for (let i = 0; i < floats.length - 1; i += 2) {
            const x = floats[i];
            const y = floats[i + 1];
            result.push([x, y]);
        }
        return result;
    }
}
