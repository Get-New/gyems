
var Page = {

    group_grid: null,

    group_grid_config: {
        store_config: {
            fields: ['RoleId', 'RoleName']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '菜单权限分组',
                    dataIndex: 'RoleName'
                }]
            }
        },
        grid_container_id: 'group-container',

        url: '/api/ManageRoleauthors/Init',
        show_delete_column: false,
        show_paging: false,

        row_select_handler: 'on_grid_row_selected',        
    },

    

    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: ['MenufeatureId', 'MenuId', 'MenuName', 'FeatureId', 'FeatureAlias', 'Active', 'ParentName']
        },

        grid_config: {
            columns: {
                items: [{
                    xtype: 'checkcolumn',
                    text: '授权',
                    dataIndex: 'Active',
                    flex: 0.3                    
                }, {
                    text: '目录',
                    dataIndex: 'ParentName',
                    flex: 0.75
                },{
                    text: '页面',
                    dataIndex: 'MenuName',
                    flex: 0.75
                }, {
                    text: '功能',
                    dataIndex: 'FeatureAlias',
                    flex: 0.5
                }]
            }
        },

        url: '/api/ManageRoleauthors/GetPage',
        ps: 8,
        show_delete_column: false,
        show_paging: false,
    },

    current_RoleId: 0,

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
            obj.RoleId = that.current_RoleId;

            var items = _.pluck(that.my_grid.grid.store.data.items, 'data');
            var selected = _.select(items, 'Active');
            obj.MenufeatureIds = _.pluck(selected, 'MenufeatureId').join(',');

            var datas = _.pluck(that.my_grid.grid.store.data.items, 'data');

            Util.ajax({
                url: '/api/ManageRoleauthors/Save',
                type: 'post',
                data: obj,
                show_success_msg: true,
                success_msg: '保存成功'
            })
            
        })
    },

    // 行选择事件
    on_grid_row_selected: function (data, index) {
        this.select_role(data.RoleId);
        this.current_RoleId = data.RoleId;
    },

    select_role: function (RoleId) {
        this.my_grid.query({ RoleId: RoleId });
    }

};



