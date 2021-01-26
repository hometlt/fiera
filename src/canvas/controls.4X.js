/**
 * Renders controls and borders for the object
 * @param {CanvasRenderingContext2D} ctx Context to render on
 * @param {Object} [styleOverride] properties to override the object style
 */
fabric.Object.prototype._renderControls = function(ctx, styleOverride) {
    var vpt = this.getViewportTransform(),
        matrix = this.calcTransformMatrix(),
        options, drawBorders, drawControls;
    styleOverride = styleOverride || { };
    drawBorders = typeof styleOverride.hasBorders !== 'undefined' ? styleOverride.hasBorders : this.hasBorders;
    drawControls = typeof styleOverride.hasControls !== 'undefined' ? styleOverride.hasControls : this.hasControls;
    matrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
    options = fabric.util.qrDecompose(matrix);
    ctx.save();
    ctx.translate(options.translateX, options.translateY);
    ctx.lineWidth = 1 * this.borderScaleFactor;
    if (!this.group) {
        ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    }
    if (styleOverride.forActiveSelection) {
        ctx.rotate(fabric.util.degreesToRadians(options.angle));
        drawBorders && this.drawBordersInGroup(ctx, options, styleOverride);
    }
    else {
        ctx.rotate(fabric.util.degreesToRadians(this.angle));
        drawBorders && this.drawBorders(ctx, styleOverride);
    }
    drawControls && this.drawControls(ctx, styleOverride);

    if(this.canvas.showControlsGuidlines){
        this.drawControlsInterface && this.drawControlsInterface(ctx)
    }

    ctx.restore();
}

fabric.Canvas.prototype.showControlsGuidlines = true;