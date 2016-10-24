
var utils = require('./../util/util.js');


/***********************************************************************************************************************
 ** DPHistory
 ***********************************************************************************************************************/


var DPHistory = function (parent, initAction) {

    this.parent = parent;
    this.clear(initAction);
};

DPHistory.prototype.clear = function (initAction) {
    if (initAction) {
        initAction.number = 0;
    } else {
        initAction = {
            type: 'initialized',
            number: 0
        }
    }
    this.records = [initAction];
    this.current = 0;
    this.canUndo = false;
    this.canRedo = false;
    this.activeAction = this.records[this.current];
  this.fire("changed");
};


DPHistory.prototype.add = function(action){


    if (!this.enabled || this.processing) {
      return false;
    }

    action.moment = new Date().getTime();
    this.canUndo = true;
    this.canRedo = false;
    this.records.splice(this.current+ 1);
    this.records.push(action);
    this.length = this.records.length;
    action.number = this.length - 1;
    this.current = this.length - 1;

  this.activeAction = this.records[this.current];
  this.fire("changed",{action: action});
};
DPHistory.prototype.disable = function(){
  this.enabled = false;
}
DPHistory.prototype.enable = function(){
  this.enabled = true;
}
DPHistory.prototype.undo = function(noFire){
    this.canRedo = true;
    var _action = this.records[this.current];
    this.current--;
  this.processing = true;
    _action.undo.call(this.parent,_action);
  this.processing = false;
    if(this.current == 0){
        this.canUndo = false;
    }
    if(!noFire){
      this.activeAction = this.records[this.current];
      this.fire("changed",{action: _action});
    }
};

DPHistory.prototype.goto = function(index){
    if(index == this.current)return;
    if(index < this.current){
        for(var i = this.current - index ;i--; ){
            this.undo(true);
        }
    }if(index > this.current){
        for(var i = index - this.current ;i--; ){
            this.redo(true);
        }
    }
  this.activeAction = this.records[this.current];
  this.fire("changed"/*,{action: _action}*/);
};

DPHistory.prototype.redo = function(noFire){
    if(this.current == this.length - 1){
        return;
    }
  this.processing = true;
    this.canUndo = true;
    this.current++;
    var _action = this.records[this.current];

    _action.redo.call(this.parent,_action);

    if(this.current == this.length - 1){
        this.canRedo = false;
    }
  this.processing = false;
  if(!noFire) {
    this.activeAction = this.records[this.current];
    this.fire("changed",{action: _action});
  }
};
utils.observable(DPHistory.prototype);
module.exports = DPHistory;
