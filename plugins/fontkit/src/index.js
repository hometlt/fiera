import fontkit from './base.js';
import TTFFont from './TTFFont.js';
import WOFFFont from './WOFFFont.js';
import WOFF2Font from './WOFF2Font.js';
import TrueTypeCollection from './TrueTypeCollection.js';
import DFont from './DFont.js';






// Register font formats
fontkit.registerFormat(TTFFont);
fontkit.registerFormat(WOFFFont);
fontkit.registerFormat(WOFF2Font);
fontkit.registerFormat(TrueTypeCollection);
fontkit.registerFormat(DFont);

export default fontkit;
