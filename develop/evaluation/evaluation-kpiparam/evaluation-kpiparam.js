var Page = {
    my_grid: null,

    /* 当前树种选中的Id */
    current_tree_select_id: '',

    /* 编辑区初始显示状态 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'EngeryKPIParamID',
                    'ModelBaseID',
                    'ModelBaseName',
                    'EngeryKPIParamName',
                    'EngeryKPIParamValue',
                    'UnitMeasureID',
                    'UnitMeasureName',
                    'DescriptionInfo'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [
                        //{ text: '序号', dataIndex: 'UnitMeasureID', width: 100 },
                        { text: '参数名称', dataIndex: 'EngeryKPIParamName', width: 200 },
                        { text: '车间名称', dataIndex: 'ModelBaseName', width: 200 },
                        { text: '国家标准值', dataIndex: 'EngeryKPIParamValue', width: 300 },
                        { text: '单位', dataIndex: 'UnitMeasureName', width: 200 },
                        { text: '备注', dataIndex: 'DescriptionInfo', flex: 0.8 }
                    ]
                }
            },

            url: '/api/EngeryKPIParam/GetPage',
            ps: 8,
            show_delete_column: true,
            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'

        }
    },

    init: function () {

        var that = this;

        //初始化的MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        //查询按钮
        $('#query').click(function () {
            that.my_grid.query({
                ModelBaseID: that.current_tree_select_id, EngeryKPIParamName: $('#search-name').val(), EngeryKPIParamID: ''
            });
            //that.clear;
        });

        //添加按钮
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

        //form查询单位
        $('#search-unit').click(function () {
            Page.prepare_select_source();
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('绩效参数');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();

        //this.my_grid.query({ ModelBaseID: '', EngeryKPIParamID: '', EngeryKPIParamName: '' });

        this.prepare_select_source();

    },

    // 准备下拉框的数据源
    prepare_select_source: function () {

        $('#UnitMeasureID').val('').html('');

        $.ajax({
            url: '/api/UnitMeasure/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                var EnergyUnitList = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    Util.alert('加载能源单位失败');
                    return;
                }

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#UnitMeasureID').append("<option value='-1'>没有能源单位可供选择</option>");
                    $('#UnitMeasureID').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.UnitmeasureId).html(item.UnitmeasureName);
                    $('#UnitMeasureID').append(option);
                }

                $('#UnitMeasureID').val('');
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { EngeryKPIParamID: record.EngeryKPIParamID };

        Util.ajax_delete({
            data: data,
            model: 'EngeryKPIParam',
            confirm_msg: function () {
                return '确认要删除名称为' + record.EngeryKPIParamName + '的记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'EngeryKPIParam',
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
            data: data,
            validator: that.validate,
            model: 'EngeryKPIParam',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.ModelBaseID) {
            return '请选择工厂部门节点';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.EngeryKPIParamName) {
            return "名称不可以为空";
        }
        if (!data.EngeryKPIParamValue) {
            return "数值不可以为空";
        }
        if (!data.UnitMeasureID) {
            return "请选择计量单位";
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
        //$('.right-content form input').val('');
        $('input').val('');
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
        url: '/api/FactoryModelbase/GetTreeLevel2',
        root_name: '能源工厂',
        id_field: 'ModelBaseId',
        name_field: 'ModelBaseName'
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
            that.my_grid.query({ ModelBaseID: this.current_tree_select_id, EngeryKPIParamID: '', EngeryKPIParamName: '' });
            that.my_tree.reset();
            that.clear();
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || '';
        $('#ModelBaseID').val(this.current_tree_select_id)
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id, EngeryKPIParamID: '', EngeryKPIParamName: '' });
        this.prepare_select_source();
    }

};