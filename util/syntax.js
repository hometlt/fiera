
var deepDiffMapper = {
  VALUE_CREATED: 'created',
  VALUE_UPDATED: 'updated',
  VALUE_DELETED: 'deleted',
  VALUE_UNCHANGED: 'unchanged',
  map: function(obj1, obj2) {
    if (this.isFunction(obj1) || this.isFunction(obj2)) {
      throw 'Invalid argument. Function given, object expected.';
    }
    if (this.isValue(obj1) || this.isValue(obj2)) {
      return {
        '_map_type': this.compareValues(obj1, obj2),
        '_map_data': (obj2 === undefined) ? obj1 : obj2
      };
    }


    if(_.isArray(obj2)){
      var _array = true;
      var diff = [];
    }else{
      var diff = {};
    }


    for (var key in obj1) {
      if (this.isFunction(obj1[key])) {
        continue;
      }

      var value2 = undefined;
      if ('undefined' != typeof(obj2[key])) {
        value2 = obj2[key];
      }

      diff[key] = this.map(obj1[key], value2);
    }
    for (var key in obj2) {
      if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
        continue;
      }

      var _val = this.map(undefined, obj2[key]);
      if(_array){
        diff.push(_val);
      }else{
        diff[key] = _val
      }
    }

    return {
      '_map_type': '',
      '_map_data': diff
    };

  },
  compareValues: function(value1, value2) {
    if (value1 === value2) {
      return this.VALUE_UNCHANGED;
    }
    if ('undefined' == typeof(value1)) {
      return this.VALUE_CREATED;
    }
    if ('undefined' == typeof(value2)) {
      return this.VALUE_DELETED;
    }

    return this.VALUE_UPDATED;
  },
  isFunction: function(obj) {
    return {}.toString.apply(obj) === '[object Function]';
  },
  isArray: function(obj) {
    return {}.toString.apply(obj) === '[object Array]';
  },
  isObject: function(obj) {
    return {}.toString.apply(obj) === '[object Object]';
  },
  isValue: function(obj) {
    return !this.isObject(obj) && !this.isArray(obj);
  }
};

module.exports = {
  differenceMap: deepDiffMapper.map.bind(deepDiffMapper),
  syntaxHighlight: function (json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
    return json = json.replace(/[^,\n][^\n]*/g, function (match) {
      return '<span>' + match + '</span>';
    });
  },
  differenceHighlight: function  (json,output){

    if(output){
      output.empty();
    }else{
      output = $("<pre>");
    }


    function printObject(json,level,output,comma,objectIndex){
      var _el = $("<p>");

      _el.append($("<span>").addClass("object-key").append(
        $("<span>").text(new Array(level).join(' ') )
      ));
      if(objectIndex){
        _el.append(
          $("<span>").text('"').addClass("invisible"),
          $("<span>").addClass("key").text(objectIndex),
          $("<span>").text('"').addClass("invisible"),
          $("<span>").text(': ')
        );
      }

      if(json._map_type !== undefined){
        _el.addClass(json._map_type);

        if(_.isArray(json._map_data)){
          _el.append($("<span>").text("["));
          var _last_key = json._map_data.length - 1;
          for(var i in json._map_data){
            printObject(json._map_data[i],level + 1,_el,i != _last_key);
          }
          _el.append($("<p>").text(new Array(level ).join(' ') + "]" + (comma ? "," : "")));
        }
        else if(_.isObject(json._map_data)){
          _el.append($("<span>").text("{"));
          var _last_key = Object.keys(json._map_data).pop();
          for(var i in json._map_data){
            printObject(json._map_data[i],level + 1,_el,i != _last_key,i);
          }
          _el.append($("<p>").text(new Array(level ).join(' ') + "}" + (comma ? "," : "")));
        }
        else{

          if(_.isNull(json._map_data)){
            _el.append(
              $("<span>").text(JSON.stringify(json._map_data))
            );
          }
          else if(json._map_data.constructor === String ){
            _el.append(
              $("<span>").text('"'),
              $("<span>").addClass('string').text(json._map_data),
              $("<span>").text('"')
            );
          }
          else if(json._map_data.constructor === Number || json._map_data.constructor === Boolean){
            _el.append(
              $("<span>").addClass('number').text(json._map_data)
            );
          }
          else{
            _el.append(
              $("<span>").text(JSON.stringify(json._map_data))
            );
          }
          if(comma){
            _el.append(
              $("<span>").text(",")
            );
          }


        }
      }else{
        _el.append(
          $("<span>").text(JSON.stringify(json))
        )

        if(comma){
          _el.append(
            $("<span>").text(",")
          );
        }

      }

      output.append(_el);

    }
    printObject(json,1,output);
    return output;
  }
};

