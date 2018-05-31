/*排行*/

define(function (require) {
    var $ = require('jquery');
    var dao = require('dao');

    var eventHandlerAdded = false; //判断 详细按钮点击事件 是否已添加 防止事件被重复添加

    var ret = {
        detailHandler: null		//详细按钮点击事件
    };

    function getRankCondition() {
        return {
            Cycle: $('.left-panel-bottom .cycle-button').filter('.active').attr('condition'),
            Type: $('.left-panel-bottom .type-button').filter('.active').attr('condition')
        }
    };

    function drawRankList(data) {
        $(".rank_list li").remove();

        if (!data || data.length < 1) return;

        for (var i = 0; i < data.length; i++) {
            if (i > 4) break;

            var item = data[i];
            var li = $("<li></li>");
            var circle_img = $("<img id='rank_circle' src='/images2/rank_circle.png' />");
            var rank = $("<span class='rank'>" + (i + 1) + "</span>");
            var bar_img = $("<img class='rank_bar' id='rank_bar" + (i + 1) + "' src='/images2/rank_bar" + (i + 1) + ".png' />");
            var rank_name = $("<span class='rank_name'>" + item.Name + "</span>");
            var rank_value = $("<span class='rank_value' id='rank_value" + (i + 1) + "'>" + item.Value + " tce</span>");
            li.append(circle_img);
            li.append(rank);
            li.append(bar_img);
            li.append(rank_name);
            li.append(rank_value);

            $(".rank_list").append(li);
        }
    };

    function addEventHandler() {
        if (eventHandlerAdded) {
            return;
        }
        else {
            eventHandlerAdded = true;
        }

        $('.left-panel-bottom a').click(function () {
            if (typeof ret.detailHandler == 'function') {
                ret.detailHandler();
            }
        })
    };

    ret.init = function () {
        addEventHandler()
        dao.queryRankList(getRankCondition(), drawRankList);
        //drawRankList(data);
    };

    ret.condition = function () {
        return getRankCondition();
    };

    ret.detailClick = function (func) {
        this.detailHandler = func;
    };

    ret.drawEchart = function (data) {
        var rankCharts = echarts.init(document.getElementById('window_chart1'));

        var option = {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '10%',
                top: '5%',
                bottom: '5%',
                right: '5%'
            },
            xAxis: {
                type: 'value',
                boundaryGap: false,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: data.xAxis,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            series: (function () {
                var seriseData = [];

                for (var i = 0 ; i < data.series.length; i++) {
                    if (data.series[i] == null) {
                        continue;
                    }

                    var s = {
                        name: data.series[i].name,
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'right'
                            }
                        },
                        data: data.series[i].data
                    }

                    seriseData.push(s);
                }

                return seriseData;
            })(),

            color: ['#f3c37c', '#81bda9']
        };

        rankCharts.clear();
        rankCharts.setOption(option);
    }

    return ret;
})