/**
 * Created by stuartg on 2/7/15.
 */
Gamicus.HealthBar = function(G) {
    G.register('healthbar', {
        added: function() {
            this.entity.bind('hbupdate',this,'update');
            this.bg = $("<div>")
                .appendTo(G.el)
                .css({
                    width: "100%",
                    hieght: 5,
                    position: "absolute",
                    bottom: -6,
                    left: 0,
                    backgroundColor: "#000",
                    border: "1px solid #999"
                });

            this.bar = $("<div>")
                .appendTo(G.el)
                .css({
                    width: "100%",
                    height: 5,
                    position: "aboslute",
                    bottom: -5,
                    left: 1,
                    backgroundColor: "#F00"
                });
        },

        large: function() {
            this.bg.css({
                height: 20,
                bottom: -1
            }).show();
            this.bar.css({
                height: 20,
                bottom: 0
            }).show();
            return this;
        },

        update: function(sprite) {
            this.bar.show();
            this.bg.show();
            var p = sprite.p;
            var width = Math.round(p.health / p.maxHealth * 100);
            this.bar.css("width", width + "%");
        }
    });
};