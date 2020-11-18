import fs from 'fs'
import path from 'path'

import {canvasToBuffer} from "../../util/canvasToBlob.js";
import {bufferToBase64} from "../../plugins/blob-buffers-utils.js";
import {btoa} from "../../plugins/blob-buffers-utils.js";

// function canvasToStream(fabricSlide,format){
//   switch (format) {
//     case "jpg":
//       return fabricSlide.createJPEGStream();
//     case "png":
//       return fabricSlide.createPNGStream();
//   }
// }

export function canvasToFile(canvas, format, filename) {
  return new Promise((resolve, reject) => {
    let impl = fabric.util.getNodeCanvas(canvas)
    let pstream;
    switch (format) {
      case "jpg":
        pstream = impl.createJPEGStream();
        break;
      case "png":
        pstream = impl.createPNGStream();
        break;
    }
    let pngOutputStream = fs.createWriteStream(filename);
    pstream.on('data', (data) => {
      pngOutputStream.write(data);
    });
    pstream.on('end', () => {
      pngOutputStream.end();
      resolve(path.resolve(filename))
    });
  })
}



// fabric.util.object.extend(fabric.util, {
//   canvasToBuffer
// })

// fabric.request = function(type,req, res) {
//   try {
//     let data = fabric.node.getData(req.body);
//     fabric.node.createEditor(data).then(editor => {
//       if (req.body.file) {
//         fabric.save[type](editor, req.body.file).then(pdf => {
//           res.status(200).json({url: pdf});
//         });
//       }else{
//         fabric.response[type](res, editor)
//       }
//     })
//   }
//   catch (e) {
//     console.trace(e.message);
//     res.status(400).json({message: e.message, stack: e.stack});
//   }
// };


// fabric.save = {
  // svg: function saveSVG(editor,filesPattern){
  //
  //
  //   fabric.util.svgMediaRoot = "./public/";
  //   let filesUrls = [];
  //
  //   fabric.util.svgMediaRoot = "";
  //
  // },
  // png: function savePNG(editor,filesPattern){
  //   let promises = [];
  //   editor.slides.forEach((slide,index) => {
  //     slide.setElement(true);
  //     slide.renderAll();
  //
  //
  //     if(filesPattern){
  //       let filename = this._getFileName(filesPattern,index);
  //       if(filename.toLowerCase().startsWith("s3:")) {
  //
  //         let canvas = fabric.util.getNodeCanvas(slide.lowerCanvasEl);
  //         // Default: buf contains a PNG-encoded image
  //         const buffer = canvas.toBuffer();
  //         // PNG-encoded, zlib compression level 3 for faster compression but bigger files, no filtering
  //         const buf2 = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE });
  //         // JPEG-encoded, 50% quality
  //         const buf3 = canvas.toBuffer('image/jpeg', { quality: 0.5 });
  //
  //         promises.push(fabric.node.uploadToS3(filename.substr(3), buffer));
  //       }
  //       else{
  //         promises.push(new Promise(resolve => {
  //           slide.saveAsPNG(filename);
  //           resolve(path.resolve(filename));
  //         }));
  //       }
  //
  //     }else{
  //       //if url is not definedm then return base64 encoded image
  //       promises.push(new Promise(resolve => {
  //         resolve(slide.canvas.toDataURL());
  //       }));
  //     }
  //   });
  //
  //   return Promise.all(promises);
  // // },
  // pdf: function savePDF(editor,file){
  //     let document = editor.makeDocument();
  //     let filename = this._getFileName(file);
  //
  //     if(filename.toLowerCase().startsWith("s3:")) {
  //       return document.toBuffer()
  //         .then(buffer => {
  //           return fabric.node.uploadToS3(file.substr(3), buffer);
  //         })
  //     }else{
  //       return document.toFile(filename);
  //     }
  // }
// };

