
/*
    该文件定义对象MyTree    
    功能如下：
    1. 加载左侧的树结构
    2. 树节点的展开、收起
    3. 树节点选中

    作者 Zhu Hui
    ※ 有问题请联系作者，不要修改该文件

    配置项描述
    url 树查询api地址
    root_name 根节点名字
    id_field 节点的Id字段名
    name_field 节点的Name字段名
    auto_expand_level 自动展开到第几级，默认是1（还没实现，有空再做）

    属性
    current_select_id 当前选中节点的Id
    current_select_name 当前选中节点的Name
    current_select_level 当前选中节点的层级
    current_open_node_ids 当前所有正在展开的节点的Id数组

    方法
    query  查询数据
    reset  回到重置状态
    refresh   刷新数据，保持当前的选中和打开状态（基本同query方法，但是不会显示“加载中”框）
*/

if (typeof mtree !== 'function')
    throw new Error('模块mtree加载失败');


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
        $("#tree-current").html(name);
        var el = $(".tree-selector");
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
    $(".tree-head").click(function (e) {

        var el = $(".tree-selector");

        if (!el.hasClass('active')) {
            el.addClass('active');
        } else {
            el.removeClass('active');
        }

        e.stopPropagation();
    })

    // 点击了树本身，不要隐藏树
    $(".tree-selector").click(function (e) {

        var el = $(".group-selector");
        el.removeClass('active');

        e.stopPropagation();
    })

    // 点击空白 隐藏树
    $(".container").click(function (e) {
        var el = $(".group-selector");
        el.removeClass('active');

        var el2 = $(".tree-selector");
        el2.removeClass('active');
    })

    // 树固定
    $("#spin").click(function () {
        var t = $(this);
        if (t.hasClass('spinning')) {
            t.removeClass('spinning');
            $('.main-content').removeClass('main-content-left-spinned');
            $('.tree-selector').removeClass('spinning');
            if (that.page && that.page.my_grid) {
                that.page.my_grid.grid.getView().refresh()
            }            

        } else {
            t.addClass('spinning');
            $('.main-content').addClass('main-content-left-spinned');
            $('.tree-selector').addClass('spinning');
            if (that.page && that.page.my_grid) {
                that.page.my_grid.grid.getView().refresh()
            }
        }
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

            var currId = that.mt.getSelectedNode().nodeId;
            var currName = that.mt.getSelectedNode().nodeName;
            $("#tree-current").html(currName);

            if (callback && typeof (callback) == 'function') {
                callback(currId, currName);
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