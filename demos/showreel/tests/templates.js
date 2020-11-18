import {TestApp} from '../showreel.js'

import '../../src/modules/canvas/controls.js'
import './../../src/modules/upload.js'
import './../../src/fonts/fonts.js'

import {Snap, Sticker, Puzzle, ImageCrop , TextEasyEdit, WheelScale, Templates, ClipPath, Relative, ImageDpi} from '../../src/modules.js'

fabric.installPlugins([Snap, Sticker, Puzzle,ClipPath, ImageCrop , TextEasyEdit, WheelScale, Templates, Relative, ImageDpi])

new TestApp({
	fonts: [
		'Bungee',
		'Bungee Shade',
		'Caveat',
		'Creepster',
		'Eczar',
		'Ewert',
		'Fruktur',
		'Just Another Hand',
		'Leckerli One',
		'Lobster',
		'Lora',
		'Monoton',
		'Montserrat',
		'Oleo Script',
		'Pacifico',
		'Playfair Display',
		'Poppins',
		'Times New Roman'
	],
	templates: fetch('templates.json'),
	prototypes: {
		Object: {
			minDpi: 200,
		},
		Canvas: {
			snappingToArea: true,
			snappingToObjects: true,
			snappingToGrid: false,
			snapping: true,
		},
		Image: {
			eventListeners: {
				// mousedblclick: "cropPhotoStart"
			}
		},
		TemplatePhoto: {
			src: "photos/g2.jpg"
		},
		Crop: {
			mouseWheelScale: true
		}
	},
	slide: {
		objects: [
			{
				type: "image",
				src: "photos/metup500.png",
				top: 100,
				left: 100,
				width: 200,
				height: 200,
				scaleX: 1,
				scaleY: 1
			}
		]
	},
	dpi: 100,
	template: "none",
	toolbars: {
		Object: [
			"scale",
			"opacityMenu",
			"bringToFront",
			"sendToBack",
			"puzzle",
			"rotateLeft",
			"rotateRight",
			"remove",
			{
				closeOnBlur: false,
				type: 'menu',
				title: "more actions",
				toggled: true,
				className: 'fas fa-ellipsis-h',
				menu: [
					// 'flipX','flipY',
					{type: "checkbox", title: "@object.flipX", value: 'flipX', className: "fi fi-flip-h", observe: "modified"},
					{type: "checkbox", title: "@object.flipY", value: 'flipY', className: "fi fi-flip-v", observe: "modified"}
				]
			}
		],
		Group: [
			"scale",
			"ungroup"
		],
		TemplatePhoto: [
			"uploadImage"
		],
		Template: [
			"*"
		],
		ActiveSelection: [
			"group",
			"alignCenterVertically",
			"alignCenterHorizontally",
			"alignTop",
			"alignBottom",
			"alignLeft",
			"alignRight"
		],
		IText: [
			"textFill",
			// "textStyle",
			"*",
			"fontFamily"
		],
		TemplateText: [
			"opacityMenu",
			"textFill",
			"textStyle",
			"fontFamily"
		],
		Image: [
			"*"
		],
		Canvas: [
			{
				className: 'fas fa-fill-drip',
				title: "@canvas.setBackgroundColor",
				observe: "loading:end",
				type: "color",
				value: "backgroundColor",
				subMenuClassName: "popup-left popup-top",
				colorpicker: {
					swatches: ["#ffffff00", "#fff", "#000", "#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"],
					text: true,
					opacity: true
				}
			},
			{
				width: 150,
				title: "Load Template",
				className: "fa fa-star mr-1",
				subMenuClassName: "popup-left popup-top",
				showButtonText: true,
				type: "select",
				inline: false,
				dropdown: {
					position: "above"
				},
				get: function (canvas) {
					return canvas.editor.template;
				},
				set: function (canvas,value) {
					canvas.editor.template = value;
					let template = canvas.editor.templates.find(elem => elem.id === value);
					canvas.editor.canvas.createObject({
						type: "template",
						position: "center",
						objects: template.slide.objects
					})
				},
				options: function (canvas) {
					return canvas.editor.templates
				}
			},
			{
				width: 150,
				className: 'fa fa-upload mr-1',
				showButtonText: true,
				key: 'u',
				title: 'Upload Image',
				action: function() {
					fabric.util.uploadDialog({
						//data: {dpi: this.editedProduct.dpi},
						fileParameter: "design_file",
						onRead: image => {
							var size = fabric.util.getProportions(image, this.getOriginalSize());
							this.editor.canvas.addInActiveArea({
								type: "image",
								element: image,
								width: size.width,
								height: size.height
							});
						},
						onProgress: function (event) {
							console.log(event.loaded + "/" + event.total);
						},
						onUpload: (response) => {
							console.log(response);
						}
					});
				}
			},
			{
				width: 150,
				className: 'fa fa-text mr-1',
				showButtonText: true,
				title: "Add Text",
				action() {
					this.addInActiveArea({
						fontSize: 128,
						type: "i-text",
						clipTo: this.activeArea,
						text: "Add Text Here",
						movementLimits: this.activeArea
					});
				}
			},
			{
				width: 150,
				className: 'fa fa-recycle mr-1',
				showButtonText: true,
				title: "Clear All",
				action() {
					this.clear()
					this.editor.template = "none"
				}
			}
		]
	}
}).then(app => {
	//something interesting here
})


async function createGroupFromSvgFile(path) {
	fabric.loadSVGFromURL(path, function (objects, options) {
		var obj = fabric.util.groupSVGElements(objects, options);
		editor.canvas.add(obj).renderAll();
	});
}

async function loadObjectsFromSvgFile(path) {
	let {objects, options} = await fabric.util.loadSvg(path)
	for (let object of objects) {
		editor.canvas.add(object)
	}
}

