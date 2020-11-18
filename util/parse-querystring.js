
/**
 * возвращает объект с ключами строки url
 *
 * @example
 *
 *  queryString(http://192.168.56.1/?file=demo&subset=4&tag&tag2) =
 *    {file: "demo", subset: "4", tag: "", tag2: "", 0: "file", 1: "subset", 2: "tag", 3: "tag2", length: 4}
 *
 * @returns {{}}
 */
export function queryString (query) {
    if(query) {
        query = query.substr(query.indexOf("?") + 1) ;
    }else{
        query = window.location.search.substring(1);
    }
    let obj = [];
    let _length = 0;
    if (!query)return obj;
    let lets = query.split("&");
    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split("=");
        let _vname = pair[0], val = pair[1];
        if (typeof obj[_vname] === "undefined") {
            obj[_vname] = val || "";
            obj.push(_vname);
            // Object.defineProperty(obj, _length, {value: _vname, enumerable: false});
            // _length++;
            // If second entry with this name
        } else if (typeof obj[_vname] === "string") {
            let arr = [obj[_vname], val];
            obj[_vname] = arr;
            obj.push(_vname);
            // Object.defineProperty(obj, _length, {value: _vname, enumerable: false});
            // _length++;
            // If third or later entry with this name
        } else {
            obj[_vname].push(val);
            obj.push(_vname);
            // Object.defineProperty(obj, _length, {value: _vname, enumerable: false});
            // _length++;
        }
    }
    // Object.defineProperty(obj, "length", {value: _length, enumerable: false});
    return obj;
}