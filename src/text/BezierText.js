//this is how Bezier Text could be rendered as SVG
// using TSPAN and y,x attributes. also, it could brobably fix the bug with ligatures
// <text transform="matrix(1 0 -0 1 0 522)">
//   <tspan y="-315.542" x="208.3647 235.49622 260.2367 291.9178">NAME</tspan>
//   <tspan y="-178.68895" x="225.40076 250.14124 275.04777">AGE</tspan>
// </text>

//для отрисовки фона
import {ShapeMixin} from "../mixins/shapeMixin.js";
import {BezierMixin} from "../mixins/bezierMixin.js";

export default {
  name: "bezier-text",
  deps: [],
  prototypes: {
    BezierText: {
      prototype: [ fabric.IText, ShapeMixin, BezierMixin],
      type: 'bezier-text',
      "+stateProperties": ["points" , "backgroundStroke" ],
      bezierControls: true,
      hasTransformControls: true,
      backgroundColor: false,
      backgroundStroke: false,
      outlineTop: 0,
      outlineBottom: 0,
      initialize: function (options, callback) {
        if(!this.outlineTop){
          options.outlineTop = options.outlineTop || options.fontSize || this.fontSize;
        }
        if(!this.outlineBottom){
          options.outlineBottom = options.outlineBottom || ((options.fontSize || this.fontSize) / 4);
        }
        options || ( options = {});

        options.points = options.points || [
          {
            x: 0,
            y: this.fontSize,
            c: {
              x: options.width * 0.3,
              y: this.fontSize + 0.5
            },
            c2: {
              x: options.width * 0.7,
              y: this.fontSize + 0.5
            }
          },
          {
            x: options.width,
            y: this.fontSize
          },
        ];
        this.callSuper('initialize', options, callback)

        if(!this.styles[0]){
          this.styles[0] = {};
        }
        if(!this.styles[0][0]){
          this.styles[0][0] = this.getStyleAtPosition(0,true);
        }
        this.updatePoints();
      },
      eventListeners: {
        "added": "updateBbox"
      },
      _getTextWidth: function(ctx){
        return this.width;
      },
      _getTextHeight: function(ctx){
        return this.height;
      },
      _getTopOffset: function(){
        return 0;
      },
      _getLeftOffset: function(){
        return 0;
      },
      updatePoints(){

        this._middlePoints = [];
        this._charPoints = [];
        this._charWidth = [[0]];

        let curveWidth = this.getLength();
        let lineIndex = 0, charIndex = 0, _charWidth, textWidth = 0;
        if (this.textAlign === 'justify') {
          let _l = curveWidth / this.text.length;
          for (; charIndex < this.text.length; charIndex++) {
            this._charWidth.push(_l);
          }
        }else{
          let width = 0, i, grapheme, line = this._textLines[0], prevGrapheme,
              graphemeInfo, lineBounds = new Array(line.length);

          for (i = 0; i < line.length; i++) {
            grapheme = line[i];
            graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, i, prevGrapheme);
            lineBounds[i] = graphemeInfo;
            width += graphemeInfo.kernedWidth;
            prevGrapheme = grapheme;
            // _charWidth = this._getWidthOfChar(ctx, this.text[charIndex], lineIndex, charIndex);
            this._charWidth[lineIndex].push(graphemeInfo.kernedWidth);
            // textWidth += _charWidth;
          }
        }

        let last_t  = 0;
        for(charIndex = 0; charIndex < this.text.length; charIndex++){

          //todo this.points[0] это только для кривых из двух точек
          let _cw = this._charWidth[lineIndex][charIndex] / 2;

          let _new_t =  this.points[0].curve.getTbyLength(_cw,0.0001,last_t);
          this._middlePoints.push((_new_t + last_t) / 2);
          last_t = _new_t;


          _new_t =  this.points[0].curve.getTbyLength(_cw,0.0001,last_t);
          this._charPoints.push((_new_t + last_t) / 2);
          last_t = _new_t;
        }
        this._middlePoints.push(last_t);

        let t_offset;
        last_t  = Math.min(1,last_t);
        if (this.textAlign === 'right') {
          t_offset = 1 - last_t;
        }else if (this.textAlign === 'center') {
          t_offset = (1 - last_t)/ 2;
        }
        if(t_offset){
          for(let i = 0; i < this._charPoints.length; i++){
            this._charPoints[i] += t_offset;
          }
          for(let i = 0; i < this._middlePoints.length; i++){
            this._middlePoints[i] += t_offset;
          }
        }

      },
      _clearTextArea: function(ctx) {
        // we add 4 pixel, to be sure to do not leave any pixel out
        let width = this.width + 4, height = this.height + 4;
        ctx.clearRect(-width / 2, -height / 2, width, height);
      },
      /**
       * @override
       * @param boundaries
       * @param ctx
       */
      renderSelection: function(boundaries, ctx) {

        let selectionStart = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
            selectionEnd = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd,
            isJustify = this.textAlign.indexOf('justify') !== -1,
            start = this.get2DCursorLocation(selectionStart),
            end = this.get2DCursorLocation(selectionEnd),
            startLine = start.lineIndex,
            endLine = end.lineIndex,
            startChar = start.charIndex < 0 ? 0 : start.charIndex,
            endChar = end.charIndex < 0 ? 0 : end.charIndex;


        let _start_char_index = Math.max(start.charIndex,0);
        let _end_char_index = Math.min(end.charIndex,this.text.length - 1);

        for (let i = _start_char_index; i <= _end_char_index; i++) {

          ctx.fillStyle = this.selectionColor;

          let t, pt, nv, angle;
          t = this._middlePoints[i];
          if(t > 1)break;
          pt = this.points[parseInt(t)].curve.get(t);
          nv = this.points[parseInt(t)].curve.normal(t);
          angle = - Math.atan2(nv.x, nv.y) ;
          let charHeight = this.getValueOfPropertyAt(0, i, 'fontSize');
          let boxWidth = this._charWidth[0][i];

          ctx.save();
          ctx.translate(-this.width/2, -this.height/2);
          ctx.translate(pt.x + this.curveTextOffset*nv.x ,pt.y +  this.curveTextOffset*nv.y);
          ctx.rotate(angle);
          ctx.fillRect(0, 0, boxWidth, -charHeight);

          ctx.restore();
        }
        //
        //ctx.fillRect(
        //  boundaries.left + lineOffset,
        //  boundaries.top + boundaries.topOffset,
        //  boxWidth,
        //  lineHeight);

      },
      drawControlsInterface: function (ctx) {
        if(this.hasTransformControls){
          this.drawBezierShapeControls(ctx);
        }
      },
      ________renderTextLine: function(method, ctx, line, left, top, lineIndex) {
        // lift the line by quarter of fontSize
        top -= this.fontSize * this._fontSizeFraction;

        // short-circuit
        let lineWidth = this._getLineWidth(ctx, lineIndex);
        this._renderChars(method, ctx, line, left, top, lineIndex);
        /*
         //justify
         let words = line.split(/\s+/),
         charOffset = 0,
         wordsWidth = this._getWidthOfWords(ctx, line, lineIndex, 0),
         widthDiff = this.width - wordsWidth,
         numSpaces = words.length - 1,
         spaceWidth = numSpaces > 0 ? widthDiff / numSpaces : 0,
         leftOffset = 0, word;

         for (let i = 0, len = words.length; i < len; i++) {
         while (line[charOffset] === ' ' && charOffset < line.length) {
         charOffset++;
         }
         word = words[i];
         this._renderChars(method, ctx, word, left + leftOffset, top, lineIndex, charOffset);
         leftOffset += this._getWidthOfWords(ctx, word, lineIndex, charOffset) + spaceWidth;
         charOffset += word.length;
         }*/
      },
      curveTextOffset: -3,
      /**
       * Returns index of a character corresponding to where an object was clicked
       * @param {Event} e Event object
       * @return {Number} Index of a character
       */
      getSelectionStartFromPointer: function(e) {
        let mouseOffset = this.getLocalPointer(e),
            prevWidth = 0,
            width = 0,
            height = 0,
            charIndex = 0,
            newSelectionStart,
            line;

        mouseOffset.x /= this.scaleX;
        mouseOffset.y /= this.scaleY;

        //todo

        let p = this.points[0].curve.project(mouseOffset);

        for(let i in this._charPoints){
          if(this._charPoints[i] > p.t){
            return +i;
          }
        }
        return this.text.length ;
      },
      isEmptyStyles: function(){
        return false;
      },
      _renderChar: function(method, ctx, lineIndex, charIndex, _char) {

        let charWidth, charHeight, shouldFill, shouldStroke, textDecoration;
        let decl = this._getStyleDeclaration(lineIndex, charIndex);

        if (decl) {
          charHeight = this.getHeightOfChar(lineIndex, charIndex);
          shouldStroke = decl.stroke;
          shouldFill = decl.fill;
          textDecoration = decl.textDecoration;
        }
        else {
          charHeight = this.fontSize;
        }

        shouldStroke = (shouldStroke || this.stroke) && method === 'strokeText';
        shouldFill = (shouldFill || this.fill) && method === 'fillText';

        let t2, pt2 ,nv2 , angle2;

        //todo this.points[0].curve это некорректно!
        let _curve = this.points[0].curve;

        for(let index = 0; index < _char.length; index++){
          let subCharIndex = charIndex + index - _char.length + 1;

          t2 = this._charPoints[subCharIndex];
          //do not render chars that not fit into the text area
          if(t2 > 1){
            break;
          }
          pt2 = _curve.get(t2);
          nv2 = _curve.normal(t2);
          angle2 = -Math.atan2(nv2.x,nv2.y) ;
          let left = pt2.x + this.curveTextOffset*nv2.x, top = pt2.y +  this.curveTextOffset*nv2.y;

          ctx.save();
          ctx.translate(left - this.width/2, top- this.height/2);
          ctx.rotate(angle2);
          shouldFill && ctx.fillText(_char[index], 0, 0);
          shouldStroke && ctx.strokeText(_char[index], 0, 0);
          ctx.restore();
        }

        // if (textDecoration || textDecoration !== '') {
        //   offset = this._fontSizeFraction * lineHeight / this.lineHeight;
        //   this._renderCharDecoration(ctx, textDecoration, left, top, offset, charWidth, charHeight);
        // }

      },
      // _renderCharDecoration: function (ctx){
      //
      // },
      _renderTextBoxBackground: function (ctx){
        ctx.translate(-this.width/2 ,-this.height/2);
        if (!this.textBackgroundColor && !this.textBackgroundStroke){
          return;
        }
        if (this.textBackgroundColor) {
          this.__fill = this.fill;
          this.fill = this.textBackgroundColor;
          this._setFillStyles(ctx);
          this.fill = this.__fill;
        }
        if (this.textBackgroundStroke) {
          this.__stroke = this.stroke;
          this.stroke = this.textBackgroundStroke;
          this._setStrokeStyles(ctx);
        }
        fabric.BezierPolyline.prototype._render.call(this,ctx);

        if (this.textBackgroundStroke) {
          this.stroke = this.__stroke;
        }
      },

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _renderText: function(ctx) {
        //this._translateForTextAlign(ctx);
        this._renderTextFill(ctx);
        this._renderTextStroke(ctx);
        //this._translateForTextAlign(ctx, true);
      },
      _getPoint: function(t){
        let _normal = this.points[0].curve.normal(t);
        let info = {
          point:  this.points[0].curve.get(t),
          normal:  _normal,
          angle: -Math.atan2(_normal.x,_normal.y)
        };
        return info;
      },
      /**
       * Renders cursor
       * @param {Object} boundaries
       * @param {CanvasRenderingContext2D} ctx transformed context to draw on
       */
      renderCursor: function(boundaries, ctx) {

        let cursorLocation = this.get2DCursorLocation(),
            lineIndex = cursorLocation.lineIndex,
            charIndex = cursorLocation.charIndex,
            charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize');
        //leftOffset = (lineIndex === 0 && charIndex === 0)
        //  ? this._getLineLeftOffset(this._getLineWidth(ctx, lineIndex))
        //  : boundaries.leftOffset;


        let t , pt,nv , angle;
        //todo
        t = this._middlePoints[charIndex];
        let info = this._getPoint(t);
        ctx.save();
        ctx.translate(- this.width/2, - this.height/2);
        ctx.translate(info.point.x + this.curveTextOffset*info.normal.x ,info.point.y +  this.curveTextOffset*info.normal.y);
        ctx.rotate(info.angle);

        ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
        ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;

        ctx.fillRect(0, 0,
            this.cursorWidth / this.scaleX,
            -charHeight);

        ctx.restore();

      }
    }
  }
}

// fabric.Text.prototype.curveText = function () {
//   let obj = this.toObject();
//   obj.rasterizedType = obj.type;
//   obj.type = "bezier-text";
//   obj.movementLimits = this.movementLimits;
//   obj.clipTo = this.clipTo;
//   obj.active = true;
//
//   let _this = this;
//   _this.canvas.createObject(obj, function () {
//     _this.canvas.remove(_this);
//     _this.canvas.renderAll();
//   });
// };

//материалы для вдохновения
//http://jsfiddle.net/ashishbhatt/XR7j6/10/
//http://jsfiddle.net/EffEPi/qpJTz/
//http://tympanus.net/Development/Arctext/
//http://jsfiddle.net/E5vnU/(function (global){

