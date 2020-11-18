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
import { compare as compareSpecificity } from './../imports/specificity.js';
import { nodeIs } from '../utils/node.js';
var StyleSheets = /** @class */ (function () {
    function StyleSheets(rootSvg, loadExtSheets) {
        this.rootSvg = rootSvg;
        this.loadExternalSheets = loadExtSheets;
        this.styleSheets = [];
    }
    StyleSheets.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sheetTexts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collectStyleSheetTexts()];
                    case 1:
                        sheetTexts = _a.sent();
                        this.parseCssSheets(sheetTexts);
                        return [2 /*return*/];
                }
            });
        });
    };
    StyleSheets.prototype.collectStyleSheetTexts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sheetTexts, i, node, styleElements, i, styleElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sheetTexts = [];
                        if (this.loadExternalSheets && this.rootSvg.ownerDocument) {
                            for (i = 0; i < this.rootSvg.ownerDocument.childNodes.length; i++) {
                                node = this.rootSvg.ownerDocument.childNodes[i];
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                if (node.nodeName === 'xml-stylesheet' && typeof node.data === 'string') {
                                    sheetTexts.push(StyleSheets.loadSheet(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    node.data
                                        .match(/href=["'].*?["']/)[0]
                                        .split('=')[1]
                                        .slice(1, -1)));
                                }
                            }
                        }
                        styleElements = this.rootSvg.querySelectorAll('style,link');
                        for (i = 0; i < styleElements.length; i++) {
                            styleElement = styleElements[i];
                            if (nodeIs(styleElement, 'style')) {
                                sheetTexts.push(styleElement.textContent);
                            }
                            else if (this.loadExternalSheets &&
                                nodeIs(styleElement, 'link') &&
                                styleElement.getAttribute('rel') === 'stylesheet' &&
                                styleElement.hasAttribute('href')) {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                sheetTexts.push(StyleSheets.loadSheet(styleElement.getAttribute('href')));
                            }
                        }
                        return [4 /*yield*/, Promise.all(sheetTexts)];
                    case 1: return [2 /*return*/, (_a.sent()).filter(function (sheet) { return sheet !== null; })];
                }
            });
        });
    };
    StyleSheets.prototype.parseCssSheets = function (sheetTexts) {
        var styleDoc = document.implementation.createHTMLDocument('');
        for (var _i = 0, sheetTexts_1 = sheetTexts; _i < sheetTexts_1.length; _i++) {
            var sheetText = sheetTexts_1[_i];
            var style = styleDoc.createElement('style');
            style.textContent = sheetText;
            styleDoc.body.appendChild(style);
            var sheet = style.sheet;
            if (sheet instanceof CSSStyleSheet) {
                for (var i = sheet.cssRules.length - 1; i >= 0; i--) {
                    var cssRule = sheet.cssRules[i];
                    if (!(cssRule instanceof CSSStyleRule)) {
                        sheet.deleteRule(i);
                    }
                    var cssStyleRule = cssRule;
                    if (cssStyleRule.selectorText.indexOf(',') >= 0) {
                        sheet.deleteRule(i);
                        var body = cssStyleRule.cssText.substring(cssStyleRule.selectorText.length);
                        var selectors = StyleSheets.splitSelectorAtCommas(cssStyleRule.selectorText);
                        for (var j = 0; j < selectors.length; j++) {
                            sheet.insertRule(selectors[j] + body, i + j);
                        }
                    }
                }
                this.styleSheets.push(sheet);
            }
        }
    };
    StyleSheets.splitSelectorAtCommas = function (selectorText) {
        var initialRegex = /,|["']/g;
        var closingDoubleQuotesRegex = /[^\\]["]/g;
        var closingSingleQuotesRegex = /[^\\][']/g;
        var parts = [];
        var state = 'initial';
        var match;
        var lastCommaIndex = -1;
        var closingQuotesRegex = closingDoubleQuotesRegex;
        for (var i = 0; i < selectorText.length;) {
            switch (state) {
                case 'initial':
                    initialRegex.lastIndex = i;
                    match = initialRegex.exec(selectorText);
                    if (match) {
                        if (match[0] === ',') {
                            parts.push(selectorText.substring(lastCommaIndex + 1, initialRegex.lastIndex - 1).trim());
                            lastCommaIndex = initialRegex.lastIndex - 1;
                        }
                        else {
                            state = 'withinQuotes';
                            closingQuotesRegex =
                                match[0] === '"' ? closingDoubleQuotesRegex : closingSingleQuotesRegex;
                        }
                        i = initialRegex.lastIndex;
                    }
                    else {
                        parts.push(selectorText.substring(lastCommaIndex + 1).trim());
                        i = selectorText.length;
                    }
                    break;
                case 'withinQuotes':
                    closingQuotesRegex.lastIndex = i;
                    match = closingQuotesRegex.exec(selectorText);
                    if (match) {
                        i = closingQuotesRegex.lastIndex;
                        state = 'initial';
                    }
                    // else this is a syntax error - omit the last part...
                    break;
            }
        }
        return parts;
    };
    StyleSheets.loadSheet = function (url) {
        return (new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'text';
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    reject(new Error("Error " + xhr.status + ": Failed to load '" + url + "'"));
                }
                resolve(xhr.responseText);
            };
            xhr.onerror = reject;
            xhr.onabort = reject;
            xhr.send(null);
        })
            // ignore the error since some stylesheets may not be accessible
            // due to CORS policies
            .catch(function () { return null; }));
    };
    StyleSheets.prototype.getPropertyValue = function (node, propertyCss) {
        var matchingRules = [];
        for (var _i = 0, _a = this.styleSheets; _i < _a.length; _i++) {
            var sheet = _a[_i];
            for (var i = 0; i < sheet.cssRules.length; i++) {
                var rule = sheet.cssRules[i];
                if (rule.style.getPropertyValue(propertyCss) && node.matches(rule.selectorText)) {
                    matchingRules.push(rule);
                }
            }
        }
        if (matchingRules.length === 0) {
            return undefined;
        }
        var compare = function (a, b) {
            var priorityA = a.style.getPropertyPriority(propertyCss);
            var priorityB = b.style.getPropertyPriority(propertyCss);
            if (priorityA !== priorityB) {
                return priorityA === 'important' ? 1 : -1;
            }
            return compareSpecificity(a.selectorText, b.selectorText);
        };
        var mostSpecificRule = matchingRules.reduce(function (previousValue, currentValue) {
            return compare(previousValue, currentValue) === 1 ? previousValue : currentValue;
        });
        return mostSpecificRule.style.getPropertyValue(propertyCss) || undefined;
    };
    return StyleSheets;
}());
export { StyleSheets };
//# sourceMappingURL=stylesheets.js.map