// add any scripting here
console.log("main js running");

var ww = $(window).width(),
    wh = $(window).height(),
    allplaying = true;

function onYouTubeIframeAPIReady() {

    console.log("youtube api ready");

    _(videos).each(function(el, ix) {

        el.containertag = "video" + ix;

        var sz = _.random(200, 600);

        console.log("ww: " + ww + " wh: " + wh + " sz: " + sz);

        var vidwrap = $('<div>', {
            "class": "videobox",
            id: el.containertag
        }).css({
            "left": _.random(ww-sz) + "px",
            "top": _.random(wh-sz) + "px"
        });



        $(".videowrapper").append(vidwrap);

        el.id = idfromurl(el.url);

        el.player = new YT.Player(el.containertag, {
            height: sz,
            width: sz,
            videoId: el.id,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });


        el.playfrom = function(loopstart) {
            el.player.seekTo(el.start);
            el.player.playVideo();
        };

        // el.loopcheck = function (loopend) {
        //     var ctime = el.player.getCurrentTime();
        //     if (ctime >= loopend) el.playfrom(el.start);
        // };

        console.log(el);

    });
}

function idfromurl(url) {
    return url.substr(url.search(/v\=.+/)+2);
}

function onPlayerReady(event) {
    console.log("player is ready: ");

    var vid_id = idfromurl(event.target.getVideoUrl());
    var thevideo = _(videos).findWhere({id: vid_id});
    console.log(thevideo);

    var looptime = (thevideo.end-thevideo.start) * 1000;

    thevideo.playfrom(thevideo.start);
    thevideo.loop = window.setInterval(thevideo.playfrom, looptime, thevideo.start);
}

function onPlayerStateChange(event) {
    var v = event.target;

    if (event.data === 1) {
        var q = event.target.getAvailableQualityLevels();
        if (_(q).contains("tiny") === true) {
            // console.log("has tiny");
            event.target.setPlaybackQuality("tiny");
        }
        else {
            console.log("no tiny size available. sizes include:");
            console.log(q);
            }
    }

}


$(window).keydown(function(event) {
    // console.log(event);
    if (event.key === " ") {

        if (allplaying === true) {
            console.log("== stopping ==");
            _(videos).each(function(v, ix) {
                window.clearInterval(v.loop);
                v.player.pauseVideo();
            });
        }
        else {
            console.log("== playing ==");
            _(videos).each(function(v, ix) {
                var looptime = (v.end-v.start) * 1000;
                v.playfrom(v.start);
                v.loop = window.setInterval(v.playfrom, looptime, v.start);
            });
        }
        allplaying = !allplaying;

    }
});
