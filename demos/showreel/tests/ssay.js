



import {TestApp} from '../showreel.js'
import {
    Frames,
    Deco,
    Fonts,
    Areas,
    Undo,
    Grid,
    Sticker,
    Puzzle,
    ClipPath,
    Placeholders,
    ImageCrop,
    Snap,
    TextEasyEdit,
    WheelScale,
    Alignment,
    Zoom,
    Controls,
    // Warp,
    SourceCanvas,
    Relative,
    Order,
    ImageDpi,
    Stretchable,
    Droppable,
    Templates,
    Barcode,
    BackgroundOverlayImages,
    Animation,
    ObjectRender,
    TextboxTweaks,
    Debug
} from '../../src/modules.js'


let test1 = {
    prototypes: {
        "StaticCanvas": {
            "width": 500,
            "height": 661,
            "backgroundColor": "#FFFFFF",
            "backgroundPosition": "fill",
            "overlayPosition": "fill"
        },
        "Canvas": {
        },
        "Object": {},
        "Image": {
            "sourceRoot": "https://images.simplysay.sg/s3fs-public/site_images/",
            "layer": "objects"
        },
        "Line": {
            "strokeWidth": 1,
            "stroke": "black"
        },
        "BackgroundImage": {
            "width": 500,
            "height": 661,
            "fitting": "fill",
            "sourceRoot": "https://images.simplysay.sg/fit-in/661x661/backgrounds/"
        },
        "OverlayImage": {
            "width": 500,
            "height": 661,
            "fitting": "fill",
            "sourceRoot": "https://images.simplysay.sg/fit-in/661x661/overlays/"
        },
        "Emoji": {
            "prototype": "Image",
            "layer": "overlayObjects",
            "sourceRoot": "https://images.simplysay.sg/fit-in/661x661/emoji/"
        },
        "Clipart": {
            "prototype": "Image",
            "layer": "overlayObjects",
            "sourceRoot": "https://images.simplysay.sg/fit-in/661x661/objects/"
        },
        "PhotoImage": {
            "units": "percents",
            "prototype": "Image",
            "fitting": "cover",
            "sourceRoot": "https://images.simplysay.sg/fit-in/661x661/photo/"
        },
        "ImageBorder": {
            "sourceRoot": "https://images.simplysay.sg/fit-in/500x500/frames/",
            "units": "mixed"
        },
        "Textbox": {
            "emojisPath": "emoji-thumbnails/*.png",
            "layer": "overlayObjects",
            "fixedWidth": true,
            "width": 300,
            "borderColor": "#3DAFF6",
            "fontFamily": "Open Sans",
            "fontSize": 24,
            "textAlign": "center"
        },
        "StaticTextbox": {
            "prototype": "Textbox",
            "emojisPath": "emoji-thumbnails/*.png",
            "textVerticalAlign": "middle",
            "autoHeight": false,
            "text": ""
        }
    },
    frames: [
        {
            "id": "frame-1",
            "deco": "Frame-1.png",
            "clipPath": {
                "offsets" :  [19, 24, 19, 24]
            }
        },
        {
            "id": "frame-10",
            "deco": "Frame-10.png",
            "clipPath": {
                "points": [25,20,74,16,74,16,70,87,70,87,28,84,28,84]
            }
        },
        {
            "id": "frame-11",
            "deco": "Frame-11.png",
            "clipPath": {
                "points": [19,20,84,22,84,22,79,80,79,80,23,81,23,81]
            }
        },
        {
            "id": "frame-12",
            "deco": "Frame-12.png",
            "clipPath": {
                "offsets" :  [17,25,10,25]
            }
        },
        {
            "id": "frame-13",
            "deco": "Frame-13.png",
            "clipPath": {
                "offsets" :  [16,25,16,25]
            }
        },
        {
            "id": "frame-14",
            "deco": "Frame-14.png",
            "clipPath": {
                "points": [22,16,77,13,77,13,79,83,79,83,23,86,23,86]
            }
        },
        {
            "id": "frame-15",
            "deco": "Frame-15.png",
            "clipPath": {
                "offsets" :  [11, 6, 7, 6],
                "radius": 50
            }
        },
        {
            "id": "frame-16",
            "deco": "Frame-16.png",
            "clipPath": {
                "offsets" :  [18,15,18,15],
                "radius": 50
            }
        },
        {
            "id": "frame-17",
            "deco": "Frame-17.png",
            "clipPath": {
                "offsets" :  25
            }
        },
        {
            "id": "frame-18",
            "deco": "Frame-18.png",
            "clipPath": {
                "points": [50,15,85,50,50,85,15,50]
            }
        },
        {
            "id": "frame-19",
            "deco": "Frame-19.png",
            "clipPath": {
                "points": [49,28,59,21,68,19,83,23,90,30,93,39,91,50,84,62,74,73,59,84,50,90,21,69,7,50,7,38,10,28,22,21,39,20,47,25,50,29]
            }
        },
        {
            "id": "frame-20",
            "deco": "Frame-20.png",
            "clipPath": {
                "offsets" :  13,
                "radius": 50
            }
        },
        {
            "id": "frame-21",
            "deco": "Frame-21.png",
            "clipPath": {
                "offsets" :  18,
                "radius": 50
            }
        },
        {
            "id": "frame-22",
            "deco": "Frame-22.png",
            "clipPath": {
                "offsets" :  11,
                "radius": 50
            }
        },
        {
            "id": "frame-2",
            "deco": "Frame-2.png",
            "clipPath": {
                "offsets" :  10
            }
        },
        {
            "id": "frame-3",
            "deco": "Frame-3.png",
            "clipPath": {
                "offsets" :  [35,15,15,15]
            }
        },
        {
            "id": "frame-4",
            "deco": "Frame-4.png",
            "clipPath": {
                "offsets" :  [9,17,9,17]
            }
        },
        {
            "id": "frame-5",
            "deco": "Frame-5.png",
            "clipPath": {
                "points": [18,29,75,22,84,82,24,88]
            }
        },
        {
            "id": "frame-6",
            "deco": "Frame-6.png",
            "clipPath": {
                "offsets" :  [19,25,16,25]
            }
        },
        {
            "id": "frame-7",
            "deco": "Frame-7.png",
            "clipPath": {
                "points": [80,31,80,78,24,77,18,28]
            }
        },
        {
            "id": "frame-8",
            "deco": "Frame-8.png",
            "clipPath": {
                "points": [9,31,70,9,92,69,29,90]
            }
        },
        {
            "id": "frame-9",
            "deco": "Frame-9.png",
            "clipPath": {
                "points": [20,26,77,18,85,73,29,81]
            }
        },
        {
            "id": "polaroid-1",
            "deco": "Polaroid-1.png",
            "clipPath": {
                "offsets": 20
            }
        },
        {
            "id": "polaroid-2",
            "deco": "Polaroid-2.png",
            "clipPath": {
                "points": [22,20,84,30,77,86,14,77]
            }
        },
        {
            "id": "polaroid-3",
            "deco": "Polaroid-3.png",
            "clipPath": {
                "points": [14,31,73,16,88,76,28,89]
            }
        },
        {
            "id": "polaroid-4",
            "deco": "Polaroid-4.png",
            "clipPath": {
                "points": [20,17,86,25,79,85,12,77]
            }
        },
        {
            "id": "polaroid-5",
            "deco": "Polaroid-5.png",
            "clipPath": {
                "points": [21,18,87,22,83,86,17,83]
            }
        },
        {
            "id": "polaroid-6",
            "deco": "Polaroid-6.png",
            "clipPath": {
                "points": [31,14,88,34,69,91,11,71]
            }
        },
        {
            "id": "polaroid-7",
            "deco": "Polaroid-7.png",
            "clipPath": {
                "points": [13,31,71,14,90,72,31,90]
            }
        }
    ],
    slides: [
        {
            "width": 1185,
            "height": 856,
            "objects": [
                {
                    type: "rect",
                    "left": 14,
                    "top": 14,
                    "scaleX": 1.1527237354085602,
                    "scaleY": 1.2423802612481858,
                    "width": 1000,
                    "height": 661,
                    fill: "#ffffff"
                },
                {
                    "type": "group",
                    "left": 14,
                    "top": 14,
                    "scaleX": 1.1527237354085602,
                    "scaleY": 1.2423802612481858,
                    "clipPath": true,
                    "width": 500,
                    "height": 661,
                    "objects": [
                        {
                            "id": "order-token",
                            "type": "barcode",
                            "text": "https://personalize.nymblsites.com/assets/logo2.png",
                            "left": 425,
                            "top": 585,
                            "width": 50,
                            "height": 50,
                            "scaleX": 1,
                            "scaleY": 1
                        },
                        {
                            "type": "image",
                            "src": "./default.jpg",
                            "top": 158,
                            "left": 110,
                            "width": 280,
                            "height": 87.5
                        },
                        {
                            "type": "image",
                            "src": "recycle.png",
                            "top": 462.18,
                            "left": 222,
                            "width": 53,
                            "height": 51
                        },
                        {
                            "type": "text",
                            "top": 518,
                            "left": 160,
                            "width": 180,
                            "height": 15.82,
                            "strokeWidth": 0,
                            "fontSize": 14,
                            "text": "This card is 100% recyclable."
                        },
                        {
                            "type": "text",
                            "top": 541,
                            "left": 188,
                            "width": 129.11,
                            "height": 15.82,
                            "strokeWidth": 0,
                            "fontSize": 14,
                            "text": "Made in Singapore."
                        },
                        {
                            "type": "text",
                            "top": 600,
                            "left": 27,
                            "width": 234.27,
                            "height": 15.82,
                            "strokeWidth": 0,
                            "fontSize": 14,
                            "text": "©SimplySay 2020\nall rights reserved"
                        },
                        {
                            "type": "text",
                            "top": 259,
                            "left": 181.5,
                            "width": 147,
                            "height": 20.34,
                            "strokeWidth": 0,
                            "fill": "rgb(153, 153, 153)",
                            "fontSize": 18,
                            "text": "www.simplysay.sg"
                        }
                    ]
                },
                {
                    "type": "group",
                    "left": 514,
                    "top": 14,
                    "scaleX": 1.1527237354085602,
                    "scaleY": 1.2423802612481858,
                    "clipPath": true,
                    "width": 500,
                    "height": 661,
                    "objects": [
                        {
                            "type": "photo-image",
                            "src": "https://cdn.simplysay.sg/user_uploaded_images/0/5f0c378245255.jpg",
                            "top": 111,
                            "left": 111,
                            "width": 359,
                            "height": 307,
                            "angle": 351.63,
                            "crop": {
                                "left": -0.11,
                                "top": 0.16,
                                "scaleX": 0.79,
                                "scaleY": 1.23
                            }
                        },
                        {
                            "src": "https://cdn.simplysay.sg/user_uploaded_images/0/5f0c378245255.jpg",
                            "crop": {
                                "top": -5.286495008730412,
                                "left": 2.7643259330582737,
                                "skewX": 3.901947449500756e-15,
                                "scaleX": 0.4514199304862717,
                                "scaleY": 0.45480018325585464,
                                "angle": -45.82509144797879
                            },
                            "top": 111,
                            "left": 111,
                            "width": 400,
                            "height": 400,
                            "type": "photo-image",
                            "frame": {
                                "id": "frame-18",
                                "deco": "Frame-18.png",
                                "clipPath": {
                                    "points": [
                                        50,
                                        15,
                                        85,
                                        50,
                                        50,
                                        85,
                                        15,
                                        50
                                    ]
                                }
                            }
                        },
                        {
                            "type": "textbox",
                            "top": 411,
                            "left": 139.26,
                            "width": 407.6,
                            "height": 93.79,
                            "scaleX": 0.63,
                            "scaleY": 0.62,
                            "angle": 351.7,
                            "fontFamily": "Kaushan Script",
                            "fontSize": 25,
                            "text": "❤️❤I may not be the best, but I promise I will love you with all my heart❤️❤"
                        },
                        {
                            "id": "textA",
                            "type": "textbox",
                            "top": 0,
                            "left": 0,
                            "fontFamily": "Kaushan Script",
                            "fontSize": 25,
                            "text": "TextA",
                            "fontWeight": "bold",
                            "color": "red"
                        },
                        {
                            "id": "textB",
                            "type": "textbox",
                            "top": 30,
                            "left": 0,
                            "fontFamily": "Kaushan Script",
                            "fontSize": 25,
                            "text": "textB",
                            "fontWeight": "bold",
                            "color": "green"
                        },
                        {
                            "id": "textC",
                            "type": "textbox",
                            "top": 60,
                            "left": 0,
                            "fontFamily": "Kaushan Script",
                            "fontSize": 25,
                            "text": "textC",
                            "fontWeight": "bold",
                            "color": "blue"
                        },
                        {
                            "id": "textD",
                            "type": "textbox",
                            "top": 90,
                            "left": 0,
                            "fontFamily": "Kaushan Script",
                            "fontSize": 25,
                            "text": "textD",
                            "fontWeight": "bold",
                            "color": "yellow"
                        }
                    ]
                },
                {
                    "left": 0,
                    "top": 0,
                    "type": "group",
                    "width": 1185,
                    "height": 856,
                    "objects": [
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 0,
                            "x2": 32,
                            "y2": 16
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 32,
                            "x2": 16,
                            "y2": 32
                        },
                        {
                            "type": "line",
                            "x1": 1185 - 32,
                            "y1": 0,
                            "x2": 1185 - 32,
                            "y2": 16
                        },
                        {
                            "type": "line",
                            "x1": 1185 - 16,
                            "y1": 32,
                            "x2": 1185,
                            "y2": 32
                        },
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 856,
                            "x2": 32,
                            "y2": 856 - 16
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 856 - 32,
                            "x2": 16,
                            "y2": 856 - 32
                        },
                        {
                            "type": "line",
                            "x1": 1185 - 32,
                            "y1": 856,
                            "x2": 1185 - 32,
                            "y2": 856 - 16
                        },
                        {
                            "type": "line",
                            "x1": 1185,
                            "y1": 856 - 32,
                            "x2": 1185 - 16,
                            "y2": 856 -32
                        }
                    ]
                }
            ]
        },
        {
            "width": 1185,
            "height": 856,
            "objects": [
                {
                    "type": "group",
                    "left": 14,
                    "top": 14,
                    "scaleX": 1.1527237354085602,
                    "scaleY": 1.2423802612481858,
                    "clipPath": true,
                    "width": 500,
                    "height": 661,
                    "objects": [
                        {
                            "type": "static-textbox",
                            "fontFamily": "Kaushan Script",
                            "fontSize": "22",
                            "text": "So this is Christmas and what have you done\nAnother year over, a new one just begun\nAnd so this is Christmas, I hope you have fun\nThe near and the dear ones, the old and the young\nA very merry Christmas and a happy new year\nLet's hope it's a good one without any fears\nAnd so this is Christmas for weak and for strong\nThe rich and the poor ones, the road is so long\nAnd so happy Christmas for black and for white\nFor yellow and red ones let's stop all the fights\nA very merry Christmas and a happy new year\nLet's hope it's a good one without any fear\nAnd so this is Christmas and what have we done\nAnother year over, a new one just begun\nAnd so happy Christmas we hope you have fun\nThe near and the dear ones, the old and the young",
                            "textAlign": "left",
                            "width": 500
                        }
                    ]
                },
                {
                    "type": "group",
                    "left": 514,
                    "top": 14,
                    "scaleX": 1.1527237354085602,
                    "scaleY": 1.2423802612481858,
                    "clipPath": true,
                    "width": 500,
                    "height": 661,
                    "objects": [
                        {
                            "type": "static-textbox",
                            "top": 37,
                            "left": 30,
                            "width": 440,
                            "height": 82.54,
                            "text": "Marry Christmas \nand \nHappy new Year ! ❤️❤️❤️❤️❤️😊😊😊😊😊",
                            "styles": {
                                "0": {
                                    "0": {
                                        "fill": "#00ff00"
                                    },
                                    "1": {
                                        "fill": "#00ff00"
                                    },
                                    "2": {
                                        "fill": "#00ff00"
                                    },
                                    "3": {
                                        "fill": "#00ff00"
                                    },
                                    "4": {
                                        "fill": "#00ff00"
                                    },
                                    "5": {
                                        "fill": "#00ff00"
                                    },
                                    "6": {
                                        "fill": "#00ff00"
                                    },
                                    "7": {
                                        "fill": "#00ff00"
                                    },
                                    "8": {
                                        "fill": "#00ff00"
                                    },
                                    "9": {
                                        "fill": "#00ff00"
                                    },
                                    "10": {
                                        "fill": "#00ff00"
                                    },
                                    "11": {
                                        "fill": "#00ff00"
                                    },
                                    "12": {
                                        "fill": "#00ff00"
                                    },
                                    "13": {
                                        "fill": "#00ff00"
                                    },
                                    "14": {
                                        "fill": "#00ff00"
                                    },
                                    "15": {
                                        "fill": "#00ff00"
                                    }
                                },
                                "2": {
                                    "0": {
                                        "fill": "#00ffff"
                                    },
                                    "1": {
                                        "fill": "#00ffff"
                                    },
                                    "2": {
                                        "fill": "#00ffff"
                                    },
                                    "3": {
                                        "fill": "#00ffff"
                                    },
                                    "4": {
                                        "fill": "#00ffff"
                                    },
                                    "5": {
                                        "fill": "#00ffff"
                                    },
                                    "6": {
                                        "fill": "#00ffff"
                                    },
                                    "7": {
                                        "fill": "#00ffff"
                                    },
                                    "8": {
                                        "fill": "#00ffff"
                                    },
                                    "9": {
                                        "fill": "#00ffff"
                                    },
                                    "10": {
                                        "fill": "#00ffff"
                                    },
                                    "11": {
                                        "fill": "#00ffff"
                                    },
                                    "12": {
                                        "fill": "#00ffff"
                                    },
                                    "13": {
                                        "fill": "#00ffff"
                                    }
                                }
                            },
                            "maxHeight": 145
                        },
                        {
                            "type": "static-textbox",
                            "top": 222,
                            "left": 30,
                            "width": 440,
                            "height": 24.86,
                            "maxHeight": 225
                        },
                        {
                            "type": "static-textbox",
                            "top": 490,
                            "left": 30,
                            "width": 440,
                            "height": 24.86,
                            "maxHeight": 145
                        }
                    ]
                },
                {
                    "type": "group",
                    "scaleX": 1.1527237354085602,
                    "scaleY": 1.2423802612481858,
                    "objects": [
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 0,
                            "x2": 32,
                            "y2": 17,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 31,
                            "x2": 17,
                            "y2": 32,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 996,
                            "y1": 0,
                            "x2": 996,
                            "y2": 17,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 1028,
                            "y1": 31,
                            "x2": 1011,
                            "y2": 32,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 689,
                            "x2": 32,
                            "y2": 672,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 657,
                            "x2": 17,
                            "y2": 657,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 996,
                            "y1": 0,
                            "x2": 996,
                            "y2": 17,
                            "stroke": "#000"
                        },
                        {
                            "type": "line",
                            "x1": 1028,
                            "y1": 32,
                            "x2": 1011,
                            "y2": 0,
                            "stroke": "#000"
                        }
                    ]
                }
            ]
        }
    ]
}

