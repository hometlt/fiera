import {TestApp} from "../showreel.js"
import {Sticker, Trace, Fonts} from '../../src/modules.js'
import '../../src/modules/text/text.exportAsPath.js'

fabric.installPlugins([Sticker,Trace, Fonts])

document.body.style.backgroundColor = "black"
fabric.fonts.debug = true;
new TestApp({
	prototypes: {
		Canvas:{
			// backgroundColor: "black"
		},
		Object: {
			stickerPadding: 15,
			sticker: true,
			stickerOptions: {
				fill: "white",
				strokeWidth: 1,
				stroke: "black",
				strokeDashArray: [2, 2],
				paintFirst: 'stroke'
			}
		},
		Image: {
			width: 200, height: 200
		}
	},
	objects: {
		text: {
			id: 'text',
			top: 140,
			left: 113,
			fill: "red",
			type: 'i-text',
			fontFamily: "Times New Roman",
			text: 'StickerDemo\n New Line',
			fontSize: 60,
			lineHeight: 0.85,
			styles:{"0":{"4":{"fontFamily":"Bungee Shade"},"5":{"fontFamily":"Bungee Shade"},"6":{"fontFamily":"Bungee Shade"},"7":{"fontFamily":"Bungee Shade"},"9":{"fontFamily":"Monoton"},"10":{"fontFamily":"Monoton"},"11":{"fontFamily":"Monoton"},"12":{"fontFamily":"Monoton"}}}
		},
		text2: {
			id: 'text',
			top: 140,
			left: 113,
			fill: "red",
			type: 'i-text',
			text: 'Sticker\n Demo',
			fontSize: 60,
			lineHeight: 1
		},
		text3: {
			id: 'text',
			top: 140,
			left: 113,
			fill: "red",
			type: 'i-text',
			text: 'Sticker\n Demo',
			fontSize: 60,
			lineHeight: 1.15
		},
		megan: {
			id: 'megan', type: 'image', left: 0, top: 0, width: 200, height: 200,
			src: 'photos/fox.jpg'
		},
		bow: {
			id: 'bow', type: 'image', left: 700, top: 100, width: 200, height: 200,
			src: 'png/tribal/Bow1.small.png'
		},
		pawPrint: {
			id: 'paw-print', type: 'image', left: 400, top: 100, width: 200, height: 200,
			src: 'png/tribal/PawPrint.png'
		},
		bigbow: {
			id: 'bigbow', type: 'image', left: 400, top: 400, width: 500, height: 500,
			src: 'png/tribal/Bow2.png'
		},
		hugebow: {
			id: 'hugebow', type: 'image', left: 400, top: 400, width: 900, height: 900,
			src: 'png/tribal/Bow2.png'
		},
		test: {
			id: 'test', type: 'image', left: 400, top: 400, width: 500, height: 500,
			src: './test.png'
		},
		elephant: {id: 'elephant', type: 'image', left: 1000, top: 100, src: 'png/tribal/Elephant.png'},
		feather: {id: 'feather', type: 'image', left: 400, top: 400, src: 'png/tribal/Feather.png'},
		fox: {id: 'fox', type: 'image', left: 100, top: 400, src: 'png/tribal/Fox.png'},
		leaf: {id: 'leaf', type: 'image', left: 1000, top: 700, src: 'png/tribal/Leaf3.png'},
		lion: {id: 'lion', type: 'image', left: 1000, top: 400, src: 'png/tribal/Lion.png'},
		snake: {id: 'snake', type: 'image', left: 100, top: 700, src: 'png/tribal/Snake.png'},
		tiger: {id: 'tiger', type: 'image', left: 700, top: 400, src: 'png/tribal/Tiger.png'},
		sloth: {id: 'sloth', type: 'image', left: 700, top: 700, src: 'png/tribal/Sloth.png'},
		vine: {id: 'vine', type: 'image', left: 500, top: 500, src: 'png/tribal/Vine3.png'}
	},
	slide: {
		// backgroundColor: "white",
		objects: [
			'megan',
			'text',
			'test',
			'vine',
			// 'fox',
			// 'pawPrint',
			// 'bow',
			// 'snake',
			// 'elephant',
			// 'feather',
			// 'leaf',
			// 'lion',
			// 'tiger',
			// 'sloth',
			// 'text2',
			// 'text3',
			// 'bigbow',
			'hugebow',
		]
	}
})
