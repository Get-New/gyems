var Page = {
    my_grid: null,

    //当前选中列表行的工厂模型id
    current_selected_modelbase_id: '',

    my_grid_config: {
        store_config: {
            fields: [
            'ReConfigId',
            'Report_UnitId',
            'RatioId',
            'BeginDate',
            'EndDate',
            'isDelete',
            'Report_HandleState',
            'DESCRIPTION_INFO',
            'LASTMODIFY_TIME'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                {
                    text: '名称',
                    dataIndex: 'DESCRIPTION_INFO',
                    flex: 2.0
                },
                {
                    text: '单元ID',
                    dataIndex: 'Report_UnitId',
                    flex: 1.5
                },
                {
                    text: '系数ID',
                    dataIndex: 'RatioId',
                    flex: 1.5
                },
                {
                    text: '开始时间',
                    dataIndex: 'BeginDate',
                    flex: 1.5
                },
                {
                    text: '结束时间',
                    dataIndex: 'EndDate',
                    flex: 1.5
                },
                {
                    text: '提交时间',
                    dataIndex: 'LASTMODIFY_TIME',
                    flex: 1.5
                },
                {
                    text: '计算完成',
                    dataIndex: 'Report_HandleState',
                    flex: 1.0,
                    renderer: function (value) {
                        switch (value) {
                            case 0: return "否";
                            case 1: return "是";
                            default: return ""
                        }
                    }
                }
                ]
            },
        },

        url: '/api/ReportRestatistic/GetCurrentPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: false

        //row_select_handler: 'on_grid_row_selected',
        //dblclick_handler: 'on_grid_dblclicked'
        //delete_handler: 'on_grid_row_delete_clicked'
    },

    //***************************************************内置函数****************************8

    init: function () {
        laydate({
            elem: '#BeginDate',
            event: 'click'
        });
        laydate({
            elem: '#EndDate',
            event: 'click'
        });

        var that = this;

        //模态窗口初始化
        var modeldiv = window.top.document.createElement("div");
        modeldiv.setAttribute('class', 'opacity-div-for-modelwin');
        modeldiv.setAttribute('hidden', '');
        var pdivs = document.getElementsByTagName('div');
        var pos = pdivs[0];
        function insert(newel, elpos) {
            var parent = document.body;
            parent.insertBefore(newel, elpos);
        }
        insert(modeldiv, pos);

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 页面加载后立即查询一次的函数
        this.my_grid.query({ DESCRIPTION_INFO: $('#search-name').val() });

        $('#query').click(function () {
            that.my_grid.query({ DESCRIPTION_INFO: $('#search-name').val() });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({ DESCRIPTION_INFO: $('#search-name').val() });
            }
        });

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            that.submit_add();
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('重新计算');
        });

        $('#TempType').change(function () {
            $('#Report_UnitId').val('');
            $('#RatioId').val('');
            $('#DESCRIPTION_INFO').val('');
        });

        //显示window
        $('#edit-Report_UnitId').click(function () {
            that.window_open();
        });

        //显示window
        $('#edit-RatioId').click(function () {
            that.window_open();
        });

        //显示window
        $('#edit-DESCRIPTION_INFO').click(function () {
            that.window_open();
        });

        //点击模态窗口时关闭预览
        //$(".opacity-div-for-modelwin").click(function () {
        //    that.window_close();
        //})

        this.prepare_window_event();

        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    // 准备能源介质的下拉框数据
    prepare_select_source_EnergyMedium: function (ModelBaseID) {
        $('#EnergyMediumID').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#EnergyMediumID').append("<option value='-1'>没有介质可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMediumID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumID').append(option);
                }

                $('#EnergyMediumID').val('');
            }
        })
    },

    // 准备筛选部门下拉框的数据源
    prepare_select_source_ModelBaseID_1: function (ModelBaseID) {
        $('#ModelBaseID_1').val('').html('');
        $('#ModelBaseID_2').val('').html('');
        $('#ModelBaseID_3').val('').html('');
        $('#ModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#ModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_1').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ModelBaseID_1').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#ModelBaseID_1').append(option);
                }
            }
        })
    },

    // 准备筛选工序下拉框的数据源
    prepare_select_source_ModelBaseID_2: function (ModelBaseID) {
        $('#ModelBaseID_2').val('').html('');
        $('#ModelBaseID_3').val('').html('');
        $('#ModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#ModelBaseID_2').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_2').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ModelBaseID_2').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#ModelBaseID_2').append(option);
                }

                $('#ModelBaseID_2').val('');
            }
        })
    },

    // 准备筛选子工序下拉框的数据源
    prepare_select_source_ModelBaseID_3: function (ModelBaseID) {
        $('#ModelBaseID_3').val('').html('');
        $('#ModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#ModelBaseID_3').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ModelBaseID_3').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#ModelBaseID_3').append(option);
                }

                $('#ModelBaseID_3').val('');
            }
        })
    },

    // 准备筛选子工序下拉框的数据源
    prepare_select_source_ModelBaseID_4: function (ModelBaseID) {
        $('#ModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#ModelBaseID_4').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ModelBaseID_4').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#ModelBaseID_4').append(option);
                }

                $('#ModelBaseID_4').val('');
            }
        })
    },

    //弹出框 统计单元的下拉框数据
    prepare_select_source_EnergyUnit: function (ModelBaseID, EnergyMediumID, MeasurePropertyName) {
        $('#MeasurePropertyName_W').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetCurrentUnit',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: ModelBaseID, EnergyMediumId: EnergyMediumID, MeasurePropertyName: MeasurePropertyName },
            success: function (data) {
                var MeasureProperty = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    return;
                }

                if (!MeasureProperty || !MeasureProperty.length) {
                    return;
                }

                for (var i in MeasureProperty) {
                    var item = MeasureProperty[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html('[' + item.MeasurePropertyName + ']');
                    $('#MeasurePropertyName_W').append(option);
                }

                //$('#MeasurePropertyName_W').val('');
            }
        })
    },

    //准备 价格系数 的下拉框数据源
    prepare_select_source_Price: function () {
        $('#MeterPointName_W1').val('').html('');

        $.ajax({
            url: '/api/BasicEfficacious/GetPageWithEnergy',
            type: 'get',
            dataType: 'json',
            data: {
                EnergyMediumId: '', EfficaciousType: '价格系数',
                ofs: 0, ps: 999999, sort_column: '', sort_desc: false
            },
            success: function (data) {
                var MeterPoint = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    return;
                }

                if (!MeterPoint || !MeterPoint.length) {
                    return;
                }

                for (var i in MeterPoint) {
                    var item = MeterPoint[i];
                    var option = $('<option>').val(item.EfficaciousId).html('{' + item.EfficaciousName + '}');
                    $('#MeterPointName_W1').append(option);
                }
            }
        })
    },

    //准备 折标系数 的下拉框数据源
    prepare_select_source_Coal: function () {
        $('#MeterPointName_W2').val('').html('');

        $.ajax({
            url: '/api/BasicEfficacious/GetPageWithEnergy',
            type: 'get',
            dataType: 'json',
            data: {
                EnergyMediumId: '', EfficaciousType: '折标系数',
                ofs: 0, ps: 999999, sort_column: '', sort_desc: false
            },
            success: function (data) {
                var MeterPoint = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    return;
                }

                if (!MeterPoint || !MeterPoint.length) {
                    return;
                }

                for (var i in MeterPoint) {
                    var item = MeterPoint[i];
                    var option = $('<option>').val(item.EfficaciousId).html('{' + item.EfficaciousName + '}');
                    $('#MeterPointName_W2').append(option);
                }

                //$('#MeterPointName_W').val('');
            }
        })
    },

    // 绩效指标 下拉框数据
    //prepare_select_source_Efficacious: function (ModelBaseID) {
    //    $('#RelativeTargetID').val('').html('');

    //    $.ajax({
    //        url: '/api/BasicEfficacious/GetPageWithFactory',
    //        type: 'get',
    //        dataType: 'json',
    //        async: false,
    //        data: { ModelBaseId: ModelBaseID, EfficaciousType: '绩效系数', ofs: 0, ps: 1000, sort_column: '', sort_desc: false },
    //        success: function (data) {
    //            if (!data.Models || !data.Models.length) {
    //                return;
    //            }

    //            var option = $('<option>').val('').html('');
    //            $('#RelativeTargetID').append(option);

    //            for (var i in data.Models) {
    //                var item = data.Models[i];
    //                var option = $('<option>').val(item.EfficaciousId).html(item.EfficaciousName);
    //                $('#RelativeTargetID').append(option);
    //            }

    //            $('#RelativeTargetID').val('');
    //        }
    //    })
    //},

    //能源计划单元 下拉框数据
    prepare_select_source_EnergyUnitPlan: function (ModelBaseID, EnergyMediumID) {
        $('#RelativeTargetID').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetEnergyUnit',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: ModelBaseID, EnergyMediumId: EnergyMediumID, MeasurePropertyTypes: '7' },
            success: function (data) {
                var MeasureProperty = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    return;
                }

                if (!MeasureProperty || !MeasureProperty.length) {
                    return;
                }

                for (var i in MeasureProperty) {
                    var item = MeasureProperty[i];
                    var option = $('<option>').val(item.MeasurePropertyID).html('[' + item.MeasurePropertyName + ']');
                    $('#RelativeTargetID').append(option);
                }

                $('#RelativeTargetID').val('');
            }
        })
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();
        data.Report_HandleState = 0;
        data.Report_UnitId = $('#Report_UnitId').val();
        data.RatioId = $('#RatioId').val();
        data.DESCRIPTION_INFO = $('#DESCRIPTION_INFO').val();

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'ReportRestatistic',
            success: function () {
                that.my_grid.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('提示：' + errorThrown)
            }
        });
    },

    //*********************************************注意事**************************************************

    validate: function (data) {
        if (!(data.Report_UnitId || data.RatioId)) {
            return "请正确选择相关ID";
        }
        if (!data.BeginDate) {
            return "请选择开始日期";
        }
        if (!data.EndDate) {
            return "请选择结束日期";
        }
        if (!(data.DESCRIPTION_INFO)) {
            return "备注信息不能为空";
        }
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
        $('select').val('');
        $('input').val('');
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
    //**************************************************引入树***************************8

    prepare_window_event: function () {
        var that = this;

        //onchange事件
        $('#ModelBaseID_1').change(function () {
            that.prepare_select_source_ModelBaseID_2($('#ModelBaseID_1').val());
            var tmpID1 = $('#ModelBaseID_4').val() ? $('#ModelBaseID_4').val() : $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID1;
            that.window_query();
        });

        //onchange事件
        $('#ModelBaseID_2').change(function () {
            that.prepare_select_source_ModelBaseID_3($('#ModelBaseID_2').val());
            var tmpID2 = $('#ModelBaseID_4').val() ? $('#ModelBaseID_4').val() : $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID2;
            that.window_query();
        });

        //onchange事件
        $('#ModelBaseID_3').change(function () {
            that.prepare_select_source_ModelBaseID_4($('#ModelBaseID_3').val());
            var tmpID3 = $('#ModelBaseID_4').val() ? $('#ModelBaseID_4').val() : $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID3;
            that.window_query();
        });

        //onchange事件
        $('#ModelBaseID_4').change(function () {
            var tmpID4 = $('#ModelBaseID_4').val() ? $('#ModelBaseID_4').val() : $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID4;
            that.window_query();
        });

        $('#MeasurePropertyName_S').val('');
        $('#select_by_select_area1').click(function () {
            that.window_query();
        });

        // 统计单元 选定
        $('#select_measureproperty').click(function () {
            $('#DESCRIPTIONINFO_W').html($('#MeasurePropertyName_W option:selected').text());
            $('#MeasurePropertyCalcFormula_W').html($('#MeasurePropertyName_W').val());
        });

        // 成本系数 选定
        $('#select_price').click(function () {
            $('#DESCRIPTIONINFO_W').html($('#MeterPointName_W1 option:selected').text());
            $('#MeasurePropertyCalcFormula_W').html($('#MeterPointName_W1').val());
        });

        // 折标系数 选定
        $('#select_coal').click(function () {
            $('#DESCRIPTIONINFO_W').html($('#MeterPointName_W2 option:selected').text());
            $('#MeasurePropertyCalcFormula_W').html($('#MeterPointName_W2').val());
        });

        // 清空 点击
        $('#clear_formula').click(function () {
            $('#DESCRIPTIONINFO_W').empty();
            $('#MeasurePropertyCalcFormula_W').empty();
        });

        // 保存 点击
        $('#window-save').click(function () {
            if ($('#TempType').val() == '1') {
                $('#Report_UnitId').val($('#MeasurePropertyCalcFormula_W').val());
            }
            else if ($('#TempType').val() == '2') {
                $('#RatioId').val($('#MeasurePropertyCalcFormula_W').val());
            }
            $('#DESCRIPTION_INFO').val($('#DESCRIPTIONINFO_W').val());

            that.window_close();
        });

        // 取消 点击
        $('#window-cancel').click(function () {
            that.window_close();
        });
    },

    Formula_Check: function () {
        //console.log("$('#DESCRIPTIONINFO_W').val():");
        //console.log($('#DESCRIPTIONINFO_W').val());
        //console.log("$('#MeasurePropertyCalcFormula_W').val():");
        //console.log($('#MeasurePropertyCalcFormula_W').val());
    },

    window_open: function () {
        var that = this;

        if ($('#TempType').val() == '1') {
            $('#select_measureproperty').show();
            $('#select_price').hide();
            $('#select_coal').hide();
        }
        else if (2) {
            $('#select_measureproperty').hide();
            $('#select_price').show();
            $('#select_coal').show();
        }
        else {
            Util.alert('请选择相关类型');
            return false;
        }

        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        that.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);

        that.prepare_select_source_Price();
        that.prepare_select_source_Coal();

        $('.window').fadeIn(50);
        $('.opacity-div-for-modelwin').show();
    },

    window_query: function () {
        var ModelBaseId = Page.current_selected_modelbase_id;
        var MeasurePropertyName = $('#MeasurePropertyName_S').val();
        Page.prepare_select_source_EnergyUnit(ModelBaseId, '', MeasurePropertyName);
    },

    window_close: function () {
        $('.window').hide();
        $('.opacity-div-for-modelwin').hide();

        $('#DESCRIPTIONINFO_W').empty();
        $('#MeasurePropertyCalcFormula_W').empty();
        $('#MeasurePropertyName_W').val('').html('');
        $('#MeterPointName_W1').val('').html('');
        $('#MeterPointName_W2').val('').html('');
        $('#MeasurePropertyName_S').val('');
    }
}