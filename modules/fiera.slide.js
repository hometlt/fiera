'use strict';

fabric.SlideCanvas = fabric.util.createClass(fabric.Canvas,fabric.PluginsMixin, {
  _createUpperCanvasNative: fabric.Canvas.prototype._createUpperCanvas,
  width: 160 ,
  height: 90,
  dotsPerUnit: 1,
  scale: 1,
  loaded: false,
  plugins: {
    preloaders: [
      function initZooming(options) {
        this.enableClipAreaZooming && this.enableClipAreaZooming();
      },
      function initTemplate(options){
        this.template && this.setTemplate(this.template);
      }
    ],
    loaders: [],
    savers : [
      function serializeThumb(propertiesToInclude, _data){
        if(propertiesToInclude.indexOf('thumb') !== -1){
          var size = fabric.util.getProportions(this.getOriginalSize(), this.thumbSize, 'fit');
          var canvas = fabric.util.createCanvasElement();
          canvas.width = size.width;
          canvas.height = size.height;
          this.renderThumb(canvas);
          _data.thumb = canvas.toDataURL();
        }
      },
      function serializeTemplate(propertiesToInclude, _data) {
        if (propertiesToInclude.indexOf('template') !== -1) {
          if (this.template) {
            for (var i in _data.template) {
              if (JSON.stringify(_data[i]) == JSON.stringify(_data.template[i])) {
                delete _data[i];
              }
            }
            _data.template = this.template.id;
          }
        }
      }
    ]
  },
  setInteractive: function (value) {
    this.interactive = value;
  },
  contextTopImageSmoothingEnabled: true,
  _createUpperCanvas: function () {
    this._createUpperCanvasNative();
    var ctx = this.contextTop;

    if(ctx.imageSmoothingEnabled){
      ctx.imageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
      return;
    }
    ctx.webkitImageSmoothingEnabled = this.contextTopImageSmoothingEnabled;
    ctx.mozImageSmoothingEnabled    = this.contextTopImageSmoothingEnabled;
    ctx.msImageSmoothingEnabled     = this.contextTopImageSmoothingEnabled;
    ctx.oImageSmoothingEnabled      = this.contextTopImageSmoothingEnabled;
  },
  initialize: function (el, options,callback) {
    if(el && el.constructor == Object){
      callback= options;
      options = el;
      el = null;
    }

    this.id = fabric.SlideCanvas.__idcounter++;
    this._initStatic(el, {});

    if(!options || !options.virtual){
      this.create()
    }

    if(options && options.onResize){
      this.onResize = options.onResize;
      this.on("resize",this.onResize);
    }

    if (this.requestAnimFrame) {
      this.addVideosSupport();
    }

    this.on({
      'object:moving': function (obj) {
        this.fire('target:modified', this, obj)
      },
      'selection:cleared': function (event) {
        this.target = null;
        this.fire('target:cleared', event);
      },
      'object:selected': function (event) {
        this.target = event.target;
        this.fire('target:changed', event);
      },
      'group:selected': function (event) {
        this.target = event.target;
        this.fire('target:changed', event);
      }
    });

    if(this._default_event_listeners){
      for(var i in this._default_event_listeners){
        this.on(i,this._default_event_listeners[i]);
      }
    }

    this.load(options,callback);
    this.fire("created");
    fabric.fire("canvas:created",{target : this});
  },
  create: function () {
    this.created = true;
    this._initInteractive();
    this._createCacheCanvas();
  },
  toObject: function (propertiesToInclude) {

    propertiesToInclude = (propertiesToInclude || []).concat(this.storeProperties);

    var _objs = this.getObjects();

    _objs = fabric.util.object.filter(_objs,{stored: true});
    _objs = _objs.map(function(instance) {
      return instance.toObject(propertiesToInclude);
    });

    var _data = {
      objects: _objs
    };

    if(propertiesToInclude.indexOf('background') !== -1){
      fabric.util.object.extend(_data, this.__serializeBgOverlay());
    }

    fabric.util.populateWithProperties(this, _data, this.objectsPropertiesToInclude);

    for(var i in propertiesToInclude){
      var _prop = propertiesToInclude[i];
      _data[_prop] = this[_prop];
    }
    _data.width = this.originalWidth;
    _data.height = this.originalHeight;

    this.plugins.savers.forEach(function(saver){
      saver.call(this, propertiesToInclude, _data);
    }.bind(this));

    return _data;
  },
  add: function (el,isNewElement) {
    fabric.util.object.inherits(el, fabric.SlideObject);
    this.callSuper('add', el);
    if(isNewElement){
      this.addAlementInTheMiddle(el);
      this.setActiveObject(el);
    }
    this.renderAll();
  },
  thumbSize: {
    width: 50,
    height: 100
  },
  setTemplate: function(template){

    this.template = template;

    this.setWidth(this.slideWidth || template.width);
    this.setHeight(this.slideHeight || template.height);
    this.originalHeight = this.height;
    this.originalWidth = this.width;

    this.set(fabric.util.object.rearrange(template,["areas","helpers","offsets"]));

    this._update_clip_rect();
    this._update_background_image();
    this.fire("modified",{type: "template"});
    this.renderAll();
  },
  addText: function (text, options) {
    this.add(new fabric.IText(fabric.Text.prototype.defaultText || "Text", {
      clipTo: this.activeArea,
      movementLimits : this.activeArea
    }), true);
  },
  uploadAction: function (img, options) {
    if (!img)return;
    var obj = new fabric[this.uploadClass](img, options || {
        clipTo: this.activeArea,
        movementLimits : this.activeArea
      });
    this.add(obj,true);
  },
  uploadClass: 'Image',
  uploadImageTool: false,
  addTextTool: false
});
fabric.SlideCanvas.__idcounter = 0;
fabric.SlideCanvas.fromJson = function(url,callback , element){
  fabric.util.data.loadJson(url,function(data){
    new fabric.SlideCanvas(element,data,callback)
  })
};

fabric.SlideCanvas.prototype.actions = fabric.util.object.extend({}, {
  //selectAll: {
  //  title: 'selectAll',
  //  type: 'key'
  //},
  addText: {
    insert: 'addTextTool',
    className:  'fa fa-font',
    title: 'text',
    action: function () {
      this.addText('Text',{});
    }
  },
  upload: {
    insert: 'uploadImageTool',
    className:  'fa fa-upload',
    key: 'U',
    title: 'upload image',
    action: function () {
      fabric.util.uploadImage(this.uploadAction.bind(this))
    }
  }
});

fabric.SlideCanvas.addPlugin = fabric.PluginsMixin.addPlugin.bind(fabric.SlideCanvas);
