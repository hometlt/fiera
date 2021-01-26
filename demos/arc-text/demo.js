import '../../src/core/plugins.js'
import '../../src/core/text.ext.js'
// import '../../src/core/states.js'
// import '../../src/core/event-listeners.js'

import {createTools}		from '../lib/tools.js'
import {FmInitialize}		from '../../src/core/object.initialize.js'
import {FmSetters} 			from '../../src/core/object.options.js'
import {FmTarget} 			from '../../src/core/target.js';
import {FmArcText}      	from '../../src/text/ArcText.js'
import {FmTyprRender}   	from '../../src/fonts/typrRender.js'
// import {FmFontkitRender}   	from '../../src/fonts/fontkitRender.js'
import {FmEmoji}	    	from '../../src/text/emojis.js'
import {FmOuterCanvas}  	from '../../src/canvas/outer-canvas.js'
import {FmGoogleFonts} 		from '../../src/fonts/googleFonts.js'
import {FmStates} 			from '../../src/core/states.js';
import {FmObservable} 		from '../../src/core/event-listeners.js';
import '../../src/canvas/controls.4X.js'

// import {FmRelative} 		from "../../src/objects/relative.js";
// import {FmSpacing}			from '../../src/modules/spacing.js'
// import {FmTransformations}  from '../../src/modules/transformations.js';

function initFabric(){
	//Setting Up Fonts and  Emojis Paths
	let baseUrl = ''
	fabric.initialize({
		plugins: [
			// FmSpacing,
			FmInitialize,
			FmSetters,
			// FmRelative,
			FmTarget,
			FmArcText,
			FmStates,
			FmTyprRender,
			// FmFontkitRender,
			FmEmoji,
			FmOuterCanvas,
			FmObservable,
			FmGoogleFonts,
			// FmTransformations
		],
		mediaRoot: baseUrl,
		fontsRoot: baseUrl + 'fonts/'
	})
	fabric.fonts.calcCharBound = true;

	fabric.extendPrototypes({
		Canvas: {
			stateful: true
		},
		Object: {
			borderColor: 'rgb(0 142 122)',
			cornerColor: 'rgb(0 142 122)'
		},
		IText: {
			editingBorderColor: 'rgb(0 142 122)'
		},
		Text: {
			emojisPath: baseUrl + 'emoji/*.svg'
		}
	})

	// fabric.fonts.loadFontsDeclarations(fabric.fonts.fallbacks)
	fabric.fonts.registerFonts({
		"Mr Dafoe": {
			// format: 'svg',
			src: "https://fonts.gstatic.com/s/mrdafoe/v9/lJwE-pIzkS5NXuMMrGiqg7MCxz_C.ttf"
		},
		"Sacramento": {
			// format: 'svg',
			src: "https://fonts.gstatic.com/s/sacramento/v8/buEzpo6gcdjy0EiZMBUG0CoV_NxLeiw.ttf"
		},
		"Faster One": {
			// format: 'svg',
			src: "https://fonts.gstatic.com/s/fasterone/v12/H4ciBXCHmdfClFb-vWhfyLuShq63czE.ttf"
		},
		'Gilbert Color': {
			format: 'svg',
			src: 'color/GilbertColor.otf'
		},
		'Bungee Color': {
			format: 'svg',
			src: 'color/BungeeColor.ttf'
		},
		'Abelone': {
			format: 'svg',
			src: 'color/Abelone.otf'
		},
		'NTBixa': {
			format: 'svg',
			src: 'color/NTBixaColor.otf'
		},
		'Playbox': {
			format: 'svg',
			src: 'color/PlayboxColor.otf'
		},
		'Papyrus': {
			src: 'custom/Papyrus.ttf'
		},
		'JetBrainsMono': {
			features: {
				calt: ['--', '---', '==', '===', '!=', '!==', '=!=', '=:=', '=/=', '<=', '>=', '&&', '&&&', '&=', '++', '+++', '***', ';;', '!!', '??', '?:', '?.', '?=', '<:', ':<', ':>', '>:', '<>', '<<<', '>>>', '<<', '>>', '||', '-|', '_|_', '|-', '||-', '|=', '||=', '##', '###', '####', '#{', '#[', ']#', '#(', '#?', '#_', '#_(', '#:', '#!', '#=', '^=', '<$>', '<$', '$>', '<+>', '<+', '+>', '<*>', '<*', '*>', '</', '</>', '/>', '<!--', '<#--', '-->', '->', '->>', '<<-', '<-', '<=<', '=<<', '<<=', '<==', '<=>', '<==>', '==>', '=>', '=>>', '>=>', '>>=', '>>-', '>-', '>--', '-<', '-<<', '>->', '<-<', '<-|', '<=|', '|=>', '|->', '<->', '<~~', '<~', '<~>', '~~', '~~>', '~>', '~-', '-~', '~@', '[||]', '|]', '[|', '|}', '{|', '[<', '>]', '|>', '<|', '||>', '<||', '|||>', '<|||', '<|>', '...', '..', '.=', '.-', '..<', '.?', '::', ':::', ':=', '::=', ':?', ':?>', '//', '///', '/*', '*/', '/=', '//=', '/==', '@_', '__']
			},
			src: {
				n7: 'custom/JetBrainsMono/JetBrainsMono-Bold.ttf',
				i7: 'custom/JetBrainsMono/JetBrainsMono-Bold-Italic.ttf',
				i4: 'custom/JetBrainsMono/JetBrainsMono-Italic.ttf',
				n4: 'custom/JetBrainsMono/JetBrainsMono-Regular.ttf',
			}
		}
	})

	//Setting Up Canvas and Objects controls overflow
	const canvas =  new fabric.Canvas('canvas')
	canvas.setDimensions({width: document.body.clientWidth - 100, height: document.body.clientHeight - 110})
	canvas.setOuterCanvasContainer('fiera-area');
	canvas.setOuterCanvasOpacity(0.1);
	canvas.initEventListeners()

	canvas.on('target:changed',({selected})=> {
		window.target = selected
	})

	//active object observer
	canvas.$activeobject = function(callback){
		this.on('target:changed',({selected,deselected})=>{
			callback(selected, deselected && deselected[0])
		})
	}

	window.canvas = canvas;
	window.target = null;
}

