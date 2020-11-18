
import MagicWand from '../../plugins/magicwand.js'
import Pathfinder from '../util/pathfinder.js'




fabric.util.observable(Pathfinder.prototype);

Object.assign(Pathfinder.prototype, {
    tools: [
        "adjacentPixels",
        "pathfinderRadius",
        "pathfinderThreshold",
        "selectionTool",
        "pathfinder",
        "fillWithCurrentColor",
        "clear",
        "pathfinderColor"
    ],
    actions: {

        cancelSelection: {
            key: 'Escape',
            action: function () {
                delete this.shouldModify;
                this.mask = MagicWand.createMask(this.editedImageCanvas.width, this.editedImageCanvas.height);
            }
        },
        modifySelection: {
            key: 'Enter',
            action: function () {
                if (this.shouldModify) {
                    this.modifySelection();
                }
            }
        },
        adjacentPixels: {
            className: 'button-adjacent',
            title: 'selet all',
            type: 'checkbox',
            value: 'adjacentPixels',
            visible: function () {
                return this.selectionTool === 'magic';
            },
            observe: 'tool:changed'
        },
        pathfinderRadius: {
            title: 'radius',
            type: 'range',
            value: {
                get: function () {
                    return this.radius
                },
                set: function (val) {
                    this.radius = val;
                },
                min: 1,
                max: 255
            },
            visible: function () {
                return this.selectionTool === 'brush';
            },
            observe: 'tool:changed'
        },
        pathfinderThreshold: {
            title: 'Threshold',
            type: 'range',
            value: {
                observe: 'threshold:changed',
                get: function () {
                    return this.colorThreshold
                },
                set: function (val) {
                    this.setThreshold(val);
                },
                min: 0,
                max: 255
            },
            visible: function () {
                return this.selectionTool === 'magic';
            },
            observe: 'tool:changed'
        },
        selectionTool: {
            title: 'selection-tool',
            type: 'options',
            value: 'selectionTool',
            menu: {
                selectionToolBrush: {
                    className: 'fa fa-paint-brush',
                    title: 'select-brush',
                    option: 'brush'
                },
                selectionToolRectangle: {
                    className: 'fa fa-square',
                    title: 'select-rectangle',
                    option: 'rectangle'
                },
                selectionElliptical: {
                    className: 'fa fa-circle',
                    title: 'select-circle',
                    option: 'circle'
                },
                selectionToolMagic: {
                    className: 'fa fa-magic',
                    title: 'select-magic',
                    option: 'magic'
                },
                selectionToolLasso: {
                    use: 'shapeSelectionTools',
                    title: 'select-lasso',
                    option: 'lasso',
                    // icon: 'data:image/svg+xml;base64,' + require('base64-loader!./../media/lasso.svg')
                }
            }
        },
        pathfinder: {
            title: 'pathfinder',
            type: 'options',
            value: 'pathfinderMode',
            menu: {
                pathfinderNew: {
                    title: 'pathfinder-new',
                    option: 'new'
                },
                pathfinderExclude: {
                    title: 'pathfinder-exclude',
                    option: 'exclude'
                },
                pathfinderSubstract: {
                    title: 'pathfinder-substract',
                    option: 'substract'
                },
                pathfinderAdd: {
                    title: 'pathfinder-add',
                    option: 'add'
                },
                pathfinderIntersect: {
                    title: 'pathfinder-intersect',
                    option: 'intersect'
                }
            }
        },
        fillWithCurrentColor: {
            title: 'fillWithCurrentColor',
            className: 'fa fa-paint-brush'
        },
        clear: {
            className: 'fa fa-eraser',
            id: 'Pathfinder-clear',
            title: 'clear'
        },
        pathfinderColor: {
            title: 'color',
            type: 'color',
            value: 'color'
        }
    }
});

