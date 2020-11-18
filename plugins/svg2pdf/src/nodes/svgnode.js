import { getAttribute } from '../utils/node';
import { parseTransform } from '../utils/transform';
var SvgNode = /** @class */ (function () {
    function SvgNode(element, children) {
        this.element = element;
        this.children = children;
    }
    SvgNode.prototype.getBoundingBox = function (context) {
        if (getAttribute(this.element, context.styleSheets, 'display') === 'none') {
            return [0, 0, 0, 0];
        }
        return this.getBoundingBoxCore(context);
    };
    SvgNode.prototype.computeNodeTransform = function (context) {
        var nodeTransform = this.computeNodeTransformCore(context);
        var transformString = getAttribute(this.element, context.styleSheets, 'transform');
        if (!transformString)
            return nodeTransform;
        else
            return context.pdf.matrixMult(nodeTransform, parseTransform(transformString, context));
    };
    return SvgNode;
}());
export { SvgNode };
//# sourceMappingURL=svgnode.js.map