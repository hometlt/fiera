/**
 * Free Transform Tool plugin for FabricJS
 * =======================================
 *
 * Free transform is a very versatile tool that comes in very handy, especially with photo manipulations.
 * Its one little function that can do several things to your images and cut outs.
 * Written with WebGL to achieve better performance and better output
 *
 * Skew
 * ----
 * Dragging the corners around after activating will alter the frame only according to that particular point.
 * The layer will alter itself accordingly to fill the frame making the image in the layer skew.
 * This will help you stretch the layer in any one particular direction giving it a skewed shape.
 *
 * Distort
 * -------
 * Distort works similar to skew, the biggest difference is that dragging the edges in skew will only shift the layer edge up and down.
 * But in distort. you can even stretch and compress.
 *
 * Warp
 * ----
 * It can alter the layer however you want.
 * You can click and drag around any point to alter the layer.
 * You can add additional points and apply Bezier Curve effect
 *
 * alternatives
 * ------------
 * - Transformation with 4 points: http://jsfiddle.net/mrbendel/6rbtde5t/1/
 * - 3D perspective with JsGL: http://tulrich.com/geekstuff/canvas/perspective.html
 *
 * Running on NodeJS
 * -----------------
 *
 * Install GL https://github.com/stackgl/headless-gl
 *
 */
// https://github.com/stackgl/headless-gl
// GPGPU computations using shaders.
// https://habr.com/ru/post/346268/

import {FmControls} from "../canvas/controls.js"
import {ShapeMixin} from "../mixins/shapeMixin.js"
import {BezierMixin} from "../mixins/bezierMixin.js"
import "../util/gl.js"
import Bezier from "./../../plugins/bezier.js"
import {getBasisTransformMatrix} from "../util/matrix.js"
import {deepClone} from "../util/util.js"
import {closestPointBetween2D } from "../util/geometry.js"
import {FmWebGL} from "../modules/webgl.js";

/**
 * Warp Object for FabricJS Library.
 * Allo
 * @type {klass}
 */
