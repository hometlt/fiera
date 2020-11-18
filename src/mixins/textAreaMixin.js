fabric.TextAreaMixin = {

    _on_text_edit: function(e){

        this._originX = this.originX;
        this._originY = this.originY;
        var _c = this.getCenterPoint();

        if (this._originY !== "center" || this._originX !== "center") {
            this.set({
                left: _c.x,
                top: _c.y,
                originX: "center",
                originY: "center"
            });
        }

        this.edit();
        this.setCoords();
        this.text.setCoords();
        this.text.setCursorByClick(e.e);
    },
    _initText: function (options) {
        options = options || {text : ""}

        /**
         * change font size to fit textbox area
         */
        if(this.fitText){
            this.text = new fabric.TextFrame(options.text, options);
        }else{
            this.text = new fabric.IText(options.text, options);

            /**
             * text algorithms  resize On TextChange
             */
            this.text.on("changed", function (e) {

                var _w = Math.max(this.speech.width, this.width + this.speech.strokeWidth * 2 +(this.speech.textPaddingX || 0)),
                    _h = Math.max(this.speech.height, this.height + this.speech.strokeWidth * 2 + (this.speech.textPaddingY||0));
                this.speech.set({
                    width: _w,
                    height: _h
                });
            });
        }

        this.text.speech = this;
        this.text.setOptions({
            hasControls: false,
            textAlign: "center",
            selectable: false,
            originX: "center",
            originY: "center"
        });





        this.text.on("editing:exited", function (e) {
            this.canvas.remove(this);
            this._edited = false;
            this.speech.add(this);
            this.speech.setCoords();
            //рамку двигать нельзя
            this.speech.set({
                evented: true
            });
            if (this.speech._originY !== "center") {
                var _tl = this.speech.oCoords.tl;
                this.speech.set({
                    originY: this.speech._originY,
                    top: _tl.y
                });
            }

            if (this.speech._originX !== "center") {
                var _tl = this.speech.oCoords.tl;
                this.speech.set({
                    originX: this.speech._originX,
                    left: _tl.x
                });
            }

            this.set({
                lockMovementX: false,
                lockMovementY: false,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                left: 0,
                top: 0
            })

            this.setCoords();
            this.speech.setCoords();
        });
        this.add(this.text);


    },

    edit: function() {
        if(this.text._edited)return;
        //this.project.clipMode = true;
        this.text._edited = true;

        //this._editMode = true;

        // ?????????????? ???????????
        this.canvas.discardActiveGroup();

        this._restoreObjectState(this.text);

        this.text.set({
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            //selectable: false,
            //perPixelTargetFind: true,
            selectable: true,
            perPixelTargetFind: false
        });

        //рамку двигать нельзя
        this.set({
            evented: false
        });

        this.remove(this.text);

        this.canvas.add(this.text);

        this.canvas._setActiveObject(this.text);
        var self = this;
        this.canvas.renderAll();
        //setTimeout(function(){
            self.text.enterEditing();
        //});
        this.canvas.renderAll();
    },
    getMinHeight: function () {
        var padding = this.textPaddingY || 0;
        if (this.bubble) {
            return Math.max(this.text.height + padding * 2);
        } else {
            return this.text.height + padding * 2;
        }
    },
    getMinWidth: function () {
        var padding = this.textPaddingX || 0;
        if (this.bubble) {
            return Math.max(this.text.width + padding * 2, this.bubble.rx * 2 + this.bubble.bubbleSize + this.bubble.bubbleOffsetX * 2);
        }
        return this.text.width + padding * 2;
    }
}
