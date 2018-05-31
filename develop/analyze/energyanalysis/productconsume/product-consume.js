
var Page = {

    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: ['ProductConsumeId', 'EnergyName', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'SumProductConsume']},

            grid_config: {
                columns: {
                    items: [{
                        text: '能耗指标',
                        dataIndex: 'EnergyName'
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
                        text: '综合单耗',
                        dataIndex: 'SumProductConsume'
                    }]
                }
            },

            url: '/api/ProductConsume/GetPage',
            ps: 8,
            show_delete_column: false,

    },

    init: function () {

        var that = this;

        // 初始化MyGrid


        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('产品单耗');
        })


        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 页面加载后先查询一次
        staticyear ='2011',
        this.my_grid.query({ staticyear: '' });
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
            $("#staticdisplaytime").show();
            $(".mstaticbtn").show();
            break;
        case "diffCompare":
            $("#staticdisplaytime").hide();
            $(".mstaticbtn").hide();
            break;
        default:
            break;
    }
};
