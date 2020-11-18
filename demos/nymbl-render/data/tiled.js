import pattern from "./pattern.js";
import template from "./template.js";

export default {
    width: 2000,
    height: 3000,
    background:  "#caf1ffff",
    backgroundColor: "#caf1ffff",
    objects: [
        {
            // shadow: {
            //    color: 'red',
            //    blur: 10,
            //    offsetX: 3,
            //    offsetY: 3
            // },
            contentOrigin: "center",
            type: "template",
            objects: template.objects,
            clipPath: true,
            left: 0,
            top: 0,
            width: template.width,
            height: template.height,
            puzzleSpacingX: 50,
            puzzleSpacingY: 50,
            puzzlePreset: "half-drop"
        }
    ]
}
