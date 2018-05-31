
var Page = {
    current_RoleId: '',
    init: function () {
        var that = this;

        $("#query").click(function () {
            that.query(that.current_RoleId);
        })

        // 全选
        $('#button-select-all').click(function () {

        })

        // 保存
        $('#submit-edit').click(function () {
            var obj = {};
            obj.RoleId = that.current_RoleId;

            var menufeatureIds = [];

            for (var i in that.all_nodes) {
                var node = that.all_nodes[i];
                if (node.checked && node.businessId) {
                    menufeatureIds.push(node.businessId);
                }
            }

            obj.MenufeatureIds = menufeatureIds.toString();

            Util.ajax({
                url: '/api/ManageRoleauthors/Save',
                type: 'post',
                data: obj,
                show_success_msg: true,
                success_msg: '保存成功'
            })
        })

        // 选择tab
        $('#menu-level1-tab').on('click', 'li', function () {
            var tabId = $(this).attr('tabId');
            $('#menu-level1-tab li').removeClass('active');
            $(this).addClass('active');

            $('#auth-panel .tab-sub-panel').hide();
            $('#auth-panel .tab-sub-panel[tabId=' + tabId + ']').show();

            if (window.top.G) {
                window.top.G.RefreshHeight();
            }
        })

        // 选择节点
        $('#auth-list').on('change', 'input', function (e) {
            var nodeId = $(this).attr('nodeId');
            var node = _.find(that.all_nodes, 'nodeId', nodeId);

            if (node) {
                node.changeCheckState();
            }
        })

        this.prepare_window_selector();
    },

    query: function (roleId) {
        var that = this;
        var data = { RoleId: roleId };

        $.ajax({
            url: '/api/ManageRoleauthors/GetPage',
            type: 'get',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (!data || typeof data.Total == "undefined") {
                    console.log('在调用接口GetMeterBaseSource时发生错误，返回数据如下');
                    console.log(data);
                    return;
                }

                if (that.menu_tree == null) {
                    $.ajax({
                        url: '/api/ManageMenu/GetTree',
                        type: 'get',
                        dataType: 'json',
                        success: function (data2) {
                            if (!data2 || typeof data2.Total == "undefined") {
                                console.log('在调用接口api/ManageMenu/GetTree时发生错误，返回数据如下');
                                console.log(data2);
                                return;
                            }

                            that.menu_tree = data2.Models;
                            that.show_auths(that.menu_tree, data.Models);
                        }
                    });
                }
                else {
                    that.show_auths(that.menu_tree, data.Models);
                }


            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    },

    all_nodes: [],

    horizontally_group_count: 4,

    show_auths: function (tree, auths) {
        var that = this;

        // 先清空之前的
        $("li.group").children().remove();

        var list = this.translate(tree, auths);
        var root = list[0];
        this.all_nodes = list;

        for (var i in root.children) {
            var nodeLevel1 = root.children[i];
            var li = $("<li></li>");
            var sub = $("<ul class='tab-sub-panel horizontally-grouped'></ul>");
            li.attr('tabId', nodeLevel1.nodeId);
            sub.attr('tabId', nodeLevel1.nodeId);

            var span = $("<span></span>");
            span.html(nodeLevel1.nodeName);
            li.append(span);

            var innerLiArr = [];
            for (var j = 0; j < that.horizontally_group_count; j++) {
                var innerLi = $("<li class='group'></li>");
                sub.append(innerLi);
                innerLiArr.push(innerLi);
            }

            for (var j in nodeLevel1.children) {
                var nodeLevel2 = nodeLevel1.children[j];

                var k = j % that.horizontally_group_count;

                nodeLevel2.draw(innerLiArr[k], 2);
            }           

            if (i == 0) {
                li.addClass('active');
                sub.addClass('active');
            }
            $('#menu-level1-tab').append(li);
            $('#auth-panel').append(sub);
        }

        /*
        <ul class="horizontally-grouped" id="auth-list">
                <li class="group"></li>
                <li class="group"></li>
                <li class="group"></li>
                <li class="group"></li>
                <li class="group"></li>
            </ul>
        */


        // groups数组表示页面划分的每一列
        // 每个group维护以下字段
        // trees：改group中的所有树
        // height：虚拟的高度值，描述每个树当前高度
        // el：group的jquery元素
        //var groups = [];

        //$('.horizontally-grouped li').each(function () {            
        //    groups.push({
        //        trees: [],
        //        height: 0,
        //        el: $(this)
        //    })
        //})



        //for (var i in root.children) {            

        //    // level=1的节点，业务上对应一级菜单，要画成一棵树
        //    var tree = root.children[i];

        //    // 找到当前数据最少的分组，把这棵树画在这个分组里
        //    var g = _.min(groups, 'height');

        //    // 计算树的高度
        //    var treeHeight = tree.getDescendant().length + 1;

        //    g.height += treeHeight;

        //    tree.draw(g.el, 1);
        //}

        // 调整iframe高度
        if (window.top.G) {
            window.top.G.RefreshHeight();
        }

        // 更新选中情况
        root.updateCheckStateRecursive();
    },

    // 组成树结构
    translate: function (menu, auths) {
        var list = [];
        var copy_tree = _.cloneDeep(menu);

        var root = new Node();
        root.nodeId = 'root';
        root.nodeName = 'root';
        root.level = 0;
        list.push(root);

        // 循环
        while (copy_tree.length > 0) {

            // 是否找到新的子节点
            var found = false;

            // 遍历在list中已存在的节点
            for (var i in list) {

                // parent是在list已经存在的节点
                var parent = list[i];

                // 寻找parent的子节点
                var child = _.find(copy_tree, 'ParentId', parent.nodeId);

                // 如果找到了子节点
                if (child) {

                    // 在copy_tree删除子节点
                    _.remove(copy_tree, child);

                    var node = new Node();
                    node.nodeId = child.MenuId;
                    node.nodeName = child.MenuName;

                    // 在list中添加子节点
                    list.push(node);

                    // 在parent中添加节点
                    parent.append(node);

                    // 记录已经找到子节点了
                    found = true;

                    // 退出for循环
                    break;
                }
            }

            // 如果找到了，继续找
            if (found) {
                continue;
            }

            // 再也找不到新的子节点，退出while
            break;
        }



        for (var i in auths) {
            var auth = auths[i];

            // 遍历在list中的节点
            for (var j in list) {

                // parent是在list中的节点
                var parent = list[j];

                // 寻找子节点
                if (auth.MenuId == parent.nodeId && parent.level == 3) {
                    var node = new Node();
                    node.nodeId = 'auth' + auth.MenufeatureId;
                    node.nodeName = auth.FeatureAlias;
                    node.businessId = auth.MenufeatureId;
                    node.checked = auth.Active;

                    parent.append(node);
                    list.push(node);

                    break;
                }
            }
        }

        return list;
    },

    all_roles: [],
    prepare_window_selector: function () {
        var that = this;

        $('#choice-role').click(function () {

            if (that.all_roles.length == 0) {
                return;
            }

            that.open_window();
        })

        $('#window-save').click(function () {
            var id = $("#rolelist li.active").attr('RoleId');
            var name = $("#rolelist li.active").attr('RoleName');
            if (!id) {
                Util.alert('请选择一个角色');
                return;
            }
            that.select_role(id, name);
        })

        $('#window-close').click(function () {
            that.close_window();
        });
        $('#window-cancel').click(function () {
            that.close_window();
        })

        $.ajax({
            url: '/api/ManageRoleauthors/Init',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || typeof data.Total == "undefined") {
                    console.log('在调用接口GetMeterBaseSource时发生错误，返回数据如下');
                    console.log(data);
                    return;
                }

                var list = data.Models;
                that.all_roles = list;

                if (list.length == 0) {
                    $('#RoleName').html('没有角色可供选择');
                    return;
                }

                that.current_RoleId = list[0].RoleId;
                $('#RoleName').val(list[0].RoleName);
                that.query(list[0].RoleId);

                var ul = $("#rolelist");

                for (var i in data.Models) {
                    var item = data.Models[i];

                    var li = $("<li>");
                    li.append(item.RoleName);
                    li.attr('RoleId', item.RoleId);
                    li.attr('RoleName', item.RoleName);

                    if (item.RoleId == that.current_RoleId) {
                        li.addClass('active');
                    }

                    ul.append(li);
                }

                $("#rolelist li").click(function () {
                    $("#rolelist li").removeClass('active');
                    $(this).addClass('active');
                })

                $("#rolelist li").dblclick(function () {
                    var RoleId = $(this).attr('RoleId');
                    var RoleName = $(this).attr('RoleName');
                    that.select_role(RoleId, RoleName);
                })
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    },

    open_window: function () {
        var that = this;
        $('.window').fadeIn(200);

        var clearSlct = "getSelection" in window
        ? function () {
            window.getSelection().removeAllRanges();
        } : function () {
            document.selection.empty();
        };
        clearSlct();
    },

    close_window: function () {
        $('.window').hide();
    },

    select_role: function (id, name) {
        $('#RoleName').val(name);
        this.close_window();

        this.query(id);
    },
};




function Node() {

    // 元素Id，节点的唯一标识，用于寻找上下级
    this.nodeId;

    // 业务Id，最终提交时，会所有选中的元素的businessId
    this.businessId;

    // 元素名字
    this.nodeName;

    // div元素，里面存放checkbox和节点名称
    this.span;

    this.checkbox;

    // ul元素，里面存放子元素
    this.ul;

    // 对parent节点的引用
    this.parent;

    // 层级
    this.level;

    // 所有孩子节点
    this.children = [];

    // 是否选中
    this.checked = false;

    // 获得所有后代
    this.getDescendant = function () {

        var list = [];

        for (var i in this.children) {
            list.push(this.children[i]);
        }

        for (var i in this.children) {
            var sub = this.children[i].getDescendant();
            for (var j in sub) {
                list.push(sub[j]);
            }
        }

        return list;
    }

    // 添加子节点
    this.append = function (child) {
        child.level = this.level + 1;
        child.parent = this;
        this.children.push(child);
    }

    // 递归更新选中状态
    this.updateCheckStateRecursive = function () {
        var that = this;
        for (var i in this.children) {
            that.children[i].updateCheckStateRecursive();
        }

        if (that.children.length > 0) {
            var allChildrenChecked = _.all(that.children, 'checked')
            if (that.checked != allChildrenChecked) {
                that.checked = allChildrenChecked;
                that.checkbox.prop('checked', allChildrenChecked);

                if (that.parent) {
                    that.parent.updateCheckStateRecursive();
                }
            }
        }
    }

    // 递归更新选中状态-->仅向上递归
    this.updateCheckStateRecursiveUp = function () {
        var that = this;

        if (that.children.length > 0) {
            var allChildrenChecked = _.all(that.children, 'checked')
            if (that.checked != allChildrenChecked) {
                that.checked = allChildrenChecked;
                that.checkbox.prop('checked', allChildrenChecked);
            }
        }

        if (that.parent) {
            that.parent.updateCheckStateRecursiveUp();
        }
    }

    // 修改选中状态
    this.changeCheckState = function () {

        var that = this;
        var currentState = that.checked;
        var newState = !currentState;

        var descendants = that.getDescendant();
        for (var i in descendants) {
            descendants[i].setCheckState(newState);
        }

        that.setCheckState(newState);
        that.updateCheckStateRecursiveUp();
    }

    this.setCheckState = function (state) {
        this.checked = state;
        this.checkbox.prop('checked', state);
    }

    // 绘制当前节点
    // container：容器（
    // rootLevel：层级=rootLevel的节点放在容器里，其他节点放在父节点的ul中
    this.draw = function (container, rootLevel) {
        var that = this;

        // 画一个div
        var div = $("<div></div>");

        // 为div设置class和属性
        div.addClass('level' + that.level);
        div.attr('level', that.level);
        div.attr('nodeId', that.nodeId);

        // 画checkbox
        var checkbox = $("<input type='checkbox'>");
        checkbox.attr('nodeId', that.nodeId);

        // 在div中添加复选框，以及节点名字
        div.append(checkbox);
        div.append(that.nodeName);

        // 设置checkbox的选中状态
        if (that.checked) {
            $(checkbox).prop('checked', true);
        }

        // 画一个ul
        var ul = $("<ul></ul>");

        if (that.level <= rootLevel) {
            // 画在container容器中
            $(container).append(div);
            $(container).append(ul);

        } else {

            var li = $("<li></li>");
            li.append(div);
            li.append(ul);

            // 放在父节点的ul里
            that.parent.ul.append(li);

        }

        // 保存元素的索引
        that.div = div;
        that.ul = ul;
        that.checkbox = checkbox;

        // 绘制子节点
        for (var i in that.children) {
            that.children[i].draw(container);
        }
    }
}