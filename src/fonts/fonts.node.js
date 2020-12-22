import fs from 'fs'
import request from 'request'
import path from 'path'
import nodeCanvas from 'canvas'
import WritableBufferStream from './../../plugins/WritableBufferStream.js'
import beautyStringify from '../../util/beautyStringify.js'
import {FmFonts} from "./fonts.js"

export default {
  name: "node-fonts",
  deps: [FmFonts],
  install() {
    fabric.Text.prototype.replaceIncompatibleSymbolsEnabled = true;

    fabric.util.object.extend(fabric.fonts,{
      readFontDirectory(filename){
        let variations;
        if(!filename.includes('*')){
          if(fs.existsSync(fabric.fonts.getFontURL( filename))){
            variations = {'400': filename};
          }
        }else{
          variations = {};
          let fvSuffixes = {'400': ['','r','400'], '400i' : ['i','400i'], '700': ['b','bd','700'],  '700i': ['bi','z','700i']};
          for(let fvName in fvSuffixes){
            for(let suffix of fvSuffixes[fvName]){
              let fvFilename = filename.replace('*',suffix);
              if(fs.existsSync(fabric.fonts.getFontURL( fvFilename))){
                variations[fvName] = fvFilename;
                break;
              }
            }
          }
        }
        return variations;
      },
      requestFontBuffer(url){
        /* Using Promises so that we can use the ASYNC AWAIT syntax */
        return new Promise((resolve, reject) => {

          let stream = new WritableBufferStream();

          request({
            uri: url,
            headers: {
              // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              // 'Accept-Encoding': 'gzip, deflate, br',
              // 'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
              // 'Cache-Control': 'max-age=0',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            /* GZIP true for most of the websites now, disable it if you don't need it */
            // gzip: true
          })
          .pipe(stream)
          .on('finish', () => {
            resolve(stream.toBuffer())
          })
          .on('error', (error) => {
            reject(error);
          })
        });
      },
      //upload file from Google Fonts
      uploadFile(url,src){
        return new Promise((resolve, reject) => {
          /* Create an empty file where we can save data */
          const stream = fs.createWriteStream(src);

          /* Using Promises so that we can use the ASYNC AWAIT syntax */
          request({
            uri: url,
            headers: {
              // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              // 'Accept-Encoding': 'gzip, deflate, br',
              // 'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
              // 'Cache-Control': 'max-age=0',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            /* GZIP true for most of the websites now, disable it if you don't need it */
            // gzip: true
          })
              .pipe(stream)
              .on('finish', () => {
                stream.close(() => {
                  resolve(src);
                });
              })
              .on('error', (error) => {
                reject(error);
              })
        });
      },
      GOOGLE_API_KEY: 'AIzaSyAlip_fWGbMRdBhwsT615uPE5X0Rqzoc9k',
      googleFontsApiURL: 'https://www.googleapis.com/webfonts/v1/webfonts?key=',
      cacheFonts: true,
      remoteFontsPrefix: "remote/",
      loadNodeFont(ff, prefix) {
        let observers = []
        let reg = fabric.fonts.registry[ff]
        for(let fvName in reg.variations ) {
          let variation = reg.variations[fvName]
          let fvOptions = fabric.fonts._readFontVariantName(fvName);
          if (!this.nodeCanvasFontWeightSupported.includes(fvName)) continue
          if (variation.active) continue
          if (variation.buffer) continue



          if (!variation.observer) {

            let root = fabric.uFontsRoot || fabric.fontsRoot,
                extension = /(\.\w+$)/.exec(variation.src)[1],
                filename = `${ff.replace(/ /g, '-')}${fvName}${extension}`,
                sourceURL = variation.src,
                destinationPath

            let external = false
            if(/^(http|https):\/\//.test(sourceURL)) {
              destinationPath = path.resolve(root + prefix + filename);
              variation.src = destinationPath
              external = true
            }

            if(fs.existsSync(variation.src)){
              if (fabric.util.nodeCanvasDebug) {
                console.log(`node-canvas: register font '${ff} ${fvOptions.style} ${fvOptions.weight}'`);
              }
              nodeCanvas.registerFont(path.resolve(variation.src), {
                family: ff,
                style: fvOptions.style,
                weight: fvOptions.weight
              });
              variation.active = true
              continue;
            }

            if (!fs.existsSync(root)) fs.mkdirSync(root)
            if (!fs.existsSync(root + prefix)) fs.mkdirSync(root + prefix)




            if (fabric.fonts.cacheFonts) {
              if (fabric.util.nodeCanvasDebug) {
                console.log(`request font '${ff} ${fvOptions.style} ${fvOptions.weight}'`);
              }
              variation.observer = fabric.fonts.uploadFile(sourceURL, destinationPath).then(() => {
                if (fabric.util.nodeCanvasDebug) {
                  console.log(`node-canvas: register font '${ff} ${fvOptions.style} ${fvOptions.weight}'`);
                }
                nodeCanvas.registerFont(variation.src, {
                  family: ff,
                  style: fvOptions.style,
                  weight: fvOptions.weight
                });
                variation.active = true;
              });
            } else {
              if (fabric.util.nodeCanvasDebug) {
                console.log(`request font '${ff} ${fvOptions.style} ${fvOptions.weight}'`);
              }
              variation.observer = fabric.fonts.requestFontBuffer(sourceURL, destinationPath).then(buf => {
                if (fabric.util.nodeCanvasDebug) {
                  console.log(`node-canvas: register font '${ff} ${fvOptions.style} ${fvOptions.weight}'`);
                }
                nodeCanvas.registerFont(variation.buffer, {
                  family: ff,
                  style: fvOptions.style,
                  weight: fvOptions.weight
                });
                variation.buffer = buf;
                variation.active = true;
              });
            }
          }
          observers.push(variation.observer)
        }
        return Promise.all(observers)
      },
      getGoogleFontsList(googleFontsDetailedFile , callback){
        return new Promise( (resolve)=> {

          if(fabric.fonts.info.google){
            resolve(fabric.fonts.info.google);
          }else if (fs.existsSync(googleFontsDetailedFile)) {
            let fonts = fabric.util.load(googleFontsDetailedFile);
            fabric.fonts.info.google = fonts;
            resolve(fonts);
          }
          else {

            let url = this.googleFontsApiURL + this.GOOGLE_API_KEY;
            request.get(url, {
              headers: {
                //to load ttf files
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36'
                //to load woff files
                // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
              },
              json: true,
              encoding: 'utf8'
            }, (_error, _response, styles) => {
              let stylesParsed = {};

              styles.items.forEach(item => {
                let newFiles = {};
                for (let fvName in item.files) {
                  let newFVName = fvName;
                  if (fvName === 'regular') {
                    newFVName = '400';
                  }
                  if (fvName === 'italic') {
                    newFVName = '400italic';
                  }
                  newFVName = newFVName.replace('italic', 'i');

                  newFiles[newFVName] = item.files[fvName].replace(this.googleFontsCdnURL, '');
                }
                stylesParsed[item.family] = {
                  // subsets: item.subsets,
                  // category: item.category,
                  // family: item.family,
                  variations: newFiles
                }
              });
              fs.writeFileSync(googleFontsDetailedFile, beautyStringify(stylesParsed, true));
              resolve(stylesParsed);
            });
          }
        })
      },
      getGoogleFontStyles(googFontsArray,callback){
        //
        // let fName = `./cache/${googFontsArray.join('%7C').replace(/\s/g,'+')}.css`;
        // if(false && fs.existsSync(fName)){
        //   let styles = fs.readFileSync(fName).toString();
        //   callback(styles);
        // }
        // else {
        // let url = fabric.fonts.buildGoogleUrl(googFontsArray,fabric.fonts.subsets);
        /*
        request.get(url, {
            headers: {
              //to load ttf files
              'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36'
              //to load woff files
              // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
            },
            encoding: 'utf8'
          },
          (_error, _response, styles) => {

            fs.writeFileSync(fName,styles);
            callback(styles);
          });*/
        // }
      },
      // googleFontsPrefix: 'google/',




      // fontIncludes(decl,char) {
      //   let registry = fabric.fonts.registry[decl.fontFamily]
      //   if (!registry) {
      //     console.warn("no registry!" + decl.fontFamily)
      //     return false
      //   }
      //   let variation = registry.variations[(decl.fontStyle === "italic" ? "i" : "n") + (decl.fontWeight === "bold" ? "7" : "4")]
      //
      //   if (!variation.typr) {
      //     let buffer = fs.readFileSync(variation.src)
      //     variation.typr = Typr.parse(buffer)[0];//new Buffer(registry.variations.n4.buffer)
      //   }
      //   let charcode = getCharCode(char[0]);
      //   return Typr.U.codeToGlyph(variation.typr, charcode)
      //
      //
      //   // if(!registry.characterSet){
      //   //   let fontPath = path.resolve(fabric.fonts.getFontURL(registry.variations.n4.src))
      //   //   registry.characterSet = fontkit.openSync(fontPath).characterSet
      //   // }
      //   // return registry.characterSet;
      // },
      /**
       * load standart fonts info. fontFamilies fallbacks for different languages, files and ranges.
       */
      // async loadLocalFonts(options){
      //
      //   let fonts = {};
      //   if(options.detailed && fs.existsSync(options.detailed)) {
      //     fonts = await fabric.util.load(options.detailed);
      //     fabric.fonts.info.locals = fonts;
      //   }
      //   else if(options.list){
      //     let list = await fabric.util.load(options.list);
      //     for(let familyName in list){
      //       let registry = fonts[familyName] = {variations: {}};
      //       fabric.fonts.readNotation(list[familyName],(_,style,weight,file)=>{
      //         registry.variations[weight + (style === 'italic' ? 'i' : '')] = file
      //       });
      //       registry.characterSet = this.getCharacterSet(familyName)
      //     }
      //
      //     if(options.detailed){
      //       fs.writeFileSync(options.detailed, beautyStringify(fonts, true));
      //     }
      //     fabric.fonts.info.locals = fonts;
      //   }
      //
      //   for (let ff in fabric.fonts.info.locals) {
      //     fabric.fonts.registry[ff] = this._formatFontVariations(fabric.fonts.info.locals[ff],ff);
      //   }
      //
      //   return fonts;
      // },
      /*
      loadExternalFonts(families) {
        let parsedFonts = {};

        return new Promise( resolve => {
          let promises = [];
          let ffig = fabric.fonts.info.google;
          let ffir = fabric.fonts.info.remote;

          families.forEach(family => {
            if(fabric.fonts.registry[family]){
              return;
            }

            if(ffir[family]){
              let files = {};
              for(let   fvName in ffir[family].variations){
                let root = fabric.uFontsRoot || fabric.fontsRoot;
                let sourceURL = ffir[family].variations[fvName],
                    extension =  /(\.\w+$)/.exec(sourceURL)[1],
                    filename = `${family.replace(/ /g,'-')}${fvName}${extension}`,
                    destinationPath = path.resolve(root +  fabric.fonts.remoteFontsPrefix + filename);

                files[fvName] = {
                  src: path.resolve(root + fabric.fonts.remoteFontsPrefix + filename),
                  active: false
                };

                if (!fs.existsSync(root)){
                  fs.mkdirSync(root);
                }

                if (!fs.existsSync(root +  fabric.fonts.remoteFontsPrefix)){
                  fs.mkdirSync(root +  fabric.fonts.remoteFontsPrefix);
                }

                if (!fs.existsSync(destinationPath)) {
                  if(fabric.fonts.cacheFonts){
                    promises.push(fabric.fonts.uploadFile(sourceURL, destinationPath));
                  }
                  else{
                    promises.push(fabric.fonts.requestFontBuffer(sourceURL, destinationPath).then(buf => {
                      files[fvName].buffer = buf;
                    }))
                  }
                }
              }
              fabric.fonts.registry[family] = parsedFonts[family] = {variations: files};
            }
            else if(ffig[family]){
              let files = {};
              for(let fvName in ffig[family].variations){
                let root = fabric.uFontsRoot || fabric.fontsRoot;
                let sourceURL = 'https://fonts.gstatic.com/s/' + ffig[family].variations[fvName],
                    extension =  /(\.\w+$)/.exec(sourceURL)[1],
                    filename = `${family.replace(/ /g,'-')}${fvName}${extension}`,
                    destinationPath = path.resolve(root +  fabric.fonts.googleFontsPrefix + filename);

                files[fvName] = {
                  src: path.resolve(root + fabric.fonts.googleFontsPrefix + filename),
                  active: false
                };

                if (!fs.existsSync(root)){
                  fs.mkdirSync(root);
                }

                if (!fs.existsSync(root +  fabric.fonts.googleFontsPrefix)){
                  fs.mkdirSync(root +  fabric.fonts.googleFontsPrefix);
                }

                if (!fs.existsSync(destinationPath)) {
                  if(fabric.fonts.cacheFonts){
                    promises.push(fabric.fonts.uploadFile(sourceURL, destinationPath));
                  }
                  else{
                    promises.push(fabric.fonts.requestFontBuffer(sourceURL, destinationPath).then(buf => {
                      files[fvName].buffer = buf;
                    }))
                  }
                }
              }
              fabric.fonts.registry[family] = parsedFonts[family] = {variations: files};
            }
            else{
              console.log(`font '${family}' was not found`);
            }
          });

          if(promises.length){
            Promise.all(promises).then(() => resolve());
          }else{
            resolve();
          }
        })
        .then(() =>{
          for(let familyName in parsedFonts){
            // parsedFonts[familyName].characterSet = this.getCharacterSet(familyName)
            this._formatFontVariations(parsedFonts[familyName]);
          }
        })
      },
      async registerNodeCanvasFonts(fonts){

        for (let ff of fonts) {
          if(!fabric.fonts.registry[ff] && fabric.fonts.info.locals[ff]){
            let registry = fabric.fonts.registry[ff] = this._formatFontVariations(fabric.fonts.info.locals[ff],ff);

            for (let fvname in registry.variations) {
              let variation = registry.variations[fvname]
              variation.src = path.resolve(fabric.fonts.getFontURL(variation.src));
            }
          }
        }

        // for (let ff in fabric.fonts.registry) {
        //   let registry = fabric.fonts.registry[ff]
        //   for (let fvname in registry.variations) {
        //     let variation = registry.variations[fvname]
        //     variation.src = path.resolve(fabric.fonts.getFontURL(variation.src));
        //   }
        // }

        await fabric.fonts.loadExternalFonts(fonts);

        for (let ff of fonts) {
          if(!fabric.fonts.registry[ff]){
            console.warn(`font family ${ff} cannot be registered`)
            continue;
          }
          for(let fvName in fabric.fonts.registry[ff].variations){
            let fv = fabric.fonts.registry[ff].variations[fvName];
            if (!fv.active) {
              fv.src = path.resolve(fabric.fonts.getFontURL(fv.src));
              let fvOptions = this._readFontVariantName(fvName);

              if(this.nodeCanvasFontWeightSupported.includes(fvName)){
                // fvOptions.weight = (+fvOptions.weight === 400) ? 'normal':'bold';

                if(fabric.util.nodeCanvasDebug) {
                  console.log(`node-canvas: register font '${ff} ${fvOptions.style} ${fvOptions.weight}'`);
                }

                //fv.variation.buffer
                nodeCanvas.registerFont(fv.src, {family: ff, style: fvOptions.style, weight: fvOptions.weight});
                fv.active = true;
              }
            }
          }
        }
      },
*/
    });



// fabric.fonts.info.google = JSON.parse(fs.readFileSync(path.resolve('./google.json')))
  },
 // prototypes: {
    // Text : {
    //   checkIncompatibleSymbols(){
    //     // this._styleMap = this._generateStyleMap(this._splitText());
    //
    //     let value = this.text;
    //     let _incompatibleStringStart = -1, _incompatibleStringEnd = -1;
    //     let lastFallback = false;
    //     let specialCharacters = '\t\n\r';
    //     for(let i = 0 ;i < value.length; i ++ ){
    //       let style = this.getStyleAtPosition(i);
    //       let ff = style.fontFamily || this.fontFamily;
    //
    //       let symbol = value[i];
    //       if(specialCharacters.includes(symbol))continue;
    //       if(!fabric.fonts.registry[ff] || !fabric.fonts.registry[ff].range.test(symbol)){
    //         //если уже найден шрифт замена то попробуем его в первую очередь
    //         if(lastFallback){
    //           if(!fabric.fonts.registry[lastFallback].range.test(symbol)){
    //             //если страая замена не работает, то меняем символы и начинаем заново
    //             this.setSelectionStyles({fontFamily: lastFallback}, _incompatibleStringStart, i);
    //             _incompatibleStringStart = -1;
    //             lastFallback = false;
    //           }else{
    //             continue;
    //           }
    //         }
    //         lastFallback = this.getCompatibleFallback(symbol);
    //
    //         //incomatible char
    //         if(_incompatibleStringStart === -1){
    //           _incompatibleStringStart = i;
    //         }
    //       }
    //       else{
    //         if(_incompatibleStringStart !== -1){
    //           this.setSelectionStyles({fontFamily: lastFallback}, _incompatibleStringStart, i);
    //           _incompatibleStringStart = -1;
    //           lastFallback = false;
    //         }
    //       }
    //     }
    //     if(lastFallback){
    //       this.setSelectionStyles({fontFamily: lastFallback}, _incompatibleStringStart, value.length);
    //       _incompatibleStringStart = -1;
    //     }
    //
    //     this.editor.addUsedFonts(fabric.fonts.getUsedFonts(this.styles));
    //     this.editor.addUsedFont(this.fontFamily);
    //   }
    // }
 // }
}


// function collectFallbacksFontsRegistryInfo(){
//   fabric.fonts.info = fabric.util.object.data.load(`./fonts.json`, 'json');
//   fabric.fonts.loadCustomFonts(Object.keys(fabric.fonts.info.fallbacks)).then(data=>{
//     fs.writeFileSync('./cache/fallbacks.json', fabric.util.data.beautyStringify(data, true));
//   });
// }

// let fontConverter = require('font-converter');
// fontConverter('path/to/sourceFontFile.ttf', 'path/to/destinationFontFile.woff', function (err) {
//   if(err) {
//     // There was an error
//   } else {
//     // All good, path/to/destinationFontFile.woff contains the transformed font file
//   }
// })


