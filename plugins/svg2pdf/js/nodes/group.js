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
import { ContainerNode } from './containernode.js';
import { svgNodeAndChildrenVisible } from '../utils/node.js';
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Group.prototype.isVisible = function (parentVisible, context) {
        return svgNodeAndChildrenVisible(this, parentVisible, context);
    };
    Group.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    return Group;
}(ContainerNode));
export { Group };
//# sourceMappingURL=group.js.map