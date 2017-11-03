$(function () {
    //default running
    $(env.element.magzContainer).draggable({disabled: true});
    $(document).tooltip();

    var music = audio.music;
    // all component running
    var fn = {
        init: {
            magz: function () {
                $.getJSON("core/config/datas.json", function (data) {
                    window.localStorage.magzData = JSON.stringify(data);
                    $.each(data, function (a, b) {
                        color.push(b.color);
                        var div = $("<div></div>").css({
                            "backgroundImage": "url('" + b.image + "')",
                            "backgroundSize": "100% 100%"
                        }).html(b.html);
                        if (a == 0 | a == 1 | a == data.length - 1 | a == data.length - 2) { div.addClass("hard") }
                        $(div).appendTo(env.element.magz)
                    });
                    $(env.element.magzContainer).css({
                        width   : env.magz.width,
                        height  : env.magz.height
                    }).addClass("center");
                    $(env.element.magz).turn({
                        width       : env.magz.width,
                        height      : env.magz.height,
                        autoCenter  : true,
                        when        : {
                            turning : function (a ,b, c) {
                                audio.flipsound.pause();
                                audio.flipsound.play();
                                window.location.hash = "page" + b;
                                fn.init.color(b);
                            }
                        }
                    })
                });
            },
            thumbnails : function () {
                var data = JSON.parse(window.localStorage.magzData);
                $(env.element.thumb).empty();
                $.each(data, function (a, b) {
                    if (a != 0 && a != data.length - 1)
                        if (a % 2 != 0)
                            thumb = "<img src='" + b.thumb + "' " + a + ">";
                        else
                            thumb += "<img src='" + b.thumb + "' " + a + ">";
                    else
                        thumb = "<img src='" + b.thumb + "' " + a + ">";

                    if (a % 2 == 0 || a == 0 || a == data.length - 1) {
                        $("<a href='#page" + b.page + "'>").addClass('thumb').attr("title", b.title)
                            .html(thumb).appendTo(env.element.thumb);
                        thumb = null;
                    }
                });
            },
            particle : function () {
                particlesJS.load('particle-bg', 'core/config/particles-config.json');
            },
            color : function (page) {
                var a = color[page-1];
                if (a == "")
                    a = env.magz.defaultColor;
                $(env.element.coloring).css({ "background" : a });
            },
            startPage : function () {
                var page = window.location.hash.substr(5, 5);
                // noinspection JSAnnotator
                if (page == NaN || page = "" || page == null) {page = 1}
                fn.toggle.goPage(page)
            }
        },
        search : function (key){
            key.toLowerCase();
            var result = [];
            var data = JSON.parse(window.localStorage.magzData);
            var keyword = "";
            var tmp = [];
            $.each(data, function (a, b) {
               if (a != 0 && a != data.length - 1) {
                   if ( a % 2 == 1 ) {
                       keyword = b.title.toLowerCase() + b.html.toLowerCase();
                       tmp.push(b);
                   } else {
                       keyword += b.title.toLowerCase() + b.html.toLowerCase();
                       tmp.push(b);
                       if (keyword.indexOf(key) > - 1)
                           result.push(tmp);
                       keyword = "";
                       tmp = [];
                   }
               }
            });
            if ( key = "" || key == null ) {
                fn.init.thumbnails();
            } else {
                $(env.element.thumb).empty();
                $.each(result, function (a, b) {
                    var thumb;
                    thumb = "<img src='" + b[0].thumb + "' " + a + ">";
                    thumb += "<img src='" + b[1].thumb + "' " + a + ">";
                    $("<a href='#page'" + b[0].page + "'></a>").addClass(thumb)
                        .attr("title", b[0].title)
                        .html(thumb).appendTo(env.element.thumb);
                    thumb = null;
                });
            }
        },
        notif : function(message, duration){
            duration = 3000;
            $(env.element.notif).empty();
            $( "<p>" + message + "</p>" ).appendTo(env.element.notif);

            if ( env.status.notif == false) {
                $(env.element.notif).css({"right" : "0%"});
                env.element.notif.timer = setTimeout(function () {
                    $(env.element.notif).css({"right": "-70%"});
                    env.status.notif = false;
                }, duration);
                env.status.notif = true;
            } else
                clearInterval(env.element.notif.timer);
        },
        resizeMagz : function (size) {
            var scale = size/100;
            if ( size == env.magzScale.max || size == env.magzScale.min )
                return false;
            else {
                $(env.element.magzContainer)
                    .css({"transform" : "scale(" + scale + ")"});
                if ( size == env.magzScale.default )
                    fn.toggle.dragMagz(false);
                else
                    fn.toggle.dragMagz(true);

                return true;
            }
        },
        getRand : function (min, max) {
            min = Math.ceil(min);
            max =  Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min ;
        },
        toggle : {
            music : function () {
                if (audio.music.pause())
                    audio.music.play();
                else
                    audio.music.pause();
            },
            fullscreen : function () {
                if ((document.fullScreenElement && document.fullScreenElement !== null)
                    || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                    if (document.documentElement.requestFullScreen) {
                        document.documentElement.requestFullScreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullScreen) {
                        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }

                if ($(document).fullScreen()) {
                    fn.notif("Fullscreen OFF!");
                } else {
                    fn.notif("Fullscreen ON!");
                }
            },
            next : function () {
                $(env.element.magz).turn('next');
            },
            prev : function () {
                $(env.element.magz).turn('previous');
            },
            goPage : function (page) {
                $(env.element.magz).turn('page', page);
            },
            cover : function () {
                $(env.element.magz).turn('page', 1);
            },
            backCover : function () {
                $(env.element.magz).turn('page', $(env.element.magz).turn('pages'));
            },
            zoomIn : function () {
                env.magzScale.current += 10;
                if (!fn.resizeMagz(env.magzScale.current)) {
                    fn.notif("Ukuran maksimal majalah");
                    env.magzScale.current -= 10;
                } else
                    fn.notif("Zoom " + env.magzScale.current + " $");
            },
            zoomOut : function(){
                env.magzScale.current -= 10;
                if (!fn.resizeMagz(env.magzScale.current)) {
                    fn.notif('Ukuran minimal majalah');
                    env.magzScale.current += 10;
                } else {
                    fn.notif('Ukuran default majalah');
                }
            },
            zoomReset : function () {
                env.magzScale.current = env.magzScale.default;
                if (fn.resizeMagz(env.magzScale.current))
                    fn.notif('Ukuran default majalah');
            },
            clearing : function () {
                $.each(env.status, function (a, b) {
                    if ( a == "thumbContainer" || a == "helpCont" ) {
                        if ( a = "helpCont") {
                            if ( b == true)
                                fn.toggle.help();
                        }
                    } else {
                        if ( b == true)
                            fn.toggle.leftPanel(b);
                    }
                });
            },
            help : function () {
                $(".image-help").fadeToggle();
                if (!env.status.helpCont) {
                    env.status.helpCont = true;
                    $(env.element.blank).fadeIn();
                } else {
                    env.status.helpCont = false;
                    $(env.element.blank).fadeOut();
                }
            },
            leftPanel : function (elementClass) {
                if (!env.status[elementClass]) {
                    $(env.element[elementClass]).css({ "left" : "0%" });
                    $(env.element.magz).css({ "left" : "20%" });
                    fn.resizeMagz(50);
                    $(env.element.blank).fadeIn();
                    env.status[elementClass] = true;
                } else {
                    $(env.element[elementClass]).css({ "left" : "-80%" });
                    $(env.element.magz).css({ "left" : "0" });
                    fn.toggle.zoomReset();
                    $(env.element.blank).fadeOut();
                    env.status[elementClass] = false;
                }
            },
            dragMagz : function (key) {
                if (key == true) {
                    $(env.element.magzContainer).draggable('enable');
                    fn.notif("Anda bisa menggerakkan majalah");
                    $("html, body").css({ "cursor" : "crosshair" });
                    env.status.dragMode = true;
                } else {
                    $(env.element.magzContainer).draggable('disable');
                    $(env.element.magzContainer).css({
                        "top" : "",
                        "left" : ""
                    });
                    $("html, body").removeAttr("style");
                    env.status.dragMode = false;
                }
            },
            download : function () {
                return window.open("./gamagsa.pdf", "_blank");
            }
        }
    };

    // Running object function
    fn.init.magz();
    fn.init.thumbnails();
    fn.init.color();
    fn.init.particle();

    $(window).bind("load", function () {
        fn.init.startPage();
        music.loop = true;
        music.play();
        $(window).bind('hashchange', function () {
            var page = window.location.hash.substr(5,5);
            fn.toggle.goPage(page);
        });
        $(env.element.searchInput).bind('input', function () {
            fn.search($(this).val());
        });
        $(".button, .blank").bind('click', function () {
            var option = $(this).data("action");
            switch (option) {
                case "zoomIn": fn.toggle.zoomIn(); break;
                case "zoomOut": fn.toggle.zoomOut(); break;
                case "zoomReset": fn.toggle.zoomReset(); break;
                case "next" : fn.toggle.next(); break;
                case "prev" : fn.toggle.prev(); break;
                case "front" : fn.toggle.cover(); break;
                case "back" : fn.toggle.backCover(); break;
                case "thumb" : fn.toggle.leftPanel("thumbContainer"); break;
                case "clear" : fn.toggle.clearing(); break;
                case "help" : fn.toggle.help(); break;
                case "download" : fn.toggle.download(); break;
                case "fullscreen" : fn.toggle.fullscreen(); break;
                case "music" :
                    fn.toggle.music();
                    if (audio.music.pause())
                        $(".music").attr("src", "assets/icon/mute.png");
                    else
                        $(".music").attr("src", "assets/icon/loud.png");
            }
        });
        setTimeout(function () {
           $(".splash").fadeOut("slow");
           env.status.loaded = true;
        }, 700);
    });

    setInterval(function () {
        var animList = ['bounce','flash','pulse','rubberBand','shake','headShake','swing','tada','wobble','jello','bounceIn'];
        var rand = {
            "time" : fn.getRand(1, 10);
            "anim" : fn.getRand(1, animList.length);
        }
        $.each(classAnim, function (a, b) {
            var element = $(b);
            var select = {
                "time" : $(b).data("time"),
                "anim" : $(b).data("anim")
            };
            if (select.anim == null)
                select.anim = rand.anim;
            if (select.time == null)
                select.time = rand.time;
            if (select.time == rand.time){
                $(element).addClass('animated ' + animList[select.anim]);
                $(element).bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
                    $(this).removeClass('animated ' + animList[select.anim]);
                });
            }
        })
    }, 2000);

    setInterval(function () {
        var random = Math.random();
        if (random < 0.5) {
            fn.notif("Gamagsa edisi pertama. Selamat membaca");
        } else {
            fn.notif("");
        }
    }, 15000);

    $(document).bind('keydown', function (key) {
        if (env.status.thumbContainer == false) {
            switch (key.keyCode) {
                case 84 :
                    key.preventDefault();
                    fn.toggle.leftPanel("thumbContainer");
                    break;
                case 27 :
                    key.preventDefault();
                    fn.toggle.clearing();
                    break;
                case 39 :
                    key.preventDefault();
                    fn.toggle.next();
                    break;
                case 37 :
                    key.preventDefault();
                    fn.toggle.prev();
                    break;
                case 38 :
                    key.preventDefault();
                    fn.toggle.zoomIn();
                    break;
                case 40 :
                    key.preventDefault();
                    fn.toggle.zoomOut();
                    break;
                case 35 :
                    key.preventDefault();
                    fn.toggle.backCover();
                    break;
                case 36 :
                    key.preventDefault();
                    fn.toggle.cover();
                    break;
                case 70 :
                    key.preventDefault();
                    fn.toggle.fullscreen();
                    break;
                case 77 :
                    key.preventDefault();
                    fn.toggle.music();
                    if (audio.music.pause())
                        $(".music").attr("src", "assets/icon/mute.png");
                    else
                        $(".music").attr("src", "assets/icon/loud.png");
                    break;
                case 72 :
                    key.preventDefault();
                    fn.toggle.help();
                    break;
                case 68 :
                    key.preventDefault();
                    fn.toggle.next();
                    break;
                case 65 :
                    key.preventDefault();
                    fn.toggle.prev();
                    break;
                case 87 :
                    key.preventDefault();
                    fn.toggle.zoomIn();
                    break;
                case 83 :
                    key.preventDefault();
                    fn.toggle.zoomOut();
                    break;
            }
        }
    });
});