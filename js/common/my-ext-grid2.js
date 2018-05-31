
/*
    该文件定义对象MyGrid    
    对Extjs4的store和grid进行封装，具体包含以下功能    
    1. grid数据查询、显示
    2. 分页，生成并显示页码
    3. 行选择、双击、行删除事件

    作者 Zhu Hui
    ※ 有问题请联系作者，不要修改该文件

    <<<--- 配置项 --->>>

    store_config 对store的配置，请参考Extjs文档 http://docs.sencha.com/extjs/4.2.3/#!/api/Ext.data.Store
    grid_config 对grid的配置，请参考Extjs文档 http://docs.sencha.com/extjs/4.2.3/#!/api/Ext.grid.Panel    
    ps 每页条数，默认是9
    url 数据查询api的url
    show_paging 是否显示分页页码，默认是true
    show_delete_column 是否显示删除列
    grid_container_id 容器id，默认是grid-container
    pagin_selector 页码框的选择器，默认是.paginList
    is_report 是否为报表
    corner_icon 报表左上角小格的图片

    row_select_handler 字符串，行选择事件处理函数名
        --> 参数一 data 选择的行的数据
        --> 参数二 index 行号

    dblclick_handler 字符串，grid双击事件处理函数名

    delete_handler 字符串，行删除事件处理函数名
        --> 参数一 data 要删除的数据

    <<<--- 接口函数 --->>>

    query 查询
        --> 参数一 查询条件
        --> 参数二 回调函数

    reload 重新查询，使用上一次的查询条件

    get_last_selected 获得最后选中的行

    clear_selection 清空选中

    export 导出excel
*/

// Grid管理
function MyGrid(page, config) {

    // 当前页数(初始为1)
    this.page_id = 1;

    // 当前从第几条开始
    this.ofs = 0;

    // 每页条数
    this.ps = 9;

    // 排序列
    this.sort_column = '';

    // 是否降序
    this.sort_desc = false;

    // 查询结果数据
    this.list = null;

    // 查询总条数
    this.total = 0;

    // ext store对象
    this.store = null;

    // ext grid对象
    this.grid = null;

    // 是否初始查询（页面刚加载，或刚刚点击了“查询”按钮）
    this.is_initialization = true;

    // 配置
    this.config = null;

    // 查询条件
    this.condition = null;

    // 指向页面对象
    this.page = page;

    // grid容器的jquery选择器
    this.grid_container_selector = '';

    this.init(config);
}

// 默认配置
MyGrid.prototype.config_defaults = {

    ps: 9,
    show_paging: true,
    is_report: false,

    store_config: {

    },
    grid_config: {
        multiSelect: true,
        viewConfig: {
            getRowClass: function (record, rowIndex) {
                if (rowIndex % 2 == 0) {
                    return 'odd-task-row';
                }
                return 'even-task-row';
            },
            enableTextSelection: true,
            loadMask: true
        },
        columns: {
            defaults: {
                sortable: false,
                menuDisabled: true,
                flex: 1,
                align: 'center'
            }
        },
        width: "100%",
        height: "100%",
        enableColumnMove: false,
        enableColumnResize: false,

        listeners: {
            select: null,
            dblclick: {
                element: 'body',
                fn: null
            }
        }
    },

    pagin_selector: '.paginList',

    grid_container_id: 'grid-container'
};

