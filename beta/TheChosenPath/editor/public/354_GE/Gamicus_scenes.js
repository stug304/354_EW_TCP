Gamicus.Scenes = function(G) {

  G.scenes = {};
  G.stages = [];

  G.Scene = Class.extend({
    init: function(sceneFunc,opts) {
      this.opts = opts || {};
      this.sceneFunc = sceneFunc;
    }
  });

  // Set up or return a new scene
  G.scene = function(name,sceneObj) {
    if(!sceneObj) {
      return G.scenes[name];
    } else {
      G.scenes[name] = sceneObj;
      return sceneObj;
    }
  };


  G.overlap = function(o1,o2) {
    return !((o1.p.y+o1.p.h-1<o2.p.y) || (o1.p.y>o2.p.y+o2.p.h-1) ||
             (o1.p.x+o1.p.w-1<o2.p.x) || (o1.p.x>o2.p.x+o2.p.w-1));
  };

  G.Stage = G.GameObject.extend({
    // Should know whether or not the stage is paused
    defaults: {
      sort: false
    },

    init: function(scene) {
      this.scene = scene;
      this.items = [];
      this.index = {};
      this.removeList = [];
      if(scene)  { 
        this.options = _(this.defaults).clone();
        _(this.options).extend(scene.opts);
        scene.sceneFunc(this);
      }
      if(this.options.sort && !_.isFunction(this.options.sort)) {
          this.options.sort = function(a,b) { return a.p.z - b.p.z; };
      }
    },

    each: function(callback) {
      for(var i=0,len=this.items.length;i<len;i++) {
        callback.call(this.items[i],arguments[1],arguments[2]);
      }
    },

    eachInvoke: function(funcName) {
      for(var i=0,len=this.items.length;i<len;i++) {              
        this.items[i][funcName].call(
          this.items[i],arguments[1],arguments[2]
        );
      }
    },

    detect: function(func) {
      for(var i = 0,val=null, len=this.items.length; i < len; i++) {
        if(func.call(this.items[i],arguments[1],arguments[2])) {
          return this.items[i];
        }
      }
      return false;
    },

    insert: function(itm) {
      this.items.push(itm);
      itm.parent = this;
      if(itm.p) {
        this.index[itm.p.id] = itm;
      }
      this.trigger('inserted',itm);
      itm.trigger('inserted',this);
      return itm;
    },

    remove: function(itm) {
      this.removeList.push(itm);
    },

    forceRemove: function(itm) {
      var idx = _(this.items).indexOf(itm);
      if(idx != -1) { 
        this.items.splice(idx,1);
        if(itm.destroy) itm.destroy();
        if(itm.p.id) {
          delete this.index[itm.p.id];
        }
        this.trigger('removed',itm);
      }
    },

    pause: function() {
      this.paused = true;
    },

    unpause: function() {
      this.paused = false;
    },

    _hitTest: function(obj,type) {
      if(obj != this) {
        var col = (!type || this.p.type & type) && G.overlap(obj,this);
        return col ? this : false;
      }
    },

    collide: function(obj,type) {
      return this.detect(this._hitTest,obj,type);
    },

    step:function(dt) {
      if(this.paused) { return false; }

      this.trigger("prestep",dt);
      this.eachInvoke("step",dt);
      this.trigger("step",dt);

      if(this.removeList.length > 0) {
        for(var i=0,len=this.removeList.length;i<len;i++) {
          this.forceRemove(this.removeList[i]);
        }
        this.removeList.length = 0;
      }
    },

    draw: function(ctx) {
      if(this.options.sort) {
        this.items.sort(this.options.sort);
      }
      this.trigger("predraw",ctx);
      this.eachInvoke("draw",ctx);
      this.trigger("draw",ctx);
    }
  });

  G.activeStage = 0;

  G.stage = function(num) {
    // Use activeStage is num is undefined
    num = (num === void 0) ? G.activeStage : num;
    return G.stages[num];
  };

  G.stageScene = function(scene,num,stageClass) {
    stageClass = stageClass || G.Stage;
    if(_(scene).isString()) {
      scene = G.scene(scene);
    }

    num = num || 0;

    if(G.stages[num]) {
      G.stages[num].destroy();
    }

    G.stages[num] = new stageClass(scene);

    if(!G.loop) {
      G.gameLoop(G.stageGameLoop);
    }
  };

  G.stageGameLoop = function(dt) {
    if(G.ctx) { G.clear(); }

    for(var i =0,len=G.stages.length;i<len;i++) {
      G.activeStage = i;
      var stage = G.stage();
      if(stage) {
        stage.step(dt);
        stage.draw(G.ctx);
      }
    }

    G.activeStage = 0;

    if(G.input && G.ctx) { G.input.drawCanvas(G.ctx); }
  };

  G.clearStage = function(num) {
    if(G.stages[num]) { 
      G.stages[num].destroy(); 
      G.stages[num] = null;
    }
  };

  G.clearStages = function() {
    for(var i=0,len=G.stages.length;i<len;i++) {
      if(G.stages[i]) { G.stages[i].destroy(); }
    }
    G.stages.length = 0;
  };


};

