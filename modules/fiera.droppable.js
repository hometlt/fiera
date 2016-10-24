'use strict';


fabric.on("canvas:created",function(e){
  if(e.target.droppable){
    e.target.initDragAndDrop();
  }
});

fabric.util.object.extend(fabric.SlideCanvas.prototype, {
  droppable: false, //{}
  isDropAvailable: function (droppable, data) {

    for (var i in droppable) {
      if (droppable[i].constructor == Array) {
        if (droppable[i].indexOf(data[i]) == -1)return false;
      } else {
        if(droppable[i] == "*")continue;
        if (droppable[i] != data[i]) return false;
      }
    }
    return true;
    //return (this.supportedTypes == "*" || this.supportedTypes.indexOf(type)!= -1)
  },
  drop: function (data) {
    var _this = this;

    if (data.category == "background") {
      this.setBackgroundImage(data.src, this.renderAll.bind(this))
    }
    else {
      fabric.util.createObject(data, function (el) {
        _this.add(el);
        _this.setActiveObject(el);
      });
    }


    //fabric.util.createObject(data, function (el) {
    //  app.canvas.add(el);
    //  app.canvas.setActiveObject(el);
    //});
  },
  initDragAndDrop: function () {
    this.on("mouse:drop", function (e) {
      var _x = (e.x - e.offsetX);
      var _y = (e.y - e.offsetY)
      var _w = (e.data.width || e.width  );
      var _h = (e.data.height || e.height );
      if (e.data.scaleX) {
        var _scaleX = e.data.scaleX / this.viewportTransform[0]

      } else {
        _scaleX = 1;
        _w /= this.viewportTransform[0]
      }

      if (e.data.scaleY) {
        var _scaleY = e.data.scaleY / this.viewportTransform[3];
      } else {
        _scaleY = 1;
        _h /= this.viewportTransform[3]
      }

      if (e.data.left) {
        _x += (e.data.left + e.data.strokeWidth) / this.viewportTransform[0];
      }
      if (e.data.top) {
        _y += (e.data.top + e.data.strokeWidth) / this.viewportTransform[3];
      }
      var data = fabric.util.object.extend({}, e.data, {
        scaleX: _scaleX,
        scaleY: _scaleY,
        left: _x,
        top: _y,
        width: _w,
        height: _h,
        originalWidth: e.data.width,
        originalHeight: e.data.height
      });

      var event = e.originalEvent;
      var pointer = this.getPointer(event, true);

      var target = this._searchPossibleTargets(this._backgroundLayer, pointer);
      if (target) {
        this.setActiveArea(target);
        data.clipTo = "#" + target.id;
        data.movementLimits = "#" + target.id;
      }


      if (e.target && e.target.droppable) {
        if (this.isDropAvailable(e.target.droppable, e.data)) {
          e.target.deactivate();
          e.target.drop(data);
        }
      } else {
        if (this.droppable && this.isDropAvailable(this.droppable, e.data)) {
          this.drop(data);
        }
      }
    });
    this.on("mouse:dragenter", function (e) {
      if (e.target && e.target.droppable) {
        if (this.isDropAvailable(e.target.droppable, e.data)) {
          e.target.activate();
          e.e.helper.css("cursor", "alias");
          this.setCursor("alias");
        } else {
          e.e.helper.css("cursor", "not-allowed");
          this.setCursor("not-allowed");
        }
      }
    });
    this.on("mouse:dragleave", function (e) {
      if (e.target && e.target.droppable) {
        if (this.isDropAvailable(e.target.droppable, e.data)) {
          this._activated = false;
          e.target.deactivate()
        }
        e.e.helper.css("cursor", "pointer");
      }
    });
  }
});
