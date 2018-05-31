var modelBaseId;
var endTime = new Date();
var timeInterval = 8.00;

var options = (function () {
	var ret = {};

	// 是否在顶部选择项目
	ret.showCvs = true;

	// 是否允许多选
	ret.multiCvs = false;

	// 自动选择多少项
	ret.autoSelectNum = 1;

	// 默认时间类型（可选year、month、day）
	ret.defaultDateType = 'month';

	// 图表(可能有多个)
	ret.charts = [{
		// 容器的id
		containerId: 'window_chart1',
	}];

	return ret;
})();

var apiCaller = (function () {
    var ret = {};

    ret.get = function (callback) {
        $.ajax({
            url: '/api/ElectrolyticFlow/GetElectrolyticFlowAll',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                //data = {
                //    Models: [{
                //        k1: 9.3,
                //        w1: 23241,
                //        k2: 9.3,
                //        w2: 23241,
                //        k3: 9.3,
                //        w3: 23241,
                //        k4: 9.3,
                //        w4: 23241,
                //        arr1: [],
                //        arr2: []
                //    }]
                //};

                //for (var i = 0 ; i < 12; i++) {
                //    data.Models[0].arr1.push({
                //        ModelBaseId: i.toString(),
                //        ModelBaseName: '测试工序' + i,
                //        State: true,
                //        k: 9.47,
                //        w: 50276
                //    })
                //    data.Models[0].arr2.push({
                //        ModelBaseId: i.toString(),
                //        ModelBaseName: '测试工序' + i,
                //        State: true,
                //        k: 9.47,
                //        w: 50276
                //    })
                //}

                if (typeof callback === 'function') {
                    callback(data);
                }
            }
        })
    }

    return ret;
})();

var echartsConfig = (function () {
	var config = {};

	config.intervalEnlarge = function () {
		timeInterval = timeInterval / 2;
		if (timeInterval < 1) {
			timeInterval = 1;
		}
	}

	config.intervalReduce = function () {
		timeInterval = timeInterval * 2;
	}

	config.endEnlarge = function () {
		//var date = new Date();
		endTime.setTime(Date.parse(endTime) + 8 * 3600 * 1000);
	}

	config.endReduce = function () {
		//var date = new Date();
		endTime.setTime(Date.parse(endTime) - 8 * 3600 * 1000);
	}

	config.reset = function () {
		endTime = new Date();
		timeInterval = 8.00;
	}

	config.getData = function (modelBaseID,callback) {
		var startTime = new Date();
		startTime.setTime(Date.parse(endTime) - timeInterval * 3600 * 1000);
		$.ajax({
			url: '/api/ElectrolyticFlow/GetELineData',
			type: 'get',
			dataType: 'json',
			data:{
				ModelBaseID:modelBaseID,
				startTime:startTime.Format("yyyy-MM-dd hh:mm:ss"),
				endTime:endTime.Format("yyyy-MM-dd hh:mm:ss")
			},
			success: function (data) {
				if (typeof callback === 'function') {
					callback(data.Models[0]);
				}
			}
		})
	}

	return config;
})();

drawer.idField = 'ModelBaseId';

drawer.drawBoxInner(function (innerEl, data) {
    var img = $("<img class='icon' src='/images2/flow-icon1.png'>");
    innerEl.append(img);

    var title = $("<div class='title'></div>");
    title.html(data.ModelBaseName);
    innerEl.append(title);

    drawSub(innerEl, 'wsub', '有功功率:', data.w + 'kw');
    drawSub(innerEl, 'ksub', '功率因数:', data.k);
})

drawer.refreshBoxData(function (boxEl, data) {
    var selectorw = ".wsub .sub-value";
    var selectork = ".ksub .sub-value";

    setvalue($(selectorw, boxEl), data.w, 'kw');
    setvalue($(selectork, boxEl), data.k);
})

