// import {canvasToBlob} from "../../src/util/canvasToBlob.js";
// import saveAs from "../../plugins/saveAs.js";
// fabric.fonts.debug = true;
// fabric.debug_extend = true;

import {App} from '../showreel.js'
import {FmTiles} from "../../../src/objects/puzzle.js";
import {FmWarp} from "../../../src/shapes/warp.js";
import {FmSourceCanvas} from "../../../src/images/image.sourceCanvas.js";
import {FmFonts} from "../../../src/fonts/fonts.js";
import {FmCLipPath} from "../../../src/objects/object.clippath.js";
import {FmCrop} from "../../../src/images/image-crop.js";
import {FmObjectRender} from "../../../src/objects/object.render.js";
import {FmBufferRendering} from "../../../src/canvas/buffer-rendering.js";
import {FmTemplates} from "../../../src/shapes/templates.js";


function getCmpositionData(product){
	let clippath1, clippath2;
	let state = product.design;
	if(product.printfiles){
		clippath1 = product.printfiles[0] && {
			type: "image",
			src: product.printfiles[0].url,
			width: state.width,
			height: state.height
		}
		clippath2 = product.printfiles[1] && {
			type: "image",
			src: product.printfiles[1].url,
			width: state.width,
			height: state.height
		}
	}

	let data;
	let rot0 = product.duplicate_print_rotation === 0;
	let rot180 = product.duplicate_print_rotation === 180;
	let rotRight = product.duplicate_print_rotation === 90;
	let rotLeft = product.duplicate_print_rotation === 270;
	let dividerWidth = product.duplicate_print_divider;

	let dupDims= {
		width: rot0 || rot180 ? state.width : state.height,
		height: rot0 || rot180 ? state.height : state.width,
	}
	dupDims.left = rot0 || rotLeft ? 0 : dupDims.width;
	dupDims.top = rot0 || rotRight ? 0 : dupDims.height;

	switch(product.duplcicate_print_position){
		case 1: //right

			data = {
				width: state.width + dupDims.width + dividerWidth,
				height: Math.max(state.height , dupDims.height),
				objects: [
					{
						type: "group", clipPath: clippath1 || true, objects: state.objects, width: state.width, height: state.height,
					},
					dividerWidth ? {
						type: "line", stroke: "black",
						x1: state.width, x2: state.width, y1: 0,
						y2: Math.max(state.height,dupDims.height),
					} : null,
					{
						id: "duplicate",
						type: "group", clipPath: clippath2 || true,  objects: state.objects, width: state.width, height: state.height,
						angle: product.duplicate_print_rotation,
						left: dupDims.left + state.width + dividerWidth,
						top: dupDims.top
					}
				]
			}
			break;
		case 2: //bottom

			data = {
				height: state.height + dupDims.height + dividerWidth,
				width: Math.max(state.width,dupDims.width),
				objects: [
					{
						type: "group", clipPath: clippath1 || true,  objects: state.objects, width: state.width, height: state.height,
					},
					dividerWidth ? {
						type: "line", stroke: "black",
						x1: 0, y1: state.height , y2: state.height,
						x2: Math.max(state.width,dupDims.width),
					} : null,
					{
						id: "duplicate",
						type: "group", clipPath: clippath2|| true, objects: state.objects, width: state.width, height: state.height,
						angle: product.duplicate_print_rotation,
						left: dupDims.left,
						top: dupDims.top + state.height + dividerWidth,
					}
				]
			}

			break;
		case 3: //left

			data = {
				width: state.width + dupDims.width + dividerWidth,
				height: Math.max(state.height , dupDims.height),
				objects: [
					{
						id: "duplicate",
						type: "group", clipPath: clippath1 || true, objects: state.objects, width: state.width, height: state.height,
						angle: product.duplicate_print_rotation,
						left: dupDims.left,
						top: dupDims.top
					},
					dividerWidth ? {
						type: "line", stroke: "black",
						x1: dupDims.width,
						x2: dupDims.width,
						y1: 0,
						y2: Math.max(state.height,dupDims.height),
					} : null,
					{
						type: "group", clipPath: clippath2 || true, objects: state.objects, width: state.width, height: state.height,
						left: dupDims.width + dividerWidth,
						top: 0
					}
				]
			}
			break;
		case 4: //top

			data = {
				height: state.height + dupDims.height + dividerWidth,
				width: Math.max(state.width,dupDims.width),
				objects: [
					{
						id: "duplicate", clipPath: clippath1 || true, type: "group",  objects: state.objects, width: state.width, height: state.height,
						angle: product.duplicate_print_rotation,
						left: dupDims.left,
						top: dupDims.top
					},
					dividerWidth ? {
						type: "line", stroke: "black",
						y1: dupDims.height,
						y2: dupDims.height,
						x1: 0,
						x2: Math.max(state.width,dupDims.width),
					} : null,
					{
						type: "group", clipPath: clippath2 || true, objects: state.objects, width: state.width, height: state.height,
						top: dupDims.height + dividerWidth,
						left: 0
					}
				]
			}
			break;
		default:
			data =  {
				clipPath: clippath1,
				width: state.width,
				height: state.height,
				objects: state.objects
			}
	}
	return data;
}

function timeout(){
	return new Promise(resolve => {
		setTimeout(()=> {
			print();
		},2000)
	})
}

