import {TestApp} from '../showreel.js'
import '../../src/fonts/fonts.js'
import {Warp,Controls} from '../../src/modules.js'

new TestApp({
	plugins: [Warp, Controls],
	prototypes: {
		Object: {
			// active: true
		}
	},
	objects: {
		default: {
			backgroundColor: '#ddffff',
			top: 100,
			left: 100,
			type: 'i-text',
			text: 'default',
			fontSize: 100
		},
		circle: {
			cornerStyle: "circle",
			cornerStrokeWidth: 2,
			cornerDashArray: [3,3],
			backgroundColor: '#ddffff',
			top: 100,
			left: 400,
			type: 'i-text',
			text: 'circle',
			fontSize: 100
		},
		frame: {
			cornerStyle: "frame",
			backgroundColor: '#ddffff',
			top: 300,
			left: 400,
			type: 'i-text',
			text: 'frame',
			fontSize: 100
		},
		arc: {
			cornerStyle: "arc",
			backgroundColor: '#ddffff',
			top: 300,
			left: 100,
			type: 'i-text',
			text: 'arc',
			fontSize: 100
		},
		canva: {
			cornerStyle: "canva",
			cornerShadow: {
				color: "#000000",
				blur: 3,
				offsetX: 0,
				offsetY: 0
			},
			cornerColor: "#fff",
			id: 'text',
			backgroundColor: '#ddffff',
			top: 500,
			left: 100,
			type: 'i-text',
			text: 'canva',
			fontSize: 100
		},
		warp: {
			strokeWidth: 0,
			type: "warp",
			src: "./default.jpg",
			left: 100,
			top: 700,
			scaleX: 0.5,
			scaleY: 0.5,
			width: 500,
			height: 500
		},
		nymbl: {
			id: 'text',
			backgroundColor: '#ddffff',
			top: 500,
			left: 400,
			type: 'i-text',
			text: 'nymbl',
			fontSize: 100,
			controls: {
				tl: {action: "scale" , visible: "hasBoundControls",                     x: 0,          y: 0,           },
				tr: {action: "scale" , visible: "hasBoundControls",                     x: "dimx",     y: 0,           },
				bl: {action: "scale" , visible: "hasBoundControls",                     x: 0,          y: "dimy",    },

				br: { //unlock
					angle: "-angle",
					shape: {type: "circle", size: 30},
					label: {text: "\uf09c", size: 17},
					action: "toggleLocked", visible: "locked", x: "dimx", y: "dimy", cursor: "pointer", button: true
				},
				br2: {//lock
					angle: "-angle",
					shape: {type: "circle", size: 30},
					label: {text: "\uf023", size: 17},
					action: "toggleLocked", visible: "!locked", x: "dimx", y: "dimy", cursor: "pointer", button: true
				},
				ml: {action: "scaleX", visible: "hasBoundControls && !lockUniScaling",  x: 0,          y: "dimy/2", altAction: "skewY"},
				mr: {action: "scaleX", visible: "hasBoundControls && !lockUniScaling",  x: "dimx",     y: "dimy/2", altAction: "skewY"},
				mt: {action: "scaleY", visible: "hasBoundControls && !lockUniScaling",  x: "dimx/2",   y: 0,          altAction: "skewX"},
				mb: {action: "scaleY", visible: "hasBoundControls && !lockUniScaling",  x: "dimx/2",   y: "dimy",   altAction: "skewX"},
				mtr:{action: "rotate", visible: "hasRotatingPoint",                     x: "dimx/2",   y: "-rotatingPointOffset / zoom", cursor: "rotationCursor"},
				angle: {
					visible: "canvas && canvas._currentTransform && canvas._currentTransform.action == 'rotate'",
					x: "dimx/2", y: "-2*rotatingPointOffset/zoom", angle: "-angle",
					shape: {type: "roundRect", width: 17 * 2, height: 17 * 1.25, radius: 4},
					label: {text: "{Math.round(angle)}°" ,font: "Roboto", size: 17}
				}
			},
			eventListeners: {
				"rotated": function() {
					this.canvas.setTooltip(false)
				},
				"rotating": function() {
					let tooltip = Math.round(this.angle) ;
					this.canvas.setTooltip(tooltip + "°")
					this.updateControls()
				}
			}
		}
	},
	slide: 	{
		zoom: 0.9,
		zoomStep: 0.05,
		backgroundPosition: 'fill',
		objects: [
			// 'warp',
			'default',
			'circle',
			'arc',
			'frame',
			'canva',
			'nymbl'
		]
	}
})