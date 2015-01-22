Gamicus.Home = function(G) {
    G.register('home',{

        added: function() {
            var stage = this.entity;
            stage.pause();
            $("#gamicus-home").remove();
            this.controls = $("<div id='gamicus-home'>")
                .appendTo(G.wrapper)
                .html('<br/>')
                .css({position:'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 200,
                    margin: '5px',
                    background: 'url(images/bg-home.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    width: G.el.width(),
                    height: G.el.height()
                });
            this.controls = $("<div id='home-menu'>")
                .appendTo("#gamicus-home")
                .css({position:"absolute",
                    padding: '0px',
                    margin: '0px',
                    top: G.el.height()*0.796875, //*0.80625,
                    left: G.el.width()/2,
                    textAlign: "center"
                });
            _.bindAll(this);

            this.buttons = {
                play: this.button("play",this.play),
                edit: this.button("edit",this.edit)
            };

            G.el.on('touchstart mousedown',this.touch);
            G.el.on('touchmove mousemove',this.drag);
            G.el.on('touchend mouseup',this.release);
        },

        button: function(text,callback) {
            var elem;
            if (text=="play"){
                elem = $("<div>")
                    .appendTo("#home-menu")
                    .css({float:'left',
                        margin: "0px 5px",
                        padding:"10px 5px",
                        background: 'url(images/btnPlay.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgoundOrigin: 'content-box',
                        width:74,
                        height:74,
                        maxWidth:74,
                        textAlign:'center',
                        cursor:'pointer'})
                    .appendTo(this.controls);

                elem.on('mousedown touchstart',callback);
            } else if (text=="edit"){
                elem = $("<div>")
                    .appendTo("#home-menu")
                    .css({float:'left',
                        margin: "0px 5px",
                        padding:"10px 5px",
                        background: 'url(images/btnPaint.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgoundOrigin: 'content-box',
                        width:74,
                        height:74,
                        maxWidth:74,
                        textAlign:'center',
                        cursor:'pointer'})
                    .appendTo(this.controls);

                elem.on('mousedown touchstart',callback);
            }
            return elem;
        },

        play: function(e) {
            G.stageScene("level",0,G.PlatformStage);
            this.entity.pause();

            G.el.off('touchstart mousedown',this.touch);
            G.el.off('touchmove mousemove',this.drag);
            G.el.off('touchend mouseup',this.release);

            G.playing = true;
            G.controls();

            e.preventDefault();
            $("#gamicus-home").fadeOut(600);
        },

        edit: function(e) {
            G.stageScene("levelEditor",0, G.PlatformStage);
            $("#gamicus-home").fadeOut(600);
        }

    });
};

