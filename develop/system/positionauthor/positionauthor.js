
var Page = {

    group_grid: null,

    group_grid_config: {
        store_config: {
            fields: ['PositionId', 'PositionName']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '数据节点分组',
                    dataIndex: 'PositionName'
                }]
            }
        },
        grid_container_id: 'group-container',

        url: '/api/ManagePositionauthors/Init',
        show_delete_column: false,
        show_paging: false,

        row_select_handler: 'on_grid_row_selected',        
    },

    

    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: [
                'ModelbaseId',
                'ModelbaseName',
                'ModelBaseLevel',
                'Active', //TODO define or ..
                'ParentId',
                'ParentName',
                'PositionId',
                'Active'
            ]
        },

        grid_config: {
            autoScroll: true,
            columns: {
                items: [{
                    xtype: 'checkcolumn',
                    text: '授权',
                    dataIndex: 'Active',
                    flex: 0.3
                }, {
                    text: '节点',
                    dataIndex: 'ModelbaseName',
                    width: 300
                },
                {
                    text: '父节点',
                    dataIndex: 'ParentName',
                    width: 120
                }
                ]
            }
        },

        url: '/api/ManagePositionauthors/GetPage',
        ps: 8,
        show_delete_column: false,
        show_paging: false,
    },

    current_PositionId: 0,

    init: function () {
        var that = this;

        // 初始化GroupGrid
        this.group_grid = new MyGrid(this, this.group_grid_config)

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);
        
        // 页面加载后查询
        this.group_grid.query({}, function (data) {

            // 自动选中第一行
            that.group_grid.grid.getSelectionModel().select(0);
        });
        
        // 刷新
        $('#refresh').click(function () {

            that.group_grid.query({}, function (data) {

                // 自动选中第一行
                that.group_grid.grid.getSelectionModel().select(0);
            });
        })

        // 全选
        $('#button-select-all').click(function () {
            var datas = _.pluck(that.my_grid.grid.store.data.items, 'data');
            
            if( _.any(datas, 'Active', false))
                _.map(datas, function (x) { x.Active = true; });
            else
                _.map(datas, function (x) { x.Active = false; });

            that.my_grid.grid.getView().refresh();
        })

        // 保存
        $('#submit-edit').click(function () {            
            var obj = {};
            obj.PositionId = that.current_PositionId;

            var items = _.pluck(that.my_grid.grid.store.data.items, 'data');
            var selected = _.select(items, 'Active');
            obj.ModelbaseIds = _.pluck(selected, 'ModelbaseId').join(',');

            var datas = _.pluck(that.my_grid.grid.store.data.items, 'data');

            Util.ajax({
                url: '/api/ManagePositionauthors/Add',
                type: 'post',
                data: obj,
                show_success_msg: true,
                success_msg: '保存成功'
            })
            
        })
        
        this.tree_init();
    },

    // 行选择事件
    on_grid_row_selected: function (data, index) {
        this.my_tree.reset();
        this.select_position(data.PositionId);
        this.current_PositionId = data.PositionId;
    },

    select_position: function (PositionId) {
        this.my_grid.query({ ModelbaseId: 'root', PositionId: PositionId });
    },


    my_tree: null,

    tree_config: {
        url: '/api/FactoryModelbase/GetTree',
        root_name: '工厂模型',
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

    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id || "";
        this.my_grid.query({ ModelbaseId: id, PositionId: this.current_PositionId });
    }

};



