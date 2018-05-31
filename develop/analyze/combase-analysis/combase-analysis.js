var Page = {
    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: [
            'BenchmarkingBaseID',
            'EngeryKPIID',
            'EngeryKPIName',
            'BenchmarkingBaseName',
            'BenchmarkingBaseNational',
            'BenchmarkingBaseIndustry',
            'BenchmarkingBaseEnterprise',
            'BenchmarkingBaseUOM',
            'USERID',
            'LASTMODIFYTIME',
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [

               {
                   text: '指标项目',
                   dataIndex: 'BenchmarkingBaseName',
                   flex: 0.5,
               },
               //{
               //    text: '绩效指标',
               //    dataIndex: 'EngeryKPIName',
               //    flex: 0.5,
               //},


                 {
                     text: '国家标准',
                     dataIndex: 'BenchmarkingBaseNational',
                     flex: 0.5,
                 },
                  {
                      text: '行业标准',
                      dataIndex: 'BenchmarkingBaseIndustry',
                      flex: 0.5,
                  },
                   {
                       text: '厂内标准',
                       dataIndex: 'BenchmarkingBaseEnterprise',
                       flex: 0.5,
                   },
                    {
                        text: '时间',
                        dataIndex: 'LASTMODIFYTIME',
                        flex: 0.5,
                    },

                ]
            },
        },
        url: '/api/BenchmarkingBase/GetPage',
        ps: 8,
        show_delete_column: false,
        row_select_handler: 'on_grid_row_selected',

    },
    on_grid_row_selected: function (data, index) {
        this.my_chart(data)

    },


    //***************************************************内置函数****************************8

    init: function () {

        var that = this;

        this.my_grid = new MyGrid(this, this.my_grid_config);




        $('#refresh').click(function () {
            that.my_group.reload();
            that.my_grid.query({ BenchmarkingBaseName: '', BenchmarkingBaseID: '' });

        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能源对标分析');
        })

        that.my_grid.query({ BenchmarkingBaseName: '', BenchmarkingBaseID: '' }
            //,
            //function () {
            //that.my_chart()
            //}
        );

        this.my_group_init();
   
    },



    //**********************************************************************************
    my_group: null,


    current_group_select_id: '',

    my_group_config: {
        store_config: {
            fields: ['BenchmarkingBaseID',
                     'BenchmarkingBaseName']
        },

        grid_config: {

            columns: {
                items: [{
                    text: '产品能耗指标',
                    dataIndex: 'BenchmarkingBaseName',
                    flex: 1
                },
                ]
            },
        },

        grid_container_id: 'group-container',

        url: '/api/BenchmarkingBase/GetPage',
        show_delete_column: false,
        show_paging: false,

        row_select_handler: 'on_group_row_selected',
    },

    on_group_row_selected: function (data, index) {
        var id = data.BenchmarkingBaseID;

        $('#search-name').val('');

        this.current_group_select_id = id;

        this.my_grid.query({
            BenchmarkingBaseName: '', BenchmarkingBaseID: id
        });
    },


    my_group_init: function () {
        var that = this;


        this.my_group = new MyGrid(this, this.my_group_config)

        //页面加载后查询
        this.my_group.query({ BenchmarkingBaseName: '', BenchmarkingBaseID: '' }, function (data) {
            // 自动选中第一行
            //that.my_group.grid.getSelectionModel().select(0);
        });
    },
    

    my_chart: function (data) {
        var myChart1 = echarts.init(document.getElementById('echt'));
        var option1 = {
            
            title: {
                text: '分析柱状图',
                textStyle:{fontSize:30}
            },

            tooltip: {},
            legend: {
                data: ['各种标准'],
                textStyle: { fontSize: 20 }
            },
            xAxis: {
                
                data: ["国标", "行标", "厂标"],
                axisLabel: {
                    textStyle: { fontSize: 20 }
                }
            },
            yAxis: {
                axisLabel: {
                    textStyle: { fontSize: 20 }
                }
            },
            series: [{
                name: '各种标准',
                type: 'bar',
                data: [data.BenchmarkingBaseNational, data.BenchmarkingBaseIndustry, data.BenchmarkingBaseEnterprise, ]
            }]
        };
        myChart1.setOption(option1);
    }

};

//***********************************************************************************88
