var myChart1 = echarts.init(document.getElementById('echt-pie'));
var myChart2 = echarts.init(document.getElementById('echt-bar1'));
var myChart3 = echarts.init(document.getElementById('echt-bar2'));
var myChart4 = echarts.init(document.getElementById('echt-bar3'));
var myChart5 = echarts.init(document.getElementById('echt-bar4'));
var myChart6 = echarts.init(document.getElementById('echt-pie1'));
var myChart7 = echarts.init(document.getElementById('echt-pie2'));

//**********************************************************************
var Page = {


    init: function () {
        //console.log($('#measures'));

        //现在是一个空接口
        $.ajax({
            url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
            method: 'get',
            dataType: 'json',
            //data: {


            //},
            success: function (data) {
                var item = data.Models;

                var item = DATA_1.Models;

                //for (i = 0; i < item.length; i++) {
                //    var td_start = $('#tr0');
                //    var td = $('<td></td>');
                //    td.text(item[i]);
                //    td_start.append(td)
                //}
                var tablet = $('#table-electrolysis-report');
                for (i = 0; i < item.length; i++) {

                    var tr = $('<tr></tr>');
                    tr.attr('id', 'tr' + i);
                    tablet.append(tr)

                    for (j = 0; j < item[i].length; j++) {


                        //
                        var td_start = $('#tr'+i);
                        var td = $('<td></td>');
                        td.text(item[i][j]);
                        td_start.append(td)
                    }
                }
            },
            error: function (req, msg) {
                console.log(msg);
            }
        })


        $('#pre').click(function () {
            callDrawMethod();
        })

        $('#next').click(function () {
            callDrawMethod();
        })
        $('#year').click(function () {
            callDrawMethod();
        })
        $('#month').click(function () {
            callDrawMethod();
        })
        $('#day').click(function () {
            callDrawMethod();
        })


        dst.change(function (t, y, m, d) {
            callDrawMethod();
        })
        dst.init();
    },

    //整理表格数据
}



function callDrawMethod() {
    //var year = tYear;
    //var engerymeasures = cvs.selectedList;
    //console.log(cvs.selectedList)
    draw();
}



