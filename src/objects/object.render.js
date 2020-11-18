


export const FmObjectRender = {
	name: "object-render",
	prototypes: {
		Canvas: {
			eventListeners: {
				"target:changed": function ({selected, deselected}) {
					if (selected) {
						let options = this._hoveredTarget === selected && selected.activeHoverOptions || selected.activeOptions;
						options && selected.set(options)
					}
					if (deselected) {
						for (let obj of deselected) {
							let options = this._hoveredTarget === obj && obj.inactiveHoverOptions || obj.inactiveOptions;
							options && obj.set(options)
						}
					}
				},
				"object:blur": function ({target}) {
					let options = this._activeObject === target && target.activeOptions || target.inactiveOptions
					target._focused = false;
					options && target.set(options)
				},
				"object:focus": function ({target}) {
					let options = this._activeObject === target && target.activeHoverOptions || target.inactiveHoverOptions
					target._focused = true;
					options && target.set(options)
				}
			}
		},
		Text: {
			"+cacheProperties": [ "borderWidth"],
		},
		Object: {

			/**
			 * Renders an object on a specified context
			 * @param {CanvasRenderingContext2D} ctx Context to render on
			 */
			render: function(ctx) {
				// do not render if width/height are zeros or object is not visible
				if (this.isNotVisible()) {
					return;
				}
				if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
					return;
				}
				ctx.save();
				this._setupCompositeOperation(ctx);
				this.drawSelectionBackground(ctx);
				this.transform(ctx);
				this._setOpacity(ctx);
				this._setShadow(ctx, this);
				if (this.transformMatrix) {
					ctx.transform.apply(ctx, this.transformMatrix);
				}
				this.clipTo && fabric.util.clipContext(this, ctx);
				ctx.save()

				if(this.puzzle){
					this.renderTiles(ctx)
				}
				else{
					if (this.shouldCache()) {
						this.renderCache();
						this.drawCacheOnCanvas(ctx);
					}
					else {
						this._removeCacheCanvas();
						this.dirty = false;
						this.drawObject(ctx);
						if (this.objectCaching && this.statefullCache) {
							this.saveState({ propertySet: 'cacheProperties' });
						}
					}
				}
				ctx.restore();
				//

				//todo fix afterRender
				// for (let i = 0; i < this.afterRender.length; i++) {
				// 	this[this.afterRender[i]](ctx, forClipping)
				// }

				this.clipTo && ctx.restore();
				ctx.restore();
			},
			beforeRender: [],
			afterRender: [],
			"+cacheProperties": ["borderWidth"],
			//overwritten
			drawObject: function (ctx, forClipping) {
				let originalFill = this.fill, originalStroke = this.stroke
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
				if (this._objects) {
					for (let i = 0, len = this._objects.length; i < len; i++) {
						this._objects[i].render(ctx, forClipping)
					}
				}
				this._drawClipPath(ctx)
				//
				// //todo fix afterRender
				// if(this.renderTiles){
				// 	this.renderTiles(ctx)
				// }
				//
				// for (let i = 0; i < this.afterRender.length; i++) {
				// 	this[this.afterRender[i]](ctx, forClipping)
				// }
				// this._drawBorders(ctx);

				this.fill = originalFill
				this.stroke = originalStroke
			},
			// _drawBorders: function (ctx) {
			// 	if (this.border && this.borderWidth) {
			// 		ctx.lineWidth = this.borderWidth;
			// 		ctx.strokeStyle = this.border;
			// 		ctx.strokeRect(
			// 			-this.width / 2,
			// 			-this.height / 2,
			// 			this.width,
			// 			this.height
			// 		)
			// 	}
			// }
		}
	}
}

