import canvas from 'canvas'
// import request from 'request'
import bent from 'bent'
import fs from 'fs'


const getBuffer = bent('buffer')

//fabric.util.imageCache = {}
// fabric.util.useImageCaching = true;
fabric.util.loadImagePromise = async function(originalUrl,crossOrigin){
	let url = fabric.util.getURL(originalUrl);

	if(fabric.resources[originalUrl]) {
		let resource = fabric.resources[originalUrl]
		if(resource.observer) {
			return await resource.observer
		}
		else {
			return resource.image
		}
	}
	else{
		let img = new canvas.Image();

		//loading from dataURL
		if (url.startsWith('data:')) {
			img.src = url;
			return img;
		}
		else{

			let resource = fabric.resources[originalUrl] = {
				observer: null,
				image: img,
				counter: 0,
				buffer: null,
				url: originalUrl,
				// start: new Date().getTime(),
				// end: null
			}

			resource.observer = new Promise((resolve, reject) => {


				fabric.util.timeDebug && console.time(originalUrl)



				function onError(err) {
					fabric.util.timeDebug && console.timeEnd(originalUrl)
					console.error(err);
					img.src = fabric.media.error;
					resolve(img);
					// reject()

					// if (img.eventListeners) {
					// 	for (let listener of img.eventListeners.error) {
					// 		listener(err)
					// 	}
					// }
				}

				function onLoad(buffer) {
					fabric.util.timeDebug && console.timeEnd(originalUrl)
					resource.buffer = buffer;
					img.src = buffer;
					resolve(img)

					// resource.end = new Date().getTime()
					// resource.time = new Date().getTime() - resource.start;
					// fabric.util.loadingTime += resource.time;
					// fabric.util.timeDebug && console.log(`loading ${url}: ${resource.time} ms`);
					// fabric.util.fImageRegistry[url] = buffer;

					// if (img.eventListeners) {
					// 	for (let listener of img.eventListeners.load) {
					// 		listener(img)
					// 	}
					// }
				}


				if (url.startsWith('http')) {
					getBuffer(url)
						.then(buffer => {
						 	onLoad(buffer)
						}).catch(err => {
							onError(err)
						})
				} else {
					fs.readFile(url, function (err, buffer) {
						err ? onError(err) : onLoad(buffer)
					});
				}
			})

			return resource.observer
		}
	}
}
