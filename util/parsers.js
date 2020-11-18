
/**
 * add-double-quotes-around-keys-in-javascript
 * https://stackoverflow.com/questions/4843746/regular-expression-to-add-double-quotes-around-keys-in-javascript
 */
export function jsonTextAddDoubleQuotes(jsonString) {
    var objKeysRegex = /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g;// look for object names
    return jsonString.replace(objKeysRegex, "$1\"$2\":");// all object names should be double quoted
}

export function removeComments(str) {
    str = str.replace(/("(?:[^\r\n\\"]|\\.)*"|'(?:[^\\']|\\.)*'|\/[^*\/]([^\\\/]|\\.)*\/[gm]*)|\/\/[^\r\n]*|\/\*[\s\S]*?\*\//gm, "$1");
    return str;
}

export const parsers = {
    json: function (data) {
        let _parsed = data.trim();
        //if (data[0] != "{" && data[0] != "[") {
        //  return false;
        //}
        _parsed = removeComments(_parsed);
        //data  = data.replace(/\n/g,"")
        _parsed = jsonTextAddDoubleQuotes(_parsed);
        return JSON.parse(_parsed);//= JSON.parse(data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,""));
    },
    csv: function (data) {
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
                    if (str[j] === '\'' || str[j] === '\"') {
                        _quote = str[j];
                    }
                    if (str[j] === ",") {
                        var _val = str.substring(last, j);
                        if (_val[0] === '\"' && _val[_val.length - 1] === '\"') {
                            _val = _val.substring(1, _val.length - 1);
                        }
                        row_data.push(_val);
                        last = j + 1;
                    }
                } else {
                    if (str[j] === _quote) {
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
    text: function (data) {
        return data;
    }
}