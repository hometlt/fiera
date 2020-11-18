

	function ToPDF()
	{
		this._res = {  
			"/Font": {},
			"/XObject":{},
			"/ExtGState":{},
			"/Pattern":{}
		};
		this._xr = [
			null, 
			{ "/Type":"/Catalog", "/Pages":{typ:"ref",ind:2}},
			{ "/Type":"/Pages",   "/Kids" :[  ], "/Count":0 },
			this._res
		];
		this._bnds = [];
		this._cont = "";
		this._gst = ToPDF.defState();
	}
	
	ToPDF.defState = function() {
		return {"colr":"[0,0,0]", "COLR":"[0,0,0]", "lcap":"0","ljoin":"0", "lwidth":"1", "mlimit":"10", "dash":"[]","doff":"0", "bmode":"/Normal","CA":"1","ca":"1"}
	}
	
	ToPDF.prototype.StartPage = function(x0,y0,x1,y1) {  this._bnds = [x0,y0,x1,y1] ; }
	
	ToPDF.prototype.Stroke = function(gst) {
		if(gst.CA==0) return;
		this.setGState(gst, true);
		this._cont += " S\n";
	}
	ToPDF.prototype.Fill = function(gst, evenOdd)
	{
		if(gst.ca==0) return;
		this.setGState(gst, true);
		this._cont += " f\n";
	}
	
	ToPDF._flt   = function(n)  {  return ""+parseFloat(n.toFixed(2));  }
	ToPDF._scale = function(m)  {  return Math.sqrt(Math.abs(m[0]*m[3]-m[1]*m[2]));  };
	ToPDF._mat   = function(m){  var ms = m.map(ToPDF._flt).join(" ");  
		if(ms=="1 0 0 1 0 0") return "";  return ms+" cm ";  }
	ToPDF._eq    = function(a,b){  if(a.length!=b.length) return false;
		for(var i=0; i<a.length; i++) if(a[i]!=b[i]) return false;
		return true;
	}
	ToPDF._format = function(b) {
		var pfx = [ [0xff, 0xd8, 0xff      ], // "jpg";	
		[0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20], // JPX	
		[0x00, 0x00, 0x00, 0x00, 0x30, 0x00, 0x01, 0x00] ] // JBIG2
		var fmt = ["/DCTDecode", "/JPXDecode", "/JBIG2Decode"];
		for(var i=0; i<pfx.length; i++){
			var pf = pfx[i], good = true;
			for(var j=0; j<pf.length; j++) good = good && (b[j]==pf[j]);
			if(good) return fmt[i];
		}
	}
	
	ToPDF.prototype.setGState = function(gst, withPath) {
		var ost = this._gst, nst = {};
		for(var p in gst)  nst[p] = (typeof gst[p]=="string") ? gst[p] : JSON.stringify(gst[p]);
		var scl = ToPDF._scale(gst.ctm);
		var dsh = gst.dash.slice(0);  for(var i=0; i<dsh.length; i++) dsh[i] = ToPDF._flt(dsh[i]*scl);
		
		var cnt = this._cont;
		if(ost.lcap !=nst.lcap   ) cnt += gst.lcap + " J ";
		if(ost.ljoin!=nst.ljoin  ) cnt += gst.ljoin + " j ";
		if(ost.lwidth!=nst.lwidth) cnt += ToPDF._flt(gst.lwidth*scl) + " w ";
		if(ost.mlimit!=nst.mlimit) cnt += ToPDF._flt(gst.mlimit) + " M ";
		if(ost.dash!=nst.dash || ost.doff!=nst.doff) cnt += "["+dsh.join(" ")+"] "+gst.doff+" d ";
		if(ost.COLR !=nst.COLR   ) cnt += gst.COLR.map(ToPDF._flt).join(" ") + " RG ";
		if(ost.colr !=nst.colr   ) {
			if(gst.colr.length!=null) cnt += gst.colr .map(ToPDF._flt).join(" ") + " rg \n";
			else {
				var ps = this._res["/Pattern"], grd = gst.colr;
				var pi = "/P"+(ToPDF.maxI(ps)+1);
				var sh = {
					"/ShadingType":(grd.typ=="lin"?2:3),
					"/ColorSpace":"/DeviceRGB",
					"/Extend":[true, true],
					"/Function" : ToPDF._makeGrad(grd.grad),
					"/Coords" : grd.crds
				};
				ps[pi] = {
					"/Type":"/Pattern",
					"/PatternType":2,
					"/Matrix":grd.mat,
					"/Shading":sh
				}
				cnt += "/Pattern cs "+pi+" scn ";
			}
		}
		var eg = this._res["/ExtGState"];
		if(ost.bmode!=nst.bmode  ) {
			var sname = nst.bmode;
			if(eg[sname]==null) eg[sname] = {"/Type":"/ExtGState", "/BM":gst.bmode};
			cnt += sname + " gs ";
		}
		if(ost.CA!=nst.CA) {
			var sname = "/Alpha"+Math.round(255*nst.CA);
			if(eg[sname]==null) eg[sname] = {"/Type":"/ExtGState", "/CA":gst.CA};
			cnt += sname + " gs ";
		}
		if(ost.ca!=nst.ca) {
			var sname = "/alpha"+Math.round(255*nst.ca);
			if(eg[sname]==null) eg[sname] = {"/Type":"/ExtGState", "/ca":gst.ca};
			cnt += sname + " gs ";
		}
		/*if(ost.pth  !=nst.pth    )*/ 
		if(withPath) cnt += ToPDF.drawPath(gst.pth);
		
		//console.log(ost, nst);
		
		this._cont = cnt;
		this._gst = nst;
	}
	ToPDF.drawPath = function(pth) {
		var co = 0, out = "", F = ToPDF._flt;
		for(var i=0; i<pth.cmds.length; i++) {
			var cmd = pth.cmds[i];
			if     (cmd=="M") {  for(var j=0; j<2; j++) out += F(pth.crds[co++]) + " ";  out += "m ";  }
			else if(cmd=="L") {  for(var j=0; j<2; j++) out += F(pth.crds[co++]) + " ";  out += "l ";  }
			else if(cmd=="C") {  for(var j=0; j<6; j++) out += F(pth.crds[co++]) + " ";  out += "c ";  }
			else if(cmd=="Z") {  out += "h ";  }
			else throw cmd;
		}
		return out;
	}
	ToPDF._makeGrad = function(grd) {
		//grd = grd.slice(0);  grd[1]=grd[2];  grd = grd.slice(0,2);
		var bs = [], fs = [], sf = ToPDF._stopFun;
		if(grd.length==2) return sf(grd[0][1], grd[1][1]);
		fs.push(sf(grd[0][1], grd[1][1]));
		for(var i=1; i<grd.length-1; i++) {  bs.push(grd[i][0]);  fs.push(sf(grd[i][1], grd[i+1][1]));  }
		
		return {
			"/FunctionType":3,"/Encode":[0,1,0,1],"/Domain":[0,1],
			"/Bounds":bs, "/Functions":fs
		}
	}
	ToPDF._stopFun = function(c0, c1) {  return { "/FunctionType":2, "/C0":c0, "/C1":c1, "/Domain":[0,1], "/N":1};  }
	
	ToPDF.prototype.PutText = function(gst,str, stw)
	{		
		this.setGState(gst, false);
		var fi = this.addFont(gst.font.Tf);
		this._cont += "q ";
		this._cont += ToPDF._mat(gst.ctm);  
		this._cont += ToPDF._mat(gst.font.Tm);
		this._cont += "BT  "+fi+" "+ToPDF._flt(gst.font.Tfs)+" Tf  0 0 Td  ("
		
		var win = [ 0x80, 0x20AC, 0x82, 0x201A, 0x83, 0x0192,	0x84, 0x201E, 0x85, 0x2026, 0x86, 0x2020, 0x87, 0x2021, 0x88, 0x02C6, 0x89, 0x2030,
0x8A, 0x0160, 0x8B, 0x2039, 0x8C, 0x0152, 0x8E, 0x017D, 0x91, 0x2018, 0x92, 0x2019, 0x93, 0x201C, 0x94, 0x201D, 0x95, 0x2022, 0x96, 0x2013,
0x97, 0x2014, 0x98, 0x02DC, 0x99, 0x2122, 0x9A, 0x0161, 0x9B, 0x203A, 0x9C, 0x0153, 0x9E, 0x017E, 0x9F, 0x0178	];
		var bys = [];
		for(var i=0; i<str.length; i++) {  
			var cc=str.charCodeAt(i);  
			if(cc>255) {  
				var bi = win.indexOf(cc);
				bys.push(bi==-1 ? 32 : win[bi-1]);  
			}
			else bys.push(cc);
		}
		
		bys = FromPS.makeString(bys);
		
		for(var i=0; i<bys.length; i++) this._cont += String.fromCharCode(bys[i]);
		
		this._cont += ") Tj  ET ";
		this._cont += " Q\n";
	}
	
	ToPDF.prototype.PutImage = function(gst, img, w, h, msk) {
	
		if(img.length==w*h*4 && msk==null) {
			var area = w*h;
			var alph = new Uint8Array(area), aand = 255;
			for(var i=0; i<area; i++) {  alph[i] = img[(i<<2)+3];  aand &= img[(i<<2)+3];  }
			if(aand!=255) msk = alph;
		}
		
		var ii = this.addImage(img,w,h, msk);
		this.setGState(gst, false);
		
		this._cont += "q "+ToPDF._mat(gst.ctm);
		this._cont += ii + " Do  Q\n";
	}
	
	ToPDF.prototype.ShowPage = function() {
		//console.log(this._cont);
		//console.log(this._res);
		ToPDF.addPage(this._xr, this._cont, this._bnds);
		this._cont = "";
		this._gst = ToPDF.defState();
	}
	
	ToPDF.prototype.Print = function(str) {
	}
	
	ToPDF.prototype.Done = function() {
		var res = this._res;
		for(var p in res) if(Object.keys(res[p])==0) delete res[p];
		this.buffer = ToPDF.xrToPDF(this._xr);
	}
	ToPDF.prototype.addImage= function(img, w, h, msk){
		//console.log(img.length, w*h);
		var mii;
		if(msk) {
			var mst = msk;
			if(msk.length==w*h*4) {
				mst = new Uint8Array(w*h);
				for(var i=0; i<mst.length; i++) mst[i] = msk[(i<<2)+1];
			}
			mii = this.addImage(mst, w, h, null);
		}
		
		var fmt = ToPDF._format(img);
		
		var ist = img;
		if(img.length==w*h*4) {
			ist = new Uint8Array(w*h*3);
			for(var i=0; i<img.length; i+=4) {  var ti = 3*(i>>2);  ist[ti]=img[i+0];  ist[ti+1]=img[i+1];  ist[ti+2]=img[i+2];    }
		}
		
		var xo = this._res["/XObject"];
		for(var ii in xo) if(ToPDF._eq(this._xr[xo[ii].ind]["stream"],ist)) return ii;
		var ii = "/I"+(ToPDF.maxI(xo)+1);
		xo[ii] = {"typ":"ref",ind:this._xr.length};
		
		var io = {
			"/Type":"/XObject",
			"/Subtype":"/Image",
			"/BitsPerComponent":8,
			"/ColorSpace":(img.length==w*h || (fmt=="/DCTDecode" && ToPDF.jpgProp(img) && ToPDF.jpgProp(img).comps==1)) ? "/DeviceGray" : "/DeviceRGB",
			"/Height":h,
			"/Width":w,
			"stream":ist
		}
		if(fmt!=null) io["/Filter"] = ToPDF._format(img);
		if(msk) {  io["/SMask"] = {"typ":"ref","ind":this._xr.length-1};  delete xo[mii];  }
		this._xr.push(io);
		return ii;
	}
	ToPDF.jpgProp = function(data) {
		var off = 0;
		while(off<data.length) {
			while(data[off]==0xff) off++;
			var mrkr = data[off];  off++;
			
			if(mrkr==0xd8) continue;	// SOI
			if(mrkr==0xd9) break;		// EOI
			if(0xd0<=mrkr && mrkr<=0xd7) continue;
			if(mrkr==0x01) continue;	// TEM
			
			var len = ((data[off]<<8)|data[off+1])-2;  off+=2;  
			
			if(mrkr==0xc0) return {
				bpp : data[off],
				w : (data[off+1]<<8)|data[off+2],
				h : (data[off+3]<<8)|data[off+4],
				comps : data[off+5]
			}
			off+=len;
		}
	}
	ToPDF.readUshort = function(data, o) {  return ((data[o]<<8)|data[o+1]);  }
	ToPDF.maxI = function(xo) {
		var max;
		for(var ii in xo) max = ii;
		return max==null ? 0 : parseInt(max.slice(2));
	}
	ToPDF.prototype.addFont = function(fn) {
		var fs = this._res["/Font"];
		for(var fi in fs) if(fs[fi]["/BaseFont"].slice(1)==fn) return fi;
		var fi = "/F"+(ToPDF.maxI(fs)+1);
		fs[fi] = {  "/Type":"/Font",  "/Subtype":"/Type1",  "/BaseFont": "/"+fn, "/Encoding":"/WinAnsiEncoding"  // Type1 supports only 1 Byte per character, otherwise use Type0 
			////"/Encoding":"/Identity-H",  "/DescendantFonts":[{  "/BaseFont":"/"+fn,  "/CIDToGIDMap":"/Identity"  }], "/ToUnicode":{"typ":"ref",ind:4} 
		};
		return fi;
	}
	ToPDF.addPage = function(xr, stm, box) {
		var i = xr.length;
		xr[2]["/Kids"].push({typ:"ref",ind:i});
		xr[2]["/Count"]++;
		xr.push({ "/Type":"/Page",    
			"/Parent"   :{ typ:"ref",ind:2 }, 
			"/Resources":{ typ:"ref",ind:3 },
			"/MediaBox": box,
			"/Contents" :{ typ:"ref",ind:i+1 }
		});
		xr.push({"stream":stm});
	}
	
	ToPDF.xrToPDF = function(xr)
	{
		var F = {file:new ToPDF.MFile(), off:0}, W = ToPDF.write, offs = [];
		
		W(F, "%PDF-1.1\n");
		for(var i=1; i<xr.length; i++) {
			offs.push(F.off);
			W(F, i+" 0 obj\n");
			ToPDF.writeDict(F, xr[i], 0);
			W(F, "\nendobj\n");
		}
		var sxr = F.off;
		W(F, "xref\n");
		W(F, "0 "+xr.length+"\n");
		W(F, "0000000000 65535 f \n");
		for(var i=0; i<offs.length; i++) {
			var oo = offs[i]+"";  while(oo.length<10) oo = "0"+oo;
			W(F, oo+" 00000 n \n");
		}
		W(F, "trailer\n");
		ToPDF.writeDict(F, {"/Root": {typ:"ref", ind:1}, "/Size":xr.length}, 0);
		W(F, "\nstartxref\n"+sxr+"\n%%EOF\n");
		return F.file.data.buffer.slice(0, F.off);
	}
	ToPDF.write = function(F, s)
	{
		F.file.req(F.off, s.length);
		for(var i=0; i<s.length; i++) F.file.data[F.off+i] = s.charCodeAt(i);
		F.off+=s.length;
	}
	ToPDF._tab = "    ";
	ToPDF.spc = function(n) {  var out="";  for(var i=0; i<n; i++) out+=ToPDF._tab;  return out;  }
	ToPDF.writeValue = function(F, v, dpt)
	{
		var W = ToPDF.write;
		if(false) {}
		else if(typeof v == "string" ) W(F, v);
		else if(typeof v == "number" ) W(F, ""+v);
		else if(typeof v == "boolean") W(F, ""+v);
		else if(v.typ!=null) W(F, v.ind+" 0 R");
		else if(v instanceof Array ) ToPDF.writeArray(F, v, dpt+1);
		else if(v instanceof Object) ToPDF.writeDict (F, v, dpt+1);
		else {  console.log(v);  throw "e";  }
	}
	ToPDF.writeDict = function(F, d, dpt) {
		var W = ToPDF.write, S = ToPDF.spc;
		var stm = d["stream"];
		if(stm) {
			if((typeof stm)=="string") {
				var nstm = new Uint8Array(stm.length);
				for(var i=0; i<stm.length; i++) nstm[i]=stm.charCodeAt(i);
				stm = nstm;  
			}
			if(d["/Filter"]==null) {
				d["/Filter"]="/FlateDecode";
				stm = pako["deflate"](stm);
			}
		}
		W(F,"<<\n");
		for(var p in d) {
			if(p.charAt(0)!="/") continue;
			W(F, S(dpt+1)+p+" "); 
			ToPDF.writeValue(F, d[p], dpt);
			W(F, "\n");
		}
		if(stm) W(F, S(dpt+1)+"/Length "+stm.length+"\n");
		W(F,S(dpt)+">>");
		if(stm) {
			W(F, S(dpt)+"\nstream\n");
			F.file.req(F.off, stm.length);
			for(var i=0; i<stm.length; i++) F.file.data[F.off+i]=stm[i];
			F.off += stm.length;
			W(F, S(dpt)+"\nendstream");
		}
	}
	ToPDF.writeArray = function(F, a, dpt)
	{
		var W = ToPDF.write;
		W(F,"[ ");
		for(var i=0; i<a.length; i++) {
			ToPDF.writeValue(F, a[i], dpt+1);
			if(i!=a.length-1) W(F, " ");
		}
		W(F," ]");
	}
	
	ToPDF.MFile = function()
	{
		this.size = 16;
		this.data = new Uint8Array(16);
	}
	ToPDF.MFile.prototype.req = function(off, len)
	{
		if(off + len <= this.size) return;
		var ps = this.size;
		while(off+len>this.size) this.size *= 2;
		var ndata = new Uint8Array(this.size);
		for(var i=0; i<ps; i++) ndata[i] = this.data[i];
		this.data = ndata;
	}
	
	