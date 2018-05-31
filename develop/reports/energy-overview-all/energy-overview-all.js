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
        containerId: 'chart1_1',
    }, {
        // 容器的id
        containerId: 'chart1_2',
    }, {
        // 容器的id
        containerId: 'chart1_3',
    }, {
        // 容器的id
        containerId: 'chart1_4',
    }, {
        // 容器的id
        containerId: 'chart2_1',
    }, {
        // 容器的id
        containerId: 'chart2_2',
    }, {
        // 容器的id
        containerId: 'chart2_3',
    }, {
        // 容器的id
        containerId: 'chart3_1',
    }, {
        // 容器的id
        containerId: 'chart3_2',
    }, {
        // 容器的id
        containerId: 'window_chart1',
    }];

    return ret;
})();

$(function () {
    tp.init();

    //弹出框配置
    mywin.config({
        //width: 1250,
        //height: 650,
        selector: '#window_s',
        windowId: 'window_s'
    })
    mywin.init();

    tp.bindDrawMethod(function () {
        draw();
    })

    //样式
    $('th').css('border', 'solid 0px lightgrey');
    $('td').css('border', 'solid 0px lightgrey');
    $('th').css('font-size', '16px');
    //$('th').css('color', '#0066CC');
    //$('th').css('text-decoration', 'underline');
    $('.nohover').css('color', 'black');
    //$('.nohover').css('text-decoration', 'none');
    $('.with_right_border').css('border-right', 'solid 1px lightgrey');
    $('#summary_area').css('text-decoration', 'underline');
    $('#summary_area').css('cursor', 'pointer');

    $('#table_consumption th').css('text-align', 'center');
    $('#table_consumption td').css('text-align', 'center');
    $('#table_consumption th').css('border', 'solid 1px lightgrey');
    $('#table_consumption td').css('border', 'solid 1px lightgrey');
    $('.table_click_1').css('cursor', 'pointer');
    $('.table_click_1').css('text-decoration', 'underline');
    $('.table_click_2').css('cursor', 'pointer');
    $('.table_click_2').css('text-decoration', 'underline');
    $('.table_click_3').css('cursor', 'pointer');
    $('.table_click_3').css('text-decoration', 'underline');

    $('.show_table').css('text-decoration', 'underline');
    $('.show_table').css('color', '#0066CC');

    //hover事件
    $('.show_table').hover(
        function () {
            $(this).css('cursor', "pointer");
            $(this).css('color', "violet");
        },
        function () {
            $(this).css('color', "#0066CC");
        }
    );
    //$('.nohover').unbind('mouseenter').unbind('mouseleave');

    //点击事件 出现弹出框
    $('#summary_area').click(function () {
        $('#window_s .window-title h3').eq(0).html('智能决策参考信息');
        $('#window_chart1').hide();
        $('#for_table').hide();
        $('#window_summary').show();
        $('#window_summary').html($('#summary_area').html());
        mywin.open();
    });
    $('.show_table_1').click(function () {
        $('#window_s .window-title h3').eq(0).html('消耗量');
        $('#table_consumption').attr('name', 'show_table_1');
        $('#window_chart1').hide();
        $('#window_summary').hide();
        $('#for_table').show();
        mywin.open();
    });
    $('.show_table_2').click(function () {
        $('#window_s .window-title h3').eq(0).html('节约量');
        $('#table_consumption').attr('name', 'show_table_2');
        $('#window_chart1').hide();
        $('#window_summary').hide();
        $('#for_table').show();
        mywin.open();
    });
    $('.show_table_3').click(function () {
        $('#window_s .window-title h3').eq(0).html('考核指标');
        $('#table_consumption').attr('name', 'show_table_3');
        $('#window_chart1').hide();
        $('#window_summary').hide();
        $('#for_table').show();
        mywin.open();
    });
    $('.show_table_4').click(function () {
        $('#window_s .window-title h3').eq(0).html('冶炼单耗');
        $('#table_consumption').attr('name', 'show_table_4');
        $('#window_chart1').hide();
        $('#window_summary').hide();
        $('#for_table').show();
        mywin.open();
    });

    $('.table_click_1').click(function () {
        //var temp_name = $('#table_consumption').attr('name');
        window.location.href = '/develop/reports/targetanalyze/targetmonth/targetmonth.html';
    });
    $('.table_click_2').click(function () {
        //var temp_name = $('#table_consumption').attr('name');
        window.location.href = '/develop/reports/targetanalyze/targetdetail/targetdetail.html';
    });
    $('.table_click_3').click(function () {
        //var temp_name = $('#table_consumption').attr('name');
        window.location.href = '/develop/reports/targetanalyze/factorytarget/factorytarget.html';
    });

    //$('th').click(function () {
    //    $('#window_summary').hide();
    //    $('#window_chart1').show();
    //    linechart.draw({ containerId: 'window_chart1' }, mock_data_overview.mock_line.Models[0]);
    //    mywin.open();
    //});
    //$('.noclick').unbind('click');

    //窗口关闭事件
    $(".opacity-div-for-modelwin").click(function () {
        mywin.close();
    });

    draw_table_consumption();

    draw();
})

