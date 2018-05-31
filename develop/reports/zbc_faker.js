
//电力成本的单元名称返回数据
var DATA1 = {
    Models: [
        { EngeryMeasurepropertyName: '1#动力中心' },
        { EngeryMeasurepropertyName: '2#动力中心' },
        { EngeryMeasurepropertyName: '1#总降压' },
        { EngeryMeasurepropertyName: '2#总降压' },
        { EngeryMeasurepropertyName: '动力合计' },
        { EngeryMeasurepropertyName: '锅炉房' },
        { EngeryMeasurepropertyName: '供热合计' },
        { EngeryMeasurepropertyName: '制氧工段' },
        { EngeryMeasurepropertyName: '制氧区合计' },
        { EngeryMeasurepropertyName: '原水工段' },
        { EngeryMeasurepropertyName: '净化工段' },
        { EngeryMeasurepropertyName: '供水区合计' },
        { EngeryMeasurepropertyName: '车间总计' }
 
    ]
};

//点击一个单元返回n条数据以画图
var DATA1_2 = {
    Models: [
        { LineName: '实际电费', LineData: [650642, 620642, 610642, 650642, 610642, 630642, 645642, 620642, 640642, 637642, 630842, 650002, ] },
        { LineName: '计划电费', LineData: [704345, 714345, 707345, 720645, 713345, 730345, 725145, 736445, 734345, 726646, 708875, 736739,  ] },
        { LineName: '同比', LineData: [20, 30, 16, 15, 22, 31, 24, 20, 30, 29, 24, 19, ] },
        { LineName: '环比', LineData: [30, 35, 31, 25, 26, 38, 27, 31, 26, 26, 25, 31, ] }
    ]
}
//***************************************************************************************************

var DATA2 = {
    Models: [
        { KpiReportName: '1#动力中心电单耗', KpiReportID: 1, UnitName: 'kWh/t阳极铜' },
        { KpiReportName: '2#动力中心电单耗', KpiReportID: 2, UnitName: 'kWh/t阳极铜' },
        { KpiReportName: '制氧工段电单耗', KpiReportID: 3, UnitName: 'kWh/Nm3' },
        { KpiReportName: '1#总降能耗指标', KpiReportID: 4, UnitName: 'kWh/t阳极铜' },
        { KpiReportName: '1#总降功率因数', KpiReportID: 5, UnitName: '' },
        { KpiReportName: '1#总降配损率', KpiReportID: 6, UnitName: '%' },
        { KpiReportName: '2#总降能耗指标', KpiReportID: 7, UnitName: 'kWh/t阳极铜' },
        { KpiReportName: '2#总降功率因数', KpiReportID: 8, UnitName: '' },
        { KpiReportName: '2#总降配损率', KpiReportID: 9, UnitName: '%' },
        { KpiReportName: '供水区域电单耗', KpiReportID: 10, UnitName: 'kWh/t阳极铜' },
        { KpiReportName: '吨铜水单耗', KpiReportID: 11, UnitName: 'm3/t阳极铜' },
        { KpiReportName: '天然气单耗', KpiReportID: 12, UnitName: 'Nm3/t汽' }

    ]
}


var DATA2_1 = {
    Models: [
        {
            LineName: '实际值', LineData: [750742, 720742, 710742, 750742, 710742, 730742, 745742, 720742, 740742, 737742, 730842, 750002, ], HistoryYear: 950000, HistoryMonth: 700002
        },
        {
            LineName: '考核值', LineData: [804345, 804345, 804345, 804345, 804345, 804345, 804345, 804345, 804345, 804345, 804345, 804345, ], HistoryYear: 950000, HistoryMonth: 700002
        },
         { LineName: '同比', LineData: [20, 30, 16, 15, 22, 31, 24, 20, 30, 29, 24, 19, ], HistoryYear: 1750002, HistoryMonth: 700002 },
         { LineName: '环比', LineData: [30, 35, 31, 25, 26, 38, 27, 31, 26, 26, 25, 31, ], HistoryYear: 1750002, HistoryMonth: 700002 },
         //{ LineName: '历史最好值（年值）', LineData: 1700842 },
         //{ LineName: '历史最好值（月值）', LineData: 700842 },
    ]
}

//制氧工段电单耗专用数据
var DATA2_2 = {
    Models: [
        {
            LineName: '实际值', LineData: [750742, 720742, 710742, 750742, 710742, 730742, 745742, 720742, 740742, 737742, 730842, 750002, ], HistoryYear: 950000, HistoryMonth: 700002
        },
        {
            LineName: '考核值', LineData: [754345, 754345, 704345, 704345, 704345, 804345, 804345, 804345, 804345, 804345, 704345, 754345, ], HistoryYear: 950000, HistoryMonth: 700002
        },
         { LineName: '同比', LineData: [20, 30, 16, 15, 22, 31, 24, 20, 30, 29, 24, 19, ], HistoryYear: 1750002, HistoryMonth: 700002 },
         { LineName: '环比', LineData: [30, 35, 31, 25, 26, 38, 27, 31, 26, 26, 25, 31, ], HistoryYear: 1750002, HistoryMonth: 700002 }
    ]
}

var DATA_L = {
    Models: [
        ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        ["实际值", "柱形", null, "主坐标", null, 0, 100000, 34534, 34890, 34435, 35345, 34554, 66587, 79899, 75654, 34534, null, null, null],
        ["累计值1", "堆积", "分组1", "主坐标", "T", 0, 1000000, 34534, 3489, 34435, 35345, 34554, 665877, 79899, 75654, 345345, null, null, null],
	    ["累计值2", "堆积", "分组1", "主坐标", "T", 0, 1000000, 34534, 3489, 34435, 35345, 34554, 665877, 79899, 75654, 345345, null, null, null],

        ["计划值", "折线", "实线", "主坐标", 'T',0, 100000, 34534, 34890, 34435, 35345, 34554, 66587, 79899, 75654, 34534, null, null, null],
        ["同比", "折线", "虚线", "副坐标", null, -100, 150, 34, 34, 78, null, null, 42, 13, 65, 21, null, null, null],
        ["环比", "折线", "虚线", "副坐标", null,-100, 150, 34, 34, 78, 23, 13, 42, 13, 65, 21, null, null, null],
        ["标准", "直角线", "虚线", "主坐标", null, 0, 100000, 39435, 39435, 39435, 46587, 46587, 46587, 39899, 39899, 39899, 39899, 39899, 39899],
        ["历史最好(年值)","水平线","虚线","主坐标",null,null,null,64534]
    
    ]
}


var DATA_L1 = {
    Models: [
        ["计划产量", "实际产量/待生产产量"],
	    ["实际产量", "横向堆积", "实际产量/待生产产量", "主坐标", "T", 0, 1000000, null,34534],
        ["待生产产量", "横向堆积", "实际产量/待生产产量", "主坐标", "T", 0, 1000000, null,34534],
        ["计划产量", "横向堆积", "计划产量", "主坐标", "T", 0, 1000000, 34534,null],
    ]
}

















