//var demo = (function () {
//    var ret = {};

//    ret.cvs = [];

//    var temp_obj = { itemId: '', itemName: '' };
//    var temp_model = Electrolysis_Sections_EngeryMeasurepropertyName.Models;

//    for (var i in temp_model) {
//        temp_obj.itemId = temp_model[i].EngeryMeasurepropertyID;
//        temp_obj.itemName = temp_model[i].EngeryMeasurepropertyName;
//        ret.cvs.push(temp_obj);
//    }

//    ret.line = [{
//    }, {
//    }, {
//    }];

//    return ret;
//})();

var selectedUnitName = '';
var series_Name = ['实际值', '考核值', '同比', '环比'];

var cvs = (function () {
    var ret = {};
    var conf = {
        selector: '.cvs',
        fake: false,
        fakeData: [],
        field: '',
        multi: true,
        autoSelectNum: 1
    };

    var selectHandler = null;

    ret.allUnitName = [];
    ret.allList = [];
    ret.selectedList = [];
    ret.allId = [];
    ret.config = function (options) {
        conf = $.extend(true, {}, conf, options)
    }

    ret.init = function (callback) {
        var that = this;

        //获取可选择的统计模块
        $.ajax({
            url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
            method: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    var item = data.Models;

                    var item = Electrolysis_Sections_EngeryMeasurepropertyName.Models;

                    for (var i = 0; i < item.length; i++) {
                        that.allList.push(item[i].EngeryMeasurepropertyName);
                        that.allUnitName.push(item[i].UnitName);
                        that.allId.push(item[i].EngeryMeasurepropertyID);

                        if (i < 1) {
                            that.selectedList.push(item[i].EngeryMeasurepropertyName);
                            selectedUnitName = item[i].UnitName;
                        }
                    }

                    that.draw();

                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        })
    }

    ret.draw = function () {
        var that = this;
        var list = this.allList;
        var list2 = this.allUnitName;
        var list3 = this.allId;
        var ul = $(".cvs");
        ul.html('');

        for (i = 0; i < list.length; i++) {
            var item = list[i];

            var li = $("<li>");
            li.append(item);
            li.attr('ItemId', list3[i]);
            li.attr('UnitName', list2[i]);
            li.attr('ItemName', item)
            ul.append(li);

            for (var j = 0; j < that.selectedList.length; j++) {
                if (that.selectedList[j] == item) {
                    li.addClass('active');
                }
            }
        }

        $(".cvs li").click(function () {
            var el = $(this);
            //console.log('您点击了' + el.text() + '键')
            $('li').removeClass('active')

            if (el.hasClass('active')) {
                el.removeClass('active');
            } else {
                el.addClass('active');
            }

            that.selectedList = getSelectedIds();
            //that.selectedUnitName = [];

            callDrawMethod();
        })
    }

    ret.select = function (func) {
        selectHandler = func;
    }

    function getSelectedIds() {
        var arr = [];
        $(conf.selector + " li").each(function () {
            var el = $(this);
            if (el.hasClass('active')) {
                arr.push(el.attr('ItemId'));
            }
        })
        return arr;
    }

    return ret;
})();

