import {getElementSvgSrc} from "./svg.js";


Object.assign(fabric.Pattern.prototype,{
    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of a pattern
     * @param {fabric.Object} object
     * @return {String} SVG representation of a pattern
     */
    toSVG: function(object) {
        let patternSource = typeof this.source === 'function' ? this.source() : this.source,
            patternWidth = patternSource.width / object.width,
            patternHeight = patternSource.height / object.height,
            patternOffsetX = this.offsetX / object.width,
            patternOffsetY = this.offsetY / object.height,
            patternImgSrc = '';
        if (this.repeat === 'repeat-x' || this.repeat === 'no-repeat') {
            patternHeight = 1;
            if (patternOffsetY) {
                patternHeight += Math.abs(patternOffsetY);
            }
        }
        if (this.repeat === 'repeat-y' || this.repeat === 'no-repeat') {
            patternWidth = 1;
            if (patternOffsetX) {
                patternWidth += Math.abs(patternOffsetX);
            }

        }

        patternImgSrc = getElementSvgSrc(patternSource);

        return '<pattern id="SVGID_' + this.id +
            '" x="' + patternOffsetX +
            '" y="' + patternOffsetY +
            '" width="' + patternWidth +
            '" height="' + patternHeight + '">\n' +
            '<image x="0" y="0"' +
            ' width="' + patternSource.width +
            '" height="' + patternSource.height +
            '" xlink:href="' + patternImgSrc +
            '"></image>\n' +
            '</pattern>\n';
    }
});