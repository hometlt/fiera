import {FmObjectRender} from "./object.render.js"
import {FmImageBorder} from '../shapes/ImageBorder.js'

export default {
	name: "deco",
	deps: [FmObjectRender, FmImageBorder],
	prototypes: {
		Object: {
			"+beforeRender": ["renderDecoBackground"],
			"+afterRender": ["renderDecoOverlay"],
			renderDecoBackground(ctx, forClipping) {
				if (this.bgDeco ) {
					this._bgDecoEl.render(ctx, forClipping);
				}
			},
			renderDecoOverlay(ctx, forClipping) {
				if (this.deco) {
					this._decoEl.render(ctx, forClipping);
				}
			},
			setBgDeco(options, callback) {
				if (!options) {
					options = false;
				} else if (options.constructor === Object) {
				} else if (options.constructor === String) {
					options = {src: options};
				} else {
					options = {element: options};
				}
				if (!options) {
					delete this.bgDeco;
					delete this._bgDecoEl;
					return;
				}
				this.bgDeco = options;
				this._bgDecoEl = fabric.util.createObject(fabric.util.object.extend({
					editor: this.editor,
					type: "image-border",
					width: this.width,
					height: this.height,
					left: -this.width / 2,
					top: -this.height / 2
				}, options), () => {
					this.updateDeco();
					this.canvas && this.canvas.renderAll();
					callback && callback();
				});

				this.on({"resized scaling": "updateDeco"})
			},
			setDeco(options, callback) {
				if (!options) {
					options = false;
				} else if (options.constructor === Object) {
				} else if (options.constructor === String) {
					options = {src: options};
				} else {
					options = {element: options};
				}
				if (!options) {
					delete this.deco;
					delete this._decoEl;
					return;
				}
				this.deco = options;
				this._decoEl = fabric.util.createObject(fabric.util.object.extend({
					editor: this.editor,
					type: "image-border",
					width: this.width,
					height: this.height,
					left: -this.width / 2,
					top: -this.height / 2
				}, options), () => {
					this.updateDeco();
					this.canvas && this.canvas.renderAll();
					callback && callback();
				});

				this.on({"resized scaling": "updateDeco"})
			},
			updateDeco() {
				if (this._decoEl) {
					this._decoEl.set({
						width: this.width,
						height: this.height,
						left: -this.width / 2,
						top: -this.height / 2
					});
					this.dirty = true;
				}
				if (this._bgDecoEl) {
					this._bgDecoEl.set({
						width: this.width,
						height: this.height,
						left: -this.width / 2,
						top: -this.height / 2
					});
					this.dirty = true;
				}
			},
			getDeco() {
				if (this.frame || !this._decoEl) return;
				let image = this._decoEl.getState();
				delete image.type;
				delete image.left;
				delete image.top;
				delete image.width;
				delete image.height;
				if (Object.keys(image).length === 1) return image.src;
				return image;
			}
		}
	}
}
