import {TestApp} from '../showreel.js'
import { ClipPath, ImageCrop, Controls} from '../../src/modules.js'
fabric.installPlugins([ClipPath, ImageCrop,Controls])

new TestApp({
	prototypes: {
		Object: {
			locked: false,
			"+controls": {
				br: {
					size: 20,
					button: true,
					cursor: "pointer",
					action: "toggleLocked" ,
					visible: "locked",
					x: "dimx",
					y: "dimy",
					style: "circle",
					icon: "\uf023"
				},
				br2: {
					size: 20,
					button: true,
					cursor: "pointer",
					action: "toggleLocked" ,
					visible: "!locked",
					x: "dimx",
					y: "dimy",
					style: "circle",
					icon: "\uf09c"
				}
			}
		}
	},
	slide: {
		objects: [
			{
				type: 'image',
				src: './pug.jpg',
				left: 100,
				top: 100,
				width: 100,
				height: 100
			},
			{
				type: 'image',
				src: './pug.jpg',
				left: 100,
				top: 300,
				width: 100,
				height: 100
			},
			{
				type: 'image',
				src: './pug.jpg',
				left: 300,
				top: 100,
				width: 100,
				height: 100
			}
		]
	}
})
