/**
 * # editor
 *
 * farbic.app function is the entry point of FabricJS editor.
 * editor could be initialised with configuration object. Different extensions allows to initialize special editor attributes such as *object prototypes*, *resizable canvas*, *available fonts*, etc.
 *
 * ### option: util
 * mediaRoot - root directory for all media files in fabric editor
 *
 * ### option: resizable
 * makes canvas responsible. Canvas will be scaled to 100% of its container size
 *
 * ### option: onResize
 * function which override deafult canvas resize behavior.
 *
 * ### option: callback
 * function calls after canvas initialized
 *
 * ### option: initialize
 * function calls before canvas initialize
 *
 * @example
 *
 * new fabric.Editor({
 *      resizable: true,
 *      onResize: function(){},
 *      util: {
 *        mediaRoot: '../../media/'
 *      },
 *      canvasContainer: "fiera-canvas",
 *      prototypes: {},
 *      objects: {},
 *      eventListeners: {},
 *      callback: function(){},
 *      initialize:  function(){}
 *      customPubliceditorFunction: function(){},
 *      customPubliceditorAttribute: value
 *  })
 */




/**
 * # Prototypes

 Prototypes allows to define **prototypes** property in editor configuration.

 ```javascript
 editor ({
  prototypes: {
    ClassName: options
  }
 })
 ```

 If prototype is defined every new Object created by editor will have this properties by default.

 ```javascript
 NewClass: {
    $super: "ParentClass",
    type: "new-class",
    \/*other properties and methods*\/
   }
 ```

 if property **type** of Object class is defined then every object be default will have this type.

 ```javascript
 Object: {
    type: "rectangle"
   }
 ...
 //rectangle will be created
 fabric.createObject({width:100, height: 100})
 ```
 */

import {defaults} from "../util/util.js";
// import Observable from "../../plugins/observable.js";
//
// Object.assign(fabric.Editor.prototype, Observable)


const PREVIEW_MODE_OPTIONS  = {
  NONE: 0,
  SINGLE: 1,
  ALL: 2
};

