
import {toGroupCoords} from '../util/matrix.js'
// import LoaderQueue from "../../util/loader.js";


Object.assign(fabric.Group.prototype, {
  drawObject: function(ctx) {
    ctx.save()
    // if(this.contentOrigin === "center"){
    //   ctx.translate(-this.width/2,-this.height/2)
    // }
    for (var i = 0, len = this._objects.length; i < len; i++) {
      this._objects[i].render(ctx,true);
    }
    this._drawClipPath(ctx);
    ctx.restore()
  },
  optionsOrder: ["width","height","scaleX","scaleY","resizable","contentOrigin","objects","*"],
  storeProperties: ["type","clipPath","frame","deco",'objects'],
  setObjects (objects,callback){
    if(!objects || !objects.length ){
      this._objects = [];
      callback();
      return this;
    }

    if(this.editor) {
      for(let i = objects.length;i--;) {
        if(!objects[i]){
          objects.splice(i,1)
        }
        else if(objects[i].constructor === String){
          objects[i] = this.editor.objects[objects[i]];
        }
      }
    }

    this._objects = [];

    let promises = [];

    for (let object of objects) {
      let el = object
      if(object.constructor === Object){
        object = Object.assign({},object);
        object.editor = this.editor;

        promises.push(new Promise(resolve => {
          el = fabric.util.createObject(object, (el)=>{

            // this.fire("progress", { loaded : l, total : t });
            if (fabric.util.loaderDebug) {
              console.log(`${this.id}: ${el.id} loaded`);
            }
            if(el.loaded){
              resolve()
            }
            else{
              el.on("loaded",() => {
                resolve()
              })
            }
          });
        }))
        this._objects.push(el);
      }else{
        this._objects.push(el);
      }
      this._onObjectAdded(el);
    }

    this.on("added",() => {
      this._objects.forEach(object => {
        object.canvas = this.canvas;
        object.fire('added');
      })
    })

    if (this._isAlreadyGrouped) {

      let center = new fabric.Point(this.width/2, this.height/2);
      if(this.contentOrigin === "top-left"){
          this._updateObjectsCoords(center);
      }
      // if(this.contentOrigin === "center"){
      //   for (var object  of  this._objects ){
      //     object.set({
      //       left: object.left + center.x,
      //       top: object.top + center.y
      //     });
      //     object.group = this;
      //     object.setCoords(true, true);
      //   }
      //
      //   // var center = new fabric.Point(0,0);
      //   // this._updateObjectsCoords(center);
      // }
      // if(objectsUsed) {
      // }
      this._updateObjectsACoords();
    }
    else{
      !this._centerPoint &&  this._calcBounds();
      this._updateObjectsCoords(this._centerPoint);
    }


    // if (!this._isAlreadyGrouped || objectsUsed) {
    //
    //   if(objectsUsed) {
    //     //   var center = new fabric.Point(this.width/2, this.height/2);
    //     //   for (var i = this._objects.length; i--; ){
    //     //     this._updateObjectCoords(this._objects[i], center);
    //     //   }
    //   }else{
    //     !this._centerPoint &&  this._calcBounds();
    //     this._updateObjectsCoords(this._centerPoint);
    //   }
    // }
    // else {
    //   // if(!objectsUsed) {
    //     this._updateObjectsACoords();
    //   // }
    // }
    this.setCoords();


    Promise.all(promises).then(()=> {
      this.dirty = true;
      if (this.canvas) this.canvas.renderAll();
      callback && callback();
    })
    return this;
  },
  // clone: function(propertiesToInclude,propertiesToExclude) {
  //   let object = this.getState(propertiesToInclude,propertiesToExclude);
  //   object.objects = this._objects.map(object => {
  //     return object.clone();
  //   });
  //   for(let property of this.clonedProperties){
  //     object[property] = this[property];
  //   }
  //   delete object.type;
  //   return new fabric.Group(object);
  // },
  /* _TO_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG: function(reviver) {
    var svgString = [];
    if(this.fill && this.fill !== "transparent"){
      var x = -this.width / 2, y = -this.height / 2;
      svgString.push('<rect ', 'COMMON_PARTS', 'x="', x, '" y="', y, '" width="', this.width, '" height="', this.height, '" />\n');
    }

    for (var i = 0, len = this._objects.length; i < len; i++) {
      svgString.push('\t', this._objects[i].toSVG(reviver));
    }

    return this._createBaseSVGMarkup(svgString, { reviver: reviver,/* noStyle: true,*/ withShadow: true });
  },
  fill: "transparent",
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

    //
    // if(this.contentOrigin === "center"){
    //   normalizedPointer.x -=this.width/2
    //   normalizedPointer.y -=this.height/2
    // }

    var targets = {
      target: null,
      group: []
    };
    while (i--) {
      if (this.canvas._checkTarget(normalizedPointer, objects[i])) {
        if (!targets.target) targets.target = objects[i];
        targets.group.push(objects[i]);
      }
    }
    return targets;
  },
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    fabric.Rect.prototype._render.call(this,ctx);
  },
  ungroup () {
    let _canvas = this.canvas;
    _canvas.discardActiveObject();
    this._restoreObjectsState();
    for(let i in this._objects){
      _canvas.add(this._objects[i]);
      this._objects[i].setCoords();
      this._objects[i].clipTo = this.clipTo;
    }
    _canvas.remove(this);
    _canvas.renderAll();
  },
  addWithoutUpdate(object,toBack){
    if(!object)return;
    toGroupCoords(object,this);
    if(object.canvas){
      object.canvas.remove(object);
    }
    if(toBack){
      this._objects.unshift(object);
    }
    else{
      this._objects.push(object);
    }
    object.group = this;
    this.dirty = true;
    this.canvas && this.canvas.renderAll();
    return this;
  },
  eventListeners: {
    'mouseup': function (e) {
      // var target = this.searchPossibleTargets(e.e).target;
      // if (target) {
      //   target.fire("mouseup",e)
      // }
    },
    'mousedown': function (e) {
      // e.e._group = this;
      // for(let subtarget of e.subTargets){
      //   subtarget.fire("mousedown",e)
      // }
      // delete   e.e._group;
    },
    'mousemove': function (e) {
      //
      //if(e.target == this || e.target == this.element &&  this.isPossibleTarget(e.e,this.submit)){
      //    this.canvas.hoverCursor = 'pointer';
      //}else{
      //    this.canvas.hoverCursor = 'move';
      //}
    }
  }
})

