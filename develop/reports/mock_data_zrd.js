//获取月天数
function get_month_day_api(year, month) {
    var temp_days = null;
    $.ajax({
        url: '/api/PowerRoomReport/GetDownMonthDay',
        method: 'get',
        dataType: 'json',
        async: false,
        data: {
            year: year, month: month
        },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            temp_days = data.Models;
        }
    });
    return temp_days;
}

var Electrolysis_Sections_EngeryMeasurepropertyName = {
    Models: [
        { EngeryMeasurepropertyName: '车间总', EngeryMeasurepropertyID: 1, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '一系统总', EngeryMeasurepropertyID: 2, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '二系统总', EngeryMeasurepropertyID: 3, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '一系列总', EngeryMeasurepropertyID: 4, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '一系统净液总', EngeryMeasurepropertyID: 5, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '二系列总', EngeryMeasurepropertyID: 6, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '三系列总', EngeryMeasurepropertyID: 7, UnitName: 'kwh/t' },
        { EngeryMeasurepropertyName: '二系统净液总', EngeryMeasurepropertyID: 8, UnitName: 'kwh/t' }
    ]
}

var Electrolysis_Sections_Unit_Consumption = {
    Models: [
	    ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
	    //["电单耗", "柱形", null, "主坐标", "kwh/t", 0, 600, 365, 356, 352, 379, 335, 329, 351, 361, 360, 355, 339, 363],
	    ["电单耗", "折线", "实线", "主坐标", "kwh/t", 0, 600, 365, 356, 352, 379, 335, 329, 351, 361, 360, 355, 339, 363],
	    ["同比", "折线", "虚线", "副坐标", "%", -100, 200, -5, -4, -8, 7, -3, -6, -13, -10, 3, 5, 1, 5],
	    ["环比", "折线", "虚线", "副坐标", "%", -100, 200, -1.37, -2.46, -1.12, 7.67, -11.61, -1.79, 6.69, 2.85, -0.28, -1.39, -4.51, 7.08],
	    ["基准指标", "水平线", "虚线", "主坐标", "kwh/t", null, null, 375],
        ["基准指标", "水平线", "虚线", "副坐标", "%", null, null, 10]
    ]
}

