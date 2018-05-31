var Page = {
    my_grid: null,

    //当前左侧列表选中的用户id
    current_selected_user_id: '',

    //当前选中列表行的工厂模型id
    current_selected_modelbase_id: '',

    my_grid_config: {
        store_config: {
            fields: [
            'MessageID',
            'MessageBatchCode',
            'MessageBatchText',
            'WarningID',
            'UserID',
            'IsAllPusted',
            'MessageSEQ',
            'WarningName',
            'UserName',
            'MeterBaseID',
            'MeterBaseName',
            'MeterBaseCode'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                //{
                //    text: '绑定用户',
                //    dataIndex: 'UserName',
                //    flex: 0.5,
                //},
                {
                    text: '报警单元名称',
                    dataIndex: 'WarningName',
                    flex: 0.9,
                },
                {
                    text: '检修器具名称',
                    dataIndex: 'MeterBaseName',
                    flex: 0.6,
                },
                {
                    text: '检修器具编码',
                    dataIndex: 'MeterBaseCode',
                    flex: 0.6,
                }
                //,
                //{
                //    text: '编组编码',
                //    dataIndex: 'MessageBatchCode',
                //    width: 200,
                //},
                //{
                //    text: '编组名称',
                //    dataIndex: 'MessageBatchText',
                //    width: 200,
                //},
                //{
                //    text: '组内推送顺序',
                //    dataIndex: 'MessageSEQ',
                //    width: 200,
                //},
                //{
                //    text: '编组相关推送',
                //    dataIndex: 'IsAllPusted',
                //    width: 200,
                //    render: function (value) {
                //        switch (value) {
                //            case 0: return "否";
                //            case 1: return "是";
                //        }
                //    }
                //}
                ]
            },
        },

        url: '/api/MessageConfig/GetPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    my_group_config: function () {
        return {
            store_config: {
                fields: [
                    'UserId',
                    'UserName'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0,
                        align: 'center'
                    },
                    items: [
                        { text: '用户名', dataIndex: 'UserName', flex: 1 }
                    ]
                }
            },

            url: '/api/ManageUser/GetPage',
            ps: 999999,
            show_delete_column: false,
            row_select_handler: 'on_group_row_selected',

            grid_container_id: 'collect-group-container'
        }
    },

    init: function () {
        $('#search-name').val('');

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
        this.my_grid = new MyGrid(this, this.my_grid_config);

        this.my_group = new MyGrid(this, this.my_group_config());

        //页面加载后查询
        this.my_group.query({ UserName: '' }, function (data) {
            // 自动选中第一行
            that.my_group.grid.getSelectionModel().select(0);
        });

        $('#query').click(function () {
            that.my_grid.query({
                UserID: that.current_selected_user_id, WarningName: $('#search-name').val()
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    UserID: that.current_selected_user_id, WarningName: $('#search-name').val()
                });
            }
        });

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            if ($('#ConfigID').val() == '') {
                Util.alert("请选择所属图表");
                return false;
            }
            that.submit_add();
        });

        $('#submit-edit').click(function () {
            that.submit_edit();
        });

        //onchange事件
        $('#ModelBaseID_1').change(function () {
            that.prepare_select_source_ModelBaseID_2($('#ModelBaseID_1').val());
            var tmpID1 = $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID1;
            that.prepare_select_source_Warning(Page.current_selected_modelbase_id);
            that.prepare_select_source_MeterBase(Page.current_selected_modelbase_id);
        });

        //onchange事件
        $('#ModelBaseID_2').change(function () {
            that.prepare_select_source_ModelBaseID_3($('#ModelBaseID_2').val());
            var tmpID2 = $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID2;
            that.prepare_select_source_Warning(Page.current_selected_modelbase_id);
            that.prepare_select_source_MeterBase(Page.current_selected_modelbase_id);
        });

        //onchange事件
        $('#ModelBaseID_3').change(function () {
            var tmpID3 = $('#ModelBaseID_3').val() ? $('#ModelBaseID_3').val() : $('#ModelBaseID_2').val() ? $('#ModelBaseID_2').val() : $('#ModelBaseID_1').val();
            Page.current_selected_modelbase_id = tmpID3;
            that.prepare_select_source_Warning(Page.current_selected_modelbase_id);
            that.prepare_select_source_MeterBase(Page.current_selected_modelbase_id);
        });

        this.right_panel_init();
        this.my_form_init();
        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        this.prepare_select_source_ModelBaseID_1(temp_ModelBaseID_ylc);
        this.prepare_select_source_Warning('');
        this.prepare_select_source_MeterBase('');

        // 初始化表单
        this.clear();
    },

    //左侧列表单击事件
    on_group_row_selected: function (data) {
        var that = this;
        that.clear();
        that.current_selected_user_id = data.UserId;
        $('#UserID').val(data.UserId);
        //$('#UserName').val(data.UserName);
        that.my_grid.query({
            UserID: that.current_selected_user_id, WarningName: $('#search-name').val()
        });

        this.prepare_select_source_Warning('');
        this.prepare_select_source_MeterBase('');
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
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#ModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#ModelBaseID_1').attr("disabled", "disabled");
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

    // 准备筛选工序下拉框的数据源
    prepare_select_source_ModelBaseID_2: function (ModelBaseID) {
        $('#ModelBaseID_2').val('').html('');
        $('#ModelBaseID_3').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
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

    // 准备筛选子工序下拉框的数据源
    prepare_select_source_ModelBaseID_3: function (ModelBaseID) {
        $('#ModelBaseID_3').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
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
    },

    // 准备报警单元的下拉框数据
    prepare_select_source_Warning: function (ModelBaseID) {
        $('#WarningID').val('').html('');

        $.ajax({
            url: '/api/WarningConfig/GetPage',
            type: 'get',
            dataType: 'json',
            data: { WarningName: '', ModelBaseID: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#WarningID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.WarningID).html(item.WarningName);
                    $('#WarningID').append(option);
                }

                $('#WarningID').val('');
            }
        })
    },

    // 准备检修器具的下拉框数据
    prepare_select_source_MeterBase: function (ModelbaseId) {
        $('#MeterBaseID').val('').html('');

        $.ajax({
            url: '/api/MeterBase/GetCurrentPage',
            type: 'get',
            dataType: 'json',
            data: { ModelbaseId: ModelbaseId },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#MeterBaseID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.MeterBaseId).html(item.MeterBaseName + '(' + item.MeterBaseCode + ')');
                    $('#MeterBaseID').append(option);
                }

                $('#MeterBaseID').val('');
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;

        var data = { MessageID: record.MessageID };

        Util.ajax_delete({
            data: data,
            model: 'MessageConfig',
            confirm_msg: function () {
                return '确认要删除' + record.MessageBatchText + '吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();
        data.IsAllPusted = 1; //相关推送 是
        data.MessageSEQ = 0; //推送顺序 0
        data.tmpID = data.WarningID ? data.WarningID : data.MeterBaseID; //临时ID
        data.MessageBatchCode = data.tmpID; //分组code
        data.MessageBatchText = data.tmpID; //分组text

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'MessageConfig',
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
        data.IsAllPusted = 1; //相关推送 是
        data.MessageSEQ = 0; //推送顺序 0
        data.tmpID = data.WarningID ? data.WarningID : data.MeterBaseID; //临时ID
        data.MessageBatchCode = data.tmpID; //分组code
        data.MessageBatchText = data.tmpID; //分组text

        Util.ajax_edit({
            error_msg: '操作失败',
            data: data,
            validator: that.validate,
            model: 'MessageConfig',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    //*********************************************注意事**************************************************

    validate: function (data) {
        //console.log("data:");
        //console.log(data);
        if (!data.UserID) {
            return "请重新选择用户";
        }
        if (!data.tmpID) {
            return "请选择报警单元或检修器具";
        }
        if (data.WarningID && data.MeterBaseID) {
            return "报警单元和检修器具只能选择一项";
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;
        that.clear();

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.grid.getView().refresh();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();

        var callback = function () {
            that.my_grid.grid.getView().refresh();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        this.my_form.clear();
        $('select').val('');
        $('input').val('');
    },

    right_panel: null,

    right_panel_config: {
        selectors: {
            main_content: '.grid-container',
            right_content: '.right-content',
        }
    },

    right_panel_init: function () {
        var that = this;

        this.right_panel = new RightPanel(this.right_panel_config);

        // 右侧框的关闭事件
        $('.close-button').click(function () {
            var callback = function () {
                that.my_grid.grid.getView().refresh();
                $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
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
    }
}