
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




// 树形结构
function MyTree(page, config) {

    // 树的配置
    this.config;

    // 指向页面对象
    this.page = page;

    // 节点点击处理函数
    this.node_click_handler = null;

    // 当前选中的节点
    this.current_select_id = 'root';

    // 当前选中的节点的名字
    this.current_select_name = '';

    // 当前选中节点的层级
    this.current_select_level = '0';

    // 当前展开的节点的Id，用数组描述
    this.current_open_node_ids = ['root'];

    this.init(config);
}

MyTree.prototype.bind_node_click_event_handler = function (handler) {
    if (typeof handler == 'function') {
        this.node_click_handler = handler;
    }
}

MyTree.prototype.init = function (config) {

    var check = this.check_config(config);

    if (check) {
        var msg = '树配置有误，错误信息为：' + check;
        console.log(msg);
        return;
    }

    // 使用默认配置和自定义配置，组成最终使用的配置
    this.config = $.extend(true, {}, this.config_defaults, config);
}

MyTree.prototype.query = function (callback, hideSpin) {
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

            that.tree_ajax_success(data);

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

    this.current_select_id = 'root';
    this.current_open_node_ids = ['root'];
    this.current_select_level = 0;
    this.current_select_name = this.config.root_name;
     
    this.query(callback);
}

MyTree.prototype.refresh = function (callback) {
    this.query(callback, true);
}

MyTree.prototype.tree_ajax_success = function (data) {        
    var that = this;

    var list = data.Models;
 
    for (var i in list) {
        if (typeof list[i].ParentId != 'string') {
            list[i].ParentId = 'root';
        }
    }

    $('.tree span').unbind('click');
    $('.tree .elements').html('');

    $('.tree').html('');

    // 添加根节点
    var el = $('.tree');
    var span = $("<span class='root' node_id='root'></span>");    
    var i = $("<i class='icon-minus-sign icon-sign' node_id='root'></i>");
    span.append(i);
    span.append(this.config.root_name);
    span.attr('node_name', this.config.root_name);
    el.append(span);
    var root_ul = $("<ul class='elements'></ul>")
    el.append(root_ul);

    if (_.contains(this.current_open_node_ids, 'root')) {
        root_ul.addClass('opened');
    } else {
        root_ul.addClass('closed');
    }

    /* 渲染树状节点（递归） */
    var id_field = this.config.id_field;
    var name_field = this.config.name_field;
    var pid_field = 'ParentId';
    
    var root = { id: 'root', c: [], ul: $('.tree .elements'), level: 0, name: this.config.root_name };
    add_nodes(root)
        
    // 定义添加节点方法，参数parent是父节点，包含三个字段
    // id：节点的Id
    // c：数组，维护该父节点的所有子节点
    // ul：dom节点，属于该父节点，可以在其中添加li子节点
    // 该方法传入一个父节点，然后查询它的子节点，将子节点添加到父节点中（在js对象中添加，同时在dom添加）
    // 最后递归的对每个子节点调用该方法
    function add_nodes(parent) {

        // 父节点的Id
        var pid = parent.id;

        // 父节点的level
        var p_level = parent.level;

        // 查找父节点的所有子节点
        var nodes = _.select(list, pid_field, pid);

        // 遍历子节点
        for (var i in nodes) {

            // 遍历到的某一个子节点
            var node = nodes[i];

            // 创建节点对象 包含id、c、ul三个字段
            var obj = {
                id: node[id_field],
                c: [],
                ul: $('<ul>'),
                level: p_level + 1,
                name: node[name_field]
            };

            if (!obj.id) {
                return;
            }

            // 递归 对子节点调用方法
            add_nodes(obj);

            // 将子节点对象添加到父节点的c字段
            parent.c.push(obj);

            /*

            每个节点dom结构大致如下
            <li>                                                                 <--- 这个li是每个节点的最外层部分
                 <span node_id="xxx">                                            <--- 这个span包含了一个图标，以及节点的名字  属性node_id是节点Id
                     <i class="icon-sign icon-minus-sign" node_id="xxx"></i>     <--- 这个i节点是个图标，用于展开/收起子节点；有子节点的节点才会包含这个
                     节点名字                                                    <--- 这里是节点名字
                 </span>        
                 <ul class='opened'>                                             <--- 这个ul存放节点的子节点
                 </ul>
            </li> 

            */

            var li = $('<li>');
            var span = $('<span>');
            span.attr('node_id', obj.id);
            span.attr('node_name', obj.name);
            span.attr('level', obj.level)
            li.append(span);
            if (obj.c.length > 0) {
                var icon = $('<i>');
                icon.attr('node_id', obj.id);                
                icon.attr('level', obj.level);
                if (_.contains(that.current_open_node_ids, obj.id)) {
                    icon.addClass('icon-minus-sign icon-sign');
                    obj.ul.addClass('opened');
                } else {
                    icon.addClass('icon-plus-sign icon-sign');
                    obj.ul.addClass('closed');
                }

                span.append(icon);
            } else {
                span.addClass('leaf');
            }

            span.append(node[name_field]);
            li.append(obj.ul);
            parent.ul.append(li);
        }
    }
    var tree = root.c;

    $('.tree li:has(ul)');        

    $('.icon-sign').on('click', function (e) {

        var ul = $(this).parent().parent().find(' > ul');
        if (ul.hasClass('opened')) {
            ul.hide('fast', function () {
                ul.removeClass('opened').addClass('closed');
            });
            
            $(this).addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            ul.show('fast', function () {
                ul.removeClass('closed').addClass('opened');
            });
            
            $(this).addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }

        that.current_open_node_ids = [];
        $('.icon-minus-sign').each(function () {
            that.current_open_node_ids.push($(this).attr('node_id'));
        })
        e.stopPropagation();
    });
    
    $(".tree span[node_id='" + this.current_select_id + "']").addClass('selected');

    // 节点点击事件
    $('.tree span').on('click', function (e) {

        if ($(this).hasClass('selected')) {
            return;
        }

        $('.tree span.selected').removeClass('selected');
        $(this).addClass('selected');


        // 点击的Id
        var id = $(this).attr('node_id');
        var name = $(this).attr('node_name');
        var level = $(this).attr('level')
        that.current_select_id = id;
        that.current_select_name = name;
        that.current_select_level = parseInt(level);

        // 调用处理函数
        if (typeof that.node_click_handler == 'function') {
            that.node_click_handler.call(that.page, id, name, level);
        }        

        // 停止传播
        e.stopPropagation();
    });
}

MyTree.prototype.config_defaults = {
    root_name: '请配置根节点名字'
};

MyTree.prototype.check_config = function (config) {
    if (!config) {
        return '配置为空';
    }

    if (typeof config.url != 'string') {
        return 'url不正确';
    }
}