import {TestApp} from "../showreel.js"
import {Puzzle} from '../../src/modules.js'
fabric.installPlugins([Puzzle])

new TestApp({
	title: "Fiera Puzzle Test",
	objects: {
		text: {
			id: 'text-normal',
			backgroundColor: '#ddffff',
			top: 300,
			left: 100,
			type: 'text',
			text: 'AA',
			fontSize: 50,
			puzzleSize: {
				width: 100,
				height: 100
			},
			puzzleAlpha: 0.7,
			puzzleSpacing: 50,
			puzzleOverflow: "hidden",
			puzzleTranform: {
				tile: (x,y, i) => ({
					text: String.fromCharCode(65+  10 + x ) + String.fromCharCode(65 +  10 + y )
				})
			}
		},
		hex: {
			id: 'hex',
			mouseWheelScale: true,
			type: 'image',
			src: 'png/other/hex.png',
			left: 300,
			top: 300,
			width: 589,
			height: 700,
			scaleX: 0.4,
			scaleY: 0.4,
			puzzleAlpha: 0.7,
			puzzle: {
				offsetsX: [{x: 1, y: 0}],
				offsetsY: [{x: 0.5, y: 0.75}]
			}
		},
		hex2: {
			id: 'hex2'

			,
			mouseWheelScale: true,
			type: 'image',
			src: 'png/other/hex.png',
			left: 300,
			top: 300,
			height: 589,
			width: 700,
			scaleX: 0.4,
			scaleY: 0.4,
			puzzleAlpha: 0.7,
			puzzle: {
				offsetsX: [{x: 0.75, y: 0.5}],
				offsetsY: [{x: 0, y: 1}]
			}
		},
		carpet: {
			// active: true,
			id: 'carpet',
			puzzleAlpha: 0.7,
			mouseWheelScale: true,
			type: 'image',
			stroke: "white",
			strokeWidth: 0,
			src: './your-design-here.png',
			left: 100,
			top: 100,
			width: 200,
			height: 150,
			puzzle: {
				offsetsX: [{x: 1, y: 0}],
				offsetsY: [{x: 0.5, y: 1}]
			}
		},
		puzzle: {
			type: 'path',
			path: "M2.479 18c.978 0 1.309-.524 1.708-.922.813-.816 1.813-.469 1.813.847v6.075h6.075c1.315 0 1.663-1 .847-1.813-.398-.399-.922-.73-.922-1.708 0-1.087 1.108-2.479 3-2.479s3 1.392 3 2.479c0 .978-.524 1.309-.922 1.708-.816.813-.469 1.813.847 1.813h6.075v-6.075c0-1.315-1-1.663-1.813-.847-.399.398-.73.922-1.708.922-1.087 0-2.479-1.108-2.479-3s1.392-3 2.479-3c.978 0 1.309.524 1.708.922.813.816 1.813.469 1.813-.847v-6.075h-6.075c-1.315 0-1.663-1-.847-1.813.398-.399.922-.73.922-1.708 0-1.087-1.108-2.479-3-2.479s-3 1.392-3 2.479c0 .978.524 1.309.922 1.708.816.813.469 1.813-.847 1.813h-6.075v6.075c0 1.315-1 1.663-1.813.847-.399-.398-.73-.922-1.708-.922-1.087 0-2.479 1.108-2.479 3s1.392 3 2.479 3z",
			id: 'puzzle',
			mouseWheelScale: true,
			stroke: "black",
			fill: "red",
			strokeWidth: 1,
			left: 300,
			top: 300,
			scaleX: 5,
			scaleY: 5,
			puzzleAlpha: 0.7,
			puzzleTranform: (x, y, i) => ({
				fill: `rgba(${Math.abs(x * y ) * 77 % 256},${Math.abs(x * y 	) * 66 % 256},${Math.abs(x * y) * 55 % 256})`
			}),
			puzzle: {
				offsetsX: [{x: 0.75, y: 0}],
				offsetsY: [{x: 0, y: 0.75}]
			}
		}
	},
	slide: {
		objects: [
			'hex',
			'carpet',
			// 'hex2',
			// 'puzzle',
			'text'
		]
	},
	toolbars: {
		Object: ['puzzle'],
		ActiveSelection: ['group'],
		Group: ['ungroup','*'],
		Path: ['*'],
		Image: ['*'],
		Text: ['*'],
	}
}).then(app => {
	app.editor.canvas.createObject({
		type: "rect",
		stroke : 'blue',
		strokeWidth : 1,
		fill: "transparent",
		evented: false,
		width: app.editor.canvas.width,
		height: app.editor.canvas.height
	})
})
