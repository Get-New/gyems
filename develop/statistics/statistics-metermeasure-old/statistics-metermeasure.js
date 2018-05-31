var Page = {
    my_grid: null,

    /* 当前树种选中的Id */
    current_tree_select_id: '',

    /* 编辑区初始显示状态 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'MeterMeasureID',
                    'MeasurePropertyID',
                    'MeasurePropertyName',
                    'MeterPointID',
                    'MeterPointName',
                    'MeterMeasureType',
                    'ModelBaseID',
                    'ENABLESIGN',
                    'DESCRIPTIONINFO'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [
                        //{ text: '序号', dataIndex: '', width: 100 },
                        { text: '统计单元', dataIndex: 'MeasurePropertyName', flex: 1 },
                        { text: '计量点名字', dataIndex: 'MeterPointName', flex: 1 },
                        {
                            text: '计量类型', dataIndex: 'MeterMeasureType', flex: 1,
                            renderer: function (value) {
                                switch (value) {
                                    case 1: return '加';
                                    case 2: return '减';
                                    case 3: return '不参与';
                                    default: return '';
                                }
                            }
                        },
                        {
                            text: '可用标识', dataIndex: 'ENABLESIGN', flex: 1,
                            renderer: function (value) {
                                switch (value) {
                                    case 1: return '可用';
                                    case 2: return '不可用';
                                    default: return '';
                                }
                            }
                        },
                        { text: '备注', dataIndex: 'DESCRIPTIONINFO', flex: 1 }
                    ]
                }
            },

            url: '/api/MeterMeasure/GetPage',
            ps: 8,
            show_delete_column: true,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {

        var that = this;

        //初始化的MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        //查询按钮
        $('#query').click(function () {
            var MeasurePropertyID = $('#MeasurePropertyID').val();
            $('#MeasurePropertyID-S').val(MeasurePropertyID);
            Page.prepare_select_source_MeterPointID(MeasurePropertyID);
            that.clear();
            that.my_grid.query({
                MeasurePropertyID: $('#MeasurePropertyID').val()
            });
        });

        //添加按钮
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        //form添加
        $('#submit-add').click(function () {
            $('#MeasurePropertyID').val($('#MeasurePropertyID-S').val());
            that.submit_add();
        });

        //form修改
        $('#submit-edit').click(function () {
            $('#MeasurePropertyID').val($('#MeasurePropertyID-S').val());
            that.submit_edit('edit');
        });

        //form查询统计单元
        $('#search-MeasurePropertyID-S').click(function () {
            Page.prepare_select_source_MeasurePropertyID();
        });

        //form查询计量点
        $('#search-MeterPointID').click(function () {
            var MeasurePropertyID = $('#MeasurePropertyID-S').val();
            Page.prepare_select_source_MeterPointID(MeasurePropertyID);
        });

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        //初始化表单
        this.clear();

    },

    //准备 统计单元 的下拉框数据源
    prepare_select_source_MeasurePropertyID: function () {

        $('#MeasurePropertyID').val('').html('');
        $('#MeasurePropertyID-S').val('').html('');

        $.ajax({
            url: '/api/EngeryMeasureProperty/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: this.current_tree_select_id, MeasurePropertyName:'',  },
            success: function (data) {

                var MeasureProperty = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载能耗计量点失败');
                    return;
                }

                if (!MeasureProperty || !MeasureProperty.length) {
                    return;
                }

                for (var i in MeasureProperty) {
                    var item = MeasureProperty[i];
                    var option1 = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    var option2 = $('<option>').val(item.MeasurePropertyID).html(item.MeasurePropertyName);
                    $('#MeasurePropertyID').append(option1);
                    $('#MeasurePropertyID-S').append(option2);
                }

                $('#MeasurePropertyID').val('');
                $('#MeasurePropertyID-S').val('');

            }
        })
    },

    //准备 计量点 的下拉框数据源
    prepare_select_source_MeterPointID: function (MeasurePropertyID) {

        $('#MeterPointID').val('').html('');

        $.ajax({
            url: '/api/MeterMeasure/GetMeterPoint',  //自定义接口
            type: 'get',
            dataType: 'json',
            data: { MeasurePropertyID: MeasurePropertyID },
            success: function (data) {

                var MeterPoint = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载产品计量点失败');
                    return;
                }

                if (!MeterPoint || !MeterPoint.length) {
                    //$('#MeterPointID').append("<option value='-1'>没有产品计量点可供选择</option>");
                    //$('#MeterPointID').attr("disabled", "disabled");
                    return;
                }

                for (var i in MeterPoint) {
                    var item = MeterPoint[i];
                    var option = $('<option>').val(item.MeterPointID).html(item.MeterPointName);
                    $('#MeterPointID').append(option);
                }

                $('#MeterPointID').val('');

            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MeterMeasureID: record.MeterMeasureID };

        Util.ajax_delete({
            data: data,
            model: 'MeterMeasure',
            confirm_msg: function () {
                return '确认要删除这条记录吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.MeasurePropertyID = $('#MeasurePropertyID-S').val();
        data.MeterPointID = $('#MeterPointID').val();

        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'MeterMeasure',
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
        data.MeasurePropertyID = $('#MeasurePropertyID-S').val();
        data.MeterPointID = $('#MeterPointID').val();

        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'MeterMeasure',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        if (!data.MeasurePropertyID) {
            return '请选择统计单元';
        }
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.MeasurePropertyID) {
            return "请选择统计单元";
        }
        if (!data.MeterPointID) {
            return "请选择计量点";
        }
        if (!data.MeterMeasureType) {
            return "请选择计量类型";
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        $('#MeasurePropertyID-S').val(data.MeasurePropertyID);
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
        $('.right-content form input').val('');
        $('.right-content form select').val('');
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
            that.right_panel.hide_right_panel();
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
        this.my_tree.query();

        //刷新按钮
        $('#refresh').click(function () {
            that.clear();
            that.my_tree.reset();
            that.my_grid.query({ MeasurePropertyID: '' });
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id || '';
        $('#MeasurePropertyID-S').val('').html('');
        $('#MeterPointID').val('').html('');
        this.prepare_select_source_MeasurePropertyID();
        this.my_grid.query({ MeasurePropertyID: 'SetGridNull' });
    }

};