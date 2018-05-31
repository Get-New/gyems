var Page = {
    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: [
                'MessageLogID',
                'MessageID',
                'MessagePushedDate',
                'MessageMakeDate',
                'MessageCommentsDate',
                'MessageContent',
                'IsMessagePushed',
                'Comments',
            ]
        },

        grid_config: {
            columns: {
                items: [
                {
                    text: '生成时间',
                    dataIndex: 'MessageMakeDate',
                    flex: 0.2
                }, {
                    text: '消息内容',
                    dataIndex: 'MessageContent',
                    flex: 0.9
                }
                //, {
                //    text: '处理批注',
                //    dataIndex: 'Comments',
                //    flex: 0.9
                //}, {
                //    text: '批注时间',
                //    dataIndex: 'MessageCommentsDate',
                //    flex: 0.5
                //}
                ]
            },
        },

        url: '/api/MessageLog/GetPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: false

        //row_select_handler: 'on_grid_row_selected'
        //dblclick_handler: 'on_grid_dblclicked'
        //delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        laydate({
            elem: '#search-sdate-start',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD',
            istoday: true
        });
        $('#search-sdate-start').val(laydate.now(-10, "YYYY-MM-DD"));
        laydate({
            elem: '#search-sdate-end',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD',
            istoday: true
        });
        $('#search-sdate-end').val(laydate.now(0, "YYYY-MM-DD"));

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                MessageContent: $('#search-name').val(),
                DateStart: $('#search-sdate-start').val(),
                DateEnd: $('#search-sdate-end').val()
            });

            that.clear();
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;

                that.my_grid.query({
                    MessageContent: $('#search-name').val(),
                    DateStart: $('#search-sdate-start').val(),
                    DateEnd: $('#search-sdate-end').val()
                });

                that.clear();
            }
        });

        // 页面加载后先查询一次
        this.my_grid.query({
            MessageContent: $('#search-name').val(),
            DateStart: $('#search-sdate-start').val(),
            DateEnd: $('#search-sdate-end').val()
        });

        //// 新增
        //$('#add').click(function () {
        //    that.on_btn_add_clicked();
        //});

        //// add
        //$('#submit-add').click(function () {
        //    that.submit_add();
        //});

        // edit
        //$('#edit').click(function () {
        //    that.on_grid_dblclicked();
        //});

        // edit
        //$('#submit-edit').click(function () {
        //    that.submit_edit();
        //});

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('消息详情');
        });

        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    //编辑 消息回写 后台暂未实现
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
            url: '/api/Message/EditDetail',
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
        if (!data.MessageLogID) {
            return "请重新选择消息";
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
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
    }
};