// import "../../util/trimCanvas.js";
// import saveAs from "./../../plugins/saveAs.js";
// import {canvasToBlob} from "../../util/canvasToBlob.js";
//
// fabric.libRoot = "lib/"
//
// fabric.util.object.extend(fabric.util,{
//   canvasToBlob: canvasToBlob,
//   exportCanvas(canvas,format,options = {}){
//     switch(format){
//       case "data-url":
//         return canvas.toDataURL(options);
//       case "blob":
//         return new Promise(resolve => {
//           canvas.toBlob(function (blob) {
//             resolve(blob);
//           })
//         });
//       case "blob-url":
//         return new Promise(resolve => {
//           canvas.toBlob(function(blob){
//             let url = window.URL.createObjectURL(blob);
//             resolve(url);
//           });
//         });
//       case "svg":
//         return canvas.toSVG();
//       case "svg-url":
//
//       function b64EncodeUnicode(str) {
//         return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
//           return String.fromCharCode(parseInt(p1, 16))
//         }))
//       }
//         return "data:image/svg+xml;base64," + b64EncodeUnicode(outputcanvas.toSVG());
//     }
//     return canvas;
//   }
// });
//
// Object.assign(fabric.Canvas.prototype, {
//   exportPNG(){
//     let imageBlob = this.getThumbnail({
//       format: "blob",
//       zoom: this.dotsPerUnit,
//       clipped_area_only: false,
//       draw_background: true
//     });
//     this.exportBlob(imageBlob);
//   },
//   exportSVG() {
//     let svgData = "," + window.btoa(this.toSVG());
//     // this.exportBlob(fabric.util.dataURItoBlob(svgData, 'image/svg+xml'));
//   },
//   exportJSON(){
//     let jsonData = "," + window.btoa(JSON.stringify(this.toObject()));
//     // this.exportBlob(fabric.util.dataURItoBlob(jsonData, 'application/json'));
//   }
// });
//
// fabric.Editor.prototype.exportURL = "";
//
// fabric.util.object.extend(fabric.Editor.prototype,{
//   exportAction: "file",
//   exportContainer: "export-container",
//   getExportContainer(method){
//     return document.getElementById(this.previewContainer);
//   },
//   async exportBlob(blob,target,method){
//     let url = URL.createObjectURL(blob);
//     switch(target){
//       case "preview":
//         let elements;
//         if(blob.type === 'image/svg+xml'){
//           elements = await this._renderSvg(blob);
//         }
//         if(blob.type === 'image/png'){
//           elements = await this._renderImage(url);
//         }
//         if(blob.type === 'application/pdf'){
//           elements = await this._renderPDF(url);
//         }
//
//         let container = this.getExportContainer(method);
//         while(container.firstChild){
//           container.removeChild(container.firstChild);
//         }
//         for(let element of elements){
//           container.appendChild(element);
//         }
//         break;
//       case "file":
//         saveAs(blob, this.title);
//         break;
//       case "window":
//         window.open(url, '_blank');
//         break;
//     }
//     this.fire("export", {method, url , blob});
//     this._exportReady[method] = {url,blob};
//   },
//   pdfURL: "",
//   svg_request: "/svg", /*location.origin + ":1337" */
//   createFileOnServer: false,
//   getExportData(){
//     return this.getState();
//   },
//   beforeExport(method){
//     return true;
//   },
//   _beforeExport(method){
//     this.fire("before:export",{method: method});
//     if(this.beforeExport(method) === false){
//       return false;
//     }
//     let data = this._exportReady[method];
//     if(data){
//       this.fire("export", {url: data.url, blob: data.blob} );
//       // this.onExport(method);
//       return false;
//     }
//     return true;
//   },
//   async _renderSvg (blob) {
//     let elements = [];
//     let text = await blob.text();
//     let svg = $(text);
//     let pageSet = svg[0].getElementsByTagName("pageset")[0];
//     if(pageSet){
//       for(let i =0 ; i < pageSet.children.length;i++){
//         let page = $(text)[0];
//         let pageSet2 = page.getElementsByTagName("pageset")[0];
//         pageSet2.replaceWith(...pageSet.children[i].children);
//
//         elements.push(page);
//       }
//     }else{
//       elements.push( $(text)[0]);
//     }
//     return elements;
//   },
//   async _renderImage (file) {
//     let elements = [];
//     return new  Promise ((resolve ) => {
//       let image = new Image();
//       image.src = file;
//       elements.push(image);
//       image.onload = function () {
//         resolve(elements);
//       };
//     });
//   },
//   async getExportEditor(){
//
//     let data = Object.assign({
//       virtual: true,
//       slides: [{}],
//       prototypes: this.prototypes ,
//       frames: this.frames
//     },this.getState());
//
//     return new fabric.Editor(data).promise
//   },
//   async exportSvgClient(){
//     let method = 'client-svg';
//     if(!this._beforeExport(method))return;
//     let editor = await this.getExportEditor();
//
//     fabric.util.svgMediaRoot = "./public/media/";
//     let svg = editor.toSVG();
//     fabric.util.svgMediaRoot = "";
//     const blob = new Blob([svg], {type: 'image/svg+xml'});
//     this.exportBlob(blob,this.exportAction, method);
//   },
//   async exportPngClient(){
//     let method = 'client-png';
//     if(!this._beforeExport(method))return;
//     // let editor = await this.getExportEditor();
//
//     let thumbnail = this.canvas.getThumbnail({});
//     thumbnail.toBlob(blob => {
//       this.exportBlob(blob ,this.exportAction, method);
//     })
//   },
//
//   async export({
//                  dpi , output, quality, background, format = "png",  meta = null ,target = null,
//                  width, height, zoom, area, contentMode, cutEdges
//   }){
//
//     let thumbnail = this.canvas.getThumbnail({width, height, zoom, area, contentMode, cutEdges});
//
//     //extra background, independable of blend modes
//     if(background){
//       let canvas2 = fabric.util.createCanvasElement(thumbnail);
//       let ctx = canvas2.getContext("2d");
//       ctx.fillStyle = background;
//       ctx.fillRect(0,0,canvas2.width,canvas2.height);
//       ctx.drawImage(thumbnail,0,0);
//       thumbnail = canvas2
//     }
//
//     let blob = await canvasToBlob(thumbnail,{format, dpi , quality,meta})
//
//     if(target){
//       await this.exportBlob(blob ,target);
//     }
//     return blob;
//   },
//   exportSvgServer () {
//     let method = 'server-svg';
//     if(!this._beforeExport(method))return;
//
//     $.ajax({
//       url: '/svg',
//       type: 'post',
//       contentType: 'application/json',
//       cache: false,
//       dataType: "xml",
//       data: JSON.stringify(this.getExportData()),
//       success:  (svgXmlDoc) =>{
//         const blob = new Blob([svgXmlDoc.documentElement.outerHTML], {type: 'image/svg+xml'});
//         this.exportBlob(blob, this.exportAction,method)
//       },
//       error (error) {
//         console.log(error);
//       }
//     });
//   },
//   exportPngServer () {
//     let method = 'server-png';
//     if(!this._beforeExport(method))return;
//
//     let editor = this;
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', '/png', true);
//     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhr.responseType = 'blob';
//     xhr.onload = function() {
//       if (this.status === 200) {
//         let blob = new Blob([this.response], {type: 'image/png'});
//         editor.exportBlob(blob,this.exportAction,method )
//       }
//     };
//     xhr.send(JSON.stringify(this.getExportData()));
//   },
//   async exportPdfClient() {
//     let method = 'client-pdf';
//     if(!this._beforeExport(method))return;
//
//     let doc = await this.makeDocument();
//     let blob = await doc.toBlob()
//     await this.exportBlob(blob,this.exportAction, method)
//   },
//   exportPdfServer() {
//     let method = 'server-pdf';
//     if(!this._beforeExport(method))return;
//
//     let editor = this;
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', '/pdf', true);
//     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhr.responseType = 'blob';
//     xhr.onload = function() {
//       if (this.status === 200) {
//         let blob = new Blob([this.response], {type: 'application/pdf'});
//         editor.exportBlob(blob,this.exportAction,method )
//       }
//     };
//     xhr.send(JSON.stringify(this.getExportData()));
//   },
//   downloadPDF(){
//     saveAs(this.pdfURL, this.title);
//   },
//   _exportReady: {},
//   "+eventListeners": {
//     "modified" () {
//       this._exportReady = {};
//     }
//   }
// });

