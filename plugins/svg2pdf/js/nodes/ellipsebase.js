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
import { GeometryNode } from './geometrynode.js';
import { getAttribute, svgNodeIsVisible } from '../utils/node.js';
import { Path } from '../utils/path.js';
var EllipseBase = /** @class */ (function (_super) {
    __extends(EllipseBase, _super);
    function EllipseBase(element, children) {
        return _super.call(this, false, element, children) || this;
    }
    EllipseBase.prototype.getPath = function (context) {
        var rx = this.getRx(context);
        var ry = this.getRy(context);
        if (!isFinite(rx) || ry <= 0 || !isFinite(ry) || ry <= 0) {
            return null;
        }
        var x = parseFloat(getAttribute(this.element, context.styleSheets, 'cx') || '0'), y = parseFloat(getAttribute(this.element, context.styleSheets, 'cy') || '0');
        var lx = (4 / 3) * (Math.SQRT2 - 1) * rx, ly = (4 / 3) * (Math.SQRT2 - 1) * ry;
        return new Path()
            .moveTo(x + rx, y)
            .curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry)
            .curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y)
            .curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry)
            .curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);
    };
    EllipseBase.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    EllipseBase.prototype.isVisible = function (parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    };
    return EllipseBase;
}(GeometryNode));
export { EllipseBase };
//# sourceMappingURL=ellipsebase.js.map