import {App} from '../showreel.js'
import {FmTiles} from "../../../src/objects/puzzle.js";
import {FmWarp} from "../../../src/shapes/warp.js";
import {FmSourceCanvas} from "../../../src/images/image.sourceCanvas.js";
import {FmFonts} from "../../../src/fonts/fonts.js";
import {FmCLipPath} from "../../../src/objects/object.clippath.js";
import {FmCrop} from "../../../src/images/image-crop.js";
import {FmObjectRender} from "../../../src/objects/object.render.js";
import {FmTemplates} from "../../../src/shapes/templates.js";


new App({
    plugins: [
        FmWarp,
        FmTiles,
        FmSourceCanvas,
        FmFonts,
        FmCLipPath,
        FmCrop,
        FmObjectRender,
        FmTemplates
    ],
    prototypes: {
        "Image": {},
        "Warp": {
            "subdivisions": 40,
            "strokeWidth": 0,
            "sticker": false,
            "stickerOptions": {
                "fill": "white",
                "strokeWidth": 0,
                "shadow": {"offsetX": 0, "offsetY": 0, "blur": 3, "color": "rgba(0,0,0,0.80)"}
            }
        },
        "Canvas": {"imageSmoothingEnabled": false}
    },
    slide: {
        "width": 1000,
        "height": 1000,
        "objects": [
            {
                "id": "shadow-new",
                "type": "image", "width": 1000, "height": 1000,
                "src": "products/wrapping-shadow.png"
            },
            {
                "id": "mockup",
                "type": "image", "src": "products/wrapping-product.png", "width": 1000, "height": 1000
            },
            {
                "type": "warp",
                "left": 248.49246993345542,
                "top": -314.2189008002137,
                "width": 1056.3787959582514,
                "height": 975.165718996342,
                "points": [{"x": 104.4169018401069, "y": 44.714669372534445}, {"x": 1055.3787959582514, "y": 0}, {"x": 935.9208279925892, "y": 974.165718996342}, {"x": 0, "y": 923.3829987010564}],
                "transformations": [[], [{"x": 1023.4470953472512, "y": 49.160457061891634, "t": 0.06860336411315579, "c": 1}, {"x": 1024.124677234154, "y": 136.07189487947926, "t": 0.1466127298115726, "c": 0}, {"x": 1028.60716621114, "y": 193.31112084343397, "t": 0.20172627422979197, "c": 0}, {"x": 1042.8584908984449, "y": 282.1824542782217, "t": 0.28150030451309405, "c": 1}, {"x": 1038.9081728036356, "y": 383.0345381145381, "t": 0.3999099537914549, "c": 0}, {"x": 1024.1923237108992, "y": 499.16803013329593, "t": 0.5162849326032871, "c": 0}], [], [{"x": 76.78986472931257, "y": 101.8183119540119, "t": 0.07777111730824364, "c": 1}, {"x": 78.13225014103205, "y": 191.51979662731628, "t": 0.17365060335166402, "c": 0}, {"x": 81.1349380297844, "y": 307.03915985179145, "t": 0.3065020021664291, "c": 0}]],
                "angle": 55.01971610724455,
                "strokeWidth": 0,
                "opacity": 1,
                "sourceCanvas": {
                    "objects": [{
                        "type": "image",
                        src: "products/your-design-here.png",
                        "top": 0,
                        "left": -894,
                        "width": 6363,
                        "height": 4575
                    }, {
                        "type": "i-text",
                        "top": 2040.2140406128601,
                        "left": 227.6438880135238,
                        "width": 1212.1600390625001,
                        "height": 144.64,
                        "scaleX": 3.3958522299799476,
                        "scaleY": 3.3958522299799476,
                        "fontFamily": "Bungee Shade",
                        "fontSize": 128,
                        "text": "Add Text Here"
                    }],
                    "width": 4575,
                    "height": 4575
                },
                "clipPath": {
                    id: "mask-new",
                    type: "image",
                    absolutePositioned: true,
                    width: 1000, height: 1000,
                    src: "products/wrapping-mask.png"
                },
                // "globalCompositeOperation": "source-atop",//old
                // "sourceCanvas": {
                //     "objects": [
                //         {"type": "image", "src": "backgrounds/abstract/BG178.jpg", "top": 0, "left": 0, "width": 100, "height": 100},
                //         {"type": "i-text", "originX": "center", "originY": "center", "top": 50, "left": 50, "fontSize": 10, "text": "Add Text Here"}
                //     ],
                //     "width": 100,
                //     "height": 100
                // },
            },
            // {
            //     "id": "mask-old",
            //     "type": "image",
            //     "src": "products/wrapping-mask.png",
            //     "globalCompositeOperation": "destination-in",
            //     "width": 1000,
            //     "height": 1000
            // },
            // {
            //     "id": "mockup2-old",
            //     "type": "image",
            //     "src": "products/wrapping-product.png",
            //     "globalCompositeOperation": "destination-over",
            //     "width": 1000,
            //     "height": 1000
            // },
            {
                "id": "white",
                "type": "image", "width": 1000, "height": 1000,
                "src": "products/wrapping-dark.png",
                "opacity": 1,
                "globalCompositeOperation": "screen",
            },
            {
                "id": "dark",
                "type": "image", "width": 1000, "height": 1000,
                "src": "products/wrapping-light.png",
                "opacity": 1,
                "globalCompositeOperation": "multiply"
            },
            // {
            //     "id": "shadow-old",
            //     "type": "image", "width": 1000, "height": 1000,
            //     "src": "products/wrapping-shadow.png",
            //     "globalCompositeOperation": "destination-over",
            // }
        ]
    }

}).then(() => {
    console.log("READY!")
})