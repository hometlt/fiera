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
import { Path } from '../utils/path';
import { getAttribute, svgNodeIsVisible } from '../utils/node';
import { GeometryNode } from './geometrynode';
import SvgPath from 'svgpath';
import { toCubic } from '../utils/geometry';
var PathNode = /** @class */ (function (_super) {
    __extends(PathNode, _super);
    function PathNode(node, children) {
        return _super.call(this, true, node, children) || this;
    }
    PathNode.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    PathNode.prototype.isVisible = function (parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    };
    PathNode.prototype.getPath = function (context) {
        var svgPath = new SvgPath(getAttribute(this.element, context.styleSheets, 'd') || '')
            .unshort()
            .unarc()
            .abs();
        var path = new Path();
        var prevX;
        var prevY;
        svgPath.iterate(function (seg, i) {
            var type = seg[0];
            switch (type) {
                case 'M':
                    path.moveTo(seg[1], seg[2]);
                    break;
                case 'L':
                    path.lineTo(seg[1], seg[2]);
                    break;
                case 'H':
                    path.lineTo(seg[1], prevY);
                    break;
                case 'V':
                    path.lineTo(prevX, seg[1]);
                    break;
                case 'C':
                    path.curveTo(seg[1], seg[2], seg[3], seg[4], seg[5], seg[6]);
                    break;
                case 'Q':
                    var p2 = toCubic([prevX, prevY], [seg[1], seg[2]]);
                    var p3 = toCubic([seg[3], seg[4]], [seg[1], seg[2]]);
                    path.curveTo(p2[0], p2[1], p3[0], p3[1], seg[3], seg[4]);
                    break;
                case 'Z':
                    path.close();
                    break;
            }
            switch (type) {
                case 'M':
                case 'L':
                    prevX = seg[1];
                    prevY = seg[2];
                    break;
                case 'H':
                    prevX = seg[1];
                    break;
                case 'V':
                    prevY = seg[1];
                    break;
                case 'C':
                    prevX = seg[5];
                    prevY = seg[6];
                    break;
                case 'Q':
                    prevX = seg[3];
                    prevY = seg[4];
                    break;
            }
        });
        return path;
    };
    return PathNode;
}(GeometryNode));
export { PathNode };
//# sourceMappingURL=path.js.map