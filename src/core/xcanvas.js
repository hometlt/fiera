/**
 ### attribute: backgroundImageProperties

 default attributes for background image

 ### freeDrawingBrush

 default active drawing brush

 ```
 freeDrawingBrush: "PaintBucketBrush" | "PaintPenBrush" | "PencilBrush"
 ```

 ### attribute: onSlideLoaded

 onSlideLoaded calls as a callback for load fucntion

 ### attribute: backgroundPosition
 ```
 backgroundPosition: 'manual' | 'resize' | 'contain' | 'cover' | 'center'
 ```

 - manual - background will ne not scaled and put at left top corner
 - resize - canvas will be resized according to image size
 - contain - will be scaled to contain canvas size
 - cover - will be scaled to cover all canvas size
 - center - backogrund will be not scaled but put in the middle

 ### method: setInteractiveMode

 switch between drawing and hand( moving cunvas by mouse) modes

 ```javascript
 canvas.setInteractiveMode( mode : "hand" | "mixed") : void
 ```

 ### drawingColor

 drawing color using by brushes

 */
import LoaderQueue from "../../util/loader.js";
import {getProportions} from "../../util/size.js";


const CanvasMixin = {
    processingProperties: [],
    cacheProperties: [],
    objects: null,
    /**
     * @values  "svg" | "canvas
     */
    canvasType: "canvas",  /**
     * initialized width of the canvas
     */
    width: 600,
    /**
     * initialized height of the canvas
     */
    height: 800,
    /**
     * output quality
     */
    dotsPerUnit: 1,
    scale: 1,
    loaded: false,
    /**
     * required to show video
     */
    animated: false,
    imageSmoothing: "high",
    backgroundPosition: 'manual',
    fillBackgroundColorOverCanvas: false,
    optionsOrder: ["layers","canvasType","originalWidth", "originalHeight", "width","height","allowTouchScrolling","containerClass","element","*"],
    initialize: function (options, callback, editor) {
        this.processingProperties = [];
        this.renderAndResetBound = this.renderAndReset.bind(this);
        this.requestRenderAllBound = this.requestRenderAll.bind(this);
        this._objects = [];
        // if(!options.layers)options.layers = {};
        // if (options.element == undefined) {
        //     options.element = true;
        // }
        // if (options.width) {
        //     options.originalWidth = options.width
        // }
        // if (options.height) {
        //     options.originalHeight = options.height;
        // }


        // this.fire("before:created", options);

        // this.setLayers(options.layers)
        // if (options.canvasType) {
        //     this.canvasType = options.canvasType;
        // }
        // if (options.allowTouchScrolling) {
        //     this.allowTouchScrolling = true;
        // }
        // if (!fabric.isLikelyNode) {
        //     this.setElement(options.element);
        // }
        // delete options.element;
        // this.processing = false;
        this.initOptions(Object.assign({
            editor: editor,
            layers: {},
            element: true,
            originalWidth: options.width,
            originalHeight: options.height,
        },options), callback)
        this.calcOffset();
        // this.renderAll();
    },
    initOptions: function (options, callback) {
        // this.loaded = false;
        this.processing = true;
        this.editor = options.editor
        this.id = options.id || fabric.util.createID(this)
        this.editor.fire("entity:created", {target: this, options: options});
        fabric.util.fire("entity:created", {target: this, options: options});
        delete options.id
        delete options.editor
        delete options.type

        this.fire("loading:before", {target: this, options: options});
        // this.editor && this.editor.fire("slide:loading:before", {target: this, options: options});

        this.set(options, () => {
            this.loaded = true;
            // this.renderAll();
            setTimeout(() => {
                this.fire("loaded", {target: this, type: "slide"});
                // this.editor && this.editor.fire("slide:loaded", {target: this, type: "slide"});
                callback && callback(this);
            })
        });

        this.processing = false;
        this.fire("loading:after", {target: this, type: "slide", options: options});
    },

    removeProcessinProperty(property) {
        this.processingProperties.splice(this.processingProperties.indexOf(property), 1);
        if (!this.processing && !this.processingProperties.length) {
            this.fire("processing:end")
        }
    },
    addProcessinProperty(property) {
        if (!this.processing && !this.processingProperties.length) {
            this.fire("processing:start")
        }
        this.processingProperties.push(property);
    },
    hasStateChanged: fabric.Object.prototype.hasStateChanged,
    setEventListeners: function (val) {
        this.on(val);
    },
    find: function (options) {
        if (typeof options === "string") {
            options = {
                type: options
            }
        }
        return this._objects.filter(item => {
            for (let i in options) {
                if (item[i] !== options[i]) return false;
            }
            return true;
        });
        // return fabric._.where(this._objects,options);
    },
    onResize: function () {
        let _scale = Math.min(1, 800 / this.width);
        // this.setZoom(_scale);
        this.setDimensions({width: this.width, height: this.height});
    },
    getCenter: function (el) {
        return {
            top: (this.originalHeight || this.getHeight()) / 2,
            left: (this.originalWidth || this.getWidth()) / 2
        };
    },
    setOriginalSize: function (w, h) {
        this.originalWidth = h ? w : (w.naturalWidth || w.width);
        this.originalHeight = h ? h : (w.naturalHeight || w.height);
        this.fire('resized')
        return this;
    },
    setOriginalWidth: function (value) {
        this.originalWidth = value;
        if (!this.stretchable) {
            this.setWidth(value);
        }
        this.fire('resized')
    },
    setOriginalHeight: function (value) {
        this.originalHeight = value;
        if (!this.stretchable) {
            this.setHeight(value);
        }
        this.fire('resized')
    },
    setAnimated: function (val) {
        this.animated = val;

        let canvas = this;

        let render = function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        };

        if (val) {
            fabric.util.requestAnimFrame(render);
        }
    },
    getOriginalSize() {
        return {
            width: this.originalWidth || this.width,
            height: this.originalHeight || this.height
        }
    },
    getOriginalWidth() {
        return this.originalWidth || this.width;
    },
    getOriginalHeight() {
        return this.originalHeight || this.height;
    },
    exportImage(zoom = 1){
        let output = fabric.util.createCanvasElement();
        let width = this.getOriginalWidth();
        let height = this.getOriginalHeight();
        output.width = width * zoom
        output.height = height * zoom
        let ctx = output.getContext('2d')


        let vt = this.viewportTransform, rWidth = this.width, rHeight = this.height;
        this.viewportTransform = [zoom, vt[1], vt[2], zoom, 0, 0];
        // this.fire("export:viewport:scaled")
        this.width = this.width * zoom
        this.height = this.height * zoom
        this.skipOffscreen = false;
        this._exporting = true;
        this.renderCanvasLayers(ctx);
        delete this._exporting;
        this.skipOffscreen = true;
        this.viewportTransform = vt;
        // this.fire("export:viewport:scaled")
        this.width = rWidth
        this.height = rHeight
        return output;
    },
    getThumbnail({width, height, zoom, area, contentMode, cutEdges = false} = {}, output) {
        if (!area) {
            area = {left: 0, top: 0, width: this.getOriginalWidth(), height: this.getOriginalHeight()}
        }
        if (cutEdges && this.offsets) {
            area.left += this.offsets.left;
            area.top += this.offsets.top;
            area.width -= this.offsets.left + this.offsets.right;
            area.height -= this.offsets.top + this.offsets.bottom;
        }
        let size;
        if (zoom) {
            size = {
                width: area.width * zoom,
                height: area.height * zoom,
                scaleX: zoom,
                scaleY: zoom
            }
        } else {
            if (!width) width = this.getOriginalWidth();
            if (!height) height = this.getOriginalHeight();
            size = getProportions(area, {width, height}, contentMode);
        }
        if (!output) {
            output = fabric.util.createCanvasElement();
        }
        output.width = size.width;
        output.height = size.height;
        let ctx = output.getContext('2d');

        this.__forExport = true;
        let exported = this.exportImage(Math.max(1,size.scaleX))
        delete this.__forExport

        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(exported,0,0,output.width,output.height)

        return output;
    },
    renderAll: function (force) {
        if(this.doNotRender || this.editor && this.editor.doNotRender && !force || fabric.isLikelyNode && !this.loaded){
            if(fabric.showDeveloperWarnings){
                console.warn("render requested, but canvas is not loaded")
            }
            return;
        }

        //do not draw anything until ready on Nodejs
        if (this.editor && this.editor.virtual && !this.editor.ready) {
            return;
        }

        if (this.contextTop) {
            if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
                this.clearContext(this.contextTop);
                this.contextTopDirty = false;
            }
        }

        this.fire('before:render');


        if (this.contextTop) {
            if (this.hasLostContext) {
                this.renderTopLayer(this.contextTop);
            }
        }

        if (this.contextContainer) {
            if (this.layers) {
                this.renderCanvasLayers();
            } else {
                this.renderCanvas(this.contextContainer, this._chooseObjectsToRender());
            }
        }
        this.fire('after:render');
        return this;
    },

    _initContextContainer: function () {
        this.contextContainer = this.lowerCanvasEl.getContext('2d');
    },
    _createLowerCanvas: function (canvasEl) {
        if (typeof canvasEl === "string") {
            this.lowerCanvasEl = fabric.util.getById(canvasEl);
        } else if (canvasEl) {
            this.lowerCanvasEl = this._createCanvasElement(canvasEl);
        } else {
            //edited allow virtul canvas
            // this.virtual = true;
            this.lowerCanvasEl = fabric.util.createCanvasElement();
        }
        fabric.util.addClass(this.lowerCanvasEl, 'lower-canvas');

        if (this.interactive) {
            this._applyCanvasStyle(this.lowerCanvasEl);
        }
        this._initContextContainer();
    },
    /**
     * Background and Overlay Image Stuff
     */
    getBackgroundImage: function () {
        if (!this.backgroundImage || this.backgroundImage.excludeFromExport) return;
        let object = this.backgroundImage.getState();
        if(Object.keys(object).length === 1){
            return object.src;
        }
        return object;
    },
    getOverlayImage: function () {
        if (!this.overlayImage || this.overlayImage.excludeFromExport)  return;
        return this._clean_overlay_background_stored_object(this.overlayImage);
    },
    _renderBackgroundOrOverlay: function(ctx, property) {
        let object = this[property + 'Color']
        let w = this.getOriginalWidth()
        let h = this.getOriginalHeight()

        if ( object) {

            ctx.fillStyle = object.toLive
                ? object.toLive(ctx)
                : object;

            if(!this.fillBackgroundColorOverCanvas){
                //todo do!!!
                ctx.fillRect(
                    object.offsetX||  this.viewportTransform[4],// * this.viewportTransform[0],
                    object.offsetY||  this.viewportTransform[5],// * this.viewportTransform[0],
                    w *this.viewportTransform[0],
                    h * this.viewportTransform[0]);
            }else{
                ctx.fillRect(

                    object.offsetX || 0,
                    object.offsetY || 0,
                    this.width ,
                    this.height);
            }
        }
        object = this[property + 'Image'];
        if(object && object.constructor !== String &&  object.constructor !== Object){


            ctx.save();
            ctx.transform.apply(ctx, this.viewportTransform);

            object.render(ctx);

            ctx.restore();
        }
    },
    /**
     * backgroundPosition
     * @values manual | cover | contain
     */
    // setBackgroundPosition: function (src) {
    //   this.backgroundPosition = src;
    //   this._update_background_overlay_image("background");
    //   return this;
    // },
    setPageStyle(value){
        this.pageStyle = value;
        this.backgroundRect = new fabric.Rect(fabric.util.object.extend({
            width: this.width,
            height: this.height,
            fill: "#fff",
        },value));
    },
    _update_background_overlay_image: function (property) {
        let photo = this[property + "Image"];
        if(!photo)return;
        let position = this[property + "Position"];
        photo.set({
            fitting: position,
            width: this.getOriginalWidth(),
            height: this.getOriginalHeight(),
            left: 0,
            top: 0
        })
        //update fitting


        // if (!photo || photo.constructor === Object || photo.constructor === String) return;
        // let position = this[property + "Position"];
        //
        // if( position === 'resize') {
        //   if(photo.loaded){
        //     this.originalWidth = photo.width;
        //     this.originalHeight = photo.height;
        //   }
        //   else{
        //     if(photo.__waitingToBeUpdated){
        //       return;
        //     }
        //     photo.__waitingToBeUpdated = true;
        //     photo.on("element:modified",() =>{
        //       delete photo.__waitingToBeUpdated;
        //       this._update_background_overlay_image(property);
        //     });
        //   }
        // }
        // else if (position === 'manual') {
        //   // let _orig = photo.getOriginalSize();
        //   // photo.set({
        //   //   originX: 'left',
        //   //   originY: 'top',
        //   //   left: 0, //this.viewportTransform[4],
        //   //   top: 0, //this.viewportTransform[5],
        //   //   width: _orig.width,
        //   //   height: _orig.height
        //   // });
        // }
        // else{ // fill || contain || cover || center
        //   let _w  =  this.originalWidth || this.width,  _h = this.originalHeight || this.height;
        //   let originalSize =  {width: _w, height: _h};
        //   let size = originalSize;
        //
        //   if(photo.loaded){
        //     size = fabric.util.getProportions(photo._originalElement, originalSize, position);
        //   }
        //
        //   let _l = photo.originX === 'center' ? _w / 2 : (_w - size.width) / 2 ;
        //   let _t = photo.originY === 'center' ? _h / 2 : (_h - size.height) / 2;
        //   let _z = this.viewportTransform[0];
        //
        //   photo.set({
        //     left: _l - 0.5,//(_l /*+ this.viewportTransform[4]*/)*_z,
        //     top:  _t- 0.5,// /*+ this.viewportTransform[5]*/)*_z,
        //     scaleX: (_w + 1) / photo.width,//*_z,
        //     scaleY: (_h + 1 ) / photo.height//*_z
        //   });
        // }
    },
    /**
     *
     * @param value Object | HTMLImageElement | Image | String
     * @param type
     * @param callback
     */
    setBackgroundOverlayImage: function (value, type , callback) {
        let property = type + "Image";
        if(!this.processing){
            this.saveStates([property]);
        }
        this.fire(type + "-image:changed");

        if (!value) {
            this[property] = null;
            callback && callback();
            return;
        }

        let backgroundOptions;

        let vType = value.constructor.name;
        switch (vType){
            case "String":
                backgroundOptions = {
                    src: value
                };
                break;
            case 'HTMLCanvasElement':
            case 'HTMLImageElement':
                backgroundOptions = {
                    element: value,
                    width: value.naturalWidth,
                    height: value.naturalHeight
                };
                break;
            case "Object":
                backgroundOptions = value;
        }

        let positionProperty = type + "Position";
        if(this[positionProperty] !== "manual"){
            // delete backgroundOptions.width;
            // delete backgroundOptions.height;
            delete backgroundOptions.scaleX;
            delete backgroundOptions.scaleY;
        }

        backgroundOptions.disableDefaultProperties = true;
        if(!backgroundOptions.type){
            backgroundOptions.type = type + "-image";
        }

        // let prototype =  this.editor && this.editor.prototypes && this.editor.prototypes[fabric.util.string.capitalize(property,true)];
        // prototype && fabric.util.object.extend(backgroundOptions,prototype);

        backgroundOptions.editor = this.editor;
        backgroundOptions.canvas = this;
        backgroundOptions.width = this.getOriginalWidth();
        backgroundOptions.height = this.getOriginalHeight();
        backgroundOptions.left = 0;
        backgroundOptions.top = 0;


        this.addProcessinProperty(property);

        this[property] = fabric.util.createObject(backgroundOptions,el => {
            this.removeProcessinProperty(property);
            this.fire(type + "-image:loaded",{target: el});
            // if (fabric.isLikelyNode) {
            // this._update_background_overlay_image(type);
            // }
            callback && callback();
        });

        if (!fabric.isLikelyNode) {
            // this._update_background_overlay_image(type);
            if(!this.processing){
                this.fire('modified');
            }
        }


    },
    setOverlayImage: function (bg, callback) {
        this.setBackgroundOverlayImage(bg,"overlay",callback);
    },
    setBackgroundImage: function (bg, callback) {
        this.setBackgroundOverlayImage(bg,"background",callback );
    },
    setBackground: function(color,callback){
        if(!this.processing){// if(!this.processingProperties.length)
            this.saveStates(["backgroundColor"]);
        }


        this.backgroundColor = color;
        this._initGradient(color, "backgroundColor");
        this._initPattern(color, "backgroundColor",  () => {
            this.renderAll();
            if(!this.processingProperties.length)this.fire('modified');
            callback && callback()
        });
        return this;
    },
    setOverlay:    function(color,callback){
        if(!this.processingProperties.length) this.saveStates(["overlayColor"]);

        this.overlayColor = color;
        this._initGradient(color, "overlayColor");
        this._initPattern(color, "overlayColor",  () => {
            this.renderAll();
            if(!this.processingProperties.length)this.fire('modified');
            callback && callback()
        });
        return this;
    },

    /**
     * @private
     * @param {Object} [filler] Options object
     * @param {String} [property] property to set the Pattern to
     * @param {Function} [callback] callback to invoke after pattern load
     */
    _initPattern: function(filler, property, callback) {
        if (filler && filler.source && !(filler instanceof fabric.Pattern)) {

            filler._src = filler.source;
            let src = filler.source;
            if(this.getURL){
                src = this.getURL(src,"pattern");
            }
            filler.source = fabric.util.getURL(src);
            this[property] = new fabric.Pattern(filler, callback);
        }
        else {
            callback && callback();
        }
    }
}



