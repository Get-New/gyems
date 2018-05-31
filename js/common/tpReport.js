
// 报表数据项目的勾选
var cvs = (function () {

	var conf = {
		selector: '.cvs',
		multi: true,
		autoSelectNum: 1,
		idField: 'itemId',
		nameField: 'itemName'
	};

	var selectHandler = null;
	var receiveFunc = null;

	var ret = {};
	ret.ready = false;
	ret.allList = [];
	ret.selectedList = [];

	ret.config = function (options) {
		conf = $.extend(true, {}, conf, options)
	}

	ret.init = function () {

	}

	ret.bindData = function (arr) {
		for (var i = 0; i < arr.length; i++) {
			var item = {
				id: arr[i][conf.idField],
				name: arr[i][conf.nameField]
			};
			this.allList.push(item)

			if (i < conf.autoSelectNum) {
				this.selectedList.push(item);
			}
		}

		this.draw();
		ret.ready = true;
	}

	ret.draw = function () {
		var that = this;
		var list = this.allList;
		var ul = $(conf.selector);
		ul.html('');

		for (var i in list) {
			var item = list[i];

			var li = $("<li></li>");
			li.append(item.name);
			li.attr('ItemId', item.id);
			li.attr('ItemName', item.name);
			ul.append(li);

			for (var j = 0; j < that.selectedList.length; j++) {
				if (that.selectedList[j].id == item.id) {
					li.addClass('active');
				}
			}
		}

		$(conf.selector + " li").click(function () {
			var el = $(this);
			if (conf.multi == false) {
				$(conf.selector + " li").removeClass('active')
			}

			if (el.hasClass('active')) {
				el.removeClass('active');
			} else {
				el.addClass('active');
			}

			that.selectedList = getSelected();

			if (typeof selectHandler === 'function') {
				selectHandler(that.selectedList);
			}
		})
	}

	ret.select = function (func) {
		selectHandler = func;
	}

	function getSelected() {
		var arr = [];
		$(conf.selector + " li").each(function () {
			var el = $(this);
			if (el.hasClass('active')) {
				arr.push({
					id: el.attr('ItemId'),
					name: el.attr('ItemName')
				});
			}
		})
		return arr;
	}

	return ret;

})();


