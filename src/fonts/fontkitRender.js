import Buffer from "../../plugins/buffer.js";
import fontkit from "../../plugins/fontkit/dist/fontkit-browserified.js";

import {FmFonts} from "./fonts.js";

export const FmFontkitRender = {
    name: "fontkitRender",
    deps: [FmFonts],
    install() {
        fabric.fonts.loadFontkit = function(variation){
            let uint8array = new Buffer(variation.buffer);
            let font = variation.kit = fontkit.create(uint8array);


            // let defaultVariationName = findKey(variation.kit.namedVariations, n => isEqual(props.font.namedVariations[n], defaultSettings))
            //     || props.font.subfamilyName
            //     || 'Custom';
            //

            // console.log(font.namedVariations)
            // console.log(font.variationAxes)
            // console.log(font.subfamilyName)
            // console.log(font.postscriptName)
            // console.log(font.getAvailableFeatures())
            // // font = font.getVariation(defaultSettings);
            // let scripts = (font.GSUB ? font.GSUB.scriptList : []).concat(font.GPOS ? font.GPOS.scriptList : []);
            // console.log(scripts)
            // // let scriptTags = Array.from(new Set(scripts.map(s => s.tag)));
            // let languages = selectedScript ? selectedScript.script.langSysRecords : [];
            // let directions = ["ltr", "rtl"];
            // let selectedScript = scripts.find(s => s.tag === run.script);
        }
    },
    prototypes: {
        Text: {
            "^textRenders": ["fontkitRender"],
            fontkitRender: function (method, ctx, char, decl) {
                let ff = decl.fontFamily
                let fontRegistry = fabric.fonts.registry[ff]    ;
                let specifiedRenderer = this.renderer || fontRegistry.renderer;
                if (!fontRegistry || !fontRegistry.active || specifiedRenderer && specifiedRenderer !== "fontkit") {
                    return false;
                }
                if(!specifiedRenderer && !fontRegistry.features){
                    return false
                }

                let objectFonts = decl.fontFamily.split(",").map(fi => fi.trim());
                let fallbackFonts = objectFonts.concat(fabric.fonts.fallbacks.filter(fi => !objectFonts.includes(fi)))
                let variationName = (decl.fontStyle === "italic" ? "i" : "n") + (decl.fontWeight === "bold" ? "7" : "4");

                let groups = []
                let lastGroup = null
                for(let i =0; i < char.length;i++){
                    let compatibleFont = fallbackFonts.find(fi => {
                        // fabric.fonts.fontIncludes({fontFamily: fi},char[i])
                        let registry = fabric.fonts.registry[fi]
                        let variation = registry.variations[variationName]
                        if (!variation.kit) {
                            if(!variation.buffer){
                                console.log("NO BUFFER " + fi)
                                return false;
                            }
                            fabric.fonts.loadFontkit(variation)
                        }
                        let glyphs = fabric.fonts.registry[fi].variations[variationName].kit.glyphsForString(char[i])
                        return glyphs.length && glyphs[0].id  !== 0
                    })
                    if(!compatibleFont)compatibleFont = decl.fontFamily

                    if(!lastGroup || lastGroup.font !== compatibleFont){
                        if(lastGroup){
                            lastGroup.end = i;
                            lastGroup.text = char.substring(lastGroup.start,lastGroup.end)
                        }
                        lastGroup = {
                            start: i,
                            font: compatibleFont
                        }
                        groups.push(lastGroup)
                    }
                }
                if(lastGroup){
                    lastGroup.end = char.length;
                    lastGroup.text = char.substring(lastGroup.start,lastGroup.end)
                }

                let globalX =0 , globalY = 0;
                for(let group of groups){
                    let font = fabric.fonts.registry[group.font].variations[variationName].kit

                    let layout = font.layout(group.text, this.features, null, null, null);

                    ctx.save()
                    let scale = 1 / font.unitsPerEm * decl.fontSize;
                    ctx.scale(1, -1);

                    let x = 0, y = 0;

                    layout.glyphs.forEach((glyph, index) => {
                        let pos = layout.positions[index];
                        ctx.save();
                        ctx.translate(globalX + (x + pos.xOffset) * scale, globalY +(y + pos.yOffset) * scale);
                        ctx.beginPath();
                        //   glyph.render(ctx, decl.fontSize);

                        ctx.scale(scale, scale);
                        var fn = glyph.path.toFunction(ctx);
                        fn(ctx);
                        ctx.fill();


                        ctx.restore();
                        x += pos.xAdvance;
                        y += pos.yAdvance;
                    });

                    globalY += layout.advanceHeight * scale
                    globalX += layout.advanceWidth * scale

//                     if (method === "both") {
//                         if (decl.fill && this.paintFirst === 'fill') {
//                             ctx.fill();
//                         }
//                         if (decl.stroke && decl.strokeWidth) {
//                             if (this.shadow && !this.shadow.affectStroke) {
//                                 this._removeShadow(ctx);
//                             }
//                             ctx.save();
//                             this._setLineDash(ctx, this.strokeDashArray);
//                             ctx.beginPath();
//                             ctx.stroke();
//                             ctx.closePath();
//                             ctx.restore();
//                         }
//                         if (decl.fill && this.paintFirst === 'stroke') {
//                             ctx.fill();
//                         }
//                     } else if (method === "fillText") {
//                         decl.fill && ctx.fill();
//                     } else if (method === "strokeText") {
//                         decl.stroke && decl.strokeWidth && ctx.stroke();
//                     }
                    ctx.restore()

                }
                return true;
            }
        }
    }
}




