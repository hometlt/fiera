
import '../../src/fiera.core.js'
import {canvasToBlobPromise} from "../../util/canvasToBlob.js";
import {createTools} from "./tools.js";
import "./console-debug.js";





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



export const App = {
    create (options){
        if(options.prototypes.Canvas.stretchable){

            options.prototypes.Canvas = Object.assign({
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
            },options.prototypes.Canvas)
        }

        fabric.initialize({
            plugins: options.plugins,
            libRoot: "./../../lib/",
            mediaRoot: "./../../../media/",
            fontsRoot: "./../../../ fonts/",
            // mediaRoot: "http://cdn.hometlt.ru/",
            // fontsRoot: "http://cdn.hometlt.ru/fonts/",
            inlineSVG: true
        })

        window.editor = App.editor = new fabric.Editor({
            uiFonts: [
                "Font Awesome"
            ],
            debug: true,
            canvasContainer: "canvas",
            history: true,
            prototypes: options.prototypes,
            // slide: tiled,
            slide: options.slide,
            eventListeners: {
                'slide:changed': ({selected})=> {
                    window.canvas = App.canvas = selected
                },
                'target:changed': ({selected})=> {
                    window.target = App.target = selected
                }
            }
        })

        this.elements = options.elements;

        if(options.tools){
            createTools({
                container: "tools",
                tools: options.tools
            })
        }
    },
    createArea(id,label, elements, downloadURL){
        if(!App.areas){
            App.areas = {}
        }
        let area = App.areas[id]
        if(!area){
            area = App.areas[id] = document.createElement("div")
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
                delete App.areas[id]
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
    },
    targetChangeObserver: cb => editor.on('target:changed', cb),
    clearCanvas: () => {
        editor.canvas.clear()
    },
    elementsList: () => {
        return Object.entries(App.elements).map(([key,value]) => ({value: key, label: key}))
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
        App.createArea("svg-area", "SVG", svgElement, url)
    },
    renderPDF: async () => {
        let doc = await editor.makeDocument();
        let blob = await doc.toBlob()
        let url = URL.createObjectURL(blob);
        let elements = await editor.renderPDF(url);
        App.createArea("pdf-area", "PDFkit / PDFjs",elements, url)
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
        App.createArea("png-area", "PNG Image",image, url)
    },
    icons: {
        halfDrop: "M10,19v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C10.4,20,10,19.6,10,19zM10,13v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C10.4,14,10,13.6,10,13zM10,7V5c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C10.4,8,10,7.6,10,7zM2.3,16v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C2.7,17,2.3,16.6,2.3,16zM2.3,10V8c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C2.7,11,2.3,10.6,2.3,10zM17.7,16v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C18.1,17,17.7,16.6,17.7,16zM17.7,10V8c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2 C18.1,11,17.7,10.6,17.7,10z",
        halfBrick: "M5,16h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2C4,16.4,4.4,16,5,16zM8,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H8c-0.6,0-1-0.4-1-1v-2   C7,10.4,7.4,10,8,10zM11,16h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2   C10,16.4,10.4,16,11,16zM14,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2   C13,10.4,13.4,10,14,10zM5,4h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5C4.4,8,4,7.6,4,7V5C4,4.4,4.4,4,5,4zM17,16h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2   C16,16.4,16.4,16,17,16zM11,4h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V5  C10,4.4,10.4,4,11,4zM17,4h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V5  C16,4.4,16.4,4,17,4z",
        basic: "M5,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2 C4,10.4,4.4,10,5,10zM11,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C10,10.4,10.4,10,11,10zM17,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C16,10.4,16.4,10,17,10zM5,2.3h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2  C4,2.7,4.4,2.3,5,2.3zM11,2.3h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C10,2.7,10.4,2.3,11,2.3zM17,2.3h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C16,2.7,16.4,2.3,17,2.3zM5,17.7h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1v-2  C4,18.1,4.4,17.7,5,17.7zM11,17.7h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C10,18.1,10.4,17.7,11,17.7zM17,17.7h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2  C16,18.1,16.4,17.7,17,17.7z",
        none: "M11,10h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2 C10,10.4,10.4,10,11,10z"
    }
}