drawer.click(function (id) {
    window.location.href = '/develop/reports/energyImage/electric-direction/energyImageSub.html?id0=' + id;
})

function drawSub(inner, cls, text, value) {
    var sub = $("<div class='sub'></div>");
    sub.addClass(cls);
    inner.append(sub);

    var subName = $("<span class='sub-name'></span>");
    subName.html(text);
    sub.append(subName);

    var subValue = $("<span class='sub-value'></span>");
    subValue.html(value);
    sub.append(subValue);
}

$(function () {
	init();

	tp.init();
	//弹出框配置
	mywin.config({
		//width: 1250,
		//height: 650,
		selector: '#window',
		windowId: 'window'
	});
	mywin.init();

	//区间+
	$('#interval-enlarge').click(function () {
		echartsConfig.intervalEnlarge();
		writeInterval(timeInterval);
		echartsConfig.getData(modelBaseId, drawEcharts);
	});

	//区间-
	$('#interval-reduce').click(function () {
		echartsConfig.intervalReduce();
		writeInterval(timeInterval);
		echartsConfig.getData(modelBaseId, drawEcharts);
	});

	//结束时间-
	$('#end-reduce').click(function () {
		echartsConfig.endReduce();
		writeInterval(timeInterval);
		echartsConfig.getData(modelBaseId, drawEcharts);
	});

	//结束时间+
	$('#end-enlarge').click(function () {
		echartsConfig.endEnlarge();
		writeInterval(timeInterval);
		echartsConfig.getData(modelBaseId, drawEcharts);
	});

	//重置
	$('#reset').click(function () {
		echartsConfig.reset();
		writeInterval(timeInterval);
		echartsConfig.getData(modelBaseId, drawEcharts);
	})

	//窗口关闭事件
	$(".opacity-div-for-modelwin").click(function () {
		mywin.close();
	});
});

//绑定右键点击事件
function bindRClick() {
	$('.inner').bind('contextmenu', function (e) {
		var e = e || window.event;
		modelBaseId = $(this).attr('boxId');
		var modelBaseName = $(this).children(".title").html();
		var level = $(this).attr('level');

		if (2 == e.button) {
			e.preventDefault();
			if (level == '3') {
				$('#window .window-title h3').eq(0).html(modelBaseName);
				$('#window_chart1').show();
				linechart.clear(options.charts[0]);
				mywin.open();
				writeInterval(timeInterval);
				echartsConfig.getData(modelBaseId, drawEcharts);
			}
			else {
				e.preventDefault();
				prepare_menu(modelBaseName, modelBaseId, level);
				$('.rightmenu').removeClass("hide").css({ "left": e.clientX, "top": e.clientY });
			}
			//$('#window .window-title h3').eq(0).html(modelBaseName);
			//$('#window_chart1').show();
			//linechart.clear(options.charts[0]);
			//mywin.open();
			//writeInterval(timeInterval);
			//echartsConfig.getData(modelBaseId, drawEcharts);

		}
	});

	$('.inner.link').bind('contextmenu', function (e) {
		modelBaseId = $(this).attr('boxId');
		var modelBaseName = $(this).children(".title").html();
		var level = $(this).attr('level');

		if (2 == e.button) {
			e.preventDefault();
			if (level == '3') {
				$('#window .window-title h3').eq(0).html(modelBaseName);
				$('#window_chart1').show();
				linechart.clear(options.charts[0]);
				mywin.open();
				writeInterval(timeInterval);
				echartsConfig.getData(modelBaseId, drawEcharts);
			}
			else {
				prepare_menu(modelBaseName, modelBaseId, level);
				$('.rightmenu').removeClass("hide").css({ "left": e.clientX, "top": e.clientY });
			}
			//$('#window .window-title h3').eq(0).html(modelBaseName);
			//$('#window_chart1').show();
			//linechart.clear(options.charts[0]);
			//mywin.open();
			//writeInterval(timeInterval);
			//echartsConfig.getData(modelBaseId, drawEcharts);
		}
	});
}

