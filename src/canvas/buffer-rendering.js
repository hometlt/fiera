import {FmObjectRender} from "../objects/object.render.js";


export const FmBufferRendering = {
	name: "buffer-rendering",
	deps: [FmObjectRender],
	install (){

		fabric.Object.prototype.defaultDrawObject = fabric.Object.prototype.drawObject;

		fabric.util.bufferRenderobjects = function(canvas,ctx, objects, transformations){
			//apply viewport transform once for all rendering process
			if(!objects || !objects.length)return;

			let _bufferCtx = canvas.getBuffer(ctx, transformations)

			for (let i = 0; i < objects.length; ++i) {
				_bufferCtx.save();
				_bufferCtx.setTransform(1, 0, 0, 1, 0, 0);
				_bufferCtx.clearRect(0, 0, _bufferCtx.canvas.width, _bufferCtx.canvas.height);
				_bufferCtx.restore();

				let obj = objects[i]

				if(obj.puzzle){

					let transform1 = [1,0,0,1,0,0]
					{
						var m;
						if (obj.group && !obj.group._transformDone) {
							m = obj.calcTransformMatrix();
						} else {
							m = obj.calcOwnMatrix();
						}
						transformations.push(m);
					}
					for(let transform2 of transformations){
						transform1 = fabric.util.multiplyTransformMatrices(transform1,transform2)
					}
					transformations.pop();

					if(!obj._tileCanvas || obj.dirty){
						obj.renderTilesCache()
						obj.dirty = false;
					}

					//28MS!!!
					let MatrixClass = fabric.Node && fabric.Node.DOMMatrix || DOMMatrix
					let matrix = new MatrixClass(transform1);
					obj._tilesPattern = ctx.createPattern(obj._tileCanvas, 'repeat');

					if(obj.originY === "top"){
						matrix = matrix.translate( 0, -obj.height/2)
					}
					if(obj.originX === "left"){
						matrix = matrix.translate( -obj.width/2 ,0 )
					}
					matrix = matrix.scale(1/obj.scaleX,1/obj.scaleY)

					if(!obj.canvas.__forExport){
						matrix = matrix.scale(fabric.devicePixelRatio)
					}

					obj._tilesPattern.setTransform(matrix)
					ctx.fillStyle = obj._tilesPattern;


// 				if(obj._tileBufferCanvasScaleX !== obj.scaleX){
// 					ctx.scale(obj.scaleX/obj._tileBufferCanvasScaleX,1)
// 				}
// 				if(obj._tileBufferCanvasScaleY !== obj.scaleY){
// 					ctx.scale(1,obj.scaleY/obj._tileBufferCanvasScaleY)
// 				}

					ctx.fillRect(0,0, ctx.canvas.width , ctx.canvas.height);

// 					if(!obj.canvas.__forExport){
// 						matrix = matrix.scale(fabric.devicePixelRatio)
// 					}
// 					matrix = matrix.translate(obj.left,obj.top).rotate(obj.angle)

// 					if(obj.originY === "center"){
// 						matrix = matrix.translate( obj.height/2 *obj.scaleX, 0)
// 					}
// 					if(this.originX === "center"){
// 						matrix = matrix.translate( 0, obj.width/2 *obj.scaleY)
// 					}
// 					matrix =  matrix.skewX(obj.skewX).skewY(obj.skewY)

					//TODO 25MS!

// 					if(obj._tileBufferCanvasScaleX !== obj.scaleX){
// 						ctx.scale(obj.scaleX/obj._tileBufferCanvasScaleX,1)
// 					}
// 					if(obj._tileBufferCanvasScaleY !== obj.scaleY){
// 						ctx.scale(1,obj.scaleY/obj._tileBufferCanvasScaleY)
// 					}

// 					for(let transformation of transformations){
// 						transformation && _bufferCtx.transform.apply(_bufferCtx, transformation);
// 					}

// 					_bufferCtx.restore()
				}
				else{
					obj.bufferRender(_bufferCtx,transformations);
				}

				ctx.save();
				obj._setupCompositeOperation(ctx);
				ctx.drawImage(_bufferCtx.canvas,0,0)
				ctx.restore();


				// if(obj && obj.renderTiles && obj._puzzles){
				// 	for(let row of obj._puzzles) for (let item of row.items) {
				// 		if(item.x === 0 && row.y === 0 || !obj.isPuzzleOnScreen(item.x,row.y  )) {
				// 			continue;
				// 		}
				// 		let point = obj._getPuzzleOffset( item.x, row.y , true )
				//
				// 		let state = {
				// 			left: obj.left,
				// 			top: obj.top
				// 		}
				//
				// 		obj.left = state.left + point.x
				// 		obj.top = state.top +  point.y
				//
				// 		_bufferCtx.clearRect(0, 0, _bufferCtx.canvas.width, _bufferCtx.canvas.height);
				// 		_bufferCtx.save();
				// 		obj && obj.bufferRender(_bufferCtx,transformations);
				// 		_bufferCtx.restore();
				//
				// 		ctx.save();
				// 		obj._setupCompositeOperation(ctx);
				// 		ctx.drawImage(_bufferCtx.canvas,0,0)
				// 		ctx.restore();
				//
				// 		obj.left = state.left
				// 		obj.top = state.top
				// 	}
				// }
			}
		}

	},
	prototypes: {
		IText: {
			bufferRender: function (ctx, transformations) {
				this.clearContextTop();
				fabric.Object.prototype.bufferRender.call(this, ctx, transformations);
				// clear the cursorOffsetCache, so we ensure to calculate once per renderCursor
				// the correct position but not at every cursor animation.
				this.cursorOffsetCache = {};
				this.renderCursorOrSelection();
			}
		},
		Group: {
			bufferRender: function (ctx, transformations) {
				this._transformDone = true;
				fabric.Object.prototype.bufferRender.call(this, ctx, transformations);
				this._transformDone = false;
			}
		},
		Text: {
			/**
			 * Renders text instance on a specified context
			 * @param {CanvasRenderingContext2D} ctx Context to render on
			 */
			onBeforeRender: function (ctx) {
				if (this._shouldClearDimensionCache()) {
					this.initDimensions();
				}
			},
			// render: function (ctx, transformations) {
			// 	bufferRender.call(this, ctx, transformations);
			// }
		},
		Object: {
			bufferDrawObject: function (ctx, forClipping, transformations) {
				let originalFill = this.fill, originalStroke = this.stroke
				this._setOpacity(ctx);
				this._setShadow(ctx, this);
				if (forClipping) {
					this.fill = 'black'
					this.stroke = ''
					this._setClippingProperties(ctx)
				} else {
					this._renderBackground(ctx)
					this._setStrokeStyles(ctx, this)
					this._setFillStyles(ctx, this)
				}

				for (let i = 0; i < this.beforeRender.length; i++) {
					this[this.beforeRender[i]](ctx, forClipping)
				}

				this._render(ctx)
				fabric.util.bufferRenderobjects(this.canvas,ctx, this._objects, transformations)
				this._drawClipPath(ctx, transformations)

				for (let i = 0; i < this.afterRender.length; i++) {
					this[this.afterRender[i]](ctx, forClipping)
				}

				this.fill = originalFill
				this.stroke = originalStroke
			},
			drawObject: function (ctx, forClipping, transformations) {
				if(transformations){
					return this.bufferDrawObject(ctx, forClipping, transformations)
				}
				if(!transformations){
					return this.defaultDrawObject(ctx, forClipping)
				}
			},
			bufferRender: function (ctx, transformations) {

				if(!transformations) transformations = [this.viewportTransform];
				if (this.isNotVisible()) {
					return;
				}
				if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() && !this._puzzleOptions) {
					return;
				}
				this.onBeforeRender && this.onBeforeRender()
				ctx.save();
				this.drawSelectionBackground(ctx);
				{
					var m;
					if (this.group && !this.group._transformDone) {
						m = this.calcTransformMatrix();
					} else {
						m = this.calcOwnMatrix();
					}
					ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
					transformations.push(m);
				}
				this._setOpacity(ctx);
				this._setShadow(ctx, this);
				this._renderBackground(ctx)
				this._setStrokeStyles(ctx, this)
				this._setFillStyles(ctx, this)

				for (let i = 0; i < this.beforeRender.length; i++) {
					this[this.beforeRender[i]](ctx, transformations)
				}

				this._render(ctx)
				if (this._objects) {
					ctx.save()
					ctx.setTransform(1, 0, 0, 1, 0, 0)
					// ctx.translate(this.width/2,this.height/2)
					fabric.util.bufferRenderobjects(this.canvas,ctx, this._objects, transformations)
					ctx.restore()
				}
				this._drawClipPath(ctx, transformations)

				for (let i = 0; i < this.afterRender.length; i++) {
					// this[this.afterRender[i]](ctx, false, transformations)
					this[this.afterRender[i]](ctx, transformations)
				}
				transformations.pop();

				if(!transformations.length){
					//clear buffers
				}
				ctx.restore();
			}
		},
		StaticCanvas: {
			getBuffer(ctx, transformations){
				let level = transformations.length - 1;
// 				if(!this._buffers) {
// 					this._buffers = [];
// // 					this._buffersCtx = [];
// 				}

				let buffers = fabric.tilingBuffers || fabric.currentBuffersStack

				if(!buffers[level]) {
					buffers[level] = fabric.util.createCanvasElement();
					fabric.util.fire("buffer:created",{target: this, buffer: buffers[level], level: level})
// 					this._buffersCtx[level] = this._buffers[level].getContext("2d")
				}
				let _buffer = buffers[level];
				let _bufferCtx = buffers[level].getContext("2d")
				_buffer.width = ctx.canvas.width;
				_buffer.height = ctx.canvas.height;
				_bufferCtx.save();
				for(let transformation of transformations){
					transformation && _bufferCtx.transform.apply(_bufferCtx, transformation);
				}
				return _bufferCtx
			},
			_drawClipPath: function(ctx, transformations) {
				if (!this.clipPath) return;
				let path = this.clipPath;
				path.canvas = this.canvas;
				// let origZoomX, origZoomY;

				// path.shouldCache();
				// path._transformDone = true;
				// path.renderCache({ forClipping: true });

				ctx.save()
				ctx.globalCompositeOperation = path.inverted ? 'destination-out':'destination-in';
				if (path.absolutePositioned) {
					var m = fabric.util.invertTransform(this.calcTransformMatrix());
					ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
				}
				path.drawObject(ctx, true, transformations)
				ctx.restore()
			},
			useBufferRendering: false,
			renderObjects(ctx, objects) {
				if (!objects || !objects.length) return;

				if(this.useBufferRendering){
					if(!this._buffers){
						this._buffers = []
					}
					fabric.currentBuffersStack = this._buffers
					let transformations =[this.viewportTransform];
					ctx.save()
					fabric.util.bufferRenderobjects(this, ctx, objects, transformations)

					let m = this.viewportTransform;
					ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);

					let m2 = [1, 0, 0, 1, this.originalWidth/2, this.originalHeight/2];
					ctx.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
					// needed to setup a couple of variables
					// path.shouldCache();
					// path._transformDone = true;
					this._drawClipPath( ctx, transformations)
					ctx.restore()
					delete fabric.currentBuffersStack
					// path.renderCache({forClipping: true});
					// this.drawClipPathOnCanvas(ctx);
				}
				else{
					ctx.save();
					//apply viewport transform once for all rendering process
					ctx.transform.apply(ctx, this.viewportTransform);

					for (let i = 0, len = objects.length; i < len; ++i) {
						objects[i] && objects[i].render(ctx);
					}

					ctx.restore();
					let path = this.clipPath;
					if (path) {
						path.canvas = this;
						// needed to setup a couple of variables
						path.shouldCache();
						path._transformDone = true;
						path.renderCache({forClipping: true});
						this.drawClipPathOnCanvas(ctx);
					}
				}
			}
		}
	}
}
