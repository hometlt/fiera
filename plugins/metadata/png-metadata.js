/**
 * library to read and write PNG Metadata
 *
 * References:
 * w3 PNG Chunks specification: https://www.w3.org/TR/PNG-Chunks.html
 * The Metadata in PNG files: https://dev.exiv2.org/projects/exiv2/wiki/The_Metadata_in_PNG_files
 *
 * @alternatives
 * https://github.com/kujirahand/node-png-metadata
 * https://github.com/ma-zal/angularjs-png-metadata
 *
 * @example


 //example with buffers

function loadFileAsBlob(url){
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.status === 200) {
				resolve(this.response);
				// myBlob is now the blob that the object URL pointed to.
			}else{
				reject(this.response);
			}
		};
		xhr.send();
	})
};

//Browser
const blob = await loadFileAsBlob('1000ppcm.png');
const buffer = await blob.arrayBuffer();

//NodeJS
const buffer = fs.readFileSync('1000ppcm.png')

//read metadata
metadata = readMetadata(buffer);

//image with 300 dpi
metadata = {
	pHYs: {
		x: 30000,
		y: 30000,
		units: RESOLUTION_UNITS.INCHES
	},
	tEXt: {
		Title:            "Short (one line) title or caption for image",
		Author:           "Name of image's creator",
		Description:      "Description of image (possibly long)",
		Copyright:        "Copyright notice",
		Software:         "Software used to create the image",
		Disclaimer:       "Legal disclaimer",
		Warning:          "Warning of nature of content",
		Source:           "Device used to create the image",
		Comment:          "Miscellaneous comment"
	}
};

//write metadata
writeMetadata(buffer,metadata);

//save iamge from canvas
canvas.toBlob(blob => {
		let newBlob = fabric.util.png.writeMetadataB(blob, metadata);
		saveAs(newBlob, title);
});
 */
import {blobToArrayBuffer} from '../blob-buffers-utils.js';
import crc32 from './crc-32.js';
// import UZIP from './UZIP.js';


// Used for fast-ish conversion between uint8s and uint32s/int32s.
// Also required in order to remain agnostic for both Node Buffers and
// Uint8Arrays.
let uint8 = new Uint8Array(4)
let int32 = new Int32Array(uint8.buffer)
let uint32 = new Uint32Array(uint8.buffer)

const RESOLUTION_UNITS = {UNDEFINED: 0, METERS: 1, INCHES: 2};

/**
 * https://github.com/hughsk/png-chunks-extract
 * Extract the data chunks from a PNG file.
 * Useful for reading the metadata of a PNG image, or as the base of a more complete PNG parser.
 * Takes the raw image file data as a Uint8Array or Node.js Buffer, and returns an array of chunks. Each chunk has a name and data buffer:
 * @param data {Uint8Array}
 * @returns {[{name: String, data: Uint8Array}]}
 */
