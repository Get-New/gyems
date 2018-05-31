
var Page = {
    my_grid: null,

    my_grid_config: {                                 
        store_config: {
            fields: [
            'BenchmarkingBaseID',
            'BenchmarkingBaseName',
            'EngeryKPIID',
            'EngeryKPIName',
            'EngeryKPIBaseValue',
            'EngeryKPIValue',
            'BenchmarkingBaseIndustry',
            'UnitMeasureName',
            'USERID',
            'LASTMODIFYTIME',
            ]
        },

        grid_config: {                                  
            columns: {
                defaults: {
                    flex: 0
                },
                items: [ 
               {
                   text: '对标名称',
                   dataIndex: 'BenchmarkingBaseName',
                   width: 200,
               },
                  {
                      text: '对标标准',
                      dataIndex: 'BenchmarkingBaseIndustry',
                      width: 200,
                  },
                  {
                      text: '绩效指标',
                      dataIndex: 'EngeryKPIName',
                      width: 200,
                  },
                   {
                       text: '厂内标准',
                       dataIndex: 'EngeryKPIValue',
                       width: 200,
                   },
                   {
                       text: '国家标准',
                       dataIndex: 'EngeryKPIBaseValue',
                       width: 200,
                   },
                   {
                       text: '单位',
                       dataIndex: 'UnitMeasureName',
                       width: 150,
                   },
                ]
            },
        },
        url: '/api/BenchmarkingBase/GetPage',
        ps: 8,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },
    //***************************************************内置函数****************************8

    init: function () {                                         

        var that = this;

        this.my_grid = new MyGrid(this, this.my_grid_config);


        // 绑定查询按钮事件
        $('#query').click(function () {

            that.my_grid.query({ BenchmarkingBaseName: $('#search-name').val(), BenchmarkingBaseID: '' });

        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({ BenchmarkingBaseName: $('#search-name').val(), BenchmarkingBaseID: '' });
        	}
        });

        $('refresh').click(function () {
            that.my_group.reload();
        })
        that.my_grid.query({ BenchmarkingBaseName: $('#search-name').val(), BenchmarkingBaseID: '' });

        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        $('#submit-add').click(function () {
            that.submit_add();
        })

        $('#submit-edit').click(function () {
            that.submit_edit();
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('对标管理');
        })

        this.my_group_init();
        this.right_panel_init();
        this.my_form_init();
        this.prepare_select_source();
        // 初始化表单
        this.clear();
    },

    BenchmarkingBaseValue_reset:function(){
        this.get_basevalue();
    },

    //获得基准值
    get_basevalue: function () {
        $('#UnitMeasureName').val('');
        $('#EngeryKPIBaseValue').val('');
        $('#EngeryKPIValue').val('');

        $.ajax({
            url: '/api/EngeryKPI/GetPage',
            type: 'get',
            dataType: 'json',
            data: { ModelBaseID: '', EngeryKPIName: '', EngeryKPIID: $('#EngeryKPIName').val() },
            success: function (data) {
                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    Util.alert('获取基准值失败');
                    return;
                }

                var EngeryKPIParam = null;

                EngeryKPIParam = data.Models;

                $('#UnitMeasureName').val(EngeryKPIParam[0].UnitMeasureName);
                $('#EngeryKPIBaseValue').val(EngeryKPIParam[0].EngeryKPIBaseValue);
                $('#EngeryKPIValue').val(EngeryKPIParam[0].EngeryKPIValue);
            }
        })
    },

    submit_add: function () {
        var that = this;
        var data = this.my_form.serialize_data();

        data.EngeryKPIID = $('#EngeryKPIName').val();

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'BenchmarkingBase',
            success: function () {
                that.my_grid.reload();
                that.my_group.reload();

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
        data.EngeryKPIID = $('#EngeryKPIName').val();

        Util.ajax_edit({
            data: data,
            validator: that.validate,
            model: 'BenchmarkingBase',
            success: function () {
                that.my_grid.reload();
                that.my_group.reload();

            }
        });
    },


    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { BenchmarkingBaseID: record.BenchmarkingBaseID };

        Util.ajax_delete({
            data: data,
            model: 'BenchmarkingBase',
            confirm_msg: function () {
                return '确认要删除名称为' + record.BenchmarkingBaseName + '的记录吗?';
            },
            success: function () {
                that.my_grid.reload();
                that.my_group.reload();

            }
        });
    },

 
    //*********************************************注意事**************************************************8
    prepare_select_source: function (callback) {
        $('#EngeryKPIName').val('').html('');
        $.ajax({
            url: '/api/EngeryKPI/GetList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                
                if (!data.Models || !data.Models.length) {
                    $('#EngeryKPIName').append("<option value='-1'>没有绩效指标可供选择</option>");
                    //$('#EngeryKPIName').attr("disabled", "disabled");
                    return;
                }
                for (var i in data.Models) {
                    var item = data.Models[i];
                    var option = $('<option>').val(item.EngerykpiId).html(item.EngerykpiName);
                    $('#EngeryKPIName').append(option);
                }

                $('#EngeryKPIName').val('');

                if (typeof callback == 'function') {
                    callback();
                }
            }
        })
    },


    validate: function (data) {
        if (!data.BenchmarkingBaseName) {
            return "请填写对标名称";
        }
        if (!data.EngeryKPIID) {
            return "请选择绩效指标";
        }
        if (!data.BenchmarkingBaseIndustry) {
            return "请填写对标标准";
        }
    },
    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        $('#EngeryKPIName').val(data.EngeryKPIID);

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
    //**********************************************************************************
    my_group: null,


    current_group_select_id: '',

    my_group_config: {
        store_config: {
            fields: ['BenchmarkingBaseID',
                     'BenchmarkingBaseName']
        },

        grid_config: {

            columns: {
                items: [{
                    text: '对标名称',
                    dataIndex: 'BenchmarkingBaseName',                           
                    flex: 1
                },
                ]
            },
        },

        grid_container_id: 'group-container',

        url: '/api/BenchmarkingBase/GetPage',
        show_delete_column: false,
        show_paging: false,

        row_select_handler: 'on_group_row_selected',
    },

    on_group_row_selected: function (data, index) {
        var id = data.BenchmarkingBaseID;

        $('#search-name').val('');

        this.current_group_select_id = id;

        this.my_grid.query({
            BenchmarkingBaseName: $('#search-name').val(), BenchmarkingBaseID: id


        });
    },


    my_group_init: function () {
        var that = this;


        this.my_group = new MyGrid(this, this.my_group_config)

         //页面加载后查询
        this.my_group.query({ BenchmarkingBaseName: $('#search-name').val(), BenchmarkingBaseID: ''}, function (data) {
            // 自动选中第一行
            //that.my_group.grid.getSelectionModel().select(0);
        });
    }
};

//***********************************************************************************88