//显示charts图
function show_charts() {
    $('#window_s .window-title h3').eq(0).html('趋势');
    $('#window_summary').hide();
    $('#for_table').hide();
    $('#window_chart1').show();
    linechart.draw({ containerId: 'window_chart1' }, mock_data_overview.mock_line.Models[0]);
    mywin.open();
}

function draw() {
    //if (tp.isReady() == false) {
    //    return;
    //}

    var type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();
    var day = dst.getCurrDay();

    //console.log(type, year, month, day);

    //获取id数据
    var temp_ids = '';
    //for (var i in cvsList) {
    //    temp_ids += ',' + cvsList[i].id;
    //}
    //temp_ids = temp_ids.substr(1);
    //console.log("temp_ids:");
    //console.log(temp_ids);

    //配置charts缩放比例 解决显示不全
    for (var i = 0; i < options.charts.length - 1; i++) {
        linechart.changeEchartsOption(options.charts[i], function (echartOption) {
            echartOption.grid.left = '20%';
        });
    }
    //绘图
    draw_main_data(type, year, month, day, temp_ids);
    draw_consumption_data(type, year, month, day, temp_ids);
    draw_saving_data(type, year, month, day, temp_ids);
    draw_index_data(type, year, month, day, temp_ids);
    draw_smelting_data(type, year, month, day, temp_ids);
}
function draw_table_consumption() {
    var table_consumption_data = mock_data_overview.table_consumption_data.Models;
    var i = 0;
    $('#table_consumption td').each(function () {
        $(this).html(table_consumption_data[i]);
        i++;
    });
    $('#table_consumption .table_percent').each(function () {
        if (Number($(this).html()) > 0) {
            $(this).css('color', 'red');
        }
        else {
            $(this).css('color', 'green');
        }
    });
    $('#for_table').append($('#table_consumption'));
}

//能耗总览 仪表盘绘图
function draw_main_data(type, year, month, day, temp_ids) {
    var main_data = null;
    if (type == 'month') {
        main_data = get_overview_main_data(temp_ids, year, month);
    }
    else if (type == 'year') {
        main_data = get_overview_main_data(temp_ids, year);
    }
    else {
        //console.log('error:get_overview_main_data');
    }
    if (main_data[0]) {
        //console.log("main_data:");
        //console.log(main_data);
        var main_data_gaugechart = main_data[0];
        //设置颜色
        for (var i = 0; i < 4; i++) {
            main_data_gaugechart[i].color1 = '#33CC33';
            main_data_gaugechart[i].color2 = '#FF0033';//'#FF0033';
            main_data_gaugechart[i].color3 = '#33CC33';
            main_data_gaugechart[i].color4 = '#33CC33';
            if (main_data_gaugechart[i].val > 0) {
                main_data_gaugechart[i].color3 = 'red';
                main_data_gaugechart[i].color4 = 'red';
            }
        }
        main_data_gaugechart[1].color1 = '#FF0033';//'#FF0033';
        main_data_gaugechart[1].color2 = '#33CC33';//'#33CC33';
        if (main_data_gaugechart[1].val <= 0) {
            main_data_gaugechart[1].color3 = 'red';
            main_data_gaugechart[1].color4 = 'red';
        }

        gaugechart.draw(options.charts[0], main_data_gaugechart[0]);
        gaugechart.click(options.charts[0], show_charts);
        gaugechart.draw(options.charts[1], main_data_gaugechart[1]);
        gaugechart.click(options.charts[1], show_charts);
        gaugechart.draw(options.charts[2], main_data_gaugechart[2]);
        gaugechart.click(options.charts[2], show_charts);
        gaugechart.draw(options.charts[3], main_data_gaugechart[3]);
        gaugechart.click(options.charts[3], show_charts);
    }
    if (main_data[1]) {
        //console.log("main_data[1]:");
        //console.log(main_data[1]);
        var table_main_data = main_data[1];
        var temp_num = 0;
        $('#table_main_data td').each(function () {
            $(this).html(table_main_data[temp_num]);
            temp_num++;
        });
    }
}