// 封装年月日报表的时间选择部分
var dst = (function () {
	var ret = {};

	ret.ready = false;

	// daysrc负责返回某区间内的所有年、月、日
	var daysrc = (function () {
		// 某年某月有几天
		function getDaysNum(year, month) {
			return new Date(year, month, 0).getDate();
		}

		function ret() { }

		ret.getYears = function (startYear, endYear) {
			var arr = [];
			for (var i = startYear; i <= endYear; i++) {
				arr.push({
					year: i
				});
			}
			return arr;
		}

		ret.getMonths = function (startYear, startMonth, endYear, endMonth) {

			var arr = [];
			for (var i = startYear; i <= endYear; i++) {

				var m0 = 1, m1 = 12;
				if (i == startYear) {
					m0 = startMonth;
				} else if (i == endYear) {
					m1 = endMonth;
				}

				var year = {
					year: i,
					months: []
				}

				for (var j = m0; j <= m1; j++) {
					year.months.push({
						month: j
					})
				}

				arr.push(year);
			}
			return arr;
		}

		ret.getDays = function (startYear, startMonth, startDay, endYear, endMonth, endDay) {
			var arr = [];
			for (var i = startYear; i <= endYear; i++) {

				var m0 = 1, m1 = 12;
				if (i == startYear) {
					m0 = startMonth;
				} else if (i == endYear) {
					m1 = endMonth;
				}

				var year = {
					year: i,
					months: []
				};
				arr.push(year);

				for (var j = m0; j <= m1; j++) {

					var month = {
						month: j,
						days: []
					};
					year.months.push(month);

					var d0 = 1;
					var d1 = getDaysNum(i, j);
					if (i == startYear && j == startMonth) {
						d0 = startDay;
					} else if (i == endYear && j == endMonth) {
						d1 = endDay;
					}

					for (var k = d0; k <= d1; k++) {
						month.days.push({
							day: k
						});
					}
				}
			}
			return arr;
		}

		return ret;
	}())

	// dwin负责维护弹出的日期选框
	var dwin = (function () {
		var ret = {};

		var startYear, startMonth, startDay, endYear, endMonth, endDay;

		// daysrc组件返回的对象数组
		var list;

		// 当前的类型
		var currType;

		// 目前正在选中的年月日
		var activeYear, activeMonth, activeDay;

		// 选择之后的处理函数
		var selectHandler;

		// 修改窗体div的class
		function setTypeClass(type) {
			var cls = 'window-' + type;
			$('.window-date').removeClass('window-year').removeClass('window-month').removeClass('window-day').addClass(cls);
		}

		// 清空某类型的li
		function clear(type) {
			if (typeof type === 'string') {
				$(".window-date .sub-" + type + " li").remove();
			} else {
				$(".window-date li").remove();
			}
		}

		// 清空某类型的选中状态
		function clearActive(type) {
			var ul = getul(type);
			$('li', ul).removeClass('active');
		}

		// 添加li
		function appendItem(type, num, active) {
			var ul = getul(type);
			var li = $("<li></li>");
			var typeStr = (function (t) {
				switch (t) {
					case 'year': return '';
					case 'month': return '月';
					case 'day': return '日';
				}
			})(type)

			li.html(num + typeStr);
			li.attr('type', type);
			li.attr('num', num);

			if (active) {
				li.addClass('active');
			}

			ul.append(li);
		}

		// 绘制年
		function drawYears() {
			clear('year');
			var actived = false;
			for (var i = 0; i < list.length; i++) {
				var objYear = list[i];
				if (objYear.year == activeYear) {
					appendItem('year', objYear.year, true);
					actived = true;
				} else {
					appendItem('year', objYear.year, false);
				}
			}
			if (!actived) {
				var ul = getul('year');
				var firstLi = $('li:first', ul);
				firstLi.addClass('active');
				activeYear = firstLi.attr('num');
			}
		}

		// 绘制月
		function drawMonths() {
			clear('month');
			var actived = false;
			for (var i = 0; i < list.length; i++) {
				var objYear = list[i];
				if (activeYear == objYear.year) {
					for (var j = 0; j < objYear.months.length; j++) {
						var objMonth = objYear.months[j];
						if (objMonth.month == activeMonth) {
							appendItem('month', objMonth.month, true);
							actived = true;
						} else {
							appendItem('month', objMonth.month, false);
						}
					}
				}
			}
			if (!actived) {
				var ul = getul('month');
				var firstLi = $('li:first', ul);
				firstLi.addClass('active');
				activeMonth = firstLi.attr('num');
			}
		}

		// 绘制日
		function drawDays() {
			clear('day');
			var actived = false;
			for (var i = 0; i < list.length; i++) {
				var objYear = list[i];
				if (activeYear == objYear.year) {
					for (var j = 0; j < objYear.months.length; j++) {
						var objMonth = objYear.months[j];
						if (activeMonth == objMonth.month) {
							for (var k = 0; k < objMonth.days.length; k++) {
								var objDay = objMonth.days[k];
								if (objDay.day == activeDay) {
									appendItem('day', objDay.day, true);
									actived = true;
								} else {
									appendItem('day', objDay.day, false);
								}
							}
						}
					}
				}
			}
			if (!actived) {
				var ul = getul('day');
				var firstLi = $('li:first', ul);
				firstLi.addClass('active');
				activeDay = firstLi.attr('num');
			}
		}

		function getul(type) {
			return $(".sub-" + type + " ul");
		}

		function onclick(el, e, clicktime, thisArg) {
			var type = el.attr('type');
			var num = parseInt(el.attr('num'));
			var ul = getul(type);
			clearActive(type);
			el.addClass('active');

			switch (type) {
				case 'year':
					activeYear = num;
					if (currType == type) {
						if (clicktime == 2) {
							selectHandler(activeYear);
							thisArg.close();
						}
					} else {
						drawMonths();
						if (currType == 'day') {
							drawDays();
						}
					}

					break;
				case 'month':
					activeMonth = num;
					if (currType == type) {
						if (clicktime == 2) {
							selectHandler(activeYear, activeMonth);
							thisArg.close();
						}
					} else {
						if (currType == 'day') {
							drawDays();
						}
					}
					break;
				case 'day':
					activeDay = num;
					if (currType == type && clicktime == 2) {
						selectHandler(activeYear, activeMonth, activeDay);
						thisArg.close();
					}
					break;
			}
		}

		ret.open = function (type, year, month, day) {
			currType = type;
			setTypeClass(type);
			clear();
			activeYear = year;
			activeMonth = month;
			activeDay = day;

			switch (type) {
				case 'year':
					list = daysrc.getYears(startYear, endYear);
					drawYears();
					break;
				case 'month':
					list = daysrc.getMonths(startYear, startMonth, endYear, endMonth);
					drawYears();
					drawMonths();
					break;
				case 'day':
					list = daysrc.getDays(startYear, startMonth, startDay, endYear, endMonth, endDay);
					drawYears();
					drawMonths();
					drawDays();
					break;
			}

			$('.window-date').fadeIn(200);
		}

		ret.close = function () {
			$('.window-date').hide();
		}

		ret.setEdge = function (sYear, sMonth, sDay, eYear, eMonth, eDay) {
			startYear = sYear;
			startMonth = sMonth;
			startDay = sDay;
			endYear = eYear;
			endMonth = eMonth;
			endDay = eDay;
		}

		ret.init = function () {
			var that = this;
			$(".window-date").on('click', 'li', function (e) {
				onclick($(this), e, 1, that);
			});
			$(".window-date").on('dblclick', 'li', function (e) {
				onclick($(this), e, 2, that);
			});
			$(".window-date .window-cancel").click(function () { that.close(); });
			$(".window-date .window-save").click(function () {
				selectHandler(activeYear, activeMonth, activeDay);
				that.close();
			});

			ret.ready = true;
		}

		ret.select = function (func) {
			selectHandler = func;
		}

		return ret;
	}());

	var currType, currYear, currMonth, currDay, changeHandler;
	var _startYear, _startMonth, _startDay, _endYear, _endMonth, _endDay;

	// 获得此时此刻的年月日
	function nowYMD() {
		var date = new Date();
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
	}

	// 根据情况，把向前或向后的箭头变灰
	function checkPrePost(type, year, month, day) {
		var now = nowYMD();
		var start = { y: _startYear, m: _startMonth, d: _startDay };
		var end = { y: _endYear, m: _endMonth, d: _endDay };
		switch (type) {
			case 'year':
				setPre(year > start.y);
				setPost(year < end.y);
				break;
			case 'month':
				setPre(year > start.y || month > start.m);
				setPost(year < end.y || month < end.m);
				break;
			case 'day':
				setPre(year > start.y || month > start.m || day > start.d);
				setPost(year < end.y || month < end.m || day < end.d);
				break;
		}

		if (type == 'history') {
			$('.pre').hide();
			$('.next').hide();
		} else {
			$('.pre').show();
			$('.next').show();
		}

		function setPre(flag) {
			if (flag) {
				$('.pre').removeClass('disabled');
			} else {
				$('.pre').addClass('disabled');
			}
		}

		function setPost(flag) {
			if (flag) {
				$('.next').removeClass('disabled');
			} else {
				$('.next').addClass('disabled');
			}
		}
	}

	function go(type, year, month, day) {
		switch (type) {
			case 'history':
				currType = 'history';
				setTitle(type);
				if (typeof changeHandler === 'function') {
					changeHandler('year', year);
				}
				break;
			case 'year':
				currType = 'year';
				currYear = year;
				setTitle(type, year);
				if (typeof changeHandler === 'function') {
					changeHandler('year', year);
				}
				break;
			case 'month':
				currType = 'month';
				currYear = year;
				currMonth = month;
				setTitle(type, year, month);
				if (typeof changeHandler === 'function') {
					changeHandler('month', year, month);
				}
				break;
			case 'day':
				currType = 'day';
				currYear = year;
				currMonth = month;
				currDay = day;
				setTitle(type, year, month, day);
				if (typeof changeHandler === 'function') {
					changeHandler('day', year, month, day);
				}
				break;
		}
		checkPrePost(type, year, month, day);
	}

	// 切换到历史模式
	function switchHistory() {
		$(".tab-date-type li").removeClass('active');
		$('#history').addClass('active');
		go('history');
	}

	// 切换到年模式
	function switchYear() {
		$(".tab-date-type li").removeClass('active');
		$('#year').addClass('active');
		$('.pre i').html('前一年');
		$('.next i').html('后一年');
		go('year', nowYMD().year);
	}

	// 切换到月模式
	function switchMonth() {
		$(".tab-date-type li").removeClass('active');
		$('#month').addClass('active');
		$('.pre i').html('前一月');
		$('.next i').html('后一月');
		var now = nowYMD();
		go('month', now.year, now.month);
	}

	// 切换到天模式
	function switchDay() {
		$(".tab-date-type li").removeClass('active');
		$('#day').addClass('active');
		$('.pre i').html('前一天');
		$('.next i').html('后一天');
		var now = nowYMD();
		go('day', now.year, now.month, now.day);
	}

	function update() {
		go(currType, currYear, currMonth, currDay);
	}

	// 向前
	function preOrNext(n) {
		switch (currType) {
			case 'year':
				currYear += n;
				break;
			case 'month':
				currMonth += n;
				if (currMonth == 0 || currMonth == 13) {
					currMonth = Math.abs(currMonth - 12);
					currYear += n;
				}
				break;
			case 'day':
				var date = new Date(currYear, currMonth - 1, currDay);
				var n_date = new Date(date.getTime() + 24 * 60 * 60 * 1000 * n);
				currYear = n_date.getFullYear();
				currMonth = n_date.getMonth() + 1;
				currDay = n_date.getDate();
				break;
		}
		update();
	}

	// 设置标题
	function setTitle(type, year, month, day) {

		if (type == 'history') {
			$("#title").html('历年数据').removeClass('title-clickable');
			return;
		}

		var str = year + '年';


		if (typeof month === 'number' && month >= 1 && month <= 12) {
			var zero = month < 10 ? '0' : '';
			str += zero + month + '月';
		}

		if (typeof day === 'number' && day >= 1 && day <= 31) {
			var zero = day < 10 ? '0' : '';
			str += zero + day + '日';
		}

		$("#title").html(str).addClass('title-clickable');
	}

	ret.change = function (func) {
		changeHandler = func;
	}

	var conf = {
		type: 'month',
		startYear: 2015,
		startMonth: 11,
		startDay: 29,
		endYear: 0,
		endMonth: 0,
        endDay: 0
	};

	ret.config = function (config) {
		conf = $.extend(true, {}, conf, config)
	}

	ret.init = function () {
	    var type = conf.type;
	    var now = nowYMD();
	    _startYear = conf.startYear;
	    _startMonth = conf.startMonth;
	    _startDay = conf.startDay;
	    _endYear = conf.endYear || now.year;
	    _endMonth = conf.endMonth || now.month;
	    _endDay = conf.endDay || now.day;

	    switch (type) {
	        case 'history':
	            switchHistory();
	            break;
			case 'year':
				switchYear();
				break;
			case 'day':
				switchDay();
				break;
			default:
				switchMonth();
				break;
		}

		$("#title").click(function () {

			if (currType == 'history') {
				return;
			}

			dwin.open(currType, currYear, currMonth, currDay);
		})
		$('#history').click(function () {
			switchHistory();

		})
		$('#year').click(function () {
			switchYear();

		})
		$('#month').click(function () {
			switchMonth();
		})
		$('#day').click(function () {
			switchDay();
		})
		$('#pre').click(function () {
			if ($(this).hasClass('disabled')) return;
			preOrNext(-1);
		})
		$('#next').click(function () {
			if ($(this).hasClass('disabled')) return;
			preOrNext(1);
		})

		
		dwin.setEdge(_startYear, _startMonth, _startDay, _endYear, _endMonth, _endDay);
		dwin.select(function (y, m, d) {
			go(currType, y, m, d);
		})
		dwin.init();

		dst.ready = true;
	}

	ret.getCurrType = function () {
		return currType;
	}

	ret.getCurrYear = function () {
		return currYear
	}

	ret.getCurrMonth = function () {
		return currMonth;
	}

	ret.getCurrDay = function () {
		return currDay;
	}



	return ret;
}())

