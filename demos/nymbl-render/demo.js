import {App} from "../lib/app.js"
import {
    FmTransformations,
    FmStretchable,
    FmSnap,
    FmZoom,
    FmRulers,
    FmUndo,
    FmTiles,
    FmWarp,
    FmOuterCanvas,
    FmSourceCanvas,
    FmFonts,
    FmGoogleFonts,
    FmCLipPath,
    FmCrop,
    FmObjectRender,
    FmTextEasyEdit,
    FmPdfkit,
    FmTemplates,
    FmElementsParser,
    FmBufferRendering
} from "../../src/modules.js";

import tiled from "./data/tiled.js";
import design from "./data/design.js";
import template from "./data/template.js";
import autotile from "./data/autotile.js";
import {readFileAsText} from "../../plugins/blob-buffers-utils.js";
import {uploadDialog} from "../../src/util/uploader.js";

let rect = {
    type: "rect",
    left: 0,
    top: 0,
    opacity: 0.5,
    fill: "rgba(0,255,0)",
    width: 100,
    height: 60,
    strokeWidth: 2,
    stroke: "red"
}

const additionalObject = {
    type: "template-photo-image",
    left: 60,
    top: 40,
    width: 50,
    height: 50,
    src: "fox.jpg"
}

let designGroupNoTiling = {
    type: "group", width: 102, height: 62, contentOrigin: "top-left", clipPath: true,
    objects: [
        {
            type: "rect",
            left: 0,
            top: 0,
            opacity: 0.5,
            fill: "rgba(0,255,0)",
            width: 100,
            height: 60,
            strokeWidth: 2,
            stroke: "red"
        },
        additionalObject
    ]
}

let designGroup = Object.assign({},designGroupNoTiling, {
    puzzlePreset: "half-brick",
})

let printGroup = {
    type: "group", contentOrigin: "top-left", clipPath: true, width: 4575, height: 2715,
    objects: [
        {type: "rect", width: 4575, height: 2715, fill: "#caf1ffff"},
        designGroup
    ]
}

let printGroupNoTiling = {
    type: "group", contentOrigin: "top-left", clipPath: true, width: 4575, height: 2715,
    objects: [
        {type: "rect", width: 4575, height: 2715, fill: "#caf1ffff"},
        designGroupNoTiling
    ]
}

