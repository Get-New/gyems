

var Page = {
    my_grid: null,
    current_tree_select_id:null,
    my_grid_config: {
        store_config: {
            fields: [
            'MeasurePropertyID',
            'ModelBaseID',
            'ModelBaseName',
            'MeasurePropertyName',
            'EnergyMediumName',
            'EnergyMediumId',
            'MeasurePropertyTime',
            'MeasurePropertyClass',
            'MeasurePropertyType',
            'MeasurePropertyCalcFormula',
            'MeterPointID',
            'MeterPointName',
            'DESCRIPTIONINFO',
            'ENABLESIGN',
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [

               {
                   text: '能源种类',
                   dataIndex: 'MeasurePropertyName',
                   flex: 0.5,
               },

               {
                   text: '开始时间',
                   dataIndex: 'ModelBaseName',
                   flex: 0.5,
               },

                {
                    text: '计量介质',
                    dataIndex: 'EnergyMediumName',
                    flex: 0.5,

                },
                 {
                     text: '开始读值',
                     dataIndex: 'MeasurePropertyTime',
                     flex: 0.5,
                     renderer: function (value) {
                         switch (value) {
                             case 1: return "15分钟";
                             case 2: return "小时";
                             case 3: return "天";
                             case 4: return "月";
                             case 5: return "季";
                             case 6: return "年";
                             default: return ""
                         }
                     }
                 },
                  {
                      text: '结束时间',
                      dataIndex: 'MeasurePropertyClass',
                      flex: 0.5,
                      renderer: function (value) {
                          switch (value) {
                              case 0: return "自动统计";
                              case 1: return "人工统计";
                              default: return ""
                          }
                      }
                  },
                  {
                      text: '结束读值',
                      dataIndex: 'MeasurePropertyType',
                      flex: 0.5,
                      renderer: function (value) {
                          switch (value) {
                              case 1: return "输入总量";
                              case 2: return "输出总量";
                              case 3: return "自发量";
                              case 4: return "平衡计量";
                              case 5: return "其他计量";
                              default: return ""
                          }
                      }
                  },
                  {
                      text: '统计值',
                      dataIndex: 'MeasurePropertyCalcFormula',
                      flex: 0.5,
                  },
                  {
                      text: '是否超量程',
                      dataIndex: 'MeterPointName',
                      flex: 0.5,
                  },
                  
               

                ]
            },
        },

        url: '/api/EngeryMeasureProperty/GetPage',
        ps: 11,
        show_delete_column: false,

        //row_select_handler: 'on_grid_row_selected',
        //dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    //***************************************************内置函数****************************8

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 页面加载后立即查询一次的函数，用于回调

        that.my_grid.query({ MeasurePropertyName: '', ModelBaseID: '' });

        // 初始化下拉框数据源（传入回调函数）
        that.prepare_select_source_EnergyMedium();
        that.prepare_select_source_StatisticCycle();
        $('#query').click(function () {
            that.my_grid.query({ MeasurePropertyName: $('#search-name').val(), ModelBaseID: that.current_tree_select_id });
        })

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('统计数据查询');
        })

        this.tree_init();

        // 初始化表单
        this.clear();
    },



 

    prepare_select_source_EnergyMedium: function () {
        var that = this;
        $.ajax({
            url: '/api/EnergyMedium/GetList',
            type: 'get',
            data: [{EnergyMediumName:'',RootId:that.current_tree_select_id}],
            success: function (data) {
                //console.log(data.Models);
                var item = data.Models;
                for (j = 0; j < item.length; j++) {
                    var optionN = item[j].EnergymediumName;
                    var optionV = item[j].EnergymediumId;
                    var options = $('<option>').val(optionV).html(optionN);
                    $('#EnergyMediumId').append(options)
                };        
            }
        })
    },
    prepare_select_source_StatisticCycle: function () {
        var that = this;
        $.ajax({
            url: ' /api/StatisticCycle/GetList',
            type: 'get',
            data: [{ StatisticCycleName:'' }],
            success: function (data) {
                console.log(data.Models);
                var item = data.Models;
                for (j = 0; j < item.length; j++) {
                    var optionN = item[j].StatisticCycleTime;
                    var optionV = item[j].StatisticCycleID;
                    var options = $('<option>').val(optionV).html(optionN);
                    $('#StatisticCycleTime').append(options)
                };
            }
        })
    },

    clear: function () {
        this.my_grid.clear_selection();
        //this.my_form.clear();
    },



    //**************************************************引入树***************************8

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
            that.my_grid.query({ EnergyMediumName: $('#EnergyMedium').val(), RootId: 'root' });
        });
    },
    //****************************树节点点击事件*******************************************8

    tree_node_click: function (id) {

       

        //$('#ModelBaseName').val(this.my_tree.current_select_name);
        //$('#ModelBaseID').val(this.my_tree.current_select_id);

        this.current_tree_select_id = id;

        this.my_grid.query({ MeasurePropertyName: $('#search-name').val(), ModelBaseID: id });

    }
}