function getParentScaleX(el) {
  return el.scaleX * (el.group ? getParentScaleX(el.group) : 1)//: this.canvas.viewportTransform[0])
}

let SyncTextMixin = {
  //this options order required to have correct textLines on setText. all text dimension affection properties shoul be initialized first
  optionsOrder: ["fontWeight", "fontStyle", "fontSize", "fontFamily", "styles", "width","height", "text",  "*"],
  set(key, value , callback) {
    fabric.Object.prototype.set.call(this, key, value, callback);
    var needsDims = false;
    if (typeof key === 'object') {
      for (var _key in key) {
        needsDims = needsDims || this._dimensionAffectingProps.indexOf(_key) !== -1;
      }
    } else {
      needsDims = this._dimensionAffectingProps.indexOf(key) !== -1;
    }
    if (needsDims) {
      this.initDimensions();
      this.setCoords();
    }
    return this;
  },
  onInput_overwritten: fabric.IText.prototype.onInput,
  onInput: function(e) {
    this.saveStates(["text","styles"]);
    this.onInput_overwritten(e);
  },
  decreaseFontSize: function () {
    this.setStyle('fontSize', parseInt(this.getStyle('fontSize')) - 1);
  },
  increaseFontSize: function () {
    this.setStyle('fontSize', parseInt(this.getStyle('fontSize')) + 1);
  },
  minFontSize: 2,
  maxFontSize: 250,
  minLineHeight: 2,
  maxLineHeight: 200,
  maxStrokeWidth: function () {
    return Math.ceil(this.getFontSize() / 10);
  },

  // initDimensions_overwritten: fabric.Text.prototype.initDimensions,
  // initDimensions: function() {
  //   this.initDimensions_overwritten();
  //   this.width = Math.floor(this.width)
  //   this.height = Math.floor(this.height)
  // },
  addText: function (text, options) {
    let match = this.text.match(/\n/g);
    let lineIndex = match && match.length || 0;
    let charIndex = this.text.length - this.text.lastIndexOf("\n") - 1;

    if (!this.styles[lineIndex]) {
      this.styles[lineIndex] = {}
    }

    if (!this.styles[lineIndex][charIndex]) {
      this.styles[lineIndex][charIndex] = {}
    }
    Object.assign(this.styles[lineIndex][charIndex], options);
    this.text += text;
    // this.styles;
  },
  // _checkModifiedText: function (prop, value) {
  //   if (this.isEditing) {
  //     var isTextChanged = (this._textBeforeEdit !== this.text);
  //     if (isTextChanged) {
  //       this.canvas.fire("object:modified", {target: this});
  //     }
  //   }
  // },

  /**
   * Renders cursor or selection (depending on what exists)
   * it does on the contextTop. If contextTop is not available, do nothing.
   */
  renderCursorOrSelection: function() {
    if (!this.isEditing || !this.canvas || !this.canvas.contextTop) {
      return;
    }


    var boundaries = this._getCursorBoundaries(),
        ctx = this.canvas.contextTop;

    // ctx.save()

    this.clearContextTop(true);
    ctx.translate(-this._contentOffsetX, -this._contentOffsetY)
    if (this.selectionStart === this.selectionEnd) {
      this.renderCursor(boundaries, ctx);
    }
    else {
      this.renderSelection(boundaries, ctx);
    }
    ctx.restore();
  },
  /*
  @override
   */
  renderCursor: function(boundaries, ctx) {
    var cursorLocation = this.get2DCursorLocation(),
        lineIndex = cursorLocation.lineIndex,
        charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
        charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
        multiplier = getParentScaleX(this) * this.canvas.getZoom(), //overriden
        cursorWidth = this.cursorWidth / multiplier,
        topOffset = boundaries.topOffset,
        dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');

    topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight
        - charHeight * (1 - this._fontSizeFraction);

    if (this.inCompositionMode) {
      this.renderSelection(boundaries, ctx);
    }

    ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
    ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
    ctx.fillRect(
        boundaries.left + boundaries.leftOffset - cursorWidth / 2,
        topOffset + boundaries.top + dy,
        cursorWidth,
        charHeight)
  },
  setProperty: function (property, value) {
    if (this.canvas && this.canvas.stateful) {
      // this._checkModifiedText();
      this.saveStates([property]);
    }

    this[property] = value;

    this.updateState();

    // this.fire("modified", {});
    // if (this.canvas) {
    //   this.canvas.fire("object:modified", {target: this});
    //   this.canvas.renderAll();
    // }
    this._textBeforeEdit = this.text;
  },
  _removeStyle: function (styleName) {
    for(let row in this.styles) {
      for (let index in this.styles[row]) {
        delete this.styles[row][index][styleName]
      }
    }
  },
  _removeStyleAt: function (propertyToRemove,index) {
    var loc = this.getStylePosition(index);
    if (!this._getLineStyle(loc.lineIndex) || !this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
      return;
    }
    let style = this.styles[loc.lineIndex][loc.charIndex];
    delete style[propertyToRemove];
    if(!Object.keys(style).length ){
      delete this.styles[loc.lineIndex][loc.charIndex];
      if(!this.styles[loc.lineIndex].length ){
        delete this.styles[loc.lineIndex];
      }
    }
  },
  _modifyObjectStyleProperty (styleName,value){
    let count = 0;
    for(let row in this.styles) {
      for (let index in this.styles[row]) {
        if(this.styles[row][index] === undefined || this.styles[row][index][styleName] === value){
          count++;
        }else{
          return;
        }
      }
    }
    if(count === this.text.length){
      this._removeStyle(styleName);
      this[styleName] = value;
    }
  },
  setStyleInterval: function (styleName, value, start ,end) {
    if (value === undefined || this[styleName] === value){
      for (let i = start; i < end; i++) {
        this._removeStyleAt(styleName,i);
      }
      this._forceClearCache = true;
    }else{
      this.setSelectionStyles({[styleName]: value}, start, end);
    }
    this._modifyObjectStyleProperty(styleName,value);
    this.setCoords();
    if(styleName === "fontFamily" && value &&  this.renderOnFontsLoaded){
      this.renderOnFontsLoaded([value])
    }
  },
  setStyle: function (styleName, value) {
    if (this.canvas && this.canvas.stateful) {
      // this._checkModifiedText();
      this.saveStates([
        "styles", styleName]);
    }
    this.__selectionStart = this.selectionStart;
    this.__selectionEnd = this.selectionEnd;
    this.__changedProperty = styleName;

    // let _old = {
    //   fill: this.fill,
    //   fontSize: this.fontSize,
    //   textBackgroundColor: this.textBackgroundColor,
    //   fontFamily: this.fontFamily,
    //   fontWeight: this.fontWeight,
    //   fontStyle: this.fontStyle,
    //   stroke: this.stroke,
    //   strokeWidth: this.strokeWidth,
    //   styles: this.styles
    // }

    if (this.setSelectionStyles && this.isEditing && this.selectionStart !== this.selectionEnd) {
      this.setStyleInterval(styleName, value,this.selectionStart,this.selectionEnd)
    }
    else {
      if (value !== undefined) {
        this._removeStyle(styleName);
        this.set(styleName,value)
      } else {
        this.set(styleName,value)
      }
      if (!this._textLines && this.ready) {
        this._clearCache();
        this._splitText();
      }
      // this.cleanStyle(styleName);
    }

    this.setCoords();

    if (this.caching) {
      this.dirty = true;
    }

    this.updateState();

    // this.fire("modified", {});
    // if (this.canvas) {
    //   this.canvas.fire("object:modified", {target: this});
    //   this.canvas.renderAll();
    // }
    delete this.__changedProperty;
    delete this.__selectionStart;
    delete this.__selectionEnd;
  },
  generateTextStyle: function () {
    return {
      'font-style': this.getStyle('fontStyle'),
      'font-weight': this.getStyle('bold'),
      'text-decoration':
          ( this.getStyle('linethrough') ? 'line-through ' : '') +
          ( this.getStyle('overline') ? 'overline ' : '') +
          ( this.getStyle('underline') ? 'underline ' : '')
    }
  }
}

