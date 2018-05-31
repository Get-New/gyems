var Page = {
    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前在树中选中的level */
    current_tree_select_level: '',

    /* 当前的年月 */
    current_ym: null,

    /* 当前点击的是add or update */
    current_add_or_update: '',

    my_grid: null,
    my_grid_config: {
        store_config: {
            fields: [
                'ModelBaseId',
                'ModelBaseName',
                'CrewScheduleId',
                'CrewScheduleID',
                'CrewScheduleIndex',
                'CrewScheduleOrder',
                'CrewScheduleBeginTime',
                'CrewScheduleEndTime'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                },
                items: [{
                    text: '班组',
                    dataIndex: 'CrewScheduleIndex'
                }, {
                    text: '班次',
                    dataIndex: 'CrewScheduleOrder'
                }, {
                    text: '开始时间',
                    dataIndex: 'CrewScheduleBeginTime'
                }, {
                    text: '结束时间',
                    dataIndex: 'CrewScheduleEndTime'
                }]
            },
        },

        url: '/api/CrewScheduling/GetPage',
        ps: 0, // 0表示不进行分页（前提是后台未关联分页参数）
        show_delete_column: true,
        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        laydate({
            elem: '#search-month',
            istime: false,
            ismonth: true,
            format: 'YYYY-MM'
        })

        //laydate({
        //    elem: '#CrewScheduleBeginTime',
        //    istime: true,
        //    ismonth: false,
        //    format: 'YYYY-MM-DD hh:mm:ss'
        //})

        //laydate({
        //    elem: '#CrewScheduleEndTime',
        //    istime: true,
        //    ismonth: false,
        //    format: 'YYYY-MM-DD hh:mm:ss'
        //})

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            var ym = that.get_ym_from_search_input();

            if (!ym) {
                Util.alert('年月格式不正确');
                return;
            }

            that.current_ym = ym;
            that.my_grid.query({ ModelBaseId: that.current_tree_select_id, Year: ym.year, Month: ym.month });
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                var ym = that.get_ym_from_search_input();

                if (!ym) {
                    Util.alert('年月格式不正确');
                    return;
                }

                that.current_ym = ym;
                that.my_grid.query({ ModelBaseId: that.current_tree_select_id, Year: ym.year, Month: ym.month });
            }
        });

        //form修改
        $('#submit-edit').click(function () {
            if (!$('#CrewScheduleIndex_R').val()) {
                alert('请选择班组');
                return false;
            }
            that.submit_edit();
        });

        // 页面刚加载时，在月份选择框填入当前年月
        var now = new Date();
        var ym = parseDate(now);
        $('#search-month').val(ym.strYear + '-' + ym.strMonth);

        // 页面加载后立即查询一次
        var ym = that.get_ym_from_search_input();
        that.current_ym = ym;
        that.my_grid.query({ ModelBaseId: that.current_tree_select_id, Year: ym.year, Month: ym.month });

        /* 点击“删除” 删除一个月的数据 */
        //$('#reset').click(function () {
        //    var ym = that.get_ym_from_search_input();

        //    if (!ym) {
        //        Util.alert('年月格式不正确');
        //        return;
        //    }

        //    var data = {
        //        year: ym.year,
        //        month: ym.month,
        //        modelBaseId: that.current_tree_select_id
        //    };

        //    Util.confirm('确认要删除' + data.year + '年' + data.month + '月的排班信息吗?', function () {
        //        that.current_ym = ym;

        //        $.ajax({
        //            url: '/api/CrewScheduling/Delete',
        //            type: 'get',
        //            data: data,
        //            success: function (data) {
        //                that.my_grid.reload();
        //                Util.alert('操作成功');
        //            },
        //            error: function (jqXhr, textStatus, errorThrown) {
        //                Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
        //            }
        //        });
        //    });
        //})

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('排班信息');
        })

        this.tree_init();
        this.right_panel_init();
        this.my_form_init_right();
        this.my_form_init();

        // 初始化下拉框数据源
        this.prepare_select_source();
        this.prepare_select_source_CrewScheduleIndex();

        this.prepare_window();

        // 初始化表单
        this.clear();
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        $('#CrewScheduleID_R').val(data.CrewScheduleID);
        $('#ModelBaseName_R').val(data.ModelBaseName);
        //console.log(data);
        $('#CrewScheduleIndex_R').val(data.CrewScheduleIndex);
        $('#CrewScheduleOrder_R').val(data.CrewScheduleOrder);
        $('#CrewScheduleBeginTime_R').val(data.CrewScheduleBeginTime);
        $('#CrewScheduleEndTime_R').val(data.CrewScheduleEndTime);
    },

    on_grid_dblclicked: function () {
        var that = this;

        var callback = function () {
            that.my_grid.refresh_view();
        }

        this.right_panel.toggle_right_panel(callback);
    },

    submit_edit: function () {
        var that = this;

        var row = that.my_grid.get_last_selected();

        if (!row || !row.data) {
            Util.alert('请先选择一行记录');
            return;
        }
        var data = { id: $('#CrewScheduleID_R').val() };
        data.index = $('#CrewScheduleIndex_R').val();

        $.ajax({
            url: '/api/CrewScheduling/Update',
            type: 'get',
            dataType: 'json',
            data: data,
            success: function (data) {
                that.my_grid.reload();
            }
        })
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { modelbaseid: that.current_tree_select_id };
        data.strBegin = record.CrewScheduleBeginTime;
        data.strEnd = record.CrewScheduleEndTime;

        Util.ajax_delete({
            data: data,
            model: 'CrewScheduling',
            confirm_msg: function () {
                return '确认要删除这条排班信息吗？';
            },
            success: function () {
                that.my_grid.reload();
            }
        });
    },

    // 从输入框获得年月
    get_ym_from_search_input: function () {
        var str = $('#search-month').val();
        var arr = str.split('-');
        var strYear = arr[0];
        var strMonth = arr[1];
        var year = parseInt(strYear);
        var month = parseInt(strMonth);
        if (typeof strYear == 'string' && typeof strMonth == 'string'
            && typeof year == 'number' && typeof month == 'number') {
            var obj = {
                strYear: strYear,
                strMonth: strMonth,
                year: year,
                month: month
            };
            return obj;
        }
    },

    // 准备下拉框的数据源
    prepare_select_source: function (callback) {
        $.ajax({
            url: '/api/CrewScheduling/GetCrewSchedulingIndex',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    Util.alert('页面初始化失败');
                    return;
                }

                var list = data;

                if (!list || !list.length) {
                    $('#CrewScheduleIndex').append("<option value='-1'>没有班组可供选择</option>");
                    $('#CrewScheduleIndex').attr("disabled", "disabled");
                    return;
                }

                for (var i in list) {
                    var item = list[i];
                    var option = $('<option>').val(item).html(item);
                    $('#CrewScheduleIndex').append(option);
                }

                $('#CrewScheduleIndex').val('');

                if (typeof callback == 'function') {
                    callback();
                }
            }
        })

        $.ajax({
            url: '/api/CrewScheduling/GetCrewSchedulingOrder',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    Util.alert('页面初始化失败');
                    return;
                }

                var list = data;

                if (!list || !list.length) {
                    $('#CrewScheduleOrder').append("<option value='-1'>没有班组可供选择</option>");
                    $('#CrewScheduleOrder').attr("disabled", "disabled");
                    return;
                }

                for (var i in list) {
                    var item = list[i];
                    var option = $('<option>').val(item).html(item);
                    $('#CrewScheduleOrder').append(option);
                }

                $('#CrewScheduleOrder').val('');

                if (typeof callback == 'function') {
                    callback();
                }
            }
        })
    },

    clear: function () {
        this.my_form_right.clear();
        this.my_form.clear();
        this.my_grid.clear_selection();
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
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            var ym = that.current_ym;
            that.my_grid.query({ ModelBaseId: that.current_tree_select_id, Year: ym.year, Month: ym.month });
        });
    },

    tree_node_click: function (id, name, level) {
        var that = this;
        this.current_tree_select_id = id;
        this.current_tree_select_level = level;
        var ym = that.current_ym;
        that.my_grid.query({ ModelBaseId: that.current_tree_select_id, Year: ym.year, Month: ym.month });
    },

    my_form_right: null,

    my_form_config_right: {
        selector: '#edit-form-right',
    },

    my_form_init_right: function () {
        var that = this;

        // 初始化my_form_right对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form_right = new MyForm(this, this.my_form_config_right);
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
            that.my_form_right.clear();
            that.my_grid.clear_selection();
            that.right_panel.hide_right_panel(callback);
        })
    },

    // 准备修改班组下拉框的数据源
    prepare_select_source_CrewScheduleIndex: function () {
        $('#CrewScheduleIndex_R').val('').html('');

        $.ajax({
            url: '/api/CrewScheduling/GetCrewSchedulingIndexSingle',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || !_.isArray(data) || data.length < 1) {
                    //Util.alert('加载班组失败');
                    return;
                }

                var CrewScheduleIndexList = data;
                if (!CrewScheduleIndexList || !CrewScheduleIndexList.length) {
                    //$('#CrewScheduleIndex_R').append("<option value='-1'>没有班组可供选择</option>");
                    //$('#CrewScheduleIndex_R').attr("disabled", "disabled");
                    return;
                }

                for (var i in CrewScheduleIndexList) {
                    var item = CrewScheduleIndexList[i];
                    var option = $('<option>').val(item).html(item);
                    $('#CrewScheduleIndex_R').append(option);
                }

                $('#CrewScheduleIndex_R').val('');
            }
        })
    },

    my_form: null,

    my_form_config: {
        selector: '#edit-form',
    },

    my_form_init: function () {
        var that = this;

        // 初始化my_form对象(第一个参数是页面对象本身的指针，第二个参数是配置)
        this.my_form = new MyForm(this, this.my_form_config);
    },

    prepare_window: function () {
        var that = this;

        $('#add').click(function () {
            that.current_add_or_update = 'add';

            var modelbaseId = $('#ModelBaseId').val() || that.current_tree_select_id;

            if (modelbaseId == 'root') {
                Util.alert('请选择一个工厂模型节点');
                return;
            }

            var ym = that.get_ym_from_search_input();

            if (!ym) {
                Util.alert('年月格式不正确');
                return;
            }

            $('#w1').show();
            $('#w2').show();
            $('#w3').show();

            $('#w4').hide();
            $('#w5').hide();
            $('#w6').hide();
            $('#w7').hide();

            that.current_ym = ym;

            that.open_window(ym.year, ym.month);
        })

        $('#update').click(function () {
            that.current_add_or_update = 'update';

            var modelbaseId = $('#ModelBaseId').val() || that.current_tree_select_id;

            if (modelbaseId == 'root') {
                Util.alert('请选择一个工厂模型节点');
                return;
            }
            var row = that.my_grid.get_last_selected();

            if (!row || !row.data) {
                Util.alert('请选择一条记录作为更新起点');
                return;
            }

            $('#ModelBaseName_W').val($('#ModelBaseName_R').val());
            $('#CrewScheduleIndex_W').val($('#CrewScheduleIndex_R').val());
            $('#CrewScheduleOrder_W').val($('#CrewScheduleOrder_R').val());
            $('#CrewScheduleBeginTime_W').val($('#CrewScheduleBeginTime_R').val());

            $('#w1').hide();
            $('#w2').hide();
            $('#w3').hide();

            $('#w4').show();
            $('#w5').show();
            $('#w6').show();
            $('#w7').show();

            $('.window').fadeIn(200);
        })

        $('#window-save').click(function () {
            if (that.current_add_or_update == 'add') {
                var d = that.my_form.serialize_data();

                //var request_data = {
                //    year: $('#window-year').html(),
                //    month: $('#window-month').html(),
                //    modelBaseId: that.current_tree_select_id,
                //    index: d.CrewScheduleIndex,
                //    order: d.CrewScheduleOrder
                //}
                var request_data = {
                    year: $('#window-year').html(),
                    modelBaseId: that.current_tree_select_id,
                    index: d.CrewScheduleIndex,
                    order: d.CrewScheduleOrder
                };

                if (!request_data.index) {
                    Util.alert('请选择班组');
                    return;
                }

                if (!request_data.order) {
                    Util.alert('请选择班次');
                    return;
                }

                $.ajax({
                    url: '/api/CrewScheduling/Add',
                    type: 'get',
                    data: request_data,
                    success: function (data) {
                        if (!data || !data.Success) {
                            Util.alert('出现错误 操作失败');
                            return;
                        }

                        Util.alert('新增成功');
                        that.my_grid.reload();
                        that.close_window();
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
                    }
                });
            }
            else if (that.current_add_or_update == 'update') {
                var request_data = {
                    modelbaseid: that.current_tree_select_id,
                    index: $('#CrewScheduleIndex_W').val(),
                    order: $('#CrewScheduleOrder_W').val(),
                    strBegin: $('#CrewScheduleBeginTime_W').val()
                };

                $.ajax({
                    url: '/api/CrewScheduling/Add',
                    type: 'get',
                    data: request_data,
                    success: function (data) {
                        if (!data || !data.Success) {
                            Util.alert('出现错误 操作失败');
                            return;
                        }

                        Util.alert('更新成功');
                        that.my_grid.reload();
                        that.close_window();
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
                    }
                });
            }
        })

        $('#window-close').click(function () {
            that.close_window();
        });
        $('#window-cancel').click(function () {
            that.close_window();
        })
    },

    open_window: function (year, month) {
        $('.window').fadeIn(200);

        $('#window-year').html(year);
        //$('#window-month').html(month);
    },

    close_window: function () {
        $('.window').hide();
    }
};

function parseDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var strYear = year;
    var strMonth = month;
    var strDay = day;

    if (month >= 1 && month <= 9) {
        strMonth = "0" + strMonth;
    }
    if (strDay >= 0 && strDay <= 9) {
        strDay = "0" + strDay;
    }
    var obj = {
        year: year,
        month: month,
        day: day,
        strYear: strYear,
        strMonth: strMonth,
        strDay: strDay
    }
    return obj;
}