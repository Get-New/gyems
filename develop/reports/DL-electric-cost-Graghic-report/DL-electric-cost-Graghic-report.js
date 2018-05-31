
var _startYear = 2015,
    _startMonth = 11,
    _startDay = 29;


var dst = (function () {
    var ret = {};

    var currType, currYear, currMonth, currDay, changeHandler;

    // 获得此时此刻的年月日
    function nowYMD() {
        var date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    // 根据情况，把向前或向后的箭头变灰
    function checkPrePost(type, year, month, day) {
        var now = nowYMD();
        var start = { y: _startYear, m: _startMonth, d: _startDay };
        var end = { y: now.year, m: now.month, d: now.day };
        switch (type) {
            case 'year':
                setPre(year > start.y);
                setPost(year < end.y);
                break;
            case 'month':
                setPre(year > start.y || month > start.m);
                setPost(year < end.y || month < end.m);
                break;
            case 'day':
                setPre(year > start.y || month > start.m || day > start.d);
                setPost(year < end.y || month < end.m || day < end.d);
                break;
        }

        function setPre(flag) {
            if (flag) {
                $('.pre').removeClass('disabled');
            } else {
                $('.pre').addClass('disabled');
            }
        }

        function setPost(flag) {
            if (flag) {
                $('.next').removeClass('disabled');
            } else {
                $('.next').addClass('disabled');
            }
        }
    }

    function go(type, year, month, day) {
        switch (type) {
            case 'year':
                currType = 'year';
                currYear = year;
                setTitle(year);
                changeHandler('year', year);
                break;
            case 'month':
                currType = 'month';
                currYear = year;
                currMonth = month;
                setTitle(year, month);
                changeHandler('month', year, month);
                break;
            case 'day':
                currType = 'day';
                currYear = year;
                currMonth = month;
                currDay = day;
                setTitle(year, month, day);
                changeHandler('day', year, month, day);
                break;
        }
        checkPrePost(type, year, month, day);
    }

    // 切换到年模式
    function switchYear() {
        $(".tab-date-type li").removeClass('active');
        $('#year').addClass('active');
        $('.pre i').html('前一年');
        $('.next i').html('后一年');
        go('year', nowYMD().year);
    }

    // 切换到月模式
    function switchMonth() {
        $(".tab-date-type li").removeClass('active');
        $('#month').addClass('active');
        $('.pre i').html('前一月');
        $('.next i').html('后一月');
        var now = nowYMD();
        go('month', now.year, now.month);
    }

    // 切换到天模式
    function switchDay() {
        $(".tab-date-type li").removeClass('active');
        $('#day').addClass('active');
        $('.pre i').html('前一天');
        $('.next i').html('后一天');
        var now = nowYMD();
        go('day', now.year, now.month, now.day);
    }

    function update() {
        go(currType, currYear, currMonth, currDay);
    }

    // 向前
    function preOrNext(n) {
        switch (currType) {
            case 'year':
                currYear += n;
                break;
            case 'month':
                currMonth += n;
                if (currMonth == 0 || currMonth == 13) {
                    currMonth = Math.abs(currMonth - 12);
                    currYear += n;
                }
                break;
            case 'day':
                var date = new Date(currYear, currMonth - 1, currDay);
                var n_date = new Date(date.getTime() + 24 * 60 * 60 * 1000 * n);
                currYear = n_date.getFullYear();
                currMonth = n_date.getMonth() + 1;
                currDay = n_date.getDate();
                break;
        }
        update();
    }

    // 设置标题
    function setTitle(year, month, day) {
        var str = year + '年';

        if (typeof month === 'number' && month >= 1 && month <= 12) {
            var zero = month < 10 ? '0' : '';
            str += zero + month + '月';
        }

        if (typeof day === 'number' && day >= 1 && day <= 31) {
            var zero = day < 10 ? '0' : '';
            str += zero + day + '日';
        }

        $("#title").html(str);
    }

    ret.change = function (func) {
        changeHandler = func;
    }

    ret.init = function () {
        switchYear();

        $("#title").click(function () {
            dwin.open(currType, currYear, currMonth, currDay);
        })
        $('#year').click(function () {
            switchYear();

        })
        $('#month').click(function () {
            switchMonth();
        })
        $('#day').click(function () {
            switchDay();
        })
        $('#pre').click(function () {
            if ($(this).hasClass('disabled')) return;
            preOrNext(-1);
        })
        $('#next').click(function () {
            if ($(this).hasClass('disabled')) return;
            preOrNext(1);
        })

        var now = nowYMD();
        //dwin.setEdge(_startYear, _startMonth, _startDay, now.year, now.month, now.day);
        //dwin.select(function (y, m, d) {
        //    go(currType, y, m, d);
        //})
        //dwin.init();
    }

    return ret;
}())
var tYear;
var Page = {
    //整理表格数据用的变量
    excel_months: null,
    excel_year: null,
    excel_titles: null,
    excel_data: null,
    excel_subtitle:['日期','实际电费','计划电费','同比','环比'],
    init: function () {

        cvs.config({
            url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
            fake: true,
            fakeData: DATA1.Models,
            field: 'EngeryMeasurepropertyName',            
            multi: false
        });

        cvs.select(function (list) {
            callDrawMethod();
        })
        
        cvs.init(function () {
        
            dst.change(function (t, y, m, d) {
                tYear = y;
                callDrawMethod();
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



            Page.get_excel_data(Page.get_excel);
        });
    },

    //整理表格数据
    get_excel_data: function (callback) {

        var filename = "动力车间电耗成本分析";

        //excel_titles转换为数组
        if (Page.excel_titles) {
            Page.excel_titles = Page.excel_titles.split(",");
        }

        //处理月份
        Page.excel_months = null;
        var temp_month_num = Page.excel_data ? Page.excel_data[0].length : 0;
        var temp_month = 1;
        if (temp_month_num != 0) {
            Page.excel_months = Page.excel_year + "-" + temp_month ;
            temp_month_num--;
            temp_month++;
        }
        while (temp_month_num) {
            Page.excel_months += "," + Page.excel_year + "-" + temp_month ;
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
    var selected = new Array(), ydata = new Array();

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
            console.log('您点击了' + selectedDisplays + '按键')
            var tooltip_data = [];
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                var myData = new Array();

                var item = data.Models;

                //在这放入假数据
                var item = DATA1_2.Models;

                //提取tooltip数据
                for (i = 0; i < item.length; i++) {
                    tooltip_data.push(item[i].LineName)
                };
                for (var i = 0; i < item.length; i++) {


                    myData[i] = item[i].LineData;
                    //Index2[i] = item[i].LinePercent;
                    if (item[i].LineName === '实际电费') {
                        ydata[i] = {
                            type: 'line',
                            name: item[i].LineName,
                            hoverAnimation: false,
                            //step:true,
                            data: myData[i],
                            itemStyle: { normal: { label: { show: true } } },
                        }
                    }
                   else if (item[i].LineName === '计划电费') {
                        ydata[i] = {
                            type: 'line',
                            name: item[i].LineName,
                            hoverAnimation: false,
                            //step:true,
                            data: myData[i],
                            itemStyle: { normal: { label: { show: true } } },
                            lineStyle:{normal:{type:'dashed'}}
                        }
                    }
                    else {
                        ydata[i] = {
                            type: 'line',
                            name: item[i].LineName,
                            hoverAnimation: false,
                            data: myData[i],
                            yAxisIndex: 1,
                            itemStyle: { normal: { label: { show: true } } },
                            label: { normal: { show: true, formatter: '{c}%' } },
                            lineStyle:{normal:{type:'dashed'}}

                        }

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
                        data: tooltip_data
                    },
                    //grid: {
                    //    x: '8%',
                    //    x2: '8%',
                    //    y2: '8%',
                    //    y: '15%'
                    //},
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
                            type: 'line',
                            crossStyle: { textStyle: { fonSize: 14 } },
                            lineStyle: { color: '#C4EAFC' }
                        },
                        formatter: function (params) {
                            //console.log(that.tooltip.formatter)
                            var res = params[0].name;
                            for (var i = 0, l = params.length - 2; i < l; i++) {
                                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                            }
                            for (var i = 2; i < 4; i++) {
                                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value + '%';
                            }
                            //return 'loading';
                            return res

                        }
                    },
                    xAxis: {
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        axisLabel: { textStyle: { fontSize: 14 }, interval: 0 },
                        type: 'category',
                        boundaryGap: false
                    },
                    yAxis: [
                        {
                        name: '',
                        type: 'value',
                        //max: yMax,
                        //min: yMin,
                        nameTextStyle: { fontSize: 14 },
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} 元' }
                    },
                    {
                        name: '',
                        type: 'value',
                        max: 100,
                        //min: yMin,
                        nameTextStyle: { fontSize: 14 },
                        axisLabel: { textStyle: { fontSize: 14 } },
                        axisLabel: { formatter: '{value} %' }
                    },
                    ],
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