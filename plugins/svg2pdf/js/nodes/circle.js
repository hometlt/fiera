var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { getAttribute } from '../utils/node.js';
import { EllipseBase } from './ellipsebase.js';
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(node, children) {
        return _super.call(this, node, children) || this;
    }
    Circle.prototype.getR = function (context) {
        var _a;
        return ((_a = this.r) !== null && _a !== void 0 ? _a : (this.r = parseFloat(getAttribute(this.element, context.styleSheets, 'r') || '0')));
    };
    Circle.prototype.getRx = function (context) {
        return this.getR(context);
    };
    Circle.prototype.getRy = function (context) {
        return this.getR(context);
    };
    return Circle;
}(EllipseBase));
export { Circle };
//# sourceMappingURL=circle.js.map