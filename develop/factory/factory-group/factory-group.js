$(function () {
	Ext.onReady(function () {
		Page.init();
	})
})

var Page = {
	my_grid1: null,

	my_grid2: null,

	/*当前编辑的表单*/
	current_edit_from: null,

	/* 当前在树中选中的Id */
	current_tree_select_id: 'root',

	/* 编辑区正在显示 */
	right_panel_showing: false,

	my_grid1_config: {
		store_config: {
			fields: [
        		'DescriptionInfo',
        		'GroupBaseCode',
        		'GroupBaseId',
        		'GroupBaseName',
        		'GroupBaseNumber',
        		'ModelBaseId'
			]
		},

		grid_config: {
			multiSelect: false,
			columns: {
				defaults: {
					flex: 0
				},
				items: [{
					text: ' ',
					dataIndex: '',
					width: 150,
					renderer: function (value, metaData, record, rowIndex, colIndex) {
						var el = "<a href='javascript:Page.deleteRowBase()'><div class='garbage'></div></a>";
						return el;
					}
				}, {
					text: '班组名称',
					dataIndex: 'GroupBaseName',
					width: 150
				}, {
					text: '班组编码',
					dataIndex: 'GroupBaseCode',
					width: 150
				}, {
					text: '班组个数',
					dataIndex: 'GroupBaseNumber',
					width: 150
				}, {
					text: '描述',
					dataIndex: 'DescriptionInfo',
					flex: 0.08
				}]
			},
			listeners: {
				select: function (scope, record, index, eOpts) {
					Page.on_grid_row_selected('base',record.data, index);
				},
				dblclick: {
					element: 'body', //bind to the underlying body property on the panel
					fn: function (e) {
						Page.on_dblclick('base');
					}
				}
			},
		},

		url: '/api/GroupBase/GetPage',
		ps: 11
	},

	my_grid2_config: {
		store_config: {
			fields: [
        		'GroupBaseId',
        		'GroupBaseName',
        		'GroupTeamBeginTime',
        		'GroupTeamEndTime',
				'GroupTeamId',
				'GroupTeamOrder',
				'GroupTeamSpaceTime'
			]
		},

		grid_config: {
			multiSelect: false,
			columns: {
				defaults: {
					flex: 0
				},
				items: [{
					text: ' ',
					dataIndex: '',
					width: 150,
					renderer: function (value, metaData, record, rowIndex, colIndex) {
						var el = "<a href='javascript:Page.deleteRowTeam()'><div class='garbage'></div></a>";
						return el;
					}
				}, {
					text: '班组名称',
					dataIndex: 'GroupBaseName',
					width: 150
				}, {
					text: '班组次序',
					dataIndex: 'GroupTeamOrder',
					width: 150
				}, {
					text: '开始时间',
					dataIndex: 'GroupTeamBeginTime',
					width: 200
				}, {
					text: '结束时间',
					dataIndex: 'GroupTeamEndTime',
					width: 200
				}, {
					text: '时间间隔',
					dataIndex: 'GroupTeamSpaceTime',
					flex: 0.08
				}]
			},
			listeners: {
				select: function (scope, record, index, eOpts) {
					Page.on_grid_row_selected('team',record.data, index);
				},
				dblclick: {
					element: 'body', //bind to the underlying body property on the panel
					fn: function (e) {
						Page.on_dblclick('team');
					}
				}
			},
		},

		url: '/api/GroupTeam/GetPage',
		ps: 11
	},

	init: function () {
		var that = this;

		// 设置存放Grid的div
		this.my_grid1_config.grid_config.renderTo = Ext.get('grid-container1');
		this.my_grid2_config.grid_config.renderTo = Ext.get('grid-container2');


		// 初始化MyGrid
		this.my_grid1 = new MyGrid();
		this.my_grid2 = new MyGrid();
		this.my_grid1.init(this.my_grid1_config);
		this.my_grid2.init(this.my_grid2_config);

		this.my_grid1.query({ RootId: that.current_tree_select_id });
		this.my_grid2.query({ RootId: that.current_tree_select_id });

		// 绑定添加按钮事件
		$('#add-base').click(function () {
			that.on_btn_add_clicked('base');
		});
		$('#add-team').click(function () {
		    that.prepare_select_source();
			that.on_btn_add_clicked('team');
		});

		// 页面加载后立即查询一次的函数，用于回调
		//var init_query = function () {
		//	that.my_grid1.query({ RootId: that.current_tree_select_id });
		//	that.my_grid2.query({ RootId: that.current_tree_select_id });
		//}

		//初始化下拉框数据源（传入回调函数）
		//this.prepare_select_source(init_query);

		// 右侧框的关闭事件
		$('.close-button').click(function () {
			Page.hide_right_panel();
		})

		/*添加*/
		$('#submit-add').click(function () {
		    $('#ModelBaseId').val(that.current_tree_select_id)
			that.submit('add');
		})

		$('#submit-edit').click(function () {
			if (that.current_edit_from == 'base') {
				var row = that.my_grid1.get_last_selected();

				if (!row || !row.data) {
					Util.alert('请先选择一行记录');
					return;
				}

				that.submit('edit');
			}
			else if (that.current_edit_from == 'team') {
				var row = that.my_grid2.get_last_selected();

				if (!row || !row.data) {
					Util.alert('请先选择一行记录');
					return;
				}

				that.submit('edit');
			}
		})

		// 初始化表单
		this.clear();

		this.tree_init();
	},
	// 准备下拉框的数据源
	prepare_select_source: function (callback) {
        //debugger
		var that = this;
		$.ajax({
			url: '/api/GroupBase/GetPage',
			type: 'get',
			dataType: 'json',
			data: { RootId: that.current_tree_select_id},
			success: function (data) {

			    $('#GroupBaseId-S').val('').html('');

				if (data.Models.length < 1) {
				    $('#GroupBaseId-S').append("<option value='-1'>没有班组可供选择</option>");
				    //$('#GroupBaseId-S').attr("disabled", "disabled");
					return;
				}

				var GroupBase = data.Models;

				for (var i in GroupBase) {
				    var item = GroupBase[i];
					var option = $('<option>').val(item.GroupBaseId).html(item.GroupBaseName);
					$('#GroupBaseId-S').append(option);
				}
				$('#GroupBaseId-S').val('');

				//if (typeof callback == 'function') {
				//	callback();
				//}
			},
			error: function () {
			    if (data.Models.length < 1) {
			        $('#GroupBaseId-S').append("<option value='-1'>没有班组可供选择</option>");
			        //$('#GroupBaseId-S').attr("disabled", "disabled");
			        return;
			    }
			}
		})
	},

	deleteRowBase: function () {
		var that = this;
		var row = this.my_grid1.get_last_selected();
		var data = { GroupBaseId: row.data.GroupBaseId };
		Util.confirm('确认要删除名称为' + row.data.GroupBaseName + '的记录吗?', function () {
			$.ajax({
				url: '/api/GroupBase/Delete',
				type: 'delete',
				data: data,
				success: function (data) {
					that.my_grid1.reload();
				    //********************************
				    $('#GroupBaseName2').val('').html('');
				    that.prepare_select_source();
                    //***********************************
					Util.alert('删除成功');
				},
				error: function (jqXhr, textStatus, errorThrown) {
					Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
				}
			});
		});
	},

	deleteRowTeam: function () {
		var row = this.my_grid2.get_last_selected();
		var data = { GroupTeamId: row.data.GroupTeamId };
		Util.confirm('确认要删除名称为' + row.data.GroupBaseName + '的记录吗?', function () {
			$.ajax({
				url: '/api/GroupTeam/Delete',
				type: 'delete',
				data: data,
				success: function (data) {
					that.my_grid2.reload();
					Util.alert('删除成功');
				},
				error: function (jqXhr, textStatus, errorThrown) {
					Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
				}
			});
		});
	},
	validate1: function () {
	    if (!$('#GroupBaseNumber').val() || !$('#GroupBaseName').val() || !$('#GroupBaseCode').val()) {
	        Util.alert("名称不可以为空，请填好谢谢");
	        return false;
	    }

	    return true;
	},
	submit: function (current_action) {
		var that = this;

		//$('#features').val(JSON.stringify(this.current_features));
		if (current_action == 'add') {
			if (that.current_edit_from == 'base') {
				var data = $('#edit-form-group').serialize();
				data = data.replace(/\+/g, " ");
				if (!that.current_tree_select_id) {
					Util.alert('请选择工厂模型节点');
					return;
				}
				if (!that.validate1()){
				    return;
				}
				data = Util.modifyFormData(data, 'ModelBaseId', that.current_tree_select_id);
				data = data.replace(/\+/g, " ");

				$.ajax({
					url: '/api/GroupBase/Add',
					type: 'post',
					dataType: 'json',
					data: data,
					success: function (data) {

						if (!data || data.error) {
							Util.alert('出现错误 错误信息为：' + data.error);
							return;
						}
						//if (!that.validate1()) {
						//    return;
						//}
						that.my_grid1.reload();
                        //**************************************
						$('#GroupBaseName2').val('').html('');
						that.prepare_select_source();
                        //****************************************
						Util.alert('添加成功');
					},
					error: function (jqXhr, textStatus, errorThrown) {
						Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
					}
				});
			}
			else if (that.current_edit_from == 'team') {

			    $('#GroupBaseId').val($('#GroupBaseId-S').val());

				var data = $('#edit-form-groupteam').serialize();
				data = data.replace(/\+/g, " ");
				if (!that.current_tree_select_id) {
					Util.alert('请选择工厂模型节点');
					return;
				}

				data = Util.modifyFormData(data, 'GroupBaseId', $('#GroupBaseId-S').val());

				$.ajax({
					url: '/api/GroupTeam/Add',
					type: 'post',
					dataType: 'json',
					data: data,
					success: function (data) {

						if (!data || data.error) {
							Util.alert('出现错误 错误信息为：' + data.error);
							return;
						}

						that.my_grid2.reload();
						Util.alert('添加成功');
					},
					error: function (jqXhr, textStatus, errorThrown) {
						Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
					}
				});
			}
		}

		if (current_action == 'edit') {
			if (that.current_edit_from == 'base') {
			    var data = $('#edit-form-group').serialize();
			    if (!that.validate1()) {
			        return;
			    }
				data = data.replace(/\+/g, " ");
				$.ajax({
					url: '/api/GroupBase/Edit',
					type: 'put',
					data: data,
					success: function (data) {

						if (!data || data.error) {
							Util.alert('出现错误 错误信息为：' + data.error);
							return;
						}


						that.my_grid1.reload();
                        //*****************************
						$('#GroupBaseName2').val('').html('');
						that.prepare_select_source();
                        //*******************************
						Util.alert('修改成功');
					},
					error: function (jqXhr, textStatus, errorThrown) {
						Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
					}
				});
			}
			else if (that.current_edit_from == 'team') {

			    //$('#GroupBaseId').val($('#GroupBaseId-S').val());

				var data = $('#edit-form-groupteam').serialize();
				data = data.replace(/\+/g, " ");

				data = Util.modifyFormData(data, 'GroupBaseId', $('#GroupBaseId-S').val());

				$.ajax({
					url: '/api/GroupTeam/Edit',
					type: 'put',
					data: data,
					success: function (data) {

						if (!data || data.error) {
							Util.alert('出现错误 错误信息为：' + data.error);
							return;
						}

						that.my_grid2.reload();
						Util.alert('修改成功');
					},
					error: function (jqXhr, textStatus, errorThrown) {
						Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
					}
				});
			}
		}
	},

	on_grid_row_selected: function (form, data, index) {
		var y0, dy, top;
		if (form == 'base') {
			y0 = 93;
			dy = 67;
			top = y0 + dy * index
            console.log(data)
			$('.arrow-outer').css('top', top);
			$('.arrow-inner').css('top', top + 2);

			for (var property in data) {
				if (typeof data[property]) {
					$('#' + property).val(data[property]);
				}
				//if (typeof data[property] == undefined) {
				//	$('#' + property).val('');
				//}
			}
		}
		else if (form == 'team') {
			y0 = 476;
			dy = 67;
			top = y0 + dy * index

			$('.arrow-outer').css('top', top);
			$('.arrow-inner').css('top', top + 2);

			for (var property in data) {
				if (typeof data[property]) {
					$('#' + property).val(data[property]);
				}
			}

			$('#GroupBaseId-S').val('').html('');
			var option_GroupBaseId_S = $('<option>').val(data.GroupBaseId).html(data.GroupBaseName);
			$('#GroupBaseId-S').append(option_GroupBaseId_S);
			console.log(this.my_grid2.list.length)
            //console.log(this.my_grid1.)
		}
	},

	on_dblclick: function (form) {
		var that = this;
		//if (this.right_panel_showing)
		//	return;

		// 下面几行代码，是防止用户双击时选中文本
		$('.main-content').addClass('unselectable')
		var clearSlct = "getSelection" in window ? function () {
			window.getSelection().removeAllRanges();
		} : function () {
			document.selection.empty();
		};

		$('.main-content').animate({ marginRight: "480px" }, 'normal', function () {
			that.my_grid1.grid.getView().refresh()
			that.my_grid2.grid.getView().refresh()
			$('.right-content').css('visibility', 'visible').show();
			$('.main-content').removeClass('unselectable')
			if (form == 'base') {
			    $('.arrow-outer-floor').hide();
			    $('.arrow-inner-floor').hide();
			    $('#edit-form-groupteam').hide();
				$('#edit-form-group').show();
				$('.arrow-outer').show();
				$('.arrow-inner').show();
				that.current_edit_from = 'base';
			}
			else if (form == 'team') {
			    $('.arrow-outer').hide();
			    $('.arrow-inner').hide();
			    $('#edit-form-group').hide();
				$('#edit-form-groupteam').show();
				$('.arrow-outer-floor').show();
				$('.arrow-inner-floor').show();
				that.current_edit_from = 'team';
			}
			clearSlct();
		});
		this.right_panel_showing = true;
	},

	on_btn_add_clicked: function (form) {
		var that = this;
		this.clear();
		//$('#MeterBaseCode').focus();
		if (!this.right_panel_showing) {
			$('.main-content').animate({ marginRight: "480px" }, 'normal', function () {
				that.my_grid1.grid.getView().refresh()
				that.my_grid2.grid.getView().refresh()
				$('.right-content').css('visibility', 'visible').show();
				if (form == 'base') {
					$('#edit-form-group').show();
					$('#edit-form-groupteam').hide();
					that.current_edit_from = 'base';
				}
				else if (form == 'team') {
					$('#edit-form-group').hide();
					$('#edit-form-groupteam').show();
					that.current_edit_from = 'team';
				}
			});
			this.right_panel_showing = true;
		}

		else if (this.right_panel_showing) {
			if (form == 'base') {
				$('#edit-form-group').show();
				$('#edit-form-groupteam').hide();
				that.current_edit_from = 'base';
			}
			else if (form == 'team') {
				$('#edit-form-group').hide();
				$('#edit-form-groupteam').show();
				that.current_edit_from = 'team';
			}
		}

	},

	

	hide_right_panel: function () {
		var that = this;
		if (!this.right_panel_showing)
			return;

		$('.right-content').hide();
		$('.main-content').animate({ marginRight: "30px" }, 'normal', function () {
			that.my_grid1.grid.getView().refresh()
			that.my_grid2.grid.getView().refresh()
		});
		this.right_panel_showing = false;
	},

	clear: function () {
		this.my_grid1.clear_selection();
		this.my_grid2.clear_selection();
		$('.right-panel form input').val('');
		$('.right-panel form select').val('');
		//$('#GroupBaseName2').val('').html('');
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
			that.current_tree_select_id = 'root';
			that.my_tree.reset();
			that.my_grid1.query({ RootId: 'root' });
			that.my_grid2.query({ RootId: 'root' });
		});
	},

	tree_node_click: function (id) {
		this.current_tree_select_id = id || "";
		this.my_grid1.query({ RootId: id });
		this.my_grid2.query({ RootId: id });
		//this.prepare_select_source();
		this.clear();
	}
}