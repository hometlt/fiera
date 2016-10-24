
var path = require("./path");
var util = require("./util");
var object = require("./object");

function isServer() {
  return ! (typeof window != 'undefined' && window.document);
}


if (isServer()) {
  var fs = require('fs');
}


function _load_json (value, callback_success, callback_error){

  var output = null;
  var errors = [];

  if (value.constructor == String) {

    var filename, regex_data, init_property;
    regex_data = /^([^#]*)#?(.*)$/.exec(value);

    filename = regex_data[1];
    init_property = regex_data[2];
    utils.getInlineJson(filename, "json", _loadJson_data, function (error) {
      errors.push(error);
      if (callback_error) {
        callback_error(error)
      } else {
        console.error("file: \"" + filename + "\". " + error.message)
      }
    });
  } else {
    _loadJson_data(value);
  }

  function _loadJson_data(data) {
    /*
     замена записей "url(./path/to/file)  на "../../path/to/file"
     url начинающиеся с ./ относительно родителького json файла

     url с "/" добавляется APP_STATIC_PATH
     */
    utils.recoursive(data,
      function (property, value, parent) {
        if (/^url\(.*\)$/.test(value)) {
          var regex_data = /^url\((\.?\/)?(.*)\)$/.exec(value);
          var url = regex_data[2];

          if (regex_data[1] == "/") {
            url = window.APP_STATIC_PATH + url;
          }
          if (regex_data[1] == "./") {
            url = path.getParentDirectoryUrl(filename) + url;
          }

          parent[property] = path.resolve(url);
        }
      }
    );


    var loader = util.queueLoad(1, function finalize() {

      if (init_property) {
        var prop_arr = init_property.split("/");
        for (var i = 0; i < prop_arr.length; i++) {
          data = data[prop_arr[i]];
        }
      }

      if (errors.length) {
        if (callback_error) callback_error(errors);
      } else {
        if (callback_success) callback_success(data);
        output = data;
      }
    });

    /**
     * remove comments
     */
    utils.recoursive(data, function (property, value, parent) {
      /*
       remove comments like
       ["@comment()"]
       "@comment": {}
       */
      if (/^\/\/.*$/.test(value) || /^@comment\(.*\)$/.test(value) || property == "@comment") {
        if (parent.constructor == Array) {
          parent.splice(property, 1);
        } else {
          delete parent[property];
        }
      } else if (/^@extend.*$/.test(property)) {

        loader.total++;
        _load_json(value, function (data) {
          var ext_data = object.deepExtend(data, parent);
          object.deepExtend(parent, ext_data);
          delete parent["@extend"];
          loader();
        }, function (data, error) {
          errors.push(error);
          loader();
        });
      } else if (/^@extend\(.*\)$/.test(value)) {
        var _reg_data = /^@extend\((\.\/)?(.*)\)$/.exec(value);
        var url = _reg_data[2];
        if (_reg_data[1]) {
          url = path.getParentDirectoryUrl(filename) + url;
        }
        loader.total++;
        _load_json(url, function (data) {
          parent[property] = data;
          loader();
        }, function (data, error) {
          errors.push(error);
          loader();
        });
      } else if (/^@mixin\(.*\)$/.test(value)) {
        var _reg_data = /^@mixin\((\.\/)?(.*)\)$/.exec(value);
        var url = _reg_data[2];
        if (_reg_data[1]) {
          url = path.getParentDirectoryUrl(filename) + url;
        }
        loader.total++;
        _load_json(url, function (data) {
          if (parent.constructor == Array) {
            parent.splice(property, 1);
            for (var i in data) {
              parent.push(data[i])
            }
          } else {
            delete parent[property];
            for (var i in data) {
              parent[i] = data[i];
            }
          }
          loader();
        }, function (data, error) {
          errors.push(error);
          loader();
        });
      } else if (/^@load\((.*)\)$/.test(value)) {
        var _reg_data = /^@load\((\.?\/)?(.*)\)$/.exec(value);
        var url = _reg_data[2];
        if (_reg_data[1] == "/") {
          url = window.APP_STATIC_PATH + url;
        }
        if (_reg_data[1] == "./") {
          url = path.getParentDirectoryUrl(filename) + url;
        }

        loader.total++;
        utils.getInlineJson(url, "html", function (data) {
          parent[property] = data;
          loader();
        }, function (data, error) {
          errors.push(error);
          loader();
        });
      }

    });
    loader();

  }

  return output;
}

var utils = {
  CACHED_JSON : {},
  loadJsonSync: function(src){
    var data;
    _load_json(src,function(_data){
      data = _data;
    });
    return data;
  },

  /**
   позволяет использовать конструкции вида
   расширить данные из файла template.json
   "@extend" : "url(data/template.json)",
   "@extend" : "url(data/template.json#settings/stages)",

   //заменить строку наданные из файла
   "stages":       "url(data/template.json#settings/stages)",

   * @param filename
   * @param callback_success
   * @param callback_error
   */
  loadJson: function (value,resolve_cb,fail_cb) {
      return _load_json(value,function(data){
        resolve_cb && resolve_cb(data);
      },function(err){
        fail_cb && fail_cb(err);
      });
  },

  removeComments: function (str) {
    str = str.replace(/^\s*(\/\/.*|(?:\/\*[\s\S]*?)\*\/\s*)$/gm,"");
    return str;
  },
  /**
   *
   * @param object
   * @param criteria - выполнять функцию со всеми объектами
   */
  recoursive: function (object, criteria) {
    var readed = [];
    if (!object) return;
    return (function sub_recoursive(object) {
      if (readed.indexOf(object) != -1) {
        return;
      }
      readed.push(object);


      if (object instanceof Array) {
        for (var prop = object.length; prop--;) {
          if (object[prop] && (object[prop].constructor == Object || object[prop].constructor == Array)) {
            sub_recoursive(object[prop]);
          } else {
            var break_ = criteria(prop, object[prop], object);
          }
        }
      } else {
        for (var prop in object) {
          if (object[prop] && (object[prop].constructor == Object || object[prop].constructor == Array)) {
            sub_recoursive(object[prop]);
          } else {
            var break_ = criteria(prop, object[prop], object);
          }
        }
      }
    })(object);
  },

  parseCSV: function (data) {
    var rows = data.split(/\n/);
    var columns = rows[0].split(',');
    rows.splice(0, 1);

    for (var i = 0; i < rows.length; i++) {
      var output_row_data = {};
      var row_data = [];


      var _quote = false, last = -1;
      var j = -1;
      var str = rows[i];
      while (++j < str.length) {
        if (!_quote) {
          if (str[j] == '\'' || str[j] == '\"') {
            _quote = str[j];
          }
          if (str[j] == ",") {
            var _val = str.substring(last, j);
            if (_val[0] == '\"' && _val[_val.length - 1] == '\"') {
              _val = _val.substring(1, _val.length - 1);
            }
            row_data.push(_val);
            last = j + 1;
          }
        } else {
          if (str[j] == _quote) {
            _quote = false;
          }
        }
      }

      for (var j in row_data) {
        output_row_data[columns[j]] = row_data[j];
      }
      rows[i] = output_row_data;
    }
    return rows;
  },
  parseData: function (data, dataType) {
    var _parsed;
    if (dataType == "csv") {
      _parsed = utils.parseCSV(data);
    } else if (dataType == "json") {
      _parsed = data.trim();
      //if (data[0] != "{" && data[0] != "[") {
      //  return false;
      //}

      _parsed = utils.removeComments(_parsed);
      //data  = data.replace(/\n/g,"")

      try{
        var _parsed = JSON.parse(_parsed);//= JSON.parse(data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,""));
      }catch(e){
        return {
          status: "error",
          message: e.toString(),
          data:  data
        };
      }
      //var script = $("<script type='text/json' id='" + url + "'>" + JSON.stringify(data) + "</script>");
    }
    return {
      status: "success",
      data: _parsed
    };
  },
  load: function (url, dataType, callback_success, callback_error) {
    //todo
    if (isServer()) {
      try {
        var data = fs.readFileSync(url, 'utf8');
        data = data.replace(/^\uFEFF/, '');
        var _parsed = utils.parseData(data, dataType);
        if(_parsed.status == "error"){
          callback_error({
            status:   "error",
            message:  _parsed.message,
            data:     _parsed.data
          });
          return;
        }
        callback_success(_parsed.data);
      } catch (e) {

        if (e.code === 'ENOENT') {
          console.log('File not found!');
        } else {
          throw e;
        }
        callback_error(data);
      }
    } else {

      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            var data = httpRequest.responseText;
            var _parsed = utils.parseData(data, dataType);
            if(_parsed.status == "error"){
              callback_error({
                status: httpRequest.status,
                message:  _parsed.message,
                response: httpRequest.responseText
              });
              return;
            }
            callback_success(_parsed.data);
          } else {
            callback_error(url, httpRequest)
          }
        }
      };
      httpRequest.open('GET', url);
      httpRequest.send();
    }
  },
  /**
   * Позволяетзагружать json файлы , содержащие ссылки на другие json файлы.
   * вместо ссылок типа
   *  "property" : "url(chunk.json)"
   *  будет загружено содержимое файла
   *  "property" : {...}
   *
   *  если указать якорь
   *  "property" : "url(chunk.json#settings/chunk/0/text)"
   *
   * то будет загружено содержимое поля settings.chunk[0].text из файла chunk.json
   *
   *
   * @param filename  путь к основному json файлу
   * @param callback  будет вызван после окончания загрузки всех файлов
   */
  getInlineJson: function (url, dataType, callback_success, callback_error) {

    if (dataType.constructor != String) {
      callback_error = callback_success;
      callback_success = dataType;
      dataType = "json";
    }


    if (typeof utils.CACHED_JSON !== "undefined" && utils.CACHED_JSON && utils.CACHED_JSON[url]) {
      callback_success(utils.CACHED_JSON[url]);
      return;
    }
    if (typeof $ !== "undefined") {
      if (typeof document !== "undefined") {
        var inline = $("script[id='" + url + "']");
        if (inline.length > 0) {
          var _data =
            inline[0].innerText || //all
            inline[0].textContent || //firefox
            inline[0].text; //ie8
          if (dataType == "json") {

            var _data = utils.removeComments(_data);
            callback_success(JSON.parse(_data));
          } else {
            callback_success(_data);
          }
          return;
        }
      }
    }

    utils.load(url, dataType, callback_success, callback_error);

  },
}

module.exports = utils;
