Object.assign(fabric.Canvas.prototype, fabric.ActionsMixin);

fabric.Canvas.prototype.actions = {
    clearObjects: {
      title: "clearObjects",
      className: "fa fa-trash"
    },
    clear: {
      title: "clear",
      className: "fa fa-trash"
    },
    selectAll: {
      keyCode: "a",
      ctrlKey: true,
      title: "Select All",
      type: "key"
    },
    backgroundColor: {
      className: "fas fa-fill-drip",
      title: "background color",
      observe: "loaded",
      // panel: "color-panel",
      // variable: "backgroundColor",
      // options: {
      //   colorpicker: {
      //     opacity:      false,
      //     text:         false
      //   }
      // }
      type: "color",
      colorpicker: {
        swatches:   ["#ffffff00","#fff","#000","#f00","#0f0","#00f","#ff0","#0ff","#f0f"],
        opacity:      true,
        text:         true
      }
    },
    dimensions: {
      title: "dimensions",
      type: "menu",
      menu: ["height","width","lockAspectRatio"]
    },
    lockAspectRatio: {
      title: "lock aspect-ratio",
      className: "fa fa-lock",
    },
    width: {
      min:   100,
      max:  5000,
      type: "number",
      className: "fa fa-arrows-h",
      title: "width",
      observe: "modified"
    },
    height: {
      min:   100,
      max:  5000,
      className: "fa fa-arrows-v",
      type: "number",
      title: "height",
      observe: "modified"
    },
    add: {
      className: "fa fa-plus",
      title: "add",
      menu: [
        "uploadImage",
        "addText",
        "addRect",
        "addCircle",
        "addTriangle",
        "addImageByURL",
        "addQrCode",
      ]
    },
    addText: {
      className: "fa fa-font",
      title: "add text"
    },
    addQrCode: {
      className: "fa fa-qrcode",
      title: "add qr-code",
    },
    addRect: {
      title: "add rectangle",
      className: "fa fa-square-full"
    },
    addCircle: {
      title: "add circle",
      className: "fa fa-circle",
    },
    addTriangle: {
      title: "add triangle",
      className: "fas fa-play",
    },
    addImageByURL: {
      title: "add image",
      className: "fas fa-image"
    },

    //slides
    removeSlide: {
      title: "remove slide",
      className: "fa fa-trash-o"
    },
    duplicateSlide: {
      title: "duplicate slide",
      className: "fa fa-clone"
    },
    //layers
    //export
    export: {
      className: "fa fa-file-download",
      title: "export",
      menu: ["exportJSON","exportPNG","exportSVG","exportPDF"]
    },
    exportJSON: {
      title: "export JSON",
      className: "fa fa-file-alt"
    },
    exportPNG: {
      title: "export PNG",
      className: "fa fa-file-image"
    },
    exportSVG: {
      title: "export SVG",
      className: "fa fa-file-code"
    },

    //copy paste
    cutObjects: {
      title: "cut",
      className: "fa fa-cut"
    },
    copyObjects: {
      title: "copy",
      className: "fa fa-copy"
    },
    pasteObjects: {
      title: "paste",
      className: "fa fa-paste"
    },

    //upload
    uploadImage: {
      className: "fa fa-upload",
      key: "u",
      title: "upload image",
      action (canvas) {
        canvas.uploadImage({data: "default"});
      }
    }
  };
