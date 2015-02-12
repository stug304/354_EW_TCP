/**
 * Created by stuartg on 2/8/15.
 */
Gamicus.HUD = function(G) {
    G.register('hud',{

        added: function() {
            var stage = this.entity;
            stage.pause();
            //stage.bind('health',this,'update');

            $("#hud-startBtn").remove();
            $("#hud-healthBarBg").remove();

            this.controls = $("<div id='hud-healthBarBg'>")
                .appendTo(G.wrapper)
                .css({
                    position: 'absolute',
                    width: '100%',
                    height: 20,
                    top: 0,
                    left: 0,
                    backgroundColor: "#000",
                    border: "1px solid #999"
                });

            this.controls = $("<div id='hud-healthBar'>")
                .insertAfter("#hud-healthBarBg")
                .html("Health")
                .css({
                    width: '100%',
                    height: 20,
                    position: 'absolute',
                    top: 0,
                    left: 1,
                    backgroundColor: "#f00",
                    fontSize: '1.25em',
                    fontFamily: 'Wendy One',
                    lineHeight: '1em',
                    color: '#f7d811',
                    textShadow:'0px 0px 0 rgb(-117,-148,-347),1px 1px 0 rgb(-245,-276,-475), 2px 2px 0 rgb(-372,-403,-602),3px 3px 2px rgba(0,0,0,1),3px 3px 1px rgba(0,0,0,0.5),0px 0px 2px rgba(0,0,0,.2)'
                });

            this.controls = $("<div id='hud-startBtn'>")
                .appendTo(G.wrapper)
                .css({
                    position: 'absolute',
                    padding: '0px',
                    margin: '0px',
                    top: G.el.height()/2,
                    left: G.el.width()/2,
                    textAlign: "center"
                });

            _.bindAll(this);

            this.buttons = {
              play: this.button("Start", this.play)
            };



            G.el.on('touchstart mousedown',this.touch);
            G.el.on('touchmove mousemove',this.drag);
            G.el.on('touchend mouseup',this.release);
        },

        button: function(text,callback) {
            var elem;
            if (text=="Start"){
                elem = $("<div>")
                    .appendTo("#hud-startBtn")
                    .css({
                        float:'left',
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
                elem.on('mousedown touchstart', callback);
            }
            return elem;
        },

        play: function(e) {
            this.entity.unpause();
            G.activeStage = this.entity;

            G.el.off('touchstart mousedown',this.touch);
            G.el.off('touchmove mousemove',this.drag);
            G.el.off('touchend mouseup',this.release);

            G.playing = true;
            G.controls();

            e.preventDefault();
            $("#hud-startBtn").fadeOut(600);
        }
    });
};
