$('#content1').attr('style', 'height:10rem')

//$('#G-echarts11').attr('style','height:7.8rem')
/****************************************//*全局准备***************************************************/
$('#pie-fig-title1').attr('style', 'display:none');
$('#pie-fig-title2').attr('style', 'display:none');
$('#G-echarts12').attr('style', 'display:none');
$('#G-echarts13').attr('style', 'display:none');
var tooltip_name;
//判断现在查询的是什么类型的变量
var line_current_type = 'month';


//echarts实例化全局变量
var chart_id1 = 'G-echarts11';
var myChart1 = echarts.init(document.getElementById(chart_id1));
var chart_id2 = 'G-echarts12';
var myChart2 = echarts.init(document.getElementById(chart_id2));
var chart_id3 = 'G-echarts13';
var myChart3 = echarts.init(document.getElementById(chart_id3));

var dd = new Date();
var current_month = dd.getMonth() + 1;
while (current_month > 12) {
    current_month = current_month - 12;
}
if (current_month < 10) {
    current_month = '0' + current_month.toString();
}
current_month.toString();
//console.log(current_month)




var Page = {
    //*******************************************************************************************
    //返回不同车间的分离点数组
    splite: function (data) {
        var splited_position = [0];

        for (i = 0; i < data.length - 1; i++) {
            if (data[i].ModelBase_Name !== data[i + 1].ModelBase_Name) {
                splited_position.push(i + 1)
            }
        }
        return splited_position
    },

    //将数据按车间名称分组，返回二维数组
    devite: function (data, group) {

        var devited_data = [];
        var tempt = [];
        for (i = 0, j = 1; i < data.length; i++) {

            if (i == group[j]) {
                j++;
                devited_data.push(tempt);
                tempt = [];
            }
            tempt.push(data[i]);
        }
        return devited_data;
    },

    //组织单个车间的一月总和，返回二维数组
    organize: function (groups) {
        var organization = [];
        //var tempt = [];
        var temp_data = 0;
        for (i = 0; i < groups.length; i++) {
            for (j = 0; j < groups[i].length; j++) {
                temp_data += groups[i][j].Report_ComputeValue;
            }
            organization.push({ ModelBaseName: groups[i][0].ModelBase_Name, Total: temp_data, Id: groups[i][0].ModelBaseID })
            temp_data = 0;

        }
        return organization;
    },
    //*******************************************以上是旧api方法****************************************

    //画柱状图（如果有折线图也一起画了）
    draw_line_charts: function (legend_data, bar_axis_data, bar_data, max_value) {
        if (myChart1) { myChart1.clear() }
        var option = {
            title: { text: '电解车间电单耗', x: 'center' },

            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },

            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: legend_data
            },
            xAxis: [{
                type: 'category',
                data: bar_axis_data,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                }
            }],
            yAxis: [{
                type: 'value',
                max:max_value
            }],
            series: bar_data
        };
        myChart1.setOption(option);
    },

    //画第二个折线图
    draw_line_charts2: function (legend_data, bar_axis_data, bar_data, max_value) {
        if (myChart2) { myChart2.clear() }
        var option = {
            title: { text: '一系统电单耗', x: 'center' },
            grid: {
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },

            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: legend_data
            },
            xAxis: [{
                type: 'category',
                data: bar_axis_data,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                }
            }],
            yAxis: [{
                type: 'value',
                max: max_value

            }],
            series: bar_data
        };
        myChart2.setOption(option);
    },


    //画第三个折线图
    draw_line_charts3: function (legend_data, bar_axis_data, bar_data, max_value) {
        if (myChart3) { myChart3.clear() }
        var option = {
            title: { text: '二系统电单耗', x: 'center' },
            grid: {
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },

            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: legend_data
            },
            xAxis: [{
                type: 'category',
                data: bar_axis_data,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                }
            }],
            yAxis: [{
                type: 'value',
                max: max_value
            }],
            series: bar_data
        };
        myChart3.setOption(option);
    },

    //***************************************新方法*****************************************

    //遍历organization并返回需要的东西
    find_it: function (e, data) {
        var i = 0;
        for (; i < data.length; i++) {
            if (e.name == data[i].ModelBase_Name) {
                break;
            }
        }
        return data[i].ModelBase_ID
    },

    //根据点击返回指定字段
    find_it2: function (e, data) {
        var i = 0;
        for (; i < data.length; i++) {
            //console.log(data[i].ModelBase_Name)
            if (e == data[i].ModelBase_Name)
                break;
        }
        //console.log(i)

        return data[i].ModelBase_ID
    },




    //得到条形图/折线图基础数据
    get_bar_data: function (item) {
        var temp = [];
        for (i = 0; i < item.length; i++) {

            if (item[i]) {
                temp.push(item[i].Report_ComputeValue);
            }
        }
        return temp;
    },

    //获得条形图/折线axis数据
    get_bar_axis: function (item) {
        var temp = [];
        for (i = 0; i < item.length; i++) {
            if (item[i].Report_DateDescription) {
                temp.push(item[i].Report_DateDescription)
            }
        }
        return temp;
    },

    //获得直线1转多(标准线)
    get_line_standard: function (item, item2) {
        var temp = [];
        for (i = 0; i < item2.length; i++) {
            temp.push(item.Report_ComputeValue)
        }
        return temp
    },

    //扣掉第一项的其余数组
    handled_line: function (data) {
        var temp = [];
        data.slice(1, -1);
        temp = data;
        return data
    },

    /*新格式*/
    //得到条形图/折线图基础数据
    get_bar_data2: function (item) {
        var temp = [];
        if (item) {
            for (i = 0; i < item.length; i++) {

                if (item[i]) {
                    temp.push(item[i].Value);
                }
            }
        }
        return temp;
    },

    //获得条形图/折线axis数据
    get_bar_axis2: function (item) {
        var temp = [];
        if (item) {
            for (i = 0; i < item.length; i++) {
                if (item[i].Time) {
                    temp.push(item[i].Time)
                }
            }
        }
        return temp;
    },

    //获得直线1转多(标准线)
    get_line_standard2: function (item, item2) {
        var temp = [];
        for (i = 0; i < item2.length; i++) {
            temp.push(item.Value)
        }
        return temp
    },




    //*********************************************************************************************
    init: function () {
        var that = this;
        $('#txt2').attr('style', 'display:none');
        $('#txt3').attr('style', 'display:none');



        $('#year').click(function () {
            //query('year', year, month, strDate)
            $('#G-echarts12').attr('style', 'display:none');
            $('#G-echarts13').attr('style', 'display:none');
            $('#pie-fig-title1').attr('style', 'display:none');
            $('#pie-fig-title2').attr('style', 'display:none');
            $('.for-human-input').attr('style', 'display:block;bottom:0rem');
            $('#pie-fig-title2').html('当年各车间数据');
        })
        $('#month').click(function () {
            //query('year', year, month, strDate)
            $('#G-echarts12').attr('style', 'display:none');
            $('#G-echarts13').attr('style', 'display:none');
            $('#pie-fig-title1').attr('style', 'display:none');
            $('#pie-fig-title2').attr('style', 'display:none');
            $('.for-human-input').attr('style', 'display:block;bottom:0rem');
            $('#pie-fig-title2').html('当月各车间数据');
        })
        $('#day').click(function () {
            //query('year', year, month, strDate)
            $('#G-echarts12').attr('style', 'display:none');
            $('#G-echarts13').attr('style', 'display:none');
            $('#pie-fig-title1').attr('style', 'display:none');
            $('#pie-fig-title2').attr('style', 'display:none');
            $('.for-human-input').attr('style', 'display:block;bottom:0rem')
            $('#pie-fig-title2').html('当日各车间数据');
        })


        $('#pre').click(function () {
            $('#G-echarts12').attr('style', 'display:none');
            $('#G-echarts13').attr('style', 'display:none');

        })

        $('#next').click(function () {
            $('#G-echarts12').attr('style', 'display:none');
            $('#G-echarts13').attr('style', 'display:none');

        })

        function query(type, year, month, day) {
            $('#txt1').attr('style', 'display:block');
            $('#txt2').attr('style', 'display:none');
            $('#txt3').attr('style', 'display:none');
            $('#G-echarts12').attr('style', 'display:none');
            $('#G-echarts13').attr('style', 'display:none');
            if (type == 'day') {
                $.ajax({
                    url: '/api/ElectricityRoom/GetAllRoomMonth ',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: year,
                        month:12
                    },
                    success: function (data) {
                        tooltip_name = '当月'
                        $('#G-echarts41').attr('style', 'display:none');
                        $('#G-echarts11').attr('style', 'display:block');
                        //console.log(data)
                        var item = data.Models;



                        //console.log(section, section1.Report_ComputeValue)

                        var line_base = [];                 //折线数值数据组
                        var line_axis_data = that.get_bar_axis2(item);        //折线横坐标数据组
                        if (item[0]) {
                            var maxx = item[0].BaseLine;
                        }
                        else { maxx = 0; }
                        var line_datat1 = that.get_bar_data2(item);

                        line_base.push({ name: '电解车间电单耗', type: 'line', data: line_datat1, markLine: { silent: true, data: [{ yAxis: maxx }] }, label: { normal: { show: true } } })

                        that.draw_line_charts('电解车间电单耗', line_axis_data, line_base, maxx)



                    }
                })
            };

            if (type == 'month') {
                $.ajax({
                    url: '/api/ElectricityRoom/GetAllRoomMonth',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: year,
                        month: 12
                    },
                    success: function (data) {
                        tooltip_name = '当月'
                        $('#G-echarts41').attr('style', 'display:none');
                        $('#G-echarts11').attr('style', 'display:block');
                        //console.log(data)
                        var item = data.Models;



                        //console.log(section, section1.Report_ComputeValue)

                        var line_base = [];                 //折线数值数据组
                        var line_axis_data = that.get_bar_axis2(item);        //折线横坐标数据组
                        if (item) {
                            var maxx = item[0].BaseLine;
                        }
                        else { maxx = 0; }
                        var line_datat1 = that.get_bar_data2(item);

                        line_base.push({ name: '电解车间电单耗', type: 'line', data: line_datat1, markLine: { silent: true, data: [{ yAxis: maxx }] }, label: { normal: { show: true } } })

                        that.draw_line_charts('电解车间电单耗', line_axis_data, line_base, maxx)


                    }
                })
            };

            if (type == 'year') {
                $.ajax({
                    url: '/api/ElectricityRoom/GetAllRoomMonth',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: year,
                        month: 12
                    },
                    success: function (data) {

                        tooltip_name = '当月'
                        $('#G-echarts41').attr('style', 'display:none');
                        $('#G-echarts11').attr('style', 'display:block');
                        //console.log(data)
                        var item = data.Models;


                        //var item = DATA7.Models;


                        //console.log(section, section1.Report_ComputeValue)

                        var line_base = [];                 //折线数值数据组
                        var line_axis_data = that.get_bar_axis2(item);        //折线横坐标数据组
                        if (item) {
                            var maxx = item[0].BaseLine;
                        }
                        else { maxx = 0;}
                        var line_datat1 = that.get_bar_data2(item);

                        line_base.push({ name: '电解车间电单耗', type: 'line', data: line_datat1, markLine: { silent: true, data: [{ yAxis: maxx }] }, label: { normal: {show:true}} })

                        that.draw_line_charts('电解车间电单耗', line_axis_data, line_base, maxx)
                        //
                        $.ajax({
                            url: '/api/ReportContext/GetContextText',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                EnergymediumId: '1d22868c6ca69b8A27bc86aa',
                                ModelbaseId: '1d23bc8b8eefe1bA27bc86aa',
                                Year: $('#title').text().slice(0,4),
                                Month:current_month
                            },
                            success: function (data2) {
                                console.log(data2);
                                if (data2.Models) {
                                    var item = data2.Models[0];

                                    //
                                    //var item = DATAX.Models[0];

                                    $('#txt1').html(item.ContextText);

                                }
                            }
                        })

                    }
                })
            }
        }




        dst.config({
            type: 'year'
        })

        dst.change(function (t, y, m, d) {
            query(t, y, m, d);
        })
        dst.init();

        //console.log()
    }
}