function setStyles(...intervals){
	let style = {};
	for(let interval of intervals){
		for(let i = interval.end; i >= interval.start;i--) {
			style[i] = interval.styles
		}
	}
	return style;
}

let greyStyle = {fill: 'grey',fontSize: 14}

let styles = {
	0: setStyles(
		{start: 0, end: 13, styles: greyStyle},
		{start: 32, end: 33, styles:  {fontFamily: 'Segoe UI Symbol'}},
	),
	1: setStyles(
		{start: 0, end: 10, styles: greyStyle},
		{start: 11, end: 14, styles:  {'fontSize': 50}},
		{start: 16, end: 25, styles:  {'underline': true, 'overline': true, 'linethrough': true}},
		{start: 27, end: 36, styles:  {'textBackgroundColor': 'red'}}
	),
	2: setStyles(
		{start: 0, end: 10, styles:greyStyle},
		{start: 12, end: 21, styles:  {fontFamily: 'Playbox'}},
	),
	3:  setStyles(
		{start: 0, end: 20, styles: greyStyle},
		{start: 20, end: 46, styles:  {fontFamily: 'Roboto'}},
	),
	4:  setStyles(
		{start: 0, end: 19, styles: greyStyle},
		{start: 20, end: 81, styles:  {fontFamily: 'JetBrainsMono',fontSize: 14}},
	)
}

let testText =[
	'1. Diacritics: Ẫ L͡orem ipsum',
	'2. Styled: Size Decoration Background',
	'3. Renders: Playbox ❤ 😀 👨‍👨‍👧‍👧  7⃣ ',
	'4. Common Ligatures: Roboto fl fi ffl ffi',
	'5. Other Ligatures: JBMono ==>> =>> >><< <<= <<== !=== !!== !== == === ==== ===!='
].join('\n')


// curvedText1.setFontFamily('Roboto')
// curvedText1.setCurvature(20)
// curvedText2.setFontFamily('Roboto')
// curvedText3.setCurvature(-20)
// curvedText3.setFontFamily('Roboto')
//
// canvas.add(
// 	curvedText1,
// 	curvedText2,
// 	curvedText3
// )



let fallbacksTest = [
	'',
	'🇬🇧 Simply',
	'🇷🇺 Просто',
	'🇨🇳 简单地说',
	'🇰🇵 간단히말',
	'🇯🇵 単に言う'
].join('\n')

