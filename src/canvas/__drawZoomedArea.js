
export const Brushes = {
    name: "brushes",
    prototypes: {
        Canvas: {
            drawZoomedArea: function (ctx, left, top, width, height, pointer) {

                width = width || 90;
                height = height || 90;

                ctx.save();
                ctx.translate(left || 0, top || 0);

                ctx.fillStyle = 'black';
                ctx.strokeStyle = "#fff";
                ctx.strokeWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.drawImage(this.backgroundImage._element, Math.floor(pointer.x) - 4, Math.floor(pointer.y) - 4, 9, 9, 0, 0, width, width);
                ctx.strokeRect(0, 0, width, width);
                ctx.strokeRect(40, 40, 10, 10);
                ctx.restore();
            }
        }
    }
}