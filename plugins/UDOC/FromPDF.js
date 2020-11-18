	
	
	
	
	function FromPDF ()
	{
	}
	
	FromPDF.Parse = function(buff, genv)
	{
		buff = new Uint8Array(buff);
		var off = 0;
		while(buff[off]==32) off++;
		if(off!=0) buff = new Uint8Array(buff.buffer, off, buff.length-off);
		
		var offset = buff.length-3;
		while(FromPS.B.readASCII(buff,offset,3) != "%%E") offset--;
		
		var eoff = offset;
		
		offset--;
		while( FromPS.isEOL(buff[offset])) offset--;
		while(!FromPS.isEOL(buff[offset])) offset--;
		
		var xref = parseInt(FromPS.B.readASCII(buff, offset+1, eoff-offset-1));
		
		if(isNaN(xref)) throw "no xref";
		
		var xr = [];
		var tr = FromPDF.readXrefTrail(buff, xref, xr);
		
		//console.log(xr);
		
		var file = {buff:buff, off:0}, rt = tr["/Root"];
		if(rt.typ=="ref") tr["/Root"] = FromPDF.getIndirect(rt.ind,rt.gen,file,xr)
		var ps = tr["/Root"]["/Pages"];
		if(ps.typ=="ref") tr["/Root"]["/Pages"] = FromPDF.getIndirect(ps.ind,ps.gen,file,xr)
		
		var stk = [tr["/Root"]["/Pages"]];
		
		while(stk.length!=0) {
			var pg = stk.pop();
			if(pg["/Type"]=="/Pages") {
				var ks = pg["/Kids"];
				for(var i=0; i<ks.length; i++) {
					if(ks[i].typ=="ref") ks[i] = FromPDF.getIndirect(ks[i].ind,ks[i].gen,file,xr)
					stk.push(ks[i]);
				}
			}
		}
		
		var time = Date.now();
		FromPDF.render(tr["/Root"], genv, tr);
		genv.Done();
		//console.log(Date.now()-time);
	}
	FromPDF.render = function(root, genv, tr)
	{		
		var ops = [
			"CS","cs","SCN","scn","SC","sc","sh",
			"Do", "gs", "ID","EI", "re","cm","y","v","B","B*",  "BT","ET",
			"Tj","TJ","Tf","Tm","Td","T*",
			"Tc","Tw","Tz","TL","Tr","Ts",
			"MP","DP","BMC","BDC","EMC","BX","EX",  "ri"
		];
		
		var prcs = {
			"J":"setlinecap",
			"j":"setlinejoin",
			"w":"setlinewidth",
			"d":"setdash",
			"M":"setmiterlimit",
			"i":"setflat",
			"q":"gsave",  "Q":"grestore",
			"m":"moveto",  "l":"lineto",  "c":"curveto", "h":"closepath",
			"W":"clip",  "W*":"eoclip",
			"f":"fill","F":"fill","f*":"eofill", "S":"stroke",  "b":"h B", "b*":"h B*",
			"n":"newpath",
			
			"RG" : "/DeviceRGB  CS SCN",
			"rg" : "/DeviceRGB  cs scn",
			"G"  : "/DeviceGray CS SCN",
			"g"  : "/DeviceGray cs scn",
			"K"  : "/DeviceCMYK CS SCN",
			"k"  : "/DeviceCMYK cs scn",
			
			"TD" : "dup neg TL Td",
			"\"" : "exch Tc exch Tw '",
			"'"  : "T* Tj",
			
			"s"  : "h S",
			"BI" : "/BI"
		}
		prcs = FromPS.makeProcs(prcs);
		
		var stk = [root["/Pages"]], pi=0;
		
		while(stk.length!=0) {
			var pg = stk.pop();
			
			if(pg["/Type"]=="/Pages") {
				var ks = pg["/Kids"];
				for(var i=ks.length-1; i>=0; i--) stk.push(ks[i]);
				continue;
			}
			pi++;  //if(pi!=1) continue;  
			
			var cts = pg["/Contents"];   //console.log(pg);
			if(cts.length==null) cts = [cts];
			//var uu = pg["/UserUnit"];  if(uu) console.log(uu);
			
			var bb = pg["/MediaBox"];  if(bb==null) bb = root["/Pages"]["/MediaBox"];
			var env = FromPS._getEnv(bb);  env.pgOpen = true;
			var gs = [];
			var os = [];	// operand stack
			var ds = FromPS._getDictStack(ops, prcs);
			var es = [];
			
			genv.StartPage(bb[0],bb[1],bb[2],bb[3]);
			if(tr["/Encrypt"]) {  if(stk.length==0) alert("Encrypted PDF is not supported yet.");  }
			else
			for(var j=0; j<cts.length; j++)
			{
				var cnt = FromPDF.GS(cts[j]);  var end=cnt.length-1;  while(cnt[end]==0) end--;
				cnt = new Uint8Array(cnt.buffer, 0, end+1);
				//console.log(FromPS.B.readASCII(cnt,0,cnt.length));
				es.push({  typ:"file", val: {  buff:cnt, off:0, extra:pg  }  });	// execution stack
				var repeat = true;
				while(repeat) {  repeat = FromPS.step(os, ds, es, gs, env, genv, FromPDF.operator);  }
			}
			genv.ShowPage();  //if(pi>23) break;
		}
	}
	FromPDF.operator = function(op, os, ds, es, gs, env, genv)
	{
		var gst = env.gst;
		var lfi = es.length-1;  while(es[lfi].typ!="file") lfi--;
		var fle = es[lfi].val;
		var res = fle.extra["/Resources"];
		if(op=="Do") {
			var nam = os.pop().val, xo = res["/XObject"][nam];
			//console.log(xo);
			var st=xo["/Subtype"], stm = FromPDF.GS(xo);
			if(st=="/Form")  {
				//console.log(FromPS.B.readASCII(stm,0,stm.length));
				es.push( {typ:"file", val: { buff:stm, off:0, extra:xo }}  );
			}
			else if(st=="/Image")  {
				var sms = null;  //console.log(xo);
				if(xo["/SMask"]) sms = FromPDF.getImage(xo["/SMask"], gst);
				var w=xo["/Width"], h=xo["/Height"], cs=xo["/ColorSpace"];
				var img = FromPDF.getImage(xo, gst);
				if(xo["/ImageMask"]==true) {
					sms = img;
					img = new Uint8Array(w*h*4);  
					var r0 = gst.colr[0]*255, g0 = gst.colr[1]*255, b0 = gst.colr[2]*255;
					for(var i=0; i<w*h*4; i+=4) {  img[i]=r0;  img[i+1]=g0;  img[i+2]=b0;  img[i+3]=255;  }
				}
				genv.PutImage(gst, img, w,h, sms);
			}
			else console.log("Unknown XObject",st);
		}
		else if(op=="gs") {
			var nm = os.pop().val;
			var egs = res["/ExtGState"][nm];
			for(var p in egs) {
				var v = egs[p];
				if(p=="/Type") continue;
				else if(p=="/CA") gst.CA=v;
				else if(p=="/ca") gst.ca=v;
				else if(p=="/BM") gst.bmode = v;
				else if(p=="/LC") gst.lcap  = v;
				else if(p=="/LJ") gst.ljoin = v;
				else if(p=="/LW") gst.lwidth = v;
				else if(p=="/ML") gst.mlimit = v;
				else if(p=="/SA") gst.SA = v;
				else if(p=="/OPM")gst.OPM = v;
				else if(p=="/AIS")gst.AIS = v;
				else if(p=="/OP") gst.OP = v;
				else if(p=="/op") gst.op = v;
				else if(p=="/SMask") {  gst.SMask = "";  }
				else if(p=="/SM") gst.SM = v;
				else if(p=="/HT" || p=="/TR") {}
				else console.log("Unknown gstate property: ", p, v);
			}
		}
		else if(op=="ID") {
			var dic = {};
			while(true) {  var v = os.pop().val;  if(v=="/BI") break;  dic[os.pop().val] = v;  }    fle.off++;
			var w=dic["/W"], h=dic["/H"], ar=w*h, img = new Uint8Array(ar*4), cs = dic["/CS"], bpc = dic["/BPC"];
			var end = fle.off;
			while(!FromPS.isWhite(fle.buff[end]) || fle.buff[end+1]!=69 || fle.buff[end+2]!=73) end++;
			var stm = fle.buff.slice(fle.off, end);  fle.off+=stm.length;
			if(dic["/F"]=="/Fl") {  stm = FromPS.F.FlateDecode({buff:stm, off:0});  delete dic["/F"];  }
			if(cs=="/G" && dic["/F"]==null) {
				FromPDF.plteImage(stm, 0, img, null, w, h, bpc);
			}
			else if(cs[0].typ!=null) {
				FromPDF.plteImage(stm, 0, img, cs[3].val, w, h, bpc);
			}
			else img = stm;
			genv.PutImage(gst, img, w,h);
		}
		else if(op=="n" || op=="BT" || op=="EI") {}
		else if(op=="ET") {  gst.font.Tm = [1,0,0,1,0,0];  gst.font.Tlm=gst.font.Tm.slice(0);  }
		else if(op=="re") {
			var h=os.pop().val, w=os.pop().val, y=os.pop().val, x=os.pop().val;
			UDOC.G.moveTo(gst,x,y);  UDOC.G.lineTo(gst,x+w,y);  UDOC.G.lineTo(gst,x+w,y+h);  UDOC.G.lineTo(gst,x,y+h);  UDOC.G.closePath(gst);
		}
		else if(op=="y" || op=="v") {
			var im=gst.ctm.slice(0);  UDOC.M.invert(im);  var p=UDOC.M.multPoint(im,gst.cpos);  
			var y3=os.pop().val, x3=os.pop().val, y1=os.pop().val, x1=os.pop().val;
			if(op=="y") UDOC.G.curveTo(gst,x1,y1,x3,y3,x3,y3);
			else        UDOC.G.curveTo(gst,p[0],p[1],x1,y1,x3,y3);
		}
		else if(op=="B" || op=="B*") {
			genv.Fill(gst, op=="B*");    //UDOC.G.newPath(gst);
			genv.Stroke(gst);  UDOC.G.newPath(gst);
		}
		else if(op=="cm" || op=="Tm") {
			var m = [];  for(var i=0; i<6; i++) m.push(os.pop().val);    m.reverse();  
			
			if(op=="cm") {  UDOC.M.concat(m, gst.ctm);  gst.ctm = m;    }
			else         {  gst.font.Tm = m;  gst.font.Tlm = m.slice(0);  }
		}
		else if(op=="Td" || op=="T*") {
			var x=0, y=0;
			if(op=="T*") { x=0; y=-gst.font.Tl; }
			else { y=os.pop().val;  x=os.pop().val; }
			var tm = [1,0,0,1,x,y];  UDOC.M.concat(tm,gst.font.Tlm);
			gst.font.Tm = tm;  gst.font.Tlm = tm.slice(0);
		}
		else if(op=="Tf") {
			var sc = os.pop().val, fnt = os.pop().val;
			gst.font.Tf=fnt;//rfnt["/BaseFont"].slice(1);
			gst.font.Tfs=sc;  //os.push(fnt);
		}
		else if(op=="Tj" || op=="TJ") {
			var sar = os.pop();
			if(sar.typ=="string") sar = [sar];
			else sar = sar.val;
			
			var rfnt = res["/Font"][fnt];
			
			var tf = gst.font.Tf;
			var fnt = res["/Font"][tf];
			var scl = UDOC.M.getScale(gst.font.Tm)*gst.font.Tfs/1000;
			
			for(var i=0; i<sar.length; i++) {
				//if(sar[i].typ!="string") {  gst.font.Tm[4] += -scl*sar[i].val;  continue;  }
				if(sar[i].typ!="string") {  if(i==0) gst.font.Tm[4] += -scl*sar[i].val;  continue;  }
				var str = FromPDF.getString(sar[i].val, fnt);
				if(sar[i+1] && sar[i+1].typ!="string") {  var sv = sar[i+1].val;  str[1] += -sv;  if(-900<sv && sv<-100) str[0]+=" ";  }
				
				gst.font.Tf = str[2];
				genv.PutText(gst, str[0], str[1]/1000);  //gst.cpos[0] += str.length*gst.font.mat[0]*0.5;  
				gst.font.Tf = tf;
				gst.font.Tm[4] += scl*str[1];
			}
		}
		else if(op=="Tc") gst.font.Tc = os.pop().val;
		else if(op=="Tw") gst.font.Tw = os.pop().val;
		else if(op=="Tz") gst.font.Th = os.pop().val;
		else if(op=="TL") gst.font.Tl = os.pop().val;
		else if(op=="Tr") gst.font.Tmode = os.pop().val;
		else if(op=="Ts") gst.font.Trise = os.pop().val;
		else if(op=="CS"  || op=="cs" ) {  var cs = os.pop().val;  if(op=="CS") gst.sspace=cs;  else gst.space=cs;  }
		else if(op=="SCN" || op=="scn" || op=="SC" || op=="sc") {
			var stk = (op=="SCN" || op=="SC");
			var csi =  stk ? gst.sspace : gst.space, cs, c = null;
			//console.log(op, cs, os);  throw "e";
			var sps = res ? res["/ColorSpace"] : null;  //if(sps!=null) console.log(sps[csi]);
			if(sps!=null && sps[csi]!=null) {
				if(sps[csi][1] && sps[csi][1]["/Alternate"])  cs = sps[csi][1]["/Alternate"];  //cs = sps[csi][0];
				else cs = (typeof sps[csi] == "string") ? sps[csi] : sps[csi][0];
			}
			else cs = csi;
			//console.log(sps, cs, os.slice(0));
			if(cs=="/Lab" || cs=="/DeviceRGB" || cs=="/DeviceN" || (cs=="/ICCBased" && sps[csi][1]["/N"]==3)) {  
					c=[os.pop().val, os.pop().val, os.pop().val];  c.reverse();  }
			else if(cs=="/DeviceCMYK" || (cs=="/ICCBased" && sps[csi][1]["/N"]==4)) {  
					var cmyk=[os.pop().val,os.pop().val,os.pop().val,os.pop().val];  cmyk.reverse();  c = UDOC.C.cmykToRgb(cmyk);  }
			else if(cs=="/DeviceGray" || cs=="/CalGray") {  var gv=FromPS.nrm(os.pop().val);  c=[gv,gv,gv];  }
			else if(cs=="/Separation") {  
				var cval = FromPDF.Func(sps[csi][3], [os.pop().val]);  
				if(sps && sps[csi] && sps[csi][2]=="/DeviceCMYK") c = UDOC.C.cmykToRgb(cval); 
				else c = UDOC.C.labToRgb(cval); 
			}
			else if(cs=="/Pattern")    {  
				//*
				var pt = res["/Pattern"][os.pop().val];  //console.log(pt);
				var ptyp = pt["/PatternType"];
				if(ptyp==1) {  console.log("tile pattern");  return;  }
				FromPDF.setShadingFill(pt["/Shading"], pt["/Matrix"], stk, gst);
				return;//*/  os.pop();  c=[1,0.5,0]; 
			}
			else {  console.log(csi, cs, os, sps, res);  throw("e");  }
			//console.log(c);
			if(stk) gst.COLR = c;  else gst.colr=c;
		}
		else if(op=="sh")  {  //os.pop();  return;
			//if(window.asdf==null) window.asdf=0;
			//window.asdf++;  if(window.asdf!=6) return;
			var sh = res["/Shading"][os.pop().val];  //console.log(sh);
			var ocolr = gst.colr, opth = gst.pth;
			gst.pth = gst.cpth;  gst.cpth = UDOC.G.rectToPath(env.bb);
			FromPDF.setShadingFill(sh, gst.ctm.slice(0), false, gst);
			//console.log(gst);

			genv.Fill(gst);
			gst.colr = ocolr;  gst.pth = opth;
		}
		else if(op=="MP" || op=="BMC" || op=="ri") {  os.pop();  }
		else if(op=="DP" || op=="BDC") {  os.pop();  os.pop();  }
		else if(op=="EMC"|| op=="BX" || op=="EX") {  }
		else 
			throw ("Unknown operator", op);
	}

	
	FromPDF.setShadingFill = function(sh, mat, stk, gst)
	{
		var styp = sh["/ShadingType"], cs = sh["/ColorSpace"];
		//console.log(cs);
		//if(cs!="/DeviceRGB") throw "unknown shading space " + cs;	
		var ftyp = "";
		if(styp==2) {
			ftyp="lin";
		}
		else if(styp==3) {
			ftyp="rad";
		}
		else {  console.log("Unknown shading type", styp);  return;  }
		
		//console.log(gst);  console.log(sh);
		var fill = {typ:ftyp, mat:mat, grad:FromPDF.getGrad(sh["/Function"], cs), crds:sh["/Coords"]}
		if(stk) gst.COLR = fill;  else gst.colr=fill;
	}
	
	FromPDF.getGrad = function(fn, cs) {
		//console.log(fn,cs);
		var F = FromPDF._normColor;
		var fs = fn["/Functions"], ft = fn["/FunctionType"], bs = fn["/Bounds"], enc = fn["/Encode"];
		//console.log(fn);
		if(ft==0 || ft==2) return [   [0,F(fn,[0], cs)],  [1,F(fn,[1], cs)]   ];
		var zero = enc[0];
		var grd = [];
		if(bs.length==0 || bs[0]>0) grd.push([0, F(fs[0], [zero], cs)] );
		for(var i=0; i<bs.length; i++)  grd.push([bs[i], F(fs[i],[zero], cs)]);
		if(bs.length==0 || bs[bs.length-1]<1) grd.push([1, F(fs[fs.length-1], [1-zero], cs)]);
		//console.log(fn, grd);
		return grd;
	}
	FromPDF._clrSamp = function(stm, i) {  return [stm[i]/255, stm[i+1]/255, stm[i+2]/255];  }
	
	FromPDF._normColor = function(fn, vls, cs) {
		//console.log(fn, vls, cs);
		var clr = FromPDF.Func(fn, vls);
		if(cs[3] && cs[3]["/Length"]) {
			clr = FromPDF.Func(cs[3], clr);
			//console.log(clr);
			if(cs[2]=="/DeviceCMYK" || clr.length==4) {  clr = UDOC.C.cmykToRgb(clr);  }
			else {  console.log(clr, cs);  throw "unknown color profile";  }
			//console.log(clr);
		}
		else if((cs[1] && cs[1]["/N"]==4)
			|| cs=="/DeviceCMYK") clr = UDOC.C.cmykToRgb(clr);
		//if(clr.length<3) {  console.log(clr.slice(0));  throw "e";  clr.push(1);  }
		return clr;
	}
	
	FromPDF.getImage = function(xo, gst) {
		var w=xo["/Width"], h=xo["/Height"], ar = w*h, stm=FromPDF.GS(xo), ft=xo["/Filter"], cs=xo["/ColorSpace"], bpc=xo["/BitsPerComponent"], mte=xo["/Matte"];
		//if(w==295 && h==98) console.log(xo);
		//if(w=="327" && h==9) console.log(xo);
		var img = xo["image"];  //console.log(xo);
		if(img==null) {
			//console.log(xo);
			var msk = xo["/Mask"];
			if(cs && cs[0]=="/Indexed") {
				var pte;
				if(cs[3].length!=null) {	// palette in a string
					var str = cs[3];  pte = new Uint8Array(256*3);
					for(var i=0; i<str.length; i++) pte[i] = str.charCodeAt(i);
				}							
				else pte = FromPDF.GS(cs[3]);
				if(cs[1]=="/DeviceCMYK" || (cs[1] && cs[1][1] && cs[1][1]["/N"]==4)) {
					var opte = pte, pte = new Uint8Array(256*3);
					for(var i=0; i<256; i++) {  var qi=(i<<2), ti=qi-i, rgb = UDOC.C.cmykToRgb([opte[qi]/255, opte[qi+1]/255, opte[qi+2]/255, opte[qi+3]/255]);  
						pte[ti]=rgb[0]*255;  pte[ti+1]=rgb[1]*255;  pte[ti+2]=rgb[2]*255;  
						//var ib = 1-(opte[qi+3]/255);  pte[ti]=(255-opte[qi])*ib;  pte[ti+1]=(255-opte[qi+1])*ib;  pte[ti+2]=(255-opte[qi+2])*ib;  
					}
				}
				var nc = new Uint8Array(ar*4);
				FromPDF.plteImage(stm, 0, nc, pte, w, h, bpc, msk);
				img=nc;
			}
			else if(ft==null && cs && cs=="/DeviceGray") {
				var pte = [0,0,0,255,255,255], nc = new Uint8Array(ar*4);
				if(xo["/Decode"] && xo["/Decode"][0]==1) {  pte.reverse();  }
				if(xo["/ImageMask"]==true)  pte.reverse();
				FromPDF.plteImage(stm, 0, nc, bpc==1?pte:null, w, h, bpc, msk);
				img=nc;
			}
			else if(ft==null && cs && cs[0]=="/ICCBased" && cs[1] && cs[1]["/N"]==4) {  // CMYK
				var nc = new Uint8Array(ar*4), cmy=[0,0,0,0];
				for(var i=0; i<ar; i++) {
					var qi = i*4;  cmy[0]=stm[qi]*(1/255);  cmy[1]=stm[qi+1]*(1/255);  cmy[2]=stm[qi+2]*(1/255);   cmy[3]=stm[qi+3]*(1/255);  
					var rgb = UDOC.C.cmykToRgb(cmy);
					nc[qi  ]=~~(rgb[0]*255+0.5);  
					nc[qi+1]=~~(rgb[1]*255+0.5);  
					nc[qi+2]=~~(rgb[2]*255+0.5);  
					nc[qi+3]=255;  
				}
				img = nc;
			}
			else if(w*h*3<=stm.length) {
				var mlt = Math.round(255/((1<<bpc)-1));
				var bpl = Math.ceil(w*3*bpc/8);
				var nc = new Uint8Array(ar*4);
				for(var y=0; y<h; y++) {
					var so = bpl * y; 
					for(var x=0; x<w; x++)
					{  
						var qi=(y*w+x)*4, tx=3*x; 
						nc[qi  ]=FromPDF.getBitNum(stm, so, tx  , bpc);  
						nc[qi+1]=FromPDF.getBitNum(stm, so, tx+1, bpc);  
						nc[qi+2]=FromPDF.getBitNum(stm, so, tx+2, bpc);  
						nc[qi+3]=255;  
					}
				}
				img = nc;
			}
			else {  img = stm;  }
			if(mte && mte.join("")!="000") {
				var r = Math.round(mte[0]*255), g=Math.round(mte[1]*255), b=Math.round(mte[2]*255);
				for(var i=0; i<img.length; i+=4) {
					img[i  ]=Math.max(img[i  ],r);
					img[i+1]=Math.max(img[i+1],g);
					img[i+2]=Math.max(img[i+2],b);
				}
			}
			xo["image"] = img;
		}
		return img;
	}
	FromPDF.plteImage = function(buff, off, img, plt, w, h, bpc, msk)
	{
		var mlt = Math.round(255/((1<<bpc)-1));
		var bpl = Math.ceil(w*bpc/8);
		for(var y=0; y<h; y++) {
			var so = off + bpl * y; 
			for(var x=0; x<w; x++) {  
				var ci = FromPDF.getBitNum(buff, so, x, bpc);
				var qi = (y*w+x)<<2;  
				if(plt) {  var c =ci*3;    img[qi]=plt[c];  img[qi+1]=plt[c+1];  img[qi+2]=plt[c+2];  }
				else    {  var nc=ci*mlt;  img[qi]=nc;      img[qi+1]=nc;        img[qi+2]=nc;        }
				img[qi+3]=255;  
				if(msk && msk[0]<=ci && ci<=msk[1]) img[qi+3]=0; 
			}
		}
	}
	FromPDF.getBitNum = function(buff, so, x, bpc) {
		var ci = 0;
		if     (bpc==8) ci = buff[so+x];
		else if(bpc==4) ci=(buff[so+(x>>1)]>>((1-(x&1))<<2))&15;
		else if(bpc==2) ci=(buff[so+(x>>2)]>>((3-(x&3))<<1))&3;  
		else if(bpc==1) ci=(buff[so+(x>>3)]>>((7-(x&7))<<0))&1;
		return ci;
	}
	
	FromPDF.Func = function(f, vls)
	{
		//console.log(f, vls);
		var dom = f["/Domain"], rng = f["/Range"], typ = f["/FunctionType"], out = [];
		for(var i=0; i<vls.length; i++) vls[i]=Math.max(dom[2*i], Math.min(dom[2*i+1], vls[i]));
		if(typ==0) {
			var enc = f["/Encode"], sz = f["/Size"], dec = f["/Decode"], n = rng.length/2;
			if(enc==null) enc=[0,sz[0]-1];
			if(dec==null) dec=rng;//[0,sz[0]-1,0,sz[0]-1,0,sz[0]-1];
			
			for(var i=0; i<vls.length; i++) {
				var ei = FromPDF.intp(vls[i],dom[2*i],dom[2*i+1],enc[2*i],enc[2*i+1]);
				vls[i] = Math.max(0, Math.min(sz[i]-1, ei));
			}
			for(var j=0; j<n; j++) {
				var x = Math.round(vls[0]), rj = FromPDF.GS(f)[n*x+j];
				rj = FromPDF.intp(rj, 0,255, dec[2*j],dec[2*j+1]);
				out.push(rj);
			}
		}
		else if(typ==2) {
			var c0=f["/C0"],c1=f["/C1"],N=f["/N"]
			var x = vls[0];
			for(var i=0; i<c0.length; i++) out[i] = c0[i] + Math.pow(x,N) * (c1[i]-c0[i]);
		}
		else if(typ==4) {
			var env = FromPS._getEnv([0,0,0,0]);  env.pgOpen = true;
			var gs = [];
			var os = [];	// operand stack
			var ds = FromPS._getDictStack([], {});
			var es = [];
			
			//console.log(FromPS.B.readASCII(FromPDF.GS(f),0,FromPDF.GS(f).length));
			es.push({  typ:"file", val: {  buff:FromPDF.GS(f), off:0 }  });	// execution stack
			var repeat = true;
			while(repeat) repeat = FromPS.step(os, ds, es, gs, env, {}, FromPDF.operator);
			
			var proc = os.pop();  proc.off=0;
			es.push(proc);
			for(var i=0; i<vls.length; i++) os.push({typ:"real",val:vls[i]});
			repeat = true;
			while(repeat) repeat = FromPS.step(os, ds, es, gs, env, {}, FromPDF.operator);
			for(var i=0; i<os.length; i++) out.push(os[i].val);
		}
		
		if(rng) for(var i=0; i<out.length; i++) out[i]=Math.max(rng[2*i], Math.min(rng[2*i+1], out[i]));
		return out;
	}
	FromPDF.intp = function(x,xmin,xmax,ymin,ymax) {  return ymin + (x-xmin) * (ymax-ymin)/(xmax-xmin);  }
	
	FromPDF.getString = function(sv, fnt)
	{
		//console.log(sv, fnt);  //throw "e";
		
		var st = fnt["/Subtype"], s="", m=0, psn=null;
		var tou = fnt["/ToUnicode"], enc = fnt["/Encoding"], sfnt=fnt;	// font with a stream
		if(st=="/Type0") sfnt = fnt["/DescendantFonts"][0];  // // only in type 0
		
		if(tou!=null) s = FromPDF.toUnicode(sv, tou);
		else if(enc=="/WinAnsiEncoding" ) s = FromPDF.encFromMap(sv, FromPDF._win1252);
		else if(enc=="/MacRomanEncoding") s = FromPDF.encFromMap(sv, FromPDF._macRoman);
		else if(st=="/Type0") {
			var off=0;
			if(enc=="/Identity-H") off=31;
			for(var j=0; j<sv.length; j+=2) {
				var gid = (sv[j]<<8)|sv[j+1];  //console.log(gid, stm);
				s += String.fromCharCode(gid+off);  // don't know why 31
			}
		}
		else if(enc!=null && enc["/Type"]=="/Encoding") {
			var dfs = enc["/Differences"];
			var benc = enc["/BaseEncoding"], map = null;
			if(benc=="/WinAnsiEncoding" ) map = FromPDF._win1252;
			if(benc=="/MacRomanEncoding") map = FromPDF._macRoman;
			if(dfs) {
				//console.log(sv,dfs);
				var s = "";
				for(var i=0; i<sv.length; i++) {
					var ci = sv[i], coff=-5, found = false;
					for(var j=0; j<dfs.length; j++)
					{
						if(typeof dfs[j] == "string") {  if(ci==coff) {  s+=FromPDF.fromCName(dfs[j].slice(1));  found=true;  break;  }  coff++;  }
						else coff=dfs[j];
					}
					if(!found && map!=null) {
						var cin = map.indexOf(ci);
						if(cin!=-1) ci = String.fromCharCode(map[cin+1]);
						s += String.fromCharCode(ci);
					}
				}
				//console.log(s);
			}
			//console.log(enc, sv);	throw "e";
			//s = FromPDF.fromWin(sv);
		}
		else {  /*console.log("reading simple string", sv, fnt);*/  s = FromPS.readStr(sv);  }
		
		
		//console.log(sv, fnt);
		if(st=="/Type0") {
			//console.log(fnt);  //throw "e";
			var ws = sfnt["/W"];
			if(ws==null) m = s.length*1000*0.4;
			else
			for(var i=0; i<sv.length; i+=2) {
				var cc = (sv[i]<<8)|sv[i+1], gotW = false;
				for(var j=0; j<ws.length; j+=2) {
					var i0=ws[j], i1 = ws[j+1];
					if(i1.length) {   if(0<=cc-i0 && cc-i0<i1.length) {  m += i1[cc-i0];  gotW=true;  }   }
					else {  if(i0<=cc && cc<=i1) {  m += ws[j+2];  gotW = true;  }  j++;  }
				}
				if(!gotW) m += ws[1][0];
			}
		}
		else if(st=="/Type1" || st=="/Type3" || st=="/TrueType") {
			var fc=fnt["/FirstChar"], ws = fnt["/Widths"];
			if(ws)	for(var i=0; i<sv.length; i++) m += ws[sv[i]-fc];
			else    {  m = s.length*1000*0.4;  console.log("approximating word width");  }
		}
		else throw "unknown font type";
		
		//console.log(fnt);//  throw "e";
		//console.log(sfnt);
		var fd = sfnt["/FontDescriptor"];
		if(fd) {
			if(fd["psName"]) psn=fd["psName"];
			else {
				var pp, ps = ["","2","3"];
				for(var i=0; i<3; i++) if(fd["/FontFile"+ps[i]]) pp = "/FontFile"+ps[i];
				if(pp) {
					var fle = FromPDF.GS(fd[pp]);
					if(pp!=null && fle && FromPS.B.readUint(fle,0)==65536) psn = fd["psName"] = FromPDF._psName(fle);
				}
			}
		}
		if(psn==null && fnt["/BaseFont"]) psn = fnt["/BaseFont"].slice(1);
		if(psn==null) psn = "DejaVuSans";
		//if(sv.length==9) console.log(s);
		return [s, m, psn.split("+").pop()];
	}
	FromPDF._psName = function(fle) {
		var rus = FromPS.B.readUshort;
		var num = rus(fle, 4);
		
		var noff = 0;
		for(var i=0; i<num; i++) {
			var tn = FromPS.B.readASCII(fle,12+i*16,4), to = FromPS.B.readUint(fle, 12+i*16+8);
			if(tn=="name") {  noff=to;  break;  }
		}
		if(noff==0) return null;

		var cnt=rus(fle, noff+2);
		var offset0=noff+6, offset=noff+6;
		for(var i=0; i<cnt; i++) {
			var platformID = rus(fle, offset   );
			var eID        = rus(fle, offset+ 2);	// encoding ID
			var languageID = rus(fle, offset+ 4);
			var nameID     = rus(fle, offset+ 6);
			var length     = rus(fle, offset+ 8);
			var noffset    = rus(fle, offset+10);
			offset += 12;
			
			var s;
			var soff = offset0 + cnt*12 + noffset;
			if(eID==1 || eID==10 || eID==3) {  s="";  for(var j=1; j<length; j+=2) s += String.fromCharCode(fle[soff+j]);  }
			if(eID==0 || eID== 2) s = FromPS.B.readASCII(fle, soff, length);
			if(nameID==6 && s!=null && s.slice(0,3)!="OTS") return s.replace(/\s/g, "");
		}
		return null;
	}
	FromPDF.encFromMap = function(sv, map)
	{
		var s="";
		for(var j=0; j<sv.length; j++) {
			var cc = sv[j], ci = map.indexOf(cc);
			if(ci!=-1) cc = map[ci+1];
			s+=String.fromCharCode(cc);
		}
		return s;
	}
	
	FromPDF._win1252  = [ 0x80, 0x20AC, 0x82, 0x201A, 0x83, 0x0192,	0x84, 0x201E, 0x85, 0x2026, 0x86, 0x2020, 0x87, 0x2021, 0x88, 0x02C6, 0x89, 0x2030,
0x8A, 0x0160, 0x8B, 0x2039, 0x8C, 0x0152, 0x8E, 0x017D, 0x91, 0x2018, 0x92, 0x2019, 0x93, 0x201C, 0x94, 0x201D, 0x95, 0x2022, 0x96, 0x2013,
0x97, 0x2014, 0x98, 0x02DC, 0x99, 0x2122, 0x9A, 0x0161, 0x9B, 0x203A, 0x9C, 0x0153, 0x9E, 0x017E, 0x9F, 0x0178	];

	FromPDF._macRoman = [ 0x80,0xc4, 0x81,0xc5, 0x82,0xc7, 0x83,0xc9, 0x84,0xd1, 0x85,0xd6, 0x86,0xdc, 0x87,0xe1, 
					   0x88,0xe0, 0x89,0xe2, 0x8a,0xe4, 0x8b,0xe3, 0x8c,0xe5, 0x8d,0xe7, 0x8e,0xe9, 0x8f,0xe8,
					   
					   0x90,0xea, 0x91,0xeb, 0x92,0xed, 0x93,0xec, 0x94,0xee, 0x95,0xef, 0x96,0xf1, 0x97,0xf3,
					   0x98,0xf2, 0x99,0xf4, 0x9a,0xf6, 0x9b,0xf5, 0x9c,0xfa, 0x9d,0xf9, 0x9e,0xfb, 0x9f,0xfc,
					   
					   0xa0,0x2020, 0xa1,0xb0, 0xa2,0xa2, 0xa3,0xa3, 0xa4,0xa7, 0xa5,0x2022, 0xa6,0xb6, 0xa7,0xdf,
					   0xa8,0xae, 0xa9,0xa9, 0xaa,0x2122, 0xab,0xb4, 0xac,0xa8, 0xad,0x2660, 0xae,0xc6, 0xaf,0xd8,
					   
					   0xb0,0x221e, 0xb1,0xb1, 0xb2,0x2264, 0xb3,0x2265, 0xb4,0xa5, 0xb5,0xb5, 0xb6,0x2202, 0xb7,0x2211, 
					   0xb8,0x220f, 0xb9,0x3c0, 0xba,0x222b, 0xbb,0xaa, 0xbc,0xba, 0xbd,0x3a9, 0xbe,0xe6, 0xbf,0xf8,
					   
					   0xc0,0xbf, 0xc1,0xa1, 0xc2,0xac, 0xc3,0x221a, 0xc4,0x192, 0xc5,0x2248, 0xc6,0x2206, 0xc7,0xab,
					   0xc8,0xbb, 0xc9,0x2026, 0xca,0xa0, 0xcb,0xc0, 0xcc,0xc3, 0xcd,0xd5, 0xce,0x152, 0xcf,0x153,
					   
					   0xd0,0x2013, 0xd1,0x2014, 0xd2,0x201c, 0xd3,0x201d, 0xd4,0x2018, 0xd5,0x2019, 0xd6,0xf7, 0xd7,0x25ca, 
					   0xd8,0xff, 0xd9,0x178, 0xda,0x2044, 0xdb,0x20ac, 0xdc,0x2039, 0xdd,0x203a, 0xde,0xfb01, 0xdf,0xfb02, 
					   
					   0xe0,0x2021, 0xe1,0xb7, 0xe2,0x201a, 0xe3,0x201e, 0xe4,0x2030, 0xe5,0xc2, 0xe6,0xca, 0xe7,0xc1, 
					   0xe8,0xcb, 0xe9,0xc8, 0xea,0xcd, 0xeb,0xce, 0xec,0xcf, 0xed,0xcc, 0xee,0xd3, 0xef,0xd4, 
					   
					   0xf0,0xf8ff, 0xf1,0xd2, 0xf2,0xda, 0xf3,0xdb, 0xf4,0xd9, 0xf5,0x131, 0xf6,0x2c6, 0xf7,0x2dc, 
					   0xf8,0xaf, 0xf9,0x2d8, 0xfa,0x2d9, 0xfb,0x2da, 0xfc,0xb8, 0xfd,0x2dd, 0xfe,0x2db, 0xff,0x2c7   ];
	
	FromPDF.fromCName = function(cn)
	{
		if(cn.length==1) return cn;
		if(cn.slice(0,3)=="uni") return String.fromCharCode(parseInt(cn.slice(3),16));
		//var gi = parseInt(cn.slice(1));  if(cn.charAt(0)=="g" && !isNaN(gi)) return String.fromCharCode(gi);
		var map = {
			"space":32,"exclam":33,"quotedbl":34,"numbersign":35,"dollar":36,"percent":37,"parenleft":40,
			"parenright":41,"asterisk":42,"plus":43,"comma":44,"hyphen":45,"period":46,"slash":47,
			"zero":48,"one":49,"two":50,"three":51,"four":52,"five":53,"six":54,"seven":55,"eight":56,"nine":57,
			"colon":58,"semicolon":59,"less":60,"equal":61,"at":64,
			"bracketleft":91,"bracketright":93,"underscore":95,"braceleft":123,"braceright":125,
			"dieresis":168,"circlecopyrt":169,"Eacute":201,
			"dotlessi":0x0131,"tcaron":0x165,
			"alpha":0x03B1,"phi":0x03C6,
			"endash":0x2013,"emdash":0x2014,"asteriskmath":0x2217,"quoteright":0x2019,"quotedblleft":0x201C,"quotedblright":0x201D,"bullet":0x2022,
			"minus":0x2202,
			"fi": 0xFB01,"fl":0xFB02 };
		var mc = map[cn];
		if(mc==null) {  if(cn.charAt(0)!="g") console.log("unknown character "+cn);  
			return cn;  }
		return String.fromCharCode(mc);
	}
	
	FromPDF.toUnicode = function(sar, tou) {
		var cmap = tou["cmap"], s = "";
		if(cmap==null) {
			var file = {buff:FromPDF.GS(tou), off:0};
			//console.log(FromPS.B.readASCII(file.buff, 0, file.buff.length));
			var os = [];	// operand stack
			var ds = FromPS._getDictStack({});
			var es = [{  typ:"file", val: file  }];	// execution stack
			var gs = [];
			var env = FromPS._getEnv([0,0,1,1]);  env.pgOpen = true;
			var time = Date.now();
			var repeat = true;
			while(repeat) repeat = FromPS.step(os, ds, es, gs, env, null, FromPDF.operator);
			cmap = env.res["CMap"];
			tou["cmap"] = cmap;
			//console.log(cmap);  throw "e";
		}
		//console.log(cmap);
		//cmap = cmap["Adobe-Identity-UCS"];
		for(var p in cmap) {  cmap=cmap[p];  break;  }
		//console.log(cmap, sar);  throw "e";
		var bfr = cmap.bfrange, bfc = cmap.bfchar, bpc = cmap["bpc"];
		for(var i=0; i<sar.length; i+=bpc) {
			var cc = sar[i];  if(bpc==2) cc = (cc<<8) | sar[i+1];
			var mpd = false;
			if(!mpd && bfr) for(var j=0; j<bfr.length; j+=3) {
				var v0=bfr[j], v1=bfr[j+1], v2=bfr[j+2];
				if(v0<=cc && cc<=v1) {  
					if(v2.length==null) cc+=v2-v0;  
					else cc = v2[cc-v0];
					mpd=true;  break;  
				}
			}
			if(!mpd && bfc) for(var j=0; j<bfc.length; j+=2) if(bfc[j]==cc) {  cc=bfc[j+1];  mpd=true;  break;  }
			s += String.fromCharCode(cc);
		}
		return s;
	}

	FromPDF.readXrefTrail = function(buff, xref, out)
	{
		var kw = FromPS.B.readASCII(buff, xref, 4);
		if(kw=="xref") {
			var off = xref+4;  
			if(buff[off]==13) off++;  if(buff[off]==10) off++;
			while(true) {	// start of the line with M, N
				if(FromPS.B.readASCII(buff, off, 7)=="trailer") {  off+=8;  break;  }
				var of0 = off;
				while(!FromPS.isEOL(buff[off])) off++;  
				var line = FromPS.B.readASCII(buff,  of0, off-of0);  //console.log(line);  
				line = line.split(" ");
				var n = parseInt(line[1]);
				if(buff[off]==13) off++;  if(buff[off]==10) off++;
				for(var i=0; i<n; i++)
				{
					var li = parseInt(line[0])+i;
					if(out[li]==null) out[li] = {
						off: parseInt(FromPS.B.readASCII(buff, off, 10)),
						gen: parseInt(FromPS.B.readASCII(buff, off+11, 5)),
						chr: FromPS.B.readASCII(buff, off+17, 1),
						val: null,
						opn: false
					};
					off+=20;
				}
			}
			var file = {buff:buff, off:off};//, trw = FromPS.getFToken(file);
			var trl = FromPDF.readObject(file, file, out);
			if(trl["/Prev"]) FromPDF.readXrefTrail(buff, trl["/Prev"], out);
			return trl;
		}
		else {
			var off = xref;
			while(!FromPS.isEOL(buff[off])) off++;   off++;
			
			var xr = FromPDF.readObject({buff:buff, off:off}, file, null);  //console.log(xr);
			var sof = 0, sb = FromPDF.GS(xr), w = xr["/W"], ind = (xr["/Index"] ? xr["/Index"][0] : 0);
			while(sof<sb.length) {
				var typ=FromPDF.getInt(sb,sof,w[0]);  sof+=w[0];
				var a  =FromPDF.getInt(sb,sof,w[1]);  sof+=w[1];
				var b  =FromPDF.getInt(sb,sof,w[2]);  sof+=w[2];
				var off=0, gen=0, chr="n";
				if(typ==0) {off=a;  gen=b;  chr="f";}
				if(typ==1) {off=a;  gen=b;  chr="n";}
				if(typ==2) {off=a;  gen=b;  chr="s";}
				out[ind] = { off: off, gen: gen, chr: chr, val: null, opn: false };  ind++;
			}
			if(xr["/Prev"]) FromPDF.readXrefTrail(buff, xr["/Prev"], out);
			//*
			var fl = {buff:buff, off:0};
			var ps = ["/Root","/Info"];
			for(var i=0; i<ps.length; i++) {
				var p = ps[i], val = xr[p];
				if(val && val.typ=="ref") xr[p] = FromPDF.getIndirect(val.ind, val.gen, fl, out);
			}
			//*/
			return xr;
		}
	}
	FromPDF.getInt = function(b,o,l) {
		if(l==0) return 0;
		if(l==1) return b[o];
		if(l==2) return ((b[o]<< 8)|b[o+1]);
		if(l==3) return ((b[o]<<16)|(b[o+1]<<8)|b[o+2]);   throw "e";
	}
	
	FromPDF.getIndirect = function(i,g,file,xr)
	{
		var xv = xr[i];
		if(xv.chr=="f") return null;
		if(xv.val!=null) return xv.val;
		if(xv.opn) return {typ:"ref",ind:i, gen:g};
		
		xv.opn = true;
		var ooff = file.off, nval;
		
		if(xv.chr=="s") {
			var os = FromPDF.getIndirect(xv.off, xv.gen, file, xr), fle = {buff:FromPDF.GS(os), off:0};
			var idx=0, ofs=0;
			while(idx!=i) {  idx=FromPS.getFToken(fle).val;  ofs=FromPS.getFToken(fle).val;  }
			fle.off = ofs+os["/First"];
			nval = FromPDF.readObject(fle, file, xr);
		}
		else {
			file.off = xv.off;
			var a=FromPS.getFToken(file), b=FromPS.getFToken(file), c=FromPS.getFToken(file);
			//console.log(a,b,c);
			nval = FromPDF.readObject(file, file, xr);
		}
		
		xv.val = nval;
		file.off = ooff;  xv.opn = false;
		return nval;
	}
	
	FromPDF.readObject = function(file, mfile, xr) 
	{
		//console.log(file.off, file.buff);
		var tok = FromPS.getFToken(file);
		//console.log(tok);
		if(tok.typ=="integer") {
			var off = file.off;
			var tok2 = FromPS.getFToken(file);
			if(tok2.typ=="integer") {
				FromPS.skipWhite(file);
				if(file.buff[file.off]==82) {
					file.off++;  
					if(xr && xr[tok.val]) return FromPDF.getIndirect(tok.val, tok2.val, mfile, xr);
					else   return {typ:"ref",ind:tok.val, gen:tok2.val};
				}
			}
			file.off = off;
		}
		
		if(tok.val=="<<") return FromPDF.readDict(file, mfile, xr);
		if(tok.val=="[" ) return FromPDF.readArra(file, mfile, xr);
		if(tok.typ=="string") {
			var s = "";  for(var i=0; i<tok.val.length; i++) s+=String.fromCharCode(tok.val[i]);
			return s;
		}
		return tok.val;
	}
	FromPDF.readDict = function(file, mfile, xr) {
		var o = {};
		while(true) {
			var off=file.off, tok = FromPS.getFToken(file);
			if(tok.typ=="name" && tok.val==">>") break;
			file.off= off;
			var key = FromPDF.readObject(file, mfile, xr);
			var val = FromPDF.readObject(file, mfile, xr);
			o[key] = val;
		}
		if(o["/Length"]!=null) {
			var l = o["/Length"];
			var tk = FromPS.getFToken(file);  if(file.buff[file.off]==13) file.off++;  if(file.buff[file.off]==10) file.off++;
			o["buff"] = file.buff.slice(file.off, file.off+l);  file.off += l;  FromPS.getFToken(file); // endstream
		}
		return o;
	}
	FromPDF.GS = function(o) {
		if(o["stream"]==null) {
			var buff = o["buff"];  delete o["buff"];
			var flt = o["/Filter"], prm=o["/DecodeParms"];
			if(flt!=null) {
				var fla = (typeof flt == "string") ? [flt] : flt;
				var keepFlt = false;
				for(var i=0; i<fla.length; i++) {
					var cf = fla[i], fl = {buff:buff, off:0};
					if     (cf=="/FlateDecode"   ) {  buff = FromPS.F.FlateDecode  (fl);  }
					else if(cf=="/ASCIIHexDecode") {  buff = FromPS.F.HexDecode    (fl);  }
					else if(cf=="/ASCII85Decode" ) {  buff = FromPS.F.ASCII85Decode(fl);  }
					else if(cf=="/DCTDecode" || cf=="/CCITTFaxDecode" || cf=="/JPXDecode" || cf=="/JBIG2Decode") {  keepFlt = true;  }  // JPEG
					else {  console.log(cf, buff);  throw "e";  }
				}
				if(!keepFlt) delete o["/Filter"];
			}
			if(prm!=null) {
				if(prm instanceof Array) prm = prm[0];
				if(prm["/Predictor"]!=null && prm["/Predictor"]!=1) {
					var w = prm["/Columns"], bpp = prm["/Colors"] ? prm["/Colors"]: 1, bpl = (bpp*w), h = (buff.length/(bpl+1));
					FromPDF._filterZero(buff, 0, w, h, bpp);  buff = buff.slice(0, h*bpl);
				}
			}
			o["stream"] = buff;
		}
		return o["stream"];
	}
	FromPDF.readArra = function(file, mfile, xr) {
		var o = [];
		while(true) {
			var off=file.off, tok = FromPS.getFToken(file);
			if(tok.typ=="name" && tok.val=="]") return o;
			file.off = off;
			var val = FromPDF.readObject(file, mfile, xr);
			o.push(val);
		}
	}
	
	FromPDF._filterZero = function(data, off, w, h, bpp) {  // copied from UPNG.js
		var bpl = bpp*w, paeth = FromPDF._paeth;

		for(var y=0; y<h; y++)  {
			var i = off+y*bpl, di = i+y+1;
			var type = data[di-1];

			if     (type==0) for(var x=  0; x<bpl; x++) data[i+x] = data[di+x];
			else if(type==1) {
				for(var x=  0; x<bpp; x++) data[i+x] = data[di+x];
				for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + data[i+x-bpp])&255;
			}
			else if(y==0) {
				for(var x=  0; x<bpp; x++) data[i+x] = data[di+x];
				if(type==2) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x])&255;
				if(type==3) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + (data[i+x-bpp]>>1) )&255;
				if(type==4) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + paeth(data[i+x-bpp], 0, 0) )&255;
			}
			else {
				if(type==2) { for(var x=  0; x<bpl; x++) data[i+x] = (data[di+x] + data[i+x-bpl])&255;  }

				if(type==3) { for(var x=  0; x<bpp; x++) data[i+x] = (data[di+x] + (data[i+x-bpl]>>1))&255;
							  for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + ((data[i+x-bpl]+data[i+x-bpp])>>1) )&255;  }

				if(type==4) { for(var x=  0; x<bpp; x++) data[i+x] = (data[di+x] + paeth(0, data[i+x-bpl], 0))&255;
							  for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + paeth(data[i+x-bpp], data[i+x-bpl], data[i+x-bpp-bpl]) )&255;  }
			}
		}
		return data;
	}
	
	FromPDF._paeth = function(a,b,c) {
		var p = a+b-c, pa = Math.abs(p-a), pb = Math.abs(p-b), pc = Math.abs(p-c);
		if (pa <= pb && pa <= pc)  return a;
		else if (pb <= pc)  return b;
		return c;
	}
	