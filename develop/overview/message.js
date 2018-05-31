/*推送信息*/

define(function (require) {
    var $ = require("jquery");
    var dao = require("dao");

    var ret = {
        detailHandler: null		//详细按钮点击事件
    };
    var timer;	//定时器

    function initMessageList(data) {
        $('.list-wrapper li').remove();
        $('.bottom-slider li').remove();
        if (timer) {
            clearInterval(timer);
        }

        $('.list-wrapper').css({ "width": data.length * 100 + "%", "margin-left": "0%" });

        var topTenArray = data.slice(data.length - 10 < 0 ? 0 : data.length - 10);

        for (var i = 0; i < topTenArray.length; i++) {
            var item = topTenArray[i];

            var liWrapper = $("<li></li>");
            if (i == 0) {
                var liBottom = $("<li bar='bar' class='on'></li>");
            }
            else {
                var liBottom = $("<li bar='bar'></li>");
            }
            var p = $("<p class='message-content'>" + item.MessageContent + "</p>");
            liWrapper.append(p);

            $('.list-wrapper').append(liWrapper);
            $('.bottom-slider').append(liBottom);
        }

        timer = setInterval(slideAnimation, 5000);
    }

    function slideAnimation() {
        //var liCount = $('.list-wrapper').children().length;
        //var liWidth = $('.list-wrapper li').first().width();
        //var width = $('.list-wrapper').css("width").indexOf('%') >= 0 ? liCount * liWidth : $('.list-wrapper').css("width");
        //var preMarginLeft = $('.list-wrapper').css("margin-left").indexOf('%') >= 0 ? parseFloat($('.list-wrapper').css("margin-left")) / 100 * liWidth : $('.list-wrapper').css("margin-left");
        //var times = (parseFloat(preMarginLeft) / liWidth).toFixed(0) - 1;
        //var nextMarginLeft = times * 100;
        //if (-times >= liCount) {
        //    $('.list-wrapper').animate({ "margin-left": "0%" }, 100);
        //    $('.bottom-slider li').each(function () {
        //        $(this).removeClass("on");
        //    });
        //    $('.bottom-slider li').first().addClass("on");
        //}
        //else {
        //    $('.list-wrapper').animate({ "margin-left": nextMarginLeft + "%" }, 1000);
        //    $('.bottom-slider li').filter('.on').removeClass("on").next().addClass("on");
    	//}
    	var liCount = $('.list-wrapper').children().length;
    	var index = $('.bottom-slider li').index($('.bottom-slider .on'));

    	if (index + 1 >= liCount) {
    		$('.list-wrapper').animate({ "margin-left": "0%" }, 100);
    		$('.bottom-slider li').each(function () {
    			$(this).removeClass("on");
    		});
    		$('.bottom-slider li').first().addClass("on");
    	}
    	else {
    		var rightPaper = $('.bottom-slider .on').next();
    		$('.bottom-slider li').each(function () {
    			$(this).removeClass("on");
    		});
    		rightPaper.addClass("on");
    		$('.list-wrapper').animate({ "margin-left": -(index + 1) * 100 + "%" }, 1000);
    	}

    }

    function slideLeftAnimation() {
    	if (timer) {
    		clearInterval(timer);
    	}

    	var index = $('.bottom-slider li').index($('.bottom-slider .on'));
    	if (index - 1 < 0) {
    		timer = setInterval(slideAnimation, 5000);
    		return;
    	}
    	var leftPaper = $('.bottom-slider .on').prev();

    	$('.bottom-slider li').each(function () {
    		$(this).removeClass("on");
    	});

    	leftPaper.addClass("on");

    	$('.list-wrapper').animate({ "margin-left": -(index - 1) * 100 + "%" }, 1000);

    	timer = setInterval(slideAnimation, 5000);
    }

    function slideRightAnimation() {
    	if (timer) {
    		clearInterval(timer);
    	}

    	var liCount = $('.list-wrapper').children().length;
    	var index = $('.bottom-slider li').index($('.bottom-slider .on'));
    	if (index + 1 >= liCount) {
    		$('.list-wrapper').animate({ "margin-left": "0%" }, 100);
    		$('.bottom-slider li').each(function () {
    			$(this).removeClass("on");
    		});
    		$('.bottom-slider li').first().addClass("on");
    	}
    	else {
    		var rightPaper = $('.bottom-slider .on').next();
    		$('.bottom-slider li').each(function () {
    			$(this).removeClass("on");
    		});
    		rightPaper.addClass("on");
    		$('.list-wrapper').animate({ "margin-left": -(index + 1) * 100 + "%" }, 1000);
    	}

    	timer = setInterval(slideAnimation, 5000);
    }

    function addClickHandler() {
        $('.bottom-slider').on('click', 'li', function () {
            var index = $(".bottom-slider li").index(this);

            $('.bottom-slider li').each(function () {
                $(this).removeClass("on");
            });

            $(this).addClass("on");

            $('.list-wrapper').animate({ "margin-left": -index * 100 + "%" }, 100);
        });

        $('.slider-pre').on('click', '', function () {
        	slideLeftAnimation();
        });

        $('.slider-next').on('click', '', function () {
        	slideRightAnimation();
        });

        $('.middle-panel-top').mouseover(function () {
        	$(this).children('.slider-more').show();
        	$(this).children('.slider-pre').show();
        	$(this).children('.slider-next').show();
        });

        $('.middle-panel-top').mouseout(function () {
        	$(this).children('.slider-more').hide();
        	$(this).children('.slider-pre').hide();
        	$(this).children('.slider-next').hide();
        });

        $('.middle-panel-top .slider-more').click(function () {
            if (typeof ret.detailHandler == 'function') {
                //ret.detailHandler(type);
                ret.detailHandler();
            }
        })
    }

    ret.init = function () {
        addClickHandler();
        dao.queryMessage(initMessageList);
        //initMessageList(data);
    };

    ret.detailClick = function (func) {
        this.detailHandler = func;
    };

    return ret;
})