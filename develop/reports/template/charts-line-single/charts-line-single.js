var linechart_click_added = false; //linechart.click是否绑定的标识位
//var summary_getted = false; //当前分析数据是否已获取
var type = ''; //存放周期类型
var temp_ids = ''; //存放所有选中id
var data = null; //存放当前折线的所有数据

var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = true;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 1;

    // 默认时间类型（可选year、month、day）
    ret.defaultDateType = 'month';

    // 图表(可能有多个)
    ret.charts = [{
        // 容器的id
        containerId: 'chart1',
    }];

    return ret;
})();

$(function () {
    tp.init();

    tp.bindDrawMethod(function () {
        draw();
    })

    //tp.bindCvsData(demoHelper.cvs());
    tp.bindCvsData(get_cvs_by_location());

    //导出excel按钮
    $('#export').click(function () {
        get_excel();
    });

    draw();

    showBack();
})

function showBack() {
    var temp_location = window.location.search;
    var isBack = temp_location.split('isBack:')[1] ? temp_location.split('isBack:')[1].split(';')[0] : null;

    if (isBack == 'true') {
        $('#goback').show();
        $("#goback").click(function () {
            window.history.go(-1);
        })
    }
}

function draw() {
    if (tp.isReady() == false)
        return;

    type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();
    var day = dst.getCurrDay();

    var cvsList = cvs.selectedList;

    //获取id数据
    temp_ids = '';
    var temp_cvs_length = cvsList.length;
    for (var i = 0; i < temp_cvs_length; i++) {
        temp_ids += ',' + cvsList[i].id;
    }
    temp_ids = temp_ids.substr(1);

    data = null;

    if (temp_ids && type == 'day') {
        data = get_line_data_by_hour(temp_ids, year, month, day);
    }
    else if (temp_ids && type == 'month') {
        data = get_line_data_by_day(temp_ids, year, month);
    }
    else if (temp_ids && type == 'year') {
        data = get_line_data_by_month(temp_ids, year);
    }
    else if (temp_ids && type == 'history') {
        data = get_line_data_by_year(temp_ids);
    }
    else {
        //console.log('error:get_line_data_by_xx()');
        return;
    }

    var summary_year = year;
    var summary_month = month;
    var summary_day = '';

    if (type == 'month' && data) {
        var data_series_data = data.series[0].data;
        var data_xAxis = data.xAxis;
        var temp_count = 0;
        while (data_series_data[temp_count]) {
            summary_day = data_xAxis[temp_count];
            temp_count++;
        }
        if ((Number(summary_day) - Number(temp_count)) > 10) {
            summary_month = month - 1;
        }
    }
    else if (type == 'year' && data) {
        var data_series_data = data.series[0].data;
        var data_xAxis = data.xAxis;
        var temp_count = 0;
        while (data_series_data[temp_count]) {
            summary_month = data_xAxis[temp_count];
            temp_count++;
        }
    }

    if (data) {
        data.leftYMin = 0;
        //console.log("data:");
        //console.log(data);
        linechart.draw(options.charts[0], data);

        if (type == 'month') {
            var temp_summary = '';
            var dataIndex = temp_count - 1;

            for (var i = 0; i < data.series.length; i++) {
                temp_summary += data.series[i].name + ':' + data.series[i].data[dataIndex] + ' ';
            }

            var summary_date = summary_year + '-' + summary_month + '-' + summary_day;
            get_sumary_data(summary_date, temp_ids, temp_summary);
        }
        else if (type == 'year') {
            var temp_summary = '';
            var dataIndex = temp_count - 1;

            for (var i = 0; i < data.series.length; i++) {
                temp_summary += data.series[i].name + ':' + data.series[i].data[dataIndex] + ' ';
            }

            var summary_date = summary_year + '-' + summary_month + '-' + summary_day;
            get_sumary_data(summary_date, temp_ids, temp_summary);
        }
        else {
            $('#summary').html('');
            $('#summary').hide();
        }

        if (!linechart_click_added) {
            linechart.click(options.charts[0], function (pms) {
                if (type == 'month') {
                    summary_day = pms.name;
                    if (Number(pms.name) > pms.dataIndex) {
                        summary_month = month - 1;
                    }

                    var temp_summary = '';
                    var dataIndex = pms.dataIndex;

                    for (var i = 0; i < data.series.length; i++) {
                        temp_summary += data.series[i].name + ':' + data.series[i].data[dataIndex] + ' ';
                    }

                    var summary_date = summary_year + '-' + summary_month + '-' + summary_day;
                    get_sumary_data(summary_date, temp_ids, temp_summary);
                }
                else if (type == 'year') {
                    summary_month = pms.name;

                    var temp_summary = '';
                    var dataIndex = pms.dataIndex;

                    for (var i = 0; i < data.series.length; i++) {
                        temp_summary += data.series[i].name + ':' + data.series[i].data[dataIndex] + ' ';
                    }

                    var summary_date = summary_year + '-' + summary_month + '-' + summary_day;
                    get_sumary_data(summary_date, temp_ids, temp_summary);
                }
                else {
                    $('#summary').html('');
                    $('#summary').hide();
                }
            });

            linechart_click_added = true;
        }
    }
}

