var Page = {
    my_grid: null,

    //当前选中的工厂节点id
    current_tree_select_id: 'root',

    //当前选中列表行的介质id
    temp_EnergyMediumId: '',

    my_grid_config: {
        store_config: {
            fields: [
            'MeasurePropertyID',
            'ModelBaseID',
            'ModelBaseName',
            'MeasurePropertyName',
            'EnergyMediumName',
            'EnergyMediumId',
            'MeasurePropertyTime',
            'MeasurePropertyClass',
            'MeasurePropertyType',
            'MeasurePropertyCalcFormula',
            'MeterPointID',
            'MeterPointName',
            'DESCRIPTIONINFO',
            'ENABLESIGN',
            'MeasurePropertyCalcState',
            'ProductClassId',
            'ProductClassName',
            'MeasurePropertyCalMethod',
            'MeasurePropertyCalcStartTime',
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
                {
                    text: '产品种类',
                    dataIndex: 'ProductClassName',
                    width: 120,
                },
                {
                    text: '计量类型',
                    dataIndex: 'MeasurePropertyType',
                    width: 150,
                    //renderer: function (value) {
                    //    switch (value) {
                    //        case 1: return "输入总量";
                    //        case 2: return "输出总量";
                    //        case 3: return "自发量";
                    //        case 4: return "平衡计量";
                    //        case 5: return "其他计量";
                    //        case 6: return "产品产量";
                    //        case 7: return "单耗";
                    //        default: return ""
                    //    }
                    //}
                    renderer: function (value) {
                        switch (value) {
                            case 1: return "输入总量";
                            case 2: return "输出总量";
                            case 3: return "自发量";
                            case 4: return "平衡计量";
                            case 5: return "单耗";
                            case 6: return "预测";
                            case 7: return "计划";
                            case 8: return "其他";
                            default: return ""
                        }
                    }
                },
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
                },

                ]
            },
        },

        url: '/api/EngeryMeasureProperty/GetPage',
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
        this.my_form_init();
        this.tree_init();

        this.prepare_select_source_ProductClass();

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

    // 准备计量介质下拉框的数据源
    prepare_select_source_EnergyMedium: function (ModelBaseID) {
        $('#EnergyMediumId').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#EnergyMediumId').append("<option value='-1'>没有介质可供选择</option>");
                    //$('#EnergyMediumId').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMediumId').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumId').append(option);
                }

                $('#EnergyMediumId').val('');
            }
        })
    },

    // 准备产品种类下拉框的数据源
    prepare_select_source_ProductClass: function (ModelBaseID) {
        $('#ProductClassId').val('').html('');

        $.ajax({
            url: '/api/ProductClass/GetList',
            type: 'get',
            dataType: 'json',
            //data: { ModelBaseId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ProductClassId').append("<option value='-1'>没有产品种类可供选择</option>");
                    //$('#ProductClassId').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ProductClassId').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ProductClassId).html(item.ProductClassName);
                    $('#ProductClassId').append(option);
                }

                $('#ProductClassId').val('');
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
                    var option = $('<option>').val(item.MeasurePropertyID).html('[' + item.MeasurePropertyName + ']');
                    $('#MeasurePropertyName_W').append(option);
                }

                //$('#MeasurePropertyName_W').val('');
            }
        })
    },

    //准备 采集测点 的下拉框数据源
    prepare_select_source_MeterPointID: function (ModelBaseId, EnergyMediumId) {
        $('#MeterPointName_W').val('').html('');

        $.ajax({
            url: '/api/MeterMeasure/GetNewMeterPoint',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseId: ModelBaseId, EnergyMediumId: EnergyMediumId },
            success: function (data) {
                var MeterPoint = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载产品计量点失败');
                    return;
                }

                if (!MeterPoint || !MeterPoint.length) {
                    //$('#MeterPointName_W').append("<option value='-1'>没有采集测点可供选择</option>");
                    //$('#MeterPointName_W').attr("disabled", "disabled");
                    return;
                }

                for (var i in MeterPoint) {
                    var item = MeterPoint[i];
                    var option = $('<option>').val(item.MeterPointTagName).html('[' + item.MeterPointTagName + '(' + item.ModelBaseName + '.' + item.MeterPointInfo + ')]');
                    $('#MeterPointName_W').append(option);
                }

                //$('#MeterPointName_W').val('');
            }
        })
    },

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
            data.MeasurePropertyType = 5;
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
            //data.MeasurePropertyCalcStartTime = "2016-01-01";
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

        this.prepare_select_source_EnergyMedium(data.ModelBaseID);

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
            that.my_grid.query({ MeasurePropertyName: 'SetGridNull', ModelBaseID: 'SetGridNull' });
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
        console.log("$('#DESCRIPTIONINFO_W').val():");
        console.log($('#DESCRIPTIONINFO_W').val());
        console.log("$('#MeasurePropertyCalcFormula_W').val():");
        console.log($('#MeasurePropertyCalcFormula_W').val());
    },

    EnergyMediumId_onchange: function () {
        //$('#DESCRIPTIONINFO').val('');
        //$('#MeasurePropertyCalcFormula').val('');
    },

    window_open: function () {
        var ModelBaseId = $('#ModelBaseID').val();
        var EnergyMediumId = $('#EnergyMediumId').val();
        if (!ModelBaseId) {
            Util.alert('请选择工厂模型节点');
            return false;
        }
        //if (!EnergyMediumId) {
        //    Util.alert('请选择能源介质');
        //    return false;
        //}

        $('#MeasurePropertyCalcFormula_W').val($('#MeasurePropertyCalcFormula').val());
        $('#DESCRIPTIONINFO_W').val($('#DESCRIPTIONINFO').val());

        Page.prepare_select_source_MeasurePropertyName(ModelBaseId, EnergyMediumId);
        Page.prepare_select_source_MeterPointID(ModelBaseId, EnergyMediumId);

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