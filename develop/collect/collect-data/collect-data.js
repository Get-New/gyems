var Page = {
    my_grid: null,
    //my_group: null,

    /* 当前树种选中的Id */
    current_tree_select_id: '',

    //当前仪表group选中的id
    //current_group_select_id: '',

    //当前Panel选中的更改工厂模型id
    current_selected_panel_modelbase_id: '',

    //当前测点的IP
    //current_group_select_IP: '',

    /* 编辑区初始显示状态 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'MeterPointID',
                    'MeterPointName',
                    'MeterPointInfo',
                    'MeterPointTagName',
                    'EnergyMediumID',
                    'EnergyMediumName',
                    'ModelBaseID',
                    'ModelBaseName',
                    'DescriptionInfo'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [
                        { text: '编号', dataIndex: 'MeterPointID', hidden: true, hiddenMode: 'visibility' },
                        { text: '名称', dataIndex: 'MeterPointName', flex: 1 },
                        { text: '描述', dataIndex: 'MeterPointInfo', flex: 1 },
                        { text: 'TagName', dataIndex: 'MeterPointTagName', flex: 1 },
                        { text: '计量介质', dataIndex: 'EnergyMediumName', flex: 1 },
                        { text: '工厂模型', dataIndex: 'ModelBaseName', flex: 1 },
                        { text: '备注', dataIndex: 'DescriptionInfo', flex: 1 }
                    ]
                },
            },

            url: '/api/MeterPoint/GetCurrentPage',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: true,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {
        var that = this;

        this.my_grid = new MyGrid(this, this.my_grid_config());

        $("#upLoadFile").uploadify({
            'auto': false,                      //是否自动上传
            'swf': '/develop/ashx/uploadify.swf',      //上传swf控件,不可更改
            'uploader': '/develop/ashx/ExcelUpload.ashx',            //上传处理页面,可以aspx
            'fileTypeDesc': '请选择文件',
            'fileTypeExts': '*.xlsx',   //文件类型限制,默认不受限制
            'buttonText': '浏览文件',//按钮文字
            'width': 75,
            'height': 16,
            //最大文件数量'uploadLimit':
            'multi': false,//单选
            'fileSizeLimit': '20MB',
            'queueSizeLimit': 1,  //队列限制
            'removeCompleted': true,
            'onUploadSuccess': function (file, data, response) {
                if (data) {
                    that.file_up_data(data);
                }
            }
        });

        //this.my_group = new MyGrid(this, this.my_group_config());

        //查询按钮
        $('#query').click(function () {
            that.my_grid.query({
                ModelBaseID: that.current_tree_select_id, MeterPointName: $('#search-name').val()
            });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({
                    ModelBaseID: that.current_tree_select_id, MeterPointName: $('#search-name').val()
                });
            }
        });

        //添加按钮
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        //form添加
        $('#submit-add').click(function () {
            that.submit_add();
        });

        //form修改
        $('#submit-edit').click(function () {
            //var row = that.my_grid.get_last_selected();
            //if (!row || !row.data) {
            //    Util.alert('请先选择一行记录');
            //    return;
            //}
            that.submit_edit('edit');
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('采集点管理');
        })

        //文件上传按钮
        $('#upload').click(function () {
            that.file_upload();
        });

        this.tree_init();
        this.right_panel_init();

        this.prepare_PanelModelBaseID_event();

        this.my_form_init();

        //初始化表单
        this.clear();
    },

    // 准备能源介质的下拉框数据
    prepare_select_source_EnergyMedium: function (ModelBaseID) {
        $('#EnergyMediumID').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#EnergyMediumID').append("<option value='-1'>没有介质可供选择</option>");
                    //$('#EnergyMediumID').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMediumID').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumID').append(option);
                }

                $('#EnergyMediumID').val('');
            }
        })
    },

    //更改部门相关
    // 准备 更改部门 下拉框的数据源
    prepare_select_source_PanelModelBaseID_1: function (ModelBaseID) {
        $('#PanelModelBaseID_1').val('').html('');
        $('#PanelModelBaseID_2').val('').html('');
        $('#PanelModelBaseID_3').val('').html('');
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_1').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_1').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_1').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_1').append(option);
                }
            }
        })
    },

    // 准备 更改下级 下拉框的数据源
    prepare_select_source_PanelModelBaseID_2: function (ModelBaseID) {
        $('#PanelModelBaseID_2').val('').html('');
        $('#PanelModelBaseID_3').val('').html('');
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_2').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_2').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_2').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_2').append(option);
                }

                $('#PanelModelBaseID_2').val('');
            }
        })
    },

    // 准备 更改下级 下拉框的数据源
    prepare_select_source_PanelModelBaseID_3: function (ModelBaseID) {
        $('#PanelModelBaseID_3').val('').html('');
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_3').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_3').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_3').append(option);
                }

                $('#PanelModelBaseID_3').val('');
            }
        })
    },

    // 准备 更改下级 下拉框的数据源
    prepare_select_source_PanelModelBaseID_4: function (ModelBaseID) {
        $('#PanelModelBaseID_4').val('').html('');

        $.ajax({
            url: '/api/FactoryModelbase/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseName: '', RootId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#PanelModelBaseID_4').append("<option value='-1'>没有选项可供选择</option>");
                    //$('#PanelModelBaseID_3').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#PanelModelBaseID_4').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ModelBaseId).html(item.ModelBaseName);
                    $('#PanelModelBaseID_4').append(option);
                }

                $('#PanelModelBaseID_4').val('');
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MeterPointID: record.MeterPointID };

        Util.ajax_delete({
            data: data,
            model: 'MeterPoint',
            confirm_msg: function () {
                return '确认要删除名称为' + record.MeterPointName + '的记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    file_upload: function () {
        $("#upLoadFile").uploadify('upload', '*');
    },

    file_up_data: function (data) {
        var mpmodel = { MeterPointID: data };
        $.ajax({
            url: '/api/MeterPoint/InputData',
            type: 'post',
            data: mpmodel,
            success: function (data) {
                Util.alert('成功');
            },
            error: function (qjXhr, textStatus, errorThrown) {
            },
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        if (!data.ModelBaseID) {
            data.ModelBaseID = that.current_tree_select_id;
        }
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'MeterPoint',
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

        //用于更改所属部门
        if (that.current_selected_panel_modelbase_id) {
            data.ModelBaseID = that.current_selected_panel_modelbase_id;
        }

        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'MeterPoint',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        //if (!data.MeterBaseID) {
        //    return '请选择仪表';
        //}
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.MeterPointName) {
            return "名称不可以为空";
        }
        if (!data.MeterPointTagName) {
            return "TagName不可以为空";
        }
        if (!data.EnergyMediumID) {
            return "请选择介质";
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;

        that.clear();
        that.current_selected_panel_modelbase_id = '';

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
        //selectors: {
        //    main_content: '.grid-container',
        //    right_content: '.right-content',
        //}
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

        //初始化树（第一个参数是页面对象本身的指针，第二个参数是树配置
        this.my_tree = new MyTree(this, this.tree_config);

        //绑定树节点的点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        //查询树
        this.my_tree.query(function (id) {
            that.tree_node_click(id);
        });

        //刷新按钮
        $('#refresh').click(function () {
            that.clear();
            $('input').val('');
            that.my_tree.reset();
            that.my_grid.query({
                ModelBaseID: '', MeterPointName: $('#search-name').val()
            });
            //that.current_group_select_id = '';
            //that.my_group.clear_selection();
            //that.my_group.query({ ModelBaseId: 'root', MeterBaseName: '' });
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        var that = this;
        this.clear();
        this.current_tree_select_id = id || '';
        $('#ModelBaseID').val(id);
        //this.current_group_select_id = null;
        //this.my_group.query({ ModelBaseId: this.current_tree_select_id, MeterBaseName: '' });
        this.my_grid.query({
            ModelBaseID: that.current_tree_select_id, MeterPointName: $('#search-name').val()
        });
        this.prepare_select_source_EnergyMedium(that.current_tree_select_id);
    },

    //clear: function () {
    //    this.my_grid.clear_selection();
    //    $('.right-content form input').val('');
    //    $('.right-content form select').val('');
    //    //$('#search-name').val('');
    //},

    prepare_PanelModelBaseID_event: function () {
        var that = this;
        var temp_ModelBaseID_ylc = '1d214af5860ff10A27bc86aa'; //贵溪冶炼厂ID
        that.prepare_select_source_PanelModelBaseID_1(temp_ModelBaseID_ylc);

        //onchange事件
        $('#PanelModelBaseID_1').change(function () {
            that.prepare_select_source_PanelModelBaseID_2($('#PanelModelBaseID_1').val());
            var tmpID1 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID1;
        });

        //onchange事件
        $('#PanelModelBaseID_2').change(function () {
            that.prepare_select_source_PanelModelBaseID_3($('#PanelModelBaseID_2').val());
            var tmpID2 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID2;
        });

        //onchange事件
        $('#PanelModelBaseID_3').change(function () {
            that.prepare_select_source_PanelModelBaseID_4($('#PanelModelBaseID_3').val());
            var tmpID3 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID3;
        });

        //onchange事件
        $('#PanelModelBaseID_4').change(function () {
            var tmpID4 = $('#PanelModelBaseID_4').val() ? $('#PanelModelBaseID_4').val() : $('#PanelModelBaseID_3').val() ? $('#PanelModelBaseID_3').val() : $('#PanelModelBaseID_2').val() ? $('#PanelModelBaseID_2').val() : $('#PanelModelBaseID_1').val();
            Page.current_selected_panel_modelbase_id = tmpID4;
        });
    }
}