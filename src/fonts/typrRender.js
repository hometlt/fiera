import Typr from "../../plugins/typr.js";
import {FmFonts} from "./fonts.js";
import {getCharCode} from "../../util/string.ext.js";

// Typr.U.initHB(url, clb)

export const FmTyprRender = {
    name: "typrRender",
    deps: [FmFonts],
    install() {
        fabric.fonts.loadTypr = function(variation){
            variation.typr = Typr.parse(variation.buffer)[0];//new Buffer(registry.variations.n4.buffer)
        }
        fabric.fonts.fontIncludes = function(decl, char){
            let registry = fabric.fonts.registry[decl.fontFamily]
            if (!registry) {
                console.warn("no registry!" + decl.fontFamily)
                return false
            }
            let variation = registry.variations[(decl.fontStyle === "italic" ? "i" : "n") + (decl.fontWeight === "bold" ? "7" : "4")]

            if(registry.color){
                if(!variation.buffer){
                    return true;
                }
                if (!variation.typr) {
                    fabric.fonts.loadTypr(variation)
                }
                let charcode = getCharCode(char[0]);
                return Typr.U.codeToGlyph(variation.typr, charcode)
            }
            else{
                if(registry.range){
                    if(!registry.regexp){
                        registry.regexp = new RegExp("["+registry.range + "]","u")
                    }
                    return registry.regexp.test(char)
                }
                else{
                    return true;
                }
            }
        }

        Typr.U.shapeExtended = function(font,str,ltr ,ff, features) {
            let detected = fabric.fonts.getTextFeatures(str, ff, features);
            let getGlyphPosition = function(font, gls,i1,ltr) {
                let g1=gls[i1],g2=gls[i1+1], kern=font["kern"];
                if(kern) {
                    let ind1 = kern.glyph1.indexOf(g1);
                    if(ind1!==-1) {
                        let ind2 = kern.rval[ind1].glyph2.indexOf(g2);
                        if(ind2!==-1) return [0,0,kern.rval[ind1].vals[ind2],0];
                    }
                }
                return [0,0,0,0];
            }

            let gls = [];
            for(let i=0; i<str.length; i++) {

                if(detected && detected[i]){
                    gls.push(detected[i].code);
                    i += detected[i].components.length-1
                }
                else{
                    let cc = str.codePointAt(i);
                    if(cc>0xffff) i++;
                    gls.push(Typr["U"]["codeToGlyph"](font, cc));
                }
            }
            let shape = [];
            let x = 0, y = 0;

            for(let i=0; i<gls.length; i++) {
                let padj = getGlyphPosition(font, gls,i,ltr);
                let gid = gls[i];
                let ax=font["hmtx"].aWidth[gid]+padj[2];
                shape.push({"g":gid, "cl":i, "dx":0, "dy":0, "ax":ax, "ay":0});
                x+=ax;
            }
            return shape;
        }

        Typr.U.getBbox = function(char,ff, decl){
            let registry = fabric.fonts.registry[ff]
            let variation = registry.variations[(decl.fontStyle === "italic" ? "i" : "n") + (decl.fontWeight === "bold" ? "7" : "4")]

            let scale = decl.fontSize / variation.typr.head.unitsPerEm;
            let shape = Typr.U.shapeExtended(variation.typr, char , ff, this.features);
            let path = Typr.U.shapeToPath(variation.typr, shape);
            let bbox = Typr.U.getShapePathBbox(path)
            bbox.x*=scale
            bbox.y*=-scale
            bbox.width*=scale
            bbox.height*=-scale
            return bbox
        }

        Typr.U.getShapePathBbox = function(path){
            let c = 0, cmds = path["cmds"], crds = path["crds"];
            let pathString = ""
            for(let j=0; j<cmds.length; j++) {
                let cmd = cmds[j];
                if (cmd==="M") {
                    pathString+=`M ${crds[c]} ${crds[c+1]}`
                    c+=2;
                }
                else if(cmd==="L") {
                    pathString+=`L ${crds[c]} ${crds[c+1]}`
                    c+=2;
                }
                else if(cmd==="C") {
                    pathString+=`C ${crds[c]} ${crds[c+1]} ${crds[c+2]} ${crds[c+3]} ${crds[c+4]} ${crds[c+5]}`
                    c+=6;
                }
                else if(cmd==="Q") {
                    pathString+=`Q ${crds[c]} ${crds[c+1]} ${crds[c+2]} ${crds[c+3]}`
                    c+=4;
                }
                else if(cmd==="Z") {
                    pathString+=`Z`
                }
            }


            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            let svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            svgPath.setAttribute("d", pathString);
            svg.appendChild(svgPath);
            document.body.append(svg)
            let bboxGroup = svgPath.getBBox();
            document.body.removeChild(svg)
            return bboxGroup
        }
    },
    prototypes: {
        Text: {
            useRenderBoundingBoxes:true,

            _getGraphemeBoxNative: fabric.Text.prototype._getGraphemeBox,
            _getGraphemeBox: function(grapheme, lineIndex, charIndex, prevGrapheme,skipLeft){
                let graphemeInfo = this._getGraphemeBoxNative(grapheme, lineIndex, charIndex, prevGrapheme,skipLeft);

                let style = this.getCompleteStyleDeclaration(lineIndex, charIndex);
                let ff = style.fontFamily.split(",")[0]
                // let registry = fabric.fonts.registry[ff];

                let variation = fabric.fonts.getFontVariation(ff, style.fontWeight, style.fontStyle)?.variation

                if(variation){
                    // let variation = registry.variations[(style.fontStyle === "italic" ? "i" : "n") + (style.fontWeight === "bold" ? "7" : "4")]

                    if (variation.buffer && !variation.typr) {
                        fabric.fonts.loadTypr(variation)
                    }

                    if(variation.typr){
                        let scale = style.fontSize / variation.typr.head.unitsPerEm;
                        let shape = Typr.U.shapeExtended(variation.typr, grapheme, ff, this.features);
                        let path = Typr.U.shapeToPath(variation.typr, shape);
                        let ax = shape.reduce((ax, item) => ax + item.ax, 0)

                        let bbox = Typr.U.getShapePathBbox(path)

                        let baseLine = (this.lineHeight * this.fontSize) -0.9 * style.fontSize

                        graphemeInfo.contour = {
                            x: bbox.x * scale,
                            y: baseLine + bbox.y * scale,
                            w: bbox.width * scale,
                            h: bbox.height * scale
                        }
                        graphemeInfo.contour.t = - baseLine + graphemeInfo.contour.h - graphemeInfo.contour.y
                        // graphemeInfo.typrPath = path

                    }
                }
                return graphemeInfo
            },
            // initDimensions: function() {
            //     if (this.__skipDimension) {
            //         return;
            //     }
            //     this._splitText();
            //     this._clearCache();
            //     this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH;
            //     if (this.textAlign.indexOf('justify') !== -1) {
            //         // once text is measured we need to make space fatter to make justified text.
            //         this.enlargeSpaces();
            //     }
            //     this.height = this.calcTextHeight();
            //     this.saveState({ propertySet: '_dimensionAffectingProps' });
            //
            //     // Typr.U.getBbox (char,ff, decl)
            //     ctx.strokeRect(bbox.x*scale,-bbox.y*scale,bbox.width*scale,-bbox.height*scale)
            // },
            "^textRenders": ["typrRender"],
            typrRender: function (method, ctx, char, decl, alignment, left, top, angle) {
                let ff = decl.fontFamily.split(",")[0]
                let registry = fabric.fonts.registry[ff];
                let specifiedRenderer = this.renderer || registry && registry.renderer;
                if (!registry || !registry.active || specifiedRenderer && specifiedRenderer !== "typr") {
                    return false;
                }

                if(method !=="calc" && !specifiedRenderer && registry.format !== "svg"){
                    return false
                }

                let variation = fabric.fonts.getFontVariation(ff, decl.fontWeight, decl.fontStyle).variation
                //let variation2 = registry.variations[(decl.fontStyle === "italic" ? "i" : "n") + (decl.fontWeight === "bold" ? "7" : "4")]


                if (!variation.typr) {
                    if(!variation.buffer){
                        return false;
                    }
                    fabric.fonts.loadTypr(variation)
                }

                let scale = decl.fontSize / variation.typr.head.unitsPerEm;
                let shape = Typr.U.shapeExtended(variation.typr, char , ff, this.features);
                let path = Typr.U.shapeToPath(variation.typr, shape);
                let ax = shape.reduce((ax,item) => ax+ item.ax,0)

                // if(char.trim() && (method === "calc" || true)){
                //
                //
                //     var theta = angle, cos = fabric.util.cos(theta), sin = fabric.util.sin(theta);
                //
                //     let offsetX = this._contentOffsetX || 0
                //     let offsetY = this._contentOffsetY || 0
                //     // var center = this.getCenterPoint();
                //     var rotateMatrix = [cos, sin, -sin, cos, 0, 0],
                //         translateMatrix = [1, 0, 0, 1, left - offsetX, top - offsetY],
                //         finalMatrix = fabric.util.multiplyTransformMatrices(translateMatrix, rotateMatrix);
                //
                //     let bbox = Typr.U.getShapePathBbox(path)
                //
                //     bbox.x *= scale
                //     bbox.y *= -scale
                //     bbox.width *= scale
                //     bbox.height *= -scale
                //
                //     let dc = [
                //         // corners
                //         /*tl:*/ fabric.util.transformPoint({ x: bbox.x, y: bbox.y + bbox.height }, finalMatrix),
                //         /*tr:*/ fabric.util.transformPoint({ x: bbox.x+ bbox.width, y:bbox.y + bbox.height }, finalMatrix),
                //         /*bl:*/ fabric.util.transformPoint({ x: bbox.x, y: bbox.y }, finalMatrix),
                //         /*br:*/ fabric.util.transformPoint({ x: bbox.x+ bbox.width, y: bbox.y }, finalMatrix)
                //     ]
                //
                //     let xmin = Math.min(dc[0].x,dc[1].x,dc[2].x,dc[3].x)
                //     let xmax = Math.max(dc[0].x,dc[1].x,dc[2].x,dc[3].x)
                //     let ymin = Math.min(dc[0].y,dc[1].y,dc[2].y,dc[3].y)
                //     let ymax = Math.max(dc[0].y,dc[1].y,dc[2].y,dc[3].y)
                //
                //     // if(ctx){
                //     //     if(alignment=== "center"){
                //     //         ctx.strokeRect(bbox.x - ax * scale / 2 ,bbox.y,bbox.width,bbox.height)
                //     //     }
                //     //     else{
                //     //         ctx.strokeRect(bbox.x,bbox.y,bbox.width,bbox.height)
                //     //     }
                //     // }
                //     // bbox.x += left
                //     // bbox.y += top
                //     // console.log(bbox,char)
                //
                //     let leftDiff = this.width/2 + xmin //this._translatedX;
                //     let bottomDiff = this.height/2 - ymax
                //     let topDiff = this.height/2 + ymin  //this._translatedY
                //     let rightDiff = this.width/2 - xmax
                //
                //     if(leftDiff < 0 || rightDiff < 0 || topDiff < 0 || bottomDiff < 0){
                //
                //         if(!this.spacing){
                //             this.spacing = {left: 0, top: 0, bottom: 0, right: 0};
                //         }
                //         if(leftDiff < -1){
                //             this.spacing.left =Math.ceil(-leftDiff)
                //         }
                //         if(rightDiff < -1){
                //             this.spacing.right =Math.ceil( -rightDiff)
                //         }
                //         if(topDiff < -1){
                //             this.spacing.top = Math.ceil(-topDiff)
                //         }
                //         if(bottomDiff < -1){
                //             this.spacing.bottom =Math.ceil( -bottomDiff)
                //         }
                //     }
                // }

                if(ctx){
                    ctx.save()
                    ctx.scale(scale, -scale);
                    ctx.beginPath();
                    if(alignment=== "center"){
                        ctx.translate( -ax / 2, 0);
                    }
                    Typr.U.pathToContext(path, ctx);  // setting color and calling fill() already in path
                    if(method === "both"){
                        if (decl.fill && this.paintFirst === 'fill') {
                            ctx.fill();
                        }
                        if(decl.stroke && decl.strokeWidth) {
                            if (this.shadow && !this.shadow.affectStroke) {
                                this._removeShadow(ctx);
                            }
                            ctx.save();
                            this._setLineDash(ctx, this.strokeDashArray);
                            ctx.beginPath();
                            ctx.stroke();
                            ctx.closePath();
                            ctx.restore();
                        }
                        if (decl.fill && this.paintFirst === 'stroke') {
                            ctx.fill();
                        }
                    }
                    else if(method === "fillText") {
                        decl.fill && ctx.fill();
                    }
                    else if(method === "strokeText") {
                        decl.stroke && decl.strokeWidth && ctx.stroke();
                    }
                    ctx.restore()
                }

                return true;
            }
        }
    }
}