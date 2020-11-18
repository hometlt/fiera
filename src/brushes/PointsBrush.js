import "./BaseBrush.js"
import PointShape from "../shapes/MaterialPoint.js"

export default {
    name: "points-brush",
    deps: [PointShape],
    prototypes: {
        PointsBrush: {
            prototype: fabric.BaseBrush,
            type: "points-brush",
            maximumPoints: 0,
            initialize: function (canvas) {
                this.callSuper('initialize', canvas)
                this.reset()
            },
            currentPoint: 1,
            points: [],
            getPoints: function () {
                return this.canvas._objects.filter(item => item.type === "material-point")
            },
            checkPosition: null,
            onMouseDown: function (pointer) {

            },
            onMouseMove: function (pointer) {
            },
            reset: function () {
            },
            onMouseUp: function (pointer) {
                var _points = this.getPoints()

                var pos = {
                    left: pointer.x - 0.5,
                    top: pointer.y - 0.5,
                }

                var _correct = this.checkPosition ? this.checkPosition(pointer) : true

                if (!_correct) {
                    this.canvas.fire("point:rejected", {point: pointer})
                    return
                }

                if (this.maximumPoints && _points.length >= this.maximumPoints) {
                    if (this.currentPoint > this.maximumPoints) {
                        this.currentPoint = 1
                    }
                    if (this.wholeCoordinates) {
                        pointer.x = Math.round(pointer.x) + 0.5
                        pointer.y = Math.round(pointer.y) + 0.5
                    }
                    let _obj = _points.find(item => item.number === this.currentPoint++)
                    // var _obj = fabric._.findWhere(_points,{number : this.currentPoint++})

                    let states = {
                        original: {
                            left: _obj.left,
                            top: _obj.top
                        },
                        modified: {
                            left: pointer.x - 0.5,
                            top: pointer.y - 0.5
                        }
                    }

                    _obj.set(states.modified).setCoords().fire("modified", {states: states})
                    this.canvas.fire("object:modified", {target: _obj, states: states})
                    this.canvas.setActiveObject(_obj)
                    this.canvas.renderAll()
                    return
                } else {
                    this.currentPoint = 1

                    while (_points.find(item => item.number === this.currentPoint)) {
                        this.currentPoint++
                    }
                }
                let _obj = this.editor.createObject({type: "material-point",
                    number: this.currentPoint,
                    editor: this.canvas.editor,
                    left: pos.left,
                    top: pos.top
                })

                this.currentPoint++
                this.canvas.add(_obj)
                this.points.push(_obj)
                this.canvas.setActiveObject(_obj)
                this.canvas.fire("point:created", {point: _obj, points: this.points})
                this.canvas.requestRenderAll()
            },
            _render: function () {
            }
        }
    }
}

//
// fabric.Canvas.prototype.drawingTools.PointsBrush = {
//   className: 'fa fa-circle-o',
//   title: 'Points Brush'
// }
