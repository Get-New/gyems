var Page = {
    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: [
                'ITEMNAME',
                'ITEMCODE',
                'UNITS'
            ]
        },

        grid_config: {
            columns: {
                items: [
                {
                    text: '名称',
                    dataIndex: 'ITEMNAME',
                    flex: 0.9
                }, {
                    text: '编码',
                    dataIndex: 'ITEMCODE',
                    flex: 0.9
                }, {
                    text: '单位',
                    dataIndex: 'UNITS',
                    flex: 0.9
                }
                ]
            },
        },

        url: '/api/ProductClass/GetProductionCode',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: false

        //row_select_handler: 'on_grid_row_selected'
        //dblclick_handler: 'on_grid_dblclicked'
        //delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        $('#search-name').val('');

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                ITEMNAME: $('#search-name').val()
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;

                that.my_grid.query({
                    ITEMNAME: $('#search-name').val()
                });
            }
        });

        // 页面加载后先查询一次
        this.my_grid.query({
            ITEMNAME: $('#search-name').val()
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('生产数据编码');
        });
    }
};