let languagesTest =  [
	'English ff ffi fl fi',
	'CN 简单地说 KP 간단히말',
	'Russian Здрасте Kyrgyz жөнөкөй Greek Απλά',
	'Arabian مرحبا Iran به سادگی sindhi سادو  pashto په ساده ډول ',
	'Gurmukhī ਗੁਰਮੁਖੀ Tamil தேவநாகரி punjabi ਬਸ',
	'Gujarati ગુજરાતી Oriya ଦେବନାଗ',
	'Telugu దేవనాగరి Kannada ದೇವನಾಗರಿ',
	'Malayalam ദേവനാഗരിSinhala දේවානගරි',
	'Armenian Պարզապես',
	'Azerbaijani Sadəcə',
	'Gujarati ખાલી',
	'🇮🇱 Hebrew בפשטות',
	'🇮🇳 केवल',
	'🇧🇩 কেবল',
	'Khmer ជា​ធម្មតា',
	'Lao ງ່າຍໆ',
	'Amharic ዴቫንጋሪ',
	'myanmar ရိုးရိုးလေးပါ	',
	'thai ง่ายดาย`'
].join('\n')

let emojisTest =[
	'Simple: ❤ 🧡 💛 💚 💙 💜 🖤 💔 ✅ ❎ ❤ 💛 ✊ ✊🏼',
	'Force Text Symbol: 7⃣\uFE0E 7⃣ ®\uFE0E ®\uFE0F ©\uFE0E ©\uFE0F 😀\uFE0E 😀',
	'ZWJ Sequences, Fitzpatrick: 👨‍👨‍👧‍👧 👩🏾‍🤝‍👨🏿 🏇🏼 🤹🏽‍♀️',
	'Unicode11: 🚆 🚇 🛤 🌄 🌇 🌆 🏙 🌃 🌌 🌉 🌁',
	'Unicode12: 🧏‍♂\uFE0F 🧏‍♀\uFE0F 🟥 🟧 🟨 🟩 🟦 🟪 🟫	',
	'Unicode13: 🐈‍⬛ 🐻‍❄\uFE0F 👩🏼‍🍼'
].join('\n')

let colorTest = [
	'Default',
	'Gilbert Color',
	'Bungee Color',
	'Abelone',
	'NTBixa',
	'PlayBox ПлейBox'
].join('\n')

let fontsArray = [
	'Abelone',
	'Arial',
	'Bungee Color',
	'Gilbert Color',
	'JetBrainsMono',
	'Monoton',
	'NTBixa',
	'Pacifico',
	'Playbox',
	'Mr Dafoe',
	'Faster One',
	'Roboto',
	'Segoe UI Symbol',
	'Times New Roman'
]

initFabric()

// testCurvedText()

// testFonts()


const boundingBoxTestObjects = {
	// Roboto: {
	// 	type: 'i-text',
	// 	text: "Roboto",
	// 	fontFamily: 'Roboto',
	// 	textBackgroundColor: '#ee7dff44',
	// 	movementLimits: "canvas",
	// 	top: 0,
	// 	scaleX: 1,
	// 	scaleY: 1,
	// 	left: 100,
	// 	fontSize: 100
	// },
	Sacrament: {
		backgroundColor: "yellow",
		type: 'i-text',
		text: "Sacrament",
		fontFamily: 'Sacramento',
		textBackgroundColor: '#ee7dff44',
		movementLimits: "canvas",
		top: 300,
		scaleX: 1,
		scaleY: 1,
		left: 100,
		fontSize: 50
	},
	FasterOne: {
		backgroundColor: "yellow",
		type: 'i-text',
		text: "Faster One",
		fontFamily: 'Faster One',
		textBackgroundColor: '#ee7dff44',
		top: 400,
		left: 100,
		fontSize: 50
	},
	MrDafoe: {
		backgroundColor: "yellow",
		type: 'i-text',
		text: "Mr Dafoe",
		fontFamily: 'Mr Dafoe',
		textBackgroundColor: '#ee7dff44',
		top: 200,
		left: 100,
		fontSize: 50
	},
	Playbox: {
		backgroundColor: "yellow",
		type: 'i-text',
		text: "Playbox",
		fontFamily: 'Playbox',
		textBackgroundColor: '#ee7dff44',
		top: 500,
		left: 100,
		fontSize: 50
	},
	Papyrus: {
		backgroundColor: "yellow",
		type: 'i-text',
		text: "fff Papyrus fff\nfff  Papyrus  fff",
		fontFamily: 'Arial',
		// textBackgroundColor: '#ee7dff44',
		styles: {
			0: setStyles(
				{start: 0, end: 2, styles: {fontFamily: 'Mr Dafoe', textBackgroundColor: 'rgba(255,26,26,0.27)'}},
				{start: 4, end: 10, styles: {fontFamily: 'Papyrus', textBackgroundColor: 'rgba(51,255,42,0.27)'}},
				{start: 12, end: 15, styles: {fontFamily: 'Mr Dafoe', textBackgroundColor: 'rgba(255,26,26,0.27)'}},
			),
			1: setStyles(
				{start: 0, end: 2, styles: {fontFamily: 'Mr Dafoe', textBackgroundColor: 'rgba(255,26,26,0.27)'}},
				{start: 5, end: 11, styles: {fontFamily: 'Papyrus', textBackgroundColor: 'rgba(51,255,42,0.27)'}},
				{start: 14, end: 16, styles: {fontFamily: 'Mr Dafoe', textBackgroundColor: 'rgba(255,26,26,0.27)'}},
			)
		},
		top: 600,
		left: 100,
		fontSize: 50
	},
	ArialGradientEmoji: {
		backgroundColor: "yellow",
		type: 'i-text',
		text: "Arial Gradient ❤ 🧡 💛",
		fontFamily: 'Arial',
		fill: new fabric.Gradient({
			coords: {
				x1: 0,
				y1: 0,
				x2: 100,
				y2: 100,
			},
			colorStops: [
				{offset: 0, color: "red", opacity: 1},
				{offset: 1, color: "blue", opacity: 1}
			]
		}),
		textBackgroundColor: '#ee7dff44',
		top: 100,
		left: 100,
		fontSize: 50
	}
}

