
/* 全局变量，子页面可通过window.parent.G调用该变量
   包含以下字段
   UserId：当前用户Id，字符串
   UserName：当前用户Name，字符串
   LoginTime：本次登录的时间
   Menus：当前用户可访问的菜单，对象数组     
   Auth：当前用户的权限，对象数组
   CurrentPageUrl: 当前打开的页面的路径
   CurrentMenuId: 当前打开页面的MenuId（特殊的，当打开页面是404、home页、修改密码等非功能页面时，该字段取"0")
   Favors：当前用户收藏的页面列表，对象数组
   MenuHide：当前菜单栏是否隐藏，默认是false

   GetAuth: 返回当前页面的权限
   RefreshHeight：更新iframe高度
*/
var G = { MenuHide: false };

G.GetAuth = function () {
    var g = G;
    var auths = g.Auth;
    var auth = _.find(auths, 'MenuId', g.CurrentMenuId);
    if (auth) {
        var list = auth.FeatureCodes;
        return list;
    }
    return [];
}

G.RefreshHeight = function () {
    var iframe = document.getElementById('iframe1');
    iframe.height = iframe1.document.body.scrollHeight;
}

$(function () {
    Index.init();
})

var Index = {

    init: function () {
        var that = this;

        // 获得当前登录用户的基本信息
        $.ajax({
            url: '/api/HomeInns/GetUserInfo',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || !_.isArray(data.Models) || !data.Models[0].UserId) {

                    //--------- 以下代码方便调试用 ---------------
                    var url = window.location.href;
                    var p = Util.parseURL(url).params.p;
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
                        return;
                    }

                    Util.alert('获取用户信息失败，请重新登录', function () {
                        window.location.href = 'login.html';
                    });
                    return;
                }

                var obj = data.Models[0];
                G.UserId = obj.UserId;
                G.UserName = obj.UserName;
                G.LoginTime = new Date();

                $('#user_name').html(obj.UserName);
            },
            error: function (a, b, c) {

                //--------- 以下代码方便调试用 ---------------
                var url = window.location.href;
                var p = Util.parseURL(url).params.p;
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
                    return;
                }
                //--------- 测试代码结束 ----------
                if (typeof console == 'object' && console.log) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                }

                Util.alert('获取用户信息失败，请重新登录', function () {
                    window.location.href = 'login.html';
                });
            }
        })

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

                G.Menus = data.Models;

                // 获得收藏
                that.getFavors();

                var firstLiLevel2 = that.prepare_menu(data.Models);
                var pageName = Util.parseURL(document.location.href).params.p;
                if (pageName) {
                    var v = _.find(G.Menus, function (x) {
                        return x.MenuUrl && x.MenuUrl.indexOf(pageName) >= 0
                    })
                    if (v) {
                        $('#iframe1').attr('src', v.MenuUrl);
                        G.CurrentPageUrl = v.MenuUrl;
                        G.CurrentMenuId = v.MenuId;
                        $('.menuson').hide();
                        $('dd.opened').removeClass('opened');
                        var li = $("li[menuid='" + v.ParentId + "']");
                        li.parents('.menuson').show();
                        li.parents('dd').addClass('opened');
                        that.level2_menu_clicked(li, v.MenuId);
                        return;
                    }
                }

                if (firstLiLevel2) {
                    that.level2_menu_clicked(firstLiLevel2)
                    return;
                }
                 

                $('#iframe1').attr('src', 'welcome.html');
                G.CurrentPageUrl = 'welcome.html';
                G.CurrentMenuId = '0';
            },
            error: function (a, b, c) {
                if (typeof console == 'object' && console.log) {
                    console.log(c);
                }

            }
        })

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

                G.Auth = data.Models;
            },
            error: function (a, b, c) {
                if (typeof console == 'object' && console.log) {
                    console.log(c);
                }

            }
        })

        //顶部导航切换
        $(".nav li a").click(function () {
            $(".nav li a.selected").removeClass("selected")
            $(this).addClass("selected");
        })

        $('.test-button').click(function () {
        	if ($('.message-box').hasClass("show")) {
        		$('.message-box').removeClass("show hide staticshow statichide").addClass("hide");
        	}
        	else {
        		$('.message-box').removeClass("show hide staticshow statichide").addClass("show");
        	}
        })

        $('.message-box').mouseenter(function () {
        	console.log("触发鼠标移入事件");
        	if (!($('.message-box').hasClass("statichide"))) {
        		$('#message-box').removeClass("show hide staticshow statichide").addClass("staticshow");
        	}
        })

        $('.message-box').mouseleave(function () {
        	console.log("触发鼠标移出事件");
        	if (!($('.message-box').hasClass("statichide"))) {
        		setTimeout(function () {
        			$('.message-box').removeClass("show hide staticshow statichide").addClass("hide");
        		}, 100)
        	}
        })

        $('#message-close').click(function () {
        	console.log("触发关闭事件");
        	$('.message-box').removeClass("show hide staticshow statichide").addClass("statichide");
        })


        //收藏
        $('.favor a').click(function () {
            var menuId = G.CurrentMenuId;
            if (menuId == '0') {
                return;
            }

            that.add_favor(menuId);
        })

        // 修改密码
        $("#user").click(function () {

        	Util.openInNewTab("userId", "修改密码", "/develop/about/modifypassword/modifypassword.html");

            //$(".topmenu").html('');

            //var ul = $(".topmenu");
            //var li = $("<li>");
            //li.append('修改密码');
            //ul.append(li);
            //li.addClass('active');
            //$('#iframe1').attr('src', '/develop/about/modifypassword/modifypassword.html');
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
    },

    getFavors: function () {
        var that = this;
        $.ajax({
            type: 'get',
            url: '/api/FavoriteBase/GetPage',
            dataType: 'json',
            success: function (data) {

                if (data && data.Success) {
                    $('.nav li').remove();
                    var ul = $('.nav');

                    var list = data.Models;
                    for (var i =0;i < list.length;i++) {

                        if (i >= 6) {
                            continue;
                        }

                        var item = list[i];
                        var menuId = item.MenufeatureId;
                        var menuName = item.MenuName;
                        var url = item.x;
                        var icon = '/images2/page-common.png';

                        var li = $('<li></li>');
                        li.attr('menuId', menuId);

                        if (menuId == G.CurrentMenuId) {
                            li.addClass('active');
                        }

                        var a = $("<a href='javascript:void(0)' target='iframe1'></a>");
                        a.attr('menuId', menuId);

                        var closer = $("<span></span>");
                        closer.addClass('bg');

                        var img = $('<img/>');
                        img.attr('src', icon);

                        var p = $('<p></p>');
                        p.html(menuName);

                        a.append(img);
                        a.append(p);
                        a.append(closer);
                        li.append(a);
                        ul.append(li);
                    }

                    $('.nav li').click(function () {

                        $('.nav li.active').removeClass('active');
                        $(this).addClass('active');

                        var menuId = $(this).attr('menuId');
                        that.go_to_page(menuId);
                    })

                    $('.nav li a span').click(function (e) {
                        var menuId = $(this).parent().attr('menuId');
                        var li = $(this).parent().parent();
                        that.delete_favor(menuId, li);

                        e.stopPropagation();
                    })
                }
            },
            error: function (x, y, z) {
                if (typeof console == 'object' && console.log) {
                    console.log('error in getFavors')
                }

            }
        });

    },

    add_favor: function (menuId) {
        var that = this;
        var data = { MenufeatureId: menuId };

        $.ajax({
            type: 'post',
            url: '/api/FavoriteBase/Add',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success) {
                    that.getFavors();
                }
            },
            error: function (x, y, z) {

            }
        });
    },

    delete_favor: function (menuId, el) {
        var that = this;
        var data = { FavoriteId: menuId };

        $.ajax({
            type: 'delete',
            url: '/api/FavoriteBase/Delete',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success) {
                    $(el).remove();
                }
            },
            error: function (x, y, z) {

            }
        });
    },

    go_to_page: function (menuId) {
        var that = this;
        var v = _.find(G.Menus, function (x) {
            return x.MenuId == menuId;
        })
        if (v) {
            var url = 'develop/about/redirect.html?p=';
            if (v.MenuUrl.indexOf('?') > 0) {
                url = url + v.MenuUrl + ';timestamp:' + (+new Date());
            } else {
                url = url + v.MenuUrl + '?timestamp=' + (+new Date());
            }

            $('#iframe1').attr('src', url);
            G.CurrentPageUrl = v.MenuUrl;
            G.CurrentMenuId = v.MenuId;
            $('.menuson').hide();
            $('dd.opened').removeClass('opened');
            var li = $("li[menuid='" + v.ParentId + "']");
            li.parents('.menuson').show();
            li.parents('dd').addClass('opened');
            that.level2_menu_clicked(li, v.MenuId);
            return;
        }
    },

    /*

    menu example ↓

    <dd>
        <div class="title">
            <span></span>基础数据管理
        </div>
        <ul class="menuson">
            <li><cite></cite><a href="basic-factory.html" target="iframe1">能源工厂模型</a><i></i></li>
            <li><cite></cite><a href="basic-data.html" target="iframe1">能源基础数据</a><i></i></li>
            <li><cite></cite><a href="basic-equipment.html" target="iframe1">能源计量器具</a><i></i></li>
            <li><cite></cite><a href="basic-standard.html" target="iframe1">能源标准规范</a><i></i></li>
        </ul>
    </dd>

    */

    prepare_menu: function (menus) {

        var that = this;

        var firstLiLevel2 = '';

        for (var i in menus) {
            if (typeof menus[i].MenuLevel != 'number' || menus[i].MenuLevel > 1)
                continue;

            var parent = menus[i];
            var dd = $('<dd>');
            var div = $("<div class='title'>");
            var ul = $("<ul class='menuson'>");
            var span = $("<span>");
            var img = $("<img>");
            if (parent.IconUrl) {
                img.attr('src', 'images2/' + parent.IconUrl);
            } else {
                img.attr('src', 'images2/folder-basic.png');
                img.css('visibility', 'hidden');
            }

            var icon = $("<cite>");
            icon.addClass('bg');
            span.append(img);

            div.append(span);
            div.append(parent.MenuName);
            div.append(icon);

            dd.append(div);
            dd.append(ul);

            line = $("<div class='line'>");
            dd.append(line);

            $('.leftmenu').append(dd);

            var children = _(menus).select({ ParentId: parent.MenuId, MenuLevel: 2 }).value();

            for (var j in children) {
                var child = children[j];

                var li = $("<li></li>");
                li.attr('MenuId', child.MenuId);
                var a = $("<a href='javascript:void(0)'></a>");
                a.append(child.MenuName);
                li.append(a);
                ul.append(li);

                if (!firstLiLevel2) {
                    firstLiLevel2 = li;
                }
            }
        }

        $('.leftmenu dd .menuson').hide();
        $('.leftmenu dd .menuson:first').show();
        $('.leftmenu dd .menuson:first').parent().addClass('opened');

        //导航切换
        $(".menuson li").click(function () {
            var li = $(this);
            that.level2_menu_clicked(li);
        });

        $('.title').click(function () {
            var $ul = $(this).next('ul');
            $('dd').find('ul').slideUp();
            if ($ul.is(':visible')) {
                $(this).next('ul').slideUp('normal', function () {
                    $('dd').removeClass('opened');
                });
            } else {
                var dd = $(this).parent();
                dd.addClass('opened');
                $(this).next('ul').slideDown('normal', function () {
                    $('dd').not(dd).removeClass('opened');

                    // 自动选中第一个
                    var firstLi = $('li', $ul).first();
                    if (firstLi) {
                        that.level2_menu_clicked(firstLi);
                    }
                });
            }
        });

        return firstLiLevel2;
    },

    level2_menu_clicked: function (clicked_li, level3_menu_id) {
        $(".menuson li.active").removeClass("active")
        $(clicked_li).addClass("active");
        var menuId = $(clicked_li).attr('MenuId');
        var allMenus = G.Menus;
        var list = _(allMenus).select({ ParentId: menuId, MenuLevel: 3 }).value();
        if (!list || list.length == 0) {
            $('#iframe1').attr('src', 'notfound.htm?timestamp=' + (+new Date()));
            G.CurrentPageUrl = 'notfound.htm';
            G.CurrentMenuId = '0';
            return;
        }
        $(".topmenu").html('');

        for (var i in list) {
            var item = list[i];
            var ul = $(".topmenu");
            var li = $("<li>");
            li.attr('MenuId', item.MenuId);
            li.append(item.MenuName);
            ul.append(li);

            if (level3_menu_id) {
                if (level3_menu_id == item.MenuId) {
                    if (item.MenuUrl.indexOf('?') > 0) {
                        $('#iframe1').attr('src', item.MenuUrl + ';timestamp:' + (+new Date()));
                    } else {
                        $('#iframe1').attr('src', item.MenuUrl + '?timestamp=' + (+new Date()));
                    }
                    //$('#iframe1').attr('src', item.MenuUrl);
                    G.CurrentPageUrl = item.MenuUrl;
                    G.CurrentMenuId = item.MenuId;
                    li.addClass('active');
                }
            }
            else {
                if (i == 0) {
                    if (item.MenuUrl.indexOf('?') > 0) {
                        $('#iframe1').attr('src', item.MenuUrl + ';timestamp:' + (+new Date()));
                    } else {
                        $('#iframe1').attr('src', item.MenuUrl + '?timestamp=' + (+new Date()));
                    }
                    //$('#iframe1').attr('src', item.MenuUrl);
                    G.CurrentPageUrl = item.MenuUrl;
                    G.CurrentMenuId = item.MenuId;
                    li.addClass('active');
                }
            }
        }

        $('.topmenu li').click(function () {
            var li = $(this);

            $('.topmenu li.active').removeClass('active');
            $(this).addClass('active');

            var menuId = $(this).attr('MenuId');
            var menu = _.find(G.Menus, 'MenuId', menuId);
            if (menu) {
                var url = 'develop/about/redirect.html?p=';
                if (menu.MenuUrl.indexOf('?') > 0) {
                    url = url+ menu.MenuUrl + ';timestamp:' + (+new Date());
                } else {
                    url = url+ menu.MenuUrl + '?timestamp=' + (+new Date());
                }

                $('#iframe1').attr('src', url);

                //$('#iframe1').attr('src', menu.MenuUrl);
                G.CurrentPageUrl = menu.MenuUrl;
                G.CurrentMenuId = menu.MenuId;
            }
            else {
                $('#iframe1').attr('src', 'notfound.htm?timestamp=' + (+new Date()));
                G.CurrentPageUrl = 'notfound.htm';
                G.CurrentMenuId = '0';
            }
        })
    }
}



