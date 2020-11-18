

export const FmPdfkit = {
  name: "pdfkit",
  install(){
    fabric.util.pdfDebug = false;
    fabric.pdf = {
      setupSvgExport: function(){
        fabric.__exportPDF = true;
        this.__inlineSVG = fabric.inlineSVG;
        this.__rasterizeSvgShadow = fabric.Object.prototype.rasterizeSvgShadow;
        // fabric.inlineSVG = true;
        fabric.Object.prototype.rasterizeSvgShadow = true;
      },
      resolveSvgExport: function(){
        delete fabric.__exportPDF;
        fabric.inlineSVG = this.__inlineSVG;
        fabric.Object.prototype.rasterizeSvgShadow = this.__rasterizeSvgShadow;
      },
      defaultFontFamily: "Helvetica",
      svgOptions: {
        fontCallback(family, weight, style, fontOptions) {
          switch(weight) {
            case "normal":
              weight = 400;break;
            case "bold":
              weight = 700;break;
          }
          if (family.indexOf("'") !== -1) {
            family = family.substr(family.indexOf("'") + 1);
            family = family.substring(0, family.indexOf("'"));
          }
          let familyFull;

          let fv = fabric.fonts.getFontVariation(family, weight, style);

          if(fv){
            if(style === "italic" && fv.style === "normal"){
              fontOptions.fauxItalic = true;
            }
            if(weight > 400 && fv.weight <= 400){
              fontOptions.fauxBold = true;
            }
            familyFull = `${family} ${fv.style} ${fv.weight}`;
            if(!this._registeredFonts[familyFull]){
              fabric.util.pdfDebug && console.log(`PDF Register font: ${family} ${style} ${weight} `);
              if(fabric.isLikelyNode) {
                this.registerFont(familyFull, fv.variation.src);//,family
              }
              else{
                this.registerFont(familyFull, fv.variation.buffer);//,family
              }
            }
          }else{
            fabric.util.pdfDebug && console.warn(`PDF no font registered: ${family} `);
            familyFull = `Times ${style} ${weight}`;
          }
          return familyFull;
        },
        imageCallback(link) {

          //todo deprecated
          // if(fabric.util.fImageRegistry[link]){
          //   return fabric.util.fImageRegistry[link]
          // }
          let res;
          if(fabric.resources[link]){
            res = fabric.resources[link]
          }
          if(!res){
            for(let key in fabric.resources){
              if(fabric.resources[key].url === link){
                res = fabric.resources[key]
                break
              }
            }
          }
          //todo this should be removed.
          if(res){
            let canvas = fabric.util.createCanvasElement();
            canvas.width = res.image.width;
            canvas.height = res.image.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(res.image, 0, 0);
            return canvas.toDataURL();
          }
          return link;
          // return fabric.util.fImageRegistry[link] || link;
        }
        //- width, height [number] = initial viewport, by default it's the page dimensions
        //- preserveAspectRatio [string] = override alignment of the SVG content inside its viewport
        //- useCSS [boolean] = use the CSS styles computed by the browser (for SVGElement only)
        //- documentCallback [function] = same as above for the external SVG documents
        //- colorCallback [function] = function called to get color, making mapping to CMYK possible
        //- warningCallback [function] = function called when there is a warning
        //- assumePt [boolean] = assume that units are PDF points instead of SVG pixels
        //- precision [number] = precision factor for approximative calculations (default = 3)
      },
    }
  },
  prototypes: {
    Editor: {

      async renderPDF (file) {
        let elements = [];
        await this.loadPdfPreviewModules();
        let pdf = await PDFJS.getDocument(file).promise;
        return new Promise ((resolve ) => {
          for(let pageNum = 1; pageNum  <= pdf.numPages; pageNum ++){
            pdf.getPage(pageNum).then((page)=>{
              // let desiredWidth = demo.editor.canvas.width;
              let viewport = page.getViewport({scale: 1,});
              // let scale = desiredWidth / viewport.width;
              // let scaledViewport = page.getViewport({scale: scale,});
              let pdfcanvas = fabric.util.createCanvasElement();
              pdfcanvas.height = viewport.height;// scaledViewport.height;
              pdfcanvas.width = viewport.width;//scaledViewport.width;
              let pdfcontext = pdfcanvas.getContext('2d');
              elements.push(pdfcanvas);

              page.render({
                canvasContext: pdfcontext,
                viewport: viewport//scaledViewport
              }).promise.then(function () {
                resolve(elements);
              })
            });
          }
        });
        // if (e.name === "MissingPDFException") {
        //   console.error(e);
        // }
      },
      async loadPdfPreviewModules() {
        if(typeof PDFJS === "undefined"){
          window.PDFJS = await import(fabric.libRoot + "pdfjs/pdf.js")
          PDFJS.GlobalWorkerOptions.workerSrc = fabric.libRoot + "pdfjs/core/pdf.worker.js";
          // await import(fabric.libRoot + "pdfjs/core/worker.js")
        }
      },
      async loadPdfExportModules() {
        if(typeof PDFDocument === "undefined"){
          await import(fabric.libRoot + "pdfkit-web.js")
          fabric.PDFDocument = PDFDocument
          // fabric.fontkit = FontKit
        }
      },
      async makeDocument(){
        await this.loadPdfExportModules()
        let svgArray = await this.exportSVGData()
        let ptUnit = fabric.util.parseUnit("1pt");
        let size = this.slides[0].getOriginalSize()
        const doc = new PDFDocument({
          font: false,
          compress: false,
          size :[ size.width / ptUnit, size.height / ptUnit]
        });
        fabric.pdf.svgOptions.assumePt = ptUnit;
        for(let pageNum =0 ;pageNum < svgArray.length; pageNum ++ ){
          if(pageNum > 0 ){
            doc.addPage({size : [ svgArray[pageNum].width /  ptUnit, svgArray[pageNum].height / ptUnit ]});
          }
          doc.svg(svgArray[pageNum].svg, 0, 0, fabric.pdf.svgOptions);
        }
        doc.end()
        return doc;
      }
    },
    StaticCanvas: {
      makeDocument(){
        fabric.pdf.setupSvgExport();

        let ptUnit = fabric.util.parseUnit("1pt");
        let w = this.originalWidth || this.width;
        let h = this.originalHeight || this.height;
        const doc = new PDFDocument({compress: false, size : [
            w / ptUnit,//8.9 * 72,
            h / ptUnit // 12.3 * 72
          ]});
        fabric.pdf.svgOptions.assumePt = ptUnit;

        doc.svg(this.toSVG(), 0, 0,fabric.pdf.svgOptions);

        doc.end();

        fabric.pdf.resolveSvgExport();
        return doc;
      }
    }
  }
}