
export const FmWheelScale = {
	name: "object-wheel-scale",
	prototypes: {
		Object: {
			"+actions": {

				scale: {
					className: "fi fi-resize",
					title: "scale",
					subMenuClassName: "fiera-scale-menu",
					menu: ["scaleOut","scaleRange","scaleIn"]
				},
				scaleOut: {
					itemClassName: "fiera-tool-range-minus",
					className: "fa fa-minus",
					title: "zoom out"
				},
				scaleRange: {
					itemClassName: "fiera-tool-range",
					showButton: false,
					type: "range",
					variable: "scale",
					observe: "modified",
					title: "scale",
					//todo bug. should use values from Object.prototype
					min: 0.1,
					max: 10,
					fixed: 2
				},
				scaleIn: {
					itemClassName: "fiera-tool-range-plus",
					title: "zoom in",
					className: "fa fa-plus"
				}
			},
			maxScale: 10000,
			minScale: 0.0001,
			getScale() {
				return Math.max(this.scaleX, this.scaleY)
			},
			_scale(value) {

				if(this.lockScalingX && this.lockScalingY) return
				let shouldCenterOrigin = (this.originX !== 'center' || this.originY !== 'center') && this.centeredRotation;
				if (shouldCenterOrigin) {
					this._setOriginToCenter();
				}

				let options = {}


				if(!this.lockScalingX){
					if(this.resizable){
						options.width = this.width * value
					}
					else{
						options.scaleX = Math.min(this.maxScale, Math.max(this.scaleX * value, this.minScale));
					}
				}
				if(!this.lockScalingY){
					if(this.resizable){
						options.height = this.height * value
					}
					else {
						options.scaleY = Math.min(this.maxScale, Math.max(this.scaleY * value, this.minScale))
					}
				}

				this.set(options);
				if (shouldCenterOrigin) {
					this._resetOrigin();
				}
				//todo should be changed
				this.fire('modified');
			},
			setScale(value) {
				let old = this.getScale();
				let diff = value / old;
				this._scale(diff)
			},
			wheelScale(e){
				if (e.e.deltaY < 0) {
					this.scaleIn();
				} else {
					this.scaleOut();
				}
				e.e.stopPropagation();
				e.e.preventDefault();
			},
			setMouseWheelScale(value) {
				if(!this.mouseWheelScale && value){
					this.on("mousewheel", "wheelScale")
				}
				if(this.mouseWheelScale && !value){
					this.off("mousewheel", "wheelScale")
				}
				this.mouseWheelScale = value;
			},
			scaleOut() {
				this._scale(0.9)
			},
			scaleIn() {
				this._scale(1.11)
			}
		}
	}
}