const fontsTestObjects= {
	colorFonts: {
		type: 'textbox',
		text: colorTest,
		styles: {
			0: setStyles({start: 0, end: 13, styles: {strokeWidth: 1, stroke: 'red'}}),
			1: setStyles({start: 0, end: 13, styles: {fontFamily: 'Gilbert Color', strokeWidth: 1, stroke: 'red'}}),
			2: setStyles({start: 0, end: 12, styles: {fontFamily: 'Bungee Color'}}),
			3: setStyles({start: 0, end: 7, styles: {fontFamily: 'Abelone'}}),
			4: setStyles({start: 0, end: 6, styles: {fontFamily: 'NTBixa'}}),
			5: setStyles({start: 0, end: 20, styles: {fontFamily: 'Playbox'}})
		},
		fontFamily: 'Arial',
		paintFirst: 'fill',
		fontSize: 30,
		top: 200,
		left: 800,
		lineHeight: 1,
		width: 300
	},
	emojisTest: {
		type: 'textbox',
		text: emojisTest,
		fontFamily: 'Segoe UI Symbol',
		top: 600,
		left: 800,
		width: 700,
		fontSize: 25
	},
	languages: {
		text: languagesTest,
		type: 'textbox',
		top: 0,
		left: 1200,
		width: 300,
		fontFamily: 'Roboto',
		fontSize: 20
	},
	serifFallbacks: {
		type: 'textbox',
		text: 'serif' + fallbacksTest,
		fontFamily: 'Times New Roman, SimSun, Nanum Myeongjo, serif',
		top: 0,
		lineHeight: 1,
		left: 800,
		width: 200,
		fontSize: 18
	},
	saerifFallbacks: {
		type: 'textbox',
		text: 'sans-serif' + fallbacksTest,
		fontFamily: 'Arial, sans-serif', //sans-serif fonts used by default. dont need to specify SimHei and Malgun Gothic
		top: 0,
		lineHeight: 1,
		left: 900,
		width: 200,
		fontSize: 18
	},
	cursiveFallbacks: {
		type: 'textbox',
		text: 'cursive' + fallbacksTest,
		fontFamily: 'Lobster, Ma Shan Zheng, Sawarabi Mincho, Stylish, cursive',
		top: 0,
		lineHeight: 1,
		left: 1000,
		width: 200,
		fontSize: 18
	}
}

const curvedObjects = {
	curvedText1:{
		type: "i-text",
			text: testText,
			styles,
			fontFamily: 'Arial',
			curvature: 20,
			fontSize: 25,
			textAlign: 'center',
			top: 50,
			left: 300,
			originX : 'center',
			width: 400
	},
	curvedText2 :{
		type: "i-text",
			text: testText,
			styles,
			fontFamily: 'Arial',
			fontSize: 25,
			textAlign: 'center',
			top: 350,
			left: 300,
			originX : 'center',
			width: 400
	},
	curvedText3: {
		type: "i-text",
		text: testText,
		styles,
		fontFamily: 'Arial',
		curvature: -20,
		fontSize: 25,
		textAlign: 'center',
		top: 650,
		left: 300,
		originX : 'center',
		width: 400
	}
}