var chartHelper = (function () {
	var ret = {};

	ret.translateFontSize = function (designSize) {
		var size = parseFloat(window.top.document.documentElement.style.fontSize) * designSize / 100;
		if (size < 12) {
			size = 12;
		}
		return size;
	}

	return ret;
})()


var demoHelper = (function () {

	var array = [{
		itemId: '1',
		itemName: '一系列总'
	}, {
		itemId: '2',
		itemName: '一系统硫酸镍'
	}, {
		itemId: '3',
		itemName: '二系统硫酸镍'
	}, {
		itemId: '4',
		itemName: '一系列直流'
	}, {
		itemId: '5',
		itemName: '一系列交流'
	}, {
		itemId: '6',
		itemName: '一系列电'
	}, {
		itemId: '7',
		itemName: '二系列电'
	}];


	var ret = {};

	ret.cvs = function () {
		return array;
	}

	ret.getRandom = function (min, max) {
		return min + (max - min) * Math.random();
	}

	ret.getRandomArray = function (num, min, max) {
		var array = [];
		var v = ret.getRandom(min, max);
		array.push(v);
		for (var i = 0; i < num - 1; i++) {
			var shift = ret.getRandom(-Math.abs(max - min) / 30, Math.abs(max - min) / 30);
			if (v + shift <= max && v + shift >= min) {
				v += shift;
			} else {
				v -= shift;
			}
			array.push(v);
		}
		return array;
	}

	ret.getRandomList = function (num, min, max) {
		var array = [];

		for (var i = 0; i < num ; i++) {
			var v = ret.getRandom(min, max);
			array.push(v);
		}
		return array;
	}

	ret.getXAxis = function (type) {
		function getAxisArr(start, end, unit) {
			var arr = [];
			for (var i = start; i <= end; i++) {
				arr.push(i + (unit || ''));
			}
			return arr;
		}
		var xAxis = [];
		switch (type) {
			case 'history':
				xAxis = getAxisArr(2010, 2016);
				break;
			case 'year':
				xAxis = getAxisArr(1, 12, '月');
				break;
			case 'month':
				xAxis = getAxisArr(1, 30);
				break;
			case 'day':
				xAxis = getAxisArr(0, 23);
				break;
		}
		return xAxis;
	}

	ret.line = function () {
		var type = dst.getCurrType();
		var xAxis = ret.getXAxis(type);
		var len = xAxis.length;

		var ss = [];
		var markLines = [];

		if (options.multiCvs) {
			for (var i = 0 ; i < cvs.selectedList.length; i++) {
				ss.push({ name: cvs.selectedList[i].name, min: 600000, max: 800000 });
			}
		} else {
			ss.push({ name: '实际值', min: 600000, max: 800000, type: 'bar' });
			ss.push({ name: '考核值', min: 700000, max: 700000 });
			ss.push({ name: '同比', min: -50, max: 50, yAxisIndex: 1, lineType: 'dashed', showLabel: false, type: 'bar' });
			ss.push({ name: '环比', min: -50, max: 50, yAxisIndex: 1, lineType: 'dashed', step: true, stepType: 'middle' });
			markLines.push({ name: '历史最好值', value: 789638 })
		}

		for (var i = 0; i < ss.length; i++) {
			ss[i].data = ret.getRandomArray(len, ss[i].min, ss[i].max);
			delete ss[i].min;
			delete ss[i].max;
		}

		return {
			xAxis: xAxis,
			series: ss,
			leftYTitle: '单位:kw',
			rightYTitle: '',
			markLines: markLines,
			leftYMin: 500000,
			leftYMax: 900000,
			rightYMin: -80,
            rightYMax: 80
		};
	}

	ret.stack = function () {
		var yAxis = ['实际产量/待生产产量', '计划产量'];
		var series = [];

		series.push({
			name: '实际产量',
			data: [ret.getRandom(400000, 500000), 0],
            stack: 'stack1'
		})

		series.push({
			name: '待生产产量',
			data: [ret.getRandom(200000, 300000), 0],
			showLabel: true,
			stack: 'stack1'
		})

		series.push({
			name: '计划产量',
			data: [0, ret.getRandom(600000, 800000)],
		    stack: 'stack1'
		})

		return {
			yAxis: yAxis,
			series: series
		};
	}

	ret.pie1 = function () {
		var d = [];
		for (var i = 0 ; i < array.length; i++) {
			d.push({
				name: array[i].itemName,
				value: ret.getRandom(300000, 600000)
			})
		}

		var series = [{
			data: d,
			showLabel: true
		}];

		return {
			series: series,
			legendPosition:'left'
		};
	}

	ret.pie2 = function () {
		var d1 = [];
		var d2 = [];
		for (var i = 0 ; i < array.length; i++) {
			d1.push({
				name: array[i].itemName,
				value: ret.getRandom(300000, 600000)
			});
			d2.push({
				name: array[i].itemName,
				value: ret.getRandom(300000, 600000)
			});
		}

		var series = [{
			name: '去年数据',
			data: d1
		}, {
			name: '今年数据',
			data: d2,
			showLabel: true
		}];

		return {
			series: series
		};
	}

	ret.bar = function () {
		var yAxis = ['硫酸电单耗', '阴极铜电单耗', '阳极铜电单耗', '阴极铜综合电单耗'];
		var series = [];

		series.push({
			name: '实际值',
			data: ret.getRandomList(4, 10, 80)
		})

		series.push({
			name: '指标值',
			data: ret.getRandomList(4, 10, 80),
			showLabel: true
		})

		return {
			yAxis: yAxis,
			series: series,
            xMin: 0
		};
	}

	ret.gaugechart = function () {

	    var data = {
	        name: '某车间的表',
	        str: '自定义文字内容',
	        val: ret.getRandom(-500, 700), formma: '{a} <br/> {b}: {c}(单位名称)',
	        percent: 'true',
	        num: 2,
	        color1: '#000000',
	        color2: '#933333',
	        color3: '#777777',
	        color4: '#ccc'
	    }


		return data

	}

	return ret;
})()

