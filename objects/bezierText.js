'use strict';

//fabric.require("BezierText",["BezierMixin"], function() {
  //fabric.IText,
  fabric.BezierText = fabric.util.createClass(fabric.IText, {
    type: 'bezier-text',

    points: [],

    backgroundColor: false,

    backgroundStroke: false,

    stateProperties: fabric.IText.prototype.stateProperties.concat(["points" , "backgroundStroke" ]),

    initialize: function (text, options) {
      this.text = text;
      options || ( options = {});
      this.callSuper('initialize',text,  options);
      //this.curve = new (Function.prototype.bind.apply(Bezier, options.points));

//todo
//      if(!this.styles || _.isEmpty(this.styles)){
//        var style = this.getCurrentCharStyle(0,0);
//        style.strokeWidth++;
//        this.styles = {0: {0: style}};
//      }
      this.initBezier();
      this.setPoints(options.points);
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

    /**
     * Renders text selection
     * @param {Array} chars Array of characters
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    renderSelection: function(chars, boundaries, ctx) {

      ctx.fillStyle = this.selectionColor;

      var start = this.get2DCursorLocation(this.selectionStart),
        end = this.get2DCursorLocation(this.selectionEnd),
        startLine = start.lineIndex,
        endLine = end.lineIndex;

      for (var i = start.charIndex; i <= end.charIndex; i++) {


        var t , pt,nv , angle;
        t = this._charPoints[i];
        pt = this.curve.get(t);
        nv = this.curve.normal(t);
        angle = -Math.atan2(nv.x,nv.y) ;
        var charHeight = this.getCurrentCharFontSize(0, i);
        var boxWidth = this._getWidthOfChar(ctx, chars[i], 0, i);

        ctx.save();
        ctx.translate(- this.width/2, - this.height/2);
        ctx.translate(pt.x + this.curveTextOffset*nv.x ,pt.y +  this.curveTextOffset*nv.y);
        ctx.rotate(angle);
        ctx.fillRect(0, 0,
          boxWidth,
          -charHeight);

        ctx.restore();
      }
      //
      //ctx.fillRect(
      //  boundaries.left + lineOffset,
      //  boundaries.top + boundaries.topOffset,
      //  boxWidth,
      //  lineHeight);

    },
    /**
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to render
     * @param {Number} left Left position of text
     * @param {Number} top Top position of text
     * @param {Number} lineIndex Index of a line in a text
     */
    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
      // lift the line by quarter of fontSize
      top -= this.fontSize * this._fontSizeFraction;

      // short-circuit
      var lineWidth = this._getLineWidth(ctx, lineIndex);
      this._renderChars(method, ctx, line, left, top, lineIndex);
      /*
       //justify
       var words = line.split(/\s+/),
       charOffset = 0,
       wordsWidth = this._getWidthOfWords(ctx, line, lineIndex, 0),
       widthDiff = this.width - wordsWidth,
       numSpaces = words.length - 1,
       spaceWidth = numSpaces > 0 ? widthDiff / numSpaces : 0,
       leftOffset = 0, word;

       for (var i = 0, len = words.length; i < len; i++) {
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
    //todo


    /**
     * Returns index of a character corresponding to where an object was clicked
     * @param {Event} e Event object
     * @return {Number} Index of a character
     */
    getSelectionStartFromPointer: function(e) {
      var mouseOffset = this.getLocalPointer(e),
        prevWidth = 0,
        width = 0,
        height = 0,
        charIndex = 0,
        newSelectionStart,
        line;

      mouseOffset.x /= this.scaleX;
      mouseOffset.y /= this.scaleY;

      var p = this.curve.project(mouseOffset);

      for(var i in this._charPoints){
        if(this._charPoints[i] > p.t){
          return i - 1;
        }
      }
      return this.text.length;
    },
    isEmptyStyles: function(){
      return false;
    },

    drawControls: function (ctx, shape, offset) {
      if (!this.hasControls) {
        return this;
      }
      this.drawBoundsControls( ctx);
      this.drawShapeControls(ctx);
      this.drawBezierControls(ctx);
    },
    _renderChar: function(method, ctx, lineIndex, i, _char, left, top, lineHeight) {

      //this.drawLine(ctx,pt, { x: pt.x + d*nv.x, y: pt.y + d*nv.y} );


      var charWidth, charHeight, shouldFill, shouldStroke,
        decl = this.getCurrentCharStyle(lineIndex, i),
        offset, textDecoration;

      //console.log(decl);
      //fabric.util.object.defaults(decl, this);

      if (decl) {
        charHeight = this._getHeightOfChar(ctx, _char, lineIndex, i);
        shouldStroke = decl.stroke;
        shouldFill = decl.fill;
        textDecoration = decl.textDecoration;
      }
      else {
        charHeight = this.fontSize;
      }

      shouldStroke = (shouldStroke || this.stroke) && method === 'strokeText';
      shouldFill = (shouldFill || this.fill) && method === 'fillText';


      charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i);
      textDecoration = textDecoration || this.textDecoration;


      var t1, pt1 ,nv1 ,angle1, left = 0, top = 0;
      var t2, pt2 ,nv2 , angle2;


      t1 = this._charPoints[i - _char.length + 1];
      pt1 = this.curve.get(t1);
      nv1 = this.curve.normal(t1);
      angle1 = -Math.atan2(nv1.x,nv1.y);


      for(var index = 0; index < _char.length; index++){
        var charIndex = index + i - _char.length + 1;


        t2 = this._charPoints[charIndex + 1];
        pt2 = this.curve.get(t2);
        nv2 = this.curve.normal(t2);
        angle2 = -Math.atan2(nv2.x,nv2.y) ;


        ctx.save();
        ctx.translate(pt1.x + this.curveTextOffset*nv1.x, pt1.y +  this.curveTextOffset*nv1.y);
        ctx.rotate((angle2 + angle1)/2);
        shouldFill && ctx.fillText(_char[index], 0, 0);
        shouldStroke && ctx.strokeText(_char[index], 0, 0);
        ctx.restore();

        t1 = t2;
        pt1 =  pt2;
        nv1 =   nv2;
        angle1 =  angle2;
      }





      if (textDecoration || textDecoration !== '') {
        offset = this._fontSizeFraction * lineHeight / this.lineHeight;
        this._renderCharDecoration(ctx, textDecoration, left, top, offset, charWidth, charHeight);
      }


    },

    _renderCharDecoration: function (ctx){

    },
    _renderTextBoxBackground: function (ctx){
      ctx.translate(-this.width/2 ,-this.height/2);

      if (!this.backgroundColor && !this.backgroundStroke){
        return;
      }
      if (this.backgroundColor) {
        this.__fill = this.fill;
        this.fill = this.backgroundColor;
        this._setFillStyles(ctx);
        this.fill = this.__fill;
      }
      if (this.backgroundStroke) {
        this.__stroke = this.stroke;
        this.stroke = this.backgroundStroke;
        this._setStrokeStyles(ctx);
      }
      this._renderBezier(ctx);

      if (this.backgroundStroke) {
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
    /**
     * Renders cursor
     * @param {Object} boundaries
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    renderCursor: function(boundaries, ctx) {

      var cursorLocation = this.get2DCursorLocation(),
        lineIndex = cursorLocation.lineIndex,
        charIndex = cursorLocation.charIndex,
        charHeight = this.getCurrentCharFontSize(lineIndex, charIndex);
      //leftOffset = (lineIndex === 0 && charIndex === 0)
      //  ? this._getLineLeftOffset(this._getLineWidth(ctx, lineIndex))
      //  : boundaries.leftOffset;



      var t , pt,nv , angle;
      t = this._charPoints[charIndex];
      pt = this.curve.get(t);
      nv = this.curve.normal(t);
      angle = -Math.atan2(nv.x,nv.y) ;
      ctx.save();
      ctx.translate(- this.width/2, - this.height/2);
      ctx.translate(pt.x + this.curveTextOffset*nv.x ,pt.y +  this.curveTextOffset*nv.y);
      ctx.rotate(angle);

      ctx.fillStyle = this.getCurrentCharColor(lineIndex, charIndex);
      ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;

      ctx.fillRect(0, 0,
        this.cursorWidth / this.scaleX,
        -charHeight);

      ctx.restore();

    },

    /**
     * Render Shape Object
     * @private
     * @param {CanvasRenderingctx2D} ctx ctx to render on
     */
    _render: function (ctx, noTransform){

      this._charPoints = [0];
      this._charWidth = [];

      var curveWidth = this.curve.length();
      var lineIndex = 0, charIndex = 0, _charWidth, textWidth = 0;
      if (this.textAlign == 'justify') {
        var _l = curveWidth / this.text.length;
        for (; charIndex < this.text.length; charIndex++) {
          this._charWidth.push(_l);
        }
      }else{
        for (; charIndex < this.text.length; charIndex++) {
          _charWidth = this._getWidthOfChar(ctx, this.text[charIndex], lineIndex, charIndex);
          this._charWidth.push(_charWidth);
          textWidth += _charWidth;
        }
      }

      //
      //function curveLengthT(t, ){
      //
      //}

      this._charPoints = [0];
      var last_t  = 0;
      for(charIndex = 0; charIndex < this.text.length; charIndex++){
        last_t =  this.curve.getTbyLength(this._charWidth[charIndex],0.0001,last_t);
        this._charPoints.push(last_t);
      }

      var t_offset;
      if (this.textAlign == 'right') {
        t_offset = 1 - last_t;
      }else if (this.textAlign == 'center') {
        t_offset = (1 - last_t)/ 2;
      }
      if(t_offset){
        for(var i = 0; i < this._charPoints.length; i++){
          this._charPoints[i] += t_offset;
        }
      }



      ctx.save();

      this.callSuper("_render",ctx,noTransform);

      ctx.restore();

    },
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function (propertiesToInclude) {

      var _points = [];
      for(var i in this.points){
        _points.push(this.points[i].x,this.points[i].y);
      }
      var object = fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
        points: _points,
        backgroundColor: this.backgroundColor,
        backgroundStroke: this.backgroundStroke,
      });
      if (!this.includeDefaultValues) {
        this._removeDefaultValues(object);
      }
      return object;
    }
  });

  fabric.BezierText.fromObject = function (object) {
    return new fabric.BezierText(object.text,object);
  };
  fabric.util.createAccessors(fabric.BezierText);


  fabric.util.object.extend(fabric.BezierText.prototype, fabric.BezierMixin);


  if(fabric.objectsLibrary){
    fabric.objectsLibrary.bezierTextCurved = {
      "title": "bezierTextCurved",
      "type":"bezier-text",
      "width": 200,
      "defaultShape": "curve",
      "text":"Add some text here"
    };
  }



  fabric.BezierText.prototype.actions = fabric.util.object.extend({}, fabric.IText.prototype.actions, {});

  fabric.Text.prototype.curveTool = false;
  fabric.Text.prototype.curveText = function () {
    var obj = this.toObject();
    obj.rasterizedType = obj.type;
    obj.type = "bezier-text";
    obj.movementLimits = this.movementLimits;
    obj.clipTo = this.clipTo;

    var _this = this;
    fabric.util.createObject(obj, function (el) {
      _this.canvas.add(el, true);
      _this.canvas.remove(_this);
      _this.canvas.setActiveObject(el);
      _this.canvas.renderAll();
    });
  };
  fabric.IText.prototype.actions.curveText =
    fabric.Text.prototype.actions.curveText = {
    insert: 'curveTool',
    className: 'button-easel',
    title: 'curveText',
    action: fabric.Text.prototype.curveText
  };

//});

//материалы для вдохновения
//http://jsfiddle.net/ashishbhatt/XR7j6/10/
//http://jsfiddle.net/EffEPi/qpJTz/
//http://tympanus.net/Development/Arctext/
//http://jsfiddle.net/E5vnU/(function (global){