export const FmWarp = {
	name: "warp",
	deps: [FmWebGL],
	// nodeDeps: [WebGL],
	// nodeDeps: [NodeWebGL],
	prototypes: {
		Warp: {
			type: 'warp',
			prototype: [ fabric.Image, ShapeMixin, BezierMixin],
			hasRotatingPoint: false,
			hasBoundControls: false,
			hasTransformControls: true,
			hasBoundsControls: false,
			// stroke: "black",
			"+stateProperties": ["points", "transformations"],
			wireframe: false,
			fill: "transparent",
			subdivisions: 50,
			webgl: true,
			transformations: false,
			points: false,
			fillColor: "rgba(0,0,0,0)",
			texColor: "rgba(0,0,255,1)",
			_sides: [{name: "AB", a: 0, b: 1}, {name: "BC", a: 1, b: 2}, {name: "DC", a: 3, b: 2}, {name: "AD", a: 0, b: 3}],
			initialize: function (options, callback) {
				options || (options = {})

				if (!options.transformations) {
					options.transformations = [
						[], //AB points
						[], //BC points
						[], //CD points
						[]  //DA points
					]
				}
				if (options.points) {
					this.width = 0
					this.height = 0
				} else {
					options.points = false
				}

				if(options.webgl !== undefined){
					this.webgl = options.webgl
					delete options.webgl;
				}

				if (this.webgl) {
					let gl = fabric.webgl.createContext(Math.ceil(this.width) || 100,Math.ceil(this.height) || 100,{preserveDrawingBuffer : true})
					if(gl){

						let color = new fabric.Color(this.texColor)._source;
						this.webgl = {
							context: gl,
							texture: fabric.util.gl.createTexture(gl, color),
							positionBuffer: gl.createBuffer(),
							indexBuffer: gl.createBuffer(),
							textureCoordBuffer: gl.createBuffer(),
							shaderProgram: fabric.util.gl.standartShaderProgram(gl),
						}
					}
					else{
						this.webgl = false
					}

				}

				this._corner_actions = this._corner_actions || {}
				this._corner_actions.curve = "curve"
				this.callSuper('initialize', options, callback)



				this.indicesArray = this.calculateIndicesArray(this.subdivisions, this.subdivisions)
				this.textureCoordArray = this.calculateTextureCoordArray(this.subdivisions, this.subdivisions)


				if (this.webgl) {
					let magicNumber = 2;
					let gl = this.webgl.context

					let zoom = this.canvas && this.canvas.getZoom() || 1;
					fabric.webgl.resizeContext(gl,
						Math.ceil(this.width * zoom) * magicNumber ,
						Math.ceil(this.height * zoom) * magicNumber)

					gl.enable(gl.BLEND)
					gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
					gl.useProgram(this.webgl.shaderProgram)

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl.indexBuffer)
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indicesArray), gl.STATIC_DRAW)

					gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl.textureCoordBuffer)
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordArray), gl.STATIC_DRAW)

					let uGlobalColor = gl.getUniformLocation(this.webgl.shaderProgram, "uGlobalColor")
					gl.uniform4fv(uGlobalColor, [0, 0, 0, 0])

					// Tell WebGL we want to affect texture unit 0. Bind the texture to texture unit 0.
					// Tell the shader we bound the texture to texture unit 0
					gl.activeTexture(gl.TEXTURE0)
					gl.bindTexture(gl.TEXTURE_2D, this.webgl.texture)
					gl.uniform1i(gl.getUniformLocation(this.webgl.shaderProgram, "uSampler"), 0)
					// let resolutionUniformLocation = gl.getUniformLocation(this.webgl.shaderProgram, "uResolution")
					// gl.uniform2f(resolutionUniformLocation, this.width, this.height)

					//gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

				}
				this.calculateGeometry();
			},
			getTransformStoredProperties() {
				switch (this.canvas._currentTransform.action) {
					case "subshape":
					case "shape":
						return ["left", "top", "width", "height", "transformations", "points"]
					default:
						return ["left", "top", "width", "height", "scaleX", "scaleY", "skewX", "skewY"]
				}
			},
		  	getTransformations() {
				if (this.transformations) {
					return this.transformations.map(subtransforms => subtransforms.map(transform => ({
						x: transform.x,
						y: transform.y,
						t: transform.t,
						c: transform.c || 0
					})))
				}
			},
			setTransformations: function (points) {
				delete this.activeCorner
				if (!points) {
					this.transformations = [[], [], [], []]
				} else {
					this.transformations = deepClone(points)
				}
				if (this.points) {
					this.calculateGeometry()
					this.updateBbox()
					this.dirty = true
					this.canvas && this.canvas.renderAll()
				}
			},
			setPoints: function (points) {
				points = deepClone(points)
				if (!points) {
					points = [
						{x: 0, y: 0},
						{x: this.width, y: 0},
						{x: this.width, y: this.height},
						{x: 0, y: this.height}
					]
				} else if (points[0] !== undefined && points[0].x === undefined) {
					let _NEW_points = []
					for (let i = 0; i < points.length; i += 2) {
						_NEW_points.push({x: points[i], y: points[i + 1]})
					}
					points = _NEW_points
				}
				this.points = [].concat(points)
				if (this.transformations) {
					this.calculateGeometry()
					this.updateBbox()
				}
				this.dirty = true
				this.canvas && this.canvas.renderAll()
			},
			setElement(element) {
				// if(!element && !this._element){
				// 	return;
				// }
				this.saveStates(["element", "src"])
				if (!this.filters) {
					this.filters = []
				}
				fabric.Image.prototype.setElement.call(this, element, {width: this.width, height: this.height})




				if(!element){
					element = fabric.util.createCanvasElement();
					element.width = 1;
					element.height = 1;
				}
				if (this.webgl) {

					if(fabric.isLikelyNode){
						let output = fabric.util.createCanvasElement(element.width, element.height);
						let ctx = output.getContext('2d');
						ctx.drawImage(element, 0, 0);
						let imageData = ctx.getImageData(0, 0, element.width, element.height);
						fabric.util.gl.setTextureImage(this.webgl.context, this.webgl.texture, imageData )
					}
					else{
						fabric.util.gl.setTextureImage(this.webgl.context, this.webgl.texture, element )
					}
				}
				this.updateState()
			},
			setWidth (val) {
				let scale = val / this.width
				if (this.points) {
					for (let point of this.points) {
						point.x *= scale
					}
				}
				if (this.transformations) {
					for (let i in this.transformations) {
						for (let j in this.transformations[i]) {
							this.transformations[i][j].x *= scale
						}
					}
				}
				this.width = val
				this.canvas && this.setCoords()
				this.dirty = true
				this.fire("resized")
			},
			setHeight (val) {
				let scale = val / this.height

				if (this.points) {
					for (let point of this.points) {
						point.y *= scale
					}
				}
				if (this.transformations) {
					for (let i in this.transformations) {
						for (let j in this.transformations[i]) {
							this.transformations[i][j].y *= scale
						}
					}
				}
				this.height = val
				this.canvas && this.setCoords()
				this.dirty = true
				this.fire("resized")
			},
			/***********************************************************************************************************************
   			geometry calculation section
			 ***********************************************************************************************************************/
			_getAngle(v) {
				if (v.x < 0) {
					return Math.PI - Math.atan(v.y / -v.x)
				} else {
					return Math.atan(v.y / v.x)
				}
			},
			_getDeformationPointByT(s, t) {
				if (t === 0) return {x: 0, y: 0}
				if (t === 1) return {x: 0, y: 0}
				let side = this._sides[s]

				let subpoints = this.transformations[s]
				if (!subpoints.length) return {x: 0, y: 0}
				let points = this._calc.sidepoints[s]


				let currentT = 0
				let i = 0
				while (currentT <= t) {
					i++
					if (i === points.length) break
					currentT = points[i].t
				}
				let A = points[i - 1]
				let B = points[i]
				let pointT, point

				if (A.c && B.c) {
					let curve
					let localT = (t - A.t) / (B.t - A.t)
					if (localT < 0.5) {
						curve = A.curve
						localT += 0.5
					} else {
						curve = B.curve
						localT -= 0.5
					}
					pointT = curve.compute(localT)
				} else if (A.c || B.c) {
					let C1, C2, C3, curve
					if (A.c) {
						curve = A.curve
						C1 = points[i - 2]
						C2 = A
						C3 = B
					} else {
						curve = B.curve
						C1 = A
						C2 = B
						C3 = points[i + 1]
					}
					let localT = (t - C1.t) / (C3.t - C1.t)
					pointT = curve.compute(localT)
				} else {
					let localT = (t - A.t) / (B.t - A.t)
					pointT = {
						x: A.x + (B.x - A.x) * localT,
						y: A.y + (B.y - A.y) * localT
					}
				}

				let borderPoint = {
					x: points[0].x + (points[points.length - 1].x - points[0].x) * t,
					y: points[0].y + (points[points.length - 1].y - points[0].y) * t
				}
				let difference = {x: pointT.x - borderPoint.x, y: pointT.y - borderPoint.y}
				//get angle between vectors
				let v = this._calc.vectors[side.name]
				let angle = -this._getAngle(v)
				point = fabric.util.rotateVector(difference, angle)
				point.x /= this._calc.length[side.name]
				point.y /= this._calc.length[side.name]

				return point
			},
			_calcBorderPoint(side, t) {
				switch (side) {
					case "AB":
						return {x: this._calc.vectors.AB.x * t + this._calc.A.x, y: this._calc.vectors.AB.y * t + this._calc.A.y}
					case "DC":
						return {x: this._calc.vectors.DC.x * t + this._calc.D.x, y: this._calc.vectors.DC.y * t + this._calc.D.y}
					case "AD":
						return {x: this._calc.vectors.AD.x * t + this._calc.A.x, y: this._calc.vectors.AD.y * t + this._calc.A.y}
					case "BC":
						return {x: this._calc.vectors.BC.x * t + this._calc.B.x, y: this._calc.vectors.BC.y * t + this._calc.B.y}
				}
			},
			_calculateControls() {
				let sides = ["AB", "BC", "DC", "AD"]
				for (let s in sides) {
					for (let i in this.transformations[s]) {
						let localPoint = this.transformations[s][i]
						this._calc.glCoordsTransformations[s].push(localPoint)
						this._calc.localCoordsTranformations[s].push(localPoint)
					}
				}
			},
			calculateGeometry() {
				let divisions = this.subdivisions + 1
				let tArray = []
				let p = this.points
				let A = p[0], B = p[1], C = p[2], D = p[3]

				this._calc = {
					length: {
						AB: new fabric.Point(p[0].x, p[0].y).distanceFrom(p[1]),
						BC: new fabric.Point(p[1].x, p[1].y).distanceFrom(p[2]),
						DC: new fabric.Point(p[2].x, p[2].y).distanceFrom(p[3]),
						AD: new fabric.Point(p[3].x, p[3].y).distanceFrom(p[0])
					},
					A: A,
					B: B,
					C: C,
					D: D,
					glCoordsTransformations: [[], [], [], []],
					localCoordsTranformations: [[], [], [], []],
					points: [],
					vectors: {
						AB: {x: B.x - A.x, y: B.y - A.y},
						BC: {x: C.x - B.x, y: C.y - B.y},
						DC: {x: C.x - D.x, y: C.y - D.y},
						AD: {x: D.x - A.x, y: D.y - A.y}
					},
					relValues: {
						AB: [],
						BC: [],
						DC: [],
						AD: []
					},
					basis: [
						getBasisTransformMatrix({x: 0, y: 0}, {x: 1, y: 0}, A, B, true),
						getBasisTransformMatrix({x: 0, y: 0}, {x: 1, y: 0}, B, C, true),
						getBasisTransformMatrix({x: 0, y: 0}, {x: 1, y: 0}, D, C, true),
						getBasisTransformMatrix({x: 0, y: 0}, {x: 1, y: 0}, A, D, true)
					],
					sidepoints: []
				}

				//calcualate values for each t .
				for (let i = 0; i < divisions; i++) {
					let t = i / this.subdivisions
					tArray.push(t)
					for (let s in this._sides) {
						let side = this._sides[s]

						let sidepoints = this._calc.sidepoints[s] = [
							{t: 0, x: this.points[side.a].x, y: this.points[side.a].y},
							...this.transformations[s],
							{t: 1, x: this.points[side.b].x, y: this.points[side.b].y}]

						for (let i = 0; i < sidepoints.length; i++) {

							let M = sidepoints[i]
							if (M.c) {
								let L = sidepoints[i - 1]
								let N = sidepoints[i + 1]
								let C1 = L.c ? {x: (L.x + M.x) / 2, y: (L.y + M.y) / 2} : L
								let C3 = N.c ? {x: (N.x + M.x) / 2, y: (N.y + M.y) / 2} : N
								M.curve = Bezier.quadraticFromPoints(C1, M, C3)
							}
						}
						this._calc.relValues[this._sides[s].name].push(this._getDeformationPointByT(s, t))
					}
				}

				let ix, iy
				for (iy = 0; iy < divisions; iy++) {
					let k = tArray[iy]
					let ABPoint = this._calcBorderPoint("AB", k)
					let DCPoint = this._calcBorderPoint("DC", k)
					let kl = new fabric.Point(ABPoint.x, ABPoint.y).distanceFrom(DCPoint)
					let ADVectorAngle = this._getAngle({x: DCPoint.x - ABPoint.x, y: DCPoint.y - ABPoint.y})
					for (ix = 0; ix < divisions; ix++) {
						let t = tArray[ix]
						let ADPoint = this._calcBorderPoint("AD", t)
						let BCPoint = this._calcBorderPoint("BC", t)
						let tl = new fabric.Point(ADPoint.x, ADPoint.y).distanceFrom(BCPoint)
						let ABVectorAngle = this._getAngle({x: BCPoint.x - ADPoint.x, y: BCPoint.y - ADPoint.y})
						let ABCalcPoint = fabric.util.rotateVector(this._calc.relValues.AB[iy], ABVectorAngle)
						ABCalcPoint.x *= tl
						ABCalcPoint.y *= tl

						let DCCalcPoint = fabric.util.rotateVector(this._calc.relValues.DC[iy], ABVectorAngle)
						DCCalcPoint.x *= tl
						DCCalcPoint.y *= tl

						let BCCalcPoint = fabric.util.rotateVector(this._calc.relValues.BC[ix], ADVectorAngle)
						BCCalcPoint.x *= kl
						BCCalcPoint.y *= kl
						let ADCalcPoint = fabric.util.rotateVector(this._calc.relValues.AD[ix], ADVectorAngle)
						ADCalcPoint.x *= kl
						ADCalcPoint.y *= kl

						this._calc.points.push(
							ABPoint.x + (DCPoint.x - ABPoint.x) * t + ABCalcPoint.x * (1 - t) + DCCalcPoint.x * t + BCCalcPoint.x * (k) + ADCalcPoint.x * (1 - k),
							ABPoint.y + (DCPoint.y - ABPoint.y) * t + ABCalcPoint.y * (1 - t) + DCCalcPoint.y * t + BCCalcPoint.y * (k) + ADCalcPoint.y * (1 - k)
						)
					}
				}



				this._calculateControls()
				this.fire("recalculated")
			},
			updateBbox: function () {
				if (!this.points.length) {
					return
				}
				let pts = this.points
				let minX = Math.min(pts[0].x, pts[1].x, pts[2].x, pts[3].x)
				let maxX = Math.max(pts[0].x, pts[1].x, pts[2].x, pts[3].x)
				let minY = Math.min(pts[0].y, pts[1].y, pts[2].y, pts[3].y)
				let maxY = Math.max(pts[0].y, pts[1].y, pts[2].y, pts[3].y)

				for (let i in this._calc.sidepoints) {
					for (let j = 1; j < this._calc.sidepoints[i].length - 1; j++) {
						let p = this._calc.sidepoints[i][j]
						if (p.curve) {
							let bbox = p.curve.bbox()
							minX = Math.min(minX, bbox.x.min)
							maxX = Math.max(maxX, bbox.x.max)
							minY = Math.min(minY, bbox.y.min)
							maxY = Math.max(maxY, bbox.y.max)
						} else {
							minX = Math.min(minX, p.x)
							maxX = Math.max(maxX, p.x)
							minY = Math.min(minY, p.y)
							maxY = Math.max(maxY, p.y)
						}
					}
					//we could add outline to Warp object
					// if (p.outline) {
					//   let bbox = p.outline.bbox()
					//   minX = Math.min(minX, bbox.x.min)
					//   maxX = Math.max(maxX, bbox.x.max)
					//   minY = Math.min(minY, bbox.y.min)
					//   maxY = Math.max(maxY, bbox.y.max)
					// }
				}

				let rad = fabric.util.degreesToRadians(this.angle);
				this.left += minX * Math.cos(rad) * this.scaleX;
				this.top += minX * Math.sin(rad) *  this.scaleX;
				this.top += minY * Math.cos(rad) *  this.scaleY;
				this.left -= minY * Math.sin(rad)* this.scaleY;

				this.width = maxX - minX + 1
				this.height = maxY - minY + 1

				for (let point of this.points) {
					point.x -= minX
					point.y -= minY
				}
				for (let i in this.transformations) {
					for (let j in this.transformations[i]) {
						this.transformations[i][j].x -= minX
						this.transformations[i][j].y -= minY
					}
				}
				this.canvas && this.setCoords()
			},
			calculateTextureCoordArray : function(xDiv,yDiv){
				let textureArray = [], texturePositionX, texturePositionY
				for (let x = 0; x < xDiv + 1; ++x) {
					texturePositionX = x / xDiv
					for (let y = 0; y < yDiv + 1; ++y) {
						texturePositionY = y / yDiv
						textureArray.push(texturePositionX, texturePositionY)
					}
				}
				return textureArray
			},
			/**
			 * Calculate indices array for a rectangle flat shape combined of (2*xDiv) * (2*yDiv) triangles
			 * @param xDiv
			 * @param yDiv
			 * @returns {{indicesArray: *, textureArray: *}}
			 */
			calculateIndicesArray : function(xDiv,yDiv){
				let indicesArray = []
				for (let sub = 0; sub < xDiv + 1; ++sub) {
					for (let div = 0; div < yDiv + 1; ++div) {
						if(div !== yDiv && sub !== xDiv){
							indicesArray.push(
								(xDiv + 1) * sub + div,
								(xDiv + 1) * (sub + 1) + div,
								(xDiv + 1) * (sub + 1) + div + 1,
								(xDiv + 1) * sub + div,
								(xDiv + 1) * sub + div + 1,
								(xDiv + 1) * (sub + 1) + div + 1
							)
						}
					}
				}
				return indicesArray
			},
			//====================================================================================================================
			// Render section
			//====================================================================================================================

			_drawStroke(ctx) {
				ctx.save()
				ctx.translate(-this.width / 2, -this.height / 2)
				ctx.beginPath()
				for (let s = 0; s < 4; s++) {
					let spts = this._calc.sidepoints[s]
					ctx.moveTo(spts[0].x, spts[0].y)
					for (let i = 1; i < spts.length; i++) {
						if (spts[i].c) {
							spts[i].curve.draw(ctx)
							i++
						} else {
							ctx.lineTo(spts[i].x, spts[i].y)
						}
					}
				}
				ctx.restore()
			},
			drawTransformedShapeBorders: function (ctx) {
				if (!this.hasShapeBorders) return
				let matrix = fabric.util.multiplyTransformMatrices(this.getViewportTransform(), this.calcTransformMatrix())
				let options = fabric.util.qrDecompose(matrix)
				ctx.save()
				ctx.scale(options.scaleX, options.scaleY)
				this._drawStroke(ctx)
				ctx.stroke()
				ctx.restore()
			},
			_render: function (ctx) {
				// if(!this._calc){
				// 	this.calculateGeometry()
				// }
				this._drawStroke(ctx)
				this._renderPaintInOrder(ctx)
			},
			// drawControlsInterface: function (ctx) {
			// 	this.drawBezierShapeControls(ctx);
			// 	this._drawMagnetLine(ctx);
			// },
			setExtraControls: function(controls){
				if(this.hasTransformControls){
					this.addPointsControls(controls);
					let _offset = 30
					if (this.activeCorner) {
						let activeControl = this._controls[this.activeCorner]
						if (activeControl.removable) {
							controls["remove"] = {
								x: activeControl.x + _offset,
								y: activeControl.y + _offset,
								parent: this.activeCorner,
								button: true,
								action: "removeCorner",
								cursor: "pointer",
								intransformable: true,
								shape: {type: "circle", fill: "red" , stroke: "white",strokeWidth: 1, size: 16},
								label: {text: "\uf00d", fill: "white" ,size: 12}
							}
						}
						if (activeControl.curvable) {
							controls["curve"] = {
								x: activeControl.x - _offset,
								y: activeControl.y - _offset,
								parent: this.activeCorner,
								button: true,
								action: "toggleCorner",
								cursor: "pointer",
								intransformable: true,
								shape: {type: "circle", fill: "lightblue" , stroke: "white",strokeWidth: 1, size: 16},
								label: {text: "\uF55b", fill: "white" ,size: 10}
							}
						}
					}
				}
			},
			drawTriangle: function(ctx, im, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2) {


				if(!this._bufferCtx){
					this._bufferCanvas = fabric.util.createCanvasElement(ctx.canvas.width,ctx.canvas.height)
					this._bufferCtx = this._bufferCanvas.getContext("2d")
					this._bufferCtx.fillStyle = "black"
					this._bufferCtx.strokeStyle = "black"
					this._bufferCtx.lineCap = 'round'
					this._bufferCtx.lineWidth = 1
					this._bufferCtx.imageSmoothingQuality = "high";
				}

				/*
                 ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

                 The context matrix is:

                 [ m11 m21 dx ]
                 [ m12 m22 dy ]
                 [  0   0   1 ]

                 Coords are column vectors with a 1 in the z coord, so the transform is:
                 x_out = m11 * x + m21 * y + dx;
                 y_out = m12 * x + m22 * y + dy;

                 From Maxima, these are the transform values that map the source
                 coords to the dest coords:

                 sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
                 [m11 = - -----------------------------------------------------,
                 sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

                 sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
                 m12 = -----------------------------------------------------,
                 sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

                 sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
                 m21 = -----------------------------------------------------,
                 sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

                 sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
                 m22 = - -----------------------------------------------------,
                 sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

                 sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
                 dx = ----------------------------------------------------------------------,
                 sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

                 sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
                 dy = ----------------------------------------------------------------------]
                 sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
                 */

				// TODO: eliminate common subexpressions.
				var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
				if (denom == 0) {
					return;
				}
				var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
				var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
				var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
				var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
				var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
				var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;


				if(false){

					let bc = this._bufferCtx;

					bc.clearRect(0,0,bc.canvas.width,bc.canvas.height)
					bc.save();
					// Clip the output to the on-screen triangle boundaries.
					bc.beginPath();
					bc.moveTo(x0, y0);
					bc.lineTo(x1, y1);
					bc.lineTo(x2, y2);
					bc.closePath();

					bc.fill();
					bc.stroke();
					bc.globalCompositeOperation = "source-in"
					// ctx.clip();

					bc.transform(m11, m12, m21, m22, dx, dy);

					// Draw the whole image.  Transform and clip will map it onto the
					// correct output triangle.
					//
					// TODO: figure out if drawImage goes faster if we specify the rectangle that
					// bounds the source coords.
					bc.drawImage(im, 0, 0);

					// let xmin = Math.max(0,Math.min(sx0 -2 , sx1 - 2, sx2 - 2))
					// let ymin = Math.max(0,Math.min(sy0 -2 , sy1 - 2, sy2 - 2))
					// let xmax = Math.min(im.width, Math.max(sx0 +2 , sx1+2, sx2+ 2));
					// let ymax = Math.min(im.height,Math.max(sy0 +2 , sy1+2, sy2+ 2));
					//
					//
					// let dWidth = xmax - xmin, dHeight = ymax - ymin
					//
					// ctx.drawImage(im, xmin, ymin, dWidth, dHeight, xmin, ymin, dWidth, dHeight);
					bc.restore();

					ctx.drawImage(this._bufferCanvas,0,0)
				}
				else{

					ctx.save();
					// ctx.beginPath();
					// ctx.moveTo(x0, y0);
					// ctx.lineTo(x1, y1);
					// ctx.lineTo(x2, y2);
					// ctx.closePath();

					let k = 1;
					let angle = Math.atan2(y0 -y1,x0 -x1);
					let ABX = {x: x0 + Math.cos(angle) * k, y: y0 + Math.sin(angle) * k}
					let BAX = {x: x1 + Math.cos(Math.PI + angle) * k, y: y1 + Math.sin(Math.PI + angle) * k}

					angle = Math.atan2(y1 -y2,x1 -x2);
					let BCX = {x: x1 + Math.cos(angle) * k, y: y1 + Math.sin(angle) * k}
					let CBX = {x: x2 + Math.cos(Math.PI + angle) * k, y: y2 + Math.sin(Math.PI + angle) * k}

					angle = Math.atan2(y0 - y2,x0 -x2);
					let ACX = {x: x0 + Math.cos(angle) * k, y: y0 + Math.sin(angle) * k}
					let CAX = {x: x2 + Math.cos(Math.PI + angle) * k, y: y2 + Math.sin(Math.PI + angle) * k}

					ctx.beginPath();
					ctx.moveTo(ABX.x, ABX.y);
					ctx.lineTo(ACX.x, ACX.y);
					ctx.lineTo(BCX.x, BCX.y);
					ctx.lineTo(BAX.x, BAX.y);
					ctx.lineTo(CAX.x, CAX.y);
					ctx.lineTo(CBX.x, CBX.y);
					ctx.closePath();

					ctx.clip();
					ctx.transform(m11, m12, m21, m22, dx, dy);
					ctx.drawImage(im, 0, 0);
					ctx.restore();
				}
			},

			/**
			 * @private
			 * @param {CanvasRenderingctx2D} ctx ctx to render on
			 */
			_renderMesh: function (ctx) {

				ctx.save();
				ctx.imageSmoothingQuality = "high";
				// let x = (noTransform ? this.left : -this.width / 2), y = (noTransform ? this.top : -this.height / 2);
				let x =  -this.width / 2, y =  -this.height / 2;
				ctx.translate(x, y);
				// if (this.dirty) {
				// 	this.dirty = false;
				// 	this.calculateGeometry();
				// }
				let posCoords = this._calc.points;

				for (let i =0 ; i < this.indicesArray.length; i+=3) {

					let i1 = this.indicesArray[i]
					let i2 = this.indicesArray[i+1]
					let i3 = this.indicesArray[i+2]

					let w = this._element.width;
					let h = this._element.height;

					this.drawTriangle(ctx, this._element,
						posCoords[i1*2], posCoords[i1*2+1],
						posCoords[i2*2], posCoords[i2*2+1],
						posCoords[i3*2], posCoords[i3*2+1],
						this.textureCoordArray[i1*2]*w,this.textureCoordArray[i1*2+1]*h,
						this.textureCoordArray[i2*2]*w,this.textureCoordArray[i2*2+1]*h,
						this.textureCoordArray[i3*2]*w,this.textureCoordArray[i3*2+1]*h
					);

				}

				ctx.restore();


			},
			_renderMeshGL (ctx) {
				let magicNumber = 2;
				let gl = this.webgl.context

				fabric.webgl.resizeContext(gl,
					Math.ceil(this.width * this.canvas.getZoom()) * magicNumber ,
					Math.ceil(this.height * this.canvas.getZoom()) * magicNumber)

				let resolutionUniformLocation = gl.getUniformLocation(this.webgl.shaderProgram, "uResolution")
				gl.uniform2f(resolutionUniformLocation, this.width, this.height)

				gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl.positionBuffer)
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._calc.points), gl.STATIC_DRAW)

				let color = new fabric.Color(this.fillColor)._source;

				gl.viewport(0, 0, fabric.webgl.getContextWidth(gl) , fabric.webgl.getContextHeight(gl) )
				// gl.clearColor(0, 0, 0, 0); //todo fillColor
				gl.clearColor(color[0]/255, color[1]/255, color[2]/255, color[3]) //todo fillColor
				gl.clear(gl.COLOR_BUFFER_BIT)

				gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl.positionBuffer)
				let aVertexPosition = gl.getAttribLocation(this.webgl.shaderProgram, "aVertexPosition")
				gl.enableVertexAttribArray(aVertexPosition)
				gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0)

				// Tell WebGL which indices to use to index the vertices
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl.indexBuffer)

				// Tell WebGL how to pull out the texture coordinates from
				// the texture coordinate buffer into the textureCoord attribute.
				gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl.textureCoordBuffer)
				let aTextureCoord = gl.getAttribLocation(this.webgl.shaderProgram, "aTextureCoord")
				gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0)
				gl.enableVertexAttribArray(aTextureCoord)

				if (this.wireframe) {
					gl.drawElements(gl.LINE_STRIP, this.indicesArray.length, gl.UNSIGNED_SHORT, 0)
				} else {
					gl.drawElements(gl.TRIANGLES, this.indicesArray.length, gl.UNSIGNED_SHORT, 0)
				}
				this._glElement = fabric.webgl.getImage(gl)

				ctx.save()
				ctx.imageSmoothingQuality = "high";
				if(fabric.webgl.upsideDown){
					ctx.translate(0, 0); // so we can draw at 0,0
					ctx.scale(1,-1); // Y flip
					ctx.drawImage( this._glElement, 0, 0, this._glElement.width, this._glElement.height, - this.width / 2, - this.height / 2, this.width, this.height);
				}
				else{
					ctx.drawImage( this._glElement, 0, 0, this._glElement.width, this._glElement.height, - this.width / 2, - this.height / 2, this.width, this.height);
				}
				ctx.restore()
			},
			_renderFill: function (ctx) {
				if(this.sourceCanvas){
					this.updateElementFromSourceCanvas()
				}
				if (!this._element) {
					return
				}
				// if(this.dirty){
				if (this.webgl) {
					this._renderMeshGL(ctx)
				}
				else {
					console.time("nogl")
					this._renderMesh(ctx)
					console.timeEnd("nogl")
				}
			},
			//====================================================================================================================
			// Interface section
			//====================================================================================================================
			resetTransformations() {
				this.saveStates(["left", "top", "width", "height", "points", "transformations"])

				this.set({
					angle: 0,
					transformations: false,
					points: false,
					scaleX: 1,
					scaleY: 1,
					left: 0,//Math.max(this.left, 0),
					top: 0,//Math.max(this.top, 0),
					width: this.canvas.originalWidth,//Math.min(this.width, this.canvas.originalWidth),
					height:this.canvas.originalHeight,// Math.min(this.height, this.canvas.originalHeight)
				})

				this.updateState()
			},
			updateMagnetPoint(event) {
				let pointer = this.canvas.getPointer(event.e)
				if (this.__corner) {
					let cotrol = this._controls[this.__corner]
					if (cotrol.removable) {
						this.magnetPoint = this.__corner
						this.__magnet_coordinate = {x: pointer.x - this.left, y: pointer.y - this.top}
					}
				} else if (this.magnetPoint) {
					if (pointer.distanceFrom(this.oCoords[this.magnetPoint]) > 30) {
						this.removeMagnetPoint()
					}
				}

				let sX = this.scaleX, sY = this.scaleY;
				function transformPoint(p){
					return {x: p.x * sX, y: p.y * sY}
				}

				delete this._closestBorderPoint
				delete this._closestBorderPointT
				this._closestBorderPointDistance = 10

				if (!this.activeCorner && (!this.__corner || this.__corner === "i")) {
					let localPointer = this.getLocalPointer(event.e)
					localPointer.x /= this.scaleX;
					localPointer.y /= this.scaleY;

					for (let s = 0; s < this._sides.length; s++) {
						let points = this._calc.sidepoints[s]
						for (let i = 0; i < points.length - 1; i++) {
							let A = points[i], B = points[i + 1], tMin, tMax, projection



							if (A.c || B.c) {
								let C1, C2, C3, curve
								if (A.c) {
									curve = A.curve
									C1 = points[i - 1]
									C2 = A
									C3 = B
								} else {
									curve = B.curve
									C1 = A
									C2 = B
									C3 = points[i + 2]
								}
								projection = curve.project(localPointer)
								tMin = C1.t
								tMax = C3.t
							}
							else {
								let closest = closestPointBetween2D(localPointer, A, B)
								let closestFabricPoint = new fabric.Point(closest.x, closest.y)


								projection = {
									x: closest.x,
									y: closest.y,
									t: closestFabricPoint.distanceFrom(A) / new fabric.Point(A.x, A.y).distanceFrom(B),
									d: closestFabricPoint.distanceFrom(localPointer)
								}
								tMin = A.t
								tMax = B.t
							}

							if (projection.d < this._closestBorderPointDistance) {
								this._closestBorderPointDistance = projection.d
								this._closestBorderPoint = {x: projection.x, y: projection.y}
								this._closestBorderPointSide = s
								this._closestBorderPointT = (tMax - tMin) * projection.t + tMin
								break
							}
						}
					}
				}

				this.canvas.renderAll()
			},
			toggleCorner(e, control) {
				this.saveStates(["transformations", "left", "top", "width", "height", "points"])
				let side = control.parent.substr(0, 2)
				let sides = ["AB", "BC", "DC", "AD"]
				let s = sides.indexOf(side)
				let subpoint = +control.parent.substr(2)
				let modifiedPoint = this.transformations[s][subpoint - 1]
				if (modifiedPoint.c) {
					delete modifiedPoint.curve
					delete modifiedPoint.c
				} else {
					modifiedPoint.c = 1
				}
				this.calculateGeometry()
				this.updateBbox()
				this.fire('shaping', e)

				this.updateState()
				// this.dirty = true
				// this.canvas.fire('object:modified', {target: this})
				// this.fire('modified', {})
				// this.canvas.renderAll()
			},
			_performShapeAction: function (e, transform, pointer) {
				this.saveStates(["transformations", "left", "top", "width", "height", "points"])
				transform.corner.substr(1)
				this.setPoint(transform.corner, transform.point);
				transform.actionPerformed = true;
				this.calculateGeometry()
				this.updateBbox()
				this.dirty = true
				this.fire('shaping', e)
				this.updateState()
			},
			_performSubshapeAction (e, transform) {
				this.saveStates(["transformations", "left", "top", "width", "height", "points"])

				let side = transform.corner.substr(0, 2)
				let sides = ["AB", "BC", "DC", "AD"]
				let s = sides.indexOf(side)

				let subpoint = +transform.corner.substr(2)
				let modifiedPoint = this.transformations[s][subpoint - 1]
				modifiedPoint.x = transform.point.x
				modifiedPoint.y = transform.point.y
				this.dirty = true
				transform.actionPerformed = true
				this.updateBbox()
				this.calculateGeometry()
				this.fire('shaping', e)
				this.updateState()
				// this.canvas.renderAll()
			},
			insertCorner: function (e) {
				this.saveStates(["transformations"])
				let s = this._closestBorderPointSide
				let i
				for (i = 0; i < this.transformations[s].length; i++) {
					if (this.transformations[s][i].t > this._closestBorderPointT) {
						break
					}
				}

				this.transformations[s].splice(i, 0, {
					x: this._closestBorderPoint.x,// / this.scaleX,
					y: this._closestBorderPoint.y,// / this.scaleY,
					t: this._closestBorderPointT
				})

				this.calculateGeometry()
				this.updateBbox()

				this.updateState()

				// this.dirty = true
				// this.canvas.fire('object:modified', {target: this})
				// this.fire('modified', {})
				// this.canvas.renderAll()
			},
			removeCorner: function (e, control) {
				this.saveStates(["transformations", "left", "top", "width", "height", "points"])
				let side = control.parent.substr(0, 2)
				let sides = ["AB", "BC", "DC", "AD"]
				let s = sides.indexOf(side)
				let subpoint = +control.parent.substr(2)
				this.transformations[s].splice(subpoint - 1, 1)
				delete this.__corner
				delete this.magnetPoint
				this.setActiveCorner(false)

				this.calculateGeometry()
				this.updateBbox()
				this.fire('shaping', e)

				this.updateState()
				// this.dirty = true
				// this.canvas.fire('object:modified', {target: this})
				// this.fire('modified', {})
				// this.canvas.renderAll()
			},
			addPointsControls(controls) {
				let pts = this.points

				let sX = this.scaleX, sY = this.scaleY;
				function transformPoint(p){
					return {x: p.x * sX, y: p.y * sY}
				}


				for (let i in pts) {
					let p = transformPoint(pts[i])
					controls["p" + (+i + 1)] = {
						action: "shape",
						x: p.x,
						y: p.y
					}
				}
				if (!this._calc) return

				for (let s = 0; s < this._sides.length; s++) {
					for (let i = 0; i < this.transformations[s].length; i++) {
						let curveFromLeft = this.transformations[s][i - 1] && this.transformations[s][i - 1].c
						let curveFromRight = this.transformations[s][i + 1] && this.transformations[s][i + 1].c

						let p = transformPoint(this._calc.localCoordsTranformations[s][i])
						controls[this._sides[s].name + (+i + 1)] = {
							curvable: !curveFromLeft && !curveFromRight,
							removable: !(curveFromLeft && curveFromRight),
							selectable: true,
							style: this.transformations[s][i].c ? "circle" : "rect",
							action: "subshape",
							x: p.x,
							y: p.y
						}
					}
				}
				if (this._closestBorderPoint) {
					let p = transformPoint(this._closestBorderPoint);
					controls["i"] = {
						shape: {type: "circle", fill: "green" , stroke: "white",strokeWidth: 1, size: 16},
						label: {text: "\uf067", fill: "white" ,size: 12},
						action: "insertCorner",
						button: true,
						t: this._closestBorderPointT,
						x: p.x,
						y: p.y,

						cursor: "pointer",
						intransformable: true
					}
				}
			},
			switchEditMode: function () {
				delete this.__magnet_coordinate
				delete this.magnetPoint

				if (this.hasBoundControls) {
					this.hasRotatingPoint = false
					this.hasBoundControls = false
					this.hasTransformControls = true
					this.hasBoundBorders = false
					this.setHasShapeBorders(true)
				} else {
					this.hasRotatingPoint = true
					this.hasBoundControls = true
					this.hasTransformControls = false
					this.hasBoundBorders = true
					this.setHasShapeBorders(false)
				}
				this.setCoords()
				this.canvas.renderAll()
			},
			setHasShapeBorders(value){
				if(this.hasShapeBorders === value){
					return
				}
				this.hasShapeBorders = value
				if(value){
					this.on({
						"mouseout": "removeMagnetPoint",
						"mousemove": "updateMagnetPoint"
					})
				}
				else{
					this.off({
						"mouseout": "removeMagnetPoint",
						"mousemove": "updateMagnetPoint"
					})
				}
			},
			//====================================================================================================================
			// Debugging section
			//====================================================================================================================
			/**
			 * draw debugging data on another canvas
			 * @param ctx
			 */
			setDebugContext(ctx) {
				this.on("recalculated", () => {
					this.debugInfo(ctx)
				})
			},
			debugInfo(ctx) {
				ctx.save()
				ctx.fillStyle = "white"
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
				ctx.translate(5, 10)

				ctx.fillStyle = "black"
				ctx.fillText("Relative coordinates  t∈{0;1}:", 0, 5)
				ctx.translate(0, 20)

				this._debugDrawSubpoints(ctx, "AB", 0, 65, 150, this._calc.relValues.AB, this.transformations[0])
				this._debugDrawSubpoints(ctx, "BC", 180, 65, 150, this._calc.relValues.BC, this.transformations[1])
				this._debugDrawSubpoints(ctx, "DC", 0, 195, 150, this._calc.relValues.DC, this.transformations[2])
				this._debugDrawSubpoints(ctx, "AD", 180, 195, 150, this._calc.relValues.AD, this.transformations[3])
				ctx.fillStyle = "black"


				ctx.fillStyle = "black"
				ctx.fillText("WebGL coordinates x,y∈{-0.5;0.5}:", 0, 280)

				this._debugGLCoordiantes(ctx, 80, 300, 180)

				ctx.restore()
			},
			_debugDrawSubpoints(ctx, name, x, y, scale, subpoints, points) {
				ctx.save()
				ctx.translate(x, y)
				ctx.fillStyle = "black"
				ctx.fillText(name, 0, 0)
				ctx.translate(20, 5)
				ctx.strokeStyle = "#eee"
				ctx.beginPath()
				for (let x = 0; x <= 1; x += 0.1) {
					ctx.moveTo(x * scale, -0.3 * scale)
					ctx.lineTo(x * scale, 0.3 * scale)
				}
				for (let y = -0.3; y <= 0.3; y += 0.1) {
					ctx.moveTo(0, y * scale)
					ctx.lineTo(scale, y * scale)
				}
				ctx.stroke()

				ctx.strokeStyle = "black"

				ctx.beginPath()
				ctx.moveTo(0, 0)
				ctx.lineTo(scale, 0)
				ctx.moveTo(0, -0.3 * scale)
				ctx.lineTo(0, 0.3 * scale)
				ctx.stroke()
				ctx.beginPath()
				ctx.strokeStyle = "red"
				for (let i = 0; i < points.length; i++) {
					let x = points[i].x + points[i].t
					let y = -points[i].y
					this._debugDrawPoint(ctx, x * scale, y * scale, 1.5)
				}
				this._debugDrawPoint(ctx, 0, 0, 1.5)
				this._debugDrawPoint(ctx, x * scale, 0, 1.5)

				for (let i = 0; i < subpoints.length; i++) {
					let t = i / (subpoints.length - 1)
					let x = subpoints[i].x + t
					let y = -subpoints[i].y
					ctx.moveTo(t * scale, 0)
					ctx.lineTo(x * scale, y * scale)
					this._debugDrawPoint(ctx, x * scale, y * scale, 0.7)
				}
				ctx.stroke()
				ctx.restore()
			},
			_debugRectPoint(ctx, x, y, r) {
				ctx.moveTo(x, y)
				ctx.fillRect(x - r, y - r, r * 2, r * 2)
			},
			_debugDrawPoint(ctx, x, y, r) {
				ctx.moveTo(x, y)
				ctx.arc(x, y, r, 0, 2 * Math.PI, true)
			},
			_debugGLCoordiantes(ctx, x, y, size) {
				let {A, B, C, D, points, glCoordsTransformations} = this._calc
				ctx.save()
				ctx.translate(x, y)

				let scaleX = size / this.width
				let scaleY = size / this.height

				ctx.strokeStyle = "#eee"
				let l = size
				ctx.beginPath()
				for (let i = 0; i <= 1; i += 0.1) {
					ctx.moveTo(0, i * size)
					ctx.lineTo(l, i * size)
					ctx.moveTo(i * size, 0)
					ctx.lineTo(i * size, l)
				}
				ctx.stroke()

				ctx.strokeStyle = "black"
				ctx.beginPath()
				ctx.moveTo(size / 2 - 0.05 * size, size / 2)
				ctx.lineTo(size / 2 + 0.05 * size, size / 2)
				ctx.moveTo(size / 2, size / 2 - 0.05 * size)
				ctx.lineTo(size / 2, size / 2 + 0.05 * size)
				ctx.stroke()

				ctx.beginPath()
				ctx.moveTo(A.x * scaleX, A.y * scaleY)
				ctx.lineTo(B.x * scaleX, B.y * scaleY)
				ctx.lineTo(C.x * scaleX, C.y * scaleY)
				ctx.lineTo(D.x * scaleX, D.y * scaleY)
				ctx.lineTo(A.x * scaleX, A.y * scaleY)
				ctx.stroke()
				ctx.fillStyle = "red"
				this._debugRectPoint(ctx, B.x * scaleX, B.y * scaleY, 2)
				this._debugRectPoint(ctx, C.x * scaleX, C.y * scaleY, 2)
				this._debugRectPoint(ctx, D.x * scaleX, D.y * scaleY, 2)
				this._debugRectPoint(ctx, A.x * scaleX, A.y * scaleY, 2)

				let textYoffset = scaleY + 0.1
				let textXoffset = scaleX + 0.1
				ctx.fillStyle = "black"
				ctx.fillText("A", -5 + A.x * textXoffset, 5 + A.y * textYoffset, 10)
				ctx.fillText("B", -5 + B.x * textXoffset, 5 + B.y * textYoffset, 10)
				ctx.fillText("C", -5 + C.x * textXoffset, 5 + C.y * textYoffset, 10)
				ctx.fillText("D", -5 + D.x * textXoffset, 5 + D.y * textYoffset, 10)

				ctx.fillStyle = "red"

				ctx.beginPath()
				for (let i = 0; i < points.length; i += 2) {
					this._debugDrawPoint(ctx, points[i] * scaleX, points[i + 1] * scaleY, 0.5)
				}
				for (let i = 0; i < glCoordsTransformations.length; i++) {
					for (let j = 0; j < glCoordsTransformations[i].length; j++) {
						this._debugDrawPoint(ctx, glCoordsTransformations[i][j].x * scaleX, glCoordsTransformations[i][j].y * scaleY, 2)
					}
				}
				ctx.fill()

				ctx.restore()
			},
			removeMagnetPoint(event){
				delete this.__magnet_coordinate;
				delete this.magnetPoint;
				this.canvas.renderAll();
				this.setCoords();
			},
			/**
			 * toolbars actions
			 */
			actions: {
				resetTransformations: {
					className: 'fas fa-vector-square fb fb-undo',
					title: 'reset transformations'
				},
				switchEditMode: {
					className: 'fas fa-draw-polygon',
					title: 'toggle transform'
				}
			}
		}
	}
}