myChart1.on('click', function (e) {
    $('#txt1').attr('style', 'display:none')
    $('#txt2').attr('style', 'display:block')
    $('#txt3').attr('style', 'display:block')
    //console.log(dst.currTypee)         
    if ($('#year').hasClass('active')) {
        $.ajax({
            url: '/api/ElectricityRoom/GetOneSystemMonth',
            type: 'get',
            dataType: 'json',
            data: {
                year: $('#title').text().slice(0, 4),
                month: 12
            },
            success: function (data_l1) {
                $.ajax({
                    url: '/api/ElectricityRoom/GetTwoSystemMonth',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: $('#title').text().slice(0, 4),
                        month: 12
                    },
                    success: function (data_l2) {

                        $('#G-echarts11').attr('style', 'display:none');
                        $('#G-echarts12').attr('style', 'display:block');
                        $('#G-echarts13').attr('style', 'display:block');
                        $('#pie-fig-title1').attr('style', 'display:block;bottom:5rem;width:1.4rem');
                        $('#pie-fig-title2').attr('style', 'display:block;bottom:6rem;left:10.8rem;width:2rem');
                        //$('.for-human-input').attr('style', 'display:block;bottom:2rem')

                        var item = data_l1.Models;
                        var item2 = data_l2.Models;

                        //var item = DATA7.Models;
                        //var item2 = DATA7.Models;

                        var line_base = [];                 //折线数值数据组
                        var line_axis_data = Page.get_bar_axis2(item);        //折线横坐标数据组
                        var line_datat1 = Page.get_bar_data2(item);
                        if (item[0]) {
                            var maxx = item[0].BaseLine;
                        }
                        var maxx2 = item2[0].BaseLine;


                        //var line_datat2 = Page.get_line_standard(section1, section);
                        line_base.push({ name: '一系统电单耗', type: 'line', data: line_datat1, markLine: { silent: true, data: [{ yAxis: item[0].BaseLine }] }, label: { normal: { show: true } } })
                        Page.draw_line_charts2('一系统电单耗', line_axis_data, line_base, maxx)



                        var line_base2 = [];                 //折线数值数据组
                        var line_axis_data2 = Page.get_bar_axis2(item2);        //折线横坐标数据组
                        var line_datat12 = Page.get_bar_data2(item2);
                        //var line_datat22 = Page.get_line_standard(section12, section2);
                        line_base2.push({ name: '二系统电单耗', type: 'line', data: line_datat12, markLine: { silent: true, data: [{ yAxis: item2[0].BaseLine }] }, label: { normal: { show: true } } })
                        Page.draw_line_charts3('二系统电单耗', line_axis_data2, line_base2, maxx2)


                        $.ajax({
                            url: '/api/ReportContext/GetContextText',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                EnergymediumId: '1d22868c6ca69b8A27bc86aa',
                                ModelbaseId: '1d24f87a4cfaea8A27bc86aa',
                                Year: $('#title').text().slice(0, 4),
                                Month: current_month,
                            },
                            success: function (data2) {
                                //console.log(data2);
                                if (data2.Models&&data2.Models[0]&&data2.Models[0].ContextText) {
                                    var item = data2.Models[0];

                                    //
                                    //var item = DATAX.Models[0];

                                    $('#txt2').html(item.ContextText);
                                }

                            }
                        })
                        $.ajax({
                            url: '/api/ReportContext/GetContextText',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                EnergymediumId: '1d22868c6ca69b8A27bc86aa',
                                ModelbaseId: '1d24f87a8e2caf2A27bc86aa',
                                Year: $('#title').text().slice(0, 4),
                                Month: current_month,
                            },
                            success: function (data2) {
                                //console.log(data2);
                                if (data2.Models && data2.Models[0] && data2.Models[0].ContextText) {

                                    var item = data2.Models[0];

                                    //
                                    //var item = DATAX.Models[0];

                                    $('#txt3').html(item.ContextText);

                                }
                            }
                        })


                    }
                })
            }
        })
    }
    //console.log(e.name.slice(5,7))

  

})
myChart1.on('mouseover', function (e) {
    console.log('您选到了图表1')
    $.ajax({
        url: '/api/ReportContext/GetContextText',
        type: 'get',
        dataType: 'json',
        data: {
            EnergymediumId: '1d22868c6ca69b8A27bc86aa',
            ModelbaseId: '1d23bc8b8eefe1bA27bc86aa',
            Year: $('#title').text().slice(0, 4),
            Month: e.name.slice(5, 7),
        },
        success: function (data2) {
            //console.log(data2);
            var item = data2.Models[0];

            //
            //var item = DATAX.Models[0];

            $('#txt1').html(item.ContextText);


        }
    })
})

