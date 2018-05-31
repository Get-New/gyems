
var Page = {

    current_tree_select_id: 'root',

    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: ['InstitutionId', 'InstitutionName', 'UserCount', 'ParentId', 'InstitutionLevel', 'ParentName']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '部门名称',
                    dataIndex: 'InstitutionName'
                }, {
                    text: '部门级别',
                    dataIndex: 'InstitutionLevel'
                }, {
                    text: '用户数量',
                    dataIndex: 'UserCount'
                }, {
                    text: '上级部门',
                    dataIndex: 'ParentName'
                }]
            }
        },

        url: '/api/ManageInstitution/GetPage',
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

        //// 绑定查询按钮事件
        //$('#query').click(function () {
        //    that.my_grid.query({ InstitutionName: $('#search-name').val() });
        //    that.clear();
        //});

        // 页面加载后先查询一次
        this.my_grid.query({ InstitutionId: 'root', InstitutionName: '' });        

        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#testTab').click(function () {
            Util.openInNewTab('testMenuId', '测试tab页', '/welcome.html');
        });

        // add
        $('#submit-add').click(function () {
            if (that.current_tree_select_id == '') {
                that.my_tree.reset();
                Util.alert('请选择上级部门');
                return false;
            }

            $('#ParentId').val(that.current_tree_select_id);
            that.submit_add();
        })

        // add
        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        this.tree_init();
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
            model: 'ManageInstitution',
            success: function () {
                that.my_tree.query();
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
            model: 'ManageInstitution',
            success: function () {
                that.my_tree.query();
                that.my_grid.reload();
            }
        });
    },

    validate: function (data) {
        if (!data.InstitutionName) {
            return "部门名称不可以为空";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { InstitutionId: record.InstitutionId };

        Util.ajax_delete({
            data: data,          
            model: 'ManageInstitution',
            confirm_msg: function () {
                return '确认要删除名称为' + record.InstitutionName + '的部门吗?';
            },
            success: function () {
                that.my_tree.query();
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

    tree_config: {
        url: '/api/ManageInstitution/GetTree',
        root_name: '贵溪冶炼厂',
        id_field: 'InstitutionId',
        name_field: 'InstitutionName',
        appendRoot: true
    },

    tree_init: function () {

        var that = this;

        // 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
        this.my_tree = new MyTree(this, this.tree_config);

        // 绑定树节点点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        // 查询树
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            that.clear();
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            $('#ParentId').val('');
            that.my_grid.query({ InstitutionId: 'root', InstitutionName: '' });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || "";
        $('#ParentId').val(id);
        this.my_grid.query({ InstitutionId: id, InstitutionName: '' });
    }
};