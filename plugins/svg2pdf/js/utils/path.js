import { multVecMatrix } from './geometry.js';
var Path = /** @class */ (function () {
    function Path() {
        this.segments = [];
    }
    Path.prototype.moveTo = function (x, y) {
        this.segments.push(new MoveTo(x, y));
        return this;
    };
    Path.prototype.lineTo = function (x, y) {
        this.segments.push(new LineTo(x, y));
        return this;
    };
    Path.prototype.curveTo = function (x1, y1, x2, y2, x, y) {
        this.segments.push(new CurveTo(x1, y1, x2, y2, x, y));
        return this;
    };
    Path.prototype.close = function () {
        this.segments.push(new Close());
        return this;
    };
    /**
     * Transforms the path in place
     */
    Path.prototype.transform = function (matrix) {
        this.segments.forEach(function (seg) {
            if (seg instanceof MoveTo || seg instanceof LineTo || seg instanceof CurveTo) {
                var p = multVecMatrix([seg.x, seg.y], matrix);
                seg.x = p[0];
                seg.y = p[1];
            }
            if (seg instanceof CurveTo) {
                var p1 = multVecMatrix([seg.x1, seg.y1], matrix);
                var p2 = multVecMatrix([seg.x2, seg.y2], matrix);
                seg.x1 = p1[0];
                seg.y1 = p1[1];
                seg.x2 = p2[0];
                seg.y2 = p2[1];
            }
        });
    };
    Path.prototype.draw = function (context) {
        var p = context.pdf;
        this.segments.forEach(function (s) {
            if (s instanceof MoveTo) {
                p.moveTo(s.x, s.y);
            }
            else if (s instanceof LineTo) {
                p.lineTo(s.x, s.y);
            }
            else if (s instanceof CurveTo) {
                p.curveTo(s.x1, s.y1, s.x2, s.y2, s.x, s.y);
            }
            else {
                p.close();
            }
        });
    };
    return Path;
}());
export { Path };
var Segment = /** @class */ (function () {
    function Segment() {
    }
    return Segment;
}());
export { Segment };
var MoveTo = /** @class */ (function () {
    function MoveTo(x, y) {
        this.x = x;
        this.y = y;
    }
    return MoveTo;
}());
export { MoveTo };
var LineTo = /** @class */ (function () {
    function LineTo(x, y) {
        this.x = x;
        this.y = y;
    }
    return LineTo;
}());
export { LineTo };
var CurveTo = /** @class */ (function () {
    function CurveTo(x1, y1, x2, y2, x, y) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x = x;
        this.y = y;
    }
    return CurveTo;
}());
export { CurveTo };
var Close = /** @class */ (function () {
    function Close() {
    }
    return Close;
}());
export { Close };
//# sourceMappingURL=path.js.map