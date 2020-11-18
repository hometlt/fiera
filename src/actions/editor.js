// const icons = {
//   svg : require("!svg-inline-loader!./svg/svg.svg")
// };

Object.assign(fabric.Editor.prototype, {

  setActions: function (actions) {
    if (fabric.isLikelyNode) return;
    for (let klassName in actions) {
      for (let i in actions[klassName]) {
        actions[klassName][i].id = i;
      }
      if (klassName === "Editor") {
        this.actions = fabric.util.object.extend(this.actions, actions[klassName],true);
        continue;
      }
      if (!this.prototypes[klassName]) {
        this.prototypes[klassName] = {};
      }
      let proto = this.getKlass(klassName);

      this.prototypes[klassName].actions = {}
      for (let actionName in actions[klassName]) {
        let action = {};

        Object.assign(action,this._getActionValue(proto.prototype, actionName))
        fabric.util.object.extend(action,actions[klassName][actionName],true);
        this.prototypes[klassName].actions[actionName] = action
      }
    }
  }
});

fabric.Editor.prototype.actions = {

  addSlide: {
    title: "add slide",
    className: "fa fa-plus",
    action (editor) {
      var slideData = {};
      var _slide = editor.addSlide(this.product.getSlideData(productView, true));
      _slide.canvas.load(_slide.object);
      editor._setActiveSlide(_slide);
    }
  },
  //grid

  gridSize: {
    type:"number",
    className: "fa fa-th",
    title: "grid size"
  },
  grid: {
    title: "grid",
    className: "fa fa-th",
    type: "checkbox",
    variable: "grid"
  },

  //ruler
  rulers: {
    title: "rulers",
    className: "fa fa-ruler-combined",
    type: "checkbox",
    variable: "rulers"
  },
  //files
  create: {
    title: "create",
    className: "fa fa-plus-circle"
  },
  open: {
    title: "open",
    className: "fa fa-folder"
  },
  save: {
    title: "save",
    className: "fa fa-save",
    action: "saveOnServer"
  },
  //social

  instagramConnect: {
    className: "fa fa fa-chain",
  },
  instagramDisconnect: {
    className: "fa fa fa-chain-broken",
  },

  //zoom

  zoomMenu: {
    className: "fa fa-search",
    title: "zoom",
    menu: ["zoomOut", "zoom", "zoomIn"]
  },
  zoomOut: {
    itemClassName: "fiera-tool-range-minus",
    className: "fa fa-search-minus",
    title: "zoom out"
  },
  zoom: {
    itemClassName: "fiera-tool-range",
    showButton: false,
    type: "range",
    title: "zoom",
    min: 0.1,
    max: 10,
    fixed: 2,
    observe: "viewport:scaled"
  },
  zoomIn: {
    itemClassName: "fiera-tool-range-plus",
    title: "zoom in",
    className: "fa fa-search-plus"
  },

  //history
  undo: {
    key: "z",
    observe: "changed",
    className: "fa fa-undo",
    title: "undo",
    enabled: "canUndo"
  },
  redo: {
    key: "y",
    observe: "changed",
    className: "fa fa-redo",
    title: "redo",
    enabled: "canRedo"
  },
  historyState: {
    title: "list",
    itemClassName: "images-selector",
    className: "fa fa-history",
    type: "select",
    dropdown: {
      width: 300,
      templateSelection: function (state) {
        if (state.any) {
          return state.text;
        }
        return $("<span>" + state.id + ":" + state.type + "</span>");
      },
      templateResult: function (state, container, data) {
        if (!state.type)return;
        let keys = state.originalState && Object.keys(state.originalState).join(",") || "";
        let otype = state.object && state.object.type || "";
        return $(`<span title="${state.id}:${state.type}(${otype} ${keys})">${state.id}:${state.type}(${otype} ${keys})</span>`)
      },
    },
    variable: {
      set: "setHistoryState",
      get: "setHistoryState",
      options: "getHistoryStates"
    }
  },
  history: {
    title: "history",
    type: "menu",
    menu: ["redo", "undo"]
  },

  //export

  export: {
    closeOnBlur: false,
    className: "fas fa-file-download fbb fb-chrome",
    title: "export",
    menu: [
      "exportPngClient",
      "exportSvgClient",
      "exportPdfClient",
    ]
  },
  exportServer: {
    closeOnBlur: false,
    className: "fas fa-file-download fb fb-server",
    title: "export",
    menu: [
      "exportPngServer",
      "exportSvgServer",
      "exportPdfServer"
    ]
  },
  exportPngClient: {
    className: "fas fa-file-image",
    title: "exportPngClient"
  },
  exportPngServer: {
    className: "fas fa-file-image",
    title: "exportPngServer"
  },
  exportSvgClient: {
    // buttonContent: icons.svg,
    className: "fi fi-svg",
    title: "exportSvgClient"
  },
  exportSvgServer: {
    className: "fi fi-svg",
    // buttonContent: icons.svg,
    // className: "",
    title: "exportSvgServer"
  },
  exportPdfClient: {
    className: "far fa-file-pdf",
    title: "exportPdfClient"
  },
  exportPdfServer: {
    className: "far fa-file-pdf",
    title: "exportPdfServer"
  }
};
