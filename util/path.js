module.exports = {
  resolve: function (path) {
    var chunks = path.split("/");
    var prev = 0;
    for (var i = chunks.length; i-- > 0;) {
      if (chunks[i] == "..") {
        prev++;
      } else {
        while (prev > 0) {
          chunks.splice(i, 1);
          chunks.splice(i--, 1);
          prev--;
        }
      }
    }
    return chunks.join("/");
  },
  getParentDirectoryUrl: function (url) {
    return url.substr(0, url.lastIndexOf("/") + 1);
  }
}
