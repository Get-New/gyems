var Page = {

    my_grid: null,
    my_group: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    //当前产品group选中的id
    current_group_select_id: '',

    //当前产品group选中的Name
    current_group_select_ProductBaseName: '',

    //当前产品group选中的单位
    current_group_select_UnitMeasureName: '',

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                   'ProductBaseID',
                   'ProductBaseName',
                   'UnitMeasureId',
                   'UnitMeasureName',
                   'ProductPlanID',
                   'RecordDateTime',
                   'ProductMeasureData',
                   'DESCRIPTIONINFO'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '计划生产日期',
                        dataIndex: 'RecordDateTime',
                        width: 200
                    }, {
                        text: '产品名称',
                        dataIndex: 'ProductBaseName',
                        width: 200
                    }, {
                        text: '计划产品数量',
                        dataIndex: 'ProductMeasureData',
                        width: 200
                    }, {
                        text: '单位',
                        dataIndex: 'UnitMeasureName',
                        width: 100
                    }, {
                        text: '备注',
                        dataIndex: 'DESCRIPTIONINFO',
                        flex: 0.6
                    }
                    ]
                }
            },

            url: '/api/ProductClassplan/GetPage',
            ps: 0, // 0表示不进行分页
            show_delete_column: true,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    my_group_config: function () {
        return {
            store_config: {
                fields: [
                    'ModelBaseId',
                    'ProductBaseId',
                    'ProductBaseName',
                    'UnitMeasureId',
                    'UnitMeasureName'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0,
                        align: 'left'
                    },
                    items: [
                        { text: '<pre>- 产  品  名  称 -</pre>', dataIndex: 'ProductBaseName', width: 350 }
                    ]
                }
            },

            url: '/api/ProductBase/GetPage',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: false,
            row_select_handler: 'on_group_row_selected',

            grid_container_id: 'collect-group-container'

        }
    },

    init: function () {

        laydate({
            elem: '#search-month',
            event: 'click',
            istime: false,
            ismonth: true,
            format: 'YYYY-MM',
            choose: function () {
                Page.month_onchange();
            }
        });

        $('#search-month').val(laydate.now(0, "YYYY-MM"));

        var that = this;
        
        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        this.my_group = new MyGrid(this, this.my_group_config());

        // 绑定查询按钮事件
        //$('#query').click(function () {
        //    that.my_grid.query({ ModelBaseID: that.current_tree_select_id, ProductBaseID: that.current_group_select_id, ProductBaseName: this.current_group_select_ProductBaseName, RecordMonthTime: $('#search-month').val() });
        //});

        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-add').click(function () {
            if ($('#ProductPlanID').val()) {
                Util.alert('当天记录已存在，请点击“保存编辑”');
                return false;
            }
            that.submit_add();
        })

        // edit
        $('#submit-edit').click(function () {
            if (!$('#ProductPlanID').val()) {
                Util.alert('当天记录不存在，请点击“提交新增”');
                return false;
            }
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('计划产品产量');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();
        that.my_group.query({ ProductBaseName: '', RootId: 'root' });
        this.my_grid.query({ ModelBaseID: 'root', ProductBaseID: '', ProductBaseName: '', RecordMonthTime: $('#search-month').val() });

        // 初始化表单
        this.clear();

    },

    month_onchange: function () {
        if (this.my_grid) {
            this.clear();
            this.my_grid.query({ ModelBaseID: this.current_tree_select_id, ProductBaseID: this.current_group_select_id, ProductBaseName: this.current_group_select_ProductBaseName, RecordMonthTime: $('#search-month').val() });
        }
    },

    on_grid_row_delete_clicked: function (record) {

        var that = this;
        var data = { ProductPlanID: record.ProductPlanID };

        Util.ajax_delete({
            data: data,
            model: 'ProductClassPlan',
            confirm_msg: function () {
                return '确认要删除这条记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.RecordDateTime = $('#RecordDateTime').val();
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'ProductClassPlan',
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
        data.RecordDateTime = $('#RecordDateTime').val();
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'ProductClassPlan',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.ProductBaseID) {
            return '请选择计划产品';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.RecordDateTime) {
            return "请选择计划生产日期";
        }
        if (!data.ProductMeasureData) {
            return "请填写计划产品数量";
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        if ($('#UnitMeasureName').val() == '') {
            $('#UnitMeasureName').val(this.current_group_select_UnitMeasureName);
        }
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
        //this.my_group.clear_selection();

        var callback = function () {
            that.my_grid.refresh_view();
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
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            $('#search-month').val(laydate.now(0, "YYYY/MM"));
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.current_group_select_id = '';
            that.my_group.clear_selection();
            that.my_grid.query({ ModelBaseID: '', ProductBaseID: '', ProductBaseName: '', RecordMonthTime: $('#search-month').val() });
            that.my_group.query({ ProductBaseName: '', RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.my_group.clear_selection();
        this.current_tree_select_id = id;
        this.current_group_select_id = null;
        this.my_group.query({ ProductBaseName: '', RootId: this.current_tree_select_id });
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id, ProductBaseID: '', ProductBaseName: '', RecordMonthTime: $('#search-month').val() });
    },

    on_group_row_selected: function (data) {
        this.clear();
        this.current_group_select_id = data.ProductBaseId;
        this.current_group_select_ProductBaseName = data.ProductBaseName;
        this.current_group_select_UnitMeasureName = data.UnitMeasureName;
        $('#ProductBaseID').val(data.ProductBaseId);
        $('#ProductBaseName').val(data.ProductBaseName);
        $('#UnitMeasureName').val(data.UnitMeasureName);
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id, ProductBaseID: this.current_group_select_id, ProductBaseName: this.current_group_select_ProductBaseName, RecordMonthTime: $('#search-month').val() });;
    },

};






