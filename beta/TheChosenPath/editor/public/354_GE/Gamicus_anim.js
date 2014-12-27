Gamicus.Anim = function(G) {
  G._animations = {};
  G.animations = function(sprite,animations) {
    if(!G._animations[sprite]) G._animations[sprite] = {};
    _.extend(G._animations[sprite],animations);
  };

  G.animation = function(sprite,name) {
    return G._animations[sprite] && G._animations[sprite][name];
  };

  G.register('animation',{
    added: function() {
      var p = this.entity.p;
      p.animation = null;
      p.animationPriority = -1;
      p.animationFrame = 0;
      p.animationTime = 0;
      p.animationEnd = false;
      this.entity.bind("step",this,"step");
    },
    extend: {
      play: function(name,priority) {
        this.animation.play(name,priority);
      }
    },
    step: function(dt) {
      var entity = this.entity,
          p = entity.p;
      if(p.animation) {
        var anim = G.animation(p.sprite,p.animation),
            rate = anim.rate || p.rate,
            stepped = 0;
        p.animationTime += dt;
        if(p.animationChanged) {
          p.animationChanged = false;
        } else { 
          p.animationTime += dt;
          if(p.animationTime > rate) {
            stepped = Math.floor(p.animationTime / rate);
            p.animationTime -= stepped * rate;
            p.animationFrame += stepped;
          }
        }
        if(stepped > 0) {
          if(p.animationFrame >= anim.frames.length) {
            if(anim.loop === false || anim.next) {
              p.animationFrame = anim.frames.length - 1;
              entity.trigger('animEnd');
              entity.trigger('animEnd.' + p.animation);
              p.animation = null;
              p.animationPriority = -1;
              if(anim.trigger) {  
                entity.trigger(anim.trigger,anim.triggerData) 
              }
              if(anim.next) { this.play(anim.next,anim.nextPriority); }
              return;
            } else {
              entity.trigger('animLoop');
              entity.trigger('animLoop.' + p.animation);
              p.animationFrame = p.animationFrame % anim.frames.length;
            }
          }
          entity.trigger("animFrame");
        } else {
          p.animationEnd = true;
        }
        p.sheet = anim.sheet || p.sheet;
        p.frame = anim.frames[p.animationFrame];
      }
    },

    play: function(name,priority) {
      var entity = this.entity,
          p = entity.p;
      priority = priority || 0;
      if(name != p.animation && priority >= p.animationPriority) {
        p.animation = name;
        p.animationChanged = true;
        p.animationTime = 0;
        p.animationFrame = 0;
        p.animationPriority = priority;
        entity.trigger('anim');
        entity.trigger('anim.' + p.animation);
      }
    }
  
  });

  G.register('viewport',{
    added: function() {
      this.entity.bind('predraw',this,'predraw');
      this.entity.bind('draw',this,'postdraw');
      this.x = 0,
      this.y = 0;
      this.centerX = G.width/2;
      this.centerY = G.height/2;
      this.scale = 1;
    },

    extend: {
      follow: function(sprite) {
        this.unbind('step',this.viewport);
        this.viewport.following = sprite;
        this.bind('step',this.viewport,'follow');
        this.viewport.follow();
      },

      unfollow: function() {
        this.unbind('step',this.viewport);
      },

      centerOn: function(x,y) {
        this.viewport.centerOn(x,y);
      }
    },

    follow: function() {
      this.centerOn(this.following.p.x + this.following.p.w/2,
                    this.following.p.y + this.following.p.h/2);
    },

    centerOn: function(x,y) {
      this.centerX = x;
      this.centerY = y;
      this.x = this.centerX - G.width / 2 / this.scale;
      this.y = this.centerY - G.height / 2 / this.scale;
    },

    predraw: function() {
      G.ctx.save();
      G.ctx.translate(G.width/2,G.height/2);
      G.ctx.scale(this.scale,this.scale);
      G.ctx.translate(-this.centerX, -this.centerY);
    },

    postdraw: function() {
      G.ctx.restore();
    }
  });

  G.Repeater = G.Sprite.extend({
    init: function(props) {
      this._super(_(props).defaults({
        speedX: 1,
        speedY: 1,
        repeatY: true,
        repeatX: true
      }));
      this.p.repeatW = this.p.repeatW || this.p.w;
      this.p.repeatH = this.p.repeatH || this.p.h;
    },

    draw: function(ctx) {
      var p = this.p,
          asset = this.asset(),
          sheet = this.sheet(),
          scale = this.parent.viewport.scale,
          viewX = this.parent.viewport.x,
          viewY = this.parent.viewport.y,
          offsetX = p.x + viewX * this.p.speedX,
          offsetY = p.y + viewY * this.p.speedY,
          curX, curY, startX;
      if(p.repeatX) {
        curX = Math.floor(-offsetX % p.repeatW);
        if(curX > 0) { curX -= p.repeatW; }
      } else {
        curX = p.x - viewX;
      }
      if(p.repeatY) {
        curY = Math.floor(-offsetY % p.repeatH);
        if(curY > 0) { curY -= p.repeatH; }
      } else {
        curY = p.y - viewY;
      }
      startX = curX;
      while(curY < G.height / scale) {
        curX = startX;
        while(curX < G.width / scale) {
          if(sheet) {
            sheet.draw(ctx,curX + viewX, curY + viewY,p.frame);
          } else {
            ctx.drawImage(asset,curX + viewX, curY + viewY);
          }
          curX += p.repeatW;
          if(!p.repeatX) { break; }
        }
        curY += p.repeatH;
        if(!p.repeatY) { break; }
      }
    }
  });


};

