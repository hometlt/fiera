
/* Dark Magic with patterns
fabric.TextFrame.fromObject = function(object, callback) {
    var _total = 0, loaded = 0;
    function create(){
        var f = new fabric.TextFrame(object.text,object);
        callback && callback(f);
    }
    fabric.util.recoursive(object,
        function(property, value, parent) {
            if (property === "pattern") {
                _total ++;
                var _texture =  fabric.texturesPath + parent[property];
                fabric.util.loadImage(_texture, function(img) {
                    parent["fill"] = new fabric.Pattern({
                        source: img,
                        repeat: "repeat"
                    });
                    delete parent[property];
                    loaded++;
                    if(_total == loaded)create();

                }, this, this.crossOrigin);
            }
        }
    );
    if(_total == loaded){
        return create();
    }
}*/