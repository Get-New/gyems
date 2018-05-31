




//！特别注意！
//本页面中使用的是伪数据源，具体数据有待后续数据库的开发
//要修改数据可以到统计单元管理处操作(statistics-management)
//另外测试数据请在生产车间3查看并演示

var Page = {
    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
            'MeasurePropertyID',
            'ModelBaseID',
            'ModelBaseName',
            'MeasurePropertyName',
            'EnergyMediumName',
            'EnergyMediumId',
            'StatisticCycleID',
            'StatisticCycleTime',
            'MeasurePropertyClass',
            'MeasurePropertyCalcFormula',
            'DESCRIPTIONINFO',
            'ENABLESIGN',
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [

                 {
                     text: '工厂模型',
                     dataIndex: 'ModelBaseName',
                     flex: 0.5,
                 },

               {
                   text: '测试数据1',
                   dataIndex: 'MeasurePropertyName',
                   flex: 0.5,
               },

                {
                    text: '测试数据2',
                    dataIndex: 'EnergyMediumName',
                    flex: 0.5,

                },
                 {
                     text: '测试数据3',
                     dataIndex: 'StatisticCycleTime',
                     flex: 0.5,
                 },
                  {
                      text: '测试数据4',
                      dataIndex: 'MeasurePropertyClass',
                      flex: 0.5,
                   
                  },
                  {
                      text: '测试数据5',
                      dataIndex: 'MeasurePropertyCalcFormula',
                      flex: 0.5,
                  },
                  {
                      text: '测试数据6',
                      dataIndex: 'DESCRIPTIONINFO',
                      flex: 0.5,
                  },
                  {
                      text: '测试数据7',
                      dataIndex: 'ENABLESIGN',
                      flex: 0.5,
                  
                  },

                ]
            },
        },

        url: '/api/EngeryMeasureProperty/GetPage',
        ps: 11,
        show_delete_column: false,

        row_select_handler: 'on_grid_row_selected',
    },

    //***************************************************内置函数****************************8

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);


        that.my_grid.query({ MeasurePropertyName: '', ModelBaseID: '' });

        //由于传参数等问题，暂不支持查询功能
        //$('#query').click(function () {
        //    that.my_grid.query({ MeasurePropertyName: $('#search-name').val(), ModelBaseID: that.current_tree_select_id });
        //})
        $('#testbtn1').hide();
        $('#testbtn2').hide();
        $('#testbtn3').hide();
        $('#testbtn4').hide();
        $('#echartbtn1').click(function () {
            if(that.if_current_selected==0){
                Util.alert('请选择一行记录')
                return
            };
            $('#testbtn1').hide();
            $('#testbtn2').hide();
            $('#testbtn3').hide();
            $('#testbtn4').hide();
            $('#echt1').empty();
            that.current_type = 1;
            that.create_cht();
        });
        $('#echartbtn2').click(function () {
            if (that.if_current_selected == 0) {
                Util.alert('请选择一行记录')
                return
            };
            $('#testbtn1').hide();
            $('#testbtn2').hide();
            $('#testbtn3').hide();
            $('#testbtn4').hide();
            $('#echt1').empty();
            that.current_type = 2;
            that.create_cht();
        });
        $('#echartbtn3').click(function () {
            if (that.if_current_selected == 0) {
                Util.alert('请选择一行记录')
                return
            };
            $('#testbtn1').show();
            $('#testbtn2').show();
            $('#testbtn3').show();
            $('#testbtn4').show();
            $('#echt1').empty();
            that.current_type = 3;
            that.create_cht();
        });
        $('#testbtn1').click(function () {
            $('#echt1').empty();

            that.auto_run = 1;
            that.create_cht();
        });
        $('#testbtn2').click(function () {
            $('#echt1').empty();
            that.auto_run = 0;
            that.create_cht();
        });
        $('#testbtn3').click(function () {
            $('#echt1').empty();
            that.ndge = 1;
            that.create_cht();
        });
        $('#testbtn4').click(function () {
            $('#echt1').empty();
            that.ndge = 0;
            that.create_cht();
        });
        this.tree_init();

        this.clear();
    },

 
    //*********************************************注意事**************************************************

  
    current_data:null,
    current_type: 1,
    auto_run: 0,
    ndge: 0,
    if_current_selected:0,
    on_grid_row_selected: function (data, index) {
        this.current_data = data;
        this.create_cht();
        this.if_current_selected=1;
        
    },

    create_cht: function () {
        switch (this.current_type) {
            case 1:
                this.init_chart1(this.current_data)
                break;
            case 2:
                this.init_chart2(this.current_data)
                break;
            case 3:
                this.init_chart3(this.current_data)

        }
        
    },
    

    clear: function () {
        this.my_grid.clear_selection();
    },


    //**************************************************引入树***************************8

    my_tree: null,

    tree_config: {
        url: '/api/FactoryModelbase/GetTree',
        root_name: '贵溪冶炼厂',
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
            that.my_grid.query({ MeasurePropertyName: '', ModelBaseID: '' });
        });
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id) {
        this.current_tree_select_id = id;

        this.my_grid.query({ MeasurePropertyName: '', ModelBaseID: id });

    },

    //*******************************************图形演示****************************************************
    //柱状图
    init_chart1: function (data) {
        var mycht1 = echarts.init(document.getElementById('echt1'));
        var d1 = data.MeasurePropertyName;
        var d2 = data.StatisticCycleTime;
        var d3 = data.MeasurePropertyClass;
        var d4 = data.MeasurePropertyCalcFormula;
        var d5 = data.DESCRIPTIONINFO;

        option1 = {
            title: {
                text: '柱状图分析',
                textStyle: {
                    fontSize:40
                }
            },
            legend: {
                data: ['各种测试数据']
            },
            xAxis: {
                data: ['测试数据1', '测试数据2', '测试数据3', '测试数据4', '测试数据5'],
                axisLabel: {
                    textStyle: {
                        fontSize:16
                    }
                }
            },
            yAxis: {
                axisLabel: {
                    textStyle: {
                        fontSize: 16
                    }
                }
            },
            grid:{
                top:100
            },
            tooltip: {
                textStyle:{
                    fontSize:16
                }
            },
            series: [{
                name: '',
                type: 'bar',
                data: [d1, d2, d3, d4, d5]
            }]
        };
        mycht1.setOption(option1);
    },

    //折线图
    init_chart2: function (data) {
        var mycht2 = echarts.init(document.getElementById('echt1'));
        var d1 = data.MeasurePropertyName;
        var d2 = data.StatisticCycleTime;
        var d3 = data.MeasurePropertyClass;
        var d4 = data.MeasurePropertyCalcFormula;
        var d5 = data.DESCRIPTIONINFO;
        var Data = ['测试数据1', '测试数据2', '测试数据3', '测试数据4', '测试数据5', ]

        var option2 = {
            title: {
                text: '测试数据折线图',
                subtext: '数据来自太极计算机股份有限公司zbc随意采集的',
                x: 'center',
                textStyle: {
                    fontSize:24
                },
                subtextStyle: {
                    fontSize:16
                }
            },
            grid:{
                top:100
            },
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        textStyle: {
                            fontSize:20
                        }
                    }
                },
                textStyle: {
                    fontSize:24
                }
            },
            legend: {
                data: ['测试数值', '测试数据'],
                x: 'left',
                textStyle: {
                    fontSize:24
                },
                selectedMode:false
            },
            xAxis: [
        {
            //type: 'category',
            //boundaryGap: true,
            //axisLine: { onZero: true },
            data: Data,
            axisLabel: {
                textStyle: {
                    fontSize:24
                }
            }
        }],
            //这里是滚动条开关
        //    dataZoom: [
        // {                          
        //     type: 'slider',        
        //     start: 10,             
        //     end: 60                
        // },
        //  {                         
        //      type: 'inside',                              
        //      start: 10,           
        //      end: 60             
        //  },
        //   {                                 
        //       type: 'slider',
        //       yAxisIndex: 0,
        //       start: 30,
        //       end: 80
        //   },
        //{
        //    type: 'inside',
        //    yAxisIndex: 0,
        //    start: 30,
        //    end: 80
        //}
        //    ],
            yAxis: [
         {
             name: '测试数值',
             type: 'value',
             max: 1000,
             nameTextStyle: {
                 fontSize:24
             },
             axisLabel: {
                 textStyle: {
                     fontSize: 24
                 }
             }
         }],
            series: [{
                name: '测试数据',
                type: 'line',
                symbolSize: 8,
                hoverAnimation: false,

                data: [
                    d1,d2,d3,d4,d5
                ]
            }]
        }

        mycht2.setOption(option2)
    },







    //饼图

    init_chart3: function (data) {
        
        if (this.ndge == 1) {
            var heheda = 'radius';
        }
        else {
            heheda = '';
        };
        var mycht3 = echarts.init(document.getElementById('echt1'));
        var d1 = data.MeasurePropertyName;
        var d2 = data.StatisticCycleTime;
        var d3 = data.MeasurePropertyClass;
        var d4 = data.MeasurePropertyCalcFormula;
        var d5 = data.DESCRIPTIONINFO;
        var option3 = {

            title: {
                text: '测试数据饼图样式',
                
                x: 'center',
                textStyle: {
                    fontSize:40
                }
            },

            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: 24
                },
                formatter: '{b}<br/>值为{c}({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['测试数据1', '测试数据2', '测试数据3', '测试数据4', '测试数据5'],
                textStyle: {
                    fontSize:24
                }
            },
            //ndge开关
            series: {
                type: 'pie',
                name: '测试数据',
                radius: '70%',
                roseType: heheda,

                data: [
                    {
                        value: d1, name: '测试数据1',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize:24
                                }
                            },
                            
                        }
                    },
                    {
                        value: d2, name: '测试数据2',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 24
                                }
                            }
                        }
                    },
                    {
                        value: d3, name: '测试数据3',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 24
                                }
                            }
                        }
                    },
                    {
                        value: d4, name: '测试数据4',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 24
                                }
                            }
                        }
                    },
                    {
                        value: d5, name: '测试数据5',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 24
                                }
                            }
                        }
                    },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 50,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },

        };
        mycht3.setOption(option3);

        if (this.auto_run == 1) {
            var currentIndex = -1;
            var gass = setInterval(function () {
                var dataLen = option3.series.data.length;
                // 取消之前高亮的图形
                mycht3.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
                currentIndex = (currentIndex + 1) % dataLen;
                // 高亮当前图形
                mycht3.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
                // 显示 tooltip
                mycht3.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
            }, 1500);
        }
    }
}

function auto_circleon_down() {
    $('#testbtn1').css("background", "url(/images2/autocircleon_focus.png)")
}
function auto_circleon_up() {
    $('#testbtn1').css("background", "url(/images2/autocircleon_normal.png)")
}

function auto_circleoff_down() {
    $('#testbtn2').css("background", "url(/images2/autocircleoff_focus.png)")
}
function auto_circleoff_up() {
    $('#testbtn2').css("background", "url(/images2/autocircleoff_normal.png)")
}

function ndger_show_down() {
    $('#testbtn3').css("background", "url(/images2/roseshow_focus.png)")
}
function ndger_show_up() {
    $('#testbtn3').css("background", "url(/images2/roseshow_normal.png)")
}

function ndger_hide_down() {
    $('#testbtn4').css("background", "url(/images2/rosehide_focus.png)")
}
function ndger_hide_up() {
    $('#testbtn4').css("background", "url(/images2/rosehide_normal.png)")
}





















