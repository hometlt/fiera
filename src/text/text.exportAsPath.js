// import opentype from "opentype.js"
// import Typr from "../../../plugins/typr/src/typr.js";
import opentype from "../../plugins/opentype.js";


//copy from fabric.js
function getSvgColorString(prop, value) {
  if (!value) {
    return prop + ': none; ';
  }
  else if (value.toLive) {
    return prop + ': url(#SVGID_' + value.id + '); ';
  }
  else {
    let color = new fabric.Color(value),
      str = prop + ': ' + color.toRgb() + '; ',
      opacity = color.getAlpha();
    if (opacity !== 1) {
      //change the color in rgb + opacity
      str += prop + '-opacity: ' + opacity.toString() + '; ';
    }
    return str;
  }
}

fabric.util.object.extend(fabric.Text.prototype, {
  exportAsPath: false,
  _wrapSVGTextAndBgAsText: fabric.Text.prototype._wrapSVGTextAndBg,
  _wrapSVGTextAndBgAsPath:  function(textAndBg) {
    let noShadow = true;
    return [
      textAndBg.textBgRects.join(''),
      '\t\t<g style="', this.getSvgStyles(noShadow), '"', this.addPaintOrder(), ' >',
        textAndBg.textSpans.join(''),
      '</g>\n'
    ];
  },
  /**
   * @private
   */
  _wrapSVGTextAndBg: function (textAndBg) {
    if(this.exportAsPath){
      return this._wrapSVGTextAndBgAsPath(textAndBg);
    }else{
      return this._wrapSVGTextAndBgAsText(textAndBg)
    }
  },
  _replaceSpecialCharacter: function (text) {
    text = text.replace('&lt;', '<');
    text = text.replace('&gt;', '>');
    text = text.replace('&amp;', '&');
    text = text.replace('&quot;', '"');
    text = text.replace("&apos;", "'");
    return text;
  },
  _createTextCharSpanAsText: fabric.Text.prototype._createTextCharSpan,
  _createTextCharSpanAsPath: function (_char, styleDecl, left, top) {
    let style = fabric.util.object.clone(styleDecl);

    let _x = fabric.util.toFixed(left, fabric.Object.NUM_FRACTION_DIGITS);
    let _y = fabric.util.toFixed(top, fabric.Object.NUM_FRACTION_DIGITS);
    let text = this._replaceSpecialCharacter(fabric.util.string.escapeXml(_char));

    let pathData, svgPath = '';

    if (!style.fontFamily)   style.fontFamily = this.fontFamily;
    if (!style.fontSize)     style.fontSize = this.fontSize;
    if (!style.fontStyle)    style.fontStyle = this.fontStyle;
    if (!style.fontWeight)   style.fontWeight = this.fontWeight;
    if (!style.fill)         style.fill = this.fill;
    if (!style.stroke)       style.stroke = this.stroke;
    if (!style.strokeWidth)  style.strokeWidth = this.strokeWidth;


    let fontVariation = fabric.fonts.getFontVariation(style.fontFamily, style.fontWeight, style.fontStyle)
    if(true && fontVariation){
      const opentypeFont = opentype.parse(fontVariation.variation.buffer);
      let path = opentypeFont.getPath(text, _x, _y, style.fontSize);
      pathData = path.toPathData();
      svgPath = `<path d="${pathData}"/>`
      // svgPath = path.toSVG();
    }
    if(false && fontVariation){
      let typrFont = Typr.parse(fontVariation.variation.buffer)[0]
      // let gid = Typr.U.codeToGlyph(typrFont, "A".charCodeAt(0))
      // let path = Typr.U.glyphToPath(typrFont, gid)
      let shape = Typr.U.shape(typrFont, text, true)
      let path = Typr.U.shapeToPath(typrFont, shape)
      pathData = Typr.U.pathToSVG(path);
      svgPath = `<path d="${pathData}"/>`
    }

    if(this.exportAsPathInfo){
      return pathData;
    }

    let term = '; ',
        strokeWidth = styleDecl.strokeWidth ? 'stroke-width: ' + styleDecl.strokeWidth + term : '',
        fill = styleDecl.fill ? getSvgColorString('fill', styleDecl.fill) : '',
        stroke = styleDecl.stroke ? getSvgColorString('stroke', styleDecl.stroke) : '';
    let styleProps = [stroke, strokeWidth, fill].join(''),
        fillStyles = styleProps ? 'style="' + styleProps + '"' : '';

    return [
      '<g ',
      // x="', toFixed(left, NUM_FRACTION_DIGITS), '" y="', toFixed(top, NUM_FRACTION_DIGITS), '" ',
      fillStyles, '>',
      svgPath,
      '</g>'
    ].join('');
  },
  _exportAsPathInfo: false,
  _createTextCharSpan: function (_char, styleDecl, left, top) {
    if(this.exportAsPath || this.exportAsPathInfo) {
      return this._createTextCharSpanAsPath(_char, styleDecl, left, top);
    }else{
      return this._createTextCharSpanAsText(_char, styleDecl, left, top);
    }
  }
});







