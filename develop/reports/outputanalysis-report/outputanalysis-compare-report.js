var tYear, tMonth;
var Page = {
    init: function () {
        cvs.config({
            url: '/api/ProductOutput/GetProductOutputName',
            field: 'ProductOutputName',
            multi: false,
            autoSelectNum: 1
        });

        cvs.select(function (list) {
            callDrawMethodMonth();
        });

        cvs.init(function () {
            dst.config({ type: 'month' });
            dst.change(function (t, y, m, d) {
                tYear = y;
                tMonth = m;
                callDrawMethodMonth();
            })
            dst.init();
        });
    }
};

function callDrawMethodMonth() {
    drawCurvesMonth(tYear, tMonth, cvs.selectedList);
    drawBarsMonth(tYear, tMonth, cvs.selectedList);
}

var yMax, yMin, y2Min, y2Max;
var selected = new Array(), ydata = new Array();
function drawCurvesMonth(year, month, engerymeasurs) {

    //清空Echarts
    yMax = null;
    yMin = null;
    y2Max = null;
    y2Min = null;
    selected = new Array();
    ydata = new Array();
   
    selected.push("计划产量");
    selected.push("实际产量");
    selected.push("待生产产量");

    var myChart1 = echarts.init(document.getElementById('echt-line1'));
    $.ajax({
        url: '/api/ProductOutput/GetProductFlodByMonth',
        method: 'get',
        dataType: 'json',
        data: {
            year: year,
            month: month,
            ProductOutputName: engerymeasurs[0]
        },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                var myData = new Array();
                var daynum = data.Models[0][4];  //去掉横纵坐标的参数
                var days = new Array(daynum);
                yMin = data.Models[0][0];
                yMax = data.Models[0][1];
                y2Min = data.Models[2][0];
                y2Max = data.Models[2][1];
                for (var i = 0; i < data.Models.length; i++) {
                    myData[i] = new Array(daynum);                   
                    if (i == (data.Models.length - 1)) {
                        for (var j = 5; j < data.Models[i].length; j++) {
                            var res = data.Models[i][j] * 100;
                            myData[i][j - 5] = parseFloat(res).toFixed(1);
                        }
                        ydata[i] = {
                            type: 'line',
                            yAxisIndex: 1,
                            name: selected[i],
                            hoverAnimation: false,
                            data: myData[i],
                            itemStyle: { normal: { label: { show: true } } },
                        }
                    }
                    else
                    {
                        for (var j = 5; j < data.Models[i].length; j++) {
                            myData[i][j - 5] = data.Models[i][j];
                        }
                        ydata[i] = {
                            type: 'line',
                            yAxisIndex: 0,
                            name: selected[i],
                            hoverAnimation: false,
                            data: myData[i],
                            itemStyle: { normal: { label: { show: true } } },
                        }
                    }
                    var cDays=data.Models[i][3];
                    var lDays=daynum-data.Models[i][3];
                    for (var k = 0; k < lDays ; k++) {
                        days[k] = data.Models[i][2] + k;
                    }
                    for (var m = 0; m < cDays ; m++) {
                        days[m + lDays] =m + 1;
                    }
                    
                }
                var option1 = {
                    title: {
                        text: '',
                        subtext: '',
                        textTyle: { fontSize: 14 },
                        x: 'center'
                    },
                    legend: {
                        data: selected
                    },
                    grid: {
                        x: '3%',
                        x2: '4%',
                        y2: '2%',
                        y:'19%',
                        containLabel: true
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            crossStyle: { textStyle: { fonSize: 14 } },
                            lineStyle: { color: '#C4EAFC' }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: days,
                        axisLabel: { textStyle: { fontSize: 14 } },                       
                    },
                    yAxis: [{
                        type: 'value',
                        max: yMax,
                        min: yMin,
                        nameTextStyle: { fontSize: 14 },
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} T' }
                    },
                    {
                        type: 'value',
                        max: y2Max,
                        min: y2Min,
                        nameTextStyle: { fontSize: 14 },
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} %' }
                    }],                    
                    series: ydata,
                }
                console.log(days);
                myChart1.setOption(option1);
            }

        },
        error: function (req, msg) {
            console.log(msg);
        }
    });
}

//柱状图
var xMax, xMin;
var barSelected = new Array(), barSelectedTags=new Array(),barXdata = new Array();
function drawBarsMonth(year, month, engerymeasurs) {

    //清空Echarts
    xMax = null;
    xMin = null;
    barSelected = new Array();
    barSelectedTags = new Array();
    barXdata = new Array();

    barSelected.push("计划产量");
    barSelected.push("实际产量\n/待生产产量");

    barSelectedTags.push('计划产量');
    barSelectedTags.push('实际产量');
    barSelectedTags.push('待生产产量');

    var myChart2 = echarts.init(document.getElementById('echt-line2'));
    $.ajax({
        url: '/api/ProductOutput/GetProductPillarByMonth',
        method: 'get',
        dataType: 'json',
        data: {
            year: year,
            month: month,
            ProductOutputName:engerymeasurs[0]
        },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                var myData = new Array();
                xMin = data.Models[0][0];
                xMax = data.Models[0][1];
                var option2 = {
                    legend: {
                        data: barSelectedTags
                    },
                    grid: {
                        x: '3%',
                        x2: '4%',
                        y2: '3%',
                        y:'9%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        max: xMax,
                        min: xMin,
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} T' }
                    },
                    yAxis: {
                        type: 'category',
                        axisLabel: { textStyle: { fontSize: 14 } },
                        data: barSelected
                    },
                    series: [{
                        name: '计划产量',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [data.Models[0][2], 0]
                    },
                    {
                        name: '实际产量',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [0, data.Models[0][3]]
                    },
                    {
                        name: '待生产产量',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [0, data.Models[0][4]]
                    }]
                };
                myChart2.setOption(option2);
            }
        },
        error: function (req, msg) {
            console.log(msg);
        }
    });
}