// fabric.response = {
//   pdf:  function sendAsPDF(response,editor){
//     let document = editor.makeDocument();
//     response.status(200);
//     response.header('Content-type', 'application/pdf');
//     response.header('Content-disposition', 'attachment; filename=Untitled.pdf');
//     document.pipe(response);
//   },
//   svg:  function sendAsSVG(response,editor,pageIndex = 0){
//     fabric.util.svgMediaRoot = "./public/";
//     let svgData = editor.toSVG();
//     fabric.util.svgMediaRoot = "";
//
//     response.status(200).type("svg").end(svgData);
//   },
//   png:  function sendAsPNG(response,editor,pageIndex){
//     if(pageIndex === undefined)pageIndex = 0;
//     editor.slides[pageIndex].setElement(true);
//     editor.slides[pageIndex].renderAll();
//     let stream = editor.slides[pageIndex].createPNGStream();
//     response.type("png");
//     stream.pipe(response);
//   },
//   jpg:  function sendAsJPG(response,editor,pageIndex){
//     if(pageIndex === undefined)pageIndex = 0;
//     let stream = editor.slides[pageIndex].createJPEGStream();
//     response.type("jpg");
//     stream.pipe(response);
//   },
// };




fabric.util.object.extend(fabric.Editor.prototype, {
  _getFileName (filenamePattern,extension, index = ""){
    return ((filenamePattern.includes("*") ? filenamePattern.replace("*",index) : filenamePattern + index));
  },
  async export( {format = "png", output = "buffer", slide, options}) {

    if(!options)options = {}


    // let prefix = fabric.util.exportDirectoryURL || fabric.util.exportDirectory; filename
    let filename;
    if (output.startsWith("file:") || output.startsWith("s3:")) {
      let parts = output.split(":");
      output = parts[0]
      filename = parts[1]

      if(!filename.endsWith("."+ format)){
        filename +="."+format
      }

    }


    let fabricSlide;
    if (slide !== undefined) {
      fabricSlide = this.slides[slide - 1];
    }


    // let savedBackgroundColor;
    // function restoreBackgroundColor(fabricSlide){
    //   if(format === "jpg") {
    //     fabricSlide.background = fabricSlide.backgroundColor = savedBackgroundColor;
    //   }
    // }
    // function changeBackgroundColor(fabricSlide){
    //   if(format === "jpg") {
    //     savedBackgroundColor = fabricSlide.backgroundColor || fabricSlide.background
    //
    //     if (!savedBackgroundColor || savedBackgroundColor === "transparent") {
    //       fabricSlide.background = fabricSlide.backgroundColor = "white";
    //     } else {
    //       let rgba = /rgba\((\d+),(\d+),(\d+),(\d+)\).*/.exec(savedBackgroundColor);
    //       if (rgba) {
    //         fabricSlide.background = fabricSlide.backgroundColor = `rgba(${rgba[1]},${rgba[2]},${rgba[3]},255)`
    //       }
    //     }
    //   }
    // }

    function fixBackgroundColor(thumbnail){

      if(format === "jpg"){
        let ctx = thumbnail.getContext("2d");
        ctx.globalCompositeOperation = "destination-over"
        ctx.fillStyle = "#fff"
        ctx.fillRect(0,0,thumbnail.width,thumbnail.height)
      }
    }
    switch (format) {
      case "jpg":
      case "png": {
        // let fabricSlide = this.slides[slide - 1];


        switch (output) {
          case "stream": {
            // pipe to response
            // response.type(format);
            // stream = editor.export({output:"stream", format: "png"})
            // stream.pipe(response);

            fabricSlide.setElement(true);
            fabricSlide.renderAll();
            fixBackgroundColor(fabricSlide.lowerCanvasEl)
            return canvasToStream(fabricSlide, format)
          }
          case "s3":
          case "file": {

            async function writePNG(fabricSlide, output, filename) {

              let zoom = options.zoom;if(!zoom && options.height && options.width){zoom = Math.min(options.width / fabricSlide.getOriginalWidth(), options.height / fabricSlide.getOriginalHeight())}



              let thumbnail = fabric.util.getNodeCanvas(fabricSlide.getThumbnail({zoom: zoom}));
              fixBackgroundColor(thumbnail)

              if (output === "s3") {
                let buffer = await canvasToBuffer(thumbnail, {format: format, dpi: options.dpi, meta: options.meta});
                return fabric.node.uploadToS3(filename, buffer)
              }
              if (output === "file") {
                return canvasToFile(fabricSlide, format, filename)


                return fabric.util.getNodeCanvas(thumbnail).createPNGStream();
                return fabric.util.getNodeCanvas(this.lowerCanvasEl).createJPEGStream();

              }
            }

            let result;
            if (!fabricSlide && filename && filename.includes("*")) {
              let promises = [];
              this.slides.forEach((slide, index) => {
                slide.renderAll();
                promises.push(writePNG(slide, output, this._getFileName(filename, index)))
              });
              result = await Promise.all(promises);
            } else {
              fabricSlide = fabricSlide || this.slides[0]
              fabricSlide.renderAll();
              result = await writePNG(fabricSlide, output, filename)
            }
            return result;
          }
          case "buffer": {
            fabricSlide = fabricSlide || this.slides[0]

            let zoom = options.zoom;if(!zoom && options.height && options.width){zoom = Math.min(options.width / fabricSlide.getOriginalWidth(), options.height / fabricSlide.getOriginalHeight())}
            let thumbnail = fabric.util.getNodeCanvas(fabricSlide.getThumbnail({zoom: zoom}));

            fixBackgroundColor(thumbnail)
            return canvasToBuffer(thumbnail, {format: format, dpi: options.dpi, meta: options.meta})
          }
          case "base64": {
            fabricSlide = fabricSlide || this.slides[0]
            let zoom = options.zoom;if(!zoom && options.height && options.width){zoom = Math.min(options.width / fabricSlide.getOriginalWidth(), options.height / fabricSlide.getOriginalHeight())}
            let thumbnail = fabric.util.getNodeCanvas(fabricSlide.getThumbnail({zoom: zoom}));
            let buffer = await canvasToBuffer(thumbnail, {format: format, dpi: options.dpi, meta: options.meta})
            return bufferToBase64(buffer);
          }
          case "canvas":
          default: {
            fabricSlide = fabricSlide || this.slides[0]
            let zoom = options.zoom;if(!zoom && options.height && options.width){zoom = Math.min(options.width / fabricSlide.getOriginalWidth(), options.height / fabricSlide.getOriginalHeight())}
            return fabric.util.getNodeCanvas(fabricSlide.getThumbnail({zoom: zoom}));
          }
        }
      }
      case "pdf": {
        let document = await this.makeDocument();
        switch (output) {
          case "document":
          case "stream":
          default:
            // response.status(200);
            // response.header('Content-type', 'application/pdf');
            // response.header('Content-disposition', 'attachment; filename=Untitled.pdf');
            // document.pipe(response);
            return document;
          case "buffer":
            return document.toBuffer();
          case "file":
            return document.toFile(filename);

          case "base64": {
            let buffer = await document.toBuffer();
            return bufferToBase64(buffer);
          }
        }
      }

      case "svg": {
        fabric.util.svgMediaRoot = "./public/";

        switch (output) {
          case "dataurl":
          case "buffer":
          case "file":

            async function writeSVG(svgData,output,filename){


              if(output === "dataurl") {
                return "data:image/svg+xml;base64," + btoa(svgData)
              }


              let buffer = Buffer.from(svgData);
              if(output === "buffer") {
                return buffer
              }
              if(output === "file") {
                let svgStream = fs.createWriteStream(path.resolve(filename))
                svgStream.write(buffer)
                svgStream.end()
                return path.resolve(filename)
              }
            }

            let result;
            if(!fabricSlide && filename && filename.includes("*")){
              let promises = [];
              this.slides.forEach((slide,index)  => {
                promises.push(writeSVG(slide.toSVG(), output, this._getFileName(filename,index)))
              });
              result = await Promise.all(promises);
            }
            else {
              let svg = fabricSlide ? fabricSlide.toSVG() : this.toSVG()
              result = await writeSVG(svg, output, filename)
            }
            return result;
          case "svg":
          default:
            return fabricSlide ? fabricSlide.toSVG() : this.toSVG()
        }

        // fabric.util.svgMediaRoot = "";
      }

      case "json": {
        return this.getState();
      }
    }
  }
})





/*canvas to MP4
https://www.npmjs.com/package/ffmpeg
https://scwu.io/rendering-canvas-to-mp4-using-nodejs/
var recorder = child_process.spawn("ffmpeg.exe", [
  "-y", "-f", "image2pipe",
  "-vcodec", "png", "-r", "60",
  "-i", "-", "-vcodec", "h264",
  "-r", "60", "output.mp4"
]);
Next, for each frame grab the canvas data and convert to a binary string.

  var url = canvas.toDataURL();
var data = atob( url.substring(url.indexOf("base64") + 7) );
Finally, we can write the data to stdin.

recorder.stdin.write(data, "binary");
When finished, we can close the stream.

recorder.stdin.end();


*/

