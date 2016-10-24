'use strict';


/**
   * Draw CSS3 border image on canvas.
   * @param canvas    {HTMLCanvasElement}
   * @param img       {HTMLImageElement} border-image-source image
   * @param options   {Object}
   *      slice {Array} border-image-slice values
   *      width {Array} border-image-width values
   *      outset {Array} border-image-outset values
   *      repeat {Array} border-image-repeat values
   * @param size      {Object}
   */
   fabric.util.drawBorderImage  = function(canvas, img, options){


    var options = fabric.util.object.extend({
      "slice":        [25,25,25,25],
      "width":        [25,25,25,25],
      "fill":         false,
      "repeat":       ["round","round"],
      "outset_values"	: [0, 0, 0, 0],
      "slice_units"   : [0, 0, 0, 0],
      "width_units"	: [0, 0, 0, 0],
      "outset_units"	: [0, 0, 0, 0],
      "size"			: [canvas.width, canvas.height]
    },options)


    var w = img.width;
    var h = img.height;

    var ctx = canvas.getContext("2d");
    var slice = options.slice;
    var width = options.width;

    var w2 = options.size[0];
    var h2 = options.size[1];


    if(options.slice_units[0] == 1)slice[0] *=  h / 100;
    if(options.slice_units[1] == 1)slice[1] *=  w / 100;
    if(options.slice_units[2] == 1)slice[2] *=  h / 100;
    if(options.slice_units[3] == 1)slice[3] *=  w / 100;

    if(options.width_units[0] == 1)width[0] *= h2 / 100;
    if(options.width_units[1] == 1)width[1] *= w2 / 100;
    if(options.width_units[2] == 1)width[2] *= h2 / 100;
    if(options.width_units[3] == 1)width[3] *= w2 / 100;


    function drawSide(side,sliceOffset,sliceWidth, drawOffset,drawWidth){
      var d;
      if(side == 0) {
        d = [slice[3] + sliceOffset, 0, sliceWidth,  slice[0],
          width[3] + drawOffset, 0, drawWidth,  width[0]]
      }
      if(side == 2){
        d = [slice[3] + sliceOffset, h - slice[2] ,sliceWidth,  slice[2],
          width[3] + drawOffset, h2 - width[2],drawWidth, width[2]]
      }
      if(side == 1) {
        d = [ w - slice[1], slice[0] + sliceOffset,  slice[1], sliceWidth,
          w2 - width[1], width[0] + drawOffset,width[1], drawWidth];
      }
      if(side == 3) {
        d = [ 0, slice[0] + sliceOffset,  slice[3], sliceWidth,
          0, width[0] + drawOffset, width[3],drawWidth];
      }
      ctx.drawImage(img,d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7])
    }


    function _draw_border_side(side){
      var _top_width, _top_slice, repeat;
      if(side == 0 || side == 2){
        _top_width = w2 - width[1]- width[3];
        _top_slice  =  w - slice[1] - slice[3];
        repeat = options.repeat[0];
      }else{
        _top_width = h2 - width[0]- width[2];
        _top_slice  =  h - slice[0] - slice[2];
        repeat = options.repeat[1];
      }


      if(repeat == "stretch"){
        return drawSide(side, 0,  _top_slice ,  0,     _top_width);
      }

      var _aspect =   slice[side] / width[side];
      var _one_width =  _top_slice *  width[side] / slice[side] ;
      var count = 1;
      var _left = 0;

      if(repeat == "repeat"){

        var _rest = _one_width - _top_width % _one_width / 2;
        var _rest_aspect  = _aspect * _rest;
        count =  Math.floor(_top_width / _one_width);


        if(_rest > 0){
          drawSide(side, _rest_aspect ,  _top_slice - _rest_aspect,  0,     _one_width - _rest)
        }

        _left =  _one_width - _rest;

        for(var i = 0 ; i< count;i ++){
          drawSide( side,0,   _top_slice ,  _left,     _one_width);
          _left +=_one_width;
        }

        if(_rest > 0){
          drawSide(side,  0 ,    _top_slice - _rest_aspect,  _left,    _one_width - _rest );
        }
      }
      if(repeat == "round"){

        _left = 0;
        count =  Math.max(1,Math.round(_top_width / _one_width));
        _one_width = _top_width / count;

        while(_left < _top_width){
          drawSide(side,0,     _top_slice ,  _left,     _one_width );
          _left +=_one_width;
        }
      }
    }

    _draw_border_side(0);
    _draw_border_side(2);
    _draw_border_side(1);
    _draw_border_side(3);

  //top left
    ctx.drawImage(img, 0, 0, slice[3], slice[0], 0, 0, width[3], width[0]);
  //top right
    ctx.drawImage(img, w - slice[1], 0, slice[1], slice[0],
      w2 - width[1], 0, width[1], width[0]);
  //bottom left
    ctx.drawImage(img, 0, h - slice[2], slice[3], slice[2],
      0, h2 - width[2], width[3], width[2]);

  //bottom right
    ctx.drawImage(img, w - slice[1], h - slice[2], slice[1], slice[2],
      w2 - width[1], h2 - width[2], width[1], width[2]);

  }

  /*
   var Frame = function(project,data){

   if(data.border_image){
   data.border_image = mixin( {
   "slice":          [25,25,25,25],
   "width":          [25,25,25,25],
   "fill":           false,
   "repeat":         ["round","round"],
   "outset"	:     [0, 0, 0, 0],
   "slice_units"   : [0, 0, 0, 0],
   "width_units"	: [0, 0, 0, 0],
   "outset_units"	: [0, 0, 0, 0]
   }, data.border_image)
   }


   this.superclass.constructor.call(this,project,data);
   this._add_root("mask");
   this._add_root("image");
   this.example = this._get_example();

   };*/
  fabric.util.getOffsetsClipPath = function(o) {

    return ['M', o[3], o[0], 'L', 100 - o[1], o[0], 'L', 100 - o[1], 100 - o[2], 'L', o[3], 100 - o[2], 'z'].join(" ");
  };

  fabric.util.getRadiusClipPath = function(radius,radius_units, width,height) {

  var br  = radius;
  var bru = radius_units || [1,1,1,1,1,1,1,1];



  var s = {
    "top-left-h":     br[0] * (bru[0] ? height / 100 : 1),
    "top-left-w":     br[1] * (bru[1] ? width / 100 : 1),
    "top-right-h":    br[2] * (bru[2] ? height / 100 : 1),
    "top-right-w":    br[3] * (bru[3] ? width / 100 : 1),
    "bottom-right-w": br[4] * (bru[4] ? width / 100 : 1),
    "bottom-right-h": br[5] * (bru[5] ? height / 100 : 1),
    "bottom-left-w":  br[6] * (bru[6] ? width / 100 : 1),
    "bottom-left-h":  br[7] * (bru[7] ? height / 100 : 1)
  };

  return [
    "M", 0, s["top-left-h"],
    "C", 0, s["top-left-h"], 0, 0, s["top-left-w"], 0,
    "H", width - s["top-right-w"],
    "C", width - s["top-right-w"], 0, width, 0, width, s["top-right-h"],
    "V", height - s["bottom-right-h"],
    "C", width, height - s["bottom-right-h"], width, height, width - s["bottom-right-w"], height,
    "H", s["bottom-left-w"],
    "C", s["bottom-left-w"], height, 0, height, 0, height - s["bottom-left-h"],
    "Z"
  ].join(" ");
};
