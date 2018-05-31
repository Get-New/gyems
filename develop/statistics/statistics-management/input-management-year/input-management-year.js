var Page = {

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前的日期 */
    current_ymd: null,

    //当前参数
    current_unit: null,
    current_begintime: null,
    current_endtime: null,
    current_datebegin: null,
    current_dateend: null,
    current_MeasureProperty_Name: '',
    current_UnitMeasure_Name: '',

    /* 查询返回的Models */
    current_Models: null,

    /* 绘制折线图所需的name、value */
    current_Models_name: [],
    current_Models_value: [],


    /* 当前的时刻 */
    current_quarter: '',

    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'MeasurePropertyID',
                'MeasureProperty_Name',
                'EnergyMedium_Name',
                'Report_StartTime',
                'Report_DateTime',
                'Report_ComputeValue',
                'UnitMeasure_Name',
                'ModelBaseName',
                'ModelBaseID'
            ]
        },

        grid_config: {
            columns: {
                items: [{
                    text: '统计单元',
                    dataIndex: 'MeasureProperty_Name'
                }, {
                    text: '能源种类',
                    dataIndex: 'EnergyMedium_Name'
                }, {
                    text: '开始时间',
                    dataIndex: 'Report_StartTime'
                }, {
                    text: '结束时间',
                    dataIndex: 'Report_DateTime'
                }, {
                    text: '统计值',
                    dataIndex: 'Report_ComputeValue'
                }, {
                    text: '单位',
                    dataIndex: 'UnitMeasure_Name'
                }]
            },
        },

        url: '/api/StatisticsReportQuery/GetReportDayByModelbaseAndUnit',
        show_delete_column: true,
        ps: 10,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {

        laydate({
            elem: '#search-date1',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD'
        })
        $('#search-date1').val(laydate.now(0, 'YYYY-MM-DD'));
        laydate({
            elem: '#search-date2',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD'
        })
        $('#search-date2').val(laydate.now(0, 'YYYY-MM-DD'));

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);



        $('#add').click(function () {
            that.on_btn_add_clicked();
        });
        // 绑定查询按钮事件
        $('#query').click(function () {


            that.my_grid.query({
                ModelBaseId: that.current_tree_select_id,
                unitid: $('#search-unit').val(),
                datebegin: $('#search-date1').val(),
                dateend: $('#search-date2').val(),

            }, that.get_Models);
        });
        this.right_panel_init();
        this.my_form_init();
        this.tree_init();
        this.clear();
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MeasurePropertyID: record.MeasurePropertyID, MeasurePropertyName: record.MeasurePropertyName };

        Util.ajax_delete({
            data: data,
            model: 'StatisticsReportQuery',
            confirm_msg: function () {
                return '确认要删' + data.MeasurePropertyName + '吗?';
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


        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'StatisticsReportQuery',
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
            model: 'StatisticsReportQuery',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    //*********************************************注意事**************************************************

    validate: function (data) {
        if (!data.MeasurePropertyName) {
            return "请输入统计单元名称";
        }
        if (!data.ModelBaseID) {
            return "请选择工厂节点";
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;

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
        $('form select').val('');
        $('form input').val('');
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

    //************************************************************************************************
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

            that.my_grid.query({
                ModelBaseId: 'root',
                unitid: '',
                datebegin: $('#search-date1').val(),
                dateend: $('#search-date2').val(),
            }, that.get_Models);
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.current_tree_select_id = id;
        $('#ModelBaseName').val(this.my_tree.current_select_name);
        $('#ModelBaseID').val(this.my_tree.current_select_id);
        $('#search-unit').val('').html('');
        $.ajax({
            url: '/api/StatisticsReportQuery/GetUnitByModelbase',
            type: 'get',
            dataType: 'json',
            data: { modelbaseid: this.current_tree_select_id },
            success: function (data) {
                $('#search-unit').val('');
                var item = data.Models;
                for (i = 0; i < item.length; i++) {
                    //console.log(data)
                    var selector = $('#search-unit');
                    var op = $('<option>');
                    op.val(item[i].MeasureProperty_ID).html(item[i].MeasurePropertyName);
                    selector.append(op);
                    that.current_unit = $('#search-unit').val();
                }
            }
        })
        setTimeout(temp_func, 100);

        function temp_func() {
            that.current_Models = null;
            that.my_grid.query({
                ModelBaseId: id,
                unitid: $('#search-unit').val(),
                datebegin: $('#search-date1').val(),
                dateend: $('#search-date2').val(),
            }, that.get_Models);
        }


    },

    get_Models: function (data) {

        Page.current_Models = data.Models;

        setTimeout(Page.set_current_Models_name_value(Page.current_Models), 100);

    },

    set_current_Models_name_value: function (item) {
        Page.current_MeasureProperty_Name = item[0].MeasureProperty_Name;
        Page.current_UnitMeasure_Name = item[0].UnitMeasure_Name;
        Page.current_Models_name = [];
        Page.current_Models_value = [];
        for (i = 0; i < item.length; i++) {
            Page.current_Models_name[i] = (item[i].Report_StartTime).substr(5, 5); //.replace(/-/g, '.').replace(/\//g, '.');
            Page.current_Models_value[i] = Number(item[i].Report_ComputeValue);
        }

        //setTimeout(Page.set_echarts_line(Page.current_MeasureProperty_Name, Page.current_UnitMeasure_Name, Page.current_Models_name, Page.current_Models_value), 300);

    },

    //set_echarts_line: function (MeasureProperty_Name, UnitMeasure_Name, Name, Value) {
    //    var my_charts = echarts.init(document.getElementById('echarts_line'));
    //    var min = parseInt(_.min(Value) * 0.001) * 1000; //根据统计数据进行取整操作
    //    var option = {
    //        title: {
    //            text: MeasureProperty_Name,
    //            //subtext: '备注',
    //            x: 'center',
    //            textStyle: {
    //                fontSize: 24
    //            },
    //            subtextStyle: {
    //                fontSize: 16
    //            }
    //        },
    //        tooltip: {
    //            trigger: 'axis',
    //            textStyle: {
    //                fontSize: 16
    //            },
    //            axisPointer: {
    //                animation: true
    //            },
    //            position: function (p) {
    //                // 位置回调
    //                // console.log && console.log(p);
    //                return [p[0] - 36, p[1] - 75];
    //            },
    //            padding: 10,
    //            formatter: function (params) {
    //                //console.log('params:');
    //                //console.log(params);
    //                //formatter: "{a} <br/>{b} : {c} ({d}%)";
    //                return params[0].value + ' ' + UnitMeasure_Name + '<br />' + params[0].name;
    //            }
    //        },
    //        grid: {
    //            top: 80
    //        },
    //        legend: {
    //            orient: 'vertical',
    //            left: 'left',
    //            //data: Name
    //        },
    //        xAxis: [
    //            {
    //                data: Name,
    //                nameTextStyle: {
    //                    fontSize: 16
    //                },
    //                axisLabel: {
    //                    textStyle: {
    //                        fontSize: 24
    //                    }
    //                }
    //            }
    //        ],
    //        yAxis: [
    //            {
    //                name: UnitMeasure_Name,
    //                type: 'value',
    //                //max: max,
    //                min: min,
    //                //data: that.Data_Value,
    //                nameTextStyle: {
    //                    fontSize: 24
    //                },
    //                axisLabel: {
    //                    textStyle: {
    //                        fontSize: 24
    //                    }
    //                },
    //                splitLine: {
    //                    show: false
    //                }
    //            }
    //        ],
    //        series: [
    //            {
    //                //name: UnitMeasure_Name,
    //                type: 'line',
    //                symbolSize: 10,
    //                hoverAnimation: false,
    //                data: Value,
    //                label: {
    //                    normal: {
    //                        textStyle: {
    //                            fontSize: 24
    //                        }
    //                    }
    //                }
    //            }
    //        ]
    //    };

    //    my_charts.setOption(option);
    //}

};