// 初始化
MyGrid.prototype.init = function (config) {
    var that = this;

    // 使用默认配置和自定义配置，组成最终使用的配置
    this.config = $.extend(true, {}, this.config_defaults, config);

    // 设置容器
    this.config.grid_config.renderTo = Ext.get(this.config.grid_container_id);

    this.grid_container_selector = '#' + this.config.grid_container_id;

    if ($(this.grid_container_selector).length == 0) {
        throw new Error('找不到grid，请检查grid_container_id是否正确')
    }

    if ($(this.grid_container_selector).height() == 0) {
        throw new Error('grid高度未设置')
    }

    // 添加删除列
    if (this.config.show_delete_column) {

        // 统一判断权限
        if (window.top.G) {
            var auths = window.top.G.GetAuth();
            if (auths.indexOf('delete') >= 0) {
                var column = {
                    text: ' ',
                    dataIndex: '',
                    flex: 0.08,
                    renderer: function () {
                        var el = "<div class='garbage'>";
                        return el;
                    }
                };
                this.config.grid_config.columns.items.splice(0, 0, column);

                // 绑定删除事件
                $(this.grid_container_selector).on('click', '.garbage', function () {

                    var record_id = $(this).parents('.x-grid-row').attr('data-recordid');
                    var record = that.get_record_by_id(record_id);
                    that.call_page_method(that.config.delete_handler, record);
                })
            }
        }
    }

    // 绑定行单击事件
    this.config.grid_config.listeners.select = function (scope, record, index, eOpts) {
        that.call_page_method(that.config.row_select_handler, record.data, index);
    }

    // 绑定行双击事件
    this.config.grid_config.listeners.dblclick.fn = function (e) {

        // 双击时禁止选中文本
        var clearSlct = "getSelection" in window
        ? function () {
            window.getSelection().removeAllRanges();
        } : function () {
            document.selection.empty();
        };
        clearSlct();

        that.call_page_method(that.config.dblclick_handler);
    }

    // 每页显示条数
    this.ps = this.config.ps;

    // 创建store
    this.store = Ext.create('Ext.data.Store', this.config.store_config);

    // 创建grid
    this.grid = Ext.create('Ext.grid.Panel', this.config.grid_config);

    // 将grid和store绑定
    this.grid.bindStore(this.store);

    // 窗口调整大小事件处理
    Ext.EventManager.onWindowResize(function () {
        that.grid.getView().refresh()
        that.grid.getView().setOverflowXY('auto', 'hidden');
    })
}

MyGrid.prototype.call_page_method = function (method_name) {

    if (typeof method_name != 'string') {
        console.log('MyGrid.call_page_method中，method_name不是字符串，其值如下');
        console.log(method_name);
        return;
    }

    var page = this.page;

    var func = page[method_name];

    if (typeof func != 'function') {
        console.log('MyGrid.call_page_method中，找不到调用的方法，方法名如下');
        console.log(method_name);
        return;
    }

    var args = [];

    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    func.apply(this.page, args)
}

// 初始查询（点击查询按钮或页面初次加载时，调用该方法）
MyGrid.prototype.query = function (condition, callback) {

    // 重置页码、排序
    this.page_id = 1;
    this.ofs = (this.page_id - 1) * this.ps;
    this.sort_column = '';
    this.sort_desc = false;

    // 标记为初始查询
    this.is_initialization = true;

    // 记录查询条件
    this.condition = condition;

    // 调用查询方法
    this.do_query(condition, callback);
}

// 重新查询
MyGrid.prototype.reload = function (callback) {
    this.do_query(this.condition, callback);
}

// 查询数据
MyGrid.prototype.do_query = function (condition, callback) {

    // 设置查询条件
    condition = condition || {};
    var c = {
        ofs: this.ofs,
        ps: this.ps,
        sort_column: this.sort_column,
        sort_desc: this.sort_desc
    };
    condition = $.extend({}, c, condition);

    var that = this;

    // 发起请求
    $.ajax({
        type: 'get',
        url: that.config.url,
        dataType: 'json',
        data: condition,
        success: function (data) {

            if (!data || data.Success === false || (!_.isNumber(data.Total) && !_.isNumber(data.total))) {
                console.log('在my-ext-grid中出现了错误，数据查询失败')
                console.log('当前请求的url是：' + that.config.url)
                console.log('当前请求数据如下：')
                console.log(condition);
                console.log('返回信息信息如下：')
                console.log(data);
                alert('查询数据时出现错误');
                return;
            }

            that.list = data.Models || data.list;
            that.total = data.Total || data.total;
            that.store.loadData(that.list);
            that.show_paging();

            if (that.config.is_report) {
                var url = that.config.corner_icon;
                $(that.grid_container_selector + ' .x-column-header-first').css('background', "url(" + url + ")");
            }

            if (callback) {
                callback(data);
            }
        },
        error: function (req, msg) {
            console.log(msg);
            //alert('查询失败');
        }
    });
}


