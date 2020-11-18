

/**
 * Привязать один объект к другому. Координаты привязанного объекта будут вычисляться относительно Выбранного объекта на канвасе.
 * Объект будет перемещаться ввемсте с объектом, к которому привязан.
 */

export const FmRelative = {
  name: "relative",
  prototypes: {
    Object: {
      relative: null,
      relativePoint: "tl",
      relativeCoordinates: null,
      updateRelativeCoordinates: function () {
        //     this.setCoords();
        //     let _c = this.relativeObject.getCenterPoint();
        //     this.relativeLeft = this.left - _c.x;
        //     this.relativeTop = this.top - _c.y;

        let obj = this.relativeObject;
        this.relativeCoordinates = {
          left: this.left - obj.left,
          top: this.top - obj.top
        }

        // let _boundRect = obj.getBoundingRect();
        // if(this.relativeAngle === undefined) {
        //   this.relativeAngle = obj.angle - this.angle ;
        // }
        // if(this.relativeLeft === undefined) {
        //   this.relativeLeft = this.left - obj.left ;//this.left ?  : _boundRect.width/2 / obj.canvas.getZoom() + 20;
        // }
        // if(this.relativeTop === undefined){
        //   this.relativeTop = this.top - obj.top; //this.top ?  : _boundRect.height/2 / obj.canvas.getZoom() + 20;
        // }
      },
      setRelativeCoordinates(val) {
        this.relativeCoordinates = val;
        if (this.relativeObject) {
          this.relativeObject.updateBindedObject(this);
        }
      },
      updateBindedObject (tag) {
        this.setCoords();
        let point = this.aCoords[tag.relativePoint];

        // let point = {x: this.left, y: this.top};

        let angle = tag.angle
        if(tag.relativeAngle !== undefined){
          angle = this.angle + tag.relativeAngle
        }

        tag.set({
          left: point.x + tag.relativeCoordinates.left,
          top: point.y + tag.relativeCoordinates.top,
          angle: angle
        })
        tag.setCoords();
      },
      setRelative (obj) {
        let tag = this;

        if (obj.constructor === String) {
          this.on("added", function () {
            obj = this.canvas.getObjectByID(obj);
            this.setRelative(obj);
          });
          return;
        }

        let _foo = obj.updateBindedObject.bind(obj, tag);

        this.relativeObject = obj;

        if (!this.relativeCoordinates) {
          this.updateRelativeCoordinates()
        }

        function onAdded() {
          let _proc = this.canvas.processing;
          if (!_proc) this.canvas.processing = true;
          if(!tag.canvas){
            this.canvas.add(tag);
          }
          if (!_proc) this.canvas.processing = false;
        }

        function onRemoved() {
          let _proc = this.canvas.processing;
          if (!_proc) this.canvas.processing = true;
          if(tag.canvas) {
            tag.removeFromCanvas();
          }
          if (!_proc) this.canvas.processing = false;
        }

        tag.on('removed', function () {
          // let _proc = this.canvas.processing;
          // if(!_proc)this.canvas.processing = true;
          // obj.removeFromCanvas();
          // if(!_proc)this.canvas.processing = false;
          obj.off('removed', onRemoved);
          obj.off('added', onAdded);
          obj.off('moving rotating scaling modified', _foo);
        });

        obj.on('added', onAdded);
        obj.on('removed', onRemoved);
        obj.on('moving rotating scaling modified', _foo);
        tag.on('moving rotating scaling', tag.updateRelativeCoordinates);

        obj.updateBindedObject(tag);
      }
    }
  }
}
