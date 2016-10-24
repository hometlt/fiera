'use strict';

var Toolbar = require('./../plugins/toolbar');

fabric.util.object.extend(fabric.Application.prototype,{
  createToolbars: function(){
    if(!this.toolbar){
      return;
    }

    Toolbar.create(this, Toolbar.application);
    this.canvas && Toolbar.create(this.canvas, Toolbar.canvas);
    this.project && Toolbar.create(this.project, Toolbar.project);

    if(Toolbar.objects){
      if(Toolbar.objects.constructor == Object){
        this.canvas && this.canvas.initMenuEvents(Toolbar.objects.container,Toolbar.objects);
      }else{
        this.canvas && this.canvas.initMenuEvents(Toolbar.objects);
      }
    }
    Toolbar.initKeys();
    Toolbar.fonts = this._fonts;
  },
  initTools: function(){
    if (this.options.toolbar) {
      var actions = this.options.toolbar.actions;
      fabric.util.object.deepExtend(Toolbar.tools, this.options.toolbar.tools);
      for (var i in actions) {
        if (actions[i]["$order"]) {
          fabric[i].prototype.actions = fabric.util.object.rearrange(fabric[i].prototype.actions, actions[i]["$order"]);
          delete actions[i]["$order"];
        }
        if (actions[i].constructor == Function) {
          actions[i] = actions[i].call(fabric[i].prototype)
        }
        for (var j in actions[i]) {
          if(fabric[i].prototype.actions[j]){
            if (actions[i][j]["$clone"]) {
              fabric[i].prototype.actions[j] = fabric.util.object.deepExtend({}, fabric[i].prototype.actions[j]);
              delete actions[i][j]["$clone"];
            }
            fabric.util.object.deepExtend(fabric[i].prototype.actions[j], actions[i][j]);
          }else{
            fabric[i].prototype.actions[j] = actions[i][j];
          }
        }
      }
      delete this.options.toolbar['tools'];
      delete this.options.toolbar['actions'];
      fabric.util.object.extend(Toolbar, this.options.toolbar);
      delete this.options.toolbar;
      this.toolbar = true;
    }
  }
});

fabric.Application
  .addPlugin("canvas","initTools")
  .addPlugin("postloaders","createToolbars");


fabric.Toolbar = Toolbar;

fabric.util.object.extend(fabric.Canvas.prototype, {
  menuOriginX: "left",
  menuOriginY: "top",
  menuMarginX: 0,
  menuMarginY: 0,
  setToolbarCoords: function ($menu, target, options) {

    options = fabric.util.object.extend({
      originX: "left",
      originY: "top",
      marginX: 0,
      marginY: 0
    }, options);

    target.setCoords();
    var r = target.getBoundingRect();

    var _left;
    switch (options.originX) {
      case "left":
        _left = r.left;
        break;
      case "right":
        _left = r.left + r.width;
        break;
      case "center":
        _left = r.left + r.width / 2;
        break;
    }
    ;
    var _top;
    switch (options.originY) {
      case "top":
        _top = r.top - $menu.height();
        break;
      case "bottom":
        _top = r.top + r.height;
        break;
      case "center":
        _top = r.top + r.height / 2 - $menu.height() / 2;
        break;
    }
    ;


    _top += options.marginY;
    _left += options.marginX

    var _menuContainerOffset = $($menu.parents()[0]).offset();
    var _canvasOffset = $(this.wrapperEl).offset();

    _top += _canvasOffset.top - _menuContainerOffset.top;
    _left += _canvasOffset.left - _menuContainerOffset.left;

    var coords = {
      top: Math.max(3, _top),
      left: Math.min(Math.max(3, _left), $(this.wrapperEl).width() - $menu.width() - 5)
    };


    $(this.wrapperEl).offset();

    $menu.css(coords);
    return coords;
  },
  initMenuEvents: function (id, options) {

    options = options || {};
    options.originX = options.originX || this.menuOriginX;
    options.originY = options.originY || this.menuOriginY;
    options.marginX = options.marginX || this.menuMarginX;
    options.marginY = options.marginY || this.menuMarginY;
    this.floatedToolbarOptions = options;
    var canvas = this;

    if (id) {
      this.$menu = $(document.getElementById(id)).hide();
    } else {

      this.$menu = this.$menu || $('<div>');
      $(this.wrapperEl).prepend(this.$menu);
    }
    this.$menu.hide();

    var _last_target = canvas.target;
    canvas
      .on('object:moving', function (event) {
        canvas.setToolbarCoords(canvas.$menu, canvas.target, canvas.floatedToolbarOptions);
      })
      .on('target:cleared', function (event) {
        if (_last_target) {
          canvas.$menu.hide();
          Toolbar.removeButtons(_last_target);
          _last_target = null;
        }
      })
      .on('target:changed', function (event) {
        if (_last_target) {
          Toolbar.removeButtons(_last_target);
        }
        canvas.createFloatedMenu(options);
        _last_target = event.target;
      })
  },

  createFloatedMenu: function (options) {
    this.$menu.show();
    this.toolsContainer = this.$menu;
    var _tc = this.$menu.find(".toolbar-tools-container");
    if (_tc.length) {
      this.toolsContainer = _tc;
    }
    this.toolsContainer.empty();
    if (this.target.actions) {
      Toolbar.create(this.target, this.toolsContainer, options);
    }
    this.setToolbarCoords(this.$menu, this.target, this.floatedToolbarOptions);
  }
});
