import {getProportions} from "../../util/size.js";

let ALIASING_LIMIT = 2



export const FmObject = {
  name: "object-ext",
  prototypes: {
    Object: {
      id: null,
      storeProperties: ["type"],
      useSuperClassStoreProperties: true,
      stored: true,
      clonedProperties: ["editor","type","_clipPath","clipPath"],
      isObject: true,
      hasBoundsControls: true,
      stroke: "transparent",
      minStrokeWidth: 0,
      movementDelta: 1,
      eventListeners: {},
      locked: false,
      clone: function(propertiesToInclude,propertiesToExclude) {
        let object = this.getState(propertiesToInclude,propertiesToExclude);
        if(this._objects){
          object.objects = this._objects.map(object => {
            return object.clone();
          })
        }
        for(let property of this.clonedProperties){
          object[property] = this[property];
        }
        return fabric.util.createObject(object)
      },
      setPosition(value){
        let _this = this
        function _setPosition(){
          _this.center()
          _this.setCoords()
          setTimeout(()=>{
            _this.off("added",_setPosition)
          })
        }
        if(value === "center") {
          if(this.canvas){
            this.center()
            this.setCoords()
          }else{
            this.on("added",_setPosition,true)
          }
        }
      },
      toggleLocked (){
        this.setLocked(!this.locked);
      },
      setLocked (value){
        this.saveStates(["locked", "hasRotatingPoint", "hasBoundControls", "lockMovementX", "lockMovementY", "lockScalingX", "lockScalingY", "lockRotation", "lockSkewingX", "lockSkewingY"]);
        this.locked = value;
        this.hasRotatingPoint = !value
        this.hasBoundControls = !value
        this.lockMovementX = value
        this.lockMovementY = value
        this.lockScalingX = value;
        this.lockScalingY = value;
        this.lockRotation = value;
        this.lockSkewingX = value;
        this.lockSkewingY = value;
        this.fire(value ? "locked": "unlocked")
        this.updateState()
      },
      setActive (value){
        if(!this.canvas){
          this.on("added",() => {
            if(this.canvas.interactive) {
              // if(this.canvas._activeObject){
              //   this.canvas._handleGrouping(null, this)
              // }
              // else{
              this.canvas.setActiveObject(this)
              // }
            }
          })
        }
        else{
          if(this.canvas.interactive) {
            // if(this.canvas._activeObject){
            //   this.canvas._handleGrouping(null, this)
            // }
            // else{
            this.canvas.setActiveObject(this)
            // }
          }
        }
      },
      setLoader(value){
        if(!value)return
        this.loader = value
        this.on("loaded", ()=>{
          this.loaded = true
          if(this._loader){
            this._loader.removeFromCanvas()
          }
        })

        this.on("before:load", ()=>{
          this.loaded = false
          if(this.loader) {
            if(this.canvas){
              this._createLoader()
            }
            else{
              this.on("added",()=> {
                if(!this.loaded){
                  this._createLoader()
                }
              })
            }
          }
        })
      },
      getThumbnail (options = {}, output = null){

        let dims = this._getTransformedDimensions()
        let width = options.width || dims.x
        let height = options.height || dims.y
        let scale = options.scale || 1

        let canvas = fabric.util.createCanvasElement(this.padding * 2 + width * scale, this.padding * 2 + height * scale)
        let ctx = canvas.getContext('2d')

        if(options.shadow){
          this._setShadow(ctx, this)
        }
        // ctx.translate(0.5  ,0.5)
        ctx.translate(this.padding, this.padding)
        ctx.scale(scale,scale)
        ctx.translate(width/2,height/2)

        this.drawObject(ctx)

        let size = getProportions(canvas,{width,height},"contain-center")
        let left = (width - size.width)/2
        let top = (height - size.height)/2

        if(!output){
          output = fabric.util.createCanvasElement()
        }
        output.width = size.width
        output.height = size.height

        let ctx2 = output.getContext('2d')
        ctx2.drawImage(canvas,0,0,size.width,size.height)
        return output
      },
      setEventListeners(val){
        this.on(val)
      },
      setWidth(val){
        this.width = val
        this.dirty = true
        this.fire("resized")
      },
      setHeight(val){
        this.height = val
        this.dirty = true
        this.fire("resized")
      },
      getId(){
        if(this.id && this.id.constructor === String){
          return this.id
        }
        else{
          return null
        }
      },
      setId(id){
        this.id = id
        if(id.constructor === String){
          if(typeof window !== "undefined" && !window[id]){
            window[id] = this
          }
        }
      },
      disable () {
        this.set({
          selectable: false,
          evented: false,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true
        })
      },
      add (canvas) {
        canvas.add(this)
      },
      stepRotating() {
        let b = this.angle, a = 45 * parseInt(b / 45)
        5 > b - a ? this.setAngle(a) : 40 < b - a && this.setAngle(a + 45)
      },
      onTop () {
        return this.canvas._objects.indexOf(this) === this.canvas._objects.length - 1
      },
      onBottom () {
        return this.canvas._objects.indexOf(this) === 0
      },
      rotateLeft () {
        this.saveStates(["angle","top","left"])
        this._normalizeAngle()
        let desiredAngle = (Math.floor(this.angle / 90) - 1) * 90
        this.rotate(desiredAngle)
        this.updateState()
      },
      rotateRight:  function () {
        this.saveStates(["angle","top","left"])
        this._normalizeAngle()
        let desiredAngle = (Math.floor(this.angle / 90) + 1) * 90
        this.rotate(desiredAngle)
        this.updateState()
      },
      duplicate() {
        let _object = this.getState()
        // _object.active = true
        // _object.left+=10
        // _object.top+=10
        let _clone = /*this.cloneSync && this.cloneSync() || */this.canvas.createObject(_object)
        return _clone
      },
      maxStrokeWidth(){
        return Math.min(this.width,this.height) / 2
      },
      moveUp(){
        this.top -= this.movementDelta
        this.canvas.renderAll()
      },
      moveDown(){
        this.top += this.movementDelta
        this.canvas.renderAll()
      },
      moveLeft(){
        this.left -= this.movementDelta
        this.canvas.renderAll()
      },
      moveRight(){
        this.left += this.movementDelta
        this.canvas.renderAll()
      },
      removeFromCanvas (){
        //todo remove this line
        if(this.canvas)
          this.canvas.remove(this)
      },
      setCrossOrigin: function(value) {
        this.crossOrigin = value
        if(this._element){
          this._element.crossOrigin = value
        }
        return this
      },
      setDirty (value){
        if ( this.group) {
          this.group.setDirty(value)
        }
        this.dirty = value
      },
      setScaleY (value){
        //shouldConstrainValue
        value = this._constrainScale(value)
        if (value < 0) {
          this.flipY = !this.flipY
          value *= -1
        }
        // this.setState({scaleY: value})
        this._set("scaleY", value)
        // this.afterSet()
      },
      setScaleX (value){
        //shouldConstrainValue
        value = this._constrainScale(value)
        if ( value < 0) {
          this.flipX = !this.flipX
          value *= -1
        }
        // this.setState({scaleX: value})
        this._set("scaleX", value)
        // this.afterSet()
      },
      setGradient: function(property, options) {
        options || (options = { })

        var gradient = { colorStops: [] }

        gradient.type = options.type || (options.r1 || options.r2 ? 'radial' : 'linear')

        gradient.coords = options.coords || {
          x1: options.x1,
          y1: options.y1,
          x2: options.x2,
          y2: options.y2
        }

        if (options.r1 || options.r2) {
          gradient.coords.r1 = options.r1
          gradient.coords.r2 = options.r2
        }

        gradient.gradientTransform = options.gradientTransform

        if(options.colorStops.constructor === Array){
          gradient.colorStops = options.colorStops
        }else{
          fabric.Gradient.prototype.addColorStop.call(gradient, options.colorStops)
        }

        return this.set(property, fabric.Gradient.forObject(this, gradient))
      },
      getShadow(){
        if(!this.shadow)return
        let shadow = this.shadow.toObject()
        delete shadow.nonScaling
        return shadow
      },
      setShadow(value) {

        if (value && !(value instanceof fabric.Shadow)) {
          value = new fabric.Shadow(value)
        }
        this.shadow = value
      },
      setFill(value,callback){
        this.saveStates(["fill"])
        if(value.constructor === Object) {
          //todo asyncronous
          if(value.type === "pattern"){
            this.fill = new fabric.Pattern(value,callback)
          }
          if(value.type === "gradient"){
            this.fill = new fabric.Gradient(value)
            callback && callback()
          }
        }
        else if(value.constructor === Object){
          this.setGradient('fill',value)
          callback && callback()
        }else{
          this.fill = value
          callback && callback()
        }
        this.updateState()
        // this.fire("modified", {})
        // if (this.canvas) {
        //   this.canvas.fire("object:modified", {target: this})
        //   this.canvas.renderAll()
        // }
      },
      _createCacheCanvas: function() {
        this._cacheProperties = {};
        this._cacheCanvas = fabric.util.createCanvasElement();
        this._cacheContext = this._cacheCanvas.getContext('2d');
        this._cacheContext.imageSmoothingQuality = "high"; //added
        this._updateCacheCanvas();
        // if canvas gets created, is empty, so dirty.
        this.dirty = true;
      },
      _createLoader(){
        let _processing = this.canvas.processing
        this.canvas.processing = true


        this._loader = this.canvas.createObject(this.loader,{
          snappable: false,
          statefullCache: true,
          layer: "interface",
          originX: "center",
          originY: "center",
          stored: false,
          selectable: false,
          evented: false,
          hasControls: false
        })

        this._loader.set({
          relativeLeft: 0,
          relativeTop: 0,
          relative: this
        })

        if(this.canvas) {
          this.canvas.processing = _processing
        }
      },
      _initEntity (options) {
        if(options.canvas && !options.editor){
          options.editor = options.canvas.editor
        }
        this.editor = options.editor
        fabric.util.fire("entity:created", {target: this, options: options})
      },
      _normalizeAngle:function(){
        if(this.angle < 0){
          this.angle += 360
        }else if(this.angle > 360){
          this.angle %= 360
        }
      },
      _getCacheCanvasDimensions: function() {
        let zoom = this.canvas && this.canvas.getZoom() || 1,
            objectScale = this.getObjectScaling(),
            retina = this.canvas && this.canvas._isRetinaScaling() ? fabric.devicePixelRatio : 1,
            dim = this._getNonTransformedDimensions(),
            zoomX = Math.abs(objectScale.scaleX * zoom * retina),
            zoomY = Math.abs(objectScale.scaleY * zoom * retina),
            width = Math.abs(dim.x * zoomX) * 2,
            height = Math.abs(dim.y * zoomY) * 2

        return {
          // for sure this ALIASING_LIMIT is slightly crating problem
          // in situation in wich the cache canvas gets an upper limit
          width: width + ALIASING_LIMIT,
          height: height + ALIASING_LIMIT,
          zoomX: zoomX,
          zoomY: zoomY,
          x: dim.x,
          y: dim.y
        }
      }
    }
  },
  versions: {
    "3.X": {
      prototypes: {
        Object: {
          setCoords: function (ignoreZoom, skipAbsolute) {
            this.oCoords = this.calcCoords(ignoreZoom)
            if (!skipAbsolute) {
              this.aCoords = this.calcCoords(true)
            }

            // set coordinates of the draggable boxes in the corners used to scale/rotate the image
            ignoreZoom || (this._setCornerCoords && this._setCornerCoords())

            //added subtargetcheck support
            if (this.subTargetCheck) {
              for (let object of this._objects) {
                object.setCoords()
              }
            }
            return this
          }
        }
      }
    }
  }
}