let test2 =  {
    "frames": [
        {
            "id": "frame-1",
            "deco": "Frame-1.png",
            "clipPath": {
                "offsets": [
                    19,
                    24,
                    19,
                    24
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-10",
            "deco": "Frame-10.png",
            "clipPath": {
                "points": [
                    25,
                    20,
                    74,
                    16,
                    74,
                    16,
                    70,
                    87,
                    70,
                    87,
                    28,
                    84,
                    28,
                    84
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-11",
            "deco": "Frame-11.png",
            "clipPath": {
                "points": [
                    19,
                    20,
                    84,
                    22,
                    84,
                    22,
                    79,
                    80,
                    79,
                    80,
                    23,
                    81,
                    23,
                    81
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-12",
            "deco": "Frame-12.png",
            "clipPath": {
                "offsets": [
                    17,
                    25,
                    10,
                    25
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-13",
            "deco": "Frame-13.png",
            "clipPath": {
                "offsets": [
                    16,
                    25,
                    16,
                    25
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-14",
            "deco": "Frame-14.png",
            "clipPath": {
                "points": [
                    22,
                    16,
                    77,
                    13,
                    77,
                    13,
                    79,
                    83,
                    79,
                    83,
                    23,
                    86,
                    23,
                    86
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-15",
            "deco": "Frame-15.png",
            "clipPath": {
                "offsets": [
                    11,
                    6,
                    7,
                    6
                ],
                "radius": 50
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-16",
            "deco": "Frame-16.png",
            "clipPath": {
                "offsets": [
                    18,
                    15,
                    18,
                    15
                ],
                "radius": 50
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-17",
            "deco": "Frame-17.png",
            "clipPath": {
                "offsets": 25
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-18",
            "deco": "Frame-18.png",
            "clipPath": {
                "points": [
                    50,
                    15,
                    85,
                    50,
                    50,
                    85,
                    15,
                    50
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-19",
            "deco": "Frame-19.png",
            "clipPath": {
                "points": [
                    49,
                    28,
                    59,
                    21,
                    68,
                    19,
                    83,
                    23,
                    90,
                    30,
                    93,
                    39,
                    91,
                    50,
                    84,
                    62,
                    74,
                    73,
                    59,
                    84,
                    50,
                    90,
                    21,
                    69,
                    7,
                    50,
                    7,
                    38,
                    10,
                    28,
                    22,
                    21,
                    39,
                    20,
                    47,
                    25,
                    50,
                    29
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-20",
            "deco": "Frame-20.png",
            "clipPath": {
                "offsets": 13,
                "radius": 50
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-21",
            "deco": "Frame-21.png",
            "clipPath": {
                "offsets": 18,
                "radius": 50
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-22",
            "deco": "Frame-22.png",
            "clipPath": {
                "offsets": 11,
                "radius": 50
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-2",
            "deco": "Frame-2.png",
            "clipPath": {
                "offsets": 10
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-3",
            "deco": "Frame-3.png",
            "clipPath": {
                "offsets": [
                    35,
                    15,
                    15,
                    15
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-4",
            "deco": "Frame-4.png",
            "clipPath": {
                "offsets": [
                    9,
                    17,
                    9,
                    17
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-5",
            "deco": "Frame-5.png",
            "clipPath": {
                "points": [
                    18,
                    29,
                    75,
                    22,
                    84,
                    82,
                    24,
                    88
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-6",
            "deco": "Frame-6.png",
            "clipPath": {
                "offsets": [
                    19,
                    25,
                    16,
                    25
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-7",
            "deco": "Frame-7.png",
            "clipPath": {
                "points": [
                    80,
                    31,
                    80,
                    78,
                    24,
                    77,
                    18,
                    28
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-8",
            "deco": "Frame-8.png",
            "clipPath": {
                "points": [
                    9,
                    31,
                    70,
                    9,
                    92,
                    69,
                    29,
                    90
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "frame-9",
            "deco": "Frame-9.png",
            "clipPath": {
                "points": [
                    20,
                    26,
                    77,
                    18,
                    85,
                    73,
                    29,
                    81
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-1",
            "deco": "Polaroid-1.png",
            "clipPath": {
                "offsets": 20
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-2",
            "deco": "Polaroid-2.png",
            "clipPath": {
                "points": [
                    22,
                    20,
                    84,
                    30,
                    77,
                    86,
                    14,
                    77
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-3",
            "deco": "Polaroid-3.png",
            "clipPath": {
                "points": [
                    14,
                    31,
                    73,
                    16,
                    88,
                    76,
                    28,
                    89
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-4",
            "deco": "Polaroid-4.png",
            "clipPath": {
                "points": [
                    20,
                    17,
                    86,
                    25,
                    79,
                    85,
                    12,
                    77
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-5",
            "deco": "Polaroid-5.png",
            "clipPath": {
                "points": [
                    21,
                    18,
                    87,
                    22,
                    83,
                    86,
                    17,
                    83
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-6",
            "deco": "Polaroid-6.png",
            "clipPath": {
                "points": [
                    31,
                    14,
                    88,
                    34,
                    69,
                    91,
                    11,
                    71
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        },
        {
            "id": "polaroid-7",
            "deco": "Polaroid-7.png",
            "clipPath": {
                "points": [
                    13,
                    31,
                    71,
                    14,
                    90,
                    72,
                    31,
                    90
                ]
            },
            "frame": false,
            "shape": false,
            "type": "photo",
            "role": "frame"
        }
    ],
    "prototypes": {
        "StaticCanvas": {
            "width": 642,
            "height": 889,
            "backgroundColor": "#FFFFFF",
            "backgroundPosition": "fill",
            "overlayPosition": "fill"
        },
        "Canvas": {
            "width": 642,
            "height": 889
        },
        "Object": {},
        "Line": {
            "strokeWidth": 1,
            "stroke": "black"
        },
        "Image": {
            "sourceRoot": "./media/",
            "layer": "objects"
        },
        "BackgroundImage": {
            "width": 500,
            "height": 661,
            "fitting": "fill",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/backgrounds/"
        },
        "OverlayImage": {
            "width": 500,
            "height": 661,
            "fitting": "fill",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/overlays/"
        },
        "Emoji": {
            "prototype": "Image",
            "layer": "overlayObjects",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/emoji/"
        },
        "Clipart": {
            "prototype": "Image",
            "layer": "overlayObjects",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/objects/"
        },
        "Photo": {
            "units": "percents",
            "prototype": "Image",
            "fitting": "cover",
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/photo/"
        },
        "ImageBorder": {
            "sourceRoot": "https://s3-ap-southeast-1.amazonaws.com/secure-s3-dev.simplysay.sg/frames/",
            "units": "mixed"
        },
        "Textbox": {
            "emojisPath": "emoji-thumbnails/*.png",
            "layer": "overlayObjects",
            "fixedWidth": true,
            "width": 300,
            "borderColor": "#3DAFF6",
            "fontFamily": "Open Sans",
            "fontSize": 24,
            "textAlign": "center"
        },
        "StaticTextbox": {
            "prototype": "Textbox",
            "emojisPath": "emoji-thumbnails/*.png",
            "textVerticalAlign": "middle",
            "autoHeight": false,
            "text": ""
        }
    },
    "slides": [
        {
            "width": 642,
            "height": 889,
            "objects": [
                {
                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb257edbd.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0
                    },
                    "top": 8,
                    "left": 18,
                    "width": 124,
                    "height": 134,
                    "type": "photo",
                    "clipPath": {}
                },
                {
                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2538834.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0
                    },
                    "top": 144.89189148491175,
                    "left": 35.04845026237308,
                    "width": 123,
                    "height": 138,
                    "angle": 349.0862129982982,
                    "type": "photo",
                    "clipPath": {}
                },
                {
                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2565547.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0
                    },
                    "top": 274.4767963508434,
                    "left": 62.95188034445766,
                    "width": 124,
                    "height": 138,
                    "angle": 347.9400797089643,
                    "type": "photo",
                    "clipPath": {}
                },
                {
                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2538834.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0
                    },
                    "top": 399.9966071843904,
                    "left": 93.7360264885005,
                    "width": 124,
                    "height": 139,
                    "angle": 349.8633588597081,
                    "type": "photo",
                    "clipPath": {}
                },
                {
                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2565547.jpg",
                    "crop": {
                        "top": 0,
                        "left": 0
                    },
                    "top": 524.9905997389101,
                    "left": 126.23703073761627,
                    "width": 124,
                    "height": 136,
                    "angle": 353.05923912888557,
                    "type": "photo",
                    "clipPath": {}
                },
                {
                    "src": "https://cdn.simplysay.sg/overlays/5f0ac63eefc9e.png",
                    "fitting": "fill",
                    "type": "overlay-image"
                },
                {
                    "type": "group",
                    "scaleX": 0.865,
                    "scaleY": 0.9273827534039334,
                    "width": 1000,
                    "height": 661,
                    "originX": "left",
                    "originY": "top",
                    "left": 14,
                    "angle": -90,
                    "top": 877,
                    "objects": [
                        {
                            "type": "group",
                            "clipPath": true,
                            "width": 500,
                            "height": 661,
                            "originX": "left",
                            "originY": "top",
                            "objects": [
                                {
                                    "type": "barcode",
                                    "text": "4926fbfbfe7122e8481896d254f8f77b",
                                    "left": 425,
                                    "top": 586,
                                    "width": 50,
                                    "height": 50
                                },
                                {
                                    "type": "image",
                                    "src": "simplysay_blue_logo_tag.png",
                                    "originX": "center",
                                    "width": 280,
                                    "height": 87.5,
                                    "top": 158,
                                    "left": 250
                                },
                                {
                                    "type": "image",
                                    "src": "recycle.png",
                                    "width": 53,
                                    "height": 51,
                                    "originX": "center",
                                    "top": 462,
                                    "left": 250
                                },
                                {
                                    "type": "text",
                                    "top": 518,
                                    "left": 250,
                                    "width": 187,
                                    "originX": "center",
                                    "textAlign": "center",
                                    "strokeWidth": 0,
                                    "fontFamily": "Papyrus",
                                    "fontSize": 14,
                                    "text": "This card is 100% recyclable."
                                },
                                {
                                    "type": "text",
                                    "top": 541,
                                    "left": 250,
                                    "width": 122,
                                    "originX": "center",
                                    "textAlign": "center",
                                    "strokeWidth": 0,
                                    "fontFamily": "Papyrus",
                                    "fontSize": 14,
                                    "text": "Made in Singapore."
                                },
                                {
                                    "type": "text",
                                    "top": 259,
                                    "left": 250,
                                    "width": 132,
                                    "originX": "center",
                                    "height": 20.34,
                                    "strokeWidth": 0,
                                    "fill": "rgb(153, 153, 153)",
                                    "fontFamily": "Papyrus",
                                    "fontSize": 18,
                                    "text": "www.simplysay.sg",
                                    "textAlign": "left"
                                },
                                {
                                    "type": "text",
                                    "top": 600,
                                    "left": 27,
                                    "width": 125,
                                    "height": 36.61,
                                    "strokeWidth": 0,
                                    "fontFamily": "Papyrus",
                                    "fontSize": 15,
                                    "text": "©SimplySay 2020\nall rights reserved"
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "clipPath": true,
                            "width": 500,
                            "height": 661,
                            "left": 500,
                            "objects": [
                                {
                                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb257edbd.jpg",
                                    "crop": {
                                        "top": 0,
                                        "left": 0
                                    },
                                    "top": 8,
                                    "left": 18,
                                    "width": 124,
                                    "height": 134,
                                    "type": "photo",
                                    "clipPath": {}
                                },
                                {
                                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2538834.jpg",
                                    "crop": {
                                        "top": 0,
                                        "left": 0
                                    },
                                    "top": 144.89189148491175,
                                    "left": 35.04845026237308,
                                    "width": 123,
                                    "height": 138,
                                    "angle": 349.0862129982982,
                                    "type": "photo",
                                    "clipPath": {}
                                },
                                {
                                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2565547.jpg",
                                    "crop": {
                                        "top": 0,
                                        "left": 0
                                    },
                                    "top": 274.4767963508434,
                                    "left": 62.95188034445766,
                                    "width": 124,
                                    "height": 138,
                                    "angle": 347.9400797089643,
                                    "type": "photo",
                                    "clipPath": {}
                                },
                                {
                                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2538834.jpg",
                                    "crop": {
                                        "top": 0,
                                        "left": 0
                                    },
                                    "top": 399.9966071843904,
                                    "left": 93.7360264885005,
                                    "width": 124,
                                    "height": 139,
                                    "angle": 349.8633588597081,
                                    "type": "photo",
                                    "clipPath": {}
                                },
                                {
                                    "src": "https://secure-s3-dev.simplysay.sg/user_uploaded_images/0/5f1bfb2565547.jpg",
                                    "crop": {
                                        "top": 0,
                                        "left": 0
                                    },
                                    "top": 524.9905997389101,
                                    "left": 126.23703073761627,
                                    "width": 124,
                                    "height": 136,
                                    "angle": 353.05923912888557,
                                    "type": "photo",
                                    "clipPath": {}
                                },
                                {
                                    "src": "https://cdn.simplysay.sg/overlays/5f0ac63eefc9e.png",
                                    "fitting": "fill",
                                    "type": "overlay-image"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "group",
                    "width": 642,
                    "height": 889,
                    "objects": [
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 0,
                            "x2": 32,
                            "y2": 14
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 32,
                            "x2": 14,
                            "y2": 32
                        },
                        {
                            "type": "line",
                            "x1": 610,
                            "y1": 0,
                            "x2": 610,
                            "y2": 14
                        },
                        {
                            "type": "line",
                            "x1": 642,
                            "y1": 32,
                            "x2": 628,
                            "y2": 32
                        },
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 889,
                            "x2": 32,
                            "y2": 875
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 857,
                            "x2": 14,
                            "y2": 857
                        },
                        {
                            "type": "line",
                            "x1": 610,
                            "y1": 889,
                            "x2": 610,
                            "y2": 875
                        },
                        {
                            "type": "line",
                            "x1": 642,
                            "y1": 857,
                            "x2": 628,
                            "y2": 857
                        }
                    ]
                }
            ]
        },
        {
            "width": 642,
            "height": 889,
            "objects": [
                {
                    "type": "group",
                    "scaleX": 0.865,
                    "scaleY": 0.9273827534039334,
                    "width": 1000,
                    "height": 661,
                    "originX": "left",
                    "originY": "top",
                    "left": 14,
                    "angle": -90,
                    "top": 877,
                    "objects": [
                        {
                            "type": "group",
                            "clipPath": true,
                            "width": 500,
                            "height": 661,
                            "objects": [
                                {
                                    "textLines": [
                                        0,
                                        5,
                                        0,
                                        5,
                                        0,
                                        7
                                    ],
                                    "top": 37,
                                    "left": 30,
                                    "width": 440,
                                    "height": 598,
                                    "fontFamily": "Open Sans",
                                    "text": "\n你好，世界\n\n안녕 세상\n\nこんにちは世界",
                                    "textAlign": "left",
                                    "textVerticalAlign": "top",
                                    "maxHeight": 598,
                                    "type": "static-textbox"
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "clipPath": true,
                            "width": 500,
                            "height": 661,
                            "left": 500,
                            "objects": [
                                {
                                    "textLines": [
                                        0,
                                        5,
                                        0,
                                        5
                                    ],
                                    "top": 37,
                                    "left": 30,
                                    "width": 440,
                                    "height": 145,
                                    "fontFamily": "Open Sans",
                                    "text": "\n你好，世界\n\n안녕 세상",
                                    "maxHeight": 145,
                                    "type": "static-textbox"
                                },
                                {
                                    "textLines": [
                                        0,
                                        5,
                                        0,
                                        5
                                    ],
                                    "top": 222,
                                    "left": 30,
                                    "width": 440,
                                    "height": 225,
                                    "fontFamily": "Open Sans",
                                    "text": "\n你好，世界\n\n안녕 세상",
                                    "maxHeight": 225,
                                    "type": "static-textbox"
                                },
                                {
                                    "textLines": [
                                        0,
                                        5,
                                        0,
                                        5
                                    ],
                                    "top": 490,
                                    "left": 30,
                                    "width": 440,
                                    "height": 145,
                                    "fontFamily": "Open Sans",
                                    "text": "\n你好，世界\n\n안녕 세상",
                                    "maxHeight": 145,
                                    "type": "static-textbox"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "group",
                    "width": 642,
                    "height": 889,
                    "objects": [
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 0,
                            "x2": 32,
                            "y2": 14
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 32,
                            "x2": 14,
                            "y2": 32
                        },
                        {
                            "type": "line",
                            "x1": 610,
                            "y1": 0,
                            "x2": 610,
                            "y2": 14
                        },
                        {
                            "type": "line",
                            "x1": 642,
                            "y1": 32,
                            "x2": 628,
                            "y2": 32
                        },
                        {
                            "type": "line",
                            "x1": 32,
                            "y1": 889,
                            "x2": 32,
                            "y2": 875
                        },
                        {
                            "type": "line",
                            "x1": 0,
                            "y1": 857,
                            "x2": 14,
                            "y2": 857
                        },
                        {
                            "type": "line",
                            "x1": 610,
                            "y1": 889,
                            "x2": 610,
                            "y2": 875
                        },
                        {
                            "type": "line",
                            "x1": 642,
                            "y1": 857,
                            "x2": 628,
                            "y2": 857
                        }
                    ]
                }
            ]
        }
    ]
}

new TestApp({
    plugins: [
        Frames, Deco, Barcode,BackgroundOverlayImages,
        Grid, Placeholders, Animation,
        ImageCrop, Fonts, Undo, Zoom,
        Areas,
        Snap,
        TextEasyEdit,
        TextboxTweaks,
        Templates,
        ClipPath,
        Controls,
        Debug
    ],
    toolbars: {
        Editor: []
    },
    prototypes: test2.prototypes,
    frames: test2.frames,
    slides: test2.slides,
})
