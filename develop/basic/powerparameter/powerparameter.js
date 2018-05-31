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
					'BusinessSort'
				]
			},

			grid_config: {
				autoScroll: true,
				columns: {
					defaults: {
						flex: 0
					},
					items: [{
						text: '调度单元',
						dataIndex: 'EfficaciousName',
						width: 200
					}, {
						text: '调度编码',
						dataIndex: 'EfficaciousCode',
						width: 200
					}, {
						text: '功率单位',
						dataIndex: 'UnitMeasureName',
						width: 200
					}, {
						text: '排序',
						dataIndex: 'BusinessSort',
						width: 120
					}, {
						text: '备注',
						dataIndex: 'DescriptionInfo',
						flex: 0.6
					}]
				}
			},

			url: '/api/BasicEfficacious/GetPageWithName',
			ps: 8,
			show_delete_column: true,
			row_select_handler: 'on_grid_row_selected',
			dblclick_handler: 'on_grid_dblclicked',
			delete_handler: 'on_grid_row_delete_clicked'
		}
	},

	init: function () {
		var that = this;

		// 初始化MyGrid
		this.my_grid = new MyGrid(this, this.my_grid_config());

		// 绑定查询按钮事件
		$('#query').click(function () {
			that.my_grid.query({ EfficaciousName: $('#search-Name').val(), EfficaciousType: '动力调度' });
			that.clear();
		});

		// 绑定添加按钮事件
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
		that.my_grid.query({ EfficaciousName: $('#search-Name').val(), EfficaciousType: '动力调度' });

		//初始化下拉框数据源（传入回调函数）
		//this.prepare_select_source();

		$('#search-unit').click(function () {
			that.prepare_select_source_EfficaciousUnit();
		})

		// 导出excel
		$('#export').click(function () {
			that.my_grid.exportExcel('调度单元管理');
		})

		this.right_panel_init();
		this.my_form_init();
		this.prepare_select_source_EfficaciousUnit();

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
					$('#EfficaciousUnit').append("<option value='-1'>没有调度单位可供选择</option>");
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
		$('#EfficaciousType').val('动力调度');
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
		return Page.validate(data);
	},

	validate: function (data) {
		if (!data.EfficaciousUnit) {
			return "请选择调度单位";
		}
	},

	on_grid_row_selected: function (data, index) {
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
		//this.clear();

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
	}
}