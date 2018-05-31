
define(function (require) {

    var _ = require('lodash');

    /* 全局变量，子页面可通过window.parent.G调用该变量
       包含以下字段
       UserId：当前用户Id，字符串
       UserName：当前用户Name，字符串
       LoginTime：本次登录的时间
       Menus：当前用户可访问的菜单，对象数组     
       Auth：当前用户的权限，对象数组
       CurrentPageUrl: 当前打开的页面的路径
       CurrentMenuId: 当前打开页面的MenuId（特殊的，当打开页面是404、home页、修改密码等非功能页面时，该字段取"0")
       MenuHide：当前菜单栏是否隐藏，默认是false
       
       GetAuth: 返回当前页面的权限
       RefreshHeight：更新iframe高度
    */

    var ret = {};

    ret.init = function () {

        window.G = { MenuHide: false };
        
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
    }

    return ret;

})