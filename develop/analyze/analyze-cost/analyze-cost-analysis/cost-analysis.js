
var Page = {
    
    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',
    
    my_grid: null,
    my_grid_config: function () {
        return {
            store_config: {
                fields: [                    
                    'Month',
                    'Water',
                    'Elec',
                    'Gas',
                    'Total'
                ]
            },

            grid_config: {
                columns: {
                    items: [{
                        text: '',
                        dataIndex: 'Month',
                        flex: 0,
                        minWidth: '109',
                        renderer: function (value) {
                            switch (value) {
                                case 1: return '一月';
                                case 2: return '二月';
                                case 3: return '三月';
                                case 4: return '四月';
                                case 5: return '五月';
                                case 6: return '六月';
                                case 7: return '七月';
                                case 8: return '八月';
                                case 9: return '九月';
                                case 10: return '十月';
                                case 11: return '十一月';
                                case 12: return '十二月';
                            }
                        }
                    }, {
                        text: '水',
                        dataIndex: 'Water',
                    }, {
                        text: '电',
                        dataIndex: 'Elec',
                    }, {
                        text: '气',
                        dataIndex: 'Gas',
                    }, {
                        text: '合计',
                        dataIndex: 'Total'
                    }]
                }
            },

            url: '/api/AnalyzeCostAnalysis/GetPage',
            show_delete_column: false,
            corner_icon: '/images2/corner-efficiency-query.png',
            is_report: 'true',
            show_paging: false
        }
    },

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config()); 

        // 页面加载后立即查询一次
        this.my_grid.query({ RootId: 'root' });

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ MeterBaseName: $('#search-name').val(), RootId: that.current_tree_select_id });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('成本分析');
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
            that.my_grid.query({ RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({ RootId: id });
        this.clear();
    }
};






