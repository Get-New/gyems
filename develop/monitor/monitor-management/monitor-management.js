var Page = {
    my_grid: null,

    current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            fields: [
            'MonitorInfoID',
            'MonitorInfoName',
            'ModelBaseID',
            'ModelBaseName',
            'EnergyFactoryName',
            'EnergyMediumName',
            'EnergyMediumID',
            'MonitorInfoPath',
            'USERID',
            'LASTMODIFYTIME',
            'DESCRIPTIONINFO',
            'BUSINESSSORT',
            'ENABLESIGN',
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [

               {
                   text: '工厂节点',
                   dataIndex: 'ModelBaseName',
                   flex: 0.5,
               },

               {
                   text: '页面名称',
                   dataIndex: 'MonitorInfoName',
                   flex: 0.5,
               },

                {
                    text: '能源介质',
                    dataIndex: 'EnergyMediumName',
                    flex: 0.5,
                },
                 {
                     text: '监控页面路径',
                     dataIndex: 'MonitorInfoPath',
                     flex: 0.5,
                 },
                  {
                      text: '备注',
                      dataIndex: 'DESCRIPTIONINFO',
                      flex: 0.5,
                  },

                ]
            },
        },

        url: '/api/MonitorManagement/GetPage',
        show_delete_column: true,
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    //***************************************************内置函数****************************8

    init: function () {
        var that = this;

        // 初始化
        this.my_grid = new MyGrid(this, this.my_grid_config);

        that.my_grid.query({ EnergyMediumName: '', RootId: that.current_tree_select_id });

        // 初始化下拉框数据源（传入回调函数）
        that.prepare_select_source();

        $("#upLoadFile").uploadify({
            'auto': true,                      //是否自动上传
            'swf': '/develop/ashx_monitor/uploadify.swf',      //上传swf控件,不可更改
            'uploader': '/develop/ashx_monitor/MonitorUpLoad.ashx',            //上传处理页面,可以aspx
            'fileTypeDesc': '请选择文件',
            'fileTypeExts': '*.*',   //文件类型限制,默认不受限制
            'buttonText': '上传文件',//按钮文字
            'width': 75,
            'height': 16,
            //最大文件数量'uploadLimit':
            'multi': false,//单选
            'fileSizeLimit': '20MB',
            'queueSizeLimit': 1,  //队列限制
            'removeCompleted': true,
            'onUploadSuccess': function (file, data, response) {
                console.log(data);
                if (data) {
                    $('#MonitorInfoPath').val('/PDI/' + file.name);
                    $('#MonitorInfoPath_S').val('/PDI/' + file.name);
                    that.submit_edit();
                    if ($("#upLoadFile-queue")) {
                        $("#SWFUpload_0_0").hide();
                    }
                    return;
                }
            }
        });

        $('#query').click(function () {
            that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: that.current_tree_select_id });
            //console.log($('#EnergyMedium').val())
        });

        $('#EnergyMedium').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: that.current_tree_select_id });
            }
        });

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            that.submit_add();
        })

        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        //$('#select-file').click(function () {
        //    $('input[class=file-inputstyle]').click();
        //})

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能源监控管理');
        })

        //文件上传按钮
        //$('#import').click(function () {
        //    if ($('#MonitorInfoID') == '') {
        //        alert('请在列表中选择页面名称');
        //        return false;
        //    }
        //    that.file_upload();
        //});

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();

        // 初始化表单
        this.clear();

        this.prepare_select_source1();
    },

    //file_upload: function () {
    //    $("#upLoadFile").uploadify('upload', '*');
    //},

    // 准备下拉框的数据源
    prepare_select_source: function () {
        $.ajax({
            url: '/api/EnergyMedium/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#EnergyMedium').append("<option value='-1'>没有能源种类可供选择</option>");
                    //$('#EnergyMedium').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMedium').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergymediumName).html(item.EnergymediumName);
                    $('#EnergyMedium').append(option);
                }
                $('#EnergyMedium').val('');
            }
        })
    },

    // 准备下拉框的数据源
    prepare_select_source1: function (callback) {
        $('#EnergyMediumName').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseId: this.current_tree_select_id },

            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    $('#EnergyMediumName').append("<option value='-1'>没有能源种类可供选择</option>");
                    //$('#EnergyMediumName').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMediumName').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumName').append(option);
                }
                $('#EnergyMediumName').val('');

                if (typeof callback == 'function') {
                    callback();
                }
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MonitorInfoID: record.MonitorInfoID };
        data.MonitorInfoPath = record.MonitorInfoPath;
        Util.ajax_delete({
            data: data,
            model: 'MonitorManagement',
            confirm_msg: function () {
                return '确认要删除此路径吗?';
            },
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    submit_add: function () {
        var that = this;
        $('#MonitorInfoPath').val('');
        $('#MonitorInfoPath_S').val('');
        var data = this.my_form.serialize_data();
        if (!that.current_tree_select_id) {
            Util.alert('请选择工厂节点');
            return false;
        }
        data.EnergyMediumID = $('#EnergyMediumName').val();
        console.log(data)
        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'MonitorManagement',
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
        data.EnergyMediumID = $('#EnergyMediumName').val();
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'MonitorManagement',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },
    //*********************************************注意事**************************************************8

    validate: function (data) {
        if (!data.ModelBaseID) {
            return "请选择工厂节点";
        }
        if (!data.MonitorInfoName) {
            return "请填写页面名称";
        }
        if (!data.EnergyMediumID) {
            return "请选择能源介质";
        }
        //if (!data.MonitorInfoPath) {
        //    return "请填写监控画面路径";
        //}
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        $('#EnergyMediumName').val(data.EnergyMediumID);
        $('#MonitorInfoPath_S').val(data.MonitorInfoPath);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.grid.getView().refresh()
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_add_clicked: function () {
        var that = this;
        this.clear();

        var callback = function () {
            that.my_grid.grid.getView().refresh()
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

    my_form: null,

    my_form_config: {
        selector: 'form',
    },

    my_form_init: function () {
        var that = this;

        // 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form = new MyForm(this, this.my_form_config);
    },
    //**************************************************引入树***************************8

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
            that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: 'root' });
        });
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id;
        this.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: id });

        this.prepare_select_source1();

        $('#ModelBaseName').val(this.my_tree.current_select_name);
        $('#ModelBaseID').val(this.current_tree_select_id);
    }
};