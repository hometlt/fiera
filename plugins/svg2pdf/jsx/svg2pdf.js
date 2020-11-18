import { Context } from './context/context.js';
import { ReferencesHandler } from './context/referenceshandler.js';
import { parse } from './parse.js';
import { jsPDF } from './../../jspdf/src/jspdf.js';
import { StyleSheets } from './context/stylesheets.js';
import { Viewport } from './context/viewport.js';
export default async function svg2pdf(element, pdf, options = {}) {
    const x = options.x ?? 0.0;
    const y = options.y ?? 0.0;
    const extCss = options.loadExternalStyleSheets ?? false;
    //  create context object
    const idMap = {};
    const refsHandler = new ReferencesHandler(idMap);
    const styleSheets = new StyleSheets(element, extCss);
    await styleSheets.load();
    // start with the entire page size as viewport
    const viewport = new Viewport(pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    const svg2pdfParameters = { ...options, element };
    const context = new Context(pdf, { refsHandler, styleSheets, viewport, svg2pdfParameters });
    pdf.advancedAPI();
    pdf.saveGraphicsState();
    // set offsets
    pdf.setCurrentTransformationMatrix(pdf.Matrix(1, 0, 0, 1, x, y));
    // set default values that differ from pdf defaults
    pdf.setLineWidth(context.attributeState.strokeWidth);
    const fill = context.attributeState.fill.color;
    pdf.setFillColor(fill.r, fill.g, fill.b);
    pdf.setFont(context.attributeState.fontFamily);
    // correct for a jsPDF-instance measurement unit that differs from `pt`
    pdf.setFontSize(context.attributeState.fontSize * pdf.internal.scaleFactor);
    const node = parse(element, idMap);
    await node.render(context);
    pdf.restoreGraphicsState();
    pdf.compatAPI();
    context.textMeasure.cleanupTextMeasuring();
    return pdf;
}
jsPDF.API.svg = function (element, options = {}) {
    return svg2pdf(element, this, options);
};
