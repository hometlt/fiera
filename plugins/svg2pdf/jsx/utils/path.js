import { multVecMatrix } from './geometry.js';
export class Path {
    constructor() {
        this.segments = [];
    }
    moveTo(x, y) {
        this.segments.push(new MoveTo(x, y));
        return this;
    }
    lineTo(x, y) {
        this.segments.push(new LineTo(x, y));
        return this;
    }
    curveTo(x1, y1, x2, y2, x, y) {
        this.segments.push(new CurveTo(x1, y1, x2, y2, x, y));
        return this;
    }
    close() {
        this.segments.push(new Close());
        return this;
    }
    /**
     * Transforms the path in place
     */
    transform(matrix) {
        this.segments.forEach(seg => {
            if (seg instanceof MoveTo || seg instanceof LineTo || seg instanceof CurveTo) {
                const p = multVecMatrix([seg.x, seg.y], matrix);
                seg.x = p[0];
                seg.y = p[1];
            }
            if (seg instanceof CurveTo) {
                const p1 = multVecMatrix([seg.x1, seg.y1], matrix);
                const p2 = multVecMatrix([seg.x2, seg.y2], matrix);
                seg.x1 = p1[0];
                seg.y1 = p1[1];
                seg.x2 = p2[0];
                seg.y2 = p2[1];
            }
        });
    }
    draw(context) {
        const p = context.pdf;
        this.segments.forEach(s => {
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
    }
}
export class Segment {
}
export class MoveTo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class LineTo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class CurveTo {
    constructor(x1, y1, x2, y2, x, y) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x = x;
        this.y = y;
    }
}
export class Close {
}
