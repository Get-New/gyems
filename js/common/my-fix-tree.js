
if (typeof mtree !== 'function')
    throw new Error('模块mtree加载失败');

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


// 树形结构
function MyTree(page, config) {

    // 树的配置
    this.config;

    // 指向页面对象
    this.page = page;

    // 构造mtree实例
    this.mt = mtree();   

    this.init(config);
}

MyTree.prototype.bind_node_click_event_handler = function (handler) {
    var that = this;
    this.mt.select(function (id, name) {
        handler.call(that.page, id, name);
        $(".treef .current").html(name);
        var el = $(".treef");
        el.removeClass('active');
    });
}

MyTree.prototype.init = function (config) {
    // 使用默认配置和自定义配置，组成最终使用的配置
    this.config = config;
    var that = this;

    this.mt.config({
        idField: config.id_field,
        nameField: config.name_field,
        containerSelector: '.tree',
        autoSelectRoot: true,
        autoExpandLevel: 1
    })

    // 显示树
    $(".treef .head").click(function (e) {
        var el = $(".treef");
        if (!el.hasClass('active')) {
            el.addClass('active');
        } else {
            el.removeClass('active');
        }        
        e.stopPropagation();
    })

    $(".treef").click(function (e) {
        bodyClickManager.invoke('tree');
        e.stopPropagation();
    })

    bodyClickManager.init('.container');

    bodyClickManager.register('tree', function () {
        var el = $(".treef");
        el.removeClass('active');
    })

    // 树固定
    $(".treef .fix").click(function () {
        var t = $(this);
        if (t.hasClass('fixed')) {
            t.removeClass('fixed');
            $('.main-content').removeClass('mc-tree-fixed').addClass('mc-tree-notfix');
            $('.treef').removeClass('fixed').addClass('notfixed');
            if (that.page && that.page.my_grid) {
                that.page.my_grid.grid.getView().refresh()
            }            
        } else {
            t.addClass('fixed');
            $('.main-content').addClass('mc-tree-fixed').removeClass('mc-tree-notfix');
            $('.treef').removeClass('notfixed').addClass('fixed');
            if (that.page && that.page.my_grid) {
                that.page.my_grid.grid.getView().refresh()
            }
        }
    })

    $(".treef .refresh").click(function () {
        that.reset();
    })
}

MyTree.prototype.query = function (callback, hideSpin, keepState) {
    var url = this.config.url;
    var that = this;

    $.ajax({
        type: 'get',
        url: url,
        dataType: 'json',
        beforeSend: function () {
            if (!hideSpin) {
                var target = $('.tree .elements').get(0);
                Util.load().spin(target);
            }
        },
        success: function (data) {

            if (!hideSpin) {
                Util.load().spin();
            }

            if (!data || data.error || typeof data.Total === 'undefined') {
                console.log('树查询失败，返回值如下')
                console.log(data);
                return;
            }

            if (that.config.appendRoot) {
                var rootName = that.config.rootName;
                var record = {};
                record[that.config.id_field] = 'root';
                record[that.config.name_field] = that.config.root_name;
                record.ParentId = 'notexsit';
                data.Models.push(record);
            }

            var ks = (typeof keepState === 'boolean' && keepState);
            that.mt.load(data.Models, ks);

            $(".treef .current").html(that.mt.getSelectedNode().nodeName);

            if (callback && typeof (callback) == 'function') {
                callback();
            }
        },
        error: function (req, msg) {
            console.log('树查询失败')
        }
    });
}

MyTree.prototype.reset = function (callback) {
    this.query(callback, false);
}

MyTree.prototype.refresh = function (callback) {
    this.query(callback, true, true);
}