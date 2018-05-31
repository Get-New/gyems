
var Page = {

    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    my_grid_config: {
        store_config: {
            //fields: ['AlarmModelId', 'AlarmModelName', 'AlarmModelCode', 'DescriptionInfo', 'MeterPointId', 'MeterPointName', 'AlarmTypeId', 'AlarmTypeName ', 'AlarmGradeId', 'AlarmGradeName', 'AlarmModelLastTime', 'AlarrmHandleMethodId', 'AlarmHandleMethodName']
            fields: ['AlarmModelId', 'AlarmModelName', 'AlarmTypeId', 'AlarmTypeName', 'AlarmGradeId', 'AlarmGradeName', 'MeterPointId', 'MeterPointName', 'AlarmModelOutNumber', 'AlarmModelLastTime', 'AlarmModelBadValueTime', 'AlarmModelOutContent', 'ModelBaseId', 'ModelBaseName']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '报警名称',
                    dataIndex: 'AlarmModelName'              
                }, {
                    text: '报警内容',
                    dataIndex: 'AlarmModelOutContent'
                }, {
                    text: '报警类型',
                    dataIndex: 'AlarmTypeName'
                }, {
                    text: '报警级别',
                    dataIndex: 'AlarmGradeName'
                }, {
                    text: '报警点',
                    dataIndex: 'MeterPointName'
                },{
                    text: '上下限超限次数',
                    dataIndex: 'AlarmModelOutNumber'
                }, {
                    text: '上下限超限时间',
                    dataIndex: 'AlarmModelLastTime'
                }, {
                    text: '坏数据时间',
                    dataIndex: 'AlarmModelBadValueTime'
                }
                ]
            }
        },

        url: '/api/AlarmModel/GetPage',
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
            that.my_grid.query({ AlarmModelName: $('#search-name').val(), RootId:that.current_tree_select_id });
            that.clear();
        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({ AlarmModelName: $('#search-name').val(), RootId: that.current_tree_select_id });
        		that.clear();
        	}
        });

        // 页面加载后先查询一次
        this.my_grid.query({ AlarmModelName: '' ,RootId:'root'});

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

        // 查询报警点
        $('#search-MeterPointID').click(function () {
            if ($('#EnergyMediumId').val() == null) {
                Util.alert('请根据能源介质查询报警点');
                return false;
            }
            that.select_meter_point();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('报警配置');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();

        this.select_alarm_type();
        this.select_alarm_grade();
        this.prepare_select_source_EnergyMediumId();
        
    },

    MeterPointID_reset:function(){
        var that = this;
        that.select_meter_point();
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();
        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'AlarmModel',
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
            model: 'AlarmModel',
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    validate: function (data) {
        if (!data.AlarmModelName) {
            return "名字不可以为空";
        }
        if (!data.AlarmTypeId) {
            return "请选择报警类型";
        }
        if (!data.AlarmGradeId) {
            return "请选择报警级别";
        }
        if (!data.MeterPointId) {
            return "请选择报警点";
        }
        if (!data.AlarmModelOutNumber) {
            return "请填写上下限超限次数";
        }
        if (!data.AlarmModelLastTime) {
            return "请填写上下限超限时间";
        }
        if (!data.AlarmModelBadValueTime) {
            return "请填写坏数据超限时间";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { AlarmModelId: record.AlarmModelId };

        Util.ajax_delete({
            data: data,
            model: 'AlarmModel',
            confirm_msg: function () {
                return '确认要删除名称为' + record.AlarmModelName + '的报警信息吗?';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },


    on_grid_row_selected: function (data, index) {
        //this.clear();
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        $('#MeterPointId').val('').html('');
        var option = $('<option>').val(data.MeterPointId).html(data.MeterPointName);
        $('#MeterPointId').append(option);
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

        var callback = function () {
            that.my_grid.grid.getView().refresh()
        }
        this.right_panel.show_right_panel(callback);
    },

    clear: function () {
        this.my_grid.clear_selection();
        this.my_form.clear();
        $('#MeterPointID').val('').html('');
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
            that.current_tree_select_id = 'root';
            $('#search-name').val('');
            that.my_grid.query({ AlarmModelName: $('#search-name').val(), RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.clear();
        this.current_tree_select_id = id;
        $('#ModelBaseId').val(this.current_tree_select_id);
        this.my_grid.query({ AlarmModelName: $('#search-name').val(), RootId: id });
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

    // 准备介质下拉框的数据源
    prepare_select_source_EnergyMediumId: function (callback) {

        $('#EnergyMediumId').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseId: 'root' },
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载能源介质失败');
                    return;
                }

                var EnergyList = data.Models;

                if (!EnergyList || !EnergyList.length) {
                    $('#EnergyMediumId').append("<option value='-1'>没有能源介质可供选择</option>");
                    $('#EnergyMediumId').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyList) {
                    var item = EnergyList[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#EnergyMediumId').append(option);
                }

                $('#EnergyMediumId').val('');

                if (typeof callback == 'function') {
                    callback();
                }
            }
        })
    },

    // 准备报警等级下拉框的数据源
    select_alarm_grade: function () {

        $('#AlarmGradeId').val('').html('');

        $.ajax({
            url: '/api/AlarmGrade/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载报警等级失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#AlarmGradeId').append("<option value='-1'>没有报警等级可供选择</option>");
                    //$('#AlarmGradeId').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.AlarmgradeId).html(item.AlarmgradeName);
                    $('#AlarmGradeId').append(option);
                }

                $('#AlarmGradeId').val('');

                //if (typeof callback == 'function') {
                //    callback();
                //}
            }
        })
    },

    // 准备报警点下拉框的数据源
    select_meter_point: function () {

        $('#MeterPointID').val('').html('');

        $.ajax({
            url: '/api/MeterMeasure/GetMeterPoint',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseId: $('#ModelBaseId').val(), EnergyMediumId: $('#EnergyMediumId').val() },
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载报警点失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#MeterPointID').append("<option value='-1'>没有报警点可供选择</option>");
                    //$('#MeterPointId').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.MeterPointID).html(item.MeterPointName);
                    $('#MeterPointID').append(option);
                }

                $('#MeterPointID').val('');

                //if (typeof callback == 'function') {
                //    callback();
                //}
            }
        })
    },

    // 准备报警类型下拉框的数据源
    select_alarm_type: function () {

        $('#AlarmTypeId').val('').html('');

        $.ajax({
            url: '/api/AlarmType/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    Util.alert('加载报警类型失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#AlarmTypeId').append("<option value='-1'>没有报警类型可供选择</option>");
                    //$('#AlarmTypeId').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.AlarmtypeId).html(item.AlarmtypeName);
                    $('#AlarmTypeId').append(option);
                }

                $('#AlarmTypeId').val('');

                //if (typeof callback == 'function') {
                //    callback();
                //}
            }
        })
    },
};