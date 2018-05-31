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
    //?AttriType:EnergyMedium;AttriID:1d22868c6ca69b8A27bc86aa;MeasurePropertyType:1,2,3,4,5,6,8;

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'Report_UnitId',
                    'Report_StartTime',
                    'Report_DateTime',
                    'Report_ComputeValue',
                    'Report_NaturallyDate',
                    'Report_isFromCopy'
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
                    }, {
                        text: '计算方式',
                        dataIndex: 'Report_isFromCopy',
                        flex: 0.9,
                        renderer: function (value) {
                            switch (value) {
                                case 0: return "自动";
                                case 1: return "人工";
                                default: return ""
                            }
                        }
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
        $('#search-sdate').val('');

        laydate({
            elem: '#search-sdate',
            event: 'click',
            istime: false,
            istoday: true,
            format: 'YYYY-MM-DD'
            //choose: function () {
            //    Page.get_report_data();
            //}
        });
        $('#search-sdate').val(laydate.now(0, 'YYYY-MM-DD'));

        var that = this;

        //获取当前location配置
        this.get_location_info();

        // 初始化MyGrid
        var temp_my_grid_config = this.my_grid_config()

        if (Page.current_MeasurePropertyType == '7') {
            temp_my_grid_config.url = '/api/ReportDataCopy/QueryHourCopy';
            this.my_grid = new MyGrid(this, temp_my_grid_config);
        }
        else {
            temp_my_grid_config.url = '/api/ReportDataCopy/QueryHourReport';
            this.my_grid = new MyGrid(this, temp_my_grid_config);
        }

        this.my_group = new MyGrid(this, this.my_group_config());

        // 绑定查询按钮事件
        $('#query').click(function () {
            var date = $('#search-sdate').val();
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var day = date.split('-')[2];
            that.my_grid.query({
                unitid: that.current_group_select_id,
                year: year,
                month: month,
                day: day
            });
        });

        $('#search-sdate').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                var date = $('#search-sdate').val();
                var year = date.split('-')[0];
                var month = date.split('-')[1];
                var day = date.split('-')[2];
                that.my_grid.query({
                    unitid: that.current_group_select_id,
                    year: year,
                    month: month,
                    day: day
                });
            }
        });

        // 新增
        $('#edit').click(function () {
            that.on_btn_edit_clicked();
        });

        // edit
        $('#submit-edit').click(function () {
            that.submit_edit();
        });

        // 下载模板
        $('#export').click(function () {
            var unitid = that.get_measurepropertyids();//获取统计单元id集合
            var date = $('#search-sdate').val();
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var day = date.split('-')[2];
            if (unitid) {
                unitid = unitid.join(',');//转换为逗号分隔字符串
                that.get_download_excel(unitid, year, month, day);
            }
        });

        $('#AttriID').change(function () {
            Page.current_AttriID = $('#AttriID').val();
            that.current_group_select_id = null;
            that.my_group.query({
                ModelBaseID: that.current_tree_select_id,
                AttriType: Page.current_AttriType,
                AttriID: Page.current_AttriID,
                MeasurePropertyType: Page.current_MeasurePropertyType
            });
        });

        //form表单内容初始化
        $("#file-form").html('<input type="file" id="upload_file" name="upload_file" style="opacity:0;position:relative;left:-1.1rem;width:1rem; height:0.36rem;border:solid 1px red;" onchange="Page.upload_file_onchange()" />');

        this.tree_init();
        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();
    },

    //form变化触发事件
    upload_file_onchange: function () {
        var that = this;

        if ($('#upload_file').val()) {
            //$("#file-form").submit();
            that.upload_excel();
        }
        else {
            Util.alert('请先选择文件，再点击上传');
        }
    },

    //上传excel文件
    upload_excel: function () {
        var that = this;
        var formData = new FormData();
        formData.append('file', $('#upload_file')[0].files[0]);
        formData.append('cycle', '小时');

        $.ajax({
            url: '/api/ReportDataCopy/Upload',
            type: 'post',
            data: formData,
            async: false,
            // 是否进行序列化处理 否
            processData: false,
            // 是否设置Content-Type请求头 否
            contentType: false,
            success: function (data) {
                if (data.Success) {
                    Util.alert('上传成功，请稍后刷新页面查看结果');
                } else {
                    Util.alert('上传失败');
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误：' + errorThrown)
            }
        });

        that.my_group.clear_selection();
        that.my_grid.clear_selection();

        $("#file-form").html('<input type="file" id="upload_file" name="upload_file" style="opacity:0;position:relative;left:-1.1rem;width:1rem; height:0.36rem;border:solid 1px red;" onchange="Page.upload_file_onchange()" />');
    },

    //获取当前location配置
    get_location_info: function () {
        var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;//window.location.search.replace('?', ''); //获得window.location
        Page.current_AttriType = temp_location.split('AttriType:')[1] ? temp_location.split('AttriType:')[1].split(';')[0] : null; //获得AttriType值
        //Page.current_AttriID = temp_location.split('AttriID:')[1] ? temp_location.split('AttriID:')[1].split(';')[0] : null; //获得AttriID值 新版不再通过配置得到而是通过下拉框
        Page.current_MeasurePropertyType = temp_location.split('MeasurePropertyType:')[1] ? temp_location.split('MeasurePropertyType:')[1].split(';')[0] : null; //获得MeasurePropertyType值
    },

    // 准备能源介质的下拉框数据
    prepare_select_source_EnergyMedium: function (ModelBaseID) {
        $('#AttriID').val('').html('');

        $.ajax({
            url: '/api/MeterStatus/GetMediumSource',
            type: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#AttriID').append("<option value='-1'>没有介质可供选择</option>");
                    //$('#AttriID').attr("disabled", "disabled");
                    return;
                }
                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EnergyMediumId).html(item.EnergyMediumName);
                    $('#AttriID').append(option);
                }
            }
        })
    },

    // 准备产品种类的下拉框数据
    prepare_select_source_ProductClass: function (ModelBaseID) {
        $('#AttriID').val('').html('');

        $.ajax({
            url: '/api/ProductClass/GetList',
            type: 'get',
            dataType: 'json',
            async: false,
            //data: { ModelBaseId: ModelBaseID },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    //$('#AttriID').append("<option value='-1'>没有产品种类可供选择</option>");
                    //$('#AttriID').attr("disabled", "disabled");
                    return;
                }
                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.ProductClassId).html(item.ProductClassName);
                    $('#AttriID').append(option);
                }
            }
        })
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
        input5.attr("value", '小时');

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
            url: '/api/ReportDataCopy/EditHour',
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
            that.current_tree_select_id = id;
            that.tree_node_click(id);
        });

        // 刷新按钮
        //$('#refresh').click(function () {
        //    $('#search-name').val('');
        //    that.my_tree.reset();
        //    that.current_tree_select_id = '';
        //    that.my_grid.query({
        //        unitid: that.current_group_select_id,
        //        year: year,
        //        month: month,
        //        day: day
        //    });
        //    that.current_group_select_id = '';
        //    that.my_group.clear_selection();
        //    that.my_group.query({
        //        ModelBaseID: that.current_tree_select_id,
        //        AttriType: Page.current_AttriType,
        //        AttriID: Page.current_AttriID,
        //        MeasurePropertyType: Page.current_MeasurePropertyType
        //    });
        //});
    },

    tree_node_click: function (id) {
        var that = this;
        that.clear();
        that.my_group.clear_selection();
        that.current_tree_select_id = id;

        if (Page.current_AttriType == 'EnergyMedium') {
            that.prepare_select_source_EnergyMedium(that.current_tree_select_id);
        }
        else {
            that.prepare_select_source_ProductClass(that.current_tree_select_id);
        }

        Page.current_AttriID = $('#AttriID').val();

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
        var date = $('#search-sdate').val();
        var year = date.split('-')[0];
        var month = date.split('-')[1];
        var day = date.split('-')[2];
        that.my_grid.query({
            unitid: that.current_group_select_id,
            year: year,
            month: month,
            day: day
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