function draw() {
    myChart1.clear();
    myChart2.clear();
    myChart3.clear();
    //***********************************************************************************
    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data1) {


            //
            var pie_series_data1 = [];
            var pie_series_data2 = [];
            var for_legend_data = [];

            var item = data1.Models;

            //假数据
            var item = DATA_pie1.Models;
            //左饼数据
            for (i = 0; i < item.length; i++) {
                pie_series_data1.push({
                    name: item[i].能源名称,
                    value: item[i].能源占比
                })
            }
            //右饼数据
            for (i = 0; i < item.length; i++) {
                pie_series_data2.push({
                    name: item[i].能源名称,
                    value: item[i].能源成本
                })
            }
            //标注数据
            for (i = 0; i < item.length; i++) {
                for_legend_data.push(item[i].能源名称)
            }

            var option1 = {
                title: {
                    text: '能耗占比',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_data,
                    top:180
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (p) {
                        //console.log(p);
                        var res = p.seriesName + '<br/>'
                        if (p.seriesName.indexOf('占比') != -1) {
                            res += p.name + ':' + p.value;
                            res+='<br/>占比例：'+p.percent+'%'
                        }
                        else {
                            res += p.name + ':' + p.value;
                        }
                        return res
                    }
                },
                series: [
                    {
                        center: ['50%', '50%'],
                        name: '能耗占比（折标煤）',
                        type: 'pie',
                        radius: ['0%', '70%'],
                        data: pie_series_data2,
                    }
                    
                ]
            }
            myChart1.setOption(option1);

        }
    });



    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data2) {



            var for_legend_bar1 = [];
            var series_data = new Array();
            var series_data1 = [];
            var series_data2 = [];

            var yaxis_data = [];
            var xmax, xmin;
            var s1 = [];
            var s2 = [];



            var item2 = data2.Models;

            item2 = DATA_bar1.Models;

            xmax = item2[1][6];
            xmin = item2[1][5];
            yaxis_data = item2[0];

            for (i = 1; i < item2.length; i++) {
                series_data1.push(item2[i][7]);
                series_data2.push(item2[i][8])

            }

            series_data[0] = series_data1;
            series_data[1] = series_data2;

            for (i = 1; i < item2.length; i++) {
                s1.push({
                    name: item2[i][0],
                    type: 'bar',
                    data: series_data[i - 1]
                })
            }

            //yaxis数据抽取
            for (i = 1; i < item2.length; i++) {
                for_legend_bar1.push(item2[i][0])
            }


            var option2 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_bar1
                },

                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        //magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        crossStyle: { textStyle: { fonSize: 14 } },
                        lineStyle: { color: '#C4EAFC' }
                    },
                    //formatter: function (params) {

                    //}
                },
                xAxis: [
                    {
                        axisLabel: {
                            textStyle: { fontSize: 14 },
                        },
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        max: xmax,
                        min: xmin,
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        data: yaxis_data,
                        type: 'category',
                        nameTextStyle: { fontSize: 14 },
                        //axisLabel: { formatter: '{value}' },
                    }
                ],
                series: s1
            }
            //console.log(s1, for_legend_bar1, yaxis_data, series_data1, series_data2)

            myChart2.setOption(option2);
        }

    })

    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data3) {

            var item3 = data3.Models;

            item3 = DATA_bar22.Models;


            var for_legend_bar2 = [];
            var series_data = new Array();
            var series_data1 = new Array();
            //var series_data2 = [];

            var yaxis_data = [];
            var xmax, xmin;
            //var s1 = [];
            var s2 = [];


            xmax = item3[1][6];
            xmin = item3[1][5];
            yaxis_data = item3[0];

            for (i = 1; i < item3[0].length + 1; i++) {
                series_data1.push(item3[1][i + 6]);
                series_data1.push(item3[2][i + 6]);
            }

            var hehe = _.chunk(series_data1, 7);

            for (i = 1; i < item3.length; i++) {
                s2.push({
                    name: item3[i][0],
                    type: 'bar',
                    data: hehe[i - 1]
                })
            }

            //yaxis数据抽取
            for (i = 1; i < item3.length; i++) {
                for_legend_bar2.push(item3[i][0])
            }

            //console.log(s1)




            var option3 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_bar2
                },

                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        //magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        crossStyle: { textStyle: { fonSize: 14 } },
                        lineStyle: { color: '#C4EAFC' }
                    },
                    //formatter: function (params) {

                    //}
                },
                xAxis: [
                    {
                        axisLabel: {
                            textStyle: { fontSize: 14 },
                        },
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        max: xmax,
                        min: xmin,
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        data: yaxis_data,
                        type: 'category',
                        nameTextStyle: { fontSize: 14 },
                        //axisLabel: { formatter: '{value}' },
                    }
                ],
                series: s2
            }

            //console.log(s1, for_legend_bar1, yaxis_data, series_data1)
            myChart3.setOption(option3)
        },
        error: function (req, msg) {
            console.log(msg);
        }
    })

    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data2) {



            var for_legend_bar1 = [];
            var series_data = new Array();
            var series_data1 = [];
            var series_data2 = [];

            var yaxis_data = [];
            var xmax, xmin;
            var s1 = [];
            var s2 = [];



            var item2 = data2.Models;

            item2 = DATA_bar2.Models;

            xmax = item2[1][6];
            xmin = item2[1][5];
            yaxis_data = item2[0];

            for (i = 1; i < item2.length; i++) {
                series_data1.push(item2[i][7]);
                //series_data2.push(item2[i][8])

            }

            var ttemp1 = [];
            ttemp1.push(series_data1[0])
            var ttemp2 = [];
            ttemp2.push(series_data1[1])
            //console.log(series_data1[0], series_data1[1])

            series_data[0] = ttemp1;
            series_data[1] = ttemp2;

            for (i = 1; i < item2.length; i++) {
                s1.push({
                    name: item2[i][0],
                    type: 'bar',
                    data: series_data[i - 1]
                })
            }

            //yaxis数据抽取
            for (i = 1; i < item2.length; i++) {
                for_legend_bar1.push(item2[i][0])
            }


            var option4 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_bar1
                },

                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        //magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        crossStyle: { textStyle: { fonSize: 14 } },
                        lineStyle: { color: '#C4EAFC' }
                    },
                    //formatter: function (params) {

                    //}
                },
                grid: {
                    left:'20%'
                },
                xAxis: [
                    {
                        axisLabel: {
                            textStyle: { fontSize: 14 },
                        },
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        max: xmax,
                        min: xmin,
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        data: yaxis_data,
                        type: 'category',
                        nameTextStyle: { fontSize: 14 },
                        //axisLabel: { formatter: '{value}' },
                    }
                ],
                series: s1
            }
            //console.log(s1, for_legend_bar1, yaxis_data, series_data1, series_data2)
            //console.log(s1)
            myChart4.setOption(option4);
        }

    })

    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data3) {

            var item3 = data3.Models;

            item3 = DATA_bar2_1.Models;


            var for_legend_bar2 = [];
            var series_data = new Array();
            var series_data1 = new Array();
            //var series_data2 = [];

            var yaxis_data = [];
            var xmax, xmin;
            //var s1 = [];
            var s2 = [];


            xmax = item3[1][6];
            xmin = item3[1][5];
            yaxis_data = item3[0];

            for (i = 1; i < item3[0].length + 1; i++) {
                series_data1.push(item3[1][i + 6]);
                series_data1.push(item3[2][i + 6]);
            }

            var hehe = _.chunk(series_data1, 4);

            for (i = 1; i < item3.length; i++) {
                s2.push({
                    name: item3[i][0],
                    type: 'bar',
                    data: hehe[i - 1]
                })
            }

            //yaxis数据抽取
            for (i = 1; i < item3.length; i++) {
                for_legend_bar2.push(item3[i][0])
            }

            //console.log(s1)




            var option3 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_bar2
                },

                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        //magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                grid: {
                    left: '20%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        crossStyle: { textStyle: { fonSize: 14 } },
                        lineStyle: { color: '#C4EAFC' }
                    },
                    //formatter: function (params) {

                    //}
                },
                xAxis: [
                    {
                        axisLabel: {
                            textStyle: { fontSize: 14 },
                        },
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        max: xmax,
                        min: xmin,
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        data: yaxis_data,
                        type: 'category',
                        nameTextStyle: { fontSize: 14 },
                        //axisLabel: { formatter: '{value}' },
                    }
                ],
                series: s2
            }

            //console.log(s1, for_legend_bar1, yaxis_data, series_data1)
            myChart5.setOption(option3)
        },
        error: function (req, msg) {
            console.log(msg);
        }
    })

    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data1) {


            //
            var pie_series_data1 = [];
            var pie_series_data2 = [];
            var for_legend_data = [];

            var item = data1.Models;

            //假数据
            var item = DATA_pie11.Models;
            //左饼数据
            for (i = 0; i < item.length; i++) {
                if (item[i].能源名称 == '能源费用占生产总成本') {
                    pie_series_data1.push({
                        name: item[i].能源名称,
                        selected:true,
                        value: item[i].能源占比
                    })
                }
                else {
                    pie_series_data1.push({
                        name: item[i].能源名称,
                        value: item[i].能源占比
                    })
                }



            }
            //右饼数据
            for (i = 0; i < item.length; i++) {
                pie_series_data2.push({
                    name: item[i].能源名称,
                    value: item[i].能源成本
                })
            }
            //标注数据
            for (i = 0; i < item.length; i++) {
                for_legend_data.push(item[i].能源名称)
            }

            var option6 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_data,
                    top: 250
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (p) {
                        //console.log(p);
                        var res = p.seriesName + '<br/>'
                        if (p.seriesName.indexOf('占比') != -1) {
                            res += p.name + ':' + p.value + '<br/>'+p.percent+'%'
                        }
                        else {
                            res += p.name + ':' + p.value + '<br/>' + p.percent + '%'
                        }
                        return res
                    }
                },
                series: [
                    {
                        center: ['50%', '50%'],
                        name: '能耗占比（折标煤）',
                        type: 'pie',
                        radius: ['0%', '70%'],
                        //slected:true,
                        data: pie_series_data2,
                    },
                ]
            }
            myChart6.setOption(option6);

        }
    });

    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data1) {


            //
            var pie_series_data1 = [];
            var pie_series_data2 = [];
            var for_legend_data = [];

            var item = data1.Models;

            //假数据
            var item = DATA_pie12.Models;
            //左饼数据
            for (i = 0; i < item.length; i++) {
                pie_series_data1.push({
                    name: item[i].能源名称,
                    value: item[i].能源占比
                })
            }
            //右饼数据
            for (i = 0; i < item.length; i++) {
                pie_series_data2.push({
                    name: item[i].能源名称,
                    value: item[i].能源成本
                })
            }
            //标注数据
            for (i = 0; i < item.length; i++) {
                for_legend_data.push(item[i].能源名称)
            }

            var option6 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_data,
                    top: 250
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (p) {
                        //console.log(p);
                        var res = p.seriesName + '<br/>'
                        if (p.seriesName.indexOf('占比') != -1) {
                            res += p.name + ':' + p.value + '<br/>' + p.percent + '%'
                        }
                        else {
                            res += p.name + ':' + p.value + '<br/>' + p.percent + '%'
                        }
                        return res
                    }
                },
                series: [
                    {
                        center: ['50%', '50%'],
                        name: '能耗占比（折标煤）',
                        type: 'pie',
                        radius: ['0%', '70%'],
                        //slected:true,
                        data: pie_series_data2,
                    },
                ]
            }
            myChart7.setOption(option6);

        }
    });

}


