var excel_ids = '';//存放所有的id 用于excel导出时进行数据查询
var jumpModelBaseID = '';//存放url传参

var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = true;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 1;

    // 默认时间类型（可选year、month、day）
    ret.defaultDateType = 'month';

    // 图表(可能有多个)
    ret.charts = [{
        // 容器的id
        containerId: 'chart1',
    }, {
        // 容器的id
        containerId: 'chart2',
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
            //that.tree_node_click(id);
            that.tree_node_click(jumpModelBaseID);
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
        $('#ParentId').val(id);

        $('.cvs li').remove();

        cvs.selectedList = []; //清空历史已选项

        tp.bindDrawMethod(function () {
            draw();
        })

        cvs.allList = []; //清空历史cvs数据

        tp.bindCvsData(get_cvs_by_location());

        draw();
    }
}

$(function () {
    tp.init();

    get_location_info();//获取location_info

    //树相关
    tree_about.tree_init();

    //导出excel按钮
    $('#export').click(function () {
        if (!excel_ids) {
            Util.alert("没有数据可供导出");
            return false;
        }
        get_excel();
    });

    //tp.bindDrawMethod(function () {
    //    draw();
    //})

    //tp.bindCvsData(demoHelper.cvs());
    //tp.bindCvsData(get_cvs_by_location());
    //draw();
})

function draw() {
    if (tp.isReady() == false)
        return;

    var type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();
    var day = dst.getCurrDay();

    var cvsList = cvs.selectedList;

    //获取id数据
    var temp_ids = '';
    var temp_cvs_length = cvsList.length;
    for (var i = 0; i < temp_cvs_length; i++) {
        temp_ids += ',' + cvsList[i].id;
    }
    temp_ids = temp_ids.substr(1);

    var data_line = null;
    var data_stack = null;

    if (type == 'month') {
        data_line = get_line_data_by_day(temp_ids, year, month);
        data_stack = get_stack_data_by_day(temp_ids, year, month);
    }
    else if (type == 'year') {
        data_line = get_line_data_by_month(temp_ids, year);
        data_stack = get_stack_data_by_month(temp_ids, year);
    }
    else {
        //console.log('error:get_xx_data_by_xx()');
    }

    if (data_stack) {
        stackchart.draw(options.charts[0], data_stack);
        //console.log(tp.echartsInstances.chart1)

        stackchart.click(options.charts[0], function (pms) {
            //alert('您点击了' + pms.seriesName + '上的节点，x轴为' + pms.name + '，y轴为' + pms.data);
            //console.log("pms:");
            //console.log(pms);
        })
    }

    if (data_line) {
        linechart.draw(options.charts[1], data_line);
        linechart.click(options.charts[1], function (pms) {
            //alert('您点击了' + pms.seriesName + '上的节点，x轴为' + pms.name + '，y轴为' + pms.data);
            //console.log("pms:");
            //console.log(pms);
        })
    }

    if (!data_stack) {
        tp.echartsInstances.chart1.clear();
    }

    if (!data_line) {
        tp.echartsInstances.chart2.clear();
    }
}

//执行Excel获取操作
function get_excel() {
    var excel_data = get_excel_data();
    var filename = "导出Excel";
    if (!excel_data) {
        Util.alert("Excel数据查询为空");
        return false;
    }

    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "_blank");
    form.attr("method", "post");
    form.attr("action", '/api/ExcelOut/GetExcel');
    $("body").append(form);

    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "filename");
    input1.attr("value", filename);//命名Excel

    var input2 = $("<input>");
    input2.attr("type", "hidden");
    input2.attr("name", "datatype");
    input2.attr("value", "data");//传参类型

    var input3 = $("<input>");
    input3.attr("type", "hidden");
    input3.attr("name", "body");
    input3.attr("value", excel_data);//Excel数据

    form.append(input1);
    form.append(input2);
    form.append(input3);

    form.submit();
    form.remove();
}

