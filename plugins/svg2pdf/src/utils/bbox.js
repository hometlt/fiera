import { getAttribute } from './node';
export function getBoundingBoxByChildren(context, svgnode) {
    if (getAttribute(svgnode.element, context.styleSheets, 'display') === 'none') {
        return [0, 0, 0, 0];
    }
    var boundingBox = [0, 0, 0, 0];
    svgnode.children.forEach(function (child) {
        var nodeBox = child.getBoundingBox(context);
        boundingBox = [
            Math.min(boundingBox[0], nodeBox[0]),
            Math.min(boundingBox[1], nodeBox[1]),
            Math.max(boundingBox[0] + boundingBox[2], nodeBox[0] + nodeBox[2]) -
                Math.min(boundingBox[0], nodeBox[0]),
            Math.max(boundingBox[1] + boundingBox[3], nodeBox[1] + nodeBox[3]) -
                Math.min(boundingBox[1], nodeBox[1])
        ];
    });
    return boundingBox;
}
export function defaultBoundingBox(element, context) {
    var pf = parseFloat;
    // TODO: check if there are other possible coordinate attributes
    var x1 = pf(element.getAttribute('x1')) ||
        pf(getAttribute(element, context.styleSheets, 'x')) ||
        pf(getAttribute(element, context.styleSheets, 'cx')) -
            pf(getAttribute(element, context.styleSheets, 'r')) ||
        0;
    var x2 = pf(element.getAttribute('x2')) ||
        x1 + pf(getAttribute(element, context.styleSheets, 'width')) ||
        pf(getAttribute(element, context.styleSheets, 'cx')) +
            pf(getAttribute(element, context.styleSheets, 'r')) ||
        0;
    var y1 = pf(element.getAttribute('y1')) ||
        pf(getAttribute(element, context.styleSheets, 'y')) ||
        pf(getAttribute(element, context.styleSheets, 'cy')) -
            pf(getAttribute(element, context.styleSheets, 'r')) ||
        0;
    var y2 = pf(element.getAttribute('y2')) ||
        y1 + pf(getAttribute(element, context.styleSheets, 'height')) ||
        pf(getAttribute(element, context.styleSheets, 'cy')) +
            pf(getAttribute(element, context.styleSheets, 'r')) ||
        0;
    return [
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.max(x1, x2) - Math.min(x1, x2),
        Math.max(y1, y2) - Math.min(y1, y2)
    ];
}
//# sourceMappingURL=bbox.js.map