App.create({
    plugins: [
        FmStretchable,
        FmZoom,
        FmRulers,
        FmUndo,
        FmTiles,
        FmWarp,
        FmOuterCanvas,
        // FmSourceCanvas,
        FmTextEasyEdit,
        FmFonts,
        FmGoogleFonts,
        FmCLipPath,
        FmCrop,
        FmSnap,
        FmObjectRender,
        FmPdfkit,
        FmTemplates,
        FmTransformations,
        FmElementsParser,
        FmBufferRendering
    ],
    elements: {
        tileInGroup: {
            "type": "template",
            "puzzleSpacing": 0,
            "objects": [{
                "type": "template-photo-image",
                "puzzle": {"offsetsX": [{"x": 1, "y": 0.5}, {"x": 1, "y": -0.5}]},
                "puzzleSpacing": 0,
                "clipPath": {},
                "src": "m2.jpg",
                "crop": {"top": 0, "left": 0},
                "top": -1000,
                "left": -1000,
                "width": 1000,
                "height": 1000
            }],
            "top": 0,
            "left": 0,
            "scaleX": 0.1,
            "scaleY": 0.1,
            "width": 2000,
            "height": 2000
        },
        rect,
        template,
        autotile,
        yyy: [{"type":"group","width":4575,"height":2715,"scaleX":0.19672131147540983,"scaleY":0.19672131147540983,"objects":[{"top":217,"left":5,"type":"template","width":1042,"height":520,"scaleX":4.385796545105566,"scaleY":4.384615384615385,"objects":[{"top":-48,"fill":"#fec925","left":-449,"path":[["m",194.7,253.4],["l",-94.4,-8.9],["c",0,0,-25.6,-5,-27.2,47.3],["c",-1.6,52.3,-6.9,98.3,54.4,86.7],["c",61.3,-11.6,267.4,-41.2,267.4,-41.2],["c",0,0,77.7,-5.3,74,-18],["c",-3.7,-12.7,-22.8,-29.1,-22.8,-29.1],["c",0,0,9.6,-68.5,-25.3,-74.4],["c",-34.9,-5.9,-61.3,3.1,-61.3,3.1],["z"]],"type":"template-path","width":396,"height":166,"puzzleSpacing":0},{"top":-184,"fill":"#49aa80","left":-475,"path":[["m",1488.7,683],["c",-21,2.6,-32.3,8.2,-38.4,13.6],["l",-44.9,-81.9],["c",-9.3,-16.8,-22.6,-14.8,-22.6,-14.8],["l",-194,25.1],["c",-17.8,2.2,-18.9,15.8,-18.9,15.8],["l",-27.6,91.2],["c",-7.5,-2.8,-18.9,-4.3,-36.4,-2.1],["c",0,0,-15.2,0.5,-14.9,14],["l",1.4,11.3],["c",0.2,1.5,0.8,3,1.8,4.2],["c",3,3.5,10.6,9.9,24.6,8.2],["l",14.1,-0.9],["c",-28.3,13.2,-21.4,59.7,-20.3,67.5],["c",0,0.3,0.1,0.6,0.2,0.9],["c",0.2,1.8,0.8,8.2,1.6,16.2],["c",-3.2,-0.5,-9.1,-0.2,-10.4,7.6],["c",-0.1,0.7,-0.1,1.5,0,2.2],["l",3.5,28.4],["c",0.4,3.1,1.8,5.9,4.1,7.9],["c",3.8,3.5,10.5,7.9,20.1,7.9],["l",3.4,27.7],["c",1.4,11.1,11.7,19,23.1,17.6],["l",33.4,-4.1],["c",11.4,-1.4,19.6,-11.6,18.2,-22.7],["l",-3.4,-27.6],["l",223.6,-27.4],["l",3.4,27.6],["c",1.4,11.1,11.7,19,23.1,17.6],["l",33.4,-4.1],["c",11.4,-1.4,19.6,-11.6,18.2,-22.7],["l",-3.5,-28.2],["c",9.6,-3.3,14.5,-10.5,16.4,-14.2],["c",0.7,-1.3,1,-2.8,0.8,-4.3],["l",-3.7,-30.3],["c",-0.1,-0.7,-0.3,-1.4,-0.6,-2.1],["c",-3.3,-7.5,-9.4,-6,-12.3,-4.7],["c",-1.3,-9.4,-2.4,-16.7,-2.4,-16.7],["c",0,0,-4.5,-55.2,-35.3,-60.9],["l",17.8,-3.3],["c",13.5,-1.7,19.4,-9.1,21.7,-13.4],["c",0.9,-1.6,1.2,-3.5,1,-5.3],["l",-1.4,-11],["c",-3,-12.9,-17.9,-9.8,-17.9,-9.8],["z"],["m",-333.2,55.3],["l",24,-87.7],["c",0,0,0.9,-13.6,17.4,-15.7],["L",1377,611.5],["c",0,0,11.5,-4.1,21.2,15],["l",40.6,78.9],["l",2.4,4.9],["c",1,2,1,4.4,-0.1,6.4],["c",-4.7,9,-17.8,9.5,-17.8,9.5],["l",-248.8,30.5],["c",-13.7,1.7,-18,-11.3,-18,-11.3],["c",0,0,-0.3,-0.8,-0.7,-1.9],["c",-0.7,-1.7,-0.8,-3.5,-0.3,-5.2],["z"],["m",-10,150.6],["c",-5.7,0.7,-10.8,-3.2,-11.5,-8.7],["c",-0.7,-5.5,3.4,-10.6,9,-11.3],["c",5.7,-0.7,10.8,3.2,11.5,8.7],["c",0.7,5.5,-3.3,10.6,-9,11.3],["z"],["m",6.7,-59.1],["c",-13.2,1.6,-25.4,-9.3,-27.3,-24.4],["c",-1.9,-15.1,7.4,-28.6,20.6,-30.3],["c",13.2,-1.6,54.2,25.4,56,40.5],["c",1.8,15.1,-36.1,12.6,-49.3,14.2],["z"],["m",348.2,5.4],["c",0.7,5.5,-3.4,10.6,-9,11.3],["c",-5.7,0.7,-10.8,-3.2,-11.5,-8.7],["c",-0.7,-5.5,3.4,-10.6,9,-11.3],["c",5.7,-0.7,10.8,3.2,11.5,8.7],["z"],["m",-24.2,-72.8],["c",1.9,15.1,-7.4,28.6,-20.6,30.3],["c",-13.2,1.6,-47.2,7.5,-49,-7.6],["c",-1.9,-15.1,29.1,-45.5,42.3,-47.1],["c",13.3,-1.6,25.5,9.3,27.3,24.4],["z"]],"type":"template-path","width":430,"height":350,"puzzleSpacing":0},{"src":"data:image/jpeg;base64,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 F982LL0sebfjvrtjrfZXeJV6oBz6+jVPTLE0tVS22C5610xddl1lTTbZOkyzKlp15dbimRJxGu2I Z5SkBRsbWfTKbUaddSdbmhZlbMedarmsy0VKq74JEfLWYO/HR0+b0k+nFxRXwPQ+f04Y3Z9GjHQ1 JzZ6Dhd7NvvaeXaAAMAGhNgANMCuytrnjj3zGfQlXB0ksnpadOXSiyxTVZ8bjHWy3C3PU0861F+a Ewo154K+jKNt83m0VOL7ufv6cIuSJFKwKZW1zdlmGDXRXKTnrQ5MA7EOWM32Y96cbJMK3NhCnTUH D4XpON25R6ODoJ7lJIhx+1w9GPLYV6vPblYEu/5v0mbde08u4AGNNA0wAAYAKE4NYar6O+eVtNrW KHoc2P0ONdVbHfSQrjpljibWyyiQXzpkqvdc3FubmpPu6smsHKGjpxjLZC+GeNicqaI68+/FLrjs ISIolaDrxdDytvfmpn3zb/R+N6/Lt6dYuLn2+ol57vg6ZQa4eJ1dea6fM6SroxlBKPA9BxNGPLa6 9WFDi4n6Thd3Lu0tPL6AAgYANMAABgCrsrax035++d212tdEHm1cCezDy16Mmmrl24+HvVXGLq82 247l3CTnRitaeHb1qefXRposRLZRf2zX120vnTGuCrfRbOOnDj3I1z5FvTmny7Ogk+bi76L4a7o5 4B3xrCuhBV5PtYstHX3cvpXx8g8r6c9fV5vTT3xlFEPPei4GnEaM0u+WEZuud3b5HYy79QGXaMAA ABgAMABCrsrZjo0Ud87vz6BbpQOGmvlnHO3Vt5PQz6aJsaskrXMS6SqN0WJZ7mE6n5Jro9HlbO0e rXkOvL3aq7YkHESUFLtTOXaI1NCeVmkxaGrRHO2Kzrz4nG9J5S36ac8OrB5RNVPZ3+X7SffhOKIc LvcvvkzK7LpxqY3F/X4/az7dbTybmAmNMQAMaYAICuytrJRozd88r+fyJ1d3g5Hw9SF2fccsnX4X b5ctNue1XY5zqKZXyHVZZJBAxzdHmO/xb5bfR8Dv6M3mduS/j7W70Xj7VHsn57r8s10pPrmjOqpr VXmfHtorpr59XoyQDeubY10aJ59eLHLoNbVwe35is/ImqumafY4vdR34yiC4fc5nbNinXZpwuhTq NXZ4XZzbtwnl2sTQNAMAYAAACgvPO9nGzVHouMSNQEU32ORsvFh7NmGMnQCWfXZs58mdSXNYdKjG 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","top":-153,"crop":{"top":0,"left":0},"left":-424,"type":"template-photo-image","angle":-6.986793054697095,"width":602,"height":402,"scaleX":0.478405315614618,"scaleY":0.47761194029850745,"clipPath":{"top":-237.8494994800212,"left":-267.4080856148352,"path":[["m",1155.5,738.3],["l",24,-87.7],["c",0,0,0.9,-13.6,17.4,-15.7],["L",1377,611.5],["c",0,0,11.5,-4.1,21.2,15],["l",40.6,78.9],["l",2.4,4.9],["c",1,2,1,4.4,-0.1,6.4],["c",-4.7,9,-17.8,9.5,-17.8,9.5],["l",-248.8,30.5],["c",-13.7,1.7,-18,-11.3,-18,-11.3],["c",0,0,-0.3,-0.8,-0.7,-1.9],["c",-0.7,-1.7,-0.8,-3.5,-0.3,-5.2],["z"]],"type":"path","angle":6.986793054697095,"width":286.7504465974332,"height":145.72319831651464,"scaleX":2.083489119913629,"scaleY":2.083489119913629,"puzzleSpacing":0},"puzzleSpacing":0,"clipPathFitting":"manual"},{"top":87,"fill":"#00b3eb","left":74,"path":[["m",686.3,369.1],["c",4.7,-3.3,11.3,-2.1,14.6,2.6],["c",3.3,4.7,2.1,11.3,-2.6,14.6],["c",-4.7,3.3,-11.3,2.1,-14.6,-2.6],["c",-3.3,-4.8,-2.2,-11.3,2.6,-14.6],["z"],["m",-18.6,-9.7],["l",4.6,7.9],["c",1.6,-1.3,3.2,-2.5,4.7,-3.6],["c",0.5,-0.4,0.7,-0.8,0.7,-1.3],["c",0,-0.7,-0.3,-2.2,-0.5,-2.9],["c",-0.1,-0.5,-0.3,-0.7,-1,-0.9],["c",-0.9,-0.3,-5.2,0.2,-8.5,0.8],["z"],["m",3.4,8.8],["l",-4.9,-8.6],["c",-1,0.2,-1.8,0.4,-2.1,0.5],["c",-2.3,0.8,-4.6,1.8,-6.6,3.2],["l",-6.6,4.5],["c",-0.4,0.3,-0.7,0.8,-0.6,1.1],["c",0.4,1.7,1.6,3.7,4.8,9.8],["c",0.9,1.7,0.7,1.2,2.4,0],["c",4.1,-3,9,-6.9,13.6,-10.5],["z"],["m",37.1,4],["c",1.7,-1.3,3.5,-2.9,4.9,-4.2],["c",1.1,-1.1,1.8,-2,2,-2.6],["c",0.4,-2.1,-2.2,-5.6,-3.6,-7.5],["c",-0.3,-0.5,-1.5,0.4,-1.8,-0.1],["c",-2.2,-2.8,-4.6,-5.8,-7,-8.6],["c",-2.9,-3.3,-10.3,1.7,-15.7,3.4],["c",-3.9,1.2,-8,0.9,-13.4,1.9],["c",-5.9,1.1,-11.1,2.1,-15.8,5.4],["c",-7.7,5.4,-19.8,12.4,-25.4,19.7],["c",-5.3,7,-8.9,15.3,-13.2,22.9],["c",-7.3,6.3,-14.9,14,-21.5,21.5],["c",-2.1,2.4,-2.4,4.4,-2.2,6.5],["c",0.3,2.3,1,4.1,1.2,5.4],["c",-0.6,0.5,-0.7,0.3,-0.7,0.9],["c",0.1,0.5,0.5,1,0.9,1.6],["c",0.9,1.5,2.2,3.4,3.5,4.4],["c",1.2,1,1.9,1.4,2.9,1.4],["c",0.7,0,1.5,-0.1,2.1,-0.5],["l",3,-1.9],["c",1.5,-1.5,1,-1.5,-0.6,-3.7],["c",-0.2,-0.3,-0.5,-0.7,-0.7,-1],["c",-4.3,-6.2,-2.8,-14.7,3.4,-18.9],["c",6.2,-4.3,14.7,-2.8,18.9,3.4],["c",0.4,0.6,0.9,1.3,1.2,1.9],["c",2.3,3.9,1.5,3.5,5.1,1.3],["l",46.8,-32.7],["c",2.3,-2.1,2.3,-1.7,-0.1,-4.6],["c",-0.5,-0.6,-0.9,-1.2,-1.4,-1.8],["c",-4.3,-6.2,-2.8,-14.7,3.4,-18.9],["c",6.2,-4.3,14.7,-2.8,18.9,3.4],["c",0.4,0.5,0.7,1.1,1,1.6],["c",1.8,2.4,2.3,1.7,3.9,0.4],["z"],["m",-75,24.6],["c",-0.1,-0.3,-0.4,-1.3,-0.9,-2.2],["c",-0.9,-1.6,-3.8,0.2,-5.4,1.5],["c",1.6,-4.7,4.6,-10.7,7.9,-15.2],["c",1.2,-1.6,4.9,-5.1,7.7,-7.2],["l",3.6,-2.7],["c",0.7,-0.5,1,-0.2,1.1,0.4],["c",0.6,2.2,3,6.2,4.4,9.1],["c",0.7,1.4,0.6,1.9,-0.7,2.8],["c",-4.8,3.5,-17.6,13.8,-17.7,13.5],["z"],["m",-20.9,23.7],["c",4.7,-3.3,11.3,-2.1,14.6,2.6],["c",3.3,4.7,2.1,11.3,-2.6,14.6],["c",-4.7,3.3,-11.3,2.1,-14.6,-2.6],["c",-3.3,-4.7,-2.1,-11.3,2.6,-14.6],["z"]],"type":"template-path","width":118,"height":96,"fillRule":"evenodd","puzzleSpacing":0},{"top":-149,"fill":"#fec925","left":363,"path":[["m",990.1,120.3],["c",5.3,-2.3,11.5,0.2,13.7,5.5],["c",2.3,5.3,-0.2,11.5,-5.5,13.7],["c",-5.3,2.3,-11.5,-0.2,-13.7,-5.5],["c",-2.3,-5.3,0.2,-11.5,5.5,-13.7],["z"],["m",-89.8,56.4],["c",2.1,-0.6,2.1,-2,0.8,-4.3],["c",-0.4,-0.7,-0.7,-1.4,-1.1,-2.2],["c",-3,-6.9,0.3,-14.8,7.2,-17.7],["c",6.9,-3,14.9,0.1,17.8,7],["c",0.4,0.8,0.7,1.7,0.9,2.5],["c",1,3.1,1.3,4.9,3.8,3.8],["l",53.1,-22.6],["c",4.1,-1.7,1.8,-2.1,-0.2,-6],["c",-0.3,-0.6,-0.6,-1.3,-0.9,-1.9],["c",-3,-6.9,0.2,-14.9,7.2,-17.9],["c",6.9,-3,14.9,0.2,17.9,7.2],["c",0.3,0.7,0.6,1.4,0.8,2.1],["c",0.8,2.5,0.5,4.1,2.9,3],["c",4.1,-1.9,6.4,-5.9,6.8,-10.3],["c",0.3,-2.8,0.1,-4.1,-2.5,-5.1],["c",-7.4,-3,-18.4,-1.1,-25.6,1.2],["c",-6,1.9,-18.2,8.2,-19.5,9.5],["c",-7.3,-0.3,-13.2,-0.4,-18.3,-0.3],["c",-8.3,0.2,-17,2.7,-25.1,6.5],["c",-15,7,-28.5,18.5,-39.4,28.3],["c",-6.2,5.6,1.2,3.3,2.4,8],["c",0.1,0.6,0.2,1.2,0.1,1.9],["c",-0.3,2.5,-1.2,4.8,0.5,6.6],["c",2.5,2.4,6.7,1.7,10.4,0.7],["z"],["m",29.5,-35.3],["c",1.2,1.6,1,1.9,-1,2.1],["c",-2.9,0.2,-8,0,-10.6,-1.4],["c",-1.5,-0.8,-1.2,-1.2,-0.3,-2.3],["c",1,-1.3,3.2,-3.1,4.5,-4],["c",0.5,-0.4,1.2,-0.7,1.9,-0.3],["c",2.2,1.5,4,3.8,5.5,5.9],["z"],["m",27.3,-9.3],["c",0.3,0.4,0.4,0.5,0,0.8],["c",-2.2,1.8,-15.2,6.8,-20.4,8.1],["c",-1.7,0.4,-3.2,-1.2,-4.3,-2.2],["c",-1.8,-1.6,-3.6,-3.5,-4.9,-4.8],["c",-0.7,-0.7,0,-1.3,1.2,-1.7],["c",2.4,-0.9,4.8,-1.9,7.2,-2.7],["c",4.7,-1.5,8.9,-2.4,13.8,-2.6],["c",3.5,-0.2,6.8,0,9.6,0.4],["c",0.8,0.1,1,0.3,0.1,0.6],["c",-1.9,0.5,-4.1,1.1,-3.5,2.5],["c",0.4,0.6,0.9,1.2,1.2,1.6],["z"],["m",-48.9,23.2],["c",5.3,-2.3,11.5,0.2,13.7,5.5],["c",2.3,5.3,-0.2,11.5,-5.5,13.7],["c",-5.3,2.2,-11.5,-0.2,-13.7,-5.5],["c",-2.3,-5.3,0.2,-11.4,5.5,-13.7],["z"]],"type":"template-path","width":132,"height":64,"fillRule":"evenodd","puzzleSpacing":0},{"top":-221,"fill":"#5ab18f","left":201,"path":[["m",795.8,139.2],["c",0.7,0.7,1.4,1.3,2,1.9],["c",1.1,1,2.1,1.7,2.8,1.8],["c",1.5,0.2,2.8,-0.5,4.6,-1.9],["c",1.5,-1.2,3,-1.8,2.5,-3.5],["c",-0.2,-0.6,-0.4,-1.3,-0.2,-1.5],["c",2.6,-2.4,2.3,-2.2,4.9,-4.8],["c",1.1,-1.1,1.2,-2.8,0.5,-4.7],["c",-3.3,-8.4,-7.4,-14.4,-13,-21.9],["c",-1.1,-1.5,-2.4,-0.8,-4.2,-1.8],["c",-1.8,-1,-1.9,-1.4,-1.1,-2],["c",0.6,-0.5,1.3,-1,1.9,-1.5],["c",0.2,-0.2,0.3,-0.5,0.1,-0.7],["c",-0.3,-0.5,-0.7,-1,-1,-1.5],["c",-0.2,-0.2,-0.5,-0.2,-0.8,-0.1],["c",-0.6,0.3,-1.3,0.7,-1.9,1],["c",-1.3,0.7,-1.9,0.9,-2.9,-0.1],["c",-4.7,-4.6,-10.9,-10.8,-14.8,-16.1],["c",-1.1,-1.6,-1.1,-1.1,0.4,-1.8],["c",0.5,-0.2,1,-0.4,1.4,-0.7],["c",1.5,-1.1,-0.5,-3.7,-1.9,-5.2],["c",3.6,0.9,10.6,3.3,15.5,5.7],["c",0.7,0.3,0.9,0.6,1.2,-0.2],["c",0.1,-0.3,0.2,-0.5,0.3,-0.8],["c",0.2,-0.6,-0.1,-0.8,-0.6,-1.1],["c",-7.4,-4.4,-15.4,-7.4,-22.6,-10.3],["c",-6.5,-7.1,-18.1,-20.5,-26.8,-26],["c",-2.7,-1.7,-5.2,-1.4,-7.3,-0.9],["c",-2.2,0.5,-2.9,0.4,-4.1,0.7],["c",-0.5,-0.6,-0.7,-0.4,-1.2,-0.3],["c",-0.5,0.1,-1.7,1.2,-2.2,1.6],["c",-0.7,0.6,-1.8,1.6,-2.5,2.2],["c",-1.4,1.4,-2.1,2.3,-2,3.6],["c",0,0.7,0.3,1.7,0.8,2.3],["l",1.9,2.5],["c",1.4,1.3,1.5,1.7,3.2,0],["c",0.5,-0.5,1,-1,1.6,-1.4],["c",5.8,-4.7,14.4,-3.8,19.1,2],["c",4.7,5.8,3.8,14.4,-2,19.1],["c",-1.1,0.9,-2.3,1.7,-3.5,2.3],["c",-2.1,1,-1.6,1,-0.5,2.6],["l",30.7,37.8],["c",1.3,1.1,2.5,1.6,4.1,-0.1],["c",0.7,-0.7,1.4,-1.3,2.2,-1.9],["c",5.8,-4.7,14.4,-3.8,19.1,2],["c",4.7,5.8,3.8,14.4,-2,19.1],["c",-0.6,0.5,-1.2,1,-1.8,1.5],["c",-1.5,1.3,-1.6,1.5,0.1,3.1],["z"],["M",747.1,55.6],["c",3.6,4.5,3,11.1,-1.5,14.7],["c",-4.5,3.6,-11.1,3,-14.7,-1.5],["c",-3.6,-4.5,-3,-11.1,1.5,-14.7],["c",4.5,-3.7,11.1,-3,14.7,1.5],["z"],["m",50.2,61.9],["c",3.6,4.5,3,11.1,-1.5,14.7],["c",-4.5,3.6,-11.1,3,-14.7,-1.5],["c",-3.6,-4.5,-3,-11.1,1.5,-14.7],["c",4.4,-3.7,11,-3,14.7,1.5],["z"]],"type":"template-path","width":90,"height":102,"fillRule":"evenodd","puzzleSpacing":0},{"top":115,"fill":"#fec925","left":285,"path":[["m",808.3,398.1],["c",2.3,2.4,2.2,1.7,3.6,-0.5],["c",0.4,-0.5,0.8,-1.1,1.2,-1.6],["c",4.5,-6,13,-7.3,19,-2.9],["c",6,4.5,7.3,13,2.9,19],["c",-0.6,0.8,-1.2,1.6,-1.9,2.3],["c",-2.1,2.4,-1.5,2.5,0.2,4.1],["l",44,32.5],["c",2.7,1.8,1.6,1.4,3.4,-1.4],["c",0.5,-0.8,1.1,-1.7,1.8,-2.5],["c",4.5,-6,13,-7.3,19,-2.9],["c",6,4.5,7.3,13,2.9,19],["c",-0.5,0.6,-0.9,1.2,-1.4,1.8],["c",-1.4,1.6,-0.9,1.8,0.2,3],["l",2.7,1.8],["c",1.5,1,3.2,1.1,4.6,0.1],["c",1.8,-1.4,2.6,-2.9,4,-4.7],["c",0.9,-1.1,1.3,-2.2,0.4,-2.9],["c",0.3,-1.2,0.6,-2.5,1,-4.7],["c",0.3,-2.1,0.1,-4.1,-1.9,-6.6],["c",-4.2,-5.3,-11.8,-13.3,-21.2,-23.1],["c",-3.3,-8.3,-6.9,-15.7,-12,-22.8],["c",-6.3,-8.6,-25.6,-20.7,-34.8,-25.7],["c",-1.9,-1,-1.6,-0.6,-3.6,-1.1],["c",-3.1,-0.8,-12.1,-1.7,-15.3,-1.9],["c",-2.7,-0.2,-4.2,0.9,-5.1,1.8],["c",-2.5,2.7,-7.5,7,-9.8,9.7],["c",-0.4,0.4,-1.5,-0.4,-1.8,0.1],["c",-1.4,1.8,-4.4,5.1,-4,7.2],["c",0.1,0.8,0.9,1.8,1.9,2.9],["z"],["m",49.9,5.8],["c",-0.9,1.6,-0.7,1.2,-2.4,-0.1],["c",-5.9,-4.5,-12.1,-10,-18,-14.7],["c",-0.5,-0.4,-0.7,-0.8,-0.6,-1.3],["c",0,-0.7,3.8,-1.6,4.3,-1.7],["c",1.4,-0.4,6.6,-1.6,8.2,-0.9],["c",4.5,1.9,8.9,5.3,13,8],["c",0.4,0.3,0.5,1.1,0.5,1.3],["c",-0.5,1.7,-1.6,3.4,-5,9.4],["z"],["m",21.3,18.7],["c",-0.1,0.3,-12.6,-10.3,-17.4,-14],["c",-1.2,-0.9,-1.3,-1.4,-0.6,-2.8],["c",1.5,-2.8,3.6,-7,4.6,-8.9],["c",0.3,-0.6,0.5,-0.9,1.1,-0.4],["c",3.7,2.9,8.4,6.4,11.1,10.2],["c",3.2,4.6,6.6,11.1,8.1,15.8],["c",-1.6,-1.3,-4.9,-3.6,-5.9,-2.1],["c",-0.6,0.9,-0.9,2,-1,2.2],["z"],["m",-49.2,-26.9],["c",4.7,3.4,5.6,10,2.2,14.6],["c",-3.4,4.7,-10,5.6,-14.6,2.2],["c",-4.6,-3.4,-5.6,-10,-2.2,-14.6],["c",3.4,-4.7,9.9,-5.7,14.6,-2.2],["z"],["m",69.4,51.2],["c",4.7,3.4,5.6,10,2.2,14.6],["c",-3.4,4.7,-10,5.6,-14.6,2.2],["c",-4.7,-3.4,-5.6,-10,-2.2,-14.6],["c",3.4,-4.7,10,-5.6,14.6,-2.2],["z"]],"type":"template-path","width":108,"height":94,"fillRule":"evenodd","puzzleSpacing":0},{"top":-143,"fill":"#fa1e44","left":50,"path":[["m",680.3,196.7],["c",1.9,0.9,4.1,2,5.8,2.7],["c",1.4,0.6,2.6,0.8,3.2,0.7],["c",2,-0.5,4.1,-4.4,5.3,-6.4],["c",0.3,-0.5,-0.9,-1.2,-0.7,-1.7],["c",1.6,-3.1,2.9,-5.9,4.4,-9.2],["c",0.6,-1.4,0.2,-3.1,-1.2,-4.6],["c",-4,-4.4,-14.9,-12.7,-20.3,-16.2],["l",-1.7,-1.1],["l",-1.5,-1.4],["c",-1.3,-0.5,-1,-0.6,-2,0.4],["c",-0.8,0.9,-2.2,1.9,-3.6,1.2],["c",-4.9,-2.6,-9.8,-5.4,-14.5,-7.9],["c",-0.5,-0.3,-0.9,-0.9,-0.6,-1.5],["l",1.3,-2.1],["c",0.1,-0.2,0.1,-0.5,-0.1,-0.7],["l",-1.5,-1.1],["c",-0.2,-0.2,-0.6,0,-0.7,0.2],["l",-1.4,1.6],["c",-1,1.1,-1.4,1.3,-2.6,0.7],["l",-20.4,-10.8],["c",-0.2,-0.1,1,-0.9,1.6,-1.8],["c",1,-1.5,-3.3,-4.4,-5.1,-5.3],["c",3.7,-0.5,11.1,-0.3,17.5,0.2],["c",0.7,0.1,1.1,0.2,1.1,-0.6],["v",-0.8],["c",0,-0.6,-0.4,-0.8,-1,-0.8],["c",-9.2,-0.8,-15.6,-1.4,-24.9,-1.4],["c",-8.8,-4,-19,-7.7,-28.6,-10.5],["c",-3.1,-0.9,-5,-0.4,-6.8,0.8],["c",-1.9,1.2,-3.3,2.6,-4.3,3.4],["c",-0.7,-0.3,-0.8,-0.1,-1.3,0.1],["c",-0.4,0.2,-1.2,1.7,-1.5,2.3],["c",-0.5,0.8,-1.1,2.1,-1.5,3],["c",-0.8,1.8,-1.1,2.9,-0.6,4],["c",0.3,0.7,0.9,1.3,1.6,1.8],["l",2.6,1.6],["c",1.9,0.8,2.1,1.1,3.2,-1.2],["c",0.3,-0.5,0.5,-1.1,0.9,-1.6],["c",3.8,-6.5,12.1,-8.7,18.6,-4.9],["c",6.5,3.8,8.7,12.1,4.9,18.6],["c",-0.5,0.9,-1.1,1.8,-1.7,2.6],["c",-2.3,2.8,-1.5,2.6,0.9,4],["l",49.6,29],["c",1.8,0.6,2.4,1,3.5,-1.5],["c",0.4,-0.9,0.9,-1.8,1.4,-2.7],["c",3.8,-6.5,12.1,-8.7,18.6,-4.9],["c",6.5,3.8,8.7,12.1,4.9,18.6],["c",-0.3,0.4,-0.5,0.9,-0.8,1.3],["c",-1.7,2.4,-1.9,3,0,3.9],["z"],["m",-6.1,-21],["c",5,2.9,6.7,9.3,3.7,14.3],["c",-2.9,5,-9.3,6.7,-14.3,3.7],["c",-5,-2.9,-6.7,-9.3,-3.7,-14.3],["c",3,-5,9.3,-6.6,14.3,-3.7],["z"],["m",-77.1,-45.1],["c",5,2.9,6.7,9.3,3.7,14.3],["c",-3,5,-9.3,6.7,-14.3,3.7],["c",-5,-2.9,-6.7,-9.3,-3.7,-14.3],["c",3,-5,9.3,-6.6,14.3,-3.7],["z"]],"type":"template-path","width":126,"height":82,"fillRule":"evenodd","puzzleSpacing":0},{"top":-26,"fill":"#fa1e44","left":262,"text":"Son!","type":"template-i-text","angle":11.221165,"width":329.91636939940645,"height":175.0260613966,"stroke":"white","originX":"center","fontSize":154.89031982,"textLines":[4],"fontFamily":"Baloo 2","paintFirst":"stroke","strokeWidth":10,"puzzleSpacing":0,"strokeLineCap":"round","textTransform":"uppercase","strokeLineJoin":"round"},{"top":-84,"fill":"#00b3eb","left":256,"text":"Birthday,","type":"template-i-text","angle":6.4249787,"width":316.6557237574565,"height":94.8372535691,"stroke":"white","originX":"center","fontSize":83.92677307,"textLines":[9],"fontFamily":"Baloo 2","paintFirst":"stroke","strokeWidth":10,"puzzleSpacing":0,"strokeLineCap":"round","strokeLineJoin":"round"},{"top":-150,"fill":"#00b3eb","left":298,"text":"Happy","type":"template-i-text","angle":14.61991,"width":228.3640839379128,"height":94.8369776909,"stroke":"white","originX":"center","fontSize":83.92652893,"textLines":[5],"fontFamily":"Baloo 2","paintFirst":"stroke","strokeWidth":10,"puzzleSpacing":0,"strokeLineCap":"round","strokeLineJoin":"round"}],"puzzleSpacing":0}],"contentOrigin":"top-left","clipPath":true,"puzzlePreset":"half-brick"}],
        xxx: {
            "type": "group",
            "width": 4575,
            "height": 2715,
            "scaleX": 0.19672131147540983,
            "scaleY": 0.19672131147540983,
            "objects": [
                Object.assign({},template,{
                    "scaleX": 4.39,
                    "scaleY": 4.9
                })
            ],
            "contentOrigin": "top-left",
            "clipPath": true,
            "puzzlePreset": "half-brick"
        },
        designGroup,
        designGroupNoTiling,
        printGroup,
        printGroupNoTiling,
        finalResultNoTiling: [
            printGroupNoTiling,
            {type: "line", stroke: "black", x1: 0, y1: 2714, y2: 2714, x2: 4575,strokeWidth: 1},
            Object.assign({},printGroupNoTiling,{angle: 90, left: 2715, top: 2716})
        ],
        finalResult: [
            printGroup,
            {type: "line", stroke: "black", x1: 0, y1: 2714, y2: 2714, x2: 4575,strokeWidth: 1},
            Object.assign({},printGroup,{angle: 90, left: 2715, top: 2716})
        ],
     warp: {
            subdivisions: 51,
            webgl: true,
            strokeWidth: 0,
            "type": "warp",
            "sourceCanvas": {
                "objects": [{
                    "type": "photo-image",
                    src: "m2.jpg",
                    "top": 0,
                    "left": 0,
                    "width": 500,
                    "height": 500
                }, {
                    "type": "i-text",
                    "top": 0,
                    "left": 0,
                    "fontFamily": "Bungee Shade",
                    "fontSize": 128,
                    "text": "Add Text Here"
                }],
                "width": 500,
                "height": 500
            },
            "top": 0,
            "left": 0,
            "width": 500,
            "height": 500,
            "points": [{"x": 0, "y": 0}, {"x": 500, "y": 0}, {"x": 500, "y": 500}, {"x": 0, "y": 500}],
            "transformations": [
                [{"x": 245, "y": 146, "t": 0.48, "c": 0}],
                [{"x": 428, "y": 242, "t": 0.5, "c": 1}],
                [{"x": 243, "y": 373, "t": 0.472, "c": 0}],
                [{"x": 68, "y": 254, "t": 0.504, "c": 1}]]
        },
        shirt: {
            src: "products/shirt.png",
            type: "image",
            width: 667,
            height: 1000
        },
        shirtInner: {
            src: "products/SHIRT_INNER.png",
            globalCompositeOperation: "multiply",
            filters: [{
                type: "BlendColor",
                mode: 'overlay',
                color: "#ffffff"
            }],
            type: "image",
            width: 667,
            height: 1000
        },
        shirtOuter: {
            src: "products/SHIRT_OUTER.png",
            globalCompositeOperation: "multiply",
            filters: [{
                type: "BlendColor",
                mode: 'overlay',
                color: "#d40029"
            }],
            type: "image",
            width: 667,
            height: 1000
        },
        metup: {
            src: "m2.jpg",
            type: "photo-image",
            width: 500,
            height: 750
        },
        itext: {
            text: "textures birthday2",
            type: "i-text",
            width: 500,
            height: 500
        },
        transparentRect: {
            type: "rect",
            width: 180,
            height: 180,
            top: 200,
            originX: "center",
            originY: "center",
            fill: "transparent",
            stroke: "black"
        },
        blackRect: {
            type: "rect",
            left: 100,
            width: 100,
            height: 100,
            top: 100,
            fill: "black"
        },
        template2: {
            contentOrigin: "center",
            type: "template",
            clipPath: true,
            left: 0,
            top: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            // puzzleSpacingX: 50,
            // puzzleSpacingY: 50,
            // puzzlePreset: "half-drop",
            width: 1000,
            height: 500,
            objects: [
                {
                    type: "rect",
                    evented: false,
                    left: -500,
                    top: -250,
                    fill: "transparent",
                    width: 1000,
                    height: 500,
                    strokeWidth: 1,
                    stroke: "red"
                },
                {
                    type: "rect",
                    left: 0,
                    width: 250,
                    height: 250,
                    angle: 4,
                    top: 0,
                    fill: "transparent",
                    stroke: "black"
                },
                // {
                //     scaleX: 0.5,
                //     scaleY: 0.5,
                //     angle: 4,
                //     src: "photos/m2.jpg",
                //     type: "image",
                //     left: -500,
                //     top: -250,
                //     width: 500,
                //     height: 500
                // },
                {
                    type: "template-i-text",
                    hasControls: true,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: false,
                    lockScalingY: false,
                    lockRotation: false,
                    clipPath: true,
                    originX: "center",
                    left: 100,
                    top: -16.9,
                    width: 291.19,
                    height: 175.03,
                    fill: "#fa1e44",
                    stroke: "white",
                    strokeWidth: 10,
                    strokeLineCap: "round",
                    strokeLineJoin: "round",
                    paintFirst: "stroke",
                    text: "Son!",
                    fontSize: 150,
                },
                {
                    type: "template-i-text",
                    hasControls: true,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: false,
                    lockScalingY: false,
                    lockRotation: false,
                    originX: "center",
                    left: 259.42,
                    top: -16.9,
                    width: 291.19,
                    height: 175.03,
                    fill: "#fa1e44",
                    stroke: "white",
                    strokeWidth: 10,
                    strokeLineCap: "round",
                    strokeLineJoin: "round",
                    angle: 11.22,
                    paintFirst: "stroke",
                    text: "Son!",
                    fontSize: 150,
                }
            ]
        },
    },
    prototypes: {
        Template: {
            clipPath: true
        },
        Canvas: {
            useBufferRendering: true,
            minDpi: 200,
            preserveObjectStackingSelection: true,
            outerCanvasOpacity: 0,
            containerClass: "canvas-container bg-white shadow",
            minZoom: 1,
            stretchable: true,
            stretchingOptions: {
                action: "zoom",
                margin: 20
            },
            snappingToArea: true,
            snappingToObjects: true,
            snappingToGrid: false,
            snapping: true,
            backgroundColor: "transparent",
            handModeEnabled: false,
            interactiveMode: 'mixed',
        },
        MockupImage: {
            evented: false,
            selectable: false,
            stored: false,
            prototype: "image",
            // thumbnailSourceRoot: "media-thumbnails/",
            sourceRoot: "products/",
        },
        Object: {
            strokeWidth: 0,
            roundCoordinates: true,
            eventListeners: {
                "rotated"() {
                    this.canvas.setTooltip(false)
                },
                "rotating"() {
                    this.canvas.setTooltip(Math.round(this.angle) + "°")
                }
            },
            cornerStyle: "canva",
            cornerShadow: {color: "#000000", blur: 3, offsetX: 0, offsetY: 0},
            resizableEdge: true,
            snapAngle: 45,
            snapThreshold: 5,
            cornerColor: "#fff",
            minDpi: 200,
            dpiWarningClass: null,
            mouseWheelScale: true,
            borderColor: '#00d9e1',
            rotationPointBorder: false,
            rotatingPointOffset: 30,
            activeOptions: {
                inactiveBorder: true
            },
            inactiveOptions: {
                inactiveBorder: false
            },
            activeHoverOptions: {
                inactiveBorder: true
            },
            inactiveHoverOptions: {
                inactiveBorder: true
            }
        },
        ActiveSelection: {
            borderDashArray: [5, 5]
        },
        Image: {
            resizable: true,
            fitting: "cover",
            clipPathFitting: "fit",
            // sourceRoot: fabric.mediaRoot + "photos/"
            sourceRoot: "/fiera/media/photos/"
            // thumbnailSourceRoot: fabric.mediaRoot + "media-thumbnails/",
        },
        // PhotoImage: {
        //     sourceRoot: fabric.mediaRoot + "photos/"
        // },
        IText: {
            lockOnEdit: false,
            lockScalingFlip: true,
            // fontFamily: "Leckerli One"
        },
        Warp: {

            eventListeners: {
                "mousedblclick": "switchEditMode"
            },
            // perPixelTargetFind: false,
            // locked: false,
            // hasRotatingPoint: true,
            // hasBoundControls: true,
            // hasTransformControls: false,
            hasBorders: true,
            hasShapeBorders: true,
            subdivisions: 40,
            sticker: false,
            stickerOptions: {
                fill: "white",
                strokeWidth: 0,
                shadow: {"offsetX": 0, "offsetY": 0, "blur": 3, "color": "rgba(0,0,0,0.80)"}
            }
        }
    },
    slide: {
        minZoom: 0.1,
        objects: []
    },
    tools: [
        {
            caption: 'Text Align',
            type: 'options',
            change: (value) => App.target.setTextAlign(value),
            value: () => App.target?.textAlign,
            enabled: () => App.target?.isText,
            options: [
                {value: "left", class: "fa fa-align-left"},
                {value: "center", class: "fa fa-align-center"},
                {value: "right", class: "fa fa-align-right"},
                {value: "justify", class: "fa fa-align-justify"}
            ],
            observe: App.targetChangeObserver
        },
        {
            caption: 'Tiles',
            type: 'options',
            change: (value) => App.target.setPuzzlePreset(value),
            value: () => App.target?.puzzlePreset || "none",
            enabled: () => App.target,
            observe: App.targetChangeObserver,
            options: [
                {value: "halfDrop", svg: App.icons.halfDrop},
                {value: "halfBrick", svg: App.icons.halfBrick},
                {value: "basic", svg: App.icons.basic},
                {value: "none", svg: App.icons.none}
            ]
        },
        {
            caption: 'Elements',
            type: 'group',
            tools: [
                {
                    type: 'dropdown',
                    placeholder: "Add Element",
                    options: App.elementsList,
                    change: App.createObject
                },
                {
                    label: 'Clear',
                    type: 'button',
                    click: App.clearCanvas
                },
                {
                    type: 'button',
                    label: 'Import',
                    click: ()=>{
                        uploadDialog({
                            multiple: false,
                            accept: "image/svg+xml",
                            onRead: (image,file) => {
                                readFileAsText(file).then(text => {
                                    App.canvas.loadFromSvg(text)




                                    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
                                        canvas: canvas,
                                    });sel.scaleX = 0.5; sel.scaleY = 0.5;
                                    canvas.setActiveObject(sel);
                                    canvas.requestRenderAll();
                                    canvas.discardActiveObject()


                                    App.canvas.setViewportTransform([0.5, 0, 0, 0.5, 10, 10] )
                                })
                            }
                        })
                    }
                }
            ]
        },
        {
            caption: 'Render',
            type: 'group',
            tools: [
                {
                    label: 'SVG',
                    type: 'button',
                    click: App.renderSVG
                },
                {
                    label: 'PDF',
                    type: 'button',
                    click: App.renderPDF
                },
                {
                    label: 'PNG',
                    type: 'button',
                    click: App.renderPNG
                }
            ]
        },
        {
            caption: 'History',
            type: 'group',
            tools: [
                {
                    label: 'Undo',
                    type: 'button',
                    // enabled: () => App.editor.canUndo(),
                    click: () => App.editor.undo()
                },
                {
                    label: 'Redo',
                    type: 'button',
                    // enabled: () => App.editor.canRedo(),
                    click: () => App.editor.redo()
                }
            ]
        }
    ]
})
