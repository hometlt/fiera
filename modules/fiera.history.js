'use strict';

var History = require('./../plugins/history');

History.prototype.actions = {
  undo: {
    keyCode: 'z',
    ctrlKey:  true,
    observe: 'changed',
    className: 'fa fa-undo',
    title: 'undo',
    enabled: 'canUndo',
    action: function(){
      this.undo();
    }
  },
  redo: {
    keyCode: 'y',
    ctrlKey:  true,
    observe: 'changed',
    className: 'fa fa-repeat',
    title: 'redo',
    enabled: 'canRedo',
    action: function(){
      this.redo();
    }
  }
};

fabric.util.object.extend(fabric.SlideCanvas.prototype.actions, {
  history: {
    insert: 'historyTools',
    title: 'history',
    type: 'menu',
    target: function () {
      return this.history;
    },
    menu: function () {
      return this.actions;
    }
  }
});

fabric.util.object.extend(fabric.Canvas.prototype, {
  historyTools: false,
  getModifiedStates: function (target) {
    var states = {
      original: {},
      modified: {}
    };
    for (var prop in target.originalState) {
      if (target.originalState[prop] !== target[prop]) {
        states.original[prop] = target.originalState[prop];
        states.modified[prop] = target[prop];
      }
    }
    return states;
  },
  onObjectModified: function (e) {
    if (!this.history.enabled || this.history.processing) {
      return false;
    }
    var states = this.getModifiedStates(e.target);


    var _canvas = e.target.canvas || e.target.wrapperEl && e.target;

    this.history.add({
      canvas:  e.target.canvas.originalSlide || e.target.canvas,
      originalState:  states.original,
      modifiedState:  states.modified,
      object: e.target,
      type: 'object:modified',
      undo: function (_action) {
        _action.object.set(_action.originalState);
        if(_action.canvas.mirrorSlide == this.canvas){
          _action.object.setCoords();
          var _canvas = this.canvas || this;
          _canvas.renderAll();
        }
        _action.canvas.fire('object:modified', { target: _action.object });
        _action.object.fire('modified');
        _action.canvas.renderAll();
      },
      redo: function (_action) {
        _action.object.set(_action.modifiedState);
        _action.object.setCoords();
        if(_action.canvas.mirrorSlide == this.canvas){
          _action.object.setCoords();
          var _canvas = this.canvas || this;
          _canvas.renderAll();
        }
        _action.canvas.fire('object:modified', { target: _action.object });
        _action.object.fire('modified');
        _action.canvas.renderAll();
      }
    });
  },

  clearHistory: function () {
    this.history.clear();
  },
  disableHistory: function () {
    this.history.enabled = false;
  },

  _add_object_history_action: function (_action) {
    var _canvas = this.canvas || this;
    if(this.canvas && _action.canvas.mirrorSlide == this.canvas){
      _canvas.add(_action.object);
      _canvas.setActiveObject(_action.object);
      _canvas.renderAll();
    }else{
      _action.canvas.add(_action.object);
    }
    _action.canvas.renderAll();
  },

  _remove_object_history_action: function (_action) {
    _action.canvas.remove(_action.object);
    _action.canvas.renderAll();
    if(this.canvas && _action.canvas.mirrorSlide == this.canvas){
      this.canvas.renderAll();
    }
  },

  onObjectRemoved: function (e) {
    if (!this.history.enabled || this.history.processing) {
      return false;
    }
    this.history.add({
      canvas: e.target.canvas.originalSlide || e.target.canvas,
      object: e.target,
      type: 'object:removed',
      redo: this._remove_object_history_action,
      undo: this._add_object_history_action
    });
  },
  onObjectAdded: function (e) {
    if (!this.history.enabled || this.history.processing) {
      return false;
    }
    this.history.add({
      canvas:  e.target.canvas.originalSlide || e.target.canvas,
      object: e.target,
      type: 'object:added',
      undo: this._remove_object_history_action,
      redo: this._add_object_history_action
    });
  },
  initHistory: function (history) {
    if(!history){
      history = new History(this)
    }
    this.history = history;
    this.on('object:modified', this.onObjectModified);
    this.on('object:added', this.onObjectAdded);
    this.on('object:removed', this.onObjectRemoved);
    var _this = this;
    this.history.on('changed', function(e){
      if(this.activeAction.canvas){
        this.activeAction.canvas.moment = e.action.moment;
      }
    });
  },
  enableHistory: function () {
    this.history.enabled = true;
  }
});

if(fabric.Project){
  fabric.util.object.extend(fabric.Project.prototype.actions, {
    history: {
      insert: 'historyTools',
      title: 'history',
      type: 'menu',
      target: function () {
        return this.history;
      },
      menu: function () {
        return this.actions;
      }
    }
  });

  fabric.util.object.extend(fabric.Project.prototype, {
    _default_event_listeners : {
      "slide:change:begin" : function(){
        if(this.history){
          this.history.processing = true ;
        }
      },
      "slide:changed" : function(){
        if(this.history){
          this.history.processing = false;
        }
      }
    },
    historyTools: false,
    enableHistory: function () {
      this.history.enabled = true;
    }
  });
}
