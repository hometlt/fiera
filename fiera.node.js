global.DEVELOPMENT = false;
global.fabric = require("./../plugins/fabric.1.6.4").fabric;
global.caman = require("Caman");
global._ = require("underscore");

require("./fiera.js");
global.fabric.debug = false;
module.exports = global.fabric;
