import {TestApp} from '../showreel.js'
import '../../src/fonts/fonts.js'
import ObjectRender from '../../src/modules/objects/object.render.js'
import Controls from '../../src/modules/canvas/controls.js'
import saveAs from "../../plugins/saveAs.js";
import {canvasToBlob} from "../../src/util/canvasToBlob.js";




new TestApp({
	plugins: [ObjectRender, Controls],
	objects: {
		text: {
			id: 'text-normal',
			backgroundColor: '#ddffff',
			top: 300,
			left: 100,
			type: 'i-text',
			text: 'Not Flipped',
			fontSize: 100
		},
		textFlippedX: {
			id: 'text-flipped-x',
			flipX: true,
			top: 450,
			left: 100,
			type: 'text',
			text: 'Flipped X',
			fontSize: 100
		},
		textFlippedY: {
			id: 'text-flipped-y',
			flipY: true,
			top: 600,
			left: 100,
			type: 'text',
			text: 'Flipped Y',
			fontSize: 100
		},
		textFlippedXY: {
			id: 'text-flipped-xy',
			flipY: true,
			flipX: true,
			top: 750,
			left: 100,
			type: 'text',
			text: 'Flipped XY',
			fontSize: 100
		},
		group: {
			type: "group",width: 800, height: 1000,
			objects: [
				{type : "rect",width: 800, height: 1000, fill: "transparent"},
				{backgroundColor: '#ddffff', top: 300, left: 100, type: 'i-text', text: 'Not Flipped', fontSize: 100},
				{	flipX: true,		top: 450,		left: 100,		type: 'text',		text: 'Flipped X',		fontSize: 100},
				{flipY: true, top: 600, left: 100, type: 'text', text: 'Flipped Y', fontSize: 100},
				{flipY: true, flipX: true, top: 750, left: 100, type: 'text', text: 'Flipped XY', fontSize: 100}
			]
		},
		divider: {
			type: "line",
			x1: 800,
			x2:800,
			y1: 0,
			y2: 1000,
			stroke: "black"
		},
		group2: {
			type: "group",
			angle: 180,
			left: 1600 + 1,
			top:1000,width: 800, height: 1000,
			objects: [
				{type : "rect",width: 800, height: 1000, fill: "transparent"},
				{backgroundColor: '#ddffff', top: 300, left: 100, type: 'i-text', text: 'Not Flipped', fontSize: 100},
				{	flipX: true,		top: 450,		left: 100,		type: 'text',		text: 'Flipped X',		fontSize: 100},
				{flipY: true, top: 600, left: 100, type: 'text', text: 'Flipped Y', fontSize: 100},
				{flipY: true, flipX: true, top: 750, left: 100, type: 'text', text: 'Flipped XY', fontSize: 100}
			]
		}
	},
	prototypes: {
		// Object: {
		// 	borderWidth: 1,
		// 	border: "grey",
		// 	activeOptions: {
		// 		borderWidth: 4,
		// 		border: "grey"
		// 	},
		// 	inactiveOptions: {
		// 		borderWidth: 1,
		// 		border: "grey"
		// 	},
		// 	activeHoverOptions: {
		// 		borderWidth: 4,
		// 		border: "green"
		// 	},
		// 	inactiveHoverOptions: {
		// 		borderWidth: 1,
		// 		border: "green"
		// 	}
		// }
	},
	slide: {
		zoom: 0.5,
		zoomStep: 0.05,
		backgroundPosition: 'fill',
		objects: [
			// 'group',
			// 'group2',
			'divider',
			'text',
			'textFlippedX',
			'textFlippedY',
			'textFlippedXY',
			// 'nymblText'
			// 'image'
		]
	},
	toolbars: {
		Object: [
			'flipX',
			'flipY',
			'remove'
		],
		Text: [
			'*',
			// 'textStyle',
			// {
			//   closeOnBlur: false,
			//   type: 'menu',
			//   title: 'text style',
			//   toggled: true,
			//   className: 'fa fa-font',
			//   menu: [
			// 		'textAlign',
			//     'bold', 'italic', 'fontFamily', 'textFill'
			//   ]
			// }
		]
	}
})