//执行Excel获取操作
function get_excel() {
    var excel_data = get_excel_data();
    var filename = "导出报表";

    if (!excel_data) {
        Util.alert('没有数据可供导出');
        return;
    }

    var month = dst.getCurrMonth();
    excel_data = month + '月,' + excel_data;

    //var form = $("<form>");
    //form.attr("style", "display:none");
    //form.attr("target", "_blank");
    //form.attr("method", "post");
    //form.attr("action", '/api/ExcelOut/GetExcel');
    //$("body").append(form);

    //var input1 = $("<input>");
    //input1.attr("type", "hidden");
    //input1.attr("name", "filename");
    //input1.attr("value", "test_template");//命名Excel

    //var input2 = $("<input>");
    //input2.attr("type", "hidden");
    //input2.attr("name", "datatype");
    //input2.attr("value", "");//传参类型

    //var input3 = $("<input>");
    //input3.attr("type", "hidden");
    //input3.attr("name", "body");
    //input3.attr("value", '');//Excel数据

    ////Excel设置 RFixedHeader(顶部固定行数) RFixedFoot(底部固定行数) RNames(titles数量) Group(每个title所占列数)
    //var input4 = $("<input>");
    //input4.attr("type", "hidden");
    //input4.attr("name", "setting");
    //input4.attr("value", "RFixedHeader:2,RFixedFoot:1,Group:2,Titles:" + Page.titles_num);

    //form.append(input1);
    //form.append(input2);
    //form.append(input3);

    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "_blank");
    form.attr("method", "post");
    form.attr("action", '/api/ExcelOut/GetTempletExcel');

    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "filename");
    input1.attr("value", "动力车间月度能源绩效参数考核表模板");//模板名称
    $("body").append(form);

    var input2 = $("<input>");
    input2.attr("type", "hidden");
    input2.attr("name", "body");
    input2.attr("value", excel_data);//Excel数值数据
    $("body").append(form);

    form.append(input1);
    form.append(input2);

    form.submit();
    form.remove();

    form.submit();
    form.remove();
}

//获取Excel数据
function get_excel_data() {
    var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;//window.location.search.replace('?', ''); //获得window.location内容
    var Config_ID = temp_location.split('ConfigID:')[1] ? temp_location.split('ConfigID:')[1].split('?')[0] : null; //获得ConfigID值
    var type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();
    var temp_excel_data = null;
    if (Config_ID && month) {
        $.ajax({
            url: '/api/ReportSubConfig/GetExcelReportData',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { ConfigID: Config_ID, year: year, month: month },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    temp_excel_data = data.Models; //如果查询成功 则进行暂存操作
                }
            }
        });
    }
    return temp_excel_data;
}

//根据window.location中的ConfigID获取单元数据
function get_cvs_by_location() {
    var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;//window.location.search.replace('?', ''); //获得window.location内容
    var Config_ID = temp_location.split('ConfigID:')[1] ? temp_location.split('ConfigID:')[1].split('?')[0] : null; //获得ConfigID值
    var temp_models = null;

    if (Config_ID) {
        $.ajax({
            url: '/api/ReportSubConfig/GetPage',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { ConfigID: Config_ID, SubConfigCellName: '' },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    temp_models = data.Models; //如果查询成功 则进行暂存操作
                }
            }
        });
    }

    //按照demoHelper.cvs()组织数据格式
    if (temp_models) {
        var temp_cvs = [];
        var temp_models_length = temp_models.length;
        for (var i = 0; i < temp_models_length; i++) {
            var temp_obj = { itemId: '', itemName: '' };
            temp_obj.itemId = temp_models[i].SubConfigID;
            temp_obj.itemName = temp_models[i].SubConfigCellName;
            temp_cvs.push(temp_obj);
        }
        return temp_cvs;
    }
    else {
        var temp_cvs = [{ itemId: '', itemName: '查询结果为空' }];
        return temp_cvs;
    }
}

//按年查询
function get_line_data_by_year(ids) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonSingleUnit/GetChartDataByYear',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//按月查询
function get_line_data_by_month(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonSingleUnit/GetChartDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//按日查询
function get_line_data_by_day(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonSingleUnit/GetChartDataByDay',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//按时查询
function get_line_data_by_hour(ids, year, month, day) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonSingleUnit/GetChartDataByHour',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month, Day: day },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//获取分析内容
function get_sumary_data(summary_date, temp_ids, temp_summary) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonSingleUnit/GetChartAnalysisContent',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { date: summary_date, subConfigId: temp_ids },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models; //如果查询成功 则返回Models
            }
        }
    });
    //temp_data = ['123', '321', '123', '321', '123', '321']
    var summary_text = "数据分析";
    summary_text += ' ' + summary_date
    summary_text += '<br />' + temp_summary;
    if (temp_data) {
        for (var i = 0; i < temp_data.length; i++) {
            summary_text += '<br />' + temp_data[i];
        }
    }
    $('#summary').html('');
    $('#summary').html(summary_text);
    $('#summary').show();
}