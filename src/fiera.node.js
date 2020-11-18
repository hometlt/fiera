import fabric from './fabric/main.js'
import './node/document.js'
import './fiera.core.js'

import './modules/export-pdfkit.js'
import './node/pdf.node.js'

import './node/fromURL.js'
// import './modules/export.js'
import './node/node.export.js'
// import './node/node.core.js'
// import './node/node.shutterstock.js'
// import './node/node.s3.js'

import nodeCanvas from 'canvas'

fabric.Node = nodeCanvas

fabric.showDeveloperWarnings = false;

import {FmGoogleFontsPreloaded} from "./fonts/googleFontsPreloaded.js"
fabric.plugins[FmGoogleFontsPreloaded.name] = FmGoogleFontsPreloaded

import FontsNodeModule from "./fonts/fonts.node.js"
fabric.plugins[FontsNodeModule.name] = FontsNodeModule

import {FmNodeGL} from "./node/webgl.node.js"
fabric.plugins[FmNodeGL.name] = FmNodeGL

import * as modules from "./modules.js";
for(let i in modules){
    if(fabric.plugins[modules[i].name]){
        console.warn(`module ${modules[i].name} already registered`)
    }
    fabric.plugins[modules[i].name] = modules[i]
}

global.fabric = fabric;
export default fabric;