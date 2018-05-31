var Page = {
    /* grid控件 */
    my_grid: null,

    /* 当前行动 */
    current_action: null,

    // 全部角色（作为选择框的数据源）
    roles: [],

    // 全部部门（作为选择框的数据源）
    depts: [],

    // 全部职位（作为选择框的数据源）
    positions: [],

    // 全部文档权限分组（作为选择框的数据源）
    filedirs: [],

    my_grid_config: {
        store_config: {
            fields: ['UserId', 'UserName', 'InstitutionId', 'InstitutionName', 'PositionIdList', 'PositionNameList', 'FiledirIdList', 'FiledirNameList', 'RoleIdList', 'RoleNameList']
        },

        grid_config: {
            columns: {
                items: [{
                    text: '用户名',
                    dataIndex: 'UserName'
                }, {
                    text: '所属部门',
                    dataIndex: 'InstitutionName'
                }, {
                    text: '数据节点分组',
                    dataIndex: 'PositionNameList',
                    renderer: function (value) {
                        return value.join('&nbsp;&nbsp;&nbsp;');
                    }
                }, {
                    text: '文档权限分组',
                    dataIndex: 'FiledirNameList',
                    renderer: function (value) {
                        return value.join('&nbsp;&nbsp;&nbsp;');
                    }
                }, {
                    text: '菜单权限分组',
                    dataIndex: 'RoleNameList',
                    renderer: function (value) {
                        return value.join('&nbsp;&nbsp;&nbsp;');
                    }
                }]
            }
        },

        url: '/api/ManageUser/GetPage',
        ps: 8,
        show_delete_column: true,

        row_select_handler: 'on_grid_row_selected',
        dblclick_handler: 'on_grid_dblclicked',
        delete_handler: 'on_grid_row_delete_clicked'
    },

    init: function () {
        var that = this;

        var that = this;

        // 初始化MyGrid
        this.my_grid = new MyGrid(this, this.my_grid_config);

        // 绑定查询按钮事件
        $('#query').click(function () {
            that.my_grid.query({ UserName: $('#search-name').val() });
            that.clear();
        });

        $('.search-condition').keydown(function (event) {
            if ((event.keyCode || e.which) == 13) {
                event.returnValue = false;
                event.cancel = true;
                that.my_grid.query({ UserName: $('#search-name').val() });
                that.clear();
            }
        });

        // 查询角色和部门数据
        $.ajax({
            url: '/api/ManageUser/Init',
            method: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || !data.Models || !_.isArray(data.Models) || data.Models.length == 0) {
                    Util.alert('页面初始化失败');
                    return;
                }

                var item = data.Models[0];

                that.depts = item.Institutions;
                that.roles = item.Roles;
                that.positions = item.Positions;
                that.filedirs = item.Filedirs;

                that.bind_dept_combo_source();
                that.bind_role_checkbox_source();
                that.bind_position_combo_source();
                that.bind_filedir_combo_source();

                // 页面加载后先查询一次
                that.my_grid.query({ UserName: '' });
            }
        })

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

        this.right_panel_init();
        this.my_form_init();

        // 初始化表单
        this.clear();

        /* 点击“重置密码” */
        $('#reset').click(function () {
            var row = that.my_grid.get_last_selected();

            if (!row || !row.data) {
                Util.alert('请先选择一行记录');
                return;
            }

            var data = {
                UserId: row.data.UserId
            };

            Util.confirm('确认要对名称为' + row.data.UserName + '的用户重置密码吗?', function () {
                $.ajax({
                    url: '/api/ManageUser/ResetPwd',
                    type: 'put',
                    data: data,
                    success: function (data) {
                        that.my_grid.reload();
                        Util.alert('密码重置成功');
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
                    }
                });
            });
        })
    },

    submit_add: function () {
        var that = this;

        var RoleIdList = $('.role-checkbox:checked').map(function () { return this.value }).get().join(',');
        $('#RoleIdList').val(RoleIdList);

        var PositionIdList = $('#PositionId').val();
        $('#PositionIdList').val(PositionIdList);

        var FiledirIdList = $('#FiledirId').val();
        $('#FiledirIdList').val(FiledirIdList);

        var data = this.my_form.serialize_data();

        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/ManageUser/Add',
            type: 'post',
            data: data,
            success: function (data) {
                if (!data || data.Error) {
                    Util.alert('发生错误，操作失败');
                    console.log(data);
                    return;
                }

                that.my_grid.reload();
                Util.alert('添加成功');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert('出现错误，操作失败');
                console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
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

        var RoleIdList = $('.role-checkbox:checked').map(function () { return this.value }).get().join(',');
        $('#RoleIdList').val(RoleIdList);

        var PositionIdList = $('#PositionId').val();
        $('#PositionIdList').val(PositionIdList);

        var FiledirIdList = $('#FiledirId').val();
        $('#FiledirIdList').val(FiledirIdList);

        var data = this.my_form.serialize_data();
        data.FiledirIdList = FiledirIdList;
        
        var msg = this.validate(data);
        if (msg) {
            Util.alert(msg);
            return;
        }

        $.ajax({
            url: '/api/ManageUser/Edit',
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

    validate: function (data) {
        if (!data.UserName) {
            return "名字不可以为空";
        }
        if (!data.InstitutionId) {
            return "请选择所属部门";
        }
    },

    on_grid_row_delete_clicked: function (record) {
        var that = this;
        var data = { UserId: record.UserId };
        Util.confirm('确认要删除名称为' + record.UserName + '的记录吗?', function () {
            $.ajax({
                url: '/api/ManageUser/Delete',
                type: 'delete',
                data: data,
                success: function (data) {
                    if (!data || data.Error) {
                        Util.alert('发生错误，操作失败');
                        console.log(data);
                        return;
                    }

                    that.my_grid.reload();
                    Util.alert('删除成功');
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    Util.alert('出现错误，操作失败');
                    console.log("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
                }
            });
        });
    },

    bind_dept_combo_source: function () {
        for (var i in this.depts) {
            var item = this.depts[i];
            var option = $('<option>').val(item.InstitutionId).html(item.InstitutionName);
            $('#InstitutionId').append(option);
        }
    },

    bind_role_checkbox_source: function () {
        for (var i in this.roles) {
            var item = this.roles[i];
            var ul = $('#roles')
            var li = $("<li>");
            var text = $("<span>").html(item.RoleName);
            var checkbox = $("<input type='checkbox' class='role-checkbox'>").val(item.RoleId);
            li.append(checkbox);
            li.append(item.RoleName);
            ul.append(li);
        }
    },

    bind_position_combo_source: function () {
        for (var i in this.positions) {
            var item = this.positions[i];
            var option = $('<option>').val(item.PositionId).html(item.PositionName);
            $('#PositionId').append(option);
        }
    },

    bind_filedir_combo_source: function () {
        for (var i in this.filedirs) {
            var item = this.filedirs[i];
            var option = $('<option>').val(item.FiledirId).html(item.FiledirName);
            $('#FiledirId').append(option);
        }
    },

    on_grid_row_selected: function (data, index) {
        this.right_panel.set_arrow_position(index);
        this.my_form.load_data(data);

        var role_id_list = data.RoleIdList;

        $('.role-checkbox').prop('checked', '');
        for (var i in role_id_list) {
            var role_id = role_id_list[i];
            $('.role-checkbox[value=' + role_id + ']').prop('checked', 'checked');
        }

        var position_id_list = data.PositionIdList;
        for (var i in position_id_list) {
            var position_id = position_id_list[i];
            $('#PositionId').val(position_id);
        }

        var filedir_id_list = data.FiledirIdList;
        for (var i in filedir_id_list) {
            var filedir_id = filedir_id_list[i];
            $('#FiledirId').val(filedir_id);
        }
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
        $('.role-checkbox').prop('checked', false);
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
    }
};