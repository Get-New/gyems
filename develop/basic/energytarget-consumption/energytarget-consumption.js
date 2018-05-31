var Page = {
	my_grid: null,

	/*弹出框*/
	//my_grid_unit: null,

	/* 当前在树中选中的Id */
	current_tree_select_id: '',

	/* 编辑区正在显示 */
	right_panel_showing: false,

	my_grid_config: function () {
		return {
			store_config: {
				fields: [
					'ModelBaseName',
					'UnitMeasureName',
					'EfficaciousId',
					'EfficaciousName',
					'EfficaciousCode',
					'EfficaciousUnit',
					'ModelBaseId',
					'EnergyMediumId',
					'ProductBaseId',
					'EfficaciousType',
					'DescriptionInfo',
					'LastmodifyTime',
					'BusinessSort',
					'MeasurePropertyName'
				]
			},

			grid_config: {
				autoScroll: true,
				columns: {
					defaults: {
						flex: 0
					},
					items: [{
						text: '工厂部门',
						dataIndex: 'ModelBaseName',
						width: 200
					}, {
						text: '绩效报警单元',
						dataIndex: 'EfficaciousName',
						width: 200
					}, {
						text: '绩效单位',
						dataIndex: 'UnitMeasureName',
						width: 200
					}, {
						text: '统计单元',
						dataIndex: 'MeasurePropertyName',
						width: 200
					}, {
						text: '单元主键',
						dataIndex: 'EfficaciousCode',
						width: 200
					}, {
						text: '备注',
						dataIndex: 'DescriptionInfo',
						flex: 0.6
					}]
				}
			},

			url: '/api/BasicEfficacious/GetPageWithFactory',
			ps: 8,
			show_delete_column: true,
			row_select_handler: 'on_grid_row_selected',
			dblclick_handler: 'on_grid_dblclicked',
			delete_handler: 'on_grid_row_delete_clicked'
		}
	},

	init: function () {
		var that = this;

		//模态窗口初始化
		var modeldiv = window.top.document.createElement("div");
		modeldiv.setAttribute('class', 'opacity-div-for-modelwin');
		modeldiv.setAttribute('hidden', '');
		var pdivs = document.getElementsByTagName('div');
		var pos = pdivs[0];
		function insert(newel, elpos) {
			var parent = document.body;
			parent.insertBefore(newel, elpos);
		}
		insert(modeldiv, pos);

		// 初始化MyGrid
		this.my_grid = new MyGrid(this, this.my_grid_config());

		// 绑定查询按钮事件
		$('#query').click(function () {
			that.my_grid.query({ ModelBaseId: that.current_tree_select_id, EfficaciousType: '绩效报警' });
			that.clear();
		});

		// 绑定编辑按钮事件
		$('#add').click(function () {
			that.on_btn_add_clicked();
		});

		//form添加
		$('#submit-add').click(function () {
			that.submit_add();
		});

		//form修改
		$('#submit-edit').click(function () {
			that.submit_edit('edit');
		});

		// 页面加载后立即查询一次的函数，用于回调
		that.my_grid.query({ ModelBaseId: that.current_tree_select_id, EfficaciousType: '绩效报警' });

		//初始化下拉框数据源（传入回调函数）
		//this.prepare_select_source();

		$('#search-unit').click(function () {
			that.prepare_select_source_EfficaciousUnit();
		})

		// 导出excel
		$('#export').click(function () {
			that.my_grid.exportExcel('绩效单元管理');
		})

		//显示window
		$('#edit_MeasurePropertyName').click(function () {
			that.window_open();
		});

		//显示window
		$('#edit_EfficaciousCode').click(function () {
			that.window_open();
		});

		this.prepare_window_event();

		this.tree_init();
		this.right_panel_init();
		this.my_form_init();
		this.prepare_select_source_EfficaciousUnit();

		//var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
		//this.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);

		//初始化表单
		this.clear();
	},

	// 准备 计量单位 下拉框的数据源
	prepare_select_source_EfficaciousUnit: function () {
		$('#EfficaciousUnit').val('').html('');

		$.ajax({
			url: '/api/UnitMeasure/GetList',
			type: 'get',
			dataType: 'json',
			//data:{ UnitClassId: '', UnitMeasureName: ''},
			success: function (data) {
				if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
					//Util.alert('加载能源单位失败');
					return;
				}

				var EnergyUnitList = data.Models;

				if (!EnergyUnitList || !EnergyUnitList.length) {
					$('#EfficaciousUnit').append("<option value='-1'>没有绩效单位可供选择</option>");
					$('#EfficaciousUnit').attr("disabled", "disabled");
					return;
				}

				for (var i in EnergyUnitList) {
					var item = EnergyUnitList[i];
					var option = $('<option>').val(item.UnitmeasureId).html(item.UnitmeasureName);
					$('#EfficaciousUnit').append(option);
				}

				$('#EfficaciousUnit').val('');
			}
		})
	},

	on_grid_row_delete_clicked: function (record) {
		var that = this;
		var data = { EfficaciousId: record.EfficaciousId };

		Util.ajax_delete({
			data: data,
			model: 'BasicEfficacious',
			confirm_msg: function () {
				return '确认要删除该条记录吗?';
			},
			success: function () {
				that.my_grid.reload();
			}
		});
	},

	submit_add: function () {
		var that = this;
		$('#EfficaciousType').val('绩效报警');
		var data = this.my_form.serialize_data();
		Util.ajax_add({
			data: data,
			validator: that.validate_add,
			model: 'BasicEfficacious',
			success: function () {
				that.my_grid.reload();
			}
		});
	},

	submit_edit: function () {
		var that = this;

		var row = that.my_grid.get_last_selected();

		if (!row || !row.data) {
			Util.alert('请先选择一行记录');
			return;
		}

		var data = this.my_form.serialize_data();
		Util.ajax_edit({
			data: data,
			validator: that.validate,
			model: 'BasicEfficacious',
			success: function () {
				that.my_grid.reload();
			}
		});
	},

	validate_add: function (data) {
		if (!data.ModelBaseId) {
			return '请选择工厂部门';
		}
		return Page.validate(data);
	},

	validate: function (data) {
		if (!data.EfficaciousUnit) {
			return "请选择绩效单位";
		}
	},

	on_grid_row_selected: function (data, index) {
		var that = this;
		that.clear();

		this.prepare_select_source_ModelBaseID_1(data.ModelBaseId);
		this.right_panel.set_arrow_position(index);
		this.my_form.load_data(data);
	},

	on_grid_dblclicked: function () {
		var that = this;

		var callback = function () {
			that.my_grid.refresh_view();
		}

		this.right_panel.toggle_right_panel(callback);
	},

	on_btn_add_clicked: function () {
		var that = this;
		that.clear();

		var callback = function () {
			that.my_grid.refresh_view();
		}
		this.right_panel.show_right_panel(callback);
	},

	clear: function () {
		this.my_grid.clear_selection();
		$('.right-content form input').val('');
		$('.right-content form select').val('');
	},

	right_panel: null,

	right_panel_config: {
		selectors: {
			main_content: '.main-content',
			right_content: '.right-content',
		}
	},

	right_panel_init: function () {
		var that = this;

		this.right_panel = new RightPanel(this.right_panel_config);

		// 右侧框的关闭事件
		$('.close-button').click(function () {
			var callback = function () {
				that.my_grid.grid.getView().refresh()
			}
			that.right_panel.hide_right_panel(callback);
		})
		//$('.close-button').click(function () {
		//    var callback = function () {
		//        that.my_grid.grid.getView().refresh()
		//    }
		//    //that.right_panel.hide_right_panel(function () { that.my_grid.grid.getView().refresh() });
		//})
	},

	my_form: null,

	my_form_config: {
		selector: 'form',
	},

	my_form_init: function () {
		var that = this;

		// 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
		this.my_form = new MyForm(this, this.my_form_config);
	},

	my_tree: null,

	tree_config: {
		url: '/api/FactoryModelbase/GetTreeLevel2',
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
			that.clear();
			that.my_tree.reset();
			that.current_tree_select_id = '';
			that.my_grid.query({ ModelBaseId: '', EfficaciousType: '绩效报警' });
		});
	},

	tree_node_click: function (id, name) {
		this.clear();
		this.current_tree_select_id = id || "";
		if (id == 'root') id = '';
		$('#ModelBaseId').val(this.current_tree_select_id);
		$('#ModelBaseName').val(name);
		this.my_grid.query({ ModelBaseId: id, EfficaciousType: '绩效报警' });
		this.prepare_select_source_EfficaciousUnit();
	},

	ModelBaseID_1_onchange: function () {
		var that = this;
		that.prepare_select_source_ModelBaseID_2($('#ModelBaseID_1').val());
	},

	// 准备筛选工序下拉框的数据源
	prepare_select_source_ModelBaseID_1: function (ModelBaseID) {
		$('#ModelBaseID_1').val('').html('');
		$('#ModelBaseID_2').val('').html('');

		$.ajax({
			url: '/api/FactoryModelbase/GetPage',
			type: 'get',
			dataType: 'json',
			async: false,
			data: { ModelBaseName: '', RootId: ModelBaseID },
			success: function (data) {
				if (!data.Models || !data.Models.length) {
					$('#ModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
					return;
				}
				for (var i in data.Models) {
					var item = data.Models[i];
					var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
					$('#ModelBaseID_1').append(option);
				}
			}
		})
	},

	// 准备筛选子工序下拉框的数据源
	prepare_select_source_ModelBaseID_2: function (ModelBaseID) {
		$('#ModelBaseID_2').val('').html('');

		$.ajax({
			url: '/api/FactoryModelbase/GetPage',
			type: 'get',
			dataType: 'json',
			async: false,
			data: { ModelBaseName: '', RootId: ModelBaseID },
			success: function (data) {
				if (!data.Models || !data.Models.length) {
					$('#ModelBaseID_2').append("<option value='-1'>没有选项可供选择</option>");
					return;
				}

				var option = $('<option>').val('').html('');
				$('#ModelBaseID_2').append(option);

				for (var i in data.Models) {
					var item = data.Models[i];
					var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
					$('#ModelBaseID_2').append(option);
				}

				$('#ModelBaseID_2').val('');
			}
		})
	},

	//准备 统计单元 的下拉框数据源
	prepare_select_source_MeasurePropertyName: function (ModelBaseID, EnergyMediumID) {
		$('#MeasurePropertyName_W').val('').html('');

		$.ajax({
			url: '/api/EngeryMeasureProperty/GetNewPage',
			type: 'get',
			dataType: 'json',
			data: { ModelBaseID: ModelBaseID, EnergyMediumID: EnergyMediumID },
			success: function (data) {
				var MeasureProperty = data.Models;

				if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
					return;
				}

				if (!MeasureProperty || !MeasureProperty.length) {
					return;
				}

				for (var i in MeasureProperty) {
					var item = MeasureProperty[i];
					var option = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
					$('#MeasurePropertyName_W').append(option);
				}

				//$('#MeasurePropertyName_W').val('');
			}
		})
	},

	prepare_window_event: function () {
		var that = this;

		// 统计单元 选定
		$('#select_measureproperty').click(function () {
			$('#DESCRIPTIONINFO_W').append($('#MeasurePropertyName_W option:selected').text());
			$('#MeasurePropertyCalcFormula_W').append($('#MeasurePropertyName_W').val());
		});

		// 清空 点击
		$('#clear_formula').click(function () {
			$('#DESCRIPTIONINFO_W').empty();
			$('#MeasurePropertyCalcFormula_W').empty();
		});

		// 保存 点击
		$('#window-save').click(function () {
			$('#EfficaciousCode').val($('#MeasurePropertyCalcFormula_W').val());
			$('#MeasurePropertyName').val($('#DESCRIPTIONINFO_W').val());

			that.window_close();
		});

		// 取消 点击
		$('#window-cancel').click(function () {
			that.window_close();
		});
	},

	Formula_Check: function () {
	},

	window_open: function () {
		var ModelBaseId = $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val() ? $('#ModelBaseID_1').val() : $('#ModelBaseId').val();
		var EnergyMediumId = ''; //$('#EnergyMediumId').val();
		if (!ModelBaseId) {
			Util.alert('请先进行筛选');
			return false;
		}
		//if (!EnergyMediumId) {
		//    Util.alert('请选择能源介质');
		//    return false;
		//}

		$('#MeasurePropertyCalcFormula_W').val($('#EfficaciousCode').val());
		$('#DESCRIPTIONINFO_W').val($('#MeasurePropertyName').val());

		Page.prepare_select_source_MeasurePropertyName(ModelBaseId, EnergyMediumId);

		$('.window').fadeIn(50);

		$('.opacity-div-for-modelwin').show()
	},

	window_close: function () {
		$('.window').hide();

		$('.opacity-div-for-modelwin').hide()

		$('#DESCRIPTIONINFO_W').empty();
		$('#MeasurePropertyCalcFormula_W').empty();
		$('#MeasurePropertyName_W').val('').html('');
	},
}