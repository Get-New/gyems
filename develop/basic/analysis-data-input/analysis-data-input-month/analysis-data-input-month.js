var Page = {
    my_grid: null,
    my_group: null,

    //当前树选中的id
    current_tree_select_id: '',

    //当前左侧group选中的id
    current_group_select_id: '',

    //AttriType 存放当前location配置的属性类型 介质为EnergyMedium 产品类型为ProductClass
    current_AttriType: '',

    //AttriID 存放对应的介质/产品id
    current_AttriID: '',

    //MeasurePropertyType 存放当前location配置的计量类型 输入、输出、计划、单耗、其他等 对应的 1 2 3 4 5 6 7 8 进行逗号分隔
    current_MeasurePropertyType: '',

    //location配置规则举例 电力补录(不包含计划录入) 其中 AttriType AttriID 值可以为字符串all
    //?AttriType:EnergyMedium;AttriID:1d22868c6ca69b8A27bc86aa;MeasurePropertyType:1,2,3,4,5,6,8

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'Report_LogID',
                    'Report_ID',
                    'Report_Log',
                    'Report_NaturallyDate',
                    'Report_ComputeValue'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '统计日期',
                        dataIndex: 'Report_NaturallyDate',
                        width: 180
                    }, {
                        text: '统计数据',
                        dataIndex: 'Report_ComputeValue',
                        width: 180
                    }, {
                        text: '数据分析',
                        dataIndex: 'Report_Log',
                        flex: 0.9
                    }]
                }
            },

            url: '/api/ReportLog/GetMonth',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）

            show_delete_column: true,
            show_paging: false,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
            delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    my_group_config: function () {
        return {
            store_config: {
                fields: [
                    'MeasurePropertyID',
                    'MeasurePropertyName',
                    'EnergyMediumName'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0,
                        align: 'left'
                    },
                    items: [
                        { text: '单元名称', dataIndex: 'MeasurePropertyName', width: 240 }
                    ]
                }
            },

            url: '/api/EngeryMeasureProperty/GetPage',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
            show_delete_column: false,
            row_select_handler: 'on_group_row_selected',

            grid_container_id: 'collect-group-container'
        }
    },

    init: function () {
        var that = this;

        // 初始化MyGrid
        var temp_my_grid_config = this.my_grid_config()

        this.my_grid = new MyGrid(this, temp_my_grid_config);

        this.my_group = new MyGrid(this, this.my_group_config());

        // 绑定查询按钮事件
        $('#query').click(function () {
            var year = $('#search-sdate').val();
            that.my_grid.query({
                unit_id: that.current_group_select_id,
                year: year
            });
        });

        $('#search-sdate').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                var year = $('#search-sdate').val();
                that.my_grid.query({
                    unit_id: that.current_group_select_id,
                    year: year
                });
            }
        });

        // 新增
        $('#edit').click(function () {
            that.on_btn_edit_clicked();
        });

        // add
        $('#submit-add').click(function () {
            if (that.current_group_select_id) {
                that.submit_add();
            }
            else {
                that.my_gropu.clear_selection();
                Util.alert("请选择统计单元");
            }
        })

        // edit
        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        //获取当前location配置
        this.get_location_info();

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();
        this.get_years();

        // 初始化表单
        this.clear();
    },

    //获取当前location配置
    get_location_info: function () {
        Page.current_AttriType = 'all'; //获得AttriType值
        Page.current_AttriID = ''; //获得AttriID值
        Page.current_MeasurePropertyType = '1,2,3,4,5,6,8'; //获得MeasurePropertyType值 此处不包括计划类7
    },

    get_years: function () {
        $('#search-sdate').val('').html('');
        $.ajax({
            url: '/api/StatisticsReportQuery/GetYearList',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                if (_.isArray(data)) {
                    for (var i in data) {
                        var item = data[i];
                        var option = $('<option>').val(item).html(item);
                        $('#search-sdate').append(option);
                    }
                }
            }
        });
    },

    submit_add: function () {
        var that = this;

        var row = that.my_grid.get_last_selected();

        if (!row || !row.data) {
            Util.alert('请先选择一行记录');
            return;
        }

        var data = this.my_form.serialize_data();

        $.ajax({
            url: '/api/ReportLog/AddMonth',
            method: 'post',
            dataType: 'json',
            data: data,
            success: function (data) {
                that.my_grid.reload();
                Util.alert('添加成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误：' + errorThrown)
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

        $.ajax({
            url: '/api/ReportLog/EditMonth',
            method: 'put',
            dataType: 'json',
            data: data,
            success: function (data) {
                that.my_grid.reload();
                Util.alert('编辑成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误：' + errorThrown)
            }
        });
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { Report_LogID: record.Report_LogID };

        $.ajax({
            url: '/api/ReportLog/DeleteMonth',
            method: 'delete',
            dataType: 'json',
            data: data,
            success: function (data) {
                that.my_grid.reload();
                that.clear();
                Util.alert('删除成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误：' + errorThrown)
            }
        });
    },

    on_grid_row_selected: function (data, index) {
        //console.log("data:");
        //console.log(data);
        var that = this;

        that.clear();

        that.spin_fold(); //左侧树折叠

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
    },
    on_grid_dblclicked: function () {
        var that = this;

        that.spin_fold(); //左侧树折叠

        var callback = function () {
            that.my_grid.refresh_view();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
        }

        this.right_panel.toggle_right_panel(callback);
    },

    on_btn_edit_clicked: function () {
        var that = this;

        that.spin_fold(); //左侧树折叠

        this.clear();

        var callback = function () {
            that.my_grid.refresh_view();
            $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
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
        selectors: {
            main_content: '.grid-container',
            right_content: '.right-content'
        }
    },

    right_panel_init: function () {
        var that = this;

        this.right_panel = new RightPanel(this.right_panel_config);

        // 右侧框的关闭事件
        $('.close-button').click(function () {
            var callback = function () {
                that.my_grid.grid.getView().refresh();
                $('#collect-group-container').attr("style", ""); //使左侧区域不缩进
            }
            that.right_panel.hide_right_panel(callback);
        })
    },

    my_form: null,

    my_form_config: {
        selector: 'form'
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

        // 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
        this.my_tree = new MyTree(this, this.tree_config);

        // 绑定树节点点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        // 查询树
        this.my_tree.query(function (id) {
            that.current_tree_select_id = id;
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            $('#search-name').val('');
            that.my_tree.reset();
            that.current_tree_select_id = '';
            that.my_grid.query({
                unit_id: that.current_group_select_id,
                year: ''
            });
            that.current_group_select_id = '';
            that.my_group.clear_selection();
            that.my_group.query({
                ModelBaseID: that.current_tree_select_id,
                AttriType: Page.current_AttriType,
                AttriID: Page.current_AttriID,
                MeasurePropertyType: Page.current_MeasurePropertyType
            });
        });
    },

    tree_node_click: function (id) {
        var that = this;
        this.clear();
        this.my_group.clear_selection();
        this.current_tree_select_id = id;
        this.current_group_select_id = null;
        this.my_group.query({
            ModelBaseID: that.current_tree_select_id,
            AttriType: Page.current_AttriType,
            AttriID: Page.current_AttriID,
            MeasurePropertyType: Page.current_MeasurePropertyType
        });
    },

    on_group_row_selected: function (data) {
        var that = this;
        that.current_group_select_id = data.MeasurePropertyID;
        this.clear();
        var year = $('#search-sdate').val();
        that.my_grid.query({
            unit_id: that.current_group_select_id,
            year: year
        });
    },

    spin_fold: function () {
        var that = this;
        var t = $("#spin");
        if (t.hasClass('spinning')) {
            t.removeClass('spinning');
            $('.main-content').removeClass('main-content-left-spinned');
            $('.tree-selector').removeClass('spinning');
            if (that.page && that.page.my_grid) {
                that.page.my_grid.grid.getView().refresh();
            }
        }
    }
};