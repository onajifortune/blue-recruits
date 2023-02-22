jQuery(function($) {
    var $galleries =  $('.dvg-gallery-container');
    $.each($galleries, function(index, gallery) {
        var $gallery = $(gallery);
        if ( $gallery.hasClass('dvg-plays-inline')) {
            dvg_create_inline_players( $gallery, index );
        } else {
            dvg_create_lightbox( $gallery );
        }        
        dvg_filter( $gallery );
    });

    $('.dvg-lazy').lazyload();

    /**
     * Creates the video gallery lightbox
     */
    function dvg_create_lightbox( $gallery ) {
        $gallery.magnificPopup({
            delegate: 'a',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<div id="dvg-lightbox-player"></div>'+
                        '<div class="mfp-title"></div>'+
                        '</div>'
            },
            callbacks : {
                open: function() {
                    var $module = $(this.ev[0]).parents('.dvg_divi_video_gallery'),
                        classes = $module && $module.length ? $module[0].className.split(' ') : [];
                    classes.forEach(c => {
                        if ( c.match(/^dvg_divi_video_gallery_\d+$/g) ) {
                            $(this.bgOverlay).addClass('mfp-dvg-video-gallery ' + c);
                            $(this.wrap).addClass('mfp-dvg-video-gallery ' + c);
                        }
                    });
                    setTimeout(function() {
                        $('.mfp-iframe-holder').css('opacity', '1');
                    }, 1000);
                    
                },
                markupParse : function(template, values, item) {
                    if ( this.ev.attr('data-lightbox') == 'title_subtitle' ) {
                        values.title = "<span class='dvg-mfp-title'>" + item.el.attr('data-title') + "</span><span class='dvg-mfp-subtitle'>" + item.el.attr('data-subtitle') + "</span>";
                    } else if ( this.ev.attr('data-lightbox') == 'title' ) {
                        values.title = "<span class='dvg-mfp-title'>" + item.el.attr('data-title') + "</span>";
                    }
                },
                change: function() {
                    var info = dvg_get_iframe_src(this.currItem.src);
                    dvg_create_lightbox_player( info );                    
                },
                close: function() {
                }
            }
        });
    }

    /**
     * Creates de lightbox player
     */
    function dvg_create_lightbox_player( info ) {
        //Same method for vimeo + youtube
        if ( dvg_lightbox_player )
            dvg_lightbox_player.destroy();
        setTimeout( function() {
            if ( info.type == 'youtube' ) {
                dvg_create_lightbox_youtube_player(info);
            } else if ( info.type == 'vimeo' ) {
                dvg_create_lightbox_vimeo_player(info);
            } else {
                dvg_create_lightbox_mp4_player(info);
            }
        }, 300);
    }

    function dvg_create_lightbox_mp4_player( info ) {
        dvg_create_mp4_player( info.src, 'dvg-mp4-lightbox-player', 'dvg-lightbox-player', dvg_lightbox_player_next);
    }

    function dvg_create_mp4_player( src, className, container, endedCallback ) {
        var mp4_player = document.createElement("video");
        mp4_player.className = className;
        mp4_player.controls = true;
        mp4_player.addEventListener( 'loadeddata', function() {
            if ( mp4_player.readyState >= 2 ) {
                mp4_player.play();
            }
        });
        mp4_player.addEventListener( 'ended', function() {
            endedCallback.call();
        });
        var sourceMP4 = document.createElement("source"); 
        sourceMP4.type = "video/mp4";
        sourceMP4.src = src;
        mp4_player.appendChild(sourceMP4);
        $('#' + container).append(mp4_player);
    }

    /**
     * Vimeo lightbox player
     */
    function dvg_create_lightbox_vimeo_player(info) {
        dvg_create_vimeo_player(dvg_lightbox_player, 'dvg-lightbox-player', info.id, dvg_lightbox_player_next);
    }
    
    function dvg_create_vimeo_player(player, container, id, endedCallback) {

        player = new Vimeo.Player(container, {
            id : id
        });

        player.ready().then(function() {
            player.play();
        });

        player.on('ended', function() {
            endedCallback.call();
        });
    }

    /**
     * Youtube lightbox player
     */
    function dvg_create_lightbox_youtube_player(info) {
        dvg_create_youtube_player(dvg_lightbox_player, 'dvg-lightbox-player', info.id, dvg_lightbox_player_next);
    }

    /**
     * Siguiente vídeo en el popup
     */
    function dvg_lightbox_player_next() {
        $.magnificPopup.instance.next();
    }

    /**
     * Create the inline players 
     */
    function dvg_create_inline_players( $gallery, index ) {
        $gallery.attr('dvg-inline-id', index).on('click', 'a.dvg-gallery-item', function(evt) {
            evt.preventDefault();
            var $item = $(this);
            if ( $item.hasClass('dvg_with_player'))
                return;
            var player_id = 'player-' + $gallery.attr('dvg-inline-id');
            dvg_reset_inline( player_id, $gallery );
            dvg_show_inline_player( $gallery, $item, player_id );
        });
    }

    function dvg_show_inline_player( $gallery, $item, player_id ) {
        var url = $item.attr('href'),
            info = dvg_get_iframe_src(url);
        $item.addClass('dvg_with_player');
        $item.append('<div class="dvg_inline_player"><div class="dvg_iframe_scaler"><div id="' + player_id + '"></div></div></div>');
        setTimeout( function() {
            if ( info.type == 'youtube' ) {
                dvg_create_inline_youtube_player(info, $gallery, player_id);
            } else if ( info.type == 'vimeo' ) {
                dvg_create_inline_vimeo_player(info, $gallery, player_id);
            } else {
                dvg_create_inline_mp4_player(info, $gallery, player_id);
            }
        }, 300);
    }

    function dvg_create_inline_vimeo_player(info, $gallery, player_id) {
        dvg_create_vimeo_player(dvg_inline_players[player_id], player_id, info.id, function() {
            dvg_inline_next($gallery, player_id);
        });
    }

    function dvg_create_inline_youtube_player(info, $gallery, player_id) {
        dvg_create_youtube_player(dvg_inline_players[player_id], player_id, info.id, function() {
            dvg_inline_next($gallery, player_id);
        });
    }

    function dvg_create_inline_mp4_player(info, $gallery, player_id) {
        dvg_create_mp4_player(info.src, 'dvg-mp4-inline-player', player_id, function() {
            dvg_inline_next($gallery, player_id);
        });
    }

    /**
     * Plays the next video in the inline player
     * @param {*} $gallery 
     * @param {*} player_id 
     */
    function dvg_inline_next($gallery, player_id) {
        var items = $gallery.find('.dvg-gallery-item'),
            current = $gallery.find('.dvg_with_player').index();
        dvg_reset_inline(player_id, $gallery);
        if ( current < items.length - 1) {
            dvg_show_inline_player( $gallery, $(items[current + 1]), player_id);
        }
    }

    function dvg_get_iframe_src( url ) {
        if ( url.includes('youtube.com') ) {
            var result = url.match(/(?:embed\/|watch\?v=)(.+)/);
            if ( result ) {
                return { 'type' : 'youtube', 'src' : 'https://www.youtube.com/embed/' + result[1] + '?rel=0&autoplay=1', 'id' : result[1] };
            }
        } else if ( url.includes('youtu.be') ) {
            var result = url.match(/youtu\.be\/(.+)/);
            if ( result ) {
                return { 'type' : 'youtube', 'src' : 'https://www.youtube.com/embed/' + result[1] + '?rel=0&autoplay=1', 'id' : result[1]};
            }
        } else if ( url.includes('vimeo.com') ) {
            var result = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
            if ( result ) {
                return { 'type' : 'vimeo', 'src' : 'https://player.vimeo.com/video/' + result[1] + '?autoplay=1', 'id' : result[1]};
            }
        }
        
        return { 'type' : 'default', 'src' : url };
    }

    /**
     * Reset the inline player
     * @param {*} player_id 
     * @param {*} $gallery 
     */
    function dvg_reset_inline( player_id, $gallery ) {
        var playing = $gallery.find('.dvg_inline_player');
        if ( playing.length ) {
            playing.eq(0).remove();
        } 

        $gallery.find('.dvg_with_player').removeClass('dvg_with_player');

        if ( dvg_inline_players[player_id] && typeof dvg_inline_players[player_id].destroy === 'function' )
            dvg_inline_players[player_id].destroy();

        dvg_inline_players[player_id] = {};
    }

    /**
     * Crea un reproductor de youtube
     * @param {*} player Variable to save the player
     * @param {*} container Div containing the player
     * @param {*} id ID of the video
     * @param {*} endedCallback Function to call when the video is over
     */
    function dvg_create_youtube_player(player, container, id, endedCallback) {
        player = new YT.Player(container, {
            height: '360',
            width: '640',
            videoId: id,
            events: {
                'onReady': function(event) {
                    event.target.playVideo();
                },
                'onStateChange': function (event) {
                    if (event.data == YT.PlayerState.ENDED) {
                        endedCallback.call();
                    }
                }
            }
        });
    } 


    function dvg_filter($gallery) {
        var $container = $gallery.parent(),
            filters = $container.find('.dvg-gallery-filter');
        if ( filters.length ) {
            filters.on('click', function() {
                var $filter = $(this),
                    columns = $filter.parent().attr('data-columns').split(','), 
                    option = $filter.attr('data-value'),
                    items = $container.find('.dvg-gallery-item');
                if ( !$filter.hasClass('dvg-filter-active') ) {
                    $container.find('.dvg-filter-active').removeClass('dvg-filter-active');
                    $filter.addClass('dvg-filter-active');
                    items.removeClass(function (index, className) {
                        return (className.match (/(dvg-item-(dst|tbl|phn)-)\d+/g) || []).join(' ');
                    });
                    var indexInFilter = 0;
                    for ( var i = 0; i < items.length; i++ ) {
                        var $item = $(items[i]);
                        if ( option == '' || $item.attr('data-category') == option ) {
                            $item.removeClass('dvg-out-filter');
                            var indexClasses = 'dvg-item-dst-' + ( indexInFilter % Number(columns[0]) );
                            indexClasses += ' dvg-item-tbl-' + ( indexInFilter % Number(columns[1]) );
                            indexClasses += ' dvg-item-phn-' + ( indexInFilter % Number(columns[2]) );
                            $item.addClass(indexClasses);
                            indexInFilter++;
                        } else {
                            $item.addClass('dvg-out-filter');
                            
                        }
                    }
                    $(document.body).scroll();
                    $(window).scroll();
                }
            });
        }
    }
});

var dvg_lightbox_player;
var dvg_inline_players = {};