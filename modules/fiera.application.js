'use strict';


/**
 * Точка запуска приложенич
 */
fabric.Application = fabric.util.createClass(fabric.Observable,fabric.PluginsMixin,{
  type: 'application',
  toolbar: false,
  canvasClass: 'SlideCanvas',
  resizable: false,
  history: true,
  /**
   * functions will be called on different application creation stages
   */
  plugins: {
    preloaders: [],
    configuration: [],
    canvas: [],
    postloaders: []
  },
  initialize: function (options) {

    this.options =  fabric.util.object.clone(options);

    if(this.options.callback){
      this.callback = this.options.callback;
      delete this.options.callback;
    }
    if(this.options.plugins){
      fabric.util.object.extend(this.plugins, this.options.plugins);
      delete this.options.plugins;
    }

    if(this.options.canvasContainer){
      this.canvasContainer = this.options.canvasContainer;
      delete this.options.canvasContainer;
    }

    fabric.util.order([
      this.runPlugins.bind(this,"preloaders"),
      this.loadConfiguration,
      this.runPlugins.bind(this,"configuration"),
      this.createCanvas,
      this.runPlugins.bind(this,"canvas"),
      this.createApp,
      this.runPlugins.bind(this,"postloaders"),
      this.callback
    ],this)
  },
  printBanner: function(){
    if(this.options.credentials === undefined || this.options.credentials){
      console.info("%cFiera Canvas Editor%c by %cDenis Ponomarev%c %c%6$s%c / %c%9$s%c", "color: #ffa500", "color: #202020", "color: #2EC06C", "color: #202020", "color: #337ab7", "www.hometlt.ru", "color: #202020", "color: #337ab7", "ponomarevtlt@gmail.com", "color: #202020");
    }
  },
  onSlideLoaded: function () {},
  onCanvasCreated: function () {},
  callback: function () {},
  loadConfiguration: function (resolve,error) {
    var _app = this;
    fabric.util.promise
      .map(
        this.options.configuration,
        function(value){
          return new Promise(function(resolve,fail) {
            fabric.util.data.loadJson(value,resolve,fail);
          });
        }
      )
      .then(function(results){
        fabric.util.object.extend(_app,results)
      })
      .then(resolve,error);
  },
  setCanvasContainer: function (id) {
    if(this._appCreated){
      this.createCanvas(this.canvasContainer, this.canvas);
      this.project.setCanvas(this.canvas);
    }else{
      this.canvasContainer = id;
    }
  },
  createApp: function (callback) {
    var _canvas = this.canvas;

    fabric.util.object.extend(this, this.options);

    if (this.project) {
      var _project = new fabric.Project();
      _project.application = this;
      if(this.history){
        _project.initHistory();
        _project.enableHistory();
      }

      _canvas && _project.setCanvas(_canvas);

      if (this.project !== true) {
        _project.load(this.project);
      }
      this.project = _project;
    }else{
      if(this.history){
        _canvas.initHistory();
        _canvas.enableHistory();
      }
    }

    if (this.slide) {
      if (_canvas.load) {
        _canvas.load(this.slide, this.onSlideLoaded.bind(this));
      } else {
        _canvas.createObjects(this.slide,this.onSlideLoaded.bind(this));
      }
    }
    if(this._default_event_listeners){
      for(var i in this._default_event_listeners){
        this.on(this._default_event_listeners[i].event,this._default_event_listeners[i].action);
      }
    }


    if(_canvas){
      _canvas.fire("loading:end",{type: "application" ,target: this});
    }

    this.fire("created");
    callback();
  },
  createCanvas: function (callback) {
    if(!this.canvasContainer){
      return true;
    }
    if (this.canvasContainer.constructor == String) {
      var el = document.getElementById(this.canvasContainer);
    } else {
      el = this.canvasContainer;
    }

    this.canvas = new fabric[this.canvasClass](el, this.canvas || {});
    this.canvas.application = this;

    this.onCanvasCreated();
    callback();
    this.canvas.onResize();
  },
  dispose: function(){
    this.canvas.dispose();
  },
  setResizable: function(){
    if (this.resizable) {
      options.onResize = function () {
        var _parent = $(this.wrapperEl.parentNode);

        var _offset = $(this.wrapperEl).position();
        var _margin  = app.widthMargin || 0;
        if (app.onResize) {
          app.onResize({
            width: _parent.width() - _margin,
            height: _parent.height()
          }, {
            width: this.originalWidth,
            height: this.originalHeight
          });
          this.calcOffset();
        } else {
          this.setDimensions({
            width: _parent.width() - _offset.left  - _margin,
            height: _parent.height() - _offset.top
          });
        }
      }
    }
  }
});

fabric.Application.addPlugin = fabric.PluginsMixin.addPlugin.bind(fabric.Application);

fabric.Application
  .addPlugin("canvas","setResizable")
  .addPlugin("preloaders","printBanner");

fabric.app = function(options){
  return new fabric.Application(options);
}

