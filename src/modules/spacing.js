
export const FmSpacing = {
    name: "spacing",
    versions: {
        "4.X": {
            prototypes: {
                Object: {
                    setCoords: function(skipCorners) {
                        this.aCoords = this.calcACoords();
                        // in case we are in a group, for how the inner group target check works,
                        // lineCoords are exactly aCoords. Since the vpt gets absorbed by the normalized pointer.
                        this.lineCoords = this.group ? this.aCoords : this.calcLineCoords();
                        if (skipCorners) {
                            return this;
                        }
                        // set coordinates of the draggable boxes in the corners used to scale/rotate the image
                        this.oCoords = this.calcOCoords();
                        this._setCornerCoords && this._setCornerCoords();
                        return this;
                    },
                    /**
                     * @override
                     * @returns {{br, tl: fabric.Point, bl: fabric.Point, tr: fabric.Point}}
                     */
                    calcLineCoords () {
                        let vpt = this.getViewportTransform(),
                            angle = fabric.util.degreesToRadians(this.angle),
                            cos = fabric.util.cos(angle), sin = fabric.util.sin(angle),
                            aCoords = this.calcACoords();

                        let lineCoords = {
                            tl: fabric.util.transformPoint(aCoords.tl, vpt),
                            tr: fabric.util.transformPoint(aCoords.tr, vpt),
                            bl: fabric.util.transformPoint(aCoords.bl, vpt),
                            br: fabric.util.transformPoint(aCoords.br, vpt),
                        }

                        let padding = this.padding
                        if(padding){
                            let cosP = cos * padding, sinP = sin * padding, cosPSinP = cosP + sinP, cosPMinusSinP = cosP - sinP;
                            lineCoords.tl.x -= cosPMinusSinP;
                            lineCoords.tl.y -= cosPSinP;
                            lineCoords.tr.x += cosPSinP;
                            lineCoords.tr.y -= cosPMinusSinP;
                            lineCoords.bl.x -= cosPSinP;
                            lineCoords.bl.y += cosPMinusSinP;
                            lineCoords.br.x += cosPMinusSinP;
                            lineCoords.br.y += cosPSinP;
                        }
                        //added
                        let spacing = this.spacing
                        if(this.spacing) {
                            lineCoords.tl.x -= sin * spacing.top + cos * spacing.left;
                            lineCoords.tl.y -= cos * spacing.top + sin * spacing.left;

                            lineCoords.tr.x += sin * spacing.top + cos * spacing.right;
                            lineCoords.tr.y -= cos * spacing.top + sin * spacing.right;

                            lineCoords.bl.x -= sin * spacing.bottom + cos * spacing.left;
                            lineCoords.bl.y += cos * spacing.bottom - sin * spacing.left;

                            lineCoords.br.x += sin * spacing.bottom + cos * spacing.right;
                            lineCoords.br.y += cos * spacing.bottom + sin * spacing.right;
                        }

                        return lineCoords;
                    },
                    drawBorders(ctx, styleOverride) {
                        styleOverride = styleOverride || {};
                        let strokeWidth = this.borderScaleFactor,
                            hasControls = typeof styleOverride.hasControls !== 'undefined' ? styleOverride.hasControls : this.hasControls,
                            shouldStroke = false;




                        let width, height;
                        ctx.save();
                        ctx.strokeStyle = styleOverride.borderColor || this.borderColor;
                        this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray, null);


                        let wh = this._calculateCurrentDimensions();
                        width = wh.x + strokeWidth
                        height = wh.y + strokeWidth

                        if(this.spacing){
                            ctx.strokeRect(
                                -(width - this.spacing.left - this.spacing.right) /2 - this.spacing.left,
                                -(height - this.spacing.top - this.spacing.bottom) /2 - this.spacing.top,
                                width,
                                height
                            );
                        }
                        else{
                            ctx.strokeRect(
                                -width /2,
                                -height / 2,
                                width,
                                height
                            );
                        }

                        if (hasControls) {
                            ctx.beginPath();
                            this.forEachControl((control, key, fabricObject) => {
                                // in this moment, the ctx is centered on the object.
                                // width and height of the above function are the size of the bbox.
                                if (control.withConnection && control.getVisibility(fabricObject, key)) {
                                    // reset movement for each control
                                    shouldStroke = true;

                                    ctx.moveTo(control.x * width, control.y * height);
                                    ctx.lineTo(control.x * width + control.offsetX, control.y * height + control.offsetY);
                                }
                            });
                            if (shouldStroke) {
                                ctx.stroke();
                            }
                        }
                        ctx.restore();
                        return this;
                    },
                    calcOCoords () {
                        var rotateMatrix = this._calcRotateMatrix(),
                            translateMatrix = this._calcTranslateMatrix(),
                            vpt = this.getViewportTransform(),
                            startMatrix = fabric.util.multiplyTransformMatrices (vpt, translateMatrix),
                            finalMatrix = fabric.util.multiplyTransformMatrices (startMatrix, rotateMatrix),
                            finalMatrix = fabric.util.multiplyTransformMatrices (finalMatrix, [1 / vpt[0], 0, 0, 1 / vpt[3], 0, 0]),
                            dim = this._calculateCurrentDimensions(),
                            coords = {};
                        if(this.spacing){
                            console.log("calcOCoords",this.spacing)
                        }
                        this.forEachControl(function(control, key, fabricObject) {
                            coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
                        });

                        // debug code
                        // var canvas = this.canvas;
                        // setTimeout(function() {
                        //   canvas.contextTop.clearRect(0, 0, 700, 700);
                        //   canvas.contextTop.fillStyle = 'green';
                        //   Object.keys(coords).forEach(function(key) {
                        //     var control = coords[key];
                        //     canvas.contextTop.fillRect(control.x, control.y, 3, 3);
                        //   });
                        // }, 50);
                        // console.log("oCoords",coords)
                        return coords;
                    },
                    calcACoords () {
                        var rotateMatrix = this._calcRotateMatrix(),
                            translateMatrix = this._calcTranslateMatrix(),
                            finalMatrix = fabric.util.multiplyTransformMatrices (translateMatrix, rotateMatrix),
                            dim = this._getTransformedDimensions(),
                            w = dim.x / 2, h = dim.y / 2;
                        return {
                            // corners
                            tl: fabric.util.transformPoint({ x: -w, y: -h }, finalMatrix),
                            tr: fabric.util.transformPoint({ x: w, y: -h }, finalMatrix),
                            bl: fabric.util.transformPoint({ x: -w, y: h }, finalMatrix),
                            br: fabric.util.transformPoint({ x: w, y: h }, finalMatrix)
                        };
                    },
                    // _calculateCurrentDimensions () {
                    //     let vpt = this.getViewportTransform(),
                    //         dim = this._getTransformedDimensions(),
                    //         p = fabric.util.transformPoint(dim, vpt, true);
                    //
                    //     return new fabric.Point(p.x + 2 * this.padding, p.y + 2 * this.padding);
                    // },
                    _getNonTransformedDimensions: function() {
                        var strokeWidth = this.strokeWidth,
                            w = this.width + strokeWidth,
                            h = this.height + strokeWidth;

                        if(this.spacing){
                            w += this.spacing.left + this.spacing.right
                            h += this.spacing.top + this.spacing.bottom
                        }
                        return { x: w, y: h };
                    },
                    drawSelectionBackground (ctx) {
                        if (!this.selectionBackgroundColor ||
                            (this.canvas && !this.canvas.interactive) ||
                            (this.canvas && this.canvas._activeObject !== this)
                        ) {
                            return this;
                        }
                        ctx.save();
                        var center = this.getCenterPoint(), wh = this._calculateCurrentDimensions(),
                            vpt = this.canvas.viewportTransform;
                        ctx.translate(center.x, center.y);
                        ctx.scale(1 / vpt[0], 1 / vpt[3]);
                        ctx.rotate(fabric.util.degreesToRadians(this.angle));
                        ctx.fillStyle = this.selectionBackgroundColor;
                        ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
                        ctx.restore();
                        return this;
                    },
                }
            }
        }
    }
}
