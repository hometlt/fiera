// import Activation from "../canvas/activation.js";

export default {
  name: "point",
  deps: [],
  prototypes: {
    MaterialPoint: {
      prototype: "object",
      deactivationDisabled: true,
      type: "material-point",
      // cornerSize: 5,
      width: 1,
      height: 1,
      strokeWidth: 0,
      cornerStyle: "circle",
      cornerAreaSize: 20,
      // setCoords: fabric.Object.prototype.setExtraCoords,
      hasBoundsControls: false,
      hasBorders: false,
      _render: function (ctx, noTransform) {
        var x = noTransform ? this.left : -this.width / 2,
            y = noTransform ? this.top : -this.height / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.5, 0, 2 * Math.PI, false);
        this._renderFill(ctx);
        this._renderStroke(ctx);
        ctx.restore();
      },
      controls: {
        tl: {visible: false,                     x: 0,          y: 0,           },
        tr: {visible: false,                     x: "dimx",     y: 0,           },
        bl: {visible: false,                     x: 0,          y: "dimy",    },
        br: {visible: false,                     x: "dimx",     y: "dimy",    },
        p:  {action: "drag"  ,  x: 0.5,          y: 0.5,  cursor: "moveCursor"},
      }
    }
  }
}
