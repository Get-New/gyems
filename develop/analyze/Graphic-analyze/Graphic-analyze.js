//全局变量
var chart_id1 = 'G-echarts1';
var myChart11 = echarts.init(document.getElementById(chart_id1));
var echart_id2 = 'G-echarts4';
var myChart22 = echarts.init(document.getElementById(echart_id2));
var empty_ops = {};
myChart22.setOption(empty_ops);


// 正在显示的年、月、dota
var current = {};

// 数据
var gdata = {};

function draw_chrats(data, data2, data3, year, month, dota) {
    //**************第一套****************
    var item = data.Models;
    //用于存放不同车间的值们
    var series_data = [];
    var x_axisname = [];
    var split_position = [0];
    var all_data = [];
    //用于储存不同车间的值们(二维)
    var multi_data = [];
    //初始化二维数组
    for (i = 0; i < 999; i++) {
        all_data[i] = [];
    }
    //获得按名称分界的分界点数组
    if (data.Models) {
        for (i = 0, j = 0; i < data.Models.length - 1; i++) {

            if (item[i].ModelBase_Name !== '' && item[i].ModelBase_Name === item[i + 1].ModelBase_Name) {
                series_data.push(item[i].Report_ComputeValue)
            }
            else {
                series_data.push(item[i].Report_ComputeValue)
                split_position.push(i + 1)
            }
        };
    }
    //console.log(data,split_position)
    //车间名称组legend
    var formodelbasename = [];
    for (i = 0; i < split_position.length; i++) {
        if (item && item[split_position[i]]) {
            formodelbasename.push(item[split_position[i]].ModelBase_Name)
        }
    }
    //按名称分数组
    if (data.Models) {
        split_position.push(data.Models.length)
    }
    for (i = 0, j = 1; j < split_position.length; j++) {
        for (; i < split_position[j]; i++) {
            //var item = data.Models;
            all_data[j - 1].push(item[i]);
        }
    }
    for (i = 0, j = 1; j < split_position.length ; j++) {
        multi_data.push(series_data.slice(i, split_position[j]))
        i = split_position[j];
    }
    //console.log(all_data)
    //console.log(multi_data)
    //条形图数据
    var bar_data = [];
    for (i = 0; i < split_position.length - 1; i++) {
        if (item && item[split_position[i + 1] - 1]) {
            bar_data.push({ name: item[split_position[i + 1] - 1].ModelBase_Name, type: 'bar', stack: '1', data: multi_data[i], barWidth: 20 })
        }
    };
    var bar_axis_data = [];
    if (multi_data[0]) {
        for (i = 0; i < multi_data[0].length; i++) {
            bar_axis_data.push(item[i].Report_StartTime.slice(8, 10) + '日')
        };
    }
    //饼图数据
    var pie_data_1 = [];
    var month_data_forpie = [];
    for (i = 0; i < split_position.length - 1; i++) {
        for (start_pie = 0, j = 0; j < multi_data[i].length; j++) {
            start_pie += multi_data[i][j];
        }
        month_data_forpie.push(start_pie)
    }

    for (i = 0; i < split_position.length - 1; i++) {
        if (item && item[split_position[i + 1] - 1]) {
            pie_data_1.push({ value: month_data_forpie[i], name: item[split_position[i + 1] - 1].ModelBase_Name })
        }
    }

    //**************第二套****************
    var item2 = data2.Models;
    //用于存放不同车间的值们
    var series_data2 = [];
    var x_axisname2 = [];
    var split_position2 = [0];
    var all_data2 = [];
    //用于储存不同车间的值们(二维)
    var multi_data2 = [];
    //初始化二维数组
    for (i = 0; i < 999; i++) {
        all_data2[i] = [];
    }
    //获得按名称分界的分界点数组
    if(data2&&item2){
        for (i = 0, j = 0; i < data2.Models.length - 1; i++) {

            if (item2[i].ModelBase_Name !== '' && item2[i].ModelBase_Name === item2[i + 1].ModelBase_Name) {
                series_data2.push(item2[i].Report_ComputeValue)
            }
            else {
                series_data2.push(item2[i].Report_ComputeValue)
                split_position2.push(i + 1)
            }
        };
}
    //console.log(data,split_position)
    //车间名称组legend
    var formodelbasename2 = [];
    for (i = 0; i < split_position2.length; i++) {
        if (item2 && item2[split_position2[i]]) {
            formodelbasename2.push(item2[split_position2[i]].ModelBase_Name)
        }
    }
    //按名称分数组
    if (data2.Models) {
        split_position2.push(data2.Models.length)
    }
    for (i = 0, j = 1; j < split_position2.length; j++) {
        for (; i < split_position2[j]; i++) {
            //var item = data.Models;
            all_data2[j - 1].push(item2[i]);
        }
    }
    for (i = 0, j = 1; j < split_position2.length ; j++) {
        multi_data2.push(series_data2.slice(i, split_position2[j]))
        i = split_position2[j];
    }
    //console.log(all_data)
    //console.log(multi_data)
    //条形图数据
    var bar_data2 = [];
    for (i = 0; i < split_position2.length - 1; i++) {
        if (item2 && item2[split_position2[i + 1] - 1]) {

            bar_data2.push({ name: item2[split_position2[i + 1] - 1].ModelBase_Name, type: 'bar', stack: '1', data: multi_data2[i], barWidth: 20 })
        }
    };
    var bar_axis_data2 = [];
    if (multi_data2[0]) {
        for (i = 0; i < multi_data2[0].length; i++) {
            bar_axis_data2.push(item2[i].Report_StartTime.slice(8, 10) + '日')
        };
    }
    //饼图数据
    var pie_data_2 = [];
    var month_data_forpie2 = [];
    for (i = 0; i < split_position2.length - 1; i++) {
        for (start_pie = 0, j = 0; j < multi_data2[i].length; j++) {
            start_pie += multi_data2[i][j];
        }
        month_data_forpie2.push(start_pie)
    }

    for (i = 0; i < split_position2.length - 1; i++) {
        if (item2 && item2[split_position2[i + 1] - 1]) {
            pie_data_2.push({ value: month_data_forpie2[i], name: item2[split_position2[i + 1] - 1].ModelBase_Name })
        }
    }
    //**********************************第三套**********************************************
    var item3 = data3.Models;
    var linedatatemp = [];
    if (item3) {
        for (i = 0; i < item3.length; i++) {
            linedatatemp.push(item3[i].Report_ComputeValue)
        }
    }
    var line_data = { type: 'line', name: '去年同期比较（加和）', stack: '2', smooth: true, symbolSize: 8, hoverAnimation: false, data: linedatatemp, label: { normal: { show: true } } };
    bar_data.push(line_data)








    //**********************************画图*****************************************

    var option11 = {
        //title: {
        //    text: '动态数据',
        //    subtext: '纯属虚构',
        //    textStyle: {
        //        color: '#015b59'
        //    }
        //},
        tooltip: {
            trigger: 'axis',
            //formatter: '{a}:数值为{c}',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        //calculable: true,
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
            data: formodelbasename
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
            type: 'value'
        }],
        series: bar_data
    };
    myChart11.setOption(option11);
    //********************饼图1****************************************
    var echart_id2 = 'G-echarts4';
    var myChart22 = echarts.init(document.getElementById(echart_id2));
    var option22 = {

        //title: {
        //    text: '今年本月各厂数据',
        //    subtext: '纯属虚构',
        //    x: 'center',
        //    textStyle: {
        //        color: '#015b59'
        //    }
        //},

        legend: {
            data: formodelbasename,
            //orient: 'vertical',
            y: '90%'
        },
        tooltip: {
            //formatter: '{b}:{c} 日数据',
            tooltip: {
                trigger: 'item',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                //magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        visualMap: {
            show: true,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0.5, 1]
            }
        },
        //文字样式(全局)
        //textStyle: {
        //    color: '#000000', 
        //},

        series: [{
            center: ['30%', '50%'],
            name: '去年同期比较',
            type: 'pie',
            radius: ['10%', '50%'],
            roseType: 'angle',

            data: pie_data_2,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: { normal: { show: false } },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },

        }, {
            center: ['30%', '50%'],
            name: '去年同期比较',
            type: 'pie',
            radius: ['60%', '70%'],
            data: pie_data_2,
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.7)'
                    }
                }
            },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },
        }, {
            center: ['70%', '50%'],
            name: '今年数据',
            type: 'pie',
            radius: ['10%', '50%'],
            roseType: 'angle',

            data: pie_data_1,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: { normal: { show: false } },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },

        }, {
            center: ['70%', '50%'],
            name: '今年数据',
            type: 'pie',
            radius: ['60%', '70%'],
            //roseType: 'angle',

            data: pie_data_1,
            label: {
                normal: {
                    show: true
                }
            },
            labelLine: { normal: { show: true } },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },

        }, ]
    }
    myChart22.setOption(option22);
}