async function print(data,title){


	let printEditor = await new fabric.Editor({
		// prototypes: editor.prototypes,
		plugins: ["buffer-rendering"],
		slide: data,
		dpi: 300,
	}).promise

	let thumbnail = printEditor.canvas.getThumbnail({zoom: 4});

	// new fabric.Canvas(data,async (canvas)=> {
	//
	// 	console.log("saved")
	// 	let thumbnail = canvas.getThumbnail({zoom: 1});
	let blob = await canvasToBlob(thumbnail,"png",{
		dpi: 300,
		meta:  {
			Title:            "title",
			Author:           "Nymbl",
			Description:      "",
			Copyright:        "Nymbl ©" + new Date().getFullYear(),
			Software:         "Fiera.js",
			Comment:          ""
		}
	})
	saveAs (blob, title)
	// })

	// let blob = await editor.export({
	// 	format: "png",
	// 	dpi: projectData.dpi / 10,
	// 	output: projectData.title,
	// 	meta: {
	// 		Title: projectData.title,
	// 		Author: "Nymbl",
	// 		Description: "",
	// 		Copyright: "Nymbl ©" + new Date().getFullYear(),
	// 		Software: "Fiera.js",
	// 		Comment: ""
	// 	}
	// });
}

fabric.util.on("buffer:created",(e)=>{
	document.body.append(e.buffer);
	e.buffer.style.position = "absolute"
	e.buffer.style.left = e.level * 30 + "%"
	e.buffer.style.top = "0"
	e.buffer.style.border = "black"
	e.buffer.style.width = "30%"
	e.buffer.style.background = "white"
})

