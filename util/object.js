var _ = require("underscore");

var utils = {

  /**
   * Dependency: underscore.js ( http://documentcloud.github.com/underscore/ )
   *
   * Mix it in with underscore.js:
   * _.mixin({deepExtend: deepExtend});
   *
   * Call it like this:
   * var myObj = utils.deepExtend(grandparent, child, grandchild, greatgrandchild)
   *
   * Notes:
   * Keep it DRY.
   * This function is especially useful if you're working with JSON config documents. It allows you to create a default
   * config document with the most common settings, then override those settings for specific cases. It accepts any
   * number of objects as arguments, giving you fine-grained control over your config document hierarchy.
   *
   * Special Features and Considerations:
   * - parentRE allows you to concatenate strings. example:
   *   var obj = utils.deepExtend({url: "www.example.com"}, {url: "http://#{_}/path/to/file.html"});
   *   console.log(obj.url);
   *   output: "http://www.example.com/path/to/file.html"
   *
   * - parentRE also acts as a placeholder, which can be useful when you need to change one value in an array, while
   *   leaving the others untouched. example:
   *   var arr = utils.deepExtend([100,    {id: 1234}, true,  "foo",  [250, 500]],
   *                          ["#{_}", "#{_}",     false, "#{_}", "#{_}"]);
   *   console.log(arr);
   *   output: [100, {id: 1234}, false, "foo", [250, 500]]
   *
   * - The previous example can also be written like this:
   *   var arr = utils.deepExtend([100,    {id:1234},   true,  "foo",  [250, 500]],
   *                          ["#{_}", {},          false, "#{_}", []]);
   *   console.log(arr);
   *   output: [100, {id: 1234}, false, "foo", [250, 500]]
   *
   * - And also like this:
   *   var arr = utils.deepExtend([100,    {id:1234},   true,  "foo",  [250, 500]],
   *                          ["#{_}", {},          false]);
   *   console.log(arr);
   *   output: [100, {id: 1234}, false, "foo", [250, 500]]
   *
   * - Array order is important. example:
   *   var arr = utils.deepExtend([1, 2, 3, 4], [1, 4, 3, 2]);
   *   console.log(arr);
   *   output: [1, 4, 3, 2]
   *
   * - You can remove an array element set in a parent object by setting the same index value to null in a child object.
   *   example:
   *   var obj = utils.deepExtend({arr: [1, 2, 3, 4]}, {arr: ["#{_}", null]});
   *   console.log(obj.arr);
   *   output: [1, 3, 4]
   *
   **/
  deepExtend: function (/*obj_1, [obj_2], [obj_N]*/) {
    if (arguments.length < 1 || typeof arguments[0] !== 'object') {
      return false;
    }

    if (arguments.length < 2) return arguments[0];

    var target = arguments[0];

    // convert arguments to array and cut off target object
    var args = Array.prototype.slice.call(arguments, 1);

    var key, val, src, clone, tmpBuf;

    args.forEach(function (obj) {
      if (typeof obj !== 'object') return;

      for (key in obj) {
        if (!(key in obj)) continue;

        src = target[key];
        val = obj[key];

        if (val === target) continue;

        if (typeof val !== 'object' || val === null) {
          target[key] = val;
          continue;
          //} else if (val instanceof Buffer) {
          //  tmpBuf = new Buffer(val.length);
          //  val.copy(tmpBuf);
          //  target[key] = tmpBuf;
          //  continue;
        } else if (val instanceof Date) {
          target[key] = new Date(val.getTime());
          continue;
        } else if (val instanceof RegExp) {
          target[key] = new RegExp(val);
          continue;
        }

        if (typeof src !== 'object' || src === null) {
          clone = (Array.isArray(val)) ? [] : {};
          target[key] = utils.deepExtend(clone, val);
          continue;
        }

        if (Array.isArray(val)) {
          clone = (Array.isArray(src)) ? src : [];

          target[key] = _.union(clone, val);
          //todo  если заимствуем массив , то ссохраняем значения из обоих массивов
          //target[key] = utils.deepExtend(clone, val);

        } else {
          clone = (!Array.isArray(src)) ? src : {};
          target[key] = utils.deepExtend(clone, val);
        }

      }
    });

    return target;
  },
  cloneDeep: function (object) {
    var clone = _.clone(object);

    _.each(clone, function (value, key) {

      if (_.isFunction(value)) {
        clone[key] = value;
        return;
      }
      if (value && value.constructor == Object) {
        clone[key] = utils.cloneDeep(value);
      }
    });

    return clone;
  },
  rearrange: function (object, keys) {
    var _newOrder = {};
    for (var i in keys) {
      if(object[keys[i]] !== undefined){
        _newOrder[keys[i]] = object[keys[i]]
      }
    }
    // for (i in object) {
    //   delete object[i];
    // }
    // for (i in _newOrder) {
    //   object[i] = _newOrder[i];
    // }
    return _newOrder;
  },
  sortBy: _.sortBy,
  defaults: _.defaults,
  findWhere: _.findWhere,
  filter: _.filter,
  extend: function (destination) {
    // JScript DontEnum bug is not taken care of
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var property in source) {
        destination[property] = source[property];
      }
    }
    return destination;
  }
};
module.exports =  utils;
