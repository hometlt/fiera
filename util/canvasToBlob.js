
//todo check if this is another alternative
import {writeMetadata, writeMetadataB} from "../plugins/metadata/png-metadata.js";
import piexif from "../plugins/piexif.js";

export function canvasToBlobPromise(canvas,type = "image/png", quality = 1, background) {

	if(background){
      let canvas2 = fabric.util.createCanvasElement(canvas);
      let ctx = canvas2.getContext("2d");
      ctx.fillStyle = background;
      ctx.fillRect(0,0,canvas2.width,canvas2.height);
      ctx.drawImage(canvas,0,0);
	  canvas = canvas2
    }
	return new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			resolve(blob);
		},type ,quality);
	})
}

function readFileAsDataUrlAsync(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result);
		};

		reader.onerror = reject;

		reader.readAsDataURL(file);
		// reader.readAsArrayBuffer(file);
	})
}

export async function canvasToBlob(canvas, options = {}){
	if(!options.format){
		options.format = "png"
	}
	switch(options.format ){
		case "image/jpg":
		case "image/jpeg":
		case "jpg":
		case "jpeg": {
			let blob = await canvasToBlobPromise(canvas, 'image/jpeg', options.quality)

			if (options.meta || options.dpi) {


				// loadImage(blob, function (img, data) {
				// 		if (data.imageHead && data.exif) {
				// 			// Reset Exif Orientation data:
				// 			loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
				// 			img.toBlob(function (blob) {
				// 				loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
				// 					// do something with newBlob
				// 				})
				// 			}, 'image/jpeg')
				// 		}
				// 	},
				// 	{ meta: true, orientation: true, canvas: true, maxWidth: 800 }
				// )

				let exifStr = piexif.dump({
					"0th": {
						// [piexif.ImageIFD.Make]: "Make",
						[piexif.ImageIFD.XResolution]: [options.dpi,1],
						[piexif.ImageIFD.YResolution]: [options.dpi,1],
						[piexif.ImageIFD.ResolutionUnit]: 2,
						// [piexif.ImageIFD.Software]: "Piexifjs"
					},
					"Exif": {
						// [piexif.ExifIFD.DateTimeOriginal]: "2010:10:10 10:10:10",
						// [piexif.ExifIFD.LensMake]: "LensMake",
						// [piexif.ExifIFD.Sharpness]: 777,
						// [piexif.ExifIFD.LensSpecification]: [[1, 1], [1, 1], [1, 1], [1, 1]]
					},
					"GPS": {
						// [piexif.GPSIFD.GPSVersionID]: [7, 7, 7, 7],
						// [piexif.GPSIFD.GPSDateStamp]: "1999:99:99 99:99:99"
					}
				});
				let contentBase64 = await readFileAsDataUrlAsync(blob);
				let jpeg = piexif.insert(exifStr, contentBase64);
				let str = atob(jpeg.split(",")[1]);
				let data = [];
				for (let p=0; p<str.length; p++) {
					data[p] = str.charCodeAt(p);
				}
				let ua = new Uint8Array(data);
				blob = new Blob([ua], {type: "image/jpeg"});
			}
			return blob;
		}
		case "image/png":
		case "png": {
			let metadata;
			if (options.meta || options.dpi) {
				metadata = {}
			}
			if (options.dpi) {
				//converting DPi to "dots per meters", Photoshop do not support inches
				metadata.pHYs = {
					x: Math.round(options.dpi / 0.0254),
					y: Math.round(options.dpi / 0.0254),
					units: 1
				};
			}
			if (options.meta) {
				metadata.tEXt = options.meta;
				/*{
					Title:            "projectData.title",
					Author:           "Ponomarev Denis",
					Description:      "",
					Copyright:        "Nymbl ©" + new Date().getFullYear(),
					Software:         "Fiera.js",
					Comment:          ""
				}*/
			}
			let blob = await canvasToBlobPromise(canvas)
			if (metadata) {
				blob = await writeMetadataB(blob, metadata);
			}
			return blob;
		}
	}
}

export async function canvasToBuffer(canvas, options){
	switch(options.format ){
		case "image/jpg":
		case "image/jpeg":
		case "jpg":
		case "jpeg": {
			let buffer = canvas.toBuffer('image/jpeg', {
				quality: options.quality,
				// progressive: options.progressive,
				// chromaSubsampling: options.chromaSubsampling
			});
			// let blob = await canvasToBlobPromise(canvas, 'image/jpeg', options.quality)

			if(options.meta){
				console.warn("do not support text metadata for JPG (yet)")
			}
			if (options.dpi) {

				let exifStr = piexif.dump({
					"0th": {
						// [piexif.ImageIFD.Make]: "Make",
						[piexif.ImageIFD.XResolution]: [options.dpi,1],
						[piexif.ImageIFD.YResolution]: [options.dpi,1],
						[piexif.ImageIFD.ResolutionUnit]: 2,
						// [piexif.ImageIFD.Software]: "Piexifjs"
					},
					"Exif": {
						// [piexif.ExifIFD.DateTimeOriginal]: "2010:10:10 10:10:10",
						// [piexif.ExifIFD.LensMake]: "LensMake",
						// [piexif.ExifIFD.Sharpness]: 777,
						// [piexif.ExifIFD.LensSpecification]: [[1, 1], [1, 1], [1, 1], [1, 1]]
					},
					"GPS": {
						// [piexif.GPSIFD.GPSVersionID]: [7, 7, 7, 7],
						// [piexif.GPSIFD.GPSDateStamp]: "1999:99:99 99:99:99"
					}
				});
				return new Buffer.from(piexif.insert(exifStr,buffer));
				// blob = new Blob([ua], {type: "image/jpeg"});
			}
			return buffer;
		}
		case "image/png":
		case "png":
		default: {

			let metadata;
			if (options.meta || options.dpi) {
				metadata = {}
			}
			if (options.dpi) {
				//converting DPi to "dots per meters", Photoshop do not support inches
				metadata.pHYs = {
					x: Math.round(options.dpi / 0.0254),
					y: Math.round(options.dpi / 0.0254),
					units: 1
				};
			}
			if (options.meta) {
				metadata.tEXt = options.meta;
				/*{
					Title:            "projectData.title",
					Author:           "Ponomarev Denis",
					Description:      "",
					Copyright:        "Nymbl ©" + new Date().getFullYear(),
					Software:         "Fiera.js",
					Comment:          ""
				}*/
			}
			let buffer = canvas.toBuffer("image/png",{
				// compressionLevel: 6,
				// filters: canvas.PNG_ALL_FILTERS,
				// palette: undefined,
				// backgroundIndex: 0,
				// resolution: undefined
			});

			if (metadata) {
				buffer = await writeMetadata(buffer, metadata);
			}
			return buffer;
		}
	}
}
