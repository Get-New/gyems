var Page = {

    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: '',

    //是否显示root结果表
    temp_root: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                   'FactoryEnergyMediumId',
                   'ModelBaseId',
                   'ModelBaseName',
                   'EnergyMediumId',
                   'EnergyMediumName'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '介质名称',
                        dataIndex: 'EnergyMediumName',
                        flex: 1
                    }, {
                        text: '车间名称',
                        dataIndex: 'ModelBaseName',
                        flex: 1
                    }]
                }
            },

            url: '/api/FactoryEnergyMedium/GetPage',
            ps: 8,
            show_delete_column: true,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    my_root_grid_config: function () {
        return {
            store_config: {
                fields: [
                   'EnergyMediumId',
                   'EnergyMediumName'
                ]
            },

            grid_config: {
                columns: {
                    items: [ {
                        text: '介质名称',
                        dataIndex: 'EnergyMediumName',
                    }]
                }
            },

            url: '/api/FactoryEnergyMedium/GetPage',
            ps: 8,
            show_delete_column: false,
        }
    },

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        // 绑定查询按钮事件
        //$('#query').click(function () {
        //    $('.window').hide();
        //    that.my_grid.query({
        //        ModelBaseId: that.current_tree_select_id
        //    });
        //});

        // 页面加载后立即查询一次

        // 新增
        $('#add').click(function () {
            $('.window').hide();
            //if (that.current_tree_select_id == 'root') {
            //    return;
            //}
            //else {
            //    that.on_btn_add_clicked();
            //}
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-add').click(function () {
            $('.window').hide();
            that.submit_add();
        })

        // add
        $('#submit-edit').click(function () {
            $('.window').hide();
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('工厂介质映射');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
           
        this.prepare_meterbase_selector();
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { FactoryEnergyMediumId: record.FactoryEnergyMediumId };

        Util.ajax_delete({
            data: data,
            model: 'FactoryEnergyMedium',
            confirm_msg: function () {
                return '确认要删除该项吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.ModelBaseId = that.current_tree_select_id;
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'FactoryEnergyMedium',
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
            model: 'FactoryEnergyMedium',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        //if (!data.ModelBaseId || data.ModelBaseId == 'root') {
        //    return '请选择工厂模型节点';
        //}
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.EnergyMediumId) {
            return "介质不可以为空";
        }
    },

    on_grid_row_selected: function (data, index) {
        $('.window').hide();
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_dblclicked: function () {
        $('.window').hide();
        var that = this;

        var callback = function () {
            that.my_grid.refresh_view();
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();

        var callback = function () {
            that.my_grid.refresh_view();
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        this.my_form.clear();
    },

    prepare_meterbase_selector: function () {
        var that = this;

        $('#choice-energymedium').click(function () {
            that.open_window();
        })

        $('#window-save').click(function () {
            var EnergyMediumId = $("#energymediumlist li.active").attr('EnergyMediumId');
            var EnergyMediumName = $("#energymediumlist li.active").attr('EnergyMediumName');
            if (!EnergyMediumId) {
                Util.alert('请选择一项介质');
                return;
            }
            that.select_meter_base(EnergyMediumId, EnergyMediumName);
        })

        $('#window-close').click(function () {
            that.close_window();
        });
        $('#window-cancel').click(function () {
            that.close_window();
        })
    },

    open_window: function () {
        var that = this;

        $('.window').fadeIn(200);

        var target = $('#energymediumlist').get(0);
        Util.load().spin(target);

        var data = { ModelBaseRootId: 'root' };

        $.ajax({
            url: '/api/EnergyMedium/GetTree',
            type: 'get',
            dataType: 'json',
            complete: function () {
                Util.load().spin();
            },
            success: function (data) {

                if (!data || data.error || typeof data.Total == "undefined") {
                    console.log('在调用接口/api/EnergyMedium/GetTree时发生错误，返回数据如下');
                    console.log(data);
                    return;
                }

                var current_id = $('#EnergyMediumId').val();

                var ul = $("#energymediumlist");
                ul.html('');

                for (var i in data.Models) {
                    var item = data.Models[i];

                    var li = $("<li>");
                    li.append(item.EnergyMediumName);
                    li.attr('EnergyMediumId', item.EnergyMediumId);
                    li.attr('EnergyMediumName', item.EnergyMediumName);

                    if (item.EnergyMediumId == current_id) {
                        li.addClass('active');
                    }

                    ul.append(li);
                }

                if (!data.Total) {
                    $('.no-item-available').show();
                }




                $("#energymediumlist li").click(function () {
                    $("#energymediumlist li").removeClass('active');
                    $(this).addClass('active');
                })

                $("#energymediumlist li").dblclick(function () {
                    var EnergyMediumId = $(this).attr('EnergyMediumId');
                    var EnergyMediumName = $(this).attr('EnergyMediumName');
                    that.select_meter_base(EnergyMediumId, EnergyMediumName);
                })
            },
            error: function (jqXhr, textStatus, errorThrown) {
                alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    },

    close_window: function () {
        $('.window').hide();
    },

    select_meter_base: function (id, name) {
        $('#EnergyMediumId').val(id);
        $('#EnergyMediumName').val(name);
        this.close_window();
    },




    right_panel: null,

    right_panel_config: {
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
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset(function (id) {
                that.tree_node_click(id);
            });
        });
    },

    tree_node_click: function (id) {
        $('.window').hide();
        this.current_tree_select_id = id;
        if (id == 'root') {
            Page.temp_root = true;
            var that = this;
            that.right_panel.hide_right_panel();
            setTimeout(temp, 500);
            function temp() {
                $('#grid-container').empty();
                that.my_root_grid = new MyGrid(that, that.my_root_grid_config());
                that.my_root_grid.query({ ModelBaseId: 'root' });
            }
            return;
        }
        if (Page.temp_root) {
            $('#grid-container').empty();
            this.my_grid = new MyGrid(this, this.my_grid_config());
            Page.temp_root = false;
        }
        this.my_grid.query({ ModelBaseId: id });
        this.clear();
    }
};






