$(function() {
  var G = window.G = Gamicus()
                     .include('Input,Sprites,Scenes,Anim,Platformer,Editor,Home')
                     .setup('gamicus', { maximize: true });

  G.scene('start',new G.Scene(function(stage) {
    stage.add('home');
  }, { sort: true }));





  G.Enemy = G.Sprite.extend({
    init:function(props) {
      this._super(_(props).extend({
        sheet: 'blob',
        sprite: 'blob',
        rate: 1/15,
        type: 2,
        collisionMask: 5,
        health: 50,
        dead: false,
        speed: 100,
        direction: 'left'
      }));

      this.add('animation, 2d')
          .collisionPoints({
            top: [[ 25, 9]],
            left: [[ 14,32], [ 14,49]],
            bottom: [[ 32, 64 ]],
            right: [[ 42,32], [ 42,49]]
          });
      this.bind('animEnd.die_right',this,"destroyEnemy");
      this.bind('animEnd.die_left',this,"destroyEnemy");
      this.bind('damage',this,'damage');
      this.bind('hit.tile',this,'changeDirection');
      this.bind('hit.sprite',this,'hurtPlayer');
    },

    changeDirection: function(col) {
      if(col.direction == 'left') {
       this.p.direction = 'right';
      } else if(col.direction == 'right') {
        this.p.direction = 'left';
      }
    },

    hurtPlayer: function(col) {
      if (col.p.x < this.p.x) {
        col.p.x -= 10;
        col.damage(5);
      } else {
        col.p.x += 10;
        col.damage(5);
      }
    },

    damage: function(amount) {
      var p = this.p;
      p.health -= amount;
      if(p.health <= 0) {
        p.direction = "die_" + p.direction;
        p.vx = 0;
        p.speed = 0;
        p.dead = true;
      }
    },

    destroyEnemy: function() {
      this.destroy();
    },

    step: function(dt) {
      var p = this.p;
      if (p.dead == false) {
        if (p.direction == 'right') {
          this.play('run_right');
          p.vx = p.speed;
        } else if (p.direction == 'left') {
          this.play('run_left');
          p.vx = -p.speed;
        }
      } else {
        p.vx = 0;
        this.unbind('damage');
        this.unbind('hit.tile');
        this.unbind('hit.sprite');
        this.play(p.direction);
      }
      this._super(dt);
    }
  });
                     
  G.Player = G.Sprite.extend({
    init:function(props) {
      this._super(_(props).extend({
        sheet: 'man',
        sprite: 'player',
        rate: 1/15,
        speed: 250,
        standing: 3,
        type: 4,
        health: 100,
        collisionMask: 1,
        direction: 'right'
      }));

     this.add('animation, 2d')
          .collisionPoints({
            top: [[ 25, 9]],
            left: [[ 14,32], [ 14,49]], 
            bottom: [[ 32, 64 ]],
            right: [[ 42,32], [ 42,49]]
          });
          
            
          /*.collisionPoints({
            top: [[ 20, 3]],
            left: [[ 5,15], [ 5,40]], 
            bottom: [[ 20,51 ]],
            right: [[ 30,15], [ 30,40]]*/

      this.bind('animEnd.fire_right',this,"launchBullet");
      this.bind('animEnd.fire_left',this,"launchBullet");
      this.bind('hit.tile',this,'tile');
      G.input.bind('fire',this,"fire");
      G.input.bind('action',this,"jump");
    },

    fire: function() {
      this.play('fire_' + this.p.direction,2);
    },

    damage: function(amount) {
      this.p.health -= amount;
      if(this.p.health < 0) {
        G.stageScene("level",0,G.PlatformStage);
      }
    },
    launchBullet: function() {
      var p = this.p,
          vx = p.direction == 'right' ? 500 : -500,
          x = p.direction == 'right' ? (p.x + p.w) : p.x;
      this.parent.insert(new G.Bullet({ x: x, y: p.y + p.h/2, vx: vx }));
    },

    jump: function() {
      if(this.p.standing >= 0) {
        this.p.vy = -this.p.speed * 1.4;
        this.p.standing = -1;
      }
    },

    tile: function(collision) {
      if(collision.direction == 'bottom') {
        this.p.standing = 5;
      }
    },

    step: function(dt) {
      var p = this.p;
      if(p.animation == 'fire_right' || p.animation == 'fire_left') {
        if(this.p.standing > 0) {
          this.p.vx = 0;
        }
      } else {
        if(this.p.standing < 0) {
          if(p.vx) {
            p.direction = p.vx > 0 ? 'right' : 'left';
          }
          this.play('fall_' + p.direction,1);
        }
        if(G.inputs['right']) {
          this.play('run_right');
          p.vx = p.speed;
          p.direction = 'right';
        } else if(G.inputs['left']) {
          this.play('run_left');
          p.vx = -p.speed;
          p.direction = 'left';
        } else {
          p.vx = 0;
          this.play('stand_' + p.direction);
        }
        this.p.standing--;
      }
      this._super(dt);
    }
  });

  /*G.Bullet = G.Sprite.extend({
    init:function(props) {
      this._super(_(props).extend({
        sheet: 'arrow',
        sprite: 'arrow',
        rate: 1/15,
        speed: 250,
        collisionMask: 3,
        gravity:0
      }));

     this.add('animation, 2d')
          .collisionPoints();*/
          
            
          /*.collisionPoints({
            top: [[ 20, 3]],
            left: [[ 5,15], [ 5,40]], 
            bottom: [[ 20,51 ]],
            right: [[ 30,15], [ 30,40]]*/
 
     /* this.bind('hit.tile',this,'remove');
      this.bind('hit.sprite',this,'damage');
    },
    
    remove: function() {
      this.destroy();
    },

    damage: function(obj) {
      obj.trigger('damage',10);
      this.destroy();
    },
    
    step: function(dt) {
      var p = this.p;
      if(p.animation == 'fire_arrow') {
        this.play('fire_arrow');
        p.vx = p.speed;
      }
      this._super(dt);
    }
  });*/
  

  G.Bullet = G.Sprite.extend({
    init: function(props) {
      this._super(_(props).extend({ w:20, h:2, 
                                    gravity:.2, collisionMask:3  }));
      this.add('2d');
      this.collisionPoints();
      this.bind('hit.tile',this,'remove');
      this.bind('hit.sprite',this,'damage');
    },

    remove: function() {
      this.destroy();
    },

    damage: function(obj) {
      obj.trigger('damage',10);
      this.destroy();
    },

    draw: function(ctx) {
      var p = this.p; 
      ctx.fillStyle = "#FFF";
      ctx.fillRect(p.x,p.y,p.w,p.h);
    }
  });

  var match = window.location.search.match(/level=([^\&]+)/),
      levelFile = 'level.json';
  if(match) {
    levelFile = match[1] + '.json';
  }

  G.scene('level',new G.Scene(function(stage) {
    stage.insert(new G.Repeater({ asset: 'redMountainsBackGround.png', 
                                  speedX: 0.5, repeatY:false, y:-255, x:0, z:0 }));
    stage.insert(new G.Repeater({ asset: 'redMountainsMidGround.png', 
                                  speedX: 0.75, repeatY:false, y:-55, x:0, z:0 }));
    stage.insert(new G.Repeater({ asset: 'redMountainsForeGround.png', 
                                  speedX: 1, repeatY:false, y:-5, x:0, z:0 }));
    var tiles = stage.insert(new G.TileLayer({ sheet: 'block',
                                               x: -100, y: -100,
                                               tileW: 32,
                                               tileH: 32,
                                               dataAsset: levelFile,
                                               z:1 }));
    stage.collisionLayer(tiles);
    var player = stage.insert(new G.Player({ x:100, y:0, z:3, sheet: 'man' }));

    stage.insert(new G.Enemy({ x:400, y:0, z:3 }));
    stage.insert(new G.Enemy({ x:600, y:0, z:3 }));
    //stage.insert(new G.Enemy({ x:1200, y:100, z:3 }));
    //stage.insert(new G.Enemy({ x:1600, y:0, z:3 }));

    stage.add('viewport');
    stage.follow(player);

  }, { sort: true }));

  G.scene('levelEditor',new G.Scene(function(stage) {
    stage.insert(new G.Repeater({ asset: 'redMountainsBackGround.png',
      speedX: 0.5, repeatY:false, y:-255, x:0, z:0 }));
    stage.insert(new G.Repeater({ asset: 'redMountainsMidGround.png',
      speedX: 0.75, repeatY:false, y:-55, x:0, z:0 }));
    stage.insert(new G.Repeater({ asset: 'redMountainsForeGround.png',
      speedX: 1, repeatY:false, y:-5, x:0, z:0 }));
    var tiles = stage.insert(new G.TileLayer({ sheet: 'block',
      x: -100, y: -100,
      tileW: 32,
      tileH: 32,
      dataAsset: levelFile,
      z:1 }));
    stage.collisionLayer(tiles);
    var player = stage.insert(new G.Player({ x:100, y:0, z:3, sheet: 'man' }));

    stage.insert(new G.Enemy({ x:400, y:0, z:3 }));
    stage.insert(new G.Enemy({ x:600, y:0, z:3 }));
    //stage.insert(new G.Enemy({ x:1200, y:100, z:3 }));
    //stage.insert(new G.Enemy({ x:1600, y:0, z:3 }));

    stage.add('viewport');
    stage.follow(player);
    stage.add('editor');
    stage.editor.setFile(levelFile);
    stage.bind('reset',function() {
      G.stageScene("levelEditor",0,G.PlatformStage);
    });

  }, { sort: true }));


  G.load(['sprites_newNew.png','sprites.json',
          'redMountainsBackGround.png','redMountainsForeGround.png','redMountainsMidGround.png',levelFile],function() {
    G.compileSheets('sprites_newNew.png','sprites.json');

    G.animations('player', {
      run_right: { frames: _.range(2,15,1), rate: 1/15}, 
      run_left: { frames: _.range(29,16,-1), next: 'stand_left', rate:1/15 },
      fire_right: { frames: _.range(86,89,1), next: 'stand_right', rate: 1/30 },
      fire_left: { frames: _.range(95,91,-1), next: 'stand_left', rate: 1/30 },
      stand_right: { frames: [0], rate: 1/5 },
      stand_left: { frames: [1], rate: 1/5 },
      fall_right: { frames: [65], loop: false },
      fall_left: { frames: [66], loop: false }
    });
    
    /*
    G.animations('arrow', {
      fire_arrow: { frames: [0], rate: 1/5 },
      fireAxe1: { frames: _.range(1,8,1), rate:1/15 }
    });
    */

    G.animations('blob', {
      run_right: { frames: _.range(2,14,1), rate: 1/5 },
      run_left: { frames: _.range(27,15,-1), rate: 1/5 },
      die_right: { frames: _.range(37,42,1), next: 'dead_right', rate: 1/5 },
      die_left: { frames: _.range(47,43,-1), next: 'dead_left', rate: 1/5 },
      dead_right: { frames: [42], loop: false },
      dead_left: { frames: [47], loop: false }
    });


    //Set scene to display
    G.stageScene("start",0,G.PlatformStage);

  });
});

