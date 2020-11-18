import { Line } from './nodes/line.js';
import { Use } from './nodes/use.js';
import { Rect } from './nodes/rect.js';
import { Ellipse } from './nodes/ellipse.js';
import { TextNode } from './nodes/text.js';
import { PathNode } from './nodes/path.js';
import { ImageNode } from './nodes/image.js';
import { Polygon } from './nodes/polygon.js';
import { forEachChild } from './utils/node.js';
import { VoidNode } from './nodes/void.js';
import { MarkerNode } from './nodes/marker.js';
import { Pattern } from './nodes/pattern.js';
import { Circle } from './nodes/circle.js';
import { LinearGradient } from './nodes/lineargradient.js';
import { RadialGradient } from './nodes/radialgradient.js';
import { Polyline } from './nodes/polyline.js';
import { Svg } from './nodes/svg.js';
import { Group } from './nodes/group.js';
import cssesc from './imports/cssesc.js';
import { ClipPath } from './nodes/clippath.js';
import { Symbol } from './nodes/symbol.js';
export function parse(node, idMap) {
    let svgnode;
    const children = [];
    forEachChild(node, (i, n) => children.push(parse(n, idMap)));
    switch (node.tagName.toLowerCase()) {
        case 'a':
        case 'g':
            svgnode = new Group(node, children);
            break;
        case 'circle':
            svgnode = new Circle(node, children);
            break;
        case 'clippath':
            svgnode = new ClipPath(node, children);
            break;
        case 'ellipse':
            svgnode = new Ellipse(node, children);
            break;
        case 'lineargradient':
            svgnode = new LinearGradient(node, children);
            break;
        case 'image':
            svgnode = new ImageNode(node, children);
            break;
        case 'line':
            svgnode = new Line(node, children);
            break;
        case 'marker':
            svgnode = new MarkerNode(node, children);
            break;
        case 'path':
            svgnode = new PathNode(node, children);
            break;
        case 'pattern':
            svgnode = new Pattern(node, children);
            break;
        case 'polygon':
            svgnode = new Polygon(node, children);
            break;
        case 'polyline':
            svgnode = new Polyline(node, children);
            break;
        case 'radialgradient':
            svgnode = new RadialGradient(node, children);
            break;
        case 'rect':
            svgnode = new Rect(node, children);
            break;
        case 'svg':
            svgnode = new Svg(node, children);
            break;
        case 'symbol':
            svgnode = new Symbol(node, children);
            break;
        case 'text':
            svgnode = new TextNode(node, children);
            break;
        case 'use':
            svgnode = new Use(node, children);
            break;
        default:
            svgnode = new VoidNode(node, children);
            break;
    }
    if (idMap != undefined && svgnode.element.hasAttribute('id')) {
        const id = cssesc(svgnode.element.id, { isIdentifier: true });
        idMap[id] = idMap[id] || svgnode;
    }
    return svgnode;
}
