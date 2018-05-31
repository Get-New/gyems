var Page = {
    current_tree_select_id: '',

    init: function () {
        var that = this;

        $('.tree-head').click(function () {
            $('#spin').click();
        });

        this.tree_init();
    },

    //on_grid_left_row_selected: function (data, index) {
    //    var current_MonitorInfoPath = data.MonitorInfoPath;
    //    var pdi_obj_value = 'http://172.16.80.12' + current_MonitorInfoPath;
    //    //var pdi_obj_value = 'http://localhost:3245' + current_MonitorInfoPath;
    //    if ($('#Pbd1')) {
    //        $('#Pbd1').remove();
    //    }
    //    $('.monitor-content-top').append('<object classid="clsid:4F26B906-2854-11D1-9597-00A0C931BFC8" id="Pbd1" style="width:100%;height:100%"><param name="DisplayURL" id="param_pdi" value="' + pdi_obj_value + '" /></object>');
    //},

    //on_grid_left_row_dblclicked: function (data, index) {
    //    var temp_pdi_path = ($('#param_pdi').attr('value'));
    //    window.open('monitor-window.html?' + temp_pdi_path);
    //},

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
            //$('#EnergyMedium').val('').html('');
            that.my_tree.reset();
            that.current_tree_select_id = '';
            //that.my_grid.query({ ModelBaseName: $('#QueryModelBaseName').val(), RootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        var that = this;

        if ($('#Pbd1')) {
            $('#Pbd1').remove();
        }

        this.current_tree_select_id = id || "";

        that.prepare_select_source_MonitorInfoPath(Page.MonitorInfoPath_onchange);
    },

    //准备 监控页面 的下拉框数据源
    prepare_select_source_MonitorInfoPath: function (callback) {
        $('#MonitorInfoPath').val('').html('');

        $.ajax({
            url: '/api/MonitorManagement/GetPage',
            type: 'get',
            dataType: 'json',
            data: { EnergyMediumName: '', RootId: Page.current_tree_select_id },
            success: function (data) {
                var MonitorInfo = data.Models;

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载监控页面列表失败');
                    return;
                }

                if (!MonitorInfo || !MonitorInfo.length) {
                    //$('#MeterPointName_W').append("<option value='-1'>没有监控页面可供选择</option>");
                    //$('#MeterPointName_W').attr("disabled", "disabled");
                    return;
                }

                for (var i in MonitorInfo) {
                    var item = MonitorInfo[i];
                    var option = $('<option>').val(item.MonitorInfoPath).html(item.MonitorInfoName);
                    $('#MonitorInfoPath').append(option);
                }

                //$('#MonitorInfoPath').val('');

                if (callback) {
                    callback(data);
                }
            }
        })
    },

    MonitorInfoPath_onchange: function () {
        var current_MonitorInfoPath = $('#MonitorInfoPath').val();
        var pdi_obj_value = 'http://172.16.80.12' + current_MonitorInfoPath;
        //var pdi_obj_value = 'http://localhost:3245' + '/PDI/rl500.PDI';
        if ($('#Pbd1')) {
            $('#Pbd1').remove();
        }
        $('.content-body').append('<object classid="clsid:4F26B906-2854-11D1-9597-00A0C931BFC8" id="Pbd1" style="width:100%;height:100%"><param name="DisplayURL" id="param_pdi" value="' + pdi_obj_value + '" /></object>');
    }
}