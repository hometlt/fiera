import {FmRelative} from "../objects/relative.js";


export const FmDpi = {
	name: "image-dpi",
	deps: [FmRelative],
	prototypes: {
		DpiWarning: {
			prototype: "group",
			// type: "group",
			width: 200,
			height: 200,
			snappable: false,
			objects: [
				{
					type: "text",
					text: "",
					originX: "center",
					fill: "#C54B5C",
					height: 20,
					fontSize: 24,
					left: 0,
					shadow: {
						color: "#fff",
						blur: 1
					},
					fontFamily: "Font Awesome",
					textAlign: "center"
				},
				{
					type: "text",
					id:"image-dpi-text",
					originX: "center",
					text: "",
					fontFamily: "Roboto",
					fill: "#C54B5C",
					fontSize: 16,
					fontWeight: "bold",
					shadow: {
						color: "#fff",
						blur: 1
					},
					strokeWidth: 0.8,
					height: 5,
					top: 30,
					left: 0,
					textAlign: "center"
				},
				{
					type: "text",
					originX: "center",
					text: "Image is too low resolution",
					fontFamily: "Roboto",
					fill: "#C54B5C",
					fontSize: 12,
					shadow: {
						color: "#fff",
						blur: 1
					},
					strokeWidth: 0.8,
					height: 5,
					top: 50,
					left: 0,
					textAlign: "center"
				}
			],
			statefullCache: true,
			originX: "center",
			originY: "center",
			stored: false,
			selectable: false,
			layer: "interface",
			evented: false,
			hasControls: false
		},
		Object: {
			dpiWarning: false,
			dpiWarningClass: "dpi-warning",
			minDpi: 0,
			checkDpiOnRemoveToCanvasCallback(event){
				this.off("canvas.viewport:scaled","checkDpi")
			},
			checkDpiOnAddToCanvasCallback(){
				this.checkDpi()
				this.on("canvas.viewport:scaled","checkDpi")
			},
			setMinDpi(value){
				this.minDpi = value

				if(value){
					this.on({
						// "removed": "checkDpiOnRemoveToCanvasCallback",
						// "added": "checkDpiOnAddToCanvasCallback",
						"removed group:removed": "removeDpiWarningSign",
						"scaling moving modified loaded crop:modified" : "checkDpi"
					})
				}else{
					this.off({
						// "removed": "checkDpiOnRemoveToCanvasCallback",
						// "added": "checkDpiOnAddToCanvasCallback",
						"removed group:removed": "removeDpiWarningSign",
						"scaling moving modified loaded crop:modified" : "checkDpi"
					})
				}
			},
			removeDpiWarningSign () {
				if(this._warningSign){
					this._warningSign.removeFromCanvas()
					delete this._warningSign
				}
			},
			updateDpiWarningSign () {

				if(this._warningSign) {

					for (let o of this._warningSign._objects) {
						if (o.id === "image-dpi-text") {
							o.setText(Math.floor(this.effectiveDpi).toString() + " DPI")
						}
					}
					let zoom = this.canvas.getZoom();

					this._warningSign.set({
						scaleY: 1  / zoom,
						scaleX: 1  / zoom
					})
				}

			},
			createDpiWarningSign () {

				if(!this._warningSign && this.dpiWarningClass) {
					this._warningSign = this.canvas.createObject({
						type: this.dpiWarningClass
					})

					this._warningSign.set({
						relative: this,
						relativeCoordinates: {
							left: 44,
							top: 44
						}
					});
				}
			},
			checkDpi () {
				if (!this.minDpi || !this.canvas || this.group)return;
				let effectiveDpi = this.getDPI();
				if(effectiveDpi === this.effectiveDpi)return;
				this.effectiveDpi = effectiveDpi


				this.dpiWarning = this.effectiveDpi && this.effectiveDpi < this.minDpi;
				if (this.dpiWarning) {
					this.createDpiWarningSign()
					this.updateDpiWarningSign()
				} else {
					this.removeDpiWarningSign()
				}
				this.fire("dpi",{warning: this.dpiWarning , dpi: this.effectiveDpi})
				this.canvas.fire("object:dpi",{warning: this.dpiWarning, dpi: this.effectiveDpi, target: this})
			},
			getDPI () {
				return 0;
			}
		},
		Group: {
			getDPI () {
				let minDpi = Infinity;
				for(let i in this._objects){
					let dpi = this._objects[i].getDPI();
					if(dpi && dpi < minDpi){
						minDpi = dpi;
					}
				}
				return  minDpi;
			}
		},
		Editor: {
			effectiveDpi: 0,
			dpiWarning: false,
			checkDpi () {
				let effectiveDpi = this.getDPI();
				if(effectiveDpi === this.effectiveDpi)return;
				this.effectiveDpi = effectiveDpi
				this.dpiWarning = this.effectiveDpi && this.effectiveDpi < this.minDpi;
				this.fire("dpi",{warning: this.dpiWarning , dpi: this.effectiveDpi})
			},
			getDPI () {
				let minDpi = Infinity;
				if(this.slides){
					for(let i in this.slides){
						let dpi = this.slides[i].effectiveDpi;
						if(dpi && dpi < minDpi){
							minDpi = dpi;
						}
					}
				}
				else if(this.canvas){
					let dpi = this.canvas.effectiveDpi;
					if(dpi && dpi < minDpi){
						minDpi = dpi;
					}
				}
				return  minDpi;
			},
			eventListeners: {
				"canvas:dpi": "checkDpi"
			}
		},
		Canvas: {
			effectiveDpi: 0,
			dpiWarning: false,
			checkDpi () {
				let effectiveDpi = this.getDPI();
				if(effectiveDpi === this.effectiveDpi)return;
				this.effectiveDpi = effectiveDpi
				this.dpiWarning = this.effectiveDpi && this.effectiveDpi < this.minDpi;
				this.fire("dpi",{warning: this.dpiWarning , dpi: this.effectiveDpi})
				this.editor.fire("canvas:dpi",{warning: this.dpiWarning, dpi: this.effectiveDpi, target: this})
			},
			getDPI () {
				let minDpi = Infinity;
				for(let i in this._objects){
					let dpi = this._objects[i].effectiveDpi;
					if(dpi && dpi < minDpi){
						minDpi = dpi;
					}
				}
				return  minDpi;
			},
			eventListeners: {
				"object:dpi" : "checkDpi"
			}
		},
		Image: {
			// "+afterRender": ["renderDpiWarning"],
			minDpi: 0,
			//size of original high resolution image on the server
			originalSize: {
				width: 0,
				height: 0,
			},
			getDPI () {
				if(!this.imageLoaded){
					return 0;
				}
				if(this.src && this.src.endsWith(".svg")){
					return 0;
				}

				let imageWidth = this.originalSize && this.originalSize.width || this._originalElement && this._originalElement.width || 0;
				let imageHeight = this.originalSize && this.originalSize.height || this._originalElement && this._originalElement.height || 0;
				if(!imageWidth || !imageHeight)return 0;
				let matrix = this.crop ? this._cropEl.calcTransformMatrix() : this.calcTransformMatrix();
				let options = fabric.util.qrDecompose(matrix);

				let pixelsPerDotX = imageWidth / Math.abs(this.width * options.scaleX)
				let pixelsPerDotY = imageHeight / Math.abs(this.height * options.scaleY)
				let canvasDPI = this.canvas && this.canvas.dpi || this.editor.dpi;
				return Math.round(canvasDPI * Math.min(pixelsPerDotX,pixelsPerDotY));
			}
		}
	}
}
