if (typeof _ === 'undefined' && typeof exports !== 'undefined') {
  _ = require("underscore");
  module.exports = _;
}

module.exports = {

  loadScript: function (requirement, helper, error) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onerror = error;
    script.onreadystatechange = function () {
      if (this.readyState == 'complete') {
        helper(script, __src);
      }
    };
    script.addEventListener("load", helper, true);
    script.src = requirement;
    head.appendChild(script);
  },
  scriptURL: function () {

    if (document.currentScript) {
      return document.currentScript.src;
    }
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i--;) {
      if (scripts[i].src) {
        return scripts[i].src;
      }
    }
    return false;
  }
};
