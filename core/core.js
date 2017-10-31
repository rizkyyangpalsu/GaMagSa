$(function () {
    //default running
    $(env.element.magzContainer).draggable({disabled: true});
    $(document).tooltip();
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
            color : function (page) {
                var a = color[page-1];
                if (a == "")
                    a = env.magz.defaultColor;
                $(env.element.coloring).css({ "background" : a });
            },
            toggle : {
                music : function () {
                    if (audio.music.pause())
                        audio.music.play();
                    else
                        audio.music.pause();
                },
                fullscreen : function () {
                    
                }
            }
        }
    }
});