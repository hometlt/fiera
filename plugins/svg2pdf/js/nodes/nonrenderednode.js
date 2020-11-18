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
var NonRenderedNode = /** @class */ (function (_super) {
    __extends(NonRenderedNode, _super);
    function NonRenderedNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonRenderedNode.prototype.render = function (parentContext) {
        return Promise.resolve();
    };
    NonRenderedNode.prototype.getBoundingBoxCore = function (context) {
        return [];
    };
    NonRenderedNode.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    return NonRenderedNode;
}(SvgNode));
export { NonRenderedNode };
//# sourceMappingURL=nonrenderednode.js.map