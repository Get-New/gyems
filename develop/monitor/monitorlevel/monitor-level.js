
var Page = {

    my_grid: null,

    /* 当前在树中选中的Id */
    //current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            fields: ['AlarmGradeId', 'AlarmGradeName', 'AlarmGradeGrade', 'DescriptionInfo']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '级别名称',
                    dataIndex: 'AlarmGradeName'
                }, {
                    text: '级别',
                    dataIndex: 'AlarmGradeGrade'
                },{
                text: '描述',
                dataIndex: 'DescriptionInfo'
            }]
            }
        },

        url: '/api/AlarmGrade/GetPage',
        ps: 8,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        delete_handler: 'on_grid_row_delete_clicked',
        dblclick_handler: 'on_grid_dblclicked',
    },

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ AlarmGradeName: $('#search-name').val(), RootId:''});
            that.clear();
        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({ AlarmGradeName: $('#search-name').val(), RootId: '' });
        		that.clear();
        	}
        });

        // 页面加载后先查询一次
        this.my_grid.query({ AlarmGradeName: '', RootId: '' });

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
            that.my_grid.exportExcel('报警级别');
        })

        //this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'AlarmGrade',
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
            model: 'AlarmGrade',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate: function (data) {
        if (!data.AlarmGradeName) {
            return "名字不可以为空";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { AlarmGradeId: record.AlarmGradeId };

        Util.ajax_delete({
            data: data,
            model: 'AlarmGrade',
            confirm_msg: function () {
                return '确认要删除名称为' + record.AlarmGradeName + '的报警级别吗?';
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

    //my_tree: null,

    //tree_config: {
    //    url: '/api/FactoryModelbase/GetTree',
    //    root_name: '工厂模型',
    //    id_field: 'ModelBaseId',
    //    name_field: 'ModelBaseName'
    //},

    //tree_init: function () {

    //    var that = this;

    //    // 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
    //    this.my_tree = new MyTree(this, this.tree_config);

    //    // 绑定树节点点击方法
    //    this.my_tree.bind_node_click_event_handler(this.tree_node_click);

    //    // 查询树
    //    this.my_tree.query();

    //    // 刷新按钮
    //    $('#refresh').click(function () {
    //        that.my_tree.reset();
    //        that.current_tree_select_id = 'root';
    //        $('#search-name').val('');
    //        that.my_grid.query({ AlarmGradeName: $('#search-name').val(), RootId: 'root' });
    //    });
    //},

    //tree_node_click: function (id) {
    //    this.current_tree_select_id = id;
    //    $('#search-name').val('');
    //    this.my_grid.query({ AlarmGradeName: $('#search-name').val(), RootId: id });
    //    this.clear();
    //},


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