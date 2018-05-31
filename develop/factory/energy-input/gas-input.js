var Page = {

    my_grid: null,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                   'MeasurePropertyID',
                   'MeasurePropertyName',
                   'UnitMeasureId',
                   'UnitMeasureName',
                   'StatisticsID',
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
                        text: '日期',
                        dataIndex: 'RecordDateTime',
                        width: 200
                    }, {
                        text: '名称',
                        dataIndex: 'MeasurePropertyName',
                        width: 200
                    }, {
                        text: '数量',
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

            url: '/api/ProductClassstatistics/GetPage',
            ps: 0, // 0表示不进行分页
            show_delete_column: true,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
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

        // 绑定查询按钮事件
        //$('#query').click(function () {
        //    that.my_grid.query({ ModelBaseID: that.current_tree_select_id, MeasurePropertyID: that.current_group_select_id, MeasurePropertyName: this.current_group_select_MeasurePropertyName, RecordMonthTime: $('#search-month').val() });
        //});

        // 新增
        $('#query').click(function () {
            that.my_grid.query({ RecordMonthTime: $('#search-month').val() });
        });

        // add
        $('#submit-add').click(function () {
            if ($('#StatisticsID').val()) {
                Util.alert('当天记录已存在，请点击“保存编辑”');
                return false;
            }
            that.submit_add();
        })

        // edit
        $('#submit-edit').click(function () {
            if (!$('#StatisticsID').val()) {
                Util.alert('当天记录不存在，请点击“提交新增”');
                return false;
            }
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('录入数据导出');
        })

        //this.tree_init();
        this.right_panel_init();
        this.my_form_init();
        //that.my_group.query({ MeasurePropertyName: '', RootId: 'root' });
        this.my_grid.query({ RecordMonthTime: $('#search-month').val() });

        // 初始化表单
        this.clear();

    },

    month_onchange: function () {
        if (this.my_grid) {
            this.clear();
            this.my_grid.query({ RecordMonthTime: $('#search-month').val() });
        }
    },

    on_grid_row_delete_clicked: function (record) {

        var that = this;
        var data = { StatisticsID: record.StatisticsID };

        Util.ajax_delete({
            data: data,
            model: 'ProductClassstatistics',
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
            //validator: that.validate_add,
            model: 'ProductClassstatistics',
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
            model: 'ProductClassstatistics',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.MeasurePropertyID) {
            return '请选择名称';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.RecordDateTime) {
            return "请选择日期";
        }
        if (!data.ProductMeasureData) {
            return "请填写数量";
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
};