/**
 *
 fabric.fonts.registerFonts({
		"Roboto": {
			features: {
				numr: {//Numerators Mostly superceded by contextual <frac> implementations
					"0": 123, "1": 122, "2": 115, "3": 116, "4": 575, "5": 576, "6": 577, "7": 578, "8": 579, "9": 580
				},
				dnom: {//Denominators Mostly superceded by contextual <frac> implementations
					"0": 455, "1": 454, "2": 453, "3": 543, "4": 544, "5": 545, "6": 546, "7": 547, "8": 548, "9": 549
				},
				frac: { //Fractions
					"/": 404
				},
				c2sc: { // Small Capitals From Capitals
					"A": 1234, "B": 1235, "C": 1268
				},
				smcp: {//Small Capitals from lowercase
					"a": 1234, "b": 1235, "c": 1268
				},
				onum: {//Oldstyle Figures
					"0": 602, "1": 586, "2": 587, "3": 588, "4": 589, "5": 590, "6": 603, "7": 591, "8": 605, "9": 604
				},
				ccmp: { //Glyph Composition / Decomposition
					"À": 818, "Á": 819, "Ạ": 1054
				},
				dlig: { // Discretionary Ligatures
					"ff": 443, "st": 449, "ft": 448
				},
				liga: {	//Standard Ligatures
					"fi": 444, "fl": 445, "ffi": 446, "ffl": 447
				},
				rlig: {},// Requiered Ligatures
				ss01: { //Stylistic Set 01
					"g": 553
				},
				ss02: { //Stylistic Set 02
					"a": 554
				}
			},
			src: {
				n4: "custom/Roboto-Regular.ttf"
			}
		},
		"JetBrainsMono": {
                features: {
                    //Contextual Alternates
                    calt: {"->": 112, "<-": 113, "=>": 114, "==": 115, "!=": 116, "<=": 117, ">=": 118, ":=": 119, "!==": 120, "===": 403, "=>>": 579, "==>": 580},
                    // Slashed Zero
                    zero: {"0": 523}
                },
                src: {
                    n7: "custom/JetBrainsMono/JetBrainsMono-Bold.ttf",
                        i7: "custom/JetBrainsMono/JetBrainsMono-Bold-Italic.ttf",
                        n9: "custom/JetBrainsMono/JetBrainsMono-ExtraBold.ttf",
                        i9: "custom/JetBrainsMono/JetBrainsMono-ExtraBold-Italic.ttf",
                        i4: "custom/JetBrainsMono/JetBrainsMono-Italic.ttf",
                        n4: "custom/JetBrainsMono/JetBrainsMono-Regular.ttf",
                }
}
})


 TextObject.set("renderer","fontkit")

 **/