myChart2.on('mouseover', function (e) {
    console.log('您选到了图表2')
    $.ajax({
        url: '/api/ReportContext/GetContextText',
        type: 'get',
        dataType: 'json',
        data: {
            EnergymediumId: '1d22868c6ca69b8A27bc86aa',
            ModelbaseId: '1d24f87a4cfaea8A27bc86aa',
            Year: $('#title').text().slice(0, 4),
            Month: e.name.slice(5,7),
        },
        success: function (data2) {
            //console.log(data2);
            if (data2.Models && data2.Models[0] && data2.Models[0].ContextText) {

                var item = data2.Models[0];

                //
                //var item = DATAX.Models[0];

                $('#txt2').html(item.ContextText);

            }
        }
    })
})

myChart3.on('mouseover', function (e) {
    console.log('您选到了图表3')

    $.ajax({
        url: '/api/ReportContext/GetContextText',
        type: 'get',
        dataType: 'json',
        data: {
            EnergymediumId: '1d22868c6ca69b8A27bc86aa',
            ModelbaseId: '1d24f87a8e2caf2A27bc86aa',
            Year: $('#title').text().slice(0, 4),
            Month: e.name.slice(5, 7),
        },
        success: function (data2) {
            //console.log(data2);
            if (data2.Models && data2.Models[0] && data2.Models[0].ContextText) {

                var item = data2.Models[0];

                //
                //var item = DATAX.Models[0];

                $('#txt3').html(item.ContextText);

            }
        }
    })
})