function writeInterval(data) {
	$('#time-interval').html(data + 'hours');
}

function drawEcharts(data) {
	if (data) {
		data.leftYMin = 0;
		linechart.draw(options.charts[0], data);
	}
}


function prepare_menu(modelBaseName, modelBaseId, level) {
	var menus;
	if (level == '3') {
		menus = [{
			name: '趋势图',
			value: 'chart'
		}]
	}
	else {
		menus = [{
			name: '趋势图',
			value: 'chart'
		}, {
			name: '能源消耗',
			value: 'energyConsume'
		}, {
			name: '能耗分析',
			value: 'energyAnalyse'
		}, {
			name: '绩效分析',
			value: 'performanceAnalyse'
		}, {
			name: '能源成本',
			value: 'energyCost'
		}];
	}
	$('.menuson li').remove();

	for (var i = 0; i < menus.length; i++) {
		var menu = menus[i];
		var li = $("<li></li>");
		var a = $("<a href='javascript:void(0)'></a>");
		a.append(menu.name);
		li.append(a);
		li.attr("value", menu.value);

		$('.menuson').append(li);
		$('.menuson').attr("modelBaseName", modelBaseName);
		$('.menuson').attr("modelBaseId", modelBaseId);
	}

	$('.menuson li').click(function () {
		var li = $(this);
		var name = $(this).attr("value");
		var modelBaseId = $('.menuson').attr("modelBaseId");

		if (name == 'chart') {
			$('.rightmenu').addClass("hide");
			$('#window .window-title h3').eq(0).html(modelBaseName);
			$('#window_chart1').show();
			linechart.clear(options.charts[0]);
			mywin.open();
			writeInterval(timeInterval);
			echartsConfig.getData(modelBaseId, drawEcharts);
		}

		else {
			$('.rightmenu').addClass("hide");
			window.location.href = energyMenuConfig[name][modelBaseId] + 'timestamp:' + (+new Date()) + ';isBack:true';
			parent.document.getElementsByName(window.name)[0].src = energyMenuConfig[name][modelBaseId] + 'timestamp:' + (+new Date()) + ';isBack:true';
		}
	})

	$('body').click(function (e) {
		if (!($('.rightmenu').hasClass("hide"))) {
			e.preventDefault();
			$('.rightmenu').addClass("hide");
		}
	})
}

function init() {
    apiCaller.get(function (data) {
    	draw(data);
    	bindRClick();
        setTimeout(refresh, 10000);
    })

    function refresh() {
        apiCaller.get(function (data) {
            refreshData(data);
            setTimeout(refresh, 10000);
        })
    }
}

function draw(data) {
    if (!data || !data.Models || data.Models.length < 1) return;
    setkw(data.Models[0]);
    drawer.draw('#div1', data.Models[0].arr1);
    drawer.draw('#div2', data.Models[0].arr2);
}

function refreshData(data) {
    if (!data || !data.Models || data.Models.length < 1) return;
    setkw(data.Models[0]);
    drawer.refresh('#div1', data.Models[0].arr1);
    drawer.refresh('#div2', data.Models[0].arr2);
}

function setkw(data) {
    setvalue($('#box1a .wsub .sub-value'), data.w1, 'kw');
    setvalue($('#box1a .ksub .sub-value'), data.k1);
    setvalue($('#box1b .wsub .sub-value'), data.w2, 'kw');
    setvalue($('#box1b .ksub .sub-value'), data.k2);
    setvalue($('#box2a .wsub .sub-value'), data.w3, 'kw');
    setvalue($('#box2a .ksub .sub-value'), data.k3);
    setvalue($('#box2b .wsub .sub-value'), data.w4, 'kw');
    setvalue($('#box2b .ksub .sub-value'), data.k4);
}

function setvalue(el, value, unit) {
    if (typeof value === 'number') {
        el.html(value + (unit || ''));
    } else {
        el.html('---');
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}