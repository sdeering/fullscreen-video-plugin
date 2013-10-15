/**
 *  jQuery Fullscreen Video Testing
 *
 *  Facilitates the process of making videos fullscreen and also tests making
 *  video widgets using jQuery UI dialog with 1 video draggable over the other.
 *
 *  @copyright   Copyright (c) 2012 jQuery4u
 *  @license     http://jquery4u.com/license/
 *  @link        http://jquery4u.com
 *  @since       Version 1.0
 *  @author      Sam Deering
 *  @filesource  jquery-ajax-image-upload.js
 *
 */

(function($,W,D,undefined)
{

    W.FSVID = W.FSVID || {};

    W.FSVID =
    {
        name: "FULLSCREEN VIDEO",

        settings :
        {
            //...
        },

        /*
         *  Init.
         */
        init: function(settings)
        {
            this.settings = $.extend({}, this.settings, settings);
            this.checkFullscreenPossible();
            this.setupEventHandlers();
        },

        checkFullscreenPossible: function()
        {
            var $fsStatus = $('#fsStatus');
            if (W.fullScreenApi.supportsFullScreen)
            {
                //browser supports fullscreen
                $fsStatus.html('YES: Your browser supports FullScreen!').addClass('fullScreenSupported');
            }
            else
            {
                //browser doesn't supports fullscreen
                $fsStatus.html('SORRY: Your browser does not support FullScreen!').addClass('fullScreenNotSupported');
            }
        },

        /*
         *  Setup button click events.
         */
        setupEventHandlers: function()
        {
            var _this = W.FSVID;
            $('#createWidgets').on('click', function(e)
            {
                e.preventDefault();
                _this["createWidgets"]();
            });

            //------------------------------------------------------------------

            //required to prevent browser security breach
            var fsElement1 = document.getElementById('1');

            // handle button click
            $("#gofs1").on('click', function()
            {
                window.fullScreenApi.requestFullScreen(fsElement1);
            });

            //------------------------------------------------------------------

            var fsElement2 = document.getElementById('2');

            // handle button click
            $("#gofs2").on('click', function()
            {
                window.fullScreenApi.requestFullScreen(fsElement2);
            });

            //------------------------------------------------------------------

            var fsContainer = document.getElementById('vidcontainer');

            $("#gofsall").on('click', function()
            {
                W.fullScreenApi.requestFullScreen(fsContainer);
            });

            //------------------------------------------------------------------

            var fsContainer = document.getElementById('vidcontainer');

            $("#gofsallwidgets").on('click', function()
            {
                $('#w_1, #w_2').detach().prependTo('#vidcontainer'); //move widgets into fs container
                W.fullScreenApi.requestFullScreen(fsContainer);
            });

            //------------------------------------------------------------------

            var fsContainer = document.getElementById('vidcontainer');

            $("#gofssmart").on('click', function()
            {
                $('#w_1, #w_2').detach().prependTo('#vidcontainer'); //move widgets into fs container
                //maximise w1
                $('#w_1').css({
                    "height": "100%",
                    "width": "100%",
                    "z-index": "1001",
                    "left": "0",
                    "top" : "0"
                });
                //move w2
                $('#w_2').css({
                    "height": "360px",
                    "width": "480px",
                    "z-index": "1002",
                    "left": "2%",
                    "top" : "62%"
                });
                W.fullScreenApi.requestFullScreen(fsContainer);
            });

            //capture full screen events
            $(W).on(W.fullScreenApi.fullScreenEventName, function()
            {
                if (W.fullScreenApi.isFullScreen())
                {
                    // console.log('enter fullscreen');
                    $('.f-btns').hide(); //enter fullscreen
                }
                else
                {
                    // console.log('exit fullscreen');
                    $('.f-btns').show(); //exit fullscreen
                }
            });
        },

        /*
         *  Create a jQuery UI widget with video.
         */
        createWidget: function(wid)
        {
            var $vid = $('.video#'+wid);

            //create jQuery UI dialogs
            $vid.dialog(
            {
                "title": $vid.find('.title'),
                "width": "480",
                "height": "360",
                "position": [ ($('.ui-widget').length*500)+20, 290 ],
                "resizable": true,
                "draggable": true
            }).css(
            {
                "width": "100%",
                "height": "100%"
            });
            $vid.parent('.ui-widget').attr('id', 'w_'+wid).css(
            {
                "width": "480px",
                "height": "360px"
            });

            //keep things simple else you will run into fullscreen browser security issues
            var fsButton = document.getElementById('gofs'+wid),
                fsElement = document.getElementById('w_'+wid);

            //remove previous event handlers
            $(fsButton).off('click');
            $(fsElement).off(W.fullScreenApi.fullScreenEventName);

            //handle fullscreen button click
            $(fsButton).on('click', function()
            {
                W.fullScreenApi.requestFullScreen(fsElement);
            });
        },

        /*
         *  Turn all video elements into widgets.
         */
        createWidgets: function()
        {
            $('.video').each(function (i,v)
            {
                W.FSVID.createWidget($(v).attr('id'));
            });
        }

    }

    $(D).ready( function()
    {
        W.FSVID.init(); //loads data and starts dashboard obj
    });


})(jQuery,window,document);


/* Native FullScreen JavaScript API
----------------------------------- */

(function() {
    var fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() { return false; },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');

    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];

            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;

                break;
            }
        }
    }

    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }

    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function() {

            return this.each(function() {
                var el = jQuery(this);
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(el);
                }
            });
        };
    }

    // export api
    window.fullScreenApi = fullScreenApi;
})();
