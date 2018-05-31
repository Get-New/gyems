
var Page = {

    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            fields: ['EneryAnalysisId', 'Workshop', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Sum']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '车间',
                    dataIndex: 'Workshop'
                }, {
                    text: '1月',
                    dataIndex: 'January'
                }, {
                    text: '2月',
                    dataIndex: 'February'
                }, {
                    text: '3月',
                    dataIndex: 'March',
                }, {
                    text: '4月',
                    dataIndex: 'April'
                }, {
                    text: '5月',
                    dataIndex: 'May'
                }, {
                    text: '6月',
                    dataIndex: 'June'
                }, {
                    text: '7月',
                    dataIndex: 'July'
                }, {
                    text: '8月',
                    dataIndex: 'August'
                }, {
                    text: '9月',
                    dataIndex: 'September'
                }, {
                    text: '10月',
                    dataIndex: 'October'
                }, {
                    text: '11月',
                    dataIndex: 'November'
                }, {
                    text: '12月',
                    dataIndex: 'December'
                }, {
                    text: '合计',
                    dataIndex: 'Sum',
                    width:150
                }]
            }
        },

        url: '/api/EnergyAnalysis/GetPage',
        ps: 8,
        show_delete_column: false,

    },

    init: function () {

        var that = this;   

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        this.tree_init();

  
        staticyear = '2016',

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ staticyear: $('#EnergyStatisticYear').val() });
            that.clear();
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('用能分析');
        })

       // 页面加载后先查询一次
        //this.my_grid.query({ staticyear: '' });
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
            that.my_grid.query({RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({RootId: id });
        //this.clear();
    }
};



$(function () {
    $("input[name=staticcompare]").click(function () {
        showDiffCont();
    });
});

function showDiffCont() {
    switch ($("input[name=staticcompare]:checked").attr("id")) {
        case "sameCompare":
            $(".staticdisplaytime").show();
            $(".mstaticbtn").show();
            break;
        case "diffCompare":
            $(".staticdisplaytime").hide();
            $(".mstaticbtn").hide();
            break;
        default:
            break;
    }
};