Pathfinder.prototype.drawingTools = {
  brush: {
    mouseUp: function(){
      this.modifySelection();
      this.resetSelectionDrawCanvas();
    },
    mouseMove: function(p){
      if (!this.allowDraw) return;
      this.drawCircle(p.x, p.y, this.radius);
    },
    mouseDown: function(point){
      this.createSelection();
      this.downPoint = point;
      this.createSelectionDrawCanvas();
      this.drawCircle(point.x, point.y, this.radius);
    },
    utils: {
      drawCircle: function (x, y, r) {
        var ctx = this.selectionDrawContext,
          v = this.canvas.viewportTransform;
        ctx.save();
        //  ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        MagicWand.maskSelection( this.selectionDrawCanvas, 0,0, this.mask, 'add');
        this.setSelection(this.mask);
      }
    }
  },
  magic: {
    mouseUp: function(){
      this.shouldModify = true;
    },
    mouseMove: function (p){
      if (!this.allowDraw) return;
      var dist = p.x - this.downPoint.x;

      var val = this._init_thres + dist;
      var thres = Math.min(Math.max(val, 1), 255);
      if (thres != this.colorThreshold) {
        this.setThreshold(thres);
      }
    },
    mouseDown: function (point){
      if (this.shouldModify) {
        this.modifySelection();
      }
      this.downPoint = point;
      this.colorThreshold = 15;
      this.fire('threshold:changed', {threshold: this.colorThreshold});
      this._init_thres = this.colorThreshold;
      this.drawMask(this.downPoint.x, this.downPoint.y, this.adjacentPixels);
      return false;
    },
    utils:{
      drawMask: function (x, y, adjacentPixels) {
        this.asyncronous(this._drawMask.bind(this, x, y, adjacentPixels), 0);
      },
      _drawMask: function (x, y, adjacentPixels) {
        MagicWand.alphaChannel = this.alphaChannel;
        var info = this.getInfo(), mask;
        if (adjacentPixels) {
          MagicWand.floodFill(info, x, y, this.colorThreshold,{},null,function(mask){
            this.setSelection(mask);
          }.bind(this));
        } else {
          mask = MagicWand.selectAll(info, x, y, this.colorThreshold);
          this.setSelection(mask);
        }
      }
    }
  },
  rectangle: {
    mouseDown: function(point) {
      if (this.shouldModify) {
        this.modifySelection();
      }
      this.downPoint = point;
      this.shouldModify = true;
    },
    mouseUp: function(){
      //this.modifySelection();
      //this.resetSelectionDrawCanvas();
    },
    mouseMove: function(p){
      if (!this.allowDraw) return;
      this.drawRectangle(this.downPoint.x, this.downPoint.y, p.x, p.y);
    },
    utils:{
      drawRectangle: function (x, y, x2, y2) {
        var info = this.getInfo(),
          mask = MagicWand.selectRectangle(info, x, y, x2, y2);
        this.setSelection(mask);
      }
    }
  },
  circle: {
    mouseDown: function(point) {
      if (this.shouldModify) {
        this.modifySelection();
      }
      this.downPoint = point;
      this.createSelectionDrawCanvas();
      this.selectionObject = new fabric.Ellipse({
        left: point.x + this.target.left,
        top:  point.y + this.target.top,
        rx:1,
        ry:1,
        hasBorders: false,
        originX: 'center',
        originY: 'center',
        strokeWidth: 1,
        fill: 'transparent',
        stroke: 'transparent'
      });
      this.canvas.add(this.selectionObject);
      this.updateClipPath();
    },
    mouseUp: function(){
      this.canvas.setInteractiveMode("mixed");
      this.selectionObject.setCoords();
      var _this = this;
      this.selectionObject.on('scaling moving rotating',function(){
        _this.updateClipPath();
      });
      this.canvas.setActiveObject(this.selectionObject);
      this.shouldModify = true;
      //  this.modifySelection();
      //  this.resetSelectionDrawCanvas();
    },
    mouseMove: function(p){
      if (!this.allowDraw) return;
      this.selectionObject.set({
        rx: Math.abs((p.x + this.target.left -  this.selectionObject.get('left'))) ,
        ry: Math.abs((p.y + this.target.top  - this.selectionObject.get('top')))
      });

      this.updateClipPath();

    },
    utils:{
      updateClipPath: function () {
        this.resetSelectionDrawCanvas();
        this.selectionObject.fill = 'white';
        this.selectionDrawContext.save();
        this.selectionDrawContext.translate(-this.target.left, - this.target.top);
        this.selectionObject.render(this.selectionDrawContext);
        this.selectionDrawContext.restore();
        this.selectionObject.fill = 'transparent';
        this.mask = MagicWand.maskSelection( this.selectionDrawCanvas);
        this.setSelection(this.mask);
      }
    }
  },
  lasso: {
    mouseUp: function(){
      if(this.readyToClosePath) {
        this._closePath();
      }
    },
    mouseMove: function(p){
      if (!this.allowDraw) return;
      this.drawLine(this._last_point, p)
      this._points.push(p);
      this._last_point = p;
    },
    mouseDown: function(point){
      if(!this.downPoint){
        this.createSelection();
        this.createSelectionDrawCanvas();
        this._path_out = false;
        this.downPoint = point;
        this._points = [];
        this.selectionDrawContext.beginPath();
        this.canvas.on('mouse:move', this._changeCursorOverClosePoint);
      }
      if(this._last_point){
        if(this.readyToClosePath){
          this._closePath();
        }else{
          this.drawLine(this._last_point, point)
          this._last_point = point;
          this._points.push(point);
        }
      }else{

        this.drawLine({x:point.x - 0.5,y: point.y}, {x:point.x + 0.5,y: point.y })
        this._last_point = {x:point.x + 0.5,y: point.y };
        this._points.push(point);
        this.shouldModify = true;
      }
    },
    utils: {
      drawLine: function (p1 ,p2 ) {
        var ctx = this.selectionDrawContext,
          v = this.canvas.viewportTransform;
        ctx.save();
        //ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
        ctx.restore();
        MagicWand.maskSelection(this.selectionDrawCanvas,0,0,this.mask,'add');
        this.setSelection(this.mask);
      },
      _closePath:  function (e) {

        this.allowDraw = false;
        var ctx = this.selectionDrawContext;
        ctx.beginPath();
        ctx.moveTo(this._points[0].x,this._points[0].y)
        for(var i = 1 ; i < this._points.length;i ++){
          ctx.lineTo(this._points[i].x,this._points[i].y)
        }
        ctx.closePath();
        ctx.fill();
        MagicWand.maskSelection(this.selectionDrawCanvas,0,0,this.mask,'add');
        this.setSelection(this.mask);
        this.resetSelectionDrawCanvas();
        this._points = [];
        delete this.downPoint;
        delete this.readyToClosePath;
        delete this._last_point;
        this.canvas.off('mouse:move', this._changeCursorOverClosePoint);
        this.canvas.freeDrawingCursor = 'crosshair';
        this.canvas.setCursor(this.canvas.freeDrawingCursor);
        // this.drawLine(this._last_point, this.downPoint);
      },
      _changeCursorOverClosePoint:  function (e) {
        var canvas = this,
          pathfinder = canvas.pathfinder;
        if(!pathfinder.target)return;
        var ivt = fabric.util.invertTransform(canvas.viewportTransform),
          p = fabric.util.transformPoint(canvas.getPointer(e.e, true), ivt);
        p.x -= pathfinder.target.left;
        p.y -= pathfinder.target.top;
        if ( pathfinder.downPoint && pathfinder.downPoint.distanceFrom(p) < 10) {
          if(!pathfinder._path_out){
            return;
          }
          pathfinder.readyToClosePath = true;
          canvas.freeDrawingCursor = canvas.targetCursor;
          canvas.setCursor(canvas.freeDrawingCursor);
          //console.log(canvas.freeDrawingCursor);
        } else {
          pathfinder._path_out = true;
          pathfinder.readyToClosePath = false;
          canvas.freeDrawingCursor = 'crosshair';
          canvas.setCursor(canvas.freeDrawingCursor);
          // console.log(canvas.freeDrawingCursor);
        }
      }
    }
  }
};

