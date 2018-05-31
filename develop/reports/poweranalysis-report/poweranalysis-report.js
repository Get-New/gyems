
var tYear;
var Page = {
    excel_months: null,
    excel_year: null,
    excel_titles: null,
    excel_data: null,

    init: function () {

        cvs.config({
            url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
            field: 'EngeryMeasurepropertyName',
            multi: true,
            autoSelectNum: 4
        });

        cvs.select(function (list) {
            callDrawMethodYear();
        })

        cvs.init(function () {
            dst.config({ type: 'year' });
            dst.change(function (t, y, m, d) {
                tYear = y;
                callDrawMethodYear();
            })
            dst.init();
        });

        //导出Excel
        $('#export').click(function () {
            Page.get_excel_data(Page.get_excel);
        });
        //$('#export').hover(function () {
        //    $(this).css("background-image", "url(/images2/rightmanage_lan.png)")
        //    $(this).css("color", "#5aa7ce")
        //    $('#toolTip').css("visibility", "visible");
        //},
        // function () {
        //     $(this).css("background-image", "url(/images2/rightmanage.png)")
        //     $('#toolTip').css("visibility", "hidden");
        //});
    },

    //整理表格数据
    get_excel_data: function (callback) {

        var filename = "电解车间电量报表";

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

        //console.log("Page.excel_data:");
        //console.log(Page.excel_data);

        if (typeof callback == 'function' && Page.excel_data) {
            callback(Page.excel_data, filename);
        }
    },

    //发送请求 生成表格
    get_excel: function (data,filename) {

        //console.log("data:");
        //console.log(data);

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

function callDrawMethodYear() {
    drawCurvesYear(tYear, cvs.selectedList);
}

var selectedDisplays, yMax, yMin;
var selected = new Array(), ydata = new Array();

function drawCurvesYear(year, engerymeasurs) {

    //清空Echarts
    selectedDisplays = null;
    yMax = null;
    yMin = null;
    selected = new Array();
    ydata = new Array();

    console.log(year, engerymeasurs);

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
        url: '/api/ElectrolyticAnalysis/GetElectrolytic',
        method: 'get',
        dataType: 'json',
        data: {
            year: year,
            EngeryMeasureproperty: selectedDisplays,

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
                        x: '8%',
                        x2: '8%',
                        y2: '8%',
                        y:'15%'
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
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }   
                    },
                    calculable: true,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type:'line',
                            crossStyle: { textStyle: { fonSize: 14 } },
                            lineStyle:{color: '#C4EAFC'}
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