function query(dota, dota2, year, month,extra) {
    var target = document.getElementById('content1')
    gdata.ready = false;
    spinner = new Spinner({}).spin(target);
        $.ajax({
                url: '/api/AllFactoryReport/GetEveryChildEveryDay',
                type: 'get',
                dataType: 'json',

                data: {
            year: year,
            month: month,
            energymediumid: dota,
                    energyname:extra
                },
                success: function (data) {
                    $.ajax({
                        url: '/api/AllFactoryReport/GetEveryChildEveryDay',
                        type: 'get',
                        dataType: 'json',
                        data: {
                    year: year - 1,
                    month: month,
                    energymediumid: dota,
                    energyname: extra
                        },
                        success: function (data2) {
                            $.ajax({
                                url: '/api/AllFactoryReport/GetSelfEveryDay',
                                type: 'get',
                                dataType: 'json',
                                data: {
                            year: year,
                            month: month,
                            energymediumid: dota,
                            energyname: extra
                                },
                                success: function (data3) {
                                    //console.log(data)
                            spinner.stop();
                            $("#currYearMonth").html(year + '年' + month + '月 ' + dota2 );
                            current = {
                                year: year,
                                month: month,
                                dota: dota
                            };
                            gdata = {
                                ready: true,
                                d1: data,
                                d2: data2,
                                d3:data3
                            };
                            draw_chrats(data, data2, data3, year, month, dota)
                        },
                        error: function () {
                            Util.alrt('查询数据时发生错误');
                            spinner.stop();
                        }
                    });
                },
                error: function () {
                    Util.alrt('查询数据时发生错误');
                    spinner.stop();
                }
            })
        },
        error: function () {
            Util.alrt('查询数据时发生错误');
            spinner.stop();
        }
    })
}



function parseDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var obj = {
        year: year,
        month: month,
        day: strDate
    }
    return obj;
}

function callQuery() {
    myChart11.clear();
    myChart22.clear();
    var extra = $("#search-name").find("option:selected").text();;
    console.log(extra)
    var dota = $('#search-name').val();
    //console.log(dota)
    var dota2 = $('#search-name').find("option:selected").text();
    var str = $('#search-date1').val();

    if (str.split('-').length < 2) {
        Util.alert('月份格式不正确');
        return;
                                }
                            
    var year = str.split('-')[0];
    var month = str.split('-')[1];
    query(dota, dota2, year, month,extra);
}

$("#preMonth").click(function () {
    var month = parseInt(current.month);
    var year = parseInt(current.year);
    month = month - 1;
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    var strMonth = month.toString();
    if (month >= 1 && month <= 9) {
        strMonth = "0" + month;
                        }
        
    $('#search-date1').val(year + '-' + strMonth);
    callQuery();
                    })

$("#nextMonth").click(function () {
    var month = parseInt(current.month);
    var year = parseInt(current.year);
    month = month + 1;
    if (month == 13) {
        month = 1;
        year = year + 1;
    }
    var strMonth = month.toString();
    if (month >= 1 && month <= 9) {
        strMonth = "0" + month;
                }

    $('#search-date1').val(year + '-' + strMonth);
    callQuery();
            })


