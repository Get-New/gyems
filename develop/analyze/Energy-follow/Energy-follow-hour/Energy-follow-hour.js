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
                'EnergyMedium_Name',
                'UnitMeasure_Name'
            ]
        },

        grid_config: {
            columns: {
                items: [{
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
        },

        url: '/api/StatisticsReportQuery/GetHourUseEnergyTrace',
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
        $('#search-date1').val(laydate.now(0, 'YYYY-MM-DD'));

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);



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
                        $('#search-quarter1').append(option);
                        that.current_begintime = $('#search-quarter1').val();
                    }
                }
            }
        })

      
        // 绑定查询按钮事件
        $('#query').click(function () {


            that.my_grid.query({
                parentmodelbaseid: that.current_tree_select_id,
                date: $('#search-date1').val(),
                hour: $('#search-quarter1').val(),
                //quarterhourbegin: that.current_begintime,
            });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能耗分析');
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
            that.current_tree_select_id = 'root';
            that.my_grid.query({
                parentmodelbaseid: 'root',
                date: '',
                hour: '',
               
            });
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.current_tree_select_id = id;

       
        this.my_grid.query({
            ModelBaseId: that.current_tree_select_id,
            parentmodelbaseid: that.current_tree_select_id,
            date: $('#search-date1').val(),
            hour: $('#search-quarter1').val(),
        });
    }
};