new App({
	plugins: [
		FmTiles,
		FmFonts,
		FmCLipPath,
		FmCrop,
		FmObjectRender,
		FmBufferRendering,
		FmWarp,
		FmSourceCanvas,
		FmTemplates
	],
	prototypes:{
		PhotoImage: {
			prototype: "image",
			eventListeners: {
				"mousedblclick": "cropPhotoStart"
			}
		},
	},
	toolbars: {
		Editor: [
			{
				title: "composition",
				async action(editor){
					let state = editor.canvas.getState();
					let rotation = 270;
					let position = 4;
					let divider = 1;

					let data = getCmpositionData({
						design: state,
						output: "jpg",
						printfiles: [
							{url: "cliparts/hex.png"}
							// {url: "svg/windows.svg"},
						],
						duplcicate_print_position: position,
						duplicate_print_rotation: rotation,
						duplicate_print_divider: divider
					})
					editor.canvas.load({
						objects: data.objects,
						clipPath: data.clipPath,
						originalWidth: data.width,
						originalHeight: data.height
					})
				}
			},
			{
				title: "print",
			async action(editor){




				let state = editor.canvas.getState();
				let rotation = 90;
				let position = 1;
				let divider = 1;



				// for(let rotation = 0; rotation <= 270; rotation +=90) {
				// 	for (let position = 0; position <= 4; position++) {



				await print(getCmpositionData({
					design: state,
					printfiles: [
					//	{url: "cliparts/hex.png"}
						// {url: "svg/windows.svg"},
					],
					duplcicate_print_position: position,
					duplicate_print_rotation: rotation,
					duplicate_print_divider: divider
				}), "position_" + position + "_rotation_" + rotation + "_divider_" + divider)
				await timeout

					// }
				// }
			}
		}]
	},
	objects: {
		group: {
			fill: "yellow",
			type: 'group',
			objects: [
				{
					type: 'rect',
					"top": 0,
					"left": 0,
					width: 200,
					height: 100,
					fill: '#eef'
				},
				{
					"top": 50,
					"left": 100,
					"originX": "center",
					"originY": "center",
					type: 'text',
					text: 'hello world',
					fontSize: 30
				}
			],
			left: 400,
			top: 400,
			scaleX: 2,
			scaleY: 2
		},
		background: {
			type: "rect",
			fill: "white",
			strokeWidth: 0,
			evented: false,
			selectable: false,
			width: 960,
			height: 1920
		},
		arial: {
			type: "text",
			text: "Default: 7 7⃣ ® © 😀 💛 🤹🏽‍♀\nForceEmoji: 7️ 7⃣️ ®️ ©️ 😀️ 💛️ 🤹🏽‍♀️\nForceText: 7︎ 7⃣︎ ®︎ ©︎ 😀︎ 💛︎ 🤹🏽‍♀︎\nHearts ❤️ ❤ 🧡 💛 💚 💙 💜 🖤 💔\nZWJ, Fitzpatrick: ✊ ✊🏼 👨‍👨‍👧‍👧 👩🏾‍🤝‍👨🏿 🏇🏼 🤹🏽‍♀️\n🇬🇧Simply 🇷🇺Просто \n🇨🇳簡單地說 🇰🇵간단히말해 🇯🇵単に言う\n🇮🇳केवल 🇧🇩কেবল \n🇸🇦مرحبا 🇮🇷به سادگی 🇪🇬𓀀𓂀𓆣 \nUnicode11: 🚆 🚇 🛤 🌄 🌇 🌆 🏙 🌃 🌌 🌉 🌁\nUnicode12: 🧏‍♂️ 🧏‍♀️ 🟥 🟧 🟨 🟩 🟦 🟪 🟫\t\nUnicode13: 🐈‍⬛ 🐻‍❄️ 👩🏼‍🍼",
			fontFamily: "Times New Roman, SimSun, Malgun Gothic, Segoe UI Symbol,Segoe UI Historic, Kartika,Kokila,Latha,Raavi,Shonar,Shruti,Tunga,Vani"
		},
		puzzle: {
			type: "rect",
			fill: "green",
			strokeWidth: 0,
			puzzle: {
				offsetsY: [{"x": 1, "y": 1}, {"x": -1, "y": 1}],
				offsetsX: [{"x": 2, "y": 0}]
			},
			width: 400,
			height: 400
		},
		lightGreen: {
			type: "rect",
			clipPath: {
				type: "circle",
				left: 500,
				top: 500,
				radius: 450
			},
			strokeWidth: 0,
			fill: "lightgreen",
			opacity: 0.5,
			left: 0,
			top: 0,
			width: 900, "height": 900
		},
		bow: {
			id: 'bow', type: 'image',
			left: 700,
			top: 100,
			width: 200,
			height: 200,
			src: 'png-graphics/tribal/Bow2.png'
		},
		puzzleText: {
			puzzle: {},
			clipPath: {
				radius: 0.5
			},
			type: "i-text",
			puzzleSpacing: 65,
			textLines: ["Add Text Here"],
			top: 725,
			left: 200,
			width: 1200,
			height: 145,
			scaleX: 0.56,
			scaleY: 0.56,
			fontFamily: "Bungee Shade",
			fontSize: 128,
			text: "Add Text Here"
		},
		tpl: {"puzzle":{},"type":"template","width": 1043, "height": 521.677327647477, "objects": [{"src": "https://media.designerapp.me/media-thumbnails/8f789450-3c22-4203-8f49-ef5e91c287a1.svg", "top": 0, "crop": {"top": 0, "left": 0}, "left": 0, "type": "image", "width": 1043.354655294954, "height": 521.677327647477, "clipPath": {}}, {"top": 213.29504735561343, "fill": "#fec925", "left": 71.75334329186, "path": [["m", 194.7, 253.4], ["l", -94.4, -8.9], ["c", 0, 0, -25.6, -5, -27.2, 47.3], ["c", -1.6, 52.3, -6.9, 98.3, 54.4, 86.7], ["c", 61.3, -11.6, 267.4, -41.2, 267.4, -41.2], ["c", 0, 0, 77.7, -5.3, 74, -18], ["c", -3.7, -12.7, -22.8, -29.1, -22.8, -29.1], ["c", 0, 0, 9.6, -68.5, -25.3, -74.4], ["c", -34.9, -5.9, -61.3, 3.1, -61.3, 3.1], ["z"]], "type": "path", "width": 396.77472593474886, "height": 166.5132883690889}, {"top": 77.32603550295863, "fill": "#49aa80", "left": 46.49561692962243, "path": [["m", 1488.7, 683], ["c", -21, 2.6, -32.3, 8.2, -38.4, 13.6], ["l", -44.9, -81.9], ["c", -9.3, -16.8, -22.6, -14.8, -22.6, -14.8], ["l", -194, 25.1], ["c", -17.8, 2.2, -18.9, 15.8, -18.9, 15.8], ["l", -27.6, 91.2], ["c", -7.5, -2.8, -18.9, -4.3, -36.4, -2.1], ["c", 0, 0, -15.2, 0.5, -14.9, 14], ["l", 1.4, 11.3], ["c", 0.2, 1.5, 0.8, 3, 1.8, 4.2], ["c", 3, 3.5, 10.6, 9.9, 24.6, 8.2], ["l", 14.1, -0.9], ["c", -28.3, 13.2, -21.4, 59.7, -20.3, 67.5], ["c", 0, 0.3, 0.1, 0.6, 0.2, 0.9], ["c", 0.2, 1.8, 0.8, 8.2, 1.6, 16.2], ["c", -3.2, -0.5, -9.1, -0.2, -10.4, 7.6], ["c", -0.1, 0.7, -0.1, 1.5, 0, 2.2], ["l", 3.5, 28.4], ["c", 0.4, 3.1, 1.8, 5.9, 4.1, 7.9], ["c", 3.8, 3.5, 10.5, 7.9, 20.1, 7.9], ["l", 3.4, 27.7], ["c", 1.4, 11.1, 11.7, 19, 23.1, 17.6], ["l", 33.4, -4.1], ["c", 11.4, -1.4, 19.6, -11.6, 18.2, -22.7], ["l", -3.4, -27.6], ["l", 223.6, -27.4], ["l", 3.4, 27.6], ["c", 1.4, 11.1, 11.7, 19, 23.1, 17.6], ["l", 33.4, -4.1], ["c", 11.4, -1.4, 19.6, -11.6, 18.2, -22.7], ["l", -3.5, -28.2], ["c", 9.6, -3.3, 14.5, -10.5, 16.4, -14.2], ["c", 0.7, -1.3, 1, -2.8, 0.8, -4.3], ["l", -3.7, -30.3], ["c", -0.1, -0.7, -0.3, -1.4, -0.6, -2.1], ["c", -3.3, -7.5, -9.4, -6, -12.3, -4.7], ["c", -1.3, -9.4, -2.4, -16.7, -2.4, -16.7], ["c", 0, 0, -4.5, -55.2, -35.3, -60.9], ["l", 17.8, -3.3], ["c", 13.5, -1.7, 19.4, -9.1, 21.7, -13.4], ["c", 0.9, -1.6, 1.2, -3.5, 1, -5.3], ["l", -1.4, -11], ["c", -3, -12.9, -17.9, -9.8, -17.9, -9.8], ["z"], ["m", -333.2, 55.3], ["l", 24, -87.7], ["c", 0, 0, 0.9, -13.6, 17.4, -15.7], ["L", 1377, 611.5], ["c", 0, 0, 11.5, -4.1, 21.2, 15], ["l", 40.6, 78.9], ["l", 2.4, 4.9], ["c", 1, 2, 1, 4.4, -0.1, 6.4], ["c", -4.7, 9, -17.8, 9.5, -17.8, 9.5], ["l", -248.8, 30.5], ["c", -13.7, 1.7, -18, -11.3, -18, -11.3], ["c", 0, 0, -0.3, -0.8, -0.7, -1.9], ["c", -0.7, -1.7, -0.8, -3.5, -0.3, -5.2], ["z"], ["m", -10, 150.6], ["c", -5.7, 0.7, -10.8, -3.2, -11.5, -8.7], ["c", -0.7, -5.5, 3.4, -10.6, 9, -11.3], ["c", 5.7, -0.7, 10.8, 3.2, 11.5, 8.7], ["c", 0.7, 5.5, -3.3, 10.6, -9, 11.3], ["z"], ["m", 6.7, -59.1], ["c", -13.2, 1.6, -25.4, -9.3, -27.3, -24.4], ["c", -1.9, -15.1, 7.4, -28.6, 20.6, -30.3], ["c", 13.2, -1.6, 54.2, 25.4, 56, 40.5], ["c", 1.8, 15.1, -36.1, 12.6, -49.3, 14.2], ["z"], ["m", 348.2, 5.4], ["c", 0.7, 5.5, -3.4, 10.6, -9, 11.3], ["c", -5.7, 0.7, -10.8, -3.2, -11.5, -8.7], ["c", -0.7, -5.5, 3.4, -10.6, 9, -11.3], ["c", 5.7, -0.7, 10.8, 3.2, 11.5, 8.7], ["z"], ["m", -24.2, -72.8], ["c", 1.9, 15.1, -7.4, 28.6, -20.6, 30.3], ["c", -13.2, 1.6, -47.2, 7.5, -49, -7.6], ["c", -1.9, -15.1, 29.1, -45.5, 42.3, -47.1], ["c", 13.3, -1.6, 25.5, 9.3, 27.3, 24.4], ["z"]], "type": "path", "width": 430.86520807761553, "height": 350.93473158497034}, {"src": "https://media.designerapp.me/media-thumbnails/10fd06a4-4098-493d-83d5-b49d6414d4ea.jpg", "top": 108.14639999999996, "crop": {"top": 0, "left": 0}, "left": 96.83570000000005, "type": "photo-image", "angle": -6.986793054697095, "width": 602, "height": 402, "scaleX": 0.4799641094557071, "scaleY": 0.4799641094557071, "clipPath": {"top": -237.8494994800212, "left": -267.4080856148352, "path": [["m", 1155.5, 738.3], ["l", 24, -87.7], ["c", 0, 0, 0.9, -13.6, 17.4, -15.7], ["L", 1377, 611.5], ["c", 0, 0, 11.5, -4.1, 21.2, 15], ["l", 40.6, 78.9], ["l", 2.4, 4.9], ["c", 1, 2, 1, 4.4, -0.1, 6.4], ["c", -4.7, 9, -17.8, 9.5, -17.8, 9.5], ["l", -248.8, 30.5], ["c", -13.7, 1.7, -18, -11.3, -18, -11.3], ["c", 0, 0, -0.3, -0.8, -0.7, -1.9], ["c", -0.7, -1.7, -0.8, -3.5, -0.3, -5.2], ["z"]], "type": "path", "angle": 6.986793054697095, "width": 286.7504465974332, "height": 145.72319831651464, "scaleX": 2.083489119913629, "scaleY": 2.083489119913629}, "clipPathFitting": "manual"}, {"top": 347.5978475191034, "fill": "#00b3eb", "left": 594.9476771007623, "path": [["m", 686.3, 369.1], ["c", 4.7, -3.3, 11.3, -2.1, 14.6, 2.6], ["c", 3.3, 4.7, 2.1, 11.3, -2.6, 14.6], ["c", -4.7, 3.3, -11.3, 2.1, -14.6, -2.6], ["c", -3.3, -4.8, -2.2, -11.3, 2.6, -14.6], ["z"], ["m", -18.6, -9.7], ["l", 4.6, 7.9], ["c", 1.6, -1.3, 3.2, -2.5, 4.7, -3.6], ["c", 0.5, -0.4, 0.7, -0.8, 0.7, -1.3], ["c", 0, -0.7, -0.3, -2.2, -0.5, -2.9], ["c", -0.1, -0.5, -0.3, -0.7, -1, -0.9], ["c", -0.9, -0.3, -5.2, 0.2, -8.5, 0.8], ["z"], ["m", 3.4, 8.8], ["l", -4.9, -8.6], ["c", -1, 0.2, -1.8, 0.4, -2.1, 0.5], ["c", -2.3, 0.8, -4.6, 1.8, -6.6, 3.2], ["l", -6.6, 4.5], ["c", -0.4, 0.3, -0.7, 0.8, -0.6, 1.1], ["c", 0.4, 1.7, 1.6, 3.7, 4.8, 9.8], ["c", 0.9, 1.7, 0.7, 1.2, 2.4, 0], ["c", 4.1, -3, 9, -6.9, 13.6, -10.5], ["z"], ["m", 37.1, 4], ["c", 1.7, -1.3, 3.5, -2.9, 4.9, -4.2], ["c", 1.1, -1.1, 1.8, -2, 2, -2.6], ["c", 0.4, -2.1, -2.2, -5.6, -3.6, -7.5], ["c", -0.3, -0.5, -1.5, 0.4, -1.8, -0.1], ["c", -2.2, -2.8, -4.6, -5.8, -7, -8.6], ["c", -2.9, -3.3, -10.3, 1.7, -15.7, 3.4], ["c", -3.9, 1.2, -8, 0.9, -13.4, 1.9], ["c", -5.9, 1.1, -11.1, 2.1, -15.8, 5.4], ["c", -7.7, 5.4, -19.8, 12.4, -25.4, 19.7], ["c", -5.3, 7, -8.9, 15.3, -13.2, 22.9], ["c", -7.3, 6.3, -14.9, 14, -21.5, 21.5], ["c", -2.1, 2.4, -2.4, 4.4, -2.2, 6.5], ["c", 0.3, 2.3, 1, 4.1, 1.2, 5.4], ["c", -0.6, 0.5, -0.7, 0.3, -0.7, 0.9], ["c", 0.1, 0.5, 0.5, 1, 0.9, 1.6], ["c", 0.9, 1.5, 2.2, 3.4, 3.5, 4.4], ["c", 1.2, 1, 1.9, 1.4, 2.9, 1.4], ["c", 0.7, 0, 1.5, -0.1, 2.1, -0.5], ["l", 3, -1.9], ["c", 1.5, -1.5, 1, -1.5, -0.6, -3.7], ["c", -0.2, -0.3, -0.5, -0.7, -0.7, -1], ["c", -4.3, -6.2, -2.8, -14.7, 3.4, -18.9], ["c", 6.2, -4.3, 14.7, -2.8, 18.9, 3.4], ["c", 0.4, 0.6, 0.9, 1.3, 1.2, 1.9], ["c", 2.3, 3.9, 1.5, 3.5, 5.1, 1.3], ["l", 46.8, -32.7], ["c", 2.3, -2.1, 2.3, -1.7, -0.1, -4.6], ["c", -0.5, -0.6, -0.9, -1.2, -1.4, -1.8], ["c", -4.3, -6.2, -2.8, -14.7, 3.4, -18.9], ["c", 6.2, -4.3, 14.7, -2.8, 18.9, 3.4], ["c", 0.4, 0.5, 0.7, 1.1, 1, 1.6], ["c", 1.8, 2.4, 2.3, 1.7, 3.9, 0.4], ["z"], ["m", -75, 24.6], ["c", -0.1, -0.3, -0.4, -1.3, -0.9, -2.2], ["c", -0.9, -1.6, -3.8, 0.2, -5.4, 1.5], ["c", 1.6, -4.7, 4.6, -10.7, 7.9, -15.2], ["c", 1.2, -1.6, 4.9, -5.1, 7.7, -7.2], ["l", 3.6, -2.7], ["c", 0.7, -0.5, 1, -0.2, 1.1, 0.4], ["c", 0.6, 2.2, 3, 6.2, 4.4, 9.1], ["c", 0.7, 1.4, 0.6, 1.9, -0.7, 2.8], ["c", -4.8, 3.5, -17.6, 13.8, -17.7, 13.5], ["z"], ["m", -20.9, 23.7], ["c", 4.7, -3.3, 11.3, -2.1, 14.6, 2.6], ["c", 3.3, 4.7, 2.1, 11.3, -2.6, 14.6], ["c", -4.7, 3.3, -11.3, 2.1, -14.6, -2.6], ["c", -3.3, -4.7, -2.1, -11.3, 2.6, -14.6], ["z"]], "type": "path", "width": 119.69366359248, "height": 96.1021524808964, "fillRule": "evenodd"}, {"top": 112.25446856367464, "fill": "#fec925", "left": 883.9543281576885, "path": [["m", 990.1, 120.3], ["c", 5.3, -2.3, 11.5, 0.2, 13.7, 5.5], ["c", 2.3, 5.3, -0.2, 11.5, -5.5, 13.7], ["c", -5.3, 2.3, -11.5, -0.2, -13.7, -5.5], ["c", -2.3, -5.3, 0.2, -11.5, 5.5, -13.7], ["z"], ["m", -89.8, 56.4], ["c", 2.1, -0.6, 2.1, -2, 0.8, -4.3], ["c", -0.4, -0.7, -0.7, -1.4, -1.1, -2.2], ["c", -3, -6.9, 0.3, -14.8, 7.2, -17.7], ["c", 6.9, -3, 14.9, 0.1, 17.8, 7], ["c", 0.4, 0.8, 0.7, 1.7, 0.9, 2.5], ["c", 1, 3.1, 1.3, 4.9, 3.8, 3.8], ["l", 53.1, -22.6], ["c", 4.1, -1.7, 1.8, -2.1, -0.2, -6], ["c", -0.3, -0.6, -0.6, -1.3, -0.9, -1.9], ["c", -3, -6.9, 0.2, -14.9, 7.2, -17.9], ["c", 6.9, -3, 14.9, 0.2, 17.9, 7.2], ["c", 0.3, 0.7, 0.6, 1.4, 0.8, 2.1], ["c", 0.8, 2.5, 0.5, 4.1, 2.9, 3], ["c", 4.1, -1.9, 6.4, -5.9, 6.8, -10.3], ["c", 0.3, -2.8, 0.1, -4.1, -2.5, -5.1], ["c", -7.4, -3, -18.4, -1.1, -25.6, 1.2], ["c", -6, 1.9, -18.2, 8.2, -19.5, 9.5], ["c", -7.3, -0.3, -13.2, -0.4, -18.3, -0.3], ["c", -8.3, 0.2, -17, 2.7, -25.1, 6.5], ["c", -15, 7, -28.5, 18.5, -39.4, 28.3], ["c", -6.2, 5.6, 1.2, 3.3, 2.4, 8], ["c", 0.1, 0.6, 0.2, 1.2, 0.1, 1.9], ["c", -0.3, 2.5, -1.2, 4.8, 0.5, 6.6], ["c", 2.5, 2.4, 6.7, 1.7, 10.4, 0.7], ["z"], ["m", 29.5, -35.3], ["c", 1.2, 1.6, 1, 1.9, -1, 2.1], ["c", -2.9, 0.2, -8, 0, -10.6, -1.4], ["c", -1.5, -0.8, -1.2, -1.2, -0.3, -2.3], ["c", 1, -1.3, 3.2, -3.1, 4.5, -4], ["c", 0.5, -0.4, 1.2, -0.7, 1.9, -0.3], ["c", 2.2, 1.5, 4, 3.8, 5.5, 5.9], ["z"], ["m", 27.3, -9.3], ["c", 0.3, 0.4, 0.4, 0.5, 0, 0.8], ["c", -2.2, 1.8, -15.2, 6.8, -20.4, 8.1], ["c", -1.7, 0.4, -3.2, -1.2, -4.3, -2.2], ["c", -1.8, -1.6, -3.6, -3.5, -4.9, -4.8], ["c", -0.7, -0.7, 0, -1.3, 1.2, -1.7], ["c", 2.4, -0.9, 4.8, -1.9, 7.2, -2.7], ["c", 4.7, -1.5, 8.9, -2.4, 13.8, -2.6], ["c", 3.5, -0.2, 6.8, 0, 9.6, 0.4], ["c", 0.8, 0.1, 1, 0.3, 0.1, 0.6], ["c", -1.9, 0.5, -4.1, 1.1, -3.5, 2.5], ["c", 0.4, 0.6, 0.9, 1.2, 1.2, 1.6], ["z"], ["m", -48.9, 23.2], ["c", 5.3, -2.3, 11.5, 0.2, 13.7, 5.5], ["c", 2.3, 5.3, -0.2, 11.5, -5.5, 13.7], ["c", -5.3, 2.2, -11.5, -0.2, -13.7, -5.5], ["c", -2.3, -5.3, 0.2, -11.4, 5.5, -13.7], ["z"]], "type": "path", "width": 132.95095803695267, "height": 64.87053143632535, "fillRule": "evenodd"}, {"top": 39.60903468321344, "fill": "#5ab18f", "left": 722.2906004417582, "path": [["m", 795.8, 139.2], ["c", 0.7, 0.7, 1.4, 1.3, 2, 1.9], ["c", 1.1, 1, 2.1, 1.7, 2.8, 1.8], ["c", 1.5, 0.2, 2.8, -0.5, 4.6, -1.9], ["c", 1.5, -1.2, 3, -1.8, 2.5, -3.5], ["c", -0.2, -0.6, -0.4, -1.3, -0.2, -1.5], ["c", 2.6, -2.4, 2.3, -2.2, 4.9, -4.8], ["c", 1.1, -1.1, 1.2, -2.8, 0.5, -4.7], ["c", -3.3, -8.4, -7.4, -14.4, -13, -21.9], ["c", -1.1, -1.5, -2.4, -0.8, -4.2, -1.8], ["c", -1.8, -1, -1.9, -1.4, -1.1, -2], ["c", 0.6, -0.5, 1.3, -1, 1.9, -1.5], ["c", 0.2, -0.2, 0.3, -0.5, 0.1, -0.7], ["c", -0.3, -0.5, -0.7, -1, -1, -1.5], ["c", -0.2, -0.2, -0.5, -0.2, -0.8, -0.1], ["c", -0.6, 0.3, -1.3, 0.7, -1.9, 1], ["c", -1.3, 0.7, -1.9, 0.9, -2.9, -0.1], ["c", -4.7, -4.6, -10.9, -10.8, -14.8, -16.1], ["c", -1.1, -1.6, -1.1, -1.1, 0.4, -1.8], ["c", 0.5, -0.2, 1, -0.4, 1.4, -0.7], ["c", 1.5, -1.1, -0.5, -3.7, -1.9, -5.2], ["c", 3.6, 0.9, 10.6, 3.3, 15.5, 5.7], ["c", 0.7, 0.3, 0.9, 0.6, 1.2, -0.2], ["c", 0.1, -0.3, 0.2, -0.5, 0.3, -0.8], ["c", 0.2, -0.6, -0.1, -0.8, -0.6, -1.1], ["c", -7.4, -4.4, -15.4, -7.4, -22.6, -10.3], ["c", -6.5, -7.1, -18.1, -20.5, -26.8, -26], ["c", -2.7, -1.7, -5.2, -1.4, -7.3, -0.9], ["c", -2.2, 0.5, -2.9, 0.4, -4.1, 0.7], ["c", -0.5, -0.6, -0.7, -0.4, -1.2, -0.3], ["c", -0.5, 0.1, -1.7, 1.2, -2.2, 1.6], ["c", -0.7, 0.6, -1.8, 1.6, -2.5, 2.2], ["c", -1.4, 1.4, -2.1, 2.3, -2, 3.6], ["c", 0, 0.7, 0.3, 1.7, 0.8, 2.3], ["l", 1.9, 2.5], ["c", 1.4, 1.3, 1.5, 1.7, 3.2, 0], ["c", 0.5, -0.5, 1, -1, 1.6, -1.4], ["c", 5.8, -4.7, 14.4, -3.8, 19.1, 2], ["c", 4.7, 5.8, 3.8, 14.4, -2, 19.1], ["c", -1.1, 0.9, -2.3, 1.7, -3.5, 2.3], ["c", -2.1, 1, -1.6, 1, -0.5, 2.6], ["l", 30.7, 37.8], ["c", 1.3, 1.1, 2.5, 1.6, 4.1, -0.1], ["c", 0.7, -0.7, 1.4, -1.3, 2.2, -1.9], ["c", 5.8, -4.7, 14.4, -3.8, 19.1, 2], ["c", 4.7, 5.8, 3.8, 14.4, -2, 19.1], ["c", -0.6, 0.5, -1.2, 1, -1.8, 1.5], ["c", -1.5, 1.3, -1.6, 1.5, 0.1, 3.1], ["z"], ["M", 747.1, 55.6], ["c", 3.6, 4.5, 3, 11.1, -1.5, 14.7], ["c", -4.5, 3.6, -11.1, 3, -14.7, -1.5], ["c", -3.6, -4.5, -3, -11.1, 1.5, -14.7], ["c", 4.5, -3.7, 11.1, -3, 14.7, 1.5], ["z"], ["m", 50.2, 61.9], ["c", 3.6, 4.5, 3, 11.1, -1.5, 14.7], ["c", -4.5, 3.6, -11.1, 3, -14.7, -1.5], ["c", -3.6, -4.5, -3, -11.1, 1.5, -14.7], ["c", 4.4, -3.7, 11, -3, 14.7, 1.5], ["z"]], "type": "path", "width": 90.5532669369203, "height": 102.8245782082462, "fillRule": "evenodd"}, {"top": 375.8761903724138, "fill": "#fec925", "left": 805.8636157854313, "path": [["m", 808.3, 398.1], ["c", 2.3, 2.4, 2.2, 1.7, 3.6, -0.5], ["c", 0.4, -0.5, 0.8, -1.1, 1.2, -1.6], ["c", 4.5, -6, 13, -7.3, 19, -2.9], ["c", 6, 4.5, 7.3, 13, 2.9, 19], ["c", -0.6, 0.8, -1.2, 1.6, -1.9, 2.3], ["c", -2.1, 2.4, -1.5, 2.5, 0.2, 4.1], ["l", 44, 32.5], ["c", 2.7, 1.8, 1.6, 1.4, 3.4, -1.4], ["c", 0.5, -0.8, 1.1, -1.7, 1.8, -2.5], ["c", 4.5, -6, 13, -7.3, 19, -2.9], ["c", 6, 4.5, 7.3, 13, 2.9, 19], ["c", -0.5, 0.6, -0.9, 1.2, -1.4, 1.8], ["c", -1.4, 1.6, -0.9, 1.8, 0.2, 3], ["l", 2.7, 1.8], ["c", 1.5, 1, 3.2, 1.1, 4.6, 0.1], ["c", 1.8, -1.4, 2.6, -2.9, 4, -4.7], ["c", 0.9, -1.1, 1.3, -2.2, 0.4, -2.9], ["c", 0.3, -1.2, 0.6, -2.5, 1, -4.7], ["c", 0.3, -2.1, 0.1, -4.1, -1.9, -6.6], ["c", -4.2, -5.3, -11.8, -13.3, -21.2, -23.1], ["c", -3.3, -8.3, -6.9, -15.7, -12, -22.8], ["c", -6.3, -8.6, -25.6, -20.7, -34.8, -25.7], ["c", -1.9, -1, -1.6, -0.6, -3.6, -1.1], ["c", -3.1, -0.8, -12.1, -1.7, -15.3, -1.9], ["c", -2.7, -0.2, -4.2, 0.9, -5.1, 1.8], ["c", -2.5, 2.7, -7.5, 7, -9.8, 9.7], ["c", -0.4, 0.4, -1.5, -0.4, -1.8, 0.1], ["c", -1.4, 1.8, -4.4, 5.1, -4, 7.2], ["c", 0.1, 0.8, 0.9, 1.8, 1.9, 2.9], ["z"], ["m", 49.9, 5.8], ["c", -0.9, 1.6, -0.7, 1.2, -2.4, -0.1], ["c", -5.9, -4.5, -12.1, -10, -18, -14.7], ["c", -0.5, -0.4, -0.7, -0.8, -0.6, -1.3], ["c", 0, -0.7, 3.8, -1.6, 4.3, -1.7], ["c", 1.4, -0.4, 6.6, -1.6, 8.2, -0.9], ["c", 4.5, 1.9, 8.9, 5.3, 13, 8], ["c", 0.4, 0.3, 0.5, 1.1, 0.5, 1.3], ["c", -0.5, 1.7, -1.6, 3.4, -5, 9.4], ["z"], ["m", 21.3, 18.7], ["c", -0.1, 0.3, -12.6, -10.3, -17.4, -14], ["c", -1.2, -0.9, -1.3, -1.4, -0.6, -2.8], ["c", 1.5, -2.8, 3.6, -7, 4.6, -8.9], ["c", 0.3, -0.6, 0.5, -0.9, 1.1, -0.4], ["c", 3.7, 2.9, 8.4, 6.4, 11.1, 10.2], ["c", 3.2, 4.6, 6.6, 11.1, 8.1, 15.8], ["c", -1.6, -1.3, -4.9, -3.6, -5.9, -2.1], ["c", -0.6, 0.9, -0.9, 2, -1, 2.2], ["z"], ["m", -49.2, -26.9], ["c", 4.7, 3.4, 5.6, 10, 2.2, 14.6], ["c", -3.4, 4.7, -10, 5.6, -14.6, 2.2], ["c", -4.6, -3.4, -5.6, -10, -2.2, -14.6], ["c", 3.4, -4.7, 9.9, -5.7, 14.6, -2.2], ["z"], ["m", 69.4, 51.2], ["c", 4.7, 3.4, 5.6, 10, 2.2, 14.6], ["c", -3.4, 4.7, -10, 5.6, -14.6, 2.2], ["c", -4.7, -3.4, -5.6, -10, -2.2, -14.6], ["c", 3.4, -4.7, 10, -5.6, 14.6, -2.2], ["z"]], "type": "path", "width": 109.64821853409536, "height": 94.22568151424684, "fillRule": "evenodd"}, {"top": 117.53946602003576, "fill": "#fa1e44", "left": 571.3555555555554, "path": [["m", 680.3, 196.7], ["c", 1.9, 0.9, 4.1, 2, 5.8, 2.7], ["c", 1.4, 0.6, 2.6, 0.8, 3.2, 0.7], ["c", 2, -0.5, 4.1, -4.4, 5.3, -6.4], ["c", 0.3, -0.5, -0.9, -1.2, -0.7, -1.7], ["c", 1.6, -3.1, 2.9, -5.9, 4.4, -9.2], ["c", 0.6, -1.4, 0.2, -3.1, -1.2, -4.6], ["c", -4, -4.4, -14.9, -12.7, -20.3, -16.2], ["l", -1.7, -1.1], ["l", -1.5, -1.4], ["c", -1.3, -0.5, -1, -0.6, -2, 0.4], ["c", -0.8, 0.9, -2.2, 1.9, -3.6, 1.2], ["c", -4.9, -2.6, -9.8, -5.4, -14.5, -7.9], ["c", -0.5, -0.3, -0.9, -0.9, -0.6, -1.5], ["l", 1.3, -2.1], ["c", 0.1, -0.2, 0.1, -0.5, -0.1, -0.7], ["l", -1.5, -1.1], ["c", -0.2, -0.2, -0.6, 0, -0.7, 0.2], ["l", -1.4, 1.6], ["c", -1, 1.1, -1.4, 1.3, -2.6, 0.7], ["l", -20.4, -10.8], ["c", -0.2, -0.1, 1, -0.9, 1.6, -1.8], ["c", 1, -1.5, -3.3, -4.4, -5.1, -5.3], ["c", 3.7, -0.5, 11.1, -0.3, 17.5, 0.2], ["c", 0.7, 0.1, 1.1, 0.2, 1.1, -0.6], ["v", -0.8], ["c", 0, -0.6, -0.4, -0.8, -1, -0.8], ["c", -9.2, -0.8, -15.6, -1.4, -24.9, -1.4], ["c", -8.8, -4, -19, -7.7, -28.6, -10.5], ["c", -3.1, -0.9, -5, -0.4, -6.8, 0.8], ["c", -1.9, 1.2, -3.3, 2.6, -4.3, 3.4], ["c", -0.7, -0.3, -0.8, -0.1, -1.3, 0.1], ["c", -0.4, 0.2, -1.2, 1.7, -1.5, 2.3], ["c", -0.5, 0.8, -1.1, 2.1, -1.5, 3], ["c", -0.8, 1.8, -1.1, 2.9, -0.6, 4], ["c", 0.3, 0.7, 0.9, 1.3, 1.6, 1.8], ["l", 2.6, 1.6], ["c", 1.9, 0.8, 2.1, 1.1, 3.2, -1.2], ["c", 0.3, -0.5, 0.5, -1.1, 0.9, -1.6], ["c", 3.8, -6.5, 12.1, -8.7, 18.6, -4.9], ["c", 6.5, 3.8, 8.7, 12.1, 4.9, 18.6], ["c", -0.5, 0.9, -1.1, 1.8, -1.7, 2.6], ["c", -2.3, 2.8, -1.5, 2.6, 0.9, 4], ["l", 49.6, 29], ["c", 1.8, 0.6, 2.4, 1, 3.5, -1.5], ["c", 0.4, -0.9, 0.9, -1.8, 1.4, -2.7], ["c", 3.8, -6.5, 12.1, -8.7, 18.6, -4.9], ["c", 6.5, 3.8, 8.7, 12.1, 4.9, 18.6], ["c", -0.3, 0.4, -0.5, 0.9, -0.8, 1.3], ["c", -1.7, 2.4, -1.9, 3, 0, 3.9], ["z"], ["m", -6.1, -21], ["c", 5, 2.9, 6.7, 9.3, 3.7, 14.3], ["c", -2.9, 5, -9.3, 6.7, -14.3, 3.7], ["c", -5, -2.9, -6.7, -9.3, -3.7, -14.3], ["c", 3, -5, 9.3, -6.6, 14.3, -3.7], ["z"], ["m", -77.1, -45.1], ["c", 5, 2.9, 6.7, 9.3, 3.7, 14.3], ["c", -3, 5, -9.3, 6.7, -14.3, 3.7], ["c", -5, -2.9, -6.7, -9.3, -3.7, -14.3], ["c", 3, -5, 9.3, -6.6, 14.3, -3.7], ["z"]], "type": "path", "width": 126.71444444444444, "height": 82.08508930030096, "fillRule": "evenodd"}, {"top": 234.86703066884348, "fill": "#fa1e44", "left": 782.7195248980114, "text": "Son!", "type": "i-text", "angle": 11.221165, "width": 291.19378944440643, "height": 175.0260613966, "stroke": "white", "originX": "center", "fontSize": 154.89031982, "textLines": [4], "fontFamily": "Baloo 2", "paintFirst": "stroke", "strokeWidth": 10, "strokeLineCap": "round", "strokeLineJoin": "round"}, {"top": 177.20366386354584, "fill": "#00b3eb", "left": 776.6228100062534, "text": "Birthday,", "type": "i-text", "angle": 6.4249787, "width": 316.6557237574565, "height": 94.8372535691, "stroke": "white", "originX": "center", "fontSize": 83.92677307, "textLines": [9], "fontFamily": "Baloo 2", "paintFirst": "stroke", "strokeWidth": 10, "strokeLineCap": "round", "strokeLineJoin": "round"}, {"top": 111.30856862228788, "fill": "#00b3eb", "left": 819.233111170798, "text": "Happy", "type": "i-text", "angle": 14.61991, "width": 228.3640839379128, "height": 94.8369776909, "scaleX": 1.0, "stroke": "white", "originX": "center", "fontSize": 83.92652893, "textLines": [5], "fontFamily": "Baloo 2", "paintFirst": "stroke", "strokeWidth": 10, "strokeLineCap": "round", "strokeLineJoin": "round"}], "contentOrigin": "top-left", "backgroundColor": "#caf1ffff"}
	},
	slide: {
		// clipPath: {
		// 	type: "rect",
		// 	left: 0,
		// 	top: 0,
		// 	width: 960,
		// 	height: 1920
		// },
		objects: [
			// "background",
			// "puzzle",
			// "lightGreen",
			// "arial",
			// "bow",
			// "group",
			"puzzleText",
			"tpl"
		],
		"width": 960,
		"height": 1920
	}
})
.then(app => {
})
