//今年柱状图假数据
var DATA1 = {
    Models: [
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 13, Report_DateDescription: "1月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 16, Report_DateDescription: "2月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 114, Report_DateDescription: "3月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 125, Report_DateDescription: "4月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 61, Report_DateDescription: "5月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 124, Report_DateDescription: "6月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 15, Report_DateDescription: "7月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "8月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "9月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "10月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "11月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 250, Report_DateDescription: "12月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
    ]
}
//当月（柱）
var DATA1m = {
    Models: [
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 13, Report_DateDescription: "1日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 16, Report_DateDescription: "2日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 114, Report_DateDescription: "3日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 125, Report_DateDescription: "4日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 61, Report_DateDescription: "5日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 124, Report_DateDescription: "6日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 15, Report_DateDescription: "7日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "8日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "9日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "10日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "11日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 250, Report_DateDescription: "12日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
    ]
}
//当天(柱)
var DATA1d = {
    Models: [
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 13, Report_DateDescription: "1小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 16, Report_DateDescription: "2小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 114, Report_DateDescription: "3小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 125, Report_DateDescription: "4小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 61, Report_DateDescription: "5小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 124, Report_DateDescription: "6小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 15, Report_DateDescription: "7小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "8小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "9小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "10小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 150, Report_DateDescription: "11小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 250, Report_DateDescription: "12小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
    ]
}









//去年假数据(折线)年
var DATA2 = {
    Models: [
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 3, Report_DateDescription: "1月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 6, Report_DateDescription: "2月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 14, Report_DateDescription: "3月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 25, Report_DateDescription: "4月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 61, Report_DateDescription: "5月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 24, Report_DateDescription: "6月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 15, Report_DateDescription: "7月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "8月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "9月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "10月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "11月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "12月",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
    ]
}

//去年折线月
var DATA2m = {
    Models: [
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 3, Report_DateDescription: "1日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 6, Report_DateDescription: "2日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 14, Report_DateDescription: "3日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 25, Report_DateDescription: "4日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 61, Report_DateDescription: "5日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 24, Report_DateDescription: "6日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 15, Report_DateDescription: "7日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "8日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "9日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "10日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "11日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "12日",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
    ]
}


//去年折现天
var DATA2d = {
    Models: [
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 3, Report_DateDescription: "1小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 6, Report_DateDescription: "2小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 14, Report_DateDescription: "3小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 25, Report_DateDescription: "4小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 61, Report_DateDescription: "5小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 24, Report_DateDescription: "6小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 15, Report_DateDescription: "7小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "8小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "9小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "10小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "11小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
        {
            ModelBase_ID: 1111111111111, ModelBase_Name: "贵溪冶炼厂", Report_ComputeValue: 50, Report_DateDescription: "12小时",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        },
    ]
}
//饼图点击事件的饼图假数据(工序级)
var DATA3 = {
    Models: [
        {
            ModelBase_Name: "工序1", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序2", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序3", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序4", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序5", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序6", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序7", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序8", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序9", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序10", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序11", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序12", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序13", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序14", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序15", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }
    ]
}
var DATA31 = {
    Models: [
        {
            ModelBase_Name: "工序1", Report_ComputeValue: 300000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序2", Report_ComputeValue: 150000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序3", Report_ComputeValue: 610000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序4", Report_ComputeValue: 550000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_Name: "工序5", Report_ComputeValue: 120000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }
    ]
}
//柱点击事件的饼假数据(车间级)
var DATA4 = {
    Models: [
        {
            ModelBase_ID: 21111111111111, ModelBase_Name: "车间1", Report_ComputeValue: 113, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111112, ModelBase_Name: "车间2", Report_ComputeValue: 116, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111113, ModelBase_Name: "车间3", Report_ComputeValue: 114, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111114, ModelBase_Name: "车间4", Report_ComputeValue: 125, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111115, ModelBase_Name: "车间5", Report_ComputeValue: 161, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111116, ModelBase_Name: "车间6", Report_ComputeValue: 124, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111117, ModelBase_Name: "车间7", Report_ComputeValue: 115, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111118, ModelBase_Name: "车间8", Report_ComputeValue: 150, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 250, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }
    ]
}

//折线图的标准线数据（仅一条）
var DATA5 = {
    Models: [
        {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2500000, Report_DateDescription: "11",
            Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
        }
    ]
}

//实验折线数据段
var DATA6 = {
    Models: [
          {
              ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2500000, Report_DateDescription: "11",
              Report_DateTime: "2015-11-29T07:30:00", Report_StartTime: "2015-10-29T07:30:00"
          },
        {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2230000, Report_DateDescription: "1月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2092000, Report_DateDescription: "2月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 1300000, Report_DateDescription: "3月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 1700000, Report_DateDescription: "4月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 3600000, Report_DateDescription: "5月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 1400000, Report_DateDescription: "6月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 500000, Report_DateDescription: "7月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2500000, Report_DateDescription: "8月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2460000, Report_DateDescription: "9月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2500000, Report_DateDescription: "10月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 4566000, Report_DateDescription: "11月",
        }, {
            ModelBase_ID: 21111111111119, ModelBase_Name: "损耗", Report_ComputeValue: 2500000, Report_DateDescription: "12月",
        }
    ]
}



var DATA7 = {
    Models: [
          {
              BaseLine: 7000002, Name: "损耗", Value: 2501200, Time: "111",
          },
          {
              BaseLine: 3000000, Name: "损耗", Value: 2350000, Time: "112",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 1400000, Time: "113",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 5300000, Time: "114",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 3500000, Time: "115",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 2500000, Time: "116",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 2500000, Time: "117",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 5300000, Time: "118",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 3500000, Time: "119",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 5500000, Time: "1110",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 2500000, Time: "1111",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 6700000, Time: "1112",
          }, {
              BaseLine: 3000000, Name: "损耗", Value: 2500000, Time: "1113",
          },
    ]
}

var DATAN = {Models:[]}



var DATAX = { Models: [{ContextText:'一堆描述'}] }




















