
export const FmAlignment = {
  name: "alignment",
  prototypes: {
    StaticCanvas: {
      /**
       * Aligns an element.
       *
       * @method alignElement
       * @param {fabric.Object.ALIGNMENT_OPTIONS} option
       */
      alignElementsInArea(option, elements) {
        let area = this.canvas._getMovementsLimitsRect(this.movementLimits || "canvas", true);
        this.alignElements(option, area, elements)
      },
      alignElements(option, area, elements) {

        let mX = 0, mY = 0;

        let cX = (area.width) / 2 + area.left;
        let cY = (area.height) / 2 + area.top;

        for (let element of elements) {
          let b = element.getBoundingRect(true, true);
          switch (option) {
            case "center":
              mX = b.left - cX + (b.width) / 2;
              mY = b.top - cY + (b.height) / 2;
              break;
            case "center-x":
              mX = b.left - cX + (b.width) / 2;
              break;
            case "center-y":
              mY = b.top - cY + (b.height) / 2;
              break;
            case "left":
              mX = b.left - area.left;
              break;
            case "top":
              mY = b.top - area.top;
              break;
            case "right":
              mX = b.left + b.width - area.left - area.width;
              break;
            case "bottom":
              mY = b.top + b.height - area.top - area.height;
              break;
          }
          element.set({
            left: element.left - mX,
            top: element.top - mY
          });
          element.setCoords();
        }

        this.renderAll();
      }
    },
    Object: {
      "+actions": {
        align: {
          title: "align",
          menu: ["alignCenterY", "alignCenterX", "alignTop", "alignBottom", "alignLeft", "alignRight"]
        },
        distributeY: {
          title: "distribute vertically",
          className: "fi fi-distribute-v"
        },
        distributeX: {
          title: "distribute horizontally",
          className: "fi fi-distribute-h"
        },
        alignCenterY: {
          className: "fi fi-v-align-center",
          title: "middle",
          action: "align",
          option: "center-y"
        },
        alignTop: {
          className: "fi fi-v-align-top",
          title: "top",
          action: "align",
          option: "top"
        },
        alignBottom: {
          className: "fi fi-v-align-bottom",
          title: "bottom",
          action: "align",
          option: "bottom"
        },
        alignCenterX: {
          className: "fi fi-h-align-center",
          title: "center",
          action: "align",
          option: "center-x"
        },
        alignLeft: {
          title: "left",
          className: "fi fi-h-align-left",
          action: "align",
          option: "left"
        },
        alignRight: {
          className: "fi fi-h-align-right",
          title: "right",
          action: "align",
          option: "right"
        }
      },
      align (option){
        let size = this.canvas.getOriginalSize()
        this.canvas.alignElements(option, {left: 0, top: 0, width: size.width, height: size.height}, [this]);
      }
    },
    ActiveSelection: {
      alignChildren(value) {
        let area = {left: -this.width / 2, top: -this.height / 2, width: this.width, height: this.height};
        this.canvas.alignElements(value, area, this._objects);
      },
      "+actions": {
        alignChildren: {
          title: "align selected elements",
          menu: ["alignChildrenCenterY", "alignChildrenCenterX", "alignChildrenTop", "alignChildrenBottom", "alignChildrenLeft", "alignChildrenRight"]
        },
        distributeY: {
          title: "distribute vertically",
          className: "fi fi-distribute-v"
        },
        distributeX: {
          title: "distribute horizontally",
          className: "fi fi-distribute-h"
        },
        alignChildrenCenterY: {
          title: "middle",
          className: "fi fi-v-align-center",
          action: "alignChildren",
          option: "center-y"
        },
        alignChildrenTop: {
          title: "top",
          className: "fi fi-v-align-top",
          action: "alignChildren",
          option: "top"
        },
        alignChildrenBottom: {
          title: "bottom",
          className: "fi fi-v-align-bottom",
          action: "alignChildren",
          option: "bottom"
        },
        alignChildrenCenterX: {
          title: "center",
          className: "fi fi-h-align-center",
          action: "alignChildren",
          option: "center-x"
        },
        alignChildrenLeft: {
          title: "left",
          className: "fi fi-h-align-left",
          action: "alignChildren",
          option: "left"
        },
        alignChildrenRight: {
          title: "right",
          className: "fi fi-h-align-right",
          action: "alignChildren",
          option: "right"
        }
      }
    }
  }
}
