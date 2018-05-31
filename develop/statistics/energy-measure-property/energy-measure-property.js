
var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前选中记录的分配比例 */
    current_radios: [],

    my_grid_config: {
        store_config: {
            fields: ['MeasurePropertyId', 'MeasurePropertyName', 'ModelBaseId', 'ModelBaseName', 'EnergyMediumId', 'EnergyMediumName', 'EnergyBlanceMethod', 'Ratios']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '统计单元名称',
                    dataIndex: 'MeasurePropertyName'
                }, {
                    text: '能源种类',
                    dataIndex: 'EnergyMediumName'
                }, {
                    text: '平衡方法',
                    dataIndex: 'EnergyBlanceMethod',
                    renderer: function (value) {
                        switch (value) {
                            case 1: return '平摊';
                            case 2: return '比例';
                            case 3: return '手动';
                            default: return '';
                        }
                    }
                }]
            }
        },

        url: '/api/EngeryMeasureProperty/GetPage',
        ps: 8,
        show_delete_column: false,
        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
    },

    init: function () {

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({            
                RootId: that.current_tree_select_id
            });
        });

        // 页面加载后先查询一次
        this.my_grid.query({
            RootId: that.current_tree_select_id
        });
        
        // 新增
        $('#add').click(function () {
            that.on_btn_add_clicked();
        });

        // add
        $('#submit-edit').click(function () {
            that.submit_edit();
        })        

        // 导出excel
        $('#export').click(function () {
            that.my_grid.exportExcel('能源平衡配置');
        })

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();
        this.radio_grid_init();

        // 初始化表单
        this.clear();
    },

    submit_edit: function () {
        var that = this;
        var row = that.my_grid.get_last_selected();

        if (!row || !row.data) {
            Util.alert('请先选择一行记录');
            return;
        }

        var radios = this.get_radios_from_grid();
        $('#Ratios').val(JSON.stringify(radios));        

        var data = this.my_form.serialize_data();

        console.log(data);

        $.ajax({
            url: '/api/EngeryMeasureProperty/Edit',
            type: 'put',
            data: data,
            success: function (data) {

                if (!data || data.Error) {
                    Util.alert('发生错误，操作失败');
                    console.log(data);
                    return;
                }

                that.my_grid.reload();           
                Util.alert('修改成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误，操作失败');
                console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    }, 

    on_grid_row_selected: function (data, index) {

        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);
        
        var method = data.EnergyBlanceMethod;

        this.load_radio_grid(method, data.Ratios)

        $('input[type=radio][name=EnergyBlanceMethod][value=' + method + ']').prop('checked', true);       

        var level = data.MenuLevel;
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
            that.my_grid.query({ MenuName: $('#search-name').val(), MenuRootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({ MenuName: $('#search-name').val(), MenuRootId: id });
    },






    radio_store_list: [],
    radio_grid_list: [],
    current_method: 1,

    radio_grid_init: function () {

        var that = this;

        var radio_store_config = {
            fields: ['MeasurePropertyId', 'MeasurePropertyName', 'EnergyBlanceRatio']
        };

        var radio_grid_config = {
            columns: {
                defaults: {
                    BusinessSortable: false,
                    menuDisabled: true,
                    align: 'center',
                    flex: 0
                },
                items: [{
                    text: '统计单元名称',
                    dataIndex: 'MeasurePropertyName',
                    minWidth: 190
                }, {
                    text: '分配比例',
                    dataIndex: 'EnergyBlanceRatio',
                    minWidth: 200
                }]
            },
            viewConfig: {
                enableTextSelection: false,
                loadMask: true
            },      
            width: "100%",
            height: "100%",
            enableColumnMove: false,
            enableColumnResize: false
        };

        var radio_grid_config_editable = {
            columns: {
                defaults: {
                    BusinessSortable: false,
                    menuDisabled: true,
                    align: 'center',
                    flex: 0
                },
                items: [{
                    text: '统计单元名称',
                    dataIndex: 'MeasurePropertyName',
                    minWidth: 190
                }, {
                    text: '分配比例',
                    dataIndex: 'EnergyBlanceRatio',
                    minWidth: 200,
                    editor: {
                        allowBlank: true
                    }                  
                }]
            },
            viewConfig: {
                enableTextSelection: false,
                loadMask: true
            },
            selModel: {
                selType: 'cellmodel'
            },
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            width: "100%",
            height: "100%",
            enableColumnMove: false,
            enableColumnResize: false
        };

        radio_grid_config.renderTo = Ext.get('radio-grid-container1');
        var store1 = Ext.create('Ext.data.Store', radio_store_config);
        var grid1 = Ext.create('Ext.grid.Panel', radio_grid_config);
        grid1.bindStore(store1);

        radio_grid_config.renderTo = Ext.get('radio-grid-container2');
        var store2 = Ext.create('Ext.data.Store', radio_store_config);
        var grid2 = Ext.create('Ext.grid.Panel', radio_grid_config);
        grid2.bindStore(store2);

        radio_grid_config_editable.renderTo = Ext.get('radio-grid-container3');
        var store3 = Ext.create('Ext.data.Store', radio_store_config);
        var grid3 = Ext.create('Ext.grid.Panel', radio_grid_config_editable);
        grid3.bindStore(store3);

        this.radio_store_list = [store1, store2, store3];
        this.radio_grid_list = [grid1, grid2, grid3];

        $('input[type=radio][name=EnergyBlanceMethod]').change(function () {
            var value = $(this).val();
            that.switch_grid(value);
        })
    },

    load_radio_grid: function (method, radios) {
        $('#radio-inline-grid .grid-container').appendTo('#radio-show')

        var length = radios.length;
        var avg = 1;
        if (length > 0) {
            avg = (1 / length).toFixed(2);
        }

        for (var i = 0; i < 3; i++) {
            var datas = [];

            for (var j in radios) {
                var item = radios[j];                               

                datas.push({
                    MeasurePropertyId: item.MeasurePropertyId,
                    MeasurePropertyName: item.MeasurePropertyName,
                    EnergyBlanceRatio: function () {
                        switch (i) {
                            case 0: return avg;
                            case 2: return item.EnergyBlanceRatio;
                            default: return '-';
                        }
                    }()
                });
            }

            this.radio_store_list[i].loadData(datas);
        }

        this.switch_grid(method);
    },

    get_radios_from_grid: function () {        
        var method = this.current_method;
        var store_data = this.radio_store_list[method-1].data.items;
        var d = _.pluck(store_data, 'data');        
        return d;
    },

    switch_grid: function (index) {
        this.current_method = index;
        var id = 'radio-grid-container' + index;
        $('#radio-inline-grid .grid-container').appendTo('#radio-hide')
        $('#' + id).appendTo('#radio-show')
    }
};



