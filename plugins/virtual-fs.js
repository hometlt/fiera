
function normalizeFilename(fileName) {
  if (fileName.indexOf(__dirname) === 0) {
    fileName = fileName.substring(__dirname.length);
  }

  if (fileName.indexOf('/') === 0) {
    fileName = fileName.substring(1);
  }

  return fileName;
}

function VirtualFileSystem() {
  this.fileData = {};
}

VirtualFileSystem.prototype.readFileSync = function readFileSync(fileName, options) {
  if (options === void 0) {
    options = {};
  }

  var encoding = typeof options === 'string' ? options : options.encoding;
  var virtualFileName = normalizeFilename(fileName);
  var data = this.fileData[virtualFileName];

  if (data == null) {
    throw new Error("File '" + virtualFileName + "' not found in virtual file system");
  }

  if (encoding) {
    // return a string
    return typeof data === 'string' ? data : data.toString();
  }

  return new Buffer(data, typeof data === 'string' ? 'base64' : undefined);
};

VirtualFileSystem.prototype.writeFileSync = function writeFileSync(fileName, content) {
  this.fileData[normalizeFilename(fileName)] = content;
};

VirtualFileSystem.prototype.bindFileData = function bindFileData(data, options) {
    if (data === void 0) {
      data = {};
    }

    if (options === void 0) {
      options = {};
    }

    if (options.reset) {
      this.fileData = data;
    } else {
      Object.assign(this.fileData, data);
    }
  }

export default new VirtualFileSystem();