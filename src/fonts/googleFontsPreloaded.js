import fullGoogleFontsInfo from './fontsdetails-google.js'
import {FmGoogleFonts} from "./googleFonts.js";



export const FmGoogleFontsPreloaded = {
    name: "google-fonts-preloaded",
    deps: [FmGoogleFonts],
    install() {

        let fullGoogleFontsList = Object.keys(fullGoogleFontsInfo);

        fabric.GoogleFontsLoader._info = fullGoogleFontsInfo;
        fabric.GoogleFontsLoader.list = fullGoogleFontsList;
    }
}
