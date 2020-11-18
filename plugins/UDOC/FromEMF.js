	
	
	
	
	function FromEMF ()
	{
	}
	
	FromEMF.Parse = function(buff, genv)
	{
		buff = new Uint8Array(buff);  var off=0;
		//console.log(buff.slice(0,32));
		var prms = {fill:false, strk:false, bb:[0,0,1,1], wbb:[0,0,1,1], fnt:{nam:"Arial",hgh:25,und:false,orn:0}, tclr:[0,0,0], talg:0}, gst, tab = [], sts=[];
		
		var rI = FromEMF.B.readShort, rU = FromEMF.B.readUshort, rI32 = FromEMF.B.readInt, rU32 = FromEMF.B.readUint, rF32 = FromEMF.B.readFloat;	
		
		var opn=0;
		while(true) {
			var fnc = rU32(buff, off);  off+=4;
			var fnm = FromEMF.K[fnc]; 
			var siz = rU32(buff, off);  off+=4;
			
			//if(gst && isNaN(gst.ctm[0])) throw "e";
			//console.log(fnc,fnm,siz);
			
			var loff = off;
			
			//if(opn++==253) break;
			var obj = null, oid = 0;
			//console.log(fnm, siz);
			
			if(false) {}
			else if(fnm=="EOF") {  break;  }
			else if(fnm=="HEADER") {
				prms.bb = FromEMF._readBox(buff,loff);   loff+=16;  //console.log(fnm, prms.bb);
				genv.StartPage(prms.bb[0],prms.bb[1],prms.bb[2],prms.bb[3]);
				gst = UDOC.getState(prms.bb);	
			}
			else if(fnm=="SAVEDC") sts.push(JSON.stringify(gst), JSON.stringify(prms));
			else if(fnm=="RESTOREDC") {
				var dif = rI32(buff, loff);  loff+=4;
				while(dif<-1) {  sts.pop();  sts.pop();  }
				prms = JSON.parse(sts.pop());  gst = JSON.parse(sts.pop());
			}
			else if(fnm=="SELECTCLIPPATH") {  gst.cpth = JSON.parse(JSON.stringify(gst.pth));  }
			else if(["SETMAPMODE","SETPOLYFILLMODE","SETBKMODE"/*,"SETVIEWPORTEXTEX"*/,"SETICMMODE","SETROP2","EXTSELECTCLIPRGN"].indexOf(fnm)!=-1) {}
			//else if(fnm=="INTERSECTCLIPRECT") {  var r=prms.crct=FromEMF._readBox(buff, loff);  /*var y0=r[1],y1=r[3]; if(y0>y1){r[1]=y1; r[3]=y0;}*/ console.log(prms.crct);  }
			else if(fnm=="SETMITERLIMIT") gst.mlimit = rU32(buff, loff);
			else if(fnm=="SETTEXTCOLOR") prms.tclr = [buff[loff]/255, buff[loff+1]/255, buff[loff+2]/255]; 
			else if(fnm=="SETTEXTALIGN") prms.talg = rU32(buff, loff);
			else if(fnm=="SETVIEWPORTEXTEX" || fnm=="SETVIEWPORTORGEX") {
				if(prms.vbb==null) prms.vbb=[];
				var coff = fnm=="SETVIEWPORTORGEX" ? 0 : 2;
				prms.vbb[coff  ] = rI32(buff, loff);  loff+=4;
				prms.vbb[coff+1] = rI32(buff, loff);  loff+=4;
				//console.log(prms.vbb);
				if(fnm=="SETVIEWPORTEXTEX") FromEMF._updateCtm(prms, gst);
			}
			else if(fnm=="SETWINDOWEXTEX" || fnm=="SETWINDOWORGEX") {
				var coff = fnm=="SETWINDOWORGEX" ? 0 : 2;
				prms.wbb[coff  ] = rI32(buff, loff);  loff+=4;
				prms.wbb[coff+1] = rI32(buff, loff);  loff+=4;
				if(fnm=="SETWINDOWEXTEX") FromEMF._updateCtm(prms, gst);
			}
			//else if(fnm=="SETMETARGN") {}
			else if(fnm=="COMMENT") {  var ds = rU32(buff, loff);  loff+=4;  }
			
			else if(fnm=="SELECTOBJECT") {
				var ind = rU32(buff, loff);  loff+=4;
				//console.log(ind.toString(16), tab, tab[ind]);
				if     (ind==0x80000000) {  prms.fill=true ;  gst.colr=[1,1,1];  } // white brush
				else if(ind==0x80000005) {  prms.fill=false;  } // null brush
				else if(ind==0x80000007) {  prms.strk=true ;  prms.lwidth=1;  gst.COLR=[0,0,0];  } // black pen
				else if(ind==0x80000008) {  prms.strk=false;  } // null  pen
				else if(ind==0x8000000d) {} // system font
				else if(ind==0x8000000e) {}  // device default font
				else {
					var co = tab[ind];  //console.log(ind, co);
					if(co.t=="b") {
						prms.fill=co.stl!=1;
						if     (co.stl==0) {}
						else if(co.stl==1) {}
						else throw co.stl+" e";
						gst.colr=co.clr;
					}
					else if(co.t=="p") {
						prms.strk=co.stl!=5;
						gst.lwidth = co.wid;
						gst.COLR=co.clr;
					}
					else if(co.t=="f") {
						prms.fnt = co;
						gst.font.Tf = co.nam;
						gst.font.Tfs = Math.abs(co.hgh);
						gst.font.Tun = co.und;
					}
					else throw "e";
				}
			}
			else if(fnm=="DELETEOBJECT") {
				var ind = rU32(buff, loff);  loff+=4;
				if(tab[ind]!=null) tab[ind]=null;
				else throw "e";
			}
			else if(fnm=="CREATEBRUSHINDIRECT") {
				oid = rU32(buff, loff);  loff+=4;
				obj = {t:"b"};
				obj.stl = rU32(buff, loff);  loff+=4;
				obj.clr = [buff[loff]/255, buff[loff+1]/255, buff[loff+2]/255];  loff+=4;
				obj.htc = rU32(buff, loff);  loff+=4;
				//console.log(oid, obj);
			}
			else if(fnm=="CREATEPEN" || fnm=="EXTCREATEPEN") {
				oid = rU32(buff, loff);  loff+=4;
				obj = {t:"p"};
				if(fnm=="EXTCREATEPEN") {
					loff+=16;
					obj.stl = rU32(buff, loff);  loff+=4;
					obj.wid = rU32(buff, loff);  loff+=4;
					//obj.stl = rU32(buff, loff);  
					loff+=4;
				} else {
					obj.stl = rU32(buff, loff);  loff+=4;
					obj.wid = rU32(buff, loff);  loff+=4;  loff+=4;
				}
				obj.clr = [buff[loff]/255, buff[loff+1]/255, buff[loff+2]/255];  loff+=4;
			}
			else if(fnm=="EXTCREATEFONTINDIRECTW") {
				oid = rU32(buff, loff);  loff+=4;
				obj = {t:"f", nam:""};
				obj.hgh = rI32(buff, loff);  loff += 4;
				loff += 4*2;
				obj.orn = rI32(buff, loff)/10;  loff+=4;
				var wgh = rU32(buff, loff);  loff+=4;  //console.log(fnm, obj.orn, wgh);
				//console.log(rU32(buff,loff), rU32(buff,loff+4), buff.slice(loff,loff+8));
				obj.und = buff[loff+1];  obj.stk = buff[loff+2];  loff += 4*2;
				while(rU(buff,loff)!=0) {  obj.nam+=String.fromCharCode(rU(buff,loff));  loff+=2;  }
				if(wgh>500) obj.nam+="-Bold";
				//console.log(wgh, obj.nam);
			}
			else if(fnm=="EXTTEXTOUTW") {
				//console.log(buff.slice(loff-8, loff-8+siz));
				loff+=16;
				var mod = rU32(buff, loff);  loff+=4;  //console.log(mod);
				var scx = rF32(buff, loff);  loff+=4;
				var scy = rF32(buff, loff);  loff+=4;
				var rfx = rI32(buff, loff);  loff+=4;
				var rfy = rI32(buff, loff);  loff+=4;
				//console.log(mod, scx, scy,rfx,rfy);
				
				gst.font.Tm = [1,0,0,-1,0,0];
				UDOC.M.rotate(gst.font.Tm, prms.fnt.orn*Math.PI/180);
				UDOC.M.translate(gst.font.Tm, rfx, rfy);
				
				var alg = prms.talg;  //console.log(alg.toString(2));
				if     ((alg&6)==6) gst.font.Tal = 2;
				else if((alg&7)==0) gst.font.Tal = 0;
				else throw alg+" e";
				if((alg&24)==24) {}  // baseline
				else if((alg&24)==0) UDOC.M.translate(gst.font.Tm, 0, gst.font.Tfs);
				else throw "e";
				
				
				var crs = rU32(buff, loff);  loff+=4;
				var ofs = rU32(buff, loff);  loff+=4;
				var ops = rU32(buff, loff);  loff+=4;  //if(ops!=0) throw "e";
				//console.log(ofs,ops,crs);
				loff+=16;
				var ofD = rU32(buff, loff);  loff+=4;  //console.log(ops, ofD, loff, ofs+off-8);
				ofs += off-8;  //console.log(crs, ops);
				var str = "";
				for(var i=0; i<crs; i++) {  var cc=rU(buff,ofs+i*2);  str+=String.fromCharCode(cc);  };
				var oclr = gst.colr;  gst.colr = prms.tclr;
				//console.log(str, gst.colr, gst.font.Tm);
				//var otfs = gst.font.Tfs;  gst.font.Tfs *= 1/gst.ctm[0];
				genv.PutText(gst, str, str.length*gst.font.Tfs*0.5);  gst.colr=oclr;
				//gst.font.Tfs = otfs;
				//console.log(rfx, rfy, scx, ops, rcX, rcY, rcW, rcH, offDx, str);
			}
			else if(fnm=="BEGINPATH") {  UDOC.G.newPath(gst);  }
			else if(fnm=="ENDPATH"  ) {    }
			else if(fnm=="CLOSEFIGURE") UDOC.G.closePath(gst);
			else if(fnm=="MOVETOEX" ) {  UDOC.G.moveTo(gst, rI32(buff,loff), rI32(buff,loff+4));  }
			else if(fnm=="LINETO"   ) {  
				if(gst.pth.cmds.length==0) {  var im=gst.ctm.slice(0);  UDOC.M.invert(im);  var p = UDOC.M.multPoint(im, gst.cpos);  UDOC.G.moveTo(gst, p[0], p[1]);  }  
				UDOC.G.lineTo(gst, rI32(buff,loff), rI32(buff,loff+4));  }
			else if(fnm=="POLYGON" || fnm=="POLYGON16" || fnm=="POLYLINE" || fnm=="POLYLINE16" || fnm=="POLYLINETO" || fnm=="POLYLINETO16") {
				loff+=16;
				var ndf = fnm.startsWith("POLYGON"), isTo = fnm.indexOf("TO")!=-1;
				var cnt = rU32(buff, loff);  loff+=4;
				if(!isTo) UDOC.G.newPath(gst);
				loff = FromEMF._drawPoly(buff,loff,cnt,gst, fnm.endsWith("16")?2:4,  ndf, isTo);
				if(!isTo) FromEMF._draw(genv,gst,prms, ndf);
				//console.log(prms, gst.lwidth);
				//console.log(JSON.parse(JSON.stringify(gst.pth)));
			}
			else if(fnm=="POLYPOLYGON16") {
				loff+=16;
				var ndf = fnm.startsWith("POLYPOLYGON"), isTo = fnm.indexOf("TO")!=-1;
				var nop = rU32(buff, loff);  loff+=4;  loff+=4;
				var pi = loff;  loff+= nop*4;
				
				if(!isTo) UDOC.G.newPath(gst);
				for(var i=0; i<nop; i++) {
					var ppp = rU(buff, pi+i*4);
					loff = FromEMF._drawPoly(buff,loff,ppp,gst, fnm.endsWith("16")?2:4, ndf, isTo);
				}
				if(!isTo) FromEMF._draw(genv,gst,prms, ndf);
			}
			else if(fnm=="POLYBEZIER" || fnm=="POLYBEZIER16" || fnm=="POLYBEZIERTO" || fnm=="POLYBEZIERTO16") {
				loff+=16;
				var is16 = fnm.endsWith("16"), rC = is16?rI:rI32, nl = is16?2:4;
				var cnt = rU32(buff, loff);  loff+=4;
				if(fnm.indexOf("TO")==-1) {
					UDOC.G.moveTo(gst, rC(buff,loff), rC(buff,loff+nl));  loff+=2*nl;  cnt--;
				}
				while(cnt>0) {
					UDOC.G.curveTo(gst, rC(buff,loff), rC(buff,loff+nl), rC(buff,loff+2*nl), rC(buff,loff+3*nl), rC(buff,loff+4*nl), rC(buff,loff+5*nl) );
					loff+=6*nl;
					cnt-=3;
				}
				//console.log(JSON.parse(JSON.stringify(gst.pth)));
			}
			else if(fnm=="RECTANGLE" || fnm=="ELLIPSE") {
				UDOC.G.newPath(gst);
				var bx = FromEMF._readBox(buff, loff);
				if(fnm=="RECTANGLE") {
					UDOC.G.moveTo(gst, bx[0],bx[1]);
					UDOC.G.lineTo(gst, bx[2],bx[1]);
					UDOC.G.lineTo(gst, bx[2],bx[3]);
					UDOC.G.lineTo(gst, bx[0],bx[3]);
				}
				else {
					var x = (bx[0]+bx[2])/2, y = (bx[1]+bx[3])/2;
					UDOC.G.arc(gst,x,y,(bx[2]-bx[0])/2,0,2*Math.PI, false);
				}
				UDOC.G.closePath(gst);
				FromEMF._draw(genv,gst,prms, true);
				//console.log(prms, gst.lwidth);
			}
			else if(fnm=="FILLPATH"  ) genv.Fill(gst, false);
			else if(fnm=="STROKEPATH") genv.Stroke(gst);
			else if(fnm=="STROKEANDFILLPATH") {  genv.Fill(gst, false);  genv.Stroke(gst);  }
			else if(fnm=="SETWORLDTRANSFORM" || fnm=="MODIFYWORLDTRANSFORM") {
				var mat = [];
				for(var i=0; i<6; i++) mat.push(rF32(buff,loff+i*4));  loff+=24;
				//console.log(fnm, gst.ctm.slice(0), mat);
				if(fnm=="SETWORLDTRANSFORM") gst.ctm=mat;
				else {
					var mod = rU32(buff,loff);  loff+=4;
					if(mod==2) {  var om=gst.ctm;  gst.ctm=mat;  UDOC.M.concat(gst.ctm, om);  }
					else throw "e";
				}
			}
			else if(fnm=="SETSTRETCHBLTMODE") {  var sm = rU32(buff, loff);  loff+=4;  }
			else if(fnm=="STRETCHDIBITS") {
				var bx = FromEMF._readBox(buff, loff);  loff+=16;
				var xD = rI32(buff, loff);  loff+=4;
				var yD = rI32(buff, loff);  loff+=4;
				var xS = rI32(buff, loff);  loff+=4;
				var yS = rI32(buff, loff);  loff+=4;
				var wS = rI32(buff, loff);  loff+=4;
				var hS = rI32(buff, loff);  loff+=4;
				var ofH = rU32(buff, loff)+off-8;  loff+=4;
				var szH = rU32(buff, loff);  loff+=4;
				var ofB = rU32(buff, loff)+off-8;  loff+=4;
				var szB = rU32(buff, loff);  loff+=4;
				var usg = rU32(buff, loff);  loff+=4;  if(usg!=0) throw "e";
				var bop = rU32(buff, loff);  loff+=4;
				var wD = rI32(buff, loff);  loff+=4;
				var hD = rI32(buff, loff);  loff+=4;  //console.log(bop, wD, hD);
				
				//console.log(ofH, szH, ofB, szB, ofH+40);
				//console.log(bx, xD,yD,wD,hD);
				//console.log(xS,yS,wS,hS);
				//console.log(ofH,szH,ofB,szB,usg,bop);
				
				var hl = rU32(buff, ofH);  ofH+=4;
				var w  = rU32(buff, ofH);  ofH+=4;
				var h  = rU32(buff, ofH);  ofH+=4;  if(w!=wS || h!=hS) throw "e";
				var ps = rU  (buff, ofH);  ofH+=2;
				var bc = rU  (buff, ofH);  ofH+=2;  if(bc!=8 && bc!=24 && bc!=32) throw bc+" e";
				var cpr= rU32(buff, ofH);  ofH+=4;  if(cpr!=0) throw cpr+" e";
				var sz = rU32(buff, ofH);  ofH+=4;
				var xpm= rU32(buff, ofH);  ofH+=4;
				var ypm= rU32(buff, ofH);  ofH+=4;
				var cu = rU32(buff, ofH);  ofH+=4;
				var ci = rU32(buff, ofH);  ofH+=4;  //console.log(hl, w, h, ps, bc, cpr, sz, xpm, ypm, cu, ci);
				
				//console.log(hl,w,h,",",xS,yS,wS,hS,",",xD,yD,wD,hD,",",xpm,ypm);
				
				var rl = Math.floor(((w * ps * bc + 31) & ~31) / 8);
				var img = new Uint8Array(w*h*4);
				if(bc==8) {
					for(var y=0; y<h; y++) 
						for(var x=0; x<w; x++) {
							var qi = (y*w+x)<<2, ind = buff[ofB+(h-1-y)*rl+x]<<2;
							img[qi  ] = buff[ofH+ind+2];
							img[qi+1] = buff[ofH+ind+1];
							img[qi+2] = buff[ofH+ind+0];
							img[qi+3] = 255;
						}
				}
				if(bc==24) {
					for(var y=0; y<h; y++) 
						for(var x=0; x<w; x++) {
							var qi = (y*w+x)<<2, ti=ofB+(h-1-y)*rl+x*3;
							img[qi  ] = buff[ti+2];
							img[qi+1] = buff[ti+1];
							img[qi+2] = buff[ti+0];
							img[qi+3] = 255;
						}
				}
				if(bc==32) {
					for(var y=0; y<h; y++) 
						for(var x=0; x<w; x++) {
							var qi = (y*w+x)<<2, ti=ofB+(h-1-y)*rl+x*4;
							img[qi  ] = buff[ti+2];
							img[qi+1] = buff[ti+1];
							img[qi+2] = buff[ti+0];
							img[qi+3] = buff[ti+3];
						}
				}
				
				var ctm = gst.ctm.slice(0);
				gst.ctm = [1,0,0,1,0,0];
				UDOC.M.scale(gst.ctm, wD, -hD);
				UDOC.M.translate(gst.ctm, xD, yD+hD);
				UDOC.M.concat(gst.ctm, ctm);
				genv.PutImage(gst, img, w, h);
				gst.ctm = ctm;
			}
			else {
				console.log(fnm, siz);
			}
			
			if(obj!=null) tab[oid]=obj;
			
			off+=siz-8;
		}
		//genv.Stroke(gst);
		genv.ShowPage();  genv.Done();
	}
	FromEMF._readBox = function(buff, off) {  var b=[];  for(var i=0; i<4; i++) b[i] = FromEMF.B.readInt(buff,off+i*4);  return b;  }	
	
	FromEMF._updateCtm = function(prms, gst) {
		var mat = [1,0,0,1,0,0];
		var wbb = prms.wbb, bb = prms.bb, vbb=(prms.vbb && prms.vbb.length==4) ? prms.vbb:prms.bb;
		
		//var y0 = bb[1], y1 = bb[3];  bb[1]=Math.min(y0,y1);  bb[3]=Math.max(y0,y1);
		
		UDOC.M.translate(mat, -wbb[0],-wbb[1]);
		UDOC.M.scale(mat, 1/wbb[2], 1/wbb[3]);
		
		UDOC.M.scale(mat, vbb[2], vbb[3]);
		//UDOC.M.scale(mat, vbb[2]/(bb[2]-bb[0]), vbb[3]/(bb[3]-bb[1]));
		
		//UDOC.M.scale(mat, bb[2]-bb[0],bb[3]-bb[1]);
		
		gst.ctm = mat;
	}
	FromEMF._draw = function(genv, gst, prms, needFill) {
		if(prms.fill && needFill     ) genv.Fill  (gst, false);
		if(prms.strk && gst.lwidth!=0) genv.Stroke(gst);
	}
	FromEMF._drawPoly = function(buff, off, ppp, gst, nl, clos, justLine) {
		var rS = nl==2 ? FromEMF.B.readShort : FromEMF.B.readInt;
		for(var j=0; j<ppp; j++) {
			var px = rS(buff, off);  off+=nl;  
			var py = rS(buff, off);  off+=nl;
			if(j==0 && !justLine) UDOC.G.moveTo(gst,px,py);  else UDOC.G.lineTo(gst,px,py);
		}
		if(clos) UDOC.G.closePath(gst);
		return off;
	}
	
	FromEMF.B = {
		uint8 : new Uint8Array(4),
		readShort  : function(buff,p)  {  var u8=FromEMF.B.uint8;  u8[0]=buff[p];  u8[1]=buff[p+1];  return FromEMF.B.int16 [0];  },
		readUshort : function(buff,p)  {  var u8=FromEMF.B.uint8;  u8[0]=buff[p];  u8[1]=buff[p+1];  return FromEMF.B.uint16[0];  },
		readInt    : function(buff,p)  {  var u8=FromEMF.B.uint8;  u8[0]=buff[p];  u8[1]=buff[p+1];  u8[2]=buff[p+2];  u8[3]=buff[p+3];  return FromEMF.B.int32 [0];  },
		readUint   : function(buff,p)  {  var u8=FromEMF.B.uint8;  u8[0]=buff[p];  u8[1]=buff[p+1];  u8[2]=buff[p+2];  u8[3]=buff[p+3];  return FromEMF.B.uint32[0];  },
		readFloat  : function(buff,p)  {  var u8=FromEMF.B.uint8;  u8[0]=buff[p];  u8[1]=buff[p+1];  u8[2]=buff[p+2];  u8[3]=buff[p+3];  return FromEMF.B.flot32[0];  },
		readASCII  : function(buff,p,l){  var s = "";  for(var i=0; i<l; i++) s += String.fromCharCode(buff[p+i]);  return s;    }
	}
	FromEMF.B.int16  = new Int16Array (FromEMF.B.uint8.buffer);
	FromEMF.B.uint16 = new Uint16Array(FromEMF.B.uint8.buffer);
	FromEMF.B.int32  = new Int32Array (FromEMF.B.uint8.buffer);
	FromEMF.B.uint32 = new Uint32Array(FromEMF.B.uint8.buffer);
	FromEMF.B.flot32 = new Float32Array(FromEMF.B.uint8.buffer);
	
	
	FromEMF.C = {
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
	FromEMF.K = [];
	
	(function() {
		var inp, out, stt;
		inp = FromEMF.C;   out = FromEMF.K;   stt=4;
		for(var p in inp) out[inp[p]] = p.slice(stt);
	}  )();
	