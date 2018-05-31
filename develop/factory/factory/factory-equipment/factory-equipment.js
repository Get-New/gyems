var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    whether_there: false,
    //elevel: '',

    /* 编辑区正在显示 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'DescriptionInfo',
                    'EnergyMediumId',
                    'EnergyMediumName',
                    'FactoryEquipmentId',
                    'FactoryEquipmentParam',
                    'FactoryEquipmentWorkTime',
                    'ModelBaseId',
                    'ModelBaseName'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '名称',
                        dataIndex: 'ModelBaseName',
                        width: 300
                    }, {
                        text: '设备规格',
                        dataIndex: 'FactoryEquipmentParam',
                        width: 150
                    }, {
                        text: '工作制(小时/天)',
                        dataIndex: 'FactoryEquipmentWorkTime',
                        width: 200
                    }, {
                        text: '能源种类',
                        dataIndex: 'EnergyMediumName',
                        width: 150
                    }, {
                        text: '描述',
                        dataIndex: 'DescriptionInfo',
                        flex: 0.9
                    }]
                }
            },

            url: '/api/FactoryEquipment/GetPage',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
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
            that.my_grid.query({
                ModelBaseName: $('#QueryModelBaseName').val(), RootId: that.current_tree_select_id
            });
        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({
        			ModelBaseName: $('#QueryModelBaseName').val(), RootId: that.current_tree_select_id
        		});
        	}
        });

        // 绑定添加按钮事件
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        //form添加
        $('#submit-add').click(function () {
            var row = that.my_grid.get_last_selected();

            if (!row || !row.data) {
                Util.alert('请先选择一行记录');
                return;
            }

            Page.prepare_whether_there();

            setTimeout(temp, 300);
            function temp() {
                if (Page.whether_there) {
                    Util.alert('不允许重复添加, 请选择保存编辑');
                }
                else {
                    that.submit_add();
                }
            }
        });

        //form修改
        $('#submit-edit').click(function () {
            var row = that.my_grid.get_last_selected();

            if (!row || !row.data) {
                Util.alert('请先选择一行记录');
                return;
            }

            Page.prepare_whether_there();

            setTimeout(temp, 300);
            function temp() {
                if (Page.whether_there) {
                    that.submit_edit('edit');
                }
                else {
                    Util.alert('第一次录入该条记录或其已被清空, 请点击提交新增');
                }
            }
        });

        //查询介质种类
        $('#search-EnergyMediumId').click(function () {
            Page.prepare_select_source();
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('耗能设备');
        })

        // 页面加载后立即查询一次的函数，用于回调
        var init_query = function () {
            that.my_grid.query({ ModelBaseName: '', RootId: that.current_tree_select_id });
        }

        //初始化下拉框数据源（传入回调函数）
        this.prepare_select_source(init_query);

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();
    },

    // 准备下拉框的数据源
    prepare_select_source: function () {
        $('#EnergyMediumId').val('').html('');

        var temp_mbi;
        if ($('#ModelBaseId').val()) {
            temp_mbi = $('#ModelBaseId').val();
        }
        else {
            temp_mbi = this.current_tree_select_id;
        }

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseId: temp_mbi },
            success: function (data) {
                //if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                //	return;
                //}
                //var StructList = data.Models[0].StructNames;

                if (!data.Models || !data.Models.length) {
                    $('#EnergyMediumId').append("<option value='-1'>没有能源种类可供选择</option>");
                    //$('#EnergyMediumId').attr("disabled", "disabled");
                    return;
                }

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumId').append(option);
                }

                $('#EnergyMediumId').val('');
            }
        })
    },

    // 判断记录是否存在
    prepare_whether_there: function (callback) {
        Page.whether_there = false;

        $.ajax({
            url: '/api/FactoryEquipment/GetPage',
            type: 'get',
            dataType: 'json',
            data: { RootId: $('#ModelBaseId').val(), ModelBaseName: '' },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }

                if (data.Models[0].EnergyMediumId) {
                    Page.whether_there = true;
                }
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { FactoryEquipmentId: record.FactoryEquipmentId };

        Util.ajax_delete({
            data: data,
            model: 'FactoryEquipment',
            confirm_msg: function () {
                return '确认要清空名称为 ' + record.ModelBaseName + ' 的记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'FactoryEquipment',
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
            model: 'FactoryEquipment',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.ModelBaseId) {
            return '请选择一条记录';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.FactoryEquipmentParam) {
            return "请填写设备规格";
        }
        if (!data.EnergyMediumId) {
            return "请选择能源种类";
        }
        if (!data.FactoryEquipmentWorkTime) {
            return "请填写工作制";
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
        this.clear();

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
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            that.clear();
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({ ModelBaseName: $('#QueryModelBaseName').val(), RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || "";
        //$('#ModelBaseId').val(this.current_tree_select_id);
        this.prepare_select_source();
        this.my_grid.query({ ModelBaseName: $('#QueryModelBaseName').val(), RootId: id });
    }
}