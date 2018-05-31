var tYear;
var Page = {
    init: function () {

        cvs.config({
            url: '/api/ElectrolyticAnalysis/GetSteam',
            field: 'ProductOutputName',
            multi: true,
            autoSelectNum: 4
        });

        cvs.select(function (list) {
            var t = dst.getCurrType();
            if (t == 'year') {
                callDrawMethodYear();
            }
            else {
                if (t == 'month') {
                    callDrawMethodMonth();
                }
            }
        })

        cvs.init(function () {
            dst.change(function (t, y, m, d) {
                if (t == 'year') {
                    tYear = y;
                    callDrawMethodYear();
                }
                else {
                    if (t == 'month') {
                        tYear = y;
                        tMonth = m;
                        callDrawMethodMonth();
                    }
                }
            })
            dst.init();
        });
    }
};

function callDrawMethodYear() {
    drawCurvesYear(tYear, cvs.selectedList);
}

function callDrawMethodMonth() {
    drawCurvesMonth(tYear, tMonth, cvs.selectedList);
}


var selectedDisplays, yMax, yMin;
var selected = new Array(), ydata = new Array();

function drawCurvesMonth(year, month, engerymeasurs) {

    //清空Echarts
    selectedDisplays = null;
    yMax = null;
    yMin = null;
    selected = new Array();
    ydata = new Array();

    selectedDisplays = engerymeasurs[0];
    selected.push(engerymeasurs[0]);
    for (var i = 1; i < engerymeasurs.length; i++) {
        selectedDisplays = selectedDisplays + ":" + engerymeasurs[i];
        selected.push(engerymeasurs[i]);
    };

    var myChart1 = echarts.init(document.getElementById('echt-line1'));
    var displays;
    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetSteamByMonth',
        method: 'get',
        dataType: 'json',
        data: {
            year: year,
            month: month,
            ProductOutputName: selectedDisplays
        },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                var myData = new Array();
                var daynum = data.Models[0][4];  //去掉横纵坐标的参数
                var days = new Array(daynum);
                for (var i = 0; i < data.Models.length; i++) {
                    yMin = data.Models[i][0];
                    yMax = data.Models[i][1];
                    myData[i] = new Array(daynum);
                    for (var j = 5; j < data.Models[i].length; j++) {
                        myData[i][j - 5] = data.Models[i][j];
                    }
                    ydata[i] = {
                        type: 'line',
                        name: selected[i],
                        hoverAnimation: false,
                        data: myData[i],
                        itemStyle: { normal: { label: { show: true } } },
                    }
                    var cDays = data.Models[i][3];
                    var lDays = daynum - data.Models[i][3];
                    for (var k = 0; k < lDays ; k++) {
                        days[k] = data.Models[i][2] + k;
                    }
                    for (var m = 0; m < cDays ; m++) {
                        days[m + lDays] = m + 1;
                    }

                }
                console.log(data.Models);
                console.log(daynum);
                console.log(lDays);
                console.log(days);
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
                        y2: '3%',
                        y: '9%',
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
                        data: days,
                        axisLabel: { textStyle: { fontSize: 14 } },
                        type: 'category',
                        boundaryGap: false
                    },
                    yAxis: {
                        name: '',
                        type: 'value',
                        max: yMax,
                        min: yMin,
                        nameTextStyle: { fontSize: 14 },
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} Nm3' }
                    },
                    series: ydata,
                }
                myChart1.setOption(option1);
            }

        },
        error: function (req, msg) {
            console.log(msg);
        }
    });
}

function drawCurvesYear(year, engerymeasurs) {

    //清空Echarts
    selectedDisplays = null;
    yMax = null;
    yMin = null;
    selected = new Array();
    ydata = new Array();

    selectedDisplays = engerymeasurs[0];
    selected.push(engerymeasurs[0]);
    for (var i = 1; i < engerymeasurs.length; i++) {
        selectedDisplays = selectedDisplays + ":" + engerymeasurs[i];
        selected.push(engerymeasurs[i]);
    };


    var myChart1 = echarts.init(document.getElementById('echt-line1'));
    var displays;
    $.ajax({
        url: '/api/ElectrolyticAnalysis/GetSteamByYear',
        method: 'get',
        dataType: 'json',
        data: {
            year: year,
            ProductOutputName: selectedDisplays
        },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {

                var myData = new Array();
                for (var i = 0; i < data.Models.length; i++) {
                    yMin = data.Models[i][0];
                    yMax = data.Models[i][1];
                    myData[i] = new Array(12);
                    for (var j = 2; j < 14; j++) {
                        myData[i][j - 2] = data.Models[i][j];
                    }
                    ydata[i] = {
                        type: 'line',
                        name: selected[i],
                        hoverAnimation: false,
                        data: myData[i],
                        itemStyle: { normal: { label: { show: true } } },
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
                        y2: '3%',
                        y: '9%',
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
                        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                        axisLabel: { textStyle: { fontSize: 14 } },
                        type: 'category',
                        boundaryGap: false
                    },
                    yAxis: {
                        name: '',
                        type: 'value',
                        max: yMax,
                        min: yMin,
                        nameTextStyle: { fontSize: 14 },
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} Nm3' }
                    },
                    series: ydata,
                }
                myChart1.setOption(option1);
            }

        },
        error: function (req, msg) {
            console.log(msg);
        }
    });
}
