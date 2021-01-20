// import './../fabric/filters/2d_backend.class.js'
// import './../fabric/filters/base_filter.class.js'
// import './../fabric/filters/blur_filter.class.js'
import '../fabric.filters.js'
import {traceContour} from '../../plugins/potrace.js'
import {FmObjectRender} from "./object.render.js";
// import MagicWand from "../../plugins/magicwand.js";
// import MakerJs from "./../../plugins/maker.js";

// SVG PATH OUTLINE
//https://www.npmjs.com/package/svg-path-outline

//smoothing algorithm
//https://css-tricks.com/shape-blobbing-css/

// GPU computation
// https://github.com/gpujs/gpu.js

/**
 *
 * @param  {fabric.Object} target
 * @param scale
 * @returns {CanvasElement}
 * @private
 */
function _getObjectImageForSticker(target,scale = 1){

	let dims = target._getTransformedDimensions()

	let _sticker = target.sticker;
	//render object without sticker
	target.sticker = false
	let canvas = fabric.util.createCanvasElement( dims.x  * scale + target.padding* 2,  dims.y * scale  + target.padding* 2)
	let ctx = canvas.getContext('2d')
	if(target.shadow){
		target._setShadow(ctx, target)
	}
	ctx.translate( target.padding, target.padding)
	ctx.scale( scale, scale)
	ctx.translate( dims.x/2, dims.y/2 )
	ctx.scale( target.scaleX, target.scaleY )
	target.drawObject(ctx)
	target.sticker = _sticker
	return canvas
}