//
// import {canvasToBuffer} from "../../fiera/util/canvasToBlob.js";
// import fs from "fs"
// import svgToPng from 'convert-svg-to-png'

// import gm from "gm"
// // import sharp from "sharp"
// import im from "imagemagick"

//
// gm('./cache/output.svg').write('./cache/gm.png', function(err){
//     if (err) throw err;
//     if (!err) console.log('image converted.')
// })
//
// im.convert(['./cache/output.svg',/* '-resize', '25x120', */ './cache/im.png'], (err, stdout) => {
//     if (err) throw err;
//     console.log('stdout:', stdout);
// });


// const png = await svgToPng.convert(svgText);
// fs.writeFileSync('./cache/svgToPng.png', png);

// sharp('./cache/output.svg')
//     .png()
//     .toFile( './cache/sharp.png')
//     .then(function(info) {
//         console.log(info)
//     })
//     .catch(function(err) {
//         console.log(err)
//     })




// //
// im.convert({
//     srcData: fs.readFileSync('./cache/output.svg', 'binary'),
//     width:   256
// }, function(err, stdout, stderr){
//     if (err) throw err
//     fs.writeFileSync('./cache/target.svg', stdout, 'binary');
//     console.log('resized kittens.jpg to fit within 256x256px')
// });

//
// im.convert("'./cache/output.svg' './cache/target.svg'" ), function(err, stdout, stderr){
//     if (err) throw err
//     fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
//     console.log('resized kittens.jpg to fit within 256x256px')
// });



