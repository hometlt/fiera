var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Marker, MarkerList } from '../markerlist';
import { Close, CurveTo, LineTo, MoveTo } from '../utils/path';
import { iriReference } from '../utils/constants';
import { addVectors, getAngle, getDirectionVector, normalize } from '../utils/geometry';
import { getAttribute } from '../utils/node';
import { GraphicsNode } from './graphicsnode';
var GeometryNode = /** @class */ (function (_super) {
    __extends(GeometryNode, _super);
    function GeometryNode(hasMarkers, element, children) {
        var _this = _super.call(this, element, children) || this;
        _this.cachedPath = null;
        _this.hasMarkers = hasMarkers;
        return _this;
    }
    GeometryNode.prototype.renderCore = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.getCachedPath(context);
                        if (path === null || path.segments.length === 0) {
                            return [2 /*return*/];
                        }
                        if (context.withinClipPath) {
                            path.transform(context.transform);
                        }
                        else {
                            context.pdf.setCurrentTransformationMatrix(context.transform);
                        }
                        path.draw(context);
                        return [4 /*yield*/, this.fillOrStroke(context)];
                    case 1:
                        _a.sent();
                        if (!this.hasMarkers) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.drawMarkers(context, path)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GeometryNode.prototype.getCachedPath = function (context) {
        return this.cachedPath || (this.cachedPath = this.getPath(context));
    };
    GeometryNode.prototype.drawMarkers = function (context, path) {
        return __awaiter(this, void 0, void 0, function () {
            var markers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        markers = this.getMarkers(path, context);
                        return [4 /*yield*/, markers.draw(context.clone({ transform: context.pdf.unitMatrix }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GeometryNode.prototype.fillOrStroke = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var fill, stroke, fillData, _a, isNodeFillRuleEvenOdd;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (context.withinClipPath) {
                            return [2 /*return*/];
                        }
                        fill = context.attributeState.fill;
                        stroke = context.attributeState.stroke && context.attributeState.strokeWidth !== 0;
                        if (!fill) return [3 /*break*/, 2];
                        return [4 /*yield*/, fill.getFillData(this, context)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = undefined;
                        _b.label = 3;
                    case 3:
                        fillData = _a;
                        isNodeFillRuleEvenOdd = getAttribute(this.element, context.styleSheets, 'fill-rule') === 'evenodd';
                        // This is a workaround for symbols that are used multiple times with different
                        // fill/stroke attributes. All paths within symbols are both filled and stroked
                        // and we set the fill/stroke to transparent if the use element has
                        // fill/stroke="none".
                        if ((fill && stroke) || context.withinUse) {
                            if (isNodeFillRuleEvenOdd) {
                                context.pdf.fillStrokeEvenOdd(fillData);
                            }
                            else {
                                context.pdf.fillStroke(fillData);
                            }
                        }
                        else if (fill) {
                            if (isNodeFillRuleEvenOdd) {
                                context.pdf.fillEvenOdd(fillData);
                            }
                            else {
                                context.pdf.fill(fillData);
                            }
                        }
                        else if (stroke) {
                            context.pdf.stroke();
                        }
                        else {
                            context.pdf.discardPath();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GeometryNode.prototype.getBoundingBoxCore = function (context) {
        var path = this.getCachedPath(context);
        if (!path) {
            return [0, 0, 0, 0];
        }
        var minX = Number.POSITIVE_INFINITY;
        var minY = Number.POSITIVE_INFINITY;
        var maxX = Number.NEGATIVE_INFINITY;
        var maxY = Number.NEGATIVE_INFINITY;
        var x = 0, y = 0;
        for (var i = 0; i < path.segments.length; i++) {
            var seg = path.segments[i];
            if (seg instanceof MoveTo || seg instanceof LineTo || seg instanceof CurveTo) {
                x = seg.x;
                y = seg.y;
            }
            if (seg instanceof CurveTo) {
                minX = Math.min(minX, x, seg.x1, seg.x2, seg.x);
                maxX = Math.max(maxX, x, seg.x1, seg.x2, seg.x);
                minY = Math.min(minY, y, seg.y1, seg.y2, seg.y);
                maxY = Math.max(maxY, y, seg.y1, seg.y2, seg.y);
            }
            else {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
        return [minX, minY, maxX - minX, maxY - minY];
    };
    GeometryNode.prototype.getMarkers = function (path, context) {
        var markerStart = getAttribute(this.element, context.styleSheets, 'marker-start');
        var markerMid = getAttribute(this.element, context.styleSheets, 'marker-mid');
        var markerEnd = getAttribute(this.element, context.styleSheets, 'marker-end');
        var markers = new MarkerList();
        if (markerStart || markerMid || markerEnd) {
            markerEnd && (markerEnd = iri(markerEnd));
            markerStart && (markerStart = iri(markerStart));
            markerMid && (markerMid = iri(markerMid));
            var list_1 = path.segments;
            var prevAngle = [1, 0], curAngle = void 0, first = false, firstAngle = [1, 0], last_1 = false;
            var _loop_1 = function (i) {
                var curr = list_1[i];
                var hasStartMarker = markerStart &&
                    (i === 1 || (!(list_1[i] instanceof MoveTo) && list_1[i - 1] instanceof MoveTo));
                if (hasStartMarker) {
                    list_1.forEach(function (value, index) {
                        if (!last_1 && value instanceof Close && index > i) {
                            var tmp = list_1[index - 1];
                            last_1 =
                                (tmp instanceof MoveTo || tmp instanceof LineTo || tmp instanceof CurveTo) && tmp;
                        }
                    });
                }
                var hasEndMarker = markerEnd &&
                    (i === list_1.length - 1 || (!(list_1[i] instanceof MoveTo) && list_1[i + 1] instanceof MoveTo));
                var hasMidMarker = markerMid && i > 0 && !(i === 1 && list_1[i - 1] instanceof MoveTo);
                var prev = list_1[i - 1] || null;
                if (prev instanceof MoveTo || prev instanceof LineTo || prev instanceof CurveTo) {
                    if (curr instanceof CurveTo) {
                        hasStartMarker &&
                            markers.addMarker(new Marker(markerStart, [prev.x, prev.y], 
                            // @ts-ignore
                            getAngle(last_1 ? [last_1.x, last_1.y] : [prev.x, prev.y], [curr.x1, curr.y1])));
                        hasEndMarker &&
                            markers.addMarker(new Marker(markerEnd, [curr.x, curr.y], getAngle([curr.x2, curr.y2], [curr.x, curr.y])));
                        if (hasMidMarker) {
                            curAngle = getDirectionVector([prev.x, prev.y], [curr.x1, curr.y1]);
                            curAngle =
                                prev instanceof MoveTo ? curAngle : normalize(addVectors(prevAngle, curAngle));
                            markers.addMarker(new Marker(markerMid, [prev.x, prev.y], Math.atan2(curAngle[1], curAngle[0])));
                        }
                        prevAngle = getDirectionVector([curr.x2, curr.y2], [curr.x, curr.y]);
                    }
                    else if (curr instanceof MoveTo || curr instanceof LineTo) {
                        curAngle = getDirectionVector([prev.x, prev.y], [curr.x, curr.y]);
                        if (hasStartMarker) {
                            // @ts-ignore
                            var angle = last_1 ? getDirectionVector([last_1.x, last_1.y], [curr.x, curr.y]) : curAngle;
                            markers.addMarker(new Marker(markerStart, [prev.x, prev.y], Math.atan2(angle[1], angle[0])));
                        }
                        hasEndMarker &&
                            markers.addMarker(new Marker(markerEnd, [curr.x, curr.y], Math.atan2(curAngle[1], curAngle[0])));
                        if (hasMidMarker) {
                            var angle = curr instanceof MoveTo
                                ? prevAngle
                                : prev instanceof MoveTo
                                    ? curAngle
                                    : normalize(addVectors(prevAngle, curAngle));
                            markers.addMarker(new Marker(markerMid, [prev.x, prev.y], Math.atan2(angle[1], angle[0])));
                        }
                        prevAngle = curAngle;
                    }
                    else if (curr instanceof Close) {
                        // @ts-ignore
                        curAngle = getDirectionVector([prev.x, prev.y], [first.x, first.y]);
                        if (hasMidMarker) {
                            var angle = prev instanceof MoveTo ? curAngle : normalize(addVectors(prevAngle, curAngle));
                            markers.addMarker(new Marker(markerMid, [prev.x, prev.y], Math.atan2(angle[1], angle[0])));
                        }
                        if (hasEndMarker) {
                            var angle = normalize(addVectors(curAngle, firstAngle));
                            markers.addMarker(
                            // @ts-ignore
                            new Marker(markerEnd, [first.x, first.y], Math.atan2(angle[1], angle[0])));
                        }
                        prevAngle = curAngle;
                    }
                }
                else {
                    first = curr instanceof MoveTo && curr;
                    var next = list_1[i + 1];
                    if (next instanceof MoveTo || next instanceof LineTo || next instanceof CurveTo) {
                        // @ts-ignore
                        firstAngle = getDirectionVector([first.x, first.y], [next.x, next.y]);
                    }
                }
            };
            for (var i = 0; i < list_1.length; i++) {
                _loop_1(i);
            }
        }
        return markers;
    };
    return GeometryNode;
}(GraphicsNode));
export { GeometryNode };
function iri(attribute) {
    var match = iriReference.exec(attribute);
    return (match && match[1]) || undefined;
}
//# sourceMappingURL=geometrynode.js.map