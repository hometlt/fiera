'use strict';


fabric.on("canvas:created",function(e){
  if(e.target.areaActivating){
    e.target.setAreaActivating(true,true);
  }
});

fabric.SlideCanvas
  .addPlugin("loaders",function(cb){
    if(!this.options.offsets)return cb();
    this.setOffsets(this.options.offsets,cb);
  })
  .addPlugin("loaders",function(cb){
    if(!this.options.areas)return cb();
    this.setAreas(this.options.areas,cb);
  })
  .addPlugin("loaders",function(cb){
    if(!this.options.helpers)return cb();
    this.setHelpers(this.options.helpers,cb);
  });

fabric.util.object.extend(fabric.SlideCanvas.prototype, {
  _update_clip_rect: function () {
    if (this.areas || !this._backgroundLayer[0]) return;
    var geometry = this.getRect(this.offsets);
    this._backgroundLayer[0].set(geometry);
  },
  offsets: {left : 0,top : 0, right: 0, bottom:0},
  setHelpers: function (helpers, callback) {
    var self = this;
    if(helpers){
      for (var i in helpers){
        fabric.util.createObject(helpers[i],function(helper){
          self._backgroundLayer.push(helper);
          self.renderAll();
        });
      }
    }
    callback && callback();
  },
  areaActivating: false,
  addElementsInsideActiveArea: false,
  areaProperties: {
    originX: 'left',
    originY: 'top',
    fill: 'transparent',
    strokeDashArray: [5, 5],
    strokeWidth: 1,
    stroke: 'black',
    resizable: true
    //selectable: false
  },
  setAreaProperty: function (property, value) {
    this["area_" + property] = value;
    for (var i in this._backgroundLayer) {
      this._backgroundLayer[i][property] = value;
    }
    this.renderAll();
  },
  setActiveArea: function (area) {
    if (area === true) {
      area = this._backgroundLayer[0] || null;
    }
    if (this.activeArea) {
      this.activeArea.setStroke("#000");
    }
    this.activeArea = area;
    if (area) {
      area.setStroke("#B7F1ED");
    }
  },
  setAreaActivating: function (value, force) {
    if (force || (value && !this.areaActivating)) {
      this.areaActivating = true;
      this.on("object:modified", function (e) {
        if(this.editingObject){
          return;
        }
        //todo event! не ъотел бы это тут испольовать,но работает
        var pointer = this.getPointer(event, true);
        var target = this._searchPossibleTargets(this._backgroundLayer, pointer);
        if(this._currentTransform && target && this.target.movementLimits != target){
          this.target.movementLimits = this.target.clipTo = target;
          this.setActiveArea(target);
        }
      });
      this.on("mouse:down", function (e) {
        var pointer = this.getPointer(e.e, true);
        var target = this._searchPossibleTargets(this._backgroundLayer, pointer);
        if (target) {
          this.setActiveArea(target);
        }
      })
    }
  },
  createArea: function (area, callback) {

    var _this = this;

    var _finalize = function (path) {
      path.id = area.id;
      _this._backgroundLayer.push(path);
      path.canvas = _this;
      callback();
    };

    var createClipPath = function (img) {
      clipFiller.setImage(img);
      clipFiller.mask = MagicWand.selectBackground(clipFiller.getInfo(), null, 15);

      var contours = clipFiller.getContours();
      var clipPoints = contours[1].points;
      var pathData = fabric.PencilBrush.prototype.convertPointsToSVGPath(clipPoints).join('');//todo
      var path = new fabric.Path(pathData, _this.areaProperties);
      var _scale = geometry.width / img.width;
      path.set({
        left: geometry.left + path.left * _scale,
        top: geometry.top + path.top * _scale,
        strokeWidth: _this.areaProperties.strokeWidth / _scale,
        scaleX: _scale,
        scaleY: _scale
      });
      //path.points = clipPoints;
      return path;
    };

    var geometry = this.getRect(area);

    if (area.path) {
      var path = new fabric.Path(area.path, this.areaProperties);
      var _scale = path.width / geometry.width;
      path.set({
        left: geometry.left + path.left * _scale,
        top: geometry.top + path.top * _scale,
        scaleX: 1,
        scaleY: 1
      });
      _finalize(path);
    } else if (area.src) {
      var clipFiller = new fabric.Pathfinder({});
      fabric.util.loadImage(area.src, function (img) {
        var path = createClipPath(img);
        _finalize(path);
      });

    } else {
      var path = new fabric.Rect(this.areaProperties);
      path.set(geometry);
      _finalize(path);
    }

    /*
     app.canvas.setOffsets({
     right:  1,
     left:   1,
     top:    1,
     bottom: 1
     });


     app.canvas.clipTo = function (ctx) {
     var zoom = app.canvas_config.width / app.canvas.backgroundImage.filters[0].pathfinder.mask.width;
     ctx.save();
     ctx.scale(zoom, zoom);
     app.clipFiller.traceInner(ctx);
     ctx.restore();
     };*/
  },
  removeArea: function (area, callback) {

    var objs = this.getObjects();
    for (var i in objs) {
      if (objs[i].movementLimits == area) {
        delete objs[i].movementLimits;
      }
      if (objs[i].clipTo == area) {
        //if(objs[i].olcClipToID){
        //    objs[i].clipToID = objs[i].oldClipToID;
        //}
        delete objs[i].clipTo;
        //objs[i].olcClipToID = area.id;
      }
    }
  },
  setOffsets: function (offsets, callback) {
    this.offsets = offsets;
    this.setAreas([offsets], callback);
  },
  setAreas: function (areas, callback) {
    areas = areas || [];
    if (this._backgroundLayer) {
      for (var i = this._backgroundLayer.length; i--;) {
        this.removeArea(this._backgroundLayer[i]);
      }
    }

    this._backgroundLayer.length = 0;
    this.areas = areas;

    //if(!areas || !areas.length){
    //  callback();
    //  return;
    //}

    var cb = fabric.util.queueLoad(areas.length + 1, function () {
      if (this.areaActivating) {
        if (this._backgroundLayer[0]) {
          this.setActiveArea(true);
        } else {
          this.activeArea = null;
        }
      }

      var objs = this.getObjects();
//work with object
      if (!areas.length) {
        objs.length && this.clear();
      } else {
        var _area = this.activeArea || this._backgroundLayer[0];
        for (var i in objs) {
          var obj = objs[i];
          obj.clipTo = _area;
          obj.setMovementLimits(_area);
          obj.setCoords();
        }
      }


      callback && callback.call(this);
    }.bind(this));

    for (var i in areas) {

      if (!areas[i].id) {
        areas[i].id = "__" + i;
      }
      this.createArea(areas[i], cb);
    }
    cb();

    this.renderAll();
  },
  specialProperties: ["offsets","areas","helpers"]
})
