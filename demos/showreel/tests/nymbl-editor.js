import {App} from '../showreel.js'

import {
    FmAlignment,
    FmCLipPath,
    FmControls,
    FmCrop,
    FmDpi,
    FmFonts,
    FmSnap,
    FmSticker,
    FmTemplates,
    FmTextEasyEdit,
    FmTiles,
    FmUndo,
    FmWarp,
    FmWheelScale,
    FmZoom
} from "../../../src/modules.js";

new App({
    plugins: [
        FmCrop,
        FmFonts,
        FmUndo,
        FmZoom,
        FmSticker,
        FmTiles,
        FmSnap,
        FmTextEasyEdit,
        FmWheelScale,
        FmAlignment,
        FmTemplates,
        FmCLipPath,
        FmControls,
        FmDpi,
        FmWarp
    ],
    objects: {
        ydh: {
            "type": "image",
            "src": "../../src/assets/your-design-here.png",
            "top": 0,
            "left": 0,
            "width": 1000,
            "height": 1000
        },
        group: {
            "type": "group",
            "objects": [
                {
                    "type": "image",
                    "src": "../../src/assets/templates/HBgiftWrap1_bg.svg",
                    "width": 400,
                    "height": 400
                }
            ],
            "top": 0,
            "left": 0,
            "width": 400,
            "height": 400
        },
        template: {
            "type":"template",
            "width": 800,
            "height": 800,
            "objects": [
                {
                    "type": "template-image",
                    "src": "../../src/assets/templates/HBgiftWrap1_bg.svg",
                    "width": 800,
                    "height": 800
                },
                {
                    "type": "template-photo",
                    "clipPath": {
                        "radius":0.5
                    },
                    "top":332,
                    "left":325.33333333333337,
                    "width":223,
                    "height":297,
                    "scaleX":0.644654483451881,
                    "scaleY":0.48821548821548816
                },
                {
                    "type":"template-text",
                    "top":377.8602298850575,
                    "left":102.66666666666663,
                    "width":167.109375,
                    "height":36.16,
                    "scaleX":1.3333333333333333,
                    "scaleY":1.3333333333333333,
                    "textAlign":"center",
                    "fill":"#c1272d",
                    "fontFamily":"Montserrat",
                    "fontWeight":"bold",
                    "fontSize":32,
                    "text":"NAME"
                },
                {
                    "type":"template-text",
                    "top":377.8602298850575,
                    "left":472.66666666666663,
                    "width":167.109375,
                    "height":36.16,
                    "scaleX":1.3333333333333333,
                    "scaleY":1.3333333333333333,
                    "text":"AGE",
                    "fill":"#c1272d",
                    "textAlign":"center",
                    "fontSize":32,
                    "fontFamily":"Montserrat",
                    "fontWeight":"bold"
                },
                {
                    "type":"template-path",
                    "top":337,
                    "left":330,
                    "width":100,
                    "height":100,
                    "scaleX":1.3333333333333333,
                    "scaleY":1.3333333333333333,
                    "fill":"#c1272d",
                    "path":[["m", 0, 0], ["c", -27, 0, -50, -22, -50, -50], ["s", 22, -50, 50, -50], ["s", 50, 22, 50, 50], ["s", -22, 50, -50, 50], ["m", 0, -3], ["c", 26, 0, 47, -21, 47, -47], ["s", -21, -47, -47, -47], ["c", -26, 0, -47, 21, -47, 47], ["s", 21, 47, 47, 47]]
                }
            ]
        },
        textbox1: {
            "type": "textbox",
            "textLines": [
                13
            ],
            "top": 455.55419842399715,
            "left": 0,
            "width": 819.1999853515625,
            "height": 144.64,
            "scaleX": 0.1,
            "scaleY": 0.1,
            "fontFamily": "Leckerli One",
            "fontSize": 128,
            "text": "Add Text Here"
        },
        textbox2: {
            "type": "textbox",
            "textLines": [
                13
            ],
            "top": 231.78764254880474,
            "left": 0,
            "width": 819.1999853515625,
            "height": 144.64,
            "scaleX": 0.1,
            "scaleY": 0.1,
            "fontFamily": "Leckerli One",
            "fontSize": 128,
            "text": "Add Text Here"
        },
        image1: {
            "type": "image",
            "src": "https://nymbl-designer.s3.us-east-2.amazonaws.com/library/500x500/HAK13326 Happy Birthday Script Red D30.jpg",
            "top": 487,
            "left": 0,
            "width": 500,
            "height": 300,
            "scaleX": 0.4,
            "scaleY": 0.4
        },
        image2: {
            "type": "image",
            "src": "https://nymbl-designer.s3.us-east-2.amazonaws.com/library/500x500/HAK13327 Happy Birthday Script Green D30.jpg",
            "top": 630,
            "left": 0,
            "width": 500,
            "height": 300,
            "scaleX": 0.4,
            "scaleY": 0.4
        },
        image3: {
            "type": "image",
            "src": "https://nymbl-designer.s3.us-east-2.amazonaws.com/library/500x500/HAP13310 Happy Birthday To You! D30.jpg",
            "top": 830,
            "left": 0,
            "width": 500,
            "height": 300,
            "scaleX": 0.4,
            "scaleY": 0.4
        }
    },
    prototypes: {
        Area: {
            stroke: '#39f',
            strokeWidth: 4
        },
        Canvas: {
            minZoom: 0.85,
            snappingToArea: true,
            snappingToObjects: true,
            snappingToGrid: false,
            snapping: true,
            backgroundColor: "transparent",
            // snapping: true,
            // drawSnapping: true,
            handModeEnabled: false,
            interactiveMode: 'mixed',
            changeDimensionOnZoom: false,
            stretchable: true,
            autoCenterAndZoomOut: true
        },
        Object: {
            locked: false,
            "+controls": {
                // br: {
                //   x: "dimx",
                //   y: "dimy",
                //   visible: false
                // },
                br: { //unlock
                    fill: "white",
                    cornerIconSize: 14,
                    size: 25,
                    button: true,
                    cursor: "pointer",
                    action: "toggleLocked",
                    visible: "locked",
                    x: "dimx",
                   y: "dimy",
                    style: "circle",
                    icon: "\uf09c"
                },
                br2: { //lock
                    fill: "white",
                    cornerIconSize: 14,
                    size: 25,
                    button: true,
                    cursor: "pointer",
                    action: "toggleLocked",
                    visible: "!locked",
                    x: "dimx",
                    y: "dimy",
                    style: "circle",
                    icon: "\uf023"
                }
            },
            minDpi: 200,
            mouseWheelScale: true,
            borderWidth: 0,
            border: '#39f',
            activeOptions: {
                borderWidth: 0,
            },
            inactiveOptions: {
                borderWidth: 0
            },
            activeHoverOptions: {
                borderWidth: 0
            },
            inactiveHoverOptions: {
                borderWidth: 2
            }
        },
        Image: {
            fitting: "fill"
        },
        IText: {
            lockScalingFlip: true,
            // fontFamily: "Bungee",
            fontFamily: "Leckerli One"
        },
        TemplateText: {
            mouseWheelScale: false
        },
        Template: {
            originX: "left",
            originY: "top"
        },
        Textbox: {
            autoFit: true,
            originX: "left",
            originY: "top",
        },
        TemplatePhoto: {
            originX: "left",
            originY: "top",
            mouseWheelScale: false,
            src: "../../src/assets/templates/sample.jpg"
        }
    },
    slide: {
        "objects": [
            "image1",
            "image2",
            "image3",
            "group",
            "template"
        ],
        "width": 1000,
        "height": 1000
    }
})