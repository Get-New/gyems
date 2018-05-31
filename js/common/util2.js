/* Util是全局工具类，提供通用的方法 */
var Util = {
    // 弹出提示框
    alert: function (message, ok_callback) {
        $.alert.open({
            type: 'info',
            title: '提示',
            content: message,
            callback: function (button) {
                if (button == 'ok' && typeof (ok_callback) == 'function') {
                    ok_callback();
                }
            }
        })
    },

    // 弹出加载框
    load: function () {
        var opts = {
            lines: 13, // 花瓣数目
            length: 7, // 花瓣长度
            width: 4, // 花瓣宽度
            radius: 10, // 花瓣距中心半径
            corners: 1, // 花瓣圆滑度 (0-1)
            rotate: 0, // 花瓣旋转角度
            direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
            color: '#000', // 花瓣颜色
            speed: 1, // 花瓣旋转速度
            trail: 60, // 花瓣旋转时的拖影(百分比)
            shadow: false, // 花瓣是否显示阴影
            hwaccel: false, //spinner 是否启用硬件加速及高速旋转
            className: 'spinner', // spinner css 样式名称
            zIndex: 2e9, // spinner的z轴 (默认是2000000000)
            top: '200px', // spinner 相对父容器Top定位 单位 px
            left: '50%'// spinner 相对父容器Left定位 单位 px
        };

        var spinner = new Spinner(opts);

        return spinner;
    },

    confirm: function (message, yes_callback, no_callback) {
        $.alert.open({
            type: 'confirm',
            title: '提示',
            content: message,
            callback: function (button) {
                if (button == 'yes' && yes_callback && typeof (yes_callback) == 'function') {
                    yes_callback();
                }
                else if (button == 'no' && no_callback && typeof (no_callback) == 'function') {
                    no_callback();
                }
            }
        })
    },
    modifyFormData: function (formData, field, value) {
        formData = decodeURIComponent(formData);

        var ret = {};

        if (formData) {
            var ret = {};
            var arr = formData.split('&');
            for (var i in arr) {
                if (!arr[i]) continue;
                s = arr[i].split('=');
                ret[s[0]] = s[1];
            }
        }

        ret[field] = value;
        return $.param(ret);
    },

    parseURL: function (url) {
        return {
            url_no_param: (function () {
                return url.split('?')[0];
            })(),
            params: (function () {
                var ret = {};
                var seg = url.split('?')[1];

                if (seg) {
                    var ret = {};
                    var arr = seg.split('&');
                    for (var i in arr) {
                        if (typeof arr[i] != 'string') continue;
                        s = arr[i].split('=');
                        ret[s[0]] = s[1];
                    }
                }

                return ret;
            })()
        };
    },

    // 响应式布局时，设计搞尺寸为x时，计算实际尺寸值
    responsivePx: function (x) {
        var curr_font = parseFloat(window.top.document.documentElement.style.fontSize);
        var ret = x * curr_font / 100;
        return ret;
    },

    openInNewTab: function (menuId, menuName, url) {
        var g = window.top.G;
        if (g) {
            g.openTab(menuId, menuName, url);
        }
    }
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

if (typeof Ext === 'function') {
    Ext.onReady(function () {
        $(function () {
            load_page();
        })
    })
} else if (typeof $ === 'function') {
    $(function () {
        load_page();
    })
} else {
    window.onload = function () {
        load_page();
    }
}

function load_page() {
    if (typeof Page == 'object') {
        Ext.onReady(function () {
            Page.init();
        })

        // 管理权限
        if (window.top.G) {
            var auths = window.top.G.GetAuth();
            if (auths.indexOf('add') < 0) {
                $('li#add').hide();
                $('span#submit-add').hide();
            }
            if (auths.indexOf('edit') < 0) {
                $('li#edit').hide();
                $('span#submit-edit').hide();
            }
            if (auths.indexOf('reset') < 0) {
                $('li#reset').hide();
            }
            if (auths.indexOf('export') < 0) {
                $('li#export').hide();
                $('.export').hide();
            }
            if (auths.indexOf('import') < 0) {
                $('li#import').hide();
                $('.import').hide();
            }
        }
    }
    else {
        setTimeout(load_page, 200);
    }
}