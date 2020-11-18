import '../../src/fiera.core.js'
import {createTools} from "../../lib/tools.js";
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

import {canvasToBlobPromise} from "../../util/canvasToBlob.js";
// import tiled from "./data/tiled.js";
// import design from "./data/design.js";
// import template from "./data/template.js";

fabric.initialize({
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
    libRoot: "../../lib/",
    mediaRoot: "./../fiera-media/",
    fontsRoot: "./../fiera-media/fonts/",
    inlineSVG: true
})

const StretchableCanvasMixin = {
    outerCanvasContainer: "fiera-area",
    outerCanvasOpacity: 0.1,
    backgroundColor: "transparent",
    zoomStep: 0.05,
    zoomCtrlKey: true,
    freeHandModeEnabled: false,
    handModeEnabled: true,
    changeDimensionOnZoom: false,
    autoCenterAndZoomOut: true,
    stretchable: true,
    stretchingOptions: {
        action: "resize",
        margin: 40
    },
    interactiveMode: 'mixed',
    mouseWheelZoom: true,
    rulers: {
        vertical: {color: "#004374"},
        horizontal: {color: "#004374"}
    },
    eventListeners: {
        'viewport:translate': function ({x, y}) {
            let bgx = -2 + x + 'px', smx = -1 + x + 'px', bgy = -2 + y + 'px', smy = -1 + y + 'px'
            editor.canvas.wrapperEl.style.backgroundPosition = `${bgx} ${bgy}, ${bgx} ${bgy}, ${smx} ${smy}, ${smx} ${smy}`
        },
        'viewport:scaled': function ({scale}) {
            let bg = 100 * scale + 'px', sm = 20 * scale + 'px'
            editor.canvas.wrapperEl.style.backgroundSize = `${bg} ${bg}, ${bg} ${bg}, ${sm} ${sm}, ${sm} ${sm}`
        },
        'dimensions:modified': function (a, b) {

        }
    }
}

window.editor = new fabric.Editor( {
    uiFonts: [
        "Font Awesome"
    ],
    debug: true,
    canvasContainer: "canvas",
    history: true,
    prototypes: {

        Template: {
            clipPath: true
        },
        Canvas: Object.assign({}, StretchableCanvasMixin,{
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
        }),
        MockupImage: {
            evented: false,
            selectable: false,
            stored: false,
            prototype: "image",
            // thumbnailSourceRoot: "media-thumbnails/",
            sourceRoot: "products/",
        },
        Object: {
            wholeCoordinates: true,
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
            subdivisions: 40,
            strokeWidth: 0,
            sticker: false,
            stickerOptions: {
                fill: "white",
                strokeWidth: 0,
                shadow: {"offsetX": 0, "offsetY": 0, "blur": 3, "color": "rgba(0,0,0,0.80)"}
            }
        }
    },
    // slide: tiled,
    slide: {
        minZoom: 0.1,
        // backgroundColor: "white",
        objects: [
        ]
    },
    eventListeners: {
        'slide:changed': ({selected})=> {
            window.canvas = selected
        },
        'target:changed': ({selected})=> {
            window.target = selected
        }
    }
} )


// function expotSVG(){
//     let svgText = editor.canvas.toSVG()
//     let tmp = document.createElement("div")
//     tmp.innerHTML = svgText;
//     return  tmp.children[0]
// }
// function expotSVGCanvas(svgElement){
//     let s = new XMLSerializer().serializeToString(svgElement)
//     let encodedData = 'data:image/svg+xml;base64,' + window.btoa(s);
//     let canvas = fabric.util.createCanvasElement()
//     canvas.width = editor.canvas.getOriginalWidth()
//     canvas.height = editor.canvas.getOriginalHeight()
//     let img=  new Image()
//     img.onload = function(){
//         console.log("loaded")
//         let ctx = canvas.getContext("2d")
//         ctx.drawImage( img,0,0,canvas.width,canvas.height)
//     }
//     img.src = encodedData
//     return canvas
// }

function createArea(id,label, elements, downloadURL){
    if(!window.DEMO_AREAS){
        window.DEMO_AREAS = {}
    }
    let area = DEMO_AREAS[id]
    if(!area){
        area = DEMO_AREAS[id] = document.createElement("div")
        area.id = id
        area.classList.add("export-area")
        document.getElementById("render-row").appendChild(area)

        let label1 = document.createElement("span")
        label1.classList.add("area-label")
        label1.innerText = label
        area.appendChild(label1)


        let hideBtn = document.createElement("div")
        hideBtn.classList.add("hide-btn")
        hideBtn.innerHTML = `<span class="fa fa-times"/>`
        hideBtn.onclick = () => {
            document.getElementById("render-row").removeChild(area)
            delete DEMO_AREAS[id]
        }
        area.appendChild(hideBtn)
    }
    else{
        while (area.children.length > 2) {
            area.removeChild(area.lastChild);
        }
    }

    if(elements.constructor ===Array){
        for(let element of elements){
            area.appendChild(element);
        }
    }
    else{
        area.appendChild(elements);
    }


    if(downloadURL){
        let download = document.createElement("a")
        download.href = downloadURL
        download.target = "_blank"
        download.className = "download-btn"
        download.innerHTML = `<span class="fa fa-download">`
        area.appendChild(download)
        // saveAs(this.pdfURL, this.title);
    }



    return area
}

