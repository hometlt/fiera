export function resolvePath(path) {
    var chunks = path.replace(/\\/g, "/").split("/");
    var prev = 0;
    for (var i = chunks.length; i-- > 0;) {
        if (chunks[i] == "..") {
            prev++;
        } else {
            while (prev > 0) {
                // if(chunks[i] === ".")break;
                chunks.splice(i, 1);
                chunks.splice(i--, 1);
                prev--;
            }
        }
    }
    return chunks.join("/");
}
