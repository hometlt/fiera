
import fabric from './../../src/fabric.core.js'
const canvas = window.canvas = new fabric.Canvas('canvas')
canvas.setDimensions({width: document.body.clientWidth, height: document.body.clientHeight})


fabric.Image.fromURL('./../media/svg/windows.svg', function (image) {
	canvas.add(image).renderAll();
});
fabric.loadSVGFromURL('./../media/svg/windows.svg', function(objects, options) {
	var obj = fabric.util.groupSVGElements(objects, options);
	canvas.add(obj).renderAll();
});

if(false) {

// import {TestApp} from'../test-utils.js';
// import ObjectRender from "./../../src/modules/object.render.js";

new TestApp({
		plugins: [ObjectRender, "image-crop", "object-wheel-scale"],
		prototypes: {
			Image: {
				fitting: "cover",
				eventListeners: {
					mousedblclick: "cropPhotoStart"
				}
			},
			Crop: {
				mouseWheelScale: true
			}
		},
		objects: {
			originCenterText: {
				text: "OriginCenter",
				top: 100,
				left: 100,
				originX: 'center',
				originY: 'center',
				type: 'text',
				fontSize: 100
			},
			text: {
				text: 'normal text',
				id: 'text-flipped-y',
				flipY: true,
				top: 300,
				left: 100,
				type: 'text',
				fontSize: 100
			},
			// fabric.loadSVGFromURL('./../src/media/wanted.svg', function(objects, options) {
			// 	var obj = fabric.util.groupSVGElements(objects, {
			// 		left: 50,
			// 		top: 1000,
			// 		width: options.width,
			// 		height: options.height
			// 	});
			// 	canvas.add(obj).renderAll();
			// });
			imageWanted: {
				top: 100,
				left: 500,
				width: 200,
				height: 200,
				type: "image",
				src: "./../src/media/wanted.svg"
			},
			clipartWindows: {
				top: 100,
				left: 500,
				width: 200,
				height: 200,
				type: "clipart",
				id: "clipartWindows",
				src: "svg/windows.svg"
			},
			imageWindows: {
				top: 100,
				left: 300,
				width: 200,
				height: 200,
				type: "image",
				src: "svg/windows.svg"
			},
			imageMan: {
				type: "image",
				src: "photos/m1.jpg",
				// clipPath: {
				// 	src: "svg/windows.svg"
				// },
				top: 100,
				left: 100,
				width: 200,
				height: 200
			},
			imageManClippedCircle: {
				type: "image",
				src: "photos/m1.jpg",
				// src: "./checkered-img-designer.svg",
				clipPath: {
					radius: 0.5
				},
				top: 300,
				left: 100,
				width: 200,
				height: 200
			},
			imageManClippedWindows: {
				type: "image",
				src: "photos/m1.jpg",
				clipPath: {
					src: "svg/windows.svg"
				},
				top: 500,
				left: 100,
				width: 200,
				height: 200
			},
			imageManClippedLion: {
				type: "image",
				src: "photos/m1.jpg",
				clipPath: {
					type: "image",
					src: "cliparts/blue-lion-open-mouth.png"
				},
				top: 700,
				left: 100,
				width: 200,
				height: 200
			},
			group: {
				type: 'group',
				objects: [
					{
						type: 'circle',
						radius: 100,
						fill: '#eef',
						scaleY: 0.5,
						originX: 'center',
						originY: 'center'
					},
					{
						type: 'text',
						text: 'hello world',
						fontSize: 30,
						originX: 'center',
						originY: 'center'
					}
				],
				left: 400,
				top: 400,
				angle: -10
			}
		},
		slide: {
			// clipPath: {type: "image",src: "tribal/PNG/Bear1.png", width: 800, height: 800},
			objects: [
				// "group","originCenterText","text","imageWindows","imageMan",
				// "clipartWindows",
				// "clipartWindows",
				// "imageWindows",
				// "imageManClippedCircle",
				// "imageManClippedWindows","imageWanted"
			]
		}
	})
		.then(app => {

			async function createGroupFromSvgFile(path) {
				// let {objects, options} = await fabric.util.loadSvg(path)
				fabric.loadSVGFromURL(path, function (objects, options) {
					var obj = fabric.util.groupSVGElements(objects, options);
					app.editor.canvas.add(obj).renderAll();
				});
			}

			fabric.loadSVGFromURL('./../media/svg/windows.svg', function (objects, options) {
				var obj = fabric.util.groupSVGElements(objects, options);
				app.editor.canvas.add(obj).renderAll();
			});
		})

}