// let useSVGRendering = true;
//
// if(useSVGRendering){
//
//     fabric.inlineSVG = true;
//     let svgText  = await App.fiera.render({
//         slide: slide,
//         prototypes: Render.getRenderPrototypes()
//     }, "svg", {output: "svg"})
//     fs.writeFileSync('./cache/output.svg', svgText);
//
//
//     uploadResult = new Promise(async (resolve,reject) => {
//
//
//         function convert(svgText) {
//             return new Promise(async (resolve,reject) => {
//                 let canvas = fabric.util.createCanvasElement()
//                 var ctx = canvas.getContext('2d')
//                 var image = fabric.util.createImage()
//                 image.onload = function load() {
//                     canvas.height = image.height;
//                     canvas.width = image.width;
//                     ctx.drawImage(image, 0, 0);
//                     resolve(canvas);
//                 };
//                 image.src = 'data:image/svg+xml;charset-utf-8,' + encodeURIComponent(svgText);
//             })
//         }
//
//         function convertSVGURL(svgURL) {
//             return new Promise(async (resolve,reject) => {
//                 let canvas = fabric.util.createCanvasElement()
//                 var ctx = canvas.getContext('2d')
//                 var image = fabric.util.createImage()
//                 image.onload = function load() {
//                     canvas.height = image.height;
//                     canvas.width = image.width;
//                     ctx.drawImage(image, 0, 0);
//                     resolve(canvas);
//                 };
//                 image.src = svgURL
//             })
//         }
//
//         let output = await convertSVGURL('./cache/output.svg')
//
//         let thumbnail = fabric.util.getNodeCanvas(output);
//         let buffer2 = await canvasToBuffer(thumbnail, {format: format, dpi: orderData.dpi, meta: {
//                 Title: orderData.name,
//                 Description: `SKU: ${orderData.sku}`,
//                 Author: "Nymbl",
//                 Copyright: "Nymbl ©2020",
//                 Software: "Fiera.js",
//                 Comment: ""
//             }})
//
//
//         let uploadResult = await App.storage.put(buffer2, key)
//         resolve(uploadResult)
//     })
//
//
// }