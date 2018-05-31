var Page = {
    my_grid: null,
    my_group: null,

    //当前仪表group选中的id
    current_group_select_id: '',

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'Report_UnitId',
                    'Report_StartTime',
                    'Report_DateTime',
                    'Report_ComputeValue'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '开始时间',
                        dataIndex: 'Report_StartTime',
                        width: 300,
                    }, {
                        text: '结束时间',
                        dataIndex: 'Report_DateTime',
                        width: 300,
                    }, {
                        text: '统计值',
                        dataIndex: 'Report_ComputeValue',
                        flex: 0.9,
                    }]
                }
            },

            url: '/api/ReportDataCopy/QueryYearCopy',
            ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）

            show_delete_column: false,
            show_paging: false,

            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked',
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
                        align: 'center'
                    },
                    items: [
                        { text: '单元名称', dataIndex: 'MeasurePropertyName', width: 150 }
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
        this.my_grid = new MyGrid(this, this.my_grid_config());

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
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('产量');
        })

        // 下载
        $('#download').click(function () {
            var unitid = that.current_group_select_id;
            that.get_download_excel(unitid);
        })

        // 上传
        $('#upload').click(function () {
            if ($('#upload_file').val()) {
                $("#file-form").submit();
                $("#file-form").html('<input type="file" id="upload_file" name="upload_file" style="opacity:0;position:relative;left:-2.2rem;width:1rem; height:0.36rem;border:solid 1px red;" />');
            }
            else {
                Util.alert('请先选择文件，再点击上传');
            }
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    get_download_excel: function (unitid) {
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

        form.append(input1);

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
            method: 'get',
            dataType: 'json',
            async: false,
            data: data,
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    Util.alert('修改成功'); //如果查询成功 则返回Models
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
            right_content: '.right-content',
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
                MeasurePropertyName: '', ModelBaseID: that.current_tree_select_id, MeasurePropertyType: '7'
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
            MeasurePropertyName: '', ModelBaseID: that.current_tree_select_id, MeasurePropertyType: '7'
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