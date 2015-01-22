Gamicus.startScreen = function(G) {

    G.register('startScreen',{

        added: function() {
            var stage = this.entity;
            stage.pause();
            $("#gamicus-startScreen").remove();
            this.controls = $("<div id='gamicus-startScreen'>")
                .appendTo(G.wrapper)
                .css({position:"absolute",
                    top:25,
                    left:50,
                    backgroundColor: 'black',
                    width:200,
                    height:200,
                    zIndex: 100});
            _.bindAll(this);

            this.buttons = {
                play: this.button("play",this.play),
                edit: this.button("edit",this.edit)
            };

            //this.select('move');
            //this.activeTile = 1;

            G.el.on('touchstart mousedown',this.touch);
            G.el.on('touchend mouseup',this.release);
        },

        button: function(text,callback) {
            var elem;
            if (text == "edit"){
                elem = $("<div>")
                    .html('<br/>')
                    .css({float:'left',
                        margin: "10px 5px",
                        padding:"15px 5px",
                        backgroundColor: 'red',
                        width:100,
                        height:50,
                        textAlign:'center',
                        cursor:'pointer'})
                    .appendTo(this.controls);

                elem.on('mousedown touchstart',callback);
            } else if (text=="play") {
                elem = $("<div>")
                    .html('<br/>')
                    .css({float: 'left',
                        margin: "10px 5px",
                        padding: "15px 5px",
                        backgroundColor: 'red',
                        width: 100,
                        height: 50,
                        textAlign: 'center',
                        cursor: 'pointer'
                    })
                    .appendTo(this.controls);

                elem.on('mousedown touchstart', callback);
            }
            return elem;
        },

        select: function(button) {
            if(this.selected) {
                //this.buttons[this.selected].css('backgroundColor','#DDD');
            }
            this.selected = button;
            if(this.buttons[this.selected]) {
                //this.buttons[this.selected].css('backgroundColor','#FFF');
            }
        },

        play: function(e) {
            if(this.playing) {
                this.buttons['play'].text('Play');
                //G.input.disableTouchControls();
                //this.entity.trigger('reset');
                this.select();
            } else {
                G.el.off('touchstart mousedown',this.touch);
                G.el.off('touchend mouseup',this.release);
                this.select('play');
                /*this.buttons['play'].text('reset');
                this.buttons['play'].html('<br/>')
                this.buttons['play'].css({float:'left',
                    margin: "10px 5px",
                    padding:"15px 5px",
                    background: 'url(images/btnReset.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgoundOrigin: 'content-box',
                    width:32,
                    maxWidth:32,
                    textAlign:'center',
                    cursor:'pointer'});*/
                //this.playing = true;
                //this.entity.unpause();
                G.controls();
            }
            e.preventDefault();
        },

        touch: function(e) {
            var touch = e.originalEvent.changedTouches ?
                    e.originalEvent.changedTouches[0] : e,
                stage = this.entity;
            this.start = { pageX: touch.pageX, pageY: touch.pageY };
            this.viewportX = stage.viewport.centerX;
            this.viewportY = stage.viewport.centerY;
            this.tool(touch);
            e.preventDefault();
        },

        release: function(e) {
            this.start= null;
        },

        tool: function(touch) {
            var stage = this.entity,
                viewport = stage.viewport;
            switch(this.selected) {
                /*case 'move':
                    stage.centerOn(this.viewportX +
                        (this.start.pageX - touch.pageX)
                        / viewport.scale,
                        this.viewportY +
                        (this.start.pageY - touch.pageY)
                        / viewport.scale);
                    break;
                case 'paint':
                    var tile = this.tilePos(touch.pageX, touch.pageY);
                    stage.collision.setTile(tile.x,tile.y,this.activeTile);
                    break;
                case 'erase':
                    var tile = this.tilePos(touch.pageX, touch.pageY);
                    stage.collision.setTile(tile.x,tile.y,0);
                    break;*/
            }
        }
    });
};