myChart2.on('click', function (e) {
    //console.log(e)
    myChart3.clear();
    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
        method: 'get',
        dataType: 'json',
        //data: {

        //},
        success: function (data) {

            var item = data.Models;

            if (e.name == '电力') {
                item = DATA_bar21.Models;
            }

            if (e.name == '天然气') {
                item = DATA_bar22.Models;
            }



            var for_legend_bar1 = [];
            var series_data = new Array();
            var series_data1 = new Array();
            //var series_data2 = [];

            var yaxis_data = [];
            var xmax, xmin;
            var s1 = [];
            var s2 = [];


            xmax = item[1][6];
            xmin = item[1][5];
            yaxis_data = item[0];

            for (i = 1; i < item[0].length + 1; i++) {
                series_data1.push(item[1][i + 6]);
                series_data1.push(item[2][i + 6]);
            }

            var hehe = _.chunk(series_data1, 7);

            for (i = 1; i < item.length; i++) {
                s1.push({
                    name: item[i][0],
                    type: 'bar',
                    data: hehe[i - 1]
                })
            }

            //yaxis数据抽取
            for (i = 1; i < item.length; i++) {
                for_legend_bar1.push(item[i][0])
            }

            //console.log(s1)




            var option3 = {
                title: {
                    text: '',
                    subtext: '',
                    textTyle: { fontSize: 14 },
                    x: 'center'
                },
                legend: {
                    data: for_legend_bar1
                },

                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    padding: [20, 10, 15, 30],
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        //magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        crossStyle: { textStyle: { fonSize: 14 } },
                        lineStyle: { color: '#C4EAFC' }
                    },
                    //formatter: function (params) {

                    //}
                },
                xAxis: [
                    {
                        axisLabel: {
                            textStyle: { fontSize: 14 },
                        },
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        max: xmax,
                        min: xmin,
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        data: yaxis_data,
                        type: 'category',
                        nameTextStyle: { fontSize: 14 },
                        //axisLabel: { formatter: '{value}' },
                    }
                ],
                series: s1
            }

            //console.log(s1, for_legend_bar1, yaxis_data, series_data1)
            myChart3.setOption(option3)
        },
        error: function (req, msg) {
            console.log(msg);
        }
    })
})





