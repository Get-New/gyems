
var Page = {  

    my_grid: null,

    my_grid_config: {
        store_config: {
            fields: ['UnitMeasureId', 'UnitMeasureName', 'UnitMeasureCode', 'UnitMeasureAlias', 'UnitMeasureBaseId', 'UnitMeasureBaseName', 'UnitMeasureValue', 'UnitClassId', 'UnitClassName', 'DescriptionInfo']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '名称',
                    dataIndex: 'UnitMeasureName',
                    flex: 0.225
                }, {
                    text: '分类',
                    dataIndex: 'UnitClassName',
                    flex: 0.225
                },
                {
                    text: '备注',
                    dataIndex: 'DescriptionInfo',
                    flex: 0.4
                }]
            }
        },

        url: '/api/UnitMeasure/GetPage',
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
            that.my_grid.query({ UnitMeasureName: $('#search-name').val(), UnitClassId: that.current_select_id });
        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({ UnitMeasureName: $('#search-name').val(), UnitClassId: that.current_select_id });
        	}
        });

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
            that.my_grid.exportExcel('单位管理');
        })

        this.group_grid_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();

        if (!that.current_select_id) {
            Util.alert("请选择计量单位类型");
            return;
        }
        data.UnitClassId = this.current_select_id;

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'UnitMeasure',
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
            model: 'UnitMeasure',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate: function (data) {
        if (!data.UnitMeasureName) {
            return "名字不可以为空";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { UnitMeasureId: record.UnitMeasureId };

        Util.ajax_delete({
            data: data,
            model: 'UnitMeasure',
            confirm_msg: function () {
                return '确认要删除名称为' + record.UnitMeasureName + '的记录吗?';
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




    my_form: null,

    my_form_config: {
        selector: 'form',
    },

    my_form_init: function () {
        var that = this;

        // 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form = new MyForm(this, this.my_form_config);
    },







    /* 左侧列表中选中的Id */
    current_select_id: '',

    group_grid_init: function () {

        var that = this;

        myGroup.config({
            idField: 'UnitClassId',
            nameField: 'UnitClassName',
            gridTitle: '单位种类',
            url: '/api/UnitMeasure/GetGroup',
        });

        myGroup.page = that;
        myGroup.init();
        

        myGroup.select(function (id, name) {            
            that.current_select_id = id;
            $('#search-name').val('');
            that.my_grid.query({ UnitClassId: id, UnitMeasureName: $('#search-name').val() });
        })

        myGroup.query();
    }
};






