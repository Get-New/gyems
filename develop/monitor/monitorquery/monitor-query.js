
var Page = {

    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            fields: ['AlarmHistoryId', 'AlarmHistoryName', 'AlarmHistoryBeginTime', 'AlarmHistoryEndTime', 'AlarmHistoryTotalTime', 'AlarmHistoryResult', 'AlarmHistoryContent', 'AlarmGradeId', 'AlarmGradeName', 'AlarmTypeId', 'AlarmTypeName']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '报警名称',
                    dataIndex: 'AlarmHistoryName',
                    width: 200
                }, {
                    text: '报警内容',
                    dataIndex: 'AlarmHistoryContent',
                    width: 200
                }, {
                    text: '开始时间',
                    dataIndex: 'AlarmHistoryBeginTime',
                    width: 200
                },{
                    text: '结束时间',
                    dataIndex: 'AlarmHistoryEndTime',
                    width: 260
                }, {
                    text: '报警持续时间',
                    dataIndex: 'AlarmHistoryTotalTime',
                    width: 260
                }, {
                    text: '报警级别',
                    dataIndex: 'AlarmGradeName',
                    width: 200
                }, {
                    text: '报警类型',
                    dataIndex: 'AlarmTypeName',
                    width: 200
                }
                ]
            }
        },

        url: '/api/AlarmHistory/GetPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: false,
    },

    init: function () {

        var that = this;
        this.select_alarm_type();
        this.select_alarm_grade();
        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ AlarmTypeName: $('#MonitorQueryType').val(), AlarmGradeName: $('#MonitorQueryGrade').val(), AlarmHistoryBeginTime: $('#monitorquerystartdt').val(), AlarmHistoryEndTime: $('#monitorqueryenddt').val(), RootId:that.current_tree_select_id });
            //that.clear();
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('报警查询');
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
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            this.select_alarm_type();
            this.select_alarm_grade();
            that.current_tree_select_id = 'root';
            $('#MonitorQueryType').val('');
            $('#MonitorQueryGrade').val('');
            $('#monitorquerystartdt').val('');
            $('#monitorqueryenddt').val('');
            that.my_grid.query({ AlarmTypeName: $('#MonitorQueryType').val(), AlarmGradeName: $('#MonitorQueryGrade').val(), AlarmHistoryBeginTime: $('#monitorquerystartdt').val(), AlarmHistoryEndTime: $('#monitorqueryenddt').val(), RootId:id });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.select_alarm_type();
        this.select_alarm_grade();
        $('#MonitorQueryType').val('');
        $('#MonitorQueryGrade').val('');
        $('#monitorquerystartdt').val('');
        $('#monitorqueryenddt').val('');
        this.my_grid.query({ AlarmTypeName: $('#MonitorQueryType').val(), AlarmGradeName: $('#MonitorQueryGrade').val(), AlarmHistoryBeginTime: $('#monitorquerystartdt').val(), AlarmHistoryEndTime: $('#monitorqueryenddt').val(), RootId:id });
        //this.clear();
    },

    // 准备报警类型下拉框的数据源
    select_alarm_type: function () {

        $('#MonitorQueryType').val('').html('');

        $.ajax({
            url: '/api/AlarmType/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载报警类型失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#MonitorQueryType').append("<option value='-1'>没有报警类型可供选择</option>");
                    //$('#MonitorQueryType').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#MonitorQueryType').append(option);

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.AlarmtypeId).html(item.AlarmtypeName);
                    $('#MonitorQueryType').append(option);
                }

                $('#MonitorQueryType').val('');

                //if (typeof callback == 'function') {
                //    callback();
                //}
            }
        })
    },

    // 准备报警等级下拉框的数据源
    select_alarm_grade: function () {

        $('#MonitorQueryGrade').val('').html('');

        $.ajax({
            url: '/api/AlarmGrade/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载报警等级失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#MonitorQueryGrade').append("<option value='-1'>没有报警等级可供选择</option>");
                    //$('#MonitorQueryGrade').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#MonitorQueryGrade').append(option);

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.AlarmgradeId).html(item.AlarmgradeName);
                    $('#MonitorQueryGrade').append(option);
                }

                $('#MonitorQueryGrade').val('');

                //if (typeof callback == 'function') {
                //    callback();
                //}
            }
        })
    },
};