Object.assign(fabric.StaticCanvas.prototype, CanvasMixin, {
    storeProperties: ['objects', 'backgroundColor', 'overlayColor', 'backgroundImage', 'overlayImage', 'width', 'height', 'clipPath'],
    type: "static-canvas",
    loaded: false,
    includeDefaultValues: false,
    getWidth: function () {
        return this.originalWidth || this.width;
    },
    getHeight: function () {
        return this.originalHeight || this.height;
    },
    toObject: fabric.Object.prototype.toObject,

    setObjects: function (objects, callback) {
        this._objects.length = 0;
        if (this._hasITextHandlers) {
            this.off('mouse:up', this._mouseUpITextHandler);
            this._iTextInstances = null;
            this._hasITextHandlers = false;
        }
        if (this.interactive) {
            this.discardActiveObject();
            if (this.contextTop) {
                this.clearContext(this.contextTop);
            }
        }
        this.addObjects(objects, callback)
        this.renderAll();
    },
    setWidth: function (value) {
        if (this.lowerCanvasEl) {
            return this.setDimensions({width: value}, {});
        } else {
            this.width = value;
        }
    },
    setHeight: function (value) {
        if (this.lowerCanvasEl) {
            return this.setDimensions({height: value}, {});
        } else {
            this.height = value;
        }
    },
    _initSize: function () {
        this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
        this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
        if (!this.lowerCanvasEl.style) {
            return;
        }
        this.lowerCanvasEl.width = this.width;
        this.lowerCanvasEl.height = this.height;

        this.lowerCanvasEl.style.width = this.width + 'px';
        this.lowerCanvasEl.style.height = this.height + 'px';

        this.viewportTransform = this.viewportTransform.slice();
    },
    _setDimensions_overwritten: fabric.Canvas.prototype.setDimensions,
    setDimensions: function (dimensions, options) {
        if (this.editor && this.editor.virtual) {
            for (let prop in dimensions) {
                this._setBackstoreDimension(prop, dimensions[prop]);
            }
        } else {
            this._setDimensions_overwritten(dimensions, options);
        }

        if (this.backgroundImage && this.backgroundImage.constructor !== String) {
            this._update_background_overlay_image("background");
        }
        if (this.overlayImage && this.overlayImage.constructor !== String) {
            this._update_background_overlay_image("overlay");
        }
        //this._update_clip_rect();
        this.fire("dimensions:modified");
        this.renderAll();
    },
    getBackgroundColor: function () {
        let val = this.backgroundColor;
        if (val.toObject) {
            val = this.backgroundColor.toObject();
            val.source = this.backgroundColor._src;
        }
        return val;
    },
    getOverlayColor: function () {
        let val = this.overlayColor;
        if (val.toObject) {
            val = val.toObject();
            val.source = this.overlayColor._src;
        }
        return val;
    },
    setElement(element) {
        if (element === false) return;
        if (this.canvasType === "canvas") {
            this._createLowerCanvas(element);
            this._initSize();
            this._setImageSmoothing();
            // only initialize retina scaling once
            if (!this.interactive) {
                this._initRetinaScaling();
            }
        }
    }
});

