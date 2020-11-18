import Bezier from "./../../plugins/bezier.js";

fabric.Bezier = Bezier;

export const BezierMixin = {
  _renderBezier: function (ctx,outline = this.outline ,x,y) {
    ctx.beginPath();
    outline.curves.forEach((c) => {
      this.drawCurve(ctx, c);
    });
    ctx.closePath();
    this._renderFill(ctx);
    this._renderStroke(ctx);
  },
  drawBezierControls: function (ctx, p1, p2, p3, p4) {
    let pts = this.points;
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
    ctx.scale(this.canvas.viewportTransform[0], this.canvas.viewportTransform[3]);
    ctx.translate(-this.width / 2 * this.scaleX, -this.height / 2 * this.scaleY);
    ctx.beginPath();
    ctx.moveTo(p1.x * this.scaleX, p1.y * this.scaleY);
    ctx.lineTo(p2.x * this.scaleX, p2.y * this.scaleY);
    if (pts.length === 3) {
      ctx.moveTo(p2.x * this.scaleX, p2.y * this.scaleY);
      ctx.lineTo(p3.x * this.scaleX, p3.y * this.scaleY);
    }
    else {
      ctx.moveTo(p3.x * this.scaleX, p3.y * this.scaleY);
      ctx.lineTo(p4.x * this.scaleX, p4.y * this.scaleY);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.scale(this.scaleX, this.scaleY);
    ctx.beginPath();
    this.drawCurve(ctx, p1.curve);
    ctx.stroke();
    ctx.restore();
  },
  drawCurve: function (ctx, curve, offset) {
    offset = offset || {x: 0, y: 0};
    let ox = offset.x;
    let oy = offset.y;
    let p = curve.points, i;
    //ctx.moveTo(p[0].x + ox, p[0].y + oy);
    ctx.lineTo(p[0].x + ox, p[0].y + oy);
    if (p.length === 3) {
      ctx.quadraticCurveTo(
        p[1].x + ox, p[1].y + oy,
        p[2].x + ox, p[2].y + oy
      );
    }
    if (p.length === 4) {
      ctx.bezierCurveTo(
        p[1].x + ox, p[1].y + oy,
        p[2].x + ox, p[2].y + oy,
        p[3].x + ox, p[3].y + oy
      );
    }
  },
  drawShape: function (ctx, shape, offset) {
    offset = offset || {x: 0, y: 0};
    let order = shape.forward.points.length - 1;
    ctx.beginPath();
    ctx.moveTo(offset.x + shape.startcap.points[0].x, offset.y + shape.startcap.points[0].y);
    ctx.lineTo(offset.x + shape.startcap.points[3].x, offset.y + shape.startcap.points[3].y);
    if (order === 3) {
      ctx.bezierCurveTo(
        offset.x + shape.forward.points[1].x, offset.y + shape.forward.points[1].y,
        offset.x + shape.forward.points[2].x, offset.y + shape.forward.points[2].y,
        offset.x + shape.forward.points[3].x, offset.y + shape.forward.points[3].y
      );
    } else {
      ctx.quadraticCurveTo(
        offset.x + shape.forward.points[1].x, offset.y + shape.forward.points[1].y,
        offset.x + shape.forward.points[2].x, offset.y + shape.forward.points[2].y
      );
    }
    ctx.lineTo(offset.x + shape.endcap.points[3].x, offset.y + shape.endcap.points[3].y);
    if (order === 3) {
      ctx.bezierCurveTo(
        offset.x + shape.back.points[1].x, offset.y + shape.back.points[1].y,
        offset.x + shape.back.points[2].x, offset.y + shape.back.points[2].y,
        offset.x + shape.back.points[3].x, offset.y + shape.back.points[3].y
      );
    } else {
      ctx.quadraticCurveTo(
        offset.x + shape.back.points[1].x, offset.y + shape.back.points[1].y,
        offset.x + shape.back.points[2].x, offset.y + shape.back.points[2].y
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
  setPoints: function (points) {

    if(points && points[0] !== undefined && points[0].x === undefined){
      let _NEW_points = [];
      for(let i=0; i < points.length ;i+=2){
        _NEW_points.push({x: points[i] , y: points[i + 1]});
      }
      points = _NEW_points;
    }


    // if(this.defaultShape == "curve"){
    //   points = [0, 0, this.width/2, -this.width/2, this.width/2, this.width/2, this.width, 0];
    // }else if(this.defaultShape == "arc"){
    //   points = [0, 0, this.width*0.16, -this.width*0.43, this.width *(1 - 0.16), -this.width*0.43, this.width, 0];
    // }else{
    //   points = [0, 0, this.width / 3, 1, this.width / 3 * 2, 1, this.width, 0];
    // }
    let _intervals = this.closed && points.length > 1 ? points.length : points.length - 1;
    this.points = [].concat(points);
    if(this.points.length > 1 && this.bezierControls){
      for(let i = 0 ; i < _intervals; i ++ ){
        let p2 = this.points[i + 1] || this.points[0];
        let p1 = this.points[i];
        let _cp = p1.c;
        if(_cp){
          if(p1.c2){
            this._makeCubic(p1, p1.c,p1.c2, p2);
          }else{
            this._makeCurve(p1, p1.c, p2);
          }
        }else{
          _cp = {
            x: (p1.x + p2.x)/2,
            y: (p1.y + p2.y)/2
          }
        }
      }
    }
    this.updateBbox();
  },
  setExtraControls: function(controls){
    if(this.hasTransformControls){
      this.addPointsControls(controls);
    }
  },
  addPointsControls: function(controls){

    let pts = this.points;
    for(let i in pts){
      controls["p" + (+i + 1)] = {
        action: "shape",
        visible: true,
        x: pts[i].x,
        y: pts[i].y,
        cursor: this.transformCursor ,
        area:  this.pointCornerAreaSize || this.pointCornerSize,
        size : this.pointCornerSize || this.cornerSize,
        style: this.cornerStyle
      };

      if(this.bezierControls) {
        if (pts[i].c2) {

          controls[ "d" + (+i + 1)] ={
            action: "shape",
            visible: true,
            x: pts[i].c2.x,
            y: pts[i].c2.y,
            cursor: this.transformCursor,
            size: this.curveCornerSize ,
            area: this.curveCornerAreaSize,
            style: this.transformCornerStyle || this.cornerStyle
          }

        }

        if (pts[i].c) {
          controls["c" + (+i + 1)] = {
            action: "shape",
            visible: true,
            x: pts[i].c.x,
            y: pts[i].c.y,
            cursor: this.curveCursor || this.transformCursor,
            size: this.curveCornerSize ,
            area: this.curveCornerAreaSize,
            style: this.curveCornerStyle || this.cornerStyle
          }
        } else {
          let p2 = pts[+i + 1] || this.closed && pts[0];
          if(p2){
            controls["c" + (+i + 1)] = {
              action: "shape",
              visible: true,
              cursor: this.curveCursor || this.transformCursor,
              x: (pts[i].x + p2.x) / 2,
              y: (pts[i].y + p2.y) / 2,
              size: this.curveCornerSize,
              area: this.curveCornerAreaSize,
              style: this.curveCornerStyle || this.cornerStyle
            }
          }
        }
      }
    }
  },
  drawBezierShapeControls: function(ctx){
    for(let i = 0 ; i < this.points.length ; i++){
      if(this.points[i].c2){
        this.drawBezierControls(ctx, this.points[i],this.points[i].c,this.points[i].c2,this.points[i + 1]);
      }
    }
  },
  _makeCurveByIndex: function (index) {
    this._makeCurve(this.points[index],this.points[index].c,this.points[index + 1] || this.points[0])
  },
  _makeCubic: function (p1, c1,c2,p2) {
    p1.curve = new fabric.Bezier(p1.x,p1.y , c1.x ,c1.y , c2.x,c2.y , p2.x,p2.y);
    if(this.outlineTop || this.outlineBottom){
      p1.outline = p1.curve.outline(this.outlineBottom, this.outlineTop);
    }
  },
  _makeCurve: function (_curPoint, c1,_p2) {
    _curPoint.c = {x: c1.x,y : c1.y};
    _curPoint.curve = fabric.Bezier.quadraticFromPoints.apply(this,[_curPoint,c1,_p2]);
    if(this.outlineTop || this.outlineBottom){
      _curPoint.outline = _curPoint.curve.outline(this.outlineTop, this.outlineBottom);
    }
  },
  _update_curve: function (_pointIndex) {
    let _p1 = this.points[_pointIndex ];
    if(!_p1.c){
      return;
    }
    let _p2 = this.points[_pointIndex + 1] || this.points[0];

    if(_p1.c2){
      _p1.curve.points[0].x = _p1.x;
      _p1.curve.points[0].y = _p1.y;
      _p1.curve.points[1].x = _p1.c.x;
      _p1.curve.points[1].y = _p1.c.y;
      _p1.curve.points[2].x = _p1.c2.x;
      _p1.curve.points[2].y = _p1.c2.y;
      _p1.curve.points[3].x = _p2.x;
      _p1.curve.points[3].y = _p2.y;
      _p1.curve.update();
      _p1.outline = _p1.curve.outline(this.outlineBottom, this.outlineTop);
    }else{
      let bezier_pointers = fabric.Bezier.getABC(2, _p1, _p1.c, _p2 , 0.5);
      _p1.curve.points[0].x = _p1.x;
      _p1.curve.points[0].y = _p1.y;
      _p1.curve.points[1].x = bezier_pointers.A.x;
      _p1.curve.points[1].y = bezier_pointers.A.y;
      _p1.curve.points[2].x = _p2.x;
      _p1.curve.points[2].y = _p2.y;
      _p1.curve.update();
      if(this.outlineTop || this.outlineBottom) {
        _p1.outline = _p1.curve.outline(this.outlineBottom, this.outlineTop);
      }
    }
  },
  setPoint: function (order, _point) {

    let dragPointer,
      _curvepointer = order[0] === "c",
      pIndex1 = +order.substr(1) - 1,
      p1 = this.points[pIndex1],
      pIndex2 = this.points[pIndex1 + 1] ? pIndex1 + 1 : (this.closed ? 0 : -1),
      p2 = pIndex2 !== -1 && this.points[pIndex2],
      pIndex0 = this.points[pIndex1 - 1] ? pIndex1 - 1 : (this.closed ? this.points.length - 1 : -1),
      p0 = pIndex0 !== -1 && this.points[pIndex0];

    if (this.pointsLimits) {
      _point.x = Math.max(0, Math.min(_point.x, this.width));
      _point.y = Math.max(0, Math.min(_point.y, this.height));
    }
    let curvePointer2 = order[0] === "d";
    if(curvePointer2){
      dragPointer =  p1.c2;
    }else{
      if(_curvepointer){

        if(!p1.c){
          this._makeCurve(p1, _point, p2);
        }
        dragPointer = p1.c
      }else{
        dragPointer = p1;
      }
    }
    if(dragPointer){
      dragPointer.x = _point.x;
      dragPointer.y = _point.y;
    }
    for(let i in this.points){
      this.points[i].c && this._update_curve(+i);
    }
    this.dirty = true;
    this.updateBbox();
    this.fire("shape:modified");
    this.canvas && this.canvas.renderAll();
  }
};
