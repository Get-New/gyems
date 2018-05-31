
var Page = {
    my_grid: null,

    /* 当前在树中选中的Id */
    current_tree_select_id: 'root',

    /* 当前页面的功能点列表 */
    current_features: [],

    /* 功能点数据源(FeatureId FeatureTag FeatureName) */
    feature_combo_source: null,
    feature_combo_store: null,

    my_grid_config: {
        store_config: {
            fields: ['MenuId', 'MenuName', 'MenuUrl', 'ParentId', 'ParentName', 'MenuLevel', 'BusinessSort', 'Features', 'MenuPath', 'IconUrl']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '页面名称',
                    dataIndex: 'MenuName',
                    flex: 0.35
                }, {
                    text: '级别',
                    dataIndex: 'MenuLevel',
                    flex: 0.15,
                    renderer: function (value) {
                        switch (value) {
                            case 1: return '一级';
                            case 2: return '二级';
                            case 3: return '三级';
                            default: return '';
                        }
                    }
                }, {
                    text: 'Url',
                    dataIndex: 'MenuUrl',
                    flex: 0.5
                }]
            }
        },

        url: '/api/ManageMenu/GetPage',
        ps: 8,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {

        var that = this;

        loop();

        function loop() {
            if ($("#grid-container").height() > 0) {
                that.init_cont();
            } else {
                setTimeout(loop, 1000);
            }
        }

    },

    init_cont: function () {
        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 初始化功能点数据源
        $.ajax({
            url: '/api/ManageMenu/Init',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || data.Error) {
                    alert('出现错误 错误信息为：' + data.error);
                    return;
                }

                that.feature_combo_source = data.Models;

                var tmp = [];
                for (var i in data.Models) {
                    var item = data.Models[i];
                    tmp.push([item.FeatureId, item.FeatureCode]);
                }
                Page.feature_combo_store = tmp;

            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({
                MenuName: $('#search-name').val(),
                MenuRootId: that.current_tree_select_id
            });
        });

        $('.search-condition').keydown(function (event) {
        	if ((event.keyCode || e.which) == 13) {
        		event.returnValue = false;
        		event.cancel = true;
        		that.my_grid.query({
        			MenuName: $('#search-name').val(),
        			MenuRootId: that.current_tree_select_id
        		});
        	}
        });

        // 页面加载后先查询一次
        this.my_grid.query({
            MenuName: '',
            MenuRootId: that.current_tree_select_id
        });       


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

        // 功能点的显示
        this.show_feature_names();

        this.right_panel_init();
        this.my_form_init();
        this.tree_init();
        this.window_init();

        // 初始化表单
        this.clear();
    },

    submit_add: function () {
        var that = this;

        if (this.my_tree.current_select_level >= 3) {
            Util.alert('最高可以创建三级菜单');
            return;
        }

        $('#Features').val(JSON.stringify(this.current_features));
        var data = this.my_form.serialize_data();
        data.ParentId = this.current_tree_select_id;

        Util.ajax_add({
            data: data,
            validator: that.validate,
            model: 'ManageMenu',
            success: function () {
                that.my_grid.reload();
                that.my_tree.refresh();
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

        $('#Features').val(JSON.stringify(this.current_features));

        var data = this.my_form.serialize_data();

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/ManageMenu/Edit',
            type: 'put',
            data: data,
            success: function (data) {

                if (!data || data.Error) {
                    Util.alert('发生错误，操作失败');
                    console.log(data);
                    return;
                }

                that.my_grid.reload();
                that.my_tree.refresh();
                Util.alert('修改成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误，操作失败');
                console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    }, 
   
    getLevelDescp: function (level) {
        switch (level) {
            case 1: return '一级';
            case 2: return '二级';
            case 3: return '三级';
            default: return '';
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { MenuId: record.MenuId };
        var level = this.getLevelDescp(record.MenuLevel);
        Util.confirm('确认要删除名称为' + record.MenuName + '的' + level + '菜单吗?', function () {
            $.ajax({
                url: '/api/ManageMenu/Delete',
                type: 'delete',
                data: data,
                success: function (data) {

                    if (!data || data.Error) {
                        Util.alert('发生错误，操作失败');
                        console.log(data);
                        return;
                    }

                    that.my_grid.reload();
                    that.my_tree.refresh();
                    Util.alert('删除成功');
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    Util.alert('出现错误，操作失败');
                    console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
                }
            });
        });
    },

    validate: function (data) {
        if (!data.MenuName) {
            return "名字不可以为空";
        }
    },

    on_grid_row_selected: function (data, index) {
        
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);

        this.current_features = data.Features;
        this.show_feature_names();

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
        url: '/api/ManageMenu/GetTree',
        root_name: '所有菜单',
        id_field: 'MenuId',
        name_field: 'MenuName',
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
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
            that.my_grid.query({ MenuName: $('#search-name').val(), MenuRootId: 'root' });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        this.my_grid.query({ MenuName: $('#search-name').val(), MenuRootId: id });
    },









    feature_store: null,
    feature_code_store: null,
    feature_grid: null,

    window_init: function () {
        var that = this;
        // 弹出window
        $('#choose-feature').click(function () {
            that.open_window();
        })

        // 点击window的取消
        $('#window-cancel').click(function () {
            
            that.hide_window();
        });

        // 点击window的保存
        $('#window-save').click(function () {
            that.save_feature_grid();
        });

        // 点击添加功能
        $('#add-feature').click(function () {
            that.feature_store.insert(0, {});
        })

    },

    open_window: function () {
        $('.window').fadeIn(200);
        if (this.feature_grid == null) {
            this.init_feature_grid();
        }

        this.load_feature_grid();
        $('.window .window-body.grid-editor .grid-container.row-edit-grid .x-panel.x-panel-default.x-grid.x-border-box').attr('style', 'height:91.8%;width:100%');
        
    },

    hide_window: function () {
        $('.window').fadeOut(100);
    },

    init_feature_grid: function () {
        var feature_store_config = {
            fields: ['FeatureId', 'FeatureAlias']
        };

        var feature_grid_config = {
            columns: {
                defaults: {
                    BusinessSortable: false,
                    menuDisabled: true,
                    align: 'center',
                    flex: 1
                },
                items: [{
                    text: ' ',
                    dataIndex: '',
                    flex: 0.08,
                    renderer: function () {
                        var el = "<div class='garbage'>";
                        return el;
                    }
                }, {
                    text: '标签',
                    dataIndex: 'FeatureId',
                    align: 'left',
                    renderer: function (value) {
                        var source = Page.feature_combo_source;
                        var item = _.find(source, 'FeatureId', value);
                        if (item) {
                            return item.FeatureCode;
                        }
                        return '';
                    },
                    editor: new Ext.form.field.ComboBox({
                        typeAhead: true,
                        triggerAction: 'all',
                        store: Page.feature_combo_store,

                        listeners: {
                            change: function (th, newValue, oldValue, eOpts) {

                            }
                        }
                    })
                }, {
                    text: '功能',
                    dataIndex: 'FeatureAlias',
                    editor: {
                        allowBlank: false
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
            enableColumnResize: false,
            listeners: {
                edit: function (editor, e) {
                    if (e.field == 'FeatureId') {
                        var value = e.value;
                        var source = Page.feature_combo_source;
                        var item = _.find(source, 'FeatureId', value);
                        if (item) {
                            e.record.data.FeatureAlias = item.FeatureName;
                            Page.feature_grid.getView().refresh();
                        }
                    }
                }
            }
        };
        feature_grid_config.renderTo = Ext.get('feature-grid-container');
        this.feature_store = Ext.create('Ext.data.Store', feature_store_config);
        this.feature_grid = Ext.create('Ext.grid.Panel', feature_grid_config);
        this.feature_grid.bindStore(this.feature_store);

        var that = this;
        $('.grid-editor').on('click', '.garbage', function () {
            var record_id = $(this).parents('.x-grid-row').attr('data-recordid');
            that.onRemoveClick(record_id);
        })
    },

    show_feature_names: function () {        
        var feature_names = _.pluck(Page.current_features, 'FeatureAlias').join('   ');
        $('#feature_names').val(feature_names);
    },

    load_feature_grid: function () {
        Page.feature_store.loadData(Page.current_features);
    },

    save_feature_grid: function () {
        var store_data = this.feature_store.data.items;
        var d = _.pluck(store_data, 'data');
        _.remove(d, function (x) {
            return !_.trim(x.FeatureId);
        })
        this.current_features = d;
        this.show_feature_names();
        this.hide_window();
    },

    onRemoveClick: function (record_id) {
        var index = _.findIndex(this.feature_store.data.items, 'internalId', record_id)

        if (typeof index == 'number') {
            this.feature_store.removeAt(index);
        }
    }
};



