
var _ = require('underscore');
var utils = require('./../util/util.js');
utils.compile = require('./../util/compile.js');
utils.object = require('./../util/object.js');


var Toolbar = (function(){
  function capitalize(string, firstLetterOnly) {
    return string.charAt(0).toUpperCase() +
      (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
  }

  function toDashed (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  var Toolbar  =  {
    fonts: [
      'Arial,Helvetica,sans-serif',
      'Arial Black,Gadget,sans-serif',
      'Comic Sans MS,cursive',
      'Courier New,Courier,monospace',
      'Georgia,serif',
      'Impact,Charcoal,sans-serif',
      'Lucida Console,Monaco,monospace',
      'Lucida Sans Unicode,Lucida Grande,sans-serif',
      'Palatino Linotype,Book Antiqua,Palatino,serif',
      'Tahoma,Geneva,sans-serif',
      'Times New Roman,Times,serif',
      'Trebuchet MS,Helvetica,sans-serif',
      'Verdana,Geneva,sans-serif',
      'Gill Sans,Geneva,sans-serif'
    ],
    buttons : [],
    create: function(PARENT, el, options, menu) {

      if (options) {
        if (options.button) {
          _.extend(Toolbar.tools.button, options.button);
        }
      }
      var actions = Toolbar.makeActions(PARENT, menu);
      if(el) {
        Toolbar.generateMenu(PARENT, el, options, actions);
        Toolbar.onCreate();
      }
    },
    makeActions: function (PARENT, actions) {
      if (!PARENT._actionsReady) {

        actions = actions || PARENT.actions;

        var result = {};

        for (var i in actions) {
          var _action = Toolbar.makeAction(i, actions[i], PARENT);
          if(_action){
            result[i] = _action;
          }
        }
        PARENT._actionsReady = true;
        PARENT.actions = result;
      }
      return PARENT.actions;
    },

    makeAction: function (id, _ORIGINAL, parent) {

      if (_ORIGINAL.constructor === Function) {
        _ORIGINAL = _ORIGINAL.call(target);
      }

      var target;

      if (_ORIGINAL.target && _ORIGINAL.target.constructor == Function) {
        target = _ORIGINAL.target.call(parent);
      } else {
        target = _ORIGINAL.target || parent;
      }

      var ___target = _ORIGINAL.target;
      var ___parent = _ORIGINAL.parent;
      delete _ORIGINAL.parent;
      delete _ORIGINAL.target;
      var RES = utils.object.cloneDeep(_ORIGINAL);
      _ORIGINAL.parent = ___parent;
      _ORIGINAL.target = ___target;


      RES.parent = ___parent;
      RES.target = target;
      RES.id = toDashed(id);


      function createGetter(property,useParent) {
        if (property.constructor == String) {
          var negative = false;
          if (property[0] == "!") {
            property = property.substr(1);
            negative = true;
          }
          if(useParent){
            return function () {
              return parent && !!parent[property] ^ negative;
            }
          }else{
            return function () {
              return target && !!target[property] ^ negative;
            }
          }
        }
        if (property.constructor == Function) {
          return property.bind(target);
        }
        return null;
      }

      if (_ORIGINAL.insert === undefined) {
        RES.insert = true;
      } else {
        if (_ORIGINAL.insert.constructor == String) {
          RES.insert = createGetter(_ORIGINAL.insert,true)()
        } else {
          RES.insert = _ORIGINAL.insert;
        }
      }
      if(!RES.insert)return;


      if (_ORIGINAL.action) {
        //RES = _ORIGINAL.action.bind(target);
        //_ORIGINAL.action = _ORIGINAL.action.bind(target);
        //_.extend(RES, _act);
        //arguments for action function
        if (_ORIGINAL.args) {
          RES._action = _ORIGINAL.action.bind(target, _ORIGINAL.args);
        } else {
          RES._action = _ORIGINAL.action.bind(target);
        }
        RES.action = function(){
          if(RES.disabled)return;
          RES._action.apply(this,arguments);
        }
      }


      if (_ORIGINAL.menu && _ORIGINAL.menu.constructor == Function) {
        RES.menu = _ORIGINAL.menu.bind(target);
      }



      if (_ORIGINAL.active) {
        RES.active = createGetter(_ORIGINAL.active);
      }


      if (_ORIGINAL.visible) {
        RES.visible = createGetter(_ORIGINAL.visible);
      }
      if (_ORIGINAL.enabled) {
        RES.enabled = createGetter(_ORIGINAL.enabled);
      }
      if (_ORIGINAL.value) {
        var _set, _get, _options;
        if (_ORIGINAL.value.constructor == String) {

          var setFunctionName = "set" + capitalize(_ORIGINAL.value, true),
            getFunctionName = "get" + capitalize(_ORIGINAL.value, true),
            minName = "min" + capitalize(_ORIGINAL.value, true),
            maxName = "max" + capitalize(_ORIGINAL.value, true),
            setFoo = target[setFunctionName],
            getFoo = target[getFunctionName],
            minFoo = target[minName],
            maxFoo = target[maxName];

          _set = setFoo || (_ORIGINAL.args ?
              function (val, args) {
                this[_ORIGINAL.value][args] = val;
              } :
              function (val) {
                this[_ORIGINAL.value] = val;
              });
          _get = getFoo || (_ORIGINAL.args ?
              function (args) {
                return this[_ORIGINAL.value][args];
              } :
              function () {
                return this[_ORIGINAL.value];
              });


          RES.value = {
            min: minFoo,
            max: maxFoo
          }

        } else {
          _set = _ORIGINAL.value.set;
          _get = _ORIGINAL.value.get;
          _options = _ORIGINAL.value.options;
        }

        if(RES.value.min !== undefined && RES.value.min.constructor !== Function){
          RES.value.min = function(){
            return target[RES.value.min]
          }
        }

        if(RES.value.max !== undefined && RES.value.max.constructor !== Function){
          RES.value.max = function(){
            return target[RES.value.max]
          }
        }
        var _min = RES.value.min, _max = RES.value.max;

        if (_set) {
          RES.value.set = ( _ORIGINAL.args ? _set.bind(target, _ORIGINAL.args) : _set.bind(target));
        }
        if (_get) {
          RES.value.get = ( _ORIGINAL.args ? _get.bind(target, _ORIGINAL.args) : _get.bind(target));
        }
        if (_min) {
          RES.value.min = ( _ORIGINAL.args ? _min.bind(target, _ORIGINAL.args) : _min.bind(target));
        }
        if (_max) {
          RES.value.max = ( _ORIGINAL.args ? _max.bind(target, _ORIGINAL.args) : _max.bind(target));
        }
        if (_options) {
          RES.value.options = ( _ORIGINAL.args ? _options.bind(target, _ORIGINAL.args) : _options.bind(target));
        }



      }

      if (RES.menu) {
        if(!RES.type){
          RES.type = "menu";
        }
        if (_ORIGINAL.menu.constructor === Function) {
          RES.menu = Toolbar.makeActions(target, _ORIGINAL.menu.call(target));
        } else {

          if (RES.type == "options") {

            for (var i in RES.menu) {
              RES.menu[i].parent = RES;
              RES.menu[i].type = "option";
            }

          }
          /*
           RES.menu[i].action = function (option) {
           RES.value.set(option);
           /*for (var k in RES.menu) {
           var subitem = RES.menu[k];
           if (subitem.active) {
           if (subitem.active(subitem.option)) {
           subitem.$item.addClass("active");
           } else {
           subitem.$item.removeClass("active");
           }
           }
           }
           }
           RES.menu[i].active = function (option) {
           return RES.value.get() == option;
           }
           }
           }*/

          for (var i in RES.menu) {
            RES.menu[i] = Toolbar.makeAction(i, RES.menu[i], target);
          }

        }
      }
      return RES;
    },
    onCreate: function () {

    },

    getKeyString: function (config) {
      var string = "";

      if (config.ctrlKey)string += "Ctrl + ";
      if (config.altKey)string += "Alt + ";
      if (config.shiftKey)string += "Shift + ";

      var _code = config.key;
      if(_code){
        string += config.key;
      }
      return string;
    },
    removeButtons: function (target) {
      for (var i = Toolbar.buttons.length;i--;) {
        var _config = Toolbar.buttons[i];
        if(target && _config.target != target ){
          continue;
        }
        Toolbar.buttons.splice(i,1);
      }
    },
    initKeys: function () {


      $("body").on( "keydown",function (e) {
        for (var i in Toolbar.buttons) {
          var _config = Toolbar.buttons[i];

          if (
            (_config.keyCode == e.keyCode || _config.key == e.key) &&
            (_config.ctrlKey === undefined || _config.ctrlKey == e.ctrlKey ) &&
            (_config.altKey === undefined || _config.altKey == e.altKey ) &&
            (_config.shiftKey === undefined || _config.shiftKey == e.shiftKey ) &&
            (_config.metaKey === undefined || _config.metaKey == e.metaKey )) {

            e.preventDefault();
            e.stopPropagation();
            if(_config.disabled){
              continue;
            }
            if (_config.option !== undefined) {
              _config.action.call(_config.target, _config.option, e)
            } else {
              _config.action.call(_config.target, e)
            }
          }
        }
      });

      //$(window).on("mousewheel", function (event) {
      //  for (var i in Toolbar.buttons) {
      //    var data = Toolbar.buttons[i];
      //    if (!data.mousewheel)continue;
      //    if (!data.ctrlKey || data.ctrlKey && event.ctrlKey) {
      //      if (event.deltaY > 0 && data.mousewheel == ">") {
      //        data.action.call(target, data.option || event, event)
      //      }
      //      if (event.deltaY < 0 && data.mousewheel == "<") {
      //        data.action.call(target, data.option || event, event)
      //      }
      //      event.preventDefault();
      //      event.stopPropagation();
      //      return false;
      //    }
      //  }
      //});

    },
    //getActions: function (PARENT) {
    //  var _actions = {};
    //  for (var j in PARENT.actions) {
    //    var _action = _.clone(PARENT.actions[j]);
    //
    //    var _menu = _action.menu;
    //    if (_menu) {
    //      var target = _action.target || PARENT;
    //      if (_menu.constructor == Function) {
    //        _action.menu = _menu = _menu();
    //      }
    //    }
    //    _actions[j] = _action;
    //  }
    //  return _actions;
    //},
    createInput: function ($item, data, type) {

      var target = data.target;
      var $input = $("<input>")
        .attr("type", type)
        .attr("min", data.value.min())
        .attr("max", data.value.max());

      $input.val(data.value.get());
      if (data.value.observe) {
        target.on(data.value.observe, function (val) {
          $input.val(data.value.get());
        });
      }
      $input.change(function (e) {
        data.value.set(parseFloat($input.val()))
      });
      $item.append($input);
    },
    colorpicker: function (el, options) {
      options.format = 'rgb';
      options.opacity = true;
      el.minicolors(options);
    },
    tools: {
      "fontFamily": {
        scope: function (data, options) {
          return {
            //currentValue: data.value.get(),
            onchange: function (e) {
              data.value.set(parseFloat($(e.target).val()));
            }
          }
        },
        template: '<div class="object-menu-item object-menu-font-family" title="{title}">' +
                  '<div class="fontSelect" transclude><div class="arrow-down">',
        post: function ($item, data, options, transclude) {

          transclude.fontSelector({
            'hide_fallbacks': true,
            'initial': data.value.get(),//'Courier New,Courier New,Courier,monospace',
            'selected': data.value.set.bind(data.target),
            'fonts': Toolbar.fonts
          });
        }
      },

      "label": {
        scope: function (data, options) {
          return {
            getValue: data.value.get,
            valueCurrent: data.value.get()
          }
        },
        template: '<div class="object-menu-item object-menu-label" title="{title}">',
        render: function ($item, data, options, tool, val) {
          var scope = fabric.util.object.defaults(tool.scope( data, options),data);
          $item.html(data.template.formatUnicorn(data.value.get()));
          utils.compile.compileElement($item,scope);
        }
      },
      "select": {
        scope: function (data, options) {
          return {
            getInputValue: function () {
              return parseFloat(data.$item.find("input").val());
            },
            getValue: data.value.get,
            setValue: data.value.set,
            onchange: function (e,model) {
              data.value.set(e.params.data.id,model);
            }
          }
        },
        template: '<div class="object-menu-item object-menu-select {itemClassName}" title="{title}" ><label for="xxx" class="btn button-{id} {className}"></label><select id="xxx">',
        post: function ($item, data, options, tool, val) {
          var model =  data.value.options();
          var _val = data.value.get();
          var _select = $item.find("select");
          _select.dpSelect({
            minimumResultsForSearch: Infinity,
            dropdownParent: $("body"),
            data:  model,
            templateSelection: function(state, container) {
              if (state.any) {
                return state.text;
              }
              return $('<span><span class="color-span" style="background-color:' + state.text + '"></span>' + state.text + '</span>');
            },
            templateResult: function(state, container){
              return data.templateResult(state, container,data);
            },
          }).on("select2:select", function(e) {
            data.onchange(e, model);
          });
          _select.dpSelect("val",[_val]);
        }
      },
      "number": {
        scope: function (data, options) {
          return {
            getInputValue: function(){
              return parseFloat(data.$item.find("input").val());
            },
            getValue: data.value.get,
            setValue: data.value.set,
            minValue: data.value.min && data.value.min(),
            maxValue: data.value.max && data.value.max(),
            valueCurrent: data.value.get(),
            onchange: function (e) {
              data.value.set(parseFloat($(e.target).val()));
            }
          }
        },
        template: '<div class="object-menu-item object-menu-number" title="{title}">' +
                    '<input type="number" min="{minValue}" max="{maxValue}" value="{valueCurrent}" onchange="onchange(event)">',
        render: function ($item, data, options, tool, val) {
          $item.find("input").val(data.value.get());
        }
      },
      "range": {
        scope: function (data, options) {
          return {
            minValue: data.value.min(),
            maxValue: data.value.max(),
            valueCurrent: data.value.get(),
            onchange: function (e) {
              data.value.set(parseFloat($(e.target).val()));
            }
          }
        },
        template: '<div class="object-menu-item object-menu-range" title="{title}">' +
        '<input type="range" min="{minValue}" max="{maxValue}" value="{valueCurrent}" onchange="onchange(event)">',
        render: function ($item, data, options, tool, val) {
          $item.find("input").val(data.value.get());
        }
      },
      "checkbox": {
        scope: function (data, options) {
          return {
            onchange: function (e) {
              data.value.set(e.target.checked)
            },
            valueCurrent: data.value.get()
          }
        },
        template:
        '<div class="object-menu-item object-menu-checkbox" title="{title}">' +
        '<input type="checkbox" onchange="onchange(event)" dp-checked="{valueCurrent}" id="checkbox-{id}">' +
        '<label for="checkbox-{id}"  class="btn button-{id} {className}">',
        render: function ($item, data, options, tool, val) {
          $item.find("input").val(val);
        }
      },
      "color": {
        template:
        '<div class="object-menu-item" title="{title}">' +
        '<div class="btn button-{id} {className}">' +
        '<input type="text" data-format="rgba" data-opacity="true" data-text="true" data-control="saturation" data-swatches="#fff|#000|#f00|#0f0|#00f|#ff0|#0ff"  value="{valueCurrent}" transclude>',
        post: function ($item, data, options, transclude) {
          var target = data.target;

          Toolbar.colorpicker(transclude, {
            defaultValue: data.value.get(),
            control:      transclude.attr('data-control') || 'hue',
            format:       transclude.attr('data-format') || 'hex',
            keywords:     transclude.attr('data-keywords') || '',
            inline:       transclude.attr('data-inline') === 'true',
            letterCase:   transclude.attr('data-letterCase') || 'lowercase',
            opacity:      transclude.attr('data-opacity'),
            position:     transclude.attr('data-position') || options.colorpickerPosition || 'right bottom',
            swatches:     transclude.attr('data-swatches') ? transclude.attr('data-swatches').split('|') : [],
            text:     transclude.attr('data-text'),
            change: function (value, opacity) {
              data.value.set(value);
            }
          });
        }
      },
      "options": {
        scope: function (data, options) {
          return {
            buttonsTitle: options.buttons && options.buttons.title || false,
            buttonscClassName: (options.buttons.className || '')
          }
        },
        template: '<div class="object-menu-item object-menu-options" title="{title}">' +
        '<div transclude>',
        post: function ($item, data, options, transclude) {
          Toolbar.generateMenu(data.target, transclude, options, data.menu);
        },
      },
      "menu": {
        template: '<div class="object-menu-item object-menu-menu" title="{title}">' +
        '<button class="btn button-menu-trigger button-{id} {className}"/>' +
        '<div class="object-menu submenu" transclude/>',
        post: function ($item, data, options, transclude) {
          //$item.find(".button-menu-trigger").click(function () {
          //  $item.find(".object-menu").toggle();
          //})
          if (data.hovered) {
            $item.addClass("hovered");
            Toolbar.toggleByHover($item, transclude, null, data)
          }
          if (data.toggled) {
            $item.addClass("toggled");
            Toolbar.toggleByButton($item, transclude)
          };
          Toolbar.generateMenu(data.target, transclude, options, data.menu);
        }
      },
      "effect": {
        scope: function (data, options) {
          return {
            buttonsTitle: options.buttons && options.buttons.title || false,
            isParameters: !!data.actionParameters,
            buttonscClassName: (options.buttons && options.buttons.className || '')
          }
        },
        template: '<div class="object-menu-item" title="{title}">' +
        '<button class="btn button-{id} {className} {buttonscClassName}">' +
        '<span dp-if="{buttonsTitle}" class="button-title">{title}</span>' +
        '</button>' +
        '<div dp-if="{isParameters}" class="menu-action-parameters" style="display: none" transclude></div>' +
        '</div>',
        post: function ($item, data, options, transclude) {


          var foo = function () {

            if (data.effectTpl) {
              var $tpl = $(data.effectTpl);
              transclude.html($tpl);
            }

            if (data.actionParametersId) {
              var $tpl = $("#" + data.actionParametersId).clone();
              transclude.html($tpl);
            }
            return data.actionParameters.call(data.target, transclude, data, options);
          }


          Toolbar.toggleByButton($item, transclude, foo ,data);
        }
      },
      "option": {
        scope: function (data, options) {
          return {
            parentId: data.parent.id,
            valueCurrent: data.parent.value.get() === data.option,
            onchange: function () {
              //оптимизировать
              var _value = $("[name=" + $(event.target).attr("name") + "]:checked").val();
              if (_value == data.option) {
                data.parent.value.set(data.option);
              }
            }
          }
        },
        template: '<div class="object-menu-item object-menu-option" title="{title}" >' +
        '<input type="radio" id="tool-{id}" dp-checked="{valueCurrent}" name="{parentId}" value="{option}" onchange="onchange()">' +
        '<label class="btn button-{id} {className}" for="tool-{id}">'
      },
      "button": {
        scope: function (data, options) {
          return {
            buttonsTitle: options.buttons && options.buttons.title || false,
            buttonscClassName: (options.buttons && options.buttons.className || '')
          }
        },
        template:
        '<div class="object-menu-item" title="{title}">' +
        '<button class="btn button-{id} {className} {buttonscClassName}"  onclick="!disabled && action(option)">' +
        '<span dp-if="{buttonsTitle}" class="button-title">{title}</span>'
      }
    },
    initItem: function ($item, data) {

      if (data.active) {
        if (data.active.call(data.target, data.option)) {
          $item.addClass("active");
        }
      }

      if (data.visible !== undefined) {
        if (data.visible.constructor == Function) {
          if (!data.visible.call(data.target)) {
            $item.hide();
          }
        } else if (!data.visible) {
          $item.hide();
        }
      }

      data.disabled = false;
      if (data.enabled !== undefined) {
        if (data.enabled.constructor == Function) {
          if (!data.enabled.call(data.target)) {
            $item.attr("disabled", true);
            data.disabled = true;
          }
        }
      }

      if (data.observe) {
        //todo
        if (data.visible && data.visible.constructor == Function) {
          data.target && data.target.on(data.observe, function () {
            if (!data.visible.call(data.target)) {
              $item.hide();
            } else {
              $item.show();
            }
          });
        }
        if (data.type == "options") {
          data.target && data.target.on(data.observe, function () {

            var _val = data.value.get();
            $("[name=" + data.id + "]").prop("checked",false);
            $("[name=" + data.id + "][value=" + _val +"]").prop("checked",true);
          });
        }


        if (data.enabled && data.enabled.constructor == Function) {
          data.target && data.target.on(data.observe, function () {
            if (!data.enabled.call(data.target)) {
              $item.attr("disabled", true);
              data.disabled = true;
            } else {
              $item.removeAttr("disabled");
              data.disabled = false;
            }
          });
        }
      }
    },
    toggleByHover: function ($item, $toggleElement, foo,data) {

      var onClose;

      $toggleElement.hide();
      $item.mouseout(function () {
        $toggleElement.hide();
        onClose && onClose();
      });
      $item.mouseover(function () {
        $toggleElement.show();
        onClose = foo && foo();
      });

      $item.click(function () {
        if (data && data.immediately) {
          data.action();
        }
      });
    },
    toggleByButton: function ($item, $toggleElement, foo,data) {

      var onClose;
      var _try_hide = function (e) {
        var _parents = $(e.target).parents();
        for (var i in _parents) {
          if (_parents[i] === $item[0]) {
            return false;
          }
        }
        if ($toggleElement.css("display") !== "none") {
          $toggleElement.hide();
          onClose && onClose();
        }
      };

      $toggleElement.click(function (e) {
        e.stopPropagation();
      });
      $toggleElement.hide();
      $item.click(function () {

        if ($toggleElement.css("display") !== "none") {
          $toggleElement.hide();
          onClose && onClose();
          $(window).off("click", _try_hide);
        } else {
          $toggleElement.show();
          $(window).on("click", _try_hide);

          onClose = foo && foo();

          if(data && data.immediately){
            data.action();
          }
        }
      })
    },
    generateMenu: function (target, el, options, menu) {



      var $el = el.constructor == String ? $("#" + el) : el;

      if (!$el.length)return;

      options = options || {
          title: false
        };
      options.buttons = options.buttons || {
          className: "",
          title: false
        };

      $el.empty();


      function _generateItem(data) {
        if (data.insert !== undefined && !data.insert) {
          return;
        }
        data.type = data.type || "button";

        var target = data.target;


        var tool = Toolbar.tools[data.type];

        if (!tool) {
          console.warn("tool undefined");
          return;
        }

        if (data.keyboard !== false && (data.key || data.shiftKey || data.altKey || data.ctrlKey || data.metaKey)) {
          if(data.keyCode && data.keyCode.constructor == String){
            data.keyCode = data.keyCode.toUpperCase().charCodeAt(0);
            data.key = String.fromCharCode(data.keyCode);
          }
          data.keyboard = true
        }
        if(data.keyboard){
          data.title += " (" + Toolbar.getKeyString(data) + ")";
          Toolbar.buttons.push(data);
        }



        var scope = data;
        if (tool.scope) {
          scope = fabric.util.object.defaults(tool.scope( data, options),data);
        }

        var $item = $(tool.template.formatUnicorn(scope));
        var transclude = $item.find("[transclude]");
        scope.$item = data.$item = $item;
        if(data.template){
          $item.html(data.template.formatUnicorn(data.value.get()));
        }

        utils.compile.compileElement($item,scope);



        if (data.value && data.value.observe) {
          target.on(data.value.observe, function (val) {
            tool.render( $item, data, options, tool, val);
            //Toolbar.fire(data.type + ":render",{item: $item, data: data, options: options, tool: tool, val: val})
          });
        }

        Toolbar.initItem($item, data);

        if (tool.post) {
          tool.post($item, scope, options, transclude.length ? transclude : null);
        }

        Toolbar.fire(data.type + ":created",{item: $item, data: data, options: options, tool: tool});

        $el.append($item);
      }

      for (var i in menu) {
        var data = menu[i];

        data && _generateItem(data);
      }
    }
  };
  utils.observable(Toolbar);
  return Toolbar;
})();
module.exports = Toolbar;
