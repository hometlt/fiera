export const FmWebGL = {
    name: "gl",
    // nodeDeps: [WebGL],
    // nodeDeps: [NodeWebGL],
    install() {
        fabric.webgl = {
            createContext(width, height, options) {

                let canvas = fabric.util.createCanvasElement(Math.ceil(width), Math.ceil(height))
                // https://stackoverflow.com/questions/39341564/webgl-how-to-correctly-blend-alpha-channel-png
                // let gl = canvas.getContext("webgl", {premultipliedAlpha: false})
                let gl = canvas.getContext("webgl", options);// {	premultipliedAlpha: false})

                if (!gl) {
                    console.warn("Warp: WebGL is not supprted!")
                    return null
                }
                return gl;
            },
            upsideDown: false,
            getImage(gl) {
                return gl.canvas

                // let width = gl.canvas.width
                // let height = gl.canvas.height
                // let canvas = fabric.util.createCanvasElement(gl.drawingBufferWidth,gl.drawingBufferHeight);
                // let ctx = canvas.getContext("2d");
                // let pixels = new Uint8ClampedArray(width * height * 4);
                // gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                // let imageData = new ImageData(pixels, width, height);
                // ctx.putImageData(imageData,0,0);
                // return canvas;
            },
            resizeContext(gl, width,height) {
                gl.canvas.width = Math.ceil(width);
                gl.canvas.height = Math.ceil(height);
            },
            getContextWidth(gl) {
                return gl.canvas.width
            },
            getContextHeight(gl) {
                return gl.canvas.height
            }
        }
    }
}