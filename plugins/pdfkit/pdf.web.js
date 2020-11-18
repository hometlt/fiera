let PDFKit = require('./pdfkit-web.js');
let blobStream = require('blob-stream');
let SVGtoPDF = require('./pdfkit.svg.js');
let {BlobStream} = require('./browser-stream.js');
const fs = require('fs');

PDFKit.PDFDocument.prototype.blobURL = function (callback) {
  var stream = this.pipe(blobStream());
  stream.on('finish', function() {
    callback(stream.toBlobURL('application/pdf'));
  });
};

PDFKit.PDFDocument.prototype.toBlob = function (callback) {
  const stream = new BlobStream();
  this.pipe(stream);
  stream.on('finish', function () {
    callback(stream.toBlob('application/pdf'));
  });
  // this.end();
};

function registerBinaryFiles(ctx) {
  ctx.keys().forEach(key => {
    // extracts "./" from beginning of the key
    fs.writeFileSync(key.substring(2), ctx(key))
  });
}

function registerAFMFonts(ctx) {
  ctx.keys().forEach(key => {
    const match = key.match(/([^/]*\.afm$)/);
    if (match) {
      // afm files must be stored on data path
      fs.writeFileSync(`data/${match[0]}`, ctx(key))
    }
  });
}


PDFKit.PDFDocument.prototype.svg = function(svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options);
};

// registerBinaryFiles(require.context('./assets', true));

// is good practice to register only required fonts to avoid the bundle size increase
// registerAFMFonts(require.context('./afm', false, /Helvetica.*\.afm$/));
// registerAFMFonts(require.context('./afm', false, /Courier.*\.afm$/));
registerAFMFonts(require.context('./afm', false, /Times.*\.afm$/));

global.PDFDocument = PDFKit.PDFDocument;