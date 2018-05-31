var Page = {
    my_grid: null,
    current_tree_select_id: '',
    current_WarningID: '',

    my_grid_config: {
        store_config: {
            fields: [
                'WarningID',
                'UnitID',
                'ComputeCycle',
                'TagName',
                'LowerLimitValue',
                'UpperLimitValue',
                'WarningTimes',
                'WarningDuration',
                'WarningFormulation',
                'ModelBaseID',
                'WarningName',
                'ModelBaseName',
                'MeasurePropertyName'
            ]
        },

        grid_config: {
            columns: {
                items: [
                {
                    text: '工厂模型',
                    dataIndex: 'ModelBaseName',
                    flex: 0.5
                }, {
                    text: '报警名称',
                    dataIndex: 'WarningName',
                    flex: 0.8
                }, {
                    text: '统计单元',
                    dataIndex: 'MeasurePropertyName',
                    flex: 0.8
                }, {
                    text: 'TagName',
                    dataIndex: 'TagName',
                    flex: 0.5
                }, {
                    text: '下限',
                    dataIndex: 'LowerLimitValue',
                    flex: 0.3
                }, {
                    text: '上限',
                    dataIndex: 'UpperLimitValue',
                    flex: 0.5
                }, {
                    text: '触发次数（次）',
                    dataIndex: 'WarningTimes',
                    flex: 0.5
                }, {
                    text: '触发时长（秒）',
                    dataIndex: 'WarningDuration',
                    flex: 0.5
                }
                ]
            },
        },

        url: '/api/WarningConfig/GetPage',
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
                ModelBaseID: that.current_tree_select_id,
                WarningName: $('#search-name').val()
            });

            that.clear();
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;

                that.my_grid.query({
                    ModelBaseID: that.current_tree_select_id,
                    WarningName: $('#search-name').val()
                });

                that.clear();
            }
        });

        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-add').click(function () {
            var tmpModelBaseID = $('#ModelBaseID').val() ? $('#ModelBaseID').val() : that.current_tree_select_id;
            if (!tmpModelBaseID) {
                Util.alert('请选择工厂模型');
                return;
            }
            else {
                $('#ModelBaseID').val(tmpModelBaseID);
                that.submit_add();
            }
        });

        // edit
        $('#submit-edit').click(function () {
            that.submit_edit();
        });

        //change事件
        $('#TempType').change(function () {
            that.get_MeasureProperty($('#TempType').val());
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('报警配置');
        });

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();

        // 初始化表单
        this.clear();
    },

    get_MeasureProperty: function (temp_type) {
        var that = this;
        var tmpModelBaseID = $('#ModelBaseID').val() ? $('#ModelBaseID').val() : that.current_tree_select_id;
        if (temp_type == '用能') {
            that.prepare_select_source_EnergyUnit(tmpModelBaseID);
        }
        else if (temp_type == '绩效') {
            that.prepare_select_source_KPIUnit(tmpModelBaseID);
        }
        else if (temp_type == '成本') {
            that.prepare_select_source_EnergyCostUnit(tmpModelBaseID);
        }
        else if (temp_type == '折标') {
            that.prepare_select_source_StandardCoalUnit(tmpModelBaseID);
        }
        else if (temp_type == '生产') {
            that.prepare_select_source_ProductUnit(tmpModelBaseID);
        }
        else {
            that.prepare_select_source_CurrentUnit(tmpModelBaseID);
        }
    },

    //准备用能单元下拉框
    prepare_select_source_EnergyUnit: function (ModelBaseID) {
        $('#UnitID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetEnergyUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#UnitID').append("<option value='-1'>没有用能单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#UnitID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#UnitID').append(option);
                }

                $('#UnitID').val('');
            }
        })
    },

    //准备绩效单元下拉框
    prepare_select_source_KPIUnit: function (ModelBaseID) {
        $('#UnitID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetKPIUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#UnitID').append("<option value='-1'>没有绩效单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#UnitID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#UnitID').append(option);
                }

                $('#UnitID').val('');
            }
        })
    },

    //准备成本单元下拉框
    prepare_select_source_EnergyCostUnit: function (ModelBaseID) {
        $('#UnitID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetEnergyCostUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#UnitID').append("<option value='-1'>没有成本单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#UnitID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#UnitID').append(option);
                }

                $('#UnitID').val('');
            }
        })
    },

    //准备折标单元下拉框
    prepare_select_source_StandardCoalUnit: function (ModelBaseID) {
        $('#UnitID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetStandardCoalUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#UnitID').append("<option value='-1'>没有折标单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#UnitID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#UnitID').append(option);
                }

                $('#UnitID').val('');
            }
        })
    },

    //准备产品单元下拉框
    prepare_select_source_ProductUnit: function (ModelBaseID) {
        $('#UnitID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetProductUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: ModelBaseID, MeasurePropertyTypes: 8 },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#UnitID').append("<option value='-1'>没有产品单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#UnitID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#UnitID').append(option);
                }

                $('#UnitID').val('');
            }
        })
    },

    //准备当前节点单元下拉框
    prepare_select_source_CurrentUnit: function (ModelBaseID) {
        $('#UnitID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetCurrentUnit',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#UnitID').append("<option value='-1'>没有单元可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#UnitID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#UnitID').append(option);
                }

                $('#UnitID').val('');
            }
        })
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/WarningConfig/Add',
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

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/WarningConfig/Edit',
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
        if (!data.ModelBaseID) {
            return "请选择工厂模型";
        }
        if (!data.WarningName) {
            return "请填写报警名称";
        }
        if (!data.ComputeCycle) {
            return "请选择报警周期";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;

        that.current_WarningID = '';
        that.current_WarningID = record.WarningID;

        Util.confirm('确认要删除这条报警配置吗', function () {
            $.ajax({
                url: '/api/WarningConfig/Delete',
                type: 'delete',
                data: { WarningID: that.current_WarningID },
                success: function (data) {
                    if (data.Errors) {
                        Util.alert('删除失败：' + data.Errors.Message);
                        return;
                    }
                    that.clear();
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
    },

    //工厂树相关
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

        // 查询树 tree加载完成后立即执行一次tree_node_click
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        //// 刷新按钮
        //$('#refresh').click(function () {
        //    that.my_tree.reset();
        //    that.current_tree_select_id = '';
        //    $('#search-name').val('');
        //    that.my_grid.query({
        //        ModelBaseID: 'SetGridNull',
        //        WarningName: 'SetGridNull'
        //    });
        //});
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id, name) {
        var that = this;
        that.clear();

        this.current_tree_select_id = id;

        this.my_grid.query({
            ModelBaseID: that.current_tree_select_id,
            WarningName: $('#search-name').val()
        });

        this.prepare_select_source_CurrentUnit(that.current_tree_select_id);
    }
};