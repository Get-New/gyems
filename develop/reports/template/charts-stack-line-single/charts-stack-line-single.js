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

$(function () {
    tp.init();

    tp.bindDrawMethod(function () {
        draw();
    })

    //tp.bindCvsData(demoHelper.cvs());
    tp.bindCvsData(get_cvs_by_location());
    draw();
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
}

//根据window.location中的ConfigID获取单元数据
function get_cvs_by_location() {
    var temp_location = window.name ? parent.document.getElementsByName(window.name)[0].src : window.location.search;//window.location.search.replace('?', ''); //获得window.location内容
    var Config_ID = temp_location.split('ConfigID:')[1] ? temp_location.split('ConfigID:')[1].split('?')[0] : null; //获得ConfigID值
    var temp_models = null;

    if (Config_ID) {
        $.ajax({
            url: '/api/ReportSubConfig/GetPage',
            method: 'get',
            dataType: 'json',
            async: false,
            data: { ConfigID: Config_ID, SubConfigCellName: '' },
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
        var temp_models_length = temp_models.length;
        for (var i = 0; i < temp_models_length; i++) {
            var temp_obj = { itemId: '', itemName: '' };
            temp_obj.itemId = temp_models[i].SubConfigID;
            temp_obj.itemName = temp_models[i].SubConfigCellName;
            temp_cvs.push(temp_obj);
        }
        return temp_cvs;
    }
    else {
        var temp_cvs = [{ itemId: '', itemName: '查询结果为空' }];
        return temp_cvs;
    }
}

//按月查询 折线数据
function get_line_data_by_month(ids, year) {
    var temp_data = null;
    $.ajax({
        url: '/api/CommonStackUnit/GetLineDataByMonth',
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
        url: '/api/CommonStackUnit/GetLineDataByDay',
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
        url: '/api/CommonStackUnit/GetStackDataByMonth',
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
        url: '/api/CommonStackUnit/GetStackDataByDay',
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