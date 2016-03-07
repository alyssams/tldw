// This code has been modified!!
// If you are looking for a fully responsive youtube playlist that randomizes
// on load of page and has a shuffle next button, grab it. if not, find a 
//fresh copy @ http://www.seanmccambridge.com/tubular
// <3, alyssa

/* jQuery tubular plugin
|* by Sean McCambridge
|* http://www.seanmccambridge.com/tubular
|* version: 1.0
|* updated: October 1, 2012
|* since 2010
|* licensed under the MIT License
|* Enjoy.
|* 
|* Thanks,
|* Sean */

;(function ($, window) {

    // test for feature support and return if failure

    // kill for mobile devices
    var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    
    // defaults
    var defaults = {
        ratio: 16/9, 
        // videoId: 'ZCAnLxRvNNc', 
        mute: true,
        repeat: true,
        width: $(window).width(),
        wrapperZIndex: 99,
        playButtonClass: 'tubular-play',
        pauseButtonClass: 'tubular-pause',
        muteButtonClass: 'tubular-mute',
        volumeUpClass: 'tubular-volume-up',
        volumeDownClass: 'tubular-volume-down',
        increaseVolumeBy: 10,
        start: 0,
        minimumSupportedWidth: 600
    };

    // methods

    var getRandom = function(min, max) {
      return Math.random() * (max - min) + min;
    };
    
    var tubular = function(node, options) { // should be called on the wrapper div
        var options = $.extend({}, defaults, options),
            $body = $('body') // cache body node
            $node = $(node); // cache wrapper node

        // build container
        var tubularContainer = '<div id="tubular-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"><div id="tubular-player" style="position: absolute"></div></div><div id="tubular-shield" style="width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;"></div>';

        // set up css prereq's, inject tubular container and set up wrapper defaults
        $('html,body').css({'width': '100%', 'height': '100%'});
        $body.prepend(tubularContainer);
        $node.css({position: 'relative', 'z-index': options.wrapperZIndex});

        // set up iframe player, use global scope so YT api can talk
        window.player;


        window.onYouTubeIframeAPIReady = function() {
            player = new YT.Player('tubular-player', {
                width: options.width,
                height: Math.ceil(options.width / options.ratio),
                // videoId: options.videoId,
                playerVars: {
                    index:parseInt(0),
                    list: 'PL3jCZufBWVLQ1u5WkFOo_oODUvqnaPb7Q',
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    wmode: 'transparent'
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        window.onPlayerReady = function(e) {
            resize();
            var num = parseInt(getRandom(0, 49));            
            setTimeout( function() { 
                e.target.playVideoAt(num);
                e.target.setShuffle(true);
                e.target.seekTo(options.start); 
            }, 200);
            // e.target.playVideo();
        }
    

        window.onPlayerStateChange = function(state) {
            if (state.data === 0 && options.repeat) { 
                player.seekTo(options.start); 
            }
        }

        // resize handler updates width, height and offset of player after resize/init
        var resize = function() {
            var width = $(window).width(),
                pWidth, 
                height = $(window).height(),
                pHeight, 
                $tubularPlayer = $('#tubular-player');


            if (width / options.ratio < height) { // if new video height < window height (gap underneath)
                pWidth = Math.ceil(height * options.ratio); // get new player width
                $tubularPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); // player width is greater, offset left; reset top
            } else { // new video width < window width (gap to right)
                pHeight = Math.ceil(width / options.ratio); // get new player height
                $tubularPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); // player height is greater, offset top; reset left
            }

        }

        // events
        $(window).on('resize.tubular', function() {
            resize();
        })
        // $('body').on('click','.' + options.playButtonClass, function(e) { // play button
        //     e.preventDefault();
        //     player.playVideo();
        // });
        // $('body').on('click', '.' + options.pauseButtonClass, function(e) { // pause button
        //     e.preventDefault();
        //     player.pauseVideo();
        // })
        // $('body').on('click', '.' + options.muteButtonClass, function(e) { // mute button
        //     e.preventDefault();
        //     (player.isMuted()) ? player.unMute() : player.mute();
        // })
    }

    // load yt iframe js api

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // create plugin

    $.fn.tubular = function (options) {
        return this.each(function () {
            if (!$.data(this, 'tubular_instantiated')) { // let's only run one
                $.data(this, 'tubular_instantiated', 
                tubular(this, options));
            }
        });
    }

    $('#shufflePlay').click(function() {
        player.setShuffle(true);
        player.nextVideo();
    });

})(jQuery, window);