//消耗量 绘图
function draw_consumption_data(type, year, month, day, temp_ids) {
    var consumption_data = null;
    if (type == 'month') {
        consumption_data = get_overview_consumption_data(temp_ids, year, month);
    }
    else if (type == 'year') {
        consumption_data = get_overview_consumption_data(temp_ids, year);
    }
    else {
        //console.log('error:get_overview_consumption_data');
    }
    if (consumption_data) {
        //console.log("consumption_data[0]:");
        //console.log(consumption_data[0]);
        piechart.draw1(options.charts[4], consumption_data[0]);
        piechart.click(options.charts[4], show_charts);
    }
}

//节约量 绘图
function draw_saving_data(type, year, month, day, temp_ids) {
    var saving_data = null;
    if (type == 'month') {
        saving_data = get_overview_saving_data(temp_ids, year, month);
    }
    else if (type == 'year') {
        saving_data = get_overview_saving_data(temp_ids, year);
    }
    else {
        //console.log('error:get_line_data_by_xx()');
    }
    if (saving_data) {
        //console.log("saving_data:");
        //console.log(saving_data);
        linechart.draw(options.charts[5], saving_data[0]);
        linechart.click(options.charts[5], show_charts);
        linechart.draw(options.charts[6], saving_data[1]);
        linechart.click(options.charts[6], show_charts);
    }
}

//考核指标 绘图
function draw_index_data(type, year, month, day, temp_ids) {
    var index_data = null;
    if (type == 'month') {
        index_data = get_overview_index_data(temp_ids, year, month);
    }
    else if (type == 'year') {
        index_data = get_overview_index_data(temp_ids, year);
    }
    else {
        //console.log('error:get_line_data_by_xx()');
    }
    if (index_data) {
        //console.log("index_data:");
        //console.log(index_data);
        linechart.draw(options.charts[7], index_data[0]);
        linechart.click(options.charts[7], show_charts);
    }
}

//冶炼单耗 绘图
function draw_smelting_data(type, year, month, day, temp_ids) {
    var smelting_data = null;
    if (type == 'month') {
        smelting_data = get_overview_smelting_data(temp_ids, year, month);
    }
    else if (type == 'year') {
        smelting_data = get_overview_smelting_data(temp_ids, year);
    }
    else {
        //console.log('error:get_line_data_by_xx()');
    }
    if (smelting_data) {
        //console.log("smelting_data:");
        //console.log(smelting_data);
        linechart.draw(options.charts[8], smelting_data[0]);
        linechart.click(options.charts[8], show_charts);
    }
}

//按月查询
function get_overview_main_data(ids, year, month) {
    var temp_data = [];
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data.push(mock_data_overview.main_data_gaugechart.Models);
            temp_data.push(mock_data_overview.table_main_data.Models);
        }
    });
    return temp_data;
}

//按年查询
function get_overview_main_data(ids, year) {
    var temp_data = [];
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByYear',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data.push(mock_data_overview.main_data_gaugechart.Models);
            temp_data.push(mock_data_overview.table_main_data.Models);
        }
    });
    return temp_data;
}

//按月查询
function get_overview_consumption_data(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.consumption_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按年查询
function get_overview_consumption_data(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByYear',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.consumption_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按月查询
function get_overview_saving_data(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.saving_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按年查询
function get_overview_saving_data(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByYear',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.saving_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按月查询
function get_overview_index_data(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.index_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按年查询
function get_overview_index_data(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByYear',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.index_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按月查询
function get_overview_smelting_data(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.smelting_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}

//按年查询
function get_overview_smelting_data(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonMultiUnit/GetChartDataByYear',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            //if (!data.Models || !data.Models.length) {
            //    return;
            //}
            //else {
            //    return data.Models; //如果查询成功 则返回Models
            //}
            temp_data = mock_data_overview.smelting_data.Models; //如果查询成功 则返回Models
        }
    });
    return temp_data;
}