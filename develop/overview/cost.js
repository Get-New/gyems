/*成本*/

define(function (require) {
    var $ = require('jquery');
    var dao = require("dao");

    var ret = {
        detailHandler: null		//详细按钮点击事件
    };

    function getCostCondition() {
        return {
            Cycle: $('.right-panel-top .cycle-button').filter('.active').attr('condition'),
            Type: $('.right-panel-top .type-button').filter('.active').attr('condition')
        }
    }

    function drawCostCharts(data) {
        var costCharts = echarts.init(document.getElementById('cost-chart'));

        var option = {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}元 ({d}%)"
            },
            series: [
				{
				    type: 'pie',
				    data: data,
				    itemStyle: {
				        normal: {
				            label: {
				                show: true,
				                textStyle: {
				                    fontSize: '10'
				                }
				            },
				            labelLine: {
				                show: true,
				                length: 3
				            }
				        },
				        emphasis: {
				            shadowBlur: 10,
				            shadowOffsetX: 0,
				            shadowColor: 'rgba(0, 0, 0, 0.5)'
				        }
				    }
				}
            ]
        };

        costCharts.clear();
        costCharts.setOption(option);
    }

    function addEventHandler() {
        $('.right-panel-top a').click(function () {
            var type = $('.right-panel-top .type-button').filter('.active').attr('condition');
            if (typeof ret.detailHandler == 'function') {
                ret.detailHandler(type);
            }
        })
    }

    ret.init = function () {
        addEventHandler()
        dao.queryCostData(getCostCondition(), drawCostCharts);
    }

    ret.condition = function () {
        return getCostCondition();
    }

    ret.detailClick = function (func) {
        this.detailHandler = func;
    };

    return ret;
})