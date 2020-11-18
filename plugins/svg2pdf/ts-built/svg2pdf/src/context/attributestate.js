import { RGBColor } from '../utils/rgbcolor';
import { ColorFill } from '../fill/ColorFill';
export class AttributeState {
    constructor() {
        this.xmlSpace = '';
        this.fill = null;
        this.fillOpacity = 1.0;
        // public fillRule: string = null
        this.fontFamily = '';
        this.fontSize = 16;
        this.fontStyle = '';
        // public fontVariant: string
        this.fontWeight = '';
        this.opacity = 1.0;
        this.stroke = null;
        this.strokeDasharray = null;
        this.strokeDashoffset = 0;
        this.strokeLinecap = '';
        this.strokeLinejoin = '';
        this.strokeMiterlimit = 4.0;
        this.strokeOpacity = 1.0;
        this.strokeWidth = 1.0;
        // public textAlign: string
        this.alignmentBaseline = '';
        this.textAnchor = '';
        this.visibility = '';
    }
    clone() {
        const clone = new AttributeState();
        clone.xmlSpace = this.xmlSpace;
        clone.fill = this.fill;
        clone.fillOpacity = this.fillOpacity;
        // clone.fillRule = this.fillRule;
        clone.fontFamily = this.fontFamily;
        clone.fontSize = this.fontSize;
        clone.fontStyle = this.fontStyle;
        // clone.fontVariant = this.fontVariant;
        clone.fontWeight = this.fontWeight;
        clone.opacity = this.opacity;
        clone.stroke = this.stroke;
        clone.strokeDasharray = this.strokeDasharray;
        clone.strokeDashoffset = this.strokeDashoffset;
        clone.strokeLinecap = this.strokeLinecap;
        clone.strokeLinejoin = this.strokeLinejoin;
        clone.strokeMiterlimit = this.strokeMiterlimit;
        clone.strokeOpacity = this.strokeOpacity;
        clone.strokeWidth = this.strokeWidth;
        // clone.textAlign = this.textAlign;
        clone.textAnchor = this.textAnchor;
        clone.alignmentBaseline = this.alignmentBaseline;
        clone.visibility = this.visibility;
        return clone;
    }
    static default() {
        const attributeState = new AttributeState();
        attributeState.xmlSpace = 'default';
        attributeState.fill = new ColorFill(new RGBColor('rgb(0, 0, 0)'));
        attributeState.fillOpacity = 1.0;
        // attributeState.fillRule = "nonzero";
        attributeState.fontFamily = 'times';
        attributeState.fontSize = 16;
        attributeState.fontStyle = 'normal';
        // attributeState.fontVariant = "normal";
        attributeState.fontWeight = 'normal';
        attributeState.opacity = 1.0;
        attributeState.stroke = null;
        attributeState.strokeDasharray = null;
        attributeState.strokeDashoffset = 0;
        attributeState.strokeLinecap = 'butt';
        attributeState.strokeLinejoin = 'miter';
        attributeState.strokeMiterlimit = 4.0;
        attributeState.strokeOpacity = 1.0;
        attributeState.strokeWidth = 1.0;
        // attributeState.textAlign = "start";
        attributeState.alignmentBaseline = 'baseline';
        attributeState.textAnchor = 'start';
        attributeState.visibility = 'visible';
        return attributeState;
    }
}
//# sourceMappingURL=attributestate.js.map