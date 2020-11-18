(async () => {
	new App({
		plugins: [
			"warp",
			"bezier-polyline",
			"bezier-text",
			"curved-text",
			"arc-text"
		],
		fonts: ["Times New Roman"],
		prototypes:{
			Canvas: {
			},
			Textbox: {
			}
		},
		objects: {
			warp: {
				hasBorders: true,
				hasShapeBorders: true,
				eventListeners: {"mousedblclick": "switchEditMode"},
				subdivisions: 21,
				webgl: true,
				strokeWidth: 0,
				type: "warp",
				src: "./default.jpg",
				top: 600,
				left: 800,
				width: 501,
				height: 501,
				points: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],
				transformations: [[{x: 245, y: 146, t: 0.48, c: 0}], [{x: 428, y: 242, t: 0.5, c: 1}], [{x: 243, y: 373, t: 0.472, c: 0}], [{x: 68, y: 254, t: 0.504, c: 1}]]
			},
			closedBezierPolyline: {
				type: "bezier-polyline",
				top: 300,
				left: 800   ,
				closed: true,
				controlsButtonsEnabled: true,
				bezierControls: true,
				points: [{x: 0, y:  0}, {x: 300, y: 0}, {x: 300, y: 300}, {x: 0, y: 300},]
			},
			bezierPolyline: {
				type: "bezier-polyline",
				top: 100,
				controlsButtonsEnabled: true,
				extensionAreaEnabled: true,
				bezierControls: true,
				left: 800,
				points: [{x: 250, y:  10}, {x: 310, y: 180}, {x: 490, y: 180}, {x: 350, y: 290}, {x: 400, y: 460}, {x: 250, y: 360}, {x: 100, y: 460}, {x: 150, y: 290}, {x: 10 , y: 180}, {x: 190, y: 180}]
			},
			textbox: {
				top: 800,
				left: 900,
				type: 'textbox',
				textAlign: "center",
				text: 'Text Box Object',
				width: 400
			},
			curved: {
				left: 900,
				top: 100,
				spacing: 10,
				text: 'Curved Text Object',
				type: 'curved-text',
				radius: 100,
			},
			bezierText: {
				type:"bezier-text",
				top: 500,
				left: 900,
				text: "Bezier Text Object Example",
				width:475.10363204628135,
				height:120.93666573505817,
				points:[{"x":36.26328244319376,"y":95.46833286752891,"c":{"x":117.26328244319467,"y":-78.53166713247111},"c2":{"x":373.2632824431947,"y":228.46833286752906}},{"x":465.26328244319427,"y":54.468332867529504}]
			},
			itext: {
				type: "i-text",
				top: 100,
				left: 400,
				width: 500,
				originX: "center",
				fontFamily: "Times New Roman",
				text: "Straight I-Text Object\n Styled Multiline",
				textBackgroundColor: false,
				styles: {
					"0": {
						"9":  {"fontSize": 100, "textBgColor": "red", "textBackgroundColor": "red", "overline": true, "underline": true},
						"10": {"fontSize": 100, "textBgColor": "red", "textBackgroundColor": "red", "overline": true, "underline": true},
						"11": {"fontSize": 100, "textBgColor": "red", "textBackgroundColor": "red", "overline": true, "underline": true},
						"12": {"fontSize": 100, "textBgColor": "red", "textBackgroundColor": "red", "overline": true, "underline": true},
						"13": {"fontSize": 100, "textBgColor": "red", "textBackgroundColor": "red", "overline": true, "underline": true},
						"14": {"fontSize": 100, "textBgColor": "red", "textBackgroundColor": "red", "overline": true, "underline": true}
					}
				}
			},
			itextDownwardCurvature: {
				styles: {"0":{"16":{"textBackgroundColor":"red"},"17":{"textBackgroundColor":"red"},"18":{"textBackgroundColor":"red"},"19":{"textBackgroundColor":"red"},"20":{"textBackgroundColor":"red"},"21":{"textBackgroundColor":"red"},"22":{"textBackgroundColor":"red"},"23":{"textBackgroundColor":"red"}},"1":{"0":{"fontSize":50},"1":{"fontSize":50},"2":{"fontSize":50},"3":{"fontSize":50},"4":{"fontSize":50},"5":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"6":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"7":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"8":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"9":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true},"10":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true},"11":{"underline":true,"oberline":true,"overline":true,"strikethrough":true},"12":{"underline":true,"oberline":true,"overline":true,"strikethrough":true}},"2":{"6":{"underline":true},"7":{"underline":true},"8":{"underline":true},"9":{"underline":true},"10":{"underline":true}},"3":{"12":{"overline":true},"13":{"overline":true},"14":{"overline":true},"15":{"overline":true},"16":{"overline":true}}},
				textBackgroundColor: "lightgreen",
				textAlign: "center",
				top: 50,
				left: 0,
				curvature: 1,
				type: 'i-text',
				originX : "center",
				text: '1 ŤǬḈ Lorem ipsum sit amet\n2 ŤǬḈ Lorem ipsuedmc sit amet\n3 ŤǬḈ Lorem ipsudm sit amet\n4 ŤǬḈ Lorem ipsum sit amet',
				width: 400
			},
			itextUpwardCurvature: {
				textBackgroundColor: "lightgreen",
				textAlign: "center",
				top: 700,
				left: 400,
				curvature: -1,
				type: 'i-text',
				originX : "center",
				styles: {"0":{"16":{"textBackgroundColor":"red"},"17":{"textBackgroundColor":"red"},"18":{"textBackgroundColor":"red"},"19":{"textBackgroundColor":"red"},"20":{"textBackgroundColor":"red"},"21":{"textBackgroundColor":"red"},"22":{"textBackgroundColor":"red"},"23":{"textBackgroundColor":"red"}},"1":{"0":{"fontSize":50},"1":{"fontSize":50},"2":{"fontSize":50},"3":{"fontSize":50},"4":{"fontSize":50},"5":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"6":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"7":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"8":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"9":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true},"10":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true},"11":{"underline":true,"oberline":true,"overline":true,"strikethrough":true},"12":{"underline":true,"oberline":true,"overline":true,"strikethrough":true}},"2":{"6":{"underline":true},"7":{"underline":true},"8":{"underline":true},"9":{"underline":true},"10":{"underline":true}},"3":{"12":{"overline":true},"13":{"overline":true},"14":{"overline":true},"15":{"overline":true},"16":{"overline":true}}},
				text: '1 ŤǬḈ Lorem ipsum sit amet\n2 ŤǬḈ Lorem ipsuedmc sit amet\n3 ŤǬḈ Lorem ipsudm sit amet\n4 ŤǬḈ Lorem ipsum sit amet',
				width: 400
			},
			image: {
				type: "image",
				src: "./media/curve.png",
				top: 376.5,
				left: 400,
				width: 558,
				height: 247
			},
			controlText: {
				styles: {"0":{"16":{"textBackgroundColor":"red"},"17":{"textBackgroundColor":"red"},"18":{"textBackgroundColor":"red"},"19":{"textBackgroundColor":"red"},"20":{"textBackgroundColor":"red"},"21":{"textBackgroundColor":"red"},"22":{"textBackgroundColor":"red"},"23":{"textBackgroundColor":"red"}},"1":{"0":{"fontSize":50},"1":{"fontSize":50},"2":{"fontSize":50},"3":{"fontSize":50},"4":{"fontSize":50},"5":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"6":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"7":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"8":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true,"fontSize":50},"9":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true},"10":{"udnerline":true,"underline":true,"oberline":true,"overline":true,"strikethrough":true},"11":{"underline":true,"oberline":true,"overline":true,"strikethrough":true},"12":{"underline":true,"oberline":true,"overline":true,"strikethrough":true}},"2":{"6":{"underline":true},"7":{"underline":true},"8":{"underline":true},"9":{"underline":true},"10":{"underline":true}},"3":{"12":{"overline":true},"13":{"overline":true},"14":{"overline":true},"15":{"overline":true},"16":{"overline":true}}},
				textBackgroundColor: "lightgreen",
				textAlign: "center",
				top: 400,
				left: 800,
				type: 'i-text',
				originX : "center",
				text: '1 ŤǬḈ Lorem ipsum sit amet\n2 ŤǬḈ Lorem ipsuedmc sit amet\n3 ŤǬḈ Lorem ipsudm sit amet\n4 ŤǬḈ Lorem ipsum sit amet',
				width: 400
			}
		},
		slide: {
			objects: [
				// "warp",
				// "closedBezierPolyline",
				// "bezierPolyline",
				// "shapedText",
				// "bezierText",
				// "curved",
				// "textbox",
				// "itext",
				// "image",
				"itextDownwardCurvature",
				"itextUpwardCurvature",
				"controlText",
			]
		},
		toolbars: {
			Editor: null,
			Canvas: null,
			IText: ["showCurvature","curvature"]
		}
	})
})()



