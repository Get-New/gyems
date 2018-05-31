
var Page = {
    my_grid: null,

    my_grid_config: {                                   
        store_config: {
            fields: [
            'StatisticCycleID',
            'StatisticCycleName',
            'StatisticCycleCode',
            'StatisticCycleTime',
            'DESCRIPTIONINFO',

            ]
        },

        grid_config: {                                 
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
        {
            text: '名称',
            dataIndex: 'StatisticCycleName',
            flex: 0.5,
        }, {
            text: '编码',
            dataIndex: 'StatisticCycleCode',
            flex: 0.5,
        }, {
            text: '周期',
            dataIndex: 'StatisticCycleTime',
            flex: 0.5,
        }, {
            text: '描述',
            dataIndex: 'DESCRIPTIONINFO',
            flex: 0.5,
        }, 
                ]
            },
        },

        url: '/api/StatisticCycle/GetPage',
        ps: 11,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'

    },
    //***************************************************内置函数************************************8

    init: function () {                                         

        var that = this;


        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);


        $('#query').click(function () {

            that.my_grid.query({ StatisticCycleName: $('#search-name').val() });

        });

        that.my_grid.query({ StatisticCycleName: '' });

        $('#add').click(function () {
            
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            that.submit_add();
        })

        
        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计周期查询');
        })

        this.right_panel_init();
        this.my_form_init();

        this.clear();

        
    },

    //******************************************************设置增删改**********************************8

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/StatisticCycle/Add',
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
            url: '/api/StatisticCycle/Edit',
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

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { StatisticCycleID: record.StatisticCycleID };
        Util.confirm('确认要删除名称为' + record.StatisticCycleName + '的记录吗?', function () {
            $.ajax({
                url: '/api/StatisticCycle/Delete',
                type: 'delete',
                data: data,
                success: function (data) {

                    if (!data || data.Error) {
                        Util.alert('发生错误，操作失败');
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
    //*********************************************注意事************************************8

    validate: function (data) {
        if (!data.StatisticCycleName) {
            return "名称不可以为空，请填好谢谢";
            
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

    //******************************右侧框隐藏**********************************************************8
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
