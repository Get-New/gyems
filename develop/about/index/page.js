require.config({
    paths: config.modulePaths,
});

define(function (require) {
    var $ = require('jquery');
    var _ = require('lodash');
    var dao = require('dao');
    var g = require('g');
    var simelt = require('simelt');
    var bar = require('bar');
    var frameset = require('frameset');

    $(function () {
        g.init();

        bar.init();

        frameset.init();

        simelt.config({ selector: '.leftmenu' }).init();

        simelt.change(function (menuIdLevel1, menuIdLevel2, menuIdLevel3) {
            var allMenus = G.Menus;
            var arr = [];

            // 找到需要加载到tab中的三级菜单，并组合一个数组
            var index = 0;
            var activeMenu;
            for (var i = 0 ; i < allMenus.length; i++) {
                var item = allMenus[i];
                if (item.ParentId == menuIdLevel2 && item.MenuLevel == 3) {
                    var obj = {
                        menuId: item.MenuId,
                        menuName: item.MenuName,
                        dynamic: false,
                        url: item.MenuUrl
                    };
                    if (typeof menuIdLevel3 === 'string') {
                        obj.active = obj.menuId == menuIdLevel3;
                    } else {
                        obj.active = index++ == 0;
                    }
                    if (obj.active) activeMenu = obj;
                    arr.push(obj);
                }
            }

            bar.load(arr);
            G.CurrentPageUrl = activeMenu.url;
            G.CurrentMenuId = activeMenu.menuId;
            frameset.clear();
            frameset.open(activeMenu.menuId, activeMenu.url);
            //$('#iframe1').attr('src', activeMenu.url + '?timestamp=' + (+new Date()));
        })

        bar.change(function (menuId, menuName, url) {
            G.CurrentPageUrl = url;
            G.CurrentMenuId = menuId;
            frameset.open(menuId, url);
            //$('#iframe1').attr('src', url + '?timestamp=' + (+new Date()));
        })

        bar.close(function (menuId, menuName, url) {
            var frame = frameset.close(menuId);
            G.CurrentPageUrl = frame.url;
            G.CurrentMenuId = frame.menuId;
        })

        dao.getUserInfo({}, function (data) {
            G.UserId = data.UserId;
            G.UserName = data.UserName;
            G.LoginTime = new Date();
            $('#user_name').html(data.UserName);
        })

        // 获取数据
        dao.getMenus({}, function (data) {
            simelt.load(data); // 绘制左侧菜单

            if (backdoor(simelt)) return;   // 为了方便测试而留的后门

            simelt.openFirst();  // 自动打开第一个页面
        })

        dao.getAuths({}, function (data) {
            G.Auth = data;
        })

        // 打开新页面的全局方法
        G.openTab = function (menuId, menuName, url) {
            bar.append(menuId, menuName, url);
            frameset.open(menuId, url);
        }

        // 修改密码
        $("#user").click(function () {
            Util.openInNewTab("modifypassword", "修改密码", "/develop/about/modifypassword/modifypassword.html");
            //$(".topmenu").html('');
            //var ul = $(".topmenu");
            //var li = $("<li>");
            //li.append('修改密码');
            //ul.append(li);
            //li.addClass('active');
            //$('#iframe1').attr('src', '/develop/about/modifypassword/modifypassword.html');
            //frameset.clear();
            //frameset.open('modifypassword', '/develop/about/modifypassword/modifypassword.html');
        })

        // 收起
        $(".lefttop a").click(function () {
            var t = $(this);
            if (t.hasClass('menu-up')) {
                t.removeClass('menu-up').addClass('menu-down').html('<cite></cite>展开');
                $('.leftarea').hide();
                $('.ui-content').addClass('no-left');
            } else {
                t.addClass('menu-up').removeClass('menu-down').html('<cite></cite>隐藏');
                $('.leftarea').show();
                $('.ui-content').removeClass('no-left');
            }
        })

        function backdoor(simelt) {
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
                var v = _.find(G.Menus, function (x) {
                    return x.MenuUrl && x.MenuUrl.indexOf(p) >= 0
                });

                G.CurrentPageUrl = v.MenuUrl;
                G.CurrentMenuId = v.MenuId;
                simelt.jump(v.ParentId, v.MenuId);
                return true;
            }
        }
    })
});