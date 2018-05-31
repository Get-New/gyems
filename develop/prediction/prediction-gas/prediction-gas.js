var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = true;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 1;

    // 默认时间类型（可选year、month、day）
    ret.defaultDateType = 'year';

    // 图表(可能有多个)
    ret.charts = [{
        // 容器的id
        containerId: 'chart1',
    }];

    return ret;
})();

$(function () {
    dst.config({
        startYear: 2016,
        startMonth: 5,
        startDay: 1,
        endYear: 2036,
        endMonth: 12,
        endDay: 31
    });

    tp.init();

    tp.bindDrawMethod(function () {
        draw();
    })

    //tp.bindCvsData(demoHelper.cvs());
    draw();
})

function draw() {
    //if (tp.isReady() == false)
    //    return;

    var type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();

    var data = get_line_data(type, year, month);

    linechart.draw(options.charts[0], data);
}

function get_line_data(type, year, month) {
    var temp_line_data = null;
    if (type == 'month') {
        $('.table-container th').eq(0).html('当月预测值');
        $('.table-container th').eq(1).html('当月实际值');
        $('.table-container').hide();
        $('.table-container td').eq(0).html('5120');
        $('.table-container td').eq(1).html('4960');
        $('.table-container td').eq(2).html('-3.1');
        $('.table-container td').eq(2).css('background-color', 'lightgreen');
        $('.table-container').show();
        temp_line_data = get_line_data_by_day(year, month);
    }
    else if (type == 'year') {
        $('.table-container').hide();
        $('.table-container th').eq(0).html('当年预测值');
        $('.table-container th').eq(1).html('当年实际值');
        if (year == '2016') {
            $('.table-container td').eq(0).html('16920000');
            $('.table-container td').eq(1).html('16298080');
            $('.table-container td').eq(2).html('-3.7');
            $('.table-container td').eq(2).css('background-color', 'white');
            if (Number($('.table-container td').eq(2).html()) <= 0) {
                $('.table-container td').eq(2).css('background-color', 'lightgreen');
            }
            $('.table-container').show();
        }
        else if (year == '2017') {
            $('.table-container td').eq(0).html('15690000');
            $('.table-container td').eq(1).html('');
            $('.table-container td').eq(2).html('');
            $('.table-container td').eq(2).css('background-color', 'white');
            $('.table-container').show();
        }
        else {
            $('.table-container td').eq(0).html('15190000');
            $('.table-container td').eq(1).html('');
            $('.table-container td').eq(2).html('');
            $('.table-container td').eq(2).css('background-color', 'white');
            $('.table-container').show();
        }
        temp_line_data = get_line_data_by_month(year);
    }
    else if (type == 'history') {
        $('.table-container').hide();
        temp_line_data = get_line_data_by_year();
    }
    return temp_line_data;
}

function get_line_data_by_day(year, month) {
    return get_mock_data_prediction.gas.by_day(year, month);
}

function get_line_data_by_month(year) {
    return get_mock_data_prediction.gas.by_month(year);
}

function get_line_data_by_year() {
    return get_mock_data_prediction.gas.by_year();
}