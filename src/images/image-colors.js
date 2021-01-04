export const FmImageColors = {
  name: "image-colors",
  deps: [],
  prototypes: {
    Image: {
      colors: null,
      _color_areas: null,
      colorAreas: null,
      optionsOrder: ["colorAreas", "colors", "*"],
      setColorAreas (val, callback) {
        this.colorAreas = []
        this._color_areas = []
        this.colors = {}

        let promises = []
        for (let i in val) {
          this.colorAreas[i] = val[i]
          if (val[i].src) {
            promises.push(new Promise((resolve) => {
              fabric.Image.fromURL(val[i].src, (index, el) => {
                el.width = this.width;
                el.height = this.height;
                this._color_areas[index] = {image: el, filters: [new fabric.Image.filters.Mask({'mask': el})]}
                if (this.colors[index]) {
                  this.setColor(index, this.colors[index], cb)
                } else {
                  resolve()
                }
              })
            }))
          } else {
            this._color_areas[i] = {};
          }
        }
        Promise.all(promises).then(callback)
      },
      setAreaColor (index, options, callback) {
        let colorArea = this._color_areas[index];
        this.colors[index] = options;

        if (!colorArea || !colorArea.image) {
          return callback();
        }

        if (!options) {
          //do not fill
          colorArea.filters.length = 1;
          createColorArea();
        } else if (options.constructor === String) {

          // let _c = fabric.Color.colorNameMap[fabric.util.string.toDashed(colors[i].replace(/\s/, ""))];
          // if (!_c) {
          //   console.warn("HEX Code of '" + colors[i] + "' Not Found!");
          // }

          //fill a color
          if (!options.startsWith("rgb") && !options.startsWith("#") && !fabric.Color.colorNameMap[options]) {
            console.log("color '" + options + "' not defined");
            options = "#000";
          }
          colorArea.filters[1] = new fabric.Image.filters.Blend({
            color: options,
            mode: "multiply"
          });
          createColorArea()
        } else {
          //fill a texture
          colorArea.options = fabric.util.object.clone(options, true);
          fabric.Image.fromURL(colorArea.options.src, el => {
            colorArea.options.image = el;
            colorArea.filters[1] = new fabric.Image.filters.Blend(colorArea.options);
            createColorArea();
          })
        }
        function createColorArea() {
          let _image = new fabric.Image(_this._filteredEl || _this._originalElement);
          colorArea.canvas = _image.applyFilters(callback, colorArea.filters, _this._filteredEl || _this._originalElement);
        }
      },
      getAreaColor (index) {
        return this.colors[index];
        //return this._color_areas[index].filters[1].color;
      },
      setAreaColors (colors, callback) {

        let promises = []

        for (let i = 0; i < colors.length; i++) {
          promises.push(new Promise((resolve) => {
            this.setColor(i, colors[i], resolve)
          }))
        }

        Promise.all(promises).then(()=>{
          this.fire("colors:changed", colors);
          this.fire("modified");
          //this.canvas && this.canvas.fire('object:modified', { target: this });
          callback && callback();
        })
      },
      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      // _render (ctx, noTransform) {
      //   let x, y, imageMargins = this._findMargins(), elementToDraw;
      //
      //   x = (noTransform ? this.left : -this.width / 2);
      //   y = (noTransform ? this.top : -this.height / 2);
      //
      //   if (this.meetOrSlice === 'slice') {
      //     ctx.beginPath();
      //     ctx.rect(x, y, this.width, this.height);
      //     ctx.clip();
      //   }
      //
      //   if (this.isMoving === false && this.resizeFilters.length && this._needsResize()) {
      //     this._lastScaleX = this.scaleX;
      //     this._lastScaleY = this.scaleY;
      //     elementToDraw = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, true);
      //   } else {
      //     elementToDraw = this._element;
      //   }
      //   elementToDraw && ctx.drawImage(elementToDraw,
      //     x + imageMargins.marginX,
      //     y + imageMargins.marginY,
      //     imageMargins.width,
      //     imageMargins.height
      //   );
      //   for (let i in this._color_areas) {
      //     elementToDraw = this._color_areas[i].canvas;
      //     elementToDraw && ctx.drawImage(elementToDraw,
      //       x + imageMargins.marginX,
      //       y + imageMargins.marginY,
      //       imageMargins.width,
      //       imageMargins.height
      //     );
      //   }
      //
      //   this._renderStroke(ctx);
      // }
    }
  }
}

// fabric.Raster.prototype.actions = Object.assign({},{
//   colors: {
//     type:   'menu',
//     title: 'color menu',
//     menu:   function(){
//       let _menu = [];
//       for(let key in this._color_areas){
//         _menu.push({
//           title: "Цвет",
//           args:   key,
//           value: {
//             get:    function(key){
//               let color = this.getColor(key);
//               if(color.constructor !== String){
//                 return "#000000"
//               }
//               return color;
//             },
//             set:    function(key,value){
//               this.setColor(key,value);
//               this.canvas.renderAll();
//             }
//           },
//           type:       "color"
//         })
//       }
//       return _menu;
//     }
//   }
// });
