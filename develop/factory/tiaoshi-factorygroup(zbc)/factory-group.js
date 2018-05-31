
var Page = {
    my_grid1: null,

    my_grid2: null,

    /*当前编辑的表单*/
    current_edit_from: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',


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
            columns: {
                defaults: {
                    flex: 0
                },
                items: [{
                    text: '班组名称',
                    dataIndex: 'GroupBaseName',
                    flex: 1
                }, {
                    text: '班组编码',
                    dataIndex: 'GroupBaseCode',
                    flex: 1
                }, {
                    text: '班组个数',
                    dataIndex: 'GroupBaseNumber',
                    flex: 1
                }, {
                    text: '描述',
                    dataIndex: 'DescriptionInfo',
                    flex: 1
                }]
            },          
        },

        url: '/api/GroupBase/GetPage',
        show_delete_column: true,
        ps: 8,
        row_select_handler: 'on_grid_row_selected1',
        dblclick_handler: 'on_grid_dblclicked1',
        delete_handler: 'on_grid_row_delete_clicked1',
        grid_container_id: 'grid-container1'
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
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                   {
                    text: '班组名称',
                    dataIndex: 'GroupBaseName',
                    flex: 1
                }, {
                    text: '班组次序',
                    dataIndex: 'GroupTeamOrder',
                    flex: 1
                }, {
                    text: '开始时间',
                    dataIndex: 'GroupTeamBeginTime',
                    flex: 1
                }, {
                    text: '结束时间',
                    dataIndex: 'GroupTeamEndTime',
                    flex: 1
                }, {
                    text: '时间间隔',
                    dataIndex: 'GroupTeamSpaceTime',
                    flex: 1
                }]
            },
        },

        url: '/api/GroupTeam/GetPage',
        show_delete_column: true,
        ps: 8,
        row_select_handler: 'on_grid_row_selected2',
        dblclick_handler: 'on_grid_dblclicked2',
        delete_handler: 'on_grid_row_delete_clicked2',
        grid_container_id: 'grid-container2'

    },

    init: function () {
        var that = this;

        this.my_grid1 = new MyGrid(this, this.my_grid1_config);
        this.my_grid2 = new MyGrid(this, this.my_grid2_config);


        this.my_grid1.query({ RootId: that.current_tree_select_id });
        this.my_grid2.query({ RootId: that.current_tree_select_id });

        // 绑定添加按钮事件
        $('#add-base').click(function () {
            that.on_btn_add_clicked1();
        });
        $('#add-team').click(function () {
            that.prepare_select_source();
            that.on_btn_add_clicked2();
        });

        // 右侧框的关闭事件
        $('.close-button').click(function () {
            Page.hide_right_panel();
        })

        /*添加*/
        $('#submit-add').click(function () {
            $('#ModelBaseId').val(that.current_tree_select_id);
            var id = $('#ModelBaseId').val();
            if (id == 'root') {
                Util.alert('请选择树节点！');
                return
            };
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
        this.right_panel_init();
        this.my_form_init();

        this.tree_init();
    },
    // 准备下拉框的数据源
    prepare_select_source: function (callback) {
        var that = this;
        $.ajax({
            url: '/api/GroupBase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { RootId: that.current_tree_select_id },
            success: function (data) {

                $('#GroupBaseId-S').val('').html('');

                if (data.Models.length < 1) {
                    $('#GroupBaseId-S').append("<option value='-1'>没有班组可供选择</option>");
                    return;
                }

                var GroupBase = data.Models;

                for (var i in GroupBase) {
                    var item = GroupBase[i];
                    var option = $('<option>').val(item.GroupBaseId).html(item.GroupBaseName);
                    $('#GroupBaseId-S').append(option);
                }
                $('#GroupBaseId-S').val('');
            },
            error: function () {
                if (data.Models.length < 1) {
                    $('#GroupBaseId-S').append("<option value='-1'>没有班组可供选择</option>");
                    return;
                }
            }
        })
    },

    on_grid_row_delete_clicked1: function (record) {
        var that = this;
        var data = { GroupBaseId: record.GroupBaseId };

        Util.ajax_delete({
            data: data,
            model: 'GroupBase',
            confirm_msg: function () {
                return '确认要删除这条记录吗?';
            },
            success: function () {
                that.my_grid1.reload();
                that.my_tree.refresh();
            }
        });
    },

    on_grid_row_delete_clicked2: function (record) {
        var that = this;
        var data = { GroupTeamId: record.GroupTeamId };

        Util.ajax_delete({
            data: data,
            model: 'GroupTeam',
            confirm_msg: function () {
                return '确认要删除这条记录吗?';
            },
            success: function () {
                that.my_grid2.reload();
                that.my_tree.refresh();
            }
        });
    },


    validate1: function (data) {
        if (!data.GroupBaseNumber|| !data.GroupBaseName || !data.GroupBaseCode) {
            return "名称不可以为空，请填好谢谢";
        }
    },

    validate2: function (data) {
        if (!data.GroupBaseId || !data.GroupTeamOrder) {
            return "班组名称和班组编码不可以为空，请填好谢谢";
        }
    },


    submit: function (current_action) {
        var that = this;
        if (current_action == 'add') {

           
            if (that.current_edit_from == 'base') {
                var that = this;
                var data = this.my_form.serialize_data();
                Util.ajax_add({
                    data: data,
                    validator: that.validate1,
                    model: 'GroupBase',
                    success: function () {
                        that.my_grid1.reload();
                    }
                });
            }
            else if (that.current_edit_from == 'team') {

                $('#GroupBaseId').val($('#GroupBaseId-S').val());
                var that = this;
                var data = this.my_form.serialize_data();
                data.GroupBaseId = $('#GroupBaseId-S').val();
                Util.ajax_add({
                    data: data,
                    validator: that.validate2,
                    model: 'GroupTeam',
                    success: function () {
                        that.my_grid2.reload();
                    }
                });     
            }
        }

        if (current_action == 'edit') {
            if (that.current_edit_from == 'base') {
                var that = this;

                var row = that.my_grid1.get_last_selected();

                if (!row || !row.data) {
                    Util.alert('请先选择一行记录');
                    return;
                }

                var data = this.my_form.serialize_data();
                Util.ajax_edit({
                    data: data,
                    validator: that.validate,
                    model: 'GroupBase',
                    success: function () {
                        that.my_grid1.reload();
                        that.my_tree.refresh();
                    }
                });
            }
            else if (that.current_edit_from == 'team') {
                var that = this;

                var row = that.my_grid2.get_last_selected();

                if (!row || !row.data) {
                    Util.alert('请先选择一行记录');
                    return;
                }

                var data = this.my_form.serialize_data();
                data.GroupBaseId = $('#GroupBaseId-S').val();

                Util.ajax_edit({
                    data: data,
                    validator: that.validate,
                    model: 'GroupTeam',
                    success: function () {
                        that.my_grid2.reload();
                        that.my_tree.refresh();
                    }
                });
            }
        }
    },

    on_grid_row_selected1: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_row_selected2: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        console.log(data)
        $('#GroupBaseId-S').val(data.GroupBaseId)
    },

    on_grid_dblclicked1: function () {
        var that = this;
        var callback = function () {
            that.my_grid1.grid.getView().refresh()
        }

        that.on_btn_add_clicked1();
    },

    on_grid_dblclicked2: function () {
        var that = this;

        var callback = function () {
            that.my_grid2.grid.getView().refresh()
        }
        that.prepare_select_source();

        that.on_btn_add_clicked2();
    },
   

    on_btn_add_clicked1: function () {
        var that = this;
        this.clear();

            $('.main-content').animate({ marginRight: "480px" }, 'normal', function () {
                that.my_grid1.grid.getView().refresh()
                that.my_grid2.grid.getView().refresh()
                $('.right-content').css('visibility', 'visible').show();
    
                    $('#edit-form-group').show();
                    $('#edit-form-groupteam').hide();
            });
            that.current_edit_from = 'base'
    },

    on_btn_add_clicked2: function () {
        var that = this;
        this.clear();
            $('.main-content').animate({ marginRight: "480px" }, 'normal', function () {
                that.my_grid1.grid.getView().refresh()
                that.my_grid2.grid.getView().refresh()
                $('.right-content').css('visibility', 'visible').show();
    
                    $('#edit-form-group').hide();
                    $('#edit-form-groupteam').show();               
            });
            that.current_edit_from = 'team'

    },


    hide_right_panel: function () {
        var that = this;
        

        $('.right-content').hide();
        $('.main-content').animate({ marginRight: "30px" }, 'normal', function () {
            that.my_grid1.grid.getView().refresh()
            that.my_grid2.grid.getView().refresh()
        });
    },

    clear: function () {
        this.my_grid1.clear_selection();
        this.my_grid2.clear_selection();
        $('.right-panel form input').val('');
        $('.right-panel form select').val('');
    },

    right_panel: null,

    right_panel_config: {
    },

    right_panel_init: function () {
        var that = this;

        this.right_panel = new RightPanel(this.right_panel_config);

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
        url: '/api/FactoryModelbase/GetTree',
        root_name: '工厂模型',
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
        this.prepare_select_source();
        this.clear();
    }
}