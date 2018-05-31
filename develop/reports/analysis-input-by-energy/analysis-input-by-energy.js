

var Page = {
    my_grid: null,

    //当前选中的工厂节点id
    current_tree_select_id: 'root',

    //当前选中列表行的介质id
    temp_EnergyMediumId: '',

    my_grid_config: {
        store_config: {
            fields: [
            'ContextId',
            'EnergyMediumId',
            'EnergyMediumName',
            'ModelBaseId',
            'ModelBaseName',
            //'LastModifyTime',
            'Year',
            'Month',
            'ContextText',
            'DescriptionInfo'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [

                {
                   text: '能源介质',
                   dataIndex: 'EnergyMediumName',
                   width: 120,
                },
                {
                    text: '车间部门',
                    dataIndex: 'ModelBaseName',
                    width: 120,

                },
                {
                    text: '年份',
                    dataIndex: 'Year',
                    width: 120,

                },
                {
                    text: '月份',
                    dataIndex: 'Month',
                    width: 120,

                },
                {
                    text: '分析内容',
                    dataIndex: 'ContextText',
                    width: 550,

                },
                {
                    text: '备注',
                    dataIndex: 'DescriptionInfo',
                    flex: 0.9,

                },

                ]
            },
        },

        url: '/api/ReportContext/GetPage',
        ps: 11, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    //***************************************************内置函数****************************8

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        $('#query').click(function () {
            that.clear();
            that.my_grid.query({
                EnergyMediumId: $('#tEnergyMediumId').val(), ModelBaseId: that.current_tree_select_id
            });
        })

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            if ($('#ModelBaseId').val() == '') {
                Page.my_tree.reset();
                Util.alert("请选择工厂节点");
                return false;
            }
            if ($('#ModelBaseId').val() == 'root') {
                Page.my_tree.reset();
                Util.alert("请正确选择工厂节点");
                return false;
            }
            that.submit_add();
        })


        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能耗分析内容');
        })

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();

        this.prepare_select_source_tEnergyMedium();
        this.get_year_list();
        this.get_month_list();

        // 初始化表单
        this.clear();
    },

    //获取年份list
    get_year_list: function () {
        //$('#tYear').val('').html('');
        $('#Year').val('').html('');
        $.ajax({
            url: '/api/StatisticsReportQuery/GetYearList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (_.isArray(data)) {

                    //var option = $('<option>').val('').html('');
                    //$('#tYear').append(option);

                    for (var i in data) {
                        var item = data[i];
                        var option = $('<option>').val(item).html(item);
                        //$('#tYear').append(option);
                        $('#Year').append(option);
                    }
                }
            }
        });
    },

    //获取月份list
    get_month_list: function () {
        $('#Month').val('').html('');
        //$('#tMonth').val('').html('');
        $.ajax({
            url: '/api/StatisticsReportQuery/GetMonthList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (_.isArray(data)) {

                    var option = $('<option>').val('').html('');
                    $('#Month').append(option);
                    //$('#tMonth').append(option);

                    for (var i in data) {
                        var item = data[i];
                        var option = $('<option>').val(item).html(item);
                        $('#Month').append(option);
                        //$('#tMonth').append(option);
                    }
                }
            }
        });
    },

    // 准备计量介质下拉框的数据源
    prepare_select_source_EnergyMedium: function (ModelBaseID) {

        $('#EnergyMediumId').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseId: ModelBaseID },
            success: function (data) {

                if (!data.Models || !data.Models.length) {
                    $('#EnergyMediumId').append("<option value='-1'>没有介质可供选择</option>");
                    //$('#EnergyMediumId').attr("disabled", "disabled");
                    return;
                }

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumId').append(option);
                }

                $('#EnergyMediumId').val('');

            }
        })
    },

    // 准备查询条件计量介质下拉框的数据源
    prepare_select_source_tEnergyMedium: function (ModelBaseID) {

        $('#tEnergyMediumId').val('').html('');

        $.ajax({
            url: '/api/EnergyMedium/GetList',
            type: 'get',
            dataType: 'json',
            //data: { ModelBaseId: ModelBaseID },
            success: function (data) {

                if (!data.Models || !data.Models.length) {
                    $('#tEnergyMediumId').append("<option value='-1'>没有介质可供选择</option>");
                    //$('#tEnergyMediumId').attr("disabled", "disabled");
                    return;
                }

                var option = $('<option>').val('').html('');
                $('#tEnergyMediumId').append(option);

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergymediumId).html(item.EnergymediumName);
                    $('#tEnergyMediumId').append(option);
                }

            }
        })
    },

    //*******************************设置增删改**********************************************************8
    on_grid_row_delete_clicked: function (record) {
        var that = this;

        var data = { ContextId: record.ContextId };

        Util.ajax_delete({
            data: data,
            model: 'ReportContext',
            confirm_msg: function () {
                return '确认要删除这条内容吗?';
            },
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    submit_add: function () {
        var that = this;

        var data = this.my_form.serialize_data();

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'ReportContext',
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
            error_msg:'操作失败',
            data: data,
            validator: that.validate,
            model: 'ReportContext',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
            }
        });
    },

    //*********************************************注意事**************************************************

    validate: function (data) {
        if (!data.EnergyMediumId) {
            return "请选择能源介质";
        }
        if (!data.Year) {
            return "请选择年份";
        }
        if (!data.ContextText) {
            return "请输入分析内容";
        }
    },

    on_grid_row_selected: function (data, index) {

        var that = this;

        that.prepare_select_source_EnergyMedium(data.ModelBaseId);

        that.clear();

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);

        //$('#Year').val(data.LastModifyTime.substr(0, 4));
        //$('#Month').val(data.LastModifyTime.substr(4, 2));

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
        $('textarea').html('');
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
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            that.current_tree_select_id = '';
            $('#search-name').val('');
            that.my_grid.query({
                EnergyMediumId: $('#tEnergyMediumId').val(), ModelBaseId: that.current_tree_select_id
            });
        });
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id, name) {

        var that = this;
        that.clear();

        this.current_tree_select_id = id;

        $('#ModelBaseId').val(id);
        $('#ModelBaseName').val(name);

        if (id != 'root') {
            this.prepare_select_source_EnergyMedium(id);
        }

        this.my_grid.query({
            EnergyMediumId: $('#tEnergyMediumId').val(), ModelBaseId: that.current_tree_select_id
        });

    },

}