var Page = {
    //整理表格数据用的变量
    excel_months: null,
    excel_year: null,
    excel_titles: null,
    excel_data: new Array(),
    excel_subtitle: ['月份', '实际值', '考核值', '同比', '环比'],

    init: function () {
        //console.log($('#measures'));
        cvs.init(function () {
            //console.log('222');
            dst.change(function (t, y, m, d) {
                tYear = y;
                callDrawMethod();
            })
            dst.config({
                type: 'year',
            })
            dst.init();
        });

        //导出Excel
        $('#export').click(function () {
            //给环比，同比加上百分号
            if (Page.excel_data) {
                for (i = 2; i < 4; i++) {
                    for (j = 0; j < Page.excel_data[i].length; j++) {
                        Page.excel_data[i][j] = Page.excel_data[i][j] + '%';
                    }
                }
            }

            //alert("导出Excel 点击调试");
            Page.get_excel_data(Page.get_excel);
        });
    },

    //整理表格数据
    get_excel_data: function (callback) {
        var filename = "动力车间能源绩效分析";

        //excel_titles转换为数组
        if (Page.excel_titles) {
            Page.excel_titles = Page.excel_titles.split(",");
        }

        //处理月份
        Page.excel_months = null;
        var temp_month_num = Page.excel_data ? Page.excel_data[0].length : 0;
        var temp_month = 1;
        if (temp_month_num != 0) {
            Page.excel_months = Page.excel_year + "-" + temp_month;
            temp_month_num--;
            temp_month++;
        }
        while (temp_month_num) {
            Page.excel_months += "," + Page.excel_year + "-" + temp_month;
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
                Page.excel_data[i] = Page.excel_subtitle[i] + "," + Page.excel_data[i];
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
    get_excel: function (data, filename) {
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

var tYear;

function callDrawMethod() {
    var year = tYear;
    var engerymeasures = cvs.selectedList;
    draw(year, engerymeasures);
}

function draw(year, engerymeasurs) {
    //console.log(year, engerymeasurs);

    Page.excel_data = null; //置空excel_data
    Page.excel_titles = null;
    Page.excel_titles = "月份," + engerymeasurs; //获取excel_titles
    Page.excel_year = null;
    Page.excel_year = year; //获取excel_year

    var selectedDisplays, yMax, yMin;
    var selected = new Array(), ydata = new Array(), ydata2 = new Array();

    selectedDisplays = engerymeasurs[0];
    selected.push(engerymeasurs[0]);
    for (var i = 1; i < engerymeasurs.length; i++) {
        selectedDisplays = selectedDisplays + ":" + engerymeasurs[i];
        selected.push(engerymeasurs[i]);
    };

    //***********************************************************************************
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
                var that = this;
                var myData = new Array();
                //var Index2 = new Array();

                var item = data.Models;
                var tooltip_data = [];

                ////在这放入假数据
                //var item = DATA2_1.Models;
                //if ($('li.active').text() == '一系列直流') {
                //   item = DATA2_2.Models;

                //}

                ////提取tooltip数据
                //for (i = 0; i < item.length; i++) {
                //    tooltip_data.push(item[i].LineName)
                //};
                //for (var i = 0; i < item.length; i++) {
                //    myData[i] = item[i].LineData;

                //    if (item[i].LineName === '实际值'&&item[i].HistoryYear) {
                //        ydata[i] = {
                //            type: 'line',
                //            name: item[i].LineName,
                //            hoverAnimation: false,
                //            data: myData[i],
                //            itemStyle: { normal: { label: { show: true } } },
                //            markLine: { silent:true,data: [{ yAxis: item[i].HistoryYear, label: { normal: { formatter: '历史最好值（年值）:{c}', position: 'middle' } } }, { yAxis: item[i].HistoryMonth, label: { normal: { formatter: '历史最好值（月值）:{c}', position: 'middle' } } }] }
                //        }
                //    }

                //    else if (item[i].LineName === '考核值') {
                //        ydata[i] = {
                //            type: 'line',
                //            name: item[i].LineName,
                //            hoverAnimation: false,
                //            step:true,
                //            data: myData[i],
                //            itemStyle: { normal: { label: { show: true } } },
                //            lineStyle: { normal: { type: 'dashed' } }

                //        }
                //    }
                //    else {
                //        ydata[i] = {
                //            type: 'line',
                //            name: item[i].LineName,
                //            hoverAnimation: false,
                //            data: myData[i],
                //            yAxisIndex: 1,
                //            //itemStyle: { normal: { label: { show: true } } },
                //            label: { normal: { show: true, formatter: '{c}%' } },
                //            lineStyle: { normal: { type: 'dashed' } }

                //        }

                //    }
                //}
                //*******************************************************************
                var ymax1, ymax2, ymin1, ymin2;
                var markline = [];
                var markline_name = [];
                var xaxis_data = [];
                var for_legend_data = [];

                var shuiping_num;
                //var myData = new Array();

                var item = Electrolysis_Sections_Unit_Consumption.Models;

                xaxis_data = item[0];
                //提取markline的数据
                for (i = 0; i < item.length; i++) {
                    if (item[i][1] == '水平线') {
                        shuiping_num++;
                        markline.push(item[i][item[i].length - 1]);
                        markline_name.push(item[i][0]);
                        _.remove(item, item[i]);
                    }
                }
                for (i = 1; i < item.length; i++) {
                    for_legend_data.push(item[i][0])
                }
                //提取公共部分数组
                for (i = 1; i < item.length; i++) {
                    var temp = [];
                    if (item[i].length > 8) {
                        for (j = 7; j < item[i].length; j++) {
                            temp.push(item[i][j]);
                        }
                    }
                    ydata[i - 1] = {
                        //ytype:item[i][1],
                        //type: 'line',
                        name: item[i][0],
                        data: temp,
                        //yAxisIndex: 0,
                        //itemStyle: { normal: { label: { show: true } } },
                        //label: { normal: { show: true, formatter: '{c}%' } },
                        //lineStyle: { normal: { type: 'dashed' } }
                    }

                    if (item[i][1] == '柱形') {
                        $.extend(ydata[i - 1], { type: 'bar' });
                    }

                    if (item[i][1] == '折线') {
                        $.extend(ydata[i - 1], { type: 'line' });
                        $.extend(ydata[i - 1], { markLine: { silent: true, data: [{ yAxis: markline[0], label: { normal: { formatter: markline_name[0] + ':{c}', position: 'middle' } } }] } })
                    }

                    if (item[i][1] == '直角线') {
                        $.extend(ydata[i - 1], { type: 'line' });
                        $.extend(ydata[i - 1], { step: true });
                    }

                    if (item[i][2] == '虚线') {
                        $.extend(ydata[i - 1], { lineStyle: { normal: { type: 'dashed' } } });
                    }

                    if (item[i][3] == '主坐标') {
                        $.extend(ydata[i - 1], { yAxisIndex: 0 });
                        if (item[i][6]) {
                            ymin1 = item[i][5];
                            ymax1 = item[i][6];
                        }
                    }

                    if (item[i][3] == '副坐标') {
                        $.extend(ydata[i - 1], { yAxisIndex: 1 });
                        if (item[i][5]) {
                            ymin2 = item[i][5];
                            ymax2 = item[i][6];
                        }
                    }
                }

                //console.log(ydata)

                Page.excel_data = myData; //获取excel_data

                //console.log(ydata)

                //console.log( $('li.active').attr('unitname'))
                var option1 = {
                    title: {
                        text: '',
                        subtext: '',
                        textTyle: { fontSize: 14 },
                        x: 'center'
                    },
                    legend: {
                        data: for_legend_data
                    },
                    grid: {
                        x: '8%',
                        x2: '8%',
                        y2: '8%',
                        y: '15%'
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
                            type: 'shadow',
                            crossStyle: { textStyle: { fonSize: 14 } },
                            lineStyle: { color: '#C4EAFC' }
                        },
                        formatter: function (params) {
                            //console.log(params)
                            var res = params[0].name;
                            for (var i = 0; i < 1; i++) {
                                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value + 'kwh/t';
                            }
                            for (var i = 1; i < 3; i++) {
                                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value + '%';
                            }
                            return res
                        }
                    },
                    xAxis: [
                        {
                            data: xaxis_data,
                            axisLabel: {
                                textStyle: { fontSize: 14 },
                                //interval: 0
                            },
                            type: 'category',
                            gridIndex: 0,
                            nameLocation: 'middle',
                            axisTick: {
                                show: false,
                                //interval:0
                            },
                            //offset:-100,
                            boundaryGap: true
                        }

                    ],
                    yAxis: [
                        {
                            name: '单位:' + $('li.active').attr('unitname'),
                            type: 'value',
                            gridIndex: 0,
                            max: ymax1,
                            min: ymin1,
                            nameTextStyle: { fontSize: 14 },
                            axisLabel: { textStyle: { fontSize: 14 } },
                            axisLabel: { formatter: '{value}' },
                            //offset:100
                        },
                        {
                            name: '',
                            type: 'value',
                            gridIndex: 0,
                            max: ymax2,
                            min: ymin2,
                            nameTextStyle: { fontSize: 14 },
                            axisLabel: { textStyle: { fontSize: 14 } },
                            axisLabel: { formatter: '{value} %' }
                        },
                    ],
                    series: ydata
                }
                myChart1.setOption(option1);
                //console.log(option1)
            }
        },
        error: function (req, msg) {
            console.log(msg);
        }
    });
}

function newformatter(a) {
    if (that.option1.tooltip) {
    }
}