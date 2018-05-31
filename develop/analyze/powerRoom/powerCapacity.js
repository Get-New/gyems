var myChart1 = echarts.init(document.getElementById('echt-line1'));
var myChart2 = echarts.init(document.getElementById('echt-line2'));

//**********************************************************************
var Page = {
	init: function () {
		GetPowerDownDispatchData();
		drawCharts();
	}
};

function GetPowerDownDispatchData() {
	$.ajax({
		url: '/api/PowerRoomReport/GetPowerDownDispatch',
		method: 'get',
		dataType: 'json',
		data: {},
		success: function (data) {
			if (!data.Models || !data.Models.length) {
				return;
			}
			else {
				var model = data.Models[0];
				$("td.currentStatus").each(function (i) {
					if (i == 4 || i == 9) {
						$(this).html(model.Current[i]);
					} else if (model.Current[i] == 'on') {
						$(this).html("启动").removeClass('tdStop').addClass("tdStart");
					} else if (model.Current[i] == 'off') {
						$(this).html("停止").removeClass('tdStart').addClass("tdStop");
					}
				});

				$("td.suggestStatus").each(function (i) {
					if (i == 4 || i == 9) {
						$(this).html(model.Suggest[i]);
					} else if (model.Suggest[i] == 'on') {
						$(this).html("启动").removeClass('tdStop').addClass("tdStart");
					} else if (model.Suggest[i] == 'off') {
						$(this).html("停止").removeClass('tdStart').addClass("tdStop");
					}
				});

				$("td.mirror1").each(function (i) {
					$(this).html(model.Mirror1[i]);
					if (i == 4) {
						//$(this).html(model.Mirror1[i]);
					}
				});

				$("td.mirror2").each(function (i) {
					$(this).html(model.Mirror2[i]);
					if (i == 4) {
						//$(this).html(model.Mirror1[i]);
					}
				});
			}
		}
	});
}

function randomDatas(start, end, step, baseValue) {
	var time = start;
	var historyDatas = [];
	var xAxisDates = [];
	if (!baseValue) {
		baseValue = Math.round(Math.random() * 100);
	}

	do {
		var stamp = [time.getHours() > 9 ? time.getHours() : '0' + time.getHours(),
			time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes(),
			time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
		].join(':');
		if (xAxisDates.length > 0 && stamp == '00:00:00') {
			xAxisDates.push('24:00:00');
			historyDatas.push(baseValue + Math.round((Math.random() - 0.5) * 10));
		} else {
			xAxisDates.push(stamp);
			historyDatas.push(baseValue + Math.round((Math.random() - 0.5) * 10));
		}

		time = new Date(+time + step);
	} while (time <= end);

	return {
		xAxis: xAxisDates,
		yAxis: historyDatas
	}
}

function clearCharts() {
	myChart1.clear();
	myChart2.clear();
}

function drawCharts() {
	clearCharts();

	//***********************************************************************************
	$.ajax({
		url: '/api/ElectrolyticAnalysis/GetEngeryMeasureproperty',
		method: 'get',
		dataType: 'json',
		//data: {
		//},
		success: function (response) {
			var items = response.Models;

			drawChart1();
			drawChart2();
		}
	});
}

