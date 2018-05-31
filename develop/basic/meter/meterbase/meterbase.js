var Page = {
    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前在树中选中的level */
    current_tree_select_level: '',

    /* 当前grid的data */
    current_grid_data: null,

    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'MeterBaseId',
                'MeterBaseName',
                'ModelBaseId',
                'ModelBaseName',
                'EnergyMediumId',
                'EnergyMediumName',
                'MeterBaseCode',
                'MeterBaseLevel',
                'MeterBaseUseDept',
                'MeterBaseSpecModel',
                'MeterBaseTecParam',
                'MeterBaseFactoryCode',
                'MeterBaseManufacturer',
                'MeterBaseManDept',
                'MeterBaseEquPos',
                'USERID'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [{
                    text: '工厂模型',
                    dataIndex: 'ModelBaseName',
                    width: 200
                }, {
                    text: '仪表编号',
                    dataIndex: 'MeterBaseCode',
                    width: 120
                }, {
                    text: '仪表名称',
                    dataIndex: 'MeterBaseName',
                    width: 180
                }, {
                    text: '型号规格',
                    dataIndex: 'MeterBaseSpecModel',
                    width: 260
                }, {
                    text: '参数',
                    dataIndex: 'MeterBaseTecParam',
                    width: 200
                }, {
                    text: '出厂编号',
                    dataIndex: 'MeterBaseFactoryCode',
                    width: 120
                }, {
                    text: '制造商',
                    dataIndex: 'MeterBaseManufacturer',
                    width: 120
                }, {
                    text: '溯源',
                    dataIndex: 'MeterBaseManDept',
                    width: 120
                }, {
                    text: '配备位置',
                    dataIndex: 'MeterBaseEquPos',
                    width: 180
                }, {
                    text: '管理者',
                    dataIndex: 'USERID',
                    width: 120
                }, {
                    text: '能源介质',
                    dataIndex: 'EnergyMediumName',
                    width: 120
                }, {
                    text: '仪表级别',
                    dataIndex: 'MeterBaseLevel',
                    width: 120,
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

        url: '/api/MeterBase/GetPage',
        show_delete_column: true,
        show_paging: false,

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
            that.my_grid.query({
                MeterBaseName: $('#search-name').val(), ModelBaseId: that.current_tree_select_id
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    MeterBaseName: $('#search-name').val(), ModelBaseId: that.current_tree_select_id
                });
            }
        });

        // 初始化下拉框数据源（传入回调函数）
        this.prepare_select_source();

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
            that.my_grid.exportExcel('计量器具管理');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        this.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);

        // 初始化表单
        this.clear();

        this.wintor_init();
    },

    // 准备下拉框的数据源
    prepare_select_source: function (callback) {
        $.ajax({
            url: '/api/MeterBase/Init',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    Util.alert('页面初始化失败');
                    return;
                }

                var list = data.Models[0].MeterTypes;

                if (!list || !list.length) {
                    $('#MeterTypeId').append("<option value='-1'>没有仪表类型可供选择</option>");
                    $('#MeterTypeId').attr("disabled", "disabled");
                    return;
                }

                for (var i in list) {
                    var item = list[i];
                    var option = $('<option>').val(item.MeterTypeId).html(item.MeterTypeName);
                    $('#MeterTypeId').append(option);
                }

                $('#MeterTypeId').val('');

                if (typeof callback == 'function') {
                    callback();
                }
            }
        })
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
            url: '/api/MeterBase/Add',
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
        //console.log(this.my_form.serialize_data())
        var data = this.my_form.serialize_data();

        if ($('#ModelBaseID_3').val()) {
            data.ModelBaseId = $('#ModelBaseID_3').val();
        }
        else if ($('#ModelBaseID_2').val()) {
            data.ModelBaseId = $('#ModelBaseID_2').val();
        }
        else if ($('#ModelBaseID_1').val()) {
            data.ModelBaseId = $('#ModelBaseID_1').val();
        }

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/MeterBase/Edit',
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
        if (!data.MeterBaseName) {
            return "仪表名称不可以为空";
        }
        if (!data.EnergyMediumId) {
            //return "请选择介质";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MeterBaseId: record.MeterBaseId };

        Util.ajax_delete({
            data: data,
            model: 'MeterBase',
            confirm_msg: function () {
                return '确认要删除名称为' + record.MeterBaseName + '的记录吗?';
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
        $('#MeterBaseState').val(2);

        var that = this;

        var callback = function () {
            that.my_grid.refresh_view();
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();
        $('#MeterBaseState').val(2);

        var callback = function () {
            that.my_grid.refresh_view();
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        this.my_form.clear();
        $('#EnergyMediumName').val('');
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
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({
                MeterBaseName: $('#search-name').val(), RootId: 'root'
            });
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.clear();
        this.current_tree_select_id = id;
        this.my_grid.query({
            MeterBaseName: $('#search-name').val(), ModelBaseId: id
        });

        //测试 获取导出数据
        //setTimeout(temp_console_log, 300);

        //function temp_console_log() {
        //    var temp_list = [];
        //    temp_list[0] = new Array();
        //    temp_list[0] = ['1', '', '3', '', '4', '', '7', '', '9'];
        //    var temp_num = 1;
        //    for (i in Page.current_grid_data.Models) {
        //        temp_list[temp_num] = new Array();
        //        var temp_nums = 0;
        //        for (j in Page.current_grid_data.Models[i]) {
        //            temp_list[temp_num][temp_nums] = Page.current_grid_data.Models[i][j];

        //            temp_nums++;
        //        }

        //        temp_num++;
        //    }
        //    console.log('temp_list:');
        //    console.log(temp_list);
        //}
    },

    //get_grid_data:function(data){
    //    Page.current_grid_data = data;
    //},

    my_form: null,

    my_form_config: {
        selector: 'form',
    },

    my_form_init: function () {
        var that = this;

        // 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form = new MyForm(this, this.my_form_config);
    },

    wintor_init: function () {
        var that = this;

        wintor.config({
            url: '/api/MeterStatus/GetMediumSource',
            idField: 'EnergyMediumId',
            nameField: 'EnergyMediumName',
            aSelector: '#choice-energymedium',
            noChoiceMsg: '请选择一项介质',
        })

        wintor.init();

        wintor.condition(function () {
            return { modelbaseId: $('#ModelBaseId').val() || that.current_tree_select_id };
        })

        wintor.select(function (id, name) {
            $('#EnergyMediumId').val(id);
            $('#EnergyMediumName').val(name);
        })
    },

    ModelBaseID_1_onchange: function () {
        var that = this;
        that.prepare_select_source_ModelBaseID_2($('#ModelBaseID_1').val());
    },

    ModelBaseID_2_onchange: function () {
        var that = this;
        that.prepare_select_source_ModelBaseID_3($('#ModelBaseID_2').val());
    },

    // 准备筛选部门下拉框的数据源
    prepare_select_source_ModelBaseID_1: function (ModelBaseID) {
        $('#ModelBaseID_1').val('').html('');
        $('#ModelBaseID_2').val('').html('');
        $('#ModelBaseID_3').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_1').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ModelBaseID_1').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#ModelBaseID_1').append(option);
                }

                $('#ModelBaseID_1').val('');
            }
        })
    },

    // 准备筛选工序下拉框的数据源
    prepare_select_source_ModelBaseID_2: function (ModelBaseID) {
        $('#ModelBaseID_2').val('').html('');
        $('#ModelBaseID_3').val('').html('');
        if (!$('#ModelBaseID_1').val()) {
            return;
        }
        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ModelBaseID_2').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_2').attr("disabled", "disabled");
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

    // 准备筛选工序下拉框的数据源
    prepare_select_source_ModelBaseID_3: function (ModelBaseID) {
        $('#ModelBaseID_3').val('').html('');
        if (!$('#ModelBaseID_2').val()) {
            return;
        }

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ModelBaseID_3').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#ModelBaseID_3').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#ModelBaseID_3').append(option);
                }

                $('#ModelBaseID_3').val('');
            }
        })
    }
};