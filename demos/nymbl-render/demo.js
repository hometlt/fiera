import {App} from "../lib/app.js"
import {
    FmTransformations,
    FmStretchable,
    FmSnap,
    FmZoom,
    FmRulers,
    FmUndo,
    FmTiles,
    FmWarp,
    FmOuterCanvas,
    FmSourceCanvas,
    FmFonts,
    FmGoogleFonts,
    FmCLipPath,
    FmCrop,
    FmObjectRender,
    FmTextEasyEdit,
    FmPdfkit,
    FmTemplates,
    FmBufferRendering
} from "../../src/modules.js";

// import tiled from "./data/tiled.js";
// import design from "./data/design.js";
// import template from "./data/template.js";

App.create({
    plugins: [
        FmStretchable,
        FmZoom,
        FmRulers,
        FmUndo,
        FmTiles,
        FmWarp,
        FmOuterCanvas,
        FmSourceCanvas,
        FmTextEasyEdit,
        FmFonts,
        FmGoogleFonts,
        FmCLipPath,
        FmCrop,
        FmSnap,
        FmObjectRender,
        FmPdfkit,
        FmTemplates,
        FmTransformations,
        FmBufferRendering
    ],
    elements: {
        warp: {
            subdivisions: 51,
            webgl: true,
            strokeWidth: 0,
            "type": "warp",
            "sourceCanvas": {
                "objects": [{
                    "type": "photo-image",
                    src: "metup.png",
                    "top": 0,
                    "left": 0,
                    "width": 500,
                    "height": 500
                }, {
                    "type": "i-text",
                    "top": 0,
                    "left": 0,
                    "fontFamily": "Bungee Shade",
                    "fontSize": 128,
                    "text": "Add Text Here"
                }],
                "width": 500,
                "height": 500
            },
            "top": 0,
            "left": 0,
            "width": 500,
            "height": 500,
            "points": [{"x": 0, "y": 0}, {"x": 500, "y": 0}, {"x": 500, "y": 500}, {"x": 0, "y": 500}],
            "transformations": [
                [{"x": 245, "y": 146, "t": 0.48, "c": 0}],
                [{"x": 428, "y": 242, "t": 0.5, "c": 1}],
                [{"x": 243, "y": 373, "t": 0.472, "c": 0}],
                [{"x": 68, "y": 254, "t": 0.504, "c": 1}]]
        },
        shirt: {
            src: "products/shirt.png",
            type: "image",
            width: 667,
            height: 1000
        },
        shirtInner: {
            src: "products/SHIRT_INNER.png",
            globalCompositeOperation: "multiply",
            filters: [{
                type: "BlendColor",
                mode: 'overlay',
                color: "#ffffff"
            }],
            type: "image",
            width: 667,
            height: 1000
        },
        shirtOuter: {
            src: "products/SHIRT_OUTER.png",
            globalCompositeOperation: "multiply",
            filters: [{
                type: "BlendColor",
                mode: 'overlay',
                color: "#d40029"
            }],
            type: "image",
            width: 667,
            height: 1000
        },
        metup: {
            src: "metup.png",
            type: "photo-image",
            width: 500,
            height: 750
        },
        birthday: {
            scaleX: 0.2,
            scaleY: 0.2,
            src: "textures/birthday2.png",
            type: "image",
            width: 500,
            height: 500
        },
        transparentRect: {
            type: "rect",
            width: 180,
            height: 180,
            top: 200,
            originX: "center",
            originY: "center",
            fill: "transparent",
            stroke: "black"
        },
        blackRect: {
            type: "rect",
            left: 100,
            width: 100,
            height: 100,
            top: 100,
            fill: "black"
        },
        template: {
            contentOrigin: "center",
            type: "template",
            clipPath: true,
            left: 0,
            top: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            // puzzleSpacingX: 50,
            // puzzleSpacingY: 50,
            // puzzlePreset: "half-drop",
            width: 1000,
            height: 500,
            objects: [
                {
                    type: "rect",
                    evented: false,
                    left: -500,
                    top: -250,
                    fill: "transparent",
                    width: 1000,
                    height: 500,
                    strokeWidth: 1,
                    stroke: "red"
                },
                {
                    type: "rect",
                    left: 0,
                    width: 250,
                    height: 250,
                    angle: 4,
                    top: 0,
                    fill: "transparent",
                    stroke: "black"
                },
                // {
                //     scaleX: 0.5,
                //     scaleY: 0.5,
                //     angle: 4,
                //     src: "photos/metup.png",
                //     type: "image",
                //     left: -500,
                //     top: -250,
                //     width: 500,
                //     height: 500
                // },
                {
                    type: "template-i-text",
                    hasControls: true,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: false,
                    lockScalingY: false,
                    lockRotation: false,
                    clipPath: true,
                    originX: "center",
                    left: 100,
                    top: -16.9,
                    width: 291.19,
                    height: 175.03,
                    fill: "#fa1e44",
                    stroke: "white",
                    strokeWidth: 10,
                    strokeLineCap: "round",
                    strokeLineJoin: "round",
                    paintFirst: "stroke",
                    text: "Son!",
                    fontSize: 150,
                },
                {
                    type: "template-i-text",
                    hasControls: true,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: false,
                    lockScalingY: false,
                    lockRotation: false,
                    originX: "center",
                    left: 259.42,
                    top: -16.9,
                    width: 291.19,
                    height: 175.03,
                    fill: "#fa1e44",
                    stroke: "white",
                    strokeWidth: 10,
                    strokeLineCap: "round",
                    strokeLineJoin: "round",
                    angle: 11.22,
                    paintFirst: "stroke",
                    text: "Son!",
                    fontSize: 150,
                }
            ]
        },
    },
    prototypes: {
        Template: {
            clipPath: true
        },
        Canvas: {
            minDpi: 200,
            preserveObjectStackingSelection: true,
            outerCanvasOpacity: 0,
            containerClass: "canvas-container bg-white shadow",
            minZoom: 1,
            stretchable: true,
            stretchingOptions: {
                action: "zoom",
                margin: 40
            },
            snappingToArea: true,
            snappingToObjects: true,
            snappingToGrid: false,
            snapping: true,
            backgroundColor: "transparent",
            handModeEnabled: false,
            interactiveMode: 'mixed',
        },
        MockupImage: {
            evented: false,
            selectable: false,
            stored: false,
            prototype: "image",
            // thumbnailSourceRoot: "media-thumbnails/",
            sourceRoot: "products/",
        },
        Object: {
            strokeWidth: 0,
            roundCoordinates: true,
            eventListeners: {
                "rotated" () {this.canvas.setTooltip(false)},
                "rotating" () {this.canvas.setTooltip(Math.round(this.angle) + "°")}
            },
            cornerStyle: "canva",
            cornerShadow: {color: "#000000", blur: 3, offsetX: 0, offsetY: 0},
            resizableEdge: true,
            snapAngle: 45,
            snapThreshold: 5,
            cornerColor: "#fff",
            minDpi: 200,
            dpiWarningClass: null,
            mouseWheelScale: true,
            borderColor: '#00d9e1',
            rotationPointBorder: false,
            rotatingPointOffset: 30,
            activeOptions: {
                inactiveBorder: true
            },
            inactiveOptions: {
                inactiveBorder: false
            },
            activeHoverOptions: {
                inactiveBorder: true
            },
            inactiveHoverOptions: {
                inactiveBorder: true
            }
        },
        ActiveSelection: {
            borderDashArray: [5,5]
        },
        Image: {
            resizable: true,
            fitting: "cover",
            clipPathFitting: "fit",
            // thumbnailSourceRoot: fabric.mediaRoot + "media-thumbnails/",
        },
        PhotoImage: {
            sourceRoot: fabric.mediaRoot + "photos/"
        },
        IText: {
            lockOnEdit: false,
            lockScalingFlip: true,
            // fontFamily: "Leckerli One"
        },
        Warp: {

            eventListeners: {
                "mousedblclick": "switchEditMode"
            },
            // perPixelTargetFind: false,
            // locked: false,
            // hasRotatingPoint: true,
            // hasBoundControls: true,
            // hasTransformControls: false,
            hasBorders: true,
            hasShapeBorders: true,
            subdivisions: 40,
            sticker: false,
            stickerOptions: {
                fill: "white",
                strokeWidth: 0,
                shadow: {"offsetX": 0, "offsetY": 0, "blur": 3, "color": "rgba(0,0,0,0.80)"}
            }
        }
    },
    slide: {
        minZoom: 0.1,
        objects: []
    },
    tools: [
        {
            caption: 'Text Align',
            type: 'options',
            change: (value) => App.target.setTextAlign(value),
            value: () => App.target?.textAlign,
            enabled: () => App.target?.isText,
            options: [
                {value: "left", class: "fa fa-align-left"},
                {value: "center", class: "fa fa-align-center"},
                {value: "right", class: "fa fa-align-right"},
                {value: "justify", class: "fa fa-align-justify"}
            ],
            observe: App.targetChangeObserver
        },
        {
            caption: 'Tiles',
            type: 'options',
            change: (value) => App.target.setPuzzlePreset(value),
            value: () => App.target?.puzzlePreset || "none",
            enabled: () => App.target,
            observe: App.targetChangeObserver,
            options: [
                {value: "halfDrop", svg: App.icons.halfDrop},
                {value: "halfBrick", svg: App.icons.halfBrick},
                {value: "basic", svg: App.icons.basic},
                {value: "none", svg: App.icons.none}
            ]
        },
        {
            caption: 'Elements',
            type: 'group',
            tools: [
                {
                    type: 'dropdown',
                    placeholder: "Add Element",
                    options: App.elementsList,
                    change: App.createObject
                },
                {
                    label: 'Clear',
                    type: 'button',
                    click: App.clearCanvas
                }
            ]
        },
        {
            caption: 'Render',
            type: 'group',
            tools: [
                {
                    label: 'SVG',
                    type: 'button',
                    click: App.renderSVG
                },
                {
                    label: 'PDF',
                    type: 'button',
                    click: App.renderPDF
                },
                {
                    label: 'PNG',
                    type: 'button',
                    click: App.renderPNG
                }
            ]
        }
    ]
})
