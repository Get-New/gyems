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

    /* 当前的时刻 */
    current_quarter: '',

    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'MeasurePropertyID',
                'ModelBase_Name',
                'Report_ComputeValue',
                'ModelBaseID',
                'UnitMeasure_Name'

            ]
        },

        grid_config: {
            columns: {
                items: [{
                    text: '工厂模型',
                    dataIndex: 'ModelBase_Name'
                }, {
                    text: '统计值',
                    dataIndex: 'Report_ComputeValue'
                }, {
                    text: '单位',
                    dataIndex: 'UnitMeasure_Name'
                }]
            },
        },

        url: '/api/StatisticsReportQuery/GetMonthUseEnergyAnalysis',
        show_delete_column: false,
        show_paging: false
    },

    init: function () {
        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 准备下拉框的数据源
        $.ajax({
            url: '/api/StatisticsReportQuery/GetYearList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (_.isArray(data)) {
                    for (var i in data) {
                        var item = data[i];
                        var option = $('<option>').val(item).html(item);
                        $('#search-quarter1').append(option);
                        that.current_begintime = $('#search-quarter1').val();
                    }
                }
            }
        })
        $.ajax({
            url: '/api/StatisticsReportQuery/GetMonthList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (_.isArray(data)) {
                    for (var i in data) {
                        var item = data[i];
                        var option = $('<option>').val(item).html(item);
                        $('#search-quarter2').append(option);
                        that.current_begintime = $('#search-quarter2').val();
                    }
                }
            }
        })

        $.ajax({
            url: '/api/StatisticsReportQuery/GetEnergyTypeByModelbase',
            type: 'get',
            dataType: 'json',
            data: { modelbaseid: this.current_tree_select_id },
            success: function (data) {
                var item = data.Models;
                for (i = 0; i < item.length; i++) {
                    console.log(data)
                    var selector = $('#search-unit');
                    var op = $('<option>');
                    op.val(item[i].EnergyMedium_ID).html(item[i].EnergyMedium_Name);
                    selector.append(op);
                    that.current_unit = $('#search-unit').val();
                }
            }
        })
        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                parentmodelbaseid: that.current_tree_select_id,
                energytypeid: $('#search-unit').val(),

                year: $('#search-quarter1').val(),
                month: $('#search-quarter2').val(),
                //quarterhourbegin: that.current_begintime,
            });
            $.ajax({
                url: '/api/StatisticsReportQuery/GetMonthUseEnergyAnalysis',
                type: 'get',
                dataType: 'json',
                data: {
                    parentmodelbaseid: that.current_tree_select_id,
                    energytypeid: $('#search-unit').val(),
                    year: $('#search-quarter1').val(),
                    month: $('#search-quarter2').val(),
                },
                success: function (data) {
                    that.draw_Charts(data)
                }
            })
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能耗追踪');
        })

        this.tree_init();
    },

    draw_Charts: function (data) {
        var id = 'energyfollow-quater';
        var mycht = echarts.init(document.getElementById(id));
        var data_array = [];
        var data_name = [];
        var new_data = [];

        for (i = 0; i < data.Models.length; i++) {
            var d1 = data.Models[i].Report_ComputeValue;
            var d2 = data.Models[i].ModelBase_Name;
            data_array.push(d1);
            data_name.push(d2);
            var d3 = {
                value: d1, name: d2,
                label: { normal: { show: true, textStyle: { fontSize: 24 } } }
            };
            new_data.push(d3);
        }
        var optionss = {
            title: {
                text: '测试数据饼图样式',

                x: 'center',
                textStyle: {
                    fontSize: 40
                }
            },

            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: 24
                },
                formatter: '{b}<br/>值为{c}({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: data_name,
                textStyle: {
                    fontSize: 24
                }
            },
            series: {
                type: 'pie',
                name: '测试数据',
                radius: '70%',
                data: new_data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 50,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        };
        mycht.setOption(optionss);
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
                parentmodelbaseid: 'root',
                energytypeid: $('#search-unit').val(),

                year: '',
                month: '',
            });
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.current_tree_select_id = id;

        $('#search-unit').val('').html('');
        $.ajax({
            url: '/api/StatisticsReportQuery/GetEnergyTypeByModelbase',
            type: 'get',
            dataType: 'json',
            data: { modelbaseid: this.current_tree_select_id },
            success: function (data) {
                var item = data.Models;
                for (i = 0; i < item.length; i++) {
                    console.log(data)
                    var selector = $('#search-unit');
                    var op = $('<option>');
                    op.val(item[i].EnergyMedium_ID).html(item[i].EnergyMedium_Name);
                    selector.append(op);
                    that.current_unit = $('#search-unit').val();
                }
            }
        })
        setTimeout(temp_func, 300);

        function temp_func() {
            that.my_grid.query({
                parentmodelbaseid: that.current_tree_select_id,
                energytypeid: $('#search-unit').val(),
                year: $('#search-quarter1').val(),
                month: $('#search-quarter2').val(),
            });
        }
    }
};