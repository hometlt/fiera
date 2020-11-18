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
import { Gradient } from './gradient';
var LinearGradient = /** @class */ (function (_super) {
    __extends(LinearGradient, _super);
    function LinearGradient(element, children) {
        return _super.call(this, 'axial', element, children) || this;
    }
    LinearGradient.prototype.getCoordinates = function () {
        return [
            parseFloat(this.element.getAttribute('x1') || '0'),
            parseFloat(this.element.getAttribute('y1') || '0'),
            parseFloat(this.element.getAttribute('x2') || '1'),
            parseFloat(this.element.getAttribute('y2') || '0')
        ];
    };
    return LinearGradient;
}(Gradient));
export { LinearGradient };
//# sourceMappingURL=lineargradient.js.map