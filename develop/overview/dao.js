/*数据源模块*/

define(function (require) {
    var $ = require('jquery');
    var ret = {};

    var flowList = [{
        id: 1,
        name: '熔炼车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 2,
        name: '电解车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 3,
        name: '计控车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 4,
        name: '计控车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 5,
        name: '熔炼车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 6,
        name: '电解车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 7,
        name: '计控车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }, {
        id: 8,
        name: '计控车间',
        f: 23452.2,
        day: 76375.2,
        month: 53441.2,
        year: 9983.0,
        sub: 7825.3
    }];

    var rankList = [{
        id: 1,
        name: '备料车间',
        value: 1234.23,
        sort: 1
    }, {
        id: 2,
        name: '电解车间',
        value: 2234.23,
        sort: 2
    }, {
        id: 3,
        name: '动力车间',
        value: 3234.23,
        sort: 3
    }, {
        id: 4,
        name: '熔炼车间',
        value: 4234.23,
        sort: 4
    }, {
        id: 5,
        name: '硫酸车间',
        value: 5234.23,
        sort: 5
    }];

    var costData = {
        series: [{
            data: [{
                name: '备料车间',
                value: 2435
            }, {
                name: '电解车间',
                value: 1435
            }, {
                name: '动力车间',
                value: 2735
            }, {
                name: '硫酸车间',
                value: 3435
            }, {
                name: '熔炼车间',
                value: 6435
            }]
        }]
    };

    var predictData = {
        xAxis: ['1月', '2月', '3月', '4月', '5月'],
        series: [{
            name: "XX",
            data: [23, 34, 21, 45, 34]
        }, {
            name: "XXX",
            data: [17, 24, 19, 35, 29]
        }]
    };

    var indexData = {
        xAxis: ['阴极铜综合电单耗(Kwh/t)', '阳极铜电单耗(Kwh/t)', '铜冶炼综合能耗(kgce/t)', '阴极铜电单耗(Kwh/t)', '硫酸电单耗(Kwh/t)'],
        series: [{
            name: "实际",
            data: [800, 1100, 800, 1100, 1000]
        }, {
            name: "指标",
            data: [1000, 1000, 1000, 1000, 1000]
        }]
    }

	//获取最新流向图元素
    ret.queryGraphStruct = function (condition, callback) {
    	$.ajax({
    		type: 'get',
    		dataType: 'json',
    		url: '/api/OverView/GetGraphStruct',
    		data: condition,
    		success: function (data) {
    		    if (!data.Models || data.Models.length < 1) {
    		        return;
    		    }

    			if (typeof callback === 'function') {
    				callback(data.Models);
    			}
    		}
    	})
    };

	//获取最新流向图元素数据
    ret.queryGraphData = function (condition, callback) {
    	$.ajax({
    		type: 'get',
    		dataType: 'json',
    		url: '/api/OverView/GetGraphData',
    		data: condition,
    		success: function (data) {
    		    if (!data.Models || data.Models.length < 1) {
    		        callback(data.Models);
    		        //return;
    		    }

    			if (typeof callback === 'function') {
    				callback(data.Models);
    			}
    		}
    	})
    };

	//获取流向图介质
    ret.queryGraphEle = function (condition, callback) {
    	$.ajax({
    		type: 'get',
    		dataType: 'json',
    		url: '/api/ReportConfig/GetOverViewGraph2',
    		data: condition,
    		success: function (data) {
    			if (!data.Models || data.Models.length < 1) return;

    			if (typeof callback === 'function') {
    				callback(data.Models);
    			}
    		}
    	})
    };

    //获取天然气流向图元素
    ret.queryFlowListGas = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetGasGraphStruct',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //获取天然气流向图数据
    ret.queryFlowDataGas = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetGasGraphData',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //获取电流向图元素
    ret.queryFlowListEle = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetPowerGraphStruct',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //获取电流向图数据
    ret.queryFlowDataEle = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetPowerGraphData',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //获取总消耗数据
    ret.queryConsumeData = function (callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetSumConsume',
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    }

    //获取成本数据
    ret.queryCostData = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetCosting',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    }

    ret.queryRankList = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetConsumeRank',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    ret.queryRankEcharts = function (condition, callback) {
        var result = {
            xAxisId: [],
            xAxis: [],
            series: [{
                name: "",
                data: []
            }]
        };

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetConsumeRank',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                for (var i = data.Models.length - 1; i >= 0; i--) {
                    var item = data.Models[i];
                    result.xAxis.push(item.Name);
                    result.series[0].data.push(parseFloat(item.Value).toFixed(1));
                }

                if (typeof callback === 'function') {
                    callback(result);
                }
            }
        })
    };

    //获取推送信息
    ret.queryMessage = function (callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/MessagePush/GetNewMessage',
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //获取推送信息
    ret.queryBalance = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetEnergyBalanceByCycle',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //ret.queryPredictData = function (condition, callback) {
    //	return predictData;
    //};
    ret.queryPredictList = function (condition, callback) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetForecastByCycle',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                if (typeof callback === 'function') {
                    callback(data.Models);
                }
            }
        })
    };

    //获取指标数据
    ret.queryIndexData = function (condition, callback) {
        var result = {
            xAxisId: [],
            xAxis: [],
            series: [{
                name: "实际",
                data: []
            }, {
                name: "指标",
                data: []
            }]
        };
        //return indexData;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/api/OverView/GetEnergyKPIByCycle',
            data: condition,
            success: function (data) {
                if (!data.Models || data.Models.length < 1) return;

                for (var i = 0; i < data.Models.length; i++) {
                    if (i > 4) break;

                    var item = data.Models[i];
                    result.xAxis.push(item.MeasurePropertyName);
                    result.xAxisId.push(item.MeasurePropertyID);
                    result.series[0].data.push(parseFloat(item.ReportComputeValue).toFixed(1));
                    result.series[1].data.push(parseFloat(item.SUBEFFICACIOUSVALUE).toFixed(1));
                }

                if (typeof callback === 'function') {
                    callback(result);
                }
            }
        })
    }

    return ret;
})