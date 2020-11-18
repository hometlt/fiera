import MagicWand from "../plugins/magicwand.js";
import Pathfinder from "../src/util/pathfinder.js";

export function getCanvasContentMask(canvas,options){
	let pathfinder = new Pathfinder(options);

	pathfinder.colorThreshold = options.colorThreshold;
	pathfinder.setPicture(canvas);
	pathfinder.selectBackground(options.fromCorners);

	if(!pathfinder.mask.count ) {
		return false;
	}
	pathfinder._fill([0, 0, 0, 0]);
	//clip the image
	// pathfinder.clearMemory();
	return MagicWand.invertMask(pathfinder.mask);
}

export function trimCanvas(canvas,options){
	let tm = getCanvasContentMask(canvas,options)
	let ctx = canvas.getContext('2d');
	if(tm.count){
		let imageData = canvas //pathfinder.editedImageCanvas
			.getContext('2d')
			.getImageData(tm.bounds.minX, tm.bounds.minY, canvas.width, canvas.height);
		canvas.width = tm.bounds.maxX - tm.bounds.minX + 1;
		canvas.height = tm.bounds.maxY - tm.bounds.minY + 1;
		ctx.putImageData(imageData, 0, 0);
		return tm.bounds;
	}else{
		canvas.width  = 1;
		canvas.height = 1;
		ctx.clearRect(0,0,1,1);
		return false
	}
}
