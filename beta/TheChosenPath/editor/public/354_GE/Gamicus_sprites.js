Gamicus.Sprites = function(G) {
 
  // Create a new sprite sheet
  // Options:
  //  tilew - tile width
  //  tileh - tile height
  //  w     - width of the sprite block
  //  h     - height of the sprite block
  //  sx    - start x
  //  sy    - start y
  //  cols  - number of columns per row
  G.SpriteSheet = Class.extend({
    init: function(name, asset,options) {
      _.extend(this,{
        name: name,
        asset: asset,
        w: G.asset(asset).width,
        h: G.asset(asset).height,
        tilew: 64,
        tileh: 64,
        sx: 0,
        sy: 0
        },options);
      this.cols = this.cols || 
                  Math.floor(this.w / this.tilew);
    },

    fx: function(frame) {
      return (frame % this.cols) * this.tilew + this.sx;
    },

    fy: function(frame) {
      return Math.floor(frame / this.cols) * this.tileh + this.sy;
    },

    draw: function(ctx, x, y, frame) {
      if(!ctx) { ctx = G.ctx; }
      ctx.drawImage(G.asset(this.asset),
                    this.fx(frame),this.fy(frame),
                    this.tilew, this.tileh,
                    Math.floor(x),Math.floor(y),
                    this.tilew, this.tileh);

    }

  });


  G.sheets = {};
  G.sheet = function(name,asset,options) {
    if(asset) {
      G.sheets[name] = new G.SpriteSheet(name,asset,options);
      return G.sheets[name];
    } else {
      return G.sheets[name];
    }
  };

  G.compileSheets = function(imageAsset,spriteDataAsset) {
    var data = G.asset(spriteDataAsset);
    _(data).each(function(spriteData,name) {
      G.sheet(name,imageAsset,spriteData);
    });
  };


// Properties:
  //    x
  //    y
  //    z - sort order
  //    sheet or asset
  //    frame
  G.Sprite = G.GameObject.extend({
    init: function(props) {
      this.p = _({ 
        x: 0,
        y: 0,
        z: 0,
        frame: 0,
        type: 0
      }).extend(props||{});
      if((!this.p.w || !this.p.h)) {
        if(this.asset()) {
          this.p.w = this.p.w || this.asset().width;
          this.p.h = this.p.h || this.asset().height;
        } else if(this.sheet()) {
          this.p.w = this.p.w || this.sheet().tilew;
          this.p.h = this.p.h || this.sheet().tileh;
        }
      }
      this.p.id = this.p.id || _.uniqueId();
    },

    asset: function() {
      return G.asset(this.p.asset);
    },

    sheet: function() {
      return G.sheet(this.p.sheet);
    },

    draw: function(ctx) {
      if(!ctx) { ctx = G.ctx; }
      var p = this.p;
      if(p.sheet) {
        this.sheet().draw(ctx, p.x, p.y, p.frame);
      } else if(p.asset) {
        ctx.drawImage(G.asset(p.asset), 
        Math.floor(p.x), 
        Math.floor(p.y));
      }
      this.trigger('draw',ctx);
    },

    step: function(dt) {
      this.trigger('step',dt);
    }
  });

  G.MovingSprite = G.Sprite.extend({
    init: function(props) {
      this._super(_({
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0
        }).extend(props));
      },

      step: function(dt) {
        var p = this.p;

        p.vx += p.ax * dt;
        p.vy += p.ay * dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        this._super(dt);
      }
    });




  return G;
};

