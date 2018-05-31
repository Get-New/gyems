$(function () {
    Login.init();
})

var Login = {
    init: function () {

        locate_login_panel();

        var opts = {
            lines: 13, // 花瓣数目
            length: 10, // 花瓣长度
            width: 10, // 花瓣宽度
            radius: 10, // 花瓣距中心半径
            corners: 1, // 花瓣圆滑度 (0-1)
            rotate: 0, // 花瓣旋转角度
            direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
            color: '#fff', // 花瓣颜色
            speed: 1, // 花瓣旋转速度
            trail: 60, // 花瓣旋转时的拖影(百分比)
            shadow: false, // 花瓣是否显示阴影
            hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
            className: 'spinner', // spinner css 样式名称
            zIndex: 2e9, // spinner的z轴 (默认是2000000000)
            top: 'auto', // spinner 相对父容器Top定位 单位 px
            left: 'auto'// spinner 相对父容器Left定位 单位 px
        };

        var spinner = new Spinner(opts);

        $("#pwd").keyup(function (e) {
            var key = e.which;
            if (key == 13) {
                event.returnValue = false;
                event.cancel = true;
                $('.loginbtn').click();
            }
        });

        $('.loginbtn').click(function () {
            var data = $('form').serialize();
            if ($("#loginerror").css("visibility") == "visible") {
                $("#loginerror").css("visibility", "hidden");
            }
            //$("#loginspin").css("visibility", "visible");
            //var target = $("#loginspin").get(0);
            //spinner.spin(target);
        	//$("#loginbox").css("visibility", "hidden");
            $('#loading-center-absolute').show();
            $.ajax({
                url: '/api/Login/Login',
                type: 'post',
                data: data,
                dataType: 'json',
                success: function (data) {
                	//spinner.spin();
                	$('#loading-center-absolute').hide();
                    //$("#loginspin").css("visibility", "hidden");
                    //$("#loginbox").css("visibility", "visible");

                    if (!data || data.Errors || typeof data.Total == "undefined") {
                    	if (data.Errors.Message == "用户名或密码错误!") {
                    		//$("#loginbox").css("visibility", "visible");
                            if ($("#loginerror").css("visibility") == "hidden") {
                                $("#loginerror").css("visibility", "visible");
                                $("#sublogin").css("margin-top", "20px");
                            }
                            return;
                        }
                    	else {
                    		//$('#loading-center-absolute').hide();
                    		//$("#loginbox").css("visibility", "visible");
                            Util.alert('出现错误 错误信息为：' + data.Errors.Message);
                        }
                    } else
                        if (data.Success) {
                            window.location = 'index.html?timestamp='+(+new Date());
                            if ($("#loginerror").css("visibility") == "visible") {
                                $("#loginerror").css("visibility", "hidden");
                            }
                        }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                	//$("#loginbox").css("visibility", "visible");
                	$('#loading-center-absolute').hide();
                    Util.alert('出现错误 错误信息为：' + errorThrown)                   
                }
            });
        });
    }     


}

function locate_login_panel() {
    $('.loginbody').css({ 'position': 'absolute', 'left': ($(window).width() - 857) / 2 });
    $('.loginbody').show();
    $(window).resize(function () {
        $('.loginbody').css({ 'position': 'absolute', 'left': ($(window).width() - 857) / 2 });
    })
}

$.extend({
    windowsset: function () {
        var scrollFunc = function (e) {
            e = e || window.event;
            if (e.wheelDelta && event.ctrlKey) {//IE/Opera/Chrome
                event.returnValue = false;
            } else if (e.detail) {//Firefox
                event.returnValue= false;
            }
        }

        /*注册事件*/
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        } //W3C
        window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome/Safari
    }
});


