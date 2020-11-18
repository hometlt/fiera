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
import { SvgNode } from './svgnode.js';
import { svgNodeIsVisible } from '../utils/node.js';
var VoidNode = /** @class */ (function (_super) {
    __extends(VoidNode, _super);
    function VoidNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VoidNode.prototype.render = function (parentContext) {
        return Promise.resolve();
    };
    VoidNode.prototype.getBoundingBoxCore = function (context) {
        return [0, 0, 0, 0];
    };
    VoidNode.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    VoidNode.prototype.isVisible = function (parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    };
    return VoidNode;
}(SvgNode));
export { VoidNode };
//# sourceMappingURL=void.js.map