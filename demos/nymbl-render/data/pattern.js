import template from "./template.js";

export default  {
    width: 900,
    height: 534,
    objects: [
        {
            type: "template",
            objects: template.objects,
            width: template.width,
            height: template.height,
            left: -521.5,
            top: -260.84,
            scaleX: 0.85,
            scaleY: 0.85
        },
        {
            type: "i-text",
            textLines: [13],
            top: 0,
            left: -600.012152009562,
            width: 819.1999853515625,
            height: 144.64,
            scaleX: 1.9044432235018796,
            scaleY: 1.9044432235018796,
            fontFamily: "Leckerli One",
            fontSize: 128,
            text: "Add Text Here"
        }
    ]
}