Object.assign(fabric.Canvas.prototype, CanvasMixin, {
    type: "canvas",
    stateful: true,
    originalState: {},
    stateProperties: [],
    editingObject: null,
    fitIndex: 0.8,
    originalWidth: 0,
    originalHeight: 0,
    /**
     * fill not the slide area, but whole canvas with background color
     */
    defaultTextType: "i-text",
    /**
     * Select object which is over the selected one
     */
    frontObjectsSelectionPriority: false,
    canvasType: "canvas",
    /**
     * allow user to interact with canvas
     */
    interactive: true,
    contextTopImageSmoothingEnabled: true,
    //TODO BUGS IF DISABLED
    preserveObjectStacking: true,
    _getPointer_overwritten: fabric.Canvas.prototype.getPointer,
    eventListeners: {
        "viewport:scaled": function(){
            this._update_background_overlay_image("background");
            this._update_background_overlay_image("overlay");
        }
    },
    /*
     Add Custom Object Tranformations
     */
    getPointer: function (e, ignoreZoom, upperCanvasEl) {
        let pointer = this._getPointer_overwritten(e, ignoreZoom, upperCanvasEl);
        if (e._group) {
            pointer.x *= this.viewportTransform[0]
            pointer.y *= this.viewportTransform[3]
            pointer.x += this.viewportTransform[4];// * this.viewportTransform[0]
            pointer.y += this.viewportTransform[5];// *  this.viewportTransform[3]
            //console.log(pointer);
            return this._normalizePointer(e._group, pointer);
        }
        return pointer;
    },
    setElement(element) {
        if (element === false) return;
        this._createLowerCanvas(element);
        this._currentTransform = null;
        this._groupSelector = null;
        this._initWrapperElement();
        this._createUpperCanvas();
        this._initEventListeners();
        this.calcOffset();
        this.wrapperEl.appendChild(this.upperCanvasEl);
        this._createCacheCanvas();
        this._setImageSmoothing();
        this._initRetinaScaling();
        this._initSize();
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    renderTop: function () {
        let ctx = this.contextTop;
        this.clearContext(ctx);
        this.fire('before:render');
        this.renderTopLayer(ctx);
        this.fire('after:render');
        return this;
    },

    /**
     * @private
     * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-imagesmoothingenabled|WhatWG Canvas Standard}
     */
    _setImageSmoothing: function () {
        let ctx = this.getContext();
        if (!this.imageSmoothing) {
            this.imageSmoothingEnabled = false;
        } else {
            this.imageSmoothingEnabled = true;
        }

        // ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled || ctx.webkitImageSmoothingEnabled
        // 	|| ctx.mozImageSmoothingEnabled || ctx.msImageSmoothingEnabled || ctx.oImageSmoothingEnabled;
        ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
        ctx.imageSmoothingQuality = this.imageSmoothing;


    },
    /**
     * @override
     * @private
     * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
     */
    _finalizeCurrentTransform: function (e) {
        let transform = this._currentTransform,
            target = transform.target,
            eventName,
            options = {e: e, target: target, transform: transform};

        if (target._scaling) {
            target._scaling = false;
        }

        target.setCoords();
        // target.processing = false;

        if (transform.actionPerformed) {
            eventName = this._addEventOptions(options, transform);
            this._fire(eventName, options);
            // this._fire('modified', options);
            target.updateState()
        }
    },
    /**
     * @override
     * @private
     * @param {fabric.Object} obj Object that was added
     */
    _onObjectAdded: function (obj) {
        // this.stateful && obj.setupState();
        obj.canvas = this;
        obj.setCoords();
        this.fire('object:added', {target: obj});
        obj.fire('added');
    },
    setBackgroundColor: function (backgroundColor, callback) {
        let value = this.__setBgOverlayColor('backgroundColor', backgroundColor, callback);
        this.renderAll();
        return value;
    },

    /**
     * @private
     * @param {Object} target
     */
    _createGroup: function (target) {
        let objects = this._objects,
            isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target),
            groupObjects = isActiveLower
                ? [this._activeObject, target]
                : [target, this._activeObject];
        this._activeObject.isEditing && this._activeObject.exitEditing();

        return new fabric.ActiveSelection({
            editor: this.editor,
            objects: groupObjects,
            canvas: this
        });
    },

    /**
     * @override
     * fixed selection inside activeSelection object on zoomed canvas
     */
    containsPoint: function (e, target, point) {
        var ignoreZoom = true,
            pointer = point || this.getPointer(e, ignoreZoom),
            xy;

        if (target.group && target.group === this._activeObject && target.group.type === 'activeSelection') {
            xy = this._normalizePointer(target.group, pointer);
            xy.x *= this.viewportTransform[0] //added
            xy.y *= this.viewportTransform[3] //added
            xy.x += this.viewportTransform[4] //added
            xy.y += this.viewportTransform[5] //added
        }
        else {
            xy = { x: pointer.x, y: pointer.y };
        }
        return (target.containsPoint(xy) || target._findTargetCorner(pointer));
    },
    findTarget: function (e, skipGroup) {
        if (this.skipTargetFind) {
            return;
        }

        let ignoreZoom = true,
            pointer = this.getPointer(e, ignoreZoom),
            activeObject = this._activeObject,
            aObjects = this.getActiveObjects(),
            activeTarget, activeTargetSubs;

        // first check current group (if one exists) active group does not check sub targets like normal groups. if active group just exits.
        if (aObjects.length > 1 && !skipGroup && activeObject === this._searchPossibleTargets([activeObject], pointer)) {
            return activeObject;
        }

        this.targets = [];
        //if selected objhject is part of a group.

        //check corner of active object if within a group
        // if(aObjects.length === 1 && activeObject.group){
        //   //calculate transformed pointer
        //   e._group = activeObject.group;
        //   let transformedPointer = this.getPointer(e, ignoreZoom);
        //   delete e._group;
        //   if (activeObject._findTargetCorner(transformedPointer)) {
        //     return activeObject;
        //   }
        // }

        // if we hit the corner of an activeObject, let's return that.
        if (aObjects.length === 1 && !activeObject.group && activeObject._findTargetCorner(pointer)) {
            return activeObject;
        }

        // check if selected the same object
        if (aObjects.length === 1 && activeObject === this._searchPossibleTargets([activeObject], pointer)) {
            if (!this.preserveObjectStacking) {
                return activeObject;
            } else {
                activeTarget = activeObject;
                activeTargetSubs = this.targets;
                this.targets = [];
            }
        }

        // added event option
        let target = this._searchPossibleTargets(this._objects, pointer);
        // console.log(this.targets);
        // if(this.targets.length){
        //   let target = this._searchPossibleTargets(this._objects, pointer);
        // }


        if (e[this.altSelectionKey] && target && activeTarget && target !== activeTarget) {
            target = activeTarget;
            this.targets = activeTargetSubs;
        }

        //testing
        //     if(this.targets[0]){
        //       this.setActiveObject(this.targets[0]);
        //     }
        //     else{
        //       if(target){
        //         this.setActiveObject(target);
        //       }
        //       else{
        //         // this.discardActiveObject();
        //       }
        //     }
        //     this.requestRenderAll();
        return target;
    },

    _setCursorFromEvent: function (e, target) {
        if (!target) {
            this.setCursor(this.defaultCursor);
            return false;
        }

        let hoverCursor = target.hoverCursor || this.hoverCursor,
            activeSelection = this._activeObject && this._activeObject.type === 'activeSelection' ?
                this._activeObject : null,
            // only show proper corner when group selection is not active
            corner = (!activeSelection || !activeSelection.contains(target))
                && target._findTargetCorner(this.getPointer(e, true));

        //added this.targets check
        if (!corner) {
            if (this.targets.length) {
                this.setCursor(this.targets[0].hoverCursor);
            } else {
                this.setCursor(hoverCursor);
            }
        } else {
            this.setCursor(this.getCornerCursor(corner, target, e));
        }
    },

    /**overwrittem .
     * added event option
     */
    _searchPossibleTargets: function (objects, pointer) {
        // Cache all targets where their bounding box contains point.
        let target, i = objects.length, subTarget;
        // Do not check for currently grouped objects, since we check the parent group itself.
        // until we call this function specifically to search inside the activeGroup
        while (i--) {
            let objToCheck = objects[i];
            let pointerToUse;
            if (objToCheck.group && objToCheck.group.type !== 'activeSelection') {
                pointerToUse = this._normalizePointer(objToCheck.group, pointer)
                //adding viewportTransform into a calculation to correctly detect subtargets
                pointerToUse.x *= this.viewportTransform[0]
                pointerToUse.y *= this.viewportTransform[3]
                pointerToUse.x += this.viewportTransform[4]
                pointerToUse.y += this.viewportTransform[5]
            } else {
                pointerToUse = pointer;
            }

            if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
                target = objects[i];


                if (target.subTargetCheck && target instanceof fabric.Group) {

                    // e._group = target;
                    // let transformedPointer = this.getPointer(e, true);
                    // delete e._group;

                    subTarget = this._searchPossibleTargets(target._objects, pointer);
                    subTarget && this.targets.push(subTarget);
                }
                break;
            }
        }
        return target;
    },

    /**
     * @private
     * @param {Event} e mouse event
     */
    _groupSelectedObjects: function (e) {

        let group = this._collectObjects(e),
            aGroup;

        // do not create group for 1 element only
        if (group.length === 1) {
            this.setActiveObject(group[0], e);
        } else if (group.length > 1) {
            aGroup = new fabric.ActiveSelection({
                editor: this.editor,
                objects: group.reverse(),
                canvas: this
            });
            this.setActiveObject(aGroup, e);
        }
    },

    /**
     * adding e._group = target for better mouse coordinate detection for subtargets
     */
    _handleEvent: function (e, eventType, button, isClick) {
        let target = this._target,
            targets = this.targets || [],
            options = {
                e: e,
                target: this,
                object: target,
                subobjects: targets,
                button: button || fabric.LEFT_CLICK,
                isClick: isClick || false,
                pointer: this._pointer,
                absolutePointer: this._absolutePointer,
                transform: this._currentTransform
            };
        this.fire('mouse:' + eventType, options);
        target && target.fire('mouse' + eventType, options);

        e._group = target;
        for (let i = 0; i < targets.length; i++) {
            targets[i].fire('mouse' + eventType, options);
        }
        delete e._group;

    },

    /**
     * Method that determines what object we are clicking on
     * the skipGroup parameter is for internal use, is needed for shift+click action
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, activeGroup is skipped and only objects are traversed through
     */
    ____findTarget: function (e, skipGroup) {
        if (this.skipTargetFind) {
            return;
        }
        let ignoreZoom = true,
            pointer = this.getPointer(e, ignoreZoom),
            activeGroup = this.getActiveGroup(),
            activeObject = this.getActiveObject(),
            activeTarget, activeTargetSubs;
        // first check current group (if one exists)
        // active group does not check sub targets like normal groups.
        // if active group just exits.
        this.targets = [];
        if (activeGroup && !skipGroup && activeGroup === this._searchPossibleTargets([activeGroup], pointer)) {
            this._fireOverOutEvents(activeGroup, e);
            return activeGroup;
        }
        // if we hit the corner of an activeObject, let's return that.
        if (activeObject && activeObject._findTargetCorner(pointer)) {
            this._fireOverOutEvents(activeObject, e);
            return activeObject;
        }

        if (!this.frontObjectsSelectionPriority && activeObject && activeObject === this._searchPossibleTargets([activeObject], pointer)) {
            if (!this.preserveObjectStacking) {
                this._fireOverOutEvents(activeObject, e);
                return activeObject;
            } else {
                activeTarget = activeObject;
                activeTargetSubs = this.targets;
                this.targets = [];
            }
        }

        let target = this._searchPossibleTargets(this._objects, pointer);
        if (e[this.altSelectionKey] && target && activeTarget && target !== activeTarget) {
            target = activeTarget;
            this.targets = activeTargetSubs;
        }
        this._fireOverOutEvents(target, e);
        return target;
    },

    setInteractive(value) {
        this.interactive = value;
    },

    setContextTopImageSmoothingEnabled() {
        let ctx = this.contextTop;
        if (ctx.imageSmoothingEnabled) {
            ctx.imageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
            return;
        }
        ctx.webkitImageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
        ctx.mozImageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
        ctx.msImageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
        ctx.oImageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
    },
    _onMouseUpInDrawingMode: function (e) {
        this._isCurrentlyDrawing = false;
        if (this.clipTo) {
            this.contextTop.restore();
        }
        let pointer = this.getPointer(e);
        this.freeDrawingBrush.onMouseUp(pointer);
        this._handleEvent(e, 'up');
    },
    _clearObjects: function () {
        this.discardActiveObject();

        let _removedObjects = this._objects.filter(object => (!object.permanent));
        this._objects = this._objects.filter(object => (object.permanent));

        if (this._hasITextHandlers) {
            this.off('mouse:up', this._mouseUpITextHandler);
            this._iTextInstances = null;
            this._hasITextHandlers = false;
        }
        return _removedObjects;
    },
    clear: function () {
        this.processing = true;
        this.saveStates(["overlayImage", "backgroundImage", "backgroundColor", "objects"]);

        let defaults = this.editor.getDefaultProperties(this.type);

        this.set({
            overlayImage: defaults.overlayImage || null,
            backgroundImage: defaults.backgroundImage || null,
            backgroundColor: defaults.backgroundColor || "#ffffff"
        });
        let _old_objects = this._clearObjects();
        this.processing = false;
        this.updateState()
        this.fire("canvas:cleared", {objects: _old_objects});
        this.renderAll();
    },
    clearObjects: function () {
        this.saveStates(["objects"]);
        let _oldObjects = this._clearObjects();
        this.clearContext(this.contextContainer);
        this.updateState()
        this.fire('canvas:cleared', {objects: _oldObjects});
        this.renderAll();
        return this;
    },
    create: function () {
        this.created = true;
        this._initInteractive();
        this._createCacheCanvas();
    },
    selectAll() {
        let selection = new fabric.ActiveSelection(this.getObjects(), {canvas: this});
        this.setActiveObject(selection);
        this.renderAll();
    },
    addRect: function () {
        this.createObject({
            width: 100,
            height: 100,
            active: true,
            position: "center",
            type: "rect",
            clipTo: this.activeArea,
            movementLimits: this.activeArea
        });
    },
    addCircle: function () {
        this.createObject({
            radius: 50,
            active: true,
            position: "center",
            type: "circle",
            clipTo: this.activeArea,
            movementLimits: this.activeArea
        });
    },
    addTriangle: function () {
        this.createObject({
            width: 100,
            height: 100,
            active: true,
            position: "center",
            type: "triangle",
            clipTo: this.activeArea,
            movementLimits: this.activeArea
        });
    },
    addText: function () {
        this.createObject({
            active: true,
            position: "center",
            type: this.defaultTextType,
            clipTo: this.activeArea,
            movementLimits: this.activeArea
        });
    },
    removeActive() {
        this._activeObject.removeFromCanvas()
    },
    // addInActiveArea(data){
    // 	let activeArea = this.activeArea && this.activeArea.id && "#" + this.activeArea.id;
    // 	let center, width, height
    // 	if(activeArea){
    // 		center = activeArea.getCenterPoint()
    // 		width = activeArea.width * activeArea.scaleX
    // 		height = activeArea.height * activeArea.scaleY
    // 	}else{
    // 		width = this.getOriginalWidth()
    // 		height = this.getOriginalHeight()
    // 		center = {x: width/2, y: height/2}
    // 	}
    // 	let object = this.createObject(data)
    // 	object.set({
    // 		movementLimits: activeArea,
    // 		clipTo: activeArea
    // 	})
    //
    // 	let magicNumber = 0.5;
    // 	let fitOptions = fabric.util.getProportions(
    // 		{
    // 			width: object.width * object.scaleX,
    // 			height: object.height * object.scaleY
    // 		},{width: width * magicNumber, height: height * magicNumber },"contain")
    //
    // 	object.set({
    // 		left: center.x,
    // 		top: center.y,
    // 		scaleX: object.scaleX * fitOptions.scale,
    // 		scaleY: object.scaleY * fitOptions.scale,
    // 	})
    //
    // 	this.setActiveObject(object)
    //
    // },
    setData: function (data) {
        // if (data.role === "frame") {
        //   if(this._activeObject.type === "photo"){
        //     this._activeObject.setFrame(data.frame);
        //     return;
        //   }
        // }
        switch (data.type) {
            case "background-image":
                this.setBackgroundImage(data, this.renderAll.bind(this))
                break;
            default:

                let activeArea = this.activeArea && this.activeArea.id && "#" + this.activeArea.id;
                let options = fabric.util.object.extend({
                    position: data.left === undefined && data.top === undefined ? "center" : "manual",
                    active: true,
                    movementLimits: activeArea,
                    clipTo: activeArea
                }, data, true);

                this.createObject(options);
        }
    },
    //Tooltip
    setTooltip (value) {
        if(!this.tooltipElement){
            this.tooltipElement = fabric.document.createElement('div')
            this.tooltipElement.classList.add("fiera-tooltip")
            this.tooltipElement.style.position = "absolute"
            this.tooltipElementInner = fabric.document.createElement('div')
            this.tooltipElementInner.style.position = "absolute"
            this.tooltipElement.appendChild(this.tooltipElementInner)
            this.on("mouse:move",e => {
                this.tooltipElement.style.left = e.pointer.x + "px"
                this.tooltipElement.style.top = e.pointer.y - 30 + "px"
            })
        }
        this.tooltipElementInner.textContent = value
        if(value){
            this.wrapperEl.appendChild(this.tooltipElement);
        }
        else{
            this.wrapperEl.removeChild(this.tooltipElement);
        }

    }
});


