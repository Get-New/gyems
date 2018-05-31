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
    current_data:[],

    /* 当前的时刻 */
    current_quarter: '',

    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'MeasurePropertyID',
                'CrewSchedule_Index',
                'Report_ComputeValue',
                'UnitMeasure_Name'
                
            ]
        },

        grid_config: {
            columns: {
                items: [{
                    text: '班组',
                    dataIndex: 'CrewSchedule_Index'
                }, {
                    text: '统计值',
                    dataIndex: 'Report_ComputeValue'
                }, {
                    text: '单位',
                    dataIndex: 'UnitMeasure_Name'
                }]
            },
        },

        url: '/api/StatisticsReportQuery/GetClassReportByModelbaseAndUnitId',
        show_delete_column: false,
        show_paging: false
    },

    init: function () {

        laydate({
            elem: '#search-date1',
            istime: false,
            format: 'YYYY-MM-DD'
        })
        laydate({
            elem: '#search-date2',
            istime: false,
            format: 'YYYY-MM-DD'
        })

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);


        // 准备下拉框的数据源
       
        $.ajax({
            url: '/api/StatisticsReportQuery/GetUnitByModelbase',
            type: 'get',
            dataType: 'json',
            data: { modelbaseid: this.current_tree_select_id },
            success: function (data) {
                var item = data.Models;
                for (i = 0; i < item.length; i++) {
                    console.log(data)
                    var selector = $('#search-unit');
                    var op = $('<option>');
                    op.val(item[i].MeasureProperty_ID).html(item[i].MeasurePropertyName);
                    selector.append(op);
                    that.current_unit = $('#search-unit').val()
                }
            }
        })
        // 绑定查询按钮事件
        $('#query').click(function () {
       
            that.my_grid.query({
                modelbaseid: that.current_tree_select_id,
                unitid: $('#search-unit').val(),
                datebegin: $('#search-date1').val(),
                dateend: $('#search-date2').val(),

            });
            $.ajax({
                url: '/api/StatisticsReportQuery/GetClassReportByModelbaseAndUnitId',
                type: 'get',
                dataType: 'json',
                data: {
                    modelbaseid: that.current_tree_select_id,
                    unitid: $('#search-unit').val(),
                    datebegin: $('#search-date1').val(),
                    dateend: $('#search-date2').val(),
                },
                success: function (data) {
                    //for (i = 0; i < data.Models.length; i++) {
                    //    that.current_data[i] = data[i].Report_ComputeValue
                    //}
                    that.draw_Chart(data);
                }
            });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计班次查询');
        })

        this.tree_init();
    },

    draw_Chart: function (data) {
        var that = this;
        var id = 'echt-for-sg';
        var my_chart1 = echarts.init(document.getElementById(id));
        //console.log(data.Models.length)
        var series_data = [];
        var series_dataname = [];
        for (j = 0; j < data.Models.length; j++) {
            var a = { value: data.Models[j].Report_ComputeValue, name: data.Models[j].CrewSchedule_Index };
            var b = data.Models[j].CrewSchedule_Index;
            var c = { name: b };
            series_data.push(a);
            series_dataname.push(b);
        };


        var option1 = {

            //visualMap: {
            //    // 是否显示 visualMap 组件，只用于明暗度的映射
            //    show: false,
            //    // 映射的最小值为 80
            //    min: 80,
            //    // 映射的最大值为 600
            //    max: 600,
            //    inRange: {
            //        // 明暗度的范围是 0.5 到 1(0就是黑的)
            //        colorLightness: [0.5, 1]
            //    }
            //},
            title: {
                text: '测试饼图',
                x: 'center',
                textStyle: {
                    fontSize:24
                }

            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}:值为{c}<br/>占比例为:{d}%',

            },

            legend: {
                orient: 'vertical',
                left: 'left',
                data: series_dataname,
                textStyle: {
                    fontSize: 24
                }
            },
            series: {
                name: '来源',
                type: 'pie',
                radius: '80%',
                data: series_data,
                

            },

        };
       
        my_chart1.setOption(option1)
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
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({
                ModelBaseId: 'root',
                unitid: '',
                datebegin: '',
                dateend: '',
           
            });
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
            data: { modelbaseid: this.current_tree_select_id },
            success: function (data) {
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
        setTimeout(temp_func, 300);

        function temp_func() {
            that.my_grid.query({
                modelbaseid: that.current_tree_select_id,
                unitid: $('#search-unit').val(),
                datebegin: $('#search-date1').val(),
                dateend: $('#search-date2').val(),
   
            });
        }
    }
};




