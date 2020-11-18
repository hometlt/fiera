import LoaderQueue from "../../util/loader.js";
import fabric from './../../src/fabric.core.js'
import './../../src/fabric.filters.js'
import '../../src/core/base.js'
import '../../src/core/plugins.js'
import '../../src/core/scanvas.objects.js'
import '../../src/core/image.ext.js'
import '../../src/core/canvas.ext.js'
import '../../src/core/states.js'
import '../../src/core/fromURL.js'
import '../../src/core/activate.js'
import '../../src/core/interactivity.js'
import ImageCrop    from '../../src/modules/images/image-crop.js'
import OuterCanvas  from '../../src/modules/canvas/outer-canvas.js'



fabric.installPlugins([ImageCrop, OuterCanvas])

fabric.inlineSVG = true;

let canvasEl = document.createElement("canvas");
canvasEl.id = "canvas"
document.body.append(canvasEl);

const canvas = window.canvas = new fabric.Canvas('canvas')
canvas.setDimensions({width: document.body.clientWidth, height: document.body.clientHeight})

//enable target events to support cropping
canvas.initEventListeners()

//this could be enabled to work with Text ClipPath
canvas.preserveObjectStacking = true;

function runTest(){

	//various tests
	var pugAbsoluteClipped = new fabric.Image(pugImg, {angle: 0, width: 100, height: 100, left: 0, top: 0, clipPath: new fabric.Circle({radius: 50,  left: 0, top: 0, width: 100, height: 100, absolutePositioned: true, fill: '#aad'})}),
		pugRelativeClipped = new fabric.Image(pugImg, {angle: 0, width: 100, height: 100, left: 100, top: 0, clipPath: new fabric.Circle({radius: 50,  left: -50, top: -50, width: 100, height: 100, fill: '#daa'})}),
		objPath = new fabric.Path('M 0 0 L 300 100 L 200 300 z',{left: 300, top: 650, fill: 'red', stroke: 'green', opacity: 0.5}),
		objGroup = new fabric.Group([
			new fabric.Circle({radius: 100, fill: '#eef', scaleY: 0.5, originX: 'center', originY: 'center'}),
			new fabric.Text('hello world', {fontSize: 30, originX: 'center', originY: 'center'})
		], {left: 400, top: 400, angle: -10}),
		objFoxImg = new fabric.Image(foxImg, {stroke: "red",strokeWidth:1,left: 100, top: 300,width: foxImg.width, height: foxImg.height}),
		objFoxSvg = fabric.util.groupSVGElements(foxSvg.objects, {left: 100, top: 300, width: foxSvg.width, height: foxSvg.height});

	//Apply cropping by dblclick and image resizing
	function applyCropping(obj){
		obj.on("mousedblclick", () => {
			obj.cropPhotoStart()
			obj.activeCropEl.initEventListeners()
		})
		obj.initEventListeners()
		obj.setFitting("cover");
	}


	//Cropped Image Without Mask
	let masked1 = new fabric.Image(ydhImg,{top: 210, left: 710, width: 180,height: 180})
	applyCropping(masked1)
	let filter = new fabric.Image.filters.Grayscale({value: 0.5});
	masked1.filters.push(filter);
	masked1.applyFilters();
	masked1.shadow = new fabric.Shadow({offsetX: 3, offsetY: 3, blur: 10})
	masked1.strokeWidth = 2
	masked1.strokeDashArray = [5,5,2,5]
	masked1.stroke = "red"
	masked1.opacity = 0.75;


	//Cropped Image with SVG as a Mask
	let masked2 = new fabric.Image(ydhImg,{top: 410, left: 710, width: 180,height: 180})
	applyCropping(masked2)
	let objFoxSvg2 = fabric.util.groupSVGElements(foxSvg2.objects, {
		width: foxSvg2.width,
		height: foxSvg2.height
	});
	masked2.setClipPath(objFoxSvg2);

	//Cropped Image with Circle as a Mask
	let masked3 = new fabric.Image(ydhImg,{top: 610, left: 710, width: 180,height: 180})
	applyCropping(masked3)
	masked3.setClipPath({
		radius: 0.5
	})

	//Cropped Image with Text as a Mask
	let maskedText = new fabric.Image(ydhImg,{top: 400, left: 100, width: 500,height: 100})
	applyCropping(maskedText)
	let textMask = new fabric.IText('Text As Mask', {top: 100, left: 100, type: 'text', fontSize: 100, fontWeight: "bold", fontFamily: "Tahoma"});
	maskedText.setClipPath(textMask)

	//Text Filled With Pattern
	let textPattern = new fabric.IText('Text Filled With Pattern', {top: 500, left: 100, type: 'text', fontSize: 90, scaleX: 0.46, fontWeight: "bold", fontFamily: "Tahoma"});
	textPattern.set('fill', new fabric.Pattern({
		source: ydhImg,
		repeat: "repeat"
	}));

	//Text As Clip Path
	let textClipPath = new fabric.IText('Text As Clip Path', {top: 600, left: 100, type: 'text',  absolutePositioned: true, fontSize: 90, scaleX: 0.65, fontWeight: "bold", fontFamily: "Tahoma"});
	let coverImage = new fabric.Image(ydhImg,{top: 300, left: 0, width: 800,height: 600, clipPath: textClipPath, evented: false, selectable:false});

	canvas.add(
		masked1,
		masked2,
		masked3,
		maskedText,
		textPattern,
		textClipPath,
		coverImage
	);
}

//wait until all resources are loaded
let loader = new LoaderQueue({elements: [], active: false, complete: runTest})

loader.push("pug")
var pugImg = new Image();
pugImg.onload = (img) => loader.shift("pug")
pugImg.src = './pug.jpg'

loader.push("ydh")
var ydhImg = new Image();
ydhImg.onload = (img) => loader.shift("ydh")
ydhImg.src = './../../fiera-media/backgrounds/abstract/BG178.jpg'

loader.push("fox")
var foxImg = new Image();
foxImg.onload = (img) => loader.shift("fox")
foxImg.src = './../../fiera-media/svg-graphics/Tribal/fox.svg'

loader.push("foxsvg")
let foxSvg;
fabric.loadSVGFromURL('./../../fiera-media/svg-graphics/Tribal/fox.svg', function(objects, options) {
	foxSvg = options
	foxSvg.objects = objects
	loader.shift("foxsvg")
})

loader.push("foxsvg2")
let foxSvg2;
fabric.loadSVGFromURL('./../../fiera-media/svg-graphics/Tribal/fox.svg', function(objects, options) {
	foxSvg2 = options
	foxSvg2.objects = objects
	loader.shift("foxsvg2")
})
loader.activate()


// Shapes Masking
// Change image inside mask
// reset button
// When user clicks on the image mask shapes will appear. User can select each of these mask shape and mask get applied on the center of the image
// FONT MASKING
// Shadow
// Border.colour.thickness
// Filters
// Transparency
// Duplicate
// Object control overflow
// Rectangle Border Scaling



