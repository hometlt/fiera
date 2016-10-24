'use strict';


fabric.Guidline = fabric.util.createClass(fabric.Object,{
  top : 0,
  left : 0,
  height : 1,
  width : 1,
  griddable: false,
  responsiveBorders : true,
  groupSelectable : false,
  hasControls : false,
  hasBorders : false,
  wholeCoordinates : true,
  stored: false,
  movementLimits: "#__0",
  initialize: function(options){
    this.x = Math.round(options.x);
    this.y = Math.round(options.y);

    if(this.x){
      this.lockMovementY = true;
      this.hoverCursor = "ew-resize";
    }

    if(this.y){
      this.lockMovementX = true;
      this.hoverCursor = "ns-resize";
    }

    this.on({
      "removed": function () {
        var i = this.canvas.guidlines.indexOf(this);
        this.canvas.guidlines.splice(i,1)
      },
      "modified": function () {
        if(this.x){
          this.x = this.left + this.width / 2;
        }
        if(this.y){
          this.y = this.top + this.height / 2;
        }
      },
      "object:dblclick": function () {
        this.remove();
      },
      "added": function () {
        if (this.x) {
          this.height = this.canvas.height;
          this.width = Math.ceil(10 / this.canvas.viewportTransform[0]);
          if(this.width % 2){
            this.width++;
          }
          this.left = this.x - this.width /2;
        }
        if (this.y) {
          this.width = this.canvas.width;
          this.height = Math.ceil(10 / this.canvas.viewportTransform[0]);
          if(this.height % 2){
            this.height++;
          }
          this.top = this.y - this.height /2;
        }
        this.setCoords();
        if(this.canvas.guidlines){
          this.canvas.guidlines.push(this);
        }else{
          this.visible = false;
        }
      }
    });

  },
  render: function(ctx){
    ctx.save();

    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    if(this.x){
      ctx.translate(this.left + this.width / 2,0);
      ctx.scale(1 / this.canvas.getZoom(), 1 / this.canvas.getZoom());
      ctx.moveTo(0,0);
      ctx.lineTo(0,this.canvas.height);
    }
    if(this.y) {
      ctx.translate(0, this.top + this.height / 2);
      ctx.scale(1 / this.canvas.getZoom(), 1 / this.canvas.getZoom());
      ctx.moveTo(0, 0);
      ctx.lineTo(this.canvas.width, 0);
    }
    ctx.stroke();
    ctx.restore();
  }
});

fabric.Ruler = fabric.util.createClass({
  initialize: function (options) {

    this.canvas =options.canvas;
    this.type = options.type;
    if(options.size)this.size = options.size;
    var size;
    if (options.type == "vertical") {
      size = {
        width: this.size,
        height: this.canvas.height
      };
    } else {
      size = {
        width: this.canvas.width,
        height: this.size
      };
    }

    this.canvasElement = fabric.util.createCanvasElementWithSize(size);
    this.canvas.wrapperEl.appendChild(this.canvasElement);
    this.rulerContext = this.canvasElement.getContext('2d');
    // this.rulerContext.translate(-0.5,-0.5);
    window.rulerContext = this.rulerContext;
    this.rulerContext.imageSmoothingEnabled = false;
    this.render();
    var _this = this;
    this.canvas.on({
      'viewport:scaled changed modified' : function(){
        _this.render();
      }
    })

  },
  size: 30,
  orientation: "revert",
  font: "10px Open Sans",
  delimeters: [50, 10, 5, 1],
  render: function () {


    var v = this.type == "vertical";
    var scale = this.canvas.getZoom();
    var _ctx = this.rulerContext;

    _ctx.mozImageSmoothingEnabled = false;

    _ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    if(v) {
      this.canvasElement.height = this.canvas.height;
      _ctx.textAlign = 'end';
    }else{
      this.canvasElement.width = this.canvas.width;
    }

    var _this = this;
    function push(h){
      var _x = Math.round( l * scale);
      if(false){
        var x1 = 0;
        var x2 = h;
      }else{
        var x1 = _this.size;
        var x2 = _this.size - h;
      }
      if(v){
        _ctx.moveTo(x1,_x);
        _ctx.lineTo(x2, _x);
      } else{
        _ctx.moveTo(_x,x1);
        _ctx.lineTo(_x,x2);
      }
      _ctx.stroke();
    }
    var w = ( v ? this.canvas.height : this.canvas.width) / scale;
    var _del = [], _labels = [];
    var i = 0, j = 0, k = 0, l = 0, d = this.delimeters, m;

    for (i = 0; i < w / d[0]; i++) {
      k = 0;
      j = 0;
      l = i * d[0] + j * d[1] + k * d[2];
      if (l >= w)break;
      push(10);

      _ctx.font = this.font;
      if (v) {
        _ctx.strokeText(l,_this.size - 6,l * scale + 12);
      } else {
        _ctx.strokeText(l,l * scale + 2,_this.size - 8 );
      }

      if (scale > 1) {

        for (j = 0; j < d[0] / d[1]; j++) {
          k = 0;
          l = i * d[0] + j * d[1] + k * d[2];
          if (l >= w)break;
          push(7);


          if (scale > 2) {
            for (k = 0; k < d[1] / d[2]; k++) {
              l = i * d[0] + j * d[1] + k * d[2];
              if (l >= w)break;
              push(4);
            }


            if (scale > 5) {

              for (m = 0; m < d[2] / d[3]; m++) {
                for (k = 0; k < d[1] / d[2]; k++) {
                  l = i * d[0] + j * d[1] + k * d[2] + m * d[3];
                  if (l >= w)break;
                  push(2);
                }
              }

            }
          }

        }
      }
    }

    this._elements = _del;
    this._labels = _labels;
    _ctx.stroke();
  }
});

