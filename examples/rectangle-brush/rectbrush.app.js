
fiera.app({
  creadentials: false,
  canvasContainer: "canvas",
  toolbar: {
    canvas:       "slide-menu",
    objects:  {
      container: "object-menu",
      marginY: -50
    }
  },
  resizable: true,
  prototypes: {
    Rect: {
      fill   : 'rgba(0, 255, 94, 0.4)',
      stroke : 'rgb(0, 255, 94)',
      strokeWidth: 1
    },
     RectangleBrush: {
       minWidth : 50,
       minHeight : 50,
       drawingLimits: "backgroundImage"
     },
    MaskRectangle:{
      hasBorders: false,
      boundingRectTool: true,
      dimensionsTool: true,
      positionTool: true,
      responsiveBorders: true,
      fill   : 'rgba(0, 255, 94, 0.4)',
      stroke : 'rgb(0, 255, 94)',
      movementLimitMode : 'fit',
      minWidth : 50,
      transparentCorners: false,
      strokeWidth: 1,
      minHeight : 50,
      resizable : true,
      cornerStyle: 'frame',
      movementLimits: 'canvas',
      wholeCoordinates: true
    },
    SlideCanvas: {
      zoomToPointEnabled: true,
      zoomCtrlKey: false,
      history: true,
      historyTools: true,
      zoomTools: true,
      backgroundColor:'black',
      shiftInverted : true,
      controlsAboveOverlay: true,
      selection : false,
      mouseWheelEnabled: true,
      interactiveMode: "mixed",
      fillBackgroundColorOverCanvas: true,
      changeDimensionOnZoom: false,
      freeDrawingBrush: 'RectangleBrush'
    }
  },
  eventListeners: {
    SlideCanvas: {
      'before:render': function(){
        this.clearContext(this.contextTop);
      },
      'rect:created': function(event){
        var _rect = event.rect;
        _rect.left = Math.round(_rect.left);
        _rect.top = Math.round(_rect.top);
        _rect.width = Math.round(_rect.width);
        _rect.height = Math.round(_rect.height);
        var rect = new fabric.MaskRectangle(_rect);
        this.add(rect);
        this.setActiveObject(rect);
        this.renderAll();
      },
      'after:render': function(e){
        if(!this.backgroundImage)return;

        var _scale = this.getZoom();
        var _ctx = this.contextTop;
        _ctx.save();

        _ctx.translate(20,20)
        var _size = fabric.util.getProportions(this.backgroundImage,{width: 100, height: 100})
        _ctx.globalAlpha = 0.5;
        _ctx.fillRect(0,0,_size.width, _size.height);
        _ctx.strokeStyle = "red";

        var v = this.viewportTransform;

        var x1 = -v[4] * _size.scale / _scale;
        var y1 = -v[5] * _size.scale / _scale;
        var x2 = x1 + this.width * _size.scale / _scale;
        var y2 = y1 + this.height * _size.scale / _scale;

        x1 = Math.max(x1,0);
        y1 = Math.max(y1,0);
        x2 = Math.min(x2,_size.width);
        y2 = Math.min(y2,_size.height);

        _ctx.globalAlpha = 1;
        _ctx.beginPath();
        _ctx.moveTo(x1,y1);
        _ctx.lineTo(x2,y1);
        _ctx.lineTo(x2,y2);
        _ctx.lineTo(x1,y2);
        _ctx.lineTo(x1,y1);

        _ctx.fill();
        _ctx.globalCompositeOperation = "source-in";
        _ctx.drawImage(this.backgroundImage._element,0,0,_size.width, _size.height)
        _ctx.globalCompositeOperation = "source-over";
        _ctx.stroke();
        _ctx.strokeRect(0,0,_size.width, _size.height);
        _ctx.restore();

        this._debug_intersections()
      }
    }
  },
  callback: function(){
    var _app = this;

    fabric.Image.fromURL("expo2.jpg",function(img) {
      _app.canvas.setOriginalSize(img);
      _app.canvas.setBackgroundImage(img);
      _app.canvas.centerAndZoomOut();
      _app.canvas.setInteractive(true);
    });
  }
})
