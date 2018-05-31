var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: '',

    whether_there: false,
    //elevel: '',

    /* 编辑区正在显示 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'StandardBaseID',
                    'StandardBaseName',
                    'StandardBaseType',
                    'DescriptionInfo',
                    'ParentId',
                    'Path',
                    'ParentName',
                    'StandardBaseFileName',
                    'StandardBaseNFileName',
                    'DescriptionInfo',
                    'CreaterID',
                    'CreaterName',
                    'StandardBaseFileTypeID',
                    'EditorName',
                    'PdfFileName'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '文件名称',
                        dataIndex: 'StandardBaseName',
                        width: 220
                    }, {
                        text: '文件类型',
                        dataIndex: 'StandardBaseFileTypeID',
                        width: 120,
                        renderer: function (value) {
                            switch (value) {
                                case '1': return "标准类";
                                case '2': return "参考类";
                                case '3': return "通知类";
                                case '4': return "其他";
                                default: return "";
                            }
                        }
                    }, {
                        text: '所在目录',
                        dataIndex: 'ParentName',
                        width: 120
                    }, {
                        text: '创建人',
                        dataIndex: 'CreaterName',
                        width: 120
                    }, {
                        text: '最后修改人',
                        dataIndex: 'EditorName',
                        width: 120
                    }, {
                        text: '文件描述',
                        dataIndex: 'DescriptionInfo',
                        flex: 0.9
                    }
                    ]
                }
            },

            url: '/api/StandardBase/GetTreeFile',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: true,
            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {
        var that = this;

        //默认固定显示目录树
        var t_spin = $("#spin");
        t_spin.addClass('spinning');
        $('.main-content').addClass('main-content-left-spinned');
        $('.tree-selector').addClass('spinning');
        if (that.page && that.page.my_grid) {
            that.page.my_grid.grid.getView().refresh();
        }

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

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

        $("#upLoadFile").uploadify({
            'auto': true,                      //是否自动上传
            'swf': '/develop/ashx/uploadify.swf',      //上传swf控件,不可更改
            'uploader': '/develop/ashx/UpLoad.ashx',            //上传处理页面,可以aspx
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
                if (data) {
                    $('#StandardBaseName').val(file.name);
                    $('#StandardBaseFileName').val(file.name);
                    $('#StandardBaseNFileName').val(data);
                    that.submit_add();
                    return;
                }
                else {
                    Util.alert('上传错误，请重新选择目录');
                }
            }
        });

        //查询按钮
        //$('#query').click(function () {
        //    that.my_grid.query({ StandardBaseID: that.current_tree_select_id, StandardBaseFileTypeID: $('#StandardBaseFileTypeID_S').val() });
        //});

        //预览按钮
        $('#preview').click(function () {
            if ($("#StandardBaseNFileName").val() == '') {
                Util.alert('请在列表中选择文件');
                return false;
            }

            var temp_StandardBaseName = $("#StandardBaseName").val();
            if (temp_StandardBaseName.indexOf('.xls') > 0 || temp_StandardBaseName.indexOf('.xlsx') > 0) {
                Util.alert('Excel文件不支持预览');
            }
            else {
                that.pdf_preview();
            }
        });

        //预览关闭按钮
        //$('#File_Window_close').click(function () {
        //    that.file_window_close();
        //});

        //点击模态窗口时关闭预览
        $(".opacity-div-for-modelwin").click(function () {
            that.file_window_close();
        })

        //文件上传按钮
        //$('#import').click(function () {
        //    //if ($('#upLoadFile').val() == '') {
        //    //    alert('请选择文件');
        //    //    return false;
        //    //}
        //    if ($('#ParentId').val() == '') {
        //        alert('请正确选择目录');
        //        return false;
        //    }
        //    that.file_upload();
        //});

        //文件下载按钮
        $('#export').click(function () {
            if ($("#StandardBaseNFileName").val() == '') {
                Util.alert('请在列表中选择文件');
                return false;
            }

            that.file_download();
        });

        //文件名称修改
        $('#submit-edit').click(function () {
            var row = that.my_grid.get_last_selected();

            if (!row || !row.data) {
                Util.alert('请先选择一行记录');
                return;
            }

            that.submit_edit('edit');
        });

        //自动关闭右侧框
        $('#upLoadFile').click(function () {
            var callback = function () {
                that.my_grid.grid.getView().refresh()
            }
            that.right_panel.hide_right_panel(callback);
            that.clear();
        });

        // 页面加载后立即查询一次的函数，用于回调
        //var init_query = function () {
        //    that.my_grid.query({ StandardBaseID: that.current_tree_select_id, StandardBaseFileTypeID: '' });
        //}

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();
    },

    pdf_preview: function () {
        var pdf_filename = $("#PdfFileName").val();
        //var pdf_filename = '123.pdf';
        var pdf_url = "/Documents/Pdf/" + pdf_filename;

        var xmlhttp;
        //需要考虑兼容性
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (!xmlhttp) {
            Util.alert('当前浏览器不支持预览');
            return;
        }

        xmlhttp.open("GET", pdf_url, false);
        xmlhttp.send();
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                PDFObject.embed(pdf_url, "#show_pdf");
                $('.opacity-div-for-modelwin').show()
                $('.window').fadeIn(200);
            } //url存在
            else if (xmlhttp.status == 404) {
                Page.clear();
                Util.alert('该文件暂时无法预览，请稍后进行刷新尝试');
                return false;
            } //url不存在
            else {
                Page.clear();
                Util.alert('该文件暂时无法预览，请稍后进行刷新尝试');
                return false;
            } //其他状态
        }
    },

    file_window_close: function () {
        $('.window').hide();
        $('.opacity-div-for-modelwin').hide()
        $('#show_pdf').empty();
    },

    //file_upload: function () {
    //    $("#upLoadFile").uploadify('upload', '*');
    //},

    file_download: function () {
        var filename = $("#StandardBaseName").val();
        var nfilename = $("#StandardBaseNFileName").val();
        window.open('/develop/ashx/DownLoad.ashx?filename=' + filename + '&nfilename=' + nfilename);
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { StandardBaseID: record.StandardBaseID };
        data.StandardBaseType = 1;
        data.StandardBaseNFileName = record.StandardBaseNFileName;
        Util.ajax_delete({
            data: data,
            model: 'StandardBase',
            confirm_msg: function () {
                return '确认要删除名称为 ' + record.StandardBaseName + ' 的文件吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.StandardBaseFileTypeID = $("#StandardBaseFileTypeID_S").val();
        data.StandardBaseType = 1;
        data.ParentId = that.current_tree_select_id;
        Util.ajax_add({
            success_msg: '上传成功', //自定义提示信息
            data: data,
            validator: that.validate_add,
            model: 'StandardBase',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_edit: function () {
        var that = this;

        var row = that.my_grid.get_last_selected();

        if (!row || !row.data) {
            Util.alert('请先选择文件');
            return;
        }

        var data = this.my_form.serialize_data();
        data.StandardBaseType = 1;
        data.RelationshipParth = data.Path;
        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'StandardBase',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.ParentId) {
            return '请选择目录';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.StandardBaseFileName) {
            return "文件名不可以为空";
        }
    },

    on_grid_row_selected: function (data, index) {
        var that = this;

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
            that.clear();
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
        url: '/api/StandardBase/GetTreeDir?StandardBaseID=root',
        root_name: '文档目录',
        id_field: 'StandardBaseID',
        name_field: 'StandardBaseName',
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
            //that.my_tree.reset();
            //that.current_tree_select_id = '';
            //that.my_grid.query({ StandardBaseID: 'root', StandardBaseFileTypeID: '' });
        });
    },

    tree_node_click: function (id) {
        var that = this;

        this.clear();
        this.current_tree_select_id = id || "";
        $('#ParentId').val(this.current_tree_select_id);
        this.my_grid.query({ StandardBaseID: id, StandardBaseFileTypeID: $('#StandardBaseFileTypeID_S').val() });
    },

    StandardBaseFileTypeID_onchange: function () {
        var that = this;
        that.my_grid.query({ StandardBaseID: that.current_tree_select_id, StandardBaseFileTypeID: $('#StandardBaseFileTypeID_S').val() });
    }
}