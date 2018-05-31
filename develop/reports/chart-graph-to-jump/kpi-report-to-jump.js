var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = false;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 0;

    // 默认时间类型（可选year、month、day）
    ret.defaultDateType = 'month';

    // 图表(可能有多个)
    ret.charts = [{
        // 容器的id
        containerId: 'chart1',
    }];

    return ret;
})();

var tree_about = {
    my_tree: null,

    current_tree_select_id: null,

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
            that.my_tree.reset(function (id) {
                that.tree_node_click(id);
            });
        });
    },

    tree_node_click: function (id) {
        this.current_tree_select_id = id;
        draw();
    }
}

$(function () {
    //树相关
    tree_about.tree_init();

    tp.init();

    tp.bindDrawMethod(function () {
        draw(function () {
        });
    });

    while (!tp.isReady()) {
    }

    //draw();

    //showBack();
})

function showBack() {
    var temp_location = window.location.search;
    var isBack = temp_location.split('isBack:')[1] ? temp_location.split('isBack:')[1].split(';')[0] : null;

    if (isBack == 'true') {
        $('#goback').show();
        $("#goback").click(function () {
            window.history.go(-1);
        })
    }
}

function draw() {
    if (tp.isReady() == false) {
        return;
    }

    var type = dst.getCurrType(); //存放周期类型
    var year = dst.getCurrYear() || 0;
    var month = dst.getCurrMonth() || 0;
    var day = dst.getCurrDay() || 0;
    var tmpModelBaseID = tree_about.current_tree_select_id;

    data = null;

    if (type == 'day') {
        data = get_kpi_report(tmpModelBaseID, 'Day', year, month, day);
    }
    else if (type == 'month') {
        data = get_kpi_report(tmpModelBaseID, 'Month', year, month, day);
    }
    else if (type == 'year') {
        data = get_kpi_report(tmpModelBaseID, 'Year', year, month, day);
    }
    else {
        return;
    }

    if (!data) {
        data = null;
        //data = tmp_mock_data;
        $('#table_container table').empty();
        Util.alert('查询结果为空');
        return;
    }

    //创建表格
    if (data[0]) {
        create_table(data[0]);
    }
    else {
        $('#table_container table').empty();
    }
}

//查询数据
function get_kpi_report(ModelBaseID, Cycle, Year, Month, Day) {
    var temp_data = null;
    $.ajax({
        url: '/api/OverView/GetKPIReport',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { ModelBaseID: ModelBaseID, Cycle: Cycle, Year: Year, Month: Month, Day: Day },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//创建表格
function create_table(tableData) {
    $('#table_container table').empty();

    if (!tableData.Rows) {
        return;
    }

    var head = [];

    var tmpHeadFirst = $("<tr></tr>");
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>序号</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>部门</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>项目</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>能源基准/考核</th>"));
    tmpHeadFirst.append($("<th rowspan='1' colspan='1'>目标指标/实际</th>"));

    head.push(tmpHeadFirst);
    var tmpTableCount = 1;
    while (tmpTableCount <= tableData.Rows) {
        var tmpHeadCommon = $("<tr></tr>");
        for (var i = 0; i < 5; i++) {
            tmpHeadCommon.append($("<td rowspan='1' colspan='1'></td>"));
        }
        head.push(tmpHeadCommon)
        tmpTableCount++;
    }

    $('#table_container table').append(head);

    if (tableData.Data) {
        var dataCount = 0;
        $("td").each(function () {
            $(this).html(tableData.Data[dataCount++]);
        })
    }
}