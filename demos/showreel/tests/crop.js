import {TestApp} from "../showreel.js"
import {ImageCrop, Controls , WheelScale} from '../../src/modules.js'

fabric.installPlugins([ImageCrop, Controls, WheelScale])

new TestApp({
	prototypes: {
		Crop: {
		},
		Object: {
			mouseWheelScale: true
		},
		Image: {
			eventListeners: {
				mousedblclick: "cropPhotoStart"
			}
		}
	},
	objects: {
		megan: {
			id: 'megan', type: 'image', left: 0, top: 0, width: 200, height: 200,
			src: 'photos/fox.jpg'
		},
		fox: {id: 'fox', type: 'image', left: 100, top: 400, width: 200, height: 200, src: 'png/tribal/Fox.png'},
		snake: {id: 'snake', type: 'image', left: 100, top: 500, width: 200, height: 200, src: 'png/tribal/Snake.png'}
	},
	slide: {
		// backgroundColor: "white",
		objects: [
			'megan',
			'fox',
			'snake'
		]
	}
})