// 画折线图
var linechart = (function () {
	var ret = {};

	ret.draw = function (op, data) {
		var echartsOption = {
			title: { show: false },
			grid: {},
			legend: { data: [] },
			tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
			barGap: '0%',
			xAxis: {
				axisLabel: { textStyle: { color: 'black' } },
				type: 'category',
				nameLocation: 'middle',
				axisTick: { show: false },
				splitLine: { show: true, lineStyle: { color: '#ebebeb' } },
				axisLine: { lineStyle: { color: '#000000' } }
			},
			yAxis: [{
				nameTextStyle: { color: 'black' },
				axisLabel: { textStyle: { color: 'black' } },
				scale: true,
				axisTick: { show: false },
				splitLine: { lineStyle: { color: '#ebebeb' } },
				axisLine: { lineStyle: { color: '#000000' } }
			}, {
				nameTextStyle: { color: 'black' },
				axisLabel: { textStyle: { color: 'black' }, formatter: '{value} %' },
				axisTick: { show: false },
				splitLine: { show: false },
				axisLine: { lineStyle: { color: '#000000' } }
			}],
			series: []
		};

		// 字体
		var axisLabelFontSize = chartHelper.translateFontSize(14);
		echartsOption.xAxis.axisLabel.textStyle.fontSize = axisLabelFontSize;
		echartsOption.yAxis[0].nameTextStyle.fontSize = axisLabelFontSize;
		echartsOption.yAxis[0].axisLabel.textStyle.fontSize = axisLabelFontSize;
		echartsOption.yAxis[1].nameTextStyle.fontSize = axisLabelFontSize;
		echartsOption.yAxis[1].axisLabel.textStyle.fontSize = axisLabelFontSize;

		// x轴数据
		echartsOption.xAxis.data = data.xAxis;

		// y轴标题
		echartsOption.yAxis[0].name = data.leftYTitle;
		echartsOption.yAxis[1].name = data.rightYTitle;
	   
		var showRightYAxis = false;
		var boundaryGap = false;        



		// 数据系列
		for (var i = 0 ; i < data.series.length; i++) {
			//var item = data.series;
			if (data.series[i] == null) {
				continue;
			}
			var s = {
				name: data.series[i].name,
				type: 'line',
			    //data: data.series[i].data,
                //尝试上下显示zbc
				data: (function () {
				    var temp = [];
				    for (j = 0; j < data.series[i].data.length; j++) {

				        if (j % 2 == 1) {
				            temp.push({ value: data.series[i].data[j], label: { normal: {position:'bottom'} } })
				        }
				        else {
				            temp.push({ value: data.series[i].data[j], label: { normal: {} } })
				        }
				    }
				    return temp;
				})(),
				smooth: true,
				lineStyle: { normal: {} },
				label: { normal: {} }
			}
		    //变色(不用leftYMAX)
		    //var v;
		    //for (var j = 0; j < data.series.length; j++) {
		    //    if (data.series[j].name == '目标值') {
		    //        v = data.series[j].data[0];
		    //    }
		    //}
		    //var bl1, bl2;
		    //bl1 = v / (100 - data.leftYMin);

		    //if (bl1 < 0.01) {
		    //    bl1 = bl1 * 100;
		    //    console.log(data.leftYMax, data.leftYMin, bl1)

		    //    if (data.series[i].name == '实际单耗') {
		    //        s.lineStyle.normal = {
		    //            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //                   {
            //                       offset: 0, color: 'red' // 0% 处的颜色
            //                   },
            //                    {
            //                        offset: (1 - bl1), color: 'red' // 0% 处的颜色
            //                    },
            //                    {
            //                        offset: (1 - bl1), color: 'blue' // 0% 处的颜色
            //                    },
            //                    {
            //                        offset: 1, color: 'blue' // 100% 处的颜色
            //                    }
		    //            ], false)
		    //        }
		    //    }
		    //}
		    //if (bl1 > 0.01) {
		    //    //bl1 = bl1 * 100;
		    //    console.log(data.leftYMax, data.leftYMin, bl1)

		    //    if (data.series[i].name == '实际单耗') {
		    //        s.lineStyle.normal = {
		    //            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //                   {
            //                       offset: 0, color: 'red' // 0% 处的颜色
            //                   },
            //                    {
            //                        offset: (1 - bl1), color: 'red' // 0% 处的颜色
            //                    },
            //                    {
            //                        offset: (1 - bl1), color: 'blue' // 0% 处的颜色
            //                    },
            //                    {
            //                        offset: 1, color: 'blue' // 100% 处的颜色
            //                    }
		    //            ], false)
		    //        }
		    //    }
		    //}
	
		    //变色(使用leftYMAX)
			//var v;
			//for (var j = 0; j < data.series.length; j++) {
			//    if (data.series[j].name == '目标值') {
			//        v = data.series[j].data[0];
			//    }
			//    //else { v=0}
			//}
			//var bl1;
			//var bl2 = 0;
			//bl1 = parseFloat(v) / (data.leftYMax - data.leftYMin);
			//bl2 = parseFloat(bl1-(v/(3.2*(data.leftYMax-data.leftYMin))));
			//while (bl2 > 1) { bl2 = bl2 - 0.1 }
			//console.log(data.leftYMax, data.leftYMin, bl2, parseFloat(v))

		    //if (data.series[i].name == '实际单耗') {
		    //    s.lineStyle.normal = {
		    //        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //               {
            //                   offset: 0, color: 'red' // 0% 处的颜色
            //               },
            //                {
            //                    offset: 1-bl2, color: 'red' // 0% 处的颜色
            //                },
            //                {
            //                    offset: 1-bl2, color: 'blue' // 0% 处的颜色
            //                },
            //                {
            //                    offset: 1, color: 'blue' // 100% 处的颜色
            //                }
		    //        ], false)
		    //    }
		    //}




			if (data.series[i].yAxisIndex) {
				s.yAxisIndex = data.series[i].yAxisIndex;
			}

			if (data.series[i].lineType) {
				s.lineStyle.normal.type = data.series[i].lineType;
			}

			if (data.series[i].step) {
				s.step = data.series[i].stepType || 'start';
				s.smooth = false;
			}

			if (data.series[i].showLabel) {
				s.label.normal.show = true;
			}

			if (data.series[i].type == 'bar') {
				s.type = 'bar';
				boundaryGap = true;
			}

			echartsOption.series.push(s)
			echartsOption.legend.data.push({
				name: data.series[i].name,
				icon: 'circle'
			})
			if (data.series[i].yAxisIndex > 0) {
				showRightYAxis = true;
			}
		}

	    //变色系统
		//var v;
		//for (var i = 0; i < data.series.length; i++) {
		//    if (data.series[i].name == '目标值') {
		//        v = data.series[i].data[0];
		//    }
		//}
		//var bl1, bl2;
		//bl1 = v / (1 - 0);
		//bl2 = bl1 - 0.000001;

		//for (var i = 0; i < s.length; i++) {
		//    if (s[i].name == '实际单耗') {
		//        s[i].lineStyle.normal = {
		//            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //                    {
        //                        offset: 0, color: 'red' // 0% 处的颜色
        //                    },
        //                     {
        //                         offset: bl1, color: 'red' // 0% 处的颜色
        //                     },
        //                     {
        //                         offset: bl2, color: 'blue' // 0% 处的颜色
        //                     },
        //                     {
        //                         offset: 1, color: 'blue' // 100% 处的颜色
        //                     }
		//            ], false)
		//        }
		//    }
		//}



		// 标线
		if (data.markLines){
			for (var i = 0 ; i < data.markLines.length; i++) {
			    var markLine = data.markLines[i];
			    if (typeof markLine.value !== 'number') continue;
				var s = {
					name: markLine.name,
					data: [],
					type: 'line',
					itemStyle: { normal: { opacity: 0 } },
					lineStyle: { normal: { type: 'dotted' } },
					markLine: {
						silent: true,
						symbolSize: 10,
						data: [{ type: 'average' }],
						lineStyle: { normal: { type: 'dotted' } },
						label: { normal: { show: false } }
					}
				};
				for (var j = 0; j < data.xAxis.length; j++) {
					s.data.push(markLine.value);
				}
				echartsOption.series.push(s);
			}
		}

		// 是否留左右空白
		echartsOption.xAxis.boundaryGap = boundaryGap;

		// 是否删除右侧y轴
		if (!showRightYAxis) {
			echartsOption.yAxis.splice(1, 1);
		}
		 
	    // 坐标轴最小、最大值
		if (typeof data.leftYMin === 'number') echartsOption.yAxis[0].min = data.leftYMin;
		if (typeof data.leftYMax === 'number') echartsOption.yAxis[0].max = data.leftYMax;
		if (typeof data.rightYMin === 'number') echartsOption.yAxis[1].min = data.rightYMin;
		if (typeof data.rightYMax === 'number') echartsOption.yAxis[1].max = data.rightYMax;


		if (typeof ret.changeFuncs[op.containerId] === 'function') {
			ret.changeFuncs[op.containerId](echartsOption);
		}

		var instance = tp.echartsInstances[op.containerId];
		instance.clear();
		instance.setOption(echartsOption);
		jsonExport.storage(op, data, echartsOption);
	}

	ret.click = function (op, func) {
		var instance = tp.echartsInstances[op.containerId];
		instance.on('click', function (params) {
			func(params);
		});
	}

	ret.clear = function (op) {
		var instance = tp.echartsInstances[op.containerId];
		instance.clear();
	}

	ret.changeFuncs = {};
	ret.changeEchartsOption = function (op, func) {
		ret.changeFuncs[op.containerId] = func;
	}

	return ret;
})()