const App = {
    elements: {
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
            fill: "transparent",
            stroke: "black"
        },
        blackRect: {
            type: "rect",
            left: 100,
            width: 100,
            height: 100,
            top: 100,
            originX: "center",
            originY: "center",
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
    targetChangeObserver: cb => editor.on('target:changed', cb),
    clearCanvas: () => {
        editor.canvas.clear()
    },
    createObject: (value) => {
        editor.canvas.createObject(App.elements[value])
    },
    renderSVG: () => {
        let svgText = editor.canvas.toSVG()
        let tmp = document.createElement("div")
        tmp.innerHTML = svgText;
        let svgElement = tmp.children[0]
        const blob = new Blob([svgText], {type: 'image/svg+xml'});
        let url = URL.createObjectURL(blob);
        createArea("svg-area", "SVG", svgElement, url)
    },
    renderPDF: async () => {
        let doc = await editor.makeDocument();
        let blob = await doc.toBlob()
        let url = URL.createObjectURL(blob);
        let elements = await editor.renderPDF(url);
        createArea("pdf-area", "PDFkit / PDFjs",elements, url)
    },
    renderPNG: async () => {
        let exportEditor = new fabric.Editor(Object.assign({
            static: true,
            doNotRender: true,
            plugins: [FmBufferRendering],
            prototypes: editor.prototypes
        },editor.getState()))
        await exportEditor.promise
        let exportCanvas = exportEditor.canvas.getThumbnail({zoom: 1});
        let blob = await canvasToBlobPromise(exportCanvas)
        let url = URL.createObjectURL(blob);
        let image = new Image()
        image.src = url
        createArea("png-area", "PNG Image",image, url)
    }
}

createTools({
    container: "tools",
    tools: [
        {
            caption: 'Text Align',
            type: 'options',
            change: (value) => editor.target.setTextAlign(value),
            value: () => editor.target?.textAlign,
            enabled: () => editor.target?.isText,
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
            change: (value) => editor.target.setPuzzlePreset(value),
            value: () => editor.target?.puzzlePreset || "none",
            enabled: () => editor.target,
            observe: App.targetChangeObserver,
            options: [
                {value: "halfDrop", svg: "M10,19v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C10.4,20,10,19.6,10,19zM10,13v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C10.4,14,10,13.6,10,13zM10,7V5c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C10.4,8,10,7.6,10,7zM2.3,16v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C2.7,17,2.3,16.6,2.3,16zM2.3,10V8c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C2.7,11,2.3,10.6,2.3,10zM17.7,16v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C18.1,17,17.7,16.6,17.7,16zM17.7,10V8c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C18.1,11,17.7,10.6,17.7,10z"},
                {value: "halfBrick", svg: "M5,16h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2C4,16.4,4.4,16,5,16zM8,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H8c-0.6,0-1-0.4-1-1v-2   C7,10.4,7.4,10,8,10zM11,16h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2   C10,16.4,10.4,16,11,16zM14,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2   C13,10.4,13.4,10,14,10zM5,4h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5C4.4,8,4,7.6,4,7V5C4,4.4,4.4,4,5,4zM17,16h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2   C16,16.4,16.4,16,17,16zM11,4h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V5  C10,4.4,10.4,4,11,4zM17,4h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V5  C16,4.4,16.4,4,17,4z"},
                {value: "basic", svg: "M5,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2 C4,10.4,4.4,10,5,10zM11,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C10,10.4,10.4,10,11,10zM17,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C16,10.4,16.4,10,17,10zM5,2.3h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2  C4,2.7,4.4,2.3,5,2.3zM11,2.3h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C10,2.7,10.4,2.3,11,2.3zM17,2.3h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C16,2.7,16.4,2.3,17,2.3zM5,17.7h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2  C4,18.1,4.4,17.7,5,17.7zM11,17.7h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C10,18.1,10.4,17.7,11,17.7zM17,17.7h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C16,18.1,16.4,17.7,17,17.7z"},
                {value: "none", svg: "M11,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2 C10,10.4,10.4,10,11,10z"}
            ]
        },
        {
            caption: 'Elements',
            type: 'group',
            tools: [
                {
                    type: 'dropdown',
                    value: () => '',
                    placeholder: "Add Element",
                    options: [
                        {value: "template", label: 'Template'},
                        {value: "transparentRect", label: 'Transparent Rect'},
                        {value: "blackRect", label: 'Black Rect'},
                        {value: "birthday", label: 'Birthday'},
                        {value: "metup", label: 'Metup'}
                    ],
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

