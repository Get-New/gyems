var linechart_click_added = false; //linechart.click是否绑定的标识位
//var summary_getted = false; //当前分析数据是否已获取
var type = ''; //存放周期类型
var temp_ids = ''; //存放所有选中id

var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = true;

    // 是否允许多选
    ret.multiCvs = true;

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

    var data = null;

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
            var summary_date = summary_year + '-' + summary_month + '-' + summary_day;
            get_sumary_data(summary_date, temp_ids);
        }
        else if (type == 'year') {
            var summary_date = summary_year + '-' + summary_month;
            get_sumary_data(summary_date, temp_ids);
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

                    var summary_date = summary_year + '-' + summary_month + '-' + summary_day;
                    get_sumary_data(summary_date, temp_ids);
                }
                else if (type == 'year') {
                    summary_month = pms.name;

                    var summary_date = summary_year + '-' + summary_month;
                    get_sumary_data(summary_date, temp_ids);
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
    var filename = "导出Excel";

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
    input3.attr("value", excel_data);//Excel数据

    form.append(input1);
    form.append(input2);
    form.append(input3);

    form.submit();
    form.remove();
}

//获取Excel数据
function get_excel_data() {
    var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;//window.location.search.replace('?', ''); //获得window.location内容
    var Config_ID = temp_location.split('ConfigID:')[1] ? temp_location.split('ConfigID:')[1].split('?')[0] : null; //获得ConfigID值

    //获取时间参数
    var type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();
    var day = dst.getCurrDay();

    var excel_param = {
        ConfigID: Config_ID,
        Cycle: '',
        Time: ''
    };

    if (type == 'day') {
        excel_param.Cycle = 'Hour';
        excel_param.Time = year + '-' + month + '-' + day;
    }
    else if (type == 'month') {
        excel_param.Cycle = 'Day';
        excel_param.Time = year + '-' + month
    }
    else if (type == 'year') {
        excel_param.Cycle = 'Month';
        excel_param.Time = year;
    }
    else if (type == 'history') {
        excel_param.Cycle = 'Year';
        excel_param.Time = '';
    }
    else {
        //console.log('error:get_line_data_by_xx()');
        return;
    }

    var temp_excel_data = null;

    if (Config_ID) {
        $.ajax({
            url: '/api/CommonStackUnit/GetAllData',
            method: 'get',
            dataType: 'json',
            async: false,
            data: excel_param,
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    temp_excel_data = data.Models[0]; //如果查询成功 则进行暂存操作
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
        url: '/api/CommonMultiUnit/GetChartDataByYear',
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
        url: '/api/CommonMultiUnit/GetChartDataByMonth',
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
        url: '/api/CommonMultiUnit/GetChartDataByDay',
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
        url: '/api/CommonMultiUnit/GetChartDataByHour',
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
function get_sumary_data(summary_date, temp_ids) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartAnalysisContent',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { date: summary_date, subConfigIds: temp_ids },
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
    if (temp_data) {
        for (var i = 0; i < temp_data.length; i++) {
            summary_text += '<br />' + temp_data[i];
        }
    }
    $('#summary').html('');
    $('#summary').html(summary_text);
    $('#summary').show();
}