var mock_data_overview = {
    mock_line: {
        Models: [
            {
                leftYTitle: '',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [217.35, 216.25, 207.00, 201.56, 212, 190, 216.25, 225.00, 201.56, 230, 190, 220],
                        name: '实际',
                        showLabel: true,
                        type: 'line'
                    },
                    {
                        data: [227.35, 206.25, 217.00, 211.56, 220, 195, 202.25, 223.00, 215.56, 220, 195, 233],
                        name: '同比',
                        showLabel: true,
                        type: 'line'
                    },
                ],
                xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ]
    },

    //能耗总览 柱状图数据
    main_data: {
        Models: [
            {
                leftYTitle: '折标煤:tce',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [18993],
                        name: '完成值',
                        showLabel: true,
                        type: 'bar'
                    },
                ],
                xAxis: ['总能耗量']
            },
            {
                leftYTitle: '折标煤:tce',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [-4894.62],
                        name: '完成值',
                        showLabel: true,
                        type: 'bar'
                    },
                ],
                xAxis: ['总节约量']
            },
            {
                leftYTitle: '单位:kgce/t',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [181.10],
                        name: '完成值',
                        showLabel: true,
                        type: 'bar'
                    },
                ],
                xAxis: ['铜冶炼综合能耗']
            },
            {
                leftYTitle: '单位:m3/t',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [13.84],
                        name: '完成值',
                        showLabel: true,
                        type: 'bar'
                    },
                ],
                xAxis: ['吨铜新水消耗']
            }
        ]
    },
    //能耗总览 仪表盘数据
    main_data_gaugechart: {
        Models: [
            {
                val: -15,
                percent: 'true',
                str: '同比'
            },
            {
                val: -5,
                percent: 'true',
                str: '同比'
            },
            {
                val: +8,
                percent: 'true',
                str: '同比'
            },
            {
                val: -19,
                percent: 'true',
                str: '同比'
            }
        ]
    },
    //能耗总览 数值数据
    table_main_data: {
        Models: ['18993 tce', '-4894.62 tce', '181.10 kgce/t', '13.84 m3/t']
    },
    //消耗量 表数值数据
    table_consumption_data: {
        Models: [
            18993, -20.16, -6.90, 207916, -5.65,
            11679, 13.07, -2.67, 120128, -3.67,
            2012.87, +14.37, -25.07, 21133, -22.56,
            //220.63, -72.76, -69.30, 2130, -72.36,
            298.98, -23.44, -52.65, 3156, -49.72,
            2.26, -86.08, -39.91, 29.15, -42.33,
            159.37, -94.77, -96.34, 623.14, -98.11,
            4619.79, +6.73, null, 56300, null
        ]
    },
    //消耗量 饼图数据
    consumption_data: {
        Models: [
            {
                series: [
                    {
                        data: [{
                            name: '天然气',
                            showLabel: false,
                            value: 4619.79
                        },
                        {
                            name: '电力',
                            showLabel: false,
                            value: 11679
                        },
                        {
                            name: '重油',
                            showLabel: false,
                            value: 2012.87
                        },
                        //{
                        //    name: '液化气',
                        //    showLabel: false,
                        //    value: 220.63
                        //},
                        {
                            name: '柴油',
                            showLabel: false,
                            value: 298.98
                        },
                        {
                            name: '汽油',
                            showLabel: false,
                            value: 2.62
                        },
                        {
                            name: '煤',
                            showLabel: false,
                            value: 159.37
                        }]
                    }
                ],
                legendPosition: 'left'
            },
        ]
    },
    //节约量 柱状图数据
    saving_data: {
        Models: [
            {
                leftYTitle: '单位:10^4kwh',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [-4.72, +74.97, -131.91, +52.22],
                        name: '节约量',
                        showLabel: true,
                        type: 'bar'
                    }
                ],
                xAxis: ['电', '阳极铜', '阴极铜', '硫酸']
            },
            {
                leftYTitle: '单位:t',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [-5362.35, -438.74],//, -251.84],
                        name: '节约量',
                        showLabel: true,
                        type: 'bar'
                    }
                ],
                xAxis: ['煤', '重油']//, '液化气']
            }
        ]
    },
    //考核指标 柱状图数据
    index_data: {
        Models: [
            {
                leftYTitle: '单位:Nm3|kwh/t',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [541.67, 950, 580, 102],
                        name: '考核值',
                        showLabel: true,
                        type: 'bar'
                    },
                    {
                        data: [347.35, 886.25, 577.00, 101.56],
                        name: '完成值',
                        showLabel: true,
                        type: 'bar'
                    },
                ],
                xAxis: ['天然气', '阴极铜综合电单耗', '阳极铜电单耗', '硫酸电单耗']
            }
        ]
    },
    //冶炼单耗 柱状图数据
    smelting_data: {
        Models: [
            {
                leftYTitle: '折标煤:ktce/t',
                markLines: [{
                    name: '',
                    value: ''
                }],
                rightYTitle: '',
                series: [
                    {
                        data: [150, 190, 280, 90, 280],
                        name: '国标',
                        showLabel: true,
                        type: 'bar'
                    },
                    {
                        data: [100.62, 136.79, 175.90, 54.64, 181.10],
                        name: '完成值',
                        showLabel: true,
                        type: 'bar'
                    },
                ],
                xAxis: ['粗铜工艺', '粗铜工艺', '粗铜工艺', '粗铜工艺', '粗铜工艺', ]
            }
        ]
    }
}