// 画堆叠图
var stackchart = (function () {
	var ret = {};

	ret.draw = function (op, data) {

		var echartsOption = {
			title: { show: false },
			grid: {},
			tooltip: { trigger: 'item', formatter: '{a} : {c}' },
			legend: { data: [] },
			xAxis: {
				axisLabel: { textStyle: { fontSize: 14, color: 'black' } },
				type: 'value',
				nameLocation: 'middle',
				axisTick: { show: false },
				boundaryGap: false,
				splitLine: { show: true, lineStyle: { color: '#ebebeb' } },
				axisLine: { lineStyle: { color: '#000000' } },
				scale: true
			},
			yAxis: [{
				type: 'category',
				data: data.yAxis,
				nameTextStyle: { fontSize: 14, color: 'black' },
				axisLabel: { textStyle: { fontSize: 14, color: 'black' } },
				axisTick: { show: false },
				splitLine: { lineStyle: { color: '#ebebeb' } },
				axisLine: { lineStyle: { color: '#000000' } },
				boundaryGap: ['25%', '25%']
			}],
			series: []
		}; 

		for (var i = 0 ; i < data.series.length; i++) {
			var s = {
				name: data.series[i].name,
				type: 'bar',
				data: data.series[i].data,
				stack: data.series[i].stack,
				label: { normal: {} }
			};
			if (data.series[i].showLabel === true) {
				s.label.normal.show = true;
				s.label.normal.position = 'insideRight';
			}
			echartsOption.series.push(s);
			echartsOption.legend.data.push({
				name: data.series[i].name,
				icon: 'circle'
			})
		}

	    // x轴的min和max
		if (typeof data.xMin === 'number') echartsOption.xAxis.min = data.xMin;
		if (typeof data.xMax === 'number') echartsOption.xAxis.max = data.xMax;

		if (typeof ret.changeFuncs[op.containerId] === 'function') {
			ret.changeFuncs[op.containerId](echartsOption);
		}

		var instance = tp.echartsInstances[op.containerId];
		instance.clear();
		instance.setOption(echartsOption);
		jsonExport.storage(op, data, echartsOption);
	}

	ret.click = function (op, func) {
		var instance = tp.echartsInstances[op.containerId];
		instance.on('click', function (params) {
			func(params);
		});
	}

	ret.changeFuncs = {};
	ret.changeEchartsOption = function (op, func) {
		ret.changeFuncs[op.containerId] = func;
	}

	return ret;
})()

