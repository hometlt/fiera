import XRegExp from './xregexp.js';

import build from './addons/build.js';
import matchRecursive from './addons/matchrecursive.js';
import unicodeBase from './addons/unicode-base.js';
import unicodeBlocks from './addons/unicode-blocks.js';
import unicodeCategories from './addons/unicode-categories.js';
import unicodeProperties from './addons/unicode-properties.js';
import unicodeScripts from './addons/unicode-scripts.js';

build(XRegExp);
matchRecursive(XRegExp);
unicodeBase(XRegExp);
unicodeBlocks(XRegExp);
unicodeCategories(XRegExp);
unicodeProperties(XRegExp);
unicodeScripts(XRegExp);

export default XRegExp;