function extractChunks (data) {
	if (data[0] !== 0x89) throw new Error('Invalid .png file header')
	if (data[1] !== 0x50) throw new Error('Invalid .png file header')
	if (data[2] !== 0x4E) throw new Error('Invalid .png file header')
	if (data[3] !== 0x47) throw new Error('Invalid .png file header')
	if (data[4] !== 0x0D) throw new Error('Invalid .png file header: possibly caused by DOS-Unix line ending conversion?')
	if (data[5] !== 0x0A) throw new Error('Invalid .png file header: possibly caused by DOS-Unix line ending conversion?')
	if (data[6] !== 0x1A) throw new Error('Invalid .png file header')
	if (data[7] !== 0x0A) throw new Error('Invalid .png file header: possibly caused by DOS-Unix line ending conversion?')

	let ended = false
	let chunks = []
	let idx = 8

	while (idx < data.length) {
		// Read the length of the current chunk,
		// which is stored as a Uint32.
		uint8[3] = data[idx++]
		uint8[2] = data[idx++]
		uint8[1] = data[idx++]
		uint8[0] = data[idx++]

		// Chunk includes name/type for CRC check (see below).
		let length = uint32[0] + 4
		let chunk = new Uint8Array(length)
		chunk[0] = data[idx++]
		chunk[1] = data[idx++]
		chunk[2] = data[idx++]
		chunk[3] = data[idx++]

		// Get the name in ASCII for identification.
		let name = (
			String.fromCharCode(chunk[0]) +
			String.fromCharCode(chunk[1]) +
			String.fromCharCode(chunk[2]) +
			String.fromCharCode(chunk[3])
		)

		// The IHDR header MUST come first.
		if (!chunks.length && name !== 'IHDR') {
			throw new Error('IHDR header missing')
		}

		// The IEND header marks the end of the file,
		// so on discovering it break out of the loop.
		if (name === 'IEND') {
			ended = true
			chunks.push({
				name: name,
				data: new Uint8Array(0)
			})

			break
		}

		// Read the contents of the chunk out of the main buffer.
		for (let i = 4; i < length; i++) {
			chunk[i] = data[idx++]
		}

		// Read out the CRC value for comparison.
		// It's stored as an Int32.
		uint8[3] = data[idx++]
		uint8[2] = data[idx++]
		uint8[1] = data[idx++]
		uint8[0] = data[idx++]

		let crcActual = int32[0]
		let crcExpect = crc32.buf(chunk)
		if (crcExpect !== crcActual) {
			throw new Error(
				'CRC values for ' + name + ' header do not match, PNG file is likely corrupted'
			)
		}

		// The chunk data is now copied to remove the 4 preceding
		// bytes used for the chunk name/type.
		let chunkData = new Uint8Array(chunk.buffer.slice(4))

		chunks.push({
			name: name,
			data: chunkData
		})
	}

	if (!ended) {
		throw new Error('.png file ended prematurely: no IEND header was found')
	}

	return chunks
}

/**
 * Get object with PNG metadata. only tEXt and pHYs chunks are parsed
 * @param buffer {Buffer}
 * @returns {{tEXt: {keyword: value}, pHYs: {x: number, y: number, units: RESOLUTION_UNITS}, [string]: true}}
 */
