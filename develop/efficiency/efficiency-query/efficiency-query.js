var Page = {
	init: function () {
		var that = this;

		// 初始化MyGrid
		//this.my_grid = new MyGrid(this, this.my_grid_config);

		// 页面加载后先查询一次
		//this.my_grid.query();

		//that.my_grid.query({ MeasurePropertyName: '', ModelBaseID: '' });
		$.ajax({
			url: '/api/EngeryMeasureProperty/GetPage?MeasurePropertyName=&ModelBaseID=',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				console.log(data.Models)
				var tr = new Array();
				for (i in data.Models) {
					tr[i] = data.Models[i]
				};

				var td = new Array();
				for (i in tr) {
					td[i] = tr[i];

					td[i][0] = tr[i].DESCRIPTIONINFO;
					td[i][1] = tr[i].ModelBaseID;
					td[i][2] = tr[i].ModelBaseName;
					td[i][3] = tr[i].MeterPointName;
					td[i][4] = tr[i].MeasurePropertyCalcFormula;
					td[i][5] = tr[i].MeasurePropertyClass;
					td[i][6] = tr[i].MeasurePropertyID;
					td[i][7] = tr[i].MeasurePropertyName;
					td[i][8] = tr[i].MeasurePropertyTime;
					td[i][9] = tr[i].MeasurePropertyType;
					td[i][10] = tr[i].MeterPointID;
					td[i][11] = tr[i].MeterPointName;
				}
				console.log(td);

				//var ttr = $('td');
				//var ttd = $('<td></td>') + td;
				//ttr.append(ttd);
				for (var i = 0; i < data.Models.length; i++) {
					var id = 'table1tr' + (i + 1).toString();
					var trr = $('#' + id);
					for (var j = 0; j < 11; j++) {
						var d = td[i][j];
						var tdd = $('<td>');
						tdd.html(d);
						trr.append(tdd);
					}
				}
			}
		})

		that.tree_init()
	},

	my_tree: null,

	tree_config: {
		url: '/api/FactoryModelbase/GetTree',
		root_name: '能源工厂',
		id_field: 'ModelBaseId',
		name_field: 'ModelBaseName',
        appendRoot: true
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
			//that.my_tree.reset();
			//that.current_tree_select_id = 'root';
			//that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: 'root' });
		});
	},
	//****************************树节点点击事件*******************************************8

	tree_node_click: function (id) {
		var that = this;
		//this.current_tree_select_id = id;

		//this.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: id });

		//$('#EnergyMediumName').val('').html('');

		//that.prepare_select_source1();

		//$('#ModelBaseName').val(this.my_tree.current_select_name);

		//$('#EnergyMedium').val('');
		//$('#EnergyMediumName').val('');
		//$('#MonitorInfoPath').val('');
		//$('#DESCRIPTIONINFO').val('');
	}
};