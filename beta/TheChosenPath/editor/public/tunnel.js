/**
 * Created by stuartg on 2/11/15.
 */
var M = Math;
var sin = M.sin;
var cos = M.cos;

var d = document;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
d.body.style.margin = 0;
d.body.style.overflow = "hidden";
var width = canvas.width = innerWidth;
var height = canvas.height = innerHeight;

var left = -width/2;
var ttop = -height/2;

ctx.translate(-left,-ttop);

var scale = height/4;

// inefficient, I know, but hey we have the bytes :-)
var text =  ["1111   111",
    "   1  1",
    "   1   11",
    "   1     1",
    "1  1     1",
    " 11   111",
    0,
    "  1   1  1",
    " 11   1 1",
    "  1   11",
    "  1   11",
    "  1   1 1",
    " 111  1  1"];
var textscroll = -20;
var textoffset = 3;
var rings = 32;
var ringsize = 30;

var zmax = 3;
var zstep = 2*zmax / rings;
var tstep = 2*M.PI/ringsize;

var zshift = zstep;

function rgb(r,g,b) { return "rgb("+ ~~r +","+ ~~g +","+ ~~b +")" }

setInterval(function() {

    ctx.fillStyle = "black";
    ctx.fillRect(left,ttop,width,height);
    var date = +new Date;

    zshift-=zstep/3;
    if (zshift < 0)
    {
        zshift += zstep;
        textscroll++;
    };

    var ringb = 0;

    var zr=rings-1;
    while ( zr--)
    {
        var z = zr * zstep + zshift;

        var color = 200-200/(zmax+zshift) * z;
        var color2 = color/2;

        ctx.strokeStyle = rgb(color2,color2,color2)

        var posx = sin(z+date/1700) * 70;
        var posy = cos(z+date/1100) * 70;

        var ringf = []
        for (var r=0 ; r<ringsize*4 ; r+=4)
        {
            var column = r/4;
            var t = column*tstep + M.PI + sin(date/3700); // includes roll

            var multiplier = scale / z;
            ringf[r] = posx + cos(t) * multiplier;
            ringf[r+1] = posy + sin(t) * multiplier;
            ringf[r+2] = posx + cos(t+tstep) * multiplier;
            ringf[r+3] = posy + sin(t+tstep) * multiplier;

            var textindex = (textscroll + zr) % (40);
            var textcolor1 = text[textindex] ? text[textindex][column-textoffset] : 0;

            var dark = color/4;

            ctx.fillStyle= rgb(
                +textcolor1                                 ? M.max(150 +~~(105*sin(date/100)), dark) : color2/4,
                column % 16 == 0 && (zr + textscroll) % 12  ? 255 : dark,
                dark);

            if (ringb)
            {
                ctx.beginPath();
                ctx.moveTo(ringf[r], ringf[r+1]);
                ctx.lineTo(ringf[r+2], ringf[r+3]);
                ctx.lineTo(ringb[r+2], ringb[r+3]);
                ctx.lineTo(ringb[r], ringb[r+1]);
                ctx.fill();
                ctx.stroke();
            }
        }
        ringb = ringf;
    }
}, 50);