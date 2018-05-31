var Page = {
	/* 当前在树中选中的Id */
	current_tree_select_id: 'root',

	/* 当前的年月 */
	current_ym: null,

	init: function () {
		laydate({
			elem: '#search-month',
			istime: false,
			ismonth: true,
			format: 'YYYY-MM'
		})

		var that = this;

		// 默认选择本月
		var now = new Date();
		var ymd = parseDate(now);
		that.current_ym = {
			year: ymd.year,
			month: ymd.month,
			strYear: ymd.strYear,
			strMonth: ymd.strMonth
		};

		$('#search-month').val(ymd.strYear + '-' + ymd.strMonth);

		// 绑定查询按钮事件
		$('#query').click(function () {
			that.query();
		});

		this.tree_init();
	},

	query: function () {
		var that = this;
		var ym = this.get_ym_from_search_input();

		if (!ym) {
			Util.alert('月份格式不正确');
			return;
		}

		var modelBaseId = that.current_tree_select_id;
		if (modelBaseId == 'root') {
			Util.alert('请选择工厂模型节点');
			return;
		}

		that.current_ym = ym;

		$('#table-container1').hide();

		var condition = {
			ofs: 0,
			ps: 8,
			sort_column: '',
			sort_desc: false,
			modelBaseId: modelBaseId,
			CalculateMonth: ym.strYear + '-' + ym.strMonth
		};

		$.ajax({
			url: '/api/EngeryKpirecord/GetPage',
			method: 'get',
			data: condition,
			dataType: 'json',
			success: function (data) {
				$('#table-container1 tr').remove();
				drawTable(data);
				$('#table-container1').show();
			}
		})
	},

	// 从输入框获得年月日
	get_ym_from_search_input: function () {
		var str = $('#search-month').val();
		var arr = str.split('-');
		var strYear = arr[0];
		var strMonth = arr[1];

		var year = parseInt(strYear);
		var month = parseInt(strMonth);

		if (typeof strYear == 'string' && typeof strMonth == 'string'
			&& typeof year == 'number' && typeof month == 'number') {
			var obj = {
				strYear: strYear,
				strMonth: strMonth,
				year: year,
				month: month,
			};
			return obj;
		}
	},

	my_tree: null,

	tree_config: {
		url: '/api/FactoryModelbase/GetTree',
		root_name: '能源工厂',
		id_field: 'ModelBaseId',
		name_field: 'ModelBaseName'
	},

	tree_init: function () {
		var that = this;

		// 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
		this.my_tree = new MyTree(this, this.tree_config);

		// 绑定树节点点击方法
		this.my_tree.bind_node_click_event_handler(this.tree_node_click);

		// 查询树
		this.my_tree.query();

		// 刷新按钮
		$('#refresh').click(function () {
			that.my_tree.reset();
			that.current_tree_select_id = 'root';
			that.query();
		});
	},

	tree_node_click: function (id) {
		this.current_tree_select_id = id;
		this.query();
	},
};

function parseDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var strYear = year;
	var strMonth = month;
	var strDay = day;

	if (month >= 1 && month <= 9) {
		strMonth = "0" + strMonth;
	}
	if (strDay >= 0 && strDay <= 9) {
		strDay = "0" + strDay;
	}
	var obj = {
		year: year,
		month: month,
		day: day,
		strYear: strYear,
		strMonth: strMonth,
		strDay: strDay
	}
	return obj;
}

function drawTable(data) {
	var tr, th, td;
	var table = $('#table-container1 table')

	if (!data.Models || !data.Models[0]) {
		tr = $("<tr></tr>");
		table.append(tr);

		td = $("<td class='nodata'></td>")
		td.html('没有查询到任何数据')
		tr.append(td);
		return;
	}

	// 表头
	var head1 = $("<tr></tr>");
	var head2 = $("<tr></tr>");

	table.append(head1);
	table.append(head2);

	// 固定的列
	th = $("<th rowspan='2'>绩效指标</th>")   // EngeryKPIName
	th.css('min-width', '150px');
	head1.append(th);

	th = $("<th rowspan='2'>厂内指标值</th>")   // BaseValue
	th.css('min-width', '130px');
	head1.append(th);

	th = $("<th rowspan='2'>目标值</th>") // TargetValue
	th.css('min-width', '100px');
	head1.append(th);

	th = $("<th rowspan='2'>目标(%)</th>") // TargetRatio
	th.css('min-width', '100px');
	head1.append(th);

	// 读取第一行
	var firstLine = data.Models[0];

	// 根据第一行的数据，创建动态的列
	var days = firstLine.DaySequence;

	for (var i in days) {
		var day = days[i];

		th = $("<th colspan='2'></th>");
		th.html(day);
		head1.append(th);

		th = $("<th>实际指标</th>")
		th.css('min-width', '100px');
		head2.append(th);

		th = $("<th>实现</th>")
		th.css('min-width', '100px');
		head2.append(th);
	}

	// 开始填充数据
	for (var i in data.Models) {
		var line = data.Models[i];

		tr = $("<tr></tr>");
		table.append(tr);

		td = $("<td></td>");
		td.html(line.EngeryKPIName);
		tr.append(td);

		td = $("<td></td>");
		td.html(toFixed(line.BaseValue));
		tr.append(td);

		td = $("<td></td>");
		td.html(toFixed(line.TargetValue));
		tr.append(td);

		td = $("<td></td>");
		td.html(toFixed(line.TargetRatio));
		tr.append(td);

		days = line.DaySequence;
		var arr1 = line.ActualKPIValue;
		var arr2 = line.ActualKPIRatio;
		for (var j in days) {
			td = $("<td></td>");
			td.html(toFixed(arr1[j]));
			tr.append(td);

			td = $("<td></td>");
			td.html(toFixed(arr2[j]));
			tr.append(td);
		}
	}
}

function toFixed(str, c) {
	c = c || 2;

	if (!_.isNumber(str)) {
		return '';
	}

	var n = parseFloat(str);
	var ret = n.toFixed(2)
	return '' + ret;
}