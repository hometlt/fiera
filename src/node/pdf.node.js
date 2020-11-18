import fs from 'fs'
import path from 'path'
import imageType from 'image-type'
import PNGJS from 'pngjs'
import PDFDocument,{PDFImage, JPEGImage, PNGImage} from './../../plugins/pdfkit-node.js'
import SVGtoPDF from './pdfkit.svg.js'
import WritableBufferStream from './../../plugins/WritableBufferStream.js'


PDFDocument.prototype.svg = function(svg, x, y, options) {
  if(!options)options = {};
  if(!options.fontCallback){
    options.fontCallback = function (family) {return family;};
  }
  return SVGtoPDF(this, svg, x, y, options);
};

PDFImage.open = function (src, label) {
  let buffer;

  if (Buffer.isBuffer(src)) {
    buffer = src;
  } else if (src instanceof ArrayBuffer) {
    buffer = Buffer.from(new Uint8Array(src));
  } else {
    let match = /^data:.+;base64,(.*)$/.exec(src)
    if (match) {
      buffer = Buffer.from(match[1], 'base64');
    } else {
      buffer = fs.readFileSync(src);
      if (!buffer) {
        return;
      }
    }
  }

  const { mime } = imageType(buffer);

  switch (mime) {
    // if (buffer[0] === 0xff && buffer[1] === 0xd8)
    case 'image/jpeg':
      return new JPEGImage(buffer, label);
    // if (buffer[0] === 0x89 && buffer.toString('ascii', 1, 4) === 'PNG')
    case 'image/png':
      const png = PNGJS.PNG.sync.read(buffer);
      //fixed PDFKit problems with SRGB palette.
      if (png.palette) {
        buffer = PNGJS.PNG.sync.write(png, { interlace: false });
      }
      //fixed PDFKit problems with interlaced PNG files.
       if (png.interlace) {
        buffer = PNGJS.PNG.sync.write(png, { interlace: false });
      }
      return new PNGImage(buffer, label);
    default:
      throw new Error('Unsupported image format :' + mime);
  }
};

PDFDocument.prototype.toBuffer = function(callback) {
  return new Promise(resolve => {
    let stream = new WritableBufferStream();
    this.pipe(stream);
    stream.on('finish', () => {
      let buffer = stream.toBuffer();
      callback && callback(buffer);
      resolve(buffer)
    });
  })
};

PDFDocument.prototype.toFile= function(filename,callback) {
  return new Promise((resolve, reject) => {
    filename = path.resolve(filename);
    let file = fs.createWriteStream(filename);
    file.on("finish", () => {
      callback && callback(filename);
      resolve(filename);
    });
    file.on("error", reject);
    this.pipe(file);
  });
};

// function registerAFMFonts(ctx) {
//   ctx.keys().forEach(key => {
//     const match = key.match(/([^/]*\.afm$)/);
//     if (match) {
//       // afm files must be stored on data path
//       fs.writeFileSync(`data/${match[0]}`, ctx(key))
//     }
//   });
// }
// registerAFMFonts(require.context('./afm', false, /Times.*\.afm$/));
//
// require("./afm/Helvetica.afm");
// require("./afm/Times-Bold.afm");
// require("./afm/Times-BoldItalic.afm");
// require("./afm/Times-Italic.afm");
// require("./afm/Times-Roman.afm");

global.PDFDocument = PDFDocument;


