{

  /*
   fabric.Image.filters.Redify = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
   type: 'Redify',
   applyTo: function (canvasEl) {
   let context = canvasEl.getContext('2d'),
   imageData = context.getImageData(0, 0,
   canvasEl.width, canvasEl.height),
   data = imageData.data;
   for (let i = 0, len = data.length; i < len; i += 4) {
   data[i + 1] = 0;
   data[i + 2] = 0;
   }
   context.putImageData(imageData, 0, 0);
   }
   });
   fabric.Image.filters.Redify.fromObject = function (object) {
   return new fabric.Image.filters.Redify(object);
   };
   */

  fabric.Image.filters.Sharpen = fabric.util.createClass(fabric.Image.filters.Convolute, {
    type: 'Sharpen',
    matrix: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]
  });


  fabric.Image.filters.Emboss = fabric.util.createClass(fabric.Image.filters.Convolute, {
    type: 'Emboss',
    matrix: [
        1,   1,   1,
        1, 0.7,  -1,
        -1,  -1,  -1
    ]
  });


  if(fabric.Image.filters.Mask){
    fabric.Image.filters.Mask.prototype.maskFilter = true;
  }

  let prototypeOptions = {
    Brightness: {
      "brightness": {value: 100, min: 0, max: 255}
    },
    Noise: {
      "noise": {value: 100, min: 0, max: 1000}
    },
    Convolute: {
      "opaque": {value: true, type: "boolean" },
      "matrix": {value: [1, 1, 1, 1, 1, 1, 1, 1, 1], type: "matrix" }
    },
    Blur: {},
    Sharpen: {},
    Emboss: {},
    Pixelate: {
      "blocksize": {value: 4, min: 2, max: 20}
    },
   /* Multiply: {
      "color": {type: 'color', value: "#F0F"}
    },
    Mask: {
      mask: {
        type: 'image',
        value: {
          src:  "photos/explosion.png"
        }
      },
      channel: { value: 0}
    },
    Tint: {
    "color":  {type: 'color', value: "#3513B0"},
    "opacity": {value: 1, min: 0, max: 1, step: 0.1}
    },
    Blend: {
    "color": {type: 'color', value: "#3513B0"},
    "mode": {
    value: "add",
    options: [
    {value: "add", title: "Add"},
    {value: "diff", title: "Diff"},
    {value: "subtract", title: "Subtract"},
    {value: "multiply", title: "Multiply"},
    {value: "screen", title: "Screen"},
    {value: "lighten", title: "Lighten"},
    {value: "darken", title: "Darken"}
    ]
    }
    }
    */
  };
  for(let i in prototypeOptions){
    fabric.Image.filters[i].prototype.options = prototypeOptions[i];
  }

}

fabric.util.object.extend(fabric.Editor.prototype, {
  getFiltersList: function(el) {

    el = el || fabric.Image.prototype;
    let filterList = [];
    for (let i in el.availableFilters) {
      let _f = fabric.Image.filters[el.availableFilters[i]];

      let _data = {
        type: el.availableFilters[i]
      };
      if (_f.prototype.custom) {
        if (!el.customFilters) {
          continue;
        }
      }
      if (_f.prototype.maskFilter) {
        if (!el.maskFilter) {
          continue;
        }
      }
      if (_f.prototype.caman) {
        if (!el.camanFilters) {
          continue;
        }
        _data.caman = true;
      } else {
        if (!el.fabricFilters) {
          continue;
        }
      }
      if (_f.prototype.options) {
        _data.options = fabric.util.object.clone(_f.prototype.options);
      }
      _data.text = _f.prototype.title || el.availableFilters[i];

      filterList.push(_data)
    }
    return filterList;
  }
});

Object.assign(fabric.Image.prototype, {
  camanFilters: false,
  fabricFilters: true,
  customFilters: false,
  maskFilter: false,
  availableFilters: [
    //fabricJS
    "BlackWhite",
    "BlendColor",
    "BlendImage",
    "Blur",
    "Brightness",
    "Brownie",
    "ColorMatrix",
    "Composed",
    "Contrast",
    // "Convolute",
    // "Emboss",
    "Gamma",
    "Grayscale",
    "HueRotation",
    "Invert",
    "Kodachrome",
    "Noise",
    "Pixelate",
    "Polaroid",
    "RemoveColor",
    "Saturation",
    "Sepia",
    // "Sharpen",
    "Technicolor",
    "Vintage"
  ],
});