export const FmEditor = {
  name: "editor",
  install(){

    fabric.PREVIEW_MODE_OPTIONS = PREVIEW_MODE_OPTIONS

    fabric.util.on({
      "entity:created": function (e) {
        if (e.target.editor) {
          e.target.editor._populateWithDefaultProperties(e.target, e.options)
          delete e.options.editor
        }
      }
    })

    fabric.Editor = fabric.util.createClass({
      doNotRender: false,
      initialize: function(options,callback){
        this.klasses = [];
        options = fabric.util.object.clone(options)

        //todo create setter
        if (options.plugins) {
          options.prototypes = this.initPlugins(options.plugins, options.prototypes)
          delete options.plugins
        }
        this.on(this.eventListeners)
        //todo create setter
        if (options.eventListeners) {
          this.on(options.eventListeners)
          delete options.eventListeners;
        }

        //todo create setter
        this.virtual = options.virtual || fabric.isLikelyNode
        delete options.virtual

        options =  fabric.util.object.clone(options)

        this.fire("created",{options: options})
        this.promise = this.load(options,() => {
          callback && callback()
        })
      },
      //active object observer
      $activeobject (callback){
        this.on("target:changed",({selected,deselected})=>{
          callback(selected, deselected && deselected[0])
        })
      },
      removeProgress(progressObject){
        this.progress.splice(this.progress.indexOf(progressObject));
        this.fire("progress:removed",{target:progressObject})
        if(!this.progress.length){
          this.fire("progress:ready")
        }
      },
      addProgress(progressObject){
        this.progress.push(progressObject);
        this.fire("progress:added",{target:progressObject})
      },
      progress: [],
      load(options,callback){
        return new Promise((resolve,reject) => {
          this.loaded = false;
          delete this.target;
          if(this.history){
            this.history.clear();
          }
          this.fire("loading:before", {options: options});
          this.processing = true;
          this.runPreloaders(options,() =>{
            this.set(options, ()=>{
              // this.runPostloaders(options,() =>{
              this.processing = false;
              setTimeout(()=> {
                this.loaded = true;
                this.fire("loaded");
                resolve(this);
                this.onLoad(this);
                callback && callback();
              });
              // });
            });
            setTimeout(()=> {
              this.ready = true;
              this.fire("ready");
              this.onReady(this);
            });
          });
        }).catch(e => {
          fabric.traceError(e);
          throw(e);
        })
      },
      runPreloaders(options, callback, index){
        if(!index) index = 0;
        if(!this.preloaders[index]){
          callback();
          return;
        }
        this.preloaders[index].call(this,options,()=>{
          this.runPreloaders(options, callback, ++index);
        })
      },
      // runPostloaders(options, callback, index){
      //   if(!index) index = 0;
      //   if(!this.postloaders[index]){
      //     callback();
      //     return;
      //   }
      //   this.postloaders[index].call(this,options,()=>{
      //     this.runPostloaders(options, callback, ++index);
      //   })
      // },
      // postloaders: [],
      preloaders: [],
      klasses: null,
      type: "editor",
      stateProperties: ["slide", "slides"],
      storeProperties: [],
      activeSlide: 0,
      ready: false,
      optionsOrder: ["static","doNotRender","mediaRoot", "prototypes", "actions", "canvasContainer", "fonts", "history", "*", "toolbars", "tools", "objects", "slide", "slides", "activeSlide"],
      onReady: function (editor) {},
      onLoad: function (editor) {},
      // initSteps: [
      //   // "preloader",
      //   "setOptions",
      //   // "postloader",
      //   "finalise"
      // ],
      previewMode: PREVIEW_MODE_OPTIONS.SINGLE,
      cacheProperties: [],
      /**
       * Additional Event Listeners couldbe used to detect activeobject changes
       *  - canvas:created
       *  - entity:load - Event fired on creation of every new fabric instance(canvas,brush,object)
       *
       *  @example
       *  'entity:load' : function(e){
       *     if(e.options.boxType == 'machine') {
       *       e.options.type = "machine-mask-rectangle";
       *     }
       *   }
       */
      eventListeners:  {
        "created": function (e) {
          if(e.options.prototypes && e.options.prototypes.Editor){
            defaults(e.options,e.options.prototypes.Editor)
          }
        },
        // "entity:load": function (e) {
        // },
        // "canvas:created": [],
      },
      createObject: function (originalOptions,callback) {
        let options = Object.assign({editor: this}, this.getDefaultProperties(originalOptions.type), originalOptions);
        return fabric.util.createObject(options, callback );
      },
      setMediaRoot: function (val) {
        if (val) {
          if (val.indexOf("://" !== -1)) {
            fabric.mediaRoot = val;
            return;
          }
          let _dirname;
          if (fabric.isLikelyNode) {
            _dirname = __dirname;
          } else {
            _dirname = fabric.util.path.getParentDirectoryUrl(window.location.href);
          }
          let _last = val[val.length - 1];
          if (_last !== "/" && _last !== "\\") {
            val += "/"
          }
          val = fabric.util.path.resolve(_dirname + val);
          fabric.mediaRoot = val;
        }
      },
      createCanvas: function (data) {
        let fabricCanvas;
        let options = Object.assign({editor: this},data);
        // if (data.width) {
        //   options.width = data.width;
        // }
        // if (data.height) {
        //   options.height = data.height;
        // }
        if (fabric.isLikelyNode) {
          fabricCanvas = new fabric.StaticCanvas(options);
        } else {
          fabricCanvas = new fabric.Canvas(options);
        }
        // fabricCanvas.editor = this;

        // delete data.width;
        // delete data.height;

        // this.fire("canvas:created");
        return fabricCanvas;
      },
      getLibraryElements: function (options) {
        return [];
      },
      _setCanvasContainer: function (el, callback) {
        this.canvasContainer = el;
      },
      setCanvasContainer: function (canvasContainer, callback) {
        //waiting while doument is ready
        if (canvasContainer.constructor === String) {
          let el = document.getElementById(canvasContainer);
          if (el) {//} || fabric.isLikelyNode) {
            this._setCanvasContainer(el);
            callback();
          } else {
            $(document).ready(() => {
              this._setCanvasContainer(document.getElementById(canvasContainer));
              callback();
            })
          }
        } else {
          this._setCanvasContainer(canvasContainer);
        }
      },
      dispose: function () {
        this.canvas.dispose();
      },
      slides: null,
      slide: null,
      setSlide: function (slide, callbackFn) {
        this._setSlidesData([slide],callbackFn);
        this.setActiveSlide(0);
      },
      setSlides: function (slides, callbackFn) {
        this._setSlidesData(slides,callbackFn);
      },
      _replaceCanvasElement(container, slideWrapper, _oldWrapper) {
        //container CANVAS
        if (container.constructor === HTMLCanvasElement) {
          container.parentNode.replaceChild(slideWrapper, container);
          container = slideWrapper;
        }
        else if (!_oldWrapper) {
          //container DIV
          container.appendChild(slideWrapper);
        }
        //container .CANVAS-CONTAINER
        else if (container === _oldWrapper) {
          _oldWrapper.parentNode.replaceChild(slideWrapper, _oldWrapper);
          container = slideWrapper;
        }
        //container DIV
        else if (_oldWrapper) {
          $(_oldWrapper).remove();
          container.appendChild(slideWrapper);
        }
      },
      _setActiveSlide(slide) {
        if (this.canvas === slide) return;
        let old = this.canvas;
        this.canvas = slide;

        if (old) {
          // old.discardActiveGroup();
          old.discardActiveObject();
          if(this.previewMode !== PREVIEW_MODE_OPTIONS.SINGLE){
            old.renderAll();
          }
        }

        if (this.previewMode === PREVIEW_MODE_OPTIONS.SINGLE) {
          if (this.canvasContainer) {
            this._replaceCanvasElement(this.canvasContainer, slide.wrapperEl, old && old.wrapperEl);
          }
        } else {
          //container DIV
          if (old) {
            $(old.wrapperEl).removeClass("active");
          }
          $(slide.wrapperEl).addClass("active");
        }

        if(slide._onResize){
          slide._onResize();
        }
        this.fire("slide:changed", {selected: this.canvas, deselected: old});
      },
      setActiveSlide: function (slideId) {
        this.activeSlide = slideId;
        if (fabric.isLikelyNode) {
          return;
        }
        let slide;
        if (!this.slides) {
          return false;
        }
        if (slideId.constructor === Number) {
          slide = this.slides[slideId];
        }
        else if (slideId.constructor === String) {

        } else {
          slide = slideId;
        }
        this._setActiveSlide(slide);
      },
      static: fabric.isLikelyNode,
      addSlide: function (options,callback) {
        //  options = fabric.util.object.clone(options);
        //   options.editor = this;
        let slide;
        if (this.static) {
          slide = new fabric.StaticCanvas(options,callback,this);
        } else {
          slide = new fabric.Canvas(options,callback,this);
        }
        this.slides.push(slide);
        if (this.previewMode === PREVIEW_MODE_OPTIONS.ALL) {
          if (this.canvasContainer) {
            this.canvasContainer.appendChild(slide.wrapperEl);
            slide._onResize();
          }
        } else {
          this._old = this.canvas;
        }

        slide.on("mouse:down:before", function () {
          let index = this.editor.slides.indexOf(this)
          this.editor.setActiveSlide(index);
        }, true);

        this.fire("slide:created", {target: slide});
        return slide;
      },
      removeSlide: function (slide) {
        let _s = this.slides;
        let _curPos = _s.indexOf(slide);
        _s.splice(_curPos, 1);
        slide.fire("removed");

        if (slide === this.activeSlide) {
          delete this.activeSlide;
        }

        if (this.slides.length === 0) {
          let slideData = {};
          let _slide = this.addSlide(slideData);
          _slide.load(_slide.object);
          this.setActiveSlide(0);
        } else if (this.slides.length > _curPos) {
          this.setActiveSlide(_curPos);
        } else {
          this.setActiveSlide(_curPos - 1);
        }
      },
      getSlides() {
        if (!this.slides)return;
        return this.slides.map(slide => slide.getState() )
      },
      getSlide() {
        if (!this.slide)return;
        return this.slide.getState();
      },
      _setSlidesData: function (slides,callback) {
        delete this.canvas;
        delete this.activeSlide;

        if (this.slides) {
          this.slides.forEach(slide => {
            slide.processing = true;
            let wrapper = slide.wrapperEl;
            if(wrapper.parentNode){
              wrapper.parentNode.removeChild(wrapper);
            }
            slide.dispose();
            // parent.appendChild(wrapper);
            // slide.lowerCanvasEl.parentNode.removeChild(slide.lowerCanvasEl);
          });
        }
        this.slides = [];
        this._processingSlides = true;
        for (let slide of slides) {
          this.addSlide(slide, () => {
            if (this._processingSlides) {
              return false;
            }
            for (let slide of this.slides) {
              if (!slide.loaded) return false;
            }
            this.setActiveSlide(0);
            callback && callback();
            this.fire("loaded", {});
            return true;
          })
        }
        if(this.activeSlide){
          this.setActiveSlide(this.activeSlide);
        }
        this._processingSlides = false;
      },
      //--------------------------------------------------------------------------------------------------------------------
      // Event Listeners
      //--------------------------------------------------------------------------------------------------------------------

      setEventListeners: fabric.Object.prototype.setEventListeners,



      /**
       * default prototypes propertes for objects
       */
      /*prototypes: {
        Object: {
          includeDefaultValues: false
        },
        Canvas: {
          includeDefaultValues: false
        }
      },*/
      getDefaultProperties: function(stringTypeOrPrototype){
        let klassname, proto
        if(stringTypeOrPrototype.constructor === String){
          klassname = fabric.util.string.capitalize(fabric.util.string.camelize(stringTypeOrPrototype),true)
          let _klass = this.getKlass(klassname)
          proto = _klass && _klass.prototype || {}
        }else{
          proto = stringTypeOrPrototype
          klassname = fabric.util.string.capitalize(fabric.util.string.camelize(proto.type),true)
        }
        let _protoProperties = proto && proto.__proto__ && proto.__proto__.type && this.getDefaultProperties(proto.__proto__) || {}
        let _defaultProperties =  klassname && this.prototypes && fabric.util.object.clone(this.prototypes[klassname]) || {}

        Object.assign(_protoProperties,_defaultProperties)
        return _protoProperties
      },
      getKlass: function(type){
        let klassName = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1))
        return this.klasses[klassName] || fabric[klassName]
      },
      getPrototypes () {
        if(!this._prototypes)return
        return this._prototypes
      },
      setPrototypes: function (prototypes) {
        this._prototypes = prototypes

        this.prototypes = fabric.util.evalPrototypes(prototypes,this.klasses)

        if (this.prototypes.Editor) {
          fabric.util.object.extend(this, this.prototypes.Editor,true)
        }
        if (this.actions && this.actions.constructor === Function) {
          this.actions = this.actions.call(this)
        }
      },
      _populateWithDefaultProperties: function(target,options){
        if(!target.disableDefaultProperties){
          defaults(options, this.getDefaultProperties(target, options))
          for (let key in options) {
            let value = options[key]
            if (key[0] === "+") {
              let _key = key.substr(1)
              let _arr = target.get(_key)
              if (_arr instanceof Array) {
                _arr = _arr.slice().concat(value)
              } else {
                _arr = Object.assign({}, _arr, value)
              }
              options[_key] = _arr
              delete options[key]
            }
          }
        }
      },














      ///////////////////////////////////////////////////

      initPlugins(plugins, prototypes = {}) {
        this.installedPlugins = [];
        // if (plugins === "*") {
        //   plugins = Object.k;eys(fabric.plugins)
        // }
        // this.plugins = plugins


        fabric.installPlugins(plugins,this,prototypes)

        // for (let klassName in customPrototypes) {
        // 	if (!prototypes[klassName]) {
        // 		prototypes[klassName] = {}
        // 	}
        // 	extendPrototype(prototypes[klassName], customPrototypes[klassName])
        // }
        return prototypes;
      },
      /**
       * move slide to another position
       * @param slide
       * @param newPosition
       */
      moveSlide: function (slide,newPosition) {
        var _s = this.slides;

        var _curPos = _s.indexOf(slide);
        newPosition = parseInt(newPosition);

        if (_curPos < newPosition) {
          _s.splice(_curPos, 1);
          _s.splice(newPosition,0, slide);
        } else {
          _s.splice(_curPos, 1);
          _s.splice(newPosition, 0, slide);
        }
      },

      //Observable watcher
      $slide: function(callback){
        if(this.canvas){
          callback(this.canvas)
        }
        if(this.slides){
          for(let slide of this.slides){
            callback(slide)
          }
        }

        fabric.util.on("entity:created", ({target}) => {
          if(target.type === "canvas" && target.editor === this){
            callback(target)
          }
        });

      },
      /**
       * replace slide
       * @param slide
       * @param newPosition - position of the second slide
       */
      replaceSlide: function (slide,newPosition) {
        var _s = this.slides;
        var _replacedSlide = _s[newPosition];
        var _curPos = _s.indexOf(slide);
        if (_curPos < newPosition) {
          _s.splice(newPosition, 1, slide);
          _s.splice(_curPos, 1, _replacedSlide);
        } else {
          _s.splice(_curPos, 1, _replacedSlide);
          _s.splice(newPosition, 1, slide);
        }
      },
      setActiveSlideByIndex: function(index){
        this.setActiveSlide(this.slides[index])
      },
      setActiveSlideById: function(id){
        this.setActiveSlide(  this.slides.find(slide => slide.id === id))
      },
      duplicateSlide: function (slideData) {
        slideData = slideData.toObject();
        var _slide = this.addSlide(slideData);
        _slide.load(_slide.object);
      },
      nextSlide: function () {
        var i = this.slides.indexOf(this.activeSlide);
        if (i < this.slides.length - 1) {
          this.setActiveSlide(i + 1);
        }
      },
      prevSlide: function () {
        var i = this.slides.indexOf(this.activeSlide);
        if (i > 0) {
          this.setActiveSlide(i - 1);
        }
      },
      gotoSlide: function (slide) {
        this.setActiveSlide(slide);
      },
      nextSlideAvailable: function () {
        var i = this.slides.indexOf(this.activeSlide);
        return i < this.slides.length - 1
      },
      prevSlideAvailable: function () {
        var i = this.slides.indexOf(this.activeSlide);
        return i > 0
      },
      updateThumbs: function(){
        this.slides.forEach(slide => {
          slide.canvas.setDimensions({width: this.canvas.width, height: this.canvas.height})
        })
      }
    })

  },
  prototypes: {
    Canvas: {
      title: "New Slide",
      unique: false,
      required: false,
      // stateProperties: ["unique","required"],
      removeSlide: function(){
        this.editor.removeSlide(this)
      },
      duplicateSlide: function(){
        this.editor.duplicateSlide(this)
      }
      // eventListeners: fabric.util.merge(fabric.Canvas.prototype.eventListeners, {
      //   "modified" : function(e){
      //     if(this.canvas){
      //       this.canvas.canvas.set(e.states.modified);
      //       this.canvas.fire("modified");
      //     }
      //   },
      //   "object:modified" : function(){
      //     if(this.canvas){
      //       this.canvas.fire("modified");
      //     }
      //   }
      // })
    }
  }
}

