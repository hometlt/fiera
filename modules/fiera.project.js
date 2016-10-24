'use strict';
var History = require('./../plugins/history');

/**
 * Project class. Used for slides manipulation. add/remove/set active slide/move/replace slides
 * keep all information about current project
 * @param data
 * @constructor
 */
fabric.Project = function (data) {
  this.loaded = false;
  this.initialize(fabric.util.object.deepExtend({},data));

  if(this._default_event_listeners){
    for(var i in this._default_event_listeners){
      this.on(i,this._default_event_listeners[i]);
    }
  }
};

fabric.Project.prototype = {
  activeSlide: null,
  removeSlide: function (slide) {
    var _s = this.slides;
    var _curPos = _s.indexOf(slide);
    _s.splice(_curPos, 1);

    if(slide == this.activeSlide){
      delete this.activeSlide ;
    }
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
  storeProperties: ["title", "manifest", "limits", "templates"],
  toObject: function(propertiesToInclude,canvasPropertiesToInclude) {
    var _slidesData = [];
    for(var i in this.slides){
      _slidesData.push(this.slides[i].canvas.toObject(canvasPropertiesToInclude));
      //delete _slidesData[i].thumb;
    }
    var object = {};

    for(var i in this.storeProperties){
      var _prop = this.storeProperties[i];
      object[_prop] = this[_prop]
    }

    for(var i in propertiesToInclude){
      var _prop = propertiesToInclude[i];
      object[_prop] = this[_prop];
    }

    object.slides = _slidesData;

    return object;
  },
  updateSlideTemplate: function(slide) {
    slide.canvas.setTemplate(slide.canvas.template);
    this.canvas.template = slide.canvas.template;
    if(this.activeSlide  == slide){
      this.canvas.setTemplate(slide.canvas.template);
    }
  },
  updateTemplate: function(template) {
    for(var i in this.slides){
      if(this.slides[i].canvas.template == template){
        this.updateSlideTemplate(this.slides[i]);
      }
    }
  },
  defaultTemplate:  "",
  slides: [],
  url: "",
  title: "",
  manifest: {
    format: ""
  },
  limits: {
    max: 10,
    min: 2
  },
  templates: [],
  dpi: 200,
  _id_counter: 0,
  setCanvas: function (canvas) {
    this.canvas = canvas;
    this.canvas.project = this;
    if(this.history) {
      canvas.initHistory(this.history);
    }
    this.fire("canvas:initilized");
    canvas.on('after:render', this.mirrorModified.bind(this) );
  },
  initialize: function (options) {

    fabric.util.object.extend(this, {
      last_id: 1,
      scaleValue: 1,
      activeSlide: null,
      history: null,
      slides: [],
      canvas: null
    });

    this.aligmentLineX = false;
    this.aligmentLineY = false;

    fabric.util.object.extend(this,options);
    fabric.util.object.defaults(options,this.defultOptions);

    this.setAccess(this.access);

    if(options.gridsnapper !== undefined) {
      this.gridsnapper = options.gridsnapper
    }
    if(options.history !== undefined) {
      this.history = options.history;
    }
    if(options.data){
      this.data = options.data;
    }
    if(this.history) {
      this.history = new History(this);
    }


    if(options.canvas){
      var _canvas = new fabric.SlideCanvas(document.getElementById(options.canvas));
      _canvas.application = this.application;
      _canvas.project = this;
      this.setCanvas(_canvas);
    }

    return this;
  },
  load: function (data) {
    if(this.canvas) {
      this.canvas.fire("loading:begin", {type: "project", target: this});
    }
    data = data || this.data;
    this.history && this.history.disable();
    this.activeSlide = null;
    this.slides = [];

    if (this.canvas) {
      this.canvas._objects.length = 0;
    }
    delete this.activeSlide;

    if(data.templates !== undefined){
      this.templates = data.templates;
    }

    for(var i in data.slides){
      this.addSlide(data.slides[i]);
    }
    delete data.slides;
    fabric.util.object.extend(this,data);

    this.preload();
    if(this.canvas){
      this.setActiveSlideByIndex(0);
    }else{
      this.lazyLoad();
    }
  },
  unloadUnactiveSlides: false,
  lazyLoadEnabled: true,
  setActiveSlide: function(slide){
    if(this.canvas.processing)return;
    if(this.activeSlide === slide)return;

    this.fire("slide:change:begin", {canvas: this.canvas});
    if(this.activeSlide) {
      delete this.activeSlide.canvas.mirrorSlide;
    }

    this.processing =true;
    if (this.unloadUnactiveSlides && this.canvas && this.activeSlide) {
      delete this.activeSlide.canvas;
      this.activeSlide.fire("canvas:changed",{canvas: null});
      this.activeSlide.data = this.canvas.toObject();
      this.canvas.clear();
    }
    this.activeSlide = slide;
    this.activeSlide.canvas.mirrorSlide = this.canvas;



    var _this = this;
    this.canvas.processing = true;

    if(this.activeSlide.canvas.loaded){
      _this.canvas.mirror(_this.activeSlide.canvas);
      _this.canvas.processing = false;
      _this.canvas.renderAll();
      _this.fire("slide:changed", {canvas: _this.canvas});
      _this.lazyLoad();
    }else{

      _this.canvas.fire("loading:begin",{type:"current" , target: _this.canvas});
      this.activeSlide.canvas.load(slide.object, function () {
        _this.canvas.mirror(_this.activeSlide.canvas);
        _this.canvas.processing = false;
        _this.canvas.renderAll();
        _this.fire("slide:changed", {canvas: _this.canvas});
        _this.canvas.fire("loading:end",{type:"current" , target: _this.canvas});
        _this.lazyLoad();
      });
    };
  },
  preload: function(){
    for(var i in this.slides) {
      var _slide = this.slides[i];
      _slide.canvas.preload(_slide.object, function () {
        _slide.fire("modified");
      });
    }
  },
  lazyLoad: function(){

    var _proj = this;
    if(this.lazyLoadEnabled){
      for(var i in this.slides){
        var _slide = this.slides[i];
        if(!_slide.canvas.loaded && !_slide.canvas.processing){
          _slide.canvas.load(_slide.object,function(){
            this.fire("modified");
            _proj.fire("silde:loading:end", {target: this});
            for(var _s in _proj.slides){
              if(!_proj.slides[_s].canvas.loaded){
                return;
              }
            }
            _proj.fire("loading:end", {target: _proj});
          });
        }
      }
    }else{
      _proj.fire("loading:end", {target: _proj});
    }
  },
  mirrorModified: function(){
    this.activeSlide && this.activeSlide.fire("modified");
  },
  setActiveSlideByIndex: function(index){
    this.setActiveSlide(this.slides[index])
  },
  setActiveSlideById: function(id){
    this.setActiveSlide(  fabric.util.object.findWhere(this.slides,{id: id}));
  },
  getTemplate: function(id){
    id = id || this.defaultTemplate;
    for(var i in this.templates){
      if(this.templates[i].id == id)
        return this.templates[i];
    }
  },
  initHistory: function(){
    this.history = new History(this);
  },
  duplicateSlide: function (slideData) {

    slideData = slideData.canvas.toObject();
    var _slide = this.addSlide(slideData);
    _slide.canvas.load(_slide.object);
  },
  addSlide: function (slide) {

    slide = slide || {
        title : 'Новый Слайд'
      };
    slide.template = slide.template || this.defaultTemplate;
    if(slide.template) {
      slide.template = this.getTemplate(slide.template);
    }

    if(fabric.isLikelyNode){
      fabric.Canvas = fabric.SlideCanvas;
      var w = slide.slideWidth || slide.template.width;
      var h = slide.slideHeight || slide.template.height;
      var zoom = fabric.SlideCanvas.prototype.zoom || fabric.Canvas.prototype.zoom || 1;
      var _canvas = fabric.createCanvasForNode(w * zoom,h * zoom);
    }else{
      var _canvas =  new fabric.SlideCanvas();
    }
    _canvas.application = this.application;
    _canvas.project = this;

    var _object = {
      object: slide,
      data: slide.data,
      project: this,
      id:   ++this._id_counter,
      canvas : _canvas
    };

    fabric.util.observable(_object);

    this.slides.push(_object);
    return _object;
  },
  getPrice: function () {
    var _price = 0;
    for (var i in this.slides) {
      _price += parseFloat(this.slides[i].data.price) || 0;
    }
    return _price;
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
    this.setActiveSlide(slide - 1);
  },
  nextSlideAvailable: function () {
    var i = this.slides.indexOf(this.activeSlide);
    return i < this.slides.length - 1
  },
  prevSlideAvailable: function () {
    var i = this.slides.indexOf(this.activeSlide);
    return i > 0
  },
  actions: {
    save: {
      title: "save project",
      className: 'fa fa-floppy-o',
      action: function () {
        var data = this.toObject();
        this.application.api.save(data);
      }
    }
  }
};
fabric.util.object.extend(fabric.Project.prototype,fabric.Observable);

fabric.util.object.extend(fabric.SlideCanvas.prototype, {
  /**
   * Copy the content of active slide to main canvas.
   * @param slide
   */
  mirror: function (slide) {
    this.discardActiveGroup();
    this.discardActiveObject();
    this.setOriginalSize(slide)
    this.slideWidth = slide.slideWidth;
    this.slideHeight = slide.slideHeight;
    this.backgroundImage = slide.backgroundImage;
    this.setWidth((slide.originalWidth || slide.width)* this.viewportTransform[0]);
    this.setHeight((slide.originalHeight || slide.height)  * this.viewportTransform[0]);
    this._onResize();
    this._backgroundLayer = slide._backgroundLayer;
    this.originalSlide = slide;

    this.template = slide.template;
    this.offsets = slide.offsets;
    this._objects = [];
    this.layers = slide.layers;

    if(this.backgroundImage){
      this.backgroundImage.canvas = this;
    }
    if(this._backgroundLayer) {
      for (var i in this._backgroundLayer) {
        this._backgroundLayer[i].canvas = this;
        this._backgroundLayer[i].setCoords();
      }
      this.setActiveArea(true);
    }
    if(slide._objects) {
      for (var i in slide._objects) {
        this.add(slide._objects[i]);
      }
    }
    slide._objects = this._objects;
    this.fire('changed', {target: slide})
  },
  project: null,
  unique: false,
  required: false,
  stateProperties: ["unique","required"],
  removeSlide: function(){
    this.project.removeSlide(this)
  },
  duplicateSlide: function(){
    this.project.duplicateSlide(this)
  }
});

fabric.util.createAccessors(fabric.Canvas);
