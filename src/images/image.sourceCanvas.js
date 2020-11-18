
export const FmSourceCanvas = {
	name: "source-canvas",
	prototypes: {
		Warp: {
			"+cacheProperties": ["sourceCanvas"]
		},
		Image: {
			"+cacheProperties": ["sourceCanvas"],
			// autoScaleImage: false,
			// setAutoScaleImage (){
			//
			// },
			//
			sourceCanvasZoom: 0,
			sourceCanvasDirty: false,
			updateElementFromSourceCanvas() {
				let size = this.sourceCanvas.getOriginalSize()
				let w = this.width * fabric.util.qrDecompose(this.calcTransformMatrix()).scaleX * this.canvas.getZoom()
				let h = this.height * fabric.util.qrDecompose(this.calcTransformMatrix()).scaleY * this.canvas.getZoom()
				let zoom = Math.max(w / size.width, h / size.height) *  2
				if(!this.sourceCanvasDirty && this.sourceCanvasZoom === zoom){
					return
				}
				this.sourceCanvasZoom = zoom

				if(!this.canvas._buffers){
					this._element = this.sourceCanvas.getThumbnail({zoom: zoom });
				}else{
					this.sourceCanvas.set({
						width: size.width * zoom,
						height: size.height * zoom,
					})
					this.sourceCanvas.setViewportTransform([zoom,0,0,zoom,0,0])
					this.sourceCanvas.renderAll();
					this._element = this.sourceCanvas.lowerCanvasEl;
					//
					// let output = fabric.util.createCanvasElement();
					// let width = this.getOriginalWidth();
					// let height = this.getOriginalHeight();
					// output.width = width * zoom
					// output.height = height * zoom
					// let ctx = output.getContext('2d')
					//
					// let vt = this.viewportTransform, rWidth = this.width, rHeight = this.height;
					// this.viewportTransform = [zoom, vt[1], vt[2], zoom, 0, 0];
					// // this.fire("export:viewport:scaled")
					// this.width = this.width * zoom
					// this.height = this.height * zoom
					// this.skipOffscreen = false;
					// this._exporting = true;
					// this.renderCanvasLayers(ctx);
					// delete this._exporting;
					// this.skipOffscreen = true;
					// this.viewportTransform = vt;
					// // this.fire("export:viewport:scaled")
					// this.width = rWidth
					// this.height = rHeight
					// return output;
				}

				// this.setElement(element)

				// canvasToFile(this._element,"png","./export/gl-element167.png")
				if (this.webgl) {
					if(fabric.isLikelyNode){
						let ctx = this._element.getContext('2d');
						let imageData = ctx.getImageData(0, 0, this._element.width, this._element.height);
						fabric.util.gl.setTextureImage(this.webgl.context, this.webgl.texture, imageData )
					}
					else{
						fabric.util.gl.setTextureImage(this.webgl.context, this.webgl.texture, this._element )
					}
				}
			},
			getSourceCanvas(){
				if(!this.sourceCanvas)return;
				return this.sourceCanvas.getState();
			},
			setSourceCanvas(data,callback) {
				let sourcceCanvas;
				if(data && data.constructor === Object) {
					sourcceCanvas = new fabric.Canvas(Object.assign({editor: this.editor},data))
				}else{
					sourcceCanvas = data;
				}
				this.setState("sourceCanvas", sourcceCanvas)
				this.fire("element:modified")

				this.updateState()
				this.sourceCanvasDirty = true;

				if(!sourcceCanvas || sourcceCanvas.loaded){
					callback && callback()
				}
				else{
					sourcceCanvas.on("loaded",()=>{
						this.sourceCanvasDirty = true;
						callback && callback()
					})
				}
				sourcceCanvas.on("modified",()=>{
					this.sourceCanvasDirty = true;
					this.fire("modified")
				})
			}
		}
	}
}