//获取Excel数据
function get_excel_data() {
    //获取时间参数
    var type = dst.getCurrType() || 0;
    var year = dst.getCurrYear() || 0;
    var month = dst.getCurrMonth() || 0;
    var day = dst.getCurrDay() || 0;

    var excel_param = {
        UnitId: excel_ids,
        Year: year,
        Month: month,
        Day: day,
        Cycle: ''
    };

    if (type == 'day') {
        excel_param.Cycle = 'Hour';
    }
    else if (type == 'month') {
        excel_param.Cycle = 'Day';
    }
    else if (type == 'year') {
        excel_param.Cycle = 'Month';
    }
    else if (type == 'history') {
        excel_param.Cycle = 'Year';
    }
    else {
        //console.log('error:get_line_data_by_xx()');
        return;
    }

    var temp_excel_data = null;

    if (true) {
        $.ajax({
            url: '/api/CommonStackUnit/GetExcelData',
            method: 'get',
            dataType: 'json',
            async: false,
            data: excel_param,
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    temp_excel_data = data.Models[0]; //如果查询成功 则进行暂存操作
                }
            }
        });
    }
    return temp_excel_data;
}

//获取单元数据
function get_cvs_by_location() {
    var temp_models = null;

    //只请求非计划量 MeasurePropertyTypes: 8
    if (1) {
        $.ajax({
            url: '/api/EngeryMeasureProperty/GetProductUnit',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { ModelBaseID: tree_about.current_tree_select_id, MeasurePropertyTypes: 8, GetCurrentModelBase: true },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    temp_models = data.Models; //如果查询成功 则进行暂存操作
                }
            }
        });
    }

    //按照demoHelper.cvs()组织数据格式
    if (temp_models) {
        var temp_cvs = [];
        excel_ids = '';
        var temp_models_length = temp_models.length;
        for (var i = 0; i < temp_models_length; i++) {
            var temp_obj = { itemId: '', itemName: '' };
            temp_obj.itemId = temp_models[i].MeasurePropertyID;
            temp_obj.itemName = temp_models[i].MeasurePropertyName;
            temp_cvs.push(temp_obj);
            excel_ids += ("'" + temp_models[i].MeasurePropertyID + "',");
        }
        excel_ids += ("''");
        return temp_cvs;
    }
    else {
        var temp_cvs = [{ itemId: '', itemName: '查询结果为空' }];
        excel_ids = '';
        return temp_cvs;
    }
}

//按月查询 折线数据
function get_line_data_by_month(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonStackUnit/GetNewLineDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//按日查询 折线数据
function get_line_data_by_day(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonStackUnit/GetNewLineDataByDay',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//按月查询 堆叠图数据
function get_stack_data_by_month(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonStackUnit/GetNewStackDataByMonth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//按日查询 堆叠图数据
function get_stack_data_by_day(ids, year, month) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonStackUnit/GetNewStackDataByDay',
        method: 'get',
        dataType: 'json',
        async: false,
        data: { UnitId: ids, Year: year, Month: month },
        success: function (data) {
            if (!data.Models || !data.Models.length) {
                return;
            }
            else {
                temp_data = data.Models[0]; //如果查询成功 则返回Models
            }
        }
    });
    return temp_data;
}

//获取location_info
function get_location_info() {
    //约定url传参格式为 [ModelBaseID:1d214af5860ff10A27bc86aa,EnergyMediumID:1d22868d659ed3bA27bc86aa]
    //获得window.location内容
    var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;
    //获得值jumpMSG  [ModelBaseID:123456,EnergyMediumID:654321] ModelBaseID:123456,EnergyMediumID:654321
    var jumpMSG = temp_location.split('[')[1].split(']')[0];
    //获得值jumpModelBaseID  ModelBaseID:123456,EnergyMediumID:654321 ModelBaseID:123456 123456
    jumpModelBaseID = jumpMSG.split(',')[0].split('ModelBaseID:')[1];
}