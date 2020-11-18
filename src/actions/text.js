
fabric.Text.prototype.actions = {
  textFill: {
    type: "color",
    title: "fill",
    className: "fi fi-color",
    observe: "mouseup modified",
    variable: "textFill",
    // get (target) {
    //   let fill = target.getStyle("fill"); //texture pattern fill fix
    //   return typeof fill === "string" ? fill : "transparent";
    // },
    // set (target, value) {
    //   target.setStyle("fill", value);
    // },
    colorpicker: {
      text:         true,
      opacity:      true
    }
  },
  stroke: {
    className: "fa fa-pen-fancy",
    type: "color",
    title: "stroke",
    observe: "mouseup modified",
    get (target) {
      let color = target.getStyle("stroke");//texture pattern fill fix
      return typeof color === "string" ? color : "transparent";
    },
    set (target,value) {
      target.setStyle("stroke", value);
    },
  },
  bold: {
    type: "checkbox",
    title: "bold",
    variable: "bold",
    className: "fa fa-bold",
    observe: "mouseup modified",
    get (target) {
      return target.getStyle("fontWeight") === "bold";
    },
    set (target, value) {
      target.setStyle("fontWeight", value ? "bold" : "normal");
    },
  },
  italic: {
    className: "fa fa-italic",
    type: "checkbox",
    title: "italic",
    variable: "italic",
    observe: "mouseup modified",
    get (target) {
      return target.getStyle("fontStyle") === "italic";
    },
    set (target,value) {
      target.setStyle("fontStyle", value ? "italic" : "normal");
    },
  },
  underline: {
    type: "checkbox",
    title: "underline",
    variable: "underline",
    className: "fa fa-underline",
    observe: "mouseup modified",
    get (target) {
      return target.getStyle("underline");
    },
    set (target,value) {
      target.setStyle("underline", value );
    }
  },
  linethrough: {
    type: "checkbox",
    title: "linethrough",
    variable: "linethrough",
    observe: "mouseup modified",
    className: "text-linethrough fa fa-strikethrough",
    get (target) {
      return target.getStyle("linethrough");
    },
    set (target,value) {
      target.setStyle("linethrough", value);
    },
  },
  overline: {
    type: "checkbox",
    title: "overline",
    variable: "overline",
    observe: "mouseup modified",
    className: "text-overline fa fa-overline",
    get (target) {
      return target.getStyle("overline");
    },
    set (target, value) {
      target.setStyle("overline", value);
    },
  },
  textBackgroundColor: {
    className: "fa fa-brush",
    title: "text background-color",
    type: "color",
    observe: "mouseup modified",
    get (target) {
      return target.getStyle("textBackgroundColor");
    },
    set (target,value) {
      target.setStyle("textBackgroundColor", value);
    }
  },
  bgColor: {
    observe: "modified",
    className: "fa fa-brush",
    title: "background-color",
    type: "color",
    variable: "bgColor"
  },
  textBgColor: {//todo textBackgroundColor ???
    observe: "modified",
    title: "text background-color",
    type: "color",
    variable: "textBgColor"
  },
  textAlignCenter: {
    observe: "modified",
    title: "text-align center",
    option: "center",
    variable: "textAlign",
    className: "fa fa-align-center"
  },
  textAlignLeft: {
    observe: "modified",
    title: "text-align left",
    option: "left",
    variable: "textAlign",
    className: "fa fa-align-left"
  },
  textAlignRight: {
    observe: "modified",
    title: "text-align right",
    option: "right",
    variable: "textAlign",
    className: "fa fa-align-right"
  },
  textAlignJustify: {
    observe: "modified",
    title: "text-align justify",
    option: "justify",
    variable: "textAlign",
    className: "fa fa-align-justify"
  },
  textAlign: {
    observe: "modified",
    type: "menu",
    title: "text-align",
    variable: "textAlign",
    className (target){
      for(let tool of this.menu){
        if(this.toolbar._tools[tool].option === target.textAlign){
          return this.toolbar._tools[tool].className
        }
      }
      return ""
    },
    menu: ["textAlignCenter","textAlignLeft","textAlignRight","textAlignJustify"]
  },

  textTitleCase: {
    buttonContent: "Tt",
    title:      "title case",
    option:     "titlecase",
    variable:      "textCase"
  },
  textLowerCase: {
    buttonContent:        "tt",
    title:      "lower case",
    option:     "lowercase",
    variable:      "textCase"
  },
  textUpperCase: {
    buttonContent:        "TT",
    title:      "upper case",
    option:     "uppercase",
    variable:      "textCase"
  },
  textCase: {
    className: "fa fa-font-case",
    type: "options",
    title: "text case",
    variable: "textCase",
    menu: ["textUpperCase","textLowerCase","textTitleCase"]
  },
  font: {
    title: "font",
    className: "fa fa-font",
    menu: ["fontFamily","fontSize"]
  },
  fontFamily: {
    title: "font family",
    className: "fa fa-font",
    type: "font",
    popup: true,
    popupWidth: 180,
    observe: "mouseup modified",
    get (target) {
      return target.getStyle("fontFamily");
    },
    set (target, value) {
      target.setStyle("fontFamily", value);
    },
    static: true,
    options (target){
      return target.editor.fonts.map(item => ({
        value: item,
        font: item,
        label: item
      }))
    }
  },
  fontSize: {
    type: "select",
    title: "font size",
    className: "fa fa-text-height",
    itemClassName: "fontsize-selector",
    observe: "mouseup modified",
    // variable: "fontSize",
    get (target) {
      return target.getStyle("fontSize");
    },
    set (target,value) {
      target.setStyle("fontSize", parseInt(value));
    },
    inline: true,
    static: true,
    options (target) {
      return target.fontSizeOptions.map((el)=> {
        return {
          id: el,
          text: el
        }
      });
    },
    dropdown: {
      // theme: "toolbar-fontsize-selector select2-container--default",
      tags: true,
      width: 60,
      //minimumResultsForSearch: 1,
      templateSelection (state) {
        if (state.any) {
          return state.text;
        }
        return $(`<span>${state.text}</span>`);
      },
      templateResult (state, container, data) {
        let $el = $(`<span>${state.text}</span>`);
        return $el;
      },
    }
  },
  strokeWidth: {
    type: "select",
    title: "text stroke-width",
    itemClassName: "strokeWidth-selector",
    observe: "mouseup",
    get (target) {
      return target.getStyle("strokeWidth");
    },
    set (target, value) {
      target.setStyle("strokeWidth", parseInt(value, 10));
    },
    inline: true,
    static: true,
    options (target) {
      return [
        {id: 1, text: 1},
        {id: 2, text: 2},
        {id: 3, text: 3},
        {id: 4, text: 4},
        {id: 5, text: 5},
      ]
    },
    dropdown: {
      tags: true,
      width: 60,
      templateSelection (state) {
        if (state.any) {return state.text;}
        return $(`<span>${state.text}</span>`);
      },
      templateResult (state, container, data) {
        return $(`<span>${state.text}</span>`);
      }
    }
  },
  charSpacing: {
    className: "far fa-kerning",
    type: "button"
  },
  lineHeight: {
    className: "fas fa-line-height",
    type: "button",
    title: "text line-height",
    variable: "lineHeight",
    observe: "mouseup",
    step: 0.1,
    get (target) {
      return target.getStyle("lineHeight");
    },
    set (target,value) {
      target.setStyle("lineHeight", parseFloat(value));
    },
  },
  text: {
    className: "fa fa-text",
    type: "text",
    title: "text",
  },
  textStyle: {
    closeOnBlur: false,
    type: "menu",
    title: "text style",
    toggled: true,
    className: "fa fa-font",
    // render: function(){
    //   target.$button.css(target.target.generateTextStyle());
    // },
    menu: [
      "textAlign",
      "bold",
      "italic",
      // "underline",
      // "linethrough",
      // "overline",
      "fontFamily",
      // "fontSize",
      // "textFill",
      // "stroke",
      // "textBackgroundColor",
      // "strokeWidth"
    ]
  },

  //curved text
  curveText: {
    className: "button-easel",
    title: "curveText",
    action: "curveText"
  }
};

fabric.IText.prototype.actions = {
  enterEditing: {
    insert: "editTool",
    className: "fa fa-pencil-square-o",
    title: "enter editing"
  }
};

fabric.Textbox.prototype.actions = {
  textVerticalAlignMiddle: {
    title: "text vertical-align middle",
    option: "middle",
    variable: "textVerticalAlign",
    className: "fa fa-align-center fa-rotate-90"
  },
  textVerticalAlignTop: {
    title: "text vertical-align top",
    option: "top",
    variable: "textVerticalAlign",
    className: "fa fa-align-left  fa-rotate-90"
  },
  textVerticalAlignBottom: {
    title: "text vertical-align bottom",
    option: "bottom",
    variable: "textVerticalAlign",
    className: "fa fa-align-right fa-rotate-90"
  },
  textVerticalAlign: {
    type: "options",
    title: "text vertical-align",
    variable: "textVerticalAlign",
    menu: ["textVerticalAlignTop", "textVerticalAlignMiddle", "textVerticalAlignBottom"]
  }
};
