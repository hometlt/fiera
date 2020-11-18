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
import { Path } from '../utils/path.js';
import { getAttribute, svgNodeIsVisible } from '../utils/node.js';
import { GeometryNode } from './geometrynode.js';
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(element, children) {
        return _super.call(this, false, element, children) || this;
    }
    Rect.prototype.getPath = function (context) {
        var w = parseFloat(getAttribute(this.element, context.styleSheets, 'width') || '0');
        var h = parseFloat(getAttribute(this.element, context.styleSheets, 'height') || '0');
        if (!isFinite(w) || w <= 0 || !isFinite(h) || h <= 0) {
            return null;
        }
        var rxAttr = getAttribute(this.element, context.styleSheets, 'rx');
        var ryAttr = getAttribute(this.element, context.styleSheets, 'ry');
        var rx = Math.min(parseFloat(rxAttr || ryAttr || '0'), w * 0.5);
        var ry = Math.min(parseFloat(ryAttr || rxAttr || '0'), h * 0.5);
        var x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0');
        var y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
        var arc = (4 / 3) * (Math.SQRT2 - 1);
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
    };
    Rect.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    Rect.prototype.isVisible = function (parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    };
    return Rect;
}(GeometryNode));
export { Rect };
//# sourceMappingURL=rect.js.map