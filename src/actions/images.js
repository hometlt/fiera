fabric.Image.prototype.actions = {
  uploadImage: {
    title:  "upload image",
    className: "fa fa-upload"
  },
  fitManual: {
    title: "manual",
    className: "fa fa-bullseye",
    variable: "fitting",
    option: "manual"
  },
  fitCover: {
    title: "cover",
    className: "fa fa-dot-circle",
    variable: "fitting",
    option: "cover"
  },
  fitContain: {
    title: "contain",
    className: "far fa-dot-circle",
    variable: "fitting",
    option: "contain"
  },
  fitFill: {
    title: "fill",
    className: "fa fa-circle",
    variable: "fitting",
    option: "fill"
  },
  fitting: {
    title: "fit",
    type: "options",
    variable: "fitting",
    menu: ["fitManual","fitCover","fitContain","fitFill"]
  },
  source: {
    type: "effect",
    className: "fa fa-file-image-o",
    title: "source",
    actionParameters: function ($el, data) {
      data.target.editor.createGallery(data.target, $el);
    }
  },
  //cropping
  zoom: {
    type: "range",
    className: "fa fa-search-plus ",
    title: "zoom",
    observe: "crop:modified",
    min: 0,
    max: 1,
    step: 0.01
  },
  zoomIn: {
    className: "fa fa-search-plus ",
    title: "zoomIn",
    action () {
      this.cropZoomIn();
    }
  },
  zoomOut: {
    className: "fa fa-search-minus",
    title: "zoom out",
    action () {
      this.cropZoomOut();
    }
  },
  resolveClipingMask: {
    title: "resolve mask",
    className: "fa fa-crop",
    action: "resolveClipingMask",
    observe: "cropping:entered cropping:exited element:modified"
  },
  crop: {
    title: "crop",
    className: "fa fa-crop",
    action: "cropPhotoStart",
    observe: "cropping:entered cropping:exited element:modified"
  },
  //filters
  filterOptions: {
    type: "effect",
    className: "fa fa-filter",
    title: "filter options",
    actionParameters: function ($el, data) {
      //prototypeOptions
    }
  },
  filters: {
    title: "filters",
    itemClassName: "images-selector",
    className: "fa fa-filter",
    type: "select",
    toggleSelection: true,
    multipleSelection: true,
    set (target, value) {
      if(value){
        value.replace = true;
      }
      target.setFilter(value);
    },
    get: "getFilter",
    options: "getFiltersOptionsList",
    dropdown: {
      previewWidth: 60,
      previewHeight: 60,
      templateSelection: function (state) {
        if (state.any) {
          return state.text;
        }
        return $(`<span>${state.text}</span>`);
      },
      templateResult: function (state) {
        let $el = $(`<span title=><span class="filter-preview"></span><span class="option-name">${state.text}</span></span>`);
        let filters = [];
        if(state.id && state.id !== "none"){
          let filterName = state.id ? fabric.util.string.capitalize(state.id,true) : "none";
          filters.push({type: filterName});
        }
        let thumbnailImage = this.target.createFilterThumbnail(filters,this.dropdown.previewWidth,this.dropdown.previewHeight);
        if(thumbnailImage){
          $el.find(".filter-preview").append($(thumbnailImage));
        }
        return $el;
      },
    }
  }
}