function drawChart1() {
	var now = new Date();
	var day = new Date([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'));
	var today = new Date(+day - 8 * 3600 * 1000);
	var oneStep = 10 * 1000;

	var actual = randomDatas(today, new Date(), oneStep, 80);
	var history = randomDatas(today, new Date(+day + 16 * 3600 * 1000), oneStep, 90);
	var index = Math.round(actual.xAxis.length / history.xAxis.length * 100);

	var option = {
		tooltip: {
			trigger: 'axis',
			position: function (pt) {
				return [pt[0], '10%'];
			}
		},
		title: {
			left: 'center',
			text: '1#总降',
		},
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: history.xAxis
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%']
		},
		dataZoom: [{
			type: 'inside',
			start: (index - 1 < 0 ? 0 : index - 1),
			end: (index + 3 > 100 ? 100 : index + 3)
		}, {
			start: 0,
			end: 10,
			handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
			handleSize: '80%',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2
			}
		}],
		series: [
			{
				name: '历史功率',
				type: 'line',
				smooth: true,
				symbol: 'none',
				data: history.yAxis,
				markLine: {
					data: [
						{ name: '额定总功率', yAxis: 100 }
					]
				}
			}, {
				name: '实际功率',
				type: 'line',
				smooth: true,
				symbol: 'none',
				data: actual.yAxis
			}
		]
	};

	myChart1.setOption(option);

	setInterval(function () {
		var now = new Date();
		var day = new Date([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'));
		var today = new Date(+day - 8 * 3600 * 1000);
		var oneStep = 10 * 1000;

		var actual = randomDatas(today, new Date(), oneStep, 80);
		var history = randomDatas(today, new Date(+day + 16 * 3600 * 1000), oneStep, 90);
		var index = Math.round(actual.xAxis.length / history.xAxis.length * 100);

		myChart1.setOption({
			series: [
				{
					name: '历史功率',
					type: 'line',
					smooth: true,
					symbol: 'none',
					data: history.yAxis,
					markLine: {
						data: [
							{ name: '额定总功率', yAxis: 100 }
						]
					}
				}, {
					name: '实际功率',
					type: 'line',
					smooth: true,
					symbol: 'none',
					data: actual.yAxis
				}
			]
		});
	}, 10 * 1000);
}

function drawChart2() {
	var now = new Date();
	var day = new Date([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'));
	var today = new Date(+day - 8 * 3600 * 1000);
	var oneStep = 10 * 1000;

	var actual = randomDatas(today, new Date(), oneStep, 60);
	var history = randomDatas(today, new Date(+day + 16 * 3600 * 1000), oneStep, 70);
	var advice = [];
	for (var i = 0; i < history.xAxis.length; i++) {
		if (i <= 3 * 360 || (i <= 16 * 360 && i > 11 * 360)) {
			advice.push(80);
		} else {
			advice.push(100);
		}
	}
	var index = Math.round(actual.xAxis.length / history.xAxis.length * 100);

	var option = {
		tooltip: {
			trigger: 'axis',
			position: function (pt) {
				return [pt[0], '10%'];
			}
		},
		title: {
			left: 'center',
			text: '2#总降',
		},
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: history.xAxis
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%']
		},
		dataZoom: [{
			type: 'inside',
			start: (index - 1 < 0 ? 0 : index - 1),
			end: (index + 3 > 100 ? 100 : index + 3)
		}, {
			start: 0,
			end: 10,
			handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
			handleSize: '80%',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2
			}
		}],
		series: [
			{
				name: '历史功率',
				type: 'line',
				smooth: true,
				symbol: 'none',
				data: history.yAxis
			}, {
				name: '建议功率',
				type: 'line',
				symbol: 'none',
				data: advice
			}, {
				name: '实际功率',
				type: 'line',
				smooth: true,
				symbol: 'none',
				data: actual.yAxis
			}
		]
	};

	myChart2.setOption(option);

	setInterval(function () {
		var now = new Date();
		var day = new Date([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'));
		var today = new Date(+day - 8 * 3600 * 1000);
		var oneStep = 10 * 1000;

		var actual = randomDatas(today, new Date(), oneStep, 60);
		var history = randomDatas(today, new Date(+day + 16 * 3600 * 1000), oneStep, 70);
		var advice = [];
		for (var i = 0; i < history.xAxis.length; i++) {
			if (i <= 3 * 360 || (i <= 16 * 360 && i > 11 * 360)) {
				advice.push(80);
			} else {
				advice.push(100);
			}
		}
		var index = Math.round(actual.xAxis.length / history.xAxis.length * 100);

		myChart2.setOption({
			series: [
				{
					name: '历史功率',
					type: 'line',
					smooth: true,
					symbol: 'none',
					data: history.yAxis
				}, {
					name: '建议功率',
					type: 'line',
					symbol: 'none',
					data: advice
				}, {
					name: '实际功率',
					type: 'line',
					smooth: true,
					symbol: 'none',
					data: actual.yAxis
				}
			]
		});
	}, 10 * 1000);
}