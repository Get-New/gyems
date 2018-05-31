var Page = {
    my_grid: null,
    current_importconfigID: '',

    my_grid_config: {
        store_config: {
            fields: [
                'importconfigID',
                'importconfigtable',
                'importconfigcode',
                'MeasurePropertyID',
                'ITEMNAME',
                'UNITS',
                'MeasurePropertyName'
            ]
        },

        grid_config: {
            columns: {
                items: [
                {
                    text: '产品单元',
                    dataIndex: 'MeasurePropertyName',
                    flex: 0.9
                }, {
                    text: '生产数据编码',
                    dataIndex: 'importconfigcode',
                    flex: 0.9
                }, {
                    text: '编码对应名称',
                    dataIndex: 'ITEMNAME',
                    flex: 0.9
                }
                ]
            },
        },

        url: '/api/EngeryMeasureproperty/GetImportConfig',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        $('#search-name').val('');

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                MeasurePropertyName: $('#search-name').val()
            });

            that.clear();
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;

                that.my_grid.query({
                    MeasurePropertyName: $('#search-name').val()
                });

                that.clear();
            }
        });

        // 页面加载后先查询一次
        this.my_grid.query({
            MeasurePropertyName: $('#search-name').val()
        });

        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-add').click(function () {
            that.submit_add();
        });

        // edit
        $('#submit-edit').click(function () {
            that.submit_edit();
        });

        // change事件
        $('#MeasurePropertyID').change(function () {
            $('#importconfigcode').val('');
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('产品同步配置');
        });

        this.right_panel_init();
        this.my_form_init();
        this.prepare_select_source_ProductUnit();

        // 初始化表单
        this.clear();
    },

    //准备产品单元下拉框
    prepare_select_source_ProductUnit: function () {
        $('#MeasurePropertyID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetProductUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: '', MeasurePropertyTypes: 8 },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#MeasurePropertyID').append("<option value='-1'>没有产品单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#MeasurePropertyID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#MeasurePropertyID').append(option);
                }

                $('#MeasurePropertyID').val('');
            }
        })
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();
        data.importconfigtable = 't_import_sybase';

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/EngeryMeasureproperty/AddImportConfig',
            type: 'post',
            data: data,
            success: function (data) {
                if (data.Errors) {
                    Util.alert('添加失败：' + data.Errors.Message);
                    return;
                }

                that.my_grid.reload();
                Util.alert('添加成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误：' + errorThrown);
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
        data.importconfigtable = 't_import_sybase';

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/EngeryMeasureproperty/EditImportConfig',
            type: 'put',
            data: data,
            success: function (data) {
                if (data.Errors) {
                    Util.alert('修改失败：' + data.Errors.Message);
                    return;
                }

                that.my_grid.reload();
                Util.alert('修改成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误：' + errorThrown);
            }
        });
    },

    validate: function (data) {
        if (!data.importconfigcode) {
            return "请填写生产数据编码";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;

        that.current_importconfigID = '';
        that.current_importconfigID = record.importconfigID;

        Util.confirm('确认要删除' + record.MeasurePropertyName + '的产品同步配置吗', function () {
            $.ajax({
                url: '/api/EngeryMeasureproperty/DeleteImportConfig',
                type: 'delete',
                data: { importconfigID: that.current_importconfigID },
                success: function (data) {
                    if (data.Errors) {
                        Util.alert('删除失败：' + data.Errors.Message);
                        return;
                    }

                    that.my_grid.reload();
                    Util.alert('删除成功');
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    Util.alert('出现错误：' + errorThrown);
                }
            });
        });
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
    }
};