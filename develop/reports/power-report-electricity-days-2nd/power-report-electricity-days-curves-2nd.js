var tYear, tMonth;
var Page = {
    excel_months: null,
    excel_year: null,
    excel_titles: null,
    excel_data: null,

    init: function () {

        cvs.config({
            url: '/api/PowerRoomReport/GetDownTwoDepartmentName',
            field: 'DepartmentName',
            multi: true,
            autoSelectNum: 4
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

        //导出Excel
        $('#export').click(function (){
            Page.get_excel_data(Page.get_excel);
        });
    },

    //整理表格数据
    get_excel_data: function (callback) {

        var filename = "2#总降压电量统计报表";

        //excel_titles转换为数组
        if (Page.excel_titles) {
            Page.excel_titles = Page.excel_titles.split(",");
        }

        //处理月份
        Page.excel_months = null;
        var temp_month_num = Page.excel_data ? Page.excel_data[0].length : 0;
        var temp_month = 1;
        if (temp_month_num != 0) {
            Page.excel_months = Page.excel_year + "-" + temp_month + "-28";
            temp_month_num--;
            temp_month++;
        }
        while (temp_month_num) {
            Page.excel_months += "," + Page.excel_year + "-" + temp_month + "-28";
            temp_month_num--;
            temp_month++;
        }

        //处理excel_data 每列转换为字符串 并添加列excel_months
        if (Page.excel_data) {
            var i = 0;
            while (Page.excel_data[i]) {
                Page.excel_data[i] = Page.excel_data[i].join(",");
                i++;
            }
            Page.excel_data.unshift(Page.excel_months);
        }

        //处理excel_data 每列添加excel_titles[i]
        if (Page.excel_data) {
            var i = 0;
            while (Page.excel_data[i]) {
                Page.excel_data[i] = Page.excel_titles[i] + "," + Page.excel_data[i];
                i++;
            }
        }

        //处理excel_data 整体转换为字符串 用"|"进行分隔
        if (Page.excel_data) {
            Page.excel_data = Page.excel_data.join("|");
        }

        if (typeof callback == 'function' && Page.excel_data) {
            callback(Page.excel_data, filename);
        }
    },

    //发送请求 生成表格
    get_excel: function (data, filename) {
        var form = $("<form>");
        form.attr("style", "display:none");
        form.attr("target", "_blank");
        form.attr("method", "post");
        form.attr("action", '/api/ExcelOut/GetExcel');
        $("body").append(form);

        var input1 = $("<input>");
        input1.attr("type", "hidden");
        input1.attr("name", "filename");
        input1.attr("value", filename);//命名Excel

        var input2 = $("<input>");
        input2.attr("type", "hidden");
        input2.attr("name", "datatype");
        input2.attr("value", "data");//传参类型

        var input3 = $("<input>");
        input3.attr("type", "hidden");
        input3.attr("name", "body");
        input3.attr("value", data);//Excel数据

        form.append(input1);
        form.append(input2);
        form.append(input3);

        form.submit();
        form.remove();
    }
};


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

    console.log(year, month,engerymeasurs);

    Page.excel_data = null; //置空excel_data
    Page.excel_titles = null;
    Page.excel_titles = "月份," + engerymeasurs; //获取excel_titles
    Page.excel_year = null;
    Page.excel_year = year; //获取excel_year

    selectedDisplays = engerymeasurs[0];
    selected.push(engerymeasurs[0]);
    for (var i = 1; i < engerymeasurs.length; i++) {
        selectedDisplays = selectedDisplays + ":" + engerymeasurs[i];
        selected.push(engerymeasurs[i]);
    };

    var myChart1 = echarts.init(document.getElementById('echt-line1'));
    var displays;
    $.ajax({
		url: '/api/PowerRoomReport/GetDownTwoDepartmentLine',
        method: 'get',
        dataType: 'json',
        data: {
            year: year,
            month: month,
			departments: selectedDisplays
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
                
                Page.excel_data = myData; //获取excel_data

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
                        axisLabel: { formatter: '{value} kWh' }
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
