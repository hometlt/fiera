
import gl from 'gl'
import nodeCanvas from 'canvas'

/**
 * Indicate whether this filtering backend is supported by the user's browser.
 * @param {Number} tileSize check if the tileSize is supported
 * @returns {Boolean} Whether the user's browser supports WebGL.
 */
// fabric.isWebglSupported = function(tileSize) {
//     if (fabric.isLikelyNode) {
//         return false;
//     }
//     tileSize = tileSize || fabric.WebglFilterBackend.prototype.tileSize;
//     let canvas = document.createElement('canvas');
//     let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//     let isSupported = false;
//     // eslint-disable-next-line
//     if (gl) {
//         fabric.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
//         isSupported = fabric.maxTextureSize >= tileSize;
//         let precisions = ['highp', 'mediump', 'lowp'];
//         for (let i = 0; i < 3; i++){
//             if (testPrecision(gl, precisions[i])){
//                 fabric.webGlPrecision = precisions[i];
//                 break;
//             };
//         }
//     }
//     this.isSupported = isSupported;
//     return isSupported;
// };
export const FmNodeGL = {
    name: "gl",
    install() {
        fabric.webgl = {
            createContext(width, height, contextAttributes) {
                contextAttributes.preserveDrawingBuffer = true;
                return gl(Math.ceil(width), Math.ceil(height), contextAttributes)
            },
            resizeContext(gl, width, height) {
                let ext = gl.getExtension('STACKGL_resize_drawingbuffer')
                ext.resize(Math.ceil (width), Math.ceil(height))
            },
            getContextWidth(gl) {
                return gl.drawingBufferWidth
            },
            getContextHeight(gl) {
                return gl.drawingBufferHeight
            },
            destroyContext(gl){
                let ext = gl.getExtension('STACKGL_destroy_context')
                ext.destroy()
            },
            getImageData(gl){
                let width = gl.drawingBufferWidth;
                let height = gl.drawingBufferHeight

                const readPixelBuffer = new Uint8Array(width * height * 4);
                gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, readPixelBuffer);


                let arr  =new Uint8ClampedArray(readPixelBuffer);

                let counter = 0;
               for (let i=0;i < arr.length ; i++ ) {
                   if(arr[i]){
                       counter ++;
                   }
               }
                console.log(counter)

                return nodeCanvas.createImageData(arr, width, height);
            },
            upsideDown: true,
            getImage(gl) {
                let canvas = fabric.util.createCanvasElement(gl.drawingBufferWidth,gl.drawingBufferHeight);
                let ctx = canvas.getContext("2d");
                let width = gl.drawingBufferWidth;
                let height = gl.drawingBufferHeight
                let pixels = new Uint8Array(width * height * 4);
                gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                let arr  =new Uint8ClampedArray(pixels);
                let imageData = nodeCanvas.createImageData(arr, width, height);
                ctx.putImageData(imageData,0,0);
                return canvas;
            }
        }
    }
}

