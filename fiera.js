
fabric.util.data = require('./util/data.js');
fabric.util.path = require('./util/path.js');
fabric.util.compile = require('./util/compile.js');
fabric.util.loader = require('./util/loader.js');
fabric.util.object.extend(fabric.util.object,require('./util/object.js'));
fabric.util.object.extend(fabric.util,require('./util/util.js'));

require('./modules');

if(!fabric.isLikelyNode){
  /**
   * inline script images
   * @type {{error: string}}
   */
  fabric.media = {
    /**
     * replace images loaded with errors
     */
    error: 'data:image/svg+xml;base64,' + require('base64!./media/error-button.svg')
  };
}

module.exports  = fabric;
