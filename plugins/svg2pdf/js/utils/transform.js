import { parseFloats } from './parsing.js';
export function computeViewBoxTransform(node, viewBox, eX, eY, eWidth, eHeight, context, noTranslate) {
    if (noTranslate === void 0) { noTranslate = false; }
    var vbX = viewBox[0];
    var vbY = viewBox[1];
    var vbWidth = viewBox[2];
    var vbHeight = viewBox[3];
    var scaleX = eWidth / vbWidth;
    var scaleY = eHeight / vbHeight;
    var align, meetOrSlice;
    var preserveAspectRatio = node.getAttribute('preserveAspectRatio');
    if (preserveAspectRatio) {
        var alignAndMeetOrSlice = preserveAspectRatio.split(' ');
        if (alignAndMeetOrSlice[0] === 'defer') {
            alignAndMeetOrSlice = alignAndMeetOrSlice.slice(1);
        }
        align = alignAndMeetOrSlice[0];
        meetOrSlice = alignAndMeetOrSlice[1] || 'meet';
    }
    else {
        align = 'xMidYMid';
        meetOrSlice = 'meet';
    }
    if (align !== 'none') {
        if (meetOrSlice === 'meet') {
            // uniform scaling with min scale
            scaleX = scaleY = Math.min(scaleX, scaleY);
        }
        else if (meetOrSlice === 'slice') {
            // uniform scaling with max scale
            scaleX = scaleY = Math.max(scaleX, scaleY);
        }
    }
    if (noTranslate) {
        return context.pdf.Matrix(scaleX, 0, 0, scaleY, 0, 0);
    }
    var translateX = eX - vbX * scaleX;
    var translateY = eY - vbY * scaleY;
    if (align.indexOf('xMid') >= 0) {
        translateX += (eWidth - vbWidth * scaleX) / 2;
    }
    else if (align.indexOf('xMax') >= 0) {
        translateX += eWidth - vbWidth * scaleX;
    }
    if (align.indexOf('YMid') >= 0) {
        translateY += (eHeight - vbHeight * scaleY) / 2;
    }
    else if (align.indexOf('YMax') >= 0) {
        translateY += eHeight - vbHeight * scaleY;
    }
    var translate = context.pdf.Matrix(1, 0, 0, 1, translateX, translateY);
    var scale = context.pdf.Matrix(scaleX, 0, 0, scaleY, 0, 0);
    return context.pdf.matrixMult(scale, translate);
}
// parses the "transform" string
export function parseTransform(transformString, context) {
    if (!transformString || transformString === 'none')
        return context.pdf.unitMatrix;
    var mRegex = /^[\s,]*matrix\(([^\)]+)\)\s*/, tRegex = /^[\s,]*translate\(([^\)]+)\)\s*/, rRegex = /^[\s,]*rotate\(([^\)]+)\)\s*/, sRegex = /^[\s,]*scale\(([^\)]+)\)\s*/, sXRegex = /^[\s,]*skewX\(([^\)]+)\)\s*/, sYRegex = /^[\s,]*skewY\(([^\)]+)\)\s*/;
    var resultMatrix = context.pdf.unitMatrix;
    var m;
    var tSLength;
    while (transformString.length > 0 && transformString.length !== tSLength) {
        tSLength = transformString.length;
        var match = mRegex.exec(transformString);
        if (match) {
            m = parseFloats(match[1]);
            resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(m[0], m[1], m[2], m[3], m[4], m[5]), resultMatrix);
            transformString = transformString.substr(match[0].length);
        }
        match = rRegex.exec(transformString);
        if (match) {
            m = parseFloats(match[1]);
            var a = (Math.PI * m[0]) / 180;
            resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0), resultMatrix);
            if (m[1] || m[2]) {
                var t1 = context.pdf.Matrix(1, 0, 0, 1, m[1], m[2]);
                var t2 = context.pdf.Matrix(1, 0, 0, 1, -m[1], -m[2]);
                resultMatrix = context.pdf.matrixMult(t2, context.pdf.matrixMult(resultMatrix, t1));
            }
            transformString = transformString.substr(match[0].length);
        }
        match = tRegex.exec(transformString);
        if (match) {
            m = parseFloats(match[1]);
            resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(1, 0, 0, 1, m[0], m[1] || 0), resultMatrix);
            transformString = transformString.substr(match[0].length);
        }
        match = sRegex.exec(transformString);
        if (match) {
            m = parseFloats(match[1]);
            if (!m[1])
                m[1] = m[0];
            resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(m[0], 0, 0, m[1], 0, 0), resultMatrix);
            transformString = transformString.substr(match[0].length);
        }
        match = sXRegex.exec(transformString);
        if (match) {
            m = parseFloat(match[1]);
            m *= Math.PI / 180;
            resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(1, 0, Math.tan(m), 1, 0, 0), resultMatrix);
            transformString = transformString.substr(match[0].length);
        }
        match = sYRegex.exec(transformString);
        if (match) {
            m = parseFloat(match[1]);
            m *= Math.PI / 180;
            resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(1, Math.tan(m), 0, 1, 0, 0), resultMatrix);
            transformString = transformString.substr(match[0].length);
        }
    }
    return resultMatrix;
}
//# sourceMappingURL=transform.js.map