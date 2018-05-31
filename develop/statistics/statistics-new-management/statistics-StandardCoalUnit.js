var Page = {
    my_grid: null,

    //当前选中的工厂节点id
    current_tree_select_id: '',

    //当前选中列表行的介质id
    temp_EnergyMediumId: '',

    //当前选中列表行的工厂模型id
    current_selected_modelbase_id: '',

    //当前Panel选中的更改工厂模型id
    current_selected_panel_modelbase_id: '',

    my_grid_config: {
        store_config: {
            fields: [
            'MeasurePropertyID',
            'ModelBaseID',
            'EnergyMediumID',
            'MeasurePropertyName',
            'MeasurePropertyTime',
            'MeasurePropertyType',
            'MeasurePropertyCalcFormula',
            'MeasurePropertyCalcStartTime',
            'MeasurePropertyCalcState',
            'DESCRIPTIONINFO',
            'ProductClassID',
            'MeasurePropertyCalMethod',
            'RelativeTargetID',
            'ShowSign',
            'EnergyMediumName',
            'ProductClassName',
            'ModelBaseName',
            'RelativeTargetName',
            'MeasurePropertyText'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                {
                    text: '统计单元名称',
                    dataIndex: 'MeasurePropertyName',
                    width: 300,
                },
                {
                    text: '计量介质',
                    dataIndex: 'EnergyMediumName',
                    width: 120,
                },
                //{
                //    text: '是否展示',
                //    dataIndex: 'ShowSign',
                //    width: 150,
                //    renderer: function (value) {
                //        switch (value) {
                //            case 0: return "否";
                //            case 1: return "是";
                //            default: return "否"
                //        }
                //    }
                //},
                {
                    text: '工厂模型',
                    dataIndex: 'ModelBaseName',
                    width: 200,
                },
                {
                    text: '统计周期',
                    dataIndex: 'MeasurePropertyTime',
                    width: 120,
                    renderer: function (value) {
                        switch (value) {
                            case 1: return "ke";
                            case 2: return "小时";
                            case 3: return "天";
                            case 4: return "月";
                            case 5: return "年";
                            default: return ""
                        }
                    }
                },
                {
                    text: '公式描述',
                    dataIndex: 'DESCRIPTIONINFO',
                    width: 200,
                },
                {
                    text: '统计公式',
                    dataIndex: 'MeasurePropertyCalcFormula',
                    width: 200,
                },
                {
                    text: '周期累积方式',
                    dataIndex: 'MeasurePropertyCalMethod',
                    width: 120,
                    renderer: function (value) {
                        switch (value) {
                            case 0: return "常规累积";
                            case 1: return "单耗累积";
                            default: return ""
                        }
                    }
                },
                {
                    text: '开始计算日期',
                    dataIndex: 'MeasurePropertyCalcStartTime',
                    width: 120,
                },
                {
                    text: '公式状态',
                    dataIndex: 'MeasurePropertyCalcState',
                    width: 120,
                    renderer: function (value) {
                        switch (value) {
                            case 1: return "正常";
                            case 2: return "废止";
                            default: return ""
                        }
                    }
                },
                {
                    text: '备注',
                    dataIndex: 'MeasurePropertyText',
                    width: 120,
                }
                ]
            },
        },

        url: '/api/EngeryMeasureProperty/GetStandardCoalUnit',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    //***************************************************内置函数****************************8

    init: function () {
        laydate({
            elem: '#MeasurePropertyCalcStartTime',
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
        //this.my_grid.query({ MeasurePropertyName: '', ModelBaseID: '' });

        $('#query').click(function () {
            that.my_grid.query({ MeasurePropertyName: $('#search-name').val(), ModelBaseID: that.current_tree_select_id });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({ MeasurePropertyName: $('#search-name').val(), ModelBaseID: that.current_tree_select_id });
            }
        });

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            $('#ModelBaseID').val($('#ModelBaseID').val() ? $('#ModelBaseID').val() : Page.current_tree_select_id);

            if ($('#ModelBaseID').val() == '') {
                Page.my_tree.reset();
                Util.alert("请选择工厂节点");
                return false;
            }
            if ($('#ModelBaseID').val() == 'root') {
                Page.my_tree.reset();
                Util.alert("请正确选择工厂节点");
                return false;
            }
            that.submit_add();
        })

        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计单元管理');
        })

        //$('#search-EnergyMediumId').click(function () {
        //    that.prepare_select_source_EnergyMedium();
        //})

        //显示window
        $('#edit-Formula').click(function () {
            that.window_open();
        });

        //显示window
        $('#edit-DESCRIPTIONINFO').click(function () {
            that.window_open();
        });

        //点击模态窗口时关闭预览
        //$(".opacity-div-for-modelwin").click(function () {
        //    that.window_close();
        //})

        this.prepare_window_event();

        this.right_panel_init();

        this.prepare_PanelModelBaseID_event();

        this.my_form_init();
        this.tree_init();

        //this.prepare_select_source_ProductClass();

        // 初始化表单
        this.clear();
    },

    //MeterPointID_reset:function(){
    //    var ModelBaseId = $('#ModelBaseID').val();
    //    var EnergyMediumId = $('#EnergyMediumId').val();
    //    if (!ModelBaseId) {
    //        Util.alert('请选择工厂模型节点');
    //        return false;
    //    }
    //    if (!EnergyMediumId) {
    //        Util.alert('请选择能源介质');
    //        return false;
    //    }
    //    Page.prepare_select_source_MeterPointID(ModelBaseId, EnergyMediumId);
    //},

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

    // 准备产品种类的下拉框数据
    //prepare_select_source_ProductClass: function (ModelBaseID) {
    //    $('#ProductClassId').val('').html('');

    //    $.ajax({
    //        url: '/api/ProductClass/GetList',
    //        type: 'get',
    //        dataType: 'json',
    //        //data: { ModelBaseId: ModelBaseID },
    //        success: function (data) {
    //            if (!data.Models || !data.Models.length) {
    //                $('#ProductClassId').append("<option value='-1'>没有产品种类可供选择</option>");
    //                //$('#ProductClassId').attr("disabled", "disabled");
    //                return;
    //            }

    //            var option = $('<option>').val('').html('');
    //            $('#ProductClassId').append(option);

    //            for (var i in data.Models) {
    //                var item = data.Models[i];
    //                var option = $('<option>').val(item.ProductClassId).html(item.ProductClassName);
    //                $('#ProductClassId').append(option);
    //            }

    //            $('#ProductClassId').val('');
    //        }
    //    })
    //},

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

    //更改部门相关
    // 准备 更改部门 下拉框的数据源
    prepare_select_source_PanelModelBaseID_1: function (ModelBaseID) {
        $('#PanelModelBaseID_1').val('').html('');
        $('#PanelModelBaseID_2').val('').html('');
        $('#PanelModelBaseID_3').val('').html('');
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_1').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_1').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_1').append(option);
                }
            }
        })
    },

    // 准备 更改下级 下拉框的数据源
    prepare_select_source_PanelModelBaseID_2: function (ModelBaseID) {
        $('#PanelModelBaseID_2').val('').html('');
        $('#PanelModelBaseID_3').val('').html('');
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_2').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_2').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_2').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_2').append(option);
                }

                $('#PanelModelBaseID_2').val('');
            }
        })
    },

    // 准备 更改下级 下拉框的数据源
    prepare_select_source_PanelModelBaseID_3: function (ModelBaseID) {
        $('#PanelModelBaseID_3').val('').html('');
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_3').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_3').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_3').append(option);
                }

                $('#PanelModelBaseID_3').val('');
            }
        })
    },

    // 准备 更改下级 下拉框的数据源
    prepare_select_source_PanelModelBaseID_4: function (ModelBaseID) {
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_4').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_4').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_4').append(option);
                }

                $('#PanelModelBaseID_4').val('');
            }
        })
    },

    //弹出框 统计单元的下拉框数据
    prepare_select_source_CurrentUnit: function (ModelBaseID, EnergyMediumID, MeasurePropertyName) {
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

    //准备 折标系数 的下拉框数据源
    prepare_select_source_BasicEfficacious: function () {
        $('#MeterPointName_W').val('').html('');

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
                    $('#MeterPointName_W').append(option);
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
    //prepare_select_source_EnergyUnitPlan: function (ModelBaseID, EnergyMediumID) {
    //    $('#RelativeTargetID').val('').html('');

    //    $.ajax({
    //        url: '/api/EngeryMeasureProperty/GetEnergyUnit',
    //        type: 'get',
    //        dataType: 'json',
    //        data: { ModelBaseID: ModelBaseID, EnergyMediumId: EnergyMediumID, MeasurePropertyTypes: '7' },
    //        success: function (data) {
    //            var MeasureProperty = data.Models;

    //            if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
    //                return;
    //            }

    //            if (!MeasureProperty || !MeasureProperty.length) {
    //                return;
    //            }

    //            for (var i in MeasureProperty) {
    //                var item = MeasureProperty[i];
    //                var option = $('<option>').val(item.MeasurePropertyID).html('[' + item.MeasurePropertyName + ']');
    //                $('#RelativeTargetID').append(option);
    //            }

    //            $('#RelativeTargetID').val('');
    //        }
    //    })
    //},

    //*******************************设置增删改**********************************************************8
    on_grid_row_delete_clicked: function (record) {
        var that = this;

        if (($('#MeasurePropertyCalcState').val()) != "2") {
            Util.alert("删除前请先修改公式状态");
            return false;
        }

        var data = { MeasurePropertyID: record.MeasurePropertyID, MeasurePropertyName: record.MeasurePropertyName };

        Util.ajax_delete({
            data: data,
            model: 'EngeryMeasureProperty',
            confirm_msg: function () {
                return '确认要删' + data.MeasurePropertyName + '吗?';
            },
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('提示：' + errorThrown)
            }
        });
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();
        data.MeasurePropertyCalcFormula = $('#MeasurePropertyCalcFormula').val();
        data.DESCRIPTIONINFO = $('#DESCRIPTIONINFO').val();

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'EngeryMeasureProperty',
            success: function () {
                that.my_grid.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('提示：' + errorThrown)
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
        data.MeasurePropertyCalcFormula = $('#MeasurePropertyCalcFormula').val();
        data.DESCRIPTIONINFO = $('#DESCRIPTIONINFO').val();

        if (that.current_selected_panel_modelbase_id) {
            data.ModelBaseID = that.current_selected_panel_modelbase_id;
        }

        Util.ajax_edit({
            error_msg: '操作失败',
            data: data,
            validator: that.validate,
            model: 'EngeryMeasureProperty',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('提示：' + errorThrown)
            }
        });
    },

    //*********************************************注意事**************************************************

    validate: function (data) {
        if (!data.MeasurePropertyName) {
            return "请输入统计单元名称";
        }
        //if (!data.EnergyMediumId && !data.ProductClassId) {
        //    return "请选择计量介质或产品种类";
        //}
        //if (data.EnergyMediumId && data.ProductClassId) {
        //    return "计量介质和产品种类不容许同时选择";
        //}
        if (!data.MeasurePropertyTime) {
            //return "请选择统计周期";
            data.MeasurePropertyTime = 2;
        }
        if (!data.MeasurePropertyType) {
            //return "请选择计量类型";
            data.MeasurePropertyType = 10;
        }
        if (!(data.MeasurePropertyCalcFormula)) {
            //data.MeasurePropertyCalcFormula = '<0>';
            //data.DESCRIPTIONINFO = '<0>';
            //return "请输入公式";
        }
        if (!(data.MeasurePropertyCalMethod)) {
            data.MeasurePropertyCalMethod = 0;
            //return "请选择周期累积方式";
        }
        if (!(data.MeasurePropertyCalcStartTime)) {
            //return "请选择开始计算时间";
            data.MeasurePropertyCalcStartTime = "2015-01-01";
        }
        if (!(data.MeasurePropertyCalcState)) {
            //return "请选择公式状态";
            data.MeasurePropertyCalcState = 1;
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;
        //console.log(data)
        that.clear();
        that.current_selected_panel_modelbase_id = '';

        this.prepare_select_source_EnergyMedium(data.ModelBaseID);
        //this.prepare_select_source_Efficacious(data.ModelBaseID);
        //this.prepare_select_source_EnergyUnitPlan(data.ModelBaseID, '');

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);

        //that.temp_EnergyMediumId = data.EnergyMediumID;

        //setTimeout(function () { $('#EnergyMediumID').val(that.temp_EnergyMediumId) }, 200);

        //$('#MeterPointID').val('').html('');
        //var option = $('<option>').val(data.MeterPointID).html(data.MeterPointName);
        //$('#MeterPointID').append(option);
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
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            that.current_tree_select_id = '';
            $('#search-name').val('');
            //that.my_grid.query({ MeasurePropertyName: 'SetGridNull', ModelBaseID: 'SetGridNull' });
        });
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id, name) {
        var that = this;
        that.clear();

        this.current_tree_select_id = id;

        $('#ModelBaseID').val(id);
        $('#ModelBaseName').val(name);

        if (id != 'root') {
            this.prepare_select_source_EnergyMedium(id);
        }

        this.my_grid.query({ MeasurePropertyName: $('#search-name').val(), ModelBaseID: id });
        //this.prepare_select_source_EnergyUnitPlan(id, '');
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

        // 统计单元 选定
        $('#select_measureproperty').click(function () {
            $('#DESCRIPTIONINFO_W').append($('#MeasurePropertyName_W option:selected').text());
            $('#MeasurePropertyCalcFormula_W').append($('#MeasurePropertyName_W').val());
        });

        // 折标系数 选定
        $('#select_meterpoint').click(function () {
            $('#DESCRIPTIONINFO_W').append($('#MeterPointName_W option:selected').text());
            $('#MeasurePropertyCalcFormula_W').append('{' + $('#MeterPointName_W').val() + '}');
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
            $('#MeasurePropertyCalcFormula').val($('#MeasurePropertyCalcFormula_W').val());
            $('#DESCRIPTIONINFO').val($('#DESCRIPTIONINFO_W').val());

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

        $('#MeasurePropertyCalcFormula_W').val($('#MeasurePropertyCalcFormula').val());
        $('#DESCRIPTIONINFO_W').val($('#DESCRIPTIONINFO').val());

        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        that.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);

        $('.window').fadeIn(50);
        $('.opacity-div-for-modelwin').show()
    },

    window_query: function () {
        var ModelBaseId = Page.current_selected_modelbase_id;
        var EnergyMediumId = $('#EnergyMediumID').val();
        var MeasurePropertyName = $('#MeasurePropertyName_S').val();
        Page.prepare_select_source_CurrentUnit(ModelBaseId, EnergyMediumId, MeasurePropertyName);
        Page.prepare_select_source_BasicEfficacious();
    },

    window_close: function () {
        $('.window').hide();

        $('.opacity-div-for-modelwin').hide()

        $('#DESCRIPTIONINFO_W').empty();
        $('#MeasurePropertyCalcFormula_W').empty();
        $('#MeasurePropertyName_W').val('').html('');
        $('#MeterPointName_W').val('').html('');
        $('#Number_W').val('');
        $('#MeasurePropertyName_S').val('');
    },

    prepare_PanelModelBaseID_event: function () {
        var that = this;
        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        that.prepare_select_source_PanelModelBaseID_1(temp_ModelBaseID_ylc);

        //onchange事件
        $('#PanelModelBaseID_1').change(function () {
            that.prepare_select_source_PanelModelBaseID_2($('#PanelModelBaseID_1').val());
            var tmpID1 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID1;
        });

        //onchange事件
        $('#PanelModelBaseID_2').change(function () {
            that.prepare_select_source_PanelModelBaseID_3($('#PanelModelBaseID_2').val());
            var tmpID2 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID2;
        });

        //onchange事件
        $('#PanelModelBaseID_3').change(function () {
            that.prepare_select_source_PanelModelBaseID_4($('#PanelModelBaseID_3').val());
            var tmpID3 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID3;
        });

        //onchange事件
        $('#PanelModelBaseID_4').change(function () {
            var tmpID4 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID4;
        });
    }
}