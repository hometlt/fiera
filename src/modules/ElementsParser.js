

export const FmElementsParser = {
    name: "elements-parser",
    install(){
        fabric.parseElements = function(elements, callback, options, reviver, parsingOptions) {
            let parser = new fabric.ElementsParser(elements, callback, options, reviver, parsingOptions);
            parser.editor = fabric.__globalParseEditor
            delete fabric.__globalParseEditor
            parser.parse();
        };

        /**
         * Returns fabric.Text instance from an SVG element (<b>not yet implemented</b>)
         * @static
         * @memberOf fabric.Text
         * @param {SVGElement} element Element to parse
         * @param {Function} callback callback function invoked after parsing
         * @param {Object} [options] Options object
         */
        fabric.IText.fromElement = function(element, callback, options) {
            if (!element) {
                return callback(null);
            }

            let parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES),
                parsedAnchor = parsedAttributes.textAnchor || 'left'
            options = fabric.util.object.extend((options ? fabric.util.object.clone(options) : { }), parsedAttributes)

            options.top = options.top || 0
            options.left = options.left || 0
            if(options.fontFamily){
                options.fontFamily = options.fontFamily.split(",").map(i => {
                    let ff = i.trim().replace(/['"]/g,"")

                    Object.entries(fabric.fonts.definitions).find(([name, weight]) => {
                        let substr = "-" + name.toLowerCase();
                        if(ff.toLowerCase().endsWith(substr)){
                            ff = ff.substr(0,ff.length - substr.length)
                            options.fontWeight = weight
                            return true;
                        }
                        return false
                    })

                    return ff

                })
            }

            if (parsedAttributes.textDecoration) {
                let textDecoration = parsedAttributes.textDecoration
                if (textDecoration.indexOf('underline') !== -1) {
                    options.underline = true;
                }
                if (textDecoration.indexOf('overline') !== -1) {
                    options.overline = true;
                }
                if (textDecoration.indexOf('line-through') !== -1) {
                    options.linethrough = true;
                }
                delete options.textDecoration;
            }
            if ('dx' in parsedAttributes) {
                options.left += parsedAttributes.dx;
            }
            if ('dy' in parsedAttributes) {
                options.top += parsedAttributes.dy;
            }
            if (!('fontSize' in options)) {
                options.fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
            }

            let textContent = '';

            // The XML is not properly parsed in IE9 so a workaround to get
            // textContent is through firstChild.data. Another workaround would be
            // to convert XML loaded from a file to be converted using DOMParser (same way loadSVGFromString() does)
            if (!('textContent' in element)) {
                if ('firstChild' in element && element.firstChild !== null) {
                    if ('data' in element.firstChild && element.firstChild.data !== null) {
                        textContent = element.firstChild.data;
                    }
                }
            }
            else {
                textContent = element.textContent;
            }

            textContent = textContent.replace(/^\s+|\s+$|\n+/g, '').replace(/\s+/g, ' ');
            let originalStrokeWidth = options.strokeWidth;
            options.strokeWidth = 0;

            let text = new fabric.IText(textContent, options),
                textHeightScaleFactor = text.getScaledHeight() / text.height,
                lineHeightDiff = (text.height + text.strokeWidth) * text.lineHeight - text.height,
                scaledDiff = lineHeightDiff * textHeightScaleFactor,
                textHeight = text.getScaledHeight() + scaledDiff,
                offX = 0;
            /*
              Adjust positioning:
                x/y attributes in SVG correspond to the bottom-left corner of text bounding box
                fabric output by default at top, left.
            */
            if (parsedAnchor === 'center') {
                offX = text.getScaledWidth() / 2;
            }
            if (parsedAnchor === 'right') {
                offX = text.getScaledWidth();
            }
            text.set({
                left: text.left - offX,
                top: text.top - (textHeight - text.fontSize * (0.07 + text._fontSizeFraction)) / text.lineHeight,
                strokeWidth: typeof originalStrokeWidth !== 'undefined' ? originalStrokeWidth : 1,
            });
            callback(text);
        }
    },
    prototypes: {
        ElementsParser: {
            createObject(el, index) {
                let klassName = fabric.util.string.capitalize(el.tagName.replace('svg:', ''));
                if(klassName === "Text") {
                    klassName = "IText"
                }
                let klass = this.editor.getKlass(klassName)
                if (klass && klass.fromElement) {
                    try {
                        this.options.editor = this.editor
                        klass.fromElement(el, this.createCallback(index, el), this.options);
                    }
                    catch (err) {
                        fabric.log(err);
                    }
                }
                else {
                    this.checkIfDone();
                }
            }
        },
        StaticCanvas: {
            loadFromSvg (text){
                return new Promise((resolve,reject) => {
                    fabric.__globalParseEditor = this.editor;
                    fabric.loadSVGFromString(text, (objects, options) => {
                        for(let object of objects){
                            if(object.clipPath){
                                object.setClipPath(object.clipPath.getState())
                                object.clipPathFitting = "manual"
                            }
                            this.add(object)
                        }
                        resolve({objects, options})
                    })
                })
            }
        }
    }
}