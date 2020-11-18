let tables = {};
export default tables;

// Required Tables
import cmap from './cmap.js';
import head from './head.js';
import hhea from './hhea.js';
import hmtx from './hmtx.js';
import maxp from './maxp.js';
import name from './name.js';
import OS2 from './OS2.js';
import post from './post.js';

tables.cmap = cmap;
tables.head = head;
tables.hhea = hhea;
tables.hmtx = hmtx;
tables.maxp = maxp;
tables.name = name;
tables['OS/2'] = OS2;
tables.post = post;


// TrueType Outlines
import cvt from './cvt.js';
import fpgm from './fpgm.js';
import loca from './loca.js';
import prep from './prep.js';
import glyf from './glyf.js';

tables.fpgm = fpgm;
tables.loca = loca;
tables.prep = prep;
tables['cvt '] = cvt;
tables.glyf = glyf;


// PostScript Outlines
import CFFFont from '../cff/CFFFont.js';
import VORG from './VORG.js';

tables['CFF '] = CFFFont;
tables['CFF2'] = CFFFont;
tables.VORG = VORG;


// Bitmap Glyphs
import EBLC from './EBLC.js';
import sbix from './sbix.js';
import COLR from './COLR.js';
import CPAL from './CPAL.js';

tables.EBLC = EBLC;
tables.CBLC = tables.EBLC;
tables.sbix = sbix;
tables.COLR = COLR;
tables.CPAL = CPAL;


// Advanced OpenType Tables
import BASE from './BASE.js';
import GDEF from './GDEF.js';
import GPOS from './GPOS.js';
import GSUB from './GSUB.js';
import JSTF from './JSTF.js';

tables.BASE = BASE;
tables.GDEF = GDEF;
tables.GPOS = GPOS;
tables.GSUB = GSUB;
tables.JSTF = JSTF;

// OpenType variations tables
import HVAR from './HVAR.js';

tables.HVAR = HVAR;

// Other OpenType Tables
import DSIG from './DSIG.js';
import gasp from './gasp.js';
import hdmx from './hdmx.js';
import kern from './kern.js';
import LTSH from './LTSH.js';
import PCLT from './PCLT.js';
import VDMX from './VDMX.js';
import vhea from './vhea.js';
import vmtx from './vmtx.js';

tables.DSIG = DSIG;
tables.gasp = gasp;
tables.hdmx = hdmx;
tables.kern = kern;
tables.LTSH = LTSH;
tables.PCLT = PCLT;
tables.VDMX = VDMX;
tables.vhea = vhea;
tables.vmtx = vmtx;


// Apple Advanced Typography Tables
import avar from './avar.js';
import bsln from './bsln.js';
import feat from './feat.js';
import fvar from './fvar.js';
import gvar from './gvar.js';
import just from './just.js';
import morx from './morx.js';
import opbd from './opbd.js';

tables.avar = avar;
tables.bsln = bsln;
tables.feat = feat;
tables.fvar = fvar;
tables.gvar = gvar;
tables.just = just;
tables.morx = morx;
tables.opbd = opbd;
