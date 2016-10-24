var objectUtils = require("./object")
var _ = require("underscore")

var utils = {
  worker: function (foo) {
    if (window.Worker) {
      var str = foo.toString();
      str = "onmessage=function(e)" + str.substring(str.indexOf("{"));
      var blob = new Blob([str]);
      //"onmessage = function(e) { postMessage('msg from worker'); }"]);
      var blobURL = window.URL.createObjectURL(blob);
      return new Worker(blobURL);
    } else {
      var worker = {
        terminate: function () {
        },
        postMessage: function (data) {
          setTimeout(function () {
            foo({data: data}, function (responseData) {
              worker.onmessage && worker.onmessage({data: responseData});
            })
          });
        }
      };
      return worker;
    }
  },
  observable: function (obj) {
    _.extend(obj, {

      fire: function fire(eventName, options) {
        if (!this.__eventListeners) {
          return;
        }
        var listenersForEvent = this.__eventListeners[eventName];
        if (!listenersForEvent) {
          return;
        }
        for (var i = 0, len = listenersForEvent.length; i < len; i++) {
          listenersForEvent[i].call(this, options || {});
        }
        return this;
      },
      on: function (eventName, handler) {
        if (eventName.constructor == Object) {
          for (var i in eventName) {
            this.on(i, eventName[i])
          }
          return this;
        }
        var events = eventName.split(" ");
        for (var i in events) {
          this.observe(events[i], handler)
        }
        return this;
      },
      observe: function (eventName, handler) {
        if (!this.__eventListeners) {
          this.__eventListeners = {};
        }
        if (arguments.length === 1) {
          for (var prop in eventName) {
            this.on(prop, eventName[prop]);
          }
        }
        else {
          if (!this.__eventListeners[eventName]) {
            this.__eventListeners[eventName] = [];
          }
          this.__eventListeners[eventName].push(handler);
        }
        return this;
      },
      off: function stopObserving(eventName, handler) {
        function _removeEventListener(eventName, handler) {
          if (!this.__eventListeners[eventName]) {
            return;
          }

          if (handler) {
            var idx = this.__eventListeners[eventName].indexOf(handler);
            if (idx !== -1) {
              this.__eventListeners[eventName].splice(idx, 1);
            }
          }
          else {
            this.__eventListeners[eventName].length = 0;
          }
        }

        if (!this.__eventListeners) {
          return;
        }
        if (arguments.length === 0) {
          this.__eventListeners = {};
        }
        else if (arguments.length === 1 && typeof arguments[0] === 'object') {
          for (var prop in eventName) {
            _removeEventListener.call(this, prop, eventName[prop]);
          }
        }
        else {
          _removeEventListener.call(this, eventName, handler);
        }
        return this;
      }
    })
  },
  inOrder: function (array, foo, callback) {
    var _index = 0;
    function _inOrderIndex() {
      if (++_index < array.length) {
        foo(array[_index], _index, _inOrderIndex)
      } else {
        callback && callback();
      }
    }
    foo(array[_index], _index, _inOrderIndex)
  },
  /**
   * возвращает объект с ключами строки url
   * @returns {{}}
   */
  queryString: function (query) {
    if(query) {
      query = query.substr(query.indexOf("?") + 1) ;
    }else{
      query = window.location.search.substring(1);
    }
    var obj = {};
    var _length = 0;
    if (!query)return obj;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      var _vname = pair[0], val = pair[1];
      if (typeof obj[_vname] === "undefined") {
        obj[_vname] = val || "";
        Object.defineProperty(obj, _length, {value: _vname, enumerable: false});
        _length++;
        // If second entry with this name
      } else if (typeof obj[_vname] === "string") {
        var arr = [obj[_vname], val];
        obj[_vname] = arr;
        Object.defineProperty(obj, _length, {value: _vname, enumerable: false});
        _length++;
        // If third or later entry with this name
      } else {
        obj[_vname].push(val);
        Object.defineProperty(obj, _length, {value: _vname, enumerable: false});
        _length++;
      }
    }
    Object.defineProperty(obj, "length", {value: _length, enumerable: false});
    return obj;
  },
  copyValue: function (value) {
    if (value == null) {
      return null
    }
    if (value == undefined) {
      return undefined
    }
    switch (value.constructor) {
      case Object:
        return objectUtils.deepExtend({}, value);
      case Array:
        return objectUtils.deepExtend([], value);
      case String:
      case Number:
      case Boolean:
        return value;
      default:
        //console.log(value.constructor);
        return objectUtils.deepExtend({}, value);
    }
  },
  clearValue: function (value) {
    switch (value.constructor) {
      case Object:
        for (var member in value) delete value[member];
        break;
      case Array:
        value.length = 0;
        break;
      default:
        delete value;
    }
  },
  objectsDifference: function (prev, now) {
    var changes = {};
    for (var prop in now) {
      if (!prev || prev[prop] !== now[prop]) {
        if (typeof now[prop] == "object") {
          var c = utils.objectsDifference(prev[prop], now[prop]);
          if (!_.isEmpty(c)) // underscore
            changes[prop] = c;
        } else {
          changes[prop] = now[prop];
        }
      }
    }
    return changes;
  },
  splitBy: function (query, delimiter) {
    var traceQueries = [];
    var r = 0,
      f = 0,
      _p_start = 0;
    if (query == "") return [];
    for (var i = 0; i < query.length; i++) {
      var c = query[i];
      if (c == "(") {
        r++;
        f = 1;
      } else if (c == ")") {
        r--;
      }
      if (r == 0 && f == 1) f = 0;
      if (delimiter.indexOf(c) != -1 && r == 0 && f == 0) {
        traceQueries.push(query.substring(_p_start, i));
        _p_start = i + 1;
      }
    }
    traceQueries.push(query.substring(_p_start));
    return traceQueries;
  },

  /**
   *  Тасование Фишера–Йетса,случайное тасование множества
   * @param object
   * @returns {*}
   */
  shuffle: function (object) {
    if (!object.length) return;
    var i = object.length;
    while (--i) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = object[i];
      object[i] = object[j];
      object[j] = temp;
    }

    return object; // for convenience, in case we want a reference to the array
  },
  filterValues: function (array, values) {
    var new_array = [];
    for (var i in array) {
      var _new_object = {};
      for (var j in values) {
        _new_object[values[j]] = array[i][values[j]]
      }
      new_array.push(_new_object);
    }
    return new_array;
  },
  queueLoad: function (total, completeCB, progressCB) {
    var loader = function (el) {
      loader.loaded.push(el);
      loader.progressCB && loader.progressCB(loader.loaded.length, loader.total, el, loader.loaded);

      if (loader.loaded.length == loader.total) {
        loader.completeCB && loader.completeCB(loader.total, el, loader.loaded);
        loader.fire("loaded");
      }
    };
    loader.completeCB = completeCB;
    loader.progressCB = progressCB;
    loader.total = total;
    loader.loaded = [];
    utils.observable(loader);

    return loader;
  }
};
module.exports =  utils;