var get_mock_data_prediction = {
    gas: {
        Models: {
            leftYTitle: '单位:Nm3',
            leftYMin: 0,
            markLines: [{
                name: '',
                value: ''
            }],
            rightYTitle: '',
            series: [
                {
                    data: [],
                    name: '预测值',
                    showLabel: false,
                    type: 'bar'
                },
                {
                    data: [],
                    name: '实际值',
                    showLabel: false,
                    type: 'bar'
                },
            ],
            xAxis: []
        },
        param_set: [1.25, 1.21, 1.15, 1.10, 1.08, 1.05, 1.03, 1.01, 1.06, 1.11, 1.16, 1.19],
        by_day: function (year, month) {
            var Models = get_mock_data_prediction.gas.Models;
            Models.series[0].data = [];
            Models.series[1].data = [];
            Models.xAxis = [];
            Models.series[0].showLabel = false;
            Models.series[1].showLabel = false;
            var param_set = get_mock_data_prediction.gas.param_set;
            var temp_days = get_month_day_api(year, month);
            var current_date = new Date();
            var current_year = current_date.getFullYear();
            var current_month = current_date.getMonth() + 1;
            var current_day = current_date.getDate();
            for (var i in temp_days) {
                var temp_random = parseInt((Math.random() / 4 + 4.0) * 100 * param_set[month - 1]) * 100;//预测值 随机数 参数倍率为param_set[]
                Models.series[0].data.push(temp_random);
                if ((year <= current_year) && (month < current_month)) {
                    var temp_random_r = parseInt(temp_random * (1 - Math.random() / 20));//实际值
                    Models.series[1].data.push(temp_random_r);
                }
                else if ((year <= current_year) && (current_month == month)) {
                    if (i <= 3) {
                        var temp_random_r = parseInt(temp_random * (1 - Math.random() / 20));//实际值
                        Models.series[1].data.push(temp_random_r);
                    }
                    if ((i > 3) && (temp_days[i].split('月')[1].split('日')[0] < current_day)) {
                        var temp_random_r = parseInt(temp_random * (1 - Math.random() / 20));//实际值
                        Models.series[1].data.push(temp_random_r);
                    }
                }
                var temp_day = temp_days[i].split('月')[1];
                Models.xAxis.push(temp_day);
            }
            return Models;
        },
        by_month: function (year) {
            var Models = get_mock_data_prediction.gas.Models;
            Models.series[0].data = [];
            Models.series[1].data = [];
            Models.xAxis = [];
            Models.series[0].showLabel = false;
            Models.series[1].showLabel = false;
            var param_set = get_mock_data_prediction.gas.param_set;
            var current_date = new Date();
            var current_year = current_date.getFullYear();
            var current_month = current_date.getMonth() + 1;
            var current_day = current_date.getDate();
            for (var i in param_set) {
                var temp_random = parseInt((Math.random() / 4 + 4.0) * 100) * 100 * 30;
                temp_random = parseInt(temp_random * param_set[i]);//预测值 参数倍率为param_set[]
                Models.series[0].data.push(temp_random);
                if (year <= current_year) {
                    //console.log(current_year, year);
                    if (year == '2016' && i == '11') {
                        var temp_random_r = parseInt(temp_random * (1 - Math.random() / 20) * (current_day - 1) / 31);//实际值
                        Models.series[1].data.push(temp_random_r);
                    }
                    else {
                        var temp_random_r = parseInt(temp_random * (1 - Math.random() / 20));//实际值
                        Models.series[1].data.push(temp_random_r);
                    }
                }
                var temp_month = Number(i) + 1;
                Models.xAxis.push(temp_month + '月');
            }
            return Models;
        },
        by_year: function () {
            var Models = get_mock_data_prediction.gas.Models;
            Models.series[0].data = [];
            Models.series[1].data = [];
            Models.xAxis = [];
            Models.series[0].showLabel = true;
            Models.series[1].showLabel = true;
            var temp_random = 47000 * 30 * 12;
            Models.series[0].data.push(temp_random);//预测值
            Models.series[0].data.push(parseInt(temp_random * 1.1));//预测值
            var temp_random_r = parseInt(temp_random * (1 - Math.random() / 20));//实际值
            Models.series[1].data.push(temp_random_r);
            Models.xAxis.push('2016年', '2017年');
            return Models;
        }
    }
}