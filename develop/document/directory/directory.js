var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 编辑区正在显示 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'StandardBaseID',
                    'StandardBaseName',
                    'StandardBaseType',
                    'DescriptionInfo',
                    'ParentId',
                    'ParentName',
                    'Path'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '目录名称',
                        dataIndex: 'StandardBaseName',
                        width: 300
                    },
                    {
                        text: '目录描述',
                        dataIndex: 'DescriptionInfo',
                        flex: 0.9
                    },
                    {
                        text: '父目录',
                        dataIndex: 'ParentName',
                        width: 200
                    }
                    ]
                }
            },

            url: '/api/StandardBase/GetTreeDir',
            ps: 8,
            show_delete_column: true,
            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {
        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        //默认固定显示目录树
        var t_spin = $("#spin");
        t_spin.addClass('spinning');
        $('.main-content').addClass('main-content-left-spinned');
        $('.tree-selector').addClass('spinning');
        if (that.page && that.page.my_grid) {
            that.page.my_grid.grid.getView().refresh();
        }

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                StandardBaseID: that.current_tree_select_id
            });
        });

        // 绑定添加按钮事件
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

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();
    },

    on_grid_row_delete_clicked: function (record) {
        if (record.ParentId == 'root') {
            Util.alert('此目录项不允许删除！');
            return false;
        }

        var that = this;
        var data = { StandardBaseID: record.StandardBaseID };
        data.StandardBaseType = 0;

        Util.ajax_delete({
            data: data,
            error_msg: '删除失败，请先删除该目录中的文件和子目录',
            model: 'StandardBase',
            confirm_msg: function () {
                return '确认要删除名称为' + record.StandardBaseName + '的记录吗?';
            },
            success: function () {
                that.my_tree.query(null, true, true);
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.ParentId = this.current_tree_select_id;
        data.StandardBaseType = 0;
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'StandardBase',
            success: function () {
                that.my_tree.query(null, true, true);
                that.my_grid.reload();
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
        data.RelationshipParth = $('#Path').val();
        data.StandardBaseType = 0;
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'StandardBase',
            success: function () {
                that.my_tree.query(null, true, true);
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (data.StandardBaseID) {
            return '请先清空列表选中状态，再进行添加';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.StandardBaseName) {
            return "名称不可以为空";
        }
    },

    on_grid_row_selected: function (data, index) {
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
        //this.clear();

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

    my_tree: null,

    tree_config: {
        url: '/api/StandardBase/GetTreeDir?StandardBaseID=root',
        root_name: '文档目录',
        id_field: 'StandardBaseID',
        name_field: 'StandardBaseName',
    },

    tree_init: function () {
        var that = this;

        // 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
        this.my_tree = new MyTree(this, this.tree_config);

        // 绑定树节点点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        // 查询树
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            that.clear();
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            $('#ParentId').val('root');
            that.my_grid.query({ StandardBaseID: '' });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || "";
        this.my_grid.query({ StandardBaseID: id });
    }
}