fabric.SlideCanvas.addPlugin("loaders",function(){
  this.createGuidlines(this.options.guidlines);
});

fabric.util.object.extend(fabric.SlideCanvas.prototype,{
  guidlinesEnabled: false,
  createGuidline: function(data){
    if(data.y !== undefined){
      if(fabric.Guidline.prototype.wholeCoordinates){
        data.y = data.y && Math.round(data.y);
      }
      if(!fabric.util.object.findWhere(this.guidlines,{y: data.y})){
        var gl = new fabric.Guidline({y: data.y});
        this.add(gl);
      }
    }else if(data.x !== undefined){
      if(fabric.Guidline.prototype.wholeCoordinates){
        data.x = data.x && Math.round(data.x);
      }
      if(!fabric.util.object.findWhere(this.guidlines,{x: data.x})){
        var gl = new fabric.Guidline({x: data.x});
        this.add(gl);
      }
    }
  },
  createGuidlines: function(guidlines){
    if(guidlines && this.guidlinesEnabled){
      this.guidlines = [];
      for(var i in guidlines){
        this.createGuidline(guidlines[i])
      }
    }
  },
  createRulers: function(){
    this.vRuler = new fabric.Ruler({
      canvas: this,
      type: "vertical"
    });
    this.hRuler = new fabric.Ruler({
      canvas: this,
      type: "horizontal"
    });

    this.hRuler.canvasElement.style.position = "absolute";
    this.hRuler.canvasElement.style.left = 0;
    this.hRuler.canvasElement.style.bottom = "100%";
    this.vRuler.canvasElement.style.position = "absolute";
    this.vRuler.canvasElement.style.top = 0;
    this.vRuler.canvasElement.style.right = "100%";


    this.guidlines = [];


    var _canvas = this;

    this.on('viewport:scaled', function(){

      this.guidlines.forEach(function(gl){
        if(gl.x){
          gl.width = Math.ceil(10 / gl.canvas.viewportTransform[0]);
          if(gl.width % 2){
            gl.width++;
          }
          gl.left = gl.x - gl.width/2;
        }
        if(gl.y){
          gl.height = Math.ceil(10 / gl.canvas.viewportTransform[0]);
          if(gl.height % 2){
            gl.height++;
          }
          gl.top = gl.y - gl.height/2;
        }
      })
    });


    this.hRuler.canvasElement.onclick  = function(e){
      var pointer = _canvas.getPointer(e);
      _canvas.createGuidline({x : pointer.x })
    };


    this.vRuler.canvasElement.onclick  = function(e){
      var pointer = _canvas.getPointer(e);

      _canvas.createGuidline({y : pointer.y })
    };
  }
})


fabric.SlideCanvas.addPlugin("savers",function(propertiesToInclude, _data){
  if(propertiesToInclude.indexOf('guidlines') !== -1 && this.guidlines) {
    _data.guidlines = [];
    this.guidlines.forEach(function(_gl){
      if(_gl.x){
        _data.guidlines.push({x : _gl.x })
      }
      if(_gl.y){
        _data.guidlines.push({y : _gl.y })
      }
    })
  }
});
