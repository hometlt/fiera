import { getAttribute } from '../utils/node.js';
import { EllipseBase } from './ellipsebase.js';
export class Circle extends EllipseBase {
    constructor(node, children) {
        super(node, children);
    }
    getR(context) {
        return (this.r ?? (this.r = parseFloat(getAttribute(this.element, context.styleSheets, 'r') || '0')));
    }
    getRx(context) {
        return this.getR(context);
    }
    getRy(context) {
        return this.getR(context);
    }
}
