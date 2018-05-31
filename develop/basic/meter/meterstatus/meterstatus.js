var Page = {

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',


    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'MeterStatusId',
                'MeterStatusMustAmount',
                'MeterStatusMustRatio',
                'MeterStatusLevel',
                'ModelBaseId',
                'ModelBaseName',
                'EnergyMediumId',
                'EnergyMediumName'
            ]
        },

        grid_config: {
            columns: {
                items: [{
                    text: '工厂模型',
                    dataIndex: 'ModelBaseName'
                }, {
                    text: '介质',
                    dataIndex: 'EnergyMediumName'
                }, {
                    text: '应有数量',
                    dataIndex: 'MeterStatusMustAmount'
                }, {
                    text: '国标配备率',
                    dataIndex: 'MeterStatusMustRatio'
                }, {
                    text: '仪表级别',
                    dataIndex: 'MeterStatusLevel',
                    renderer: function (value) {
                        switch (value) {
                            case 1: return "一级";
                            case 2: return "二级";
                            case 3: return "三级";
                            case 4: return "四级";
                            default: return "";
                        }
                    }
                }]
            },
        },

        url: '/api/MeterStatus/GetPage',
        ps: 8,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ ModelBaseId: that.current_tree_select_id });
        });

        // 页面加载后立即查询一次的函数，用于回调        
        this.my_grid.query({ ModelBaseId: that.current_tree_select_id });

        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-add').click(function () {
            that.submit_add();
        })

        // add
        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('器具概况配备');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();

        this.prepare_meterbase_selector();
    },

    submit_add: function () {
        var that = this;


        var data = this.my_form.serialize_data();

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        if (!that.current_tree_select_id || that.current_tree_select_id == 'root') {
            Util.alert('请选择工厂模型节点');
            return;
        }

        data.ModelBaseId = that.current_tree_select_id;

        $.ajax({
            url: '/api/MeterStatus/Add',
            type: 'post',
            data: data,
            success: function (data) {

                if (!data || data.error) {
                    Util.alert('出现错误 错误信息为：' + data.error);
                    return;
                }

                that.my_grid.reload();
                Util.alert('添加成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
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

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/MeterStatus/Edit',
            type: 'put',
            data: data,
            success: function (data) {

                if (!data || data.Error) {
                    Util.alert('发生错误，操作失败');
                    console.log(data);
                    return;
                }

                that.my_grid.reload();
                Util.alert('修改成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误，操作失败');
                console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    },

    validate: function (data) {
        if (!data.EnergyMediumId) {
            return "介质不可以为空";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MeterStatusId: record.MeterStatusId };

        Util.ajax_delete({
            data: data,
            model: 'MeterStatus',
            confirm_msg: function () {
                return '确认要删除改记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
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
            that.my_grid.query({ ModelBaseId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({ ModelBaseId: id });
        this.clear();
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




    prepare_meterbase_selector: function () {
        var that = this;

        $('#choice-energymedium').click(function () {

            var modelbaseId = $('#ModelBaseId').val() || that.current_tree_select_id;

            if (modelbaseId == 'root') {
                Util.alert('请选择一行数据，或选择一个工厂模型节点');
                return;
            }

            that.open_window();

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

        var modelbaseId = $('#ModelBaseId').val() || that.current_tree_select_id;
        var data = { ModelBaseId: modelbaseId };

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            data: data,
            dataType: 'json',
            complete: function () {
                Util.load().spin();
            },
            success: function (data) {

                if (!data || data.error || typeof data.Total == "undefined") {
                    console.log('在调用接口GetMeterBaseSource时发生错误，返回数据如下');
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
                Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
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

};






