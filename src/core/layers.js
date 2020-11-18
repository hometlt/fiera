
fabric.util.object.extend(fabric.Object.prototype, {
  layer: "objects"
});

fabric.Layer = function(options){
  if(options.objects === true){
    this.objects = [];
    delete options.objects;
  }
  fabric.util.object.extend(this,options);
};

fabric.StaticCanvas.prototype.renderObjects = function(ctx, objects) {
  if (!objects || !objects.length) return;
  ctx.save();
  //apply viewport transform once for all rendering process
  ctx.transform.apply(ctx, this.viewportTransform);
  this._renderObjects(ctx, objects);


  ctx.restore();
  let path = this.clipPath;
  if (path) {
    path.canvas = this;
    // needed to setup a couple of variables
    path.shouldCache();
    path._transformDone = true;
    path.renderCache({forClipping: true});
    this.drawClipPathOnCanvas(ctx);
  }
}

fabric.Layer.prototype = {
  objects : null,
  name: "",
  getObjectsArray: function(){
    if(!this.objects)return null;
    if(this.objects.constructor === Array){
      return this.objects;
    }
    else{
      return this.canvas[this.objects]
    }
  },
  getObjects(){
    let objectsArray = this.getObjectsArray();
    if(!objectsArray)return null;
    if(this.objects.constructor === String){
      return this.canvas._chooseObjectsToRender2(objectsArray,this.name);
    }
    else{
      return objectsArray;
    }
  },
  renderLayer: function(ctx){
    let objects = this.getObjects();
    this.render.call(this.canvas,ctx,objects)
  },
  renderSvg(markup,reviver){
    let objects = this.getObjects();
    this.svg.call(this.canvas,markup,reviver,objects)
  },
  render: function(ctx, objects){
    this.renderObjects(ctx, objects)

  },
  svg: function(markup,reviver,objects){
    if(!objects || !objects.length)return;
    for (let instance of objects) {
      if (instance.excludeFromExport)continue;
      this._setSVGObject(markup, instance, reviver);
    }
  }
};


