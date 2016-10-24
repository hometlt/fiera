'use strict';

//fabric.require("BezierShape",["BezierMixin"], function() {
fabric.BezierShape = fabric.util.createClass(fabric.Object, {
  type: 'bezier-shape ',

  points: [],

  stateProperties: ["points"].concat(fabric.Object.prototype.stateProperties),

  drawControls: function (ctx, shape, offset) {
    if (!this.hasControls) {
      return this;
    }
    this.drawBoundsControls(ctx);
    this.drawShapeControls(ctx);
    this.drawBezierControls(ctx);
  },
  initialize: function (options) {
    options || ( options = {});
    this.callSuper('initialize', options);

    this.lineHeight = options.lineHeight;
    this.initBezier();
    this.setPoints(options.points);
  },
  /**
   * Render Shape Object
   * @private
   * @param {CanvasRenderingctx2D} ctx ctx to render on
   */
  _render: function (ctx, noTransform) {
    ctx.translate(-this.width / 2, -this.height / 2);
    this._renderBezier(ctx);
  },
  toObject: function (propertiesToInclude) {

    var _points = [];
    for (var i in this.points) {
      _points.push(Math.round(this.points[i].x), Math.round(this.points[i].y));
    }
    var object = fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
      points: _points
    });
    if (!this.includeDefaultValues) {
      this._removeDefaultValues(object);
    }
    return object;
  }
});
fabric.util.object.extend(fabric.BezierShape.prototype, fabric.BezierMixin);

fabric.BezierShape.fromObject = function (object) {
  return new fabric.BezierShape(object);
};
fabric.util.createAccessors(fabric.BezierShape);

fabric.objectsLibrary && fabric.util.object.extend(fabric.objectsLibrary, {
  bezierShapeStraight: {
    title: "bezierShapeStraight",
    "stroke": "black",
    "fill": "white",
    width: 200,
    height: 50,
    "type": "bezier-shape"
  }, bezierShapeCurved: {
    title: "bezierShapeCurved",
    "fill": "rgba(140,180,94,0.5)",
    "stroke": "black",
    "width": 200,
    "defaultShape": "curve",
    "type": "bezier-shape"
  }
});
//});