for(var i in Pathfinder.prototype.drawingTools){
  Object.assign(Pathfinder.prototype, Pathfinder.prototype.drawingTools[i].utils)
}
fabric.Pathfinder = Pathfinder;

fabric.Pathfinder.getContours = async function(imageOrImageSrc,callback){
  let clipFiller = new fabric.Pathfinder({});
  let img;
  if(imageOrImageSrc.constructor === String){
    img = await fabric.util.loadImagePromise(imageOrImageSrc)
  }
  else{
    img = imageOrImageSrc;
  }
  clipFiller.setImage(img);
  clipFiller.mask = MagicWand.selectBackground(clipFiller.getInfo(), null, 15);

  let contours = clipFiller.getContours();
  let clipPoints = contours[1].points;
  let pathData = fabric.PencilBrush.prototype.convertPointsToSVGPath(clipPoints).join('');//todo
  callback && callback(pathData);
  return pathData;
};

Object.assign(fabric.Canvas.prototype, {
  pathfinder: false,
  setPathfinder: function (val) {
    if (val) {
      this.pathfinder = new fabric.Pathfinder('pathfinder');
      this.pathfinder.canvas = this;
    }
  },
  getPathfinder: function () {
    return this.pathfinder || this.editor && this.editor.pathfinder;
  }
});

Object.assign(fabric.Editor.prototype, {
  initPathfinder: function () {
    //if(this.pathfinder){

      this.pathfinder = new fabric.Pathfinder({
        editor: this
      });

      this.pathfinder.on("image:changed", function (img) {
        var dataUrl = img.toDataURL();
        if (!this.target._originalElement) {
          this.target._originalElement = this.target._element;
        }
        this.target._element = new Image();

        this.target._element.onload = function(){
          this.target.fire("content:modified")
          this.target.canvas && this.target.canvas.renderAll();
        }.bind(this);

        this.target._element.src = dataUrl;
        this.target._edited = true
        if(this.target.dirty !== "undefined"){
          this.target.dirty = true;
        }


      });
    //}
  }
});

Object.assign(fabric.Editor.prototype, {
  "+eventListeners": {
    "ready": function () {
      this.initPathfinder();
    }
  }
});
