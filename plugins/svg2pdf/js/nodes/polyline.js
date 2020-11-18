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
import { Traverse } from './traverse.js';
var Polyline = /** @class */ (function (_super) {
    __extends(Polyline, _super);
    function Polyline(node, children) {
        return _super.call(this, false, node, children) || this;
    }
    return Polyline;
}(Traverse));
export { Polyline };
//# sourceMappingURL=polyline.js.map