var Page = {

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前的年 */
    current_year: '',  

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
        },

        url: '/api/StatisticsReportQuery/GetReportYearByModelbase',
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
                        $('#search-year').append(option);
                    }

                    if (data[0]) {
                        that.current_year = data[0];
                        that.my_grid.query({
                            ModelBaseId: that.current_tree_select_id,
                            year: that.current_year
                        })
                    }
                }
            }
        })

        // 绑定查询按钮事件
        $('#query').click(function () {
             
            var select_year = $('#search-year').val();

            if (!select_year) {
                Util.alert('请选择正确的年份');
                return;
            }
            
            that.current_year = select_year;

            that.my_grid.query({
                ModelBaseId: that.current_tree_select_id,
                year: that.current_year
            });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计模型查询');
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
                ModelBaseId: 'root',
                year: that.current_year
            });
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.current_tree_select_id = id;      
        this.my_grid.query({
            ModelBaseId: id,
            year: that.current_year
        });
    }
};




