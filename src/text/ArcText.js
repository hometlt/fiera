
/**
 * FabricJS ArcText Plugin
 * Extend IText functionality.
 * - Can render text on an arc, both inside and outside
 * - Have a boolean state for arc visibility "showCurvature"
 * - Bounding is limited to the text object only.
 * - Curvature is a number BETWEEN -100 and +100. Where middle "0" will be a straight line,"-X"upwards,"+X" is downwards.
 * - Arc radius calculated as  R = (100-curvature)^2
 */
// import Controls from "../../modules/canvas/controls.js";
export const FmArcText = {
  name: "arc-text",
  optionalDependencies: ["controls"],
  prototypes: {
    ArcText:{
      type: "arc-text",
      "+_dimensionAffectingProps": ["curvature"],
      "+cacheProperties": ["curvature"],
      "+stateProperties": ["curvature"],
      prototype: fabric.IText,
      curvature: 25,
      // showCurvature: true,
      // setShowCurvature(value){
      //   this.showCurvature = value
      //   if(this.canvas){
      //     this.canvas.renderAll()
      //   }
      // },
      renderCharCallback(method, ctx, lineIndex, charIndex, endCharIndex, left, top, fullDecl){
        for(let index = charIndex; index <= endCharIndex; index++){
          let tr = this._charTransformations[lineIndex][index];
          if(ctx){
            ctx.textAlign = "center"
          }
          if(tr.char){ //|| _char[index]
            this.runCharRendering(method, ctx, tr.char , tr.cl.x  , tr.cl.y ,this.curvature > 0 ? - tr.charAngle : - tr.charAngle - Math.PI , fullDecl, "center");
          }
        }
      },
      drawControlsInterface (ctx) {
        // if(!this.showCurvature)return
        ctx.save()
        ctx.strokeStyle = this.borderColor
        ctx.lineWidth = this.borderWidth
        let cx = -this._contentOffsetX * this.scaleX
        let cy = (this._curvingCenter.y   -this._contentOffsetY)* this.scaleY

        if(this.curvature){
          ctx.beginPath();
          ctx.fillStyle = this.borderColor
          ctx.ellipse(cx,cy, this.cornerSize/2, this.cornerSize/2, 0,  0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx,cy, this._radius* this.scaleX, this._radius* this.scaleY, 0,  0, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.restore()
      },
      getSelectionStartFromPointer(e) {
        let mouseOffset = this.getLocalPointer(e);

        let relX = mouseOffset.x + (- this.width /2 + this._contentOffsetX)* this.scaleX,
            relY = mouseOffset.y+ ( - this.height/2 -  this._curvingCenter.y  + this._contentOffsetY) * this.scaleY,
            angle = Math.atan2(- relX, -relY),
            radius = Math.sqrt(relX*relX +relY*relY)/ this.scaleY,
            selectedLine = 0;

        if(this.curvature > 0){
          while(radius < this._linesRads[selectedLine]){
            selectedLine ++;
          }
        }
        else{
          if(angle < 0)angle +=Math.PI*2
          while(radius > this._linesRads[selectedLine]){
            selectedLine ++;
          }
        }

        let charIndex = 0;
        for (let i = 0; i < selectedLine; i++) {
          charIndex += this._textLines[i].length + this.missingNewlineOffset(i);
        }

        let specials =this._specialArray && this._specialArray[selectedLine]
        let specialsLen = 0;
        let diff = Infinity, diff2, j
        for(j = 0; j< this._charTransformations[selectedLine].length ;j++){
          if(specials && specials[j] && specials[j] === specials[j - 1] || this._charTransformations[selectedLine][j].isDiacritic ){
            specialsLen++
            continue;
          }
          diff2 = Math.abs(this._charTransformations[selectedLine][j].leftAngle - angle) % (Math.PI*2)
          if(diff < diff2){
            let result = charIndex + j - 1 - specialsLen
            specialsLen = 0;
            return result;
          }
          diff = diff2
          specialsLen = 0;
        }
        return charIndex + j -1;
      },
      _getLineLeftOffset: function(lineIndex,width) {
        if(!width) return 0;
        let lineWidth = this.getLineWidth(lineIndex);
        if (this.textAlign === 'center') return (width - lineWidth) / 2;
        if (this.textAlign === 'right') return width - lineWidth;
        if (this.textAlign === 'justify-center' && this.isEndOfWrapping(lineIndex)) return (width - lineWidth) / 2;
        if (this.textAlign === 'justify-right' && this.isEndOfWrapping(lineIndex)) return width - lineWidth;
        return 0;
      },
      _renderTextDecoration: function(ctx, type) {
        if (!this[type] && !this.styleHas(type)) {
          return;
        }
        let currentFill,_size,size, dy,_dy,lastFill, line, lastDecoration, charStart, currentDecoration;
        ctx.save()
        for (let i = 0, len = this._textLines.length; i < len; i++) {
          if (!this.type && !this.styleHas(type, i)) {
            continue;
          }
          charStart = 0
          lastDecoration = this.getValueOfPropertyAt(i, 0, type);
          lastFill = this.getValueOfPropertyAt(i, 0, 'fill');
          size = this.getHeightOfChar(i, 0);
          dy = this.getValueOfPropertyAt(i, 0, 'deltaY');
          let j;
          for (j = 0; j < this._textLines[i].length; j++) {
            currentDecoration = this.getValueOfPropertyAt(i, j, type);
            currentFill = this.getValueOfPropertyAt(i, j, 'fill');
            _size = this.getHeightOfChar(i, j);
            _dy = this.getValueOfPropertyAt(i, j, 'deltaY');

            if (currentDecoration !== lastDecoration || currentFill !== lastFill || _size !== size || _dy !== dy){

              if(lastDecoration && lastFill){
                let offset = this.offsets[type] * size + dy
                this._drawTextLinesDecorationSector(ctx, lastFill,offset, i, charStart, j)
              }

              lastDecoration = currentDecoration;
              lastFill = currentFill;
              size = _size;
              dy = _dy;
              charStart = j;
            }
          }
          if (currentDecoration && currentFill) {
            let offset = this.offsets[type] * size + dy
            this._drawTextLinesDecorationSector(ctx, currentFill ,offset, i, charStart, j)
          }
        }
        ctx.restore()
        this._removeShadow(ctx);
      },
      enlargeSpaces: function(width) {

        let diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
        for (let i = 0, len = this._textLines.length; i < len; i++) {
          if (this.textAlign !== 'justify' && (i === len - 1 || this.isEndOfWrapping(i))) {
            continue;
          }
          accumulatedSpace = 0;
          line = this._textLines[i];
          currentLineWidth = this.getLineWidth(i);
          if (currentLineWidth < width && (spaces = this.textLines[i].match(this._reSpacesAndTabs))) {
            numberOfSpaces = spaces.length;
            diffSpace = (width - currentLineWidth) / numberOfSpaces;
            for (let j = 0, jlen = line.length; j <= jlen; j++) {
              charBound = this.__charBounds[i][j];
              if (this._reSpaceAndTab.test(line[j])) {
                charBound.width += diffSpace;
                charBound.kernedWidth += diffSpace;
                charBound.left += accumulatedSpace;
                accumulatedSpace += diffSpace;
              }
              else {
                charBound.left += accumulatedSpace;
              }
            }
          }
        }
      },
      initDimensions: function() {
        if (this.__skipDimension) {
          return;
        }
        this._splitText();
        this._clearCache();


        let detectedFeaturesLines = []


        for (let li = 0, len = this._textLines.length; li < len; li++) {
          this.getLineWidth(li);
          this.getHeightOfLine(li);


          let line = this._textLines[li]
          detectedFeaturesLines[li] = []
          let components = []
          let timeToRender,actualStyle,nextStyle
          let lineLength = line.length - 1
          //todo use this.interateTextChunks
          for (let charIndex = 0; charIndex <= lineLength; charIndex++) {
            timeToRender = charIndex === lineLength;
            components.push(line[charIndex])
            if (!timeToRender) {
              // if we have charSpacing, we render char by char
              actualStyle = actualStyle || this.getCompleteStyleDeclaration(li, charIndex);
              nextStyle = this.getCompleteStyleDeclaration(li, charIndex + 1);
              timeToRender = this._hasStyleChanged(actualStyle, nextStyle)||(this._specialArray && this._specialArray[li] && this._specialArray[li][charIndex] !== this._specialArray[li][charIndex + 1])
            }

            if (timeToRender) {

              if(this._specialArray && this._specialArray[li] && this._specialArray[li][charIndex]){
                detectedFeaturesLines[li].push({
                  components: components,
                  position: charIndex - components.length + 1
                })
              }
              else{

                let ff = actualStyle ? actualStyle.fontFamily : this.styles && this.styles[li] && this.styles[li][charIndex] && this.styles[li][charIndex].fontFamily || this.fontFamily;
                let detected = fabric.fonts.getTextFeatures(components.join(""),ff,this.features)
                for(let detectedInstance of detected){
                  detectedInstance.position += charIndex - components.length + 1
                  detectedFeaturesLines[li].push(detectedInstance)
                }
              }
              components = [];
              actualStyle = nextStyle;
            }
          }
        }

        let textHeight = this.calcTextHeight();
        let textWidth = this.calcTextWidth();
        // this._radius =   Math.pow(100-Math.abs(this.curvature),2)
        this._radius =  Math.abs( 10000/ (this.curvature || 1))

        let cx = 0,
            cy = this.curvature > 0 ?  textHeight / 2 + this._radius : - textHeight / 2 - this._radius
        this._curvingCenter = {x: cx, y: cy}

        let globalOffset
        if(this.curvature > 0){
          globalOffset = textHeight
        }
        else{
          globalOffset = 0
        }

        this._linesRads = []

        if (this.textAlign.indexOf('justify') !== -1) {
          this.enlargeSpaces(textWidth);
        }


        let ct = this._charTransformations = this.__charBounds.map((row, i) => {

          let currentLeft =  -textWidth/2 + this._getLineLeftOffset(i,textWidth)


          let lineOffset = 0
          if(this.__lineInfo){
            currentLeft += this.__lineInfo[i].renderedLeft
          }



          let heightOfLine = this.getHeightOfLine(i);
          let charOffset = (heightOfLine - heightOfLine / this.lineHeight) +  heightOfLine * this._fontSizeFraction / this.lineHeight

          if(this.curvature > 0){
            globalOffset -= heightOfLine
          }
          else{
            globalOffset += heightOfLine
          }
          let rowOffset
          rowOffset = this._radius + globalOffset;

          if(i !== this.__charBounds.length - 1 ) this._linesRads.push(rowOffset)

          return row.map((bounds,j) => {
            let decl = this._getStyleDeclaration(i, j)
            let deltaY = decl && decl.deltaY || 0

            let bottomRadius,topRadius,charRadius,lineRadius, leftAngle, charAngle ,rightAngle, renderLeftAngle, renderRightAngle;

            if(this.curvature > 0){
              bottomRadius = deltaY + rowOffset
              topRadius = deltaY + rowOffset + heightOfLine
              charRadius = deltaY + rowOffset + charOffset
              lineRadius = deltaY + rowOffset + heightOfLine - (heightOfLine / this.lineHeight)

              let midRadius = (bottomRadius*3 + topRadius*2)/5
              leftAngle =  -(currentLeft + bounds.left) / midRadius
              rightAngle =  -(currentLeft + bounds.left + bounds.width) / midRadius
              charAngle = - (currentLeft + bounds.left + bounds.width / 2) / midRadius
              if(this.useRenderBoundingBoxes && bounds.contour){
                renderLeftAngle =  -(currentLeft + bounds.left + bounds.contour.x) / midRadius
                renderRightAngle =  -(currentLeft + bounds.left + bounds.contour.x + bounds.contour.w) / midRadius
              }

            }else{
              bottomRadius = deltaY + rowOffset
              topRadius = deltaY + rowOffset - heightOfLine
              charRadius = deltaY + rowOffset - charOffset
              lineRadius = deltaY + rowOffset - heightOfLine + (heightOfLine / this.lineHeight)

              let midRadius = (bottomRadius*2 + topRadius*3)/5
              leftAngle = Math.PI +(currentLeft + bounds.left) / midRadius
              rightAngle = Math.PI +(currentLeft + bounds.left + bounds.width) / midRadius
              charAngle = Math.PI + (currentLeft + bounds.left + bounds.width / 2) / midRadius
              if(this.useRenderBoundingBoxes && bounds.contour){
                renderLeftAngle = Math.PI +(currentLeft + bounds.left+ bounds.contour.x) / midRadius
                renderRightAngle = Math.PI +(currentLeft + bounds.left  + bounds.contour.x + bounds.contour.w) / midRadius
              }
            }

            let rsin =  Math.sin(rightAngle),
                rcos = Math.cos(rightAngle),
                lsin = Math.sin(leftAngle),
                lcos = Math.cos(leftAngle),
                csin = Math.sin(charAngle),
                ccos = Math.cos(charAngle),
                bboxrsin,bboxrcos,bboxlsin,bboxlcos;

            if(this.useRenderBoundingBoxes && bounds.contour){
              bboxrsin =  Math.sin(renderRightAngle)
              bboxrcos = Math.cos(renderRightAngle)
              bboxlsin = Math.sin(renderLeftAngle)
              bboxlcos = Math.cos(renderLeftAngle)
            }

            let ct = {
              char: this._textLines[i][j],
              charAngle,
              leftAngle,
              rightAngle,
              charRadius,
              bottomRadius,
              topRadius,
              lineRadius,
              renderLeftAngle,
              renderRightAngle,
              bl: {x: cx - bottomRadius * lsin, y: cy - bottomRadius * lcos},
              br: {x: cx - bottomRadius * rsin, y: cy - bottomRadius * rcos},
              tl: {x: cx - topRadius * lsin,    y: cy - topRadius * lcos},
              tr: {x: cx - topRadius * rsin,    y: cy - topRadius * rcos},
              nl: {x: cx - lineRadius * lsin,   y: cy - lineRadius * lcos},
              nr: {x: cx - lineRadius * rsin,   y: cy - lineRadius * rcos},
              cl: {x: cx - charRadius * csin,   y: cy - charRadius * ccos}
            }
            if(this.useRenderBoundingBoxes && bounds.contour){

              let isEndLine = i === this._textLines.length - 1

              let contourRadius = isEndLine ? lineRadius + (this.curvature < 0?  1: -1 ) *  this.__lineInfo[i].renderedBottom : bottomRadius;


              ct.contour = {
                bl: {x: cx - contourRadius * bboxlsin, y: cy - contourRadius * bboxlcos},
                br: {x: cx - contourRadius * bboxrsin, y: cy - contourRadius * bboxrcos},
                tl: {x: cx - topRadius * bboxlsin,    y: cy - topRadius * bboxlcos},
                tr: {x: cx - topRadius * bboxrsin,    y: cy - topRadius * bboxrcos}
              }
            }

            return ct
          })
        })

        for(let li in detectedFeaturesLines){
          for(let feature of detectedFeaturesLines[li]) {

            let first = ct[li][feature.position];
            let last = ct[li][feature.position + feature.components.length - 1]
            first.char = feature.components
            first.charAngle = (first.charAngle + last.charAngle) / 2

            let midAngle = (first.leftAngle + last.rightAngle) / 2
            first.cl = {x: cx - first.charRadius * Math.sin(midAngle),   y: cy - first.charRadius * Math.cos(midAngle)};

            for(let fci = 1 ; fci < feature.components.length; fci++){
              delete ct[li][feature.position + fci].char
            }
          }
        }

        //Fix Diacritics symbols on a curve
        let diacritics = ['́','̀','̂','̌','̋' ,'̏','̃', '̇', '̣' , '·' , '̈', 'ː', '̆', '̑', '͗' , '̃' , '҃' , '̩', '̄' , '̱', '⃓', '̷', '̵', '̊' , '̓', '̒' , '̔' , '̉' , '̛' , '̦', '̧' , '̡', '̢' , '̨' , '͝' , '͡' , '' , '͞' , '͠']
        for(let i in this._charTransformations){
          for(let j in this._charTransformations[i]){
            if(this._charTransformations[i][j].char && diacritics.includes(this._charTransformations[i][j].char)){
              for(let k = j; k--;){
                if(this._charTransformations[i][k].char ){
                  this._charTransformations[i][k].char += this._charTransformations[i][j].char
                  this._charTransformations[i][j].isDiacritic = true;
                  delete this._charTransformations[i][j].char
                  break;
                }
              }
            }
          }
        }

        let yMin = Infinity, yMax =- Infinity, xMin = Infinity, xMax = -Infinity
        for(let i =0; i < ct.length; i++) {
          let row = ct[i]
          let isEndLine = i === ct.length - 1
          for(let j =0; j < row.length - 1; j++) {
            let cs = row[j]
            if(this.useRenderBoundingBoxes && cs.contour){
              xMin = Math.min(xMin, cs.contour.tl.x, cs.contour.tr.x, cs.contour.bl.x, cs.contour.br.x)
              xMax = Math.max(xMax, cs.contour.tl.x, cs.contour.tr.x, cs.contour.bl.x, cs.contour.br.x)
              yMin = Math.min(yMin, cs.contour.tl.y, cs.contour.tr.y, cs.contour.bl.y, cs.contour.br.y)
              yMax = Math.max(yMax, cs.contour.tl.y, cs.contour.tr.y, cs.contour.bl.y, cs.contour.br.y)
            }
            else{
              let bl = isEndLine ? cs.nl : cs.bl;
              let br = isEndLine ? cs.nr : cs.br;
              xMin = Math.min(xMin, cs.tl.x, cs.tr.x, bl.x, br.x)
              xMax = Math.max(xMax, cs.tl.x, cs.tr.x, bl.x, br.x)
              yMin = Math.min(yMin, cs.tl.y, cs.tr.y, bl.y, br.y)
              yMax = Math.max(yMax, cs.tl.y, cs.tr.y, bl.y, br.y)
            }
          }
        }


        let leftOverflow = -xMin - textWidth/2
        let rightOverflow = xMax - textWidth/2
        let topOverflow = -yMin - textHeight/2
        let bottomOverflow = yMax - textHeight/2

        this.width = Math.max(textWidth + leftOverflow + rightOverflow , this.MIN_TEXT_WIDTH)
        this.height = textHeight + topOverflow + bottomOverflow
        this._contentOffsetY = bottomOverflow / 2 - topOverflow /2
        this._contentOffsetX = rightOverflow / 2 - leftOverflow /2

        let _translateX = this.originX === "left" ? leftOverflow : this._contentOffsetX;

        this._translate(_translateX, topOverflow)

        this.canvas && this.setCoords()
        this.fire("dimensions:calculated")
        this.saveState({ propertySet: '_dimensionAffectingProps' });
      },
      _drawTextLinesDecorationSector(ctx,currentColor,offset, line,charStart,charEnd){
        ctx.fillStyle = currentColor;
        ctx.lineWidth = this.fontSize / 15

        let startChar = this._charTransformations[line][charStart]
        let endChar = this._charTransformations[line][charEnd-1]


        ctx.beginPath()
        if(this.curvature < 0){
          ctx.arc(this._curvingCenter.x,this._curvingCenter.y,startChar.charRadius+1+offset, - startChar.leftAngle - Math.PI/2,-endChar.rightAngle -Math.PI/2 ,1)
        }
        else{
          ctx.arc(this._curvingCenter.x,this._curvingCenter.y,startChar.charRadius-1-offset, - startChar.leftAngle - Math.PI/2,-endChar.rightAngle -Math.PI/2 ,0)

        }
        ctx.stroke()
      },
      _contextSelectBackgroundSector(ctx,line,charStart,charEnd,fullLineRadius){

        ctx.beginPath()
        let startChar = this._charTransformations[line][charStart];
        let endChar = this._charTransformations[line][charEnd];

        ctx.moveTo(startChar.tl.x, startChar.tl.y )

        let radius =fullLineRadius? startChar.bottomRadius : startChar.lineRadius

        if(this.curvature < 0){
          ctx.arc(this._curvingCenter.x,this._curvingCenter.y,radius, - startChar.leftAngle - Math.PI/2,-endChar.rightAngle -Math.PI/2 ,1)
        }
        else{
          ctx.arc(this._curvingCenter.x,this._curvingCenter.y,radius, - startChar.leftAngle - Math.PI/2,-endChar.rightAngle -Math.PI/2 ,0)
        }

        ctx.lineTo(endChar.tr.x, endChar.tr.y )

        if(this.curvature < 0){
          ctx.arc(this._curvingCenter.x,this._curvingCenter.y,startChar.topRadius,-endChar.rightAngle -Math.PI/2, - startChar.leftAngle - Math.PI/2 ,0)
        }
        else{
          ctx.arc(this._curvingCenter.x,this._curvingCenter.y,startChar.topRadius,-endChar.rightAngle -Math.PI/2, - startChar.leftAngle - Math.PI/2 ,1)
        }
        ctx.closePath()
      },
      _renderTextLinesBackground: function(ctx) {
        if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) {
          return;
        }
        let originalFill = ctx.fillStyle, lastColor, charStart, currentColor;


        for (let i = 0, len = this._textLines.length; i < len; i++) {
          if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor', i)) {
            continue;
          }
          charStart = 0
          lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');

          let j
          for (j = 0; j < this._textLines[i].length; j++) {
            currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
            if (currentColor !== lastColor) {
              if(lastColor){
                ctx.fillStyle = lastColor;
                this._contextSelectBackgroundSector(ctx, i, charStart, j - 1)
                ctx.fill()
              }
              charStart = j;
              lastColor = currentColor;
            }
          }
          if (currentColor) {
            ctx.fillStyle = currentColor;
            this._contextSelectBackgroundSector(ctx, i, charStart, j - 1)
            ctx.fill()
          }
        }
        ctx.fillStyle = originalFill;
        this._removeShadow(ctx);
      },
      renderSelection(boundaries, ctx) {
        let selectionStart = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
            selectionEnd = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd,
            start = this.get2DCursorLocation(selectionStart),
            end = this.get2DCursorLocation(selectionEnd),
            startLine = start.lineIndex,
            endLine = end.lineIndex,
            startChar = start.charIndex < 0 ? 0 : start.charIndex,
            endChar = end.charIndex < 0 ? 0 : end.charIndex;

        ctx.fillStyle = this.selectionColor;
        ctx.translate(-this._contentOffsetX,-this._contentOffsetY)

        for (let i = startLine; i <= endLine; i++) {
          let charStart = (i === startLine) ? startChar : 0 ,
              charEnd = (i >= startLine && i < endLine) ? this._textLines[i].length : endChar

          // let isEndLine = i === endLine;
          // for (let j = charStart; j < charEnd; j++) {
          //   let tr = this._charTransformations[i][j];
          //   if(isEndLine){
          //     ctx.moveTo(tr.nr.x, tr.nr.y )
          //     ctx.lineTo(tr.nl.x, tr.nl.y )
          //   }
          //   else{
          //     ctx.moveTo(tr.br.x, tr.br.y )
          //     ctx.lineTo(tr.bl.x, tr.bl.y )
          //   }
          //   ctx.lineTo(tr.tl.x,tr.tl.y)
          //   ctx.lineTo(tr.tr.x,tr.tr.y)
          // }

          this._contextSelectBackgroundSector(ctx,i,charStart,charEnd - 1, i !== endLine)
          ctx.fill();
        }

      },
      renderCursor(boundaries, ctx) {
        let cursorLocation = this.get2DCursorLocation(),
            lineIndex = cursorLocation.lineIndex,
            charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
            multiplier = this.scaleX * this.canvas.getZoom(),
            cursorWidth = this.cursorWidth / multiplier;

        if (this.inCompositionMode) {
          this.renderSelection(boundaries, ctx);
        }

        let tr = this._charTransformations[cursorLocation.lineIndex][cursorLocation.charIndex];

        ctx.save();
        ctx.translate(-this._contentOffsetX,-this._contentOffsetY)
        ctx.lineWidth = cursorWidth
        ctx.strokeStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
        ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;

        ctx.beginPath()
        ctx.moveTo(tr.nl.x,tr.nl.y )
        ctx.lineTo(tr.tl.x,tr.tl.y )
        ctx.stroke();
        ctx.restore();
      }
    },
    Text: {
      setCurvature(value){
        this.saveStates(["curvature"]);
        if(value){
          if(!this.curvature){
            if(this.__dimensionAffectingProps){
              this.__dimensionAffectingProps["curvature"] = 0
            }
            this._klass = this.__proto__
            this.__proto__ = fabric.ArcText.prototype
          }
        }
        else{
          this._translate(0,0)
          this._translatedY = 0
          this._translatedX = 0
          this._contentOffsetY = 0
          this._contentOffsetX = 0
          this.__proto__ = this._klass
        }
        this.curvature = value;
        this.updateState();
      },
      // actions: {
      //   showCurvature: {
      //     className: "far fa-pen-square",
      //     type: "checkbox",
      //   },
      //   curvature: {
      //     className: "far fa-circle",
      //     action: function(target){
      //       if(target.curvature) {
      //         target.__lastCurvature = target.curvature;
      //         target.setCurvature(0)
      //       }else{
      //         target.setCurvature(target.__lastCurvature || 100 )
      //       }
      //     },
      //     type: "range",
      //     title: "curvature",
      //     min: -90,
      //     max: 90,
      //     fixed: 0
      //   }
      // }
    }
  }
} 