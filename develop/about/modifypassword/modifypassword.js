$(function () {
    modifypassword.init();
})

var modifypassword = {
    init: function () {
        
        this.locate_login_panel();

        
        
        $('.modifypwd').click(function () {

            var fpwd = $('#newpwd').val();
            var spwd = $('#confirmpwd').val();
            if (fpwd != spwd) {
                $('.iframepwdmsg').show();
             }
            else {
                $('.iframepwdmsg').hide();

                var data = $('form').serialize();
                $.ajax({
                    url: '/api/ManageUser/UserModifyPassword',
                    type: 'put',
                    data: data,
                    dataType: 'json',
                    success: function (data) {

                        if (data.error) {
                            Util.alert('出现错误 错误信息为：' + data.error);
                            return;
                        }

                        if (data.Success) {
                            alert('密码修改成功！');
                        } else {
                            Util.alert('旧密码不正确，请重新输入');
                        }
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        Util.alert('出现错误 错误信息为：' + errorThrown)
                    }
                })
            }
        });


    },

    locate_login_panel: function () {
        $('.modifypwd-box').css({ 'position': 'absolute', 'left': ($(window).width() - 857) / 2 });
        $('.modifypwd-box').show();
        $(window).resize(function () {
            $('.modifypwd-box').css({ 'position': 'absolute', 'left': ($(window).width() - 857) / 2 });
        })
    },
}

function keydown() {
    if (event.keyCode == 13) {
        event.returnValue = false;
        event.cancel = true;
        $('.modifypwd').click();
    }
}

