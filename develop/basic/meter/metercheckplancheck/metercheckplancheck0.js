var Page = {
    
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                   'MeterBaseId',
                   'MeterBaseName',
                   'MeterCheckPlanDoPlanTime',
                   'MeterCheckPlanId',
                   'MeterCheckPlanName',
                   'MeterCheckPlanPlanPerson',
                   'MeterCheckPlanPlanTime',
                   'MeterCheckPlanReason',
                   'MeterCheckPlanSchedule',
                   'MeterCheckPlanState',
                   'MeterCheckPlanType',
                   'ModelBaseId',
                   'ModelBaseName',
                   'MeterCheckPlanCheckState'
                ]
            },

            grid_config: {
                columns: {
                    items: [{
                        text: '工厂模型',
                        dataIndex: 'ModelBaseName',
                        flex: 0.2
                    }, {
                        text: '仪表名称',
                        dataIndex: 'MeterBaseName',
                        flex: 0.2
                    }, {
                        text: '检修项目',
                        dataIndex: 'MeterCheckPlanName',
                        flex: 0.2
                    }, {
                        text: '计划状态',
                        dataIndex: 'MeterCheckPlanState',
                        flex: 0.2,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "待审批";
                                case 2: return "已审批";
                                case 3: return "已执行";
                                default: return "";
                            }
                        }
                    }, {
                        text: '审批状态',
                        dataIndex: 'MeterCheckPlanCheckState',
                        flex: 0.2,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "通过";
                                case 2: return "未通过";
                                default: return "";
                            }
                        }
                    }]
                }
            },

            url: '/api/MeterCheckPlanCheck/GetPage',
            ps: 8,
            show_delete_column: false,

            dblclick_handler: 'on_grid_dblclicked',
        }
    },

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ RootId: that.current_tree_select_id });
        });

        // 页面加载后立即查询一次     
        that.my_grid.query({ RootId: 'root' });

        /* 点击“审批” */
        $('#check').click(function () {
            that.on_btn_check_clicked();
        })

        this.tree_init();
    },

    on_grid_dblclicked: function () {
        this.submit_check();
    },

    on_btn_check_clicked: function () {
        this.submit_check();
    }, 

    submit_check: function () {

        var that = this;

        var row = that.my_grid.get_last_selected();
        var state = $('#MeterCheckPlanCheckState').val();

        if (!row || !row.data) {
            Util.alert('请先选择一行记录');
            return;
        }

        var data = { MeterCheckPlanId: row.data.MeterCheckPlanId, MeterCheckPlanCheckState: state };
        var str = state == '1' ? '审批通过' : '审批未通过';
        var confirm_msg = '确认要将名称为' + row.data.MeterBaseName + '的记录' + str + '吗?';

        Util.ajax({
            url: '/api/MeterCheckPlanCheck/Check',
            type: 'put',
            data: data,
            show_confirm_msg: true,
            confirm_msg: confirm_msg,
            success: function (data) {
                that.my_grid.reload();
            },
            show_success_msg: true,
            success_msg: '操作成功'
        }) 
    },



    my_tree: null,

    tree_config: {
        url: '/api/FactoryModelbase/GetTree',
        root_name: '工厂模型',
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
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({ RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({ RootId: id });
    }
};






