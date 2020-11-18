/**
 * Boring implementation of Curved Text
 */
export default {
    name: "curved-text",
    deps: [],
    prototypes: {
        CurvedText: {
            prototype: [fabric.Text, fabric.Collection],

            /**
             * Type of an object
             * @type String
             * @default
             */
            type: 'curvedText',
            /**
             * The radius of the curved Text
             * @type Number
             * @default 50
             */
            radius: 50,
            letterProperties: ['backgroundColor', 'textBackgroundColor', 'textDecoration', 'stroke', 'fill', 'strokeWidth', 'fontSize', 'fontFamily', 'shadow', 'fontWeight', 'overline', 'underline', 'linethrough', 'lineHeight', 'fontStyle'],
            /**
             * Special Effects, Thanks to fahadnabbasi
             * https://github.com/EffEPi/fabric.curvedText/issues/9
             */
            effect: 'curved',
            range: 5,
            smallFont: 10,
            largeFont: 30,
            /**
             * Spacing between the letters
             * @type fabricNumber
             * @default 20
             */
            spacing: 20,
            /**
             * Reversing the radius (position of the original point)
             * @type Boolean
             * @default false
             */
            reverse: false,
            "+stateProperties": ['radius', 'spacing', 'reverse', 'effect', 'range', 'largeFont', 'smallFont'],
            "+_dimensionAffectingProps": ['radius', 'spacing', 'reverse', 'fill', 'effect', 'width', 'height', 'range', 'fontSize', 'shadow', 'largeFont', 'smallFont'],
            /**
             *
             * Rendering, is we are rendering and another rendering call is passed, then stop rendering the old and
             * rendering the new (trying to speed things up)
             */
            _isRendering: 0,
            /**
             * Added complexity
             */
            complexity: function () {
                this.callSuper('complexity');
            },
            initialize: function (options,callback) {
                this.callSuper('initialize', options,callback);
            },
            setText: function (text) {
                this.letters = new fabric.Group([], {
                    selectable: false,
                    padding: 0
                });
                if (this.letters) {
                    while (this.letters.size()) {
                        this.letters.remove(this.letters.item(0));
                    }
                    for (let i = 0; i < text.length; i++) {
                        //I need to pass the options from the main options
                        if (this.letters.item(i) === undefined) {i
                            this.letters.add(new fabric.Text(text[i]));
                        } else {
                            this.letters.item(i).text = text[i];
                        }
                    }
                }
                this.text = text;

                let i = this.letters.size();
                while (i--) {
                    let letter = this.letters.item(i);

                    for (let keyIndex = 0; keyIndex < this.letterProperties.length; keyIndex++) {
                        let prop = this.letterProperties[keyIndex];
                        letter.set(prop, this[prop]);
                    }
                }

                this._updateLetters();

                this.canvas && this.canvas.renderAll();
            },
            _initDimensions: function (ctx) {
                if (this.__skipDimension) {
                    return;
                }
                if (!ctx) {
                    ctx = fabric.util.createCanvasElement().getContext('2d');
                    this._setTextStyles(ctx);
                }
                this._textLines = this.text.split(this._reNewline);
                this._clearCache();
                let currentTextAlign = this.textAlign;
                this.textAlign = 'left';
                this.width = this.get('width');
                this.textAlign = currentTextAlign;
                this.height = this.get('height');
                this._updateLetters();
            },
            _updateLetters: function () {
                let renderingCode = fabric.util.getRandomInt(100, 999);
                this._isRendering = renderingCode;
                if (this.letters && this.text) {
                    let curAngle = 0,
                        angleRadians = 0,
                        textWidth = 0,
                        space = parseInt(this.spacing),
                        fixedLetterAngle = 0;

                    //get text width
                    if (this.effect === 'curved') {
                        for (let i = 0, len = this.text.length; i < len; i++) {
                            textWidth += this.letters.item(i).width + space;
                        }
                        textWidth -= space;
                    } else if (this.effect === 'arc') {
                        fixedLetterAngle = ((this.letters.item(0).fontSize + space) / this.radius) / (Math.PI / 180);
                        textWidth = ((this.text.length + 1) * (this.letters.item(0).fontSize + space));
                    }
                    // Text align
                    if (this.get('textAlign') === 'right') {
                        curAngle = 90 - (((textWidth / 2) / this.radius) / (Math.PI / 180));
                    } else if (this.get('textAlign') === 'left') {
                        curAngle = -90 - (((textWidth / 2) / this.radius) / (Math.PI / 180));
                    } else {
                        curAngle = -(((textWidth / 2) / this.radius) / (Math.PI / 180));
                    }
                    if (this.reverse)
                        curAngle = -curAngle;

                    let width = 0,
                        multiplier = this.reverse ? -1 : 1,
                        thisLetterAngle = 0,
                        lastLetterAngle = 0;

                    for (let i = 0, len = this.text.length; i < len; i++) {
                        if (renderingCode !== this._isRendering)
                            return;
                        let letter = this.letters.item(i);

                        for (let keyIndex = 0; keyIndex < this.letterProperties.length; keyIndex++) {
                            let prop = this.letterProperties[keyIndex];
                            letter.set(prop, this[prop]);
                        }

                        letter.set('left', (width));
                        letter.set('top', (0));
                        letter.set('angle', 0);
                        letter.set('padding', 0);

                        if (this.effect === 'curved') {
                            thisLetterAngle = ((letter.width + space) / this.radius) / (Math.PI / 180);
                            curAngle = multiplier * ((multiplier * curAngle) + lastLetterAngle);
                            angleRadians = curAngle * (Math.PI / 180);
                            lastLetterAngle = thisLetterAngle;

                            letter.set('angle', curAngle);
                            letter.set('top', multiplier * -1 * (Math.cos(angleRadians) * this.radius));
                            letter.set('left', multiplier * (Math.sin(angleRadians) * this.radius));
                            letter.set('padding', 0);
                            letter.set('selectable', false);

                        } else if (this.effect === 'arc') {//arc
                            curAngle = multiplier * ((multiplier * curAngle) + fixedLetterAngle);
                            angleRadians = curAngle * (Math.PI / 180);

                            letter.set('top', multiplier * -1 * (Math.cos(angleRadians) * this.radius));
                            letter.set('left', multiplier * (Math.sin(angleRadians) * this.radius));
                            letter.set('padding', 0);
                            letter.set('selectable', false);
                        } else if (this.effect === 'STRAIGHT') {//STRAIGHT
                            //let newfont=(i*5)+15;
                            //letter.set('fontSize',(newfont));
                            letter.set('left', (width));
                            letter.set('top', (0));
                            letter.set('angle', 0);
                            width += letter.get('width');
                            letter.set('padding', 0);
                            letter.set({
                                borderColor: 'red',
                                cornerColor: 'green',
                                cornerSize: 6,
                                transparentCorners: false
                            });
                            letter.set('selectable', false);
                        } else if (this.effect === 'smallToLarge') {//smallToLarge
                            let small = parseInt(this.smallFont);
                            let large = parseInt(this.largeFont);
                            let difference = large - small;
                            let step = difference / (this.text.length);
                            let newfont = small + (i * step);
                            letter.set('fontSize', (newfont));

                            letter.set('left', (width));
                            width += letter.get('width');
                            letter.set('padding', 0);
                            letter.set('selectable', false);
                            letter.set('top', -1 * letter.get('fontSize') + i);

                        } else if (this.effect === 'largeToSmallTop') {//largeToSmallTop
                            let small = parseInt(this.largeFont);
                            let large = parseInt(this.smallFont);
                            let difference = large - small;
                            let step = difference / (this.text.length);
                            let newfont = small + (i * step);
                            letter.set('fontSize', (newfont));
                            letter.set('left', (width));
                            width += letter.get('width');
                            letter.set('padding', 0);
                            letter.set({
                                borderColor: 'red',
                                cornerColor: 'green',
                                cornerSize: 6,
                                transparentCorners: false
                            });
                            letter.set('padding', 0);
                            letter.set('selectable', false);
                            letter.top = -1 * letter.get('fontSize') + (i / this.text.length);

                        } else if (this.effect === 'largeToSmallBottom') {
                            let small = parseInt(this.largeFont);
                            let large = parseInt(this.smallFont);
                            let difference = large - small;
                            let center = Math.ceil(this.text.length / 2);
                            let step = difference / (this.text.length);
                            let newfont = small + (i * step);
                            letter.set('fontSize', (newfont));
                            letter.set('left', (width));
                            width += letter.get('width');
                            letter.set('padding', 0);
                            letter.set({
                                borderColor: 'red',
                                cornerColor: 'green',
                                cornerSize: 6,
                                transparentCorners: false
                            });
                            letter.set('padding', 0);
                            letter.set('selectable', false);
                            letter.top = -1 * letter.get('fontSize') - i;

                        } else if (this.effect === 'bulge') {
                            letter.set('fontSize', (newfont));

                            letter.set('left', (width));
                            width += letter.get('width');

                            letter.set('padding', 0);
                            letter.set('selectable', false);

                            letter.set('top', -1 * letter.get('height') / 2);
                        }
                    }

                    let scaleX = this.letters.get('scaleX');
                    let scaleY = this.letters.get('scaleY');
                    let angle = this.letters.get('angle');

                    this.letters.set('scaleX', 1);
                    this.letters.set('scaleY', 1);
                    this.letters.set('angle', 0);

                    // Update group coords
                    this.letters._calcBounds();
                    this.letters._updateObjectsCoords();

                    this.letters.set('scaleX', scaleX);
                    this.letters.set('scaleY', scaleY);
                    this.letters.set('angle', angle);

                    this.width = this.letters.width;
                    this.height = this.letters.height;
                    this.letters.left = -(this.letters.width / 2);
                    this.letters.top = -(this.letters.height / 2);
                }
            },
            render: function (ctx) {
                // do not render if object is not visible
                if (!this.visible)
                    return;
                if (!this.letters)
                    return;

                ctx.save();
                this.transform(ctx);

                //The array is now sorted in order of highest first, so start from end.
                for (let i = 0, len = this.letters.size(); i < len; i++) {
                    let object = this.letters.item(i);
                    if (!object.visible) continue;
                    object.render(ctx);
                }

                ctx.restore();
                this.setCoords();
            },
            /**
             * @private
             */
            _set: function (key, value) {
                if (key === "text") {
                    this.setText(value);
                    return;
                }
                this.callSuper('_set', key, value);
                if (this.text && this.letters) {
                    if (this.letterProperties.indexOf(key) !== -1) {
                        let i = this.letters.size();
                        while (i--) {
                            this.letters.item(i).set(key, value);
                        }
                    }
                    if (this._dimensionAffectingProps.indexOf(key) !== -1) {
                        this._updateLetters();
                        this.setCoords();
                    }
                }
            },
            initDimensions: function () {

            },
            toObject: function (propertiesToInclude) {
                let object = extend(this.callSuper('toObject', propertiesToInclude), {
                    radius: this.radius,
                    spacing: this.spacing,
                    reverse: this.reverse,
                    effect: this.effect,
                    range: this.range,
                    smallFont: this.smallFont,
                    largeFont: this.largeFont
                });

                if (!this.includeDefaultValues) {
                    this._removeDefaultValues(object);
                }
                return object;
            },
            /**
             * Returns string represenation of a group
             * @return {String}
             */
            toString: function () {
                return '#<fabric.CurvedText (' + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '", "radius": "' + this.radius + '", "spacing": "' + this.spacing + '", "reverse": "' + this.reverse + '" }>';
            },
            
            /**
             * Returns svg representation of an instance
             * @param {Function} [reviver] Method for further parsing of svg representation.
             * @return {String} svg representation of an instance
             */
            toSVG: function (reviver) {
                let markup = [
                    '<g transform="', this.getSvgTransform(), '">'
                ];
                if (this.letters) {
                    for (let i = 0, len = this.letters.size(); i < len; i++) {
                        markup.push(this.letters.item(i).toSVG(reviver));
                    }
                }
                markup.push('</g>');
                return reviver ? reviver(markup.join('')) : markup.join('');
            }
        }
    }
}
