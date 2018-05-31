var Page = {
    my_grid: null,

    /* 编辑区正在显示 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'ConfigID',
                    'ConfigReportName',
                    'MenuName',
                    'MenuID',
                    'DescriptionInfo',
                    'BusinessSort'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '图表名称',
                        dataIndex: 'ConfigReportName',
                        flex: 1.5
                    },
                    {
                        text: '图表ID',
                        dataIndex: 'ConfigID',
                        flex: 1.5
                    },
                    {
                        text: '排序',
                        dataIndex: 'BusinessSort',
                        flex: 1.5
                    },
                    //{
                    //    text: '菜单页面',
                    //    dataIndex: 'MenuName',
                    //    width: 280
                    //},
                    {
                        text: '备注信息',
                        dataIndex: 'DescriptionInfo',
                        flex: 1.5
                    }
                    ]
                }
            },

            url: '/api/ReportConfig/GetOverViewGraph2',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: true, //false,
            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {
        var that = this;

        //模态窗口初始化
        var modeldiv = window.top.document.createElement("div");
        modeldiv.setAttribute('class', 'opacity-div-for-modelwin');
        modeldiv.setAttribute('hidden', '');
        var pdivs = document.getElementsByTagName('div');
        var pos = pdivs[0];
        function insert(newel, elpos) {
            var parent = document.body;
            parent.insertBefore(newel, elpos);
        }
        insert(modeldiv, pos);

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());
        this.my_grid.query({ ConfigReportName: '' });

        $('#query').click(function () {
            that.my_grid.query({
                ConfigReportName: $('#search-name').val()
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    ConfigReportName: $('#search-name').val()
                });
            }
        });

        // 绑定增加按钮事件
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        //form添加
        $('#submit-add').click(function () {
            that.submit_add();
        });

        //form修改
        $('#submit-edit').click(function () {
            that.submit_edit('edit');
        });

        //显示window
        $('#edit_MenuName').click(function () {
            that.window_open();
        });

        //显示window
        $('#edit_MenuID').click(function () {
            that.window_open();
        });

        // 保存
        $('#window-save').click(function () {
            $('#MenuName').val($('#MenuName_W').html());
            $('#MenuID').val($('#MenuID_W').html());
            that.window_close();
        });

        // 取消
        $('#window-cancel').click(function () {
            that.window_close();
        });

        this.right_panel_init();
        this.my_form_init();
        //this.tree_init();

        //初始化表单
        this.clear();
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { ConfigID: record.ConfigID };

        Util.ajax_delete({
            data: data,
            model: 'ReportConfig',
            confirm_msg: function () {
                return '确认要删除名称为' + record.ConfigReportName + '的记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误 错误信息为：' + errorThrown)
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.DescriptionInfo = "首页流向图2.0";
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'ReportConfig',
            success: function () {
                that.my_grid.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误 错误信息为：' + errorThrown)
            }
        });
    },

    submit_edit: function () {
        var that = this;

        var row = that.my_grid.get_last_selected();

        if (!row || !row.data) {
            Util.alert('请先选择一行记录');
            return;
        }

        var data = this.my_form.serialize_data();
        data.DescriptionInfo = "首页流向图2.0";
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'ReportConfig',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.ConfigReportName) {
            return "请填写图表名称";
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;
        that.clear();

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.refresh_view();
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        that.clear();

        var callback = function () {
            that.my_grid.refresh_view();
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        $('.right-content form input').val('');
        $('.right-content form select').val('');
    },

    right_panel: null,

    right_panel_config: {
        selectors: {
            main_content: '.main-content',
            right_content: '.right-content',
        }
    },

    right_panel_init: function () {
        var that = this;

        this.right_panel = new RightPanel(this.right_panel_config);

        // 右侧框的关闭事件
        $('.close-button').click(function () {
            var callback = function () {
                that.my_grid.grid.getView().refresh()
            }
            that.right_panel.hide_right_panel(callback);
        })
    },

    my_form: null,

    my_form_config: {
        selector: 'form',
    },

    my_form_init: function () {
        var that = this;

        // 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form = new MyForm(this, this.my_form_config);
    },

    //用于初始化menu树
    my_tree: null,

    //用于初始化menu树
    tree_config: {
        url: '/api/ManageMenu/GetTree',
        root_name: '所有菜单',
        id_field: 'MenuId',
        name_field: 'MenuName',
        appendRoot: true
    },

    //用于初始化menu树
    tree_init: function () {
        var that = this;

        // 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
        this.my_tree = new MyTree(this, this.tree_config);

        // 绑定树节点点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        // 查询树
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            $('#MenuName_W').html('');
            $('#MenuID_W').html('');
            that.my_tree.reset();
        });
    },

    //menu树点击事件
    tree_node_click: function (id) {
        var that = this;
        $('#MenuName_W').html('');
        $('#MenuID_W').html('');

        var temp_menu_info = that.get_menu_info(id);
        if (temp_menu_info) {
            $('#MenuName_W').html(temp_menu_info.MenuName);
            $('#MenuID_W').html(temp_menu_info.MenuID);
        }
    },

    //获取menu信息
    get_menu_info: function (id) {
        var temp_mennu_info = {};
        $.ajax({
            url: '/api/ManageMenu/GetPage',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { MenuName: '', MenuRootId: id, ofs: 0, ps: 8, sort_column: '', sort_desc: false },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else if (data.Total == '1') {
                    if (data.Models[0] && data.Models[0].MenuUrl) {
                        temp_mennu_info.MenuID = data.Models[0].MenuId;
                        temp_mennu_info.MenuName = data.Models[0].MenuName;
                    }
                }
            }
        });

        return temp_mennu_info;
    },

    window_open: function () {
        $('#MenuName_W').html($('#MenuName').val());
        $('#MenuID_W').html($('#MenuID').val());

        $('.window').fadeIn(50);

        $('.opacity-div-for-modelwin').show()
    },

    window_close: function () {
        var that = this;

        $('.window').hide();

        $('.opacity-div-for-modelwin').hide()

        $('#MenuName_W').html('');
        $('#MenuID_W').html('');

        that.my_tree.reset();
    }
}