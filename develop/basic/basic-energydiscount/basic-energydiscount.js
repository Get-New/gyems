﻿var Page = {
    my_grid: null,

    /*弹出框*/
    //my_grid_unit: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 编辑区正在显示 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'DescriptionInfo',
                    'EnergyDiscountId',
                    'EnergyDiscountValue',
                    'EnergyMediumId',
                    'EnergyMediumName',
                    'UnitMeasureId',
                    'UnitMeasureName',
                    'EnergydiscountEffect'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '能源种类',
                        dataIndex: 'EnergyMediumName',
                        width: 200
                    }, {
                        text: '折标系数',
                        dataIndex: 'EnergyDiscountValue',
                        width: 200
                    }, {
                        text: '折标单位',
                        dataIndex: 'UnitMeasureName',
                        width: 200
                    }, {
                        text: '生效时间',
                        dataIndex: 'EnergydiscountEffect',
                        width: 200
                    }, {
                        text: '备注',
                        dataIndex: 'DescriptionInfo',
                        flex: 0.6
                    }]
                }
            },

            url: '/api/EnergyDiscount/GetPage',
            ps: 8,
            show_delete_column: true,
            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {
        laydate({
            elem: '#EnergydiscountEffect',
            event: 'click',
            istime: false,
            istoday: true,
            start: laydate.now(+1, "YYYY-MM-DD"),
            format: 'YYYY-MM-DD'
            //choose: function () {
            //    if (!Page.check_date()) {
            //        Util.alert('生效时间最早为明天');
            //    }
            //}
        });

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

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
            //if (!Page.check_date()) {
            //    Util.alert("历史记录不允许编辑");
            //    return false;
            //}
            that.submit_edit('edit');
        });

        // 页面加载后立即查询一次的函数，用于回调
        that.my_grid.query({ RootId: '' });

        //初始化下拉框数据源（传入回调函数）
        //this.prepare_select_source();

        $('#search-unit').click(function () {
            that.prepare_select_source_UnitMeasureId();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能源折标管理');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();
        this.prepare_select_source_UnitMeasureId();

        //初始化表单
        this.clear();
    },

    check_date: function () {
        function toDate(str) {
            var sd = str.split("-");
            return new Date(sd[0], sd[1], sd[2]);
        }

        var date1 = toDate(laydate.now(1, "YYYY-MM-DD"));
        var date2 = toDate($('#EnergydiscountEffect').val());

        if (date1 > date2) {
            $('#EnergydiscountEffect').val('');
            return false;
        }
        else {
            return true;
        }
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

    on_grid_row_delete_clicked: function (record) {
        //if (!Page.check_date()) {
        //    return "历史记录不允许删除！";
        //}

        var that = this;
        var data = { EnergyDiscountId: record.EnergyDiscountId };

        Util.ajax_delete({
            data: data,
            model: 'EnergyDiscount',
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
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'EnergyDiscount',
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
            model: 'EnergyDiscount',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.EnergyMediumId) {
            return '请选择能源种类';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.EnergyDiscountValue) {
            return "请填写折标系数";
        }
        if (!data.UnitMeasureId) {
            return "请选择计量单位";
        }
        if (!data.EnergydiscountEffect) {
            return "请选择生效时间";
        }
        //if (!Page.check_date()) {
        //    return "生效时间最早为明天";
        //}
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
        //$('.close-button').click(function () {
        //    var callback = function () {
        //        that.my_grid.grid.getView().refresh()
        //    }
        //    //that.right_panel.hide_right_panel(function () { that.my_grid.grid.getView().refresh() });
        //})
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
            this.clear();
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({ RootId: '' });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || "";
        $('#EnergyMediumId').val(this.current_tree_select_id);
        this.my_grid.query({ RootId: id });
        this.prepare_select_source_UnitMeasureId();
    }
}