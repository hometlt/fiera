import {merge} from "./../util/util.js"

var _OBJ = fabric.Object.prototype;
var _handleGrouping_overwritten = fabric.Canvas.prototype._handleGrouping;
fabric.Object.prototype.groupable = true;

Object.assign(fabric.Canvas.prototype, {
  /**
   * Deactivates all objects and dispatches appropriate events
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  deactivateAllWithDispatch: function (e) {
    var activeGroup = this.getActiveGroup(),
      activeObject = this.getActiveObject();
    var _target = activeObject || activeGroup;
    if (_target) {
      this.fire('before:selection:cleared', { target: _target, e: e });
    }
    this.deactivateAll();
    if (_target) {
      this.fire('selection:cleared', { e: e, target: _target });
      _target.fire('deselected');
    }
    return this;
  },

  /**
   * adding before:selection:created event
   * @private
   * @param {Event} e Event object
   * @param {fabric.Object} target
   */
  _handleGrouping: function (e, target) {
    this.fire("before:selection:created");
    _handleGrouping_overwritten.call(this, e, target);
  },
  /**
   * @private
   * @param {Event} e mouse event
   */
  _groupSelectedObjects: function (e) {
      let group = this._collectObjects().filter(item => item.groupable === true);

      // do not create group for 1 element only
      if (group.length === 1) {
          this.setActiveObject(group[0], e);
      }
      else if (group.length > 1) {
          let aGroup = new fabric.ActiveSelection(group.reverse(), {
              canvas: this
          });
          // this.fire('selection:created', { target: group });
          this.setActiveObject(aGroup, e);
      }
  }
});

_OBJ.clone = function(callback, propertiesToInclude) {
  var _obj = this.toObject(propertiesToInclude);
  _obj.editor = this.editor;
  if (this.constructor.fromObject) {
    return this.constructor.fromObject(_obj, callback);
  }
  return new fabric.Object(this.toObject(propertiesToInclude));
};

_OBJ.cloneSync = function(){
  var _klass = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(this.type))];
  if(_klass.async){
    var _obj = new _klass.fromObject(this,function(){

    });
  }else{
    var _obj = this.clone();
  }
  _obj.canvas = this.canvas;
  return _obj;
};

Object.assign(fabric.Group.prototype, {
  isPossibleTarget: function (e, object) {
    return this.searchPossibleTargets(e, [object]).target !== null;
  },
  /**
   * return inner target and group of targets under the cursor
   * @param e
   * @param objects
   * @returns {{target: null, group: Array}}
   */
  searchPossibleTargets: function (e, objects) {

    if (!objects)objects = this._objects;
    var pointer = this.canvas.getPointer(e, true);
    var i = objects.length,
      normalizedPointer = this.canvas._normalizePointer(this, pointer);

    var targets = {
      target: null,
      group: []
    };
    while (i--) {
      if (this.canvas._checkTarget(normalizedPointer, objects[i])) {
        if (!targets.target)targets.target = objects[i];
        targets.group.push(objects[i]);
      }
    }
    return targets;
  },

  groupSelectable: true,

  _calcBounds : function (onlyWidthHeight) {
    var aX = [],
      aY = [],
      o, prop,
      props = ['tr', 'br', 'bl', 'tl'];

    for (var i = 0, len = this._objects.length; i < len; ++i) {
      o = this._objects[i];
      if (o.notSelectableInTheGroup) {
        continue;
      }
      o.setCoords();
      for (var j = 0; j < props.length; j++) {
        prop = props[j];
        aX.push(o.oCoords[prop].x);
        aY.push(o.oCoords[prop].y);
      }
    }

    this.set(this._getBounds(aX, aY, onlyWidthHeight));
  },
  initialize_overwritten: fabric.Group.prototype.initialize,
  isSelectionGroup: function(){
    return this.canvas._objects.indexOf(this) === -1
  },
  //clone: function(callback){
  //  if(callback === true || callback.constructor === Object){
  //    var _frame = new fabric.Group(this);
  //    if(callback.constructor === Object){
  //      _frame.set(callback);
  //      return _frame;
  //    }
  //  }
  //  return this.callSuper('clone',callback);
  //},
  initialize: function(objects,options){
    if(objects.constructor !== Array){
      var el = objects;
      options = el.toObject();
      objects = [];
      for(var i in el._objects){
        objects.push(el._objects[i].cloneSync())
      }
    }

    this.initialize_overwritten(objects,options);
    if(this.type === 'group'){
      this.on("dblclick", function(){
        if(this.canvas._objects.indexOf(this) === -1){
          this.groupSelectedElements();
        }else{
          this.ungroup();
        }
      });
    }
  },
  ungroup : function() {
    var _canvas = this.canvas;
    _canvas.discardActiveGroup();
    this._restoreObjectsState();
    for(var i in this._objects){
      _canvas.add(this._objects[i]);
      this._objects[i].clipTo = this.clipTo;
      //this._objects[i].active = true;
    }
    _canvas.remove(this);
    var group = new fabric.Group(this._objects, {
      canvas: _canvas
    });
    group.addWithUpdate();
    _canvas.setActiveGroup(group);
    group.saveCoords();
    _canvas.fire('selection:created', { target: group });
    _canvas.renderAll();

    //var _group = new fabric.Group(this._objects);
    //_group.canvas = _canvas;
    //_canvas.setActiveObject(_group);
  },
  groupSelectedElements() {
    var el = this.cloneSync();
    this.canvas.add(el);
    this.canvas.discardActiveGroup();
    this.canvas.setActiveObject(el);

    for(var i in this._objects){
      this.canvas.remove(this._objects[i].originalObject);
    }
  }
});


Object.assign(fabric.Canvas.prototype,{
  eventListeners: merge(fabric.Canvas.prototype.eventListeners, {
    'selection:created': function(event){
      this._onSelectionCreated(event);
    }
  }),
  _onSelectionModified: function () {
    for (var i in this._objects) {

      var copy = this._objects[i].cloneSync();
      copy.group = this;
      this._restoreObjectState(copy);


      this._objects[i].originalObject.set({
        clipTo: this.clipTo,
        movementLimits: this.movementLimits,
        left: copy.left,
        top: copy.top,
        angle: copy.angle,
        scaleX: copy.scaleX,
        scaleY: copy.scaleY,
        skewX: copy.skewX,
        skewY: copy.skewY,
        width: copy.width,
        height: copy.height
      });
    }
  },
  _onSelectionDeselected: function (data) {
    for (var i in this._objects) {
      var _obj = this._objects[i];
      _obj.originalObject.setCoords();
      _obj.originalObject.evented = true;
      delete _obj.originalObject.hiddenActive;
    }
  },
  _onSelectionCreated: function (el) {

    var group  = el.target;

    var originalObjects = []
    for(var i in group._objects){
      var _obj = group._objects[i];
      originalObjects.push(_obj.originalObject || _obj)
    }

    group.destroy();
    group._objects = [];

    var _clipTo = originalObjects[0].clipTo;

    for (var i in originalObjects) {
      var original = originalObjects[i];

      if (_clipTo != original.clipTo) {
        _clipTo = false;
      }

      var _obj = original.cloneSync();

      _obj.set({
        clipTo: null,
        originalObject: original
      });
      original.set({
        active:false,
        evented: false,
        hiddenActive: true
      });

      group.addWithUpdate(_obj);
      group.setCoords();
    }

    group.clipTo =  _clipTo;

    group.on({
      "modified": this._onSelectionModified,
      'deselected': this._onSelectionDeselected
    });

  }
});
