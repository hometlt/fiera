



import {TestApp} from '../showreel.js'
import '../../src/modules/images/image.filters.js'
import {
    Frames,
    Deco,
    Fonts,
    Areas,
    Undo,
    Grid,
    ClipPath,
    Placeholders,
    ImageCrop,
    Snap,
    TextEasyEdit,
    Zoom,
    Controls,
    Barcode,
    BackgroundOverlayImages,
    Animation,
    TextboxTweaks,
    Debug
} from '../../src/modules.js'

new TestApp({
    frames: [
        {
            "id": "frame-1",
            "deco": "Frame-1.png",
            "clipPath": {
                "offsets" :  [19, 24, 19, 24]
            }
        },
        {
            "id": "frame-10",
            "deco": "Frame-10.png",
            "clipPath": {
                "points": [25,20,74,16,74,16,70,87,70,87,28,84,28,84]
            }
        },
        {
            "id": "frame-11",
            "deco": "Frame-11.png",
            "clipPath": {
                "points": [19,20,84,22,84,22,79,80,79,80,23,81,23,81]
            }
        },
        {
            "id": "frame-12",
            "deco": "Frame-12.png",
            "clipPath": {
                "offsets" :  [17,25,10,25]
            }
        },
        {
            "id": "frame-13",
            "deco": "Frame-13.png",
            "clipPath": {
                "offsets" :  [16,25,16,25]
            }
        },
        {
            "id": "frame-14",
            "deco": "Frame-14.png",
            "clipPath": {
                "points": [22,16,77,13,77,13,79,83,79,83,23,86,23,86]
            }
        },
        {
            "id": "frame-15",
            "deco": "Frame-15.png",
            "clipPath": {
                "offsets" :  [11, 6, 7, 6],
                "radius": 50
            }
        },
        {
            "id": "frame-16",
            "deco": "Frame-16.png",
            "clipPath": {
                "offsets" :  [18,15,18,15],
                "radius": 50
            }
        },
        {
            "id": "frame-17",
            "deco": "Frame-17.png",
            "clipPath": {
                "offsets" :  25
            }
        },
        {
            "id": "frame-18",
            "deco": "Frame-18.png",
            "clipPath": {
                "points": [50,15,85,50,50,85,15,50]
            }
        },
        {
            "id": "frame-19",
            "deco": "Frame-19.png",
            "clipPath": {
                "points": [49,28,59,21,68,19,83,23,90,30,93,39,91,50,84,62,74,73,59,84,50,90,21,69,7,50,7,38,10,28,22,21,39,20,47,25,50,29]
            }
        },
        {
            "id": "frame-20",
            "deco": "Frame-20.png",
            "clipPath": {
                "offsets" :  13,
                "radius": 50
            }
        },
        {
            "id": "frame-21",
            "deco": "Frame-21.png",
            "clipPath": {
                "offsets" :  18,
                "radius": 50
            }
        },
        {
            "id": "frame-22",
            "deco": "Frame-22.png",
            "clipPath": {
                "offsets" :  11,
                "radius": 50
            }
        },
        {
            "id": "frame-2",
            "deco": "Frame-2.png",
            "clipPath": {
                "offsets" :  10
            }
        },
        {
            "id": "frame-3",
            "deco": "Frame-3.png",
            "clipPath": {
                "offsets" :  [35,15,15,15]
            }
        },
        {
            "id": "frame-4",
            "deco": "Frame-4.png",
            "clipPath": {
                "offsets" :  [9,17,9,17]
            }
        },
        {
            "id": "frame-5",
            "deco": "Frame-5.png",
            "clipPath": {
                "points": [18,29,75,22,84,82,24,88]
            }
        },
        {
            "id": "frame-6",
            "deco": "Frame-6.png",
            "clipPath": {
                "offsets" :  [19,25,16,25]
            }
        },
        {
            "id": "frame-7",
            "deco": "Frame-7.png",
            "clipPath": {
                "points": [80,31,80,78,24,77,18,28]
            }
        },
        {
            "id": "frame-8",
            "deco": "Frame-8.png",
            "clipPath": {
                "points": [9,31,70,9,92,69,29,90]
            }
        },
        {
            "id": "frame-9",
            "deco": "Frame-9.png",
            "clipPath": {
                "points": [20,26,77,18,85,73,29,81]
            }
        },
        {
            "id": "polaroid-1",
            "deco": "Polaroid-1.png",
            "clipPath": {
                "offsets": 20
            }
        },
        {
            "id": "polaroid-2",
            "deco": "Polaroid-2.png",
            "clipPath": {
                "points": [22,20,84,30,77,86,14,77]
            }
        },
        {
            "id": "polaroid-3",
            "deco": "Polaroid-3.png",
            "clipPath": {
                "points": [14,31,73,16,88,76,28,89]
            }
        },
        {
            "id": "polaroid-4",
            "deco": "Polaroid-4.png",
            "clipPath": {
                "points": [20,17,86,25,79,85,12,77]
            }
        },
        {
            "id": "polaroid-5",
            "deco": "Polaroid-5.png",
            "clipPath": {
                "points": [21,18,87,22,83,86,17,83]
            }
        },
        {
            "id": "polaroid-6",
            "deco": "Polaroid-6.png",
            "clipPath": {
                "points": [31,14,88,34,69,91,11,71]
            }
        },
        {
            "id": "polaroid-7",
            "deco": "Polaroid-7.png",
            "clipPath": {
                "points": [13,31,71,14,90,72,31,90]
            }
        }
    ],
    plugins: [
        Frames, Deco, Barcode,BackgroundOverlayImages,
        Grid, Placeholders, Animation,
        ImageCrop, Fonts, Undo, Zoom,
        Areas,
        Snap,
        TextEasyEdit,
        TextboxTweaks,
        ClipPath,
        Controls,
        Debug
    ],
    toolbars: {
        Editor: []
    },
    prototypes: {
        "StaticCanvas": {
            "width": 642,
            "height": 889,
            "backgroundColor": "#FFFFFF",
            "backgroundPosition": "fill",
            "overlayPosition": "fill"
        },
        "Canvas": {
            "width": 642,
            "height": 889
        },
        "Object": {},
        "Line": {
            "strokeWidth": 1,
            "stroke": "black"
        },
        "Image": {
            "layer": "objects",
            fitting: "cover",
            eventListeners: {
                mousedblclick: "cropPhotoStart"
            }
        },
        "BackgroundImage": {
            "width": 500,
            "height": 661,
            "fitting": "fill",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/backgrounds/"
        },
        "OverlayImage": {
            "width": 500,
            "height": 661,
            "fitting": "fill",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/overlays/"
        },
        "Emoji": {
            "prototype": "Image",
            "layer": "overlayObjects",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/emoji/"
        },
        "Clipart": {
            "prototype": "Image",
            "layer": "overlayObjects",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/objects/"
        },
        "Photo": {
            "units": "percents",
            "prototype": "Image",
            "fitting": "cover",
            "sourceRoot": "photos/"
        },
        "ImageBorder": {
            "sourceRoot": "frames/",
            "units": "mixed"
        },
        "Textbox": {
            "emojisPath": "emoji-thumbnails/*.png",
            "layer": "overlayObjects",
            "fixedWidth": true,
            "width": 300,
            "borderColor": "#3DAFF6",
            "fontFamily": "Open Sans",
            "fontSize": 24,
            "textAlign": "center"
        },
        "StaticTextbox": {
            "prototype": "Textbox",
            "emojisPath": "emoji-thumbnails/*.png",
            "textVerticalAlign": "middle",
            "autoHeight": false,
            "text": ""
        }
    },
    slides: [
        {
            "objects": [
                {
                    "src": "g2.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0,
                        "scaleX": 1.1055666555611103,
                        "scaleY": 1.1055666555611103
                    },
                    "top": 322.48421865555446,
                    "left": 26.000001464843677,
                    "width": 273.8677511769621,
                    "height": 295.0171470390467,
                    "type": "photo",
                    "frame": "frame-15"
                },
                {
                    "src": "g3.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0,
                        "scaleX": 1.1055666555611103,
                        "scaleY": 1.1055666555611103
                    },
                    "top": 367.48005878119471,
                    "left": 394.99999176025446,
                    "width": 273.8677511769621,
                    "height": 295.0171470390467,
                    "type": "photo",
                    "frame": "frame-11"
                },
                {
                    "src": "g4.jpg",
                    "crop": {"top": 0, "left": 0},
                    "top": 197,
                    "left": 50,
                    "width": 400,
                    "height": 267,
                    "type": "photo",
                    "frame": "frame-13"
                },
                {
                    id: "masked1",
                    type: "image",
                    top: 110, left: 710, width: 180,height: 180,
                    src: "backgrounds/abstract/BG178.jpg",
                    stroke: "red",
                    strokeDashArray: [5, 5, 2, 5],
                    strokeWidth: 2,
                    filters: [{
                        mode: "average",
                        type: "Grayscale"
                    }],
                    opacity: 0.75,
                    shadow: {
                        blur: 10,
                        id: 4,
                        offsetX: 3,
                        offsetY: 3
                    }

                },
                {
                    id: "masked2",
                    top: 310, left: 710, width: 180,height: 180,
                    type: "image",
                    src: "backgrounds/abstract/BG178.jpg",
                    clipPath: {src: 'svg-graphics/Tribal/fox.svg'}
                },
                {
                    id: "masked3",
                    type: "image",
                    top: 510, left: 710, width: 180,height: 180,
                    src: "backgrounds/watercolor/BG198.jpg",
                    clipPath: {type: "circle",radius: 50}
                },
                {
                    id: "maskedText",
                    type: "image",
                    top: 200, left: 50, width: 500,height: 100,
                    clipPath: {type: "text", text: 'Text As Mask', top: 100, left: 50, fontSize: 100, fontWeight: "bold", fontFamily: "Tahoma"}
                },
                {
                    id: 'textPattern',
                    top: 300, left: 50, type: 'text', text: 'Text Filled With Pattern',
                    fontSize: 90, scaleX: 0.46,
                    fontWeight: "bold", fontFamily: "Tahoma",
                    fill: {
                        crossOrigin: "",
                        offsetX: 0,
                        offsetY: 0,
                        patternTransform: null,
                        repeat: "repeat",
                        source: "backgrounds/watercolor/BG198.jpg",
                        type: "pattern"
                    }
                },
                {
                    id: "textClipPath",
                    top: 400, left: 50, type: 'text', text: 'Text As Clip Path', absolutePositioned: true, fontSize: 90, scaleX: 0.65, fontWeight: "bold", fontFamily: "Tahoma"
                },
                // {
                //     id: "coverImage",
                //     type: "image",
                //     src: "backgrounds/abstract/BG178.jpg",
                //     top: 300, left: 0, width: 800,height: 600, clipPath: "#textClipPath", evented: false, selectable:false
                // }
            ],
            "width": 500,
            "height": 661
        }
    ]
})