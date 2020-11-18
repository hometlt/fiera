
fabric.CacheMixin = {
  caching: true,
  dirty: true,
  extraCacheDPI: 1,
  render: function ( ctx) {

    ctx.save();
    if (this.transformMatrix) {
      ctx.transform.apply(ctx, this.transformMatrix);
    }
    this.transform(ctx);

    this._setShadow(ctx);
    this.clipTo && fabric.util.clipContext(this, ctx);

    ctx.translate(-this.width / 2, -this.height / 2);

    if (this.caching) {
      if(this.dirty ) {

        if(!this._cache){
          this._cache = fabric.util.createCanvasElement();
        }

        this._cache.setAttribute('width', Math.ceil(this.width * this.scaleX * this.extraCacheDPI));
        this._cache.setAttribute('height', Math.ceil(this.height * this.scaleY* this.extraCacheDPI ));

        if (this._element) {
          var cacheCtx = this._cache.getContext("2d");
          cacheCtx.clearRect(0, 0, this._cache.width, this._cache.height)
          this._render(cacheCtx);
          this.dirty = false;
        } else {
          this._cache = null;
          this.dirty = false;
        }
      }

      if(this._cache){
        ctx.drawImage(this._cache, 0, 0, this._cache.width, this._cache.height,0, 0, this.width, this.height);
      }
    }else{
      this._render(ctx);
    }

    this.clipTo && ctx.restore();
    ctx.restore();
  }

};
