import { getAttribute } from '../utils/node';
import { EllipseBase } from './ellipsebase';
export class Ellipse extends EllipseBase {
    constructor(element, children) {
        super(element, children);
    }
    getRx(context) {
        return parseFloat(getAttribute(this.element, context.styleSheets, 'rx') || '0');
    }
    getRy(context) {
        return parseFloat(getAttribute(this.element, context.styleSheets, 'ry') || '0');
    }
}
//# sourceMappingURL=ellipse.js.map