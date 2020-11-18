export const ShapeMixin = {
    curveCursor: "pointer",
    transformCursor: "pointer",
    // storeProperties: fabric.Object.prototype.storeProperties.concat(["points"]),
    stateProperties: fabric.Object.prototype.stateProperties.concat(["points"]),
    getPoints: function () {
        return this.points.map((({x, y, c, c2}) => ({x, y, c, c2})))
        // return fabric.util.filterValues(this.points,["x","y","c","c2"]);
    },
    getPints() {
        if (!this.points) return;
        return this.points.reduce((points, item) => {
            points.push(item.x, item.y);
            return points;
        }, []);
    },
    addPoint: function (_point) {
        this.points.push({
            x: _point.x,
            y: _point.y
        });
        if (this.closeOnFull && this.points.length === this.maximumPoints) {
            this.closed = true;
        }
        this.updateBbox();
    },
    getLength: function () {
        var _l = 0;
        for (var i = 0; i < this.points.length - 1; i++) {
            if (this.points[i].curve) {
                _l += this.points[i].curve.length();
            }
        }
        return _l;
    },
    updateBbox: function () {
        if (!this.points.length) {
            this.left = 0;
            this.top = 0;
            this.width = 1;
            this.height = 1;
            return;
        }
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, i;
        for (i in this.points) {
            var _p = this.points[i];
            if (_p.outline) {
                var bbox = _p.outline.bbox();
                minX = Math.min(minX, bbox.x.min);
                maxX = Math.max(maxX, bbox.x.max);
                minY = Math.min(minY, bbox.y.min);
                maxY = Math.max(maxY, bbox.y.max);
            } else if (_p.curve) {
                var bbox = _p.curve.bbox();
                minX = Math.min(minX, bbox.x.min);
                maxX = Math.max(maxX, bbox.x.max);
                minY = Math.min(minY, bbox.y.min);
                maxY = Math.max(maxY, bbox.y.max);
            } else {
                minX = Math.min(minX, _p.x);
                maxX = Math.max(maxX, _p.x);
                minY = Math.min(minY, _p.y);
                maxY = Math.max(maxY, _p.y);
            }
        }
        this.__translated = {
            x: minX,
            y: minY,
        };
        this.left += minX;
        this.top += minY;
        this.width = maxX - minX + 1;
        this.height = maxY - minY + 1;

        for (i in this.points) {
            var _point = this.points[i];
            _point.x -= minX;
            _point.y -= minY;
            if (_point.c) {
                _point.c.x -= minX;
                _point.c.y -= minY;
            }
            if (_point.c2) {
                _point.c2.x -= minX;
                _point.c2.y -= minY;
            }
        }
        this.canvas && this.setCoords();

        //нужно оптимизировать(переисовывать только 1 или 2 кривых за раз
        //todo нужно перерисовывать при изменении размера
        if (this.__translated.x || this.__translated.y) {
            for (i in this.points) {
                this.points[i].c && this._update_curve(+i);
            }
        }
    },
    _performShapeAction: function (e, transform, pointer) {
        transform.corner.substr(1)
        this.setPoint(transform.corner, transform.point);
        transform.actionPerformed = true;
        this.fire('shaping', e);
    },
    setPoint: function (order, _point) {
        var _points = this.points || this._points;

        if (this.pointsLimits) {
            _points[order].x = Math.max(0, Math.min(_point.x, this.width));
            _points[order].y = Math.max(0, Math.min(_point.y, this.height));
        } else {
            _points[order].x = _point.x;
            _points[order].y = _point.y;
        }
        this.updateSize();
        // this.canvas.renderAll();
    },
    updateSize: function () {
        if (this.points.length == 0) {
            // this.left = 0;
            // this.top = 0;
            this.width = 1;
            this.height = 1;
            return;
        }
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (var i in this.points) {
            minX = Math.min(minX, this.points[i].x)
            maxX = Math.max(maxX, this.points[i].x)
            minY = Math.min(minY, this.points[i].y)
            maxY = Math.max(maxY, this.points[i].y)
        }
        this.left += minX;
        this.top += minY;
        this.width = maxX - minX + 1;
        this.height = maxY - minY + 1;

        for (var i in this.points) {
            this.points[i].x -= minX;
            this.points[i].y -= minY;
        }
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


    drawBoundsControls: fabric.Object.prototype.drawControls,
    addPointsControls: function (controls) {

        var pts = this.points;
        for (var i in pts) {
            controls["p" + (+i + 1)] = {
                x: pts[i].x,
                y: pts[i].y,
                action: "shape",
                size: this.cornerSize,
                style: "circle",
                cursor: this.transformCursor
            };
        }
        return controls;
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
    }
    // setCoords: function () {
    //   this.setBoundCoords();
    //   this.setExtraCoords();
    // }
};
Object.assign(fabric.Polyline.prototype, fabric.ShapeMixin);
