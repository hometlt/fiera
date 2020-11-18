fabric.Object.prototype.actions = {
  lock: {
    title: "lock",
    titleActive: "lock",
    titleInactive: "unlock",
    className: "fa fa-lock",
    classNameActive: "fa fa-lock",
    classNameInactive: "fa fa-unlock",
  },
  origin: {
    type: "button",
    className: "fa fa-th",
    title: "origin"
  },
  movement: {
    className: "fa fa-arrows",
    menu: [
      "moveUp",
      "moveDown",
      "moveLeft",
      "moveRight"
    ]
  },
  moveUp: {
    className: "fa fa-arrow-up",
    type: "key",
    keyCode: 38,
  },
  moveDown: {
    className: "fa fa-arrow-down",
    type: "key",
    keyCode: 40,
  },
  moveLeft: {
    className: "fa fa-arrow-left",
    type: "key",
    keyCode: 37,
  },
  moveRight: {
    className: "fa fa-arrow-right",
    type: "key",
    keyCode: 39,
  },
  boundingRect: {
    type: "label",
    template: `
        <dt>L:</dt><dd class="{leftClass}" title="{left}">{roundLeft}</dd>
        <dt>T:</dt><dd class="{topClass}" title="{top}">{roundTop}</dd>
        <dt>R:</dt><dd class="{rightClass}" title="{right}">{roundRight}</dd>
        <dt>B:</dt><dd class="{bottomClass}"  title="{bottom}">{roundBottom}</dd>
    `,
    observe: "modified scaling moving rotating",
    get (target) {
      let _rect = target.getBoundingRect(),_t,_l,_r,_b
      if (target.movementLimits) {
        let _mlr
        if (target.movementLimits === target.canvas) {
          let _v = target.canvas.viewportTransform
          _mlr = {
            left: _v[4],
            top: _v[5],
            width: (target.canvas.originalWidth || target.canvas.width) * _v[0],
            height: (target.canvas.originalHeight || target.canvas.height) * _v[3],
            right: 0,
            bottom: 0
          }
        } else {
          _mlr = target.movementLimits.getBoundingRect()
        }

        _rect.bottom = target.movementLimits.height - _rect.height
        _t = _rect.top - _mlr.top
        _l = _rect.left - _mlr.left
        _r = _mlr.width - _rect.width - _l
        _b = _mlr.height - _rect.height - _t
      } else {
        _t = _rect.top
        _l = _rect.left
        _b = target.canvas.height - _rect.height - _rect.top
        _r = target.canvas.width - _rect.width - _rect.left
      }

      return {
        topClass: _t > 0 ? "positive" : _t < 0 ? "negative" : "zero",
        bottomClass: _b > 0 ? "positive" : _b < 0 ? "negative" : "zero",
        leftClass: _l > 0 ? "positive" : _l < 0 ? "negative" : "zero",
        rightClass: _r > 0 ? "positive" : _r < 0 ? "negative" : "zero",
        top: _t,
        left: _l,
        bottom: _b,
        right: _r,
        roundTop: Math.round(_t),
        roundLeft: Math.round(_l),
        roundBottom: Math.round(_b),
        roundRight: Math.round(_r)
      }
    }
  },
  left: {
    buttonContent: "X:",
    type: "number",
    title: "left",
    set (target, val) {
      target.left = val
      target.fire("modified")
      target.canvas.fire("object:modified", {target: target})
      target.canvas.renderAll()
    },
    get (target) {
      return target.left
    },
    observe: "modified"
  },
  top: {
    buttonContent: "Y:",
    type: "number",
    title: "top",
    set (target, val) {
      target.top = val
      target.fire("modified")
      target.canvas.fire("object:modified", {target: target})
      target.canvas.renderAll()
    },
    get (target) {
      return target.top
    },
    observe: "modified"
  },
  position: {
    className: "fa fa-arrows-alt",
    title: "position",
    type: "menu",
    menu: ["left","top"]
  },
  dimensions: {
    // icon: "data:image/svg+xml;base64," + require("base64-loader!./../media/dimensions.svg"),
    title: "dimensions",
    type: "menu",
    menu: ["height","width"]
  },
  lockAspectRatio: {
    title: "lock aspect ratio",
    className: "fa fa-lock",
  },
  width: {
    type: "number",
    className: "fa fa-arrows-h",
    title: "width",
    set (target, val) {
      target.saveState()
      target.dimensionsWidthValue = val
      target.scaleToWidth(val * target.canvas.getZoom())
      // target.canvas.fireModifiedIfChanged(target)
      target.fire("modified", {})
      target.canvas.fire("object:modified", {target: target})
      target.canvas.renderAll()
      delete target.dimensionsWidthValue
    },
    get (target) {
      if (target.dimensionsWidthValue) {
        return target.dimensionsWidthValue
      }
      return Math.round(target.getBoundingRect().width / target.canvas.getZoom())
    },
    observe: "modified"
  },
  height: {
    className: "fa fa-arrows-v",
    type: "number",
    title: "height",
    set (target,val) {
      target.saveState()
      target.scaleToHeight(val * target.canvas.getZoom())
      target.dimensionsHeightValue = val
      target.fire("modified", {})
      target.canvas.fire("object:modified", {target: target})
      target.canvas.renderAll()
      delete target.dimensionsHeightValue
    },
    get (target) {
      if (target.dimensionsHeightValue) {
        return target.dimensionsHeightValue
      }
      return Math.round(target.getBoundingRect().height / target.canvas.getZoom())
    },
    observe: "modified"
  },
  centerAndZoomOut: {
    className: "fa fa-search-plus",
    title: "center and zoom out"
  },
  flipX: {
    type: "checkbox",
    title: "flip horizontally",
    variable: "flipX",
    className: "fi fi-flip-h",
    observe: "modified"
  },
  flipY: {
    type: "checkbox",
    title: "flip vertically",
    variable: "flipY",
    className: "fi fi-flip-v",
    observe: "modified"
  },
  shadow : {
    title: "shadow ",
    className: "fi fi-shadow",
    // buttonContent: icons.svgIconShadow
  },
  remove: {
    title: "remove",
    className: "fa fa-trash",
    key: "Delete",
    action: "removeFromCanvas"
  },
  duplicate: {
    title: "duplicate",
    className: "far fa-clone"
  },
  fill: {
    className: "fa fa-paint-brush",
    title: "color",
    type: "color",
    variable: "fill",
    observe: "modified"
  },
  fillGradient: {
    className: "fas fa-palette",
    title: "fill with gradient",
    // type: "effect",
    type: "gradient",
    variable: "fill",
    observe: "modified"
    // source: {
    //   type: "effect",
    //   className: "fa fa-file-image-o",
    //   title: "source",
    //   actionParameters: function ($el, data) {
    //     data.target.editor.createGallery(data.target, $el)
    //   }
    // }
  },
  stroke: {
    className: "fa fa-pen-nib",
    title: "stroke",
    type: "color"
  },
  strokeWidth: {
    min: 0,
    max: 10,
    className: "fa fa-pen-nib",
    title: "stroke width",
    type: "number"
  },
  rotateLeft: {
    title: "rotate left",
    className: "fa fa-rotate-left fbs fb-vector-square",
    action: "rotateLeft"
  },
  rotateRight: {
    title: "rotate right",
    className: "fa fa-rotate-right fbs fb-vector-square ",
    action: "rotateRight"
  },
  stretch: {
    className: "fi fi-stretching",
    // buttonContent: icons.stretching,
    title: "stretch",
    action: "setAsBackgroundImage"
  },
  opacity: {
    className: "fi fi-opacity",
    title: "opacity",
    type: "range",
    min: 0,
    max: 1,
    variable: "opacity",
    observe: "modified",
    step: 0.01,
    fixed: 2
  }
}

fabric.Group.prototype.actions = {
  remove: {
    className:  "fa fa-trash",
    title:      "remove",
    key:        "Delete",
    action:     "removeFromCanvas"
  },
  duplicate: {
    className:  "fa fa-clone",
    title:      "duplicate"
  },
  ungroup: {
    title: "ungroup",
    className: "fa fa-object-ungroup",
    visible: "!isSelectionGroup",
    action: "ungroup"
  }
}

fabric.ActiveSelection.prototype.actions = {
  ungroup: false,
  group: {
    className: "fa fa-object-group",
    title: "group selected objects",
    action: "groupElements"
  }
};

