/// <reference path="../../common/jquery-1.12.4.js" />
/// <reference path="../../../lib/Extjs-4.2.3/ext-all.js" />

$(function () {
    Ext.onReady(function () {
        Page.init();
        Page.tree_init();
    })
})

var Page = {
    my_grid: null,

    /* 当前树种选中的Id */
    current_tree_select_id: '',

    /* 编辑区初始显示状态 */
    right_panel_showing: false,

    my_grid_config: {
        store_config: {
            fields: [
                'EngeryKPIParamID',
                'ModelBaseID',
                'ModelBaseName',
                'EngeryKPIParamName',
                'EngeryKPIParamValue',
                'UnitMeasureID',
                'UnitMeasureName',
                'DescriptionInfo'
            ]
        },

        grid_config: {
            columns: {
                defaults: {
                    flex: 0
                },
                items: [
                    {
                        text: '',
                        dataIndex: '',
                        width: 50,
                        renderer: function (value, metaData, record, rowIndex, colIndex) {
                            var el = "<a href='javascript:Page.deleteRow()'><div class='garbage'></div></a>";
                            return el;
                        }
                    },
                    //{ text: '序号', dataIndex: 'UnitMeasureID', width: 100 },
                    { text: '部门', dataIndex: 'ModelBaseName', flex: 0.6 },
                    { text: '绩效参数', dataIndex: 'EngeryKPIParamName', flex: 1 },
                    { text: '数值', dataIndex: 'EngeryKPIParamValue', flex: 1 },
                    { text: '单位', dataIndex: 'UnitMeasureID', flex: 0.6 },
                    { text: '描述', dataIndex: 'DescriptionInfo', flex: 0.6 }
                ]
            },

            listeners: {
                select: function (scope, record, index, eOpts) {
                    Page.on_grid_row_selected(record.data, index);
                },
                dblclick: {
                    element: 'body',
                    fn: function (e) {
                        Page.on_dblclick();
                    }
                }
            }
        },

        url: '/api/EngeryKPIParam/GetPage',
        //ps:11
    },

    init: function () {

        var that = this;

        //设置存放Grid的div
        this.my_grid_config.grid_config.renderTo = Ext.get('grid-container');

        //初始化的MyGrid
        this.my_grid = new MyGrid();
        this.my_grid.init(this.my_grid_config);

        //查询按钮
        $('#query').click(function () {
            that.my_grid.query({ ModelBaseID: that.current_tree_select_id, EngeryKPIParamName: $('#search-name').val() });
            //Util.alert(123);
            //that.clear;
        });

        //添加按钮
        $('#add').click(function () {
            //that.on_dblclick();
            that.on_btn_add_clicked();
        })

        //修改按钮, 与添加按钮事件一致, 显示form
        $('#btn-edit').click(function () {
            //that.on_dblclick();
            that.on_btn_add_clicked();
        })

        //form的关闭事件
        $('.close-button').click(function () {
            Page.hide_right_panel();
        });


        //form查询单位
        $('#search-unit').click(function () {
            Page.prepare_select_source();
        });

        //form添加
        $('#submit-add').click(function () {
            that.submit('add');
        });

        //form修改
        $('#submit-edit').click(function () {

            //alert($('#UnitMeasureID option:selected').text());

            var row = that.my_grid.get_last_selected();
            if (!row || !row.data) {
                Util.alert('请先选择一行记录');
                return;
            }
            that.submit('edit');
        });

        //初始化表单
        this.clear();

        //设置某个框不能输入
        //$('.datetime').keydown(function (e) { return false; });

        //this.tree_init();

    },

    // 准备下拉框的数据源
    prepare_select_source: function () {
        $.ajax({
            url: '/api/UnitMeasure/GetPage',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                if (!data || !_.isArray(data.Models) || data.Models.length < 1) {
                    Util.alert('加载能源单位失败');
                    return;
                }

                var EnergyUnitList = data.Models;

                $('#UnitMeasureID').val('').html('');

                if (!EnergyUnitList || !EnergyUnitList.length) {
                    $('#UnitMeasureID').append("<option value='-1'>没有能源单位可供选择</option>");
                    $('#UnitMeasureID').attr("disabled", "disabled");
                    return;
                }

                for (var i in EnergyUnitList) {
                    var item = EnergyUnitList[i];
                    var option = $('<option>').val(item.UnitMeasureId).html(item.UnitMeasureName);
                    $('#UnitMeasureID').append(option);
                }

                $('#UnitMeasureID').val('');

                //if (typeof callback == 'function') {
                //    callback();
                //}
            }
        })
    },

    //删除行
    deleteRow: function () {
        var that = this;
        var row = this.my_grid.get_last_selected();
        var data = { EngeryKPIParamID: row.data.EngeryKPIParamID };
        Util.confirm('确定要删除考核参数为' + row.data.EngeryKPIParamName + '的记录吗?', function () {
            $.ajax({
                url: '/api/EngeryKPIParam/Delete',
                type: 'delete',
                data: data,
                success: function (data) {
                    that.my_grid.reload();
                    $('.right-content form input').val('');
                    Util.alert('删除成功');
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    Util.alert('Error "' + jqXhr.status + '"(textStatus: "' + textStatus + '", errorThrown: "' + errorThrown + '")');
                }
            });
        });
    },

    //提交当前操作
    submit: function (current_action) {
        var that = this;
        if (!this.validate()) {
            return;
        }

        var data = $('form').serialize();
        data = data.replace(/\+/g, '');

        if (current_action == 'add') {
            //alert(that.current_group_select_id);
            if (!that.current_tree_select_id) {
                Util.alert('请选择车间！');
                return;
            }

            data = Util.modifyFormData(data, 'ModelBaseID', that.current_tree_select_id);
            data = Util.modifyFormData(data, 'UnitMeasureID', $('#UnitMeasureID').val());
            data = data.replace(/\+/g, '');

            $.ajax({
                url: '/api/EngeryKPIParam/Add',
                type: 'post',
                data: data,
                success: function (data) {
                    if (!data || data.error) {
                        Util.alert('出现错误 错误信息为：' + data.error);
                        return;
                    }

                    that.my_grid.reload();
                    Util.alert('添加成功');
                },
                error: function (qjXhr, textStatus, errorThrown) {
                    Util.alert('Error "' + jqXhr.status + '"(textStatus: "' + textStatus + '", errorThrown: "' + errorThrown + '")');
                }
            });
        }

        if (current_action == 'edit') {

            data = Util.modifyFormData(data, 'UnitMeasureID', $('#UnitMeasureID').val());

            $.ajax({
                url: '/api/EngeryKPIParam/Edit',
                type: 'put',
                data: data,
                success: function (data) {
                    if (!data || data.error) {
                        Util.alert('出现错误 错误信息为：' + data.error);
                        return;
                    }

                    that.my_grid.reload();
                    Util.alert('修改成功');
                },
                error: function (qjXhr, textStatus, errorThrown) {
                    Util.alert('Error "' + jqXhr.status + '"(textStatus: "' + textStatus + '", errorThrown: "' + errorThrown + '")');
                }
            });
        }
    },

    validate: function () {
        if (!$('#EngeryKPIParamName').val()) {
            Util.alert('绩效参数名称不可以为空');
            return false;
        }

        return true;
    },

    on_grid_row_selected: function (data, index) {
        var y0 = 55;
        var dy = 52;
        var top = y0 + dy * index;
        $('.arrow-outer').css('top', top);
        $('.arrow-inner').css('top', top + 2);

        for (var property in data) {
            //if (typeof data[property] == 'string') {
            //    $('#' + property).val(data[property]);
            //}
            //if (typeof data[property] == undefined) {
            //    $('#' + property).val('');
            //}

            if (typeof data[property]) {
                $('#' + property).val(data[property]);
            }

            $('#UnitMeasureID').val('').html('');

            $('#UnitMeasureID').val(data[UnitMeasureID]).html(data[UnitMeasureName]);

        }
    },

    on_dblclick: function () {
        var that = this;
        if (this.right_panel_showing) {
            return;
        }

        //防止用户双击时选中文本
        $('.main-content').addClass('unselectable');
        var clearSlct = 'getSelection' in window ? function () {
            window.getSelection().removeAllRanges();
        } : function () {
            document.selection.empty();
        };

        $('.main-content').animate({ marginRight: '480px' }, 'normal', function () {
            that.my_grid.grid.getView().refresh();
            $('.right-content').css('visibility', 'visible').show();
            $('.right-content').removeClass('unselectable');
            clearSlct();
        });
        this.right_panel_showing = true;
    },

    //点击主界面添加按钮
    on_btn_add_clicked: function () {
        var that = this;
        this.clear();
        if (!this.right_panel_showing) {
            $('.main-content').animate({ marginRight: '480px' }, 'normal', function () {
                that.my_grid.grid.getView().refresh();
                $('.right-content').css('visibility', 'visible').show();
            });
            this.right_panel_showing = true;
        }
    },

    hide_right_panel: function () {
        var that = this;
        if (!this.right_panel_showing) {
            return;
        }

        $('.right-content').hide();
        $('.main-content').animate({ marginRight: '30px' }, 'normal', function () {
            that.my_grid.grid.getView().refresh();
        });
        this.right_panel_showing = false;
    },

    clear: function () {
        this.my_grid.clear_selection();
        $('.right-content form input').val('');
        $('#search-name').val('');
    },

    my_tree: null,

    tree_config: {
        //url: '/api/FactoryModelbase/GetTree',
        url: '/api/FactoryWorkshop/GetTree',
        root_name: '贵溪冶炼厂',
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
            that.my_grid.query();
            that.my_tree.reset();
            that.clear();
        });
    },

    //树点击事件调用的函数
    tree_node_click: function (id) {
        this.current_tree_select_id = id || '';
        this.clear();
        //Util.alert(id);
        this.my_grid.query({ ModelBaseID: this.current_tree_select_id });
    }

};