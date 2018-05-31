var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            fields: ['EnergyMediumId', 'EnergyMediumName', 'EnergyMediumLevel', 'EnergyMediumOrder',
                'EnergyMediumSource', 'EnergyMediumWork', 'ParentId', 'ParentName', 'BusinessSort',
                'Path', 'DescriptionInfo', 'UnitMeasureId', 'UnitMeasureName',
                'RelationshipParth']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '名称',
                    dataIndex: 'EnergyMediumName',
                    flex: 1.5
                }, {
                    text: 'ID',
                    dataIndex: 'EnergyMediumId',
                    flex: 1.5
                }, {
                    text: '计量单位',
                    dataIndex: 'UnitMeasureName',
                    flex: 1.5
                },
                //{
                //    text: '介质类型',
                //    dataIndex: 'EnergyMediumOrder',
                //    width: 150,
                //    renderer: function (value) {
                //        switch (value) {
                //            case 1: return "一次能源";
                //            case 2: return "二次能源";
                //            default: return "";
                //        }
                //    }
                //}, {
                //    text: '介质来源',
                //    dataIndex: 'EnergyMediumSource',
                //    width: 150,
                //    renderer: function (value) {
                //        switch (value) {
                //            case 1: return "生产";
                //            case 2: return "外购";
                //            default: return "";
                //        }
                //    }
                //}, {
                //    text: '耗能工质',
                //    dataIndex: 'EnergyMediumWork',
                //    width: 150,
                //    renderer: function (value) {
                //        switch (value) {
                //            case 1: return "是";
                //            case 2: return "否";
                //            default: return "";
                //        }
                //    }
                //},
                {
                    text: '备注',
                    dataIndex: 'DescriptionInfo',
                    flex: 0.9
                }]
            },
        },

        url: '/api/EnergyMedium/GetPage',
        ps: 12,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ EnergyMediumName: $('#search-name').val(), RootId: that.current_tree_select_id });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({ EnergyMediumName: $('#search-name').val(), RootId: that.current_tree_select_id });
            }
        });

        // 页面加载后先查询一次
        this.my_grid.query({ EnergyMediumName: '', RootId: that.current_tree_select_id });

        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-add').click(function () {
            that.submit_add();
        });

        // add
        $('#submit-edit').click(function () {
            that.submit_edit();
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能源种类管理');
        });

        this.right_panel_init();
        this.my_form_init();
        //this.tree_init();
        this.prepare_select_source_UnitMeasureId();

        // 初始化表单
        this.clear();
    },

    // 准备 查询单位 下拉框的数据源
    prepare_select_source_UnitMeasureId: function () {
        $('#UnitMeasureId').val('').html('');

        $.ajax({
            url: '/api/UnitMeasure/GetList',
            type: 'get',
            dataType: 'json',
            //data:{ UnitClassId: '', UnitMeasureName: ''},
            success: function (data) {
                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载能源单位失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#UnitMeasureId').append("<option value='-1'>没有能源单位可供选择</option>");
                    $('#UnitMeasureId').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.UnitmeasureId).html(item.UnitmeasureName);
                    $('#UnitMeasureId').append(option);
                }

                $('#UnitMeasureId').val('');
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { EnergyMediumId: record.EnergyMediumId };

        Util.ajax_delete({
            data: data,
            model: 'EnergyMedium',
            confirm_msg: function () {
                return '确认要删除名称为' + record.EnergyMediumName + '的记录吗?';
            },
            success: function () {
                that.my_grid.reload();
                //that.my_tree.refresh();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.ParentId = that.current_tree_select_id;
        //data.RelationshipParth = data.Path;
        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'EnergyMedium',
            success: function () {
                that.my_grid.reload();
                //that.my_tree.refresh();
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
        //data.RelationshipParth = data.Path;
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'EnergyMedium',
            success: function () {
                that.my_grid.reload();
                //that.my_tree.refresh();
            }
        });
    },

    validate: function (data) {
        if (!data.EnergyMediumName) {
            return "请填写名称";
        }
        if (!data.UnitMeasureId) {
            return "请选择单位";
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.grid.getView().refresh();
        };

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();

        var callback = function () {
            that.my_grid.grid.getView().refresh()
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        this.my_form.clear();
    },

    right_panel: null,

    right_panel_config: {
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
        url: '/api/EnergyMedium/GetTree',
        root_name: '能源种类',
        id_field: 'EnergyMediumId',
        name_field: 'EnergyMediumName',
        appendRoot: true
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
            that.my_grid.query({ EnergyMediumName: $('#search-name').val(), RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.clear()
        $('#search-name').val('');
        this.current_tree_select_id = id;
        this.my_grid.query({ EnergyMediumName: $('#search-name').val(), RootId: id });
        this.prepare_select_source_UnitMeasureId();
    }
};