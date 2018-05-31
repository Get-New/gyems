
var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',


    my_grid_config: {
        store_config: {
            fields: [
        		'DescriptionInfo',
        		'ModelBaseId',
        		'ProductBaseCode',
        		'ProductBaseId',
        		'ProductBaseName',
        		//'ProductClassId',
				//'ProductClassName',
                'UnitMeasureId',
                'UnitMeasureName'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                     {
                    text: '产品名称',
                    dataIndex: 'ProductBaseName',
                    flex:1
                }, {
                    text: '产品编码',
                    dataIndex: 'ProductBaseCode',
                    flex: 1
                }, {
                    text: '产品单位',
                    dataIndex: 'UnitMeasureName',
                    flex: 1
                }, {
                    text: '产品描述',
                    dataIndex: 'DescriptionInfo',
                    flex: 1.5
                }]
            },

        },

        url: '/api/ProductBase/GetPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,
        
        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        
        this.my_grid = new MyGrid(this, this.my_grid_config);


        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ ProductBaseName: $('#QueryProductBaseName').val(), RootId: that.current_tree_select_id });
            
        });

        // 绑定添加按钮事件
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#search-unit').click(function () {
            that.prepare_select_source_UnitMeasureId();
        })

        this.prepare_select_source_UnitMeasureId();

        that.my_grid.query({ ProductBaseName: '', RootId: that.current_tree_select_id });
        
        //that.prepare_select_source();


        $('#submit-add').click(function () {
            that.submit_add();
        })


        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('产品信息');
        })

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();

        // 初始化表单
        this.clear();
    },

    // 准备 计量单位 下拉框的数据源
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

    //// 准备产品类型下拉框的数据源
    //prepare_select_source: function (callback) {
    //    $.ajax({
    //        url: '/api/ProductBase/Init',
    //        type: 'get',
    //        dataType: 'json',
    //        success: function (data) {

    //            if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
    //                Util.alert('页面初始化失败');
    //                return;
    //            }

    //            var ClassList = data.Models[0].ProductClass;

    //            if (!ClassList || !ClassList.length) {
    //                $('#ProductClassId').append("<option value='-1'>没有产品种类可供选择</option>");
    //                $('#ProductClassId').attr("disabled", "disabled");
    //                return;
    //            }

    //            for (var i in ClassList) {
    //                var item = ClassList[i];
    //                var option = $('<option>').val(item.ProductClassId).html(item.ProductClassName);
    //                $('#ProductClassId').append(option);
    //            }
    //            $('#ProductClassId').val('');

    //            if (typeof callback == 'function') {
    //                callback();
    //            }
    //        }
    //    })
    //},

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { ProductBaseId: record.ProductBaseId ,ProductBaseName:record.ProductBaseName};
        console.log(data)
        Util.ajax_delete({
            data: data,
            model: 'ProductBase',
            confirm_msg: function () {
                return '确认要删除' + data.ProductBaseName + '吗?';
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
        data.ModelBaseId = that.current_tree_select_id;
        console.log(data)

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'ProductBase',
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
            model: 'ProductBase',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    validate: function (data) {
        if (!data.ProductBaseName) {
            return "名称不可以为空"
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
    //******************************************************************************

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
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: 'root' });
        });
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id) {
        var that = this;
        this.current_tree_select_id = id;

        this.my_grid.query({ ProductBaseName: $('#QueryProductBaseName').val(), RootId: that.current_tree_select_id });
        this.prepare_select_source_UnitMeasureId();
        $('#ProductBaseName').val('');
        $('#ProductBaseCode').val('');
        //$('#ProductClassId').val('');
        $('#DescriptionInfo').val('');
    }
}