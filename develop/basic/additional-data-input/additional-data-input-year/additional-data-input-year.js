var Page = {
    my_grid: null,
    my_group: null,

    //当前仪表group选中的id
    current_group_select_id: '',

    //AttriType 存放当前location配置的属性类型 介质为EnergyMedium 产品类型为ProductClass
    current_AttriType: '',

    //AttriID 存放对应的介质/产品id
    current_AttriID: '',

    //MeasurePropertyType 存放当前location配置的计量类型 输入、输出、计划、单耗、其他等 对应的 1 2 3 4 5 6 7 8 进行逗号分隔
    current_MeasurePropertyType: '',

    //location配置规则举例 电力补录(不包含计划录入) 其中 AttriType AttriID 值可以为字符串all
    //?AttriType:EnergyMedium;AttriID:1d22868c6ca69b8A27bc86aa;MeasurePropertyType:1,2,3,4,5,6,8;

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'Report_UnitId',
                    'Report_StartTime',
                    'Report_DateTime',
                    'Report_ComputeValue',
                    'Report_NaturallyDate'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '时间',
                        dataIndex: 'Report_NaturallyDate',
                        flex: 0.9
                    }, {
                        text: '数值',
                        dataIndex: 'Report_ComputeValue',
                        flex: 0.9
                    }]
                }
            },

            url: '', //通过init函数进行配置
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）

            show_delete_column: false,
            show_paging: false,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked'
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
                        { text: '单元名称', dataIndex: 'MeasurePropertyName', width: 350 }
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

        //获取当前location配置
        this.get_location_info();

        // 初始化MyGrid
        var temp_my_grid_config = this.my_grid_config()

        if (Page.current_MeasurePropertyType == '7') {
            temp_my_grid_config.url = '/api/ReportDataCopy/QueryYearCopy';
            this.my_grid = new MyGrid(this, temp_my_grid_config);
        }
        else {
            temp_my_grid_config.url = '/api/ReportDataCopy/QueryYearReport';
            this.my_grid = new MyGrid(this, temp_my_grid_config);
        }

        this.my_group = new MyGrid(this, this.my_group_config());

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                unitid: that.current_group_select_id
            });
        });

        // 新增
        $('#edit').click(function () {
            that.on_btn_edit_clicked();
        });

        // edit
        $('#submit-edit').click(function () {
            that.submit_edit();
        });

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    //获取当前location配置
    get_location_info: function () {
        var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;//window.location.search.replace('?', ''); //获得window.location
        Page.current_AttriType = temp_location.split('AttriType:')[1] ? temp_location.split('AttriType:')[1].split(';')[0] : null; //获得AttriType值
        Page.current_AttriID = temp_location.split('AttriID:')[1] ? temp_location.split('AttriID:')[1].split(';')[0] : null; //获得AttriID值
        Page.current_MeasurePropertyType = temp_location.split('MeasurePropertyType:')[1] ? temp_location.split('MeasurePropertyType:')[1].split(';')[0] : null; //获得MeasurePropertyType值
    },

    ////获取统计单元id集合
    get_measurepropertyids: function () {
        var temp_ids = [];
        $.ajax({
            url: '/api/EngeryMeasureProperty/GetPage',
            method: 'get',
            dataType: 'json',
            async: false,
            data: {
                ModelBaseID: Page.current_tree_select_id,
                AttriType: Page.current_AttriType,
                AttriID: Page.current_AttriID,
                MeasurePropertyType: Page.current_MeasurePropertyType
            },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    var MeasurePropertyList = data.Models;
                    var temp_length = MeasurePropertyList.length;
                    for (var i = 0; i < temp_length; i++) {
                        temp_ids.push(MeasurePropertyList[i].MeasurePropertyID);
                    }
                }
            }
        });

        return temp_ids;
    },

    get_download_excel: function (unitid, year, month, day) {
        var form = $("<form>");
        form.attr("style", "display:none");
        form.attr("target", "_blank");
        form.attr("method", "post");
        form.attr("action", '/api/ReportDataCopy/DownLoad');
        $("body").append(form);

        var input1 = $("<input>");
        input1.attr("type", "hidden");
        input1.attr("name", "unitid");
        input1.attr("value", unitid);

        var input2 = $("<input>");
        input2.attr("type", "hidden");
        input2.attr("name", "year");
        input2.attr("value", year);

        var input3 = $("<input>");
        input3.attr("type", "hidden");
        input3.attr("name", "month");
        input3.attr("value", month);

        var input4 = $("<input>");
        input4.attr("type", "hidden");
        input4.attr("name", "day");
        input4.attr("value", day);

        var input5 = $("<input>");
        input5.attr("type", "hidden");
        input5.attr("name", "cycle");
        input5.attr("value", '年');

        form.append(input1);
        form.append(input2);
        form.append(input3);
        form.append(input4);
        form.append(input5);

        form.submit();
        form.remove();
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
            url: '/api/ReportDataCopy/EditYear',
            method: 'put',
            dataType: 'json',
            async: false,
            data: data,
            success: function (data) {
                if (data.Success) {
                    Util.alert('编辑成功，请稍后刷新查看结果');
                } else {
                    Util.alert('编辑失败');
                }
            }
        });
    },

    on_grid_row_selected: function (data, index) {
        //console.log("data:");
        //console.log(data);
        var that = this;

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
            that.tree_node_click(id);
        });

        // 刷新按钮
        $('#refresh').click(function () {
            $('#search-name').val('');
            that.my_tree.reset();
            that.current_tree_select_id = '';
            that.my_grid.query({
                unitid: that.current_group_select_id
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
        that.my_grid.query({
            unitid: that.current_group_select_id
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
                that.page.my_grid.grid.getView().refresh()
            }
        }
    }
};