import {getProportions} from "../../util/size.js";

export const FmZoom = {
  name: "zoom",
  prototypes: {
    Canvas:  {
      zoomCtrlKey: true,
      mouseWheelZoom : false,
      changeDimensionOnZoom: true,
      zoomToPointEnabled: true,
      maxZoom: 10,
      autoCenterAndZoomOut: false,
      zoomStep: 0.1,
      scaleFactor: 1.1,
      minZoom:  0.8,
      _zoomToPointNative  : fabric.Canvas.prototype.zoomToPoint,
      drawZoomArea (ctx,left, top ,width, height ){
        ctx.save();
        ctx.translate(left || 0, top || 0);
        let _scale = this.getZoom();
        let _size = getProportions(this.backgroundImage, {width: width || 100, height: height || 100});
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0,0,_size.width, _size.height);
        ctx.strokeStyle = "red";

        let v = this.viewportTransform;

        let x1 = -v[4] * _size.scaleX / _scale;
        let y1 = -v[5] * _size.scaleY / _scale;
        let x2 = x1 + this.width * _size.scaleX / _scale;
        let y2 = y1 + this.height * _size.scaleY / _scale;

        x1 = Math.max(x1,0);
        y1 = Math.max(y1,0);
        x2 = Math.min(x2,_size.width);
        y2 = Math.min(y2,_size.height);

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x1,y2);
        ctx.lineTo(x1,y1);

        ctx.fill();
        ctx.clip();
        // ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(this.backgroundImage._element,0,0,_size.width, _size.height);
        // ctx.globalCompositeOperation = "source-over";
        // ctx.drawImage(this.backgroundImage._element,0,0,_size.width, _size.height)
        ctx.stroke();
        ctx.strokeRect(0,0,_size.width, _size.height);
        ctx.restore();
      },
      setMouseWheelZoom(val){
        this.mouseWheelZoom = val;
        this.on("mouse:wheel",this.wheelZoom);
      },
      zoomToPoint(point, newZoom){

        if(this.changeDimensionOnZoom){
          let size = this.getOriginalSize()
          this.setDimensions({
            width: Math.round(size.width * newZoom),
            height: Math.round(size.height * newZoom)
          },{
            // cssOnly: true
          });
        }

        // if(!this.changeDimensionOnZoom){
        this._zoomToPointNative( point, newZoom);
        // }
        this.fire('viewport:translate',{x: this.viewportTransform[4], y : this.viewportTransform[5]});
        this.fire('viewport:scaled', {scale: newZoom});
        if(this.editor){
          this.editor.fire("viewport:scaled",{scale: newZoom, target: this});
        }
      },
      resetViewport () {
        _canvas.viewportTransform[0] = 1;
        _canvas.viewportTransform[3] = 1;
        _canvas.viewportTransform[4] = 0;
        _canvas.viewportTransform[5] = 0;
        _canvas.renderAll();
        for (let i in this._objects) {
          this._objects[i].setCoords();
        }
      },
      getMaxZoom () {
        return this.maxZoom;
      },
      getMinZoomOptions () {
        let container;
        if(this.changeDimensionOnZoom) {
          let scrollParent = this.getScrollContainer();
          container = scrollParent || this.wrapperEl;
        }
        else{
          container = this.wrapperEl;
        }
        let _containerSize = {
          width:  container.clientWidth,
          height: container.clientHeight
        };
        let _bgSize = {
          width: this.originalWidth || this.width,
          height: this.originalHeight || this.height
        };
        let _maxSize = {
          width: _containerSize.width  * this.minZoom,
          height: _containerSize.height * this.minZoom
        };
        let size = getProportions(_bgSize, _maxSize, 'contain');

        if(size.scale > 1){
          return {
            scale: 1,
            width: this.originalWidth,
            height: this.originalHeight,
          }
        }

        return size;
      },
      centerAndZoomOut () {
        if(!this.lowerCanvasEl){
          return;
        }

        let options = this.getMinZoomOptions();

        if(this.changeDimensionOnZoom) {
          this.setZoom(options.scale);
          let scrollParent = this.getScrollContainer();
          if(scrollParent){
            scrollParent.scrollTop = (scrollParent.scrollHeight - scrollParent.clientHeight) / 2;
            scrollParent.scrollLeft = (scrollParent.scrollWidth - scrollParent.clientWidth) / 2;
          }
        }else{
          let _containerSize = {
            width:  this.wrapperEl.clientWidth,
            height: this.wrapperEl.clientHeight
          };
          let vpt = this.viewportTransform.slice(0);
          vpt[0] = options.scale;
          vpt[3] = options.scale;
          vpt[4] = (_containerSize.width - options.width) / 2;
          vpt[5] = (_containerSize.height - options.height) / 2;

          this.setViewportTransform(vpt);
        }

      },
      centerOnObject(tag){
        let br = tag.getBoundingRect();
        let ct = this.viewportTransform;
        br.width /= ct[0];
        br.height /= ct[3];
        let size = {
          width: br.width * 1.1,
          height: br.height * 1.1
        };

        let sizeOptions = getProportions(size,this);
        let _w = (this.width / sizeOptions.scaleX - size.width ) / 2;
        let _h = (this.height / sizeOptions.scaleY - size.height) / 2;
        let _l = (br.left  - ct[4]) / ct[0];
        let _t = (br.top - ct[5]) / ct[3];

        let x1 = [
          sizeOptions.scaleX,
          0,0,
          sizeOptions.scaleY,
          - tag.left * sizeOptions.scaleX + (tag.width * 0.05 + _w) * sizeOptions.scaleX,
          - tag.top * sizeOptions.scaleY + (tag.height * 0.05 + _h )* sizeOptions.scaleY
        ];
        let x2 = [
          sizeOptions.scaleX,
          0,0,
          sizeOptions.scaleY,
          - _l  * sizeOptions.scaleX + (br.width * 0.05 + _w) * sizeOptions.scaleX,
          - _t  * sizeOptions.scaleY + (br.height * 0.05 + _h )* sizeOptions.scaleY
        ];

        this.setViewportTransform(x2);
        this.fire("viewport:scaled",{scale: sizeOptions.scaleX});
        if(this.editor){
          this.editor.fire("viewport:scaled",{scale: sizeOptions.scaleX});
        }
        this.renderAll();
      },
      wheelZoom (e) {
        let event = e.e;


        if(!this.mouseWheelZoom || this.zoomCtrlKey && !event.ctrlKey){
          return;
        }
//Find nearest point, that is inside image END
        let zoomStep;// = 0.1 * event.deltaY;
        if (event.deltaY < 0) {
          zoomStep = 1 + this.zoomStep;
        } else {
          zoomStep = 1 - this.zoomStep;
        }

        let cZoom = this.getZoom();
        let newZoom = cZoom * zoomStep;
        let minZoom = this.getMinZoomOptions().scale;

        let maxZoom = this.getMaxZoom()
        if(newZoom > maxZoom){
          newZoom = maxZoom;
        }


        if(this.zoomToPointEnabled){
          let point = new fabric.Point(event.offsetX, event.offsetY);
          let _x = this.viewportTransform[4];
          let _y = this.viewportTransform[5];

          // Find nearest point, that is inside image
          // It is needed to prevent canvas to zoom outside image
          if(this.originalWidth){
            let _w = this.originalWidth * cZoom + _x;

            if (point.x < _x) {
              point.x = _x;
            }
            if (point.x > _w) {
              point.x = _w;
            }
          }
          if(this.originalHeight){
            let _h = this.originalHeight * cZoom + _y;
            if (point.y < _y) {
              point.y = _y;
            }
            if (point.y > _h) {
              point.y = _h;
            }
          }

          if (  minZoom > newZoom) {
            if(this.autoCenterAndZoomOut){
              this.centerAndZoomOut();
            }
            else if(event.deltaY < 0 ){
              this.zoomToPoint(point, newZoom);
            }
          } else {
            this.zoomToPoint(point, newZoom);
          }
        }else{
          this.setZoom(newZoom);
        }
        for (let i in this._objects) {
          this._objects[i].setCoords();
        }
        this.renderAll();
        event.stopPropagation();
        event.preventDefault();
        return false; //preventing scroll page
      },
      getOrignalCenter (){
        return {
          x: (this.width  / 2) * this.viewportTransform[0] + this.viewportTransform[4],
          y: (this.height / 2) * this.viewportTransform[3] + this.viewportTransform[5]
        };
      },
      eventListeners: {
        // "dimensions:modified" () {
        //   // if (this.autoCenterAndZoomOut) {
        //   //   this.centerAndZoomOut();
        //   // }
        // },
        "background-image:loaded" (event) {
          if (this.autoCenterAndZoomOut) {
            this.centerAndZoomOut();
          }
        },
        //todo loading:after do not work
        "loaded loading:after" (event) {
          if (this.autoCenterAndZoomOut && (this.originalHeight || this.originalWidth)) {
            this.centerAndZoomOut();
          }
        }
      }
    },
    Editor:  {
      zoom: 1,
      _getScrollContainer () {
        let val = this.canvasContainer;
        let parents = $(val).parents();
        for (let i = 0; i < parents.length; i++) {
          let el = parents[i];
          if ($(el).css("overflow") !== "visible") {
            val = el;
            return el;
          }
        }
        return null;
      },
      dragScrollContainer (e) {
        this._scrollElement.scrollLeft = this._startScrollLeft - (e.clientX - this.dragCursorPosition.x);
        this._scrollElement.scrollTop = this._startScrollTop - (e.clientY - this.dragCursorPosition.y);
      },
      initScrollContainerDragging () {
        this._scrollElement = this._getScrollContainer();
        this._startScrollTop = this ._scrollElement.scrollTop;
        this._startScrollLeft = this._scrollElement.scrollLeft;
      },
      setMouseDragging () {
        let editor = this;
        let scrollElement = this._getScrollContainer();
        scrollElement.addEventListener('mousedown', initDrag, false);

        function initDrag(e) {
          editor.dragCursorPosition = {x: e.clientX, y: e.clientY};
          editor.initScrollContainerDragging();
          document.addEventListener('mousemove', doDrag, false);
          document.addEventListener('mouseup', stopDrag, false);
          e.preventDefault();
          e.stopPropagation();
        }
        function doDrag(e) {
          editor.dragScrollContainer(e);
          e.preventDefault();
          e.stopPropagation();
        }
        function stopDrag(e) {
          document.removeEventListener('mousemove', doDrag, false);
          document.removeEventListener('mouseup', stopDrag, false);
          e.preventDefault();
          e.stopPropagation();
        }
      },
      setZoom(val) {
        this.canvas.setZoom(val)
      },
      getZoom() {
        if (!this.canvas) {
          return this.zoom;
        }
        return this.canvas.getZoom()
      },
      zoomIn() {
        let canvas = this.canvas;
        let point = canvas.getOrignalCenter();
        let scaleValue = canvas.getZoom() * canvas.scaleFactor;

        let _max =  this.getMaxZoom();
        let _min =  this.getMinZoomOptions().scale;
        if(scaleValue > _max)scaleValue = _max;
        if(scaleValue < _min)scaleValue = _min;
        
        canvas.zoomToPoint(point, scaleValue);
      },
      zoomOut() {
        let canvas = this.canvas;
        let point = canvas.getOrignalCenter();
        let scaleValue = canvas.getZoom() / canvas.scaleFactor;

        let _max =  this.getMaxZoom();
        let _min =  this.getMinZoomOptions().scale;
        if(scaleValue > _max)scaleValue = _max;
        if(scaleValue < _min)scaleValue = _min;
        canvas.zoomToPoint(point, scaleValue);
      }
    }
  }
}
