import '../../src/fiera.core.js'
import {FmStretchable} from "../../src/canvas/stretchable.js";
import {FmZoom} from "../../src/modules/zoom.js";
import {FmRulers} from "../../src/modules/ruler.js";
import {FmUndo} from "../../src/modules/undo.js";
import {FmFonts} from "../../src/fonts/fonts.js";

fabric.initialize({
	plugins: [ FmStretchable, FmZoom, FmRulers, FmUndo, FmFonts],
	libRoot: "../../lib/",
	mediaRoot: "./../../../fiera-media/",
	fontsRoot: "../../fiera-media/fonts/",
	inlineSVG: true
})

export class App {
	constructor(options){
		this.demo = location.search.slice(1)

		options = Object.assign({
			debug: true,
			canvasContainer: "canvas",
			history: true
		}, options )

		if(!options.toolbars){
			options.toolbars = {
				Object: ['remove']
			}
		}
		if(!options.prototypes) {
			options.prototypes = {}
		}

		if(!options.prototypes.Canvas) {
			options.prototypes.Canvas = {}
		}

		if(options.plugins){
			fabric.installPlugins(options.plugins)
			delete options.plugins
		}

		if(options.preload){
			options.preload.call(this,options)
		}

		options.prototypes.Canvas = Object.assign({}, StretchableCanvasMixin, options.prototypes.Canvas)

		return new Promise(async (resolve,reject)=>{
			await this.initialize(options)
			await this.editor.promise
			resolve(this)
		})
	}
	async resolvePromises(options) {
		for(let i in options){
			if(options[i] && options[i].constructor === Promise){
				let response = await options[i]
				options[i] = await response.json()
			}
		}
	}
	updateDocument(options){
		document.title = options.title
	}
	async initialize(options){
		this.updateDocument(options)
		await this.resolvePromises(options)
		this.createCanvas()
		// this.createTestToolbar()
		// let toolbarsOptions = options.toolbars
		// delete options.toolbars

		this.editor = new fabric.Editor(options)

		// if(toolbarsOptions.Canvas) {
		// 	this.createToolbar('canvas', toolbarsOptions.Canvas || [
		// 		'backgroundColor',
		// 		{
		// 			className: "fa fa-print",
		// 			async action(canvas) {
		// 				let thumbnail = canvas.getThumbnail({zoom: 1})
		// 				let blob = await canvasToBlob(thumbnail, "png", {
		// 					dpi: 300,
		// 					meta: {
		// 						Title: "title",
		// 						Author: "Nymbl",
		// 						Description: "",
		// 						Copyright: "Nymbl ©" + new Date().getFullYear(),
		// 						Software: "Fiera.js",
		// 						Comment: ""
		// 					}
		// 				})
		// 				saveAs(blob, "title")
		// 			}
		// 		}
		// 	])
		// }
		// delete toolbarsOptions.Canvas
		//
		// // if(toolbarsOptions.Editor){
		// 	this.createToolbar( 'editor',  toolbarsOptions.Editor ||  ['undo', 'redo','zoomOut','zoom','zoomIn'])
		// }
		// delete toolbarsOptions.Editor
		//
		// this.createToolbar( 'objects',  toolbarsOptions )
	}
	createCanvas(){
		let canvasElement = document.createElement("canvas")
		canvasElement.id = "canvas"
		let canvasContent = document.createTextNode("Canvas is not supported!")
		canvasElement.appendChild(canvasContent)
		document.body.append(canvasElement)
	}
	// createTestToolbar(){
	// 	let toolbarTestDiv = document.createElement("div")
	// 	toolbarTestDiv.className = "toolbar-menu"
	// 	toolbarTestDiv.id = 'toolbar-test'
	// 	document.body.append(toolbarTestDiv)
	// 	// new FieraToolbar({
	// 	// 	target: this,
	// 	// 	container: toolbarTestDiv,
	// 	// 	tools: [
	// 	// 		{
	// 	// 			type: "select",
	// 	// 			className: "fas fa-ellipsis-h",
	// 	// 			set(app, value) {
	// 	// 				return location.search = value
	// 	// 			},
	// 	// 			get(app) {
	// 	// 				return app.demo
	// 	// 			},
	// 	// 			options: ["flip", "puzzle", "sticker", "templates", "warp"].map(item => ({id: item, title: item}))
	// 	// 		}
	// 	// 	]
	// 	// })
	// }
	// createToolbar(target, tools){
	// 	let toolbarEditorDiv = document.createElement("div")
	// 	toolbarEditorDiv.className = "toolbar-menu"
	// 	toolbarEditorDiv.id = 'toolbar-' + target
	// 	document.body.append(toolbarEditorDiv)
	// 	fabric.util.createToolbar({
	// 		target: target,
	// 		tools: tools,
	// 		editor: this.editor,
	// 		container: toolbarEditorDiv.id
	// 	})
	// }
}
window.App = App

export const AnimatedCanvasMixin = {
	animated: true
}

export const StretchableCanvasMixin = {
	backgroundColor: "transparent",
	zoomStep: 0.05,
	zoomCtrlKey: true,
	freeHandModeEnabled: false,
	handModeEnabled: true,
	changeDimensionOnZoom: false,
	autoCenterAndZoomOut: true,
	stretchable: true,
	interactiveMode: 'mixed',
	mouseWheelZoom: true,
	rulers: {
		vertical: {color: "white"},
		horizontal: {color: "white"}
	},
	eventListeners: {
		'viewport:translate': function ({x, y}) {
			let bgx = -2 + x + 'px', smx = -1 + x + 'px', bgy = -2 + y + 'px', smy = -1 + y + 'px'
			document.body.style.backgroundPosition = `${bgx} ${bgy}, ${bgx} ${bgy}, ${smx} ${smy}, ${smx} ${smy}`
		},
		'viewport:scaled': function ({scale}) {
			let bg = 100 * scale + 'px', sm = 20 * scale + 'px'
			document.body.style.backgroundSize = `${bg} ${bg}, ${bg} ${bg}, ${sm} ${sm}, ${sm} ${sm}`
		},
		'dimensions:modified': function (a, b) {

		}
	}
}