// 画饼图
var piechart = (function () {
	var ret = {};

	// 1个饼
	ret.draw1 = function (op, data) {

		var echartsOption = {
			title: { show: false },
			grid: {},
			tooltip: { trigger: 'item', formatter: "{b} : {c} ({d}%)" },
			legend: { data: [] },
			series: []
		};

		echartsOption.series = [{
			type: 'pie',
			data: data.series[0].data,
			label: { normal: {} }
		}];

		if (data.series[0].showLabel) {
			echartsOption.series[0].label.normal.formatter = '{b} {c}';
		} 

		for (var i = 0 ; i < data.series[0].data.length; i++) {
			echartsOption.legend.data.push({
				name: data.series[0].data[i].name,
				icon: 'circle'
			})
		} 

		if (typeof ret.changeFuncs[op.containerId] === 'function') {
			ret.changeFuncs[op.containerId](echartsOption);
		}

		if (data.legendPosition == 'left') {
			// todo
			$.extend(echartsOption.legend, {left:50,orient:'vertical'})





		}

		var instance = tp.echartsInstances[op.containerId];
		instance.clear();
		instance.setOption(echartsOption);
		jsonExport.storage(op, data, echartsOption);
	}

	// 2个饼
	ret.draw2 = function (op, data) {

		var echartsOption = {
			title: [{ text: data.series[0].name, x: '25%', y: '6%', textAlign: 'center' },
				{ text: data.series[1].name, x: '75%', y: '6%', textAlign: 'center' }],
			grid: {},
			tooltip: { trigger: 'item', formatter: "{b} : {c} ({d}%)" },
			legend: { data: [] },
			series: []
		};

		echartsOption.series = [{
			type: 'pie',
			data: data.series[0].data,
			center: ['25%', '55%'],
			label: { normal: {} }
		}, {
			type: 'pie',
			data: data.series[1].data,
			center: ['75%', '55%'],
			label: { normal: {} }
		}];

		for (var i = 0; i < 2; i++) {
			if (data.series[i].showLabel) {
				echartsOption.series[i].label.normal.formatter = '{b} {c}';
			}
		} 

		for (var i = 0 ; i < data.series[0].data.length; i++) {
			echartsOption.legend.data.push({
				name: data.series[0].data[i].name,
				icon: 'circle'
			})
		} 

		if (typeof ret.changeFuncs[op.containerId] === 'function') {
			ret.changeFuncs[op.containerId](echartsOption);
		}

		var instance = tp.echartsInstances[op.containerId];
		instance.clear();
		instance.setOption(echartsOption);
		jsonExport.storage(op, data, echartsOption);
	}

	ret.click = function (op, func) {
		var instance = tp.echartsInstances[op.containerId];
		instance.on('click', function (params) {
			func(params);
		});
	}

	ret.changeFuncs = {};
	ret.changeEchartsOption = function (op, func) {
		ret.changeFuncs[op.containerId] = func;
	}

	return ret;
})()

