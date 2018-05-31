
var Page = {
    my_grid: null,

    current_tree_select_id: '',


    my_grid_config: {
        store_config: {
            fields: [
                'EnergyPirceID',
                'EnergyPirceName',
                'EnergyMediumID',
                'EnergyMediumName',
                'UnitMeasureID',
                'UnitMeasureName',
                'EnergyPircePrice',
                'EnergyPirceUOM',
                'EnergyPirceDefaultPrice'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                
                    //{ text: '序号', dataIndex: 'UnitMeasureID', width: 100 },
                    { text: '价格名称', dataIndex: 'EnergyPirceName', flex: 1 },
                    { text: '能源种类', dataIndex: 'EnergyMediumName', flex: 1 },
                    { text: '计量单位', dataIndex: 'UnitMeasureName', flex: 1 },
                    { text: '价格', dataIndex: 'EnergyPircePrice', flex: 1 },
                    { text: '价格单位', dataIndex: 'EnergyPirceUOM', flex: 1 }
                ]
            },
   
        },

        url: '/api/EnergyPirce/GetPage',
        show_delete_column: true,
        ps: 8,
        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {

        var that = this;

        // 初始化
        this.my_grid = new MyGrid(this, this.my_grid_config);

        //that.my_grid.query({ EnergyMediumName: '', RootId: that.current_tree_select_id });

        // 初始化下拉框数据源（传入回调函数）
        that.prepare_select_source_UnitMeasureID();

        //$('#query').click(function () {
        //    that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: that.current_tree_select_id });
        //})


        //$('#add').click(function () {
        //    that.on_btn_add_clicked();
        //});

        $('#submit-add').click(function () {
            that.submit_add();
        })


        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('成本管理');
        })

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();

        // 初始化表单
        this.clear();
    },

    //准备 计量单位 的数据源
    prepare_select_source_UnitMeasureID: function () {
        $.ajax({
            url: '/api/EnergyDiscount/GetPage',
            type: 'get',
            dataType: 'json',
            data: { RootId: this.current_tree_select_id, ofs:0, ps:11, sort_column:'', sort_desc:''},
            success: function (data) {

                $('#UnitMeasureName').val('');

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载计量单位失败');
                    return;
                }

                var UnitMeasure = data.Models;

                if (!UnitMeasure || UnitMeasure.length>1) {
                    $('#UnitMeasureName').append("<option value='-1'>请选择具体能源种类</option>");
                    //$('#UnitMeasureID').attr("disabled", "disabled");

                    return;
                }

                $('#UnitMeasureName').val(UnitMeasure[0].UnitMeasureName);

            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { EnergyPirceID: record.EnergyPirceID };

        Util.ajax_delete({
            data: data,
            model: 'EnergyPirce',
            confirm_msg: function () {
                return '确认要删除此路径吗?';
            },
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        //data.ModelBaseID = that.current_tree_select_id;

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'EnergyPirce',
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
        //data.ModelBaseID = that.current_tree_select_id;

        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'EnergyPirce',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    validate: function (data) {
        if (!data.EnergyMediumID) {
            return '请选择能源种类';
        }
        if (!data.EnergyPirceName) {
            return '请填写价格名称';
        }
        if (!data.UnitMeasureName) {
            return '计量单位未配置，请重新选择能源种类';
        }
        if (!data.EnergyPirceUOM) {
            return '请选择价格单位';
        }
        if (!data.EnergyPircePrice) {
            return '请填写价格';
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.grid.getView().refresh()
        }

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
    //*************************************************************************************
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

        //初始化树（第一个参数是页面对象本身的指针，第二个参数是树配置
        this.my_tree = new MyTree(this, this.tree_config);

        //绑定树节点的点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        //查询树
        this.my_tree.query();

        //刷新按钮
        $('#refresh').click(function () {
            that.my_grid.query({ EnergyMediumID: '' });
            that.my_tree.reset();
            that.current_tree_select_id = null;
            //that.clear();
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        this.current_tree_select_id = id || '';
        //this.clear();
        this.prepare_select_source_UnitMeasureID();
        $('#EnergyMediumID').val(this.current_tree_select_id);
        this.my_grid.query({ EnergyMediumID: this.current_tree_select_id });
    }

};