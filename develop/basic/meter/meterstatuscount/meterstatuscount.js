
var Page = {
    
    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',
    
    my_grid: null,
    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'MeterStatusCountId',                    
                    'MeterStatusCountRealAmount',
                    'MeterStatusCountMustAmount',
                    'MeterStatusCountDefectAmount',
                    'MeterStatusCountRealRatio',
                    'MeterStatusCountMustRatio',
                    'MeterStatusCountLevel',
                    'MeterStatusCountDatetime',
                    'MeterStatusCountStandardAmount',
                    'ModelBaseId',
                    'ModelBaseName',
                    'EnergyMediumId',
                    'EnergyMediumName',
                    'MeterStatusId',
                ]
            },

            grid_config: {
                columns: {
                    items: [{
                        text: '工厂模型',
                        dataIndex: 'ModelBaseName',
                    }, {
                        text: '能源介质',
                        dataIndex: 'EnergyMediumName',
                    }, {
                        text: '达标数量',
                        dataIndex: 'MeterStatusCountStandardAmount',
                    }, {
                        text: '实际数量',
                        dataIndex: 'MeterStatusCountRealAmount',
                    }, {
                        text: '缺失数量',
                        dataIndex: 'MeterStatusCountDefectAmount',
                    }, {
                        text: '仪表级别',
                        dataIndex: 'MeterStatusCountLevel',
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "一级";
                                case 2: return "二级";
                                case 3: return "三级";
                                case 4: return "四级";
                                default: return "";
                            }
                        }
                    }, {
                        text: '时间',
                        dataIndex: 'MeterStatusCountDatetime',
                        flex: 2
                    }]
                }
            },

            url: '/api/MeterStatusCount/GetPage',
            ps: 3,
            grid_container_id: 'grid-container',
            pagin_selector: '#paginList1',

            dblclick_handler: 'on_grid_dblclicked',
        }
    },

    my_grid2: null,
    my_grid2_config: function () {
        return {
            store_config: {
                fields: [
                    'MeterBaseId',
                    //'MeterTypeId',
                    //'MeterTypeName',
                    'MeterBaseCode',
                    'MeterBaseName',
                    'MeterBaseLevel',
                    //'MeterBaseType',
                    //'MeterBaseState',
                    'MeterBaseSpecModel',
                    'MeterBaseTecParam',
                    'MeterBaseBuyTime',
                    'MeterBaseServiceTime',
                    'MeterBaseBeginUseTime',
                    'MeterBaseEndUseTime',
                    'MeterBaseManufacturer',
                    'MeterBaseEquPos',
                    'MeterBaseUseDept',
                    'MeterBaseManDept',
                    'ModelBaseId',
                    'ModelBaseName',
                    'EnergyMediumId',
                    'EnergyMediumName'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '工厂模型',
                        dataIndex: 'ModelBaseName',
                        width: 200
                    }, {
                        text: '仪表名称',
                        dataIndex: 'MeterBaseName',
                        width: 200
                    }, {
                        text: '能源介质',
                        dataIndex: 'EnergyMediumName',
                        width: 200
                    }, {
                        text: '仪表编码',
                        dataIndex: 'MeterBaseCode',
                        width: 200
                    }, {
                        text: '仪表级别',
                        dataIndex: 'MeterBaseLevel',
                        width: 200,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "一级";
                                case 2: return "二级";
                                case 3: return "三级";
                                case 4: return "四级";
                                default: return "";
                            }
                        }
                    }, {
                        text: '仪表形态',
                        dataIndex: 'MeterBaseType',
                        width: 200,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "实体";
                                case 2: return "虚拟";
                                default: return "";
                            }
                        }
                    }, {
                        text: '仪表状态',
                        dataIndex: 'MeterBaseState',
                        width: 200,
                        renderer: function (value) {
                            switch (value) {
                                case 1: return "未使用";
                                case 2: return "使用";
                                case 3: return "报废";
                                default: return "";
                            }
                        }
                    }, {
                        text: '规格型号',
                        dataIndex: 'MeterBaseSpecModel',
                        width: 200
                    }, {
                        text: '技术参数',
                        dataIndex: 'MeterBaseTecParam',
                        width: 200
                    }, {
                        text: '购买时间',
                        dataIndex: 'MeterBaseBuyTime',
                        width: 200
                    }, {
                        text: '额定使用时间',
                        dataIndex: 'MeterBaseServiceTime',
                        width: 200
                    }, {
                        text: '开始使用时间',
                        dataIndex: 'MeterBaseBeginUseTime',
                        width: 200
                    }, {
                        text: '停止使用时间',
                        dataIndex: 'MeterBaseEndUserTime',
                        width: 200
                    }, {
                        text: '制造商',
                        dataIndex: 'MeterBaseManufacturer',
                        width: 200
                    }, {
                        text: '配备位置',
                        dataIndex: 'MeterBaseEquPos',
                        width: 200
                    }, {
                        text: '使用部门',
                        dataIndex: 'MeterBaseUseDept',
                        width: 200
                    }, {
                        text: '管理部门',
                        dataIndex: 'MeterBaseManDept',
                        width: 200
                    }]
                }
            },

            url: '/api/MeterStatusCount/GetPageDetail',
            ps: 3,
            grid_container_id: 'grid-container2',
            pagin_selector: '#paginList2'
        }
    },


    init: function () {

        var that = this;


        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('计量器具查询');
        })


        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());
        this.my_grid2 = new MyGrid(this, this.my_grid2_config());

        // 页面加载后立即查询一次
        this.my_grid.query({ ModelBaseId: 'root' });

        this.tree_init();
    },

    on_grid_dblclicked: function () {
        var that = this;

        var row = that.my_grid.get_last_selected();
        if (row == null) {
            return;
        }
        that.my_grid2.query({
            ModelBaseId: row.data.ModelBaseId,
            EnergyMediumId: row.data.EnergyMediumId
        });
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
            that.my_grid.query({ ModelBaseId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({ ModelBaseId: id });        
    }
};






