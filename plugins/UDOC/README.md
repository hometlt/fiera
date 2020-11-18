# UDOC.js
[!!! Live Demo !!!](http://www.ivank.net/veci/pdfi/)  UDOC.js is a robust document parser and converter with a very simple interface. It is used in [Photopea](https://www.Photopea.com) to load and save PS, EPS, PDF, WMF and EMF files.

If you want to render a PDF file, use [pdf.js](https://github.com/mozilla/pdf.js). For all other PDF-related operations, use UDOC.js.

<img src="interface.svg" width="50%">

# Parsing

#### `FromXYZ.Parse(b, w)`
* `b`: ArrayBuffer - a binary data of a document
* `w`: Writer object (e.g. an instance of ToPDF.js)

A Parser takes a binary file and parses it. During that process, it calls methods of the **writer** (like `w.StartPage(...)`, `w.Fill(...)`, `w.Stroke(...)`, `w.PutText(...)`, `w.PutImage(...)`, `w.ShowPage()` ...). The data of the document flow from the Parser to the Writer by calling these methods.

Documents consist of pages. The parser calls `w.StartPage(...)` at the beginning of each page, and `w.ShowPage()` at the end of each page. `Fill`, `Stroke`, `PutText` and `PutImage` calls can occur in between. The parsing is finished by calling `w.Done()`.

#### `w.StartPage(x0,y0,x1,y1)`
* `x0,y0,x1,y1` - the bounding box of the page

#### `w.ShowPage()`, `w.Done()`

#### `w.Fill(gst, evenOdd)`
* `gst` - Graphic State
* `evenOdd` - Boolean - filling rule (true: even-odd, false: non-zero)

#### `w.Stroke(gst)`
* `gst`: Graphic State

#### `w.PutText(gst, str, stw)`
* `gst` - Graphic State
* `str` - a string to render
* `stw` - string width (you can ignore it)

#### `w.PutImage(gst, img, w, h, msk)`
* `gst` - Graphic State
* `img` - Image
* `w, h` - image size
* `msk` - Image for the mask (can be null)

The Image is a Uint8Array with binary data. If its size is `w * h * 4`, it contains the raw RGBA image. Otherwise, it contains a compressed image (like JPEG, JBIG2, CCITT etc.). If the mask image is present, its color data should be used as the transparency for the main image.

## Graphic State

The Graphic State is an object, containing the current graphic parameters (current path, current fill color, current stroke thickness). The Writer can read these parameters, but it shall not rewrite them.

```javascript
ctm   : [1,0,0,1,0,0],// current transformation matrix
font  : Font,         // current text parameters
ca    : 1,            // fill transparency
colr  : [0,0,0],      // fill color
CA    : 1,            // stroke transparency
COLR  : [0,0,0],      // stroke color
bmode : "/Normal",    // blend mode
lwidth:  1,           // line width
lcap  :  0,           // line cap
ljoin :  0,           // line join
mlimit: 10,           // miter limit
doff: 0, dash: [],    // dashing offset and a pattern
pth : Path,           // current path (absolute coordinates)
cpth: Path            // current clipping path (absolute coordinates)
```
## Font object
```javascript
Tc   :   0,           // character spacing
Th   : 100,           // horizontal scale
Tl   :   0,           // leading
Tfs  :   1,           // font size
Tf   : "Helvetica-Bold",   // PostScriptName of the current font 
Tm   : [1,0,0,1,0,0]       // text transformation matrix
```

## Path object
```javascript
cmds : ["M", "L", "C", "Z"],         // drawing commands (moveTo, lineTo, curveTo, closePath)
crds : [0,0,  1,1,  2,2,3,0,2,1  ]   // coordinates for drawing commands (2 for M and L, 6 for C, 0 for Z)
```

By making a single Writer (into your internal format), you will let your software load PS, PDF, EMF, WMF and possibly other formats (for which Parsers exist). By making a single Parser (from your internal format), you will let your software export documents into PDF, EMF and other formats (for which Writers exist). Here is a simple writer, that counts pages and stores all strings.

```javascript
var numPages = 0, strings = [], ef = function(){};
var W = {  // our writer
    StartPage:ef, Fill:ef, Stroke:ef, PutImage:ef, Done:ef,
    PutText : function(gst, str, stw) {  strings.push(str);  },
    ShowPage: function() {  numPages++;  }
};  
FromPDF.Parse(pdfFile, W);
console.log(numPages, strings);
```
## UDOC.js file

UDOC.js contains various utilities, that can be used by Parsers or Writers. E.g. `UDOC.getState()` returns a default Graphic State. `UDOC.M` contains utilities for working with 2D matrices, and `UDOC.G` contains utilities for working with vector paths.

# Generating documents

This repository contains the ToPDF and ToEMF Writers. You can use ToPDF with FromPS to convert PostScript to PDF (or even with FromPDF to convert PDF to PDF), but you can also use it to generate PDFs from your own format.

Here is an example of drawing a simple square and [the result](http://www.ivank.net/veci/pdfi/square.pdf).
```javascript
var gst = UDOC.getState();  // Graphics State with default parameters;
gst.colr= [0.8,0,0.8];      // purple fill color
gst.pth = {  cmds:["M","L","L","L","Z"], crds:[20,20,80,20,80,80,20,80]  };  // a square
var pdf = new ToPDF();  // or new ToEMF(); to make an EMF file
pdf.StartPage(0,0,100,100);  pdf.Fill(gst);  pdf.ShowPage();  pdf.Done();
console.log(pdf.buffer);  // ArrayBuffer of the PDF file
```

The Writer ToContext2D (ToContext2D.js) can be used as a simple renderer of PS, PDF, WMF or EMF files.
```javascript
var pNum  = 0;  // number of the page, that you want to render
var scale = 1;  // the scale of the document
var wrt = new ToContext2D(pNum, scale);
FromPDF.Parse(myFile, wrt);
document.body.appendChild(wrt.canvas);
```
But you can use it as a guide for writing your own Writers.

FromPDF and ToPDF use [pako.js](https://github.com/nodeca/pako) for the Deflate compression.
