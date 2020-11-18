import {trimCanvas} from "../../util/trimCanvas.js";
import {defaults} from "../util/util.js";


fabric.RemoveWhiteDP = fabric.Image.filters.RemoveWhiteDP =  fabric.util.createClass(fabric.Image.filters.BaseFilter,{
    type: 'RemoveWhiteDP',
    initialize: function(options) {
        if(options)delete options.type;
        this.options = defaults(options || {},{
                fromCorners : true,
                blurRadius: 2,
                colorThreshold: 32
            });
    },
    applyTo: function(canvasEl) {
      trimCanvas(canvasEl);
    },
    toObject: function() {
        return Object.assign(this.callSuper('toObject'), this.options);
    }
});

fabric.Image.filters.RemoveWhiteDP.fromObject = function(object) {
    return new fabric.Image.filters.RemoveWhiteDP(object);
};
