/*总消耗数据加载模块*/

define(function (require) {
	var $ = require('jquery');
	var dao = require('dao');

	var ret = {
		clickHandler: null,		//list点击事件
		detailHandler: null		//详细按钮点击事件
	};

	function loadData(data) {
		$('#consume_Day').html(data[0].CurrentDay);			//日累计
		$('#consume_Month').html(data[0].CurrentMonth);		//月累计
		$('#consume_Year').html(data[0].CurrentYear);		//年累计
	}

	function addEventHandler() {
		$('.left-panel-top li').click(function () {
			var type = $(this).children('.value').attr('id').substr(8);
			if (typeof ret.clickHandler == 'function') {
				ret.clickHandler(type);
			}
		});

		$('.left-panel-top a').click(function () {
			if (typeof ret.detailHandler == 'function') {
				ret.detailHandler();
			}
		})
	}

	ret.init = function () {
		addEventHandler();
		dao.queryConsumeData(loadData);
		//loadData(data);
	};

	ret.detailClick = function (func) {
		this.detailHandler = func;
	};

	ret.listClick = function (func) {
		this.clickHandler = func;
	}

	ret.drawEchart = function (data) {
		var consumeCharts = echarts.init(document.getElementById('window_chart1'));

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
				//left: '36%',
				//top: '5%',
				//bottom: '5%',
				//right: '5%'
			},
			xAxis: {
				type: 'value',
				boundaryGap: false,
				//axisLine: {
				//	show: false
				//},
				//axisTick: {
				//	show: false
				//},
				//axisLabel: {
				//	show: false
				//},
				//splitLine: {
				//	show: false
				//}
			},
			yAxis: {
				type: 'category',
				data: data.xAxis,
				//axisLine: {
				//	show: false
				//},
				//axisTick: {
				//	show: false
				//},
				//splitLine: {
				//	show: false
				//}
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

		consumeCharts.clear();
		consumeCharts.setOption(option);
	}
	return ret;
})