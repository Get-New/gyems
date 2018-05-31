var Page = {
    my_grid: null,

    //当前选中列表行的介质id
    current_selected_config_id: '',

    //当前选中列表行的工厂模型id
    current_selected_modelbase_id: '',

    my_grid_config: {
        store_config: {
            fields: [
            'SubConfigID',
            'ConfigID',
            'SubConfigCellName',
            'SubConfigPoint',
            'SubConfigGroupSix',
            'SubConfigGroupOne',
            'SubConfigGroupTwo',
            'SubConfigGroupTen',
            'SubConfigGroupNine',
            'SubConfigGroupEight',
            'DESCRIPTIONINFO',
            'ConfigReportName'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                {
                    text: '所属图表',
                    dataIndex: 'ConfigReportName',
                    width: 200,
                },
                {
                    text: '节点名称',
                    dataIndex: 'SubConfigGroupEight',
                    width: 300,
                },
                {
                    text: '单元名称',
                    dataIndex: 'SubConfigCellName',
                    width: 300,
                },
                {
                    text: '实时点',
                    dataIndex: 'SubConfigGroupOne',
                    width: 200,
                },
                {
                    text: '备注',
                    dataIndex: 'DESCRIPTIONINFO',
                    width: 600,
                }
                ]
            },
        },

        url: '/api/ReportSubConfig/GetPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    my_group_config: function () {
        return {
            store_config: {
                fields: [
                    'ConfigID',
                    'ConfigReportName',
                    'DescriptionInfo',
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0,
                        align: 'left'
                    },
                    items: [
                        { text: '<pre> - 图 表 名 称 - </pre>', dataIndex: 'ConfigReportName', width: 220 }
                    ]
                }
            },

            url: '/api/ReportConfig/GetOverViewGraph2',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: false,
            row_select_handler: 'on_group_row_selected',

            grid_container_id: 'collect-group-container'
        }
    },

    init: function () {
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

        this.my_group = new MyGrid(this, this.my_group_config());
        this.my_group.query({ ConfigReportName: '' });

        $('#query').click(function () {
            that.my_grid.query({
                ConfigId: that.current_selected_config_id, SubConfigGroupEight: $('#search-name').val()
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    ConfigId: that.current_selected_config_id, SubConfigGroupEight: $('#search-name').val()
                });
            }
        });

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            if ($('#ConfigID').val() == '') {
                Util.alert("请选择所属图表");
                return false;
            }
            that.submit_add();
        })

        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        //$('#export').click(function () {
        //    that.my_grid.exportExcel('统计单元管理');
        //})

        //$('#search-EnergyMediumId').click(function () {
        //    that.prepare_select_source_EnergyMedium();
        //})

        //显示window
        $('#edit_SubConfigCellName').click(function () {
            that.window_open();
        });

        //显示window
        $('#edit_SubConfigPoint').click(function () {
            that.window_open();
        });

        //onchange事件
        $('#SubConfigGroupTen').change(function () {
            var tmpConfigID = $('#ConfigID').val();
            var tmpSubConfigGroupTen = Number($('#SubConfigGroupTen').val()) - 1;
            var tmpSubConfigGroupNine = '';
            Page.prepare_select_source_SubConfigGroupSix(tmpConfigID, tmpSubConfigGroupTen, tmpSubConfigGroupNine);
        });

        this.prepare_window_event();

        this.right_panel_init();
        this.my_form_init();
        this.prepare_select_source_EnergyMedium();

        // 初始化表单
        this.clear();
    },

    //左侧列表单击事件
    on_group_row_selected: function (data) {
        var that = this;
        that.clear();
        that.current_selected_config_id = data.ConfigID;
        $('#ConfigID').val(data.ConfigID);
        that.my_grid.query({
            ConfigID: that.current_selected_config_id, SubConfigCellName: ''
        });
    },

    // 准备能源介质的下拉框数据
    prepare_select_source_EnergyMedium: function () {
        $('#EnergyMediumID').val('').html('');

        $.ajax({
            url: '/api/EnergyMedium/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#EnergyMediumID').append("<option value='-1'>没有介质可供选择</option>");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMediumID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergymediumId).html(item.EnergymediumName);
                    $('#EnergyMediumID').append(option);
                }

                //$('#EnergyMediumID').val('');
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

                $('#ModelBaseID_1').val('');
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

    // 准备上级节点下拉框的数据源
    prepare_select_source_SubConfigGroupSix: function (ConfigId, SubConfigGroupTen, SubConfigGroupNine) {
        $('#SubConfigGroupSix').val('').html('');

        //右侧点击项 常用
        $.ajax({
            url: '/api/ReportSubConfig/GetParents',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ConfigId: ConfigId, SubConfigGroupTen: SubConfigGroupTen, SubConfigGroupNine: 'Out' },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#SubConfigGroupSix').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_2').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#SubConfigGroupSix').append(option);
                var option = $('<option>').val('').html('>>>>>>>>>>点击向右');
                $('#SubConfigGroupSix').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.SubConfigID).html(item.SubConfigGroupEight);
                    $('#SubConfigGroupSix').append(option);
                }
            }
        })

        //左侧点击项 偶尔用
        $.ajax({
            url: '/api/ReportSubConfig/GetParents',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ConfigId: ConfigId, SubConfigGroupTen: SubConfigGroupTen, SubConfigGroupNine: 'In' },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#SubConfigGroupSix').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_2').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#SubConfigGroupSix').append(option);
                var option = $('<option>').val('').html('<<<<<<<<<<点击向左');
                $('#SubConfigGroupSix').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.SubConfigID).html(item.SubConfigGroupEight);
                    $('#SubConfigGroupSix').append(option);
                }

                $('#SubConfigGroupSix').val('');
            }
        })
    },

    //准备 统计单元 的下拉框数据源
    prepare_select_source_MeasurePropertyName: function (ModelBaseID, EnergyMediumID, MeasurePropertyName) {
        $('#MeasurePropertyName_W').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetEnergyUnit',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: ModelBaseID, EnergyMediumID: EnergyMediumID, MeasurePropertyName: MeasurePropertyName },
            success: function (data) {
                var MeasureProperty = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载统计单元失败');
                    return;
                }

                if (!MeasureProperty || !MeasureProperty.length) {
                    //$('#MeasurePropertyName_W').append("<option value='-1'>没有统计单元可供选择</option>");
                    //$('#MeasurePropertyName_W').attr("disabled", "disabled");
                    return;
                }

                for (var i in MeasureProperty) {
                    var item = MeasureProperty[i];
                    //if ((item.MeasurePropertyCalcFormula == '<0>') || (item.MeasurePropertyCalcFormula == null) || (item.MeasurePropertyCalcFormula == '')) {
                    //    var option = $('<option>').val(item.MeasurePropertyID).html('[' + item.MeasurePropertyName + ']');
                    //}
                    //else {
                    //    var option = $('<option>').val(item.MeasurePropertyCalcFormula).html('[' + item.MeasurePropertyName + ']');
                    //}
                    var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#MeasurePropertyName_W').append(option);
                }

                //$('#MeasurePropertyName_W').val('');
            }
        })
    },

    //*******************************设置增删改**********************************************************8
    on_grid_row_delete_clicked: function (record) {
        var that = this;

        var data = { SubConfigID: record.SubConfigID };

        Util.ajax_delete({
            data: data,
            model: 'ReportSubConfig',
            confirm_msg: function () {
                return '确认要删除' + record.SubConfigCellName + '吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();
        data.SubConfigCellName = $('#SubConfigCellName').val();
        data.SubConfigPoint = $('#SubConfigPoint').val();

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'ReportSubConfig',
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
        data.SubConfigCellName = $('#SubConfigCellName').val();
        data.SubConfigPoint = $('#SubConfigPoint').val();

        Util.ajax_edit({
            error_msg: '操作失败',
            data: data,
            validator: that.validate,
            model: 'ReportSubConfig',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    //*********************************************注意事**************************************************

    validate: function (data) {
        //console.log("data:");
        //console.log(data);
        if (!data.SubConfigGroupTen) {
            return "请选择级别";
        }
        if (!data.SubConfigGroupNine) {
            return "请选择类型";
        }
        if (!data.SubConfigGroupEight) {
            return "请输入节点名称";
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;
        that.clear();

        that.prepare_select_source_SubConfigGroupSix(data.ConfigID, Number(data.SubConfigGroupTen) - 1, '');

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.grid.getView().refresh();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();

        var callback = function () {
            that.my_grid.grid.getView().refresh();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
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
                that.my_grid.grid.getView().refresh();
                $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
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

        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        that.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);

        // 统计单元 选定
        $('#select_measureproperty').click(function () {
            $('#DESCRIPTIONINFO_W').html($('#MeasurePropertyName_W option:selected').text());
            $('#MeasurePropertyCalcFormula_W').html($('#MeasurePropertyName_W').val());
        });

        // 采集测点 选定
        $('#select_meterpoint').click(function () {
            $('#DESCRIPTIONINFO_W').append($('#MeterPointName_W option:selected').text());
            $('#MeasurePropertyCalcFormula_W').append('[' + $('#MeterPointName_W').val() + ']');
            //$('#MeasurePropertyCalcFormula_W').append($('#MeterPointName_W').val());
        });

        // 数字 输入
        $('#select_number').click(function () {
            var temp_num = Number(($('#Number_W').val()));
            if (temp_num == 0 || temp_num) {
                $('#DESCRIPTIONINFO_W').append(temp_num);
                $('#MeasurePropertyCalcFormula_W').append('<' + temp_num + '>');
                $('#Number_W').val('');
            }
            else {
                Util.alert('请检查输入的数字格式是否正确');
                return false;
            }
        });

        // + 点击
        $('#select_symbol_add').click(function () {
            $('#DESCRIPTIONINFO_W').append('+');
            $('#MeasurePropertyCalcFormula_W').append('+');
        });

        // - 点击
        $('#select_symbol_subtract').click(function () {
            $('#DESCRIPTIONINFO_W').append('-');
            $('#MeasurePropertyCalcFormula_W').append('-');
        });

        // * 点击
        $('#select_symbol_multiply').click(function () {
            $('#DESCRIPTIONINFO_W').append('*');
            $('#MeasurePropertyCalcFormula_W').append('*');
        });

        // / 点击
        $('#select_symbol_divide').click(function () {
            $('#DESCRIPTIONINFO_W').append('/');
            $('#MeasurePropertyCalcFormula_W').append('/');
        });

        // ( 点击
        $('#select_symbol_open_parentheses').click(function () {
            $('#DESCRIPTIONINFO_W').append('(');
            $('#MeasurePropertyCalcFormula_W').append('(');
        });

        // ) 点击
        $('#select_symbol_close_parentheses').click(function () {
            $('#DESCRIPTIONINFO_W').append(')');
            $('#MeasurePropertyCalcFormula_W').append(')');
        });

        // 校验 点击
        $('#check_formula').click(function () {
            that.Formula_Check();
        });

        // 清空 点击
        $('#clear_formula').click(function () {
            $('#DESCRIPTIONINFO_W').empty();
            $('#MeasurePropertyCalcFormula_W').empty();
        });

        // 保存 点击
        $('#window-save').click(function () {
            $('#SubConfigPoint').val($('#MeasurePropertyCalcFormula_W').val());
            $('#SubConfigCellName').val($('#DESCRIPTIONINFO_W').val());

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
        var EnergyMediumId = $('#EnergyMediumID').val();
        if (!EnergyMediumId) {
            Util.alert('请选择能源介质');
            return false;
        }

        $('#MeasurePropertyCalcFormula_W').val($('#SubConfigPoint').val());
        $('#DESCRIPTIONINFO_W').val($('#SubConfigCellName').val());

        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        Page.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);

        $('.window').fadeIn(50);
        $('.opacity-div-for-modelwin').show()
    },

    window_query: function () {
        var ModelBaseId = Page.current_selected_modelbase_id;
        var EnergyMediumId = $('#EnergyMediumID').val();
        var MeasurePropertyName = $('#MeasurePropertyName_S').val();
        Page.prepare_select_source_MeasurePropertyName(ModelBaseId, EnergyMediumId, MeasurePropertyName);
    },

    window_close: function () {
        $('.window').hide();

        $('.opacity-div-for-modelwin').hide()

        $('#DESCRIPTIONINFO_W').empty();
        $('#MeasurePropertyCalcFormula_W').empty();
        $('#MeasurePropertyName_W').val('').html('');
        $('#MeterPointName_W').val('').html('');
        $('#Number_W').val('');
    }
}