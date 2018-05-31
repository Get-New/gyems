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
                    'BusinessSort',
                    'CreateTime',
                    'CreatorName',
                    'DescriptionInfo',
                    'EditTime',
                    'EditorName',
                    'ModelBaseCode',
                    'ModelBaseId',
                    'ModelBaseName',
                    'ParentId',
                    'ParentName',
                    'Path',
                    'ModelBaseLevel',
                    'ModelBaseType',
                    'ModelBaseState'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '编号',
                        dataIndex: 'ModelBaseId',
                        hidden: true,
                        hiddenMode: 'visibility'
                    }, {
                        text: '名称',
                        dataIndex: 'ModelBaseName',
                        width: 300
                    }, {
                        text: '级别',
                        dataIndex: 'ModelBaseLevel',
                        width: 120
                    }, {
                        text: '节点类型',
                        dataIndex: 'ModelBaseType',
                        width: 180,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "工厂";
                                case 2: return "车间";
                                case 3: return "工序";
                                case 4: return "其他";
                                default: return "";
                            }
                        }
                    }, {
                        text: '单位属性',
                        dataIndex: 'ModelBaseState',
                        width: 180,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "计量";
                                case 2: return "管理";
                                default: return "";
                            }
                        }
                    }, {
                        text: '备注',
                        dataIndex: 'DescriptionInfo',
                        flex: 0.6
                    }]
                }
            },

            url: '/api/FactoryModelbase/GetPage',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
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

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                ModelBaseName: '', RootId: that.current_tree_select_id
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    ModelBaseName: '', RootId: that.current_tree_select_id
                });
            }
        });

        // 绑定添加按钮事件
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        //form添加
        $('#submit-add').click(function () {
            $('#ModelBaseLevel').val('');
            if (!that.current_tree_select_id) {
                Util.alert('请选择父节点');
                return false;
            }
            if (that.current_tree_select_id == 'root') {
                $('#ModelBaseLevel').val(1);
            } else {
                Page.prepare_level();
            }

            setTimeout(temp, 300);
            function temp() {
                that.submit_add();
            }
        });

        //form修改
        $('#submit-edit').click(function () {
            that.submit_edit('edit');
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('导出文件');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();
    },

    //计算结构等级
    prepare_level: function () {
        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: this.current_tree_select_id },
            success: function (data) {
                var temp_level = data.Models[0].ModelBaseLevel + 1;
                $('#ModelBaseLevel').val(temp_level);
            }
        })
    },

    //prepare_edit: function () {
    //    $.ajax({
    //        url: '/api/FactoryModelbase/GetPage',
    //        type: 'get',
    //        dataType: 'json',
    //        data: { ModelBaseName: '', RootId: this.current_tree_select_id },
    //        success: function (data) {
    //            var temp_path = data.Models[0].Path;
    //            var len = temp_path.match(/\|/g); //正则表达式
    //            $('#ModelBaseLevel').val(len.length);

    //        }
    //    })
    //},

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { ModelBaseId: record.ModelBaseId };
        data.ModelBaseLevel = record.ModelBaseLevel;
        if (data.ModelBaseLevel == 1) {
            Util.alert('1级工厂不允许删除！');
            return false;
        }

        Util.ajax_delete({
            data: data,
            model: 'FactoryModelbase',
            confirm_msg: function () {
                return '确认要删除名称为' + record.ModelBaseName + '的记录吗?';
            },
            success: function () {
                that.my_tree.query();
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.ParentId = this.current_tree_select_id;
        data.Path = '';
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'FactoryModelbase',
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
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'FactoryModelbase',
            success: function () {
                that.my_tree.query(null, true, true);
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.ModelBaseName) {
            return "请填写名称";
        }
        if (!data.ModelBaseType) {
            return "请选择节点类型";
        }
        if (!data.ModelBaseState) {
            return "请选择单位属性";
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
        url: '/api/FactoryModelbase/GetTree',
        root_name: '能源工厂',
        id_field: 'ModelBaseId',
        name_field: 'ModelBaseName'
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
            that.my_tree.reset(function (id) {
                that.tree_node_click(id);
            });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id;
        $('#ParentId').val(id);
        this.my_grid.query({ ModelBaseName: '', RootId: id });
    }
}