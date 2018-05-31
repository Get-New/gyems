var Page = {

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前的日期 */
    current_ymd: null,

    /* 当前的小时 */
    current_select_condition: '',

    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'Report_ComputeValue',
                'EnergyMedium_Name',
                'MeasureProperty_Name',
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
                    text: '统计值',
                    dataIndex: 'Report_ComputeValue'
                }, {
                    text: '单位',
                    dataIndex: 'UnitMeasure_Name'
                }]
            },

            url: '/api/StatisticsReportQuery/GetReportHourByModelbase',
            show_delete_column: false,
            show_paging: false
        },
    },

    init: function () {

        laydate({
            elem: '#search-date',
            istime: false,
            format: 'YYYY-MM-DD'
        })

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 默认选择今天
        var now = new Date();
        var ymd = parseDate(now);
        var today = ymd.strYear + '-' + ymd.strMonth + '-' + ymd.strDay;
        that.current_ymd = ymd;
        $('#search-date').val(today);

        // 准备下拉框的数据源
        $.ajax({
            url: '/api/StatisticsReportQuery/GetHourList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (_.isArray(data)) {
                    for (var i in data) {
                        var item = data[i];
                        var option = $('<option>').val(item).html(item);
                        $('#search-select').append(option);
                    }

                    if (data[0]) {
                        that.current_select_condition = data[0];
                        that.my_grid.query({
                            ModelBaseId: that.current_tree_select_id,
                            date: today,
                            hour: data[0]
                        })
                    }
                }
            }
        })

        // 绑定查询按钮事件
        $('#query').click(function () {
            var ymd = that.get_ymd_from_search_input();

            if (!ymd) {
                Util.alert('日期格式不正确');
                return;
            }

            var select_condition = $('#search-select').val();

            if (!select_condition) {
                Util.alert('请选择正确的时间');
                return;
            }

            that.current_ymd = ymd;
            that.current_select_condition = select_condition;
            var date = ymd.strYear + '-' + ymd.strMonth + '-' + ymd.strDay;

            that.my_grid.query({
                ModelBaseId: that.current_tree_select_id,
                date: date,
                hour: select_condition
            });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计模型查询');
        })

        this.tree_init();
    },

    // 从输入框获得年月日
    get_ymd_from_search_input: function () {
        var str = $('#search-date').val();
        var arr = str.split('-');
        var strYear = arr[0];
        var strMonth = arr[1];
        var strDay = arr[2];
        var year = parseInt(strYear);
        var month = parseInt(strMonth);
        var day = parseInt(strDay);
        if (typeof strYear == 'string' && typeof strMonth == 'string'
            && typeof year == 'number' && typeof month == 'number'
            && typeof strDay == 'string' && typeof day == 'number') {
            var obj = {
                strYear: strYear,
                strMonth: strMonth,
                strDay: strDay,
                year: year,
                month: month,
                day: day
            };
            return obj;
        }
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
            var ymd = that.current_ymd;
            var date = ymd.strYear + '-' + ymd.strMonth + '-' + ymd.strDay;
            that.my_grid.query({
                ModelBaseId: 'root',
                date: date,
                hour: that.current_select_condition
            });
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.current_tree_select_id = id;
        var ymd = that.current_ymd;
        var date = ymd.strYear + '-' + ymd.strMonth + '-' + ymd.strDay;
        this.my_grid.query({
            ModelBaseId: id,
            date: date,
            hour: that.current_select_condition
        });
    }
};






function parseDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var strYear = year;
    var strMonth = month;
    var strDay = day;

    if (month >= 1 && month <= 9) {
        strMonth = "0" + strMonth;
    }
    if (strDay >= 0 && strDay <= 9) {
        strDay = "0" + strDay;
    }
    var obj = {
        year: year,
        month: month,
        day: day,
        strYear: strYear,
        strMonth: strMonth,
        strDay: strDay
    }
    return obj;
}
