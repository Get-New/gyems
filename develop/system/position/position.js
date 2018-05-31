
var Page = {

    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: ['PositionId', 'PositionName', 'UserCount']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '节点分组名称',
                    dataIndex: 'PositionName'
                }]
            }
        },

        url: '/api/ManagePosition/GetPage',

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
            that.my_grid.query({ PositionName: $('#search-name').val() });
            that.clear();
        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({ PositionName: $('#search-name').val() });
        		that.clear();
        	}
        });

        // 页面加载后先查询一次
        this.my_grid.query({ PositionName: '' });
        

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

        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/ManagePosition/Add',
            type: 'post',
            data: data,
            success: function (data) {

                if (!data || data.Error) {
                    Util.alert('发生错误，操作失败');
                    console.log(data);
                    return;
                }

                that.my_grid.reload();
                Util.alert('添加成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误，操作失败');
                console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
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
            url: '/api/ManagePosition/Edit',
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
        if (!data.PositionName) {
            return "名字不可以为空";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { PositionId: record.PositionId };
        Util.confirm('确认要删除名称为' + record.PositionName + '的记录吗?', function () {
            $.ajax({
                url: '/api/ManagePosition/Delete',
                type: 'delete',
                data: data,
                success: function (data) {

                    if (!data || data.Error) {
                        Util.alert('发生错误，操作失败');
                        console.log(data);
                        return;
                    }

                    that.my_grid.reload();
                    Util.alert('删除成功');
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    Util.alert('出现错误，操作失败');
                    console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
                }
            });
        });
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