Object.assign(fabric.Object.prototype, {
  _translatedY: 0,
  _translatedX: 0,
  _translate(leftOverflow,topOverflow){
    let rad = fabric.util.degreesToRadians(this.angle);
    this.top -= (topOverflow - this._translatedY) * Math.cos(rad) *  this.scaleY;
    this.left += (topOverflow - this._translatedY)  * Math.sin(rad)* this.scaleY;
    this.top -= (leftOverflow - this._translatedX) * Math.sin(rad) *  this.scaleX;
    this.left -= (leftOverflow - this._translatedX)  * Math.cos(rad)* this.scaleX;
    this._translatedY = topOverflow
    this._translatedX = leftOverflow
  }
})

Object.assign(fabric.Text.prototype, SyncTextMixin, {
  /**
   * Initialize or update text dimensions.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   */
  initDimensions: function() {
    if (this.__skipDimension) {
      return;
    }
    this._splitText();
    this._clearCache();
    this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH;
    if (this.textAlign.indexOf('justify') !== -1) {
      // once text is measured we need to make space fatter to make justified text.
      this.enlargeSpaces();
    }
    this.height = this.calcTextHeight();
    this.saveState({ propertySet: '_dimensionAffectingProps' });

    this.fire("dimensions:calculated")
  },
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} method Method name ("fillText" or "strokeText")
   */
  _renderTextCommon: function(ctx, method) {
    ctx && ctx.save();
    var lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset(),
        offsets = this._applyPatternGradientTransform(ctx, method === 'fillText' ? this.fill : this.stroke);

    for (var i = 0, len = this._textLines.length; i < len; i++) {
      var heightOfLine = this.getHeightOfLine(i),
          maxHeight = heightOfLine / this.lineHeight,
          leftOffset = this._getLineLeftOffset(i);
      this._renderTextLine(
          method,
          ctx,
          this._textLines[i],
          left + leftOffset - offsets.offsetX,
          top + lineHeights + maxHeight - offsets.offsetY,
          i
      );
      lineHeights += heightOfLine;
    }
    ctx && ctx.restore();
  },
  //add textTransform support
  _splitText: function() {
    let text= this.text
    if(this.textTransform){
      if(this.textTransform === "uppercase"){
        text = text.toUpperCase()
      }
      if(this.textTransform === "lowercase"){
        text = text.toLowerCase()
      }
      if(this.textTransform === "capitalize"){
        text = fabric.util.string.capitalize(text)
      }
    }
    var newLines = this._splitTextIntoLines(text);
    this.textLines = newLines.lines;
    this._textLines = newLines.graphemeLines;
    this._unwrappedTextLines = newLines._unwrappedLines;
    this._text = newLines.graphemeText;
    return newLines;
  },
  setTextTransform(value){
    this.textTransform = value
    this.setText(this.text)
    this.dirty = true
    this.initDimensions()
    this.canvas && this.canvas.requestRenderAll()
  },
  "+_dimensionAffectingProps": ["textTransform"],
  "+cacheProperties": ["textTransform"],
  "+stateProperties": ["textTransform"],
  textTransform: false,
  useBothRenderingMethod: true,
  features: {
    "dnom": false, // Denominators Mostly superceded by contextual <frac> implementations
    "numr": false, // Numerators Mostly superceded by contextual <frac> implementations
    "frac": false, // Fractions
    "zero": false, // Slashed Zero
    "calt": true,  // Contextual Alternates
    "liga": true,  // Standard Ligatures
    "ccmp": true,  // Glyph Composition / Decomposition
    "dlig": false, // Discretionary Ligatures
    "rlig": false, // Requiered Ligatures

    "c2sc": false, // Small Capitals From Capitals
    "smcp": false, // Small Capitals from lowercase
    "unic": false, // Unicase

    "lnum": false, // Lining Figures
    "onum": false, // Oldstyle Figures
    "pnum": false, // Proportional Figures
    "tnum": false,  // Tabular Figures
    "locl": false, // Localized Forms

    "ss01": false, // Stylistic Set 01
    "ss02": false, // Stylistic Set 02
    "ss03": false, // Stylistic Set 03
    "ss04": false, // Stylistic Set 04
    "ss05": false, // Stylistic Set 05
    "ss06": false, // Stylistic Set 06
    "ss07": false, // Stylistic Set 07

    "cpsp": false,  // Capital Spacing
    "kern": false,  // Kerning

    "mark": false,  //Mark positioning
    "mkmk": false,  //Mark to mark positioning
  },

  /**
   * @private
   */
  _wrapSVGTextAndBg: function(textAndBg) {
    let noShadow = true,
        textDecoration = this.getSvgTextDecoration(this);
    return [
      textAndBg.textBgRects.join(''),
      '\t\t<text xml:space="preserve" ',
      (this.fontFamily ? 'font-family="\'' + this.fontFamily.replace(/"/g, '\'') + '\'" ' : ''),
      (this.fontSize ? 'font-size="' + this.fontSize + '" ' : ''),
      (this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : ''),
      (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : ''),
      (textDecoration ? 'text-decoration="' + textDecoration + '" ' : ''),
      'style="', this.getSvgStyles(noShadow), '"', this.addPaintOrder(), ' >',
      textAndBg.textSpans.join(''),
      '</text>\n',
      textAndBg.special ? textAndBg.special.join('') : ''
    ];
  },
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderText: function(ctx) {
    if(this.useBothRenderingMethod){
      return this._renderTextCommon(ctx, 'both');
    }
    if (this.paintFirst === 'stroke') {
      this._renderTextStroke(ctx);
      this._renderTextFill(ctx);
    }
    else {
      this._renderTextFill(ctx);
      this._renderTextStroke(ctx);
    }
  },
  renderCharCallback: null,


  _renderChars: function(method, ctx, line, left, top, lineIndex) {
    // set proper line offset
    var lineHeight = this.getHeightOfLine(lineIndex),
        isJustify = this.textAlign.indexOf('justify') !== -1,
        actualStyle,
        nextStyle,
        firstChar = 0,
        charBox,
        boxWidth = 0,
        timeToRender,
        shortCut = !isJustify && this.charSpacing === 0 && (!this._specialArray || !this._specialArray[lineIndex]) && this.isEmptyStyles(lineIndex);

    ctx && ctx.save();
    top -= lineHeight * this._fontSizeFraction / this.lineHeight;
    if (shortCut) {
      // render all the line in one pass without checking
      this._renderChar(method, ctx, lineIndex, 0, this.textLines[lineIndex].length, left, top, lineHeight);
      ctx && ctx.restore();
      return;
    }
    for (var i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        left += charBox.kernedWidth - charBox.width;
        boxWidth += charBox.width;
      }
      else {
        boxWidth += charBox.kernedWidth;
      }
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);


        timeToRender =
            (this._specialArray && this._specialArray[lineIndex] && this._specialArray[lineIndex][i] !== this._specialArray[lineIndex][i + 1]) ||
            this._hasStyleChangedForSvg(actualStyle, nextStyle)
      }

      if (timeToRender) {
        this._renderChar(method, ctx, lineIndex, firstChar, i, left, top, lineHeight);
        firstChar = i + 1;
        actualStyle = nextStyle;
        left += boxWidth;
        boxWidth = 0;
      }
    }
    ctx && ctx.restore();
  },
  _renderChar: function(method, ctx, lineIndex, charIndex, endCharIndex, left, top) {
    var decl = this._getStyleDeclaration(lineIndex, charIndex),
        fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
        shouldFill = method === 'fillText' && fullDecl.fill,
        shouldStroke = method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;

    if (method !== "calc" && method !== "both" && !shouldStroke && !shouldFill) {
      return;
    }
    ctx && decl && ctx.save();

    ctx && this._applyCharStyles(method, ctx, lineIndex, charIndex, fullDecl);

    if (decl && decl.textBackgroundColor) {
      this._removeShadow(ctx);
    }
    if (decl && decl.deltaY) {
      top += decl.deltaY;
    }

    fullDecl.special = this._specialArray && this._specialArray[lineIndex] && this._specialArray[lineIndex][charIndex];


    if(this.renderCharCallback){
      // this.renderCharCallback(method, ctx, lineIndex, charIndex ? charIndex - _char.length + 1: 0, _char, left, top, fullDecl)
      this.renderCharCallback(method, ctx, lineIndex, charIndex, endCharIndex, left, top, fullDecl)
    }
    else {
      let text = this._textLines[lineIndex].slice(charIndex, endCharIndex + 1).join("")
      this.runCharRendering(method, ctx, text, left, top, 0, fullDecl);
    }

    ctx && decl && ctx.restore();
  },
  runCharRendering(method, ctx, _char, left, top, angle, fullDecl, alignment){
    if(ctx){
      ctx.save();
      ctx.translate(left, top)
      ctx.rotate(angle)
    }
    for(let i in this.textRenders){
      let result = this[this.textRenders[i]](method, ctx, _char, fullDecl, alignment, left, top, angle)
      if(result === true)break;
    }
    if(ctx) {
      ctx.restore()
    }
  },
  textRenders: ["defaultTextRender"],
  /**
   * @private
   * @param {String} method
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {String} _char
   * @param {Number} lineHeight Height of the line
   */
  defaultTextRender: function(method, ctx, _char, decl) {
    if(method === "both"){
      if (decl.fill && this.paintFirst === 'fill') {
        ctx.fillText(_char, 0,0);
      }
      if(decl.stroke && decl.strokeWidth) {
        if (this.shadow && !this.shadow.affectStroke) {
          this._removeShadow(ctx);
        }
        ctx.save();
        this._setLineDash(ctx, this.strokeDashArray);
        ctx.beginPath();
        ctx.strokeText(_char, 0,0);
        ctx.closePath();
        ctx.restore();
      }
      if (decl.fill && this.paintFirst === 'stroke') {
        ctx.fillText(_char, 0,0);
      }
    }
    else{
      method === 'fillText' && decl.fill && ctx.fillText(_char, 0,0);
      method === 'strokeText' && decl.stroke && decl.strokeWidth && ctx.strokeText(_char, 0,0);
    }
    return true;
  },
  setTextFill(value) {
    this.setStyle("fill", value);
  },
  getTextFill() {
    let fill = this.getStyle("fill"); //texture pattern fill fix
    return typeof fill === "string" ? fill : "transparent";
  },
  accepts: {
    role: "fontFamily"
  },
  setData: function (data) {
    if (data.role === "fontFamily") {
      this.setFontFamily(data.fontFamily)
    }
  },
  // getBoldStyle(){
  //   return target.getStyle("fontWeight") === "bold";
  // },
  // setBoldStyle(value){
  //   target.setStyle("fontWeight", value ? "bold" : "normal");
  // },
  getStyle: function (styleName) {
    if (this.getSelectionStyles && this.isEditing){
      let selectionPosition;
      if(this.selectionStart === this.selectionEnd){
        selectionPosition = this.selectionStart > 0 ? this.selectionStart - 1 : this.selectionStart;
      }else{
        selectionPosition = this.selectionStart;
      }
      let style = this.getStyleAtPosition(selectionPosition)[styleName];
      return style !== undefined ? style : this[styleName];
    }else{
      return (this[styleName] === undefined ? this['__' + styleName] : this[styleName]);
    }
  },
  getPattern: function (url) {
    let _fill = this.getStyle('fill ');
    return _fill && _fill.source;
  },
  setPattern: function (url) {
    if (!url) {
      this.setStyle('fill');
    } else {
      // var _texture = _.findWhere(this.project.textures, {id: url});
      fabric.util.loadImage(url,  (img) => {
        this.setStyle('fill', new fabric.Pattern({
          source: img,
          repeat: 'repeat'
        }));
      }, this, this.crossOrigin); //todo
    }
  },
  /* getOpacity: function () {
    return this.getStyle('opacity') * 100;
  },
  setOpacity: function (value) {
    this.setStyle('opacity', parseInt(value, 10) / 100);
  },*/
  // getRadius: function () {
  //   return this.get('radius');
  // },
  setShadow: function (options) {
    return this.setProperty('shadow', options ? new fabric.Shadow(options) : null);
  },
  // setRadius: function (value) {
  //   this.setProperty('radius', value);
  // },
  getSpacing: function () {
    return this.get('spacing');
  },
  setSpacing: function (value) {
    this.setProperty('spacing', value);
  },
  getReverted: function () {
    return this.get('reverted');
  },
  setReverted: function (value) {
    this.setProperty('reverted', value);
  },
  getText: function () {
    return this.get('text');
  },
  setFontFamily: function (value,callback) {
    this.setProperty('fontFamily', "" + value);
    this._forceClearCache = true
    this.dirty = true
    this.initDimensions()
    if(value && this.renderOnFontsLoaded){

      let fontsArray = [value];
      // let fontsArray = fabric.fonts.fallbacks
      // if(!fontsArray.includes(fontsArray)){
      //   fontsArray.push(value)
      // }
      this.renderOnFontsLoaded(fontsArray, callback)
    }
    else{
      callback && callback()
    }
  },
  setStyles: function(value,callback){
    this.styles = value ? JSON.parse(JSON.stringify(value)) : {}
    this._forceClearCache = true
    this.dirty = true
    this.initDimensions()
    if(value && this.renderOnFontsLoaded){
      let fonts = this.getUsedFonts()
      this.renderOnFontsLoaded(fonts,callback)
    }
    else{
      callback && callback()
    }
  },
  setText: function (value) {
    this.setProperty('text', "" + value);
  },
  getTextAlign: function () {
    return this.get('textAlign');
  },
  setTextAlign: function (value) {
    this.setProperty('textAlign', value.toLowerCase());
  },
  getBgColor: function () {
    return this.get('backgroundColor');
  },
  setBgColor: function (value) {
    this.setProperty('backgroundColor', value);
  },
  getTextBgColor: function () {
    return this.get('textBackgroundColor');
  },
  setTextBgColor: function (value) {
    this.setProperty('textBackgroundColor', value);
  },
  /**
   * re- redner group when text is modified
   * @private
   */
  _shouldClearDimensionCache: function() {
    var shouldClear = this._forceClearCache;
    shouldClear || (shouldClear = this.hasStateChanged('_dimensionAffectingProps'));
    if (shouldClear) {
      this.dirty = true;
      this._forceClearCache = false;
      if(this.group){
        this.group.dirty = true;
      }
    }
    return shouldClear;
  },
  storeProperties: ["type", "clipPath","frame","deco",'textLines','textTransform'],
  eventListeners: {
    changed: function(e) {
      this.updateState();
      // this.fire("modified", {});
      // if (this.canvas) {
      //   this.canvas.fire("object:modified", {target: this});
      //   this.canvas.renderAll();
      // }
    },
  },

  textCase: "none",
  isText: true,
  getStylePosition(index){
    return this.get2DCursorLocation(index);
  },
  getTextLines(){
    return this.textLines.map(line => line.length);
  },
  setTextLines (val){
    // console.log("text lines",val,this.textLines);
  },
  /**
   * Check if characters in a text have a value for a property
   * whose value matches the textbox's value for that property.  If so,
   * the character-level property is deleted.  If the character
   * has no other properties, then it is also deleted.  Finally,
   * if the line containing that character has no other characters
   * then it also is deleted.
   *
   * @param {string} property The property to compare between characters and text.
   */
  cleanStyle: function (property) {
    if (!this.styles || !property || property === '') {
      return false;
    }
    var obj = this.styles, stylesCount = 0, letterCount, stylePropertyValue,
        allStyleObjectPropertiesMatch = true, graphemeCount = 0, styleObject;
    // eslint-disable-next-line
    for (var p1 in obj) {
      letterCount = 0;
      // eslint-disable-next-line
      for (var p2 in obj[p1]) {
        var styleObject = obj[p1][p2],
            stylePropertyHasBeenSet = styleObject.hasOwnProperty(property);

        stylesCount++;

        if (stylePropertyHasBeenSet) {
          if (!stylePropertyValue) {
            stylePropertyValue = styleObject[property];
          }
          else if (styleObject[property] !== stylePropertyValue) {
            allStyleObjectPropertiesMatch = false;
          }

          if (styleObject[property] === this[property]) {
            delete styleObject[property];
          }
        }
        else {
          allStyleObjectPropertiesMatch = false;
        }

        if (Object.keys(styleObject).length !== 0) {
          letterCount++;
        }
        else {
          delete obj[p1][p2];
        }
      }

      if (letterCount === 0) {
        delete obj[p1];
      }
    }
    // if every grapheme has the same style set then
    // delete those styles and set it on the parent
    for (var i = 0; i < this._textLines.length; i++) {
      graphemeCount += this._textLines[i].length;
    }

    if (allStyleObjectPropertiesMatch && stylesCount === graphemeCount) {

      //edited:  visceroid
      if (stylePropertyValue !== undefined) {
        this[property] = stylePropertyValue;
      }
      this.removeStyle(property);
    }
  },
  fontSizeOptions: [6,7,8,9,10,12,14,18,24,36,48,64],
  //overwritten. Assign _measuringContext property to Editor. not to global Fabric. To avoid text measuring problems on Nodes.
  //_measuringContext will be individual for every editor.
  getMeasuringContext: function() {
    let context = this.editor || fabric;
    // if we did not return we have to measure something.
    if (!context._measuringContext) {
      context._measuringContext = this.canvas && this.canvas.contextCache ||
          fabric.util.createCanvasElement().getContext('2d');
    }
    return context._measuringContext;
  },
  /**
   * Calculate height of line at 'lineIndex'
   * @param {Number} lineIndex index of line to calculate
   * @return {Number}
   */
  getHeightOfLine: function(lineIndex) {
    if(!this.__lineHeights){
      this.initDimensions();
    }
    if (this.__lineHeights[lineIndex]) {
      return this.__lineHeights[lineIndex];
    }

    var line = this._textLines[lineIndex],
        // char 0 is measured before the line cycle because it nneds to char
        // emptylines
        maxHeight = this.getHeightOfChar(lineIndex, 0);
    for (var i = 1, len = line.length; i < len; i++) {
      maxHeight = Math.max(this.getHeightOfChar(lineIndex, i), maxHeight);
    }

    return this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult;
  },

  _render: function(ctx) {

    ctx.save()
    ctx.translate(-this._contentOffsetX, -this._contentOffsetY)

    if(!this.__lineHeights){
      this.initDimensions();
    }
    this._setTextStyles(ctx);
    this._renderTextLinesBackground(ctx);
    this._renderTextDecoration(ctx, 'underline');


    //todo

    this._renderText(ctx);
    //
    // if(this._overflow){
    //   this.spacing = this._overflow
    //
    //   // let overflowedLeft = this._overflow.left - this._translatedX;
    //   // let overflowedTop = this._overflow.top - this._translatedY;
    //   //
    //   // // this.spacingding = this._overflow
    //   // // console.log("!")f
    //   //
    //   //
    //   //
    //   //
    //   // this.width = this.width + overflowedLeft + this._overflow.right
    //   // this.height = this.height + overflowedTop + this._overflow.bottom
    //   //
    //   // this._contentOffsetY = -this._overflow.top
    //   // this._contentOffsetX = -this._overflow.left
    //   //
    //   // // this._translate(overflowedLeft,overflowedTop)
    //   // this._translate(this._overflow.left,this._overflow.top)
    // }else{
    //   delete this.spacing
    // }

    this._renderTextDecoration(ctx, 'overline');
    this._renderTextDecoration(ctx, 'linethrough');
    ctx.restore()
  },
  setSpacingBox(options){
    this.spacingBox = this.canvas.createObject(options)

    this.on("rotating moving scaling skewing modified dimensions:calculated",()=>{
      this.spacing = null;
      this._renderTextCommon(null, 'calc');

      let spacing = this.spacing;
      let width = this.width, height = this.height, left = this.left, top = this.top

      if(spacing){
        width += spacing.left + spacing.right
        height += spacing.top + spacing.bottom

        let rad = fabric.util.degreesToRadians(this.angle)
        top -= spacing.top * Math.cos(rad) * this.scaleY
        left += spacing.top * Math.sin(rad) * this.scaleY
        top -= spacing.left * Math.sin(rad) *  this.scaleX
        left -= spacing.left  * Math.cos(rad)* this.scaleX
      }

      this.spacingBox.set({
        width, height, left, top,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        angle: this.angle,
        originX: this.originX,
        originY: this.originY
      })
    })
  }
});

