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
                    'EngeryKPICalcID',
                    'ModelBaseID',
                    'ModelBaseName',
                    'EngeryKPIID',
                    'EngeryKPIName',
                    'MeasurePropertyID',
                    'MeasurePropertyName',
                    'ProductBaseID',
                    'ProductBaseName',
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
                        { text: '指标名称', dataIndex: 'EngeryKPIName', width: 200 },
                        { text: '部门', dataIndex: 'ModelBaseName', width: 200 },
                        { text: '能耗计量点', dataIndex: 'MeasurePropertyName', width: 200 },
                        { text: '产品计量点', dataIndex: 'ProductBaseName', width: 200 },
                        { text: '描述', dataIndex: 'DescriptionInfo', flex: 0.9 }
                    ]
                }
            },

            url: '/api/EngeryKPICalc/GetPage',
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
                ModelBaseID: that.current_tree_select_id, EngeryKPIName: $('#search-name').val()
            });
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

        ////form查询指标名称
        //$('#search-kpiparam').click(function () {
        //    Page.prepare_select_source_EngeryKPIName();
        //});

        ////form查询能耗计量点
        //$('#search-MeasurePropertyID').click(function () {
        //    Page.prepare_select_source_MeasurePropertyID();
        //});

        ////form查询产品计量点
        //$('#search-ProductBaseID').click(function () {
        //    Page.prepare_select_source_ProductBaseID();
        //});

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('绩效指标计算');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();

    },

    //准备指标名称的下拉框数据源
    prepare_select_source_EngeryKPIName: function () {

        $('#EngeryKPIName').val('').html('');

        $.ajax({
            url: '/api/EngeryKPI/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseId: this.current_tree_select_id, EngeryKPIID:'', EngeryKPIName:'' },
            success: function (data) {

                var EnergyKPI = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载指标名称失败');
                    return;
                }

                if (!EnergyKPI || !EnergyKPI.length) {
                    $('#EngeryKPIName').append("<option value='-1'>没有指标名称可供选择</option>");
                    $('#EngeryKPIName').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyKPI) {
                    var item = EnergyKPI[i];
                    var option = $('<option>').val(item.EngeryKPIID).html(item.EngeryKPIName);
                    $('#EngeryKPIName').append(option);
                }

                $('#EngeryKPIName').val('');

            }
        })
    },

    //准备能耗计量点的下拉框数据源
    prepare_select_source_MeasurePropertyID: function () {

        $('#MeasurePropertyID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: this.current_tree_select_id, MeasurePropertyName: '' },
            success: function (data) {

                var MeasureProperty = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载能耗计量点失败');
                    return;
                }

                if (!MeasureProperty || !MeasureProperty.length) {
                    $('#MeasurePropertyID').append("<option value='-1'>没有能耗计量点可供选择</option>");
                    $('#MeasurePropertyID').attr("disabled", "disabled");
                    return;
                }

                for (var i in MeasureProperty) {
                    var item = MeasureProperty[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#MeasurePropertyID').append(option);
                }

                $('#MeasurePropertyID').val('');

            }
        })
    },

    //准备产品计量点的下拉框数据源
    prepare_select_source_ProductBaseID: function () {

        $('#ProductBaseID').val('').html('');

        $.ajax({
            url: '/api/ProductBase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { RootId: this.current_tree_select_id, ProductBaseName:'' },
            success: function (data) {

                var ProductBase = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载产品计量点失败');
                    return;
                }

                if (!ProductBase || !ProductBase.length) {
                    $('#ProductBaseID').append("<option value='-1'>没有产品计量点可供选择</option>");
                    //$('#ProductBaseID').attr("disabled", "disabled");
                    return;
                }

                for (var i in ProductBase) {
                    var item = ProductBase[i];
                    var option = $('<option>').val(item.ProductBaseId).html(item.ProductBaseName);
                    $('#ProductBaseID').append(option);
                }

                $('#ProductBaseID').val('');

            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { EngeryKPICalcID: record.EngeryKPICalcID };

        Util.ajax_delete({
            data: data,
            model: 'EngeryKPICalc',
            confirm_msg: function () {
                return '确认要删除该条记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.EngeryKPIID = $('#EngeryKPIName').val();
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'EngeryKPICalc',
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
        data.EngeryKPIID = $('#EngeryKPIName').val();
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'EngeryKPICalc',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.EngeryKPIID) {
            return '请选择绩效指标';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.EngeryKPIName) {
            return "请选择绩效指标";
        }
        if (!data.MeasurePropertyID) {
            return "请选择能耗计量点";
        }
        if (!data.ProductBaseID) {
            return "请选择产品计量点";
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        $('#EngeryKPIName').val(data.EngeryKPIID);
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

    clear: function () {
        this.my_grid.clear_selection();
        $('.right-content form input').val('');
        $('#search-name').val('');
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
            that.clear();
            that.my_tree.reset();
            that.my_grid.query({
                ModelBaseID: '', EngeryKPIName: ''
            });
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || '';
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id, EngeryKPIName: $('#search-name').val() });
        this.prepare_select_source_EngeryKPIName();
        this.prepare_select_source_MeasurePropertyID();
        this.prepare_select_source_ProductBaseID();
    }

};