'use strict';


  fabric.ShapeMixin = {

    _performShapeAction: function (e, transform, pointer) {

      this.setPoint(transform.index, transform.point);
      this.fire('shaping', e);
    },
    _initPoints: function (points) {

      if (points) {
        this.set('points', points);
      }

      this._controlsVisibility = {};

      var _points = this.points || this._points;

      if (_points) {
        for (var i = 1; i <= _points.length; i++) {
          this._controlsVisibility["p" + i] = true;
        }
        this._controlsVisibility["p"] = true;
      }


      var _default_corners = {
        tl: true,
        tr: true,
        br: true,
        bl: true,
        ml: true,
        mt: true,
        mr: true,
        mb: true,
        mtr: true
      };
      for (var i in _default_corners) {
        this._controlsVisibility[i] = _default_corners[i];
      }
    },
    _default_corner_action: "shape",
    _corner_actions: {},
    /**
     * Solved the problem when it is impossible to move point when it is under another native control such as "mtr", "tl" etc.
     * Determines which corner has been clicked
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function (pointer) {
      if (!this.hasControls || !this.active) {
        return false;
      }
      var ex = pointer.x,
        ey = pointer.y,
        xPoints,
        lines;
      this.__corner = 0;
      if (this.isControlVisible("p")) {
        for (var i in this.oCoords) {
          if (i[0] != "p")continue;
          if (!this.isControlVisible(i)) {
            continue;
          }
          if (i === 'mtr' && !this.hasRotatingPoint) {
            continue;
          }
          if (this.get('lockUniScaling') &&
            (i === 'mt' || i === 'mr' || i === 'mb' || i === 'ml')) {
            continue;
          }

          lines = this._getImageLines(this.oCoords[i].corner);
          xPoints = this._findCrossPoints({x: ex, y: ey}, lines);
          if (xPoints !== 0 && xPoints % 2 === 1) {
            this.__corner = i;
            return i;
          }
        }
      }

      for (var i in this.oCoords) {
        if (i[0] == "p")continue;
        if (!this.isControlVisible(i)) {
          continue;
        }
        if (i === 'mtr' && !this.hasRotatingPoint) {
          continue;
        }
        if (this.get('lockUniScaling') &&
          (i === 'mt' || i === 'mr' || i === 'mb' || i === 'ml')) {
          continue;
        }

        lines = this._getImageLines(this.oCoords[i].corner);
        xPoints = this._findCrossPoints({x: ex, y: ey}, lines);
        if (xPoints !== 0 && xPoints % 2 === 1) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    ___drawControl: function (control, ctx, left, top) {
      if (!this.isControlVisible(control)) {
        return;
      }
      var size = this.cornerSize;
      // /*isVML() ||*/ this.transparentCorners || ctx.clearRect(left, top, size, size);


      ctx.beginPath();
      ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    },


    drawBoundsControls:fabric.Object.prototype.drawControls,
    drawShapeControls: function (ctx) {

      var transformMatrix = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, false);
      var wh = this._calculateCurrentDimensions(),
        width = wh.x,
        height = wh.y,
        scaleOffset = this.cornerSize,
        left = -(width + scaleOffset) / 2,
        top = -(height + scaleOffset) / 2,
        methodName = this.transparentCorners ? 'strokeRect' : 'fillRect';

      ctx.save();

      ctx.lineWidth = 1;

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = ctx.fillStyle = this.cornerColor;


      var _points = this.points || this._points;
      if (_points) {


        //var transformMatrix = this._calcDimensionsTransformMatrix(0,0, false);
        if (this._controlsVisibility["p"]) {
          for (var i = 0; i < _points.length; i++) {
            var _p = fabric.util.transformPoint(_points[i], transformMatrix);
            var zoom = this.canvas.viewportTransform[0];

            var _x = left + (this.flipX ? ( width - _p.x) : _p.x) * zoom;
            var _y = top + (this.flipY ? (height - _p.y) : _p.y) * zoom;

            // speech bubble
            this.___drawControl( 'p' + (i + 1), ctx, _x, _y);
          }
        }


      }

      if (this.extraControls) {
        for (var i in this.extraControls) {
          var _p = fabric.util.transformPoint(this.extraControls[i], transformMatrix);
          var zoom = this.canvas.viewportTransform[0];
          var _x = left + (this.flipX ? ( width - _p.x) : _p.x) * zoom;
          var _y = top + (this.flipY ? (height - _p.y) : _p.y) * zoom;

          // speech bubble
          this.___drawControl( i, ctx, _x, _y);
        }
      }

      this.drawBorder && this.drawBorder(ctx);
      ctx.restore();

      return this;
    },
    drawShapeBorder: function (ctx) {
      var _points = this.points || this._points;

      var x, y;
      x = -this.width / 2;
      y = -this.height / 2;
      var zoom = this.canvas.viewportTransform[0];
      ctx.save();
      ctx.scale(this.scaleX * zoom, this.scaleY * zoom);
      ctx.translate(x, y);


      ctx.beginPath();

      var _p = _points[0];// fabric.util.transformPoint(_points[0], transformMatrix);

      ctx.moveTo(_p.x, _p.y);

      for (var i = 1; i < _points.length; i++) {

        var _p = _points[i];//fabric.util.transformPoint(_points[i], transformMatrix);
        ctx.lineTo(_p.x, _p.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
    /**
     * Sets corner position coordinates based on current angle, width and height
     * See https://github.com/kangax/fabric.js/wiki/When-to-call-setCoords
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setCoords: function () {


      fabric.Object.prototype.setCoords.call(this);

      var _points = this.points || this._points;
      if (_points) {
        var theta = fabric.util.degreesToRadians(this.angle),
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta);

        for (var i = 0; i < _points.length; i++) {
          var _p = {
            x: _points[i].x * this.scaleX,
            y: _points[i].y * this.scaleY
          };

          var zoom = this.canvas.viewportTransform[0];
          var c = this.flipX ? (this.flipY ? "br" : "tr") : (this.flipY ? "bl" : "tl");

          var _x = this.oCoords[c].x + (( -sinTh * _p.y + cosTh * _p.x) * (this.flipX ? -1 : 1)) * zoom;

          var _y = this.oCoords[c].y + ((cosTh * _p.y + sinTh * _p.x) * (this.flipY ? -1 : 1)) * zoom;

          this.oCoords["p" + (i + 1)] = new fabric.Point(_x, _y);

        }

        // set coordinates of the draggable boxes in the corners used to scale/rotate the image
        this._setCornerCoords && this._setCornerCoords();
      }


      if (this.extraControls) {
        var theta = fabric.util.degreesToRadians(this.angle),
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta);

        for (var i in this.extraControls) {
          var _p = {
            x: this.extraControls[i].x * this.scaleX,
            y: this.extraControls[i].y * this.scaleY
          };

          var zoom = this.canvas.viewportTransform[0];


          var c = this.flipX ? (this.flipY ? "br" : "tr") : (this.flipY ? "bl" : "tl");

          var _x = this.oCoords[c].x + (( -sinTh * _p.y + cosTh * _p.x) * (this.flipX ? -1 : 1)) * zoom;

          var _y = this.oCoords[c].y + ((cosTh * _p.y + sinTh * _p.x) * (this.flipY ? -1 : 1)) * zoom;


          this.oCoords[i] = new fabric.Point(_x, _y);

        }

        // set coordinates of the draggable boxes in the corners used to scale/rotate the image
        this._setCornerCoords && this._setCornerCoords();
      }

      return this;
    }
  }