/**
 * FabricJS Object Data.
 * @typedef {Object} fabric.ObjectData
 * @type String type
 * @type Number [top]
 * @type Number [left]
 * @type Number [width]
 * @type Number [height]
 * @type Number [scaleY]
 * @type Number [scaleX]
 * @type Number [angle]
 * @default
 */

/**
 * FabricJS Canvas Data.
 * @typedef {Object} fabric.CanvasData
 * @property {Array<fabric.ObjectData>} [objects]
 * @property {Number} [width]
 * @property {Number} [height]
 * @property {(String|fabric.Pattern)} [backgroundColor] Background color of canvas instance.
 * @property {(String|fabric.Image)} [backgroundImage] Background color of canvas instance.
 * @property {(String|fabric.Pattern)} [overlayColor] overlay color of canvas instance.
 * @property {(String|fabric.Image)} [overlayImage] overlay color of canvas instance.
 */

/**
 * FabricJS Editor Data.
 * @typedef {Object} fabric.EditorData
 * @property {Array<fabric.CanvasData>} [slides]
 * @property {fabric.CanvasData} [slide]
 */

/**
 * convert data to readable format
 * @param {String | Array<fabric.CanvasData> | fabric.CanvasData | Object<string,fabric.CanvasData> |  fabric.EditorData} data filename or editor data or canvas data
 * @returns {fabric.EditorData}
 */
// fabric.util.formatEditorData = function(data){
//   //support of <FileNameString> format
//   if (data.constructor === String) {
//     data = fabric.util.load(path.resolve(data), 'json');
//   }
//   //support of <[CanvasObject...]> format
//   if(data.constructor === Array){
//     data = {slides: data};
//   }
//   //Object
//   else{
//     //support of <CanvasObject> format
//     if(!data["slide"] && !data["slides"]){
//       data = {slides: [data]};
//     }
//   }
//   for(let i in data.slides){
//     if(data.slides[i].constructor === String){
//       data.slides[i] = JSON.parse(data.slides[i]);
//     }
//   }
//   return data;
// }
