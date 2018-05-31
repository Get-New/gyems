var Page = {
    my_grid: null,

    //当前选中列表行的介质id
    current_selected_config_id: '',

    my_grid_config: {
        store_config: {
            fields: [
            'SubConfigID',
            'ConfigID',
            'SubConfigCellName',
            'SubConfigCellUnit',
            'SubConfigPoint',
            'SubConfigColumn',
            'SubConfigRow',
            'SubConfigGroupOne',
            'SubConfigGroupTwo',
            'SubConfigGroupThree',
            'SubConfigGroupFour',
            'SubConfigGroupFive',
            'SubConfigGroupNine',
            'EfficaciousName',
            'SubConfigGroupTen',
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
                    text: '单元名称',
                    dataIndex: 'SubConfigCellName',
                    width: 300,
                },
                {
                    text: '单元ID',
                    dataIndex: 'SubConfigID',
                    width: 350,
                },
                {
                    text: '所属图表',
                    dataIndex: 'ConfigReportName',
                    width: 300,
                },
                {
                    text: '单元点位',
                    dataIndex: 'SubConfigPoint',
                    width: 200,
                },
                {
                    text: '显示单位',
                    dataIndex: 'SubConfigCellUnit',
                    width: 120,
                },
                {
                    text: '所属行',
                    dataIndex: 'SubConfigRow',
                    width: 120,
                },
                {
                    text: '所属列',
                    dataIndex: 'SubConfigColumn',
                    width: 120,
                },
                {
                    text: '分组1',
                    dataIndex: 'SubConfigGroupOne',
                    width: 120,
                },
                {
                    text: '分组2',
                    dataIndex: 'SubConfigGroupTwo',
                    width: 120,
                },
                {
                    text: '分组3',
                    dataIndex: 'SubConfigGroupThree',
                    width: 120,
                },
                {
                    text: '分组4',
                    dataIndex: 'SubConfigGroupFour',
                    width: 120,
                },
                {
                    text: '分组5',
                    dataIndex: 'SubConfigGroupFive',
                    width: 120,
                },
                {
                    text: '备注',
                    dataIndex: 'DESCRIPTIONINFO',
                    width: 120,
                },
                {
                    text: '绩效指标',
                    dataIndex: 'EfficaciousName',
                    width: 120,
                },
                {
                    text: '指标说明',
                    dataIndex: 'SubConfigGroupTen',
                    width: 120,
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

            url: '/api/ReportConfig/GetPage',
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
            that.my_group.query({
                ConfigReportName: $('#search-name').val()
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    ConfigID: that.current_selected_config_id, SubConfigCellName: ''
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

        this.prepare_window_event();

        this.right_panel_init();
        this.my_form_init();

        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        this.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);
        this.prepare_select_source_Efficacious('');

        // 初始化表单
        this.clear();
    },

    //左侧列表单击事件
    on_group_row_selected: function (data) {
        var that = this;
        that.clear();
        that.current_selected_config_id = data.ConfigID;
        $('#ConfigID').val(data.ConfigID);
        $('#ConfigReportName').val(data.ConfigReportName);
        that.my_grid.query({
            ConfigID: that.current_selected_config_id, SubConfigCellName: ''
        });
    },

    ModelBaseID_1_onchange: function () {
        var that = this;
        that.prepare_select_source_ModelBaseID_2($('#ModelBaseID_1').val());
        that.prepare_select_source_Efficacious($('#ModelBaseID_1').val());
    },

    // 准备筛选部门下拉框的数据源
    prepare_select_source_ModelBaseID_1: function (ModelBaseID) {
        $('#ModelBaseID_1').val('').html('');
        $('#ModelBaseID_2').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_1').attr("disabled", "disabled");
                    return;
                }
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

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ModelBaseID_2').append("<option value='-1'>没有选项可供选择</option>");
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

    // 准备绩效指标下拉框的数据源
    prepare_select_source_Efficacious: function (ModelBaseID) {
        $('#SubConfigGroupNine').val('').html('');

        $.ajax({
            url: '/api/BasicEfficacious/GetPageWithFactory',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseId: ModelBaseID, EfficaciousType: '绩效系数', ofs: 0, ps: 1000, sort_column: '', sort_desc: false },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#SubConfigGroupNine').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_2').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#SubConfigGroupNine').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EfficaciousId).html(item.EfficaciousName);
                    $('#SubConfigGroupNine').append(option);
                }

                $('#SubConfigGroupNine').val('');
            }
        })
    },

    //准备 统计单元 的下拉框数据源
    prepare_select_source_MeasurePropertyName: function (ModelBaseID, EnergyMediumID) {
        $('#MeasurePropertyName_W').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetNewPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: ModelBaseID, EnergyMediumID: EnergyMediumID },
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
        console.log("data:");
        console.log(data);
        if (!data.SubConfigCellName) {
            return "单元名称不能为空";
        }
        if (!data.SubConfigPoint) {
            return "单元点位不能为空";
        }
        if (!data.SubConfigCellUnit) {
            return "请填写单位";
        }
        if (!data.SubConfigRow) {
            return "请填写所属行";
        }
        if (!data.SubConfigColumn) {
            //return "请填写所属列";
            data.SubConfigColumn = 1;
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;
        //console.log(data)
        that.clear();

        //this.prepare_select_source_EnergyMedium(data.ModelBaseID);

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        that.temp_EnergyMediumId = data.EnergyMediumId;

        setTimeout(function () { $('#EnergyMediumId').val(that.temp_EnergyMediumId) }, 200);

        //$('#MeterPointID').val('').html('');
        //var option = $('<option>').val(data.MeterPointID).html(data.MeterPointName);
        //$('#MeterPointID').append(option);
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

        // 统计单元 选定
        $('#select_measureproperty').click(function () {
            $('#DESCRIPTIONINFO_W').append($('#MeasurePropertyName_W option:selected').text());
            $('#MeasurePropertyCalcFormula_W').append($('#MeasurePropertyName_W').val());
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
        console.log("$('#DESCRIPTIONINFO_W').val():");
        console.log($('#DESCRIPTIONINFO_W').val());
        console.log("$('#MeasurePropertyCalcFormula_W').val():");
        console.log($('#MeasurePropertyCalcFormula_W').val());
    },

    window_open: function () {
        var ModelBaseId = $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
        var EnergyMediumId = ''; //$('#EnergyMediumId').val();
        if (!ModelBaseId) {
            Util.alert('请先进行筛选');
            return false;
        }
        //if (!EnergyMediumId) {
        //    Util.alert('请选择能源介质');
        //    return false;
        //}

        $('#MeasurePropertyCalcFormula_W').val($('#SubConfigPoint').val());
        $('#DESCRIPTIONINFO_W').val($('#SubConfigCellName').val());

        Page.prepare_select_source_MeasurePropertyName(ModelBaseId, EnergyMediumId);
        //Page.prepare_select_source_MeterPointID(ModelBaseId, EnergyMediumId);

        $('.window').fadeIn(50);

        $('.opacity-div-for-modelwin').show()
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