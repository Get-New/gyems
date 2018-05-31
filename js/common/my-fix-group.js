
// 管理页面body的点击时间
var bodyClickManager = (function () {

    // 如果已经定义过了，直接返回
    if (bodyClickManager)
        return bodyClickManager;

    // 待返回的对象
    var ret = {};

    // 处理函数
    var handlers = [];
    ret.handlers = handlers;

    // 触发事件，参数key表示被点击的区域
    ret.invoke = function (key) {
        for (var i = 0; i < handlers.length; i++) {

            // 执行那些key不相同的事件
            if (key !== handlers[i].key) {
                handlers[i].func();
            }
        }
    }

    // 注册处理函数，参数key表示排除的区域，handler是处理函数
    ret.register = function (key, handler) {
        handlers.push({
            key: key,
            func: handler
        })
    }

    // 是否被初始化过了
    ret.initialized = false;

    // 初始化
    ret.init = function (bodySelector) {

        if (this.initialized)
            return;

        this.initialized = true;
        var that = this;

        $(bodySelector).click(function () {
            that.invoke('body');
        })
    }

    return ret;
}())

var glist = (function () {
    var ret = {};

    var config = {
        selector: 'ul.group',
    };

    var selectHandler;

    ret.config = function (_conf) {
        config = $.extend(true, {}, config, _conf);
    }

    ret.loadData = function (list) {
        var ul = $(config.selector);
        $('li', ul).remove();
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var id = item[config.idField];
            var name = item[config.nameField];
            var li = $("<li></li>");
            li.attr('itemId', id);
            li.attr('itemName', name);
            li.html(name);
            ul.append(li);
        }

        $('li', ul).click(function (e) {
            var el = $(this);
            var ul = $(config.selector);
            var id = el.attr('itemId');
            var name = el.attr('itemName');
            $('li', ul).removeClass('active');
            el.addClass('active');

            if (typeof selectHandler === 'function') {
                selectHandler(id, name);
                var ct = $(".groupf");
                ct.removeClass('active');
            }
        })
    }

    ret.init = function () {        
           
    }

    ret.select = function (func) {
        selectHandler = func;
    }

    ret.selectFirst = function () {
        var ul = $(config.selector);
        var el = $("li", ul).first();
        var id = el.attr('itemId');
        var name = el.attr('itemName');
        $('li', ul).removeClass('active');
        el.addClass('active');

        if (typeof selectHandler === 'function') {
            selectHandler(id, name);
        }
    }

    return ret;
})()

var myGroup = (function () {

    var ret = {};

    var conf = {
        gridContainerId : 'group-container'
    };
    var selectHandler;
    var mygrid;
    var condition;

    ret.config = function (_conf) {
        conf = $.extend(true, {}, conf, _conf);
    }

    ret.init = function () {

        var that = this;

        // 显示树
        $(".groupf .head").click(function (e) {
            var el = $(".groupf");
            if (!el.hasClass('active')) {
                el.addClass('active');
            } else {
                el.removeClass('active');
            }
            e.stopPropagation();
        })

        $(".groupf").click(function (e) {
            bodyClickManager.invoke('group');
            e.stopPropagation();
        })

        bodyClickManager.init('.container');

        bodyClickManager.register('group', function () {
            var el = $(".groupf");
            el.removeClass('active');
        })

        // 树固定
        $(".groupf .fix").click(function () {
            var t = $(this);
            if (t.hasClass('fixed')) {
                t.removeClass('fixed');
                $('.main-content').removeClass('mc-group-fixed').addClass('mc-group-notfix');
                $('.groupf').removeClass('fixed').addClass('notfixed');
                $('.groupf').removeClass('active');
                if (that.page && that.page.my_grid) {
                    that.page.my_grid.grid.getView().refresh()
                }
            } else {
                t.addClass('fixed');
                $('.main-content').addClass('mc-group-fixed').removeClass('mc-group-notfix');
                $('.groupf').removeClass('notfixed').addClass('fixed');
                if (that.page && that.page.my_grid) {
                    that.page.my_grid.grid.getView().refresh()
                }
            }
        })

        $(".groupf .refresh").click(function (e) {
            e.stopPropagation();
            that.query(condition);
            //bodyClickManager.invoke('group');
            
        })

        $(".groupf .group-title").html(conf.gridTitle);

        glist.config({
            idField: conf.idField,
            nameField: conf.nameField
        })

        glist.select(function (id, name) {

            $(".groupf .current").html(name);

            if (typeof selectHandler === 'function') {
                selectHandler(id, name);
            }
        })

       
    }

    ret.select = function (func) {
        selectHandler = func;
    }

    ret.query = function (_condition) {

        condition = _condition || {};

        var that = this;

        // 发起请求
        $.ajax({
            type: 'get',
            url: conf.url,
            dataType: 'json',
            data: condition,
            success: function (data) {
                if (!data || data.error || (!_.isNumber(data.Total) && !_.isNumber(data.total))) {                   
                    return;
                }

                var list = data.Models || data.list;
                var total = data.Total || data.total;

                glist.loadData(list);
                glist.selectFirst();
            },
            error: function (req, msg) {
                console.log(msg);
            }
        });

    }

    return ret;
})()