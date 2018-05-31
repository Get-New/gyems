var Page = {
	my_grid: null,

	/* 当前树种选中的Id */
	current_tree_select_id: '',

	/* 编辑区初始显示状态 */
	right_panel_showing: false,

	my_grid_config: function () {
		return {
			store_config: {
				fields: [
					'EngeryKPIID',
					'ModelBaseID',
					'ModelBaseName',
					'EngeryKPIParamID',
					'EngeryKPIName',
					'EngeryKPIBaseValue',
					'EngeryKPIValue',
					'EngeryKPITargetValue',
					'EngeryKPITargetRatio',
					'UnitMeasureID',
					'UnitMeasureName',
					'DescriptionInfo'
				]
			},

			grid_config: {
				columns: {
					defaults: {
						flex: 0
					},
					items: [
						//{ text: '序号', dataIndex: 'UnitMeasureID', width: 100 },
						{ text: '指标名称', dataIndex: 'EngeryKPIName', width: 200 },
						{ text: '车间名称', dataIndex: 'ModelBaseName', width: 200 },
						{ text: '单位', dataIndex: 'UnitMeasureName', width: 200 },
						{ text: '国家标准值', dataIndex: 'EngeryKPIBaseValue', width: 200 },
						{ text: '厂内标准值', dataIndex: 'EngeryKPIValue', width: 200 },
						{ text: '目标值', dataIndex: 'EngeryKPITargetValue', width: 200 },
						{ text: '目标（%）', dataIndex: 'EngeryKPITargetRatio', width: 200 },
						{ text: '描述', dataIndex: 'DescriptionInfo', width: 300 }
					]
				}
			},

			url: '/api/EngeryKPI/GetPage',
			ps: 8,
			show_delete_column: true,
			row_select_handler: 'on_grid_row_selected',
			dblclick_handler: 'on_grid_dblclicked',
			delete_handler: 'on_grid_row_delete_clicked'
		}
	},

	init: function () {
		var that = this;

		//初始化的MyGrid
		this.my_grid = new MyGrid(this, this.my_grid_config());

		//查询按钮
		$('#query').click(function () {
			that.my_grid.query({
				ModelBaseID: that.current_tree_select_id, EngeryKPIName: $('#search-name').val(), EngeryKPIID: ''
			});
		});

		//添加按钮
		$('#add').click(function () {
			that.on_btn_add_clicked();
		});

		//form添加
		$('#submit-add').click(function () {
			//Page.get_basevalue();

			//setTimeout(temp, 200);
			//function temp() {
			//	that.submit_add();
			//}
			that.submit_add();
		});

		//form修改
		$('#submit-edit').click(function () {
			//Page.get_basevalue();

			//setTimeout(temp, 200);
			//function temp() {
			//	that.submit_edit('edit');
			//}
			that.submit_edit('edit');
		});

		//form查询指标名称
		$('#search-kpiparam').click(function () {
			$('#EngeryKPIBaseValue').val('');
			Page.prepare_select_source();
		});

		//form获得基准值
		//$('#search-basevalue').click(function () {
		//	Page.get_basevalue();
		//});

	    // 导出excel
		$('#export').click(function () {
		    that.my_grid.exportExcel('绩效指标');
		})

		this.tree_init();
		this.right_panel_init();
		this.my_form_init();

		//初始化表单
		this.clear();

		//this.my_grid.query({ ModelBaseID: '', EngeryKPIName: '', EngeryKPIID: '' });
	},

	EngeryKPIBaseValue_reset: function () {
		this.get_basevalue();
	},

	// 准备下拉框的数据源
	prepare_select_source: function () {
		$('#EngeryKPIParamName').val('').html('');

		$.ajax({
			url: '/api/EngeryKPIParam/GetPage',
			type: 'get',
			dataType: 'json',
			data: { ModelBaseId: this.current_tree_select_id, EngeryKPIParamID: '', EngeryKPIParamName: '' },
			success: function (data) {
				var EngeryKPIParam = data.Models;

				if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
					//Util.alert('加载指标名称失败');
					return;
				}

				if (!EngeryKPIParam || !EngeryKPIParam.length) {
					$('#EngeryKPIParamName').append("<option value='-1'>没有指标名称可供选择</option>");
					$('#EngeryKPIParamName').attr("disabled", "disabled");
					return;
				}

				for (var i in EngeryKPIParam) {
					var item = EngeryKPIParam[i];
					var option = $('<option>').val(item.EngeryKPIParamID).html(item.EngeryKPIParamName);
					$('#EngeryKPIParamName').append(option);
				}

				$('#EngeryKPIParamName').val('');

				//if (typeof callback == 'function') {
				//    callback();
				//}
			}
		})
	},

	//获得基准值
	get_basevalue: function () {
		$('#UnitMeasureName').val('');
		$('#EngeryKPIBaseValue').val('');

		$.ajax({
			url: '/api/EngeryKPIParam/GetPage',
			type: 'get',
			dataType: 'json',
			data: { EngeryKPIParamID: $('#EngeryKPIParamName').val(), EngeryKPIParamName: '', ModelBaseID: '' },
			success: function (data) {
				if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
					Util.alert('获取基准值失败');
					return;
				}

				var EngeryKPIParam = null;

				EngeryKPIParam = data.Models;

				$('#UnitMeasureName').val(EngeryKPIParam[0].UnitMeasureName);
				$('#EngeryKPIBaseValue').val(EngeryKPIParam[0].EngeryKPIParamValue);
			}
		})
	},

	on_grid_row_delete_clicked: function (record) {
		var that = this;
		var data = { EngeryKPIID: record.EngeryKPIID };

		Util.ajax_delete({
			data: data,
			model: 'EngeryKPI',
			confirm_msg: function () {
				return '确认要删除名称为' + record.EngeryKPIName + '的记录吗?';
			},
			success: function () {
				that.my_grid.reload();
			}
		});
	},

	submit_add: function () {
		var that = this;
		var EngeryKPITargetRatio = (($('#EngeryKPITargetValue').val()) / 1 - ($('#EngeryKPIValue').val()) / 1) / (($('#EngeryKPIValue').val()) / 1);

		var data = this.my_form.serialize_data();
		data.EngeryKPITargetRatio = EngeryKPITargetRatio;
		data.EngeryKPIBaseValue = $('#EngeryKPIBaseValue').val();
		data.EngeryKPIParamID = $('#EngeryKPIParamName').val();
		//data.EngeryKPIName = $('#EngeryKPIName option:selected').text();
		Util.ajax_add({
			data: data,
			validator: that.validate_add,
			model: 'EngeryKPI',
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

		var EngeryKPITargetRatio = (($('#EngeryKPITargetValue').val()) / 1 - ($('#EngeryKPIValue').val()) / 1) / (($('#EngeryKPIValue').val()) / 1);

		var data = this.my_form.serialize_data();
		data.EngeryKPITargetRatio = EngeryKPITargetRatio;
		data.EngeryKPIBaseValue = $('#EngeryKPIBaseValue').val();
		data.EngeryKPIParamID = $('#EngeryKPIParamName').val();
		//data.EngeryKPIName = $('#EngeryKPIName option:selected').text();
		Util.ajax_edit({
			data: data,
			validator: that.validate,
			model: 'EngeryKPI',
			success: function () {
				that.my_grid.reload();
			}
		});
	},

	validate_add: function (data) {
		//if (!data.EngeryKPIParamID) {
		//	return '请选择基本参数';
		//}
		return Page.validate(data);
	},

	validate: function (data) {
		if (!data.EngeryKPIName) {
			return '请填写指标名称';
		}
		if (!data.EngeryKPIParamID) {
			return '请选择基本参数';
		}
		if (!data.EngeryKPIValue) {
			return "指标值不能为空";
		}
		if (!data.EngeryKPITargetValue) {
			return "目标值不能为空";
		}
	},

	on_grid_row_selected: function (data, index) {
		this.right_panel.set_arrow_position(index);
		this.my_form.load_data(data);
		$('#EngeryKPIParamName').val(data.EngeryKPIParamID);
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

		//初始化树（第一个参数是页面对象本身的指针，第二个参数是树配置
		this.my_tree = new MyTree(this, this.tree_config);

		//绑定树节点的点击方法
		this.my_tree.bind_node_click_event_handler(this.tree_node_click);

		//查询树
		this.my_tree.query();

		//刷新按钮
		$('#refresh').click(function () {
			that.clear();
			that.my_tree.reset();
			that.my_grid.query({
				ModelBaseID: '', EngeryKPIName: '', EngeryKPIID: ''
			});
		});
	},

	//树点击事件调用的函数
	tree_node_click: function (id) {
		this.clear();
		this.current_tree_select_id = id || '';
		this.my_grid.query({ ModelBaseID: this.current_tree_select_id, EngeryKPIName: $('#search-name').val(), EngeryKPIID: '' });
		this.prepare_select_source();
	}
};