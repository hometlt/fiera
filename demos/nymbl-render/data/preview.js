import pattern from "./pattern.js";

export default {
    width: 1000,
    height: 1000,
    objects: [
        {
            id: "shadow-new",
            type: "mockup-image",
            width: 1000,
            height: 1000,
            src: "products/wrapping-shadow.png"
        },
        {
            id: "mockup",
            type: "mockup-image",
            src: "products/wrapping-product.png",
            width: 1000,
            height: 1000
        },
        {
            type: "warp",
            left: 248.49246993345542,
            top: -314.2189008002137,
            width: 1056.3787959582514,
            height: 975.165718996342,
            points: [
                {x: 104.4169018401069, y: 44.714669372534445},
                {x: 1055.3787959582514, y: 0},
                {x: 935.9208279925892, y: 974.165718996342},
                {x: 0, y: 923.3829987010564}],
            transformations: [
                [],
                [
                    {x: 1023.4470953472512, y: 49.160457061891634, t: 0.06860336411315579, c: 1},
                    {x: 1024.124677234154, y: 136.07189487947926, t: 0.1466127298115726, c: 0},
                    {x: 1028.60716621114, y: 193.31112084343397, t: 0.20172627422979197, c: 0},
                    {x: 1042.8584908984449, y: 282.1824542782217, t: 0.28150030451309405, c: 1},
                    {x: 1038.9081728036356, y: 383.0345381145381, t: 0.3999099537914549, c: 0},
                    {x: 1024.1923237108992, y: 499.16803013329593, t: 0.5162849326032871, c: 0}
                ],
                [],
                [
                    {x: 76.78986472931257, y: 101.8183119540119, t: 0.07777111730824364, c: 1},
                    {x: 78.13225014103205, y: 191.51979662731628, t: 0.17365060335166402, c: 0},
                    {x: 81.1349380297844, y: 307.03915985179145, t: 0.3065020021664291, c: 0}
                ]
            ],
            angle: 55.01971610724455,
            strokeWidth: 0,
            opacity: 1,
            src: "products/your-design-here.png",
            sourceCanvas: pattern,
            // sourceCanvas: {
            //     objects: [{
            //         type: "mockup-image",
            //         src: "products/your-design-here.png",
            //         top: 0,
            //         left: -894,
            //         width: 6363,
            //         height: 4575
            //     }, {
            //         type: "i-text",
            //         top: 2040.2140406128601,
            //         left: 227.6438880135238,
            //         width: 1212.1600390625001,
            //         height: 144.64,
            //         scaleX: 3.3958522299799476,
            //         scaleY: 3.3958522299799476,
            //         fontFamily: "Bungee Shade",
            //         fontSize: 128,
            //         text: "Add Text Here"
            //     }],
            //     width: 4575,
            //     height: 4575
            // },
            clipPath: {
                id: "mask-new",
                type: "mockup-image",
                absolutePositioned: true,
                width: 1000, height: 1000,
                src: "products/wrapping-mask.png"
            }
        },
        {
            id: "white",
            type: "mockup-image",
            width: 1000,
            height: 1000,
            src: "products/wrapping-dark.png",
            opacity: 1,
            globalCompositeOperation: "screen",
        },
        {
            id: "dark",
            type: "mockup-image",
            width: 1000,
            height: 1000,
            src: "products/wrapping-light.png",
            opacity: 1,
            globalCompositeOperation: "multiply"
        }
    ]
}