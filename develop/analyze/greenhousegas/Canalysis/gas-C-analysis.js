
var Page = {

    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            fields: ['GreenhouseGasesRecordId', 'EnergyMediumId','EnergyMediumName', 'GreenhouseGasesRecordEnergyValue', 'GreenhouseGasesRecordCValue', 'GreenhouseGasesRecordCRate']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '能源介质',
                    dataIndex: 'EnergyMediumName'
                }, {
                    text: '能源消耗量',
                    dataIndex: 'GreenhouseGasesRecordEnergyValue'
                }, {
                    text: '二氧化碳排放量',
                    dataIndex: 'GreenhouseGasesRecordCValue'
                }, {
                    text: '比率',
                    dataIndex: 'GreenhouseGasesRecordCRate'
                }]
            }
        },

        url: '/api/GreenhouseGasesRecord/GetPage',
        ps: 8,
        show_delete_column: false,
    },

    init: function () {

        var that = this;

        this.tree_init();

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('碳排放分析');
        })

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 页面加载后先查询一次
        //this.my_grid.query({  RootId: 'root', GreenhouseGasesRecordDatetime:'' });
    },

    my_tree: null,

    tree_config: {
        url: '/api/EnergyMedium/GetTree',
        root_name: '能源种类',
        id_field: 'EnergyMediumId',
        name_field: 'EnergyMediumName',
        appendRoot: true
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
            $('#GreenhouseGasesRecordStatisticMonth').val('');
            that.my_grid.query({ RootId: 'root', GreenhouseGasesRecordDatetime: $('#GreenhouseGasesRecordStatisticMonth').val() });
        });

        // 查询按钮
        $('#query').click(function () {
            that.my_tree.reset();
            that.my_grid.query({ RootId: that.current_tree_select_id, GreenhouseGasesRecordDatetime: $('#GreenhouseGasesRecordStatisticMonth').val() });
        });

    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        $('#GreenhouseGasesRecordStatisticMonth').val('');
        this.my_grid.query({ RootId: id, GreenhouseGasesRecordDatetime: $('#GreenhouseGasesRecordStatisticMonth').val() });
    },


    my_form: null,

    my_form_config: {
        selector: 'form',
    },

    my_form_init: function () {
        var that = this;

        // 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form = new MyForm(this, this.my_form_config);
    }
};