// 仪表
var gaugechart = (function () {
	var ret = {};

	ret.draw = function (op, data) {

		var echartsOption = {
			tooltip: {},
			series: []
		};

		var current_data, maxn, minn, cp1, ns, txt;

		txt = data.str;

		current_data = data.val;

		if (data.val > 0) {
			var temp;
			temp = data.val % 100;
			maxn = data.val - temp + 100;
			minn = -100;
			ns = (maxn - minn) / 50;
			cp1 = -minn / 500;
			cp1 = cp1 * 10 / ns;
		}
		if (data.val < 0) {
			var temp;
			temp = data.val % 100;
			minn = data.val - temp - 100;
			maxn = 100;
			ns = (maxn - minn) / 50;
			cp1 = maxn / 500;
			cp1 = 1 - (cp1 * 10 / ns);
		}
        //设置三个颜色zbc
		var color1 = '#f49407';
		var color2 = '#54948f';
		var color3 = '#f30e06';
		var color4 = '#f30e06';

		var ss = {
			name: data.name,
			type: 'gauge',
			detail: {},
			data: [{ value: current_data, name: txt }],
			splitNumber: ns,
			min: minn,
			max: maxn,
			axisLine: {
				lineStyle: {
				    color: [[cp1, color1], [1, color2]]
				}
			},
			//axisLabel: {
            //    distance:-60
			//},
			itemStyle: {
				normal: {
				    color: color3
				}
			},
			detail: {
				textStyle: {
				    color: color4                    
				}
			}

		}
		if (data.percent == 'true') {
			$.extend(ss.detail, {
				formatter: function (value) {
					return value.toFixed(data.num)+'%';
				}
			})
		}
		else {
			$.extend(ss.detail, {
				formatter: function (value) {
					return value.toFixed(data.num);
				}
			})
		}


		var instance = tp.echartsInstances[op.containerId];


        //表盘指针大小自适应zbc
        //console.log(instance.getWidth())
        var resz = instance.getWidth();
        
        $.extend(ss.detail.textStyle, { fontSize: resz / 20 });
        //刻度值位置调整自适应
        $.extend(ss, { axisLabel: { distance: -50 } });
        //三颜色调整+文字颜色
        if (data.color1) {
            ss.axisLine.lineStyle.color = [[cp1, data.color1], [1, color2]]
        }

        if (data.color2) {
            ss.axisLine.lineStyle.color = [[cp1, color1], [1, data.color2]]
        }

        if (data.color1&&data.color2) {
            ss.axisLine.lineStyle.color = [[cp1, data.color1], [1, data.color2]]
        }

        if (data.color3) {
            ss.itemStyle.normal.color = data.color3;
        }

        if (data.color4) {
            ss.detail.textStyle.color = data.color4;
        }

        echartsOption.series.push(ss);
        echartsOption.tooltip = { formatter: data.formma };



        if (typeof ret.changeFuncs[op.containerId] === 'function') {
            ret.changeFuncs[op.containerId](echartsOption);
        }

        instance.clear();
        instance.setOption(echartsOption);

		jsonExport.storage(op, data, echartsOption);
	}

	ret.click = function (op, func) {
		var instance = tp.echartsInstances[op.containerId];
		instance.on('click', function (params) {
			func(params);
		});
	}

	ret.changeFuncs = {};
	ret.changeEchartsOption = function (op, func) {
		ret.changeFuncs[op.containerId] = func;
	}

	return ret;
})()

