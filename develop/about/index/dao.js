


define(function (require) {
    
    var $ = require('jquery');
    var util = require('util');

    var ret = {};

    ret.getUserInfo = function (condition, callback) {

        $.ajax({
            url: '/api/HomeInns/GetUserInfo',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || !data.Success) {

                    if (backdoor()) return;   // 为了方便测试而留的后门 

                    util.alert('获取用户信息失败，请重新登录', function () {
                        window.location.href = 'login.html';
                    });
                    return;
                }

                callback(data.Models[0]);
            },
            error: function (a, b, c) {

                if (backdoor()) return;   // 为了方便测试而留的后门 

                if (typeof console == 'object' && console.log) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                }

                util.alert('获取用户信息失败，请重新登录', function () {
                    window.location.href = 'login.html';
                });
            }
        })
    }


    ret.getMenus = function (condition, callback) {
        // 获得菜单
        $.ajax({
            url: '/api/HomeInns/GetMenus',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || !data.Models) {
                    if (typeof console == 'object' && console.log) {
                        console.log('获取菜单失败，返回值如下');
                        console.log(data);
                    }
                    return;
                }
                
                var menus = data.Models;
                G.Menus = menus;   // 把菜单数据保存到全局变量
                var arr = [];

                for (var i = 0; i < menus.length; i++) {
                    var item = menus[i];
                    if (typeof item.MenuLevel != 'number' || item.MenuLevel > 1)
                        continue;

                    var level1 = {
                        menuId: item.MenuId,
                        menuName: item.MenuName,
                        iconUrl: item.IconUrl ? 'images2/' + item.IconUrl : 'images2/folder-basic.png',
                        children: []
                    };
                    arr.push(level1);

                    var children = _(menus).select({ ParentId: level1.menuId, MenuLevel: 2 }).value();

                    for (var j = 0; j < children.length; j++) {
                        var child = children[j];

                        var level2 = {
                            menuId: child.MenuId,
                            menuName: child.MenuName
                        };

                        level1.children.push(level2);
                    }
                } 
                callback(arr); 
            },
            error: function (a, b, c) {
                if (typeof console == 'object' && console.log) {
                    console.log(c);
                }

            }
        })
    }

    ret.getAuths = function (condition, callback) {

        // 获得权限
        $.ajax({
            url: '/api/HomeInns/GetUserAuthors',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || !data.Models) {
                    if (typeof console == 'object' && console.log) {
                        console.log('获取权限失败，返回值如下');
                        console.log(data);
                    }
                    return;
                }

                callback(data.Models);                
            },
            error: function (a, b, c) {
                if (typeof console == 'object' && console.log) {
                    console.log(c);
                }
            }
        })
    }

    function backdoor() {
        var url = document.location.href;
        var seg = url.split('?')[1];
        var p;
        if (seg) {
            var arr = seg.split('&');
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] != 'string') continue;
                var s = arr[i].split('=');
                if (s[0] == 'p') {
                    p = s[1];
                    break;
                }
            }
        }
        if (p) {
            var data = { UserName: 'admin', UserPassword: 'qwert12345' };
            $.ajax({
                url: '/api/Login/Login',
                type: 'post',
                data: data,
                success: function (data) {
                    if (data.Success) {
                        window.location.href = window.location.href;
                    }
                }
            });
            return true;
        }
    }

    return ret;
});


