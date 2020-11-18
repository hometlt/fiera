export default {
  name: "bg-ov-images",
  prototypes: {
    BackgroundImage: {
      type: "background-image",
      prototype: fabric.Image,
      storeProperties: ["flipX", "flipY", "stroke", "strokeWidth", "strokeDashArray", "strokeLineCap", "strokeDashOffset", "strokeLineJoin", "strokeMiterLimit", "opacity", "clipPath", "filters", "src", "crop", "fitting"],
      stateProperties: []
    },
    OverlayImage: {
      type: "overlay-image",
      prototype: fabric.Image,
      storeProperties: ["flipX", "flipY", "stroke", "strokeWidth", "strokeDashArray", "strokeLineCap", "strokeDashOffset", "strokeLineJoin", "strokeMiterLimit", "opacity", "clipPath", "filters", "src", "crop", "fitting"],
      stateProperties: []
    }
  }
}
