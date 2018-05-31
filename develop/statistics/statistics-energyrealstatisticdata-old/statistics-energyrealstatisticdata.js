var Page = {
    my_grid: null,

    /* 当前树种选中的Id */
    current_tree_select_id: '',

    /* 编辑区初始显示状态 */
    //right_panel_showing: false,

    my_grid_config: function () {
        return {
            store_config: {
                fields: [
                    'EnergyRealStatisticDataID',
                    'MeasurePropertyID',
                    'EnergyRealStatisticDataStartTime',
                    'EnergyRealStatisticDataStartData',
                    'EnergyRealStatisticDataFinishTime',
                    'EnergyRealStatisticDataFinishData',
                    'EnergyRealStatisticDataRealTotalData',
                    'EnergyRealStatisticDataCalcTotalData',
                    'MeterPointRangeIsOverflow',
                    'EnergyMediumID',
                    'EnergyMediumName',
                    'ModelBaseID',
                    'ModelBaseName',
                    'StatisticCycleTime'
                ]
            },

            grid_config: {
                columns: {
                    defaults: {
                        flex: 0
                    },
                    items: [
                        //{ text: '序号', dataIndex: 'UnitMeasureID', width: 100 },
                        { text: '能源种类', dataIndex: 'EnergyMediumID', flex: 1 },
                        { text: '开始时间', dataIndex: 'EnergyRealStatisticDataStartTime', flex: 1 },
                        { text: '开始读值', dataIndex: 'EnergyRealStatisticDataStartData', flex: 1 },
                        { text: '结束时间', dataIndex: 'EnergyRealStatisticDataFinishTime', flex: 1 },
                        { text: '结束读值', dataIndex: 'EnergyRealStatisticDataFinishData', flex: 1 },
                        { text: '统计值', dataIndex: 'EnergyRealStatisticDataRealTotalData', flex: 1 },
                        {
                            text: '是否超量程', dataIndex: 'MeterPointRangeIsOverflow', flex: 1,
                            renderer: function (value) {
                                switch (value) {
                                    case 1: return '是';
                                    case 2: return '否';
                                    default: return '';
                                }
                            }
                        }
                    ]
                }
            },

            url: '/api/EnergyRealStatisticData/GetPage',
            ps: 8,
            show_delete_column: false

        }
    },

    init: function () {

        var that = this;

        //初始化的MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config());

        //查询按钮
        $('#query').click(function () {
            that.my_grid.query({
                ModelBaseID: that.current_tree_select_id, EnergyRealStatisticDataStartTime: $('#EnergyRealStatisticDataStartTime').val(), EnergyRealStatisticDataFinishTime: $('#EnergyRealStatisticDataFinishTime').val(), EnergyMediumID: $('#EnergyMediumID').val(), MeasurePropertyTime: $('#MeasurePropertyTime').val()
            });
        });

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计单元查询');
        })

        //点击查询介质
        //$('#search-EnergyMediumID').click(function () {
        //    Page.prepare_select_source_EnergyMediumID();
        //});

        this.tree_init();

        this.prepare_select_source_EnergyMediumID();

    },

    //准备 能源种类 的下拉框数据源
    prepare_select_source_EnergyMediumID: function () {

        $('#EnergyMediumID').val('').html('');

        $.ajax({
            url: '/api/EnergyMedium/GetList',
            type: 'get',
            dataType: 'json',
            //data: { ModelBaseID: this.current_tree_select_id },
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    //Util.alert('加载能源种类失败');
                    return;
                }

                var EnergyMedium = data.Models;

                if (!EnergyMedium || !EnergyMedium.length) {
                    $('#EnergyMediumID').append("<option value='-1'>没有能源种类可供选择</option>");
                    $('#EnergyMediumID').attr("disabled", "disabled");

                    return;
                }

                var option = $('<option>').val('').html('');
                $('#EnergyMediumID').append(option);

                for (var i in EnergyMedium) {
                    var item = EnergyMedium[i];
                    var option = $('<option>').val(item.EnergymediumId).html(item.EnergymediumName);
                    $('#EnergyMediumID').append(option);
                }

                $('#EnergyMediumID').val('');
                
            }
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

        //初始化树（第一个参数是页面对象本身的指针，第二个参数是树配置
        this.my_tree = new MyTree(this, this.tree_config);

        //绑定树节点的点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        //查询树
        this.my_tree.query();

        //刷新按钮
        $('#refresh').click(function () {
            $('input').val('');
            $('select').val('');
            that.my_tree.reset();
            that.my_grid.query({
                ModelBaseID: '', EnergyRealStatisticDataStartTime: '', EnergyRealStatisticDataFinishTime: '', EnergyMediumID: '', MeasurePropertyTime: ''
            });
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        $('input').val('');
        this.current_tree_select_id = id || '';
        this.my_grid.query({
            ModelBaseID: this.current_tree_select_id, EnergyRealStatisticDataStartTime: '', EnergyRealStatisticDataFinishTime: '', EnergyMediumID: '', StatisticCycleTime: ''
        });
    }

};