//Fabric 3
/*
fabric.Object.prototype.calcCoords = function(absolute) {
  let rotateMatrix = this._calcRotateMatrix(),
      translateMatrix = this._calcTranslateMatrix(),
      startMatrix = fabric.util.multiplyTransformMatrices(translateMatrix, rotateMatrix),
      vpt = this.getViewportTransform(),
      finalMatrix = absolute ? startMatrix : fabric.util.multiplyTransformMatrices(vpt, startMatrix),
      dim = this._getTransformedDimensions(),
      w = dim.x / 2, h = dim.y / 2,
      tl = fabric.util.transformPoint({ x: -w, y: -h }, finalMatrix),
      tr = fabric.util.transformPoint({ x: w, y: -h }, finalMatrix),
      bl = fabric.util.transformPoint({ x: -w, y: h }, finalMatrix),
      br = fabric.util.transformPoint({ x: w, y: h }, finalMatrix);

  let ml,mt,mr,mb,mtr;

  let angle = fabric.util.degreesToRadians(this.angle), cos = fabric.util.cos(angle), sin = fabric.util.sin(angle);

  if (!absolute) {
    let padding = this.padding
    if(padding){

      if(padding.constructor === Object){

        tl.x -= cos * padding.top - sin * padding.left;
        tl.y -= cos * padding.top + sin * padding.left;

        tr.x += cos * padding.top + sin * padding.right;
        tr.y -= cos * padding.top - sin * padding.right;

        bl.x -= cos * padding.bottom + sin * padding.left;
        bl.y += cos * padding.bottom - sin * padding.left;

        br.x += cos * padding.bottom - sin * padding.right;
        br.y += cos * padding.bottom + sin * padding.right;
      }
      else {

        let cosP = cos * padding, sinP = sin * padding, cosPSinP = cosP + sinP, cosPMinusSinP = cosP - sinP;

        tl.x -= cosPMinusSinP;
        tl.y -= cosPSinP;
        tr.x += cosPSinP;
        tr.y -= cosPMinusSinP;
        bl.x -= cosPSinP;
        bl.y += cosPMinusSinP;
        br.x += cosPMinusSinP;
        br.y += cosPSinP;
      }
    }

    ml  = new fabric.Point((tl.x + bl.x) / 2, (tl.y + bl.y) / 2)
    mt  = new fabric.Point((tr.x + tl.x) / 2, (tr.y + tl.y) / 2)
    mr  = new fabric.Point((br.x + tr.x) / 2, (br.y + tr.y) / 2)
    mb  = new fabric.Point((br.x + bl.x) / 2, (br.y + bl.y) / 2)
    mtr = new fabric.Point(mt.x + sin * this.rotatingPointOffset, mt.y - cos * this.rotatingPointOffset)
  }

  let coords = {
    // corners
    tl: tl, tr: tr, br: br, bl: bl,
  };

  if (!absolute) {
    // middle
    coords.ml = ml;
    coords.mt = mt;
    coords.mr = mr;
    coords.mb = mb;
    // rotating point
    coords.mtr = mtr;
  }
  return coords;
}*/

Object.assign(fabric.Object.prototype,{

})