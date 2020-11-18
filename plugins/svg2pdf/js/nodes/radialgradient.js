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
import { Gradient } from './gradient.js';
var RadialGradient = /** @class */ (function (_super) {
    __extends(RadialGradient, _super);
    function RadialGradient(element, children) {
        return _super.call(this, 'radial', element, children) || this;
    }
    RadialGradient.prototype.getCoordinates = function () {
        var cx = this.element.getAttribute('cx');
        var cy = this.element.getAttribute('cy');
        var fx = this.element.getAttribute('fx');
        var fy = this.element.getAttribute('fy');
        return [
            parseFloat(fx || cx || '0.5'),
            parseFloat(fy || cy || '0.5'),
            0,
            parseFloat(cx || '0.5'),
            parseFloat(cy || '0.5'),
            parseFloat(this.element.getAttribute('r') || '0.5')
        ];
    };
    return RadialGradient;
}(Gradient));
export { RadialGradient };
//# sourceMappingURL=radialgradient.js.map