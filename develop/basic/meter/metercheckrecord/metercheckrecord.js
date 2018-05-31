var Page = {
    my_grid: null,
    my_group: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    //当前审批计划grid选中的MeterCheckRecordID
    current_grid_select_MeterCheckRecordID: null,

    //当前审批计划grid选中的MeterCheckPlanCheckReview
    current_grid_select_MeterCheckPlanCheckReview: null,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                       'ModelBaseID',
                       'ModelBaseName',
                       'MeterBaseID',
                       'MeterBaseName',
                       'MeterCheckRecordID',
                       'MeterCheckPlanID',
                       'MeterCheckPlanName',
                       'MeterCheckPlanState',
                       'MeterCheckPlanCheckResult',
                       'MeterCheckRecordRecord',
                       'MeterCheckRecordDoPerson',
                       'MeterCheckRecordDoTime',
                       'MeterCheckRecordWorkTime',
                       'MeterCheckRecordBeginTime',
                       'MeterCheckRecordEndTime',
                       'MeterCheckPlanCheckReview',
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '检修计划名称',
                        dataIndex: 'MeterCheckPlanName',
                        width: 200
                    }, {
                        text: '仪表名称',
                        dataIndex: 'MeterBaseName',
                        width: 200
                    }, {
                        text: '审批结果',
                        dataIndex: 'MeterCheckPlanCheckResult',
                        width: 200,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "通过";
                                case 2: return "未通过";
                                default: return "待审批";
                            }
                        }
                    }, {
                        text: '执行结果审核',
                        dataIndex: 'MeterCheckPlanCheckReview',
                        width: 200,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "执行结果已审核";
                                default: return "未审核";
                            }
                        }
                    }, {
                        text: '检修内容',
                        dataIndex: 'MeterCheckRecordRecord',
                        width: 200
                    }, {
                        text: '检修人',
                        dataIndex: 'MeterCheckRecordDoPerson',
                        width: 200
                    }, {
                        text: '开始时间',
                        dataIndex: 'MeterCheckRecordBeginTime',
                        width: 200
                    },
                    {
                        text: '结束时间',
                        dataIndex: 'MeterCheckRecordEndTime',
                        width: 200
                    }, {
                        text: '检修工时',
                        dataIndex: 'MeterCheckRecordWorkTime',
                        width: 200
                    }]
                },
            },

            url: '/api/MeterCheckRecord/GetPage',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: false,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked'
        }
    },

    my_group_config: function () {
        return {
            store_config: {
                fields: [
                    'MeterBaseId',
                    'MeterBaseName'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0,
                        align: 'left'
                    },
                    items: [
                        { text: '<pre>- 仪  表  名  称 -</pre>', dataIndex: 'MeterBaseName', width: 350 }
                    ]
                }
            },

            url: '/api/MeterBase/GetPage',
            //ps: 8,
            show_delete_column: false,
            row_select_handler: 'on_group_row_selected',

            grid_container_id: 'collect-group-container'
        }
    },

    init: function () {
        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());
        this.my_group = new MyGrid(this, this.my_group_config());

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ ModelBaseID: that.current_tree_select_id, MeterBaseID: $('#MeterBaseID').val() });
        });

        // 页面加载后立即查询一次
        //this.my_group.query({ ModelBaseId: 'root', MeterBaseName: '' });
        //that.my_grid.query({ ModelBaseID: 'root', MeterBaseID: '' });

        // 编辑按钮
        $('#edit').click(function () {
            that.on_btn_add_clicked();
        });

        // add or edit
        $('#submit-edit').click(function () {
            if (Page.current_grid_select_MeterCheckPlanCheckReview == '1') {
                Util.alert('执行结果已审核，不允许修改！');
                return false;
            }
            console.log("Page.current_grid_select_MeterCheckRecordID:");
            console.log(Page.current_grid_select_MeterCheckRecordID);
            if (Page.current_grid_select_MeterCheckRecordID) {
                that.submit_edit();
            }
            else {
                that.submit_add();
            }
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('计划执行记录');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();

        var row = that.my_grid.get_last_selected();
        if (!row || !row.data) {
            Util.alert('请先选择一行记录');
            return;
        }

        Util.ajax_add({
            success_msg: '记录成功', //自定义提示信息
            data: data,
            validator: that.validate,
            model: 'MeterCheckRecord',
            success: function () {
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
            success_msg: '编辑成功', //自定义提示信息
            data: data,
            validator: that.validate,
            model: 'MeterCheckRecord',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate: function (data) {
        if (!data.MeterCheckRecordRecord) {
            return "请输入修理记录内容";
        }
        if (!data.MeterCheckRecordDoPerson) {
            return "请输入修理人";
        }
        if (!data.MeterCheckRecordBeginTime) {
            return "请输入开始时间";
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        Page.current_grid_select_MeterCheckRecordID = $('#MeterCheckRecordID').val();
        Page.current_grid_select_MeterCheckPlanCheckReview = data.MeterCheckPlanCheckReview;
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.refresh_view();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();

        var callback = function () {
            that.my_grid.refresh_view();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        this.my_form.clear();
    },

    right_panel: null,

    right_panel_config: {
        selectors: {
            main_content: '.grid-container',
            right_content: '.right-content',
        }
    },

    right_panel_init: function () {
        var that = this;

        this.right_panel = new RightPanel(this.right_panel_config);

        // 右侧框的关闭事件
        $('.close-button').click(function () {
            var callback = function () {
                that.my_grid.grid.getView().refresh();
                $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
            }
            that.right_panel.hide_right_panel(callback);
            $('#collect-group-container').attr('style', '')
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
            that.my_tree.reset();
            that.clear();
            that.current_tree_select_id = 'root';
            that.my_group.query({ ModelBaseId: this.current_tree_select_id, MeterBaseName: '' });
            that.my_grid.query({ ModelBaseID: 'root', MeterBaseID: null });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.my_group.clear_selection();
        this.current_tree_select_id = id;
        this.current_group_select_id = null;
        this.my_group.query({ ModelBaseId: this.current_tree_select_id, MeterBaseName: '' });
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id, MeterBaseID: $('#MeterBaseID').val() });
    },

    on_group_row_selected: function (data) {
        this.clear();
        $('#MeterBaseID').val(data.MeterBaseId);
        $('#MeterBaseName').val(data.MeterBaseName);
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id, MeterBaseID: $('#MeterBaseID').val(), MeterCheckPlanName: $('#search-name').val() });;
    }
};