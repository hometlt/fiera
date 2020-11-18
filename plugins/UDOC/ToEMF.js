

	function ToEMF()
	{
		/*
		this._gst = ToEMF.defState();*/
		this._file = {file:new ToEMF.MFile(), off:0};
		
		this._lstw = 0;
		this._curx = 0;
		this._curh = 0;
		
		this._recs = 0;
		this._lenp = 0;
		
		this._objs = {};
		this._tabl = 1;
		this._stkf = 0; 
		this._tclr = 0;  // text color

		this._curt = {"p":-1, "b":-1, "t":-1};
		this._inited = false;
	}
	
	
	ToEMF.prototype.StartPage = function(x0,y0,x1,y1) {
		this._check();
		var f = this._file, wU32=ToEMF.B.writeUint, wI32=ToEMF.B.writeInt;
		this._curh = Math.max(this._curh, y1*10);
		if(!this._inited) {
			this._inited = true;
			this._addRec("HEADER", 88);
			ToEMF._writeHeadBox(f, [x0,y0,x1,y1]);  f.off+=32;
			ToEMF.B.writeASCII(f.file,f.off," EMF");  f.off+=4;
			wU32(f.file,f.off,65536);  f.off+=4;
			this._lenp = f.off;  f.off+=4+4+4;
			f.off += 4+4+4;
			wI32(f.file,f.off,1440);  f.off+=4;
			wI32(f.file,f.off, 900);  f.off+=4;
			wI32(f.file,f.off, 508);  f.off+=4;
			wI32(f.file,f.off, 318);  f.off+=4;
			
			this._trsf([0.1,0,0,0.1,0,0]);
			
			this._addRec("SETBKMODE", 12);	// makes text background transparent
			wU32(f.file,f.off,1);  f.off+=4;
			this._addRec("SETTEXTALIGN", 12);
			wU32(f.file,f.off,24);  f.off+=4;
		}
		else {
			this._curx += this._lstw;
			ToEMF._writeHeadBox(f, [0,0, this._curx+x1, Math.round(this._curh/10)]);
		}
		this._lstw = x1;
	}
	ToEMF.prototype.Stroke = function(gst         ) {  this._draw(gst, 1);  }	
	ToEMF.prototype.Fill   = function(gst, evenOdd) {  this._draw(gst, 2);  }
	ToEMF.prototype.PutImage=function(gst, img, w, h, msk) { 
		var imgl = img.length;  if((imgl&3)!=0) imgl += 4-(imgl&3);
		var m = [1,0,0,-1,0,1];  UDOC.M.concat(m,gst.ctm);
		UDOC.M.scale(m, 10, 10);
		UDOC.M.scale(m, 1, -1);
		UDOC.M.translate(m, this._curx, this._curh);
		this._trsf(m);
		
		var f = this._file, wU32=ToEMF.B.writeUint, wI32=ToEMF.B.writeInt, wU16=ToEMF.B.writeUshort;
		var soff = 8+16+14*4;
		this._addRec("STRETCHDIBITS",soff+40+imgl);
		//console.log(img.length, w*h*4);
		
		f.off+=16; // bbox
		wI32(f.file,f.off,Math.round(0));  f.off+=4;
		wI32(f.file,f.off,Math.round(0));  f.off+=4;
		f.off+=8;
		wI32(f.file,f.off,w);  f.off+=4;
		wI32(f.file,f.off,h);  f.off+=4;
		wU32(f.file,f.off,soff);  f.off+=4;
		wU32(f.file,f.off,40);  f.off+=4;
		wU32(f.file,f.off,soff+40);  f.off+=4;
		wU32(f.file,f.off,img.length);  f.off+=4;
		f.off+=4;
		wU32(f.file,f.off,0x00cc0020);  f.off+=4;
		wI32(f.file,f.off,Math.round(1));  f.off+=4;
		wI32(f.file,f.off,Math.round(1));  f.off+=4;
		
		wI32(f.file,f.off,40);  f.off+=4;
		wI32(f.file,f.off, w);  f.off+=4;
		wI32(f.file,f.off, h);  f.off+=4;
		wU16(f.file,f.off, 1);  f.off+=2;
		wU16(f.file,f.off,32);  f.off+=2;
		wI32(f.file,f.off, 0);  f.off+=4;
		wI32(f.file,f.off,img.length);  f.off+=4;
		wI32(f.file,f.off,3800);  f.off+=4;
		wI32(f.file,f.off,3800);  f.off+=4;
		f.off+=8;
		f.file.req(f.off, img.length);
		if(img.length==w*h*4) {
			for(var y=0; y<h; y++) 
				for(var x=0; x<w; x++) {
					var qi=(y*w+x)<<2, ti=f.off + (((h-1-y)*w+x)<<2);
					f.file.data[ti  ]=img[qi+2];
					f.file.data[ti+1]=img[qi+1];
					f.file.data[ti+2]=img[qi  ];
					f.file.data[ti+3]=img[qi+3];
				}
		}
		else for(var i=0; i<img.length; i++) f.file.data[f.off+i] = img[i];
		
		f.off+=imgl;
		
		UDOC.M.invert(m);  this._trsf(m);
	}
	ToEMF.prototype.PutText= function(gst, str,stw) {
		var strl = str.length;
		if((strl&1)==1) strl++;
		this._check();    //return;
		var f = this._file, wU32=ToEMF.B.writeUint, wI32=ToEMF.B.writeInt, wU=ToEMF.B.writeUshort, wF=ToEMF.B.writeFloat;
		
		//*
		var tclr = ToEMF._color(gst.colr);
		if(tclr!=this._tclr) {
			this._addRec("SETTEXTCOLOR", 12);
			wU32(f.file, f.off, tclr);  f.off+=4;
			this._tclr = tclr;
		}//*/
		
		this._setTool("f", [gst.font.Tf, Math.round(gst.font.Tfs*10)]);
		
		var ox = 10*(gst.ctm[4]+this._curx), oy = this._curh-10*gst.ctm[5], gotRot = Math.abs(gst.ctm[1])>0.05, rm;
		if(gotRot) {  rm=gst.ctm.slice(0);  rm[1]*=-1;  rm[2]*=-1;  rm[4]=ox;  rm[5]=oy;  ox=oy=0;  this._trsf(rm);  }
		
		var soff = 8+16+12  +4*6  +16;
		this._addRec("EXTTEXTOUTW", soff+ strl*2);
		//ToEMF._writeBox(f, [0,0,500,500]);
		f.off+=16;
		wU32(f.file,f.off,2);  f.off+=4;
		wF  (f.file,f.off,31.25);  f.off+=4;
		wF  (f.file,f.off,31.25);  f.off+=4;
		
		wI32(f.file,f.off,Math.round(ox));  f.off+=4;
		wI32(f.file,f.off,Math.round(oy));  f.off+=4;
		wU32(f.file,f.off,str.length);  f.off+=4;
		wU32(f.file,f.off,soff);  f.off+=4;
		wU32(f.file,f.off,0);  f.off+=4;
		//ToEMF._writeBox(f, [0,0,3000,3000]);
		f.off+=16;
		wU32(f.file,f.off,0);  f.off+=4;
		for(var i=0; i<str.length; i++) wU(f.file, f.off+i*2, str.charCodeAt(i));
		f.off+=2*strl;
		
		if(gotRot) {  UDOC.M.invert(rm);  this._trsf(rm);  }
	}	
	ToEMF.prototype.ShowPage=function() {  this._check();  }
	ToEMF.prototype.Done   = function() { 
		this._check();	
		var f = this._file, wU32=ToEMF.B.writeUint;
		this._addRec("EOF", 20);
		wU32(f.file,f.off, 0);  f.off+=4;
		wU32(f.file,f.off,16);  f.off+=4;
		wU32(f.file,f.off,20);  f.off+=4;
		
		wU32(f.file,this._lenp  , f.off);
		wU32(f.file,this._lenp+4, this._recs);
		wU32(f.file,this._lenp+8, this._tabl);
		this.buffer = f.file.data.buffer.slice(0,f.off);  
	}
	
	ToEMF.prototype._check = function() {
		var f = this._file, sf = this._stkf;  if(sf==0) return;
		if(sf==1) this._addRec("STROKEPATH",24); 
		if(sf==2) this._addRec("FILLPATH",24); 	
		if(sf==3) this._addRec("STROKEANDFILLPATH",24); 	
		f.off+=16;
		this._stkf=0;
	}
	
	ToEMF.prototype._addRec   = function(fnm, siz) {
		var f = this._file, wU32=ToEMF.B.writeUint;
		this._recs++;
		wU32(f.file,f.off,ToEMF.C["EMR_"+fnm]);  f.off+=4;
		wU32(f.file,f.off,siz);  f.off+=4;
	}
	ToEMF.prototype._trsf = function(mat) {
		var f = this._file, wI32=ToEMF.B.writeInt;
		this._addRec("MODIFYWORLDTRANSFORM", 36);
		for(var i=0; i<mat.length; i++) {  ToEMF.B.writeFloat(f.file, f.off, mat[i]);  f.off+=4;  }
		wI32(f.file,f.off, 2);  f.off+=4;
	}
	ToEMF._writeHeadBox = function(f, box) {
		var loff = f.off;  f.off = 8;
		ToEMF._writeBox(f, box);
		var scl = (1/72)*25.4*100;
		ToEMF._writeBox(f, [0,0,Math.round((box[2]-box[0])*scl), Math.round((box[3]-box[1])*scl)]);
		f.off = loff;
	}
	ToEMF._writeBox = function(f, box) {
		for(var i=0; i<4; i++) {  ToEMF.B.writeInt(f.file, f.off, box[i]);  f.off+=4;  }
	}
	
	ToEMF.prototype._draw = function(gst, stkf) {  // stkf is 1 or 2
		var f = this._file, wU32=ToEMF.B.writeUint, wI32=ToEMF.B.writeInt;
		
		var pth = gst.pth, spth = JSON.stringify(pth);
		if(this._cpth!=spth) this._check();
		
		if(stkf==1) this._setTool("p", [gst.COLR, gst.lwidth, gst.ljoin]);
		else        this._setTool("b", [gst.colr]);
		
		if(this._cpth==spth) {
			this._stkf += stkf;
		}
		else {
			var ops = {  "M":["MOVETOEX",1], "L":["LINETO",1], "C":["POLYBEZIERTO",3], "Z":["CLOSEFIGURE",0]   }
			var coff=0, cl=pth.cmds.length;
			this._addRec("BEGINPATH",8);
			for(var i=0; i<cl; i++) {
				var c = pth.cmds[i];
				var op = ops[c];  if(op==null) throw c+" e";
				
				var cnum = op[1]*2, fnm=op[0], hsz = 8 + 4*cnum, cnt=1;
				while(true) {  if(i+cnt<cl && pth.cmds[i+cnt]==c) cnt++;  else break;  }
				var useMulti = c=="C" || (c=="L" && cnt>1);
				if(useMulti) {
					cnum *= cnt;
					if(c=="L") fnm="POLYLINETO";
					hsz = 8 + 20 + 4*cnum;
				}
				this._addRec(fnm,hsz);
				if(useMulti) {  f.off+=16;  wU32(f.file, f.off, cnt*op[1]);  f.off+=4;  i+=cnt-1;  }
				for(var j=0; j<cnum; j+=2) {  
					wI32(f.file, f.off, Math.round(10*(pth.crds[coff]+this._curx)));  f.off+=4;  coff++;  
					wI32(f.file, f.off, Math.round(this._curh-10*pth.crds[coff]));  f.off+=4;  coff++;  
				}
			}
			this._addRec("ENDPATH",8);
			this._cpth = spth;
			this._stkf = stkf;
		}
	}
	
	ToEMF.prototype._setTool = function(t, pms) {
		var f = this._file, wU32=ToEMF.B.writeUint, wI32=ToEMF.B.writeInt;
		
		var bkey = t+JSON.stringify(pms);
		var bid = this._objs[bkey];
		if(bid==null) {
			bid = this._objs[bkey] = this._tabl;  this._tabl++;
			if(t=="b") this._addRec("CREATEBRUSHINDIRECT",24);
			if(t=="p") this._addRec("CREATEPEN",          28);
			if(t=="f") this._addRec("EXTCREATEFONTINDIRECTW",104);
			wU32(f.file, f.off, bid);  f.off+=4;
				
			if(t=="b" || t=="p") {
				if(t=="p") {
					wU32(f.file, f.off, 0/*[0x2000,0,0x1000][pms[2]]*/);  f.off+=4;
					var lw = Math.round(pms[1]*10);
					wU32(f.file, f.off, lw);  f.off+=4;
					wU32(f.file, f.off, lw);  f.off+=4;
				}
				else {  wU32(f.file, f.off, 0);  f.off+=4;  }
				
				wU32(f.file, f.off, ToEMF._color(pms[0]));  f.off+=4;
				if(t=="b") {  wU32(f.file, f.off, 0);  f.off+=4;  }
			}
			if(t=="f") {
				var fn = pms[0], isB = fn.toLowerCase().indexOf("bold")!=-1;
				if(fn.endsWith("-Bold")) fn=fn.slice(0,fn.length-5);
				wI32(f.file, f.off, -pms[1]);  f.off+=4;
				f.off+=12;  // wid, esc, orn,
				wU32(f.file, f.off, isB ? 700 : 400);  f.off+=4;
				wU32(f.file, f.off, 0x00000000);  f.off+=4; // 0, 0, 0, 0
				wU32(f.file, f.off, 0x00040007);  f.off+=4; // 7, 0, 4, 0
				for(var i=0; i<fn.length; i++) ToEMF.B.writeUshort(f.file, f.off+i*2, fn.charCodeAt(i));
				//ToEMF.B.writeASCII(f.file, f.off, fn);
				f.off+=64;
			}
		}
		if(this._curt[t]!=bid) {
			this._addRec("SELECTOBJECT",12);
			wU32(f.file, f.off, bid);  f.off+=4;
			this._curt[t]=bid;
		}
	}
	ToEMF._color = function(clr) {  var r=Math.round(clr[0]*255), g=Math.round(clr[1]*255), b=Math.round(clr[2]*255);  return (b<<16)|(g<<8)|(r<<0);  }
	
	
	ToEMF.B = {
		uint8 : new Uint8Array(4),
		writeShort  : function(f,p,v)  {  ToEMF.B.int16 [0]=v;  f.req(p,2);  var u8=ToEMF.B.uint8,b=f.data;  b[p]=u8[0];  b[p+1]=u8[1];  },
		writeUshort : function(f,p,v)  {  ToEMF.B.uint16[0]=v;  f.req(p,2);  var u8=ToEMF.B.uint8,b=f.data;  b[p]=u8[0];  b[p+1]=u8[1];  },
		writeInt    : function(f,p,v)  {  ToEMF.B.int32 [0]=v;  f.req(p,4);  var u8=ToEMF.B.uint8,b=f.data;  b[p]=u8[0];  b[p+1]=u8[1];  b[p+2]=u8[2];  b[p+3]=u8[3];  },
		writeUint   : function(f,p,v)  {  ToEMF.B.uint32[0]=v;  f.req(p,4);  var u8=ToEMF.B.uint8,b=f.data;  b[p]=u8[0];  b[p+1]=u8[1];  b[p+2]=u8[2];  b[p+3]=u8[3];  },
		writeFloat  : function(f,p,v)  {  ToEMF.B.flot32[0]=v;  f.req(p,4);  var u8=ToEMF.B.uint8,b=f.data;  b[p]=u8[0];  b[p+1]=u8[1];  b[p+2]=u8[2];  b[p+3]=u8[3];  },
		writeASCII  : function(f,p,v)  {  f.req(p,v.length);  for(var i=0; i<v.length; i++) f.data[p+i]=v.charCodeAt(i);  }
	}
	ToEMF.B.int16  = new Int16Array (ToEMF.B.uint8.buffer);
	ToEMF.B.uint16 = new Uint16Array(ToEMF.B.uint8.buffer);
	ToEMF.B.int32  = new Int32Array (ToEMF.B.uint8.buffer);
	ToEMF.B.uint32 = new Uint32Array(ToEMF.B.uint8.buffer);
	ToEMF.B.flot32 = new Float32Array(ToEMF.B.uint8.buffer);
	
	
	ToEMF.MFile = function()
	{
		this.size = 16;
		this.data = new Uint8Array(16);
	}
	ToEMF.MFile.prototype.req = function(off, len)
	{
		if(off + len <= this.size) return;
		var ps = this.size;
		while(off+len>this.size) this.size *= 2;
		var ndata = new Uint8Array(this.size);
		for(var i=0; i<ps; i++) ndata[i] = this.data[i];
		this.data = ndata;
	}
	
	ToEMF.C = {
		EMR_HEADER : 0x00000001,
		EMR_POLYBEZIER : 0x00000002,
		EMR_POLYGON : 0x00000003,
		EMR_POLYLINE : 0x00000004,
		EMR_POLYBEZIERTO : 0x00000005,
		EMR_POLYLINETO : 0x00000006,
		EMR_POLYPOLYLINE : 0x00000007,
		EMR_POLYPOLYGON : 0x00000008,
		EMR_SETWINDOWEXTEX : 0x00000009,
		EMR_SETWINDOWORGEX : 0x0000000A,
		EMR_SETVIEWPORTEXTEX : 0x0000000B,
		EMR_SETVIEWPORTORGEX : 0x0000000C,
		EMR_SETBRUSHORGEX : 0x0000000D,
		EMR_EOF : 0x0000000E,
		EMR_SETPIXELV : 0x0000000F,
		EMR_SETMAPPERFLAGS : 0x00000010,
		EMR_SETMAPMODE : 0x00000011,
		EMR_SETBKMODE : 0x00000012,
		EMR_SETPOLYFILLMODE : 0x00000013,
		EMR_SETROP2 : 0x00000014,
		EMR_SETSTRETCHBLTMODE : 0x00000015,
		EMR_SETTEXTALIGN : 0x00000016,
		EMR_SETCOLORADJUSTMENT : 0x00000017,
		EMR_SETTEXTCOLOR : 0x00000018,
		EMR_SETBKCOLOR : 0x00000019,
		EMR_OFFSETCLIPRGN : 0x0000001A,
		EMR_MOVETOEX : 0x0000001B,
		EMR_SETMETARGN : 0x0000001C,
		EMR_EXCLUDECLIPRECT : 0x0000001D,
		EMR_INTERSECTCLIPRECT : 0x0000001E,
		EMR_SCALEVIEWPORTEXTEX : 0x0000001F,
		EMR_SCALEWINDOWEXTEX : 0x00000020,
		EMR_SAVEDC : 0x00000021,
		EMR_RESTOREDC : 0x00000022,
		EMR_SETWORLDTRANSFORM : 0x00000023,
		EMR_MODIFYWORLDTRANSFORM : 0x00000024,
		EMR_SELECTOBJECT : 0x00000025,
		EMR_CREATEPEN : 0x00000026,
		EMR_CREATEBRUSHINDIRECT : 0x00000027,
		EMR_DELETEOBJECT : 0x00000028,
		EMR_ANGLEARC : 0x00000029,
		EMR_ELLIPSE : 0x0000002A,
		EMR_RECTANGLE : 0x0000002B,
		EMR_ROUNDRECT : 0x0000002C,
		EMR_ARC : 0x0000002D,
		EMR_CHORD : 0x0000002E,
		EMR_PIE : 0x0000002F,
		EMR_SELECTPALETTE : 0x00000030,
		EMR_CREATEPALETTE : 0x00000031,
		EMR_SETPALETTEENTRIES : 0x00000032,
		EMR_RESIZEPALETTE : 0x00000033,
		EMR_REALIZEPALETTE : 0x00000034,
		EMR_EXTFLOODFILL : 0x00000035,
		EMR_LINETO : 0x00000036,
		EMR_ARCTO : 0x00000037,
		EMR_POLYDRAW : 0x00000038,
		EMR_SETARCDIRECTION : 0x00000039,
		EMR_SETMITERLIMIT : 0x0000003A,
		EMR_BEGINPATH : 0x0000003B,
		EMR_ENDPATH : 0x0000003C,
		EMR_CLOSEFIGURE : 0x0000003D,
		EMR_FILLPATH : 0x0000003E,
		EMR_STROKEANDFILLPATH : 0x0000003F,
		EMR_STROKEPATH : 0x00000040,
		EMR_FLATTENPATH : 0x00000041,
		EMR_WIDENPATH : 0x00000042,
		EMR_SELECTCLIPPATH : 0x00000043,
		EMR_ABORTPATH : 0x00000044,
		EMR_COMMENT : 0x00000046,
		EMR_FILLRGN : 0x00000047,
		EMR_FRAMERGN : 0x00000048,
		EMR_INVERTRGN : 0x00000049,
		EMR_PAINTRGN : 0x0000004A,
		EMR_EXTSELECTCLIPRGN : 0x0000004B,
		EMR_BITBLT : 0x0000004C,
		EMR_STRETCHBLT : 0x0000004D,
		EMR_MASKBLT : 0x0000004E,
		EMR_PLGBLT : 0x0000004F,
		EMR_SETDIBITSTODEVICE : 0x00000050,
		EMR_STRETCHDIBITS : 0x00000051,
		EMR_EXTCREATEFONTINDIRECTW : 0x00000052,
		EMR_EXTTEXTOUTA : 0x00000053,
		EMR_EXTTEXTOUTW : 0x00000054,
		EMR_POLYBEZIER16 : 0x00000055,
		EMR_POLYGON16 : 0x00000056,
		EMR_POLYLINE16 : 0x00000057,
		EMR_POLYBEZIERTO16 : 0x00000058,
		EMR_POLYLINETO16 : 0x00000059,
		EMR_POLYPOLYLINE16 : 0x0000005A,
		EMR_POLYPOLYGON16 : 0x0000005B,
		EMR_POLYDRAW16 : 0x0000005C,
		EMR_CREATEMONOBRUSH : 0x0000005D,
		EMR_CREATEDIBPATTERNBRUSHPT : 0x0000005E,
		EMR_EXTCREATEPEN : 0x0000005F,
		EMR_POLYTEXTOUTA : 0x00000060,
		EMR_POLYTEXTOUTW : 0x00000061,
		EMR_SETICMMODE : 0x00000062,
		EMR_CREATECOLORSPACE : 0x00000063,
		EMR_SETCOLORSPACE : 0x00000064,
		EMR_DELETECOLORSPACE : 0x00000065,
		EMR_GLSRECORD : 0x00000066,
		EMR_GLSBOUNDEDRECORD : 0x00000067,
		EMR_PIXELFORMAT : 0x00000068,
		EMR_DRAWESCAPE : 0x00000069,
		EMR_EXTESCAPE : 0x0000006A,
		EMR_SMALLTEXTOUT : 0x0000006C,
		EMR_FORCEUFIMAPPING : 0x0000006D,
		EMR_NAMEDESCAPE : 0x0000006E,
		EMR_COLORCORRECTPALETTE : 0x0000006F,
		EMR_SETICMPROFILEA : 0x00000070,
		EMR_SETICMPROFILEW : 0x00000071,
		EMR_ALPHABLEND : 0x00000072,
		EMR_SETLAYOUT : 0x00000073,
		EMR_TRANSPARENTBLT : 0x00000074,
		EMR_GRADIENTFILL : 0x00000076,
		EMR_SETLINKEDUFIS : 0x00000077,
		EMR_SETTEXTJUSTIFICATION : 0x00000078,
		EMR_COLORMATCHTOTARGETW : 0x00000079,
		EMR_CREATECOLORSPACEW : 0x0000007A
	};
	ToEMF.K = [];
	
	(function() {
		var inp, out, stt;
		inp = ToEMF.C;   out = ToEMF.K;   stt=4;
		for(var p in inp) out[inp[p]] = p.slice(stt);
	}  )();
	
	