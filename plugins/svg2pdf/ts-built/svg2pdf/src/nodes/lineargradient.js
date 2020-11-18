import { Gradient } from './gradient';
export class LinearGradient extends Gradient {
    constructor(element, children) {
        super('axial', element, children);
    }
    getCoordinates() {
        return [
            parseFloat(this.element.getAttribute('x1') || '0'),
            parseFloat(this.element.getAttribute('y1') || '0'),
            parseFloat(this.element.getAttribute('x2') || '1'),
            parseFloat(this.element.getAttribute('y2') || '0')
        ];
    }
}
//# sourceMappingURL=lineargradient.js.map