import {getProportions} from "../../util/size.js";

export const FmStretchable = {
  name: "stretchable",
  prototypes: {
    Canvas: {
      "+optionsOrder": ["stretchable","zoom"],
      stretchingOptions: {
        action: "resize",
        maxWidth: null,
        maxHeight: null,
        maxWidthRate: null,
        maxHeightRate: null,
        margin: null,
        marginX: null,
        marginY: null
      },
      /**
       * makes canvas responsible. Canvas will be scaled to 100% of its container size
       */
      stretchable: false,
      updateCanvasSize(){
        let options = this.stretchingOptions;
        let _parent = this.getRelativeContainer();
        if (!_parent) return;
        // let _margin = this.application && this.application.widthMargin || 0;

        let marginX = options.marginX || options.margin || 0
        let marginY = options.marginY || options.margin || 0
        let w = this.getOriginalWidth()
        let h = this.getOriginalHeight()

        let _w = _parent.offsetWidth - marginX * 2,
            _h = _parent.offsetHeight - marginY * 2;
        if (options.maxWidthRate) {
          _w *= options.maxWidthRate;
        }
        if (options.maxHeightRate) {
          _w *= options.maxHeightRate;
        }
        if (options.maxWidth) {
          _w = Math.min(options.maxWidth, _w);
        }
        if (options.maxHeight) {
          _h = Math.min(options.maxHeight, _h);
        }
        if (_w <= 0 || _h <= 0) return;
        if (this.editor && this.editor.onResize) {
          this.editor.onResize({
            width: _w,
            height: _h
          }, {
            width: w,
            height: h
          });
          this.calcOffset();
        } else {
          if (options.action === "zoom") {
            let proportions = getProportions(
                {width: w, height: h},
                {width: _w, height: _h}
            );
            // this.centerAndZoomOut()
            this.setDimensions(proportions);
            this.setZoom(proportions.scale);
          } else {
            //   this.canvas.centerAndZoomOut();
            this.setDimensions({
              width: _w /*- _offset.left*/,
              height: _h /*- _offset.top*/
            });
          }
        }
        // this.fire("resize")
      },
      _onResize: function () {
        if (this.stretchable) {
          this.updateCanvasSize()
        } else {
          this.calcOffset();
        }
      },
      getRelativeContainer() {
        // if (this._scrollContainer) return this._scrollContainer;
        if (!this.wrapperEl.parentNode) return;

        function getRelativeContainer(el) {
          do {
            if (window.getComputedStyle(el).position !== "static") {
              return el;
            }
            el = el.parentElement;
          } while (el);
          return document.body;
        }

        this._scrollContainer = getRelativeContainer(this.wrapperEl.parentNode);
        return this._scrollContainer;
      },
      getScrollContainer() {
        // if (this._scrollContainer) return this._scrollContainer;
        if (!this.wrapperEl.parentNode) return;

        function getScrollContainer(el) {
          do {
            if (window.getComputedStyle(el).overflow !== "visible") {
              return el;
            }
            el = el.parentElement;
          } while (el);
          return document.body;
        }

        this._scrollContainer = getScrollContainer(this.wrapperEl.parentNode);
        return this._scrollContainer;
      },
      setStretchingOptions(val) {
        this.stretchingOptions = val;
        if(!this.stretchable)return
        if (this.lowerCanvasEl) {
          this._onResize();
        }
      },
      setStretchable(val) {
        this.stretchable = val;
        if(!this.stretchable)return

        this.wrapperEl.style.width = "100%"
        this.wrapperEl.style.height = "100%"

        this.resizeObserver = new ResizeObserver(() => this._onResize());
        this.resizeObserver.observe(this.wrapperEl);


        if (this.lowerCanvasEl) {
          this._onResize();
        }
      }
    }
  }
}