//todo read
//http://tavmjong.free.fr/blog/?p=1257
export const FmSticker = {
	name: "sticker",
	deps: [FmObjectRender],
	prototypes: {
		Text: {
			getSourcePathInfo(){

				this.exportAsPathInfo = true;
				let offsets = this._getSVGLeftTopOffsets(),
					textAndBg = this._getSVGTextAndBg(0,0);

				this.exportAsPathInfo = false;
				let path = textAndBg.textSpans.join(" ");

				// fabric.util.shapes.translatePath(path,this.width/2,this.height/2)
				return {
					path,
					width: this.width,
					height: this.height
				};
			}
		},
		Image: {
		},
		Object: {
			getPathInfo(){
				let simplicity = 2;
				let imageForSticker = _getObjectImageForSticker(this , 1/simplicity)//, 1/3)
				let stickerSource = fabric.util.createCanvasElement()
				stickerSource.width = imageForSticker.width ;
				stickerSource.height = imageForSticker.height ;
				// stickerSource.width = Math.ceil(this._element.width / simplicity);
				// stickerSource.height = Math.ceil(this._element.height / simplicity);
				// let ctx = stickerSource.getContext("2d")
				// ctx.scale(1/simplicity,1/simplicity);
				// ctx.drawImage(this._element,0,0)
				//
				if (!fabric.filterBackend) {
					fabric.filterBackend = fabric.initFilterBackend();
				}
				fabric.filterBackend.applyFilters([new fabric.Image.filters.ColorMatrix({colorsOnly: true, matrix: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,255,0]})], imageForSticker, stickerSource.width, stickerSource.height, stickerSource);

				function traceUsingMagicWand(stickerSource) {
					let imgData = ctx.getImageData(0, 0, stickerSource.width, stickerSource.height);
					let mask = MagicWand.selectColored(imgData, {aMin: 1});
					let contours = MagicWand.traceContours(mask)
					let simplifyTolerant = 0;
					let simplifyCount = 30;
					let contoursSimplified = MagicWand.simplifyContours(contours, simplifyTolerant, simplifyCount);
					return contoursSimplified.reduce(function (prev, curr) {
						if (!curr.inner) {
							let ps = curr.points;

							prev.push(`M ${ps[0].x} ${ps[0].y}`)

							for (let j = 1; j < curr.points.length; j++) {
								prev.push(`L ${ps[j].x} ${ps[j].y}`)
							}
						}
						return prev;
					}, [])
				}

				function traceUsingPotrace(stickerSource,stickerAlpha){

					//almost completely smooth to avoid sharp corner artifacts. exception: rectangle shapes
					let alphamax = 1.3;
					//accept colors ad shodow parts using alpha channel
					let colorMatch = [ 0, 0, 0, stickerAlpha];
					// remove paths less then 10 px,
					let turdsize = 10;

					//get image contour path ,completely smooth
					return traceContour(stickerSource,{
						threshold: 255,
						turdSize: 10,
						colorMatch:  [ 0, 0, 0, stickerAlpha],
						optCurve: false
					})

					// turdSize - suppress speckles of up to this size
					// (default: 2)
					// alphaMax - corner threshold parameter
					// (default: 1)
					// optCurve - curve optimization
					// (default: true)
					// optTolerance - curve optimization tolerance
					// (default: 0.2)
					// threshold -
				}

				let path1 = traceUsingPotrace(stickerSource,this.stickerAlpha)


				// console.time("2")
				// let path2 = traceUsingMagicWand(stickerSource)
				// console.timeEnd("2")

				if(!path1){
					return false
				}
				let parsedPath = fabric.util.shapes.parsePath(path1);

				fabric.util.shapes.scalePath(parsedPath, this.width /stickerSource.width ,this.height / stickerSource.height )


				return {
					path: parsedPath,
					width: this.width,
					height: this.height
				}
			},
			getOutlinePathInfoUsingMakerJS (pathInfo,options) {



				let opts = {};
//https://danmarshall.github.io/svg-path-outline/
				let defaultOptions = {
					bezierAccuracy: 0.25,
					joints: 0,
					outside: true,
					tagName: 'path'
				};
				let o = MakerJs.extendObject(defaultOptions, opts);
				let closed = true;
				let input;
				switch (o.tagName) {
					case 'polyline':
						closed = false;
					//fall through
					case 'polygon':
						//use points.
						//Need to mirror them on y axis because they are expected to be in MakerJs coordinate space
						input = MakerJs.model.mirror(new MakerJs.models.ConnectTheDots(closed, pathInfo.path), false, true);
						break;
					default:
						input = MakerJs.importer.fromSVGPathData(pathInfo.path, { bezierAccuracy: o.bezierAccuracy });
						break;
				}
				let result;
				if (o.inside && o.outside) {
					result = MakerJs.model.expandPaths(input, options.stickerPadding, o.joints);
				}
				else {
					result = MakerJs.model.outline(input, options.stickerPadding, o.joints, o.inside);
				}
				MakerJs.model.simplify(result);
				let stickerPath = MakerJs.exporter.toSVGPathData(result, false, [0, 0]);

				return {
					path: stickerPath
				}

			},
			getOutlinePathInfo (pathInfo,options) {


				let alphamax = 1.3;
				let colorMatch = [ 0, 0, 0, options.stickerAlpha];
				let turdsize = 10;
				//when svg path is ready. creating a fabric. Path object with strokeWidth for padding and shadow for blurring
				let stickerShape = new fabric.Path({
					cropPath: false,
					path: pathInfo.path,
					width: pathInfo.width,
					height: pathInfo.height,
					strokeWidth: options.stickerPadding,
					stroke: "white",
					strokeLineCap: 'round',
					strokeLineJoin: 'round',
					fill: "white",
					// scaleX: 1 / scale,
					// scaleY: 1 / scale,
					padding: options.stickerPadding ,
					shadow: options.stickerRenderMode === "shadow" && {
						affectStroke: true,
						color: 'white',
						blur: options.stickerPadding
					}
				})

				//then make a raster image of new shape
				let stickerShapeImage = _getObjectImageForSticker( stickerShape)

				//todo do not working correctly. blurring works weird
				if(options.stickerRenderMode === "blur"){
					//use shadow
					let filters = [new fabric.Image.filters.Blur({blur: 0.3})]
					let blurredStickerShapeImage = fabric.util.createCanvasElement({width: stickerShapeImage.width , height: stickerShapeImage.height})
					let filterBackend = new fabric.Canvas2dFilterBackend()
					filterBackend.applyFilters(filters, stickerShapeImage, blurredStickerShapeImage.width, blurredStickerShapeImage.height, blurredStickerShapeImage)
					stickerShapeImage = blurredStickerShapeImage;
				}

				// getextended image contour path almost completely smooth to avoid sharp corner artifacts. exception: rectangle shapes
				return {
					width: stickerShapeImage.width,
					height: stickerShapeImage.height,
					path: traceContour(stickerShapeImage,{colorMatch, alphamax})
				}
			},
			updateSticker(){

				if(!this.loaded){
					return
				}
				// console.time("sticker");
				//render object without sticker, scale original image for better tracing

				let originalPathInfo = this.getPathInfo();

				if(originalPathInfo){

					// let stickerPathInfo =  this.getStickerPathUsingMakerJS(originalPathInfo,this)
					let stickerPathInfo =  this.getOutlinePathInfo(originalPathInfo,this)
					// console.timeEnd("sticker");

					this._stickerEl = new fabric.Path(Object.assign({
						cropPath: false,
						width: stickerPathInfo.width,//+ this.stickerPadding * 2,
						height: stickerPathInfo.height,// + this.stickerPadding * 2,
						strokeLineCap: 'round',
						strokeLineJoin: 'miter',
						path: stickerPathInfo.path,
						originX: 'center',
						originY: 'center',
						left: 0,
						top: 0
					},this.stickerOptions))
				}


				// let simplicity = Math.ceil(this.stickerPadding/3);
				// this._stickerEl.scaleX *= this.width * simplicity / this._element.width ;
				// this._stickerEl.scaleY *= this.height * simplicity / this._element.height;
				// this._stickerEl.scaleX *= 3;//this.width * simplicity / this._element.width ;
				// this._stickerEl.scaleY *= 3;//this.height * simplicity / this._element.height;


				//todo padding property doesnt work with Controls module
				// this.padding = this.stickerPadding
			},
			sticker: false,
			// stickerTracingScale: 4,
			stickerPadding: 30,
			// stickerBlur: 25,
			stickerAlpha: 0.9,
			stickerRenderMode: "shadow",
			stickerOptions: {
				fill: "white",
				strokeWidth: 0,
				shadow: {
					offsetX: 0.5,
					offsetY: 0.5,
					blur: 3,
					color: "#00000077"
				}
			},
			"+beforeRender": ["renderSticker"],
			renderSticker(ctx,forClipping) {
				if(this.loaded && this.sticker) {
					if(!this._stickerEl){
						this.updateSticker()
					}
					this._stickerEl.render(ctx,forClipping)
				}
			},
			setSticker(value) {
				if(this.sticker === value){
					return;
				}
				delete this._stickerEl
				this.sticker = value

				if(this.sticker){
					this.on({"resized modified element:modified": "updateSticker"})
				}else{
					this.off({"resized modified": "updateSticker"})
				}
			}
		}
	}
}
