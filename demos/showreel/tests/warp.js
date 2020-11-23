
//ceate debug canvas
let debugCanvasElement = document.createElement("canvas");
debugCanvasElement.id = "debug-canvas"
debugCanvasElement.className = "absolute"
document.body.append(debugCanvasElement);
let textCtx = debugCanvasElement.getContext("2d");
textCtx.translate(-0.5,-0.5);
textCtx.imageSmoothingEnabled = false;


import {FmWarp} from "../../../src/shapes/warp.js";
import {FmSourceCanvas} from "../../../src/images/image.sourceCanvas.js";

new App({
	plugins: [FmWarp, FmSourceCanvas],
	prototypes: {
		Warp:{
			eventListeners: {
				"mousedblclick": "switchEditMode"
			},
			// perPixelTargetFind: false,
			// locked: false,
			// hasRotatingPoint: true,
			// hasBoundControls: true,
			// hasTransformControls: false,
			hasBorders: true,
			hasShapeBorders: true
		}
	},
	objects: {
		image: {
			top: 440,
			type: "image",
			src: "backgrounds/abstract/BG178.jpg",
			width: 300,
			height: 300,
			left: 20
		},
		nogl: {
			subdivisions: 41,
			webgl: false,
			strokeWidth: 0,
			"type": "warp",
			// "src": "./default.jpg",
			"sourceCanvas": {
				"objects": [{
					"type": "image",
					src: "./media/default.jpg",
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
			"top": 200,
			"left": 100,
			"width": 501,
			"height": 501,
			"points": [{"x": 0, "y": 0}, {"x": 500, "y": 0}, {"x": 500, "y": 500}, {"x": 0, "y": 500}],
			"transformations": [[{"x": 245, "y": 146, "t": 0.48, "c": 0}], [{
				"x": 428,
				"y": 242,
				"t": 0.5,
				"c": 1
			}], [{"x": 243, "y": 373, "t": 0.472, "c": 0}], [{"x": 68, "y": 254, "t": 0.504, "c": 1}]]
		},
		gl: {
			subdivisions: 51,
			webgl: true,
			strokeWidth: 0,
			"type": "warp",
			// "src": "./default.jpg",
			"sourceCanvas": {
				"objects": [{
					"type": "image",
					src: "./media/default.jpg",
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
			"top": 200,
			"left": 600,
			"width": 501,
			"height": 501,
			"points": [{"x": 0, "y": 0}, {"x": 500, "y": 0}, {"x": 500, "y": 500}, {"x": 0, "y": 500}],
			"transformations": [[{"x": 245, "y": 146, "t": 0.48, "c": 0}], [{
				"x": 428,
				"y": 242,
				"t": 0.5,
				"c": 1
			}], [{"x": 243, "y": 373, "t": 0.472, "c": 0}], [{"x": 68, "y": 254, "t": 0.504, "c": 1}]]
		},
		warp2: {
			strokeWidth: 0,
			type: "warp",
			src: "./ydh.png",
			left: 600,
			top: 200,
			scaleX: 0.5,
			scaleY: 0.5,
			width: 500,
			height: 500
		},
		warp4: {
			strokeWidth: 0,
			type: "warp",
			src: "./ydhw.png",
			left: 200,
			top: 600,
			scaleX: 0.5,
			scaleY: 0.5,
			width: 500,
			height: 500
		}
	},
	slide: {
		src: "backgrounds/abstract/BG178.jpg",
		backgroundPosition: "fill",
		objects: [
			// "image",
			// "nogl",
			"gl",
			// "warp2",
			// "warp4"
		]
	}
})
.then(app => {
	app.editor.canvas.drawingModeEnabled = true;
	// app.editor.canvas.setFreeDrawingBrush("points-brush")
	// app.editor.canvas.setFreeDrawingBrush("polygon-brush")
	app.editor.canvas.setInteractiveMode("mixed")
	app.editor.canvas.on("point:created",({points})=>{
		if(points.length === 4){

			points.forEach(point => point.removeFromCanvas())
			let warp = app.editor.canvas.createObject({
				type: "warp",
				points: points.map((item) => ({x: item.left, y: item.top}))
			})
			app.editor.canvas.setActiveObject(warp)

			app.editor.canvas.drawingModeEnabled = false;
			app.editor.canvas.requestRenderAll();
		}
	})
})
