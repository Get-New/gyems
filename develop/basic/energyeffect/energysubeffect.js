var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = false;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 1;

    // 默认时间类型（可选year、month、day）
    ret.defaultDateType = 'year';

    // 图表(可能有多个)
    ret.charts = [{
        // 容器的id
        containerId: 'chart1',
    }];

    return ret;
})();

var Page = {
    my_grid: null,

    /*弹出框*/
    //my_grid_unit: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: '',

    /* 编辑区正在显示 */
    right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
					'EfficaciousId',
					'EfficaciousName',
					'EnergyMediumName',
					'UnitMeasureName',
					'SubefficaciousId',
					'SubefficaciousValue',
					'SubefficaciousLower',
					'SubefficaciousUpper',
					'SubefficaciousEffect',
					'DescriptionInfo',
					'LastmodifyTime',
					'BusinessSort'
                ]
            },

            grid_config: {
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [{
                        text: '能源介质',
                        dataIndex: 'EnergyMediumName',
                        width: 200
                    }, {
                        text: '折标单元',
                        dataIndex: 'EfficaciousName',
                        width: 200
                    }, {
                        text: '折标系数',
                        dataIndex: 'SubefficaciousValue',
                        width: 200
                    }, {
                        text: '折标单位',
                        dataIndex: 'UnitMeasureName',
                        width: 200
                    }, {
                        text: '生效时间',
                        dataIndex: 'SubefficaciousEffect',
                        width: 200
                    }, {
                        text: '备注',
                        dataIndex: 'DescriptionInfo',
                        flex: 0.6
                    }]
                }
            },

            url: '/api/BasicSubefficacious/GetPageWithEnergy',
            ps: 8,
            show_delete_column: false,
            row_select_handler: 'on_grid_row_selected',
            dblclick_handler: 'on_grid_dblclicked'
            //delete_handler: 'on_grid_row_delete_clicked'
        }
    },

    init: function () {
        laydate({
            elem: '#SubefficaciousEffect',
            event: 'click',
            istime: false,
            istoday: true,
            start: laydate.now(+1, "YYYY-MM-DD"),
            format: 'YYYY-MM-DD'
            //choose: function () {
            //    if (!Page.check_date()) {
            //        Util.alert('生效时间最早为明天');
            //    }
            //}
        });

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ EfficaciousId: that.current_tree_select_id, EfficaciousType: '折标系数' });
            that.clear();
        });

        // 绑定添加按钮事件
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        //form添加
        $('#submit-add').click(function () {
            if (!that.current_tree_select_id) {
                Util.alert("请选择左侧节点");
            }
            else {
                that.submit_add();
            }
        });

        //form修改
        $('#submit-edit').click(function () {
            //if (!Page.check_date()) {
            //    Util.alert("历史记录不允许编辑");
            //    return false;
            //}
            that.submit_edit('edit');
        });

        // 页面加载后立即查询一次的函数，用于回调
        that.my_grid.query({ EfficaciousId: that.current_tree_select_id, EfficaciousType: '折标系数' });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能源折标管理');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        tp.init();

        //弹出框配置
        mywin.config({
            width: 900,
            height: 650,
            selector: '#window_s',
            windowId: 'window_s'
        })
        mywin.init();

        $("a.choose-feature").each(function () {
            $(this).click(function () {
                var data = that.get_effect_history($('#EfficaciousId').val());
                linechart.draw(options.charts[0], data);

                mywin.open();
            })
        });

        $(".opacity-div-for-modelwin").click(function () {
            mywin.close();
        })

        //初始化表单
        this.clear();
    },

    get_effect_history: function (id) {
        var temp_data = null;
        $.ajax({
            url: '/api/BasicSubefficacious/GetHistory',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { EfficaciousId: id },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    temp_data = data.Models[0];
                }
            }
        });
        return temp_data;
    },

    check_date: function () {
        function toDate(str) {
            var sd = str.replace(/[ T][\d+:]+/, '');
            return new Date(sd);
        }

        var date1 = toDate(laydate.now(1, "YYYY-MM-DD"));
        var date2 = toDate($('#SubefficaciousEffect').val());

        if (date1 > date2) {
            $('#SubefficaciousEffect').val('');
            return false;
        }
        else {
            return true;
        }
    },

    //on_grid_row_delete_clicked: function (record) {
    //    var that = this;
    //    var data = { SubefficaciousId: record.SubefficaciousId };

    //    Util.ajax_delete({
    //        data: data,
    //        model: 'BasicSubefficacious',
    //        validator: that.validate_delete,
    //        confirm_msg: function () {
    //            return '确认要删除该条记录吗?';
    //        },
    //        success: function () {
    //            that.my_grid.reload();
    //        }
    //    });
    //},

    validate_delete: function (data) {
        //if (!Page.check_date()) {
        //    return "历史记录不允许删除！";
        //}
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        data.EfficaciousId = that.current_tree_select_id;
        Util.ajax_add({
            data: data,
            validator: that.validate_add,
            model: 'BasicSubefficacious',
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
            model: 'BasicSubefficacious',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate_add: function (data) {
        return Page.validate(data);
    },

    validate: function (data) {
        if (!data.SubefficaciousValue) {
            return "请填写折标系数";
        }
        if (!data.SubefficaciousEffect) {
            return "请选择生效时间";
        }
        //if (!Page.check_date()) {
        //    return "生效时间最早为明天";
        //}
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
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
        //this.clear();

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
            var callback = function () {
                that.my_grid.grid.getView().refresh()
            }
            that.right_panel.hide_right_panel(callback);
        })
        //$('.close-button').click(function () {
        //    var callback = function () {
        //        that.my_grid.grid.getView().refresh()
        //    }
        //    //that.right_panel.hide_right_panel(function () { that.my_grid.grid.getView().refresh() });
        //})
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
        url: '/api/BasicEfficacious/GetTree?EfficaciousType=' + escape('折标系数'),
        root_name: '折标单元',
        id_field: 'EfficaciousId',
        name_field: 'EfficaciousName',
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
            that.current_tree_select_id = '';
            that.my_grid.query({ EfficaciousId: '', EfficaciousType: '折标系数' });
        });
    },

    tree_node_click: function (id, name) {
        this.clear();
        this.current_tree_select_id = id || "";
        if (id == 'root') id = '';
        $('#EnergyMediumId').val(this.current_tree_select_id);
        this.my_grid.query({ EfficaciousId: id, EfficaciousType: '折标系数' });
    }
}