//*************************************************以上是模拟数据*******************************
var Page = {
    init: function () {

        laydate({
            elem: '#search-date1',
            event: 'click',
            istime: false,
            format: 'YYYY-MM',
            ismonth: true
        })

        //查一下全场计量介质
        $.ajax({
            url: '/api/AllFactoryReport/GetEnergyMedium',
            type: 'get',
            dataType: 'json',
            data: {},
            success: function (data) {
                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMedium_ID).html(item.EnergyMedium_Name);
                    $('#search-name').append(option);
        }

                var now = new Date();
                var obj = parseDate(now);
                var year = obj.year;
                var month = obj.month;

                //var year = "2016";
                //var month = "07";

                $('#search-date1').val(year + '-' + month);
                callQuery();
}

        });
        //查询按钮点击事件
        $('#query').click(function () {
            
            callQuery();
        })
    }
}

//******************************************************************************************************************
//只点击柱才动饼图
myChart11.on('click', function (a) {
    
    $('#pie-fig-title2').html('当天各厂数据')
    //console.log(a)
    var d1 = gdata.d1;   // d1是本年本月
    var d2 = gdata.d2;   // d2是去年本月
    var day = a.dataIndex + 1;
    var strDay = day.toString();
    if (day < 10) {
        strDay = "0" + day;
    }

    var data1 = _.select(d1.Models, "Day", strDay);  // data1是本年本月所选柱子的数据
    var data2 = _.select(d2.Models, "Day", strDay); // data2是去年本月所选柱子的数据
    //console.log(data1)
    
    var pie_name = [];
    var pie_v1 = [];
    var pie_v2 = [];

    for (i = 0; i < data1.length; i++) {
        pie_v1.push(data1[i].Report_ComputeValue);
    }
    for (i = 0; i < data2.length; i++) {
        pie_v2.push(data2[i].Report_ComputeValue);
    }
    for (i = 0; i < data1.length; i++) {
        pie_name.push(data1[i].ModelBase_Name);
    }

    var pie1_data = [];
    var pie2_data = [];
    for (i = 0; i < data1.length; i++) {
        pie1_data.push({value:pie_v1[i],name:pie_name[i]})
    }

    for (i = 0; i < data2.length; i++) {
        pie2_data.push({ value: pie_v2[i], name: pie_name[i] })
    }

    var optionp = {
        series: [{ data: { value: 12, name: 'hehe' } }, { data: { value: 12, name: 'hehe' } }]
    }

//****************************************************************************************************************
    var those_two = echarts.init(document.getElementById('G-echarts4'))
    var option_start = {
        legend: {
            data: pie_name,
            y: '93%'
        },
        tooltip: {
            tooltip: {
                trigger: 'item',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                //magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        visualMap: {
            show: true,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0.5, 1]
            }
        },
        series: [{
            center: ['30%', '50%'],
            name: '去年同期比较',
            type: 'pie',
            radius: ['10%', '50%'],
            roseType: 'angle',

            data: pie2_data,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: { normal: { show: false } },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },

        }, {
            center: ['30%', '50%'],
            name: '去年同期比较',
            type: 'pie',
            radius: ['60%', '70%'],
            data: pie2_data,
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.7)'
                    }
                }
            },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },
        }, {
            center: ['70%', '50%'],
            name: '去年同期比较',
            type: 'pie',
            radius: ['10%', '50%'],
            roseType: 'angle',

            data: pie1_data,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: { normal: { show: false } },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },

        }, {
            center: ['70%', '50%'],
            name: '去年同期比较',
            type: 'pie',
            radius: ['60%', '70%'],
            //roseType: 'angle',

            data: pie1_data,
            label: {
                normal: {
                    show: true
                }
            },
            labelLine: { normal: { show: true } },
            itemStyle: {

                //鼠标hover时的高亮模式
                emphasis: {
                    shadowBlur: 250,
                    shadowColor: 'rgba(0,255,255,0.5)'
                }
            },

        }]
    }
    those_two.setOption(option_start)
});