Object.assign(fabric.ActiveSelection.prototype,{
  /**
   * If returns true, deselection is cancelled.
   * @since 2.0.0
   * @return {Boolean} [cancel]
   */
  onDeselect: function() {
    this.destroy();
    this.fire("group:removed")
    return false;
  },
  removeFromCanvas() {
    this.canvas.processing = true;
    this.canvas.discardActiveObject();
    for (let o of this._objects) {
      this.canvas.remove(o);
    }
    this.canvas.processing = false;
    this.canvas.fire("group:removed", {target: this});
    this.canvas.renderAll();
  },
  duplicate() {

    this.canvas.fire('before:selection:cleared', {target: this, e: null});
    this.canvas.discardActiveGroup();
    this.duplicate(function (el) {
      el.ungroup();
    });

    this.canvas.renderAll();

    // this.canvas._discardActiveObject();
    // let group = [];
    // for(let o of this._objects){
    //   let clone = o.duplicate();
    //   group.push(clone);
    //   this.canvas.add(clone);
    // }
    //
    // let aGroup = new fabric.ActiveSelection(group, {
    //   canvas: this.canvas
    // });
    // // this.fire('selection:created', { target: group });
    // this.canvas.setActiveObject(aGroup, e);
  },
  groupElements (){
    let group = this._groupElements();
    this.canvas.add(group);
    this.canvas.setActiveObject(group);
  },
  _groupElements (){
    this._restoreObjectsState();
    let objects = this._objects;
    delete this._objects;
    let object = this.getState();
    delete object.type;
    object.canvas = this.canvas;
    let group = new fabric.Group(object);

    this.canvas.discardActiveObject();

    for(let i in objects){
      this.canvas.remove(objects[i]);
      group.addWithoutUpdate(objects[i]);
    }
    return group;
  }
})
