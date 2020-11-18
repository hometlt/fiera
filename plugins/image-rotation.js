
// import FileReader from 'filereader'

// https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images/20600801
export function fixOrientation  (buffer) {
  return new Promise(resolve=> {

    getExifOrientation(buffer, function (orientation) {
      // -2 is not jpeg
      // -1 is not defined
      // 1 is top-left
      if (orientation < 2) {
        resolve(file);
      }
      else
      {
        resetOrientation(URL.createObjectURL(file), orientation, function (blob) {
          let modifiedFile = new File( [blob], file.name, {type: blob.type});
          resolve(modifiedFile);
        });
      }
    });
  });
}

// from http://stackoverflow.com/a/32490603
export function getExifOrientation(buffer, callback) {
  // var reader = new FileReader();
  // reader.onload = function (event) {
  var view = new DataView(buffer);

  if (view.getUint16(0, false) !== 0xFFD8) return callback(-2);

  var length = view.byteLength,
    offset = 2;

  while (offset < length) {
    var marker = view.getUint16(offset, false);
    offset += 2;

    if (marker === 0xFFE1) {
      if (view.getUint32(offset += 2, false) !== 0x45786966) {
        return callback(-1);
      }
      var little = view.getUint16(offset += 6, false) === 0x4949;
      offset += view.getUint32(offset + 4, little);
      var tags = view.getUint16(offset, little);
      offset += 2;

      for (var i = 0; i < tags; i++)
        if (view.getUint16(offset + (i * 12), little) === 0x0112)
          return callback(view.getUint16(offset + (i * 12) + 8, little));
    }
    else if ((marker & 0xFF00) !== 0xFF00) break;
    else offset += view.getUint16(offset, false);
  }
  return callback(-1);
  // };
  //
  // reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};

export function resetOrientation(srcBase64, srcOrientation, callback) {
  var img = new Image();

  img.onload = function () {
    var width = img.width,
      height = img.height,
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext("2d");

    // set proper canvas dimensions before transform & export
    if (4 < srcOrientation && srcOrientation < 9) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // transform context before drawing image
    switch (srcOrientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height, width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: break;
    }

    // draw image
    ctx.drawImage(img, 0, 0);
    // export base64
    // callback(canvas.toDataURL());
    canvas.toBlob(function (blob) {
        callback(blob);
      }, 'image/jpeg', 0.95)
  };

  img.src = srcBase64;
}
