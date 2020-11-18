
// import fabric from './../src/fabric.core.js'
// import './../src/core/base.js'
// import './../src/core/plugins.js'
import '../../src/modules/canvas/outer-canvas.js'

// fabric.installPlugins(["outer-canvas"])
const canvas = window.cacnvas = new fabric.Canvas('canvas')
canvas.setDimensions({width: document.body.clientWidth - 400, height: document.body.clientHeight- 400})
canvas.setViewportTransform([0.5, 0, 0, 0.5, 0, 0])

canvas.add(
	new fabric.IText('Add Some Text Here', {
		top: 100,
		left: 100,
		type: 'text',
		fontSize: 100
	}),
	new fabric.IText('Flipped Y', {
		id: 'text-flipped-y',
		flipY: true,
		top: 300,
		left: 100,
		type: 'text',
		fontSize: 100
	}),
	new fabric.Text('Flipped x', {
		id: 'text-flipped-x',
		flipX: true,
		top: 500,
		left: 300,
		type: 'text x',
		fontSize: 100
	})
)

fabric.loadSVGFromURL('./../src/media/wanted.svg', function(objects, options) {
	var obj = fabric.util.groupSVGElements(objects, options);
	canvas.add(obj).renderAll();
});

canvas.setOuterCanvasContainer("wrap");
canvas.setOuterCanvasOpacity(0.2);
