import {TestApp} from '../showreel.js'
import Emojis from '../../../src/text/emojis.js'
import ColorFonts from '../../../src/fonts/colorfonts.js'
import jsPDF from '../../../plugins/jspdf/src'

// import  './../../../fiera/src/modules/export-jspdf.js'

fabric.loadImageAsBuffer = true;
fabric.inlineSVG = true;
let run = async function () {

	let chineseFonts = [
		"SimSun 簡單地說",
		"SimHey 簡單地說",
		"MaoCao 简单地说"
	]

	let moreLanguagesArray = [
		"Arabian مرحبا",
		"Iran به سادگی",
		"Devanagari नागरी",
		"Bengali বাংলা ",
		"Gurmukhī ਗੁਰਮੁਖੀ",
		"Gujarati ગુજરાતી",
		"Oriya ଦେବନାଗ",
		"Tamil தேவநாகரி",
		"Telugu దేవనాగరి",
		"Kannada ದೇವನಾಗರಿ",
		"Malayalam ദേവനാഗരി",
		"Sinhala දේවානගරි",
		"Amharic ዴቫንጋሪ",
		"Armenian Պարզապես",
		"Azerbaijani Sadəcə",
		"Greek Απλά",
		"Gujarati ખાલી",
		"Hebrew בפשטות",
		"Khmer ជា​ធម្មតា",
		"Kyrgyz жөнөкөй",
		"Lao ງ່າຍໆ",
		"myanmar ရိုးရိုးလေးပါ	",
		"pashto په ساده ډول",
		"punjabi ਬਸ",
		"sindhi سادو",
		"tajik Танҳо",
		"thai ง่ายดาย`"
	]

	let langArray = [
		"🇬🇧 Simply",
		"🇷🇺 Просто",
		"🇨🇳 簡單地說",
		"🇰🇵 간단히말해",
		"🇯🇵 単に言う",
		"🇮🇳 केवल",
		"🇧🇩 কেবল",
		"🇮🇱 עִבְרִית"
	]

	let symbolsTestStringArray = [
		"7","7⃣","®","©","😀", "🔥",
		"\n✅","❎","❤","💛","✊","✊🏼",
		"\n👨‍👨‍👧‍👧","👩🏾‍🤝‍👨🏿",
		"\n🏇🏼","🤹🏽‍♀️",//Hearts, ZWJ, Fitzpatrick
		"🟥",	//Unicode11
		"🧏‍♂",	//Unicode12
		//todo Serious bug here >> "🐈‍⬛" 	// Unicode13
	]

	let serifFonts = "Times New Roman,SimSun,Nanum Myeongjo, Kokila, Shonar Bangla, Segoe UI Symbol"

	let sansSerifFonts = "Arial, SimHei, Malgun Gothic, Nirmala UI"

	let testText = `Hearts ❤ 🧡 💛 💚 💙 💜 🖤 💔
ⒶⒷⒸ 🄰🄱🄲 MḾᙢ爪♏ጠℳ ∑∫≈≡≢ 
𓀀𓂀𓆣 ♔♖♗♞ ♤♡♧♢ 𝄞 
Unicode11: 🚆 🚇 🛤 🌄 🌇 🌆 🏙 🌃 🌌 🌉 🌁
Unicode12: 🧏‍♂\uFE0F 🧏‍♀\uFE0F 🟥 🟧 🟨 🟩 🟦 🟪 🟫	
Unicode13: 🐈‍⬛ 🐻‍❄\uFE0F 👩🏼‍🍼`

	function setStyles(a,b,s){
		let style = {};
		for(let i = b; i--;){
			style[i] = s
		}
		return style;
	}

	new TestApp({
		plugins: [Emojis, ColorFonts],
		preload (){
			fabric.fontsSourceRoot = "./../../fiera-media/fonts/"
			Object.assign(fabric.fonts.info.locals,{
				"Gilbert": {variations: {n4: "custom/Gilbert.otf"}},
				"Gilbert Color": {color: true, variations: {n4: "color/GilbertColor.otf"}},
				"Bungee Color": {color: true, variations: {n4: "color/BungeeColor.ttf"}},
				"Abelone": {color: true, variations: {n4: "color/Abelone.otf"}},
				"NTBixa": {color: true, variations: {n4: "color/NTBixaColor.otf"}},
				"Playbox": {color: true, variations: {n4: "color/PlayboxColor.otf"}}
			})

		},
		fonts: ["Times New Roman"],
		prototypes:{
			Canvas: {
			},
			Textbox:{
				// emojisPath: "../fiera-media/svg-emoji/*.svg"
				emojisPath: "../fiera-media/emoji-thumbnails/*.png"
			}
		},
		objects: {
			megan: {
				id: 'megan', type: 'image', left: 0, top: 0, width: 200, height: 200, angle: 45,
				src: 'photos/fox.jpg'
			},
			// snake: {id: 'snake', type: 'image', left: 100, top: 500, width: 200, height: 200, src: 'png/tribal/Snake.png'},
			chineseFonts: {
				top: 0,
				left: 400,
				type: 'textbox',
				width: 300,
				text: chineseFonts.join("\n"),
				fontSize: 25,
				styles: (() => {
					let styles = {0: {},1: {}, 2: {}}
					for(let i=0 ; i< 12 ; i++) {
						styles["0"]["" + i] = {fontFamily: "SimSun"}
					}
					for(let i=0 ; i< 12 ; i++) {
						styles["1"]["" + i] = {fontFamily: "SimHei"}
					}
					for(let i=0 ; i< 12 ; i++) {
						styles["2"]["" + i] = {fontFamily: "Liu Jian Mao Cao"}
					}
					return styles
				})()
			},
			forceEmojis: {
				top: 300,
				left: 0,
				type: 'textbox',
				width: 500,
				text: symbolsTestStringArray.join(" "),
				fontSize: 25
			},
			forceText: {
				fontFamily: "Segoe UI Symbol",
				top: 300,
				left: 200,
				type: 'textbox',
				width: 500,
				text: symbolsTestStringArray.map(el => el + "\uFE0E").join(" "),
				fontSize: 25
			},
			moreLanguagesText: {
				top: 0,
				left: 600,
				type: 'textbox',
				width: 300,
				text: moreLanguagesArray.join("\n"),
				fontSize: 19
			},
			langSerif: {
				fontFamily: serifFonts,
				top: 0,
				left: 200,
				type: 'textbox',
				width: 200,
				text: langArray.join("\n"),
				fontSize: 25
			},
			langSansSerif: {
				fontFamily: sansSerifFonts,
				top: 0,
				left: 0,
				type: 'textbox',
				width: 200,
				text: langArray.join("\n"),
				fontSize: 25
			},
			twitterPNG: {
				fontFamily: "Arial, SimHei, Malgun Gothic, Segoe UI Symbol",
				top: 100,
				left: 900,
				type: 'i-text',
				width: 800,
				text: 'IText + Twitter PNG\nArial, SimHei, SegoeUISymbol'  + testText,
				fontSize: 15
			},
			twitterSVG: {
				fontFamily: serifFonts,
				top: 700,
				left: 600,
				type: 'textbox',
				width: 700, //bug if decreased
				text: testText,
				fontSize: 25
			},
			gilbertColor: {
				fontFamily: "Gilbert",
				paintFirst: "fill",
				// shadow: {offsetX: 2, offsetY:2, blur: 5 ,color: "black" },
				styles:{
					0: setStyles(0,13,{strokeWidth: 1, stroke: "red"}),
					1: setStyles(0,13,{fontFamily: "Gilbert Color"}),
					2: setStyles(0,12,{fontFamily: "Bungee"}),
					3: setStyles(0,12,{fontFamily: "Bungee Color"}),
					4: setStyles(0,7,{fontFamily: "Abelone"}),
					5: setStyles(0,6,{fontFamily: "NTBixa"}),
					6: setStyles(0,7,{fontFamily: "Playbox"}),
					7: setStyles(0,7,{fontFamily: "Playbox"}),
				},
				top: 500,
				left: 0,
				lineHeight: 1,
				type: 'textbox',
				width: 500,
				text: 'Gilbert\nGilbert Color\nBungee\nBungee Color\nAbelone\nNTBixa\nPlayBox\nПлейBox',
				fontSize: 50
			},
			/*
			test: {
				fontFamily: "Nanum Myeongjo",
				top: 500,
				left: 700,
				type: 'textbox',
				width: 800,
				text: 'Nanum Myeongjo 간단히말해',
				fontSize: 30
			},
			test2: {
				fontFamily: "Malgun Gothic",
				top: 500,
				left: 700,
				type: 'textbox',
				width: 800,
				text: 'Malgun Gothic 간단히말해',
				fontSize: 30
			},
			textApple: {
				emojisMapping: appleMappings,
				emojisPath: "./../media/emojis/apple/",
				backgroundColor: '#ddffff',
				top: 175,
				left: 100,
				type: 'i-text',
				text: 'Apple❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC7️⃣77️',
				fontSize: 100
			},
			textFacebook: {
				emojisMapping: facebookMappings,
				emojisPath: "./../media/emojis/facebook/",
				backgroundColor: '#ddffff',
				top: 300,
				left: 100,
				type: 'i-text',
				text: 'Facebook❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC',
				fontSize: 100
			},
			textGoogle: {
				emojisMapping: googleMappings,
				emojisPath: "./../media/emojis/google/",
				backgroundColor: '#ddffff',
				top: 425,
				left: 100,
				type: 'i-text',
				text: 'Google❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC',
				fontSize: 100
			},
			textSamsung: {
				emojisMapping: samsungMappings,
				emojisPath: "./../media/emojis/samsung/",
				backgroundColor: '#ddffff',
				top: 550,
				left: 100,
				type: 'i-text',
				text: 'Samsung❤️❤😀✊✊🏼👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC7️⃣77️',
				fontSize: 100
			},
			textMicrosoft: {
				emojisMapping: microsoftMappings,
				emojisPath: "./../media/emojis/microsoft/",
				backgroundColor: '#ddffff',
				top: 675,
				left: 100,
				type: 'i-text',
				text: 'Microsoft❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC',
				fontSize: 100
			},
			textJoypixels: {
				emojisMapping: joyPixelsMappings,
				emojisPath: "./../media/emojis/joypixels/",
				top: 800,
				left: 100,
				type: 'i-text',
				text: 'JoyPixels❤️❤😀1✊2✊🏼3👨👨👧👧4👩🏾🤝👨🏿ABC', //zeros with joiner symbols are removed
				fontSize: 100
			},
			textWhatsapp: {
				emojisMapping: whatsappMappings,
				emojisPath: "./../media/emojis/whatsapp/",
				backgroundColor: '#ddffff',
				top: 925,
				left: 100,
				type: 'i-text',
				text: 'Whatsapp❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC',
				fontSize: 100
			},
			textOpenMojiColor: {
				emojisType: "svg",
				emojisMapping: openMojiMappings,
				emojisPath: "./../media/emojis/openmoji-svg-color/",
				backgroundColor: '#ddffff',
				top: 1175,
				left: 100,
				type: 'i-text',
				text: 'OpenMoji❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC',
				fontSize: 100
			},
			textOpenMojiBlack: {
				emojisType: "svg",
				emojisMapping: openMojiMappings,
				emojisPath: "./../media/emojis/openmoji-svg-black/",
				backgroundColor: '#ddffff',
				top: 1300,
				left: 100,
				type: 'i-text',
				text: 'OpenMoji❤️❤😀1✊2✊🏼3👨‍👨‍👧‍👧4👩🏾‍🤝‍👨🏿ABC', fontSize: 100
			}*/
		},
		slide: {
			// freeHandModeEnabled: true,
			// backgroundPosition: 'fill',
			// stretchable: false,
			// zoom: 1,
			// width: 1250,
			// height: 600,
			objects: [
				"megan",
				"snake",
				"forceEmojis",
				"forceText",
				"langSerif",
				"langSansSerif",
				"moreLanguagesText",
				"chineseFonts",
				'twitterSVG',
				'gilbertColor',




				// 'test',
				// 'test2',
				//  'default', 'segoe',
				//'twitterPNG',
				//  'segoe',
				// 'textApple',
				// 'textFacebook',
				// 'textGoogle',
				// 'textSamsung',
				// 'textMicrosoft',
				// 'textWhatsapp',
				// 'textJoypixels',
				// 'textOpenMojiColor',
				// 'textOpenMojiBlack',
			]
		},
		toolbars: {
			Canvas: [
				{
					className: "fa fa-print",
					async action (canvas){

						// document.body.innerHTML = canvas.toSVG();
						fabric.Text.prototype.replaceIncompatibleSymbolsEnabled = true;

						// await canvas.editor.loadPdfExportModules();
						let fList = canvas.editor.getUsedFonts()
						fabric.fonts.fallbacks.forEach(fi => {
							if(!fList.includes(fi)){
								fList.push(fi)
							}
						})
						await fabric.fonts.waitForWebfontsTobeLoaded(fList)
						await fabric.fonts.loadBinaryFonts(fList);
						let editor = await canvas.editor.getExportEditor();
						fabric.pdf.setupSvgExport();

						let svg = editor.canvas.toSVG();

						fabric.pdf.resolveSvgExport();
						fabric.Text.prototype.replaceIncompatibleSymbolsEnabled = false;

						if(!window.newDiv){
							window.newDiv = document.createElement("div");
							document.body.appendChild(newDiv)
						}
						newDiv.innerHTML = svg;

					}
				},
				{
					title: "jspdf",
					className: "fa fa-file-pdf",
					async action(canvas) {

						let svgData = await canvas.editor.exportSVGData()

						// let svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" class="highcharts-root" style="font-family:&quot;Lucida Grande&quot;, &quot;Lucida Sans Unicode&quot;, Arial, Helvetica, sans-serif;font-size:12px;" width="600" height="400" viewBox="0 0 600 400"><desc>Created with Highcharts 8.1.2</desc><defs><clipPath id="highcharts-pl032a8-40-"><rect x="0" y="0" width="530" height="251" fill="none"/></clipPath></defs><rect fill="#ffffff" class="highcharts-background" x="0" y="0" width="600" height="400" rx="0" ry="0"/><rect fill="none" class="highcharts-plot-background" x="60" y="71" width="530" height="251"/><g class="highcharts-grid highcharts-xaxis-grid" data-z-index="1"><path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 192.5 71 L 192.5 322" opacity="1"/><path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 324.5 71 L 324.5 322" opacity="1"/><path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 457.5 71 L 457.5 322" opacity="1"/><path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 589.5 71 L 589.5 322" opacity="1"/><path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 59.5 71 L 59.5 322" opacity="1"/></g><g class="highcharts-grid highcharts-yaxis-grid" data-z-index="1"><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 322.5 L 590 322.5" opacity="1"/><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 280.5 L 590 280.5" opacity="1"/><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 238.5 L 590 238.5" opacity="1"/><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 197.5 L 590 197.5" opacity="1"/><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 155.5 L 590 155.5" opacity="1"/><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 113.5 L 590 113.5" opacity="1"/><path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 60 70.5 L 590 70.5" opacity="1"/></g><rect fill="none" class="highcharts-plot-border" data-z-index="1" x="60" y="71" width="530" height="251"/><g class="highcharts-axis highcharts-xaxis" data-z-index="2"><path fill="none" class="highcharts-axis-line" stroke="#ccd6eb" stroke-width="1" data-z-index="7" d="M 60 322.5 L 590 322.5"/></g><g class="highcharts-axis highcharts-yaxis" data-z-index="2"><text x="26" data-z-index="7" text-anchor="middle" transform="translate(0,0) rotate(270 26 196.5)" class="highcharts-axis-title" style="color:#666666;fill:#666666;" y="196.5"><tspan>Values</tspan></text><path fill="none" class="highcharts-axis-line" data-z-index="7" d="M 60 71 L 60 322"/></g><g class="highcharts-series-group" data-z-index="3"><g class="highcharts-series highcharts-series-0 highcharts-column-series" data-z-index="0.1" opacity="1" transform="translate(60,71) scale(1 1)" clip-path="url(#highcharts-pl032a8-40-)"><rect x="33.5" y="209.5" width="64" height="42" fill="#7cb5ec" stroke="#ffffff" stroke-width="1" opacity="1" class="highcharts-point highcharts-color-0"/><rect x="166.5" y="126.5" width="64" height="125" fill="#434348" stroke="#ffffff" stroke-width="1" opacity="1" class="highcharts-point highcharts-color-1"/><rect x="298.5" y="167.5" width="64" height="84" fill="#90ed7d" stroke="#ffffff" stroke-width="1" opacity="1" class="highcharts-point highcharts-color-2"/><rect x="431.5" y="84.5" width="64" height="167" fill="#f7a35c" stroke="#ffffff" stroke-width="1" opacity="1" class="highcharts-point highcharts-color-3"/></g><g class="highcharts-markers highcharts-series-0 highcharts-column-series" data-z-index="0.1" opacity="1" transform="translate(60,71) scale(1 1)" clip-path="none"/><g class="highcharts-series highcharts-series-1 highcharts-line-series highcharts-color-0" data-z-index="0.1" opacity="1" transform="translate(60,71) scale(1 1)" clip-path="url(#highcharts-pl032a8-40-)"><path fill="none" d="M 66.25 41.833333333333314 L 198.75 125.5 L 331.25 83.66666666666666 L 463.75 167.33333333333331" class="highcharts-graph" data-z-index="1" stroke="#7cb5ec" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></g><g class="highcharts-markers highcharts-series-1 highcharts-line-series highcharts-color-0" data-z-index="0.1" opacity="1" transform="translate(60,71) scale(1 1)" clip-path="none"><path fill="#7cb5ec" d="M 66 46 A 4 4 0 1 1 66.00399999933333 45.99999800000017 Z" opacity="1" class="highcharts-point highcharts-color-0"/><path fill="#7cb5ec" d="M 198 130 A 4 4 0 1 1 198.00399999933333 129.99999800000018 Z" opacity="1" class="highcharts-point highcharts-color-0"/><path fill="#7cb5ec" d="M 331 88 A 4 4 0 1 1 331.00399999933336 87.99999800000016 Z" opacity="1" class="highcharts-point highcharts-color-0"/><path fill="#7cb5ec" d="M 463 171 A 4 4 0 1 1 463.00399999933336 170.99999800000018 Z" opacity="1" class="highcharts-point highcharts-color-0"/></g></g><text x="300" text-anchor="middle" class="highcharts-title" data-z-index="4" style="color:#333333;font-size:18px;fill:#333333;" y="24"><tspan>Chart title</tspan></text><text x="300" text-anchor="middle" class="highcharts-subtitle" data-z-index="4" style="color:#666666;fill:#666666;" y="52"><tspan>Source: WorldClimate.com</tspan></text><text x="10" text-anchor="start" class="highcharts-caption" data-z-index="4" style="color:#666666;fill:#666666;" y="397"/><g class="highcharts-legend" data-z-index="7" transform="translate(214,356)"><rect fill="none" class="highcharts-legend-box" rx="0" ry="0" x="0" y="0" width="172" height="29" visibility="visible"/><g data-z-index="1"><g><g class="highcharts-legend-item highcharts-column-series highcharts-color-undefined highcharts-series-0" data-z-index="1" transform="translate(8,3)"><text x="21" style="color:#333333;cursor:pointer;font-size:12px;font-weight:bold;fill:#333333;" text-anchor="start" data-z-index="2" y="15"><tspan>Series 1</tspan></text><rect x="2" y="4" width="12" height="12" fill="#cccccc" rx="6" ry="6" class="highcharts-point" data-z-index="3"/></g><g class="highcharts-legend-item highcharts-line-series highcharts-color-0 highcharts-series-1" data-z-index="1" transform="translate(96.40625,3)"><path fill="none" d="M 0 11 L 16 11" class="highcharts-graph" stroke="#7cb5ec" stroke-width="2"/><path fill="#7cb5ec" d="M 8 15 A 4 4 0 1 1 8.003999999333336 14.999998000000167 Z" class="highcharts-point" opacity="1"/><text x="21" y="15" style="color:#333333;cursor:pointer;font-size:12px;font-weight:bold;fill:#333333;" text-anchor="start" data-z-index="2"><tspan>Series 2</tspan></text></g></g></g></g><g class="highcharts-axis-labels highcharts-xaxis-labels" data-z-index="7"><text x="126.25" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="middle" transform="translate(0,0)" y="341" opacity="1">Jan</text><text x="258.75" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="middle" transform="translate(0,0)" y="341" opacity="1">Feb</text><text x="391.25" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="middle" transform="translate(0,0)" y="341" opacity="1">Mar</text><text x="523.75" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="middle" transform="translate(0,0)" y="341" opacity="1">Apr</text></g><g class="highcharts-axis-labels highcharts-yaxis-labels" data-z-index="7"><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="326" opacity="1">0</text><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="284" opacity="1">1</text><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="242" opacity="1">2</text><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="201" opacity="1">3</text><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="159" opacity="1">4</text><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="117" opacity="1">5</text><text x="45" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="75" opacity="1">6</text></g><text x="590" class="highcharts-credits" text-anchor="end" data-z-index="8" style="cursor:pointer;color:#999999;font-size:9px;fill:#999999;" y="395">Highcharts.com</text></svg>'


						if (!window.newDiv) {
							window.newDiv = document.createElement("div");
							document.body.appendChild(newDiv)
						}
						newDiv.innerHTML = svgData[0];


						// return document.createRange().createContextualFragment(strHTML);
						// const element = new DOMParser().parseFromString(svgData, 'image/svg+xml');
						const width = 900, height = 900
						const pdf = new jsPDF('l', 'pt', [width, height])

						svg2pdf(svgData[0], pdf, {
							removeInvalid: true,
							scale: 72 / 96, // this is the ratio of px to pt units
							xOffset: 0,
							yOffset: 0
						})
						pdf.setTextColor(100);
						pdf.text(20, 20, 'This is gray.');
						pdf.setTextColor(150);
						pdf.text(20, 30, 'This is light gray.');
						pdf.setTextColor(255, 0, 0);
						pdf.text(20, 40, 'This is red.');
						pdf.setTextColor(0, 255, 0);
						pdf.text(20, 50, 'This is green.');
						pdf.setTextColor(0, 0, 255);
						pdf.text(20, 60, 'This is blue.')
						// const uri = pdf.output('datauristring')
						pdf.addImage("/nymbl-designer/fiera-media/photos/fox.jpg", '', 0, 0, 300, 300);


						pdf.save('myPDF.pdf')
					}
				},
				{
					title: "pdfkit",
					className: "fa fa-file-pdf",
					async action (canvas){
						canvas.editor.exportPdfClient()
					}
				}
			]
		}
	})
}
run();



