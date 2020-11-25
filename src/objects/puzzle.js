// bug: shpuld be included before image crop. afterrender overrides
// import ObjectRender from "./object.render.js";

import {camelize} from "../../util/string.js";

/**
 * puzzle
 *  {
		spacingX: 0,
		spacingY: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		marginBottom: 0,
		overflow: true,
		rows: 0,
		columns: 0,
		offsetX: 0,
		offsetY: 0,
		data: {}
	}
 */


// https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern/setTransform
let properties = ["puzzle","puzzleAlpha","puzzleOverflow","puzzleSpacing","puzzleTransform"]

export const FmTiles = {
	name: "puzzle",
	prototypes: {
		Object: {
			"+actions": {
				puzzleNone: {
					observe: "modified",
					title: "none",
					option: "none",
					variable: "puzzlePreset",
					className: "fa fa-undo"
				},
				puzzleCustom: {
					enabled: "puzzlePreset === 'custom'",
					observe: "modified",
					title: "custom",
					option: "custom",
					variable: "puzzlePreset",
					className: "fi fi-tiles-custom"
				},
				puzzleBasic: {
					observe: "modified",
					title: "basic",
					option: "basic",
					variable: "puzzlePreset",
					className: "fi fi-tiles-basic fi-large"
				},
				puzzleHalfBrick: {
					observe: "modified",
					title: "half-brick",
					option: "halfBrick",
					variable: "puzzlePreset",
					className: "fi fi-tiles-bricks fi-large"
				},
				puzzleHalfDrop: {
					observe: "modified",
					title: "half-drop",
					option: "halfDrop",
					variable: "puzzlePreset",
					className: "fi fi-tiles-drop fi-large"
				},
				puzzle: {
					className: "fi fi-patterns fi-large",
					title: "tiling",
					variable: "puzzlePreset",
					observe: "modified",
					popupWidth: 160,
					subMenuClassName: "fiera-puzzle-menu",
					menu: [
						"puzzleBasic","puzzleHalfBrick","puzzleHalfDrop", "puzzleNone",
						"puzzleSpacingRange",
						"puzzleSpacingNumber"
					]
				},
				puzzleSpacingRange: {
					width: 118,
					visible: "puzzle",
					showLabel: true,
					showButton: false,
					itemClassName: "fiera-tool-range",
					className: "fi fi-tiles-padding",
					title: "Spacing",
					variable: "puzzleSpacing",
					observe: "modified",
					type: "range",
					min: 0,
					max: 500,
					step: 1,
				},
				puzzleSpacingNumber: {
					width: 38,
					visible: "puzzle",
					showButton: false,
					itemClassName: "fiera-tool-range-number",
					title: "tiling spacing",
					variable: "puzzleSpacing",
					observe: "modified",
					type: "number",
					min: 0,
					max: 500,
					step: 1,
				}
			},
			"+storeProperties": ["puzzle","puzzleAlpha","puzzleOverflow","puzzleSpacing","puzzleTransform","puzzleSpacingX","puzzleSpacingY"],
			"+cacheProperties": ["puzzle","puzzleAlpha","puzzleOverflow","puzzleSpacing","puzzleTransform","puzzleSpacingX","puzzleSpacingY"],
			// "+beforeRender":["renderTiling"],
			puzzle: null,
			puzzleAlpha: 1,
			puzzleSize: false,
			puzzleTransform: null,
			puzzleOverflow: "visible",
			puzzlePresets: {
				none: false,
				basic: {},
				halfBrick: {
					offsetsY: [{x: 0.5, y: 1},{x: -0.5, y: 1}]
				},
				halfDrop: {
					offsetsX: [{x: 1, y: 0.5},{x: 1, y: -0.5}]
				}
			},
			maxPuzzleSpacing: 2,
			minPuzzleSpacing: 0,
			puzzleSpacingX: 0,
			puzzleSpacingY: 0,
			getPuzzleSpacing() {
				if(this.puzzleSpacingX || this.puzzleSpacingY){
					return this.puzzleSpacingX === this.puzzleSpacingY ? this.puzzleSpacingX : (this.puzzleSpacingX + this.puzzleSpacingY)/2
				}
				return 0
			},
			setPuzzleSpacing(value) {
				this.puzzleSpacingX = value
				this.puzzleSpacingY = value
				this._update_puzzle();
			},
			setPuzzleSpacingX(value) {
				this.puzzleSpacingX = value;
				this._update_puzzle();
			},
			setPuzzleSpacingY(value) {
				this.puzzleSpacingY = value;
				this._update_puzzle();
			},
			setPuzzle(value){
				this.saveStates(["puzzle"]);
				if(!value){
					this.puzzlePreset = "none"
				}
				else{
					this.puzzlePreset = "custom"
				}
				this.puzzle = value;
				this._update_puzzle();
				this.on("added modified scaling loaded moving rotating","updateTiling")
				this.updateState()
			},
			setPuzzlePreset (value){
				let puzzlePreset = camelize(value);
				this.setPuzzle(this.puzzlePresets[puzzlePreset])
				this.puzzlePreset = puzzlePreset
			},
			_update_puzzle (){
				delete this._puzzles;
				// this.dirty = true;
				// this.saveStates(["puzzle"])
				let value = fabric.util.object.clone(this.puzzle,true);
				if(value){
					if(!value.offsetsY){
						value.offsetsY = [{x: 0, y: 1}]
					}
					if(!value.offsetsX){
						value.offsetsX = [{x: 1, y: 0}]
					}

					let sizeX = this.puzzleSize && this.puzzleSize.width || this.width - 0.0
					let sizeY = this.puzzleSize && this.puzzleSize.height || this.height- 0.0

					let spacingX = this.puzzleSpacingX / (sizeX * this.scaleX)
					let spacingY = this.puzzleSpacingY / (sizeY * this.scaleY)

					if(this.puzzleSpacingX | this.puzzleSpacingY ){
						for(let i = 0 ;i < value.offsetsY.length; i ++){
							value.offsetsY[i].y += spacingY
							value.offsetsY[i].x  *= 1 + spacingX
						}
						for(let i = 0 ;i < value.offsetsX.length; i ++){
							value.offsetsX[i].x += spacingX
							value.offsetsX[i].y *= 1 + spacingY
							// value.offsetsX[i].X += spacingX/2
						}
					}
				}

				this._puzzleOptions = value;

				// this._set("_puzzleOptions",value)
				// // this.fire("modified", {});
				// if (this.canvas) {
				// 	this.canvas.fire("object:modified", {target: this});
				// 	this.canvas.renderAll();
				// }
				// //todo use "set" function



				if (this.canvas) {
					this.updateTiling();
					this.setClipPath(this.__clipPath); // todo костыль
					// this.canvas.renderAll();
				}
			},
			render_overwritten: fabric.Object.prototype.render,
			// isPuzzleOnScreen (x = 0, y = 0) {
			// 	let br = this._calc.br, tl = this._calc.tl
			//
			//
			// 	let offset = this._getPuzzleOffset(x,y,true)
			//
			// 	let points = this._calc.points.map(point => {
			// 		return {x: point.x + offset.x, y:  point.y + offset.y }
			// 	})
			//
			//
			// 	if(this.puzzleOverflow === 'hidden'){
			// 		for (let point of points) {
			// 			if (point.x > br.x || point.x <= tl.x || point.y > br.y || point.y < tl.y) {
			// 				return false
			// 			}
			// 		}
			// 		return trueff
			// 	}
			//
			// 	for (let point of points) {
			// 		if (point.x <= br.x && point.x >= tl.x && point.y <= br.y && point.y >= tl.y) {
			// 			return true
			// 		}
			// 	}
			//
			// 	// no points on screen, check intersection with absolute coordinates
			// 	let intersection = fabric.Intersection.intersectPolygonRectangle(points, tl, br)
			//
			// 	if(intersection.status === 'Intersection'){
			// 		return true
			// 	}
			//
			// 	// worst case scenario the object is so big that contains the screen
			// 	let point = { x: (tl.x + br.x) / 2, y: (tl.y + br.y) / 2 }
			//
			// 	//this.containsPoint
			// 	let lines = this._getImageLines({tl: points[0],tr: points[1],br: points[2],bl: points[3]})
			// 	let	xPoints = this._findCrossPoints(point, lines)
			// 	// if xPoints is odd then point is inside the object
			// 	let areaCenterpointIsInsidePuzzle = (xPoints !== 0 && xPoints % 2 === 1)
			// 	if(areaCenterpointIsInsidePuzzle){
			// 		return true;
			// 	}
			// 	return false
			// },
			_getPuzzleOffset( px, py , absolute ){
				let x = 0, y = 0
				let xv = absolute? this._calc.xvectorsAbs: this._calc.xvectorsRel
				let yv = absolute? this._calc.yvectorsAbs: this._calc.yvectorsRel
				if(xv.length === 1){
					x += xv[0].x * px
					y += xv[0].y * px
				}
				else{
					if(px > 0) {
						for (let i = 0; i < px; i++) {
							x += xv[i % xv.length].x
							y += xv[i % xv.length].y
						}
					}else{
						for (let i = 0; i < -px; i++) {
							x -= xv[i % xv.length].x
							y -= xv[i % xv.length].y
						}
					}
				}
				if(yv.length === 1){
					x += yv[0].x * py
					y += yv[0].y * py
				}
				else{
					if(py > 0){
						for(let i = 0; i < py; i++){
							x += yv[i % yv.length].x
							y += yv[i % yv.length].y
						}
					}
					else{
						for(let i = 0; i < -py; i++){
							x -= yv[i % yv.length].x
							y -= yv[i % yv.length].y
						}
					}
				}

				return {x,y}
			},
// 			renderTiles2(ctx) {
// 				let puzzles = this._puzzles
// 				if(!puzzles)return
//
//
// 				let ymin = Infinity, xmin = Infinity, xmax= -Infinity, ymax = -Infinity
// 				for(let row of puzzles) {
// 					for (let item of row.items) {
// 						if(item.point.y < ymin)ymin = item.point.y
// 						if(item.point.y > ymax)ymax = item.point.y
// 						if(item.point.x < xmin)xmin = item.point.x
// 						if(item.point.x > xmax)xmax = item.point.x
// 					}
// 				}
// 				ymin -= this.height
// 				ymax += this.height
// 				xmin -= this.width
// 				xmax += this.width
//
// 				if(!this._puzzleCache){
// 					this._puzzleCache = fabric.util.createCanvasElement();
// 					this._puzzleCacheContext = this._puzzleCache.getContext('2d')
// 				}
// 				this._puzzleCache.width = xmax - xmin
// 				this._puzzleCache.height = ymax - ymin
// 				this._puzzleCacheContext.translate(-xmin,-ymin)
//
// 				let ctx2 = this._puzzleCacheContext;
// 				let index = 0;
// 				for(let row of puzzles) {
// 					for (let item of row.items) {
// 						// if(item.x === 0 && row.y === 0 ){
// 						// 	continue;
// 						// }
// 						ctx2.save()
// 						ctx2.translate(item.point.x,item.point.y)
// // 						if(this._cacheCanvas){
// // 							this.drawCacheOnCanvas(ctx2);
// // 						}
// // 						else{
// 						this.drawObject(ctx2)
// // 						}
// 						ctx2.restore()
// 						index++
// 					}
// 				}
// 				ctx.translate(xmin,ymin)
// 				ctx.drawImage(this._puzzleCache,0,0)
// 			},
			renderTiles(ctx) {
				if(!this.puzzle)return
				// let canvasTransform = ctx.getTransform();
				ctx.save()
				ctx.setTransform(1,0,0,1,0,0)

				//TODO!!!!!
				// let clipPath = this.clipPath;
				// delete this.clipPath
				if(!this._tileContext){
					this._tileCanvas = fabric.util.createCanvasElement();
					this._tileContext = this._tileCanvas.getContext('2d')
					this._tileBufferCanvas = fabric.util.createCanvasElement();
					this._tileBufferContext = this._tileBufferCanvas.getContext('2d')
				}

				this._tileBufferCanvas.width = this._tileCanvas.width = this._calc.tilesWidth * this.scaleX
				this._tileBufferCanvas.height = this._tileCanvas.height = this._calc.tilesHeight * this.scaleY
				//this._tileContext.scale(this.scaleX,this.scaleY)
				//this._tileContext.translate(this.width/2,this.height/2)
				this._tileBufferContext.scale(this.scaleX,this.scaleY)
				this._tileBufferContext.translate(this.width/2,this.height/2)


				let offsetsY = this._puzzleOptions.offsetsY.length
				let offsetsX = this._puzzleOptions.offsetsX.length


				let x= 0, y = 0;
				for(y = -offsetsY ;y < offsetsY * 2; y++) for (x = -offsetsX; x < offsetsX * 2; x++) {
					let offset = this._getPuzzleOffset(x, y)

					this._tileBufferContext.save();
					// Use the identity matrix while clearing the canvas
					this._tileBufferContext.setTransform(1, 0, 0, 1, 0, 0);
					this._tileBufferContext.clearRect(0,0,this._tileBufferCanvas.width,this._tileBufferCanvas.height)
					// Restore the transform
					this._tileBufferContext.restore();
					this._tileBufferContext.save()
					this._tileBufferContext.translate(offset.x,offset.y)
					this.drawObject(this._tileBufferContext,false,[]);
					this._tileContext.drawImage(this._tileBufferCanvas,0,0)
					this._tileBufferContext.restore();
				}





				// this.clipPath = clipPath

				// 		for(let y =0 ;y < this._puzzleOptions.offsetsY.length; y++) {
				// 			for (let x = 0; x < this._puzzleOptions.offsetsX.length; x++) {
				// 				let offset = this._getPuzzleOffset(x,y,true)
				// 				// rotate(${this.angle}) translate(${offset.x} ${offset.y})
				//
				// 				let matrix = this.calcOwnMatrix().slice();
				//
				// 				matrix[4] += offset.x - this.width/2
				// 				matrix[5] += offset.y - this.height/2
				// 				let svgTransform = fabric.util.matrixToSVG(matrix);
				//
				// 				markup += `
				//   <pattern id="tile-${this.id}-${x}-${y}" x="0" y="0" width="${tilesWidth}" height="${tilesHeight}" patternUnits="userSpaceOnUse" patternTransform="${svgTransform}">
				// 	<g transform="translate(${this.width/2} ${this.height/2})">
				// 	  ${baseMarkup}
				// 	</g>
				//   </pattern>
				//   <rect x="0" y="0" width="100%" height="100%" fill="url(#tile-${this.id}-${x}-${y})"/>



				// todo dirty stuff
				// this.drawObject(this._tileContext)
				// fabric.util.bufferDrawObject.call(this, this._tileContext, false, []);

				let rectWidth = this._calc.width
				let rectHeight = this._calc.height
				let rectLeft
				let rectTop

				let transform
				if(this.group){

					ctx.translate(
						ctx.canvas.width /2  - this.group.width * this.group.scaleX / 2,
						ctx.canvas.height /2  - this.group.height * this.group.scaleY / 2)
					// transform = this.group.calcOwnMatrix()
					transform = [this.group.scaleX,0,0,this.group.scaleY,0,0]
					//transform = [this.group.scaleX,0,0,this.group.scaleY,0,0]

					// console.log(transform)


// 					rectLeft = this.group.cacheTranslationX * this.group.scaleX
// 					rectTop = this.group.cacheTranslationY * this.group.scaleY

				}
				else{
					transform = this.canvas.viewportTransform;
					rectLeft = 0
					rectTop = 0
				}

				let MatrixClass = fabric.Node && fabric.Node.DOMMatrix || DOMMatrix
				let matrix = new MatrixClass(transform);
				let pattern = ctx.createPattern(this._tileCanvas, 'repeat');

				if(!this.canvas.__forExport){
					matrix = matrix.scale(fabric.devicePixelRatio)
				}
				matrix = matrix.translate(this.left,this.top).rotate(this.angle)

				if(this.originY === "center"){
					matrix = matrix.translate( this.height/2 *this.scaleX, 0)
				}
				if(this.originX === "center"){
					matrix = matrix.translate( 0, this.width/2 *this.scaleY)
				}
				matrix =  matrix.skewX(this.skewX).skewY(this.skewY)



				pattern.setTransform(matrix)

				ctx.fillStyle = pattern;
				ctx.fillRect(0,0, rectWidth, rectHeight);


				ctx.restore()
			},
			// renderTiles0(ctx) {
			// 	if(!this._puzzles)return
			//
			// 	let index = 0;
			// 	let puzzles = this._puzzles
			// 	for(let row of puzzles) {
			// 		for (let item of row.items) {
			// 			if(item.x === 0 && row.y === 0 ){
			// 				continue;
			// 			}
			// 			ctx.save()
			// 			ctx.translate(item.point.x,item.point.y)
			// 			if(this._cacheCanvas){
			// 				this.drawCacheOnCanvas(ctx);
			// 			}
			// 			else{
			// 				this.drawObject(ctx)
			// 			}
			// 			ctx.restore()
			// 			index++
			// 		}
			// 	}
			// },
			// "+afterRender": ["renderTiles"],
			_tiles: null,
			/**
			 * Renders an object on a specified context
			 * @param {CanvasRenderingContext2D} ctx Context to render on
			 */
			// forceUpdateTiling () {
			// 	for(let y in this._tiles){
			// 		for(let x in this._tiles[y]){
			// 			this._tiles[y][x].removeFromCanvas();
			// 		}
			// 	}
			// 	delete this._tiles
			// 	this.updateTiling();
			// },

			// _renderRow(startX, y){
			// 	let puzzles = []
			// 	let x = startX - 1
			// 	let missed = 0
			// 	while(missed < this._puzzleOptions.offsetsX.length + 1){
			//
			// 		if(this.isPuzzleOnScreen(x, y)){
			// 			missed = 0
			// 			let data = this._getPuzzleOffset(x,y,false)
			// 			puzzles.push({x: x, point: data})
			// 		}
			// 		else{
			// 			//TODO we should do better math and do not add puzzles which might be out of screen! buT HERE IS A BUG ON PRODUT PREVIEW
			// 			{
			// 				let data = this._getPuzzleOffset(x,y,false)
			// 				puzzles.push({x: x, point: data})
			// 			}
			// 			missed++
			// 		}
			// 		x--
			// 	}
			// 	x = startX
			// 	missed = 0
			// 	while(missed < this._puzzleOptions.offsetsY.length + 1){
			// 		if(this.isPuzzleOnScreen(x, y)){
			// 			missed = 0
			// 			let data = this._getPuzzleOffset(x,y,false)
			// 			puzzles.push({x: x, point: data})
			// 		}
			// 		else{
			// 			//TODO
			// 			{
			// 				let data = this._getPuzzleOffset(x,y,false)
			// 				puzzles.push({x: x, point: data})
			// 			}
			// 			missed++
			// 		}
			// 		x++
			// 	}
			// 	return puzzles
			// },
			updateTiling () {
				if(!this._puzzleOptions) {
					return
				}
				if(!this._tiles){
					this._tiles = []
				}

				let points = this.getCoords(true, true)
				let dxAbs = {x: points[1].x - points[0].x, y: points[1].y - points[0].y }
				let dyAbs = {x: points[3].x - points[0].x, y: points[3].y - points[0].y }

				let sizeX = this.puzzleSize && this.puzzleSize.width || this.width  //* this.scaleX
				let sizeY = this.puzzleSize && this.puzzleSize.height || this.height  // * this.scaleY

				let dxRel = {x: sizeX, y: 0}
				let dyRel = {x:0, y: sizeY }

				let xvectorsAbs = []
				let yvectorsAbs = []
				let xvectorsRel = []
				let yvectorsRel = []

				this._puzzleOptions.offsetsX.forEach(offset => {
					xvectorsAbs.push({
						x: Math.floor(dxAbs.x * offset.x + dyAbs.x * offset.y),
						y: Math.floor(dxAbs.y * offset.x + dyAbs.y * offset.y)
					})
					xvectorsRel.push({
						x: Math.floor(dxRel.x * offset.x),
						y: Math.floor(dxRel.y + dyRel.y * offset.y)
					})
				})

				this._puzzleOptions.offsetsY.forEach(offset => {
					yvectorsAbs.push({
						x: Math.floor(dxAbs.x * offset.x + dyAbs.x * offset.y),
						y: Math.floor(dxAbs.y * offset.x + dyAbs.y * offset.y)
					})
					yvectorsRel.push({
						x: Math.floor(dyRel.x + dxRel.x * offset.x),
						y: Math.floor(dyRel.y * offset.y)
					})
				})


				// fabric.Intersection.intersectPolygonPolygon
				let t,l,w,h;

				if(this.group){
					l = 0
					t = 0
					w = this.group.width *  this.group.scaleX
					h = this.group.height *  this.group.scaleY
				}
				else{
					l = 0
					t = 0
					w = this.canvas.getOriginalWidth()
					h = this.canvas.getOriginalHeight()
				}

				// for(let y in this._tiles){
				// 	for(let x in this._tiles[y]){
				// 		this._tiles[y][x].visible = false;
				// 	}
				// }

				this._calc = {
					left: l,
					top: t,
					width: w,
					height: h,
					// tl: this.canvas.vptCoords.tl,
					// br: this.canvas.vptCoords.br,
					// tr: this.canvas.vptCoords.tr,
					// bl: this.canvas.vptCoords.bl,
					tl: new fabric.Point(l, t),
					br: new fabric.Point(w, h),
					tr: new fabric.Point(w, t),
					bl: new fabric.Point(l, h),
					points: points,
					xvectorsAbs,
					yvectorsAbs,
					xvectorsRel,
					yvectorsRel,
					tilesWidth: xvectorsRel.reduce((acc,cur) => acc + cur.x,0),
					tilesHeight: yvectorsRel.reduce((acc,cur) => acc + cur.y,0)
				}


				// let y = 0;
				// let puzzles = []

				// let renderNext = true

				// puzzles.push({y: 0 , items: this._renderRow(0, 0)})

				// y = 1
				// do {
				// 	renderNext = false
				// 	if (puzzles[y - 1].items.length) {
				// 		for (let x = puzzles[y - 1].items[0].x - 1; x <= puzzles[y - 1].items.slice(-1)[0].x; x++) {
				// 			if (this.isPuzzleOnScreen(x, y )) {
				// 				puzzles.push({y: y , items: this._renderRow(x, y)})
				// 				y ++
				// 				renderNext = true
				// 				break
				// 			}
				// 		}
				// 	}
				// }while(renderNext)
				//
				// y = -1
				// do {
				// 	renderNext = false
				// 	if (puzzles[0].items.length) {
				// 		for (let x = puzzles[0].items[0].x - 1; x < puzzles[0].items.slice(-1)[0].x; x++) {
				// 			if (this.isPuzzleOnScreen(x, y )) {
				// 				puzzles.unshift({y: y , items: this._renderRow(x, y)})
				// 				y --
				// 				renderNext = true
				// 				break
				// 			}
				// 		}
				// 	}
				// } while (renderNext)

				// let originalText = this.text

				// let _alpha = ctx.globalAlpha
				// ctx.globalAlpha *= this.puzzleAlpha;

				// this._puzzles = puzzles

				// if (this.shouldCache()) {
				// 	this.renderCache()
				// 	this.drawCacheOnCanvas(ctx)
				// }
				// else {
				// 	this._removeCacheCanvas()
				// 	this.dirty = false
				// 	this.drawObject(ctx)
				// 	if (this.objectCaching && this.statefullCache) {
				// 		this.saveState({ propertySet: 'cacheProperties' })
				// 	}
				// }
				// this.clipTo && ctx.restore()
				// ctx.restore()
				// this.canvas.requestRenderAll();
			}
		},
		Image: {
			"+storeProperties": properties
		},
		Text: {
			"+storeProperties": properties
		},
		Group: {
			"+cacheProperties": properties
		}
	}
}