let CanvasMixin = {
  renderOrder: ["shadow","background","objects","overlay","overlayObjects","controls","loader","interface"],
  setLayers(layers){
    let newLayers = fabric.util.object.extend({},this.layers,true)
    fabric.util.object.extend(newLayers,layers,true);

    this.layers = {};
    for(let layerName in newLayers){
      newLayers[layerName].name = layerName;
      newLayers[layerName].canvas = this;
      this.layers[layerName] = new fabric.Layer(newLayers[layerName]);
    }
  },
  layers: {
    interface: {
      export: false,
      objects: "_objects"
    },
    loader: {
      render(ctx) {
        if(this.processingProperties.length && this._loader){
          ctx.save();
          ctx.transform.apply(ctx, this.viewportTransform);
          this._loader.render(ctx);
          ctx.restore();
        }
      }
    },
    shadow: {
      render(ctx) {
        let _rect = this.backgroundRect;
        if(!_rect)return;
        _rect.left = this.viewportTransform[4];
        _rect.top = this.viewportTransform[5];
        _rect.width = this.originalWidth * this.viewportTransform[0];
        _rect.height = this.originalHeight * this.viewportTransform[0];
        // _rect.fill = object || "#ffffff";
        _rect.dirty = true;
        _rect.render(ctx);
      }
    },
    background: {
      export: true,
      render:  function(ctx){
        this._renderBackground(ctx);
      },
      svg: function(markup,reviver){
        this._setSVGBgOverlayColor(markup, 'background');
        this._setSVGBgOverlayImage(markup, 'backgroundImage', reviver);
      }
    },
    objects: {
      export: true,
      objects: "_objects"
    },
    overlayObjects: {
      export: true,
      objects: "_objects"
    },
    // overlayObjects: {
    //   export: true,
    //   render: function(ctx){
    //     ctx.save();
    //     //apply viewport transform once for all rendering process
    //     ctx.transform.apply(ctx, this.viewportTransform);
    //     this._renderObjects(ctx, this._chooseObjectsToRender2("overlay"));
    //     ctx.restore();
    //   },
    //   svg: function(markup,reviver){
    //     let objects = this._chooseObjectsToRender2("overlay");
    //     for (let instance of objects) {
    //       if (instance.excludeFromExport)continue;
    //       this._setSVGObject(markup, instance, reviver);
    //     }
    //   }
    // },
    controls: {
      render:  function(ctx){
        // this.controlsAboveOverlay &&
        if (this.interactive) {
          this.drawControls(ctx);
        }
      }
    },
    overlay: {
      export: true,
      render:  function(ctx){
        this._renderOverlay(ctx);
      },
      svg: function(markup,reviver){
        this._setSVGBgOverlayColor(markup, 'overlay');
        this._setSVGBgOverlayImage(markup, 'overlayImage', reviver);
      }
    },
  },
  /**
   * @private
   */
  getObjectByID: function(_id){
    if ( this.layers) {
      for (let layerName in this.layers) {
        let layer = this.layers[layerName];
        let objects = layer.getObjects();
        if(!objects)continue;

        function _search(objects) {
          for (let o of objects) {
            if (o.id === _id) {
              return o;
            }
            if (o._objects) {
              let found = _search(o._objects)
              if(found){
                return found
              }
            }
          }
        }
        let o = _search(objects)
        if(o){
          return o;
        }
      }
    }
    return null;
  },
  _chooseObjectsToRender2: function(objectsArray,layer) {

    let object, objsToRender, activeGroupObjects;
    let activeObjects = this.interactive ? this.getActiveObjects() : [];

    if (activeObjects.length > 0 && !this.preserveObjectStacking) {
      objsToRender = [];
      activeGroupObjects = [];
      for (let i = 0, length = objectsArray.length; i < length; i++) {
        object = objectsArray[i];
        if(layer && object.layer !== layer )continue;
        if (activeObjects.indexOf(object) === -1 ) {
          if(!object.hiddenActive){
            objsToRender.push(object);
          }
        }
        else {
          activeGroupObjects.push(object);
        }
      }
      if (activeObjects.length > 1) {
        this._activeObject._objects = activeGroupObjects;
      }
      objsToRender.push.apply(objsToRender, activeGroupObjects);
    }
    else {
      if(layer){
        objsToRender = [];
        for (let i = 0, length = objectsArray.length; i < length; i++) {
          object = objectsArray[i];
          if(layer && object.layer !== layer )continue;
          objsToRender.push(object);
        }
      }
      else{
        objsToRender = objectsArray;
      }
    }
    return objsToRender;
  },


  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
   * @return {fabric.Canvas} instance
   * @chainable
   */
  renderCanvasLayers: function(ctx) {
    let forExport = !!ctx;
    if(!ctx){
      ctx = this.contextContainer;
    }
    if (this.isRendering) {
      fabric.util.cancelAnimFrame(this.isRendering);
      this.isRendering = 0;
    }
    //todo remove this
    this.calcViewportBoundaries();
    this.clearContext(ctx);
    if (this.clipTo) {
      fabric.util.clipContext(this, ctx);
    }

    for(let layerName of this.renderOrder){
      let l = this.layers[layerName];
      if(!l)continue;
      if(l.visible === false || (forExport && !l.export)){
        continue;
      }
      l.renderLayer(ctx);
    }
  },
  _renderOverlayObjects: function(){},
  _renderBackgroundObjects: function(){},
  // eventListeners: merge(fabric.Canvas.prototype.eventListeners, {
  //   "before:created": function(options){
  //     this.setLayers(options.layers);
  //     delete options.layers;
  //   }
  // })
};
fabric.util.object.extend(fabric.StaticCanvas.prototype,CanvasMixin);
fabric.util.object.extend(fabric.Canvas.prototype,CanvasMixin);
