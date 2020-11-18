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
import { Context } from '../context/context.js';
import { defaultBoundingBox } from '../utils/bbox.js';
import { ReferencesHandler } from '../context/referenceshandler.js';
import { parse } from '../parse.js';
import { getAttribute, svgNodeIsVisible } from '../utils/node.js';
import { GraphicsNode } from './graphicsnode.js';
import { Viewport } from '../context/viewport.js';
// groups: 1: mime-type (+ charset), 2: mime-type (w/o charset), 3: charset, 4: base64?, 5: body
export var dataUriRegex = /^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*\s*)$/i;
var ImageNode = /** @class */ (function (_super) {
    __extends(ImageNode, _super);
    function ImageNode(element, children) {
        var _this = _super.call(this, element, children) || this;
        _this.imageLoadingPromise = null;
        _this.imageUrl = _this.element.getAttribute('xlink:href') || _this.element.getAttribute('href');
        if (_this.imageUrl) {
            // start loading the image as early as possible
            _this.imageLoadingPromise = ImageNode.fetchImageData(_this.imageUrl);
        }
        return _this;
    }
    ImageNode.prototype.renderCore = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var width, height, x, y, _a, data, format, parser, svgElement, preserveAspectRatio, idMap, svgnode, dataUri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.imageLoadingPromise) {
                            return [2 /*return*/];
                        }
                        context.pdf.setCurrentTransformationMatrix(context.transform);
                        width = parseFloat(getAttribute(this.element, context.styleSheets, 'width') || '0'), height = parseFloat(getAttribute(this.element, context.styleSheets, 'height') || '0'), x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0'), y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
                        if (!isFinite(width) || width <= 0 || !isFinite(height) || height <= 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.imageLoadingPromise];
                    case 1:
                        _a = _b.sent(), data = _a.data, format = _a.format;
                        if (!(format.indexOf('svg') === 0)) return [3 /*break*/, 3];
                        parser = new DOMParser();
                        svgElement = parser.parseFromString(data, 'image/svg+xml').firstElementChild;
                        preserveAspectRatio = this.element.getAttribute('preserveAspectRatio');
                        if (!preserveAspectRatio ||
                            preserveAspectRatio.indexOf('defer') < 0 ||
                            !svgElement.getAttribute('preserveAspectRatio')) {
                            svgElement.setAttribute('preserveAspectRatio', preserveAspectRatio || '');
                        }
                        svgElement.setAttribute('x', String(x));
                        svgElement.setAttribute('y', String(y));
                        svgElement.setAttribute('width', String(width));
                        svgElement.setAttribute('height', String(height));
                        idMap = {};
                        svgnode = parse(svgElement, idMap);
                        return [4 /*yield*/, svgnode.render(new Context(context.pdf, {
                                refsHandler: new ReferencesHandler(idMap),
                                styleSheets: context.styleSheets,
                                viewport: new Viewport(width, height),
                                svg2pdfParameters: context.svg2pdfParameters
                            }))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                    case 3:
                        dataUri = "data:image/" + format + ";base64," + btoa(data);
                        try {
                            context.pdf.addImage(dataUri, '', // will be ignored anyways if imageUrl is a data url
                            x, y, width, height);
                        }
                        catch (e) {
                            typeof console === 'object' &&
                                console.warn &&
                                console.warn("Could not load image " + this.imageUrl + ".\n" + e);
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ImageNode.prototype.getBoundingBoxCore = function (context) {
        return defaultBoundingBox(this.element, context);
    };
    ImageNode.prototype.computeNodeTransformCore = function (context) {
        return context.pdf.unitMatrix;
    };
    ImageNode.prototype.isVisible = function (parentVisible, context) {
        return svgNodeIsVisible(this, parentVisible, context);
    };
    ImageNode.fetchImageData = function (imageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var data, format, match, mimeType, mimeTypeParts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        match = imageUrl.match(dataUriRegex);
                        if (!match) return [3 /*break*/, 1];
                        mimeType = match[2];
                        mimeTypeParts = mimeType.split('/');
                        if (mimeTypeParts[0] !== 'image') {
                            throw new Error("Unsupported image URL: " + imageUrl);
                        }
                        format = mimeTypeParts[1];
                        data = match[5];
                        if (match[4] === 'base64') {
                            data = atob(data);
                        }
                        else {
                            data = decodeURIComponent(data);
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, ImageNode.fetchImage(imageUrl)];
                    case 2:
                        data = _a.sent();
                        format = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
                        _a.label = 3;
                    case 3: return [2 /*return*/, {
                            data: data,
                            format: format
                        }];
                }
            });
        });
    };
    ImageNode.fetchImage = function (imageUrl) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', imageUrl, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    throw new Error("Error " + xhr.status + ": Failed to load image '" + imageUrl + "'");
                }
                var bytes = new Uint8Array(xhr.response);
                var data = '';
                for (var i = 0; i < bytes.length; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                resolve(data);
            };
            xhr.onerror = reject;
            xhr.onabort = reject;
            xhr.send(null);
        });
    };
    ImageNode.getMimeType = function (format) {
        format = format.toLowerCase();
        switch (format) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            default:
                return "image/" + format;
        }
    };
    return ImageNode;
}(GraphicsNode));
export { ImageNode };
//# sourceMappingURL=image.js.map