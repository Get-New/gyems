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
    current_EnergyMedium_Name: '',

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
                'UnitMeasure_Name'
            ]
        },

        grid_config: {
            columns: {
                items: [{
                    text: '统计单元',
                    dataIndex: 'MeasureProperty_Name'
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
                    text: '能源种类',
                    dataIndex: 'EnergyMedium_Name'
                }
                //, {
                //    text: '单位',
                //    dataIndex: 'UnitMeasure_Name'
                //}
                ]
            },
        },

        url: '/api/StatisticsReportQuery/GetReportDayByModelbaseAndUnit',
        show_delete_column: false,
        show_paging: false
    },

    init: function () {
        laydate({
            elem: '#search-date1',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD'
        })
        $('#search-date1').val(laydate.now(-60, 'YYYY-MM-DD'));
        laydate({
            elem: '#search-date2',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD'
        })
        $('#search-date2').val(laydate.now(0, 'YYYY-MM-DD'));

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计单元查询');
        })

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 准备下拉框的数据源

        //$.ajax({
        //    url: '/api/StatisticsReportQuery/GetUnitByModelbase',
        //    type: 'get',
        //    dataType: 'json',
        //    data: { modelbaseid: this.current_tree_select_id },
        //    success: function (data) {
        //        var item = data.Models;
        //        for (i = 0; i < item.length; i++) {
        //            console.log(data)
        //            var selector = $('#search-unit');
        //            var op = $('<option>');
        //            op.val(item[i].MeasureProperty_ID).html(item[i].MeasurePropertyName);
        //            selector.append(op);
        //            that.current_unit = $('#search-unit').val()
        //        }
        //    }
        //})
        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                ModelBaseId: that.current_tree_select_id,
                unitid: $('#search-unit').val(),
                datebegin: $('#search-date1').val(),
                dateend: $('#search-date2').val(),
            }, that.get_Models);
        });

        this.tree_init();
    },

    search_unit_onchange: function () {
        var that = this;
        that.my_grid.query({
            ModelBaseId: that.current_tree_select_id,
            unitid: $('#search-unit').val(),
            datebegin: $('#search-date1').val(),
            dateend: $('#search-date2').val(),
        }, that.get_Models);
    },

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
        $('#search-unit').val('').html('');
        $.ajax({
            url: '/api/StatisticsReportQuery/GetUnitByModelbase',
            type: 'get',
            dataType: 'json',
            async: false,
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
        if (!item[0]) {
            Util.alert('查询结果为空');
            return false;
        }
        Page.current_MeasureProperty_Name = item[0].MeasureProperty_Name;
        Page.current_UnitMeasure_Name = item[0].UnitMeasure_Name;
        Page.current_EnergyMedium_Name = item[0].EnergyMedium_Name;
        Page.current_Models_name = [];
        Page.current_Models_value = [];
        for (i = 0; i < item.length; i++) {
            Page.current_Models_name[i] = (item[i].Report_StartTime).substr(5, 5); //.replace(/-/g, '.').replace(/\//g, '.');
            Page.current_Models_value[i] = Number(item[i].Report_ComputeValue);
        }

        setTimeout(Page.set_echarts_line(Page.current_MeasureProperty_Name, Page.current_EnergyMedium_Name, Page.current_Models_name, Page.current_Models_value), 300);
    },

    set_echarts_line: function (MeasureProperty_Name, EnergyMedium_Name, Name, Value) {
        var my_charts = echarts.init(document.getElementById('echarts_line'));
        //var min = 0; //parseInt(_.min(Value) * 0.001) * 1000; //根据统计数据进行取整操作
        var option = {
            title: {
                text: MeasureProperty_Name,
                //subtext: '备注',
                x: 'center',
                textStyle: {
                    fontSize: 18
                },
                subtextStyle: {
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 14
                },
                axisPointer: {
                    animation: true
                },
                position: function (p) {
                    // 位置回调
                    // console.log && console.log(p);
                    return [p[0] - 36, p[1] - 75];
                },
                padding: 10,
                formatter: function (params) {
                    //console.log('params:');
                    //console.log(params);
                    //formatter: "{a} <br/>{b} : {c} ({d}%)";
                    return params[0].value + ' ' + EnergyMedium_Name + '<br />' + params[0].name;
                }
            },
            grid: {
                top: 80
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                //data: Name
            },
            xAxis: [
                {
                    data: Name,
                    nameTextStyle: {
                        fontSize: 14
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 18
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: EnergyMedium_Name,
                    type: 'value',
                    //max: max,
                    //min: min,
                    //data: that.Data_Value,
                    nameTextStyle: {
                        fontSize: 18
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 18
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    //name: UnitMeasure_Name,
                    type: 'line',
                    symbolSize: 10,
                    hoverAnimation: false,
                    data: Value,
                    label: {
                        normal: {
                            textStyle: {
                                fontSize: 18
                            }
                        }
                    }
                }
            ]
        };

        my_charts.setOption(option);
    }
};