var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = false;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 0;

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
        draw(function () {
        });
    });

    while (!tp.isReady()) {
    }

    draw();

    //showBack();
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
    $("#chart1").css('display', 'none');

    if (tp.isReady() == false) {
        return;
    }

    var type = dst.getCurrType(); //存放周期类型
    var year = dst.getCurrYear() || 0;
    var month = dst.getCurrMonth() || 0;
    var day = dst.getCurrDay() || 0;

    data = null;

    if (type == 'day') {
        data = get_consume_detail('Day', year, month, day);
    }
    else if (type == 'month') {
        data = get_consume_detail('Month', year, month, day);
    }
    else if (type == 'year') {
        data = get_consume_detail('Year', year, month, day);
    }
    else {
        return;
    }

    if (!data) {
        data = null;
        //data = tmp_mock_data;
        //Util.alert('查询结果为空');
        return;
    }

    //创建表格
    if (data[0]) {
        create_table(data[0]);
    }

    //画饼图
    if (data[1]) {
        draw_pie(data[1]);
    }
}

//查询数据
function get_consume_detail(Cycle, Year, Month, Day) {
    var temp_data = null;
    $.ajax({
        url: '/api/OverView/GetConsumeDetail',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { Cycle: Cycle, Year: Year, Month: Month, Day: Day },
        success: function (data) {
            if (data.Errors) {
                Util.alert('查询失败：' + data.Errors.Message);
                return;
            }
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//创建表格
function create_table(tableData) {
    $('#table_container table').empty();

    if (!tableData.Rows) {
        return;
    }

    var head = [];

    var tmpHeadFirst = $("<tr></tr>");
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>序号</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>能源种类</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>消耗量</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>折标系数</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>折标煤后（tce）</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>占比</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>备注</th>"));

    var tmpHeadLast = $("<tr></tr>");
    tmpHeadLast.append($("<th rowspan='1' colspan='4'>合计</th>"));
    tmpHeadLast.append($("<td rowspan='1' colspan='1'></td>"));
    tmpHeadLast.append($("<td rowspan='1' colspan='1'></td>"));
    tmpHeadLast.append($("<td rowspan='1' colspan='1'></td>"));

    head.push(tmpHeadFirst);
    var tmpTableCount = 1;
    while (tmpTableCount <= tableData.Rows) {
        var tmpHeadCommon = $("<tr></tr>");
        for (var i = 0; i < 7; i++) {
            tmpHeadCommon.append($("<td rowspan='1' colspan='1'></td>"));
        }
        head.push(tmpHeadCommon)
        tmpTableCount++;
    }
    head.push(tmpHeadLast);

    $('#table_container table').append(head);

    $('tr').css('height', '0.28rem');
    $('th').css('line-height', '0.28rem');
    $('td').css('line-height', '0.28rem');

    if (tableData.Data) {
        var dataCount = 0;
        $("td").each(function () {
            $(this).html(tableData.Data[dataCount++]);
        })
    }
}

//画饼图
function draw_pie(pieData) {
    var myChart = echarts.init(document.getElementById('chart1'));

    if (!pieData.PieName || !pieData.PieValue) {
        return;
    }

    var legend_data = pieData.PieName;
    var series_data = [];
    var nameCount = pieData.PieName.length;
    for (var i = 0; i < nameCount; i++) {
        var series_data_element = { name: '', value: 0 };
        series_data_element.name = pieData.PieName[i];
        series_data_element.value = pieData.PieValue[i];
        series_data.push(series_data_element);
    }

    var pie_option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            data: legend_data
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: series_data,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b} {d}%'
                        },
                        labelLine: { show: true }
                    }
                }
            }
        ]
    };

    myChart.setOption(pie_option);

    $("#chart1").css('display', 'block');
}

var tmp_mock_data = [
    {
        Rows: 2,
        Data: ['1', '电力（kWh）', '8000', '0.6', '4800', '76.19%', '外购能源',
            '2', '天然气（m3）', '1000', '1.5', '1500', '23.81%', '外购能源',
            '6300', '100%', '外购能源'
        ]
    },
    {
        PieName: ['电力', '天然气'],
        PieValue: [4800, 1500]
    }
];