Object.assign(fabric.IText.prototype,SyncTextMixin,  {
  initialize: function(options,callback) {
    fabric.Text.prototype.initialize.call(this, options,callback);
    this.initBehavior();
  },


  /**
   * Handles keyup event
   * @param {Event} e Event object
   */
  onKeyDown: function(e) {
    if (!this.isEditing || this.inCompositionMode) {
      return;
    }
    let action;
    if (e.keyCode in this.keysMap) {
      action = this.keysMap[e.keyCode];
    }
    else if ((e.keyCode in this.ctrlKeysMapDown) && (e.ctrlKey || e.metaKey)) {
      action = this.ctrlKeysMapDown[e.keyCode];
    }
    else {
      return;
    }

    this[action](e);

    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.keyCode >= 33 && e.keyCode <= 40 || action === "selectAll") {
      // if i press an arrow key just update selection
      this.clearContextTop();
      this.renderCursorOrSelection();
    }
    else {
      this.canvas && this.canvas.requestRenderAll();
    }
  },



  //todo do not render ursor here
  render: function(ctx,ignoreTopLayer) {
    this.callSuper('render', ctx);

    if(ignoreTopLayer && this.group){
      this.group._transformDone = false;
    }

    this.clearContextTop();
    // clear the cursorOffsetCache, so we ensure to calculate once per renderCursor
    // the correct position but not at every cursor animation.
    this.cursorOffsetCache = { };
    this.renderCursorOrSelection();

    if(ignoreTopLayer && this.group){
      this.group._transformDone = true;
    }
  },
  _setEditingProps: function() {
    this.hoverCursor = 'text';

    if (this.canvas) {
      this.canvas.defaultCursor = this.canvas.moveCursor = 'text';
    }

    this.borderColor = this.editingBorderColor;
    if(this.lockOnEdit){
      this.hasControls = this.selectable = false;
      this.lockMovementX = this.lockMovementY = true;
    }
  },
  lockOnEdit: true,
  /**
   * @private aded options.e._group for editing texts inside groups
   */
  mouseMoveHandler: function(options) {
    if (!this.__isMousedown || !this.isEditing) {
      return;
    }

    if(this.group){
      options.e._group = this.group;
    }
    var newSelectionStart = this.getSelectionStartFromPointer(options.e),
        currentStart = this.selectionStart,
        currentEnd = this.selectionEnd;
    if (
        (newSelectionStart !== this.__selectionStartOnMouseDown || currentStart === currentEnd)
        &&
        (currentStart === newSelectionStart || currentEnd === newSelectionStart)
    ) {
      return;
    }
    if (newSelectionStart > this.__selectionStartOnMouseDown) {
      this.selectionStart = this.__selectionStartOnMouseDown;
      this.selectionEnd = newSelectionStart;
    }
    else {
      this.selectionStart = newSelectionStart;
      this.selectionEnd = this.__selectionStartOnMouseDown;
    }
    if (this.selectionStart !== currentStart || this.selectionEnd !== currentEnd) {
      this.restartCursorIfNeeded();
      this._fireSelectionChanged();
      this._updateTextarea();
      this.renderCursorOrSelection();
    }

    if(this.group){
      delete options.e._group;
    }
  },
  // stateProperties: fabric.IText.prototype.stateProperties.concat(["styles"]),
  getStyles: function () {
    if (!Object.keys(this.styles).length) return null;
    let _styles = {};
    let _is_not_empty = false;
    for (let row in this.styles) {
      if (Object.keys(this.styles[row]).length) {
        var _row_empty = true;
        for (let char in this.styles[row]) {
          if (Object.keys(this.styles[row][char]).length) {
            if (_row_empty) {
              _styles[row] = {};
              _row_empty = false;
            }
            _styles[row][char] = fabric.util.object.clone(this.styles[row][char]);
          }
        }
        if (!_row_empty) {
          _is_not_empty = true;
        }
      }
    }
    return _is_not_empty && _styles || null;
  },
  initHiddenTextarea_native: fabric.IText.prototype.initHiddenTextarea,
  initHiddenTextarea: function () {
    this.initHiddenTextarea_native();
    this.hiddenTextarea.style.width = "9999px";
    this.hiddenTextarea.style["margin-left"] = "-9999px";
  },
  /**
   * Exits from editing state
   * @return {fabric.IText} thisArg
   * @chainable
   */

  /**
   * Exits from editing state
   * @return {fabric.IText} thisArg
   * @chainable
   */
  exitEditing: function() {
    var isTextChanged = (this._textBeforeEdit !== this.text);
    this.selected = false;
    this.isEditing = false;

    this.selectionEnd = this.selectionStart;

    if (this.hiddenTextarea) {
      this.hiddenTextarea.blur && this.hiddenTextarea.blur();
      this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
      this.hiddenTextarea = null;
    }

    this.abortCursorAnimation();
    this._restoreEditingProps();
    this._currentCursorOpacity = 0;
    if (this._shouldClearDimensionCache()) {
      this.initDimensions();
      this.setCoords();
    }
    this.fire('editing:exited');


    this.updateState();
    if (this.canvas) {
      this.canvas.off('mouse:move', this.mouseMoveHandler);
      this.canvas.fire('text:editing:exited', { target: this });
    }



    if(isTextChanged){
      this.updateState();
      // this.fire('modified');
      // if (this.canvas) {
      //   this.canvas.fire('object:modified', { target: this });
      // }
    }

    return this;
  }
});

Object.assign(fabric.Textbox.prototype,SyncTextMixin,{
  initialize: function(options,callback) {
    fabric.Text.prototype.initialize.call(this, options,callback);
    this.initBehavior();
  },
  isEmptyStyles_overwritten: fabric.Textbox.prototype.isEmptyStyles,
  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles: function(lineIndex) {
    if(!this._styleMap)return true;
    return this.isEmptyStyles_overwritten(lineIndex)
  },
  getStylePosition(index){
    var loc = this.get2DCursorLocation(index);
    if (this._styleMap && !this.isWrapping) {
      var map = this._styleMap[loc.lineIndex];
      if (!map) {
        return null;
      }
      loc.lineIndex = map.line;
      loc.charIndex = map.offset + loc.charIndex;
    }
    return loc;
  }
});