export function readMetadata(buffer){
	let result = {};
	const chunks = extractChunks(buffer);

	// Critical chunks (must appear in this order, except PLTEis optional):
	// IHDR    No      Must be first
	// PLTE    No      Before IDAT
	// IDAT    Multiple     Multiple IDATs must be consecutive
	// IEND    No      Must be last


	// iTXt    Multiple     None
	// tEXt    Multiple     None
	// zTXt    Multiple     None

	chunks.forEach( chunk => {

		let data = chunk.data;
		let i = 0;
		function readNumber(){
			return data[++i];
		}

		function uncompress(){

			// let array = data.slice(i);
			// let deflated = UZIP.inflateRaw(array)
			// let uncompressedText = "";
			// for(let i =0 ;i < deflated.length;i++){
			// 	uncompressedText += String.fromCharCode(deflated[i])
			// }
			// res.text = uncompressedText;
		}

		function readText(){
			let text = "";
			while(data[i]) {
				if (data[i] >= 192) {
					text += String.fromCharCode((data[i] - 192) * 64 + data[++i] - 128);
				} else {
					text += String.fromCharCode(data[i])
				}
				i++;
			}
			i++;
			return text;
		}

		/**
		 * read 4 bytes number from UInt8Array.
		 * @param uint8array
		 * @param offset
		 * @returns {number}
		 */
		function readUint32 () {
			let byte1, byte2, byte3, byte4;
			byte1 = data[i++];
			byte2 = data[i++];
			byte3 = data[i++];
			byte4 = data[i++];
			return  0 | (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;
		}

		let res = null;

		switch(chunk.name) {
			case 'tIME': {
				// tIME Image last-modification time
				// The tIME chunk gives the time of the last image modification (not the time of initial image creation). It contains:
				// Year:   2 bytes (complete; for example, 1995, not 95)
				// Month:  1 byte (1-12)
				// Day:    1 byte (1-31)
				// Hour:   1 byte (0-23)
				// Minute: 1 byte (0-59)
				// Second: 1 byte (0-60)    (yes, 60, for leap seconds; not 61, a common error)
				break
			}
			case 'sPLT': { //palette
				// Palette name:    1-79 bytes (character string)
				// 	Null terminator: 1 byte
				// 	Sample depth:    1 byte
				// 	Red:             1 or 2 bytes
				// 	Green:           1 or 2 bytes
				// 	Blue:            1 or 2 bytes
				// 	Alpha:           1 or 2 bytes
				// 	Frequency:       2 bytes
				// ...etc...
				break
			}
			case 'iCCP': {
				// Profile name:       1-79 bytes (character string)
				// Null separator:     1 byte
				// Compression method: 1 byte
				// Compressed profile: n bytes

				res = {
					profileName: readText(),
					compressionMethod: readNumber(),
					compressedProfile: data.slice(i)
				}
				break
			}
			case 'iTXt': {
				// Keyword	1-79 bytes (character string)
				// Null separator	1 byte (null character)
				// Compression flag	1 byte
				// Compression method	1 byte
				// Language tag	0 or more bytes (character string)
				// Null separator	1 byte (null character)
				// Translated keyword	0 or more bytes
				// Null separator	1 byte (null character)
				// Text	0 or more bytes

				res = {
					keyword: readText(),
					compressionFlag: readNumber(),
					compressionMethod: readNumber(),
					languageTag: readText(),
					translatedKeyword: readText(),
					text: readText()
				}
				break;
			}
			case 'zTXt': {
				// Keyword:            1-79 bytes (character string)
				// Null separator:     1 byte
				// Compression method: 1 byte
				// Compressed text:    n bytes

				res = {
					keyword: readText(),
					compressionMethod: readNumber(),
					compressedText: readText()
				}

				res.text = "" //todo uncompress text
				break;
			}
			case 'tEXt':
				// Keyword:        1-79 bytes (character string)
				// Null separator: 1 byte
				// Text:           n bytes (character string)

				res = {
					keyword: readText(),
					text: readText()
				}
				break
			case 'pHYs':
				// Pixels per unit, X axis: 4 bytes (unsigned integer)
				// Pixels per unit, Y axis: 4 bytes (unsigned integer)
				// Unit specifier:          1 byte    0: unit is unknown, 1: unit is the meter

				res = {
					"x": readUint32(),
					"y":  readUint32(),
					"unit": readNumber()
				}
				break
			case 'gAMA':
				// The gAMA chunk specifies the relationship between the image samples and the desired display output intensity as a power function:
				// sample = light_out ^ gamma
				// Here sample and light_out are normalized to the range 0.0 (minimum intensity) to 1.0 (maximum intensity). Therefore:
				// sample = integer_sample / (2^bitdepth - 1)
				// The gAMA chunk contains:
				// Gamma: 4 bytes

				res = {
					gamma: readUint32()
				}
				break
			case 'cHRM':
				// The cHRM chunk contains:
				// White Point x: 4 bytes
				// White Point y: 4 bytes
				// Red x:         4 bytes
				// Red y:         4 bytes
				// Green x:       4 bytes
				// Green y:       4 bytes
				// Blue x:        4 bytes
				// Blue y:        4 bytes

				res = {
					whitePointX: readUint32(),
					whitePointY: readUint32(),
					redX: readUint32(),
					redY: readUint32(),
					greenX: readUint32(),
					greenY: readUint32(),
					blueX: readUint32(),
					blueY: readUint32()
				}
				break
			case 'sRGB':
				// Rendering intent: 1 byte
				// The following values are defined for the rendering intent:
				// 0: Perceptual
				// 1: Relative colorimetric
				// 2: Saturation
				// 3: Absolute colorimetric

				res = {
					renderingIntent: readNumber()
				}
				break
			case 'IHDR':
				// Width:              4 bytes
				// Height:             4 bytes
				// Bit depth:          1 byte
				// Color type:         1 byte
				// Compression method: 1 byte
				// Filter method:      1 byte
				// Interlace method:   1 byte

				res = {
					width: readUint32(),
					height:  readUint32(),
					bitDepth: readNumber(),
					colorType: readNumber(),
					compressionMethod: readNumber(),
					filterMethod: readNumber(),
					interlaceMethod: readNumber()
				}
				break
		}

		if(res !== null){
			if(["sPLT","iTXt","tEXt","zTXt"].includes(chunk.name)){
				if (!result[chunk.name]) result[chunk.name] = []
				result[chunk.name].push(res)
			}else{
				result[chunk.name] = res
			}
		}
	})

	return result;
}

export async function readMetadataB(blob){
	const buffer = await blobToArrayBuffer(blob);
	let uint8array = new Uint8Array(buffer)
	return readMetadata(uint8array);
}




/**
 * https://github.com/hughsk/png-chunks-encode
 * Return a fresh PNG buffer given a set of PNG chunks. Useful in combination with png-chunks-encode to easily modify or add to the data of a PNG file.
 * Takes an array of chunks, each with a name and data:
 * @param chunks {[{name: String, data: Uint8Array}]}
 * @returns {Uint8Array}
 */
function encodeChunks (chunks) {

	/**
	 * An Array.prototype.slice.call(arguments) alternative
	 * @param {Object} args something with a length
	 * @param {Number} slice
	 * @param {Number} sliceEnd
	 * @api public
	 */
	function sliced (args, slice, sliceEnd) {
		var ret = [];
		var len = args.length;

		if (0 === len) return ret;

		var start = slice < 0
			? Math.max(0, slice + len)
			: slice || 0;

		if (sliceEnd !== undefined) {
			len = sliceEnd < 0
				? sliceEnd + len
				: sliceEnd
		}

		while (len-- > start) {
			ret[len - start] = args[len];
		}

		return ret;
	}


	let totalSize = 8
	let idx = totalSize
	let i

	for (i = 0; i < chunks.length; i++) {
		totalSize += chunks[i].data.length
		totalSize += 12
	}

	let output = new Uint8Array(totalSize)

	output[0] = 0x89
	output[1] = 0x50
	output[2] = 0x4E
	output[3] = 0x47
	output[4] = 0x0D
	output[5] = 0x0A
	output[6] = 0x1A
	output[7] = 0x0A

	for (i = 0; i < chunks.length; i++) {
		let chunk = chunks[i]
		let name = chunk.name
		let data = chunk.data
		let size = data.length
		let nameChars = [
			name.charCodeAt(0),
			name.charCodeAt(1),
			name.charCodeAt(2),
			name.charCodeAt(3)
		]

		uint32[0] = size
		output[idx++] = uint8[3]
		output[idx++] = uint8[2]
		output[idx++] = uint8[1]
		output[idx++] = uint8[0]

		output[idx++] = nameChars[0]
		output[idx++] = nameChars[1]
		output[idx++] = nameChars[2]
		output[idx++] = nameChars[3]

		for (let j = 0; j < size;) {
			output[idx++] = data[j++]
		}

		let crcCheck = nameChars.concat(sliced(data));
		int32[0] = crc32.buf(crcCheck)
		output[idx++] = uint8[3]
		output[idx++] = uint8[2]
		output[idx++] = uint8[1]
		output[idx++] = uint8[0]
	}

	return output
}

/**
 * create new Buffer with metadata. only tEXt and pHYs chunks are supported.
 * @param blob {Array| Blob | File| Buffer | ArrayBuffer | Uint8Array}
 * @param metadata {{tEXt: {keyword: value}, pHYs: {x: number, y: number, units: RESOLUTION_UNITS}}}
 * @returns {Promise<Array | Blob | File| Buffer | ArrayBuffer | Uint8Array>} new blob
 */
export function writeMetadata(data, metadata){
	let dataType = data.constructor.name;
	let chunks;
	switch(dataType){
		case "Array":
			chunks = data
			break;
		case "ArrayBuffer":
			buffer = new Uint8Array(data);
			chunks = extractChunks(buffer); //can work with Uint8Array and Buffer
			break;
		case "Buffer":
		case "Uint8Array":
			let buffer = data
			chunks = extractChunks(buffer); //can work with Uint8Array and Buffer
			break;
	}

	/**
	 * write 4 bytes number to UInt8Array.
	 * @param uint8array
	 * @param num
	 * @param offset
	 */
	function writeUInt32(uint8array, num, offset){
		uint8array[offset] = (num & 0xff000000) >> 24;
		uint8array[offset + 1] = (num & 0x00ff0000) >> 16;
		uint8array[offset + 2] = (num & 0x0000ff00) >> 8;
		uint8array[offset + 3] = (num & 0x000000ff);
	}

	/**
	 * Returns a chunk object containing the metadata for a given key and value:
	 * @param keyword
	 * @param content
	 * @param chunkName
	 * @returns {{data: Uint8Array, name: 'tEXt'}}
	 */
	function textEncode (keyword, content , chunkName = 'tEXt') {
		keyword = String(keyword)
		content = String(content)

		if (content.length && (!/^[\x00-\xFF]+$/.test(keyword) || !/^[\x00-\xFF]+$/.test(content))) {
			throw new Error('Only Latin-1 characters are permitted in PNG tEXt chunks. You might want to consider base64 encoding and/or zEXt compression')
		}

		if (keyword.length >= 80) {
			throw new Error('Keyword "' + keyword + '" is longer than the 79-character limit imposed by the PNG specification')
		}

		let totalSize = keyword.length + content.length + 1
		let output = new Uint8Array(totalSize)
		let idx = 0
		let code

		for (let i = 0; i < keyword.length; i++) {
			if (!(code = keyword.charCodeAt(i))) {
				throw new Error('0x00 character is not permitted in tEXt keywords')
			}

			output[idx++] = code
		}

		output[idx++] = 0

		for (let j = 0; j < content.length; j++) {
			if (!(code = content.charCodeAt(j))) {
				throw new Error('0x00 character is not permitted in tEXt content')
			}

			output[idx++] = code
		}

		return {
			name: chunkName,
			data: output
		}
	}

	function clearMetadata(chunks){
		for(let i = chunks.length - 1; i--;){
			switch(chunks[i].name){
				case 'IHDR':
				case 'IDAT':
				case 'IEND':
					break;
				default:
					chunks.splice(i,1);
			}
		}
	}

	if(metadata.clear){
		clearMetadata(chunks)
	}

	if(metadata.tEXt){
		for(var keyword in metadata.tEXt){
			chunks.splice(-1, 0, textEncode(keyword, metadata.tEXt[keyword]))
		}
	}

	if(metadata.pHYs){
		const data = new Uint8Array(9);
		writeUInt32(data,metadata.pHYs.x,0)
		writeUInt32(data,metadata.pHYs.y,4)
		data[8] = metadata.pHYs.units; // inches

		let pHYs = chunks.find(chunk => chunk.name === "pHYs");
		if(pHYs){
			pHYs.data = data;
		}
		else{
			chunks.splice(1, 0, {name: "pHYs",data: data})
		}
	}

	switch(dataType){
		case "Array": {
			return chunks
		}
		case "ArrayBuffer": {
			let uint8array = encodeChunks(chunks)
			return uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteLength + uint8array.byteOffset);
		}
		case "Uint8Array": {
			return encodeChunks(chunks)
		}
		case "Buffer": {
			let uint8array = encodeChunks(chunks)
			return new Buffer.from(uint8array)
		}
	}


}

export async function writeMetadataB(blob,metadata){
	let arrayBuffer = await blobToArrayBuffer(blob);
	let sourceData = new Uint8Array(arrayBuffer);
	let outputData = writeMetadata(sourceData,metadata)
	return new Blob([outputData], {type : blob.type});
}
export default {
	RESOLUTION_UNITS: RESOLUTION_UNITS,
	readMetadata: readMetadata,
	readMetadataB: readMetadataB,
	writeMetadata: writeMetadata,
	writeMetadataB: writeMetadataB,
	extractChunks: extractChunks,
	encodeChunks: encodeChunks
}
