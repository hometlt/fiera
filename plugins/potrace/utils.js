import Point from './types/Point.js'

var attrRegexps = {};

export function getAttrRegexp(attrName) {
  if (attrRegexps[attrName]) {
    return attrRegexps[attrName];
  }

  attrRegexps[attrName] = new RegExp(' ' + attrName + '="((?:\\\\(?=")"|[^"])+)"', 'i');
  return attrRegexps[attrName];
}

export function setHtmlAttr(html, attrName, value) {
  var attr = ' ' + attrName + '="' + value + '"';

  if (html.indexOf(' ' + attrName + '="') === -1) {
    html = html.replace(/<[a-z]+/i, function(beginning) { return beginning + attr; });
  } else {
    html = html.replace(getAttrRegexp(attrName), attr);
  }

  return html;
}

export function fixed(number) {
  return number.toFixed(3).replace('.000', '');
}

export function mod(a, n) {
  return a >= n ? a % n : a>=0 ? a : n-1-(-1-a) % n;
}

export  function xprod(p1, p2) {
  return p1.x * p2.y - p1.y * p2.x;
}

export function cyclic(a, b, c) {
  if (a <= c) {
    return (a <= b && b < c);
  } else {
    return (a <= b || b < c);
  }
}

export function sign(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}

export function quadform(Q, w) {
  var v = new Array(3), i, j, sum;

  v[0] = w.x;
  v[1] = w.y;
  v[2] = 1;
  sum = 0.0;

  for (i=0; i<3; i++) {
    for (j=0; j<3; j++) {
      sum += v[i] * Q.at(i, j) * v[j];
    }
  }
  return sum;
}

export function interval(lambda, a, b) {
  var res = new Point();

  res.x = a.x + lambda * (b.x - a.x);
  res.y = a.y + lambda * (b.y - a.y);
  return res;
}

export function dorth_infty(p0, p2) {
  var r = new Point();

  r.y = sign(p2.x - p0.x);
  r.x = -sign(p2.y - p0.y);

  return r;
}

export function ddenom(p0, p2) {
  var r = dorth_infty(p0, p2);

  return r.y * (p2.x - p0.x) - r.x * (p2.y - p0.y);
}

export function dpara(p0, p1, p2) {
  var x1, y1, x2, y2;

  x1 = p1.x - p0.x;
  y1 = p1.y - p0.y;
  x2 = p2.x - p0.x;
  y2 = p2.y - p0.y;

  return x1 * y2 - x2 * y1;
}

export function cprod(p0, p1, p2, p3) {
  var x1, y1, x2, y2;

  x1 = p1.x - p0.x;
  y1 = p1.y - p0.y;
  x2 = p3.x - p2.x;
  y2 = p3.y - p2.y;

  return x1 * y2 - x2 * y1;
}

export function iprod(p0, p1, p2) {
  var x1, y1, x2, y2;

  x1 = p1.x - p0.x;
  y1 = p1.y - p0.y;
  x2 = p2.x - p0.x;
  y2 = p2.y - p0.y;

  return x1*x2 + y1*y2;
}

export function iprod1(p0, p1, p2, p3) {
  var x1, y1, x2, y2;

  x1 = p1.x - p0.x;
  y1 = p1.y - p0.y;
  x2 = p3.x - p2.x;
  y2 = p3.y - p2.y;

  return x1 * x2 + y1 * y2;
}

export function ddist(p, q) {
  return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
}

export function luminance(r, g, b) {
  return Math.round(0.2126 * r + 0.7153 * g + 0.0721 * b);
}

export function between(val, min, max) {
  return val >= min && val <= max;
}

export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

export function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Generates path instructions for given curve
 *
 * @param {Curve} curve
 * @param {Number} [scale]
 * @returns {string}
 */
export function renderCurve(curve, scale) {
  scale = scale || { x: 1, y: 1 };

  var startingPoint = curve.c[(curve.n - 1) * 3 + 2];

  var path = 'M '
    + fixed(startingPoint.x * scale.x) + ' '
    + fixed(startingPoint.y * scale.y) + ' ';

  curve.tag.forEach(function(tag, i) {
    var i3 = i * 3;
    var p0 = curve.c[i3];
    var p1 = curve.c[i3 + 1];
    var p2 = curve.c[i3 + 2];

    if (tag === "CURVE") {
      path += 'C ';
      path += fixed(p0.x * scale.x) + ' ' + fixed(p0.y * scale.y) + ', ';
      path += fixed(p1.x * scale.x) + ' ' + fixed(p1.y * scale.y) + ', ';
      path += fixed(p2.x * scale.x) + ' ' + fixed(p2.y * scale.y) + ' ';
    } else if (tag === "CORNER") {
      path += 'L ';
      path += fixed(p1.x * scale.x) + ' ' + fixed(p1.y * scale.y) + ' ';
      path += fixed(p2.x * scale.x) + ' ' + fixed(p2.y * scale.y) + ' ';
    }
  });

  return path;
}

export function bezier(t, p0, p1, p2, p3) {
  var s = 1 - t, res = new Point();

  res.x = s*s*s*p0.x + 3*(s*s*t)*p1.x + 3*(t*t*s)*p2.x + t*t*t*p3.x;
  res.y = s*s*s*p0.y + 3*(s*s*t)*p1.y + 3*(t*t*s)*p2.y + t*t*t*p3.y;

  return res;
}

export function tangent(p0, p1, p2, p3, q0, q1) {
    var A, B, C, a, b, c, d, s, r1, r2;

    A = cprod(p0, p1, q0, q1);
    B = cprod(p1, p2, q0, q1);
    C = cprod(p2, p3, q0, q1);

    a = A - 2 * B + C;
    b = -2 * A + 2 * B;
    c = A;

    d = b * b - 4 * a * c;

    if (a===0 || d<0) {
      return -1.0;
    }

    s = Math.sqrt(d);

    r1 = (-b + s) / (2 * a);
    r2 = (-b - s) / (2 * a);

    if (r1 >= 0 && r1 <= 1) {
      return r1;
    } else if (r2 >= 0 && r2 <= 1) {
      return r2;
    } else {
      return -1.0;
    }
  }

  export default {
    luminance,
    between,
    clamp,
    isNumber,
    setHtmlAttr,
    renderCurve,
    bezier,
    tangent,
    mod,
    xprod,
    cyclic,
    sign,
    quadform,
    interval,
    dorth_infty,
    ddenom,
    dpara,
    cprod,
    iprod,
    iprod1,
    ddist
  }