var jsonExport = (function () {
	var ret = {};

	ret.data = {};

	ret.storage = function (op, data, echartsOption) {

		ret.data[op.containerId] = {
			op: op,
			data: data,
			option: echartsOption
		};
	}

	ret.bindEvents = function () {
		//导出json数据
		$(document).keydown(function (event) {
			if ((event.altKey && event.keyCode == 74)) {
				downloadJson();
			}
		});
		$(window.top.document).keydown(function (event) {
			if ((event.altKey && event.keyCode == 74)) {
				downloadJson();
			}
		});

		function downloadJson() {
			var aLink = document.createElement('a');
			var content = JSON.stringify(ret.data);
			var blob = new Blob([content]);
			if (navigator.msSaveBlob) {
				navigator.msSaveBlob(blob, 'json.txt');
			} else {
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
				aLink.download = 'json.txt';
				aLink.href = URL.createObjectURL(blob);
				aLink.dispatchEvent(evt);
			}
		}
	}

	return ret;
})()

var tp = (function () {

	var ret = {};

	ret.init = function () {

		if (options.showCvs) {
			cvs.config({
				fake: options.fakeCvs,
				multi: options.multiCvs,
				autoSelectNum: options.autoSelectNum
			})
			cvs.init();
		}

		dst.config({
			type: options.defaultDateType
		})
		dst.init();

		ret.echartsInstances = {};
		for (var i = 0; i < options.charts.length; i++) {
			var c = options.charts[i];
			var obj = echarts.init(document.getElementById(c.containerId));
			ret.echartsInstances[c.containerId] = obj;
		}

		jsonExport.bindEvents();
	}

	ret.bindDrawMethod = function (func) {
		cvs.select(function () {
			func();
		});
		dst.change(function () {
			func();
		})
	}

	ret.bindCvsData = function (arr) {
		if (options.showCvs) {
			cvs.bindData(arr);
		}
	}

	ret.isReady = function () {
		return (!options.showCvs || cvs.ready) && dst.ready;
	}

	return ret;

})();

