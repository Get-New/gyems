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

        url: '/api/StatisticsReportQuery/GetReportYearByModelbaseAndUnit',
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
            url: '/api/StatisticsReportQuery/GetYearList',
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
                yearbegin: $('#search-quarter1').val(),
                yearend: $('#search-quarter2').val(),
            });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计单元查询');
        })

        this.tree_init();
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
            var ymd = that.current_ymd;
            var date = ymd.strYear + '-' + ymd.strMonth + '-' + ymd.strDay;
            that.my_grid.query({
                ModelBaseId: 'root',
                unitid: '',
                yearbegin: '',
                yearend: '',
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
            async: false,
            data: { modelbaseid: this.current_tree_select_id },
            success: function (data) {
                $('#search-unit').val('');
                var item = data.Models;
                for (i = 0; i < item.length; i++) {
                    console.log(data)
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
            that.my_grid.query({
                ModelBaseId: that.current_tree_select_id,
                unitid: $('#search-unit').val(),
                yearbegin: $('#search-quarter1').val(),
                yearend: $('#search-quarter2').val(),
            });
        }
    }
};