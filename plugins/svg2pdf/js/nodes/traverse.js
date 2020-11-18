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
import { svgNodeIsVisible } from '../utils/node.js';
import { GeometryNode } from './geometrynode.js';
import { parseFloats } from '../utils/parsing.js';
var Traverse = /** @class */ (function (_super) {
    __extends(Traverse, _super);
    function Traverse(closed, node, children) {
        var _this = _super.call(this, true, node, children) || this;
        _this.closed = closed;
        return _this;
    }
    Traverse.prototype.getPath = function (context) {
        if (!this.element.hasAttribute('points') || this.element.getAttribute('points') === '') {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        var points = Traverse.parsePointsString(this.element.getAttribute('points'));
        var path = new Path();
        if (points.length < 1) {
            return path;
        }
        path.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            path.lineTo(points[i][0], points[i][1]);
        }
        if (this.closed) {
            path.close();
        }
        return path;
    };
    Traverse.prototype.isVisible = function (parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    };
    Traverse.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    Traverse.parsePointsString = function (string) {
        var floats = parseFloats(string);
        var result = [];
        for (var i = 0; i < floats.length - 1; i += 2) {
            var x = floats[i];
            var y = floats[i + 1];
            result.push([x, y]);
        }
        return result;
    };
    return Traverse;
}(GeometryNode));
export { Traverse };
//# sourceMappingURL=traverse.js.map