/*右键菜单模块*/

define(function (require) {
	var $ = require('jquery');

	var menuConfig = [{
		name: '能耗分析',
		value: '/develop/reports/chart-graph-to-jump/energy-graph-to-jump.html?'
	}, {
		name: '绩效分析',
		value: '/develop/reports/chart-graph-to-jump/kpi-graph-to-jump.html?'
	}, {
		name: '生产分析',
		value: '/develop/reports/chart-graph-to-jump/product-graph-to-jump.html?'
	}];

	var ret = {
		clickHandler: null			//菜单点击事件
	};

	function drawMenu(condition) {
		$('.menuson li').remove();

		for (var i = 0; i < menuConfig.length; i++) {
			var menu = menuConfig[i];
			var li = $("<li></li>");
			var a = $("<a href='javascript:void(0)'></a>");
			a.append(menu.name);
			li.append(a);
			li.attr("value", menu.value);

			$('.menuson').append(li);
			$('.menuson').attr("EnergyMediumID", condition.EnergyMediumID);
			$('.menuson').attr("ModelBaseID", condition.ModelBaseID);
		}

		$('.menuson li').click(function () {
			var li = $(this);
			var name = li.children("a").html();
			var url = $(this).attr("value");
			var modelBaseId = $('.menuson').attr("ModelBaseID");
			var energyMediumID = $('.menuson').attr("EnergyMediumID");
			$('.rightmenu').addClass("hide");

			if (typeof ret.clickHandler !== 'function') return;

			ret.clickHandler(url, name, modelBaseId, energyMediumID);
		})

		$('body').click(function (event) {
			var e = event || window.event;
			if (!($('.rightmenu').hasClass("hide"))) {
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				else {
					e.cancelBubble = true;
				}
				$('.rightmenu').addClass("hide");
			}
		})

		$('.rightmenu').removeClass("hide").css({ "left": event.clientX, "top": event.clientY });
	}

	ret.init = function (condition) {
		drawMenu(condition);
	}

	ret.click = function (func) {
		this.clickHandler = func;
	}

	return ret;
})