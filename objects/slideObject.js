'use strict';



var isVML = function() { return typeof G_vmlCanvasManager !== 'undefined'; };

fabric.SlideObject = {

  /**
   * @private
   */
  _drawControl: function(control, ctx, methodName, left, top) {
    if (!this.isControlVisible(control)) {
      return;
    }
    var size = this.cornerSize, stroke = !this.transparentCorners && this.cornerStrokeColor;
    var _cornerStyle;
    if(this.cornerStyle.constructor == Object){
      _cornerStyle = this.cornerStyle[control] || this.cornerStyle.all;
    }
    _cornerStyle = this.cornerStyle ;

    switch (_cornerStyle) {
      case 'frame':

        if(control == "mtr"){
          // this.transparentCorners || ctx.clearRect(left, top, size, size);
          ctx[methodName + 'Rect'](left, top, size, size);
          if (stroke) {
            ctx.strokeRect(left, top, size, size);
          }
          return;
        }

        ctx.save();
        ctx.beginPath();
        ctx.translate(left,top);
        switch(control){
          case "tr":
            ctx.translate(size,0);
            ctx.rotate(Math.PI / 2)
            break;
          case "br":
            ctx.translate(size,size);
            ctx.rotate(Math.PI )
            break;
          case "bl":
            ctx.translate(0, size);
            ctx.rotate(-Math.PI / 2)
            break;
          case "mr":
            ctx.translate(size,0);
            ctx.rotate(Math.PI/2 )
            break;
          case "ml":
            ctx.translate(size/2,0);
            ctx.rotate(Math.PI/2 )
            break;
          case "mb":
            ctx.translate(0,size/2);
            break;
        }
        ctx.moveTo(0,0);
        ctx.lineTo(size,0);
        ctx.lineTo(size,size/2);

        if(control[0] == "m"){
          ctx.lineTo(0,size/2);
        }else{
          ctx.lineTo(size/2,size/2);
          ctx.lineTo(size/2,size);
          ctx.lineTo(0,size);
        }
        ctx.closePath();
        ctx[methodName]();
        if (stroke) {
          ctx.stroke();
        }
        ctx.restore();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(left + size/2, top + size/2, size/2, 0, 2 * Math.PI, false);
        ctx[methodName]();
        if (stroke) {
          ctx.stroke();
        }
        break;
      default:
        isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);
        ctx[methodName + 'Rect'](left, top, size, size);
        if (stroke) {
          ctx.strokeRect(left, top, size, size);
        }
    }
  },


  drawOnCanvas: function(canvas,left,top){
    var ctx = canvas.getContext('2d');
    if(!noBorders){
      ctx.lineWidth=1;
      ctx.strokeStyle="yellow";
      ctx.strokeRect(0,0,this.width + 2,this.height+ 2);
      ctx.setLineDash([4,4]);
      ctx.strokeStyle="#000000";
      ctx.strokeRect(0,0,this.width + 2,this.height+ 2);
    }
    ctx.translate(this.width/2  + left,this.height/2 + top);
    var _clipTo = this.clipTo;
    delete this.clipTo;
    this.render(ctx,true);
    this.clipTo = _clipTo;
  },
  boundingRectTool:     false,
  centerTool:     false,
  dimensionsTool: false,
  positionTool: false,
  flipTools:     false,
  orderTools:    false,
  duplicateTool:   false,
  stroke: "transparent",
  onTop: function () {
    return this.canvas._objects.indexOf(this) == this.canvas._objects.length - 1;
  },
  flop: function () {
    this.flipY = !this.flipY;
    this.canvas.renderAll();
  },
  flip: function () {
    this.flipX = !this.flipX;
    this.canvas.renderAll();
  },
  onBottom: function () {
    return this.canvas._objects.indexOf(this) == 0;
  },
  duplicate: function (callback) {
    var __callback = function (el) {
      el.left += 10;
      el.top += 10;
      this.canvas.add(el);
      this.canvas.setActiveObject(el);
      callback && callback(el);
    }.bind(this);
    var el = this.clone(__callback);

    el && __callback(el);
  }
};
fabric.util.object.extend(fabric.Object.prototype, fabric.SlideObject);

var _OBJ = fabric.Object.prototype;