MyGrid.prototype.go_to_page = function (page_id) {
    this.page_id = page_id;
    this.ofs = (this.page_id - 1) * this.ps;

    this.is_initialization = false;

    this.do_query(this.condition);

    if (typeof this.on_page_changed == 'function' && this.page) {
        this.on_page_changed.call(this.page);
    }
},

MyGrid.prototype.show_paging = function () {

    if (!this.config.show_paging)
        return;

    if (!this.is_initialization) return;

    var that = this;
    var total = this.total;

    var page_size = this.ps;
    var selector = this.config.pagin_selector;

    if (page_size) {
        $(selector).pagination({
            dataSource: function (done) {
                var result = [];
                for (var i = 0; i < total; i++) {
                    result.push(i);
                }
                done(result);
            },
            pageSize: page_size,
            totalNumber: total,
            callback: function (data, pagination) {
                var page_id = pagination.pageNumber;

                if (pagination.direction) {
                    that.go_to_page(page_id);
                }
            }
        });
    }
}

MyGrid.prototype.get_selection = function () {
    var s = this.grid.getSelectionModel().getSelection();
    return s;
}

MyGrid.prototype.get_last_selected = function () {
    var s = this.grid.getSelectionModel().getLastSelected();
    return s;
}

MyGrid.prototype.clear_selection = function () {
    this.grid.getSelectionModel().deselectAll();
}

MyGrid.prototype.get_record_by_id = function (record_id) {

    for (var i in this.store.data.items) {
        var item = this.store.data.items[i];
        if (item.internalId == record_id) {
            return item.data;
        }
    }
}

MyGrid.prototype.refresh_view = function () {

    this.grid.getView().refresh();
}

Ext.grid.GridPanel.prototype.ExportData = function (opt) {
    opt = opt || {};

    //Get the array of columns from a grid
    var me = this, columns = [], data = [];
    Ext.each(me.columns, function (col) {
        if (col.dataIndex) columns.push(col);
    });
    //Sometimes there's no colum header text (when using icons)
    Ext.each(columns, function (column) {
        if (!column.text || column.text == '&nbsp;') {
            column.text = column.dataIndex;
        }
    });

    //Build a useable array of store data for the XTemplate
    me.store.data.each(function (item) {
        var convertedData = {};

        //apply renderers from column model
        Ext.iterate(item.data, function (key, value) {
            Ext.each(columns, function (column) {
                if (column.dataIndex == key) {
                    if (column.renderer) {
                        if (column.xtype === 'templatecolumn') {
                            convertedData[key] = column.renderer(value, {}, item);
                        } else {
                            convertedData[key] = column.renderer(value, undefined, undefined, undefined, columns.indexOf(column), undefined, me.view);
                        }
                    } else {
                        convertedData[key] = value;
                    }
                    if (typeof convertedData[key] === 'string') {
                        //convertedData[key] = Ext.util.Format.htmlToText(convertedData[key]);
                    }
                    return false;
                }
            });
        });

        data.push(convertedData);
    });

    //generate finale template to be applied with the data
    var headings = [], body = [], str;

    headings = opt.headers ? new Ext.XTemplate(
        '<tr>',
          '<tpl for=".">',
            '<th>{text}</th>',
          '</tpl>',
        '</tr>'
    ).apply(columns) : '';
    body = new Ext.XTemplate(
        '<tr>',
          '<tpl for=".">',
            '<td>\{{dataIndex}\}</td>',
          '</tpl>',
        '</tr>'
    ).apply(columns);

    var str = [
            Ext.String.format('{0}\n<tpl for=".">{1}\n</tpl>', headings, body)
    ].join('\n');

    return new Ext.XTemplate(str).apply(data);
};

MyGrid.prototype.exportExcel = function (filename) {

    var filename = filename || '导出文件';

    var html = this.grid.ExportData({
        format: 'html',
        headers: true
    });

    console.log(html);

    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "_blank");
    form.attr("method", "post");
    form.attr("action", '/api/ExcelOut/GetExcel');

    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "body");
    input1.attr("value", escape(html));
    $("body").append(form);

    var input2 = $("<input>");
    input2.attr("type", "hidden");
    input2.attr("name", "filename");
    input2.attr("value", filename);
    $("body").append(form);
    form.append(input1);
    form.append(input2);

    form.submit();
    form.remove();
}