const elementsList = {
	"Bounding Box": Object.values(boundingBoxTestObjects),
	"Curving": Object.values(curvedObjects),
	"Fonts": Object.values(fontsTestObjects),
	"❌Kerning": [
		{
			type: 'i-text',
			fontSize: 25,
			renderer: "typr",
			text: "TYPR renderer: \n1111111111",
			styles: {
				1: setStyles({start: 0, end: 10, styles: {fontFamily: 'Mr Dafoe',textBackgroundColor: '#ee7dff44',fontSize: 50}})
			},
			top: 100,
			left: 100
		},
		{
			type: 'i-text',
			fontSize: 25,
			renderer: "default",
			text: "default renderer: \n1111111111",
			styles: {
				1: setStyles({start: 0, end: 10, styles: {fontFamily: 'Mr Dafoe',textBackgroundColor: '#ee7dff44',fontSize: 50}})
			},
			top: 200,
			left: 100,

		}
	]
}

const tools = {
	fontFamily: {
		caption: 'Font Family',
		type: 'select',
		options: fontsArray,
		change: (value) => target.setStyle('fontFamily', value),
		value: () => target.getStyle('fontFamily'),
		enabled: () => target && target.isText,
		observe: cb => canvas.on('target:changed target:modified $activeobject.mouseup', cb)
	},
	fontSize: {
		caption: 'Font Size',
		type: 'number',
		change: (value) => target.setStyle('fontSize', value),
		value: () => target.getStyle('fontSize'),
		enabled: () => target && target.isText,
		observe: cb => canvas.on('target:changed target:modified $activeobject.mouseup', cb)
	},
	fontColor: {
		caption: 'Color',
		type: 'color',
		change: (value) => target.setStyle('fill', value),
		value: () => target.getStyle('fill'),
		enabled: () => target && target.isText,
		observe: cb => canvas.on('target:changed target:modified $activeobject.mouseup', cb)
	}
}

createTools({
	container: 'tools',
	tools: [
		tools.fontFamily,
		{
			caption: 'Curvature',
			type: 'group',
			tools: [
				{
					type: 'checkbox',
					lblClass: "tool-button-icon fas fa-eye",
					change: (value) => {canvas.showControlsGuidlines = value;canvas.renderAll()},
					value: () => canvas.showControlsGuidlines
				},
				{
					type: 'crange',
					min: -150,
					max: 150,
					on: () => target._lastCurvature || 25,
					off: () => {target._lastCurvature = target.curvature;return 0},
					change: (value) => target.setCurvature(value),
					value: () => target.curvature,
					enabled: () => target?.isText,
					observe: cb => canvas.on('target:changed target:modified', cb)
				}
			],
		},
		{
			caption: 'Text Style',
			type: 'group',
			tools: [
				{
					type: 'checkbox',
					lblClass: "tool-button-icon fa fa-underline",
					change: (value) => target.setStyle("underline",value),
					value: () => target.getStyle("underline"),
					enabled: () => target?.isText,
					observe: cb => canvas.on('mouse:up target:changed target:modified', cb)
				},
				{
					type: 'checkbox',
					lblClass: "tool-button-icon fa fa-bold",
					change: (value) => target.setStyle("fontWeight",value ? "bold" : "normal"),
					value: () => target.getStyle("fontWeight") === "bold",
					enabled: () => target?.isText,
					observe: cb => canvas.on('mouse:up target:changed target:modified', cb)
				},
				{
					type: 'checkbox',
					lblClass: "tool-button-icon fa fa-italic",
					change: (value) => target.setStyle("fontStyle",value ? "italic" : "normal"),
					value: () => target.getStyle("fontStyle") === "italic",
					enabled: () => target?.isText,
					observe: cb => canvas.on('mouse:up target:changed target:modified', cb)
				}
			],
		},
		{
			caption: 'Text Align',
			type: 'options',
			change: (value) => target.setTextAlign(value),
			value: () => target.textAlign,
			enabled: () => target && target.isText,
			options: [
				{value: "left", lblClass: "tool-button-icon fa fa-align-left"},
				{value: "center", lblClass: "tool-button-icon fa fa-align-center"},
				{value: "right", lblClass: "tool-button-icon fa fa-align-right"},
				{value: "justify", lblClass: "tool-button-icon fa fa-align-justify"}
			],
			observe: cb => canvas.on('target:changed', cb)
		},
		{
			caption: 'Elements',
			type: 'group',
			tools: [
				{
					type: 'dropdown',
					placeholder: "Add Element",
					options:  () => {
						return Object.entries(elementsList).map(([key,value]) => ({value: key, label: key}))
					},
					change: (value) => {
						if(elementsList[value].constructor === Array){
							for(let element of elementsList[value]){
								canvas.createObject(element)
							}
						}
						else{
							canvas.createObject(elementsList[value])
						}
					}
				},
				{
					label: 'Clear',
					type: 'button',
					click: () => {
						canvas.clear()
					}
				}
			]
		}
	]
})