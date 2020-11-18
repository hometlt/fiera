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
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(element, children) {
        return _super.call(this, element, children) || this;
    }
    Ellipse.prototype.getRx = function (context) {
        return parseFloat(getAttribute(this.element, context.styleSheets, 'rx') || '0');
    };
    Ellipse.prototype.getRy = function (context) {
        return parseFloat(getAttribute(this.element, context.styleSheets, 'ry') || '0');
    };
    return Ellipse;
}(EllipseBase));
export { Ellipse };
//# sourceMappingURL=ellipse.js.map