_OBJ.actions = {

  boundingRect: {
    insert: "boundingRectTool",
    type: 'label',
    template: '<dt>L:</dt><dd class="{leftClass}" title="{left}">{roundLeft}</dd><dt>T:</dt><dd class="{topClass}"  title="{top}">{roundTop}</dd><dt>R:</dt><dd class="{rightClass}" title="{right}">{roundRight}</dd><dt>B:</dt><dd class="{bottomClass}"  title="{bottom}">{roundBottom}</dd>',
    value: {
      observe: "modified scaling moving rotating",
      get: function(){
        var _rect = this.getBoundingRect();

        if(this.movementLimits) {

          if (this.movementLimits == this.canvas) {
            var _v = this.canvas.viewportTransform;
            var _mlr = {
              left: _v[4],
              top: _v[5],
              width: (this.canvas.originalWidth || this.canvas.width) * _v[0],
              height: (this.canvas.originalHeight || this.canvas.height)  * _v[3],
              right: 0,
              bottom: 0
            }
          }else{
            _mlr = this.movementLimits.getBoundingRect();
          }


          _rect.bottom = this.movementLimits.height - _rect.height;
          var _t = _rect.top - _mlr.top;
          var _l = _rect.left - _mlr.left;
          var _r = _mlr.width - _rect.width - _l;
          var _b = _mlr.height - _rect.height - _t;
        }else{
          _t = _rect.top;
          _l = _rect.left;
          _b = this.canvas.height - _rect.height - _rect.top;
          _r  = this.canvas.width - _rect.width - _rect.left;
        }

        return {
          topClass: _t > 0 ? "positive" : _t < 0 ? "negative" : "zero",
          bottomClass: _b > 0 ? "positive" : _b < 0 ? "negative" : "zero",
          leftClass: _l > 0 ? "positive" : _l < 0 ? "negative" : "zero",
          rightClass: _r > 0 ? "positive" : _r < 0 ? "negative" : "zero",
          top:    _t,
          left:   _l,
          bottom: _b,
          right:  _r,
          roundTop:    Math.round(_t),
          roundLeft:   Math.round(_l),
          roundBottom: Math.round(_b),
          roundRight:  Math.round(_r)
        }
      }
    }
  },
  position: {
    insert: 'positionTool',
    title: 'position',
    type: 'menu',
    menu: {
      objectLeft: {
        type:   'number',
        title:  'left',
        value: {
          set: function (val) {
            this.left = val;
            this.fire("modified");
            this.canvas.fire("object:modified", {target: this});
            this.canvas.renderAll();
          },
          get: function () {
            return this.left;
          },
          observe: "modified"
        }
      },
      objectTop: {
        type:   'number',
        title:  'top',
        value: {
          set: function (val) {
            this.top = val;
            this.fire("modified");
            this.canvas.fire("object:modified", {target: this});
            this.canvas.renderAll();
          },
          get: function () {
            return this.top;
          },
          observe: "modified"
        }
      }
    }
  },
  dimensions: {
    insert: 'dimensionsTool',
    title: 'dimensions',
    type: 'menu',
    menu:{
      objectWidth: {
        type:   'number',
        title:  'width',
        value: {
          set: function(val){
            this.dimensionsWidthValue = val;
            this.scaleToWidth(val *  this.canvas.getZoom());
            this.fire("modified");
            this.canvas.fire("object:modified",{target:this});
            this.canvas.renderAll();
            delete this.dimensionsWidthValue;
          },
          get: function(){
            if(this.dimensionsWidthValue){
              return this.dimensionsWidthValue;
            }
            return Math.round(this.getBoundingRect().width / this.canvas.getZoom());
          },
          observe: "modified"
        }
      },
      objectHeight: {
        type:   'number',
        title:  'height',
        value: {
          set: function(val){
            this.scaleToHeight(val *  this.canvas.getZoom());
            this.dimensionsHeightValue = val;
            this.fire("modified");
            this.canvas.fire("object:modified",{target:this});
            this.canvas.renderAll();
            delete this.dimensionsHeightValue;
          },
          get: function(){
            if(this.dimensionsHeightValue){
              return this.dimensionsHeightValue;
            }
            return Math.round(this.getBoundingRect().height / this.canvas.getZoom());
          },
          observe: "modified"
        }
      }
    }
  },
  objectCenter: {
    className:  'fa fa-bullseye',
    insert:     'centerTool',
    title: 'Center',
    action: function(){
      this.center();
      this.setCoords();
    }
  },
  objectFlip: {
    className:  'fa fa-arrows-h',
    insert:     'flipTools',
    title:      'flip',
    action:     _OBJ.flip
  },
  objectFlop: {
    className:  'fa fa-arrows-v',
    insert:     'flipTools',
    title: 'flop',
    action: _OBJ.flop
  },
  objectForward: {
    insert:     'orderTools',
    title: 'bring forward',
    className:  'fa fa-level-up',
    action: _OBJ.bringForward,
    disabled: _OBJ.onTop
  },
  objectBackward: {
    insert:         'orderTools',
    title:      'send backwards',
    className:  'fa fa-level-down',
    action:     _OBJ.sendBackwards,
    disabled:   _OBJ.onBottom
  },
  objectRemove: {
    className:  'fa fa-trash',
    title:      'Delete',
    key:        "Delete",
    action:     _OBJ.remove
  },
  objectDuplicate: {
    className:  'fa fa-clone',
    insert:         'duplicateTool',
    title:      'Duplicate',
    action:     _OBJ.duplicate
  },
  /*  colors: {
   className: 'fa fa-paint-brush',
   type: 'menu',
   title: 'colors',
   toggled: true,
   menu: {
   fill: {
   type: 'color',
   title: 'fill',
   value: 'fill'
   },
   stroke: {
   type: 'color',
   title: 'stroke',
   value: 'stroke'
   }
   }
   }*/
};
