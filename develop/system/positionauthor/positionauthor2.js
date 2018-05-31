var pp = {
    alreadyDraw: false,
    getLevel2status: function (dd0, dd) {
        var _temp = [];

        //遍历并合并active属性
        for (var i = 0; i < dd.Models.length; i++) {
            var __temp = null;
            if (dd.Models[i].ModelBaseLevel == 2) {
                __temp = dd.Models[i];
                for (var j = 0; j < dd0.Models.length; j++) {
                    if (dd0.Models[j].ModelbaseId == __temp.ModelBaseId) {
                        __temp.checked = dd0.Models[j].Active;
                        break;
                    }
                }
                _temp.push(__temp)
            }
        }
        return _temp;
    },
    data2: null
};
var Page = {
    //current_PositionId: '',
    current_Level2: [],
    current_PositionId: 0,
    current_ModelBaseId: 'root',

    init: function () {
        var that = this;

        $("#query").click(function () {
            that.query(that.current_PositionId);
        })

        // 全选
        $('#button-select-all').click(function () {
            var allChecked = _.all(that.all_nodes, 'checked');

            for (var i = 0; i < that.all_nodes.length; i++) {
                var node = that.all_nodes[i];
                node.setCheckState(!allChecked);
            }
        })

        // 保存
        $('#submit-edit').click(function () {
            var obj = {};
            obj.PositionId = that.current_PositionId;

            var menufeatureIds = [];

            for (var i = 0; i < that.all_nodes.length; i++) {
                var node = that.all_nodes[i];
                if (node.checked && node.nodeId) {
                    menufeatureIds.push(node.nodeId);
                }
            }

            obj.ModelbaseIds = menufeatureIds.toString();

            Util.ajax({
                url: '/api/ManagePositionauthors/Add',
                type: 'post',
                data: obj,
                show_success_msg: true,
                success_msg: '保存成功'
            })
        })

        // 选择tab
        //$('#menu-level1-tab').on('mouseover', 'li', function () {
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
        $('#auth-panel').on('click', 'cite', function (e) {
            var nodeId = $(this).attr('nodeId');
            var node = _.find(that.all_nodes, 'nodeId', nodeId);

            if (node) {
                node.changeCheckState();
            }
        })

        this.prepare_window_selector();
    },

    query: function (PositionId) {
        var that = this;
        var data = {
            ModelbaseId: that.current_ModelBaseId,
            PositionId: that.current_PositionId, ofs: 0, ps: 8, sort_column: '', sort_desc: false
        };

        $.ajax({
            url: '/api/ManagePositionauthors/GetPage',
            type: 'get',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (!data || typeof data.Total == "undefined") {
                    //console.log('在调用接口GetMeterBaseSource时发生错误，返回数据如下');
                    //console.log(data);
                    return;
                }

                if (that.menu_tree == null) {
                    $.ajax({
                        url: '/api/FactoryModelbase/GetTree',
                        type: 'get',

                        dataType: 'json',
                        success: function (data2) {
                            if (!data2 || typeof data2.Total == "undefined") {
                                //console.log('在调用接口api/ManageMenu/GetTree时发生错误，返回数据如下');
                                //console.log(data2);
                                return;
                            }
                            //console.log(data,data2)
                            pp.data2 = data2;
                            that.current_Level2 = pp.getLevel2status(data, data2);

                            that.menu_tree = data2.Models;
                            that.show_auths(that.menu_tree, data.Models);
                        }
                    });
                }
                else {
                    that.current_Level2 = pp.getLevel2status(data, pp.data2);
                    that.show_auths(that.menu_tree, data.Models);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                Util.alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    },

    all_nodes: [],

    horizontally_group_count: 3,

    show_auths: function (tree, auths) {
        var that = this;

        // 先清空之前的
        $("#menu-level1-tab li").remove();
        $("#auth-panel .tab-sub-panel").remove();

        var list = this.translate(tree, auths);

        var root = list[1];
        this.all_nodes = list;
        //console.log(list)
        for (var i = 0; i < root.children.length; i++) {
            // 一级菜单的每个节点
            var nodeLevel1 = root.children[i];

            //console.log(nodeLevel1)
            // li是tab标签
            var li = $("<li></li>");

            // sub是tab的body
            var sub = $("<ul class='tab-sub-panel horizontally-grouped'></ul>");

            // 在li和sub中维护tabId
            li.attr('tabId', nodeLevel1.nodeId);
            sub.attr('tabId', nodeLevel1.nodeId);

            // cite保存tab标签里的选择框
            //var cite = $("<cite></cite>");
            //li.append(cite);

            // span是标签名字
            var span = $("<span></span>");
            span.html(nodeLevel1.nodeName);
            li.append(span);

            // innerLiArr维护sub里面分的三列
            var innerLiArr = [];
            for (var j = 0; j < that.horizontally_group_count; j++) {
                // innerLi是sub的一列
                var innerLi = $("<li class='group'></li>");

                // 在sub中添加innerLi
                sub.append(innerLi);

                // 在innerLiArr中添加项
                innerLiArr.push(innerLi);
            }

            // 遍历一级菜单中的每个二级菜单
            for (var j = 0; j < nodeLevel1.children.length; j++) {
                // 二级菜单节点
                var nodeLevel2 = nodeLevel1.children[j];

                // 计算放在哪个innerLi中
                var k = j % that.horizontally_group_count;

                // 创建一个panel，用于存放tree
                var panel = $("<div class='tree-panel'></div>");

                // 把这个panel加到innerLi中
                innerLiArr[k].append(panel);

                // 绘制tree
                nodeLevel2.draw(panel, 3);
            }

            //如果没有子节点就画自己
            // 遍历
            for (var j = 0; j < root.children.length; j++) {
                if (!nodeLevel1.children.length && !pp.alreadyDraw) {
                    // 二级菜单节点
                    var nodeLevel22 = nodeLevel1;

                    //判断是否已改变状态
                    for (var ii = 0; ii < that.current_Level2.length; ii++) {
                        if (nodeLevel22.nodeId == that.current_Level2[ii].ModelBaseId) {
                            nodeLevel22.checked = that.current_Level2[ii].checked
                        }
                    }
                    //console.log(nodeLevel22)
                    //console.log(that.current_Level2)
                    // 计算放在哪个innerLi中
                    var k = j % that.horizontally_group_count;

                    // 创建一个panel，用于存放tree
                    var panel = $("<div class='tree-panel'></div>");

                    // 把这个panel加到innerLi中
                    innerLiArr[k].append(panel);

                    // 绘制tree
                    nodeLevel22.draw(panel, 2);
                }
                pp.alreadyDraw = true;                                                 //zbc
            }
            pp.alreadyDraw = false;                                                 //zbc
            // 默认选中第一个tab
            if (i == 0) {
                li.addClass('active');
                sub.addClass('active');
            }

            // 把tab的li和sub加到页面中
            $('#menu-level1-tab').append(li);
            $('#auth-panel').append(sub);
        }

        // 调整iframe高度
        if (window.top.G) {
            window.top.G.RefreshHeight();
        }

        // 更新选中情况
        root.updateCheckStateRecursive();
    },

    // 组成树结构(返回一个list数组，前一堆项是将menu改为树结构数据，后一堆项提出了所有Level==3的)
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
            for (var i = 0; i < list.length; i++) {
                // parent是在list已经存在的节点
                var parent = list[i];

                // 寻找parent的子节点
                var child = _.find(copy_tree, 'ParentId', parent.nodeId);

                // 如果找到了子节点
                if (child) {
                    // 在copy_tree删除子节点
                    _.remove(copy_tree, child);

                    var node = new Node();
                    node.nodeId = child.ModelBaseId;
                    node.nodeName = child.ModelBaseName;

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
        //console.log(list)
        //**************************************GetTree内容已被改写为树形结构,从小到大的顺序

        //for (var i = 0; i < auths.length; i++) {
        //    var auth = auths[i];

        //    // 遍历在list中的节点
        //    for (var j = 0; j < list.length; j++) {
        //        // parent是在list中的节点
        //        var parent = list[j];

        //        // 寻找子节点
        //        if (auth.ModelbaseId == parent.nodeId && parent.level == 3) {
        //            parent.checked = auth.Active;
        //            var node = new Node();
        //            node.nodeId = 'auth' + auth.ModelbaseId;
        //            node.nodeName = auth.ModelbaseName;
        //            //node.businessId = auth.MenufeatureId;
        //            node.checked = auth.Active;

        //            parent.append(node);
        //            break;
        //        }
        //    }
        //}

        for (var i = 0; i < auths.length; i++) {
            var auth = auths[i];

            // 遍历在list中的节点
            for (var j = 0; j < list.length; j++) {
                // parent是在list中的节点
                var parent = list[j];

                // 寻找子节点
                if (auth.ModelbaseId == parent.nodeId && parent.level == 4) {
                    parent.checked = auth.Active;

                    break;
                }
            }
        }

        for (var i = 0; i < auths.length; i++) {
            var auth = auths[i];

            // 遍历在list中的节点
            for (var j = 0; j < list.length; j++) {
                // parent是在list中的节点
                var parent = list[j];

                // 寻找子节点
                if (auth.ModelbaseId == parent.nodeId && parent.level == 5) {
                    parent.checked = auth.Active;

                    break;
                }
            }
        }

        for (var i = 0; i < auths.length; i++) {
            var auth = auths[i];

            // 遍历在list中的节点
            for (var j = 0; j < list.length; j++) {
                // parent是在list中的节点
                var parent = list[j];

                // 寻找子节点
                if (auth.ModelbaseId == parent.nodeId && parent.level == 6) {
                    parent.checked = auth.Active;

                    break;
                }
            }
        }
        //console.log(list)

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
            var id = $("#rolelist li.active").attr('positionid');
            var name = $("#rolelist li.active").attr('positionname');
            if (!id) {
                Util.alert('请选择一个角色');
                return;
            }
            //console.log(id)
            that.select_role(id, name);
        })

        $('#window-close').click(function () {
            that.close_window();
        });
        $('#window-cancel').click(function () {
            that.close_window();
        })

        $.ajax({
            url: '/api/ManagePositionauthors/Init',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data || typeof data.Total == "undefined") {
                    //console.log('在调用接口ManagePositionauthors时发生错误，返回数据如下');
                    //console.log(data);
                    return;
                }

                var list = data.Models;
                that.all_roles = list;

                if (list.length == 0) {
                    $('#PositionName').html('没有角色可供选择');
                    return;
                }

                that.current_PositionId = list[0].PositionId;
                $('#PositionName').val(list[0].PositionName);
                that.query(list[0].PositionId);

                var ul = $("#rolelist");

                for (var i = 0; i < data.Models.length; i++) {
                    var item = data.Models[i];

                    var li = $("<li>");
                    li.append(item.PositionName);
                    li.attr('PositionId', item.PositionId);
                    li.attr('PositionName', item.PositionName);

                    if (item.PositionId == that.current_PositionId) {
                        li.addClass('active');
                    }

                    ul.append(li);
                }

                $("#rolelist li").click(function () {
                    $("#rolelist li").removeClass('active');
                    $(this).addClass('active');
                })

                $("#rolelist li").dblclick(function () {
                    var PositionId = $(this).attr('PositionId');
                    var PositionName = $(this).attr('PositionName');
                    that.select_role(PositionId, PositionName);
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
        $('#PositionName').val(name);
        this.close_window();
        this.current_PositionId = id;
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

        for (var i = 0; i < this.children.length; i++) {
            list.push(this.children[i]);
        }

        for (var i = 0; i < this.children.length; i++) {
            var sub = this.children[i].getDescendant();
            for (var j = 0; j < sub.length; j++) {
                list.push(sub[j]);
            }
        }

        return list;
    }

    if (this.level == 3) {
        _.remove(this, this.children[this.children.length - 1])
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
        for (var i = 0; i < this.children.length; i++) {
            that.children[i].updateCheckStateRecursive();
        }

        if (that.children.length > 0) {
            var allChildrenChecked = _.all(that.children, 'checked')
            if (that.checked != allChildrenChecked) {
                that.setCheckState(allChildrenChecked);

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
                that.setCheckState(allChildrenChecked);
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
        for (var i = 0 ; i < descendants.length; i++) {
            descendants[i].setCheckState(newState);
        }

        that.setCheckState(newState);
        that.updateCheckStateRecursiveUp();
    }

    this.setCheckState = function (state) {
        this.checked = state;

        if (this.checkbox) {
            if (state) {
                this.checkbox.addClass('active');
            } else {
                this.checkbox.removeClass('active');
            }
        }
    }

    // 绘制当前节点
    // container：容器（
    // rootLevel：层级=rootLevel的节点放在容器里，其他节点放在父节点的ul中
    this.draw = function (container, rootLevel) {
        var that = this;

        // 画一个div
        var div = $("<div class='node'></div>");

        // 为div设置class和属性
        div.addClass('level' + that.level);
        div.attr('level', that.level);
        div.attr('nodeId', that.nodeId);

        // 首元素标识
        //if (that.parent && that.nodeId == that.parent.children[0].nodeId) {
        //    div.addClass('first');
        //}

        //控制显示两列
        //kk=[];
        //for (i = 0; i < 999; i++) {
        //    if (i % 2 == 0) {
        //        kk.push(i)
        //    }
        //}

        //for (i = 0; i < kk.length; i++) {
        //    if (that.parent && that.parent.children[kk[i]] && that.nodeId == that.parent.children[kk[i]].nodeId) {
        //        div.addClass('elements-for-4level');

        //    }

        //}
        //if (that.level == 4 && that.children.length!=0) {
        //    div.addClass('clrboth');
        //}

        // 画checkbox
        var checkbox = $("<cite></cite>");
        checkbox.attr('nodeId', that.nodeId);

        // 在div中添加复选框，以及节点名字
        div.append(checkbox);
        div.append(that.nodeName);

        // 设置checkbox的选中状态
        if (that.checked) {
            checkbox.addClass('active');
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
        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw(container);
        }
    }
}