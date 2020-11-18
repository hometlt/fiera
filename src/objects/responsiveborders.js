export default {
  name: "responsive-borders",
  prototypes: {
    Object:{
      responsiveBorders: false,
      centerAndZoomOut: function() {
        this.canvas.centerOnObject(this);
      },
      updateResponsiveBorder(){
        if(this.responsiveBorders){
          if(!this.originalStrokeWidth){
            this.originalStrokeWidth = this.strokeWidth;
          }
          this.strokeWidth = this.canvas ? this.originalStrokeWidth / this.canvas.viewportTransform[0] : 0;
        }
      }
    },
    Canvas: {
      eventListeners: {
        'viewport:scaled': function () {
          if (this.backgroundImage) {
            this.backgroundImage.updateResponsiveBorder();
          }
          for (var i in this._objects) {
            this._objects[i].updateResponsiveBorder();
          }
        },
        "object:added": function (event) {
          event.target.updateResponsiveBorder()
        }
      }
    }
  }
}
